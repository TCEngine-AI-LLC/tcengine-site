"use client";

import * as React from "react";
import { COOKIE_CONSENT_COOKIE, type CookieConsentState } from "@/src/customizations/consent";

type Ctx = {
  consent: CookieConsentState | null; // null = not decided
  acceptAll: () => void;
  rejectNonEssential: () => void;
  setMarketing: (v: boolean) => void;
};

const CookieConsentContext = React.createContext<Ctx | null>(null);

function readCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

function writeConsent(consent: CookieConsentState) {
  const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
  const maxAge = 60 * 60 * 24 * 180; // 180 days

  const val = encodeURIComponent(JSON.stringify(consent));
  document.cookie =
    `${COOKIE_CONSENT_COOKIE}=${val}; Path=/; Max-Age=${maxAge}; SameSite=Lax` +
    (isSecure ? "; Secure" : "");
}

function parseConsent(raw: string): CookieConsentState | null {
  try {
    const j = JSON.parse(raw) as CookieConsentState;
    if (!j || j.v !== 1 || typeof j.marketing !== "boolean" || typeof j.ts !== "number") return null;
    return j;
  } catch {
    return null;
  }
}

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = React.useState<CookieConsentState | null>(null);

  React.useEffect(() => {
    const raw = readCookie(COOKIE_CONSENT_COOKIE);
    if (!raw) return;
    const parsed = parseConsent(raw);
    if (parsed) setConsent(parsed);
  }, []);

  const setMarketing = React.useCallback((marketing: boolean) => {
    const next: CookieConsentState = { v: 1, marketing, ts: Date.now() };
    setConsent(next);
    writeConsent(next);
  }, []);

  const acceptAll = React.useCallback(() => setMarketing(true), [setMarketing]);
  const rejectNonEssential = React.useCallback(() => setMarketing(false), [setMarketing]);

  const value: Ctx = React.useMemo(
    () => ({ consent, acceptAll, rejectNonEssential, setMarketing }),
    [consent, acceptAll, rejectNonEssential, setMarketing]
  );

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>;
}

export function useCookieConsent() {
  const ctx = React.useContext(CookieConsentContext);
  if (!ctx) throw new Error("useCookieConsent must be used inside CookieConsentProvider");
  return ctx;
}