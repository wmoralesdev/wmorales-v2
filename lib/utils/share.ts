import { toast } from 'sonner';

export async function shareTicket(ticketId: string) {
  const shareUrl = `${window.location.origin}/guestbook/${ticketId}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'My Guestbook Ticket',
        text: `Check out my unique ticket on Walter Morales' guestbook!`,
        url: shareUrl,
      });
    } catch {
      // User cancelled share, do nothing
    }
  } else {
    // Fallback to copying to clipboard
    await navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard!');
  }
}
