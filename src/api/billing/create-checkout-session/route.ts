import Stripe from "stripe";
import { LeadKind } from "@/src/generated/prisma/enums";

import { CONSULTING_PLANS, type ConsultingPlanId } from "@/src/customizations/pricing";
import { mustEnv } from "@/src/server/env";
import { getStripe } from "@/src/server/stripe/stripe";
import { requireTurnstileOr403 } from "@/src/server/security/turnstileGate";
import { logLead, upsertPurchasePending } from "@/src/server/crm/customerLog";

function isPlanId(v: unknown): v is ConsultingPlanId {
  return v === "TEN_HOURS" || v === "FORTY_HOURS";
}

export async function POST(req: Request) {
  const guard = await requireTurnstileOr403(req);
  if (guard) return guard;

  type CreateCheckoutSessionBody = {
    email?: unknown;
    planId?: unknown;
  };
  const body = (await req.json().catch(() => null)) as CreateCheckoutSessionBody | null;

  const email = typeof body?.email === "string" ? body.email : "";
  const planId = body?.planId;

  if (!isPlanId(planId)) {
    return Response.json({ ok: false, error: "invalid_plan" }, { status: 400 });
  }

  const priceId = mustEnv(CONSULTING_PLANS[planId].stripePriceEnv);
  const stripe = getStripe();

  const origin = req.headers.get("origin") ?? "https://tcengine.com";

  const ip = req.headers.get("x-forwarded-for") ?? undefined;
  const userAgent = req.headers.get("user-agent") ?? undefined;

  try {
    // 1) Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email.trim().toLowerCase(),
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/pricing?success=1`,
      cancel_url: `${origin}/pricing`,
      metadata: { planId },
    } satisfies Stripe.Checkout.SessionCreateParams);

    // 2) Log checkout started lead + pending purchase
    await logLead({
      email,
      kind: LeadKind.CHECKOUT_STARTED,
      source: `checkout_${planId}`,
      message: "",
      ip,
      userAgent,
    });

    await upsertPurchasePending({
      email,
      planId,
      stripeCheckoutSessionId: session.id,
    });

    if (!session.url) {
      return Response.json(
        { ok: false, error: "stripe_missing_checkout_url" },
        { status: 502 }
      );
    }
    return Response.json({ ok: true, url: session.url });
  } catch (e) {
    return Response.json(
      { ok: false, error: e instanceof Error ? e.message : "unknown_error" },
      { status: 500 }
    );
  }
}