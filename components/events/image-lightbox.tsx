'use client';

import type { EventImage } from '@prisma/client';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { formatDistanceToNowLocalized } from '@/lib/utils';

type ExtendedEventImage = EventImage & {
  user?: {
    name?: string | null;
  };
};

type ImageLightboxProps = {
  selectedImage: ExtendedEventImage | null;
  onClose: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
  locale: string;
  showNavigation?: boolean;
};

export function ImageLightbox({
  selectedImage,
  onClose,
  onNavigate,
  locale,
  showNavigation = true,
}: ImageLightboxProps) {
  const t = useTranslations('events');

  return (
    <Dialog open={!!selectedImage} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl sm:max-w-screen-lg border-gray-800 bg-gray-900/95 backdrop-blur-xl p-0 h-screen sm:h-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 text-white/70 hover:text-white bg-black/50 rounded-full p-2"
        >
          <X className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {selectedImage && (
          <div className="relative h-full flex items-center justify-center">
            <Image
              src={selectedImage.imageUrl}
              alt={selectedImage.caption || 'Event photo'}
              width={1200}
              height={800}
              className="object-contain w-full h-full max-h-[85vh] sm:max-h-[90vh]"
              sizes="90vw"
            />

            {showNavigation && onNavigate && (
              <>
                <button
                  onClick={() => onNavigate('prev')}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 rounded-full p-1.5 sm:p-2"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>

                <button
                  onClick={() => onNavigate('next')}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 rounded-full p-1.5 sm:p-2"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </>
            )}

            {selectedImage.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6">
                <p className="text-white text-sm sm:text-base">
                  {selectedImage.caption}
                </p>
                {selectedImage.user?.name && (
                  <p className="text-gray-400 text-sm mt-2">
                    {t('by')} {selectedImage.user.name} •{' '}
                    {formatDistanceToNowLocalized(
                      new Date(selectedImage.createdAt),
                      locale
                    )}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}