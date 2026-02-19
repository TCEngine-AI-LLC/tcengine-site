"use client";

import * as React from "react";
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: "light",
          primary: { main: "#0b0f17" },
          background: {
            default: "#f7f8fa",
            paper: "#ffffff",
          },
        },
        shape: { borderRadius: 16 },
        typography: {
          fontFamily:
            "var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        },
        components: {
          MuiTooltip: {
            defaultProps: { arrow: true },
          },
        },
      }),
    []
  );

  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
