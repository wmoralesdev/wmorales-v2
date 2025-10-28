"use client";

import type { EventImage } from "@prisma/client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { ImageLightbox } from "./image-lightbox";

// Constants
const ANIMATION_DELAY_INCREMENT = 0.02;
const MAX_ANIMATION_DELAY = 0.3;
const ANIMATION_DURATION = 0.3;
const EAGER_LOAD_LIMIT = 12;
const TRANSITION_DURATION_MS = 300;
const HOVER_SCALE = 1.1;

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
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {images.map((image, index) => (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="group relative aspect-square cursor-pointer overflow-hidden bg-gray-900"
            initial={{ opacity: 0, scale: 0.9 }}
            key={image.id}
            onClick={() => handleImageClick(image)}
            transition={{
              delay: Math.min(
                index * ANIMATION_DELAY_INCREMENT,
                MAX_ANIMATION_DELAY
              ),
              duration: ANIMATION_DURATION,
            }}
          >
            <Image
              alt={image.caption || `Event photo ${index + 1}`}
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              fill
              loading={index < EAGER_LOAD_LIMIT ? "eager" : "lazy"}
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
              src={image.imageUrl}
            />

            {/* Subtle hover overlay */}
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
          </motion.div>
        ))}
      </div>

      {/* Lightbox for full-size viewing */}
      <ImageLightbox
        locale={locale}
        onClose={() => setSelectedImage(null)}
        selectedImage={selectedImage}
      />
    </>
  );
}
