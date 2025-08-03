/*
  Warnings:

  - You are about to drop the column `description` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `events` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `events` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."events" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."poll_options" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en';

-- AlterTable
ALTER TABLE "public"."poll_questions" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en';

-- AlterTable
ALTER TABLE "public"."polls" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en';

-- AlterTable
ALTER TABLE "public"."survey_question_options" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en';

-- AlterTable
ALTER TABLE "public"."survey_questions" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en';

-- AlterTable
ALTER TABLE "public"."survey_sections" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en';

-- AlterTable
ALTER TABLE "public"."surveys" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en';

-- CreateTable
CREATE TABLE "public"."event_content" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "event_content_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "event_content_event_id_idx" ON "public"."event_content"("event_id");

-- CreateIndex
CREATE INDEX "event_content_language_idx" ON "public"."event_content"("language");

-- CreateIndex
CREATE UNIQUE INDEX "event_content_event_id_language_key" ON "public"."event_content"("event_id", "language");

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "public"."events"("slug");

-- CreateIndex
CREATE INDEX "events_slug_idx" ON "public"."events"("slug");

-- CreateIndex
CREATE INDEX "poll_options_language_idx" ON "public"."poll_options"("language");

-- CreateIndex
CREATE INDEX "poll_questions_language_idx" ON "public"."poll_questions"("language");

-- CreateIndex
CREATE INDEX "polls_language_idx" ON "public"."polls"("language");

-- CreateIndex
CREATE INDEX "survey_question_options_language_idx" ON "public"."survey_question_options"("language");

-- CreateIndex
CREATE INDEX "survey_questions_language_idx" ON "public"."survey_questions"("language");

-- CreateIndex
CREATE INDEX "survey_sections_language_idx" ON "public"."survey_sections"("language");

-- CreateIndex
CREATE INDEX "surveys_language_idx" ON "public"."surveys"("language");

-- AddForeignKey
ALTER TABLE "public"."event_content" ADD CONSTRAINT "event_content_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
