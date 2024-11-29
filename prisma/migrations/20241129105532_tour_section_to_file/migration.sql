-- DropForeignKey
ALTER TABLE "TourSection" DROP CONSTRAINT "TourSection_fileId_fkey";

-- CreateTable
CREATE TABLE "TourSectionToFile" (
    "id" TEXT NOT NULL,
    "tourSectionId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TourSectionToFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TourSectionToFile" ADD CONSTRAINT "TourSectionToFile_tourSectionId_fkey" FOREIGN KEY ("tourSectionId") REFERENCES "TourSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourSectionToFile" ADD CONSTRAINT "TourSectionToFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
