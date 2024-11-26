-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gender" TEXT DEFAULT 'UNKNOWN';
