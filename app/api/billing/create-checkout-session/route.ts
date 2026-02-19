import { NextResponse } from "next/server";

import { CONSULTING_PLANS, type ConsultingPlanId } from "@/src/customizations/pricing";
import { requireTurnstileOr403 } from "@/src/server/security/turnstileGate";
import { getStripe } from "@/src/server/stripe/stripe";
import { isValidEmail } from "@/src/server/validation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const gate = await requireTurnstileOr403(req);
  if (gate) return gate;

  try {
    const body = (await req.json().catch(() => null)) as
      | { email?: string; planId?: ConsultingPlanId }
      | null;

    const email = body?.email?.trim() ?? "";
    const planId = body?.planId;

    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
    }

    if (!planId || !(planId in CONSULTING_PLANS)) {
      return NextResponse.json({ ok: false, error: "invalid_plan" }, { status: 400 });
    }

    const plan = CONSULTING_PLANS[planId];
    const priceId = process.env[plan.stripePriceEnv];
    if (!priceId) {
      return NextResponse.json(
        {
          ok: false,
          error: `missing_env_${plan.stripePriceEnv}`,
        },
        { status: 500 }
      );
    }

    const origin = new URL(req.url).origin;

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/api/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      metadata: {
        planId,
        email,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { ok: false, error: "stripe_no_url" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, url: session.url });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }
}
