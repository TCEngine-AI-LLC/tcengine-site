import type { Metadata } from "next";
import { Box, Link, Paper, Stack, Typography } from "@mui/material";

import { logsCopy } from "@/src/customizations/copy";
import Section from "@/src/ui/components/Section";
import Surface from "@/src/ui/components/Surface";
import { listMarkdownPages } from "@/src/server/content/markdownPages";

export const metadata: Metadata = {
  title: logsCopy.title,
  description: logsCopy.intro,
  alternates: { canonical: "/logs" },
};

export default async function LogsPage() {
  const pages = await listMarkdownPages();
  
  return (
    <Box component="main" sx={{ py: 2, pb: 6 }}>

      <Section title="CEO Blogs">
        <Surface>
          <Typography sx={{ color: "text.secondary", maxWidth: 860 }}>
            Technical pages and markdown-driven content.
          </Typography>

          <Stack spacing={1.2} sx={{ mt: 2 }}>
            {pages.length === 0 ? (
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography color="text.secondary">
                  No markdown pages found. Add files under <code>/markdowns</code>.
                </Typography>
              </Paper>
            ) : null}

            {pages.map((p) => (
              <Link key={p.href} href={p.href} style={{ display: "block", textDecoration: "none" }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    backgroundImage: "none",
                    "&:hover": { bgcolor: "action.selected" },
                  }}
                >
                  <Typography sx={{ fontWeight: 850 }}>{p.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
                    {p.description}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.8, display: "block", fontFamily: "var(--font-geist-mono)" }}
                  >
                    {p.href}
                  </Typography>
                </Paper>
              </Link>
            ))}
          </Stack>
        </Surface>
      </Section>
    </Box>
  );
}