import "server-only";

import { prisma } from "@/lib/prisma-client";

/**
 * Register a blog view and return the total count for the slug.
 */
export async function registerBlogView(
  slug: string,
  sessionId: string,
): Promise<number> {
  const safeSlug = slug.trim();
  if (!safeSlug) return 0;

  // Neon HTTP adapter doesn't support transactions.
  await prisma.blogView.upsert({
    where: {
      slug_sessionId: { slug: safeSlug, sessionId },
    },
    update: {},
    create: {
      slug: safeSlug,
      sessionId,
    },
  });

  return prisma.blogView.count({
    where: { slug: safeSlug },
  });
}

/**
 * Get the view count for a blog post slug.
 */
export async function getBlogViewCount(slug: string): Promise<number> {
  const safeSlug = slug.trim();
  if (!safeSlug) return 0;

  return prisma.blogView.count({
    where: { slug: safeSlug },
  });
}
