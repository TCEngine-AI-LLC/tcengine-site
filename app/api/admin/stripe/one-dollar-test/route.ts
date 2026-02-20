import Stripe from "stripe";
import { NextResponse } from "next/server";

import { LeadKind } from "@/src/generated/prisma/enums";
import type { ConsultingPlanId } from "@/src/customizations/pricing";

import { isAdminEmail } from "@/src/server/auth/adminAllowlist";
import { getAdminSessionEmail } from "@/src/server/auth/session";
import { logLead, upsertPurchasePending } from "@/src/server/crm/customerLog";
import { getStripe } from "@/src/server/stripe/stripe";
import { isValidEmail } from "@/src/server/validation";

export const runtime = "nodejs";

const PLAN_ID: ConsultingPlanId = "ONE_DOLLAR_TEST";

// Stripe objects you *charge* are Prices. We’ll auto-create a $1 price once per Stripe mode
// using a lookup_key, so you don’t create infinite Products/Prices.
const LOOKUP_KEY = "one-dollar-test";
const PRODUCT_NAME = "One-doller-test";
const AMOUNT_CENTS = 100;
const CURRENCY = "usd";

async function getOrCreateOneDollarPriceId(stripe: Stripe): Promise<string> {
  const existing = await stripe.prices.list({
    lookup_keys: [LOOKUP_KEY],
    limit: 1,
  });

  const p = existing.data[0];
  if (p?.id) return p.id;

  const product = await stripe.products.create({ name: PRODUCT_NAME });

  const price = await stripe.prices.create({
    unit_amount: AMOUNT_CENTS,
    currency: CURRENCY,
    product: product.id,
    lookup_key: LOOKUP_KEY,
  });

  return price.id;
}

export async function POST(req: Request) {
  // Admin gate
  const adminEmail = await getAdminSessionEmail();
  if (!adminEmail || !isAdminEmail(adminEmail)) {
    return NextResponse.json({ ok: false, error: "not_admin" }, { status: 403 });
  }

  // Optional override (defaults to admin email)
  const body = (await req.json().catch(() => null)) as { email?: unknown } | null;
  const emailRaw =
    typeof body?.email === "string" && body.email.trim()
      ? body.email.trim().toLowerCase()
      : adminEmail;

  if (!isValidEmail(emailRaw)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const stripe = getStripe();
  const origin = new URL(req.url).origin;

  const ipHeader =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for") ??
    undefined;
  const ip = ipHeader?.split(",")[0]?.trim();
  const userAgent = req.headers.get("user-agent") ?? undefined;

  try {
    const priceId = await getOrCreateOneDollarPriceId(stripe);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: emailRaw,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/admin?stripe_test=1`,
      cancel_url: `${origin}/admin?stripe_test=0`,
      metadata: {
        planId: PLAN_ID,
        initiatedBy: adminEmail,
      },
    } satisfies Stripe.Checkout.SessionCreateParams);

    // DB logging (tests DB + webhook pipeline end-to-end)
    await logLead({
      email: emailRaw,
      kind: LeadKind.CHECKOUT_STARTED,
      source: "admin_one_dollar_test",
      message: "",
      ip,
      userAgent,
    });

    await upsertPurchasePending({
      email: emailRaw,
      planId: PLAN_ID,
      stripeCheckoutSessionId: session.id,
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