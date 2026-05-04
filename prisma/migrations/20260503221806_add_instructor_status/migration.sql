-- CreateEnum
CREATE TYPE "InstructorStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "instructor_profiles" ADD COLUMN     "status" "InstructorStatus" NOT NULL DEFAULT 'PENDING';
