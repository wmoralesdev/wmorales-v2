import * as stylex from "@stylexjs/stylex";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { formatDate, getAllPosts } from "@/lib/blog";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, fonts } from "@/lib/stylex/tokens.stylex";

const MAX_RECENT_POSTS = 3;

const styles = stylex.create({
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  header: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    fontWeight: 400,
    textTransform: "uppercase",
    color: `color-mix(in oklch, ${colors.mutedForeground}, transparent 40%)`,
  },
  viewAll: {
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    color: colors.accent,
    transitionProperty: "color",
    transitionDuration: "150ms",
    ":hover": {
      color: `color-mix(in oklch, ${colors.accent}, transparent 20%)`,
    },
  },
  list: {
    display: "flex",
    flexDirection: "column",
  },
  article: {
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: `color-mix(in oklch, ${colors.border}, transparent 40%)`,
    paddingBlock: "1rem",
    ":first-child": {
      borderTopWidth: 0,
      paddingTop: 0,
    },
  },
  link: {
    display: "block",
  },
  row: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    "@media (min-width: 640px)": {
      flexDirection: "row",
      alignItems: "baseline",
      justifyContent: "space-between",
    },
  },
  postTitle: {
    fontFamily: fonts.display,
    fontSize: "1rem",
    fontWeight: 500,
    color: colors.foreground,
    transitionProperty: "color",
    transitionDuration: "150ms",
    ":hover": {
      color: colors.accent,
    },
  },
  time: {
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    fontVariantNumeric: "tabular-nums",
    color: `color-mix(in oklch, ${colors.mutedForeground}, transparent 50%)`,
  },
  summary: {
    marginTop: "0.375rem",
    fontSize: "0.875rem",
    lineHeight: 1.625,
    color: `color-mix(in oklch, ${colors.mutedForeground}, transparent 30%)`,
    textWrap: "pretty",
  },
});

export async function MinimalBlogPreview() {
  const locale = await getLocale();
  const t = await getTranslations("homepage.blogPreview");
  const posts = await getAllPosts(locale);
  const recentPosts = posts.slice(0, MAX_RECENT_POSTS);

  if (recentPosts.length === 0) {
    return null;
  }

  return (
    <section {...stylex.props(styles.section)}>
      <div {...stylex.props(styles.header)}>
        <h2 {...stylex.props(styles.title)}>{t("title")}</h2>
        <Link href="/blog" {...stylex.props(styles.viewAll)}>
          {t("viewAll")}
        </Link>
      </div>
      <div {...stylex.props(styles.list)}>
        {recentPosts.map((post) => (
          <article
            key={post.slug}
            {...mergeSx(stylex.props(styles.article), "wm-reveal")}
          >
            <Link href={`/blog/${post.slug}`} {...stylex.props(styles.link)}>
              <div {...stylex.props(styles.row)}>
                <h3 {...stylex.props(styles.postTitle)}>{post.title}</h3>
                <time {...stylex.props(styles.time)}>
                  {formatDate(post.date, locale)}
                </time>
              </div>
              {post.summary && (
                <p {...stylex.props(styles.summary)}>{post.summary}</p>
              )}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
