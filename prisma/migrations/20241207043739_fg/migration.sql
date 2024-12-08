/*
  Warnings:

  - The primary key for the `Like` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Like` table. All the data in the column will be lost.
  - The primary key for the `View` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `View` table. All the data in the column will be lost.
  - The `articleId` column on the `analytics_events` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `article_metadata` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `article_metadata` table. All the data in the column will be lost.
  - The primary key for the `article_revisions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `article_revisions` table. All the data in the column will be lost.
  - The primary key for the `articles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `articles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `articleId` column on the `media_items` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `profiles` table. All the data in the column will be lost.
  - The primary key for the `tags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `tags` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `_ArticleMetadataToTag` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `articleId` on the `Like` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `articleId` on the `Share` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `articleId` on the `View` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `articleId` on the `article_metadata` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `articleId` on the `article_revisions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `articleId` on the `comments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_articleId_fkey";

-- DropForeignKey
ALTER TABLE "Share" DROP CONSTRAINT "Share_articleId_fkey";

-- DropForeignKey
ALTER TABLE "View" DROP CONSTRAINT "View_articleId_fkey";

-- DropForeignKey
ALTER TABLE "_ArticleMetadataToTag" DROP CONSTRAINT "_ArticleMetadataToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ArticleMetadataToTag" DROP CONSTRAINT "_ArticleMetadataToTag_B_fkey";

-- DropForeignKey
ALTER TABLE "analytics_events" DROP CONSTRAINT "analytics_events_articleId_fkey";

-- DropForeignKey
ALTER TABLE "article_metadata" DROP CONSTRAINT "article_metadata_articleId_fkey";

-- DropForeignKey
ALTER TABLE "article_revisions" DROP CONSTRAINT "article_revisions_articleId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_articleId_fkey";

-- DropForeignKey
ALTER TABLE "media_items" DROP CONSTRAINT "media_items_articleId_fkey";

-- DropIndex
DROP INDEX "Like_articleId_userId_key";

-- DropIndex
DROP INDEX "article_revisions_articleId_version_key";

-- AlterTable
ALTER TABLE "Like" DROP CONSTRAINT "Like_pkey",
DROP COLUMN "id",
DROP COLUMN "articleId",
ADD COLUMN     "articleId" INTEGER NOT NULL,
ADD CONSTRAINT "Like_pkey" PRIMARY KEY ("articleId", "userId");

-- AlterTable
ALTER TABLE "Share" DROP COLUMN "articleId",
ADD COLUMN     "articleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "View" DROP CONSTRAINT "View_pkey",
DROP COLUMN "id",
DROP COLUMN "articleId",
ADD COLUMN     "articleId" INTEGER NOT NULL,
ADD CONSTRAINT "View_pkey" PRIMARY KEY ("articleId", "userId");

-- AlterTable
ALTER TABLE "analytics_events" DROP COLUMN "articleId",
ADD COLUMN     "articleId" INTEGER;

-- AlterTable
ALTER TABLE "article_metadata" DROP CONSTRAINT "article_metadata_pkey",
DROP COLUMN "id",
DROP COLUMN "articleId",
ADD COLUMN     "articleId" INTEGER NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ADD CONSTRAINT "article_metadata_pkey" PRIMARY KEY ("articleId");

-- AlterTable
ALTER TABLE "article_revisions" DROP CONSTRAINT "article_revisions_pkey",
DROP COLUMN "id",
DROP COLUMN "articleId",
ADD COLUMN     "articleId" INTEGER NOT NULL,
ADD CONSTRAINT "article_revisions_pkey" PRIMARY KEY ("articleId", "version");

-- AlterTable
ALTER TABLE "articles" DROP CONSTRAINT "articles_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "articles_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "articleId",
ADD COLUMN     "articleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "media_items" DROP COLUMN "articleId",
ADD COLUMN     "articleId" INTEGER;

-- AlterTable
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "tags" DROP CONSTRAINT "tags_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "_ArticleMetadataToTag";

-- CreateTable
CREATE TABLE "_ArticleTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ArticleTags_AB_unique" ON "_ArticleTags"("A", "B");

-- CreateIndex
CREATE INDEX "_ArticleTags_B_index" ON "_ArticleTags"("B");

-- CreateIndex
CREATE INDEX "Like_articleId_idx" ON "Like"("articleId");

-- CreateIndex
CREATE INDEX "Like_userId_idx" ON "Like"("userId");

-- CreateIndex
CREATE INDEX "Share_createdAt_idx" ON "Share"("createdAt");

-- CreateIndex
CREATE INDEX "Share_articleId_idx" ON "Share"("articleId");

-- CreateIndex
CREATE INDEX "View_articleId_idx" ON "View"("articleId");

-- CreateIndex
CREATE INDEX "View_userId_idx" ON "View"("userId");

-- CreateIndex
CREATE INDEX "View_createdAt_idx" ON "View"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "article_metadata_articleId_key" ON "article_metadata"("articleId");

-- CreateIndex
CREATE INDEX "article_metadata_articleId_idx" ON "article_metadata"("articleId");

-- CreateIndex
CREATE INDEX "article_revisions_articleId_idx" ON "article_revisions"("articleId");

-- CreateIndex
CREATE INDEX "articles_authorId_idx" ON "articles"("authorId");

-- CreateIndex
CREATE INDEX "profiles_createdAt_idx" ON "profiles"("createdAt");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "View" ADD CONSTRAINT "View_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_revisions" ADD CONSTRAINT "article_revisions_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_metadata" ADD CONSTRAINT "article_metadata_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_items" ADD CONSTRAINT "media_items_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleTags" ADD CONSTRAINT "_ArticleTags_A_fkey" FOREIGN KEY ("A") REFERENCES "article_metadata"("articleId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleTags" ADD CONSTRAINT "_ArticleTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
