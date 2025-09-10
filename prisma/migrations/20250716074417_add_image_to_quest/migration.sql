/*
  Warnings:

  - Added the required column `image` to the `Quest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quest" ADD COLUMN     "image" TEXT NOT NULL;
