import type { Metadata } from "next";
import { Box, Paper } from "@mui/material";

import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";

import { siteMeta } from "@/src/customizations/site";
import IconCtaButton from "@/src/ui/components/IconCtaButton";
import LeadCaptureCard from "@/src/ui/widgets/LeadCaptureCard";
import MarkdownFromFile from "../components/MarkdownFromFile";

export const metadata: Metadata = {
  title: siteMeta.title,
  description: siteMeta.description,
};

export default function HomePage() {
  return (
    <main>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, 7fr) minmax(0, 3fr)" },
          gap: { xs: 2, md: 3 },
          alignItems: "start",
        }}
      >
        {/* LEFT (70%) */}
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, bgcolor: "background.paper" }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 2 }}>
            <IconCtaButton
              icon={<DescriptionRoundedIcon />}
              tooltip="Jump to the request brief form on the right."
              label="Request Executive Brief"
              href="/#request-brief"
              ariaLabel="Request Executive Brief"
            />
            <IconCtaButton
              icon={<AccountTreeRoundedIcon />}
              tooltip="Open the AIEM Architecture page."
              label="Explore the AIEM Architecture"
              href="/architecture"
              ariaLabel="Explore the AIEM Architecture"
            />
          </Box>

          <MarkdownFromFile relPath="_partials/home-left.md" />
        </Paper>

        {/* RIGHT (≈30%) */}
        <Box
          id="request-brief"
          sx={{
            position: { md: "sticky" },
            top: { md: 18 },
            alignSelf: "start",
          }}
        >
          {/* Keep this as your existing “request technical brief” form */}
          <LeadCaptureCard
            title="Request technical brief"
            hint="Send us your email so we can share the technical brief."
            source="home_tech_brief"
          />
        </Box>
      </Box>
    </main>
  );
}