// Sdílený podpis/ověření tokenu pro e-mailový double opt-in na /lepsi-zivot.
// Bezstavové (žádné KV) — payload leadu + expirace jsou zakódované přímo
// v tokenu a podepsané HMAC-SHA256 tajemstvím CONFIRM_SECRET, takže token
// nejde padělat ani prodloužit jeho platnost bez znalosti tajemství.

const encoder = new TextEncoder();

function bytesToBase64url(bytes) {
  let str = "";
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlToBytes(str) {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(str.length + ((4 - (str.length % 4)) % 4), "=");
  const bin = atob(padded);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function hmacSign(secret, data) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return bytesToBase64url(new Uint8Array(sig));
}

export async function signPayload(secret, payload, ttlMs) {
  const data = { ...payload, exp: Date.now() + ttlMs };
  const payloadB64 = bytesToBase64url(encoder.encode(JSON.stringify(data)));
  const signature = await hmacSign(secret, payloadB64);
  return `${payloadB64}.${signature}`;
}

export async function verifyToken(secret, token) {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return { ok: false, error: "Neplatný odkaz." };
  }
  const [payloadB64, signature] = token.split(".");
  const expected = await hmacSign(secret, payloadB64);
  if (signature !== expected) {
    return { ok: false, error: "Neplatný nebo poškozený odkaz." };
  }

  let payload;
  try {
    payload = JSON.parse(new TextDecoder().decode(base64urlToBytes(payloadB64)));
  } catch {
    return { ok: false, error: "Neplatná data v odkazu." };
  }

  if (!payload.exp || Date.now() > payload.exp) {
    return { ok: false, error: "Platnost odkazu vypršela. Vyplňte prosím formulář znovu." };
  }

  return { ok: true, payload };
}
