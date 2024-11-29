/*
  Warnings:

  - Added the required column `order` to the `TourSection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TourSection" ADD COLUMN     "order" INTEGER NOT NULL;
