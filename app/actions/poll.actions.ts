"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { db } from "@/lib/db-utils";
import { broadcastPollUpdate } from "@/lib/supabase/realtime-server";
import { createClient } from "@/lib/supabase/server";

// Helper to get or create session ID
async function getSessionId() {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("poll_session_id")?.value;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    cookieStore.set("poll_session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return sessionId;
}

// Get all polls for static generation
export async function getAllPolls() {
  try {
    const polls = await db.query(() =>
      db.client.poll.findMany({
        where: { isActive: true },
        select: { code: true },
        orderBy: { createdAt: "desc" },
      })
    );
    return polls;
  } catch (error) {
    console.error("Error fetching all polls:", error);
    return [];
  }
}

// Helper to get hashed IP
async function getHashedIp() {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0] : "unknown";
  return crypto.createHash("sha256").update(ip).digest("hex");
}

export async function createPoll(data: {
  title: string;
  description?: string;
  questions: {
    question: string;
    type: "single" | "multiple";
    maxSelections?: number;
    options: {
      label: string;
      value: string;
      color?: string;
    }[];
  }[];
  settings?: {
    allowMultiple?: boolean;
    showResults?: boolean;
    resultsDelay?: number;
  };
}) {
  try {
    const poll = await db.query(() =>
      db.client.poll.create({
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
                })),
              },
            })),
          },
        },
      })
    );

    return { data: poll, error: null };
  } catch (_error) {
    return { data: null, error: "Failed to create poll" };
  }
}

export async function getPollByCode(code: string) {
  try {
    const poll = await db.query(() =>
      db.client.poll.findUnique({
        where: { code },
        include: {
          questions: {
            orderBy: { questionOrder: "asc" },
            include: {
              options: {
                orderBy: { optionOrder: "asc" },
              },
            },
          },
        },
      })
    );

    if (!poll?.isActive) {
      return { data: null, error: "Poll not found or inactive" };
    }

    return { data: poll, error: null };
  } catch (_error) {
    return { data: null, error: "Failed to fetch poll" };
  }
}

export async function createPollSession(pollId: string) {
  try {
    const sessionId = await getSessionId();
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Require authentication
    if (!user) {
      return { data: null, error: "Authentication required" };
    }

    const headersList = await headers();

    // Check if session already exists
    const existingSession = await db.query(() =>
      db.client.pollSession.findUnique({
        where: {
          pollId_sessionId: {
            pollId,
            sessionId,
          },
        },
      })
    );

    if (existingSession) {
      return { data: existingSession, error: null };
    }

    // Create new session
    const session = await db.query(async () =>
      db.client.pollSession.create({
        data: {
          pollId,
          sessionId,
          profileId: user.id, // Always use authenticated user ID
          userAgent: headersList.get("user-agent"),
          ipHash: await getHashedIp(),
        },
      })
    );

    return { data: session, error: null };
  } catch (_error) {
    return { data: null, error: "Failed to create session" };
  }
}

export async function votePoll(
  pollId: string,
  questionId: string,
  optionIds: string | string[]
) {
  try {
    // Get or create session
    const sessionResult = await createPollSession(pollId);
    if (sessionResult.error || !sessionResult.data) {
      return { data: null, error: sessionResult.error };
    }

    const optionIdArray = Array.isArray(optionIds) ? optionIds : [optionIds];

    // Validate the poll and question
    const question = await db.query(() =>
      db.client.pollQuestion.findFirst({
        where: { id: questionId, pollId },
        include: { poll: true },
      })
    );

    if (!question?.poll.isActive) {
      return { data: null, error: "Invalid poll or question" };
    }

    // Check if user has already voted for this question
    const existingVotes = await db.query(() =>
      db.client.pollVote.findMany({
        where: {
          sessionId: sessionResult.data.id,
          questionId,
        },
      })
    );

    // If user has already voted and poll doesn't allow multiple votes, prevent duplicate voting
    if (existingVotes.length > 0 && !question.poll.allowMultiple) {
      return { data: null, error: "You have already voted for this question" };
    }

    // Check vote limits
    if (question.type === "single" && optionIdArray.length > 1) {
      return { data: null, error: "Only one option allowed" };
    }

    if (
      question.maxSelections &&
      optionIdArray.length > question.maxSelections
    ) {
      return {
        data: null,
        error: `Maximum ${question.maxSelections} selections allowed`,
      };
    }

    // Remove existing votes for this question when updating (only if allowMultiple is true)
    if (question.poll.allowMultiple && existingVotes.length > 0) {
      await db.query(() =>
        db.client.pollVote.deleteMany({
          where: {
            sessionId: sessionResult.data.id,
            questionId,
          },
        })
      );
    }

    // Create new votes
    const votes = await db.query(() =>
      db.client.pollVote.createMany({
        data: optionIdArray.map((optionId) => ({
          sessionId: sessionResult.data.id,
          questionId,
          optionId,
        })),
        skipDuplicates: true,
      })
    );

    // Broadcast update via Supabase
    await broadcastPollUpdate(question.poll.code, {
      type: "vote_added",
      pollId,
      questionId,
      timestamp: new Date().toISOString(),
    });

    revalidatePath(`/polls/${question.poll.code}`);

    return { data: votes, error: null };
  } catch (_error) {
    return { data: null, error: "Failed to submit vote" };
  }
}

