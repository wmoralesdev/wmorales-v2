'use client';

import type { Event, EventContent, EventImage } from '@prisma/client';
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  MotionValue,
} from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { subscribeToEventUpdates } from '@/lib/supabase/realtime';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

type EventWithImages = Event & {
  images: EventImage[];
};

type ArtisticGalleryProps = {
  event: EventWithImages;
  eventContent: EventContent;
  locale: string;
};

const ImageMotion = motion.create(Image);

// Helper to generate random values within range
const random = (min: number, max: number) => Math.random() * (max - min) + min;

// Generate layout patterns for images
const generateImageLayout = (index: number) => {
  const patterns = [
    // Small
    { maxWidth: 280, rotate: random(-8, 8), scale: 0.9 },
    // Medium
    { maxWidth: 360, rotate: random(-6, 6), scale: 1 },
    // Large
    { maxWidth: 440, rotate: random(-4, 4), scale: 1.1 },
    // Extra large
    { maxWidth: 520, rotate: random(-5, 5), scale: 1.05 },
    // Regular
    { maxWidth: 320, rotate: random(-7, 7), scale: 0.95 },
  ];

  return patterns[index % patterns.length];
};

// Image Item Component
type ImageItemProps = {
  image: EventImage;
  index: number;
  scrollYProgress: MotionValue<number>;
};

function ImageItem({ image, index, scrollYProgress }: ImageItemProps) {
  const layout = generateImageLayout(index);
  const delay = Math.min(index * 0.1, 2);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  // Parallax effect based on scroll
  const y = useTransform(scrollYProgress, [0, 1], [0, random(-50, 50)]);

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
        rootMargin: '100px', // Start loading 100px before the image comes into view
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={imageRef}
      className="relative mb-4 sm:mb-6 lg:mb-8 break-inside-avoid"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      style={{ y }}
    >
      {/* Polaroid-style wrapper */}
      <motion.div
        className="relative bg-white p-2 sm:p-3 shadow-xl"
        style={{
          rotate: `${layout.rotate}deg`,
          scale: layout.scale,
          maxWidth: `${layout.maxWidth}px`,
          margin: '0 auto',
        }}
        whileHover={{
          scale: layout.scale * 1.05,
          rotate: 0,
          transition: { duration: 0.3 },
        }}
      >
        {/* Image with natural aspect ratio */}
        <div
          className="relative overflow-hidden bg-gray-100"
          style={{ minHeight: layout.maxWidth * 0.75 }}
        >
          {/* Loading skeleton - only show when image is in view but not loaded */}
          {isInView && !imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-gray-400 animate-spin" />
                  <ImageIcon className="h-6 w-6 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
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
              <div className="text-center p-4">
                <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Failed to load</p>
              </div>
            </div>
          )}

          {isInView && (
            <Image
              src={image.imageUrl}
              alt={image.caption || `Photo ${index + 1}`}
              width={layout.maxWidth}
              height={layout.maxWidth * 1.5} // Default aspect ratio, will be overridden by actual image
              className={cn(
                'w-full h-auto object-contain transition-opacity duration-500',
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
              sizes={`(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, ${layout.maxWidth}px`}
              loading="eager" // Since we're using intersection observer, we want to load immediately when in view
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          )}

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Optional caption area (like polaroid bottom) */}
        <div className="h-8 sm:h-10 lg:h-12" />
      </motion.div>
    </motion.div>
  );
}

