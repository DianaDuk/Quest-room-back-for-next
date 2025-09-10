-- фиксация текущего состояния базы как baseline
-- таблица Order
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "name" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE "Order" ALTER COLUMN "createdAt" SET DEFAULT now();
CREATE UNIQUE INDEX IF NOT EXISTS "Order_questId_bookingDate_key" ON "Order"("questId", "bookingDate");

-- таблица User
CREATE UNIQUE INDEX IF NOT EXISTS "User_phone_key" ON "User"("phone");
