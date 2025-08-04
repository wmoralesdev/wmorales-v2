'use client';

import { useCallback, useRef } from 'react';
import useSWR, { type KeyedMutator } from 'swr';
import { getUserEventImages } from '@/app/actions/events.actions';

type EventImage = {
  id: string;
  eventId: string;
  profileId: string;
  imageUrl: string;
  caption?: string;
  createdAt: Date;
};

type UseUserEventImagesOptions = {
  fallbackData?: EventImage[];
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
};

export function useUserEventImages(
  eventId: string,
  options: UseUserEventImagesOptions = {}
) {
  const {
    fallbackData = [],
    revalidateOnFocus = true,
    revalidateOnReconnect = true,
  } = options;

  // Use a ref to track the mutate function for external access
  const mutateRef = useRef<KeyedMutator<EventImage[]>>(null);

  const {
    data: userImages,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR(
    eventId ? ['user-event-images', eventId] : null,
    async ([, id]: [string, string]): Promise<EventImage[]> => {
      const images = await getUserEventImages(id);
      return images.map(
        (img): EventImage => ({
          id: img.id,
          eventId: img.eventId,
          profileId: img.profileId,
          imageUrl: img.imageUrl,
          caption: img.caption || undefined,
          createdAt: new Date(img.createdAt),
        })
      );
    },
    {
      fallbackData,
      revalidateOnFocus,
      revalidateOnReconnect,
      // Revalidate every 30 seconds for real-time sync
      refreshInterval: 30_000,
      // Don't revalidate if data is less than 5 seconds old
      dedupingInterval: 5000,
      // Keep previous data while revalidating
      keepPreviousData: true,
    }
  );

  // Store mutate function in ref for external access
  mutateRef.current = mutate;

  // Optimistic add function
  const optimisticAdd = useCallback(
    (newImage: EventImage) => {
      mutate((current = []) => [newImage, ...current], {
        revalidate: false,
        populateCache: true,
      });
    },
    [mutate]
  );

  // Optimistic remove function
  const optimisticRemove = useCallback(
    (imageId: string) => {
      mutate((current = []) => current.filter((img) => img.id !== imageId), {
        revalidate: false,
        populateCache: true,
      });
    },
    [mutate]
  );

  // Sync with real-time updates
  const syncUpdate = useCallback(
    (update: {
      type: 'add' | 'remove';
      image?: EventImage;
      imageId?: string;
    }) => {
      if (update.type === 'add' && update.image) {
        mutate(
          (current = []) => {
            // Avoid duplicates
            if (
              update.image &&
              current.some((img) => img.id === update.image!.id)
            ) {
              return current;
            }
            return update.image ? [update.image, ...current] : current;
          },
          {
            revalidate: false,
            populateCache: true,
          }
        );
      } else if (update.type === 'remove' && update.imageId) {
        mutate(
          (current = []) => current.filter((img) => img.id !== update.imageId),
          {
            revalidate: false,
            populateCache: true,
          }
        );
      }
    },
    [mutate]
  );

  // Refresh function for manual revalidation
  const refresh = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    userImages: userImages || [],
    error,
    isLoading,
    isValidating,
    optimisticAdd,
    optimisticRemove,
    syncUpdate,
    refresh,
  };
}

// Export types for external use
export type { EventImage, UseUserEventImagesOptions };
