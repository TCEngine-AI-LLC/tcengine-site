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

  type ResendSendResponse = {
    data?: { id?: string };
    error?: { message?: string } | null;
  };

  const resp = (await resend.emails.send({
    from,
    to: args.to,
    subject: args.subject,
    text: args.text,
    html: args.html,
    replyTo: args.replyTo,
  })) as ResendSendResponse;

  if (resp.error) {
    throw new Error(`Resend error: ${resp.error.message ?? "unknown"}`);
  }

  return { id: resp.data?.id };
}
