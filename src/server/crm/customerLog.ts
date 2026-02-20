import { Prisma } from "@/src/generated/prisma/client";
import { LeadKind, PurchaseStatus } from "@/src/generated/prisma/enums";
import type { ConsultingPlanId } from "@/src/customizations/pricing";

import prisma from "@/src/server/db/prisma";
import { clampStr, isValidEmail } from "@/src/server/validation";

const normEmail = (email: string) => email.trim().toLowerCase();

export async function upsertCustomerByEmail(email: string) {
  const e = normEmail(email);
  if (!isValidEmail(e)) throw new Error("invalid_email");

  return prisma.customer.upsert({
    where: { email: e },
    update: { lastSeenAt: new Date() },
    create: { email: e, lastSeenAt: new Date() },
  });
}

export async function logLead(args: {
  email: string;
  kind: LeadKind;
  source: string;
  message?: string;
  ip?: string;
  userAgent?: string;
}) {
  const customer = await upsertCustomerByEmail(args.email);
  console.log("logLead", { email: args.email, kind: args.kind, source: args.source });
  await prisma.lead.create({
    data: {
      customerId: customer.id,
      kind: args.kind,
      source: clampStr(args.source, 80),
      message: args.message ? clampStr(args.message, 2000) : null,
      ip: args.ip ? clampStr(args.ip, 80) : null,
      userAgent: args.userAgent ? clampStr(args.userAgent, 300) : null,
    },
  });
  console.log("leadCreated");
  return customer;
}

export async function upsertPurchasePending(args: {
  email: string;
  planId: ConsultingPlanId;
  stripeCheckoutSessionId: string;
}) {
  const customer = await upsertCustomerByEmail(args.email);

  return prisma.purchase.upsert({
    where: { stripeCheckoutSessionId: args.stripeCheckoutSessionId },
    update: {
      customerId: customer.id,
      planId: args.planId,
      status: PurchaseStatus.PENDING,
    },
    create: {
      customerId: customer.id,
      planId: args.planId,
      status: PurchaseStatus.PENDING,
      stripeCheckoutSessionId: args.stripeCheckoutSessionId,
    },
  });
}

export async function markPurchaseFromCheckoutSession(args: {
  stripeCheckoutSessionId: string;
  email: string;
  planId: ConsultingPlanId;
  paid: boolean;
  stripeCustomerId?: string;
  stripePaymentIntentId?: string;
  amountTotal?: number;
  currency?: string;
}) {
  const customer = await upsertCustomerByEmail(args.email);

  return prisma.purchase.upsert({
    where: { stripeCheckoutSessionId: args.stripeCheckoutSessionId },
    update: {
      customerId: customer.id,
      planId: args.planId,
      status: args.paid ? PurchaseStatus.PAID : PurchaseStatus.PENDING,
      paidAt: args.paid ? new Date() : null,
      stripeCustomerId: args.stripeCustomerId ?? null,
      stripePaymentIntentId: args.stripePaymentIntentId ?? null,
      amountTotal: typeof args.amountTotal === "number" ? args.amountTotal : null,
      currency: args.currency ?? null,
    },
    create: {
      customerId: customer.id,
      planId: args.planId,
      status: args.paid ? PurchaseStatus.PAID : PurchaseStatus.PENDING,
      paidAt: args.paid ? new Date() : null,
      stripeCheckoutSessionId: args.stripeCheckoutSessionId,
      stripeCustomerId: args.stripeCustomerId ?? null,
      stripePaymentIntentId: args.stripePaymentIntentId ?? null,
      amountTotal: typeof args.amountTotal === "number" ? args.amountTotal : null,
      currency: args.currency ?? null,
    },
  });
}

export async function recordStripeEventOnce(args: {
  eventId: string;
  type: string;
  livemode: boolean;
  payload: unknown;
}) {
  try {
    await prisma.stripeWebhookEvent.create({
      data: {
        eventId: args.eventId,
        type: args.type,
        livemode: args.livemode,
        payload: args.payload as Prisma.InputJsonValue,
      },
    });
    return { ok: true as const, duplicate: false as const };
  } catch (e) {
    // Unique constraint => already recorded
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { ok: true as const, duplicate: true as const };
    }
    throw e;
  }
}