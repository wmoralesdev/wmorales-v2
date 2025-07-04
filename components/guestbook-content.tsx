'use client';

import { ArrowRight, Palette, Share2, Sparkles, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { createGuestbookEntry, updateGuestbookEntry } from '@/app/actions/guestbook.actions';
import { useAuth } from '@/components/auth/auth-provider';
import { GuestbookLoading } from '@/components/guestbook-loading';
import { SignInCard } from '@/components/sign-in-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { UserTicket } from '@/components/user-ticket';
import { useGuestbookTicketsSWR } from '@/hooks/use-guestbook-tickets-swr';
import { authService } from '@/lib/auth';
import type { TicketData } from '@/lib/types/guestbook.types';
import { shareTicket } from '@/lib/utils/share';

export function GuestbookContent() {
  const { user, loading } = useAuth();
  const [customMessage, setCustomMessage] = useState('');
  const [isGeneratingColors, setIsGeneratingColors] = useState(false);
  const { userTicket, allTickets, isLoadingTickets, updateUserTicket, refreshTickets } = useGuestbookTicketsSWR(user);

  const handleSignIn = async (provider: 'github' | 'google') => {
    try {
      await authService.signInWithProvider(provider, '/guestbook');
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

      // Update tickets using SWR
      updateUserTicket(result.ticket as unknown as TicketData);

      // Refresh all tickets
      await refreshTickets();

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

  const renderRecentTickets = () => {
    return (
      <div className="animate-delay-400 animate-fade-in-up">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center">
            <div className="rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-2">
              <Users className="h-6 w-6 text-purple-400" />
            </div>
          </div>
          <h2 className="mb-2 font-bold text-3xl">Community tickets</h2>
          <p className="text-gray-400">
            {allTickets.length} unique {allTickets.length === 1 ? 'ticket' : 'tickets'} created by our visitors
          </p>
        </div>

        {allTickets.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allTickets.map((ticket, index) => (
              <a
                className="group relative block transform transition-all hover:scale-[1.02]"
                href={`/guestbook/${ticket.id}`}
                key={ticket.id}
              >
                <div className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
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
                  <div className="absolute inset-0 rounded-[32px] bg-white/0 transition-all group-hover:bg-white/5" />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <CardContent className="py-16 text-center">
              <p className="text-gray-400">Be the first to create a ticket!</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  if (loading || isLoadingTickets) {
    return <GuestbookLoading />;
  }

  if (!user) {
    return (
      <div className="space-y-12">
        <div className="mx-auto max-w-4xl animate-delay-400 animate-fade-in-up">
          <SignInCard onSignIn={handleSignIn} />
        </div>
        {renderRecentTickets()}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* User Section */}
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* User Ticket */}
          <div className="animate-fade-in-up">
            {userTicket ? (
              <div className="space-y-4">
                <UserTicket
                  colors={{
                    primary: userTicket.primaryColor,
                    secondary: userTicket.secondaryColor,
                    accent: userTicket.accentColor,
                    background: userTicket.backgroundColor,
                  }}
                  ticketNumber={userTicket.ticketNumber}
                  user={{
                    id: userTicket.id,
                    name: userTicket.userName,
                    email: userTicket.userEmail,
                    avatar_url: userTicket.userAvatar || undefined,
                    provider: userTicket.userProvider,
                  }}
                />
                <div className="flex justify-center">
                  <Button className="gap-2" onClick={handleShareTicket} size="sm" variant="outline">
                    <Share2 className="h-4 w-4" />
                    Share Ticket
                  </Button>
                </div>
              </div>
            ) : (
              <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-12 text-center">
                  <div className="mb-4 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4">
                    <Sparkles className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="mb-2 font-semibold text-xl">No Ticket Yet</h3>
                  <p className="text-gray-400">Create your first ticket by describing your mood</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Generate/Update Form */}
          <div className="animate-delay-200 animate-fade-in-up">
            <Card className="h-full border-gray-800 bg-gray-900/50 backdrop-blur-sm">
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-2">
                    <Palette className="h-5 w-5 text-purple-400" />
                  </div>
                  <h2 className="font-semibold text-xl">{userTicket ? 'Update your ticket' : 'Create your ticket'}</h2>
                </div>
                <p className="text-gray-400 text-sm">
                  {userTicket
                    ? 'Change your mood to regenerate colors'
                    : 'Tell us your mood and get a unique color palette'}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Textarea
                    className="min-h-32 resize-none border-gray-700 bg-gray-800/50 placeholder:text-gray-500"
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Describe your current mood, favorite colors, or what inspires you..."
                    value={customMessage}
                  />
                  <p className="text-gray-500 text-xs">
                    Examples: "Feeling like a sunset over the ocean" or "Energetic and vibrant like a neon city"
                  </p>
                </div>
                <Button
                  className="w-full gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  disabled={!customMessage.trim() || isGeneratingColors}
                  onClick={handleGenerateColors}
                  size="lg"
                >
                  {isGeneratingColors ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-spin" />
                      {userTicket ? 'Updating...' : 'Generating...'}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      {userTicket ? 'Update Ticket' : 'Generate Ticket'}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Recent Tickets Section */}
      {renderRecentTickets()}
    </div>
  );
}
