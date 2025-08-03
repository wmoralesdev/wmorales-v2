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
  // User information for avatar display
  userEmail?: string;
  userName?: string;
  userAvatar?: string;
};

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

export function subscribeToPollUpdates(
  pollCode: string,
  onUpdate: (event: PollRealtimeEvent) => void,
  onPresenceUpdate?: (users: PollPresence[]) => void
): RealtimeChannel {
  const supabase = createClient();

  // Track presence immediately when creating the channel
  const setupPresence = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        return null;
      }

      const sessionId = await getSessionId();
      const presenceData: Partial<PollPresence> = {
        sessionId,
        joinedAt: new Date().toISOString(),
      };

      // Add user information if authenticated
      if (user) {
        presenceData.userId = user.id;
        presenceData.userEmail = user.email;
        presenceData.userName = user.user_metadata?.full_name || user.email;
        presenceData.userAvatar = user.user_metadata?.avatar_url;
      }

      return presenceData;
    } catch {
      return null;
    }
  };

  const channelName = `poll-${pollCode}`;

  const channel = supabase
    .channel(channelName)
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
    .on('presence', { event: 'join' }, () => {
      if (onPresenceUpdate) {
        const state = channel.presenceState();
        const users = Object.values(state).flat() as unknown as PollPresence[];
        onPresenceUpdate(users);
      }
    })
    .on('presence', { event: 'leave' }, () => {
      if (onPresenceUpdate) {
        const state = channel.presenceState();
        const users = Object.values(state).flat() as unknown as PollPresence[];
        onPresenceUpdate(users);
      }
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED' && onPresenceUpdate) {
        const presenceData = await setupPresence();
        if (presenceData) {
          await channel.track(presenceData);
        }
      }
    });

  return channel;
}

// Client-side only broadcast function
// biome-ignore lint/suspicious/useAwait: async because server process needs to be async
export async function broadcastPollUpdate(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _pollCode: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _event: PollRealtimeEvent
) {
  // This function should only be called from server actions
  // For client-side, updates happen through subscriptions
  if (typeof window !== 'undefined') {
    return;
  }
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

// Guestbook Realtime Types
export type GuestbookRealtimeEvent = {
  type: 'ticket_created' | 'ticket_updated' | 'ticket_deleted';
  ticket: {
    id: string;
    ticketNumber: string;
    userName: string;
    userEmail: string;
    userAvatar: string | null;
    userProvider: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    createdAt: string;
  };
  timestamp: string;
};

// Events Realtime Types
export type EventRealtimeEvent = {
  type: 'image_uploaded' | 'image_deleted';
  eventId: string;
  image?: {
    id: string;
    imageUrl: string;
    caption?: string;
    createdAt: string;
    userId: string;
  };
  imageId?: string;
  timestamp: string;
};

// Subscribe to guestbook tickets updates
export function subscribeToGuestbookUpdates(
  onUpdate: (event: GuestbookRealtimeEvent) => void,
  onPresenceUpdate?: (activeViewers: number) => void
): RealtimeChannel {
  const supabase = createClient();

  const channel = supabase
    .channel('guestbook:tickets')
    .on('broadcast', { event: 'ticket_update' }, ({ payload }) => {
      onUpdate(payload as GuestbookRealtimeEvent);
    })
    .on('presence', { event: 'sync' }, () => {
      if (onPresenceUpdate) {
        const state = channel.presenceState();
        const viewersCount = Object.keys(state).length;
        onPresenceUpdate(viewersCount);
      }
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED' && onPresenceUpdate) {
        const sessionId = await getSessionId();
        await channel.track({ sessionId, joinedAt: new Date().toISOString() });
      }
    });

  return channel;
}

// Subscribe to event updates
export function subscribeToEventUpdates(
  eventId: string,
  onUpdate: (event: EventRealtimeEvent) => void,
  onPresenceUpdate?: (activeViewers: number) => void
): RealtimeChannel {
  const supabase = createClient();

  const channel = supabase
    .channel(`event:${eventId}`)
    .on('broadcast', { event: 'event_update' }, ({ payload }) => {
      onUpdate(payload as EventRealtimeEvent);
    })
    .on('presence', { event: 'sync' }, () => {
      if (onPresenceUpdate) {
        const state = channel.presenceState();
        const viewersCount = Object.keys(state).length;
        onPresenceUpdate(viewersCount);
      }
    })
    .on('presence', { event: 'join' }, () => {
      if (onPresenceUpdate) {
        const state = channel.presenceState();
        const viewersCount = Object.keys(state).length;
        onPresenceUpdate(viewersCount);
      }
    })
    .on('presence', { event: 'leave' }, () => {
      if (onPresenceUpdate) {
        const state = channel.presenceState();
        const viewersCount = Object.keys(state).length;
        onPresenceUpdate(viewersCount);
      }
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        const sessionId = await getSessionId();
        const presenceData = { sessionId, joinedAt: new Date().toISOString() };
        await channel.track(presenceData);
      }
    });

  return channel;
}
