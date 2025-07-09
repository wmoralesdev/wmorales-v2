'use client';

import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { UserTicket } from '@/components/guestbook/user-ticket';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useGuestbookRealtime } from '@/hooks/use-guestbook-realtime';
import type { TicketData } from '@/lib/types/guestbook.types';

interface GuestbookTicketsCarouselProps {
  initialTickets?: TicketData[];
  maxTickets?: number;
}

export function GuestbookTicketsCarousel({ initialTickets = [], maxTickets = 25 }: GuestbookTicketsCarouselProps) {
  const { tickets, activeViewers } = useGuestbookRealtime(initialTickets, maxTickets);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (tickets.length === 0) {
    return (
      <div className="animate-fade-in-up">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center">
            <div className="rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-2">
              <Users className="h-6 w-6 text-purple-400" />
            </div>
          </div>
          <h2 className="mb-2 font-bold text-3xl">Community tickets</h2>
          <p className="text-gray-400">Be the first to create a ticket!</p>
        </div>
        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <CardContent className="py-16 text-center">
            <p className="text-gray-400">No tickets yet. Sign in to create the first one!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          {tickets.length} unique {tickets.length === 1 ? 'ticket' : 'tickets'} created by our visitors
        </p>
        {activeViewers > 0 && (
          <p className="mt-1 text-gray-500 text-sm">
            <span className="mr-1 inline-block h-2 w-2 animate-pulse rounded-full bg-green-500" />
            {activeViewers} {activeViewers === 1 ? 'person' : 'people'} viewing now
          </p>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-8">
        <Carousel
          className="w-full"
          opts={{
            align: 'start',
            loop: true,
          }}
          setApi={setApi}
        >
          <CarouselContent className="-ml-4">
            {tickets.map((ticket, index) => (
              <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3" key={ticket.id}>
                <a
                  className="group relative block transform transition-all hover:scale-[1.02]"
                  href={`/guestbook/${ticket.id}`}
                >
                  <div className="animate-fade-in-up" style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}>
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
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-6 flex items-center justify-center gap-2">
            <CarouselPrevious className="relative inset-0 translate-x-0 translate-y-0" />
            <div className="flex items-center gap-1 px-4">
              {count > 0 && (
                <span className="text-gray-400 text-sm">
                  {current} / {count}
                </span>
              )}
            </div>
            <CarouselNext className="relative inset-0 translate-x-0 translate-y-0" />
          </div>
        </Carousel>
      </div>
    </div>
  );
}
