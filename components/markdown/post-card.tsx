import { CalendarDays } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/blog/utils';

type BlogPost = {
  slug: string;
  entry: {
    title: string;
    description: string;
    publishedAt: string;
    featured: boolean;
    tags: string[];
    coverImage: string;
  };
}
type PostCardProps = {
  post: BlogPost;
  featured?: boolean;
};

export function PostCard({ post, featured = false }: PostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className={`h-full transition-colors hover:border-purple-600 ${featured ? 'md:col-span-2' : ''}`}>
        {post.entry.coverImage && (
          <div className="relative aspect-video overflow-hidden rounded-t-lg">
            <Image
              alt={post.entry.title}
              className="object-cover"
              fill
              sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
              src={post.entry.coverImage}
            />
          </div>
        )}
        <CardHeader>
          <div className="mb-2 flex items-center gap-2 text-gray-400 text-sm">
            <CalendarDays className="h-4 w-4" />
            <time dateTime={post.entry.publishedAt}>{formatDate(post.entry.publishedAt)}</time>
          </div>
          <CardTitle className={featured ? 'text-2xl' : 'text-xl'}>{post.entry.title}</CardTitle>
          <CardDescription className={featured ? 'text-base' : ''}>{post.entry.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {post.entry.tags.map((tag) => (
              <Badge className="text-xs" key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
