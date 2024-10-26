-- AlterTable
ALTER TABLE "articles" ALTER COLUMN "publishedById" DROP NOT NULL,
ALTER COLUMN "updatedById" DROP NOT NULL;
