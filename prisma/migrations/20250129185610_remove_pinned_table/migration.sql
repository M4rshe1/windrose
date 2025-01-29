/*
  Warnings:

  - You are about to drop the `Pin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pin" DROP CONSTRAINT "Pin_tourId_fkey";

-- DropForeignKey
ALTER TABLE "Pin" DROP CONSTRAINT "Pin_userId_fkey";

-- AlterTable
ALTER TABLE "TourToUser" ADD COLUMN     "pinned" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Pin";
