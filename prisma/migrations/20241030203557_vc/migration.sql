/*
  Warnings:

  - You are about to drop the `_ArticleToMediaItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `articleId` to the `media_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ArticleToMediaItem" DROP CONSTRAINT "_ArticleToMediaItem_A_fkey";

-- DropForeignKey
ALTER TABLE "_ArticleToMediaItem" DROP CONSTRAINT "_ArticleToMediaItem_B_fkey";

-- AlterTable
ALTER TABLE "media_items" ADD COLUMN     "articleId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'SUBSCRIBER';

-- DropTable
DROP TABLE "_ArticleToMediaItem";

-- AddForeignKey
ALTER TABLE "media_items" ADD CONSTRAINT "media_items_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
