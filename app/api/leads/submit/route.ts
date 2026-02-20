import { NextResponse } from "next/server";

import { LeadKind } from "@/src/generated/prisma/enums";
import { siteMeta } from "@/src/customizations/site";
import { sendEmail } from "@/src/server/email/resend";
import { logLead } from "@/src/server/crm/customerLog";
import { requireTurnstileOr403 } from "@/src/server/security/turnstileGate";
import { clampStr, isValidEmail } from "@/src/server/validation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const gate = await requireTurnstileOr403(req);
  if (gate) return gate;

  try {
    const body = (await req.json().catch(() => null)) as
      | { email?: unknown; message?: unknown; source?: unknown }
      | null;

    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const message = typeof body?.message === "string" ? body.message : "";
    const source = typeof body?.source === "string" ? body.source : "unknown";

    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
    }

    const ipHeader =
      req.headers.get("cf-connecting-ip") ??
      req.headers.get("x-forwarded-for") ??
      undefined;
    const ip = ipHeader?.split(",")[0]?.trim();
    const userAgent = req.headers.get("user-agent") ?? undefined;

    // 1) Write to DB (Customer upsert + Lead insert)
    await logLead({
      email,
      kind: LeadKind.TECHNICAL_BRIEF,
      source: clampStr(source, 80),
      message,
      ip,
      userAgent,
    });

    // 2) Email notify (optional but useful)
    const to =
      process.env.CONTACT_TO_EMAIL ??
      process.env.LEADS_NOTIFY_EMAIL ??
      siteMeta.salesEmail;

    await sendEmail({
      to,
      subject: `[TC Engine] Lead: ${email}`,
      text: [
        `Email: ${email}`,
        `Source: ${clampStr(source, 200)}`,
        `Time: ${new Date().toISOString()}`,
        `IP: ${ip ?? ""}`,
        `User-Agent: ${userAgent ?? ""}`,
        "",
        "Message:",
        clampStr(message || "(none)", 4000),
      ].join("\n"),
      replyTo: email,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/leads/submit] error", e);
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }
}