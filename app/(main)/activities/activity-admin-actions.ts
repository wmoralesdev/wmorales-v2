"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createActivityRecord } from "@/lib/db/activities";

const passwordSchema = z.string().min(1);

const createActivitySchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  time: z.string().trim().min(1).max(100).optional().or(z.literal("")),
  location: z.string().trim().min(1).max(200).optional().or(z.literal("")),
  shortDescription: z
    .string()
    .trim()
    .min(1)
    .max(280)
    .optional()
    .or(z.literal("")),
  description: z.string().min(1, "Description is required").max(20_000),
  lumaUrl: z.string().trim().url().optional().or(z.literal("")),
});

type CreateActivityInput = z.infer<typeof createActivitySchema>;

function normalizeOptional(value: string | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

function makeSlug(title: string, date: string): string {
  const base = slugify(title) || "activity";
  const rand = Math.random().toString(36).slice(2, 8);
  return `${base}-${date}-${rand}`;
}

function getAdminPassword(): string | null {
  const pw = process.env.ACTIVITIES_ADMIN_PASSWORD;
  if (!pw) return null;
  const trimmed = pw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function verifyActivitiesAdminPassword(
  password: string,
): Promise<boolean> {
  const parsed = passwordSchema.safeParse(password);
  if (!parsed.success) return false;

  const expected = getAdminPassword();
  if (!expected) return false;

  return parsed.data === expected;
}

export async function createActivity(
  input: CreateActivityInput,
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const authed = await verifyActivitiesAdminPassword(password);
  if (!authed) return { ok: false, error: "Invalid password." };

  const parsed = createActivitySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid form data." };

  const data = parsed.data;
  const dateUtc = new Date(`${data.date}T00:00:00.000Z`);
  if (Number.isNaN(dateUtc.getTime())) {
    return { ok: false, error: "Invalid date." };
  }

  const slug = makeSlug(data.title, data.date);

  try {
    await createActivityRecord({
      slug,
      date: dateUtc,
      time: normalizeOptional(data.time),
      title: data.title.trim(),
      description: data.description.trim(),
      shortDescription: normalizeOptional(data.shortDescription),
      location: normalizeOptional(data.location),
      lumaUrl: normalizeOptional(data.lumaUrl),
    });
  } catch (err) {
    console.error("Failed to create activity:", err);
    return { ok: false, error: "Failed to create activity." };
  }

  revalidatePath("/activities");
  return { ok: true };
}
