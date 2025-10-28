"use client";

import { useCallback, useRef } from "react";
import useSWR, { type KeyedMutator } from "swr";
import { getUserVotes, votePoll } from "@/app/actions/poll.actions";

type UserVotes = Record<string, string[]>;

type UsePollVotingOptions = {
  fallbackData?: UserVotes;
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
};

export function usePollVoting(
  pollId: string,
  options: UsePollVotingOptions = {}
) {
  const {
    fallbackData = {},
    revalidateOnFocus = false,
    revalidateOnReconnect = true,
  } = options;

  // Use a ref to track the mutate function for external access
  const mutateRef = useRef<KeyedMutator<UserVotes>>(null);

  const {
    data: userVotes,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR(
    pollId ? ["user-votes", pollId] : null,
    async ([, id]: [string, string]) => {
      const { data } = await getUserVotes(id);
      return data || {};
    },
    {
      fallbackData,
      revalidateOnFocus,
      revalidateOnReconnect,
      // Less frequent revalidation since votes don't change often
      refreshInterval: 60_000, // 1 minute
      dedupingInterval: 10_000, // 10 seconds
      keepPreviousData: true,
    }
  );

  // Store mutate function in ref for external access
  mutateRef.current = mutate;

  // Optimistic vote function
  const optimisticVote = useCallback(
    (questionId: string, optionIds: string | string[]) => {
      const newOptionIds = Array.isArray(optionIds) ? optionIds : [optionIds];

      mutate(
        (current = {}) => ({
          ...current,
          [questionId]: newOptionIds,
        }),
        {
          revalidate: false,
          populateCache: true,
        }
      );
    },
    [mutate]
  );

  // Remove optimistic vote (for error rollback)
  const removeOptimisticVote = useCallback(
    (questionId: string) => {
      mutate(
        (current = {}) => {
          const updated = { ...current };
          delete updated[questionId];
          return updated;
        },
        {
          revalidate: false,
          populateCache: true,
        }
      );
    },
    [mutate]
  );

  // Vote with optimistic updates
  const vote = useCallback(
    async (questionId: string, optionIds: string | string[]) => {
      const previousVote = userVotes?.[questionId];

      try {
        // Optimistic update
        optimisticVote(questionId, optionIds);

        // Perform server action
        const result = await votePoll(pollId, questionId, optionIds);

        if (result.error) {
          throw new Error(result.error);
        }

        // Update with actual result
        mutate(
          (current = {}) => ({
            ...current,
            [questionId]: Array.isArray(optionIds) ? optionIds : [optionIds],
          }),
          {
            revalidate: false,
            populateCache: true,
          }
        );

        return { success: true };
      } catch {
        // Rollback optimistic update
        if (previousVote) {
          optimisticVote(questionId, previousVote);
        } else {
          removeOptimisticVote(questionId);
        }

        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to vote",
        };
      }
    },
    [userVotes, optimisticVote, pollId, mutate, error, removeOptimisticVote]
  );

  // Batch vote for multiple questions
  const batchVote = useCallback(
    async (
      votes: Array<{ questionId: string; optionIds: string | string[] }>
    ) => {
      const previousVotes = { ...userVotes };
      const results: Array<{
        questionId: string;
        success: boolean;
        error?: string;
      }> = [];

      try {
        // Apply all optimistic updates first
        for (const { questionId, optionIds } of votes) {
          optimisticVote(questionId, optionIds);
        }

        // Execute votes in parallel
        const votePromises = votes.map(async ({ questionId, optionIds }) => {
          try {
            const result = await votePoll(pollId, questionId, optionIds);
            if (result.error) {
              throw new Error(result.error);
            }
            return { questionId, success: true };
          } catch {
            return {
              questionId,
              success: false,
              error: error instanceof Error ? error.message : "Failed to vote",
            };
          }
        });

        const voteResults = await Promise.all(votePromises);
        results.push(...voteResults);

        // Check if any votes failed
        const failedVotes = voteResults.filter((r) => !r.success);

        if (failedVotes.length > 0) {
          // Rollback failed votes
          for (const { questionId } of failedVotes) {
            const previousVote = previousVotes[questionId];
            if (previousVote) {
              optimisticVote(questionId, previousVote);
            } else {
              removeOptimisticVote(questionId);
            }
          }
        }

        return {
          success: failedVotes.length === 0,
          results,
          failedCount: failedVotes.length,
        };
      } catch {
        // Rollback all optimistic updates
        mutate(previousVotes, { revalidate: false, populateCache: true });

        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Failed to submit votes",
          results,
        };
      }
    },
    [userVotes, optimisticVote, pollId, error, removeOptimisticVote, mutate]
  );

  // Sync with real-time updates
  const syncUpdate = useCallback(
    (update: {
      type: "vote_added" | "vote_removed";
      questionId: string;
      optionIds?: string[];
    }) => {
      if (update.type === "vote_added" && update.optionIds) {
        mutate(
          (current = {}) => ({
            ...current,
            [update.questionId]: update.optionIds ?? [],
          }),
          {
            revalidate: false,
            populateCache: true,
          }
        );
      } else if (update.type === "vote_removed") {
        mutate(
          (current = {}) => {
            const updated = { ...current };
            delete updated[update.questionId];
            return updated;
          },
          {
            revalidate: false,
            populateCache: true,
          }
        );
      }
    },
    [mutate]
  );

  // Check if user has voted for a specific question
  const hasVoted = useCallback(
    (questionId: string) => (userVotes?.[questionId] || []).length > 0,
    [userVotes]
  );

  // Get user's vote for a specific question
  const getUserVote = useCallback(
    (questionId: string) => userVotes?.[questionId] || [],
    [userVotes]
  );

  // Check if all questions are answered
  const allQuestionsAnswered = useCallback(
    (questionIds: string[]) =>
      questionIds.every((questionId) => hasVoted(questionId)),
    [hasVoted]
  );

  // Refresh function for manual revalidation
  const refresh = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    userVotes: userVotes || {},
    error,
    isLoading,
    isValidating,
    vote,
    batchVote,
    syncUpdate,
    hasVoted,
    getUserVote,
    allQuestionsAnswered,
    refresh,
  };
}

// Export types for external use
export type { UserVotes, UsePollVotingOptions };
