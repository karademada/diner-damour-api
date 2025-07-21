-- AlterTable
ALTER TABLE "User" ADD COLUMN     "acceptTerms" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "receiveNotifications" BOOLEAN NOT NULL DEFAULT false;
