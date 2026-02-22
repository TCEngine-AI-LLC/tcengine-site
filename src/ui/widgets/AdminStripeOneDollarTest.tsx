"use client";

import * as React from "react";
import { Alert, IconButton, Tooltip } from "@mui/material";
import ShoppingCartCheckoutRoundedIcon from "@mui/icons-material/ShoppingCartCheckoutRounded";
import GlassIconButton from "../components/GlassIconButton";

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
          <GlassIconButton
            icon={<ShoppingCartCheckoutRoundedIcon />}
            tooltip="Run $1 Stripe Checkout test (admin-only)"
            onClick={run}
            ariaLabel="Run $1 Stripe test checkout"
          />
        </span>
      </Tooltip>

      {err ? <Alert severity="error" sx={{ mt: 1 }}>{err}</Alert> : null}
    </div>
  );
}