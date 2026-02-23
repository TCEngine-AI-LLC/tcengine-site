import { NextResponse } from "next/server";
import { isAdminEmail } from "@/src/server/auth/adminAllowlist";
import { ADMIN_SESSION_COOKIE } from "@/src/server/auth/session";
import { signAdminSessionToken, verifyAdminMagicLinkToken } from "@/src/server/auth/tokens";
import { isProd, siteOrigin } from "@/src/server/env";

export const runtime = "nodejs";

const SESSION_MAX_AGE_S = 7 * 24 * 60 * 60;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = siteOrigin(req);

  const token = url.searchParams.get("token") ?? "";
  const nextRaw = url.searchParams.get("next");
  const nextPath = typeof nextRaw === "string" && nextRaw.startsWith("/") ? nextRaw : "/admin";

  const v = verifyAdminMagicLinkToken(token);
  if (!v.ok || !isAdminEmail(v.email)) {
    return NextResponse.redirect(`${origin}/login?next=${encodeURIComponent(nextPath)}`);
  }

  const sessionToken = signAdminSessionToken(v.email, SESSION_MAX_AGE_S);
  const res = NextResponse.redirect(`${origin}${nextPath}`);

  res.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: sessionToken,
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    maxAge: SESSION_MAX_AGE_S,
    path: "/",
  });

  return res;
}