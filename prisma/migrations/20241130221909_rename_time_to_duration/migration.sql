/*
  Warnings:

  - You are about to drop the column `time` on the `TourSection` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TourSection" DROP COLUMN "time",
ADD COLUMN     "duration" INTEGER;
