"use client";

import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "../../ui/input";
import { DropZoneEmpty } from "./drop-zone-empty";
import { SelectedFilesList } from "./selected-files-list";
import { UploadButton } from "./upload-button";
import { UploadProgressIndicator } from "./upload-progress-indicator";
import { useImageUpload } from "./use-image-upload";
import { getBottomBorderClassName, getCardClassName } from "./utils";

type ImageUploadProps = {
  onUpload: (imageUrl: string, caption?: string) => Promise<void>;
  uploading: boolean;
  maxImages: number;
  slug: string;
  isLoadingUserImages?: boolean;
};

export function ImageUpload({
  onUpload,
  uploading,
  maxImages,
  slug,
  isLoadingUserImages = false,
}: ImageUploadProps) {
  const t = useTranslations("events");

  const {
    selectedFiles,
    previews,
    uploadingFile,
    isDragActive,
    isDragReject,
    compressionProgress,
    fileInputRef,
    handleFileSelect,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleUpload,
    handleRemoveFile,
    handleRemoveAllFiles,
    handleDropZoneClick,
  } = useImageUpload({ maxImages, slug, onUpload });

  const isUploading = uploading || uploadingFile;

  return (
    <div className="space-y-0 sm:space-y-4">
      <UploadProgressIndicator
        isLoadingUserImages={isLoadingUserImages}
        maxImages={maxImages}
        t={t}
      />

      <Card
        className={`${getCardClassName(isDragReject, isDragActive, selectedFiles.length, maxImages)} ${getBottomBorderClassName(maxImages)}`}
      >
        <CardContent className="p-4 sm:p-8">
          {selectedFiles.length === 0 ? (
            <DropZoneEmpty
              isDragActive={isDragActive}
              isDragReject={isDragReject}
              isUploading={isUploading}
              maxImages={maxImages}
              onClick={handleDropZoneClick}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              t={t}
            />
          ) : (
            <SelectedFilesList
              isUploading={isUploading}
              maxImages={maxImages}
              onClick={handleDropZoneClick}
              onRemoveAllFiles={handleRemoveAllFiles}
              onRemoveFile={handleRemoveFile}
              previews={previews}
              selectedFiles={selectedFiles}
              t={t}
            />
          )}

          <Input
            accept="image/*"
            className="hidden"
            disabled={isUploading}
            id="image-upload"
            multiple
            onChange={handleFileSelect}
            ref={fileInputRef}
            type="file"
          />
        </CardContent>
      </Card>

      <UploadButton
        compressionProgress={compressionProgress}
        isUploading={isUploading}
        maxImages={maxImages}
        onClick={handleUpload}
        selectedFilesLength={selectedFiles.length}
        t={t}
      />

      {maxImages <= 0 && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
        >
          <Alert className="border-yellow-500/30 bg-yellow-500/10 backdrop-blur-sm">
            <ImageIcon className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-300">
              {t("maxPhotosReachedUpload")}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </div>
  );
}

