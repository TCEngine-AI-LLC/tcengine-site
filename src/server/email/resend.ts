import { Resend } from "resend";

import { mustEnv } from "@/src/server/env";

export type SendEmailArgs = {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

let cachedResend: Resend | null = null;

function getResend(): Resend {
  if (cachedResend) return cachedResend;
  cachedResend = new Resend(mustEnv("RESEND_API_KEY"));
  return cachedResend;
}

export async function sendEmail(args: SendEmailArgs): Promise<{ id?: string }> {
  const resend = getResend();
  const from =
    process.env.EMAIL_FROM ??
    process.env.RESEND_FROM ??
    "TC Engine <no-reply@tcengine.com>";

  const resp = await resend.emails.send({
    from,
    to: args.to,
    subject: args.subject,
    text: args.text,
    html: args.html,
    replyTo: args.replyTo,
  });

  // v6 returns { data, error }
  if ((resp as any).error) {
    const e = (resp as any).error;
    throw new Error(`Resend error: ${e?.message ?? "unknown"}`);
  }

  return { id: (resp as any).data?.id };
}
