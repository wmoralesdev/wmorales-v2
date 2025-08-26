-- CreateTable
CREATE TABLE "public"."short_urls" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "image" TEXT,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "short_urls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "short_urls_code_key" ON "public"."short_urls"("code");

-- CreateIndex
CREATE INDEX "short_urls_code_idx" ON "public"."short_urls"("code");

-- CreateIndex
CREATE INDEX "short_urls_createdAt_idx" ON "public"."short_urls"("createdAt");
