/*
  Warnings:

  - Changed the type of `value` on the `Setting` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Setting" DROP COLUMN "value",
ADD COLUMN     "value" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "showEmail" BOOLEAN NOT NULL DEFAULT false;
