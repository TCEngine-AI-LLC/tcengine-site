import type { Metadata } from "next";
import { Box, Typography } from "@mui/material";

import { logsCopy } from "@/src/customizations/copy";
import { linkedInConfig } from "@/src/customizations/linkedin";
import Section from "@/src/ui/components/Section";
import Surface from "@/src/ui/components/Surface";

export const metadata: Metadata = {
  title: "Daily logs",
  description: logsCopy.intro,
  alternates: { canonical: "/logs" },
};

export default function LogsPage() {
  const embeds = linkedInConfig.embedUrls;

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
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(auto-fit, minmax(520px, 1fr))" },
              gap: 2,
            }}
          >
            {embeds.map((src) => (
              <Surface key={src} sx={{ p: 0, overflow: "hidden" }}>
                <Box
                  component="iframe"
                  src={src}
                  loading="lazy"
                  title="LinkedIn post"
                  sx={{
                    width: "100%",
                    height: { xs: 720, md: 820 },
                    border: 0,
                    display: "block",
                    background: "transparent",
                  }}
                />
              </Surface>
            ))}
          </Box>
        )}
      </Section>
    </Box>
  );
}