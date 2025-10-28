"use client";

import { motion } from "framer-motion";
import { Eye, Loader2, Trash } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { ExtendedEventImage } from "@/lib/types/event.types";
import { cn, formatDistanceToNowLocalized } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type PhotoGridProps = {
  images: ExtendedEventImage[];
  onImageClick: (image: ExtendedEventImage, index: number) => void;
  onImageDelete: (imageId: string) => void | Promise<void>;
  currentProfileId?: string;
  locale: string;
  className?: string;
};

export function PhotoGrid({
  images,
  onImageClick,
  onImageDelete,
  currentProfileId,
  locale,
  className = "",
}: PhotoGridProps) {
  const t = useTranslations("events");
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-2",
        className
      )}
    >
      {images.map((image, index) => (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "group relative aspect-square cursor-pointer overflow-hidden bg-gray-900",
            "rounded-none sm:rounded-lg"
          )}
          initial={{ opacity: 0, scale: 0.8 }}
          key={image.id}
          onClick={() => onImageClick(image, index)}
          transition={{ delay: Math.min(index * 0.05, 0.5) }}
        >
          <Image
            alt={image.caption || "Event photo"}
            className={cn(
              "object-cover transition-transform duration-300 group-hover:scale-110",
              "bg-white/20"
            )}
            fill
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
            src={image.imageUrl}
          />
          <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />

          {/* Corner overlay for better icon visibility */}
          <div className="absolute inset-0 z-[40]">
            {/* Top-right corner gradient */}
            <div className="absolute inset-0 bg-gradient-to-bl from-black/40 via-transparent to-transparent" />
            {/* Bottom-left corner gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="text-center">
              <Eye className="mx-auto mb-1 h-6 w-6 text-white" />
              <p className="text-white text-xs">
                {formatDistanceToNowLocalized(
                  new Date(image.createdAt),
                  locale
                )}
              </p>
            </div>
          </div>
          <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
            <div className="absolute right-0 bottom-0 left-0 p-2 sm:p-3">
              {image.caption && (
                <p className="truncate text-white text-xs sm:text-sm">
                  {image.caption}
                </p>
              )}
            </div>
          </div>

          {currentProfileId && currentProfileId === image.profileId && (
            <div
              className={cn(
                "absolute top-2 right-2 z-50 flex size-8 items-center justify-center rounded-full bg-red-500",
                deletingImageId === image.id
                  ? "cursor-not-allowed opacity-70"
                  : "cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-red-600"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    aria-label={t("delete")}
                    className="flex size-8 items-center justify-center rounded-full focus:outline-none"
                    disabled={deletingImageId === image.id}
                    type="button"
                  >
                    {deletingImageId === image.id ? (
                      <Loader2 className="size-4 animate-spin text-white" />
                    ) : (
                      <Trash className="size-4 text-white" />
                    )}
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {t("confirmDeleteImage")}
                    </AlertDialogTitle>
                    <p className="mt-2 text-gray-400 text-sm">
                      {t("confirmDeleteImageDescription")}
                    </p>
                  </AlertDialogHeader>
                  <div className="mt-4 flex justify-end gap-2">
                    <AlertDialogCancel asChild>
                      <button
                        className="rounded bg-gray-700 px-3 py-1 text-sm text-white"
                        type="button"
                      >
                        {t("cancel")}
                      </button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <button
                        className="rounded bg-red-600 px-3 py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={deletingImageId === image.id}
                        onClick={async () => {
                          setDeletingImageId(image.id);
                          try {
                            await onImageDelete(image.id);
                          } finally {
                            setDeletingImageId(null);
                          }
                        }}
                        type="button"
                      >
                        {deletingImageId === image.id ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="size-3 animate-spin" />
                            {t("deleting")}
                          </span>
                        ) : (
                          t("delete")
                        )}
                      </button>
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
          <div className="absolute bottom-2 left-2 z-50 flex size-8 items-center justify-center rounded-full bg-red-500">
            <Avatar>
              <AvatarImage src={image.profile?.avatar} />
              <AvatarFallback>{image.profile?.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
