-- DropForeignKey
ALTER TABLE "media_items" DROP CONSTRAINT "media_items_articleId_fkey";

-- AlterTable
ALTER TABLE "media_items" ALTER COLUMN "articleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "media_items" ADD CONSTRAINT "media_items_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
