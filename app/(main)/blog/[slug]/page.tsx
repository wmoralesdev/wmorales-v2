import * as stylex from "@stylexjs/stylex";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { AttachmentList } from "@/components/blog/attachment-list";
import { CursorPrompts } from "@/components/blog/cursor-prompt";
import { PostBody } from "@/components/blog/post-body";
import { PostImage } from "@/components/blog/post-image";
import { PostReadingProgress } from "@/components/blog/post-reading-progress";
import { ensureHeadingIds, PostToc } from "@/components/blog/post-toc";
import { PostViewCount } from "@/components/blog/post-view-count";
import { TweetEmbeds } from "@/components/blog/tweet-embeds";
import { LanguageSwitcher } from "@/components/common/language-switcher";
import { ScrollToTop } from "@/components/common/scroll-to-top";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { formatDate, getAllPosts, getPostBySlug } from "@/lib/blog";
import { createMetadata, siteConfig } from "@/lib/metadata";
import { colors, fonts } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  article: {
    display: "flex",
    flexDirection: "column",
    gap: "2.5rem",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  headerTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backLink: {
    display: "inline-block",
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    color: colors.accent,
    transitionProperty: "color",
    transitionDuration: "150ms",
    ":hover": {
      color: `color-mix(in oklch, ${colors.accent}, transparent 20%)`,
    },
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  title: {
    fontFamily: fonts.display,
    fontWeight: 600,
    fontSize: "1.875rem",
    color: colors.foreground,
    textWrap: "balance",
    letterSpacing: "-0.025em",
    "@media (min-width: 640px)": {
      fontSize: "2.25rem",
    },
  },
  meta: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "0.75rem",
  },
  time: {
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    fontVariantNumeric: "tabular-nums",
    color: colors.mutedForeground,
  },
  readingTime: {
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    color: colors.mutedForeground,
  },
  divider: {
    height: "0.75rem",
    width: 1,
    backgroundColor: colors.border,
  },
  tags: {
    display: "flex",
    gap: "0.5rem",
  },
  tag: {
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    color: `color-mix(in oklch, ${colors.accent}, transparent 30%)`,
  },
  footer: {
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: `color-mix(in oklch, ${colors.border}, transparent 40%)`,
    paddingTop: "2rem",
  },
});

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
      title: `Post Not Found | ${siteConfig.shortTitle}`,
    };
  }

  const postUrl = `${siteConfig.url}/blog/${slug}`;
  const description =
    post.meta.summary || `Read ${post.meta.title} by ${siteConfig.author.name}`;

  return createMetadata({
    title: post.meta.title,
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
      authors: [siteConfig.author.name],
      tags: post.meta.tags,
    },
    twitter: {
      card: "summary",
      title: post.meta.title,
      description,
    },
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("blog.post");
  const post = await getPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  const postUrl = `${siteConfig.url}/blog/${slug}`;
  const contentHtml = ensureHeadingIds(post.contentHtml);
  const hasTweets = contentHtml.includes("twitter-tweet");
  const hasCursorPrompts = contentHtml.includes("data-cursor-prompt");
  const postImage = post.meta.ogImage || post.meta.coverImage;

  return (
    <>
      {hasTweets && <TweetEmbeds />}
      {hasCursorPrompts && <CursorPrompts />}
      <PostReadingProgress />
      <ScrollToTop />
      <PostToc contentHtml={contentHtml} />
      <article id="blog-post" {...stylex.props(styles.article)}>
        <header {...stylex.props(styles.header)}>
          <div {...stylex.props(styles.headerTop)}>
            <Link href="/blog" {...stylex.props(styles.backLink)}>
              {t("backToBlog")}
            </Link>
            <div {...stylex.props(styles.headerActions)}>
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
          <h1 {...stylex.props(styles.title)}>{post.meta.title}</h1>
          <div {...stylex.props(styles.meta)}>
            <time {...stylex.props(styles.time)}>
              {formatDate(post.meta.date, locale)}
            </time>
            {post.meta.readingTimeText && (
              <>
                <span {...stylex.props(styles.divider)} />
                <span {...stylex.props(styles.readingTime)}>
                  {post.meta.readingTimeText}
                </span>
              </>
            )}
            <span {...stylex.props(styles.divider)} />
            <PostViewCount locale={locale} slug={post.meta.slug} />
            {post.meta.tags && post.meta.tags.length > 0 && (
              <>
                <span {...stylex.props(styles.divider)} />
                <div {...stylex.props(styles.tags)}>
                  {post.meta.tags.map((tag) => (
                    <span key={tag} {...stylex.props(styles.tag)}>
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

        <PostBody contentHtml={contentHtml} />

        {post.meta.attachments && post.meta.attachments.length > 0 && (
          <AttachmentList attachments={post.meta.attachments} />
        )}

        <footer {...stylex.props(styles.footer)}>
          <Link href="/blog" {...stylex.props(styles.backLink)}>
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
            description:
              post.meta.summary ||
              `Read ${post.meta.title} by ${siteConfig.author.name}`,
            ...(postImage && { image: postImage }),
            datePublished: post.meta.date,
            dateModified: post.meta.date,
            author: {
              "@type": "Person",
              name: siteConfig.author.name,
              url: siteConfig.url,
            },
            publisher: {
              "@type": "Organization",
              name: siteConfig.name,
              url: siteConfig.url,
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
