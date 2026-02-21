import type { Metadata } from "next";

import { logsCopy } from "@/src/customizations/copy";
import { linkedInConfig } from "@/src/customizations/linkedin";
import Section from "@/src/ui/components/Section";

export const metadata: Metadata = {
  title: "Daily logs",
  description: logsCopy.intro,
  alternates: { canonical: "/logs" },
};

function isLinkedInEmbedUrl(url: string) {
  // LinkedIn blocks framing normal post URLs via frame-ancestors CSP.
  // Only allow official embed endpoints.
  return /^https:\/\/www\.linkedin\.com\/embed\//.test(url);
}

export default function LogsPage() {
  const urls = linkedInConfig.embedUrls;
  const embedUrls = urls.filter(isLinkedInEmbedUrl);
  const nonEmbedUrls = urls.filter((u) => !isLinkedInEmbedUrl(u));

  return (
    <main style={{ padding: "20px 0 48px" }}>
      <div className="heroPanel">
        <div className="badge">CEO feed</div>
        <h1 style={{ marginTop: 12 }}>{logsCopy.title}</h1>
        <p style={{ fontSize: 16, marginTop: 12 }}>{logsCopy.intro}</p>
        <p style={{ marginTop: 10 }} className="small">
          Profile:{" "}
          <a className="mono" href={linkedInConfig.profileUrl} target="_blank" rel="noreferrer">
            {linkedInConfig.profileUrl}
          </a>
        </p>
      </div>

      <Section title="Posts">
        {urls.length === 0 ? (
          <div className="card">
            <div style={{ fontWeight: 900, letterSpacing: "-0.02em" }}>No LinkedIn URLs configured.</div>
            <p style={{ marginTop: 8 }}>{logsCopy.note}</p>
            <p style={{ marginTop: 10 }} className="mono small">
              LINKEDIN_EMBED_URLS=&quot;https://www.linkedin.com/embed/feed/update/urn:li:share:...&quot;
            </p>
          </div>
        ) : (
          <>
            {nonEmbedUrls.length > 0 ? (
              <div className="card" style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 900, letterSpacing: "-0.02em" }}>
                  Some URLs can’t be embedded
                </div>
                <p style={{ marginTop: 8 }}>
                  LinkedIn blocks framing normal post URLs via CSP (<span className="mono">frame-ancestors</span>).
                  Use LinkedIn <span className="mono">/embed/…</span> URLs to render iframes.
                </p>
                <ul style={{ margin: "10px 0 0", paddingLeft: 18, lineHeight: 1.8 }}>
                  {nonEmbedUrls.map((u) => (
                    <li key={u}>
                      <a className="mono" href={u} target="_blank" rel="noreferrer">
                        {u}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {embedUrls.length === 0 ? (
              <div className="card">
                <div style={{ fontWeight: 900, letterSpacing: "-0.02em" }}>No valid embed URLs found.</div>
                <p style={{ marginTop: 8 }}>
                  Add LinkedIn embed URLs (not <span className="mono">/posts/…</span> URLs) to{" "}
                  <span className="mono">LINKEDIN_EMBED_URLS</span>.
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
                {embedUrls.map((src) => (
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
          </>
        )}
      </Section>
    </main>
  );
}