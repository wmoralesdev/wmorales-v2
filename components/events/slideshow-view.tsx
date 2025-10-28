"use client";

import type { EventImage } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Pause,
  Play,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type SlideshowViewProps = {
  images: EventImage[];
  currentIndex: number;
  isPlaying: boolean;
  onNavigate: (direction: "prev" | "next") => void;
  onPlayPauseToggle: () => void;
};

export function SlideshowView({
  images,
  currentIndex,
  isPlaying,
  onNavigate,
  onPlayPauseToggle,
}: SlideshowViewProps) {
  const t = useTranslations("events");

  if (images.length === 0) {
    return (
      <Card className="border-gray-800 bg-gray-900/60">
        <CardContent className="pt-6">
          <div className="py-12 text-center">
            <ImageIcon className="mx-auto mb-3 h-12 w-12 text-gray-600" />
            <p className="text-gray-400">{t("noPhotosForSlideshow")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-800 bg-gray-900/80">
      <CardContent className="p-0">
        <div className="relative aspect-[4/3] bg-black sm:aspect-[16/10] lg:aspect-[16/9]">
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1 }}
              className="absolute inset-0"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key={currentIndex}
              transition={{ duration: 0.5 }}
            >
              <Image
                alt={images[currentIndex].caption || "Event photo"}
                className="object-contain"
                fill
                priority
                sizes="100vw"
                src={images[currentIndex].imageUrl}
              />
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
                <Button
                  className="h-8 w-8 text-white hover:bg-white/20 sm:h-10 sm:w-10"
                  onClick={() => onNavigate("prev")}
                  size="icon"
                  variant="ghost"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button
                  className="h-8 w-8 text-white hover:bg-white/20 sm:h-10 sm:w-10"
                  onClick={onPlayPauseToggle}
                  size="icon"
                  variant="ghost"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </Button>
                <Button
                  className="h-8 w-8 text-white hover:bg-white/20 sm:h-10 sm:w-10"
                  onClick={() => onNavigate("next")}
                  size="icon"
                  variant="ghost"
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>

              <div className="text-white text-xs sm:text-sm">
                {currentIndex + 1} / {images.length}
              </div>
            </div>

            {images[currentIndex].caption && (
              <p className="mt-2 line-clamp-2 text-white text-xs sm:mt-3 sm:text-sm lg:mt-4 lg:text-base">
                {images[currentIndex].caption}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
