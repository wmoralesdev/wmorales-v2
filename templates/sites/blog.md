# Blog Integration Guide with Keystatic

## Context

You are adding a blog feature to an existing Next.js 15 portfolio application using Keystatic as a Git-based CMS. This approach integrates directly into the current codebase without requiring a monorepo structure.

## Current Architecture Summary

- **Framework**: Next.js 15 with App Router
- **Authentication**: Supabase (Google/GitHub OAuth only)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS (dark mode only)
- **UI Components**: shadcn/ui
- **Language**: TypeScript (strict mode)
- **Real-time**: Supabase Channels
- **Existing Features**: Guestbook, Polls, Surveys, Events

## Why Keystatic?

- **Git-based**: Content stored in your repository
- **No external dependencies**: Uses GitHub as backend
- **TypeScript native**: Full type safety
- **Markdoc format**: Safer and faster than MDX
- **Free**: No monthly fees or API limits
- **Version control**: Full Git history for all content
- **PR workflow**: Review posts before publishing

## Architecture Overview

### Integrated Structure

```
wmorales-v2/
├── app/
│   ├── (main)/              # Existing routes
│   ├── blog/                # Blog routes
│   │   ├── page.tsx         # Blog homepage
│   │   ├── [slug]/
│   │   │   └── page.tsx     # Individual post
│   │   ├── archive/
│   │   │   └── page.tsx     # All posts archive
│   │   └── tags/
│   │       └── [tag]/
│   │           └── page.tsx # Posts by tag
│   ├── keystatic/           # Admin UI routes
│   │   ├── [[...params]]/
│   │   │   └── page.tsx
│   │   ├── keystatic.tsx
│   │   └── layout.tsx
│   └── api/
│       ├── keystatic/       # Keystatic API
│       │   └── [...params]/
│       │       └── route.ts
│       └── blog/
│           └── views/       # View tracking
│               └── route.ts
├── content/                 # Blog content (managed by Keystatic)
│   └── posts/
│       └── *.mdoc
├── components/
│   └── blog/               # Blog-specific components
│       ├── markdoc-components.tsx
│       ├── post-card.tsx
│       ├── reading-progress.tsx
│       └── share-buttons.tsx
├── lib/
│   └── blog/
│       ├── markdoc.ts      # Markdoc configuration
│       └── utils.ts        # Reading time, etc.
└── keystatic.config.ts     # Keystatic configuration
```

## Implementation Steps

### 1. Install Dependencies

```bash
pnpm add @keystatic/core @keystatic/next @markdoc/markdoc reading-time github-slugger
```

### 2. Database Schema Updates

Only need view tracking since content is stored in Git:

```prisma
// Add to prisma/schema.prisma
model BlogView {
  id        String   @id @default(uuid())
  slug      String
  userId    String?  @map("user_id")    // Null for anonymous
  sessionId String   @map("session_id") // Track unique views
  createdAt DateTime @default(now())

  @@unique([slug, sessionId]) // One view per session per post
  @@index([slug])
  @@index([userId])
  @@map("blog_views")
}
```

### 3. Keystatic Configuration

```typescript
// keystatic.config.ts
import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: 'wmoralesdev/wmorales-v2', // Your GitHub repo
    branchPrefix: 'blog/', // Creates PRs with blog/ prefix
  },
  collections: {
    posts: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'content/posts/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({
          name: { label: 'Title' },
          slug: {
            label: 'URL Slug',
            description: 'The URL path for this post',
          },
        }),
        description: fields.text({
          label: 'Description',
          multiline: true,
          validation: { length: { min: 50, max: 160 } },
        }),
        publishedAt: fields.date({
          label: 'Published Date',
          defaultValue: { kind: 'today' },
        }),
        featured: fields.checkbox({
          label: 'Featured Post',
          defaultValue: false,
        }),
        tags: fields.multiselect({
          label: 'Tags',
          options: [
            { label: 'AI/ML', value: 'ai-ml' },
            { label: 'Web Development', value: 'web-dev' },
            { label: 'DevOps', value: 'devops' },
            { label: 'Career', value: 'career' },
            { label: 'Tutorial', value: 'tutorial' },
            { label: 'Cursor', value: 'cursor' },
          ],
        }),
        coverImage: fields.image({
          label: 'Cover Image',
          directory: 'public/blog/images',
          validation: { isRequired: true },
        }),
        content: fields.markdoc({
          label: 'Content',
          options: {
            image: {
              directory: 'public/blog/images',
              publicPath: '/blog/images/',
            },
          },
        }),
      },
    }),
  },
});
```

