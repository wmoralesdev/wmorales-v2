import useSWR from 'swr';
import { getPollResults } from '@/app/actions/poll.actions';
import type { PollResults } from '@/lib/types/poll.types';

// Fetcher function for poll results
const fetchPollResults = async (pollId: string) => {
  const { data } = await getPollResults(pollId);
  return data;
};

export function usePollResultsSWR(
  pollId: string,
  initialData?: PollResults | null
) {
  const {
    data = initialData,
    error,
    mutate,
    isLoading,
  } = useSWR<PollResults | null>(
    `poll-results-${pollId}`,
    () => fetchPollResults(pollId),
    {
      fallbackData: initialData,
      refreshInterval: 5000, // Auto-refresh every 5 seconds for real-time updates
      revalidateOnFocus: false,
    }
  );

  return {
    results: data,
    error,
    isLoading,
    mutate,
    refresh: () => mutate(),
  };
}
