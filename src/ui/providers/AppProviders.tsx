"use client";

import * as React from "react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { themeOptions } from "@/src/customizations/theme";
import { CookieConsentProvider } from "@/src/ui/providers/CookieConsentProvider";

const theme = createTheme(themeOptions);

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CookieConsentProvider>{children}</CookieConsentProvider>
    </ThemeProvider>
  );
}