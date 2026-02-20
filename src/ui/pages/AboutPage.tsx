import type { Metadata } from "next";

import { aboutCopy } from "@/src/customizations/copy";
import { siteMeta } from "@/src/customizations/site";
import Section from "@/src/ui/components/Section";
import AdminStripeOneDollarTest from "../widgets/AdminStripeOneDollarTest";

export const metadata: Metadata = {
  title: "About",
  description: aboutCopy.intro,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main style={{ padding: "20px 0 48px" }}>
      <div className="heroPanel">
        <div className="badge">Company</div>
        <h1 style={{ marginTop: 12 }}>{aboutCopy.title}</h1>
        <p style={{ fontSize: 16, marginTop: 12 }}>{aboutCopy.intro}</p>
      </div>

      <Section title="What we believe">
        <div className="card">
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8, color: "rgba(11, 15, 23, 0.78)" }}>
            {aboutCopy.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      </Section>

      <Section title="Contact" subtle>
        <div className="card">
          <div style={{ fontWeight: 900, letterSpacing: "-0.02em" }}>Address</div>
          <p style={{ marginTop: 6 }}>{siteMeta.addressLine}</p>

          <div style={{ marginTop: 14, fontWeight: 900, letterSpacing: "-0.02em" }}>Email</div>
          <p style={{ marginTop: 6 }}>
            <span className="mono">{siteMeta.salesEmail}</span>
          </p>

          <div className="hr" style={{ margin: "14px 0" }} />
          <p>{aboutCopy.closing}</p>
        </div>
      </Section>
      <Section title="Stripe test" subtle>
        <div className="card">
          <AdminStripeOneDollarTest />
        </div>
      </Section>
    </main>
  );
}
