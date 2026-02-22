const normalizeEnv = (v: string | undefined): string | undefined => {
  const s = (v ?? "").trim();
  return s ? s : undefined;
};

const parseCsv = (v: string | undefined): string[] => {
  if (!v) return [];
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

export const linkedInConfig = {
  profileUrl:
    normalizeEnv(process.env.NEXT_PUBLIC_CEO_LINKEDIN) ??
    "https://www.linkedin.com/company/trade-collaboration-engine/",

  embedUrls: parseCsv(normalizeEnv(process.env.LINKEDIN_EMBED_URLS)),
} as const;