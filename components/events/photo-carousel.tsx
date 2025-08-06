'use client';

import type { EventImage } from '@prisma/client';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type PhotoCarouselProps = {
  images: EventImage[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  className?: string;
};

export function PhotoCarousel({
  images,
  currentIndex,
  onIndexChange,
  className = '',
}: PhotoCarouselProps) {
  if (images.length === 0) return null;

  return (
    <div
      className={`relative aspect-[16/9] bg-gray-800 rounded-lg overflow-hidden ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex]?.imageUrl}
            alt={images[currentIndex]?.caption || 'Event photo'}
            fill
            className="object-contain bg-white/10"
            sizes="(max-width: 768px) 100vw, 66vw"
          />
          {images[currentIndex]?.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-white text-sm line-clamp-2">
                {images[currentIndex]?.caption}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Photo indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
        {images.slice(0, 10).map((_, index) => (
          <button
            key={index}
            onClick={() => onIndexChange(index)}
            className={cn(
              'h-2 w-2 rounded-full transition-all',
              index === currentIndex
                ? 'bg-white w-6'
                : 'bg-white/50 hover:bg-white/70'
            )}
            aria-label={`Go to photo ${index + 1}`}
          />
        ))}
        {images.length > 10 && (
          <span className="text-white/50 text-xs ml-2">
            +{images.length - 10}
          </span>
        )}
      </div>
    </div>
  );
}
