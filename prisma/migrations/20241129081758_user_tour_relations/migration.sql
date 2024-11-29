/*
  Warnings:

  - You are about to drop the column `isFavorite` on the `TourToUser` table. All the data in the column will be lost.
  - You are about to drop the column `isFollow` on the `TourToUser` table. All the data in the column will be lost.
  - You are about to drop the column `isPinned` on the `TourToUser` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Tour` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "TourToUser" DROP COLUMN "isFavorite",
DROP COLUMN "isFollow",
DROP COLUMN "isPinned";

-- CreateTable
CREATE TABLE "Pin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Saved" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Saved_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pin_userId_tourId_key" ON "Pin"("userId", "tourId");

-- CreateIndex
CREATE UNIQUE INDEX "Saved_userId_tourId_key" ON "Saved"("userId", "tourId");

-- CreateIndex
CREATE UNIQUE INDEX "Tour_name_key" ON "Tour"("name");

-- AddForeignKey
ALTER TABLE "Pin" ADD CONSTRAINT "Pin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pin" ADD CONSTRAINT "Pin_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saved" ADD CONSTRAINT "Saved_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saved" ADD CONSTRAINT "Saved_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
