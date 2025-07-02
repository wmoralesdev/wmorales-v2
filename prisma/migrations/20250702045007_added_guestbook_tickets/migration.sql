-- CreateTable
CREATE TABLE "guestbook_entries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "message" TEXT,
    "mood" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guestbook_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guestbook_tickets" (
    "id" TEXT NOT NULL,
    "ticket_number" TEXT NOT NULL,
    "entry_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_avatar" TEXT,
    "user_provider" TEXT NOT NULL,
    "primary_color" TEXT NOT NULL,
    "secondary_color" TEXT NOT NULL,
    "accent_color" TEXT NOT NULL,
    "background_color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guestbook_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "guestbook_entries_user_id_idx" ON "guestbook_entries"("user_id");

-- CreateIndex
CREATE INDEX "guestbook_entries_createdAt_idx" ON "guestbook_entries"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "guestbook_tickets_ticket_number_key" ON "guestbook_tickets"("ticket_number");

-- CreateIndex
CREATE UNIQUE INDEX "guestbook_tickets_entry_id_key" ON "guestbook_tickets"("entry_id");

-- CreateIndex
CREATE INDEX "guestbook_tickets_ticket_number_idx" ON "guestbook_tickets"("ticket_number");

-- CreateIndex
CREATE INDEX "guestbook_tickets_user_id_idx" ON "guestbook_tickets"("user_id");

-- CreateIndex
CREATE INDEX "guestbook_tickets_createdAt_idx" ON "guestbook_tickets"("createdAt");

-- AddForeignKey
ALTER TABLE "guestbook_tickets" ADD CONSTRAINT "guestbook_tickets_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "guestbook_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
