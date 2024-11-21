/*
  Warnings:

  - Added the required column `sessionId` to the `media_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "media_items" ADD COLUMN     "sessionId" CHAR(36) NOT NULL;
