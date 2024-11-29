/*
  Warnings:

  - You are about to drop the column `loaction` on the `TourSection` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tour" ADD COLUMN     "startDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "TourSection" DROP COLUMN "loaction";
