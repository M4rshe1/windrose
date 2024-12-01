-- CreateEnum
CREATE TYPE "TourSectionStatus" AS ENUM ('PLANNED', 'VISITED', 'SKIPPED');

-- AlterTable
ALTER TABLE "TourSection" ADD COLUMN     "status" "TourSectionStatus" NOT NULL DEFAULT 'PLANNED';
