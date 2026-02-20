import Stripe from "stripe";
import { NextResponse } from "next/server";

import type { ConsultingPlanId } from "@/src/customizations/pricing";
import { siteMeta } from "@/src/customizations/site";
import { mustEnv } from "@/src/server/env";
import { sendEmail } from "@/src/server/email/resend";
import { getStripe } from "@/src/server/stripe/stripe";
import {
  markPurchaseFromCheckoutSession,
  recordStripeEventOnce,
} from "@/src/server/crm/customerLog";

export const runtime = "nodejs";

function isPlanId(v: unknown): v is ConsultingPlanId {
  return v === "TEN_HOURS" || v === "FORTY_HOURS" || v === "ONE_DOLLAR_TEST";
}

export async function POST(req: Request) {
  const stripe = getStripe();

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json(
      { ok: false, error: "missing_stripe_signature" },
      { status: 400 }
    );
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      mustEnv("STRIPE_WEBHOOK_SECRET")
    );
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "invalid_signature" },
      { status: 400 }
    );
  }

  // Idempotency: store once
  const rec = await recordStripeEventOnce({
    eventId: event.id,
    type: event.type,
    livemode: event.livemode,
    payload: event,
  });

  if (rec.duplicate) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const email =
        (session.customer_details?.email ?? session.customer_email ?? "")
          .trim()
          .toLowerCase();

      const planIdRaw = session.metadata?.planId;

      if (!email || !isPlanId(planIdRaw)) {
        return NextResponse.json({ ok: true, skipped: "missing_email_or_planId" });
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

      // Optional notifications (don’t fail webhook if email fails)
      if (paid) {
        const adminTo =
          process.env.CONTACT_TO_EMAIL ??
          process.env.PURCHASE_NOTIFY_EMAIL ??
          siteMeta.salesEmail;

        try {
          await sendEmail({
            to: adminTo,
            subject: planIdRaw === "ONE_DOLLAR_TEST"
              ? `[TC Engine][test] Paid: ${planIdRaw}`
              : `[TC Engine] Paid: ${planIdRaw}`,
            text: [
              `Plan: ${planIdRaw}`,
              `Customer email: ${email}`,
              `Stripe session: ${session.id}`,
              `Amount total: ${session.amount_total ?? ""}`,
              `Currency: ${session.currency ?? ""}`,
              `Time: ${new Date().toISOString()}`,
            ].join("\n"),
          });

          await sendEmail({
            to: email,
            subject: "TC Engine — payment received",
            text: [
              "Thanks — we received your payment.",
              "",
              `Plan: ${planIdRaw}`,
              "",
              "We'll follow up shortly to schedule the engagement.",
              "",
              "If anything looks wrong, reply to this email.",
            ].join("\n"),
            replyTo: siteMeta.salesEmail,
          });
        } catch (e) {
          console.error("[api/stripe/webhook] email notify failed", e);
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/stripe/webhook] handler error", e);
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "webhook_error" },
      { status: 500 }
    );
  }
}