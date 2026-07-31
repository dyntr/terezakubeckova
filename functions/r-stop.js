import { servePageWithMeta } from "./_shared/meta.js";

export async function onRequest(context) {
  return servePageWithMeta(context, {
    path: "/r-stop",
    title: "R-STOP: Bezpečná splátka hypotéky na rodičovské zdarma | Tereza Kubečková",
    description:
      "Banka vám schválí hypotéku na dnešní dva platy. Zjistěte zdarma svůj R-STOP – bezpečnou splátku, kterou utáhnete i na rodičovské. Odpověď do 24 hodin.",
  });
}
