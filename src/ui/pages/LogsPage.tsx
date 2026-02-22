import type { Metadata } from "next";
import { Box, Typography } from "@mui/material";

import { logsCopy } from "@/src/customizations/copy";
import { linkedInConfig } from "@/src/customizations/linkedin";
import Section from "@/src/ui/components/Section";
import Surface from "@/src/ui/components/Surface";
import LinkedInEmbeds from "@/src/ui/widgets/LinkedInEmbeds";

export const metadata: Metadata = {
  title: logsCopy.title,
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
          <LinkedInEmbeds embeds={embeds} />
        )}
      </Section>
    </Box>
  );
}