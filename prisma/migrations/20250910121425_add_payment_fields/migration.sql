/*
  Warnings:

  - Made the column `name` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "stripeSessionId" TEXT,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "phone" DROP NOT NULL;

-- RenameIndex
ALTER INDEX "User_phone_key" RENAME TO "user_phone_key";