### 4. Keystatic Admin Routes

```typescript
// app/keystatic/keystatic.tsx
"use client";
import { makePage } from "@keystatic/next/ui/app";
import config from "../../keystatic.config";

export default makePage(config);

// app/keystatic/layout.tsx
import KeystaticApp from "./keystatic";

export default function Layout() {
  return <KeystaticApp />;
}

// app/keystatic/[[...params]]/page.tsx
export default function Page() {
  return null;
}

// app/api/keystatic/[...params]/route.ts
import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../keystatic.config";

export const { POST, GET } = makeRouteHandler({ config });
```

### 5. Markdoc Components

```typescript
// components/blog/markdoc-components.tsx
import React from "react";
import { Callout } from "@/components/ui/callout";
import { CodeBlock } from "@/components/ui/code-block";
import Image from "next/image";
import Link from "next/link";

export const markdocComponents = {
  Callout: ({ type = "info", title, children }) => (
    <Callout variant={type} title={title}>
      {children}
    </Callout>
  ),
  CodeBlock: ({ language, content, filename }) => (
    <CodeBlock language={language} filename={filename}>
      {content}
    </CodeBlock>
  ),
  Image: ({ src, alt, width, height }) => (
    <Image
      src={src}
      alt={alt}
      width={width || 800}
      height={height || 400}
      className="rounded-lg"
    />
  ),
  Link: ({ href, children }) => {
    const isExternal = href.startsWith("http");
    return (
      <Link
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="text-purple-400 hover:text-purple-300 underline"
      >
        {children}
      </Link>
    );
  },
};

// lib/blog/markdoc.ts
import Markdoc from "@markdoc/markdoc";
import { markdocComponents } from "@/components/blog/markdoc-components";

export function parseMarkdoc(content: string) {
  const ast = Markdoc.parse(content);
  const errors = Markdoc.validate(ast);

  if (errors.length) {
    console.error("Markdoc validation errors:", errors);
    throw new Error("Invalid content");
  }

  const renderable = Markdoc.transform(ast);
  return renderable;
}
```

### 6. Blog Pages Implementation

```typescript
// app/blog/page.tsx
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "@/keystatic.config";
import { BlogPostCard } from "@/components/blog/post-card";

const reader = createReader(process.cwd(), keystaticConfig);

export default async function BlogPage() {
  const posts = await reader.collections.posts.all();

  // Sort by date and filter published
  const publishedPosts = posts
    .filter((post) => post.entry.publishedAt <= new Date().toISOString())
    .sort(
      (a, b) =>
        new Date(b.entry.publishedAt).getTime() -
        new Date(a.entry.publishedAt).getTime()
    );

  const featuredPosts = publishedPosts.filter((p) => p.entry.featured);
  const recentPosts = publishedPosts.slice(0, 6);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>

      {featuredPosts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Featured Posts</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredPosts.map((post) => (
              <BlogPostCard key={post.slug} post={post} featured />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-semibold mb-6">Recent Posts</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}

// app/blog/[slug]/page.tsx
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "@/keystatic.config";
import React from "react";
import Markdoc from "@markdoc/markdoc";
import { markdocComponents } from "@/components/blog/markdoc-components";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { ShareButtons } from "@/components/blog/share-buttons";
import { trackView } from "@/app/actions/blog.actions";
import readingTime from "reading-time";

const reader = createReader(process.cwd(), keystaticConfig);

export async function generateStaticParams() {
  const posts = await reader.collections.posts.all();
  return posts.map((post) => ({ slug: post.slug }));
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
  const stats = readingTime(Markdoc.renderers.html(renderable));

  return (
    <>
      <ReadingProgress />
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-gray-400 mb-4">
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString()}
            </time>
            <span>·</span>
            <span>{stats.text}</span>
          </div>
          <div className="flex gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-purple-900/30 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="prose prose-invert prose-lg max-w-none">
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
```

### 7. View Tracking

