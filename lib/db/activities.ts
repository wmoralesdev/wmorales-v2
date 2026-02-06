import "server-only";

import { prisma } from "@/lib/prisma-client";

export type ActivityRecord = {
  id: number;
  slug: string;
  date: Date;
  time: string | null;
  title: string;
  description: string;
  shortDescription: string | null;
  location: string | null;
  lumaUrl: string | null;
};

export type CreateActivityRecordInput = Omit<ActivityRecord, "id">;

/**
 * Fetch activities for a given month/year range.
 */
export async function getActivitiesByMonth(
  year: number,
  month: number,
): Promise<ActivityRecord[]> {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  return prisma.activity.findMany({
    where: {
      date: { gte: start, lt: end },
    },
    orderBy: { date: "asc" },
  });
}

/**
 * Fetch all activities (for static/ISR usage).
 */
export async function getAllActivities(): Promise<ActivityRecord[]> {
  return prisma.activity.findMany({
    orderBy: { date: "asc" },
  });
}

/**
 * Get the next upcoming activity (earliest activity where date >= today).
 */
export async function getNextActivity(): Promise<ActivityRecord | null> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.activity.findFirst({
    where: {
      date: { gte: today },
    },
    orderBy: { date: "asc" },
  });
}

/**
 * Get the next N upcoming activities (ordered by date asc, filtered from today).
 * Uses UTC midnight for consistent date-only comparison.
 */
export async function getUpcomingActivities(
  limit: number,
): Promise<ActivityRecord[]> {
  // Use UTC midnight to avoid timezone shifts when comparing date-only values
  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      0,
      0,
      0,
      0,
    ),
  );

  return prisma.activity.findMany({
    where: {
      date: { gte: todayUTC },
    },
    orderBy: { date: "asc" },
    take: limit,
  });
}

export async function createActivityRecord(
  input: CreateActivityRecordInput,
): Promise<ActivityRecord> {
  return prisma.activity.create({
    data: {
      slug: input.slug,
      date: input.date,
      time: input.time,
      title: input.title,
      description: input.description,
      shortDescription: input.shortDescription,
      location: input.location,
      lumaUrl: input.lumaUrl,
    },
  });
}
