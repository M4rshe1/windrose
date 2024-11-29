-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_tourSectionId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_tourId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "Pin" DROP CONSTRAINT "Pin_tourId_fkey";

-- DropForeignKey
ALTER TABLE "Pin" DROP CONSTRAINT "Pin_userId_fkey";

-- DropForeignKey
ALTER TABLE "Saved" DROP CONSTRAINT "Saved_tourId_fkey";

-- DropForeignKey
ALTER TABLE "Saved" DROP CONSTRAINT "Saved_userId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_tourId_fkey";

-- DropForeignKey
ALTER TABLE "TourSection" DROP CONSTRAINT "TourSection_tourId_fkey";

-- DropForeignKey
ALTER TABLE "TourSectionToFile" DROP CONSTRAINT "TourSectionToFile_fileId_fkey";

-- DropForeignKey
ALTER TABLE "TourSectionToFile" DROP CONSTRAINT "TourSectionToFile_tourSectionId_fkey";

-- DropForeignKey
ALTER TABLE "TourToUser" DROP CONSTRAINT "TourToUser_tourId_fkey";

-- DropForeignKey
ALTER TABLE "TourToUser" DROP CONSTRAINT "TourToUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserLikeTourSection" DROP CONSTRAINT "UserLikeTourSection_tourSectionId_fkey";

-- DropForeignKey
ALTER TABLE "UserLikeTourSection" DROP CONSTRAINT "UserLikeTourSection_userId_fkey";

-- AddForeignKey
ALTER TABLE "Pin" ADD CONSTRAINT "Pin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pin" ADD CONSTRAINT "Pin_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saved" ADD CONSTRAINT "Saved_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saved" ADD CONSTRAINT "Saved_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikeTourSection" ADD CONSTRAINT "UserLikeTourSection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikeTourSection" ADD CONSTRAINT "UserLikeTourSection_tourSectionId_fkey" FOREIGN KEY ("tourSectionId") REFERENCES "TourSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourSection" ADD CONSTRAINT "TourSection_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourSectionToFile" ADD CONSTRAINT "TourSectionToFile_tourSectionId_fkey" FOREIGN KEY ("tourSectionId") REFERENCES "TourSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourSectionToFile" ADD CONSTRAINT "TourSectionToFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourToUser" ADD CONSTRAINT "TourToUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourToUser" ADD CONSTRAINT "TourToUser_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_tourSectionId_fkey" FOREIGN KEY ("tourSectionId") REFERENCES "TourSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
