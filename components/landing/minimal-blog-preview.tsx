import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { formatDate, getAllPosts } from "@/lib/blog";

const MAX_RECENT_POSTS = 3;

export async function MinimalBlogPreview() {
  const locale = await getLocale();
  const t = await getTranslations("homepage.blogPreview");
  const posts = await getAllPosts(locale);
  const recentPosts = posts.slice(0, MAX_RECENT_POSTS);

  if (recentPosts.length === 0) {
    return null;
  }

  return (
    <section className="space-y-5">
      <div className="flex items-baseline justify-between">
        <h2 className="font-mono text-xs font-normal uppercase text-muted-foreground/60">
          {t("title")}
        </h2>
        <Link
          className="font-mono text-xs text-accent transition-colors hover:text-accent/80"
          href="/blog"
        >
          {t("viewAll")}
        </Link>
      </div>
      <div className="space-y-0 wm-stagger-1">
        {recentPosts.map((post) => (
          <article
            className="group wm-reveal border-t border-border/60 py-4 first:border-t-0 first:pt-0"
            key={post.slug}
          >
            <Link className="block space-y-1.5" href={`/blog/${post.slug}`}>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-display text-base font-medium text-foreground transition-colors group-hover:text-accent">
                  {post.title}
                </h3>
                <time className="font-mono text-xs tabular-nums text-muted-foreground/50">
                  {formatDate(post.date, locale)}
                </time>
              </div>
              {post.summary && (
                <p className="text-sm leading-relaxed text-muted-foreground/70 text-pretty">
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
