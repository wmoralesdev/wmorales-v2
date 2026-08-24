import * as stylex from "@stylexjs/stylex";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { PostViewCount } from "@/components/blog/post-view-count";
import { formatDate, getAllPosts } from "@/lib/blog";
import { createMetadata, siteConfig } from "@/lib/metadata";
import { colors, fonts } from "@/lib/stylex/tokens.stylex";

const blogDescription =
  "Thoughts on software engineering, web development, and technology.";

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  empty: {
    color: colors.mutedForeground,
  },
  article: {
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: `color-mix(in oklch, ${colors.border}, transparent 40%)`,
    paddingBlock: "1.25rem",
    ":first-child": {
      borderTopWidth: 0,
      paddingTop: 0,
    },
  },
  link: {
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
  },
  row: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    "@media (min-width: 640px)": {
      flexDirection: "row",
      alignItems: "baseline",
      gap: "1rem",
    },
  },
  title: {
    fontFamily: fonts.display,
    fontWeight: 500,
    fontSize: "1rem",
    color: colors.foreground,
    transitionProperty: "color",
    transitionDuration: "150ms",
    ":hover": {
      color: colors.accent,
    },
    "@media (min-width: 640px)": {
      flex: 1,
    },
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    "@media (min-width: 640px)": {
      flexShrink: 0,
      textAlign: "right",
    },
  },
  readingTime: {
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    color: `color-mix(in oklch, ${colors.mutedForeground}, transparent 40%)`,
  },
  divider: {
    height: "0.625rem",
    width: 1,
    backgroundColor: `color-mix(in oklch, ${colors.border}, transparent 40%)`,
  },
  summary: {
    fontSize: "0.875rem",
    color: colors.mutedForeground,
    textWrap: "pretty",
    lineHeight: 1.625,
  },
  footer: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.5rem",
  },
  tags: {
    display: "flex",
    gap: "0.5rem",
  },
  tag: {
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    color: `color-mix(in oklch, ${colors.accent}, transparent 40%)`,
  },
  time: {
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    fontVariantNumeric: "tabular-nums",
    color: `color-mix(in oklch, ${colors.mutedForeground}, transparent 40%)`,
    "@media (min-width: 640px)": {
      flexShrink: 0,
    },
  },
});

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
    <div {...stylex.props(styles.root)}>
      {posts.length === 0 ? (
        <p {...stylex.props(styles.empty)}>{t("noPosts")}</p>
      ) : (
        posts.map((post) => (
          <article key={post.slug} {...stylex.props(styles.article)}>
            <Link href={`/blog/${post.slug}`} {...stylex.props(styles.link)}>
              <div {...stylex.props(styles.row)}>
                <h2 {...stylex.props(styles.title)}>{post.title}</h2>
                <div {...stylex.props(styles.meta)}>
                  {post.readingTimeText && (
                    <>
                      <span {...stylex.props(styles.readingTime)}>
                        {post.readingTimeText}
                      </span>
                      <span {...stylex.props(styles.divider)} />
                    </>
                  )}
                  <PostViewCount locale={locale} mode="read" slug={post.slug} />
                </div>
              </div>
              {post.summary && (
                <p {...stylex.props(styles.summary)}>{post.summary}</p>
              )}
              {(post.date || (post.tags && post.tags.length > 0)) && (
                <div {...stylex.props(styles.footer)}>
                  {post.tags && post.tags.length > 0 && (
                    <div {...stylex.props(styles.tags)}>
                      {post.tags.map((tag) => (
                        <span key={tag} {...stylex.props(styles.tag)}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {post.date && (
                    <time {...stylex.props(styles.time)}>
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
