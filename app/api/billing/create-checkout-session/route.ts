import Stripe from "stripe";
import { NextResponse } from "next/server";

import { LeadKind } from "@/src/generated/prisma/enums";
import { CONSULTING_PLANS, type ConsultingPlanId } from "@/src/customizations/pricing";
import { mustEnv } from "@/src/server/env";
import { requireTurnstileOr403 } from "@/src/server/security/turnstileGate";
import { getStripe } from "@/src/server/stripe/stripe";
import { isValidEmail } from "@/src/server/validation";
import { logLead, upsertPurchasePending } from "@/src/server/crm/customerLog";
import { siteOrigin } from "@/src/server/env";

export const runtime = "nodejs";

function isPlanId(v: unknown): v is ConsultingPlanId {
  return v === "TEN_HOURS" || v === "FORTY_HOURS";
}

export async function POST(req: Request) {
  const gate = await requireTurnstileOr403(req);
  if (gate) return gate;

  try {
    const body = (await req.json().catch(() => null)) as
      | { email?: unknown; planId?: unknown }
      | null;

    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const planIdRaw = body?.planId;

    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
    }

    if (!isPlanId(planIdRaw)) {
      return NextResponse.json({ ok: false, error: "invalid_plan" }, { status: 400 });
    }

    const priceId = mustEnv(CONSULTING_PLANS[planIdRaw].stripePriceEnv);
    const stripe = getStripe();
    const origin = siteOrigin(req);

    const ipHeader =
      req.headers.get("cf-connecting-ip") ??
      req.headers.get("x-forwarded-for") ??
      undefined;
    const ip = ipHeader?.split(",")[0]?.trim();
    const userAgent = req.headers.get("user-agent") ?? undefined;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
            maximum: 10, // set to 4 if you want to cap at 4
          },
        },
      ],
      success_url: `${origin}/pricing?success=1`,
      cancel_url: `${origin}/pricing`,
      metadata: { planId: planIdRaw },
    } satisfies Stripe.Checkout.SessionCreateParams);

    // DB logging
    await logLead({
      email,
      kind: LeadKind.CHECKOUT_STARTED,
      source: `checkout_${planIdRaw}`,
      message: "",
      ip,
      userAgent,
    });

    await upsertPurchasePending({
      email,
      planId: planIdRaw,
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
    console.error("[api/billing/create-checkout-session] error", e);
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "unknown_error" },
      { status: 500 }
    );
  }
}