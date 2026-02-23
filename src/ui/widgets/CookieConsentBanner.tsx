"use client";

import * as React from "react";
import { Box, Link as MuiLink, Typography } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { cookieConsentCopy } from "@/src/customizations/consent";
import Surface from "@/src/ui/components/Surface";
import ActionIconButton from "@/src/ui/components/ActionIconButton";
import { useCookieConsent } from "@/src/ui/providers/CookieConsentProvider";

export default function CookieConsentBanner() {
  const { consent, acceptAll, rejectNonEssential } = useCookieConsent();

  // already decided => no banner
  if (consent) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        left: 16,
        right: 16,
        bottom: 16,
        zIndex: 1400,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <Surface
        sx={{
          width: "min(980px, 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          pointerEvents: "auto",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 850 }}>Cookies</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            {cookieConsentCopy.message}{" "}
            <MuiLink href={cookieConsentCopy.learnMoreHref} underline="always">
              Learn more
            </MuiLink>
            .
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <ActionIconButton
            tooltip="Reject non-essential cookies"
            aria-label="Reject non-essential cookies"
            onClick={rejectNonEssential}
          >
            <CloseRoundedIcon />
          </ActionIconButton>

          <ActionIconButton
            tooltip="Accept cookies"
            aria-label="Accept cookies"
            onClick={acceptAll}
          >
            <CheckRoundedIcon />
          </ActionIconButton>
        </Box>
      </Surface>
    </Box>
  );
}