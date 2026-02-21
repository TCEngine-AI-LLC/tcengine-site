import type { Metadata } from "next";

import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

import { homeCopy } from "@/src/customizations/copy";
import { siteMeta } from "@/src/customizations/site";
import Section from "@/src/ui/components/Section";
import IconCtaButton from "@/src/ui/components/IconCtaButton";
import LeadCaptureCard from "@/src/ui/widgets/LeadCaptureCard";
import Link from "next/link";

export const metadata: Metadata = {
  title: siteMeta.title,
  description: siteMeta.description,
};

export default function HomePage() {
  const scheduleUrl =
    process.env.NEXT_PUBLIC_SCHEDULE_URL ??
    `mailto:${siteMeta.salesEmail}?subject=${encodeURIComponent("AIEM Deep Dive")}`;

  return (
    <main>
      <div className="heroGrid">
        <div className="heroPanel">
          <div className="badge">{homeCopy.badge}</div>
          <h1>
            {homeCopy.heroTitle}
            <span style={{ display: "block", marginTop: 10, fontSize: 18, color: "rgba(11, 15, 23, 0.7)", fontWeight: 700 }}>
              {homeCopy.heroSubtitle}
            </span>
          </h1>
          <p style={{ fontSize: 16 }}>{homeCopy.heroLead}</p>

          <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 14 }}>
            <IconCtaButton
              icon={<CalendarMonthRoundedIcon />}
              tooltip={homeCopy.ctas.secondary.hint}
              label={homeCopy.ctas.secondary.label}
              href={scheduleUrl}
              ariaLabel="Schedule AIEM deep dive"
            />
          </div>

          <div className="hr" />

          <div className="kpi">
            Minimal UI. Deterministic logic. Audit-ready evidence.
          </div>
        </div>

        <LeadCaptureCard
          title={homeCopy.ctas.primary.label}
          hint={homeCopy.ctas.primary.hint}
          source="home_tech_brief"
        />
      </div>

      <Section title={homeCopy.problemShift.title}>
        <p>{homeCopy.problemShift.intro}</p>
        <div style={{ marginTop: 10 }}>
          <ul style={{ margin: 0, paddingLeft: 18, color: "rgba(11, 15, 23, 0.78)", lineHeight: 1.75 }}>
            {homeCopy.problemShift.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      </Section>

      <Section title={homeCopy.solution.title}>
        <div className="grid2">
          {homeCopy.solution.body.map((p) => (
            <div key={p} className="card">
              <p style={{ color: "rgba(11, 15, 23, 0.75)" }}>{p}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title={homeCopy.whatWeBuild.title}>
        <div className="grid2">
          {homeCopy.whatWeBuild.cards.map((c) => (
            <div key={c.title} className="card">
              <div style={{ fontWeight: 900, letterSpacing: "-0.02em" }}>{c.title}</div>
              <p style={{ marginTop: 8 }}>{c.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Next" subtle>
        <div className="card" style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontWeight: 900, letterSpacing: "-0.02em" }}>
              Want the product view?
            </div>
            <p style={{ marginTop: 6 }}>
              See how ExRegs, ExClass, and ExAuth fit together.
            </p>
          </div>
          <div style={{ alignSelf: "center" }}>
            <Link
              href="/product"
              className="mono"
              style={{
                border: "1px solid rgba(15, 23, 42, 0.16)",
                padding: "10px 14px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.65)",
                boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
              }}
            >
              /product
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
