import type { PollRealtimeEvent } from './realtime';
import { createClient } from './server';

// Server-side broadcast function for poll updates
export async function broadcastPollUpdate(pollCode: string, event: PollRealtimeEvent) {
  const supabase = await createClient();

  await supabase.channel(`poll:${pollCode}`).send({
    type: 'broadcast',
    event: 'poll_update',
    payload: event,
  });
}
