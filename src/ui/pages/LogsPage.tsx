import type { Metadata } from "next";
import Link from "next/link";
import { Box, Paper, Typography } from "@mui/material";

import { logsCopy } from "@/src/customizations/copy";
import { linkedInConfig } from "@/src/customizations/linkedin";
import Section from "@/src/ui/components/Section";

export const metadata: Metadata = {
  title: "Daily logs",
  description: logsCopy.intro,
  alternates: { canonical: "/logs" },
};

function isEmbedUrl(u: string) {
  return u.startsWith("https://www.linkedin.com/embed/");
}

export default function LogsPage() {
  const embeds = linkedInConfig.embedUrls;
  const good = embeds.filter(isEmbedUrl);
  const bad = embeds.filter((u) => !isEmbedUrl(u));

  return (
    <Box component="main" sx={{ py: 2, pb: 6 }}>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, bgcolor: "background.paper" }}>
        <Typography variant="overline" sx={{ color: "text.secondary", letterSpacing: "0.14em" }}>
          CEO feed
        </Typography>

        <Typography variant="h3" sx={{ mt: 0.5, fontWeight: 900, letterSpacing: "-0.03em" }}>
          {logsCopy.title}
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1.2, lineHeight: 1.85 }}>
          {logsCopy.intro}
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Profile:{" "}
          <a href={linkedInConfig.profileUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>
            {linkedInConfig.profileUrl}
          </a>
        </Typography>
      </Paper>

      <Section title="Posts">
        {bad.length > 0 ? (
          <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: "rgba(255,255,255,0.04)" }}>
            <Typography sx={{ fontWeight: 800 }}>Some URLs are not embeddable.</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.6 }}>
              Use LinkedIn <span style={{ fontFamily: "var(--font-geist-mono)" }}>/embed/</span> URLs only.
            </Typography>
            <Box component="ul" sx={{ mt: 1.2, mb: 0, pl: 3, color: "text.secondary" }}>
              {bad.map((u) => (
                <Box component="li" key={u} sx={{ mt: 0.5 }}>
                  <span style={{ fontFamily: "var(--font-geist-mono)" }}>{u}</span>
                </Box>
              ))}
            </Box>
          </Paper>
        ) : null}

        {good.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 2, bgcolor: "background.paper" }}>
            <Typography sx={{ fontWeight: 850 }}>No embeds configured.</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.6 }}>
              {logsCopy.note}
            </Typography>
            <Typography
              variant="body2"
              sx={{ mt: 1.2, fontFamily: "var(--font-geist-mono)", color: "text.secondary" }}
            >
              LINKEDIN_EMBED_URLS=&quot;https://www.linkedin.com/embed/feed/update/urn:li:share:...&quot;
            </Typography>
          </Paper>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
              gap: 2,
              alignItems: "start",
            }}
          >
            {good.map((src) => (
              <Paper
                key={src}
                variant="outlined"
                sx={{
                  p: 0,
                  overflow: "hidden",
                  bgcolor: "background.paper",
                }}
              >
                <iframe
                  src={src}
                  loading="lazy"
                  title="LinkedIn post"
                  style={{
                    width: "100%",
                    height: 760,
                    border: 0,
                    display: "block",
                    background: "transparent",
                  }}
                />
              </Paper>
            ))}
          </Box>
        )}
      </Section>

      <Section title="Tip" subtle>
        <Paper variant="outlined" sx={{ p: 2, bgcolor: "background.paper" }}>
          <Typography color="text.secondary">
            If you want a list of all markdown routes, go to{" "}
            <Link href="/details" style={{ textDecoration: "underline", fontFamily: "var(--font-geist-mono)" }}>
              /details
            </Link>
            .
          </Typography>
        </Paper>
      </Section>
    </Box>
  );
}