"use client";

import * as React from "react";
import { Alert, Box, MenuItem, TextField, Typography } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

import Surface from "@/src/ui/components/Surface";
import ActionIconButton from "@/src/ui/components/ActionIconButton";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "ok" }
  | { kind: "error"; message: string };

function formDataToJson(fd: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of fd.entries()) {
    const val = typeof v === "string" ? v : "";
    if (out[k] === undefined) out[k] = val;
    else if (Array.isArray(out[k])) (out[k] as string[]).push(val);
    else out[k] = [out[k] as string, val];
  }
  return out;
}

export default function EngagementIntakeForm(props: {
  token: string;
  defaultEmail: string;
  planId: string;
  existingData: Record<string, unknown> | null;
  submittedAtIso: string | null;
}) {
  const { token, defaultEmail, planId, existingData, submittedAtIso } = props;

  const alreadySubmitted = Boolean(submittedAtIso);

  const formRef = React.useRef<HTMLFormElement | null>(null);
  const [status, setStatus] = React.useState<Status>({ kind: "idle" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (alreadySubmitted) return;

    setStatus({ kind: "submitting" });
    try {
      const fd = new FormData(e.currentTarget as HTMLFormElement);
      const data = formDataToJson(fd);

      const r = await fetch("/api/intake/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, data }),
      });

      const j = (await r.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!r.ok || !j?.ok) {
        setStatus({ kind: "error", message: j?.error ?? "Submit failed." });
        return;
      }

      setStatus({ kind: "ok" });
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  return (
    <Surface>
      <Box
        component="form"
        ref={formRef}
        onSubmit={submit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Typography sx={{ fontWeight: 850 }}>
          Plan: <span style={{ fontFamily: "var(--font-geist-mono)" }}>{planId}</span>
        </Typography>

        {alreadySubmitted ? (
          <Alert severity="success">
            Intake already submitted{submittedAtIso ? ` (${new Date(submittedAtIso).toLocaleString()})` : ""}.
          </Alert>
        ) : null}

        {/* Minimal required fields (expand with the rest of your intake_form.html fields) */}
        <TextField
          name="organization_name"
          label="Organization name"
          size="small"
          required
          defaultValue={(existingData?.organization_name as string) ?? ""}
        />

        <TextField
          name="contact_name"
          label="Primary contact name"
          size="small"
          required
          defaultValue={(existingData?.contact_name as string) ?? ""}
        />

        <TextField
          name="contact_email"
          label="Email"
          size="small"
          required
          defaultValue={(existingData?.contact_email as string) ?? defaultEmail}
          helperText="Prefilled from your purchase email (edit if needed)."
        />

        <TextField
          name="your_role"
          label="Your role"
          size="small"
          select
          defaultValue={(existingData?.your_role as string) ?? ""}
        >
          <MenuItem value="">Select…</MenuItem>
          <MenuItem value="Executive Leadership">Executive Leadership</MenuItem>
          <MenuItem value="General Counsel / Legal">General Counsel / Legal</MenuItem>
          <MenuItem value="Export Compliance Officer">Export Compliance Officer</MenuItem>
          <MenuItem value="CISO / Security Leadership">CISO / Security Leadership</MenuItem>
          <MenuItem value="CIO / IT Leadership">CIO / IT Leadership</MenuItem>
          <MenuItem value="Engineering Leadership">Engineering Leadership</MenuItem>
          <MenuItem value="Program Management">Program Management</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>

        <TextField
          name="trigger_for_engagement"
          label="Trigger for engagement"
          size="small"
          multiline
          minRows={3}
          defaultValue={(existingData?.trigger_for_engagement as string) ?? ""}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <ActionIconButton
            tooltip={alreadySubmitted ? "Already submitted" : "Submit intake"}
            aria-label="Submit intake"
            disabled={status.kind === "submitting" || alreadySubmitted}
            onClick={() => formRef.current?.requestSubmit()}
          >
            <SendRoundedIcon />
          </ActionIconButton>
        </Box>

        {status.kind === "ok" ? <Alert severity="success">Submitted. We’ll follow up shortly.</Alert> : null}
        {status.kind === "error" ? <Alert severity="error">{status.message}</Alert> : null}
      </Box>
    </Surface>
  );
}