```typescript
// app/actions/blog.actions.ts
'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function trackView(slug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get or create session ID
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('blog-session')?.value;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    cookieStore.set('blog-session', sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }

  // Track view
  try {
    await prisma.blogView.create({
      data: {
        slug,
        userId: user?.id || null,
        sessionId,
      },
    });
  } catch (error) {
    // Ignore duplicate view errors
    console.log('View already tracked for this session');
  }
}

export async function getViewCount(slug: string) {
  const count = await prisma.blogView.count({
    where: { slug },
  });
  return count;
}
```

### 8. Comment System Implementation

#### Comment Components

```typescript
// components/blog/comment-section.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CommentList } from "./comment-list";
import { submitComment } from "@/app/actions/blog.actions";
import { toast } from "sonner";

export function CommentSection({
  slug,
  initialComments,
}: {
  slug: string;
  initialComments: CommentWithReplies[];
}) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await submitComment(slug, content, null, 0);
      setContent("");
      toast.success("Comment posted!");
      // Optionally refresh comments or use optimistic updates
    } catch (error) {
      toast.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>Please sign in to join the discussion</p>
      </div>
    );
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-800">
      <h3 className="text-2xl font-semibold mb-6">Comments</h3>

      <div className="mb-8">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts..."
          className="mb-4"
          rows={3}
        />
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </div>

      <CommentList comments={initialComments} slug={slug} depth={0} />
    </div>
  );
}

// components/blog/comment-list.tsx
import { Comment } from "./comment";

export function CommentList({
  comments,
  slug,
  depth,
}: {
  comments: CommentWithReplies[];
  slug: string;
  depth: number;
}) {
  return (
    <div className={depth > 0 ? "ml-8 mt-4" : ""}>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} slug={slug} depth={depth} />
      ))}
    </div>
  );
}

// components/blog/comment.tsx
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ArrowUp, ArrowDown, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/auth/auth-provider";
import {
  submitComment,
  voteComment,
  deleteComment,
} from "@/app/actions/blog.actions";

export function Comment({
  comment,
  slug,
  depth,
}: {
  comment: CommentWithReplies;
  slug: string;
  depth: number;
}) {
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [score, setScore] = useState(comment.score);
  const [userVote, setUserVote] = useState(comment.userVote);

  const canReply = depth < 2; // Max depth of 2
  const isAuthor = user?.id === comment.userId;

  const handleVote = async (vote: 1 | -1) => {
    if (!user) return;

    const newVote = userVote === vote ? 0 : vote;
    const scoreDiff = newVote - (userVote || 0);

    setUserVote(newVote === 0 ? null : newVote);
    setScore(score + scoreDiff);

    try {
      await voteComment(comment.id, newVote);
    } catch (error) {
      // Revert on error
      setUserVote(userVote);
      setScore(score);
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim() || !user) return;

    try {
      await submitComment(slug, replyContent, comment.id, depth + 1);
      setReplyContent("");
      setIsReplying(false);
      // Refresh or optimistic update
    } catch (error) {
      console.error("Failed to post reply");
    }
  };

  if (comment.deletedAt) {
    return <div className="py-4 text-gray-500 italic">[deleted]</div>;
  }

  return (
    <div className="py-4 border-b border-gray-800 last:border-0">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            className={userVote === 1 ? "text-orange-500" : ""}
            onClick={() => handleVote(1)}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{score}</span>
          <Button
            size="sm"
            variant="ghost"
            className={userVote === -1 ? "text-blue-500" : ""}
            onClick={() => handleVote(-1)}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <span className="font-medium">{comment.userName}</span>
            <span>·</span>
            <time>
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </time>
            {comment.isEdited && <span>(edited)</span>}
          </div>

          <div className="prose prose-invert max-w-none mb-3">
            {comment.content}
          </div>

          <div className="flex gap-2">
            {canReply && user && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsReplying(!isReplying)}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Reply
              </Button>
            )}
            {isAuthor && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => deleteComment(comment.id)}
              >
                Delete
              </Button>
            )}
          </div>

          {isReplying && (
            <div className="mt-4">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                className="mb-2"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleReply}>
                  Post Reply
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsReplying(false);
                    setReplyContent("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <CommentList
              comments={comment.replies}
              slug={slug}
              depth={depth + 1}
            />
          )}
        </div>
      </div>
    </div>
  );
}
```

