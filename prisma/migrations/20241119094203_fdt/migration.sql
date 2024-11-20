/*
  Warnings:

  - You are about to drop the column `postId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the `ArticleTraction` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `articleId` to the `Like` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ArticleTraction" DROP CONSTRAINT "ArticleTraction_articleId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_postId_fkey";

-- DropForeignKey
ALTER TABLE "Share" DROP CONSTRAINT "Share_articleId_fkey";

-- AlterTable
ALTER TABLE "Like" DROP COLUMN "postId",
ADD COLUMN     "articleId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "clickTimes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "ArticleTraction";

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
