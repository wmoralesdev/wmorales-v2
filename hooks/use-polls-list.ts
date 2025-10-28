"use client";

import { useCallback, useRef } from "react";
import useSWR, { type KeyedMutator } from "swr";

type Poll = {
  id: string;
  title: string;
  description: string | null;
  code: string;
  isActive: boolean;
  createdAt: Date;
  _count: {
    sessions: number;
    questions: number;
  };
};

type UsePollsListOptions = {
  fallbackData?: Poll[];
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
};

// This would typically be a server action, but since we need it client-side for SWR
async function fetchPolls(): Promise<Poll[]> {
  // Note: This would need to be refactored to use a proper server action
  // For now, using this as a placeholder - in real implementation,
  // you'd want to create a server action that can be called from client
  try {
    const response = await fetch("/api/polls");
    if (!response.ok) {
      throw new Error("Failed to fetch polls");
    }
    return await response.json();
  } catch {
    console.error("Error fetching polls");
    return [];
  }
}

export function usePollsList(options: UsePollsListOptions = {}) {
  const {
    fallbackData = [],
    revalidateOnFocus = true,
    revalidateOnReconnect = true,
  } = options;

  // Use a ref to track the mutate function for external access
  const mutateRef = useRef<KeyedMutator<Poll[]>>(null);

  const {
    data: polls,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<Poll[]>("polls-list", fetchPolls, {
    fallbackData,
    revalidateOnFocus,
    revalidateOnReconnect,
    // Revalidate every 30 seconds for active polls
    refreshInterval: 30_000,
    // Don't revalidate if data is less than 10 seconds old
    dedupingInterval: 10_000,
    // Keep previous data while revalidating
    keepPreviousData: true,
  });

  // Store mutate function in ref for external access
  mutateRef.current = mutate;

  // Update poll status optimistically
  const updatePollStatus = useCallback(
    (pollId: string, isActive: boolean) => {
      mutate(
        (current = []) =>
          current.map((poll) =>
            poll.id === pollId ? { ...poll, isActive } : poll
          ),
        {
          revalidate: false,
          populateCache: true,
        }
      );
    },
    [mutate]
  );

  // Update poll session count optimistically
  const updatePollSessionCount = useCallback(
    (pollId: string, increment = 1) => {
      mutate(
        (current = []) =>
          current.map((poll) =>
            poll.id === pollId
              ? {
                  ...poll,
                  _count: {
                    ...poll._count,
                    sessions: Math.max(0, poll._count.sessions + increment),
                  },
                }
              : poll
          ),
        {
          revalidate: false,
          populateCache: true,
        }
      );
    },
    [mutate]
  );

  // Sync with real-time updates
  const syncUpdate = useCallback(
    (update: {
      type:
        | "poll_status_changed"
        | "poll_session_added"
        | "poll_session_removed";
      pollId: string;
      isActive?: boolean;
    }) => {
      switch (update.type) {
        case "poll_status_changed":
          if (update.isActive !== undefined) {
            updatePollStatus(update.pollId, update.isActive);
          }
          break;
        case "poll_session_added":
          updatePollSessionCount(update.pollId, 1);
          break;
        case "poll_session_removed":
          updatePollSessionCount(update.pollId, -1);
          break;
      }
    },
    [updatePollStatus, updatePollSessionCount]
  );

  // Get poll by code
  const getPollByCode = useCallback(
    (code: string) => polls?.find((poll) => poll.code === code) || null,
    [polls]
  );

  // Get active polls only
  const getActivePolls = useCallback(
    () => polls?.filter((poll) => poll.isActive) || [],
    [polls]
  );

  // Refresh function for manual revalidation
  const refresh = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    polls: polls || [],
    error,
    isLoading,
    isValidating,
    syncUpdate,
    updatePollStatus,
    updatePollSessionCount,
    getPollByCode,
    getActivePolls,
    refresh,
  };
}

// Export types for external use
export type { Poll, UsePollsListOptions };
