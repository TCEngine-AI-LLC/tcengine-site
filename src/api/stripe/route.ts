import Stripe from "stripe";
import type { ConsultingPlanId } from "@/src/customizations/pricing";

import { mustEnv } from "@/src/server/env";
import { getStripe } from "@/src/server/stripe/stripe";
import {
  markPurchaseFromCheckoutSession,
  recordStripeEventOnce,
} from "@/src/server/crm/customerLog";

function isPlanId(v: unknown): v is ConsultingPlanId {
  return v === "TEN_HOURS" || v === "FORTY_HOURS";
}

export async function POST(req: Request) {
  const stripe = getStripe();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing Stripe signature", { status: 400 });

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      mustEnv("STRIPE_WEBHOOK_SECRET")
    );
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  // Idempotency: store event once.
  const rec = await recordStripeEventOnce({
    eventId: event.id,
    type: event.type,
    livemode: event.livemode,
    payload: event,
  });

  if (rec.duplicate) {
    return Response.json({ ok: true, duplicate: true });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const email =
        session.customer_details?.email ??
        session.customer_email ??
        "";

      const planIdRaw = session.metadata?.planId;
      if (!email || !isPlanId(planIdRaw)) {
        // Don’t crash; just acknowledge webhook.
        return Response.json({ ok: true, skipped: "missing_email_or_planId" });
      }

      const paid = session.payment_status === "paid";

      await markPurchaseFromCheckoutSession({
        stripeCheckoutSessionId: session.id,
        email,
        planId: planIdRaw,
        paid,
        stripeCustomerId: typeof session.customer === "string" ? session.customer : undefined,
        stripePaymentIntentId:
          typeof session.payment_intent === "string" ? session.payment_intent : undefined,
        amountTotal: session.amount_total ?? undefined,
        currency: session.currency ?? undefined,
      });
    }

    return Response.json({ ok: true });
  } catch (e) {
    // You may want to update StripeWebhookEvent.error here, but keep it simple for now.
    return new Response(
      e instanceof Error ? e.message : "Webhook handler error",
      { status: 500 }
    );
  }
}