"use server";

import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import {
  getBlogViewCount as getBlogViewCountDb,
  registerBlogView as registerBlogViewDb,
} from "@/lib/db/blog-views";

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
  const sessionId = await getOrCreateSessionId();
  return registerBlogViewDb(slug, sessionId);
}

export async function getBlogViewCount(slug: string): Promise<number> {
  return getBlogViewCountDb(slug);
}
