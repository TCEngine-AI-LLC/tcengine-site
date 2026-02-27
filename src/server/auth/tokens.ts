import crypto from "crypto";

import { mustEnv } from "@/src/server/env";

type TokenPurpose = "admin_magic_link" | "admin_session";

type TokenPayload = {
  p: TokenPurpose;
  email: string;
  exp: number; // unix seconds
  n: string; // nonce
};

const b64url = (buf: Buffer): string =>
  buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

const b64urlJson = (obj: unknown): string => b64url(Buffer.from(JSON.stringify(obj)));

const fromB64url = (s: string): Buffer => {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return Buffer.from(b64, "base64");
};

function hmacSign(input: string, secret: string): string {
  const sig = crypto.createHmac("sha256", secret).update(input).digest();
  return b64url(sig);
}

function timingSafeEq(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export function signAdminMagicLinkToken(email: string, ttlSeconds = 15 * 60): string {
  const secret = mustEnv("AUTH_TOKEN_SECRET");
  const header = { alg: "HS256", typ: "JWT" };
  const payload: TokenPayload = {
    p: "admin_magic_link",
    email: email.trim().toLowerCase(),
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
    n: crypto.randomBytes(16).toString("hex"),
  };

  const encoded = `${b64urlJson(header)}.${b64urlJson(payload)}`;
  const sig = hmacSign(encoded, secret);
  return `${encoded}.${sig}`;
}

export function verifyAdminMagicLinkToken(token: string): { ok: true; email: string } | { ok: false } {
  const secret = process.env.AUTH_TOKEN_SECRET;
  if (!secret) return { ok: false };

  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false };

  const [h, p, sig] = parts;
  const expected = hmacSign(`${h}.${p}`, secret);
  if (!timingSafeEq(sig, expected)) return { ok: false };

  try {
    const payload = JSON.parse(fromB64url(p).toString("utf8")) as TokenPayload;
    if (payload.p !== "admin_magic_link") return { ok: false };
    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) {
      return { ok: false };
    }
    if (!payload.email) return { ok: false };
    return { ok: true, email: payload.email };
  } catch {
    return { ok: false };
  }
}

export function signAdminSessionToken(email: string, ttlSeconds = 7 * 24 * 60 * 60): string {
  const secret = mustEnv("AUTH_TOKEN_SECRET");
  const header = { alg: "HS256", typ: "JWT" };
  const payload: TokenPayload = {
    p: "admin_session",
    email: email.trim().toLowerCase(),
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
    n: crypto.randomBytes(16).toString("hex"),
  };

  const encoded = `${b64urlJson(header)}.${b64urlJson(payload)}`;
  const sig = hmacSign(encoded, secret);
  return `${encoded}.${sig}`;
}

export function verifyAdminSessionToken(token: string): { ok: true; email: string } | { ok: false } {
  const secret = process.env.AUTH_TOKEN_SECRET;
  if (!secret) return { ok: false };

  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false };

  const [h, p, sig] = parts;
  const expected = hmacSign(`${h}.${p}`, secret);
  if (!timingSafeEq(sig, expected)) return { ok: false };

  try {
    const payload = JSON.parse(fromB64url(p).toString("utf8")) as TokenPayload;
    if (payload.p !== "admin_session") return { ok: false };
    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) {
      return { ok: false };
    }
    if (!payload.email) return { ok: false };
    return { ok: true, email: payload.email };
  } catch {
    return { ok: false };
  }
}

type IntakeLinkPayload = {
  p: "intake_link";
  purchaseId: string;
  exp: number; // unix seconds
  n: string;   // nonce
};

export function signIntakeLinkToken(purchaseId: string, ttlSeconds = 180 * 24 * 60 * 60): string {
  const secret = mustEnv("AUTH_TOKEN_SECRET");
  const header = { alg: "HS256", typ: "JWT" };

  const payload: IntakeLinkPayload = {
    p: "intake_link",
    purchaseId,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
    n: crypto.randomBytes(16).toString("hex"),
  };

  const encoded = `${b64urlJson(header)}.${b64urlJson(payload)}`;
  const sig = hmacSign(encoded, secret);
  return `${encoded}.${sig}`;
}

export function verifyIntakeLinkToken(
  token: string
): { ok: true; purchaseId: string } | { ok: false } {
  const secret = process.env.AUTH_TOKEN_SECRET;
  if (!secret) return { ok: false };

  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false };

  const [h, p, sig] = parts;
  const expected = hmacSign(`${h}.${p}`, secret);
  if (!timingSafeEq(sig, expected)) return { ok: false };

  try {
    const payload = JSON.parse(fromB64url(p).toString("utf8")) as IntakeLinkPayload;

    if (payload.p !== "intake_link") return { ok: false };
    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) return { ok: false };
    if (typeof payload.purchaseId !== "string" || !payload.purchaseId) return { ok: false };

    return { ok: true, purchaseId: payload.purchaseId };
  } catch {
    return { ok: false };
  }
}