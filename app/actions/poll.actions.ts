'use server';

import crypto from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { cookies, headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

// Helper to get or create session ID
async function getSessionId() {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('poll_session_id')?.value;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    cookieStore.set('poll_session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return sessionId;
}

// Helper to get hashed IP
async function getHashedIp() {
  const headersList = await headers();
  const forwardedFor = headersList.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
  return crypto.createHash('sha256').update(ip).digest('hex');
}

export async function createPoll(data: {
  title: string;
  description?: string;
  questions: {
    question: string;
    type: 'single' | 'multiple';
    maxSelections?: number;
    options: {
      label: string;
      value: string;
      color?: string;
      emoji?: string;
    }[];
  }[];
  settings?: {
    allowMultiple?: boolean;
    showResults?: boolean;
    resultsDelay?: number;
  };
}) {
  try {
    const poll = await prisma.poll.create({
      data: {
        title: data.title,
        description: data.description,
        allowMultiple: data.settings?.allowMultiple ?? false,
        showResults: data.settings?.showResults ?? true,
        resultsDelay: data.settings?.resultsDelay ?? 0,
        questions: {
          create: data.questions.map((q, index) => ({
            questionOrder: index + 1,
            question: q.question,
            type: q.type,
            maxSelections: q.maxSelections,
            options: {
              create: q.options.map((opt, optIndex) => ({
                optionOrder: optIndex + 1,
                label: opt.label,
                value: opt.value,
                color: opt.color,
                emoji: opt.emoji,
              })),
            },
          })),
        },
      },
    });

    return { data: poll, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to create poll' };
  }
}

export async function getPollByCode(code: string) {
  try {
    const poll = await prisma.poll.findUnique({
      where: { code },
      include: {
        questions: {
          orderBy: { questionOrder: 'asc' },
          include: {
            options: {
              orderBy: { optionOrder: 'asc' },
            },
          },
        },
      },
    });

    if (!poll?.isActive) {
      return { data: null, error: 'Poll not found or inactive' };
    }

    return { data: poll, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to fetch poll' };
  }
}

export async function createPollSession(pollId: string) {
  try {
    const sessionId = await getSessionId();
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const headersList = await headers();

    // Check if session already exists
    const existingSession = await prisma.pollSession.findUnique({
      where: {
        pollId_sessionId: {
          pollId,
          sessionId,
        },
      },
    });

    if (existingSession) {
      return { data: existingSession, error: null };
    }

    // Create new session
    const session = await prisma.pollSession.create({
      data: {
        pollId,
        sessionId,
        userId: user?.id || null,
        userAgent: headersList.get('user-agent'),
        ipHash: await getHashedIp(),
      },
    });

    return { data: session, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to create session' };
  }
}

export async function votePoll(pollId: string, questionId: string, optionIds: string | string[]) {
  try {
    const sessionId = await getSessionId();

    // Get or create session
    const sessionResult = await createPollSession(pollId);
    if (sessionResult.error || !sessionResult.data) {
      return { data: null, error: sessionResult.error };
    }

    const optionIdArray = Array.isArray(optionIds) ? optionIds : [optionIds];

    // Validate the poll and question
    const question = await prisma.pollQuestion.findFirst({
      where: { id: questionId, pollId },
      include: { poll: true },
    });

    if (!question?.poll.isActive) {
      return { data: null, error: 'Invalid poll or question' };
    }

    // Check vote limits
    if (question.type === 'single' && optionIdArray.length > 1) {
      return { data: null, error: 'Only one option allowed' };
    }

    if (question.maxSelections && optionIdArray.length > question.maxSelections) {
      return { data: null, error: `Maximum ${question.maxSelections} selections allowed` };
    }

    // Remove existing votes for this question if not allowing multiple
    if (!question.poll.allowMultiple) {
      await prisma.pollVote.deleteMany({
        where: {
          sessionId: sessionResult.data.id,
          questionId,
        },
      });
    }

    // Create new votes
    const votes = await prisma.pollVote.createMany({
      data: optionIdArray.map((optionId) => ({
        sessionId: sessionResult.data.id,
        questionId,
        optionId,
      })),
      skipDuplicates: true,
    });

    // Broadcast update via Supabase (we'll set this up next)
    // This will be picked up by the realtime subscription

    revalidatePath(`/polls/${question.poll.code}`);

    return { data: votes, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to submit vote' };
  }
}

export async function getPollResults(pollId: string) {
  try {
    const results = await prisma.pollQuestion.findMany({
      where: { pollId },
      orderBy: { questionOrder: 'asc' },
      include: {
        options: {
          orderBy: { optionOrder: 'asc' },
          include: {
            _count: {
              select: { votes: true },
            },
          },
        },
        _count: {
          select: { votes: true },
        },
      },
    });

    const totalVotes = await prisma.pollVote.count({
      where: {
        question: { pollId },
      },
    });

    const formattedResults = {
      pollId,
      totalVotes,
      questions: results.map((question) => ({
        questionId: question.id,
        question: question.question,
        type: question.type,
        totalQuestionVotes: question._count.votes,
        options: question.options.map((option) => ({
          optionId: option.id,
          label: option.label,
          value: option.value,
          color: option.color,
          emoji: option.emoji,
          voteCount: option._count.votes,
          percentage: question._count.votes > 0 ? Math.round((option._count.votes / question._count.votes) * 100) : 0,
        })),
      })),
    };

    return { data: formattedResults, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to fetch results' };
  }
}

export async function getUserVotes(pollId: string) {
  try {
    const sessionId = await getSessionId();

    const session = await prisma.pollSession.findUnique({
      where: {
        pollId_sessionId: {
          pollId,
          sessionId,
        },
      },
      include: {
        votes: {
          select: {
            questionId: true,
            optionId: true,
          },
        },
      },
    });

    if (!session) {
      return { data: {}, error: null };
    }

    // Group votes by question
    const votesByQuestion = session.votes.reduce(
      (acc, vote) => {
        if (!acc[vote.questionId]) {
          acc[vote.questionId] = [];
        }
        acc[vote.questionId].push(vote.optionId);
        return acc;
      },
      {} as Record<string, string[]>
    );

    return { data: votesByQuestion, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to fetch votes' };
  }
}

export async function closePoll(pollId: string) {
  try {
    const poll = await prisma.poll.update({
      where: { id: pollId },
      data: {
        isActive: false,
        closedAt: new Date(),
      },
    });

    revalidatePath(`/polls/${poll.code}`);

    return { data: poll, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to close poll' };
  }
}