#### Server Actions for Comments

```typescript
// app/actions/blog.actions.ts (additions)

export async function getComments(slug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const comments = await prisma.blogComment.findMany({
    where: {
      slug,
      parentId: null, // Root comments only
      deletedAt: null,
    },
    include: {
      votes: true,
      replies: {
        where: { deletedAt: null },
        include: {
          votes: true,
          replies: {
            where: { deletedAt: null },
            include: { votes: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate scores and user votes
  const processComment = (comment: any) => {
    const score = comment.votes.reduce(
      (sum: number, vote: any) => sum + vote.vote,
      0
    );
    const userVote = user
      ? comment.votes.find((v: any) => v.userId === user.id)?.vote
      : null;

    return {
      ...comment,
      score,
      userVote,
      userName: 'Anonymous', // Fetch from user table in real implementation
      replies: comment.replies?.map(processComment) || [],
    };
  };

  return comments.map(processComment);
}

export async function submitComment(
  slug: string,
  content: string,
  parentId: string | null,
  depth: number
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');
  if (depth > 2) throw new Error('Maximum nesting depth exceeded');

  const comment = await prisma.blogComment.create({
    data: {
      slug,
      userId: user.id,
      content,
      parentId,
      depth,
    },
  });

  // Create notification for parent comment author
  if (parentId) {
    const parentComment = await prisma.blogComment.findUnique({
      where: { id: parentId },
    });

    if (parentComment && parentComment.userId !== user.id) {
      await createNotification({
        userId: parentComment.userId,
        type: 'comment_reply',
        title: 'New reply to your comment',
        message: `Someone replied to your comment on "${slug}"`,
        entityType: 'blog_comment',
        entityId: comment.id,
        triggerUserId: user.id,
        triggerCommentId: comment.id,
        metadata: { slug, parentCommentId: parentId },
      });
    }
  }

  // Broadcast via Supabase realtime
  const channel = supabase.channel(`blog:${slug}`);
  await channel.send({
    type: 'broadcast',
    event: 'new_comment',
    payload: { comment },
  });

  return comment;
}

export async function voteComment(commentId: string, vote: -1 | 0 | 1) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  if (vote === 0) {
    // Remove vote
    await prisma.blogCommentVote.deleteMany({
      where: {
        commentId,
        userId: user.id,
      },
    });
  } else {
    // Upsert vote
    await prisma.blogCommentVote.upsert({
      where: {
        commentId_userId: {
          commentId,
          userId: user.id,
        },
      },
      update: { vote },
      create: {
        commentId,
        userId: user.id,
        vote,
      },
    });

    // Notify comment author of upvote
    if (vote === 1) {
      const comment = await prisma.blogComment.findUnique({
        where: { id: commentId },
      });

      if (comment && comment.userId !== user.id) {
        await createNotification({
          userId: comment.userId,
          type: 'comment_vote',
          title: 'Your comment was upvoted',
          message: 'Someone upvoted your comment',
          entityType: 'blog_comment',
          entityId: commentId,
          triggerUserId: user.id,
          metadata: { vote },
        });
      }
    }
  }
}

export async function deleteComment(commentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  // Soft delete - preserve for thread continuity
  await prisma.blogComment.update({
    where: {
      id: commentId,
      userId: user.id, // Ensure user owns the comment
    },
    data: {
      deletedAt: new Date(),
      content: '[deleted]',
    },
  });
}
```

### 9. Notification System

#### Notification Components

