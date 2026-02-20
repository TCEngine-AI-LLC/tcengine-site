import { LeadKind } from "@/src/generated/prisma/enums";

import { requireTurnstileOr403 } from "@/src/server/security/turnstileGate";
import { logLead } from "@/src/server/crm/customerLog";

export async function POST(req: Request) {
  const guard = await requireTurnstileOr403(req);
  if (guard) return guard;

  type SubmitLeadBody = {
    email?: unknown;
    message?: unknown;
    source?: unknown;
  };
  const body = (await req.json().catch(() => null)) as SubmitLeadBody | null;

  const email = typeof body?.email === "string" ? body.email : "";
  const message = typeof body?.message === "string" ? body.message : "";
  const source = typeof body?.source === "string" ? body.source : "unknown";

  const ip = req.headers.get("x-forwarded-for") ?? undefined;
  const userAgent = req.headers.get("user-agent") ?? undefined;

  try {
    await logLead({
      email,
      kind: LeadKind.TECHNICAL_BRIEF,
      source,
      message,
      ip,
      userAgent,
    });

    // If you already email yourself via Resend here, keep it.
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json(
      { ok: false, error: e instanceof Error ? e.message : "unknown_error" },
      { status: 400 }
    );
  }
}