import useSWR from 'swr';
import { getAllTickets, getUserTicket } from '@/app/actions/guestbook.actions';
import type { AuthUser } from '@/lib/auth';
import type { TicketData } from '@/lib/types/guestbook.types';

// Fetcher function for all tickets
const fetchAllTickets = async () => {
  const tickets = await getAllTickets();
  return tickets as unknown as TicketData[];
};

// Fetcher function for user ticket
const fetchUserTicket = async (userId: string | undefined) => {
  if (!userId) return null;
  const ticket = await getUserTicket();
  return ticket as unknown as TicketData | null;
};

export function useGuestbookTicketsSWR(user: AuthUser | null) {
  // Fetch all tickets
  const {
    data: allTickets = [],
    error: allTicketsError,
    mutate: mutateAllTickets,
  } = useSWR('guestbook-tickets-all', fetchAllTickets, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  // Fetch user's ticket
  const {
    data: userTicket = null,
    error: userTicketError,
    mutate: mutateUserTicket,
  } = useSWR(user ? `guestbook-ticket-${user.id}` : null, () => fetchUserTicket(user?.id), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  // Combined loading state
  const isLoadingTickets = !allTickets && !allTicketsError;
  const isLoadingUserTicket = user && !userTicket && !userTicketError;

  // Function to refresh both tickets
  const refreshTickets = async () => {
    await Promise.all([mutateAllTickets(), mutateUserTicket()]);
  };

  // Function to update user ticket optimistically
  const updateUserTicket = (newTicket: TicketData) => {
    // Update user ticket
    mutateUserTicket(newTicket, false);
    
    // Update in all tickets list
    mutateAllTickets((tickets?: TicketData[]) => {
      if (!tickets) return [newTicket];
      const index = tickets.findIndex((t: TicketData) => t.userEmail === newTicket.userEmail);
      if (index >= 0) {
        const updated = [...tickets];
        updated[index] = newTicket;
        return updated;
      }
      return [newTicket, ...tickets];
    }, false);
  };

  return {
    allTickets,
    userTicket,
    isLoadingTickets: isLoadingTickets || isLoadingUserTicket,
    error: allTicketsError || userTicketError,
    refreshTickets,
    updateUserTicket,
    mutateAllTickets,
    mutateUserTicket,
  };
}