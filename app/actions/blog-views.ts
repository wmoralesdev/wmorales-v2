"use server";

import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma-client";

const SESSION_COOKIE = "wm_blog_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(SESSION_COOKIE)?.value;

  if (existing) {
    return existing;
  }

  const sessionId = nanoid();
  cookieStore.set(SESSION_COOKIE, sessionId, {
    path: "/",
    maxAge: SESSION_MAX_AGE,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return sessionId;
}

export async function registerBlogView(slug: string): Promise<number> {
  const safeSlug = slug.trim();
  if (!safeSlug) return 0;

  const sessionId = await getOrCreateSessionId();

  const [, count] = await prisma.$transaction([
    prisma.blogView.upsert({
      where: {
        slug_sessionId: { slug: safeSlug, sessionId },
      },
      update: {},
      create: {
        slug: safeSlug,
        sessionId,
      },
    }),
    prisma.blogView.count({
      where: { slug: safeSlug },
    }),
  ]);

  return count;
}

export async function getBlogViewCount(slug: string): Promise<number> {
  const safeSlug = slug.trim();
  if (!safeSlug) return 0;

  return prisma.blogView.count({
    where: { slug: safeSlug },
  });
}
