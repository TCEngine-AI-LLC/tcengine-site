import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { siteMeta } from "@/src/customizations/site";
import { sendEmail } from "@/src/server/email/resend";
import { getStripe } from "@/src/server/stripe/stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "missing_STRIPE_WEBHOOK_SECRET" },
      { status: 500 }
    );
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json(
      { ok: false, error: "missing_stripe_signature" },
      { status: 400 }
    );
  }

  const stripe = getStripe();
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "invalid_signature" },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const planId = session.metadata?.planId ?? "unknown";
      const email =
        session.customer_details?.email ?? session.customer_email ?? "(unknown)";

      const to =
        process.env.CONTACT_TO_EMAIL ??
        process.env.PURCHASE_NOTIFY_EMAIL ??
        siteMeta.salesEmail;

      await sendEmail({
        to,
        subject: `[TC Engine][webhook] checkout.session.completed: ${planId}`,
        text: [
          `Plan: ${planId}`,
          `Customer email: ${email}`,
          `Session: ${session.id}`,
          `Payment status: ${session.payment_status ?? ""}`,
          `Amount total: ${session.amount_total ?? ""}`,
          `Currency: ${session.currency ?? ""}`,
          `Time: ${new Date().toISOString()}`,
        ].join("\n"),
      });
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "webhook_error" },
      { status: 500 }
    );
  }
}
