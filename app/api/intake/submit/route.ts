import { NextResponse } from "next/server";

import prisma from "@/src/server/db/prisma";
import { PurchaseStatus } from "@/src/generated/prisma/enums";
import { Prisma } from "@/src/generated/prisma/client";
import { verifyIntakeLinkToken } from "@/src/server/auth/tokens";

export const runtime = "nodejs";

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { token?: unknown; data?: unknown }
      | null;

    const token = typeof body?.token === "string" ? body.token : "";
    const dataRaw = body?.data;

    if (!token) {
      return NextResponse.json({ ok: false, error: "missing_token" }, { status: 400 });
    }

    // Must be a JSON object (not null, not array)
    if (!isPlainObject(dataRaw)) {
      return NextResponse.json({ ok: false, error: "invalid_data" }, { status: 400 });
    }

    const v = verifyIntakeLinkToken(token);
    if (!v.ok) {
      return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 403 });
    }

    const purchase = await prisma.purchase.findUnique({
      where: { id: v.purchaseId },
    });

    if (!purchase || purchase.status !== PurchaseStatus.PAID) {
      return NextResponse.json({ ok: false, error: "not_allowed" }, { status: 403 });
    }

    // Prisma Json input type (no any)
    const jsonData = dataRaw as Prisma.InputJsonValue;

    await prisma.engagementIntake.upsert({
      where: { purchaseId: purchase.id },
      update: {
        data: jsonData,
        submittedAt: new Date(),
      },
      create: {
        purchaseId: purchase.id,
        data: jsonData,
        submittedAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/intake/submit] error", e);
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "unknown_error" },
      { status: 500 }
    );
  }
}