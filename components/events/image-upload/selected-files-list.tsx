import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Upload, X } from "lucide-react";
import Image from "next/image";
import type { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { formatFileSize } from "@/lib/utils/image-compression";
import { ANIMATION_DELAY_INCREMENT, ANIMATION_DURATION_SHORT } from "./utils";

type SelectedFilesListProps = {
  selectedFiles: File[];
  previews: { file: File; url: string }[];
  isUploading: boolean;
  maxImages: number;
  onRemoveFile: (file: File) => void;
  onRemoveAllFiles: () => void;
  onClick: () => void;
  t: ReturnType<typeof useTranslations>;
};

export function SelectedFilesList({
  selectedFiles,
  previews,
  isUploading,
  maxImages,
  onRemoveFile,
  onRemoveAllFiles,
  onClick,
  t,
}: SelectedFilesListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 font-medium text-sm text-white">
          {t("selectedFiles", { count: selectedFiles.length })}
          <Sparkles className="h-3 w-3 text-purple-400" />
        </Label>
        <Button
          className="text-gray-400 hover:text-red-400"
          disabled={isUploading}
          onClick={onRemoveAllFiles}
          size="sm"
          variant="ghost"
        >
          <X className="mr-1 h-3 w-3" />
          {t("removeAll")}
        </Button>
      </div>

      <div className="grid max-h-96 grid-cols-1 gap-4 overflow-y-auto p-1 sm:grid-cols-2">
        <AnimatePresence>
          {previews.map((preview, index) => (
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="group relative aspect-[4/3]"
              exit={{ opacity: 0, scale: 0.8 }}
              initial={{ opacity: 0, scale: 0.8 }}
              key={preview.file.name}
              transition={{
                duration: ANIMATION_DURATION_SHORT,
                delay: index * ANIMATION_DELAY_INCREMENT,
              }}
            >
              <Image
                alt={preview.file.name}
                className="h-full w-full rounded-lg border border-gray-800 object-cover transition-all duration-300 group-hover:border-purple-500/30"
                height={150}
                src={preview.url}
                width={150}
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <Button
                className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
                onClick={() => onRemoveFile(preview.file)}
                size="sm"
                variant="destructive"
              >
                <X className="h-3 w-3" />
              </Button>
              <div className="absolute right-1 bottom-1 left-1 flex flex-col gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="truncate text-white text-xs">
                  {preview.file.name}
                </span>
                <span className="text-purple-300 text-xs">
                  {formatFileSize(preview.file.size)}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Button
        className="w-full bg-gray-800/50 text-gray-300 transition-all duration-300 hover:bg-gray-700/50"
        disabled={isUploading || selectedFiles.length >= maxImages}
        onClick={onClick}
        variant="outline"
      >
        <Upload className="mr-2 h-4 w-4" />
        {selectedFiles.length >= maxImages
          ? t("maxFilesReached")
          : t("addMoreImages", {
              remaining: maxImages - selectedFiles.length,
            })}
      </Button>
    </div>
  );
}
