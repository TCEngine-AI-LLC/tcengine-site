import type { MetadataRoute } from "next";

import { NAV_ITEMS, siteMeta } from "@/src/customizations/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const urls = [
    { url: siteMeta.url, lastModified: now },
    ...NAV_ITEMS.filter((x) => x.href !== "/").map((x) => ({
      url: `${siteMeta.url}${x.href}`,
      lastModified: now,
    })),
  ];

  return urls;
}
