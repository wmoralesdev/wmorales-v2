"use client";

import type { EventImage } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

type PhotoCarouselProps = {
  images: EventImage[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  className?: string;
};

export function PhotoCarousel({
  images,
  currentIndex,
  onIndexChange,
  className = "",
}: PhotoCarouselProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <div
      className={`relative aspect-[16/9] overflow-hidden rounded-lg bg-gray-800 ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0"
          exit={{ opacity: 0, scale: 1.05 }}
          initial={{ opacity: 0, scale: 0.95 }}
          key={currentIndex}
          transition={{ duration: 0.5 }}
        >
          <Image
            alt={images[currentIndex]?.caption || "Event photo"}
            className="bg-white/10 object-contain"
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            src={images[currentIndex]?.imageUrl}
          />
          {images[currentIndex]?.caption && (
            <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="line-clamp-2 text-sm text-white">
                {images[currentIndex]?.caption}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Photo indicators */}
      <div className="-translate-x-1/2 absolute bottom-4 left-1/2 flex gap-1">
        {images.slice(0, 10).map((image, index) => (
          <button
            aria-label={`Go to photo ${index + 1}`}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              index === currentIndex
                ? "w-6 bg-white"
                : "bg-white/50 hover:bg-white/70"
            )}
            key={image.id}
            onClick={() => onIndexChange(index)}
            type="button"
          />
        ))}
        {images.length > 10 && (
          <span className="ml-2 text-white/50 text-xs">
            +{images.length - 10}
          </span>
        )}
      </div>
    </div>
  );
}
