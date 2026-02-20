import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import AppProviders from "@/src/ui/providers/AppProviders";
import { NAV_ITEMS, siteMeta } from "@/src/customizations/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteMeta.url),
  title: {
    default: siteMeta.title,
    template: `%s | ${siteMeta.brand}`,
  },
  description: siteMeta.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteMeta.url,
    title: siteMeta.title,
    description: siteMeta.description,
  },
  twitter: {
    card: "summary",
    title: siteMeta.title,
    description: siteMeta.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteMeta.url}/#organization`,
        name: siteMeta.brand,
        url: siteMeta.url,
        description: siteMeta.description,
        sameAs: [siteMeta.ceoLinkedIn],
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "sales",
            email: siteMeta.salesEmail,
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteMeta.url}/#website`,
        url: siteMeta.url,
        name: siteMeta.title,
        description: siteMeta.description,
        publisher: { "@id": `${siteMeta.url}/#organization` },
      },
    ],
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppProviders>
          <div className="container">
            <header
              style={{
                position: "relative",
                padding: "18px 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              <Link href="/" className="brandMark" aria-label="TC Engine home">
                <span>{siteMeta.brand}</span>
              </Link>

              <nav className="topNav" aria-label="Primary">
                {NAV_ITEMS.map((it) => (
                  <Link key={it.href} href={it.href}>
                    {it.label}
                  </Link>
                ))}
              </nav>
            </header>

            {children}

            <footer className="hr" style={{ marginTop: 40, paddingTop: 18 }}>
              <div style={{ color: "rgba(11, 15, 23, 0.65)", fontSize: 13, lineHeight: 1.6 }}>
                © {new Date().getFullYear()} {siteMeta.brand} • {siteMeta.addressLine}
                <div style={{ marginTop: 6 }}>
                  <span className="mono">{siteMeta.salesEmail}</span>
                </div>
              </div>
            </footer>
          </div>

          <script
            type="application/ld+json"
             
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </AppProviders>
      </body>
    </html>
  );
}
