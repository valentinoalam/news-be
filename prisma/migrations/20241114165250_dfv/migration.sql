/*
  Warnings:

  - You are about to drop the column `description` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `isFeatured` on the `media_items` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[coverImageId]` on the table `articles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "articles" DROP COLUMN "description",
ADD COLUMN     "coverImageId" TEXT,
ADD COLUMN     "html" TEXT,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "content" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "media_items" DROP COLUMN "isFeatured";

-- CreateIndex
CREATE UNIQUE INDEX "articles_coverImageId_key" ON "articles"("coverImageId");
