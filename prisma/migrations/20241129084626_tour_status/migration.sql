/*
  Warnings:

  - The values [DRAFT] on the enum `TourStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TourStatus_new" AS ENUM ('PLANNING', 'ON_TOUR', 'FINISHED');
ALTER TABLE "Tour" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Tour" ALTER COLUMN "status" TYPE "TourStatus_new" USING ("status"::text::"TourStatus_new");
ALTER TYPE "TourStatus" RENAME TO "TourStatus_old";
ALTER TYPE "TourStatus_new" RENAME TO "TourStatus";
DROP TYPE "TourStatus_old";
ALTER TABLE "Tour" ALTER COLUMN "status" SET DEFAULT 'PLANNING';
COMMIT;

-- AlterTable
ALTER TABLE "Tour" ALTER COLUMN "status" SET DEFAULT 'PLANNING';
