import type { Metadata } from "next";

import { pricingCopy } from "@/src/customizations/copy";
import Section from "@/src/ui/components/Section";
import PricingCheckout from "@/src/ui/widgets/PricingCheckout";

export const metadata: Metadata = {
  title: "Consulting pricing",
  description: pricingCopy.intro,
  alternates: { canonical: "/pricing" },
};

export default async function PricingPage({
  searchParams,
}: {
  searchParams?:
    | Record<string, string | string[] | undefined>
    | Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await Promise.resolve(searchParams);
  const success = typeof sp?.success === "string" ? sp.success : "";

  return (
    <main style={{ padding: "20px 0 48px" }}>
      <div className="heroPanel">
        <div className="badge">Consulting</div>
        <h1 style={{ marginTop: 12 }}>{pricingCopy.title}</h1>
        <p style={{ fontSize: 16, marginTop: 12 }}>{pricingCopy.intro}</p>
        {success === "1" ? (
          <div style={{ marginTop: 14 }} className="card">
            <div style={{ fontWeight: 900, letterSpacing: "-0.02em" }}>Payment received.</div>
            <p style={{ marginTop: 6 }}>
              Thanks — we’ll follow up to schedule the engagement.
            </p>
          </div>
        ) : null}
      </div>

      <Section title="Plans">
        <div className="grid2">
          {pricingCopy.plans.map((p) => (
            <div key={p.id} className="card" style={{ position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 900, letterSpacing: "-0.02em", fontSize: 18 }}>
                    {p.title}
                  </div>
                  <p style={{ marginTop: 6 }}>{p.subtitle}</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                  <div style={{ fontWeight: 950, fontSize: 18 }}>{p.priceLabel}</div>
                  <PricingCheckout planId={p.id} label={p.title} />
                </div>
              </div>

              <div className="hr" style={{ margin: "14px 0" }} />
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8, color: "rgba(11, 15, 23, 0.78)" }}>
                {p.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title={pricingCopy.howItWorks.title}>
        <div className="card">
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8, color: "rgba(11, 15, 23, 0.78)" }}>
            {pricingCopy.howItWorks.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      </Section>

      <Section title="Notes" subtle>
        <div className="card">
          <p>{pricingCopy.finePrint}</p>
          <p style={{ marginTop: 12 }}>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            If checkout is blocked, go to <a className="mono" href="/verify-human?next=%2Fpricing">/verify-human</a>.
          </p>
        </div>
      </Section>
    </main>
  );
}
