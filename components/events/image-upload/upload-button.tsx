import { motion } from "framer-motion";
import { ImageIcon, Sparkles, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { PERCENTAGE_MULTIPLIER } from "./utils";

function getButtonContent(
  compressionProgress: { current: number; total: number } | null,
  isUploading: boolean,
  selectedFilesLength: number,
  t: ReturnType<typeof useTranslations>
) {
  if (compressionProgress) {
    return (
      <>
        <ImageIcon className="relative z-10 mr-2 h-5 w-5 animate-pulse" />
        <span className="relative z-10 text-lg">
          Compressing... ({compressionProgress.current}/{compressionProgress.total})
        </span>
      </>
    );
  }
  if (isUploading) {
    return (
      <>
        <Upload className="relative z-10 mr-2 h-5 w-5 animate-spin" />
        <span className="relative z-10 text-lg">{t("uploading")}</span>
      </>
    );
  }
  return (
    <>
      <Sparkles className="relative z-10 mr-2 h-5 w-5" />
      <span className="relative z-10 text-lg">
        {selectedFilesLength === 1
          ? t("sharePhoto")
          : t("sharePhotos", { count: selectedFilesLength })}
      </span>
    </>
  );
}

type UploadButtonProps = {
  selectedFilesLength: number;
  compressionProgress: { current: number; total: number } | null;
  isUploading: boolean;
  maxImages: number;
  onClick: () => void;
  t: ReturnType<typeof useTranslations>;
};

export function UploadButton({
  selectedFilesLength,
  compressionProgress,
  isUploading,
  maxImages,
  onClick,
  t,
}: UploadButtonProps) {
  if (selectedFilesLength === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <Button
        className="group relative w-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-pink-600 hover:shadow-purple-500/25 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={
          selectedFilesLength === 0 ||
          isUploading ||
          compressionProgress !== null
        }
        onClick={onClick}
        size="lg"
      >
        <div className="absolute inset-0 translate-y-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 transition-transform duration-300 group-hover:translate-y-0" />
        {getButtonContent(compressionProgress, isUploading, selectedFilesLength, t)}
      </Button>

      {compressionProgress && (
        <div className="mt-2 space-y-1">
          <div className="h-2 overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{
                width: `${
                  (compressionProgress.current / compressionProgress.total) *
                  PERCENTAGE_MULTIPLIER
                }%`,
              }}
            />
          </div>
          <p className="text-center text-gray-400 text-xs">
            Optimizing images for faster uploads...
          </p>
        </div>
      )}

      {maxImages === 0 && (
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-center font-medium text-sm text-yellow-400"
          initial={{ opacity: 0, y: -10 }}
        >
          🎉 {t("allPhotosShared")}
        </motion.p>
      )}
    </div>
  );
}

