"use client";

import * as React from "react";
import {
  Alert,
  Box,
  Checkbox,
  MenuItem,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

import Surface from "@/src/ui/components/Surface";
import ActionIconButton from "@/src/ui/components/ActionIconButton";
import { intakeFormCopy, intakeFormOptions } from "@/src/customizations/intakeForm";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "ok" }
  | { kind: "error"; message: string };

// Multi-select fields that MUST be arrays in saved JSON.
const ARRAY_FIELDS = new Set<string>([
  "jurisdictions",
  "regulatory_events",
  "eci_resides",
  "initiatives",
  "desired_outcomes",
]);

function formDataToJson(fd: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  for (const [rawKey, v] of fd.entries()) {
    const key = rawKey;
    const val = typeof v === "string" ? v : "";

    if (ARRAY_FIELDS.has(key)) {
      const prev = out[key];
      if (Array.isArray(prev)) {
        prev.push(val);
        out[key] = prev;
      } else if (typeof prev === "string") {
        out[key] = [prev, val];
      } else {
        out[key] = [val];
      }
      continue;
    }

    // Scalars: last write wins (FormData doesn't normally repeat scalar names).
    out[key] = val;
  }

  return out;
}

function getString(data: Record<string, unknown> | null, key: string): string {
  const v = data?.[key];
  return typeof v === "string" ? v : "";
}

function getStringArray(data: Record<string, unknown> | null, key: string): string[] {
  const v = data?.[key];
  if (Array.isArray(v) && v.every((x) => typeof x === "string")) return v as string[];
  if (typeof v === "string" && v) return [v];
  return [];
}

function Fieldset(props: { legend: string; children: React.ReactNode }) {
  return (
    <Box
      component="fieldset"
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: (t) => t.shape.borderRadius,
        p: 2,
        m: 0,
        minWidth: 0,
      }}
    >
      <Box
        component="legend"
        sx={{
          px: 1,
          fontWeight: 850,
          color: "text.primary",
          letterSpacing: "-0.01em",
        }}
      >
        {props.legend}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {props.children}
      </Box>
    </Box>
  );
}

function TwoCol(props: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
      }}
    >
      {props.children}
    </Box>
  );
}

function ChoiceGrid(props: { two?: boolean; children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 1,
        gridTemplateColumns: props.two
          ? { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }
          : "1fr",
      }}
    >
      {props.children}
    </Box>
  );
}

function ChoiceCard(props: { control: React.ReactNode; label: string }) {
  return (
    <Box
      component="label"
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1,
        p: 1.25,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: (t) => t.shape.borderRadius,
        bgcolor: "action.selected",
        cursor: "pointer",
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      {props.control}
      <Typography variant="body2" sx={{ lineHeight: 1.35, mt: 0.3 }}>
        {props.label}
      </Typography>
    </Box>
  );
}

