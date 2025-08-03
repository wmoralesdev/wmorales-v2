'use client';

import type { EventImage } from '@prisma/client';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Pause,
  Play,
} from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type SlideshowViewProps = {
  images: EventImage[];
  currentIndex: number;
  isPlaying: boolean;
  onNavigate: (direction: 'prev' | 'next') => void;
  onPlayPauseToggle: () => void;
};

export function SlideshowView({
  images,
  currentIndex,
  isPlaying,
  onNavigate,
  onPlayPauseToggle,
}: SlideshowViewProps) {
  const t = useTranslations('events');

  if (images.length === 0) {
    return (
      <Card className="border-gray-800 bg-gray-900/60">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">{t('noPhotosForSlideshow')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-800 bg-gray-900/80">
      <CardContent className="p-0">
        <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9] bg-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={images[currentIndex].imageUrl}
                alt={images[currentIndex].caption || 'Event photo'}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
                <Button
                  onClick={() => onNavigate('prev')}
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button
                  onClick={onPlayPauseToggle}
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </Button>
                <Button
                  onClick={() => onNavigate('next')}
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10"
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>

              <div className="text-white text-xs sm:text-sm">
                {currentIndex + 1} / {images.length}
              </div>
            </div>

            {images[currentIndex].caption && (
              <p className="text-white mt-2 sm:mt-3 lg:mt-4 text-xs sm:text-sm lg:text-base line-clamp-2">
                {images[currentIndex].caption}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
