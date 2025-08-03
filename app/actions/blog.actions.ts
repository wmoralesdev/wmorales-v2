'use server';

import type { JsonValue } from '@prisma/client/runtime/library';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { BlogPost } from '@/lib/types/blog.types';

// Notification helpers
async function createNotification(data: {
  userId: string;
  type: string;
  title: string;
  message: string;
  entityType: string;
  entityId: string;
  triggerUserId?: string;
  triggerCommentId?: string;
  metadata?: JsonValue;
}) {
  const notification = await prisma.notification.create({
    data: {
      ...data,
      metadata: data.metadata || undefined,
    },
  });

  // Broadcast to user via Supabase
  const supabase = await createClient();
  const channel = supabase.channel(`user:${data.userId}`);
  await channel.send({
    type: 'broadcast',
    event: 'new_notification',
    payload: { notification },
  });

  return notification;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applySorting(posts: any[], sortBy: string) {
  const sortedPosts = [...posts];

  switch (sortBy) {
    case 'date-asc': {
      return sortedPosts.sort(
        (a, b) =>
          new Date(a.entry.publishedAt).getTime() -
          new Date(b.entry.publishedAt).getTime()
      );
    }
    case 'title-asc': {
      return sortedPosts.sort((a, b) =>
        a.entry.title.localeCompare(b.entry.title)
      );
    }
    case 'title-desc': {
      return sortedPosts.sort((a, b) =>
        b.entry.title.localeCompare(a.entry.title)
      );
    }
    case 'featured-first': {
      return sortedPosts.sort((a, b) => {
        if (a.entry.featured && !b.entry.featured) {
          return -1;
        }
        if (!a.entry.featured && b.entry.featured) {
          return 1;
        }
        return (
          new Date(b.entry.publishedAt).getTime() -
          new Date(a.entry.publishedAt).getTime()
        );
      });
    }
    case 'date-desc':
    default: {
      return sortedPosts.sort(
        (a, b) =>
          new Date(b.entry.publishedAt).getTime() -
          new Date(a.entry.publishedAt).getTime()
      );
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function calculateTagCounts(posts: any[]) {
  const tagCounts: Record<string, number> = {};

  for (const post of posts) {
    for (const tag of post.entry.tags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }
  }

  const AVAILABLE_TAGS = [
    { label: 'AI/ML', value: 'ai-ml' },
    { label: 'Web Development', value: 'web-dev' },
    { label: 'DevOps', value: 'devops' },
    { label: 'Career', value: 'career' },
    { label: 'Tutorial', value: 'tutorial' },
    { label: 'Cursor', value: 'cursor' },
  ];

  return AVAILABLE_TAGS.map((tag) => ({
    ...tag,
    count: tagCounts[tag.value] || 0,
  }));
}

// Session management
export async function initializeBlogSession() {
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

  return sessionId;
}

// View tracking
export async function trackView(slug: string, sessionId?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get session ID from parameter or cookie
  let finalSessionId = sessionId;
  if (!finalSessionId) {
    const cookieStore = await cookies();
    finalSessionId = cookieStore.get('blog-session')?.value;
  }

  // If no session ID available, generate one but don't set cookie
  if (!finalSessionId) {
    finalSessionId = crypto.randomUUID();
  }

  // Track view
  try {
    await prisma.blogView.create({
      data: {
        slug,
        userId: user?.id || null,
        sessionId: finalSessionId,
      },
    });
  } catch {
    // Ignore duplicate view errors - view already tracked for this session
  }
}

export async function getViewCount(slug: string) {
  const count = await prisma.blogView.count({
    where: { slug },
  });
  return count;
}

// Comment functionality
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

  // Define types for better type safety
  type CommentVote = {
    id: string;
    vote: number;
    userId: string;
    commentId: string;
  };

  type CommentWithVotes = {
    id: string;
    content: string;
    userId: string;
    createdAt: Date;
    votes: CommentVote[];
    replies?: CommentWithVotes[];
  };

  // Calculate scores and user votes
  const processComment = (
    comment: CommentWithVotes
  ): CommentWithVotes & {
    score: number;
    userVote: number | null;
    userName: string;
  } => {
    const score = comment.votes.reduce(
      (sum: number, vote: CommentVote) => sum + vote.vote,
      0
    );
    const userVote = user
      ? (comment.votes.find((v: CommentVote) => v.userId === user.id)?.vote ??
        null)
      : null;

    return {
      ...comment,
      score,
      userVote,
      userName: 'Anonymous', // TODO: Fetch from user table
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

  if (!user) {
    throw new Error('Unauthorized');
  }
  if (depth > 2) {
    throw new Error('Maximum nesting depth exceeded');
  }

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

  if (!user) {
    throw new Error('Unauthorized');
  }

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

  if (!user) {
    throw new Error('Unauthorized');
  }

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

// Search and filtering functionality
export type BlogSearchParams = {
  query?: string;
  tags?: string[];
  sortBy?: string;
  featuredOnly?: boolean;
};

export type BlogSearchResult = {
  posts: BlogPost[];
  totalCount: number;
  filteredCount: number;
  availableTags: Array<{ value: string; label: string; count: number }>;
};

export async function searchBlogPosts(
  params: BlogSearchParams
): Promise<BlogSearchResult> {
  const { createReader } = await import('@keystatic/core/reader');
  const keystaticConfig = await import('@/keystatic.config');

  const reader = createReader(process.cwd(), keystaticConfig.default);
  const allPosts = await reader.collections.posts.all();

  // Filter published posts only
  const now = new Date();
  const publishedPosts = allPosts
    .filter((post) => {
      if (!post.entry.publishedAt) {
        return false;
      }
      return new Date(post.entry.publishedAt) <= now;
    })
    .map((post) => ({
      ...post,
      entry: {
        ...post.entry,
        publishedAt: post.entry.publishedAt as string, // Safe cast since we filtered
        tags: [...post.entry.tags], // Convert readonly to mutable
      },
    }));

  // Apply filters
  let filteredPosts = publishedPosts;

  // Text search
  if (params.query) {
    const query = params.query.toLowerCase();
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.entry.title.toLowerCase().includes(query) ||
        post.entry.description.toLowerCase().includes(query)
    );
  }

  // Tag filtering
  if (params.tags && params.tags.length > 0) {
    filteredPosts = filteredPosts.filter((post) =>
      params.tags?.some((tag) =>
        post.entry.tags.includes(tag as (typeof post.entry.tags)[number])
      )
    );
  }

  // Featured filtering
  if (params.featuredOnly) {
    filteredPosts = filteredPosts.filter((post) => post.entry.featured);
  }

  // Apply sorting
  const sortedPosts = applySorting(filteredPosts, params.sortBy || 'date-desc');

  // Calculate tag counts
  const tagCounts = calculateTagCounts(publishedPosts);

  return {
    posts: sortedPosts,
    totalCount: publishedPosts.length,
    filteredCount: sortedPosts.length,
    availableTags: tagCounts,
  };
}

export async function getSearchSuggestions(query: string, limit = 5) {
  if (!query || query.length < 2) {
    return [];
  }

  const { createReader } = await import('@keystatic/core/reader');
  const keystaticConfig = await import('@/keystatic.config');

  const reader = createReader(process.cwd(), keystaticConfig.default);
  const allPosts = await reader.collections.posts.all();

  // Filter published posts only
  const now = new Date();
  const publishedPosts = allPosts.filter((post) => {
    if (!post.entry.publishedAt) return false;
    return new Date(post.entry.publishedAt) <= now;
  });

  const searchQuery = query.toLowerCase();
  const suggestions: Array<{
    type: 'title' | 'description';
    text: string;
    slug: string;
    title: string;
  }> = [];

  // Search in titles first
  for (const post of publishedPosts) {
    const title = post.entry.title.toLowerCase();
    if (title.includes(searchQuery)) {
      suggestions.push({
        type: 'title',
        text: post.entry.title,
        slug: post.slug,
        title: post.entry.title,
      });
    }
  }

  // Then search in descriptions
  for (const post of publishedPosts) {
    const description = post.entry.description.toLowerCase();
    if (
      description.includes(searchQuery) &&
      !suggestions.some((s) => s.slug === post.slug)
    ) {
      suggestions.push({
        type: 'description',
        text: post.entry.description,
        slug: post.slug,
        title: post.entry.title,
      });
    }
  }

  return suggestions.slice(0, limit);
}
export async function getBlogStats() {
  const { createReader } = await import('@keystatic/core/reader');
  const keystaticConfig = await import('@/keystatic.config');

  const reader = createReader(process.cwd(), keystaticConfig.default);
  const allPosts = await reader.collections.posts.all();

  const now = new Date();
  const publishedPosts = allPosts.filter((post) => {
    if (!post.entry.publishedAt) {
      return false;
    }
    return new Date(post.entry.publishedAt) <= now;
  });

  const featuredPosts = publishedPosts.filter((post) => post.entry.featured);
  const tagCounts = calculateTagCounts(publishedPosts);

  return {
    totalPosts: publishedPosts.length,
    featuredPosts: featuredPosts.length,
    availableTags: tagCounts,
    recentPosts: publishedPosts
      .sort(
        (a, b) =>
          new Date(b.entry.publishedAt!).getTime() -
          new Date(a.entry.publishedAt!).getTime()
      )
      .slice(0, 6),
  };
}
