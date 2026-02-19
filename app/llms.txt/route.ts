import { NextResponse } from "next/server";

import { NAV_ITEMS, siteMeta } from "@/src/customizations/site";

export const runtime = "nodejs";

export async function GET() {
  const lines: string[] = [];

  lines.push(`# ${siteMeta.title}`);
  lines.push("");
  lines.push(siteMeta.description);
  lines.push("");
  lines.push("## Pages");
  for (const it of NAV_ITEMS) {
    lines.push(`- ${siteMeta.url}${it.href} — ${it.label}`);
  }
  lines.push("");
  lines.push("## Contact");
  lines.push(`- Email: ${siteMeta.salesEmail}`);

  return new NextResponse(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
