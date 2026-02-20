"use client";

import * as React from "react";
import { Alert, IconButton, Tooltip } from "@mui/material";
import ShoppingCartCheckoutRoundedIcon from "@mui/icons-material/ShoppingCartCheckoutRounded";

type ApiResp = { ok?: boolean; url?: string; error?: string };

export default function AdminStripeOneDollarTestButton() {
  const [err, setErr] = React.useState<string>("");

  const run = async () => {
    setErr("");
    try {
      const r = await fetch("/api/admin/stripe/one-dollar-test", { method: "POST" });
      const j = (await r.json().catch(() => null)) as ApiResp | null;

      if (!r.ok || !j?.ok || typeof j.url !== "string") {
        setErr(j?.error ?? "Could not start Stripe test checkout.");
        return;
      }

      window.location.href = j.url;
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Unknown error");
    }
  };

  return (
    <div>
      <Tooltip title="Run $1 Stripe Checkout test (admin-only)">
        <span>
          <IconButton
            onClick={run}
            aria-label="Run $1 Stripe test checkout"
            size="large"
            sx={{
              border: "1px solid rgba(15, 23, 42, 0.16)",
              borderRadius: 999,
              background: "rgba(255, 255, 255, 0.65)",
              "&:hover": { background: "rgba(255, 255, 255, 0.9)" },
            }}
          >
            <ShoppingCartCheckoutRoundedIcon />
          </IconButton>
        </span>
      </Tooltip>

      {err ? <Alert severity="error" sx={{ mt: 1 }}>{err}</Alert> : null}
    </div>
  );
}