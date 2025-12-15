import Link from "next/link";
import { formatDate, getAllPosts } from "@/lib/blog";

export async function MinimalBlogPreview() {
  const posts = await getAllPosts();
  const recentPosts = posts.slice(0, 3);

  if (recentPosts.length === 0) {
    return null;
  }

  return (
    <section className="space-y-5">
      <div className="flex items-baseline justify-between">
        <h2 className="font-mono text-[11px] font-normal uppercase tracking-[0.2em] text-muted-foreground/60">
          Latest Posts
        </h2>
        <Link
          href="/blog"
          className="font-mono text-[11px] text-accent transition-colors hover:text-accent/80"
        >
          View all →
        </Link>
      </div>
      <div className="space-y-0">
        {recentPosts.map((post) => (
          <article
            key={post.slug}
            className="group border-t border-border/60 py-4 first:border-t-0 first:pt-0"
          >
            <Link href={`/blog/${post.slug}`} className="block space-y-1.5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-display text-[15px] font-medium text-foreground transition-colors group-hover:text-accent">
                  {post.title}
                </h3>
                <time className="font-mono text-[11px] text-muted-foreground/50">
                  {formatDate(post.date)}
                </time>
              </div>
              {post.summary && (
                <p className="text-[13px] leading-relaxed text-muted-foreground/70">
                  {post.summary}
                </p>
              )}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

