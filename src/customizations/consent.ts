export const COOKIE_CONSENT_COOKIE = "tc_cookie_consent_v1" as const;

export type CookieConsentState = {
  v: 1;
  marketing: boolean; // LinkedIn embeds
  ts: number; // unix ms
};

export const cookieConsentCopy = {
  message:
    "We use essential cookies for security and optional cookies for embedded LinkedIn posts.",
  learnMoreHref: "/cookies",
  marketingLabel: "Enable LinkedIn embeds",
  marketingHint:
    "Allows loading LinkedIn iframes on /logs. LinkedIn may set cookies.",
} as const;