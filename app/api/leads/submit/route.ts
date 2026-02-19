import { NextResponse } from "next/server";

import { siteMeta } from "@/src/customizations/site";
import { sendEmail } from "@/src/server/email/resend";
import { requireTurnstileOr403 } from "@/src/server/security/turnstileGate";
import { clampStr, isValidEmail } from "@/src/server/validation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const gate = await requireTurnstileOr403(req);
  if (gate) return gate;

  try {
    const body = (await req.json().catch(() => null)) as
      | { email?: string; message?: string; source?: string }
      | null;

    const email = body?.email?.trim() ?? "";
    const message = clampStr(body?.message ?? "", 4000);
    const source = clampStr(body?.source ?? "unknown", 200);

    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
    }

    const to =
      process.env.CONTACT_TO_EMAIL ??
      process.env.LEADS_NOTIFY_EMAIL ??
      siteMeta.salesEmail;

    const subject = `[TC Engine] Lead: ${email}`;
    const lines: string[] = [];
    lines.push(`Email: ${email}`);
    lines.push(`Source: ${source}`);
    lines.push(`Time: ${new Date().toISOString()}`);
    lines.push(`User-Agent: ${req.headers.get("user-agent") ?? ""}`);
    lines.push("");
    lines.push("Message:");
    lines.push(message || "(none)");

    await sendEmail({
      to,
      subject,
      text: lines.join("\n"),
      replyTo: email,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }
}
