import type { Metadata } from "next";

import { logsCopy } from "@/src/customizations/copy";
import { linkedInConfig } from "@/src/customizations/linkedin";
import Section from "@/src/ui/components/Section";

export const metadata: Metadata = {
  title: "Daily logs",
  description: logsCopy.intro,
  alternates: { canonical: "/logs" },
};

export default function LogsPage() {
  const embeds = linkedInConfig.embedUrls;

  return (
    <main style={{ padding: "20px 0 48px" }}>
      <div className="heroPanel">
        <div className="badge">CEO feed</div>
        <h1 style={{ marginTop: 12 }}>{logsCopy.title}</h1>
        <p style={{ fontSize: 16, marginTop: 12 }}>{logsCopy.intro}</p>
        <p style={{ marginTop: 10 }} className="small">
          Profile: <a className="mono" href={linkedInConfig.profileUrl}>{linkedInConfig.profileUrl}</a>
        </p>
      </div>

      <Section title="Posts">
        {embeds.length === 0 ? (
          <div className="card">
            <div style={{ fontWeight: 900, letterSpacing: "-0.02em" }}>No embeds configured.</div>
            <p style={{ marginTop: 8 }}>{logsCopy.note}</p>
            <p style={{ marginTop: 10 }} className="mono small">
              LINKEDIN_EMBED_URLS=&quot;https://www.linkedin.com/embed/feed/update/urn:li:share:...&quot;
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
            {embeds.map((src) => (
              <div key={src} className="card" style={{ padding: 0, overflow: "hidden" }}>
                <iframe
                  className="responsiveEmbed"
                  src={src}
                  height={620}
                  loading="lazy"
                  title="LinkedIn post"
                />
              </div>
            ))}
          </div>
        )}
      </Section>
    </main>
  );
}
