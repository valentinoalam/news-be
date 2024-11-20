/*
  Warnings:

  - You are about to alter the column `articleId` on the `Share` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(36)`.
  - You are about to drop the column `seoDesc` on the `article_metadata` table. All the data in the column will be lost.
  - You are about to alter the column `articleId` on the `article_metadata` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(36)`.
  - You are about to alter the column `articleId` on the `article_revisions` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(36)`.
  - You are about to alter the column `parentId` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(36)`.
  - You are about to alter the column `articleId` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(36)`.
  - You are about to alter the column `authorId` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(36)`.
  - You are about to alter the column `parentId` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(36)`.
  - You are about to alter the column `articleId` on the `media_items` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(36)`.
  - You are about to alter the column `userId` on the `newsletter_subscriptions` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(36)`.
  - A unique constraint covering the columns `[articleId,userId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Like` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Share" DROP CONSTRAINT "Share_articleId_fkey";

-- DropForeignKey
ALTER TABLE "article_metadata" DROP CONSTRAINT "article_metadata_articleId_fkey";

-- DropForeignKey
ALTER TABLE "article_revisions" DROP CONSTRAINT "article_revisions_articleId_fkey";

-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_parentId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_articleId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_authorId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_parentId_fkey";

-- DropForeignKey
ALTER TABLE "media_items" DROP CONSTRAINT "media_items_articleId_fkey";

-- DropForeignKey
ALTER TABLE "newsletter_subscriptions" DROP CONSTRAINT "newsletter_subscriptions_userId_fkey";

-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "userId" CHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE "Share" ALTER COLUMN "articleId" SET DATA TYPE CHAR(36);

-- AlterTable
ALTER TABLE "article_metadata" DROP COLUMN "seoDesc",
ADD COLUMN     "abstract" TEXT,
ADD COLUMN     "author" TEXT[],
ALTER COLUMN "articleId" SET DATA TYPE CHAR(36);

-- AlterTable
ALTER TABLE "article_revisions" ALTER COLUMN "articleId" SET DATA TYPE CHAR(36);

-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "parentId" SET DATA TYPE CHAR(36);

-- AlterTable
ALTER TABLE "comments" ALTER COLUMN "articleId" SET DATA TYPE CHAR(36),
ALTER COLUMN "authorId" SET DATA TYPE CHAR(36),
ALTER COLUMN "parentId" SET DATA TYPE CHAR(36);

-- AlterTable
ALTER TABLE "media_items" ALTER COLUMN "articleId" SET DATA TYPE CHAR(36);

-- AlterTable
ALTER TABLE "newsletter_subscriptions" ALTER COLUMN "userId" SET DATA TYPE CHAR(36);

-- CreateIndex
CREATE UNIQUE INDEX "Like_articleId_userId_key" ON "Like"("articleId", "userId");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_revisions" ADD CONSTRAINT "article_revisions_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_metadata" ADD CONSTRAINT "article_metadata_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_items" ADD CONSTRAINT "media_items_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "newsletter_subscriptions" ADD CONSTRAINT "newsletter_subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
