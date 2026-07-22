// Sdílená logika pro Pages Functions, které landing pages (kampaňové
// vstupní stránky) servírují s vlastním <title>/OG/canonical namísto
// generických tagů z index.html. Nutné proto, že jde o čistě
// klientsky renderovanou (CSR) SPA bez SSR/prerenderingu — cokoliv
// nastavené až v Reactu (document.title apod.) je pro crawlery, které
// JS nespouští (mj. Meta scraper pro link preview a ad review), pořád
// jen ten generický obsah z hlavičky index.html.
export async function servePageWithMeta(context, { title, description, path }) {
  const canonicalUrl = new URL(path, context.request.url).toString();
  const assetUrl = new URL("/index.html", context.request.url);
  const res = await context.env.ASSETS.fetch(assetUrl);

  return new HTMLRewriter()
    .on("title", {
      element(el) {
        el.setInnerContent(title);
      },
    })
    .on('meta[name="description"]', {
      element(el) {
        el.setAttribute("content", description);
      },
    })
    .on('meta[property="og:title"]', {
      element(el) {
        el.setAttribute("content", title);
      },
    })
    .on('meta[property="og:description"]', {
      element(el) {
        el.setAttribute("content", description);
      },
    })
    .on('meta[property="og:url"]', {
      element(el) {
        el.setAttribute("content", canonicalUrl);
      },
    })
    .on('meta[name="twitter:title"]', {
      element(el) {
        el.setAttribute("content", title);
      },
    })
    .on('meta[name="twitter:description"]', {
      element(el) {
        el.setAttribute("content", description);
      },
    })
    .on('link[rel="canonical"]', {
      element(el) {
        el.setAttribute("href", canonicalUrl);
      },
    })
    .transform(res);
}
