import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // Clickjacking defense
  { key: "X-Frame-Options", value: "DENY" },

  // Turn on HSTS once tcengine.com is definitely HTTPS-only everywhere:
  // { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,

  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      {
        source: "/(admin|login|verify-human)(.*)",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
    ];
  },
};

export default nextConfig;