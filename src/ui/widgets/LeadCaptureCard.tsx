"use client";

import * as React from "react";
import { Alert, Box, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

import TurnstileWidget from "@/src/ui/widgets/TurnstileWidget";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "ok" }
  | { kind: "error"; message: string };

export default function LeadCaptureCard({
  title,
  hint,
  source,
}: {
  title: string;
  hint: string;
  source: string;
}) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [token, setToken] = React.useState("");
  const [status, setStatus] = React.useState<Status>({ kind: "idle" });

  const submit = async () => {
    setStatus({ kind: "submitting" });
    try {
      if (!email.trim()) {
        setStatus({ kind: "error", message: "Please enter an email." });
        return;
      }
      if (!token && siteKey) {
        setStatus({ kind: "error", message: "Please complete the human check." });
        return;
      }

      // 1) Verify Turnstile and set the cookie.
      if (siteKey) {
        const vr = await fetch("/api/security/turnstile/verify", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const vj = (await vr.json().catch(() => null)) as any;
        if (!vr.ok || !vj?.ok) {
          setStatus({
            kind: "error",
            message:
              vj?.error ?? "Turnstile verification failed. Please refresh and try again.",
          });
          return;
        }
      }

      // 2) Submit lead.
      const lr = await fetch("/api/leads/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, message, source }),
      });

      const lj = (await lr.json().catch(() => null)) as any;
      if (!lr.ok || !lj?.ok) {
        setStatus({
          kind: "error",
          message: lj?.error ?? "Could not submit. Please try again.",
        });
        return;
      }

      setStatus({ kind: "ok" });
      setEmail("");
      setMessage("");
      setToken("");
    } catch (e) {
      setStatus({
        kind: "error",
        message: e instanceof Error ? e.message : "Unknown error",
      });
    }
  };

  return (
    <div className="heroPanel" aria-label={title}>
      <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "rgba(11, 15, 23, 0.65)", mt: 0.6, lineHeight: 1.6 }}
      >
        {hint}
      </Typography>

      <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1.4 }}>
        <TextField
          size="small"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <TextField
          size="small"
          label="What are you building? (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          multiline
          minRows={3}
        />

        <div>{siteKey ? <TurnstileWidget siteKey={siteKey} onToken={setToken} action={source} /> : null}</div>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="caption" sx={{ color: "rgba(11, 15, 23, 0.55)" }}>
            We’ll email you back. No spam.
          </Typography>

          <Tooltip title="Submit your email">
            <span>
              <IconButton
                onClick={submit}
                disabled={status.kind === "submitting"}
                aria-label="Submit lead"
                size="large"
                sx={{
                  border: "1px solid rgba(15, 23, 42, 0.16)",
                  borderRadius: 999,
                  background: "rgba(255, 255, 255, 0.65)",
                  "&:hover": { background: "rgba(255, 255, 255, 0.9)" },
                }}
              >
                <SendRoundedIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {status.kind === "ok" ? (
          <Alert severity="success">Thanks — we’ll follow up shortly.</Alert>
        ) : null}
        {status.kind === "error" ? (
          <Alert severity="error">{status.message}</Alert>
        ) : null}
      </Box>
    </div>
  );
}
