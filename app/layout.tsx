import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter"; // Next 16

import "./globals.css";

import AppProviders from "@/src/ui/providers/AppProviders";
import SiteChrome from "@/src/ui/components/SiteChrome";
import { siteMeta } from "@/src/customizations/site";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteMeta.url),
  title: { default: siteMeta.title, template: `%s | ${siteMeta.brand}` },
  description: siteMeta.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteMeta.url,
    title: siteMeta.title,
    description: siteMeta.description,
  },
  twitter: { card: "summary", title: siteMeta.title, description: siteMeta.description },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        contactPoint: [{ "@type": "ContactPoint", contactType: "sales", email: siteMeta.salesEmail }],
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
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <AppProviders>
            <SiteChrome>{children}</SiteChrome>

            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
          </AppProviders>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}