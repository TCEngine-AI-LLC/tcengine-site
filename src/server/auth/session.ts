import { cookies } from "next/headers";

import { isProd } from "@/src/server/env";
import { verifyAdminSessionToken } from "@/src/server/auth/tokens";

export const ADMIN_SESSION_COOKIE = "tc_admin_session";

export async function getAdminSessionEmail(): Promise<string | null> {
  const jar = await cookies();
  const v = jar.get(ADMIN_SESSION_COOKIE)?.value;

  if (!v) return null;
  const res = verifyAdminSessionToken(v);
  if (!res.ok) return null;
  return res.email;
}

export function adminSessionCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProd,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}