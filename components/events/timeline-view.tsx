'use client';

import type { EventImage } from '@prisma/client';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { groupImagesByDate } from './utils';

type TimelineViewProps = {
  images: EventImage[];
  locale: string;
  onImageClick: (image: EventImage, index: number) => void;
};

export function TimelineView({ images, locale, onImageClick }: TimelineViewProps) {
  const t = useTranslations('events');
  const imagesByDate = groupImagesByDate(images, locale);

  if (Object.keys(imagesByDate).length === 0) {
    return (
      <Card className="border-gray-800 bg-gray-900/60">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">{t('noPhotosInTimeline')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {Object.entries(imagesByDate).map(([date, dateImages]) => (
        <div key={date}>
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
            {date}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
            {dateImages.map((image, index) => {
              const globalIndex = images.findIndex((img) => img.id === image.id);
              return (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 0.5) }}
                  className="group relative cursor-pointer"
                  onClick={() => onImageClick(image, globalIndex)}
                >
                  <div className="aspect-square overflow-hidden rounded-lg bg-gray-800">
                    <Image
                      src={image.imageUrl}
                      alt={image.caption || 'Event photo'}
                      width={400}
                      height={400}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1 sm:mt-2">
                    {new Date(image.createdAt).toLocaleTimeString(locale, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}