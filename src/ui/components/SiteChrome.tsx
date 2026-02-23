"use client";

import * as React from "react";
import Link from "next/link";
import { Box, Button, Container, Divider, Paper, Stack, Typography } from "@mui/material";

import BrandLogo from "@/src/ui/components/BrandLogo";
import { NAV_ITEMS, siteMeta } from "@/src/customizations/site";
import CookieConsentBanner from "../widgets/CookieConsentBanner";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth="lg" sx={{ py: 2 }}>
                <Paper
          variant="outlined"
          sx={{
            p: { xs: 1.25, sm: 1.5 },
            bgcolor: "common.white",
            color: "grey.900",
            borderColor: "grey.200",
            backgroundImage: "none", // IMPORTANT: override global MuiPaper blue tint
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            spacing={2}
          >
            <BrandLogo />

            <Stack component="nav" direction="row" spacing={1} sx={{ flexWrap: "wrap" }} aria-label="Primary">
              {NAV_ITEMS.map((it) => (
                <Button
                  key={it.href}
                  component={Link}
                  href={it.href}
                  prefetch={it.href === "/logs" ? false : undefined}
                  size="small"
                  color="inherit"
                  sx={{ opacity: 0.8, "&:hover": { opacity: 1 } }}
                >
                  {it.label}
                </Button>
              ))}
            </Stack>
          </Stack>
        </Paper>

        {siteMeta.heroBanner?.enabled ? (
          <Paper
            variant="outlined"
            sx={{
              mt: 2,
              px: 2,
              py: 1,
              bgcolor: "action.selected",
              backdropFilter: "blur(10px)",
              borderColor: "divider",
            }}
          >
            <Typography
              sx={{
                fontWeight: 850,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "text.secondary",
                lineHeight: 5.0,
              }}
            >
              {siteMeta.heroBanner.message}
            </Typography>
          </Paper>
        ) : null}

        <Box component="main" sx={{ mt: 3 }}>
          {children}
          <CookieConsentBanner />
        </Box>

        <Divider sx={{ mt: 6, mb: 2, opacity: 0.2 }} />

        <Box component="footer" sx={{ pb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {new Date().getFullYear()} {siteMeta.brand} — {siteMeta.addressLine}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            <span style={{ fontFamily: "var(--font-geist-mono)" }}>{siteMeta.salesEmail}</span>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}