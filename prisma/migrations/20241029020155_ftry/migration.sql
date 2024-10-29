/*
  Warnings:

  - You are about to drop the `_ArticleToCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `articles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ArticleToCategory" DROP CONSTRAINT "_ArticleToCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_ArticleToCategory" DROP CONSTRAINT "_ArticleToCategory_B_fkey";

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "categoryId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ArticleToCategory";

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
