/*
  Warnings:

  - You are about to drop the column `githubId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `googleId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[providerAccId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `provider` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_githubId_key";

-- DropIndex
DROP INDEX "users_googleId_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "githubId",
DROP COLUMN "googleId",
ADD COLUMN     "provider" TEXT NOT NULL,
ADD COLUMN     "providerAccId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_providerAccId_key" ON "users"("providerAccId");
