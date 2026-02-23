import crypto from "node:crypto";
import { isProd, truthyEnv, mustEnv } from "@/src/server/env";

export const TURNSTILE_COOKIE_NAME = "tc_turnstile_ok";
export const TURNSTILE_COOKIE_MAX_AGE_S = 60 * 60 * 8;

// Signed cookie: v1.<exp>.<nonce>.<sigHex>
const TURNSTILE_COOKIE_VER = "v1";

export function turnstileBypassAllowed(): boolean {
  return truthyEnv("TURNSTILE_BYPASS_LOCAL") && !isProd;
}

function timingSafeEq(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function hmacHex(input: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(input).digest("hex");
}

export function signTurnstileOkCookie(ttlSeconds = TURNSTILE_COOKIE_MAX_AGE_S): string {
  // Reuse AUTH_TOKEN_SECRET so you don't add another required secret
  const secret = mustEnv("AUTH_TOKEN_SECRET");
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const nonce = crypto.randomBytes(16).toString("hex"); // 32 chars
  const data = `${TURNSTILE_COOKIE_VER}.${exp}.${nonce}`;
  const sig = hmacHex(data, secret);
  return `${data}.${sig}`;
}

function verifyTurnstileOkCookie(token: string): boolean {
  const secret = process.env.AUTH_TOKEN_SECRET;
  if (!secret) return false;

  const parts = token.split(".");
  if (parts.length !== 4) return false;

  const [ver, expStr, nonce, sig] = parts;
  if (ver !== TURNSTILE_COOKIE_VER) return false;
  if (!/^\d+$/.test(expStr)) return false;

  const exp = Number(expStr);
  if (!Number.isFinite(exp)) return false;
  if (exp < Math.floor(Date.now() / 1000)) return false;

  if (!/^[a-f0-9]{32}$/.test(nonce)) return false;
  if (!/^[a-f0-9]{64}$/.test(sig)) return false;

  const data = `${ver}.${expStr}.${nonce}`;
  const expected = hmacHex(data, secret);
  return timingSafeEq(sig, expected);
}

export function getCookieValue(req: Request, name: string): string | undefined {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return undefined;

  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [k, ...rest] = part.trim().split("=");
    if (!k) continue;
    if (k === name) return rest.join("=");
  }
  return undefined;
}

export function hasTurnstileOk(req: Request): boolean {
  const v = getCookieValue(req, TURNSTILE_COOKIE_NAME);
  if (!v) return false;
  return verifyTurnstileOkCookie(v);
}

export function turnstileRequiredResponse(): Response {
  return Response.json(
    {
      ok: false,
      error: "captcha_required",
      hint: "Verify you are human first (Turnstile) and retry the request. See /verify-human.",
    },
    { status: 403 }
  );
}

export async function requireTurnstileOr403(req: Request): Promise<Response | null> {
  if (turnstileBypassAllowed()) return null;
  if (hasTurnstileOk(req)) return null;
  return turnstileRequiredResponse();
}