"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type ArtisticGalleryInfoProps = {
  showGallery: boolean;
  isTransitioning: boolean;
  locale: string;
  eventSlug: string;
  eventTitle: string;
  eventDescription: string | null;
  imagesCount: number;
  onShowGallery: () => void;
  t: ReturnType<typeof useTranslations>;
};

export function ArtisticGalleryInfo({
  showGallery,
  isTransitioning,
  locale,
  eventSlug,
  eventTitle,
  eventDescription,
  imagesCount,
  onShowGallery,
  t,
}: ArtisticGalleryInfoProps) {
  return (
    <AnimatePresence mode="wait">
      {/* biome-ignore lint/style/noNestedTernary: complex conditional rendering pattern */}
      {isTransitioning ? null : showGallery ? (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="w-full"
          exit={{ opacity: 0, scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.95 }}
          key="sidebar-content"
          transition={{ duration: 0.5 }}
        >
          <Link
            className="mb-6 inline-flex items-center gap-2 text-gray-400 text-sm transition-colors hover:text-white"
            href={`/${locale}/events/${eventSlug}`}
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backToEvent")}
          </Link>

          <div className="lg:flex-1">
            <div className="flex items-center gap-4">
              <Image alt="Logo" height={24} src="/wm.png" width={24} />
              <h1 className="mb-4 font-light text-lg text-white md:text-2xl lg:text-3xl">
                {eventTitle}
              </h1>
            </div>

            {eventDescription && (
              <p className="text-gray-400 text-sm leading-relaxed md:text-base">
                {eventDescription}
              </p>
            )}
          </div>

          <div className="mt-2 sm:mt-4 md:mt-6">
            <p className="text-center text-gray-500 text-xs md:text-sm">
              {t("photosInGallery", { count: imagesCount })}
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-4xl text-center"
          exit={{ opacity: 0, scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.95 }}
          key="intro-content"
          transition={{ duration: 0.5 }}
        >
          <div className="flex w-full items-center justify-center gap-4">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <Image alt="Logo" height={48} src="/wm.png" width={48} />
            </motion.div>
            <motion.h1
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 font-light text-4xl text-white sm:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              {eventTitle}
            </motion.h1>
          </div>

          {eventDescription && (
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 text-gray-400 text-lg leading-relaxed sm:text-xl lg:text-2xl"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              {eventDescription}
            </motion.p>
          )}

          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Button
              className="bg-white text-gray-950 hover:bg-gray-100"
              onClick={onShowGallery}
              size="lg"
            >
              <ImageIcon className="mr-2 h-5 w-5" />
              {t("viewGallery")} ({imagesCount} {t("photos")})
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
