import { NextResponse } from "next/server";

import { isAdminEmail } from "@/src/server/auth/adminAllowlist";
import { signAdminMagicLinkToken } from "@/src/server/auth/tokens";
import { sendEmail } from "@/src/server/email/resend";
import { isValidEmail } from "@/src/server/validation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { email?: string; next?: string }
      | null;

    const email = body?.email?.trim().toLowerCase() ?? "";
    const nextPathRaw = body?.next;
    const nextPath =
      typeof nextPathRaw === "string" && nextPathRaw.startsWith("/")
        ? nextPathRaw
        : "/admin";

    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
    }

    if (!isAdminEmail(email)) {
      return NextResponse.json({ ok: false, error: "not_allowed" }, { status: 403 });
    }

    const token = signAdminMagicLinkToken(email);
    const origin = new URL(req.url).origin;

    const link = `${origin}/api/auth/admin/callback?token=${encodeURIComponent(
      token
    )}&next=${encodeURIComponent(nextPath)}`;

    await sendEmail({
      to: email,
      subject: "TC Engine — admin login link",
      text: [
        "Here is your one-time login link:",
        "",
        link,
        "",
        "If you did not request this, you can ignore the email.",
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "unknown" },
      { status: 500 }
    );
  }
}
