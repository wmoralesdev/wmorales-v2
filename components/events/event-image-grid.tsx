'use client';

import type { EventImage } from '@prisma/client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { ImageLightbox } from './image-lightbox';

type EventImageGridProps = {
  images: EventImage[];
  locale: string;
};

export function EventImageGrid({ images, locale }: EventImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<EventImage | null>(null);

  const handleImageClick = (image: EventImage) => {
    setSelectedImage(image);
  };

  return (
    <>
      {/* Mobile-first responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 sm:gap-2">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: Math.min(index * 0.02, 0.3),
              duration: 0.3,
            }}
            className="relative aspect-square cursor-pointer group overflow-hidden bg-gray-900"
            onClick={() => handleImageClick(image)}
          >
            <Image
              src={image.imageUrl}
              alt={image.caption || `Event photo ${index + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              loading={index < 12 ? 'eager' : 'lazy'}
            />

            {/* Subtle hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </motion.div>
        ))}
      </div>

      {/* Lightbox for full-size viewing */}
      <ImageLightbox
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
        locale={locale}
      />
    </>
  );
}
