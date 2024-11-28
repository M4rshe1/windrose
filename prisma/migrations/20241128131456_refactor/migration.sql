/*
  Warnings:

  - You are about to drop the column `private` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the `Comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TourToTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TourVisibility" AS ENUM ('PUBLIC', 'FOLLOWERS', 'PRIVATE');

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_tourId_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_userId_fkey";

-- DropForeignKey
ALTER TABLE "TourToTags" DROP CONSTRAINT "TourToTags_tagId_fkey";

-- DropForeignKey
ALTER TABLE "TourToTags" DROP CONSTRAINT "TourToTags_tourId_fkey";

-- AlterTable
ALTER TABLE "Tour" DROP COLUMN "private",
ADD COLUMN     "visibility" "TourVisibility" NOT NULL DEFAULT 'PUBLIC';

-- DropTable
DROP TABLE "Comments";

-- DropTable
DROP TABLE "Tags";

-- DropTable
DROP TABLE "TourToTags";

-- CreateTable
CREATE TABLE "UserLikeTourSection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tourSectionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLikeTourSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tourSectionId" TEXT,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "tourId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("tourId")
);

-- AddForeignKey
ALTER TABLE "UserLikeTourSection" ADD CONSTRAINT "UserLikeTourSection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikeTourSection" ADD CONSTRAINT "UserLikeTourSection_tourSectionId_fkey" FOREIGN KEY ("tourSectionId") REFERENCES "TourSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_tourSectionId_fkey" FOREIGN KEY ("tourSectionId") REFERENCES "TourSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
