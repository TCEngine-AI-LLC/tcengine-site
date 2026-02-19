import { NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE } from "@/src/server/auth/session";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const res = NextResponse.redirect(`${url.origin}/`);
  res.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    maxAge: 0,
    path: "/",
  });
  return res;
}
