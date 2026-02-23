import { NextResponse } from "next/server";
import { isProd } from "@/src/server/env";
import { verifyTurnstileToken } from "@/src/server/security/turnstile";
import {
  TURNSTILE_COOKIE_MAX_AGE_S,
  TURNSTILE_COOKIE_NAME,
  turnstileBypassAllowed,
  signTurnstileOkCookie,
} from "@/src/server/security/turnstileGate";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (turnstileBypassAllowed()) {
      const res = NextResponse.json({ ok: true, bypass: true });
      res.cookies.set({
        name: TURNSTILE_COOKIE_NAME,
        value: signTurnstileOkCookie(),
        httpOnly: true,
        sameSite: "lax",
        secure: isProd,
        maxAge: TURNSTILE_COOKIE_MAX_AGE_S,
        path: "/",
      });
      return res;
    }

    const body = (await req.json().catch(() => null)) as { token?: string } | null;
    const token = body?.token;
    if (!token) {
      return NextResponse.json({ ok: false, error: "missing_token" }, { status: 400 });
    }

    const ipHeader = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for") ?? undefined;
    const remoteIp = ipHeader?.split(",")[0]?.trim();

    const v = await verifyTurnstileToken({ token, remoteIp });
    if (!v.ok) {
      return NextResponse.json({ ok: false, error: "turnstile_failed", codes: v.errorCodes ?? [] }, { status: 403 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set({
      name: TURNSTILE_COOKIE_NAME,
      value: signTurnstileOkCookie(),
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      maxAge: TURNSTILE_COOKIE_MAX_AGE_S,
      path: "/",
    });
    return res;
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }
}