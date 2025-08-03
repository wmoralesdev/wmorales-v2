/*
  Warnings:

  - You are about to drop the column `emoji` on the `poll_options` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."EventStatus" AS ENUM ('LIVE', 'ENDED');

-- AlterTable
ALTER TABLE "public"."events" ADD COLUMN     "status" "public"."EventStatus" NOT NULL DEFAULT 'LIVE';

-- AlterTable
ALTER TABLE "public"."poll_options" DROP COLUMN "emoji";

-- CreateTable
CREATE TABLE "public"."profiles" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "events_status_idx" ON "public"."events"("status");

-- AddForeignKey
ALTER TABLE "public"."event_images" ADD CONSTRAINT "event_images_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
