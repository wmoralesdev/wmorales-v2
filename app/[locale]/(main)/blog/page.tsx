import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { formatDate, getAllPosts } from "@/lib/blog";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Walter Morales",
  description: "Thoughts on software engineering, web development, and technology.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = await getAllPosts();

  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <Link
          href="/"
          className="inline-block font-mono text-[11px] text-accent transition-colors hover:text-accent/80"
        >
          ← Home
        </Link>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Blog
        </h1>
        <p className="text-[15px] text-muted-foreground">
          Writing about software, design, and things I learn.
        </p>
      </header>

      <div className="space-y-0">
        {posts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <article
              key={post.slug}
              className="group border-t border-border/60 py-5 first:border-t-0 first:pt-0"
            >
              <Link href={`/blog/${post.slug}`} className="block space-y-1.5">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h2 className="font-display text-[15px] font-medium text-foreground transition-colors group-hover:text-accent">
                    {post.title}
                  </h2>
                  <time className="font-mono text-[11px] text-muted-foreground/60">
                    {formatDate(post.date)}
                  </time>
                </div>
                {post.summary && (
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    {post.summary}
                  </p>
                )}
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
