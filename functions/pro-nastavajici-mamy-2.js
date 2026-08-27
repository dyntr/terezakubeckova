import { servePageWithMeta } from "./_shared/meta.js";

export async function onRequest(context) {
  return servePageWithMeta(context, {
    path: "/pro-nastavajici-mamy-2",
    title: "Vlastní bydlení s rostoucí rodinou v roce 2026/2027 | Tereza Kubečková",
    description:
      "Mateřská ve svém, během které nebudete muset nikdy sáhnout po levnějších plenách. Pro budoucí mámy s vlastní naspořenou rezervou 500 000 Kč a více.",
  });
}
