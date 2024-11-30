/*
  Warnings:

  - You are about to drop the column `order` on the `TourSection` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tour" ADD COLUMN     "sectionOrder" JSONB[];

-- AlterTable
ALTER TABLE "TourSection" DROP COLUMN "order";
