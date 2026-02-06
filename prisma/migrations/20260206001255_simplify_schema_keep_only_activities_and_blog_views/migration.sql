/*
  Warnings:

  - You are about to drop the column `profile_id` on the `blog_views` table. All the data in the column will be lost.
  - You are about to drop the `blog_comment_votes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blog_comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `event_content` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `event_images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `guestbook_entries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `guestbook_tickets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `poll_options` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `poll_questions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `poll_sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `poll_votes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `polls` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `short_urls` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `survey_answer_options` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `survey_answers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `survey_question_options` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `survey_questions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `survey_responses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `survey_sections` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `surveys` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "blog_comment_votes" DROP CONSTRAINT "blog_comment_votes_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "blog_comment_votes" DROP CONSTRAINT "blog_comment_votes_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "blog_comments" DROP CONSTRAINT "blog_comments_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "blog_comments" DROP CONSTRAINT "blog_comments_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "blog_views" DROP CONSTRAINT "blog_views_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "event_content" DROP CONSTRAINT "event_content_event_id_fkey";

-- DropForeignKey
ALTER TABLE "event_images" DROP CONSTRAINT "event_images_event_id_fkey";

-- DropForeignKey
ALTER TABLE "event_images" DROP CONSTRAINT "event_images_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "guestbook_entries" DROP CONSTRAINT "guestbook_entries_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "guestbook_tickets" DROP CONSTRAINT "guestbook_tickets_entry_id_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "poll_options" DROP CONSTRAINT "poll_options_question_id_fkey";

-- DropForeignKey
ALTER TABLE "poll_questions" DROP CONSTRAINT "poll_questions_poll_id_fkey";

-- DropForeignKey
ALTER TABLE "poll_sessions" DROP CONSTRAINT "poll_sessions_poll_id_fkey";

-- DropForeignKey
ALTER TABLE "poll_sessions" DROP CONSTRAINT "poll_sessions_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "poll_votes" DROP CONSTRAINT "poll_votes_option_id_fkey";

-- DropForeignKey
ALTER TABLE "poll_votes" DROP CONSTRAINT "poll_votes_question_id_fkey";

-- DropForeignKey
ALTER TABLE "poll_votes" DROP CONSTRAINT "poll_votes_session_id_fkey";

-- DropForeignKey
ALTER TABLE "survey_answer_options" DROP CONSTRAINT "survey_answer_options_answer_id_fkey";

-- DropForeignKey
ALTER TABLE "survey_answer_options" DROP CONSTRAINT "survey_answer_options_option_id_fkey";

-- DropForeignKey
ALTER TABLE "survey_answers" DROP CONSTRAINT "survey_answers_question_id_fkey";

-- DropForeignKey
ALTER TABLE "survey_answers" DROP CONSTRAINT "survey_answers_response_id_fkey";

-- DropForeignKey
ALTER TABLE "survey_question_options" DROP CONSTRAINT "survey_question_options_question_id_fkey";

-- DropForeignKey
ALTER TABLE "survey_questions" DROP CONSTRAINT "survey_questions_section_id_fkey";

-- DropForeignKey
ALTER TABLE "survey_responses" DROP CONSTRAINT "survey_responses_survey_id_fkey";

-- DropForeignKey
ALTER TABLE "survey_sections" DROP CONSTRAINT "survey_sections_survey_id_fkey";

-- DropIndex
DROP INDEX "blog_views_profile_id_idx";

-- AlterTable
ALTER TABLE "blog_views" DROP COLUMN "profile_id";

-- DropTable
DROP TABLE "blog_comment_votes";

-- DropTable
DROP TABLE "blog_comments";

-- DropTable
DROP TABLE "event_content";

-- DropTable
DROP TABLE "event_images";

-- DropTable
DROP TABLE "events";

-- DropTable
DROP TABLE "guestbook_entries";

-- DropTable
DROP TABLE "guestbook_tickets";

-- DropTable
DROP TABLE "notifications";

-- DropTable
DROP TABLE "poll_options";

-- DropTable
DROP TABLE "poll_questions";

-- DropTable
DROP TABLE "poll_sessions";

-- DropTable
DROP TABLE "poll_votes";

-- DropTable
DROP TABLE "polls";

-- DropTable
DROP TABLE "profiles";

-- DropTable
DROP TABLE "short_urls";

-- DropTable
DROP TABLE "survey_answer_options";

-- DropTable
DROP TABLE "survey_answers";

-- DropTable
DROP TABLE "survey_question_options";

-- DropTable
DROP TABLE "survey_questions";

-- DropTable
DROP TABLE "survey_responses";

-- DropTable
DROP TABLE "survey_sections";

-- DropTable
DROP TABLE "surveys";

-- DropEnum
DROP TYPE "EventStatus";

-- CreateTable
CREATE TABLE "activities" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "time" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "activities_slug_key" ON "activities"("slug");

-- CreateIndex
CREATE INDEX "activities_date_idx" ON "activities"("date");

-- CreateIndex
CREATE INDEX "activities_slug_idx" ON "activities"("slug");
