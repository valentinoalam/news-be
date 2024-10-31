/*
  Warnings:

  - You are about to drop the column `featuredImage` on the `articles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "articles" DROP COLUMN "featuredImage";

-- AlterTable
ALTER TABLE "media_items" ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;
