/*
  Warnings:

  - You are about to drop the column `viewCount` on the `articles` table. All the data in the column will be lost.
  - Added the required column `startTime` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SocialShare" AS ENUM ('Facebook', 'Whatsapp', 'Twitter');

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "deviceType" TEXT,
ADD COLUMN     "duration" DOUBLE PRECISION,
ADD COLUMN     "endTime" TIMESTAMP(3),
ADD COLUMN     "location" TEXT,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "articles" DROP COLUMN "viewCount";

-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "source" TEXT,
    "referrer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleTraction" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "ClickTimes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ArticleTraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Share" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Share_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ArticleTraction" ADD CONSTRAINT "ArticleTraction_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ArticleTraction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "ArticleTraction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
