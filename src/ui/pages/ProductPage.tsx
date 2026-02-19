import type { Metadata } from "next";

import { productCopy } from "@/src/customizations/copy";
import { siteMeta } from "@/src/customizations/site";
import Section from "@/src/ui/components/Section";

export const metadata: Metadata = {
  title: "What our product does",
  description: productCopy.intro,
  alternates: { canonical: "/product" },
};

export default function ProductPage() {
  return (
    <main style={{ padding: "20px 0 48px" }}>
      <div className="heroPanel">
        <div className="badge">Product</div>
        <h1 style={{ marginTop: 12 }}>{productCopy.title}</h1>
        <p style={{ fontSize: 16, marginTop: 12 }}>{productCopy.intro}</p>
      </div>

      {productCopy.sections.map((s) => (
        <Section key={s.title} title={s.title}>
          <div className="card">
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8, color: "rgba(11, 15, 23, 0.78)" }}>
              {s.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        </Section>
      ))}

      <Section title="Architecture" subtle>
        <div className="card">
          <p style={{ color: "rgba(11, 15, 23, 0.75)" }}>{productCopy.architectureNote}</p>
        </div>
      </Section>

      <Section title="Talk to us" subtle>
        <div className="card">
          <p>
            For product questions, email <span className="mono">{siteMeta.salesEmail}</span>.
          </p>
          <p style={{ marginTop: 10 }}>
            If you want consulting to unblock a decision quickly, see <a href="/pricing" className="mono">/pricing</a>.
          </p>
        </div>
      </Section>
    </main>
  );
}
