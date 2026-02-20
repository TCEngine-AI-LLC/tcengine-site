import Link from "next/link";
import { siteMeta } from "@/src/customizations/site";

export default function BrandLogo() {
  return (
    <Link
      href="/"
      aria-label="Home"
      title="Home"
      style={{ display: "inline-flex", alignItems: "center" }}
    >
      <img
        src={siteMeta.logo.src}
        alt={siteMeta.logo.alt}
        style={{
          height: siteMeta.logo.height,
          width: "auto",
          display: "block",
        }}
      />
    </Link>
  );
}