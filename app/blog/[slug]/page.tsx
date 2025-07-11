import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '@/keystatic.config';
import React from 'react';
import Markdoc from '@markdoc/markdoc';
import { markdocComponents } from '@/components/blog/markdoc-components';
import { ReadingProgress } from '@/components/blog/reading-progress';
import { ShareButtons } from '@/components/blog/share-buttons';
import { trackView } from '@/app/actions/blog.actions';
import readingTime from 'reading-time';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { formatDate } from '@/lib/blog/utils';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const reader = createReader(process.cwd(), keystaticConfig);

export async function generateStaticParams() {
  const posts = await reader.collections.posts.all();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await reader.collections.posts.read(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Walter Morales`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt || undefined,
      authors: ['Walter Morales'],
      images: post.coverImage ? [post.coverImage] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const post = await reader.collections.posts.read(params.slug);

  if (!post) {
    notFound();
  }

  // Track view
  await trackView(params.slug);

  // Parse content
  const { node } = await post.content();
  const renderable = Markdoc.transform(node);
  
  // Get HTML content for reading time calculation
  const htmlContent = Markdoc.renderers.html(renderable);
  const plainText = htmlContent.replace(/<[^>]*>/g, ''); // Strip HTML tags
  const stats = readingTime(plainText);

  return (
    <>
      <ReadingProgress />
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-gray-400 mb-4">
            {post.publishedAt && (
              <>
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
                <span>·</span>
              </>
            )}
            <span>{stats.text}</span>
          </div>
          {post.tags.length > 0 && (
            <div className="flex gap-2 mb-6">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tags/${tag}`}
                  className="px-3 py-1 bg-purple-900/30 hover:bg-purple-900/50 rounded-full text-sm transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        <div className="prose prose-invert prose-lg max-w-none 
          prose-headings:font-bold prose-headings:text-white
          prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
          prose-p:text-gray-300 prose-p:leading-relaxed
          prose-a:text-purple-400 prose-a:no-underline hover:prose-a:text-purple-300
          prose-strong:text-white prose-strong:font-semibold
          prose-code:text-purple-300 prose-code:bg-zinc-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800
          prose-blockquote:text-gray-400 prose-blockquote:border-l-purple-600
          prose-ul:text-gray-300 prose-ol:text-gray-300
          prose-img:rounded-lg prose-img:shadow-lg"
        >
          {Markdoc.renderers.react(renderable, React, {
            components: markdocComponents,
          })}
        </div>

        <footer className="mt-12 pt-8 border-t border-gray-800">
          <ShareButtons title={post.title} url={`/blog/${params.slug}`} />
        </footer>
      </article>
    </>
  );
}