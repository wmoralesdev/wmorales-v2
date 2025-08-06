'use client';

import type { Event, EventContent, EventImage } from '@prisma/client';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Calendar, Image, Sparkles, Users } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNowLocalized } from '@/lib/utils';
import Link from 'next/link';

export type EventWithContent = Event & {
  content: EventContent[];
  images: EventImage[];
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
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

export function EventsList({ events }: { events: EventWithContent[] }) {
  const t = useTranslations('events');
  const locale = useLocale();

  if (events.length === 0) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: use as skeleton, irrelevant
          <Card
            className="border-gray-800 bg-gray-900/60 backdrop-blur-xl"
            key={i}
          >
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

  if (events.length === 0) {
    return (
      <Card className="border-gray-800 bg-gray-900/60 backdrop-blur-xl">
        <CardContent className="pt-6">
          <div className="text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-purple-400 opacity-50" />
            <p className="font-medium text-lg text-white">
              {t('noActiveEvents')}
            </p>
            <p className="mt-2 text-gray-400">{t('checkBackLater')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      animate="visible"
      className="space-y-0 sm:space-y-4"
      initial="hidden"
      variants={containerVariants}
    >
      {events.map((event) => (
        <motion.div key={event.id} variants={itemVariants}>
          <Link href={`/events/${event.slug}`}>
            <Card className="group cursor-pointer border-0 sm:border border-gray-800 bg-gray-900/60 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 rounded-none sm:rounded-lg shadow-none sm:shadow-md border-b">
              <CardHeader className="p-4 sm:px-6 md:py-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <CardTitle className="text-base sm:text-lg text-white transition-colors group-hover:text-purple-300">
                      {event.content[0].title}
                    </CardTitle>
                    <CardDescription className="mt-1 text-sm text-gray-400">
                      {event.content[0].description || t('sharePhotos')}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {event.endsAt && new Date() > event.endsAt ? (
                      <Badge
                        className="border-gray-500/30 bg-gray-500/10 text-gray-300 text-xs"
                        variant="outline"
                      >
                        {t('ended')}
                      </Badge>
                    ) : (
                      <Badge
                        className="border-green-500/30 bg-green-500/10 text-green-300 text-xs"
                        variant="outline"
                      >
                        <span className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse mr-1" />
                        LIVE
                      </Badge>
                    )}
                    <Badge
                      className="border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs"
                      variant="outline"
                    >
                      {t('photosCount', { count: event.images?.length ?? 0 })}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:px-6 pt-0 sm:pt-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3 text-gray-500 text-xs sm:text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                      <span>
                        {formatDistanceToNowLocalized(
                          new Date(event.createdAt),
                          locale,
                          {
                            addSuffix: true,
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {/* eslint-disable-next-line jsx-a11y/alt-text */}
                      <Image className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                      <span>{t('maxPhotos', { count: event.maxImages })}</span>
                    </div>
                    {event.endsAt && new Date() < event.endsAt && (
                      <div className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                        <span>
                          {t('endsIn', {
                            time: formatDistanceToNowLocalized(
                              new Date(event.endsAt),
                              locale,
                              {
                                addSuffix: true,
                              }
                            ),
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 transition-all hover:from-purple-600 hover:to-purple-700 group-hover:shadow-purple-500/40 w-full sm:w-auto"
                    size="sm"
                  >
                    {t('viewGallery')}
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
