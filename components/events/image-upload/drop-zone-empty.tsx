import { motion } from "framer-motion";
import { CloudUpload, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  getDropZoneText,
  getIconClassName,
  getInnerDivClassName,
  getTitleClassName,
} from "./utils";

type DropZoneEmptyProps = {
  isDragReject: boolean;
  isDragActive: boolean;
  isUploading: boolean;
  maxImages: number;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onClick: () => void;
  t: ReturnType<typeof useTranslations>;
};

export function DropZoneEmpty({
  isDragReject,
  isDragActive,
  isUploading,
  maxImages,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onClick,
  t,
}: DropZoneEmptyProps) {
  return (
    <motion.div
      animate={isDragActive ? { scale: 1.02 } : { scale: 1 }}
      className={`cursor-pointer space-y-6 rounded-xl transition-all duration-300 ${getInnerDivClassName(isDragReject, isDragActive)}`}
      onClick={onClick}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <motion.div
          animate={
            isDragActive ? { rotate: 180, scale: 1.1 } : { rotate: 0, scale: 1 }
          }
          transition={{ duration: 0.3 }}
        >
          <CloudUpload
            className={`mb-6 h-16 w-16 sm:h-20 sm:w-20 ${getIconClassName(isDragReject, isDragActive)}`}
          />
        </motion.div>

        <div className="space-y-2">
          <p
            className={`font-bold text-xl ${getTitleClassName(isDragReject, isDragActive)}`}
          >
            {getDropZoneText(isDragReject, isDragActive, t)}
          </p>

          {!(isDragActive || isDragReject) && (
            <p className="mt-1 text-purple-300 text-sm">{t("joinTheFun")}</p>
          )}

          <p className="text-gray-500 text-sm">
            {t("supportedFormats")}: JPG, PNG, GIF, WebP
          </p>

          <p className="text-gray-500 text-xs">
            {t("maxFileSize")}: 10MB • {t("maxFiles")}: {maxImages}
          </p>
        </div>

        <Button
          className="mt-4 bg-purple-500/20 text-purple-300 transition-all duration-300 hover:bg-purple-500/30 hover:text-purple-200"
          disabled={isUploading}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          variant="outline"
        >
          <Upload className="mr-2 h-4 w-4" />
          {t("selectImage")}
        </Button>
      </div>
    </motion.div>
  );
}

