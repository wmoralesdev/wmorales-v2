/*
  Warnings:

  - You are about to drop the column `user_id` on the `blog_comment_votes` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `blog_comments` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `blog_views` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `event_images` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `guestbook_entries` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `guestbook_tickets` table. All the data in the column will be lost.
  - You are about to drop the column `trigger_user_id` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `poll_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `survey_responses` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[comment_id,profile_id]` on the table `blog_comment_votes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `profile_id` to the `blog_comment_votes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_id` to the `blog_comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_id` to the `event_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_id` to the `guestbook_entries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_id` to the `guestbook_tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_id` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."event_images" DROP CONSTRAINT "event_images_user_id_fkey";

-- DropIndex
DROP INDEX "public"."blog_comment_votes_comment_id_user_id_key";

-- DropIndex
DROP INDEX "public"."blog_comment_votes_user_id_idx";

-- DropIndex
DROP INDEX "public"."blog_comments_user_id_idx";

-- DropIndex
DROP INDEX "public"."blog_views_user_id_idx";

-- DropIndex
DROP INDEX "public"."event_images_user_id_idx";

-- DropIndex
DROP INDEX "public"."guestbook_entries_user_id_idx";

-- DropIndex
DROP INDEX "public"."guestbook_tickets_user_id_idx";

-- DropIndex
DROP INDEX "public"."notifications_user_id_idx";

-- AlterTable
ALTER TABLE "public"."blog_comment_votes" DROP COLUMN "user_id",
ADD COLUMN     "profile_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."blog_comments" DROP COLUMN "user_id",
ADD COLUMN     "profile_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."blog_views" DROP COLUMN "user_id",
ADD COLUMN     "profile_id" TEXT;

-- AlterTable
ALTER TABLE "public"."event_images" DROP COLUMN "user_id",
ADD COLUMN     "profile_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."guestbook_entries" DROP COLUMN "user_id",
ADD COLUMN     "profile_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."guestbook_tickets" DROP COLUMN "user_id",
ADD COLUMN     "profile_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."notifications" DROP COLUMN "trigger_user_id",
DROP COLUMN "user_id",
ADD COLUMN     "profile_id" TEXT NOT NULL,
ADD COLUMN     "trigger_profile_id" TEXT;

-- AlterTable
ALTER TABLE "public"."poll_sessions" DROP COLUMN "user_id",
ADD COLUMN     "profile_id" TEXT;

-- AlterTable
ALTER TABLE "public"."profiles" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "company" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "githubUsername" TEXT,
ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "location" TEXT,
ADD COLUMN     "provider" TEXT,
ADD COLUMN     "twitterUsername" TEXT,
ADD COLUMN     "username" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "public"."survey_responses" DROP COLUMN "user_id",
ADD COLUMN     "profile_id" TEXT;

-- CreateIndex
CREATE INDEX "blog_comment_votes_profile_id_idx" ON "public"."blog_comment_votes"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "blog_comment_votes_comment_id_profile_id_key" ON "public"."blog_comment_votes"("comment_id", "profile_id");

-- CreateIndex
CREATE INDEX "blog_comments_profile_id_idx" ON "public"."blog_comments"("profile_id");

-- CreateIndex
CREATE INDEX "blog_views_profile_id_idx" ON "public"."blog_views"("profile_id");

-- CreateIndex
CREATE INDEX "event_images_profile_id_idx" ON "public"."event_images"("profile_id");

-- CreateIndex
CREATE INDEX "guestbook_entries_profile_id_idx" ON "public"."guestbook_entries"("profile_id");

-- CreateIndex
CREATE INDEX "guestbook_tickets_profile_id_idx" ON "public"."guestbook_tickets"("profile_id");

-- CreateIndex
CREATE INDEX "notifications_profile_id_idx" ON "public"."notifications"("profile_id");

-- CreateIndex
CREATE INDEX "poll_sessions_profile_id_idx" ON "public"."poll_sessions"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "public"."profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_username_key" ON "public"."profiles"("username");

-- CreateIndex
CREATE INDEX "profiles_email_idx" ON "public"."profiles"("email");

-- CreateIndex
CREATE INDEX "profiles_username_idx" ON "public"."profiles"("username");

-- CreateIndex
CREATE INDEX "profiles_provider_idx" ON "public"."profiles"("provider");

-- AddForeignKey
ALTER TABLE "public"."poll_sessions" ADD CONSTRAINT "poll_sessions_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."guestbook_entries" ADD CONSTRAINT "guestbook_entries_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."event_images" ADD CONSTRAINT "event_images_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_views" ADD CONSTRAINT "blog_views_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_comments" ADD CONSTRAINT "blog_comments_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_comment_votes" ADD CONSTRAINT "blog_comment_votes_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
