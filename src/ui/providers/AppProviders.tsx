// src/ui/providers/AppProviders.tsx
"use client";

import * as React from "react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const HERO_BG_IMAGE = "/bg/Hero-Zero-Emission-Passenger-Plane.jpg"; // <-- you add this file under /public/bg/

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#7BA6FF", light: "#A9C3FF", dark: "#4F7DFF" },
    secondary: { main: "#A78BFA" },
    background: {
      default: "transparent",
      paper: "rgba(10, 16, 39, 0.78)",
    },
    text: {
      primary: "#F8FAFC",
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
        html: { colorScheme: "dark" },

        body: {
          margin: 0,
          color: "#F8FAFC",

          // Create a stacking context so body::before can sit behind all content safely
          position: "relative",
          isolation: "isolate",

          // Base sky background (your existing gradient)
          backgroundColor: "#050717",
          backgroundImage: `
            radial-gradient(1100px 700px at 14% 12%, rgba(91, 86, 189, 0.34), transparent 60%),
            radial-gradient(950px 650px at 86% 18%, rgba(73, 111, 255, 0.26), transparent 58%),
            linear-gradient(180deg, #070A1D 0%, #050717 55%, #04040C 100%)
          `,
          backgroundAttachment: "fixed",
        },

        // Faint “mission” image layer (aircraft / rocket), behind everything
        "body::before": {
          content: '""',
          position: "fixed",
          inset: 0,
          zIndex: -1,
          pointerEvents: "none",

          backgroundImage: `url(${HERO_BG_IMAGE})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center 20%",
          backgroundSize: "cover",

          // Make it subtle + legible
          opacity: 0.30,
          filter: "grayscale(35%) contrast(110%) saturate(120%)",
        },

        // Optional: selection highlight
        "::selection": { backgroundColor: "rgba(123, 166, 255, 0.32)" },

        a: { color: "inherit", textDecoration: "none" },
      },
    },

    MuiTooltip: { defaultProps: { arrow: true } },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage:
            "linear-gradient(180deg, rgba(123,166,255,0.06) 0%, rgba(123,166,255,0.00) 42%)",
          borderColor: "rgba(140, 170, 255, 0.14)",
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: "rgba(140, 170, 255, 0.16)" },
      },
    },
  },
});

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}