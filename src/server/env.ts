export const isProd = process.env.NODE_ENV === "production";

export const getEnv = (name: string): string | undefined => process.env[name];

export const mustEnv = (name: string): string => {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return v;
};

export const truthyEnv = (name: string): boolean => {
  const v = process.env[name];
  if (!v) return false;
  return v === "1" || v.toLowerCase() === "true" || v.toLowerCase() === "yes";
};

export function siteOrigin(req?: Request): string {
  const raw = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL;

  if (raw) {
    const trimmed = raw.replace(/\/+$/, "");

    // Enforce https in production
    if (isProd && !trimmed.startsWith("https://")) {
      throw new Error("SITE_URL must start with https:// in production");
    }

    // Ensure it's a valid URL and return the canonical origin
    try {
      return new URL(trimmed).origin;
    } catch {
      throw new Error(`Invalid SITE_URL: ${trimmed}`);
    }
  }

  // Only allow fallback in dev to keep local DX.
  if (!isProd && req) return new URL(req.url).origin;

  throw new Error("Missing required environment variable: SITE_URL");
}