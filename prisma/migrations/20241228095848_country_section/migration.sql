-- AlterTable
ALTER TABLE "TourSection" ADD COLUMN     "countryId" TEXT;

-- AddForeignKey
ALTER TABLE "TourSection" ADD CONSTRAINT "TourSection_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;
