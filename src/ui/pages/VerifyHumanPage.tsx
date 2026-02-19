import type { Metadata } from "next";

import VerifyHumanClient from "@/src/ui/widgets/VerifyHumanClient";

export const metadata: Metadata = {
  title: "Verify",
  description: "Human verification",
  robots: { index: false, follow: false },
};

export default function VerifyHumanPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const nextRaw = searchParams?.next;
  const nextPath =
    typeof nextRaw === "string" && nextRaw.startsWith("/") ? nextRaw : "/";

  return <VerifyHumanClient nextPath={nextPath} />;
}
