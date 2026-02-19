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
