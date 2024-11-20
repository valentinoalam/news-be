/*
  Warnings:

  - You are about to drop the column `slug` on the `tags` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `tags` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "tags_slug_key";

-- AlterTable
ALTER TABLE "tags" DROP COLUMN "slug",
DROP COLUMN "updatedAt";
