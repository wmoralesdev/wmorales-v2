"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  CloudUpload,
  ImageIcon,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { generateUploadURL } from "@/app/actions/events.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/celebrt";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { compressImage, formatFileSize } from "@/lib/utils/image-compression";
import { Input } from "../ui/input";
import { createFilePreview, validateImageFile } from "./utils";

// Constants
const MAX_IMAGES_DIVISOR = 20;
const PERCENTAGE_MULTIPLIER = 100;
const MAX_PHOTOS_ALLOWED = 20;
const ANIMATION_DELAY_INCREMENT = 0.05;
const ANIMATION_DURATION_SHORT = 0.2;

// Helper functions for className generation
const getCardClassName = (
  isDragReject: boolean,
  isDragActive: boolean,
  selectedFilesLength: number,
  _maxImages: number
) => {
  const baseClasses = "rounded-none shadow-none backdrop-blur-xl transition-all duration-300 sm:rounded-lg sm:shadow-md";
  
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

const getBottomBorderClassName = (maxImages: number) => 
  maxImages > 0 ? "border-t sm:border-t-2" : "";

const getInnerDivClassName = (isDragReject: boolean, isDragActive: boolean) => {
  if (isDragReject) {
    return "bg-red-500/5";
  }
  if (isDragActive) {
    return "bg-purple-500/5";
  }
  return "hover:bg-gray-800/30";
};

const getIconClassName = (isDragReject: boolean, isDragActive: boolean) => {
  if (isDragReject) {
    return "text-red-400";
  }
  if (isDragActive) {
    return "text-purple-400";
  }
  return "text-gray-400";
};

const getTitleClassName = (isDragReject: boolean, isDragActive: boolean) => {
  if (isDragReject) {
    return "text-red-300";
  }
  if (isDragActive) {
    return "text-purple-300";
  }
  return "text-white";
};

const getDropZoneText = (isDragReject: boolean, isDragActive: boolean, t: any) => {
  if (isDragReject) {
    return t("invalidFileType");
  }
  if (isDragActive) {
    return t("dropImageHere");
  }
  return t("dragDropOrClick");
};

const getButtonContent = (
  compressionProgress: { current: number; total: number } | null,
  isUploading: boolean,
  selectedFilesLength: number,
  t: any
) => {
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
        {selectedFilesLength === 1 ? t("sharePhoto") : t("sharePhotos", { count: selectedFilesLength })}
      </span>
    </>
  );
};

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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [captions, setCaptions] = useState<{ [key: string]: string }>({});
  const [uploadingFile, setUploadingFile] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isDragReject, setIsDragReject] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFiles = useCallback(
    async (files: File[]) => {
      const validFiles: File[] = [];

      // Check if adding these files would exceed the limit
      if (selectedFiles.length + files.length > maxImages) {
        toast.error(t("tooManyFiles", { max: maxImages }));
        return false;
      }

      for (const file of files) {
        const validation = validateImageFile(file);
        if (!validation.valid) {
          toast.error(validation.error || t("invalidFile"));
          continue;
        }

        validFiles.push(file);

        // Create preview
        try {
          const url = await createFilePreview(file);
          setPreviews((prev) => [...prev, { file, url }]);
        } catch (error) {
          console.error("Failed to create preview:", error);
        }
      }

      if (validFiles.length > 0) {
        setSelectedFiles((prev) => [...prev, ...validFiles]);
        return true;
      }
      return false;
    },
    [t, selectedFiles.length, maxImages]
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    validateAndProcessFiles(Array.from(files));
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const items = Array.from(e.dataTransfer.items);
    const hasImageFile = items.some(
      (item) => item.kind === "file" && item.type.startsWith("image/")
    );

    setIsDragActive(true);
    setIsDragReject(!hasImageFile);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only reset if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragActive(false);
      setIsDragReject(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setIsDragActive(false);
      setIsDragReject(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));

      if (imageFiles.length > 0) {
        validateAndProcessFiles(imageFiles);
      } else {
        toast.error(t("selectImageFile"));
      }
    },
    [validateAndProcessFiles, t]
  );

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      return;
    }

    try {
      setUploadingFile(true);
      const supabase = createClient();
      let successCount = 0;
      let errorCount = 0;

      // First, compress all images
      setCompressionProgress({ current: 0, total: selectedFiles.length });
      const compressedFiles: File[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        try {
          const compressedFile = await compressImage(file);
          compressedFiles.push(compressedFile);
          setCompressionProgress({
            current: i + 1,
            total: selectedFiles.length,
          });
        } catch (error) {
          console.error(`Failed to compress ${file.name}:`, error);
          // Use original file if compression fails
          compressedFiles.push(file);
        }
      }

      // Clear compression progress
      setCompressionProgress(null);

      // Upload compressed files sequentially to avoid overwhelming the server
      for (const file of compressedFiles) {
        try {
          // Get upload URL from server
          const { filePath } = await generateUploadURL(slug, file.name);

          // Upload to Supabase storage
          const { error: uploadError } = await supabase.storage
            .from("event-images")
            .upload(filePath, file, {
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) {
            throw new Error(t("uploadImageError"));
          }

          // Get public URL
          const {
            data: { publicUrl },
          } = supabase.storage.from("event-images").getPublicUrl(filePath);

          // Call the parent upload handler with specific caption for this file
          const originalFileName =
            selectedFiles[compressedFiles.indexOf(file)].name;
          const fileCaption = captions[originalFileName] || "";
          await onUpload(publicUrl, fileCaption.trim() || undefined);

          successCount++;
        } catch (error) {
          errorCount++;
          console.error(`Failed to upload ${file.name}:`, error);
        }
      }

      // Show summary toast
      if (successCount > 0) {
        toast.success(t("uploadSuccess", { count: successCount }));
      }
      if (errorCount > 0) {
        toast.error(t("uploadErrors", { count: errorCount }));
      }

      // Reset form
      setSelectedFiles([]);
      setPreviews([]);
      setCaptions({});
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("uploadImageError");
      toast.error(message);
    } finally {
      setUploadingFile(false);
      setCompressionProgress(null);
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setSelectedFiles((prev) => prev.filter((f) => f !== fileToRemove));
    setPreviews((prev) => prev.filter((p) => p.file !== fileToRemove));
    setCaptions((prev) => {
      const newCaptions = { ...prev };
      delete newCaptions[fileToRemove.name];
      return newCaptions;
    });
  };

  const handleRemoveAllFiles = () => {
    setSelectedFiles([]);
    setPreviews([]);
    setCaptions({});
    setIsDragActive(false);
    setIsDragReject(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isUploading = uploading || uploadingFile;

  const handleDropZoneClick = () => {
    if (!isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-0 sm:space-y-4">
      {/* Upload Progress Indicator */}
      {maxImages > 0 && (
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
                    <div className="font-bold text-3xl text-white">
                      {maxImages}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {t("photosLeft")}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Progress Bar */}
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
      )}

      {/* Drag & Drop Zone */}
      <Card
        className={`${getCardClassName(isDragReject, isDragActive, selectedFiles.length, maxImages)} ${getBottomBorderClassName(maxImages)}`}
      >
        <CardContent className="p-4 sm:p-8">
          {selectedFiles.length === 0 ? (
            <motion.div
              animate={isDragActive ? { scale: 1.02 } : { scale: 1 }}
              className={`cursor-pointer space-y-6 rounded-xl transition-all duration-300 ${getInnerDivClassName(isDragReject, isDragActive)}`}
              onClick={handleDropZoneClick}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <motion.div
                  animate={
                    isDragActive
                      ? { rotate: 180, scale: 1.1 }
                      : { rotate: 0, scale: 1 }
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
                    <p className="mt-1 text-purple-300 text-sm">
                      {t("joinTheFun")}
                    </p>
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
                    handleDropZoneClick();
                  }}
                  variant="outline"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {t("selectImage")}
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 font-medium text-sm text-white">
                  {t("selectedFiles", { count: selectedFiles.length })}
                  <Sparkles className="h-3 w-3 text-purple-400" />
                </Label>
                <Button
                  className="text-gray-400 hover:text-red-400"
                  disabled={isUploading}
                  onClick={handleRemoveAllFiles}
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
                        onClick={() => handleRemoveFile(preview.file)}
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
                onClick={handleDropZoneClick}
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
          )}

          {/* Hidden file input */}
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

      {/* Upload Button */}
      {selectedFiles.length > 0 && (
        <div className="mt-6">
          <Button
            className="group relative w-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-pink-600 hover:shadow-purple-500/25 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={
              selectedFiles.length === 0 ||
              isUploading ||
              compressionProgress !== null
            }
            onClick={handleUpload}
            size="lg"
          >
            <div className="absolute inset-0 translate-y-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 transition-transform duration-300 group-hover:translate-y-0" />
            {getButtonContent(compressionProgress, isUploading, selectedFiles.length, t)}
          </Button>

          {compressionProgress && (
            <div className="mt-2 space-y-1">
              <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                  style={{
                    width: `${
                      (compressionProgress.current /
                        compressionProgress.total) *
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
      )}

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
