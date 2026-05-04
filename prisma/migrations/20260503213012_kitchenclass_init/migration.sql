/*
  Warnings:

  - You are about to drop the column `providerId` on the `meals` table. All the data in the column will be lost.
  - You are about to drop the `provider_profiles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `instructorId` to the `meals` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "meals" DROP CONSTRAINT "meals_providerId_fkey";

-- DropForeignKey
ALTER TABLE "provider_profiles" DROP CONSTRAINT "provider_profiles_userId_fkey";

-- AlterTable
ALTER TABLE "meals" DROP COLUMN "providerId",
ADD COLUMN     "instructorId" TEXT NOT NULL;

-- DropTable
DROP TABLE "provider_profiles";

-- CreateTable
CREATE TABLE "instructor_profiles" (
    "id" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT NOT NULL,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "instructor_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "instructor_profiles_userId_key" ON "instructor_profiles"("userId");

-- AddForeignKey
ALTER TABLE "instructor_profiles" ADD CONSTRAINT "instructor_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meals" ADD CONSTRAINT "meals_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "instructor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
