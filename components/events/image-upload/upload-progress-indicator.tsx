import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import type { useTranslations } from "next-intl";
import {
  MAX_IMAGES_DIVISOR,
  MAX_PHOTOS_ALLOWED,
  PERCENTAGE_MULTIPLIER,
} from "./utils";

type UploadProgressIndicatorProps = {
  maxImages: number;
  isLoadingUserImages: boolean;
  t: ReturnType<typeof useTranslations>;
};

export function UploadProgressIndicator({
  maxImages,
  isLoadingUserImages,
  t,
}: UploadProgressIndicatorProps) {
  if (maxImages <= 0) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-none border-0 border-purple-500/20 bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-4 shadow-none backdrop-blur-xl sm:rounded-2xl sm:border sm:p-6 sm:shadow-md">
      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-purple-500/10 to-pink-500/10" />
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-500/20 p-3 backdrop-blur-sm">
              <Camera className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">
                {t("shareYourMoments")}
              </h3>
              <p className="text-gray-400 text-sm">{t("uploadPrompt")}</p>
            </div>
          </div>
          <div className="text-right">
            {isLoadingUserImages ? (
              <div className="space-y-1">
                <div className="h-9 w-16 animate-pulse rounded bg-gray-700/50" />
                <div className="h-4 w-20 animate-pulse rounded bg-gray-700/50" />
              </div>
            ) : (
              <>
                <div className="font-bold text-3xl text-white">{maxImages}</div>
                <div className="text-gray-400 text-sm">{t("photosLeft")}</div>
              </>
            )}
          </div>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800/50">
          {isLoadingUserImages ? (
            <div className="h-full w-full animate-pulse bg-gray-700/50" />
          ) : (
            <motion.div
              animate={{
                width: `${(maxImages / MAX_IMAGES_DIVISOR) * PERCENTAGE_MULTIPLIER}%`,
              }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: "100%" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          )}
        </div>
        {isLoadingUserImages ? (
          <div className="mt-2 h-3 w-32 animate-pulse rounded bg-gray-700/50" />
        ) : (
          <p className="mt-2 text-gray-500 text-xs">
            {MAX_PHOTOS_ALLOWED - maxImages} {t("of")} {MAX_PHOTOS_ALLOWED}{" "}
            {t("photosShared")}
          </p>
        )}
      </div>
    </div>
  );
}
