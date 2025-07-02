import { Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTicketById } from '@/app/actions/guestbook.actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserTicket } from '@/components/user-ticket';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const ticket = await getTicketById(id);

  if (!ticket) {
    return {
      title: 'Ticket Not Found',
    };
  }

  const ogImageUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/og/ticket/${ticket.id}`;

  return {
    title: `${ticket.userName}'s Guestbook Ticket`,
    description: `Check out ${ticket.userName}'s unique ticket on Walter Morales' digital guestbook.`,
    openGraph: {
      title: `${ticket.userName}'s Guestbook Ticket`,
      description: `Check out ${ticket.userName}'s unique ticket on Walter Morales' digital guestbook.`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${ticket.userName}'s Guestbook Ticket`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${ticket.userName}'s Guestbook Ticket`,
      description: `Check out ${ticket.userName}'s unique ticket on Walter Morales' digital guestbook.`,
      images: [ogImageUrl],
    },
  };
}

export default async function TicketPage({ params }: Props) {
  const { id } = await params;
  const ticket = await getTicketById(id);

  if (!ticket) {
    notFound();
  }

  return (
    <div className="min-h-[80vh] py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="mb-4 font-bold text-4xl">Digital Guestbook</h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{ticket.userName}'s unique ticket</p>
          </div>

          {/* Ticket Display */}
          <div className="animate-fade-in-up">
            <UserTicket
              colors={{
                primary: ticket.primaryColor,
                secondary: ticket.secondaryColor,
                accent: ticket.accentColor,
                background: ticket.backgroundColor,
              }}
              ticketNumber={ticket.ticketNumber}
              user={{
                id: ticket.id,
                name: ticket.userName,
                email: ticket.userEmail,
                avatar_url: ticket.userAvatar || undefined,
                provider: ticket.userProvider,
              }}
            />
          </div>

          {/* Mood Display */}
          {ticket.entry.mood && (
            <Card className="mx-auto max-w-md animate-delay-200 animate-fade-in-up">
              <CardContent className="py-6">
                <p className="text-center text-muted-foreground">
                  Mood: <span className="font-medium text-foreground">"{ticket.entry.mood}"</span>
                </p>
              </CardContent>
            </Card>
          )}

          {/* CTA */}
          <div className="animate-delay-400 animate-fade-in-up text-center">
            <Card className="mx-auto max-w-md">
              <CardContent className="py-8">
                <h2 className="mb-4 font-semibold text-xl">Create Your Own Ticket</h2>
                <p className="mb-6 text-muted-foreground">
                  Join the guestbook and get your own unique AI-generated ticket!
                </p>
                <Link href="/guestbook">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate My Ticket
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
