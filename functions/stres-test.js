import { servePageWithMeta } from "./_shared/meta.js";

export async function onRequest(context) {
  return servePageWithMeta(context, {
    path: "/stres-test",
    title: "Stres-Test R-STOP: Zjistěte bezpečnou splátku hypotéky | Tereza Kubečková",
    description:
      "Banka spočítala vaše maximum, ne vaše bezpečí. Zjistěte zdarma svůj R-STOP – rodičovský strop bezpečné splátky – během 15minutového diagnostického hovoru.",
  });
}
