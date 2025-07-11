import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/blog/utils';
import { CalendarDays, Clock } from 'lucide-react';

interface BlogPost {
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

interface BlogPostCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogPostCard({ post, featured = false }: BlogPostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className={`h-full hover:border-purple-600 transition-colors ${featured ? 'md:col-span-2' : ''}`}>
        {post.entry.coverImage && (
          <div className="relative aspect-video overflow-hidden rounded-t-lg">
            <Image
              src={post.entry.coverImage}
              alt={post.entry.title}
              fill
              className="object-cover"
              sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
            />
          </div>
        )}
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <CalendarDays className="h-4 w-4" />
            <time dateTime={post.entry.publishedAt}>
              {formatDate(post.entry.publishedAt)}
            </time>
          </div>
          <CardTitle className={featured ? 'text-2xl' : 'text-xl'}>{post.entry.title}</CardTitle>
          <CardDescription className={featured ? 'text-base' : ''}>
            {post.entry.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {post.entry.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}