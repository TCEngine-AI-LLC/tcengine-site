// src/server/security/turnstileGate.ts
import crypto from "node:crypto";
import { isProd, truthyEnv } from "@/src/server/env";

export const TURNSTILE_COOKIE_NAME = "tc_turnstile_ok";
export const TURNSTILE_COOKIE_MAX_AGE_S = 60 * 60 * 8;

// Only for local DX (never in prod)
export function turnstileBypassAllowed(): boolean {
  return truthyEnv("TURNSTILE_BYPASS_LOCAL") && !isProd;
}

function b64url(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function timingSafeEq(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function hmacSign(input: string, secret: string): string {
  const sig = crypto.createHmac("sha256", secret).update(input).digest();
  return b64url(sig);
}

function getSecret(): string {
  // Reuse your existing secret (already required for admin tokens).
  const s = process.env.AUTH_TOKEN_SECRET;
  if (!s) throw new Error("Missing required environment variable: AUTH_TOKEN_SECRET");
  return s;
}

// Cookie format: v1.<unixSec>.<nonce>.<sig>
export function signTurnstileOkCookie(): string {
  const secret = getSecret();
  const ts = Math.floor(Date.now() / 1000);
  const nonce = crypto.randomBytes(8).toString("hex");
  const payload = `v1.${ts}.${nonce}`;
  const sig = hmacSign(payload, secret);
  return `${payload}.${sig}`;
}

function verifyTurnstileOkCookie(v: string): boolean {
  // Dev-only bypass
  if (turnstileBypassAllowed() && v === "bypass") return true;

  const secret = getSecret();
  const parts = v.split(".");
  if (parts.length !== 4) return false;

  const [ver, tsStr, nonce, sig] = parts;
  if (ver !== "v1") return false;
  if (!/^\d+$/.test(tsStr)) return false;
  if (!/^[a-f0-9]{16}$/.test(nonce)) return false;

  const ts = Number(tsStr);
  if (!Number.isFinite(ts)) return false;

  const now = Math.floor(Date.now() / 1000);

  // Basic skew + expiry check (belt + suspenders; cookie also has Max-Age)
  if (ts > now + 60) return false;
  if (ts < now - TURNSTILE_COOKIE_MAX_AGE_S) return false;

  const expected = hmacSign(`${ver}.${tsStr}.${nonce}`, secret);
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