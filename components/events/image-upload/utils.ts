import type { useTranslations } from "next-intl";

// Constants
export const MAX_IMAGES_DIVISOR = 20;
export const PERCENTAGE_MULTIPLIER = 100;
export const MAX_PHOTOS_ALLOWED = 20;
export const ANIMATION_DELAY_INCREMENT = 0.05;
export const ANIMATION_DURATION_SHORT = 0.2;

// Helper functions for className generation
export const getCardClassName = (
  isDragReject: boolean,
  isDragActive: boolean,
  selectedFilesLength: number,
  _maxImages: number
) => {
  const baseClasses =
    "rounded-none shadow-none backdrop-blur-xl transition-all duration-300 sm:rounded-lg sm:shadow-md";

  if (isDragReject) {
    return `${baseClasses} border-0 border-red-500/50 bg-red-500/10 sm:border-2`;
  }
  if (isDragActive) {
    return `${baseClasses} border-0 border-purple-500/80 bg-purple-500/10 sm:border-2 sm:shadow-lg sm:shadow-purple-500/20`;
  }
  if (selectedFilesLength > 0) {
    return `${baseClasses} border-0 border-gray-800 bg-gray-900/80 hover:border-purple-500/30 sm:border-2 sm:border-dashed`;
  }
  return `${baseClasses} border-0 border-gray-700 bg-gray-900/60 hover:border-purple-500/50 hover:bg-gray-900/80 sm:border-2 sm:border-dashed`;
};

export const getBottomBorderClassName = (maxImages: number) =>
  maxImages > 0 ? "border-t sm:border-t-2" : "";

export const getInnerDivClassName = (
  isDragReject: boolean,
  isDragActive: boolean
) => {
  if (isDragReject) {
    return "bg-red-500/5";
  }
  if (isDragActive) {
    return "bg-purple-500/5";
  }
  return "hover:bg-gray-800/30";
};

export const getIconClassName = (
  isDragReject: boolean,
  isDragActive: boolean
) => {
  if (isDragReject) {
    return "text-red-400";
  }
  if (isDragActive) {
    return "text-purple-400";
  }
  return "text-gray-400";
};

export const getTitleClassName = (
  isDragReject: boolean,
  isDragActive: boolean
) => {
  if (isDragReject) {
    return "text-red-300";
  }
  if (isDragActive) {
    return "text-purple-300";
  }
  return "text-white";
};

export const getDropZoneText = (
  isDragReject: boolean,
  isDragActive: boolean,
  t: ReturnType<typeof useTranslations>
) => {
  if (isDragReject) {
    return t("invalidFileType");
  }
  if (isDragActive) {
    return t("dropImageHere");
  }
  return t("dragDropOrClick");
};
