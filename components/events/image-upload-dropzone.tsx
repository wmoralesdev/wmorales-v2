"use client";

import { CloudUpload, Image as ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type ImageUploadDropzoneProps = {
  onFilesSelected: (files: File[]) => void;
  isDragActive: boolean;
  isDragReject: boolean;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  maxImages: number;
  isLoadingUserImages?: boolean;
  className?: string;
};

export function ImageUploadDropzone({
  onFilesSelected,
  isDragActive,
  isDragReject,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  maxImages,
  isLoadingUserImages = false,
  className = "",
}: ImageUploadDropzoneProps) {
  const t = useTranslations("events");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }
    onFilesSelected(Array.from(files));
  };

  const getBorderClassName = () => {
    if (isDragActive && !isDragReject) {
      return "border-purple-500 bg-purple-500/10";
    }
    if (isDragReject) {
      return "border-red-500 bg-red-500/10";
    }
    return "border-gray-700 bg-gray-800/50 hover:border-gray-600";
  };

  return (
    <button
      className={cn(
        "relative cursor-pointer rounded-lg border-2 border-dashed p-6 transition-all sm:p-8",
        getBorderClassName(),
        className
      )}
      onClick={() => fileInputRef.current?.click()}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      type="button"
    >
      <input
        accept="image/*"
        className="hidden"
        disabled={isLoadingUserImages}
        multiple
        onChange={handleFileSelect}
        ref={fileInputRef}
        type="file"
      />

      <div className="text-center">
        {isDragActive ? (
          isDragReject ? (
            <>
              <ImageIcon className="mx-auto mb-3 h-12 w-12 text-red-400" />
              <p className="text-red-400 text-sm">{t("onlyImageFiles")}</p>
            </>
          ) : (
            <>
              <CloudUpload className="mx-auto mb-3 h-12 w-12 animate-pulse text-purple-400" />
              <p className="text-purple-300 text-sm">{t("dropToUpload")}</p>
            </>
          )
        ) : (
          <>
            <CloudUpload className="mx-auto mb-3 h-12 w-12 text-gray-500" />
            <p className="mb-2 text-gray-300 text-sm sm:text-base">
              {t("dragPhotosHere")}
            </p>
            <p className="text-gray-500 text-xs sm:text-sm">
              {t("orClickToSelect", { max: maxImages })}
            </p>
          </>
        )}
      </div>
    </button>
  );
}
