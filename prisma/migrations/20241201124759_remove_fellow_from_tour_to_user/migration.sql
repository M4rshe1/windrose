/*
  Warnings:

  - The values [FELLOW] on the enum `TourToUserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `sectionOrder` on the `Tour` table. All the data in the column will be lost.
  - Made the column `datetime` on table `TourSection` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TourToUserRole_new" AS ENUM ('OWNER', 'EDITOR', 'VIEWER');
ALTER TABLE "TourToUser" ALTER COLUMN "role" TYPE "TourToUserRole_new" USING ("role"::text::"TourToUserRole_new");
ALTER TYPE "TourToUserRole" RENAME TO "TourToUserRole_old";
ALTER TYPE "TourToUserRole_new" RENAME TO "TourToUserRole";
DROP TYPE "TourToUserRole_old";
COMMIT;

-- AlterTable
ALTER TABLE "Tour" DROP COLUMN "sectionOrder";

-- AlterTable
ALTER TABLE "TourSection" ALTER COLUMN "datetime" SET NOT NULL;

-- AlterTable
ALTER TABLE "TourToUser" ADD COLUMN     "mentioned" BOOLEAN NOT NULL DEFAULT false;
