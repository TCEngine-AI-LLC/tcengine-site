"use client";

import * as React from "react";
import {
  Alert,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ShoppingCartCheckoutRoundedIcon from "@mui/icons-material/ShoppingCartCheckoutRounded";
import GlassIconButton from "@/src/ui/components/GlassIconButton";

import type { ConsultingPlanId } from "@/src/customizations/pricing";
import TurnstileWidget from "@/src/ui/widgets/TurnstileWidget";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; message: string };

export default function PricingCheckout({
  planId,
  label,
}: {
  planId: ConsultingPlanId;
  label: string;
}) {
  type ApiResponse = { ok?: boolean; error?: string };
  type CheckoutResponse = { ok?: boolean; error?: string; url?: string };
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [token, setToken] = React.useState("");
  const [status, setStatus] = React.useState<Status>({ kind: "idle" });

  const close = () => {
    setOpen(false);
    setStatus({ kind: "idle" });
  };

  const startCheckout = async () => {
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

      // Verify Turnstile -> sets cookie.
      if (siteKey) {
        const vr = await fetch("/api/security/turnstile/verify", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const vj = (await vr.json().catch(() => null)) as ApiResponse | null;
        if (!vr.ok || !vj?.ok) {
          setStatus({
            kind: "error",
            message: vj?.error ?? "Human verification failed. Please retry.",
          });
          return;
        }
      }

      const r = await fetch("/api/billing/create-checkout-session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, planId }),
      });
      const j = (await r.json().catch(() => null)) as CheckoutResponse | null;

      if (!r.ok || !j?.ok || typeof j.url !== "string") {
        setStatus({
          kind: "error",
          message:
            j?.error ??
            (r.status === 403
              ? "Please verify you are human and retry."
              : "Could not start checkout. Please try again."),
        });
        return;
      }

      if (typeof window !== "undefined") {
        window.location.href = j.url;
      }
    } catch (e) {
      setStatus({
        kind: "error",
        message: e instanceof Error ? e.message : "Unknown error",
      });
    }
  };

  return (
    <>
      <GlassIconButton
        icon={<ShoppingCartCheckoutRoundedIcon />}
        tooltip={`Purchase: ${label}`}
        onClick={() => setOpen(true)}
        ariaLabel={`Purchase ${label}`}
      />

      <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800 }}>
          Checkout — {label}
          <Tooltip title="Close">
            <IconButton
              onClick={close}
              aria-label="Close"
              sx={{ position: "absolute", right: 10, top: 10, color: "text.secondary" }}
            >
              <CloseRoundedIcon />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              We’ll send a receipt to this email and follow up about scheduling.
            </Typography>
            <TextField
              size="small"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            {siteKey ? (
              <TurnstileWidget
                siteKey={siteKey}
                onToken={setToken}
                action={`checkout_${planId}`}
              />
            ) : null}

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <Tooltip title="Proceed to Stripe Checkout">
                <span>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                    <GlassIconButton
                      icon={<ShoppingCartCheckoutRoundedIcon />}
                      tooltip="Proceed to Stripe Checkout"
                      onClick={startCheckout}
                      disabled={status.kind === "submitting"}
                      ariaLabel="Proceed to checkout"
                    />
                  </Box>
                </span>
              </Tooltip>
            </Box>

            {status.kind === "error" ? (
              <Alert severity="error">{status.message}</Alert>
            ) : null}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
