import type { RealtimeChannel } from '@supabase/supabase-js';
import { createClient } from './client';

export type PollRealtimeEvent = {
  type: 'vote_added' | 'vote_removed' | 'poll_closed';
  pollId: string;
  questionId?: string;
  optionId?: string;
  voteCount?: number;
  timestamp: string;
};

export function subscribeToPollUpdates(
  pollCode: string,
  onUpdate: (event: PollRealtimeEvent) => void
): RealtimeChannel {
  const supabase = createClient();

  const channel = supabase
    .channel(`poll:${pollCode}`)
    .on('broadcast', { event: 'poll_update' }, ({ payload }) => {
      onUpdate(payload as PollRealtimeEvent);
    })
    .subscribe();

  return channel;
}

export async function broadcastPollUpdate(pollCode: string, event: PollRealtimeEvent) {
  const supabase = createClient();

  await supabase.channel(`poll:${pollCode}`).send({
    type: 'broadcast',
    event: 'poll_update',
    payload: event,
  });
}
