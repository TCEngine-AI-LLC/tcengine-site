"use client";

import * as React from "react";
import { Alert, Box, IconButton, Tooltip, Typography } from "@mui/material";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; message: string };

export default function AdminStripeOneDollarTest() {
  const [status, setStatus] = React.useState<Status>({ kind: "idle" });

  const run = async () => {
    setStatus({ kind: "submitting" });
    try {
      const r = await fetch("/api/admin/stripe/one-dollar-test", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      });

      const j = (await r.json().catch(() => null)) as
        | { ok?: boolean; url?: string; error?: string }
        | null;

      if (!r.ok || !j?.ok || typeof j.url !== "string") {
        setStatus({ kind: "error", message: j?.error ?? "Failed to start test checkout." });
        return;
      }

      window.location.href = j.url;
    } catch (e) {
      setStatus({
        kind: "error",
        message: e instanceof Error ? e.message : "Unknown error",
      });
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
      <Tooltip title="Run Stripe end-to-end test checkout ($1)">
        <span>
          <IconButton
            onClick={run}
            disabled={status.kind === "submitting"}
            aria-label="Run $1 Stripe test checkout"
            size="large"
            sx={{
              border: "1px solid rgba(15, 23, 42, 0.16)",
              borderRadius: 999,
              background: "rgba(255, 255, 255, 0.65)",
              "&:hover": { background: "rgba(255, 255, 255, 0.9)" },
            }}
          >
            <ScienceRoundedIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Typography variant="body2" sx={{ fontWeight: 700, color: "rgba(11, 15, 23, 0.75)" }}>
        $1 Stripe test checkout (admin)
      </Typography>

      {status.kind === "error" ? <Alert severity="error">{status.message}</Alert> : null}
    </Box>
  );
}