export type NavItem = {
  label: string;
  href: string;
};

const normalizeUrl = (url: string) => url.replace(/\/$/, "");

export const siteMeta = {
  brand: "TC Engine",
  title: "AI Export Management Engine",
  description:
    "Disrupt your compliance workflow with deterministic logic, export control graphs, and AI-driven policy automation.",
  url: normalizeUrl(
    process.env.NEXT_PUBLIC_APP_URL ??
      process.env.PUBLIC_BASE_URL ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      "https://tcengine.com"
  ),
  salesEmail:
    process.env.NEXT_PUBLIC_SALES_EMAIL ??
    process.env.CONTACT_TO_EMAIL ??
    "info@tcengine.com",
  addressLine: process.env.NEXT_PUBLIC_ADDRESS_LINE ??
    "201 W Main St., Fort Wayne, IN 46802, United States",
  // Used only for schema.org JSON-LD. Override in env if you want your CEO profile instead.
  ceoLinkedIn:
    process.env.NEXT_PUBLIC_CEO_LINKEDIN ??
    "https://www.linkedin.com/company/trade-collaboration-engine/",
  
  logo: {
    src: "/tcengine.png",
    alt: "TC Engine",
    height: 26, // tweak if you want (24–32 usually looks right)
  },
} as const;

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "What our product does", href: "/product" },
  { label: "Consulting pricing", href: "/pricing" },
  { label: "Daily logs", href: "/logs" },
  { label: "About", href: "/about" },
];
