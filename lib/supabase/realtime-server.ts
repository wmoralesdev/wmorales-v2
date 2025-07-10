import 'server-only';
import type { PollRealtimeEvent } from './realtime';
import type { GuestbookRealtimeEvent } from './realtime';
import type { EventRealtimeEvent } from './realtime';
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

// Server-side broadcast for guestbook ticket updates
export async function broadcastGuestbookUpdate(event: GuestbookRealtimeEvent) {
  const supabase = await createClient();

  const channel = supabase.channel('guestbook:tickets');

  await channel.send({
    type: 'broadcast',
    event: 'ticket_update',
    payload: event,
  });

  await supabase.removeChannel(channel);
}

// Server-side broadcast for event updates
export async function broadcastEventUpdate(event: EventRealtimeEvent) {
  const supabase = await createClient();

  const channel = supabase.channel(`event:${event.eventId}`);

  await channel.send({
    type: 'broadcast',
    event: 'event_update',
    payload: event,
  });

  await supabase.removeChannel(channel);
}
