const parseCsv = (v: string | undefined): string[] => {
  if (!v) return [];
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

export const linkedInConfig = {
  profileUrl:
    process.env.NEXT_PUBLIC_CEO_LINKEDIN ??
    "https://www.linkedin.com/company/trade-collaboration-engine/",

  // Use LinkedIn *embed* URLs (iframe src), not regular post URLs.
  // Example format: https://www.linkedin.com/embed/feed/update/urn:li:share:XXXXXXXX
  embedUrls: parseCsv(process.env.LINKEDIN_EMBED_URLS),
} as const;
