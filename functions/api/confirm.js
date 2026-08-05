// Cloudflare Pages Function – POST /api/confirm
// Krok 2 double opt-in flow pro /lepsi-zivot: ověří token podepsaný v
// api/send-confirmation.js, a teprve TEĎ pošle lead do Web3Forms + Make
// webhooku. Volá ji stránka /potvrzeni po kliknutí na odkaz v e-mailu.

import { verifyToken } from "../_shared/confirmToken.js";

const WEB3FORMS_KEY = "288ee3af-59f1-422a-8dc0-918c2e503d6b";
const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/1mm2ym4r8qw9bh521kt6eb75qdljxbht";

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Neplatný požadavek." }), { status: 400 });
  }

  if (!env.CONFIRM_SECRET) {
    return new Response(JSON.stringify({ error: "Potvrzení není nastavené. Kontaktujte prosím správce webu." }), {
      status: 500,
    });
  }

  const result = await verifyToken(env.CONFIRM_SECRET, body?.token);
  if (!result.ok) {
    return new Response(JSON.stringify({ error: result.error }), { status: 400 });
  }

  const { name, email, phone, situace, prijem, hypoteka, source } = result.payload;
  const leadPayload = { name, email, phone, situace, prijem, hypoteka, source };

  const [web3Res] = await Promise.allSettled([
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: "Bezpečná splátka na rodičovské (/lepsi-zivot, potvrzeno e-mailem)",
        ...leadPayload,
      }),
    }),
    fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(leadPayload),
    }),
  ]);

  if (web3Res.status !== "fulfilled" || !web3Res.value.ok) {
    return new Response(JSON.stringify({ error: "Nepodařilo se odeslat poptávku. Zkuste to prosím znovu." }), {
      status: 502,
    });
  }

  return new Response(JSON.stringify({ ok: true, name }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
