/*
  Warnings:

  - Made the column `town` on table `WatchedTown` required. This step will fail if there are existing NULL values in that column.
  - Made the column `zip` on table `WatchedTown` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "WatchedTown" ALTER COLUMN "town" SET NOT NULL,
ALTER COLUMN "town" SET DEFAULT '',
ALTER COLUMN "zip" SET NOT NULL,
ALTER COLUMN "zip" SET DEFAULT '';