export function ArtisticGallery({
  event,
  eventContent,
  locale,
}: ArtisticGalleryProps) {
  const t = useTranslations('events');

  const [images, setImages] = useState<EventImage[]>(event.images);
  const [showGallery, setShowGallery] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ['start start', 'end end'],
  });

  // Subscribe to realtime updates if event is active
  useEffect(() => {
    if (!event.isActive) return;

    const channel = subscribeToEventUpdates(event.id, (eventUpdate) => {
      if (eventUpdate.type === 'image_uploaded' && eventUpdate.image) {
        const imageData = eventUpdate.image;
        setImages((prev) => {
          if (prev.some((img) => img.id === imageData.id)) {
            return prev;
          }

          const newImage: EventImage = {
            id: imageData.id,
            eventId: event.id,
            userId: '',
            imageUrl: imageData.imageUrl,
            caption: imageData.caption || null,
            createdAt: new Date(imageData.createdAt),
          };

          return [newImage, ...prev];
        });
      } else if (eventUpdate.type === 'image_deleted' && eventUpdate.imageId) {
        setImages((prev) =>
          prev.filter((img) => img.id !== eventUpdate.imageId)
        );
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [event.id, event.isActive]);

  const handleShowGallery = () => {
    setIsTransitioning(true);
    setShowGallery(true);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
  };

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden">
      {/* Info Container that morphs */}
      <motion.div
        layout
        className={cn(
          'fixed z-40 transition-colors duration-700',
          showGallery &&
            'lg:bg-gray-900 border-b lg:border-b-0 lg:border-r border-gray-800'
        )}
        initial={false}
        animate={{
          // Mobile: morphs from full screen to top bar
          // Desktop: morphs from full screen to left sidebar
          ...(showGallery
            ? {
                top: 0,
                left: 0,
                right: window.innerWidth >= 1024 ? '75%' : 0,
                bottom: window.innerWidth >= 1024 ? 0 : 'auto',
                height: window.innerWidth >= 1024 ? '100%' : 'auto',
              }
            : {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }),
        }}
        transition={{
          duration: 0.8,
          ease: [0.43, 0.13, 0.23, 0.96],
        }}
      >
        <motion.div
          layout
          className={cn(
            showGallery
              ? 'p-6 lg:p-8 h-full flex flex-col'
              : 'flex items-center justify-center h-full px-6',
            'transition-all duration-700'
          )}
        >
          <AnimatePresence mode="wait">
            {!isTransitioning ? (
              showGallery ? (
                // Final sidebar/topbar content
                <motion.div
                  key="sidebar-content"
                  className="w-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                >
                  <Link
                    href={`/${locale}/events/${event.slug}`}
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t('backToEvent')}
                  </Link>

                  <div className="lg:flex-1">
                    <div className="flex items-center gap-4">
                      <Image src="/wm.png" alt="Logo" width={24} height={24} />
                      <h1 className="text-2xl lg:text-3xl font-light text-white mb-4">
                        {eventContent.title}
                      </h1>
                    </div>

                    {eventContent.description && (
                      <p className="text-gray-400 leading-relaxed">
                        {eventContent.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-6">
                    <p className="text-sm text-gray-500">
                      {t('photosInGallery', { count: images.length })}
                    </p>
                  </div>
                </motion.div>
              ) : (
                // Initial centered content
                <motion.div
                  key="intro-content"
                  className="max-w-4xl mx-auto text-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center justify-center gap-4 w-full">
                    <ImageMotion
                      src="/wm.png"
                      alt="Logo"
                      width={48}
                      height={48}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                    <motion.h1
                      className="text-4xl sm:text-6xl lg:text-7xl font-light text-white mb-6"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.2 }}
                    >
                      {eventContent.title}
                    </motion.h1>
                  </div>

                  {eventContent.description && (
                    <motion.p
                      className="text-lg sm:text-xl lg:text-2xl text-gray-400 mb-12 leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    >
                      {eventContent.description}
                    </motion.p>
                  )}

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                  >
                    <Button
                      onClick={handleShowGallery}
                      size="lg"
                      className="bg-white text-gray-950 hover:bg-gray-100"
                    >
                      <ImageIcon className="mr-2 h-5 w-5" />
                      {t('viewGallery')} ({images.length} {t('photos')})
                    </Button>
                  </motion.div>
                </motion.div>
              )
            ) : null}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Gallery Container */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            ref={galleryRef}
            className="w-full lg:w-3/4 lg:ml-auto pt-32 lg:pt-0 px-4 sm:px-6 lg:px-8 pb-16 min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="max-w-[1600px] mx-auto lg:py-8">
              {/* Masonry Grid Container */}
              <div className="columns-1 sm:columns-2 lg:columns-2 xl:columns-3 gap-4 sm:gap-6 lg:gap-8">
                {images.map((image, index) => (
                  <ImageItem
                    key={image.id}
                    image={image}
                    index={index}
                    scrollYProgress={scrollYProgress}
                  />
                ))}
              </div>

              {/* Empty state */}
              {images.length === 0 && (
                <motion.div
                  className="flex items-center justify-center min-h-[60vh]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-lg text-gray-400 dark:text-gray-600 font-light tracking-wide">
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
