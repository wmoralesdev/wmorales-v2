'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

// View tracking
export async function trackView(slug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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

// Comment functionality
export async function getComments(slug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
  const processComment = (comment: any): any => {
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
  const { data: { user } } = await supabase.auth.getUser();

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
  const { data: { user } } = await supabase.auth.getUser();

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
  const { data: { user } } = await supabase.auth.getUser();

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
  metadata?: any;
}) {
  const notification = await prisma.notification.create({
    data,
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