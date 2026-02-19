import { isProd, truthyEnv } from "@/src/server/env";

export const TURNSTILE_COOKIE_NAME = "tc_turnstile_ok";
export const TURNSTILE_COOKIE_MAX_AGE_S = 60 * 60 * 8;

export function turnstileBypassAllowed(): boolean {
  return truthyEnv("TURNSTILE_BYPASS_LOCAL") && !isProd;
}

export function getCookieValue(req: Request, name: string): string | undefined {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return undefined;

  // Simple cookie parsing (no dependencies).
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
  return v === "1" || v === "ok";
}

export function turnstileRequiredResponse(): Response {
  return Response.json(
    {
      ok: false,
      error: "captcha_required",
      hint:
        "Verify you are human first (Turnstile) and retry the request. See /verify-human.",
    },
    { status: 403 }
  );
}

export async function requireTurnstileOr403(req: Request): Promise<Response | null> {
  if (turnstileBypassAllowed()) return null;
  if (hasTurnstileOk(req)) return null;
  return turnstileRequiredResponse();
}
