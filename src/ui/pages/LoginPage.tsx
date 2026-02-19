import type { Metadata } from "next";

import AdminLoginForm from "@/src/ui/widgets/AdminLoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Admin sign-in via email magic link.",
  robots: { index: false, follow: false },
};

export default function LoginPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const nextPathRaw = searchParams?.next;
  const nextPath =
    typeof nextPathRaw === "string" && nextPathRaw.startsWith("/")
      ? nextPathRaw
      : "/admin";

  return (
    <main style={{ padding: "20px 0 48px" }}>
      <AdminLoginForm nextPath={nextPath} />
    </main>
  );
}
