"use client";

import type { Event, EventContent } from "@prisma/client";
import {
  AnimatePresence,
  type MotionValue,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { useArtisticGalleryStore } from "@/lib/stores/artistic-gallery-store";
import { subscribeToEventUpdates } from "@/lib/supabase/realtime";
import type { ExtendedEventImage } from "@/lib/types/event.types";
import { cn } from "@/lib/utils";
import { ArtisticGalleryInfo } from "./artistic-gallery-info";

type EventWithImages = Event & {
  images: ExtendedEventImage[];
};

type ArtisticGalleryProps = {
  event: EventWithImages;
  eventContent: EventContent;
  locale: string;
};

// ImageMotion is unused after extraction
// const ImageMotion = motion.create(Image);

// Image layout constants
const SMALL_IMAGE_WIDTH = 280;
const MEDIUM_IMAGE_WIDTH = 360;
const LARGE_IMAGE_WIDTH = 440;
const EXTRA_LARGE_IMAGE_WIDTH = 520;
const REGULAR_IMAGE_WIDTH = 320;
const SMALL_ROTATION_RANGE = 8;
const MEDIUM_ROTATION_RANGE = 6;
const LARGE_ROTATION_RANGE = 4;
const EXTRA_LARGE_ROTATION_RANGE = 5;
const REGULAR_ROTATION_RANGE = 7;
const SMALL_SCALE = 0.9;
const NORMAL_SCALE = 1;
const LARGE_SCALE = 1.1;
const EXTRA_LARGE_SCALE = 1.05;
const REGULAR_SCALE = 0.95;
const ANIMATION_DELAY_INCREMENT = 0.1;
const MAX_ANIMATION_DELAY = 2;
const PARALLAX_MIN = -50;
const PARALLAX_MAX = 50;
const ANIMATION_DURATION = 0.8;
const EASE_X1 = 0.25;
const EASE_Y1 = 0.1;
const EASE_X2 = 0.25;
const EASE_Y2 = 1;
const EASE_ARRAY = [EASE_X1, EASE_Y1, EASE_X2, EASE_Y2] as const;
const DESKTOP_BREAKPOINT = 1024;
const DESKTOP_RIGHT_POSITION = "75%";
const DESKTOP_HEIGHT = "100%";
const HOVER_SCALE_MULTIPLIER = 1.05;
const HOVER_ANIMATION_DURATION = 0.3;
const ASPECT_RATIO_MULTIPLIER = 0.75;
const IMAGE_HEIGHT_MULTIPLIER = 1.5;
const MORPH_DURATION = 0.8;
const MORPH_EASE_X1 = 0.43;
const MORPH_EASE_Y1 = 0.13;
const MORPH_EASE_X2 = 0.23;
const MORPH_EASE_Y2 = 0.96;
const MORPH_EASE_ARRAY = [
  MORPH_EASE_X1,
  MORPH_EASE_Y1,
  MORPH_EASE_X2,
  MORPH_EASE_Y2,
] as const;

// Helper to generate random values within range
const random = (min: number, max: number) => Math.random() * (max - min) + min;

// Generate layout patterns for images
const generateImageLayout = (index: number) => {
  const patterns = [
    // Small
    {
      maxWidth: SMALL_IMAGE_WIDTH,
      rotate: random(-SMALL_ROTATION_RANGE, SMALL_ROTATION_RANGE),
      scale: SMALL_SCALE,
    },
    // Medium
    {
      maxWidth: MEDIUM_IMAGE_WIDTH,
      rotate: random(-MEDIUM_ROTATION_RANGE, MEDIUM_ROTATION_RANGE),
      scale: NORMAL_SCALE,
    },
    // Large
    {
      maxWidth: LARGE_IMAGE_WIDTH,
      rotate: random(-LARGE_ROTATION_RANGE, LARGE_ROTATION_RANGE),
      scale: LARGE_SCALE,
    },
    // Extra large
    {
      maxWidth: EXTRA_LARGE_IMAGE_WIDTH,
      rotate: random(-EXTRA_LARGE_ROTATION_RANGE, EXTRA_LARGE_ROTATION_RANGE),
      scale: EXTRA_LARGE_SCALE,
    },
    // Regular
    {
      maxWidth: REGULAR_IMAGE_WIDTH,
      rotate: random(-REGULAR_ROTATION_RANGE, REGULAR_ROTATION_RANGE),
      scale: REGULAR_SCALE,
    },
  ];

  return patterns[index % patterns.length];
};

// Image Item Component
type ImageItemProps = {
  image: ExtendedEventImage;
  index: number;
  scrollYProgress: MotionValue<number>;
};

function ImageItem({ image, index, scrollYProgress }: ImageItemProps) {
  const layout = generateImageLayout(index);
  const delay = Math.min(
    index * ANIMATION_DELAY_INCREMENT,
    MAX_ANIMATION_DELAY
  );
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  // Parallax effect based on scroll
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, random(PARALLAX_MIN, PARALLAX_MAX)]
  );

  // Intersection observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "100px", // Start loading 100px before the image comes into view
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="relative mb-4 break-inside-avoid sm:mb-6 lg:mb-8"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      ref={imageRef}
      style={{ y }}
      transition={{
        duration: ANIMATION_DURATION,
        delay,
        ease: EASE_ARRAY,
      }}
    >
      {/* Polaroid-style wrapper */}
      <motion.div
        className="relative bg-white p-2 shadow-xl sm:p-3"
        style={{
          rotate: `${layout.rotate}deg`,
          scale: layout.scale,
          maxWidth: `${layout.maxWidth}px`,
          margin: "0 auto",
        }}
        whileHover={{
          scale: layout.scale * HOVER_SCALE_MULTIPLIER,
          rotate: 0,
          transition: { duration: HOVER_ANIMATION_DURATION },
        }}
      >
        {/* Image with natural aspect ratio */}
        <div
          className="relative overflow-hidden bg-gray-100"
          style={{ minHeight: layout.maxWidth * ASPECT_RATIO_MULTIPLIER }}
        >
          {/* Loading skeleton - only show when image is in view but not loaded */}
          {isInView && !imageLoaded && !imageError && (
            <div className="absolute inset-0 animate-pulse bg-gray-200">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-gray-400" />
                  <ImageIcon className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-6 w-6 text-gray-400" />
                </div>
              </div>
            </div>
          )}

          {/* Placeholder when not in view */}
          {!isInView && (
            <div className="absolute inset-0 bg-gray-200">
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
            </div>
          )}

          {/* Error state */}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="p-4 text-center">
                <ImageIcon className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                <p className="text-gray-500 text-xs">Failed to load</p>
              </div>
            </div>
          )}

          {isInView && (
            <Image
              alt={image.caption || `Photo ${index + 1}`}
              className={cn(
                "h-auto w-full object-contain transition-opacity duration-500",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              height={layout.maxWidth * IMAGE_HEIGHT_MULTIPLIER}
              loading="eager" // Default aspect ratio, will be overridden by actual image
              onError={() => setImageError(true)}
              onLoad={() => setImageLoaded(true)}
              sizes={`(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, ${layout.maxWidth}px`}
              src={image.imageUrl} // Since we're using intersection observer, we want to load immediately when in view
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
              width={layout.maxWidth}
            />
          )}

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
        </div>

        {/* Optional caption area (like polaroid bottom) */}
        <div className="flex h-8 items-center justify-end sm:h-10 lg:h-12">
          <p className="select-none font-bold font-display text-gray-500 text-xs md:text-sm lg:text-base">
            @{image.profile.name.replace(/\s+/g, "-").toLowerCase()}
          </p>
          <p className="text-gray-500 text-xs">{image.caption}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ArtisticGallery({
  event,
  eventContent,
  locale,
}: ArtisticGalleryProps) {
  const t = useTranslations("events");

  // Use zustand store for state management
  const {
    images,
    showGallery,
    isTransitioning,
    setImages,
    addImage,
    removeImage,
    handleShowGallery,
  } = useArtisticGalleryStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ["start start", "end end"],
  });

  // Initialize images on mount
  useEffect(() => {
    setImages(event.images);
  }, [event.images, setImages]);

  // Helper to manage body scroll lock
  const manageScrollLock = useCallback((shouldLock: boolean) => {
    if (shouldLock) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
  }, []);

  // Block scroll when gallery is not shown
  useEffect(() => {
    manageScrollLock(!showGallery);
    return () => {
      manageScrollLock(false);
    };
  }, [showGallery, manageScrollLock]);

  // Helper function to transform event image data
  const transformImageData = useCallback(
    (imageData: { id: string; profileId: string; imageUrl: string; caption: string | null; createdAt: string; profile: { name: string; avatar: string | null } }, eventId: string): ExtendedEventImage => ({
      id: imageData.id,
      eventId,
      profileId: imageData.profileId,
      imageUrl: imageData.imageUrl,
      caption: imageData.caption || null,
      createdAt: new Date(imageData.createdAt),
      profile: {
        name: imageData.profile.name,
        avatar: imageData.profile.avatar || undefined,
      },
    }),
    []
  );

  // Handle realtime event updates
  const handleEventUpdate = useCallback(
    (eventUpdate: { type: string; image?: { id: string; profileId: string; imageUrl: string; caption: string | null; createdAt: string; profile: { name: string; avatar: string | null } }; imageId?: string }) => {
      if (eventUpdate.type === "image_uploaded" && eventUpdate.image) {
        const newImage = transformImageData(eventUpdate.image, event.id);
        addImage(newImage);
      } else if (eventUpdate.type === "image_deleted" && eventUpdate.imageId) {
        removeImage(eventUpdate.imageId);
      }
    },
    [event.id, addImage, removeImage, transformImageData]
  );

  // Subscribe to realtime updates if event is active
  useEffect(() => {
    if (!event.isActive) {
      return;
    }

    const channel = subscribeToEventUpdates(event.id, handleEventUpdate);
    return () => {
      channel.unsubscribe();
    };
  }, [event.id, event.isActive, handleEventUpdate]);

  return (
    <div className="relative min-h-screen overflow-hidden" ref={containerRef}>
      {/* Info Container that morphs */}
      <motion.div
        animate={{
          // Mobile: morphs from full screen to top bar
          // Desktop: morphs from full screen to left sidebar
          ...(showGallery
            ? {
                top: 0,
                left: 0,
                right:
                  window.innerWidth >= DESKTOP_BREAKPOINT
                    ? DESKTOP_RIGHT_POSITION
                    : 0,
                bottom: window.innerWidth >= DESKTOP_BREAKPOINT ? 0 : "auto",
                height:
                  window.innerWidth >= DESKTOP_BREAKPOINT
                    ? DESKTOP_HEIGHT
                    : "auto",
              }
            : {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }),
        }}
        className={cn(
          "fixed z-40 transition-colors duration-700",
          showGallery &&
            "border-gray-800 border-b lg:border-r lg:border-b-0 lg:bg-gray-900"
        )}
        initial={false}
        layout
        transition={{
          duration: MORPH_DURATION,
          ease: MORPH_EASE_ARRAY,
        }}
      >
        <motion.div
          className={cn(
            showGallery
              ? "flex h-full flex-col bg-gray-900 p-6 lg:p-8"
              : "flex h-full items-center justify-center px-6",
            "transition-all duration-700"
          )}
          layout
        >
          <ArtisticGalleryInfo
            eventDescription={eventContent.description}
            eventSlug={event.slug}
            eventTitle={eventContent.title}
            imagesCount={images.length}
            isTransitioning={isTransitioning}
            locale={locale}
            onShowGallery={handleShowGallery}
            showGallery={showGallery}
            t={t}
          />
        </motion.div>
      </motion.div>

      {/* Gallery Container */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            animate={{ opacity: 1 }}
            className="min-h-screen w-full px-4 pt-32 pb-16 sm:px-6 lg:ml-auto lg:w-3/4 lg:px-8 lg:pt-0"
            initial={{ opacity: 0 }}
            ref={galleryRef}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="mx-auto max-w-[1600px] lg:py-8">
              {/* Masonry Grid Container */}
              <div className="columns-1 gap-4 sm:columns-2 sm:gap-6 lg:columns-2 lg:gap-8 xl:columns-3">
                {images.map((image, index) => (
                  <ImageItem
                    image={image}
                    index={index}
                    key={image.id}
                    scrollYProgress={scrollYProgress}
                  />
                ))}
              </div>

              {/* Empty state */}
              {images.length === 0 && (
                <motion.div
                  animate={{ opacity: 1 }}
                  className="flex min-h-[60vh] items-center justify-center"
                  initial={{ opacity: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="font-light text-gray-400 text-lg tracking-wide dark:text-gray-600">
                    No memories yet
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
