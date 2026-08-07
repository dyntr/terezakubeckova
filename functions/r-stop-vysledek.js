import { servePageWithMeta } from "./_shared/meta.js";

export async function onRequest(context) {
  return servePageWithMeta(context, {
    path: "/r-stop-vysledek",
    title: "Váš R-STOP (DTI2) | Tereza Kubečková",
    description: "Vaše poptávka byla úspěšně odeslána. Ozveme se vám do 24 hodin.",
  });
}
