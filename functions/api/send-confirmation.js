// Cloudflare Pages Function – POST /api/send-confirmation
// Krok 1 double opt-in flow pro /lepsi-zivot: NEODESÍLÁ lead do CRM.
// Podepíše odpovědi + kontakt do tokenu (viz _shared/confirmToken.js) a
// pošle leadovi e-mail s odkazem na /potvrzeni?token=... . Lead se do
// Web3Forms/Make dostane až po kliknutí (viz api/confirm.js).
//
// Potřebné env proměnné na Cloudflare Pages projektu:
//   RESEND_API_KEY   – API klíč z resend.com (ověřená doména terezakubeckova.cz)
//   CONFIRM_SECRET   – libovolný náhodný řetězec pro podpis tokenu

import { signPayload } from "../_shared/confirmToken.js";

const TTL_MS = 24 * 60 * 60 * 1000;
const FROM = "Tereza Kubečková <ahoj@terezakubeckova.cz>";
const REPLY_TO = "tereza.kubeckova@4fin.cz";

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Neplatná data." }), { status: 400 });
  }

  const { name, email, phone, situace, prijem, hypoteka, source } = body || {};
  if (!name || !email || !phone) {
    return new Response(JSON.stringify({ error: "Chybí povinná pole." }), { status: 400 });
  }

  if (!env.RESEND_API_KEY || !env.CONFIRM_SECRET) {
    return new Response(JSON.stringify({ error: "E-mailové potvrzení není nastavené. Kontaktujte prosím správce webu." }), {
      status: 500,
    });
  }

  const token = await signPayload(
    env.CONFIRM_SECRET,
    { name, email, phone, situace, prijem, hypoteka, source },
    TTL_MS,
  );

  const confirmUrl = new URL("/potvrzeni", request.url);
  confirmUrl.searchParams.set("token", token);

  const firstName = String(name).trim().split(/\s+/)[0] || "";

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#1a1a1a;">
      <p>Ahoj${firstName ? " " + firstName : ""},</p>
      <p>Díky za zájem o bezpečnou splátku hypotéky na rodičovské. Stačí potvrdit, že jde opravdu o vás, a hned se pustím do propočtu.</p>
      <p style="text-align:center;margin:32px 0;">
        <a href="${confirmUrl.toString()}" style="background:#c9a24b;color:#111111;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">Ano, chci to vědět</a>
      </p>
      <p style="font-size:13px;color:#666;">Odkaz platí 24 hodin. Pokud jste o výpočet nežádali, tento e-mail jednoduše ignorujte.</p>
      <p>Tereza Kubečková</p>
    </div>
  `;

  const text = `Ahoj${firstName ? " " + firstName : ""},\n\nDíky za zájem o bezpečnou splátku hypotéky na rodičovské. Potvrďte prosím zájem kliknutím na odkaz níže:\n${confirmUrl.toString()}\n\nOdkaz platí 24 hodin. Pokud jste o výpočet nežádali, tento e-mail ignorujte.\n\nTereza Kubečková`;

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [email],
      reply_to: REPLY_TO,
      subject: "Potvrďte zájem o bezpečnou splátku hypotéky",
      html,
      text,
    }),
  });

  if (!resendRes.ok) {
    return new Response(JSON.stringify({ error: "Nepodařilo se odeslat potvrzovací e-mail." }), { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
