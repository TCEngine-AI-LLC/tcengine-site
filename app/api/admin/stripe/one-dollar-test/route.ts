import { NextResponse } from "next/server";

import { ADMIN_TEST_PRICE_ENV } from "@/src/customizations/pricing";
import { isAdminEmail } from "@/src/server/auth/adminAllowlist";
import { getAdminSessionEmail } from "@/src/server/auth/session";
import { mustEnv, siteOrigin } from "@/src/server/env";
import { getStripe } from "@/src/server/stripe/stripe";

export const runtime = "nodejs";

export async function OPTIONS() {
  // Avoid noisy 405s from preflight/tooling.
  return new NextResponse(null, {
    status: 204,
    headers: { Allow: "POST, OPTIONS" },
  });
}

export async function POST(req: Request) {
  const origin = siteOrigin(req);

  const email = await getAdminSessionEmail();
  if (!email) {
    return NextResponse.json({ ok: false, error: "not_signed_in" }, { status: 401 });
  }
  if (!isAdminEmail(email)) {
    return NextResponse.json({ ok: false, error: "not_allowed" }, { status: 403 });
  }

  try {
    const stripe = getStripe();
    const priceId = mustEnv(ADMIN_TEST_PRICE_ENV);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      success_url: `${origin}/admin?stripe_test=success`,
      cancel_url: `${origin}/admin?stripe_test=cancel`,
      metadata: {
        planId: "ONE_DOLLAR_TEST",          // ✅ ADD THIS
        purpose: "admin_one_dollar_test",
        requestedBy: email,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { ok: false, error: "stripe_missing_checkout_url" },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, url: session.url });
  } catch (e) {
    console.error("[api/admin/stripe/one-dollar-test] error", e);
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "unknown_error" },
      { status: 500 }
    );
  }
}