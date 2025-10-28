"use client";

import type { EventImage } from "@prisma/client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { formatDistanceToNowLocalized } from "@/lib/utils";

type ExtendedEventImage = EventImage & {
  user?: {
    name?: string | null;
  };
};

type ImageLightboxProps = {
  selectedImage: ExtendedEventImage | null;
  onClose: () => void;
  locale: string;
};

export function ImageLightbox({
  selectedImage,
  onClose,
  locale,
}: ImageLightboxProps) {
  const t = useTranslations("events");

  return (
    <Dialog onOpenChange={() => onClose()} open={!!selectedImage}>
      <DialogTitle>{selectedImage?.caption}</DialogTitle>
      <DialogContent className="h-screen max-w-4xl border-gray-800 bg-gray-900/95 p-0 backdrop-blur-xl sm:h-auto sm:max-w-screen-lg">
        {selectedImage && (
          <div className="relative flex h-full items-center justify-center">
            <Image
              alt={selectedImage.caption || "Event photo"}
              className="h-full max-h-[85vh] w-full object-contain sm:max-h-[90vh]"
              height={800}
              sizes="90vw"
              src={selectedImage.imageUrl}
              width={1200}
            />

            {selectedImage.caption && (
              <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6">
                <p className="text-sm text-white sm:text-base">
                  {selectedImage.caption}
                </p>
                {selectedImage.user?.name && (
                  <p className="mt-2 text-gray-400 text-sm">
                    {t("by")} {selectedImage.user.name} •{" "}
                    {formatDistanceToNowLocalized(
                      new Date(selectedImage.createdAt),
                      locale
                    )}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
