import type { RealtimeChannel } from '@supabase/supabase-js';
import { createClient } from './client';

export type PollRealtimeEvent = {
  type: 'vote_added' | 'vote_removed' | 'poll_closed' | 'results_updated';
  pollId: string;
  questionId?: string;
  optionId?: string;
  voteCount?: number;
  timestamp: string;
};

export type PollPresence = {
  userId?: string;
  sessionId: string;
  joinedAt: string;
};

export function subscribeToPollUpdates(
  pollCode: string,
  onUpdate: (event: PollRealtimeEvent) => void,
  onPresenceUpdate?: (users: PollPresence[]) => void
): RealtimeChannel {
  const supabase = createClient();

  const channel = supabase
    .channel(`poll:${pollCode}`)
    .on('broadcast', { event: 'poll_update' }, ({ payload }) => {
      onUpdate(payload as PollRealtimeEvent);
    })
    .on('presence', { event: 'sync' }, () => {
      if (onPresenceUpdate) {
        const state = channel.presenceState();
        const users = Object.values(state).flat() as unknown as PollPresence[];
        onPresenceUpdate(users);
      }
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED' && onPresenceUpdate) {
        // Track user presence
        const sessionId = await getSessionId();
        await channel.track({
          sessionId,
          joinedAt: new Date().toISOString(),
        });
      }
    });

  return channel;
}

// Client-side only broadcast function
// biome-ignore lint/suspicious/useAwait: async because server process needs to be async
export async function broadcastPollUpdate(_pollCode: string, _event: PollRealtimeEvent) {
  // This function should only be called from server actions
  // For client-side, updates happen through subscriptions
  if (typeof window !== 'undefined') {
    return;
  }
}

// Helper to get session ID (client-side)
// biome-ignore lint/suspicious/useAwait: async because server process needs to be async
async function getSessionId() {
  // Check if we're on the client
  if (typeof window !== 'undefined') {
    let sessionId = localStorage.getItem('poll_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('poll_session_id', sessionId);
    }
    return sessionId;
  }
  return 'server-side';
}

// Subscribe to polls list for active users count
export function subscribeToPollsList(
  onPresenceUpdate: (pollActiveUsers: Record<string, number>) => void
): RealtimeChannel {
  const supabase = createClient();

  const channel = supabase
    .channel('polls:active')
    .on('broadcast', { event: 'active_users' }, ({ payload }) => {
      onPresenceUpdate(payload as Record<string, number>);
    })
    .subscribe();

  return channel;
}

// Client-side broadcast active users count for a poll
export async function broadcastActiveUsers(pollCode: string, count: number) {
  const supabase = createClient();

  await supabase.channel('polls:active').send({
    type: 'broadcast',
    event: 'active_users',
    payload: { [pollCode]: count },
  });
}
