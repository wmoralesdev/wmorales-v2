'use client';

import { motion } from 'framer-motion';
import { Eye, Loader2, Trash } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { cn, formatDistanceToNowLocalized } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { useTranslations } from 'next-intl';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ExtendedEventImage } from '@/lib/types/event.types';

type PhotoGridProps = {
  images: ExtendedEventImage[];
  onImageClick: (image: ExtendedEventImage, index: number) => void;
  onImageDelete: (imageId: string) => void | Promise<void>;
  currentProfileId?: string;
  locale: string;
  className?: string;
};

export function PhotoGrid({
  images,
  onImageClick,
  onImageDelete,
  currentProfileId,
  locale,
  className = '',
}: PhotoGridProps) {
  const t = useTranslations('events');
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2',
        className
      )}
    >
      {images.map((image, index) => (
        <motion.div
          key={image.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: Math.min(index * 0.05, 0.5) }}
          className={cn(
            'relative aspect-square bg-gray-900 overflow-hidden cursor-pointer group',
            'rounded-none sm:rounded-lg'
          )}
          onClick={() => onImageClick(image, index)}
        >
          <Image
            src={image.imageUrl}
            alt={image.caption || 'Event photo'}
            fill
            className={cn(
              'object-cover transition-transform duration-300 group-hover:scale-110',
              'bg-white/20'
            )}
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

          {/* Corner overlay for better icon visibility */}
          <div className="absolute inset-0 z-[40]">
            {/* Top-right corner gradient */}
            <div className="absolute inset-0 bg-gradient-to-bl from-black/40 via-transparent to-transparent" />
            {/* Bottom-left corner gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="text-center">
              <Eye className="h-6 w-6 text-white mb-1 mx-auto" />
              <p className="text-xs text-white">
                {formatDistanceToNowLocalized(
                  new Date(image.createdAt),
                  locale
                )}
              </p>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
              {image.caption && (
                <p className="text-white text-xs sm:text-sm truncate">
                  {image.caption}
                </p>
              )}
            </div>
          </div>

          {currentProfileId && currentProfileId === image.profileId && (
            <div
              className={cn(
                'absolute top-2 right-2 size-8 rounded-full bg-red-500 flex items-center justify-center z-50',
                deletingImageId === image.id
                  ? 'cursor-not-allowed opacity-70'
                  : 'cursor-pointer hover:bg-red-600 transition-all duration-300 hover:scale-110'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center justify-center size-8 rounded-full focus:outline-none"
                    aria-label={t('delete')}
                    disabled={deletingImageId === image.id}
                  >
                    {deletingImageId === image.id ? (
                      <Loader2 className="size-4 text-white animate-spin" />
                    ) : (
                      <Trash className="size-4 text-white" />
                    )}
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {t('confirmDeleteImage')}
                    </AlertDialogTitle>
                    <p className="text-sm text-gray-400 mt-2">
                      {t('confirmDeleteImageDescription')}
                    </p>
                  </AlertDialogHeader>
                  <div className="flex justify-end gap-2 mt-4">
                    <AlertDialogCancel asChild>
                      <button
                        type="button"
                        className="px-3 py-1 rounded bg-gray-700 text-white text-sm"
                      >
                        {t('cancel')}
                      </button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <button
                        type="button"
                        className="px-3 py-1 rounded bg-red-600 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={deletingImageId === image.id}
                        onClick={async () => {
                          setDeletingImageId(image.id);
                          try {
                            await onImageDelete(image.id);
                          } finally {
                            setDeletingImageId(null);
                          }
                        }}
                      >
                        {deletingImageId === image.id ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="size-3 animate-spin" />
                            {t('deleting')}
                          </span>
                        ) : (
                          t('delete')
                        )}
                      </button>
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
          <div className="absolute bottom-2 left-2 size-8 rounded-full bg-red-500 flex items-center justify-center z-50">
            <Avatar>
              <AvatarImage src={image.profile?.avatar} />
              <AvatarFallback>{image.profile?.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
