import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Box, Paper } from "@mui/material";

import MarkdownProse from "@/src/ui/components/MarkdownProse";
import { getMarkdownPage, listMarkdownPages } from "@/src/server/content/markdownPages";

export const runtime = "nodejs";
export const dynamicParams = false;

export async function generateStaticParams() {
  const pages = await listMarkdownPages();

  // If someone nukes /markdowns, Next 16 + Cache Components can error on empty static params.
  // Returning a placeholder keeps build stable and still results in 404 at runtime.
  // (If you always keep at least 1 markdown file, you’ll never hit this.)
  if (pages.length === 0) return [{ slug: ["__md__"] }]; //  [oai_citation:2‡Next.js](https://nextjs.org/docs/messages/empty-generate-static-params)

  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (slug?.[0] === "__md__") return {};

  const page = await getMarkdownPage(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.href },
  };
}

export default async function MarkdownRoutePage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  if (slug?.[0] === "__md__") return notFound();

  const page = await getMarkdownPage(slug);
  if (!page) return notFound();

  return (
    <Box component="main" sx={{ py: 2, pb: 6 }}>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, bgcolor: "background.paper" }}>
        <MarkdownProse html={page.html} />
      </Paper>
    </Box>
  );
}