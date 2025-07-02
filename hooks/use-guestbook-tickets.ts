import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getAllTickets, getUserTicket } from '@/app/actions/guestbook.actions';
import type { TicketData } from '@/lib/types/guestbook.types';

export function useGuestbookTickets() {
  const [userTicket, setUserTicket] = useState<TicketData | null>(null);
  const [allTickets, setAllTickets] = useState<TicketData[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);

  useEffect(() => {
    async function loadTickets() {
      try {
        const [userTicketData, allTicketsData] = await Promise.all([getUserTicket(), getAllTickets()]);

        if (userTicketData) {
          setUserTicket(userTicketData as unknown as TicketData);
        }
        setAllTickets(allTicketsData as unknown as TicketData[]);
      } catch {
        toast.error('Failed to load tickets. Please try again.');
      } finally {
        setIsLoadingTickets(false);
      }
    }

    loadTickets();
  }, []);

  return { userTicket, setUserTicket, allTickets, setAllTickets, isLoadingTickets };
}
