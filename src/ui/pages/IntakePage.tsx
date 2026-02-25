import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Box, Typography } from "@mui/material";

import Surface from "@/src/ui/components/Surface";
import prisma from "@/src/server/db/prisma";
import { PurchaseStatus } from "@/src/generated/prisma/enums";
import { verifyIntakeLinkToken } from "@/src/server/auth/tokens";
import EngagementIntakeForm from "@/src/ui/widgets/EngagementIntakeForm";

export const metadata: Metadata = {
  title: "Engagement intake",
  description: "Provide details so we can start your engagement.",
  robots: { index: false, follow: false },
};

function asRecord(v: unknown): Record<string, unknown> | null {
  if (!v || typeof v !== "object" || Array.isArray(v)) return null;
  return v as Record<string, unknown>;
}

export default async function IntakePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const v = verifyIntakeLinkToken(token);
  if (!v.ok) notFound();

  const purchase = await prisma.purchase.findUnique({
    where: { id: v.purchaseId },
    include: { customer: true, intake: true },
  });

  if (!purchase) notFound();
  if (purchase.status !== PurchaseStatus.PAID) notFound();

  const existingData = asRecord(purchase.intake?.data);
  const submittedAtIso = purchase.intake?.submittedAt
    ? purchase.intake.submittedAt.toISOString()
    : null;

  return (
    <Box component="main" sx={{ py: 2, pb: 6 }}>
      <Surface>
        <Typography variant="overline" sx={{ color: "text.secondary", letterSpacing: "0.14em" }}>
          Engagement
        </Typography>

        <Typography variant="h3" sx={{ mt: 0.5 }}>
          Intake form
        </Typography>

        <Typography sx={{ color: "text.secondary", mt: 1.2, maxWidth: 860 }}>
          Please fill this out so we can start quickly.
        </Typography>
      </Surface>

      <Box sx={{ mt: 2 }}>
        <EngagementIntakeForm
          token={token}
          defaultEmail={purchase.customer.email}
          planId={purchase.planId}
          existingData={existingData}
          submittedAtIso={submittedAtIso}
        />
      </Box>
    </Box>
  );
}