import type { Metadata } from "next";
import { Box, Link, Paper, Stack, Typography } from "@mui/material";

import { logsCopy } from "@/src/customizations/copy";
import { linkedInConfig } from "@/src/customizations/linkedin";
import Section from "@/src/ui/components/Section";
import Surface from "@/src/ui/components/Surface";
import LinkedInEmbeds from "@/src/ui/widgets/LinkedInEmbeds";
import { listMarkdownPages } from "@/src/server/content/markdownPages";

export const metadata: Metadata = {
  title: logsCopy.title,
  description: logsCopy.intro,
  alternates: { canonical: "/logs" },
};

export default async function LogsPage() {
  const embeds = linkedInConfig.embedUrls;
  const pages = await listMarkdownPages();
  
  return (
    <Box component="main" sx={{ py: 2, pb: 6 }}>
      <Surface>
        <Typography variant="overline" sx={{ color: "text.secondary", letterSpacing: "0.14em" }}>
          CEO feed
        </Typography>

        <Typography variant="h3" sx={{ mt: 0.5, fontWeight: 900, letterSpacing: "-0.03em" }}>
          {logsCopy.title}
        </Typography>

        <Typography sx={{ color: "text.secondary", mt: 1.2, maxWidth: 860 }}>
          {logsCopy.intro}
        </Typography>

        <Typography sx={{ color: "text.secondary", mt: 1.2 }}>
          Profile:{" "}
          <a
            href={linkedInConfig.profileUrl}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "underline", textUnderlineOffset: "3px" }}
          >
            {linkedInConfig.profileUrl}
          </a>
        </Typography>
      </Surface>

      <Section title="Posts">
        {embeds.length === 0 ? (
          <Surface>
            <Typography sx={{ fontWeight: 850 }}>No embeds configured.</Typography>
            <Typography sx={{ color: "text.secondary", mt: 1 }}>
              {logsCopy.note}
            </Typography>
            <Typography
              variant="body2"
              sx={{ mt: 1.5, fontFamily: "var(--font-geist-mono)", color: "text.secondary" }}
            >
              {'LINKEDIN_EMBED_URLS="https://www.linkedin.com/embed/feed/update/urn:li:share:..."'}
            </Typography>
          </Surface>
        ) : (
          <LinkedInEmbeds embeds={embeds} />
        )}
      </Section>

      <Section title="Details">
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