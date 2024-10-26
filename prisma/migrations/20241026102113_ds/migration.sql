/*
  Warnings:

  - Added the required column `publishedById` to the `articles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedById` to the `articles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "publishedById" TEXT NOT NULL,
ADD COLUMN     "updatedById" TEXT NOT NULL;
