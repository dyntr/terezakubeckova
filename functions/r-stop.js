import { servePageWithMeta } from "./_shared/meta.js";

export async function onRequest(context) {
  return servePageWithMeta(context, {
    path: "/r-stop",
    title: "R-STOP (DTI2): Bezpečná splátka hypotéky na rodičovské zdarma | Tereza Kubečková",
    description:
      "Hypotéku vám spočítají na dnešní dva platy. Zjistěte zdarma svůj R-STOP (DTI2) – bezpečnou splátku, kterou utáhnete i na rodičovské. Odpověď do 24 hodin.",
  });
}
