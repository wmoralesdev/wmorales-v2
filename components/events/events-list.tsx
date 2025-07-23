'use client';

import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Image, Sparkles, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getActiveEvents } from '@/app/actions/events.actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type Event = {
  id: string;
  title: string;
  description: string | null;
  qrCode: string;
  maxImages: number;
  createdAt: Date;
  endsAt: Date | null;
  _count: {
    images: number;
  };
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

export function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const activeEvents = await getActiveEvents();
        setEvents(activeEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: use as skeleton, irrelevant
          <Card className="border-gray-800 bg-gray-900/60 backdrop-blur-xl" key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48 bg-gray-800" />
              <Skeleton className="h-4 w-32 bg-gray-800" />
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-2 h-4 w-full bg-gray-800" />
              <Skeleton className="h-4 w-3/4 bg-gray-800" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-gray-800 bg-gray-900/60 backdrop-blur-xl">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-gray-400">Failed to load events: {error}</p>
            <Button
              className="mt-4 border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card className="border-gray-800 bg-gray-900/60 backdrop-blur-xl">
        <CardContent className="pt-6">
          <div className="text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-purple-400 opacity-50" />
            <p className="font-medium text-lg text-white">No Active Events</p>
            <p className="mt-2 text-gray-400">Check back later for upcoming Cursor events!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div animate="visible" className="space-y-4" initial="hidden" variants={containerVariants}>
      {events.map((event) => (
        <motion.div key={event.id} variants={itemVariants}>
          <Card
            className="group cursor-pointer border-gray-800 bg-gray-900/60 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
            onClick={() => handleEventClick(event.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-white transition-colors group-hover:text-purple-300">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="mt-1 text-gray-400">
                    {event.description || 'Share your photos from this event'}
                  </CardDescription>
                </div>
                <Badge className="ml-2 border-purple-500/30 bg-purple-500/10 text-purple-300" variant="outline">
                  {event._count.images} photos
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-gray-500 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-purple-400" />
                    <span>{formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image className="h-4 w-4 text-purple-400" />
                    <span>Max {event.maxImages} photos</span>
                  </div>
                  {event.endsAt && (
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-4 w-4 text-purple-400" />
                      <span>Ends {formatDistanceToNow(new Date(event.endsAt), { addSuffix: true })}</span>
                    </div>
                  )}
                </div>
                <Button
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 transition-all hover:from-purple-600 hover:to-purple-700 group-hover:shadow-purple-500/40"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEventClick(event.id);
                  }}
                  size="sm"
                >
                  View Gallery
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
