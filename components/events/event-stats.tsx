'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { cn, formatDistanceToNowLocalized } from '@/lib/utils';
import type { EventStatsData } from './types';

type EventStatsProps = {
  stats: EventStatsData;
  locale: string;
  variant?: 'live' | 'post';
  className?: string;
};

export function EventStats({
  stats,
  locale,
  variant = 'live',
  className = '',
}: EventStatsProps) {
  const t = useTranslations('events');

  if (variant === 'live') {
    return (
      <Card
        className={cn(
          'border-0 sm:border border-gray-800 bg-gray-900/80 backdrop-blur-xl rounded-none sm:rounded-lg shadow-none sm:shadow-md border-t sm:border-t-0',
          className
        )}
      >
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">
                {stats.totalPhotos}
              </p>
              <p className="text-sm text-gray-400">{t('totalPhotos')}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-400">
                {stats.contributors}
              </p>
              <p className="text-sm text-gray-400">{t('contributors')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Post-event variant with 3 columns
  return (
    <div className={`grid grid-cols-3 gap-2 sm:gap-4 ${className}`}>
      <div className="text-center p-2 sm:p-3 rounded-lg bg-gray-800/50">
        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
          {stats.totalPhotos}
        </p>
        <p className="text-xs sm:text-sm text-gray-400">{t('totalPhotos')}</p>
      </div>
      <div className="text-center p-2 sm:p-3 rounded-lg bg-gray-800/50">
        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
          {stats.contributors}
        </p>
        <p className="text-xs sm:text-sm text-gray-400">{t('contributors')}</p>
      </div>
      <div className="text-center p-2 sm:p-3 rounded-lg bg-gray-800/50">
        <p className="text-xs sm:text-sm lg:text-base font-bold text-white">
          {formatDistanceToNowLocalized(
            stats.eventDate || stats.createdAt,
            locale,
            {
              addSuffix: true,
            }
          )}
        </p>
        <p className="text-xs sm:text-sm text-gray-400">{t('eventDate')}</p>
      </div>
    </div>
  );
}
