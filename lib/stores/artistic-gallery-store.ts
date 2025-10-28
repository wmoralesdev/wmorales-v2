import { create } from "zustand";
import type { ExtendedEventImage } from "@/lib/types/event.types";

type ArtisticGalleryState = {
  // UI States
  images: ExtendedEventImage[];
  showGallery: boolean;
  isTransitioning: boolean;

  // Actions
  setImages: (images: ExtendedEventImage[]) => void;
  addImage: (image: ExtendedEventImage) => void;
  removeImage: (imageId: string) => void;
  setShowGallery: (show: boolean) => void;
  setIsTransitioning: (transitioning: boolean) => void;
  handleShowGallery: () => void;
  resetState: () => void;
};

const initialState = {
  images: [],
  showGallery: false,
  isTransitioning: false,
};

export const useArtisticGalleryStore = create<ArtisticGalleryState>(
  (set, get) => ({
    ...initialState,

    setImages: (images) => set({ images }),

    addImage: (image) => {
      const { images } = get();
      // Check if image already exists
      if (images.some((img) => img.id === image.id)) {
        return;
      }
      set({ images: [image, ...images] });
    },

    removeImage: (imageId) => {
      const { images } = get();
      set({ images: images.filter((img) => img.id !== imageId) });
    },

    setShowGallery: (show) => set({ showGallery: show }),

    setIsTransitioning: (transitioning) =>
      set({ isTransitioning: transitioning }),

    handleShowGallery: () => {
      set({ isTransitioning: true, showGallery: true });
      setTimeout(() => {
        set({ isTransitioning: false });
      }, 1000);
    },

    resetState: () => set(initialState),
  })
);
