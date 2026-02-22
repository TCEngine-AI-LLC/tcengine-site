"use client";

import * as React from "react";
import { Alert } from "@mui/material";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string | number;
      remove?: (widgetId: string | number) => void;
      reset?: (widgetId?: string | number) => void;
    };
  }
}

export default function TurnstileWidget({
  siteKey,
  onToken,
  action,
  theme = "dark",
}: {
  siteKey: string;
  onToken: (token: string) => void;
  action?: string;
  theme?: "light" | "dark";
}) {
  const mountRef = React.useRef<HTMLDivElement | null>(null);
  const widgetIdRef = React.useRef<string | number | null>(null);
  const [scriptReady, setScriptReady] = React.useState(false);

  React.useEffect(() => {
    if (!siteKey) return;

    const existing = document.getElementById("cf-turnstile-script");
    if (existing) {
      setScriptReady(true);
      return;
    }

    const s = document.createElement("script");
    s.id = "cf-turnstile-script";
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.defer = true;
    s.onload = () => setScriptReady(true);
    s.onerror = () => setScriptReady(false);
    document.head.appendChild(s);
  }, [siteKey]);

  React.useEffect(() => {
    if (!scriptReady) return;
    if (!mountRef.current) return;
    if (!window.turnstile?.render) return;

    if (widgetIdRef.current && window.turnstile.remove) {
      try {
        window.turnstile.remove(widgetIdRef.current);
      } catch {
        // ignore
      }
      widgetIdRef.current = null;
    }

    const widgetId = window.turnstile.render(mountRef.current, {
      sitekey: siteKey,
      theme,
      action,
      callback: (token: string) => onToken(token),
      "expired-callback": () => onToken(""),
      "error-callback": () => onToken(""),
    });

    widgetIdRef.current = widgetId;

    return () => {
      if (widgetIdRef.current && window.turnstile?.remove) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
      }
      widgetIdRef.current = null;
    };
  }, [action, onToken, scriptReady, siteKey, theme]);

  if (!siteKey) {
    return (
      <Alert severity="warning">
        Missing <code>NEXT_PUBLIC_TURNSTILE_SITE_KEY</code>.
      </Alert>
    );
  }

  return <div ref={mountRef} />;
}