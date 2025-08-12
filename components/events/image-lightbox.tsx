'use client';

import type { EventImage } from '@prisma/client';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { formatDistanceToNowLocalized } from '@/lib/utils';

type ExtendedEventImage = EventImage & {
  user?: {
    name?: string | null;
  };
};

type ImageLightboxProps = {
  selectedImage: ExtendedEventImage | null;
  onClose: () => void;
  locale: string;
};

export function ImageLightbox({
  selectedImage,
  onClose,
  locale,
}: ImageLightboxProps) {
  const t = useTranslations('events');

  return (
    <Dialog open={!!selectedImage} onOpenChange={() => onClose()}>
      <DialogTitle>{selectedImage?.caption}</DialogTitle>
      <DialogContent className="max-w-4xl sm:max-w-screen-lg border-gray-800 bg-gray-900/95 backdrop-blur-xl p-0 h-screen sm:h-auto">
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
