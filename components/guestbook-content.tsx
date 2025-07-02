'use client';

import { Palette, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { createGuestbookEntry, getAllTickets, updateGuestbookEntry } from '@/app/actions/guestbook.actions';
import { useAuth } from '@/components/auth/auth-provider';
import { GuestbookLoading } from '@/components/guestbook-loading';
import { GuestbookUserTicket } from '@/components/guestbook-user-ticket';
import { SignInCard } from '@/components/sign-in-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { UserTicket } from '@/components/user-ticket';
import { useGuestbookTickets } from '@/hooks/use-guestbook-tickets';
import { authService } from '@/lib/auth';
import type { TicketData } from '@/lib/types/guestbook.types';
import { shareTicket } from '@/lib/utils/share';

export function GuestbookContent() {
  const { user, loading } = useAuth();
  const [customMessage, setCustomMessage] = useState('');
  const [isGeneratingColors, setIsGeneratingColors] = useState(false);
  const { userTicket, setUserTicket, allTickets, setAllTickets, isLoadingTickets } = useGuestbookTickets();

  const handleSignIn = async (provider: 'github' | 'google') => {
    try {
      await authService.signInWithProvider(provider);
    } catch {
      toast.error('Failed to sign in. Please try again.');
    }
  };

  const handleGenerateColors = async () => {
    if (!customMessage.trim()) {
      toast.error('Please describe your mood or style first');
      return;
    }

    setIsGeneratingColors(true);
    try {
      const result = userTicket ? await updateGuestbookEntry(customMessage) : await createGuestbookEntry(customMessage);

      toast.success(userTicket ? 'Your ticket has been updated!' : 'Your unique ticket has been created!');
      setUserTicket(result.ticket as unknown as TicketData);

      // Refresh all tickets
      const updatedTickets = await getAllTickets();
      setAllTickets(updatedTickets as unknown as TicketData[]);

      setCustomMessage('');
    } catch {
      toast.error('Failed to generate ticket. Please try again.');
    } finally {
      setIsGeneratingColors(false);
    }
  };

  const handleShareTicket = async () => {
    if (userTicket) {
      await shareTicket(userTicket.id);
    }
  };

  if (loading || isLoadingTickets) {
    return <GuestbookLoading />;
  }

  if (!user) {
    return (
      <div className="animate-delay-400 animate-fade-in-up">
        <SignInCard onSignIn={handleSignIn} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* User Ticket */}
      <div className="flex w-full flex-col items-center gap-4 lg:flex-row lg:items-start lg:justify-center">
        {userTicket && <GuestbookUserTicket onShare={handleShareTicket} userTicket={userTicket} />}

        {/* Chat Input (always visible) */}
        <div className="flex-1 animate-delay-400 animate-fade-in-up">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                {userTicket ? 'Update Your Ticket' : 'Create Your Unique Ticket'}
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                {userTicket
                  ? 'Change your mood to generate new colors for your ticket.'
                  : 'Describe your mood, style, or anything that inspires you. Our AI will generate a unique color palette for your ticket.'}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                className="min-h-24 resize-none"
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Tell the AI about your style... (e.g., 'I love sunset colors and ocean vibes'"
                value={customMessage}
              />
              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 sm:w-auto"
                disabled={!customMessage.trim() || isGeneratingColors}
                onClick={handleGenerateColors}
              >
                {isGeneratingColors ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    {userTicket ? 'Updating your ticket...' : 'Generating your ticket...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {userTicket ? 'Update my ticket' : 'Generate my ticket'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* All Tickets Section */}
      <div className="animate-delay-600 animate-fade-in-up">
        <Card>
          <CardHeader>
            <CardTitle>Recent Tickets</CardTitle>
            <p className="text-muted-foreground text-sm">
              {allTickets.length} unique {allTickets.length === 1 ? 'ticket' : 'tickets'} created
            </p>
          </CardHeader>
          <CardContent>
            {allTickets.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {allTickets.map((ticket) => (
                  <a
                    className="group block transform transition-all hover:scale-105"
                    href={`/guestbook/${ticket.id}`}
                    key={ticket.id}
                  >
                    <div className="relative">
                      <UserTicket
                        colors={{
                          primary: ticket.primaryColor,
                          secondary: ticket.secondaryColor,
                          accent: ticket.accentColor,
                          background: ticket.backgroundColor,
                        }}
                        scale="small"
                        ticketNumber={ticket.ticketNumber}
                        user={{
                          id: ticket.id,
                          name: ticket.userName,
                          email: ticket.userEmail,
                          avatar_url: ticket.userAvatar || undefined,
                          provider: ticket.userProvider,
                        }}
                      />
                      <div className="absolute inset-0 rounded-2xl bg-white/0 transition-colors group-hover:bg-white/5" />
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground">Be the first to create a ticket!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
