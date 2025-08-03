'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useTransition } from 'react';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import {
  deleteEventImage,
  uploadEventImage,
} from '@/app/actions/events.actions';
import { useUserEventImages } from '@/hooks/use-user-event-images';
import type { EventGalleryProps, UserEventImage } from './types';
import { isEventEnded } from './utils';

// Import the new components dynamically
const LiveEventView = dynamic(
  () => import('./live-event-view').then((mod) => mod.LiveEventView),
  {
    ssr: false,
  }
);

export function EventGallery({
  event,
  initialUserImages = [],
}: EventGalleryProps) {
  const t = useTranslations('events');
  const [, startTransition] = useTransition();

  // Use SWR hook for better data fetching with server-provided fallback
  const { userImages, optimisticAdd, optimisticRemove } = useUserEventImages(
    event.id,
    { fallbackData: initialUserImages }
  );

  const handleImageUpload = useCallback(
    async (imageUrl: string, caption?: string) => {
      // Generate a temporary ID for the optimistic update
      const tempId = `temp-${Date.now()}`;
      const optimisticImage: UserEventImage = {
        id: tempId,
        eventId: event.id,
        userId: 'current-user', // This will be replaced by the server
        imageUrl,
        caption,
        createdAt: new Date(),
      };

      // Optimistically add the image
      optimisticAdd(optimisticImage);

      try {
        const result = await uploadEventImage({
          slug: event.slug,
          imageUrl,
          caption,
        });

        // Replace the optimistic update with the real data
        optimisticRemove(tempId);
        optimisticAdd({
          ...result,
          caption: result.caption || undefined,
          createdAt: new Date(result.createdAt),
        });

        toast.success(t('photoUploadedSuccessfully'));
      } catch (error) {
        // Remove optimistic update on error
        optimisticRemove(optimisticImage.id);

        const message =
          error instanceof Error ? error.message : t('failedToUploadPhoto');
        toast.error(message);
      }
    },
    [event.id, event.slug, t, optimisticAdd, optimisticRemove]
  );

  const handleImageDelete = useCallback(
    (imageId: string) => {
      // Find the image for potential rollback
      const imageToDelete = userImages.find((img) => img.id === imageId);

      if (!imageToDelete) {
        return;
      }

      try {
        // Optimistic removal
        optimisticRemove(imageId);

        // Perform server action
        startTransition(() => {
          deleteEventImage(imageId)
            .then(() => {
              toast.success(t('photoDeletedSuccessfully'));
            })
            .catch((error) => {
              // Rollback optimistic update on error
              optimisticAdd(imageToDelete);

              const message =
                error instanceof Error
                  ? error.message
                  : t('failedToDeletePhoto');
              toast.error(message);
            });
        });
      } catch (error) {
        // Rollback optimistic update on error
        optimisticAdd(imageToDelete);

        const message =
          error instanceof Error ? error.message : t('failedToDeletePhoto');
        toast.error(message);
      }
    },
    [t, userImages, optimisticRemove, optimisticAdd]
  );

  // Check if event has ended
  const hasEnded = isEventEnded(event.endsAt);

  // If event has ended, redirect to the gallery page
  if (hasEnded || !event.isActive) {
    if (typeof window !== 'undefined') {
      window.location.href = `/events/${event.slug}/gallery`;
    }
    return null;
  }

  // Otherwise, show live event view
  return (
    <LiveEventView
      event={{
        ...event,
      }}
      onImageUpload={handleImageUpload}
      onImageDelete={handleImageDelete}
    />
  );
}