export async function getPollResults(pollId: string) {
  try {
    const results = await db.query(() =>
      db.client.pollQuestion.findMany({
        where: { pollId },
        orderBy: { questionOrder: "asc" },
        include: {
          options: {
            orderBy: { optionOrder: "asc" },
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
      })
    );

    // Count unique voters (unique sessions that have voted)
    const uniqueVoters = await db.query(() =>
      db.client.pollSession.count({
        where: {
          pollId,
          votes: {
            some: {}, // Has at least one vote
          },
        },
      })
    );

    const formattedResults = {
      pollId,
      totalVotes: uniqueVoters, // Changed to unique voters count
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
          voteCount: option._count.votes,
          percentage:
            question._count.votes > 0
              ? Math.round((option._count.votes / question._count.votes) * 100)
              : 0,
        })),
      })),
    };

    return { data: formattedResults, error: null };
  } catch (_error) {
    return { data: null, error: "Failed to fetch results" };
  }
}

export async function getUserVotes(pollId: string) {
  try {
    const sessionId = await getSessionId();
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Find sessions by both sessionId and profileId
    const sessions = await db.query(() =>
      db.client.pollSession.findMany({
        where: {
          pollId,
          OR: [{ sessionId }, ...(user ? [{ profileId: user.id }] : [])],
        },
        include: {
          votes: {
            select: {
              questionId: true,
              optionId: true,
            },
          },
        },
      })
    );

    if (sessions.length === 0) {
      return { data: {}, error: null };
    }

    // Merge votes from all sessions (in case user has voted from multiple devices)
    const allVotes = sessions.flatMap((session) => session.votes);

    // Group votes by question
    const votesByQuestion = allVotes.reduce(
      (acc, vote) => {
        if (!acc[vote.questionId]) {
          acc[vote.questionId] = [];
        }
        if (!acc[vote.questionId].includes(vote.optionId)) {
          acc[vote.questionId].push(vote.optionId);
        }
        return acc;
      },
      {} as Record<string, string[]>
    );

    return { data: votesByQuestion, error: null };
  } catch (_error) {
    return { data: null, error: "Failed to fetch votes" };
  }
}

export async function closePoll(pollId: string) {
  try {
    const poll = await db.query(() =>
      db.client.poll.update({
        where: { id: pollId },
        data: {
          isActive: false,
          closedAt: new Date(),
        },
      })
    );

    // Broadcast poll closed event
    await broadcastPollUpdate(poll.code, {
      type: "poll_closed",
      pollId,
      timestamp: new Date().toISOString(),
    });

    revalidatePath(`/polls/${poll.code}`);

    return { data: poll, error: null };
  } catch (_error) {
    return { data: null, error: "Failed to close poll" };
  }
}

// New function to get active user count for a poll
export async function getPollActiveUsers(pollCode: string) {
  try {
    // This is a placeholder - in a real implementation, you'd track active websocket connections
    // For now, we'll count recent sessions (last 5 minutes)
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

    const poll = await db.query(() =>
      db.client.poll.findUnique({
        where: { code: pollCode },
        select: { id: true },
      })
    );

    if (!poll) {
      return { data: 0, error: null };
    }

    const activeSessions = await db.query(() =>
      db.client.pollSession.count({
        where: {
          pollId: poll.id,
          createdAt: {
            gte: fiveMinutesAgo,
          },
        },
      })
    );

    return { data: activeSessions, error: null };
  } catch (_error) {
    return { data: 0, error: "Failed to get active users" };
  }
}
