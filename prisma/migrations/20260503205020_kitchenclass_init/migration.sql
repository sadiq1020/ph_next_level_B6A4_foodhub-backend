/*
  Warnings:

  - The values [PLACED,PREPARING,READY,DELIVERED] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `deliveryAddress` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryFee` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `orders` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'EXPIRED', 'CANCELLED');
ALTER TABLE "public"."orders" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "public"."OrderStatus_old";
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "meals" ADD COLUMN     "difficulty" TEXT,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "lessonsCount" INTEGER,
ADD COLUMN     "videoUrl" TEXT;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "deliveryAddress",
DROP COLUMN "deliveryFee",
DROP COLUMN "phone",
ADD COLUMN     "accessUntil" TIMESTAMP(3),
ALTER COLUMN "status" SET DEFAULT 'PENDING';
