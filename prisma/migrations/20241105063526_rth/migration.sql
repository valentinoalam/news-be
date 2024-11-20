/*
  Warnings:

  - You are about to drop the column `keywords` on the `article_metadata` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `publishedById` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the `_ArticleToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('Draft', 'Published', 'Archived');

-- DropForeignKey
ALTER TABLE "_ArticleToTag" DROP CONSTRAINT "_ArticleToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ArticleToTag" DROP CONSTRAINT "_ArticleToTag_B_fkey";

-- AlterTable
ALTER TABLE "article_metadata" DROP COLUMN "keywords";

-- AlterTable
ALTER TABLE "articles" DROP COLUMN "published",
DROP COLUMN "publishedById",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "status" "ArticleStatus" NOT NULL DEFAULT 'Draft';

-- DropTable
DROP TABLE "_ArticleToTag";

-- CreateTable
CREATE TABLE "_ArticleMetadataToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ArticleMetadataToTag_AB_unique" ON "_ArticleMetadataToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ArticleMetadataToTag_B_index" ON "_ArticleMetadataToTag"("B");

-- AddForeignKey
ALTER TABLE "_ArticleMetadataToTag" ADD CONSTRAINT "_ArticleMetadataToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "article_metadata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleMetadataToTag" ADD CONSTRAINT "_ArticleMetadataToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
