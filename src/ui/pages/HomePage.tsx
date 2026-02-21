import type { Metadata } from "next";
import { Box } from "@mui/material";

import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";

import { siteMeta } from "@/src/customizations/site";
import IconCtaButton from "@/src/ui/components/IconCtaButton";
import LeadCaptureCard from "@/src/ui/widgets/LeadCaptureCard";

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
        {/* LEFT (≈70%) */}
        <Box>
          <div className="heroPanel">
            <h2 style={{ margin: "0 0 6px" }}>Overview</h2>

            <h3 style={{ margin: "0 0 10px" }}>Protecting National Military-Industrial Intellectual Property in the AI Era</h3>

            <p style={{ fontSize: 16, marginTop: 12 }}>
              We deliver AI Export Modernization (AIEM) — the architecture, data science, and infrastructure required to
              govern software, technical data, and digital engineering environments across the global defense industrial
              base.
            </p>

            <p style={{ fontSize: 16, marginTop: 12 }}>
              Export controls move from paperwork to <strong>deterministic enforcement infrastructure</strong>.
            </p>

            <p style={{ fontSize: 16, marginTop: 12 }}>
              Modern military advantage lives in code, models, and collaboration networks. AIEM secures the intangible
              battlespace.
            </p>

            <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 14 }}>
              <IconCtaButton
                icon={<DescriptionRoundedIcon />}
                tooltip="Jump to the request brief form on the right."
                label="Request Executive Brief"
                href="/#request-brief"
                ariaLabel="Request Executive Brief"
              />
              <IconCtaButton
                icon={<AccountTreeRoundedIcon />}
                tooltip="Open the AIEM Architecture page (markdown route)."
                label="Explore the AIEM Architecture"
                href="/architecture"
                ariaLabel="Explore the AIEM Architecture"
              />
            </div>

            <div className="hr" />

            <h2 style={{ margin: "0 0 6px" }}>THE PROBLEM</h2>
            <h3 style={{ margin: "0 0 10px" }}>Export Controls Were Built for Hardware. The Threat Has Moved to Data.</h3>

            <p style={{ marginTop: 10 }}>
              Today’s most sensitive technologies exist as:
            </p>

            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.85 }}>
              <li>Software repositories</li>
              <li>Digital engineering models</li>
              <li>AI systems</li>
              <li>Manufacturing files</li>
              <li>Cloud collaboration environments</li>
            </ul>

            <p style={{ marginTop: 12 }}>
              Legacy compliance cannot control intangible exports at scale.
            </p>

            <div className="hr" />

            <h2 style={{ margin: "0 0 6px" }}>THE SHIFT</h2>
            <h3 style={{ margin: "0 0 10px" }}>AI Export Modernization (AIEM)</h3>

            <p style={{ marginTop: 10 }}>
              AIEM transforms export regulation into <strong>National Industrial IP Defense Infrastructure</strong>.
            </p>
            <p style={{ marginTop: 10 }}>Not compliance software. Not workflow automation.</p>
            <p style={{ marginTop: 10 }}>A control plane for controlled technology.</p>

            <div className="hr" />

            <h2 style={{ margin: "0 0 10px" }}>WHO WE SERVE</h2>

            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.85 }}>
              <li>Defense Industrial <strong>Base</strong></li>
              <li>Space Systems</li>
              <li>Autonomous Platforms</li>
              <li>Advanced Manufacturing</li>
              <li>Allied Industrial Cooperation</li>
            </ul>

            <div className="hr" />

            <h2 style={{ margin: "0 0 10px" }}>THE REAL SECRET</h2>
            <p style={{ marginTop: 10 }}>
              We deliver <strong>export control infrastructure</strong>.
            </p>
          </div>
        </Box>

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