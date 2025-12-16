import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { AttachmentList } from "@/components/blog/attachment-list";
import { PostBody } from "@/components/blog/post-body";
import { PostImage } from "@/components/blog/post-image";
import { PostReadingProgress } from "@/components/blog/post-reading-progress";
import { TweetEmbeds } from "@/components/blog/tweet-embeds";
import { LanguageSwitcher } from "@/components/common/language-switcher";
import { ScrollToTop } from "@/components/common/scroll-to-top";
import { formatDate, getAllPosts, getPostBySlug } from "@/lib/blog";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllPosts("en");
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const post = await getPostBySlug(slug, locale);

  if (!post) {
    return {
      title: "Post Not Found | Walter Morales",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wmorales.dev";
  const postUrl = `${siteUrl}/blog/${slug}`;
  const ogImage =
    post.meta.ogImage || post.meta.coverImage || `${siteUrl}/og-image.png`;
  const description =
    post.meta.summary || `Read ${post.meta.title} by Walter Morales`;

  return {
    title: `${post.meta.title} | Walter Morales`,
    description,
    alternates: {
      canonical: post.meta.canonicalUrl || postUrl,
    },
    openGraph: {
      title: post.meta.title,
      description,
      url: postUrl,
      type: "article",
      publishedTime: post.meta.date,
      authors: ["Walter Morales"],
      tags: post.meta.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta.title,
      description,
      images: [ogImage],
    },
    other: {
      "article:author": "Walter Morales",
      "article:published_time": post.meta.date,
      ...(post.meta.tags && {
        "article:tag": post.meta.tags.join(", "),
      }),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("blog.post");
  const post = await getPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wmorales.dev";
  const postUrl = `${siteUrl}/blog/${slug}`;
  const hasTweets = post.contentHtml.includes("twitter-tweet");

  // #region agent log
  typeof fetch === "function" &&
    fetch("http://127.0.0.1:7246/ingest/89777237-dfb8-4a58-b024-7c78b593ecbe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "pre-fix",
        hypothesisId: "A",
        location: "app/(main)/blog/[slug]/page.tsx:hasTweets",
        message: "Blog post tweet detection",
        data: {
          slug,
          hasTweets,
          contentHtmlLength: post.contentHtml.length,
          tweetMarkerCount: (post.contentHtml.match(/twitter-tweet/g) || [])
            .length,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  // #endregion

  return (
    <>
      {hasTweets && <TweetEmbeds />}
      <PostReadingProgress />
      <ScrollToTop />
      <article className="space-y-10" id="blog-post">
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <Link
              className="inline-block font-mono text-accent text-xs transition-colors hover:text-accent/80"
              href="/blog"
            >
              {t("backToBlog")}
            </Link>
            <LanguageSwitcher />
          </div>
          <h1 className="font-display font-semibold text-3xl text-foreground tracking-tight sm:text-4xl">
            {post.meta.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <time className="font-mono text-muted-foreground text-xs">
              {formatDate(post.meta.date, locale)}
            </time>
            {post.meta.readingTimeText && (
              <>
                <span className="h-3 w-px bg-border" />
                <span className="font-mono text-muted-foreground text-xs">
                  {post.meta.readingTimeText}
                </span>
              </>
            )}
            {post.meta.tags && post.meta.tags.length > 0 && (
              <>
                <span className="h-3 w-px bg-border" />
                <div className="flex gap-2">
                  {post.meta.tags.map((tag) => (
                    <span
                      className="font-mono text-accent/70 text-xs"
                      key={tag}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </header>

        {post.meta.coverImage && (
          <PostImage
            alt={post.meta.title}
            caption={post.meta.title}
            src={post.meta.coverImage}
          />
        )}

        <PostBody contentHtml={post.contentHtml} />

        {post.meta.attachments && post.meta.attachments.length > 0 && (
          <AttachmentList attachments={post.meta.attachments} />
        )}

        <footer className="border-border/60 border-t pt-8">
          <Link
            className="inline-block font-mono text-accent text-xs transition-colors hover:text-accent/80"
            href="/blog"
          >
            {t("backToBlogFooter")}
          </Link>
        </footer>
      </article>

      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data requires dangerouslySetInnerHTML
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.meta.title,
            description: post.meta.summary,
            image:
              post.meta.ogImage ||
              post.meta.coverImage ||
              `${siteUrl}/og-image.png`,
            datePublished: post.meta.date,
            dateModified: post.meta.date,
            author: {
              "@type": "Person",
              name: "Walter Morales",
            },
            publisher: {
              "@type": "Person",
              name: "Walter Morales",
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": postUrl,
            },
            ...(post.meta.tags && {
              keywords: post.meta.tags.join(", "),
            }),
          }),
        }}
        type="application/ld+json"
      />
    </>
  );
}
