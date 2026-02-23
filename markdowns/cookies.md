---
title: Cookies
description: How TC Engine uses cookies and how you can control them.
---

# Cookies

TC Engine uses a small number of cookies to keep the site secure and to optionally load third‑party embeds.

## Essential cookies

These cookies are required for the site to function securely:

- **`tc_turnstile_ok`**
  - **Purpose:** Anti-bot protection for forms and checkout (Cloudflare Turnstile).
  - **When set:** After you complete the human verification.
  - **Duration:** Up to ~8 hours.
  - **Notes:** This cookie is required to protect our inbox and Stripe checkout endpoints from automated abuse.

- **`tc_admin_session`**
  - **Purpose:** Admin authentication session cookie.
  - **When set:** After a valid admin magic-link sign-in.
  - **Duration:** Up to 7 days.
  - **Notes:** This cookie is **HttpOnly** (not accessible from client-side JavaScript).

- **`tc_cookie_consent_v1`**
  - **Purpose:** Stores your cookie preference (whether optional LinkedIn embeds are enabled).
  - **When set:** When you accept or reject non-essential cookies.
  - **Duration:** ~180 days.

## Optional cookies / third‑party content

If you enable **LinkedIn embeds**, we will load LinkedIn iframes on the **/logs** page.

- LinkedIn may set its own cookies and use its own tracking and analytics mechanisms.
- If you do **not** enable LinkedIn embeds, we do not load those iframes.

## How to change your choice

Today the simplest way to change your choice is:

- Clear the **`tc_cookie_consent_v1`** cookie in your browser for this site, then reload the page to see the cookie banner again.

(We may add an in-page “cookie settings” control later.)

## Contact

If you have questions about cookies or privacy, email us at the address listed in the site footer.

_Last updated: 2026-02-22_