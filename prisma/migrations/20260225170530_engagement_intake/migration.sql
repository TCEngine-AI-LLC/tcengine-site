-- CreateTable
CREATE TABLE "EngagementIntake" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "purchaseId" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "data" JSONB,

    CONSTRAINT "EngagementIntake_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EngagementIntake_purchaseId_key" ON "EngagementIntake"("purchaseId");

-- CreateIndex
CREATE INDEX "EngagementIntake_createdAt_idx" ON "EngagementIntake"("createdAt");

-- CreateIndex
CREATE INDEX "EngagementIntake_submittedAt_idx" ON "EngagementIntake"("submittedAt");

-- AddForeignKey
ALTER TABLE "EngagementIntake" ADD CONSTRAINT "EngagementIntake_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
