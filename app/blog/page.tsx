import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '@/keystatic.config';
import { BlogPostCard } from '@/components/blog/post-card';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Walter Morales',
  description: 'Thoughts on web development, AI, and technology.',
};

const reader = createReader(process.cwd(), keystaticConfig);

export default async function BlogPage() {
  const posts = await reader.collections.posts.all();

  // Sort by date and filter published
  const now = new Date();
  const publishedPosts = posts
    .filter((post) => {
      if (!post.entry.publishedAt) return false;
      return new Date(post.entry.publishedAt) <= now;
    })
    .sort((a, b) => {
      const dateA = a.entry.publishedAt ? new Date(a.entry.publishedAt).getTime() : 0;
      const dateB = b.entry.publishedAt ? new Date(b.entry.publishedAt).getTime() : 0;
      return dateB - dateA;
    });

  const featuredPosts = publishedPosts.filter((p) => p.entry.featured);
  const recentPosts = publishedPosts.slice(0, 6);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-lg text-gray-400">
          Thoughts on web development, AI, and the technologies shaping our future.
        </p>
      </div>

      {featuredPosts.length > 0 && (
        <section className="mb-16 max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Featured Posts</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredPosts.map((post) => (
              <BlogPostCard key={post.slug} post={post as any} featured />
            ))}
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Recent Posts</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post) => (
            <BlogPostCard key={post.slug} post={post as any} />
          ))}
        </div>

        {publishedPosts.length > 6 && (
          <div className="mt-12 text-center">
            <a
              href="/blog/archive"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300"
            >
              View all posts →
            </a>
          </div>
        )}
      </section>
    </div>
  );
}