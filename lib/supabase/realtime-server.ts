import "server-only";
import type {
  EventRealtimeEvent,
  GuestbookRealtimeEvent,
  PollRealtimeEvent,
} from "./realtime";
import { createClient } from "./server";

// Server-side broadcast function for poll updates
export async function broadcastPollUpdate(
  pollCode: string,
  event: PollRealtimeEvent
) {
  const supabase = await createClient();

  const channel = supabase.channel(`poll:${pollCode}`);

  // Subscribe first, then send when ready
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Channel subscription timeout"));
    }, 5000);

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        clearTimeout(timeout);

        // Send the broadcast message
        channel
          .send({
            type: "broadcast",
            event: "poll_update",
            payload: event,
          })
          .then(() => {
            // Clean up after a short delay to ensure message is sent
            setTimeout(() => {
              supabase.removeChannel(channel);
            }, 100);
            resolve();
          })
          .catch(reject);
      } else if (
        status === "CHANNEL_ERROR" ||
        status === "TIMED_OUT" ||
        status === "CLOSED"
      ) {
        clearTimeout(timeout);
        reject(new Error(`Channel subscription failed: ${status}`));
      }
    });
  });
}

// Server-side broadcast for guestbook ticket updates
export async function broadcastGuestbookUpdate(event: GuestbookRealtimeEvent) {
  const supabase = await createClient();

  const channel = supabase.channel("guestbook:tickets");

  // Subscribe first, then send when ready
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Channel subscription timeout"));
    }, 5000);

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        clearTimeout(timeout);

        // Send the broadcast message
        channel
          .send({
            type: "broadcast",
            event: "ticket_update",
            payload: event,
          })
          .then(() => {
            // Clean up after a short delay to ensure message is sent
            setTimeout(() => {
              supabase.removeChannel(channel);
            }, 100);
            resolve();
          })
          .catch(reject);
      } else if (
        status === "CHANNEL_ERROR" ||
        status === "TIMED_OUT" ||
        status === "CLOSED"
      ) {
        clearTimeout(timeout);
        reject(new Error(`Channel subscription failed: ${status}`));
      }
    });
  });
}

// Server-side broadcast for event updates
export async function broadcastEventUpdate(event: EventRealtimeEvent) {
  const supabase = await createClient();

  const channel = supabase.channel(`event:${event.eventId}`);

  // Subscribe first, then send when ready
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Channel subscription timeout"));
    }, 5000);

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        clearTimeout(timeout);

        // Send the broadcast message
        channel
          .send({
            type: "broadcast",
            event: "event_update",
            payload: event,
          })
          .then(() => {
            // Clean up after a short delay to ensure message is sent
            setTimeout(() => {
              supabase.removeChannel(channel);
            }, 100);
            resolve();
          })
          .catch(reject);
      } else if (
        status === "CHANNEL_ERROR" ||
        status === "TIMED_OUT" ||
        status === "CLOSED"
      ) {
        clearTimeout(timeout);
        reject(new Error(`Channel subscription failed: ${status}`));
      }
    });
  });
}
