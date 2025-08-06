import { ExtendedEventImage } from '@/lib/types/event.types';
import { create } from 'zustand';

type LiveEventState = {
  // UI States
  activeViewers: number;
  showQRCode: boolean;
  uploading: boolean;
  currentPhotoIndex: number;
  selectedImage: ExtendedEventImage | null;
  eventImages: ExtendedEventImage[];

  // Actions
  setActiveViewers: (count: number) => void;
  setShowQRCode: (show: boolean) => void;
  setUploading: (uploading: boolean) => void;
  setCurrentPhotoIndex: (index: number) => void;
  setSelectedImage: (image: ExtendedEventImage | null) => void;
  setEventImages: (images: ExtendedEventImage[]) => void;
  addEventImage: (image: ExtendedEventImage) => void;
  removeEventImage: (imageId: string) => void;
  resetState: () => void;
};

const initialState = {
  activeViewers: 1,
  showQRCode: false,
  uploading: false,
  currentPhotoIndex: 0,
  selectedImage: null,
  eventImages: [],
};

export const useLiveEventStore = create<LiveEventState>((set, get) => ({
  ...initialState,

  setActiveViewers: (count) => set({ activeViewers: count }),

  setShowQRCode: (show) => set({ showQRCode: show }),

  setUploading: (uploading) => set({ uploading }),

  setCurrentPhotoIndex: (index) => set({ currentPhotoIndex: index }),

  setSelectedImage: (image) => set({ selectedImage: image }),

  setEventImages: (images) => set({ eventImages: images }),

  addEventImage: (image) => {
    const { eventImages } = get();
    set({ eventImages: [image, ...eventImages] });
  },

  removeEventImage: (imageId) => {
    const { eventImages, selectedImage } = get();
    const filteredImages = eventImages.filter((img) => img.id !== imageId);
    const newSelectedImage =
      selectedImage?.id === imageId ? null : selectedImage;
    set({
      eventImages: filteredImages,
      selectedImage: newSelectedImage,
    });
  },

  resetState: () => set(initialState),
}));
