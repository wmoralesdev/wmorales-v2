import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import { formatDate, getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Walter Morales",
  description:
    "Thoughts on software engineering, web development, and technology.",
};

export default async function BlogPage() {
  const locale = await getLocale();
  const posts = await getAllPosts(locale);

  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <Link
          className="inline-block font-mono text-xs text-accent transition-colors hover:text-accent/80"
          href="/"
        >
          ← Home
        </Link>
        <h1 className="font-display font-semibold text-3xl text-foreground tracking-tight sm:text-4xl">
          Blog
        </h1>
        <p className="text-sm text-muted-foreground">
          Writing about software, design, and things I learn.
        </p>
      </header>

      <div className="space-y-0">
        {posts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <article
              className="group border-border/60 border-t py-5 first:border-t-0 first:pt-0"
              key={post.slug}
            >
              <Link className="block space-y-1.5" href={`/blog/${post.slug}`}>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h2 className="font-display font-medium text-base text-foreground transition-colors group-hover:text-accent">
                    {post.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <time className="font-mono text-xs text-muted-foreground/60">
                      {formatDate(post.date, locale)}
                    </time>
                    {post.readingTimeText && (
                      <>
                        <span className="h-2.5 w-px bg-border/60" />
                        <span className="font-mono text-xs text-muted-foreground/60">
                          {post.readingTimeText}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {post.summary && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {post.summary}
                  </p>
                )}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex gap-2">
                    {post.tags.map((tag) => (
                      <span
                        className="font-mono text-xs text-accent/60"
                        key={tag}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
