import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { formatDate, getAllPosts, getPostBySlug } from "@/lib/blog";

import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | Walter Morales",
    };
  }

  return {
    title: `${post.meta.title} | Walter Morales`,
    description: post.meta.summary,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="space-y-10">
      <header className="space-y-4">
        <Link
          href="/blog"
          className="inline-block font-mono text-[11px] text-accent transition-colors hover:text-accent/80"
        >
          ← Blog
        </Link>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {post.meta.title}
        </h1>
        <div className="flex items-center gap-3">
          <time className="font-mono text-[11px] text-muted-foreground">
            {formatDate(post.meta.date)}
          </time>
          {post.meta.tags && post.meta.tags.length > 0 && (
            <>
              <span className="h-3 w-px bg-border" />
              <div className="flex gap-2">
                {post.meta.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] text-accent/70"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      <div
        className="prose-minimal"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      <footer className="border-t border-border/60 pt-8">
        <Link
          href="/blog"
          className="inline-block font-mono text-[11px] text-accent transition-colors hover:text-accent/80"
        >
          ← Back to blog
        </Link>
      </footer>
    </article>
  );
}