```typescript
// components/notifications/notification-bell.tsx
"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationList } from "./notification-list";
import { useNotifications } from "@/hooks/use-notifications";
import { Badge } from "@/components/ui/badge";

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
        </div>
        <NotificationList
          notifications={notifications}
          onMarkAsRead={markAsRead}
        />
      </PopoverContent>
    </Popover>
  );
}

// hooks/use-notifications.ts
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  getNotifications,
  markNotificationAsRead,
} from "@/app/actions/notification.actions";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    loadNotifications();

    // Subscribe to real-time notifications
    const channel = supabase
      .channel("notifications")
      .on("broadcast", { event: "new_notification" }, ({ payload }) => {
        setNotifications((prev) => [payload.notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadNotifications = async () => {
    const data = await getNotifications();
    setNotifications(data);
    setUnreadCount(data.filter((n) => !n.isRead).length);
  };

  const markAsRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return { notifications, unreadCount, markAsRead };
}

// app/actions/notification.actions.ts
export async function createNotification(data: {
  userId: string;
  type: string;
  title: string;
  message: string;
  entityType: string;
  entityId: string;
  triggerUserId?: string;
  triggerCommentId?: string;
  metadata?: any;
}) {
  const notification = await prisma.notification.create({
    data,
  });

  // Broadcast to user via Supabase
  const supabase = await createClient();
  const channel = supabase.channel(`user:${data.userId}`);
  await channel.send({
    type: "broadcast",
    event: "new_notification",
    payload: { notification },
  });

  return notification;
}

export async function getNotifications() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  return prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function markNotificationAsRead(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  return prisma.notification.update({
    where: {
      id,
      userId: user.id,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
}
```

### 10. Integration with Blog Post Page

Update the blog post page to include comments:

```typescript
// app/blog/[slug]/page.tsx (addition)
import { CommentSection } from "@/components/blog/comment-section";
import { getComments } from "@/app/actions/blog.actions";

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  // ... existing code ...

  // Get comments
  const comments = await getComments(params.slug);

  return (
    <>
      {/* ... existing post content ... */}

      <CommentSection slug={params.slug} initialComments={comments} />
    </>
  );
}
```

### 11. Environment Variables

```env
# Add to existing .env.local
KEYSTATIC_GITHUB_APP_CLIENT_ID=your_github_app_client_id
KEYSTATIC_GITHUB_APP_CLIENT_SECRET=your_github_app_client_secret
KEYSTATIC_SECRET=your_random_secret_key
```

### 9. GitHub App Setup

1. Create a GitHub App at https://github.com/settings/apps/new
2. Set Homepage URL: `https://waltermorales.dev`
3. Set Callback URL: `https://waltermorales.dev/api/keystatic/github/oauth/callback`
4. Set Webhook URL: Leave blank
5. Permissions:
   - Contents: Read & Write
   - Metadata: Read
   - Pull requests: Read & Write
6. Save and get Client ID and Client Secret

## Features Implemented

### Core Features

- **Git-based CMS**: Content stored in repository
- **Markdoc format**: Safe, fast content format
- **GitHub integration**: PR workflow for content
- **View tracking**: Anonymous and authenticated
- **SEO optimized**: Meta tags, OG images, structured data
- **RSS feed**: Auto-generated from posts
- **Search**: Client-side search with Fuse.js
- **Tags**: Categorization and filtering
- **Reading time**: Calculated for each post
- **Share buttons**: Social media sharing

### Developer Experience

- **Type safety**: Full TypeScript support
- **Hot reload**: Content changes reflect immediately
- **Preview**: Draft posts in Keystatic UI
- **Version control**: Full Git history
- **Rollback**: Easy content recovery

## Implementation Timeline

### Phase 1: Setup (2 hours)

- Install dependencies
- Configure Keystatic
- Setup GitHub App
- Create admin routes

### Phase 2: Content Structure (2 hours)

- Define collections schema
- Setup Markdoc components
- Create sample posts
- Test GitHub integration

### Phase 3: Blog Routes (3 hours)

- Homepage with featured/recent
- Individual post pages
- Archive page
- Tag filtering

### Phase 4: Features (2 hours)

- View tracking
- Reading progress
- Share functionality
- RSS feed

### Phase 5: Polish (2 hours)

- SEO optimization
- Performance tuning
- Error handling
- Documentation

**Total: 11 hours** (vs. 15-20 for monorepo approach)

## Benefits of This Approach

1. **Simpler architecture**: No monorepo complexity
2. **Faster development**: Single app deployment
3. **Shared resources**: Reuse existing auth, components
4. **Git-based**: No CMS hosting costs
5. **Type safe**: Full TypeScript integration
6. **Performance**: Static generation with ISR
7. **SEO friendly**: Built-in optimizations

## Next Steps

1. Run database migration for BlogView model
2. Create GitHub App and get credentials
3. Install dependencies and setup Keystatic
4. Create first blog post through Keystatic UI
5. Deploy and test GitHub integration

## Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm db:migrate       # Run Prisma migrations

# Content Management
# Access Keystatic at: http://localhost:3000/keystatic
```
