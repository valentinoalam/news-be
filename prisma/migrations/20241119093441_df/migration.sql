/*
  Warnings:

  - You are about to drop the column `ClickTimes` on the `ArticleTraction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ArticleTraction" DROP COLUMN "ClickTimes",
ADD COLUMN     "clickTimes" INTEGER NOT NULL DEFAULT 0;
