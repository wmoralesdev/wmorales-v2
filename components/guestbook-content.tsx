'use client';

import { Palette, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { createGuestbookEntry, getAllTickets, getUserTicket } from '@/app/actions/guestbook.actions';
import { authService } from '@/lib/auth';
import { useAuth } from '@/components/auth/auth-provider';
import { SignInCard } from '@/components/sign-in-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { UserTicket } from '@/components/user-ticket';

type TicketData = {
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
  createdAt: Date;
  entry: {
    message: string | null;
    mood: string | null;
  };
};

export function GuestbookContent() {
  const { user, loading } = useAuth();
  const [customMessage, setCustomMessage] = useState('');
  const [isGeneratingColors, setIsGeneratingColors] = useState(false);
  const [userTicket, setUserTicket] = useState<TicketData | null>(null);
  const [allTickets, setAllTickets] = useState<TicketData[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);

  // Load user ticket and all tickets
  useEffect(() => {
    async function loadTickets() {
      try {
        const [userTicketData, allTicketsData] = await Promise.all([
          getUserTicket(),
          getAllTickets(),
        ]);
        
        if (userTicketData) {
          setUserTicket(userTicketData as unknown as TicketData);
        }
        setAllTickets(allTicketsData as unknown as TicketData[]);
      } catch (error) {
        console.error('Failed to load tickets:', error);
      } finally {
        setIsLoadingTickets(false);
      }
    }

    loadTickets();
  }, [user]);

  const handleSignIn = async (provider: 'github' | 'google') => {
    try {
      await authService.signInWithProvider(provider);
    } catch (error) {
      toast.error('Failed to sign in. Please try again.');
      console.error('Sign in error:', error);
    }
  };

  const handleGenerateColors = async () => {
    if (!customMessage.trim()) {
      toast.error('Please describe your mood or style first');
      return;
    }

    setIsGeneratingColors(true);
    try {
      const result = await createGuestbookEntry(customMessage);
      setUserTicket(result.ticket as unknown as TicketData);
      
      // Refresh all tickets
      const updatedTickets = await getAllTickets();
      setAllTickets(updatedTickets as unknown as TicketData[]);
      
      toast.success('Your unique ticket has been created!');
      setCustomMessage('');
    } catch (error) {
      toast.error('Failed to generate ticket. Please try again.');
      console.error('Generation error:', error);
    } finally {
      setIsGeneratingColors(false);
    }
  };

  if (loading || isLoadingTickets) {
    return (
      <div className="animate-fade-in-up space-y-8">
        <Card className="mx-auto max-w-md">
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <Sparkles className="h-8 w-8 animate-pulse text-purple-400" />
            </div>
            <p className="mt-4 text-center text-muted-foreground">Loading guestbook...</p>
          </CardContent>
        </Card>
      </div>
    );
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
      {/* User Ticket or Generation Form */}
      {userTicket ? (
        <div className="animate-delay-400 animate-fade-in-up">
          <UserTicket
            user={{
              id: userTicket.id,
              name: userTicket.userName,
              email: userTicket.userEmail,
              avatar_url: userTicket.userAvatar || undefined,
              provider: userTicket.userProvider,
            }}
            colors={{
              primary: userTicket.primaryColor,
              secondary: userTicket.secondaryColor,
              accent: userTicket.accentColor,
              background: userTicket.backgroundColor,
            }}
            ticketNumber={userTicket.ticketNumber}
          />
          {userTicket.entry.message && (
            <Card className="mx-auto mt-4 max-w-md">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground text-sm">
                  Your mood: "{userTicket.entry.mood}"
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="animate-delay-400 animate-fade-in-up">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Create Your Unique Ticket
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                Describe your mood, style, or anything that inspires you. Our AI will generate a unique color palette for
                your ticket.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                className="min-h-24 resize-none"
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Tell the AI about your style... (e.g., 'I love sunset colors and ocean vibes' or 'Make it dark and mysterious like a cyberpunk city')"
                value={customMessage}
              />
              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 sm:w-auto"
                disabled={!customMessage.trim() || isGeneratingColors}
                onClick={handleGenerateColors}
              >
                {isGeneratingColors ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Generating Your Ticket...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate My Ticket
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

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
                  <div key={ticket.id} className="transform transition-transform hover:scale-105">
                                         <UserTicket
                      user={{
                        id: ticket.id,
                        name: ticket.userName,
                        email: ticket.userEmail,
                        avatar_url: ticket.userAvatar || undefined,
                        provider: ticket.userProvider,
                      }}
                      colors={{
                        primary: ticket.primaryColor,
                        secondary: ticket.secondaryColor,
                        accent: ticket.accentColor,
                        background: ticket.backgroundColor,
                      }}
                      ticketNumber={ticket.ticketNumber}
                      scale="small"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground">
                Be the first to create a ticket!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
