"use client";

import * as React from "react";
import { Alert, Box, Typography } from "@mui/material";

import TurnstileWidget from "@/src/ui/widgets/TurnstileWidget";
import Surface from "@/src/ui/components/Surface";

type Status =
  | { kind: "idle" }
  | { kind: "verifying" }
  | { kind: "ok" }
  | { kind: "error"; message: string };

export default function VerifyHumanClient({ nextPath }: { nextPath: string }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  const [token, setToken] = React.useState("");
  const [status, setStatus] = React.useState<Status>({ kind: "idle" });

  React.useEffect(() => {
    if (!token) return;

    const run = async () => {
      setStatus({ kind: "verifying" });
      try {
        const r = await fetch("/api/security/turnstile/verify", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const j = (await r.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
        if (!r.ok || !j?.ok) {
          setStatus({ kind: "error", message: j?.error ?? "Verification failed. Please retry." });
          return;
        }
        setStatus({ kind: "ok" });
        window.location.href = nextPath;
      } catch (e) {
        setStatus({ kind: "error", message: e instanceof Error ? e.message : "Unknown error" });
      }
    };

    void run();
  }, [nextPath, token]);

  return (
    <Box component="main" sx={{ py: 2, pb: 6 }}>
      <Surface>
        <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: "-0.02em" }}>
          Verify you’re human
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
          This prevents bot spam and protects our checkout + inbox.
        </Typography>

        <Box sx={{ mt: 2 }}>
          {siteKey ? <TurnstileWidget siteKey={siteKey} onToken={setToken} action="verify_human" /> : null}
        </Box>

        <Box sx={{ mt: 2 }}>
          {status.kind === "verifying" ? <Alert severity="info">Verifying…</Alert> : null}
          {status.kind === "error" ? <Alert severity="error">{status.message}</Alert> : null}
        </Box>
      </Surface>
    </Box>
  );
}