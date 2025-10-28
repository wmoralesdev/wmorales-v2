"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ImagePreview = {
  file: File;
  url: string;
};

type ImagePreviewListProps = {
  previews: ImagePreview[];
  captions: { [key: string]: string };
  onCaptionChange: (fileName: string, caption: string) => void;
  onRemove: (file: File) => void;
};

export function ImagePreviewList({
  previews,
  captions,
  onCaptionChange,
  onRemove,
}: ImagePreviewListProps) {
  const t = useTranslations("events");

  if (previews.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      <h3 className="font-medium text-gray-300 text-sm">
        {t("selectedPhotos", { count: previews.length })}
      </h3>
      <AnimatePresence>
        {previews.map((preview, index) => (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 rounded-lg bg-gray-800/50 p-4"
            exit={{ opacity: 0, x: -100 }}
            initial={{ opacity: 0, y: 20 }}
            key={preview.file.name + index}
            transition={{ duration: 0.2 }}
          >
            <div className="relative h-20 w-20 flex-shrink-0">
              <Image
                alt={preview.file.name}
                className="rounded-md object-cover"
                fill
                src={preview.url}
              />
              <button
                className="-top-2 -right-2 absolute flex h-6 w-6 items-center justify-center rounded-full bg-red-500 transition-colors hover:bg-red-600"
                onClick={() => onRemove(preview.file)}
                type="button"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
            <div className="flex-1 space-y-2">
              <p className="truncate text-gray-300 text-sm">
                {preview.file.name}
              </p>
              <div>
                <Label className="sr-only" htmlFor={`caption-${index}`}>
                  {t("caption")}
                </Label>
                <Input
                  className="h-8 border-gray-700 bg-gray-900 text-sm"
                  id={`caption-${index}`}
                  onChange={(e) =>
                    onCaptionChange(preview.file.name, e.target.value)
                  }
                  placeholder={t("addCaption")}
                  type="text"
                  value={captions[preview.file.name] || ""}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
