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
        const vj = (await vr.json().catch(() => null)) as any;
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
      const j = (await r.json().catch(() => null)) as any;

      if (!r.ok || !j?.ok) {
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
        window.location.href = j.url as string;
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
      <Tooltip title={`Purchase: ${label}`}>
        <IconButton
          aria-label={`Purchase ${label}`}
          onClick={() => setOpen(true)}
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
      </Tooltip>

      <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800 }}>
          Checkout — {label}
          <IconButton
            onClick={close}
            aria-label="Close"
            sx={{ position: "absolute", right: 10, top: 10 }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Typography variant="body2" sx={{ color: "rgba(11, 15, 23, 0.65)" }}>
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
                  <IconButton
                    onClick={startCheckout}
                    disabled={status.kind === "submitting"}
                    aria-label="Proceed to checkout"
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
