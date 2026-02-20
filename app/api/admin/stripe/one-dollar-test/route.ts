import Stripe from "stripe";
import { NextResponse } from "next/server";

import { ADMIN_TEST_PRICE_ENV } from "@/src/customizations/pricing";
import { isAdminEmail } from "@/src/server/auth/adminAllowlist";
import { getAdminSessionEmail } from "@/src/server/auth/session";
import { mustEnv } from "@/src/server/env";
import { getStripe } from "@/src/server/stripe/stripe";

export const runtime = "nodejs";

// app/api/admin/stripe/one-dollar-test/route.ts

export async function GET(req: Request) {
  return handleOneDollarTest(req);
}

export async function POST(req: Request) {
  return handleOneDollarTest(req);
}

async function handleOneDollarTest(req: Request) {
  const origin = new URL(req.url).origin;

  // Admin gate
  const email = await getAdminSessionEmail();
  if (!email || !isAdminEmail(email)) {
    return NextResponse.redirect(`${origin}/login?next=${encodeURIComponent("/admin")}`);
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

    return NextResponse.redirect(session.url);
  } catch (e) {
    console.error("[api/admin/stripe/one-dollar-test] error", e);
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "unknown_error" },
      { status: 500 }
    );
  }
}