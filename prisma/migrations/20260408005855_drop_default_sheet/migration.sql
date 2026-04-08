/*
  Warnings:

  - You are about to drop the column `default_sheet` on the `users_config` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users_config" DROP CONSTRAINT "users_config_default_sheet_fkey";

-- AlterTable
ALTER TABLE "users_config" DROP COLUMN "default_sheet";
