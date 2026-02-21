"use client";

import * as React from "react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
// IMPORTANT: keep YOUR existing AppRouterCacheProvider setup as-is
// import { AppRouterCacheProvider } from "@mui/material-nextjs/....";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0b0f17",     // dark html background
      paper: "#0f172a",       // surfaces
    },
    text: {
      primary: "#e5e7eb",
      secondary: "rgba(229, 231, 235, 0.72)",
    },
    divider: "rgba(148, 163, 184, 0.16)",
  },
  shape: { borderRadius: 18 },
  typography: {
    fontFamily:
      'var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
    button: { textTransform: "none", fontWeight: 650 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#0b0f17",
        },
      },
    },
    MuiTooltip: {
      defaultProps: { arrow: true },
    },
  },
});

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    // <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    // </AppRouterCacheProvider>
  );
}