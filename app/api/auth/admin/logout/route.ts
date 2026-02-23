import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/src/server/auth/session";
import { isProd, siteOrigin } from "@/src/server/env";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const origin = siteOrigin(req);
  const res = NextResponse.redirect(`${origin}/`);

  res.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    maxAge: 0,
    path: "/",
  });

  return res;
}