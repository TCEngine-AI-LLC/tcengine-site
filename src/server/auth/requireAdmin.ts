import { redirect } from "next/navigation";

import { isAdminEmail } from "@/src/server/auth/adminAllowlist";
import { getAdminSessionEmail } from "@/src/server/auth/session";

export function requireAdminOrRedirect(nextPath = "/admin"): string {
  const email = getAdminSessionEmail();
  if (!email) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
  if (!isAdminEmail(email)) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
  return email;
}
