import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { PostViewCount } from "@/components/blog/post-view-count";
import { formatDate, getAllPosts } from "@/lib/blog";
import { createMetadata, siteConfig } from "@/lib/metadata";

const blogDescription =
  "Thoughts on software engineering, web development, and technology.";

export const metadata = createMetadata({
  title: "Blog",
  description: blogDescription,
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
  openGraph: {
    title: "Blog | Walter Morales",
    description: blogDescription,
    url: `${siteConfig.url}/blog`,
    type: "website",
  },
  twitter: {
    title: "Blog | Walter Morales",
    description: blogDescription,
  },
});

export default async function BlogPage() {
  const locale = await getLocale();
  const t = await getTranslations("blog.list");
  const posts = await getAllPosts(locale);

  return (
    <div className="space-y-0">
      {posts.length === 0 ? (
        <p className="text-muted-foreground">{t("noPosts")}</p>
      ) : (
        posts.map((post) => (
          <article
            className="group border-border/60 border-t py-5 first:border-t-0 first:pt-0"
            key={post.slug}
          >
            <Link className="block space-y-1.5" href={`/blog/${post.slug}`}>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                <h2 className="font-display font-medium text-base text-foreground transition-colors group-hover:text-accent sm:flex-1">
                  {post.title}
                </h2>
                <div className="flex items-center gap-2 sm:shrink-0 sm:text-right">
                  {post.readingTimeText && (
                    <>
                      <span className="font-mono text-xs text-muted-foreground/60">
                        {post.readingTimeText}
                      </span>
                      <span className="h-2.5 w-px bg-border/60" />
                    </>
                  )}
                  <PostViewCount
                    locale={locale}
                    mode="read"
                    slug={post.slug}
                  />
                </div>
              </div>
              {post.summary && (
                <p className="text-sm text-muted-foreground text-pretty leading-relaxed">
                  {post.summary}
                </p>
              )}
              {(post.date || (post.tags && post.tags.length > 0)) && (
                <div className="flex flex-wrap items-center justify-between gap-2">
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
                  {post.date && (
                    <time className="font-mono text-xs tabular-nums text-muted-foreground/60 sm:shrink-0">
                      {formatDate(post.date, locale)}
                    </time>
                  )}
                </div>
              )}
            </Link>
          </article>
        ))
      )}
    </div>
  );
}
