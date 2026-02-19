import { NextResponse } from "next/server";

import { siteMeta } from "@/src/customizations/site";
import { sendEmail } from "@/src/server/email/resend";
import { getStripe } from "@/src/server/stripe/stripe";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;
  const sessionId = url.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(`${origin}/pricing`);
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const paid = session.payment_status === "paid";
    const customerEmail =
      session.customer_details?.email ?? session.customer_email ?? undefined;

    const planId = session.metadata?.planId ?? "unknown";

    if (paid) {
      const adminTo =
        process.env.CONTACT_TO_EMAIL ??
        process.env.PURCHASE_NOTIFY_EMAIL ??
        siteMeta.salesEmail;
      await sendEmail({
        to: adminTo,
        subject: `[TC Engine] Paid: ${planId}`,
        text: [
          `Plan: ${planId}`,
          `Customer email: ${customerEmail ?? "(unknown)"}`,
          `Stripe session: ${sessionId}`,
          `Amount total: ${session.amount_total ?? ""}`,
          `Currency: ${session.currency ?? ""}`,
          `Time: ${new Date().toISOString()}`,
        ].join("\n"),
      });

      if (customerEmail) {
        await sendEmail({
          to: customerEmail,
          subject: "TC Engine — payment received",
          text: [
            "Thanks — we received your payment.",
            "",
            `Plan: ${planId}`,
            "",
            "We’ll follow up shortly to schedule the engagement.",
            "",
            "If anything looks wrong, reply to this email.",
          ].join("\n"),
          replyTo: siteMeta.salesEmail,
        });
      }

      return NextResponse.redirect(`${origin}/pricing?success=1`);
    }

    return NextResponse.redirect(`${origin}/pricing`);
  } catch {
    return NextResponse.redirect(`${origin}/pricing`);
  }
}
