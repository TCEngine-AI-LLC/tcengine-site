import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Alert,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";

import prisma from "@/src/server/db/prisma";
import { PurchaseStatus } from "@/src/generated/prisma/enums";
import { requireAdminOrRedirect } from "@/src/server/auth/requireAdmin";
import { signIntakeLinkToken } from "@/src/server/auth/tokens";

import Section from "@/src/ui/components/Section";
import Surface from "@/src/ui/components/Surface";
import ActionIconButton from "@/src/ui/components/ActionIconButton";
import EngagementIntakeForm from "@/src/ui/widgets/EngagementIntakeForm";

export const metadata: Metadata = {
  title: "Customer",
  description: "Admin customer detail",
  robots: { index: false, follow: false },
};

function fmt(d: Date | null | undefined): string {
  if (!d) return "-";
  return `${d.toISOString().replace("T", " ").slice(0, 19)}Z`;
}

function asRecord(v: unknown): Record<string, unknown> | null {
  if (!v || typeof v !== "object" || Array.isArray(v)) return null;
  return v as Record<string, unknown>;
}

export default async function AdminCustomerPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  await requireAdminOrRedirect("/admin/customers");

  const { customerId } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      purchases: {
        orderBy: { createdAt: "desc" },
        include: { intake: true },
      },
      leads: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  if (!customer) notFound();

  const latestPaid = customer.purchases.find((p) => p.status === PurchaseStatus.PAID) ?? null;

  // Intake submit API requires PAID purchase (by design)
  const intakeToken = latestPaid ? signIntakeLinkToken(latestPaid.id) : null;

  const existingData = asRecord(latestPaid?.intake?.data);
  const submittedAtIso = latestPaid?.intake?.submittedAt
    ? latestPaid.intake.submittedAt.toISOString()
    : null;

  return (
    <Box component="main" sx={{ py: 2, pb: 6 }}>
      <Surface>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="overline" sx={{ color: "text.secondary", letterSpacing: "0.14em" }}>
              Admin
            </Typography>

            <Typography variant="h3" sx={{ mt: 0.5, fontWeight: 900, letterSpacing: "-0.03em" }}>
              Customer
            </Typography>

            <Typography sx={{ color: "text.secondary", mt: 1.2 }}>
              <Box component="span" sx={{ fontFamily: "var(--font-geist-mono)" }}>
                {customer.email}
              </Box>
            </Typography>

            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              Created: {fmt(customer.createdAt)} · Last seen: {fmt(customer.lastSeenAt)}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
            <Link href="/admin/customers">
              <ActionIconButton tooltip="Back to customers" aria-label="Back to customers">
                <ArrowBackRoundedIcon />
              </ActionIconButton>
            </Link>

            {intakeToken ? (
              <Link
                href={`/intake/${encodeURIComponent(intakeToken)}`}
                target="_blank"
                rel="noreferrer"
              >
                <ActionIconButton tooltip="Open user intake link" aria-label="Open user intake link">
                  <OpenInNewRoundedIcon />
                </ActionIconButton>
              </Link>
            ) : null}
          </Box>
        </Box>
      </Surface>

      <Section title="Purchases">
        <Surface sx={{ overflowX: "auto" }}>
          {customer.purchases.length === 0 ? (
            <Typography sx={{ color: "text.secondary" }}>No purchases yet.</Typography>
          ) : (
            <Table size="small" aria-label="Purchases">
              <TableHead>
                <TableRow>
                  <TableCell>Created</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Paid at</TableCell>
                  <TableCell>Has intake</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customer.purchases.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell sx={{ color: "text.secondary" }}>{fmt(p.createdAt)}</TableCell>
                    <TableCell sx={{ fontFamily: "var(--font-geist-mono)" }}>{p.planId}</TableCell>
                    <TableCell sx={{ fontFamily: "var(--font-geist-mono)" }}>{p.status}</TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>{fmt(p.paidAt)}</TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>{p.intake?.submittedAt ? "yes" : "no"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Surface>
      </Section>

      <Section title="Intake">
        {latestPaid && intakeToken ? (
          <EngagementIntakeForm
            mode="admin"
            token={intakeToken}
            defaultEmail={customer.email}
            planId={latestPaid.planId}
            existingData={existingData}
            submittedAtIso={submittedAtIso}
          />
        ) : (
          <Surface>
            <Alert severity="info">
              No PAID purchase found for this customer yet — intake is only available for paid engagements.
            </Alert>
          </Surface>
        )}
      </Section>
    </Box>
  );
}