import { mustEnv } from "@/src/server/env";

export type TurnstileVerifyResult = {
  ok: boolean;
  errorCodes?: string[];
};

export async function verifyTurnstileToken(args: {
  token: string;
  remoteIp?: string;
}): Promise<TurnstileVerifyResult> {
  const secret = mustEnv("TURNSTILE_SECRET_KEY");

  const form = new URLSearchParams();
  form.set("secret", secret);
  form.set("response", args.token);
  if (args.remoteIp) form.set("remoteip", args.remoteIp);

  const resp = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    }
  );

  if (!resp.ok) {
    return { ok: false, errorCodes: [`http_${resp.status}`] };
  }

  const json = (await resp.json()) as {
    success?: boolean;
    "error-codes"?: string[];
  };

  return {
    ok: Boolean(json.success),
    errorCodes: json["error-codes"],
  };
}
