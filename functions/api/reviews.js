// Cloudflare Pages Function – /api/reviews
// Tahá ŽIVÁ data z Google Places API (New) server-side (klíč zůstává skrytý)
// a AKUMULUJE je v KV (binding REVIEWS_KV): Google vrací vždy jen 5
// „nejrelevantnějších" recenzí bez možnosti řazení podle data, takže nové
// recenze v odpovědi klidně týdny chybí. Každou recenzi, kterou Google (nebo
// scraper, který zapisuje do KV stejným formátem) jednou ukáže, si proto
// pamatujeme navždy a vracíme sjednocení seřazené od nejnovější.
// Výsledek cachujeme 1 h, aby se šetřily dotazy na Google. Když nejsou
// nastavené env proměnné nebo Google selže, vrátí se recenze z KV; když není
// ani KV, vrátí se prázdno a frontend si ponechá ověřené (seed) recenze.
//
// Potřebné env proměnné / bindingy na Cloudflare Pages projektu:
//   GOOGLE_PLACES_API_KEY  – klíč z Google Cloud (Places API New, billing ON)
//   GOOGLE_PLACE_ID        – place_id ve formátu "ChIJ…" (nebo "places/ChIJ…")
//   GOOGLE_PLACES_REFERER  – (volitelné) hodnota Referer hlavičky; klíč je
//                            omezený na HTTP referrer naší domény, takže při
//                            server-side volání z Cloudflare ji musíme poslat
//                            sami, jinak Google vrátí 403. Default = apex web.
//   REVIEWS_KV             – KV namespace (terezakubeckova-reviews); klíč
//                            "reviews:all" = {"reviews":[…], "updatedAt":…}

// Klíč klientky je v Google Cloud omezený na referrer "terezakubeckova.cz/*"
// (apex, ne www). Server-side fetch nemá Referer → musíme ho nastavit ručně.
const DEFAULT_REFERER = "https://terezakubeckova.cz/";

const KV_KEY = "reviews:all";

// Jeden Google účet může mít na místě jen jednu recenzi → autor je stabilní
// deduplikační klíč napříč zdroji (API i scraper čtou jméno z téhož profilu).
const reviewKey = (rvw) => (rvw.author || "").trim().toLowerCase();

/**
 * Sjednotí uložené recenze (KV) s čerstvými z Places API. API verze má vždy
 * přednost (má přesné publishTime a aktuální text), scrapované/backfillované
 * záznamy drží autory, které API zrovna nevrací.
 */
export function mergeReviews(stored, incoming) {
  const map = new Map(stored.map((rvw) => [reviewKey(rvw), rvw]));
  for (const rvw of incoming) map.set(reviewKey(rvw), { ...rvw, src: "api" });
  return [...map.values()];
}

/** Payload pro web: jen 5★ s textem, od nejnovější, bez interních polí. */
export function presentReviews(list) {
  return list
    .filter((rvw) => (rvw.rating || 0) >= 5 && (rvw.text || "").trim().length > 0)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(({ src: _src, ...rvw }) => rvw);
}

async function readStored(env) {
  try {
    const data = await env.REVIEWS_KV?.get(KV_KEY, "json");
    return Array.isArray(data?.reviews) ? data.reviews : [];
  } catch {
    return [];
  }
}

export async function onRequest(context) {
  const { env, request } = context;
  const key = env.GOOGLE_PLACES_API_KEY;
  const placeId = env.GOOGLE_PLACE_ID;
  const referer = env.GOOGLE_PLACES_REFERER || DEFAULT_REFERER;

  const empty = (extra = {}) =>
    Response.json({ live: false, reviews: [], ...extra }, { status: 200 });

  // Google nedostupný / bez klíče → aspoň akumulované recenze z KV.
  const fromStored = async (extra = {}) => {
    const stored = presentReviews(await readStored(env));
    if (stored.length === 0) return empty(extra);
    return Response.json(
      { live: true, source: "kv", rating: null, count: stored.length, reviews: stored, ...extra },
      { status: 200, headers: { "Cache-Control": "public, max-age=3600" } },
    );
  };

  if (!key || !placeId) return fromStored();

  // Cache (1 h). Klíč je normalizovaný (bez query — jinak každý ?x=y obejde
  // cache a vyvolá další dotaz na Google) a verzovaný: při změně formátu
  // payloadu stačí zvednout rev a staré záznamy přirozeně vyprší (Cache API
  // objekty nejde spolehlivě purgnout přes zone purge).
  const cache = caches.default;
  const url = new URL(request.url);
  const cacheKey = new Request(`${url.origin}${url.pathname}?rev=2`, { method: "GET" });
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const id = placeId.startsWith("places/") ? placeId : `places/${placeId}`;
    const r = await fetch(
      `https://places.googleapis.com/v1/${id}?languageCode=cs&regionCode=CZ`,
      {
        headers: {
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask": "rating,userRatingCount,reviews",
          // Klíč je referrer-restricted → bez této hlavičky Google vrátí 403.
          Referer: referer,
        },
      },
    );
    if (!r.ok) return fromStored({ error: r.status });

    const data = await r.json();
    const incoming = (data.reviews || []).map((rvw) => ({
      author: rvw.authorAttribution?.displayName || "Google uživatel",
      rating: rvw.rating || 5,
      date: rvw.publishTime || new Date().toISOString(),
      text: rvw.text?.text || rvw.originalText?.text || "",
    }));

    const stored = await readStored(env);
    const merged = mergeReviews(stored, incoming);
    if (env.REVIEWS_KV && JSON.stringify(merged) !== JSON.stringify(stored)) {
      context.waitUntil(
        env.REVIEWS_KV.put(
          KV_KEY,
          JSON.stringify({ reviews: merged, updatedAt: new Date().toISOString() }),
        ),
      );
    }

    const reviews = presentReviews(merged);
    const resp = Response.json(
      {
        live: true,
        rating: data.rating ?? null,
        count: data.userRatingCount ?? reviews.length,
        reviews,
      },
      { status: 200, headers: { "Cache-Control": "public, max-age=3600" } },
    );
    context.waitUntil(cache.put(cacheKey, resp.clone()));
    return resp;
  } catch (e) {
    return fromStored({ error: String(e) });
  }
}
