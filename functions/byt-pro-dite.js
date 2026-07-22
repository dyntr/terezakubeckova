import { servePageWithMeta } from "./_shared/meta.js";

export async function onRequest(context) {
  return servePageWithMeta(context, {
    path: "/byt-pro-dite",
    title: "Byt pro dítě na hypotéku – otestujte to, než podepíšete | Tereza Kubečková",
    description:
      "Nemusíte mít miliony. Zjistěte zdarma, jestli vám banka dnes dá druhou hypotéku a jestli se vám nájem na byt pro dítě opravdu vyplatí.",
  });
}
