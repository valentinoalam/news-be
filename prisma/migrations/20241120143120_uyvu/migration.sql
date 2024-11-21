/*
  Warnings:

  - A unique constraint covering the columns `[verificationToken]` on the table `newsletter_subscriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "SubscriptionStatus" ADD VALUE 'INACTIVE';

-- AlterTable
ALTER TABLE "media_items" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "newsletter_subscriptions" ADD COLUMN     "verificationToken" TEXT,
ADD COLUMN     "verificationTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscriptions_verificationToken_key" ON "newsletter_subscriptions"("verificationToken");
