import { servePageWithMeta } from "./_shared/meta.js";

export async function onRequest(context) {
  return servePageWithMeta(context, {
    path: "/pro-nastavajici-mamy",
    title: "Máte našetřeno 500k+ a čekáte mimi? Vyřídíme hypotéku bezpečně | Tereza Kubečková",
    description:
      "Banka vám hypotéku schválí ze dvou platů. My ji vyřídíme s rezervou na rodičovskou. Pro budoucí mámy s vlastní naspořenou rezervou 500 000 Kč a více.",
  });
}
