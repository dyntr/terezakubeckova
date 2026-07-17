// Cloudflare Pages Function – /api/reviews
// Tahá ŽIVÁ data z Google Places API (New) server-side (klíč zůstává skrytý),
// vrací jen 5★ recenze jako JSON a cachuje výsledek na 1 h, aby se šetřily
// dotazy na Google. Když nejsou nastavené env proměnné nebo Google selže,
// vrátí prázdno a frontend si ponechá ověřené (seed) recenze.
//
// Potřebné env proměnné na Cloudflare Pages projektu:
//   GOOGLE_PLACES_API_KEY  – klíč z Google Cloud (Places API New, billing ON)
//   GOOGLE_PLACE_ID        – place_id ve formátu "ChIJ…" (nebo "places/ChIJ…")
//   GOOGLE_PLACES_REFERER  – (volitelné) hodnota Referer hlavičky; klíč je
//                            omezený na HTTP referrer naší domény, takže při
//                            server-side volání z Cloudflare ji musíme poslat
//                            sami, jinak Google vrátí 403. Default = apex web.

// Klíč klientky je v Google Cloud omezený na referrer "terezakubeckova.cz/*"
// (apex, ne www). Server-side fetch nemá Referer → musíme ho nastavit ručně.
const DEFAULT_REFERER = "https://terezakubeckova.cz/";

export async function onRequest(context) {
  const { env, request } = context;
  const key = env.GOOGLE_PLACES_API_KEY;
  const placeId = env.GOOGLE_PLACE_ID;
  const referer = env.GOOGLE_PLACES_REFERER || DEFAULT_REFERER;

  const empty = (extra = {}) =>
    Response.json({ live: false, reviews: [], ...extra }, { status: 200 });

  if (!key || !placeId) return empty();

  // Cache (1 h)
  const cache = caches.default;
  const cacheKey = new Request(new URL(request.url).toString(), { method: "GET" });
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
    if (!r.ok) return empty({ error: r.status });

    const data = await r.json();
    const reviews = (data.reviews || [])
      .filter((rv) => (rv.rating || 0) >= 5) // jen 5★
      .map((rv) => ({
        author: rv.authorAttribution?.displayName || "Google uživatel",
        rating: rv.rating || 5,
        date: rv.publishTime || new Date().toISOString(),
        text: rv.text?.text || rv.originalText?.text || "",
      }))
      .filter((rv) => rv.text.trim().length > 0);

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
    return empty({ error: String(e) });
  }
}
