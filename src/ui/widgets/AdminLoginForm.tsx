"use client";

import * as React from "react";
import { Alert, Box, Paper, TextField, Typography } from "@mui/material";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";

import GlassIconButton from "@/src/ui/components/GlassIconButton";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

export default function AdminLoginForm({ nextPath }: { nextPath: string }) {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<Status>({ kind: "idle" });

  const requestLink = async () => {
    setStatus({ kind: "submitting" });
    try {
      const r = await fetch("/api/auth/admin/request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, next: nextPath }),
      });
      const j = (await r.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!r.ok || !j?.ok) {
        setStatus({ kind: "error", message: j?.error ?? "Request failed." });
        return;
      }
      setStatus({ kind: "sent" });
    } catch (e) {
      setStatus({ kind: "error", message: e instanceof Error ? e.message : "Unknown error" });
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, bgcolor: "background.paper" }}>
      <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
        Admin sign-in
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.6, lineHeight: 1.6 }}>
        Enter your admin email to receive a one-time login link.
      </Typography>

      <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <TextField
          fullWidth
          size="small"
          label="Admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <GlassIconButton
            icon={<LoginRoundedIcon />}
            tooltip="Send magic link"
            onClick={requestLink}
            disabled={status.kind === "submitting"}
            ariaLabel="Send login link"
          />
        </Box>

        {status.kind === "sent" ? (
          <Alert severity="success">Link sent (if the email is on the admin allowlist).</Alert>
        ) : null}
        {status.kind === "error" ? <Alert severity="error">{status.message}</Alert> : null}
      </Box>
    </Paper>
  );
}