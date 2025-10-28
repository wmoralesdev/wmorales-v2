import type { RealtimeChannel } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import type { GuestbookRealtimeEvent } from "@/lib/supabase/realtime";
import { subscribeToGuestbookUpdates } from "@/lib/supabase/realtime";
import type { TicketData } from "@/lib/types/guestbook.types";

export function useGuestbookRealtime(
  initialTickets: TicketData[] = [],
  maxTickets = 25
) {
  const [tickets, setTickets] = useState<TicketData[]>(initialTickets);
  const [activeViewers, setActiveViewers] = useState(0);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  const handleTicketUpdate = useCallback(
    (event: GuestbookRealtimeEvent) => {
      setTickets((prevTickets) => {
        // Convert the ticket data and ensure createdAt is a Date
        const ticketData: TicketData = {
          ...event.ticket,
          createdAt: new Date(event.ticket.createdAt),
          entry: {
            message: null,
            mood: null,
          },
        } as TicketData;

        switch (event.type) {
          case "ticket_created": {
            // Add new ticket to the beginning and limit to maxTickets
            const newTickets = [ticketData, ...prevTickets];
            return newTickets.slice(0, maxTickets);
          }

          case "ticket_updated": {
            // Update existing ticket
            return prevTickets.map((ticket) =>
              ticket.id === ticketData.id ? ticketData : ticket
            );
          }

          case "ticket_deleted": {
            // Remove deleted ticket
            return prevTickets.filter((ticket) => ticket.id !== ticketData.id);
          }

          default:
            return prevTickets;
        }
      });
    },
    [maxTickets]
  );

  const handlePresenceUpdate = useCallback((viewerCount: number) => {
    setActiveViewers(viewerCount);
  }, []);

  useEffect(() => {
    // Subscribe to realtime updates
    const newChannel = subscribeToGuestbookUpdates(
      handleTicketUpdate,
      handlePresenceUpdate
    );

    setChannel(newChannel);

    // Cleanup on unmount
    return () => {
      if (newChannel) {
        newChannel.unsubscribe();
      }
    };
  }, [handleTicketUpdate, handlePresenceUpdate]);

  return {
    tickets,
    activeViewers,
    channel,
  };
}
