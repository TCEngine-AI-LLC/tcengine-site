"use client";

import * as React from "react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// IMPORTANT: keep YOUR existing AppRouterCacheProvider setup as-is
// import { AppRouterCacheProvider } from "@mui/material-nextjs/....";

const theme = createTheme({
  palette: {
    mode: "dark",

    // Accent: "sky blue" that still feels defense-grade.
    primary: {
      main: "#7BA6FF",
      light: "#A9C3FF",
      dark: "#4F7DFF",
    },
    // Optional secondary (subtle violet that matches your sky tones)
    secondary: {
      main: "#A78BFA",
    },

    // IMPORTANT:
    // We set background.default to transparent so SiteChrome's
    // `bgcolor: background.default` doesn't cover the global sky gradient.
    background: {
      default: "transparent",
      // Paper surfaces should be slightly translucent so the sky peeks through.
      paper: "rgba(10, 16, 39, 0.78)",
    },

    text: {
      primary: "#F8FAFC", // near-white, very legible
      secondary: "rgba(248, 250, 252, 0.72)",
    },

    divider: "rgba(140, 170, 255, 0.16)",
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
        html: {
          // Helps scrollbars + native controls match dark mode.
          colorScheme: "dark",
        },
        body: {
          margin: 0,
          color: "#F8FAFC",

          // "Defense sky" background:
          // - 2 soft radial glows (blue + violet)
          // - a deep vertical gradient to near-black
          backgroundColor: "#050717",
          backgroundImage: `
            radial-gradient(1100px 700px at 14% 12%, rgba(91, 86, 189, 0.34), transparent 60%),
            radial-gradient(950px 650px at 86% 18%, rgba(73, 111, 255, 0.26), transparent 58%),
            linear-gradient(180deg, #070A1D 0%, #050717 55%, #04040C 100%)
          `,
          backgroundAttachment: "fixed",
        },

        // Optional: nice selection highlight
        "::selection": {
          backgroundColor: "rgba(123, 166, 255, 0.32)",
        },

        a: {
          color: "inherit",
          textDecoration: "none",
        },
      },
    },

    MuiTooltip: {
      defaultProps: { arrow: true },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          // Subtle top sheen for "panel" feel
          backgroundImage:
            "linear-gradient(180deg, rgba(123,166,255,0.06) 0%, rgba(123,166,255,0.00) 42%)",
          borderColor: "rgba(140, 170, 255, 0.14)",
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "rgba(140, 170, 255, 0.16)",
        },
      },
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