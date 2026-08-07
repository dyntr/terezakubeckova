import { servePageWithMeta } from "./_shared/meta.js";

export async function onRequest(context) {
  return servePageWithMeta(context, {
    path: "/lepsi-zivot-dekujeme",
    title: "Poptávka odeslána | Tereza Kubečková",
    description: "Vaše poptávka byla úspěšně odeslána. Ozveme se vám do 24 hodin.",
  });
}
