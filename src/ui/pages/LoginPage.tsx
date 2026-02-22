import type { Metadata } from "next";
import { Box } from "@mui/material";

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
    <Box component="main" sx={{ py: 2, pb: 6 }}>
      <AdminLoginForm nextPath={nextPath} />
    </Box>
  );
}