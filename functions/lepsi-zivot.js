import { servePageWithMeta } from "./_shared/meta.js";

export async function onRequest(context) {
  return servePageWithMeta(context, {
    path: "/lepsi-zivot",
    title: "Utáhnete hypotéku na mateřské? Nezávislý Druhý názor zdarma | Tereza Kubečková",
    description:
      "Čekáte miminko a řešíte hypotéku na jeden plat? Zjistěte zdarma, jestli to bezpečně utáhnete. Odpověď do 24 hodin.",
  });
}