export default function EngagementIntakeForm(props: {
  token: string;
  defaultEmail: string;
  planId: string;
  existingData: Record<string, unknown> | null;
  submittedAtIso: string | null;
}) {
  const { token, defaultEmail, planId, existingData, submittedAtIso } = props;

  const formRef = React.useRef<HTMLFormElement | null>(null);
  const [status, setStatus] = React.useState<Status>({ kind: "idle" });
  const [submittedAtLocalIso, setSubmittedAtLocalIso] = React.useState<string | null>(
    submittedAtIso
  );

  const jurisdictions = getStringArray(existingData, "jurisdictions");
  const regulatoryEvents = getStringArray(existingData, "regulatory_events");
  const eciResides = getStringArray(existingData, "eci_resides");
  const initiatives = getStringArray(existingData, "initiatives");
  const desiredOutcomes = getStringArray(existingData, "desired_outcomes");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setStatus({ kind: "submitting" });
    try {
      const fd = new FormData(e.currentTarget);
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

      setSubmittedAtLocalIso(new Date().toISOString());
      setStatus({ kind: "ok" });
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  const resetForm = React.useCallback(() => {
    formRef.current?.reset();
    setStatus({ kind: "idle" });
  }, []);

  const submittedMsg = submittedAtLocalIso
    ? `Previously submitted (${new Date(submittedAtLocalIso).toLocaleString()}). You can update and resubmit.`
    : null;

  return (
    <Surface sx={{ maxWidth: 980, mx: "auto" }}>
      <Box
        component="form"
        ref={formRef}
        onSubmit={submit}
        sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
      >
        <Typography sx={{ fontWeight: 850 }}>
          Plan: <span style={{ fontFamily: "var(--font-geist-mono)" }}>{planId}</span>
        </Typography>

        {submittedMsg ? <Alert severity="info">{submittedMsg}</Alert> : null}

        {/* Organization Information */}
        <Fieldset legend="Organization Information">
          <TwoCol>
            <TextField
              name="organization_name"
              label="Organization Name"
              size="small"
              required
              defaultValue={getString(existingData, "organization_name")}
            />

            <TextField
              name="industry"
              label="Primary Industry"
              size="small"
              select
              defaultValue={getString(existingData, "industry")}
            >
              <MenuItem value="">Select…</MenuItem>
              {intakeFormOptions.industry.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </TwoCol>

          <TwoCol>
            <TextField
              name="hq_country"
              label="Headquarters Country"
              size="small"
              defaultValue={getString(existingData, "hq_country")}
            />

            <TextField
              name="employee_count"
              label="Approximate Employee Count"
              size="small"
              select
              defaultValue={getString(existingData, "employee_count")}
            >
              <MenuItem value="">Select…</MenuItem>
              {intakeFormOptions.employeeCount.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </TwoCol>
        </Fieldset>

        {/* Regulatory Scope */}
        <Fieldset legend="Regulatory Scope">
          <Box>
            <Typography sx={{ fontWeight: 700 }}>
              Applicable Regulatory Jurisdictions (Select all that apply)
            </Typography>
            <ChoiceGrid two>
              {intakeFormOptions.jurisdictions.map((opt) => (
                <ChoiceCard
                  key={opt}
                  label={opt}
                  control={
                    <Checkbox
                      name="jurisdictions"
                      value={opt}
                      defaultChecked={jurisdictions.includes(opt)}
                    />
                  }
                />
              ))}
            </ChoiceGrid>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 700 }}>Regulatory Events Experienced</Typography>
            <ChoiceGrid two>
              {intakeFormOptions.regulatoryEvents.map((opt) => (
                <ChoiceCard
                  key={opt}
                  label={opt}
                  control={
                    <Checkbox
                      name="regulatory_events"
                      value={opt}
                      defaultChecked={regulatoryEvents.includes(opt)}
                    />
                  }
                />
              ))}
            </ChoiceGrid>
          </Box>

          <TextField
            name="primary_export_control_challenge"
            label="Primary Export Control Challenge"
            size="small"
            multiline
            minRows={4}
            defaultValue={getString(existingData, "primary_export_control_challenge")}
          />
        </Fieldset>

        {/* ECI Environment */}
        <Fieldset legend="Export Controlled Information (ECI) Environment">
          <Box>
            <Typography sx={{ fontWeight: 700 }}>
              Where Export Controlled Information Currently Resides (Select all that apply)
            </Typography>
            <ChoiceGrid two>
              {intakeFormOptions.eciResides.map((opt) => (
                <ChoiceCard
                  key={opt}
                  label={opt}
                  control={
                    <Checkbox
                      name="eci_resides"
                      value={opt}
                      defaultChecked={eciResides.includes(opt)}
                    />
                  }
                />
              ))}
            </ChoiceGrid>
          </Box>

          <TwoCol>
            <TextField
              name="eci_identification"
              label="Is Export Controlled Information systematically identified at the data level?"
              size="small"
              select
              defaultValue={getString(existingData, "eci_identification")}
            >
              <MenuItem value="">Select…</MenuItem>
              {intakeFormOptions.eciIdentification.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              name="access_control_model"
              label="Current Access Control Model"
              size="small"
              select
              defaultValue={getString(existingData, "access_control_model")}
            >
              <MenuItem value="">Select…</MenuItem>
              {intakeFormOptions.accessControlModel.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </TwoCol>

          <TextField
            name="classification_drives_authorization"
            label="Does classification technically drive authorization today?"
            size="small"
            select
            defaultValue={getString(existingData, "classification_drives_authorization")}
          >
            <MenuItem value="">Select…</MenuItem>
            {intakeFormOptions.yesPartNoUnknown.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        </Fieldset>

        {/* Export Authorization Management */}
        <Fieldset legend="Export Authorization Management">
          <TwoCol>
            <TextField
              name="auth_management_method"
              label="How Export Authorizations are Managed"
              size="small"
              select
              defaultValue={getString(existingData, "auth_management_method")}
            >
              <MenuItem value="">Select…</MenuItem>
              {intakeFormOptions.authManagementMethod.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              name="auto_block_unauthorized"
              label="Can systems automatically block unauthorized export at the data level?"
              size="small"
              select
              defaultValue={getString(existingData, "auto_block_unauthorized")}
            >
              <MenuItem value="">Select…</MenuItem>
              {intakeFormOptions.yesPartNoUnknown.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </TwoCol>
        </Fieldset>

        {/* Zero Trust & AI Environment */}
        <Fieldset legend="Zero Trust & AI Environment">
          <Box>
            <Typography sx={{ fontWeight: 700 }}>Current or Planned Initiatives</Typography>
            <ChoiceGrid two>
              {intakeFormOptions.initiatives.map((opt) => (
                <ChoiceCard
                  key={opt}
                  label={opt}
                  control={
                    <Checkbox
                      name="initiatives"
                      value={opt}
                      defaultChecked={initiatives.includes(opt)}
                    />
                  }
                />
              ))}
            </ChoiceGrid>
          </Box>

          <TextField
            name="export_governance_ai"
            label="Is export governance integrated into AI adoption planning?"
            size="small"
            select
            defaultValue={getString(existingData, "export_governance_ai")}
          >
            <MenuItem value="">Select…</MenuItem>
            {intakeFormOptions.exportGovernanceAi.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        </Fieldset>

        {/* Infrastructure Environment */}
        <Fieldset legend="Infrastructure Environment">
          <TextField
            name="primary_infrastructure"
            label="Primary Infrastructure Environment"
            size="small"
            select
            defaultValue={getString(existingData, "primary_infrastructure")}
          >
            <MenuItem value="">Select…</MenuItem>
            {intakeFormOptions.primaryInfrastructure.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>

          <Box>
            <Typography sx={{ fontWeight: 700 }}>International Collaboration</Typography>
            <ChoiceGrid>
              {intakeFormOptions.internationalCollaboration.map((opt) => (
                <ChoiceCard
                  key={opt}
                  label={opt}
                  control={
                    <Radio
                      name="international_collaboration"
                      value={opt}
                      defaultChecked={getString(existingData, "international_collaboration") === opt}
                    />
                  }
                />
              ))}
            </ChoiceGrid>
          </Box>
        </Fieldset>

        {/* Engagement Objectives */}
        <Fieldset legend="Engagement Objectives">
          <Box>
            <Typography sx={{ fontWeight: 700 }}>Desired Outcomes (Select all that apply)</Typography>
            <ChoiceGrid two>
              {intakeFormOptions.desiredOutcomes.map((opt) => (
                <ChoiceCard
                  key={opt}
                  label={opt}
                  control={
                    <Checkbox
                      name="desired_outcomes"
                      value={opt}
                      defaultChecked={desiredOutcomes.includes(opt)}
                    />
                  }
                />
              ))}
            </ChoiceGrid>
          </Box>

          <TextField
            name="trigger_for_engagement"
            label="Trigger for Engagement"
            size="small"
            multiline
            minRows={4}
            defaultValue={getString(existingData, "trigger_for_engagement")}
          />
        </Fieldset>

        {/* Organizational Context */}
        <Fieldset legend="Organizational Context">
          <TwoCol>
            <TextField
              name="your_role"
              label="Your Role"
              size="small"
              select
              defaultValue={getString(existingData, "your_role")}
            >
              <MenuItem value="">Select…</MenuItem>
              {intakeFormOptions.yourRole.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              name="executive_sponsorship"
              label="Executive Sponsorship Status"
              size="small"
              select
              defaultValue={getString(existingData, "executive_sponsorship")}
            >
              <MenuItem value="">Select…</MenuItem>
              {intakeFormOptions.executiveSponsorship.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </TwoCol>
        </Fieldset>

        {/* Architecture Context */}
        <Fieldset legend="Architecture Context">
          <TextField
            name="compliant_release_description"
            label="Describe how compliant release is currently achieved within your organization."
            size="small"
            multiline
            minRows={4}
            defaultValue={getString(existingData, "compliant_release_description")}
          />

          <TextField
            name="export_controls_view"
            label="How does your organization currently view export controls?"
            size="small"
            select
            defaultValue={getString(existingData, "export_controls_view")}
          >
            <MenuItem value="">Select…</MenuItem>
            {intakeFormOptions.exportControlsView.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        </Fieldset>

        {/* Contact Information */}
        <Fieldset legend="Contact Information">
          <TwoCol>
            <TextField
              name="contact_name"
              label="Primary Contact Name"
              size="small"
              required
              defaultValue={getString(existingData, "contact_name")}
            />

            <TextField
              name="contact_title"
              label="Title"
              size="small"
              defaultValue={getString(existingData, "contact_title")}
            />
          </TwoCol>

          <TwoCol>
            <TextField
              name="contact_email"
              label="Email Address"
              size="small"
              required
              defaultValue={getString(existingData, "contact_email") || defaultEmail}
              helperText="Prefilled from your purchase email (edit if needed)."
            />

            <TextField
              name="contact_phone"
              label="Phone Number (Optional)"
              size="small"
              defaultValue={getString(existingData, "contact_phone")}
            />
          </TwoCol>
        </Fieldset>

        {/* Actions */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <ActionIconButton
            tooltip="Reset form"
            aria-label="Reset form"
            disabled={status.kind === "submitting"}
            onClick={resetForm}
          >
            <RestartAltRoundedIcon />
          </ActionIconButton>

          <ActionIconButton
            tooltip="Submit engagement intake"
            aria-label="Submit engagement intake"
            disabled={status.kind === "submitting"}
            onClick={() => formRef.current?.requestSubmit()}
          >
            <SendRoundedIcon />
          </ActionIconButton>
        </Box>

        {status.kind === "ok" ? (
          <Alert severity="success">Submitted. We&apos;ll follow up shortly.</Alert>
        ) : null}
        {status.kind === "error" ? <Alert severity="error">{status.message}</Alert> : null}

        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {intakeFormCopy.requiredNote}
        </Typography>
      </Box>
    </Surface>
  );
}