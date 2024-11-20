/*
  Warnings:

  - Added the required column `index` to the `media_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "media_items" ADD COLUMN     "index" INTEGER NOT NULL;
