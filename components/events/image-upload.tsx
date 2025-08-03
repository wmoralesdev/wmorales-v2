'use client';

import {
  Camera,
  CloudUpload,
  ImageIcon,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { generateUploadURL } from '@/app/actions/events.actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { validateImageFile, createFilePreview } from './utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Input } from '../ui/input';
import Image from 'next/image';
import { compressImage, formatFileSize } from '@/lib/utils/image-compression';

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
  const t = useTranslations('events');
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
        toast.error(t('tooManyFiles', { max: maxImages }));
        return false;
      }

      for (const file of files) {
        const validation = validateImageFile(file);
        if (!validation.valid) {
          toast.error(validation.error || t('invalidFile'));
          continue;
        }

        validFiles.push(file);

        // Create preview
        try {
          const url = await createFilePreview(file);
          setPreviews((prev) => [...prev, { file, url }]);
        } catch (error) {
          console.error('Failed to create preview:', error);
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
      (item) => item.kind === 'file' && item.type.startsWith('image/')
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
      const imageFiles = files.filter((file) => file.type.startsWith('image/'));

      if (imageFiles.length > 0) {
        validateAndProcessFiles(imageFiles);
      } else {
        toast.error(t('selectImageFile'));
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
            .from('event-images')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false,
            });

          if (uploadError) {
            throw new Error(t('uploadImageError'));
          }

          // Get public URL
          const {
            data: { publicUrl },
          } = supabase.storage.from('event-images').getPublicUrl(filePath);

          // Call the parent upload handler with specific caption for this file
          const originalFileName =
            selectedFiles[compressedFiles.indexOf(file)].name;
          const fileCaption = captions[originalFileName] || '';
          await onUpload(publicUrl, fileCaption.trim() || undefined);

          successCount++;
        } catch (error) {
          errorCount++;
          console.error(`Failed to upload ${file.name}:`, error);
        }
      }

      // Show summary toast
      if (successCount > 0) {
        toast.success(t('uploadSuccess', { count: successCount }));
      }
      if (errorCount > 0) {
        toast.error(t('uploadErrors', { count: errorCount }));
      }

      // Reset form
      setSelectedFiles([]);
      setPreviews([]);
      setCaptions({});
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t('uploadImageError');
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
      fileInputRef.current.value = '';
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
        <div className="relative overflow-hidden rounded-none sm:rounded-2xl bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-4 sm:p-6 backdrop-blur-xl border-0 sm:border border-purple-500/20 shadow-none sm:shadow-md">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-pulse" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-500/20 backdrop-blur-sm">
                  <Camera className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">
                    {t('shareYourMoments')}
                  </h3>
                  <p className="text-gray-400 text-sm">{t('uploadPrompt')}</p>
                </div>
              </div>
              <div className="text-right">
                {isLoadingUserImages ? (
                  <div className="space-y-1">
                    <div className="h-9 w-16 bg-gray-700/50 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-gray-700/50 rounded animate-pulse" />
                  </div>
                ) : (
                  <>
                    <div className="text-3xl font-bold text-white">
                      {maxImages}
                    </div>
                    <div className="text-sm text-gray-400">
                      {t('photosLeft')}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-800/50 rounded-full overflow-hidden">
              {isLoadingUserImages ? (
                <div className="h-full w-full bg-gray-700/50 animate-pulse" />
              ) : (
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: '100%' }}
                  animate={{ width: `${(maxImages / 20) * 100}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              )}
            </div>
            {isLoadingUserImages ? (
              <div className="h-3 w-32 bg-gray-700/50 rounded animate-pulse mt-2" />
            ) : (
              <p className="text-xs text-gray-500 mt-2">
                {20 - maxImages} {t('of')} 20 {t('photosShared')}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Drag & Drop Zone */}
      <Card
        className={`transition-all duration-300 backdrop-blur-xl rounded-none sm:rounded-lg shadow-none sm:shadow-md ${
          isDragReject
            ? 'border-0 sm:border-2 border-red-500/50 bg-red-500/10'
            : isDragActive
              ? 'border-0 sm:border-2 border-purple-500/80 bg-purple-500/10 sm:shadow-lg sm:shadow-purple-500/20'
              : selectedFiles.length > 0
                ? 'border-0 sm:border-2 sm:border-dashed border-gray-800 bg-gray-900/80 hover:border-purple-500/30'
                : 'border-0 sm:border-2 sm:border-dashed border-gray-700 bg-gray-900/60 hover:border-purple-500/50 hover:bg-gray-900/80'
        } ${maxImages > 0 ? 'border-t sm:border-t-2' : ''}`}
      >
        <CardContent className="p-4 sm:p-8">
          {selectedFiles.length === 0 ? (
            <motion.div
              animate={isDragActive ? { scale: 1.02 } : { scale: 1 }}
              className={`cursor-pointer space-y-6 rounded-xl transition-all duration-300 ${
                isDragReject
                  ? 'bg-red-500/5'
                  : isDragActive
                    ? 'bg-purple-500/5'
                    : 'hover:bg-gray-800/30'
              }`}
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
                    className={`h-16 w-16 sm:h-20 sm:w-20 mb-6 ${
                      isDragReject
                        ? 'text-red-400'
                        : isDragActive
                          ? 'text-purple-400'
                          : 'text-gray-400'
                    }`}
                  />
                </motion.div>

                <div className="space-y-2">
                  <p
                    className={`font-bold text-xl ${
                      isDragReject
                        ? 'text-red-300'
                        : isDragActive
                          ? 'text-purple-300'
                          : 'text-white'
                    }`}
                  >
                    {isDragReject
                      ? t('invalidFileType')
                      : isDragActive
                        ? t('dropImageHere')
                        : t('dragDropOrClick')}
                  </p>

                  {!isDragActive && !isDragReject && (
                    <p className="text-purple-300 text-sm mt-1">
                      {t('joinTheFun')}
                    </p>
                  )}

                  <p className="text-gray-500 text-sm">
                    {t('supportedFormats')}: JPG, PNG, GIF, WebP
                  </p>

                  <p className="text-gray-500 text-xs">
                    {t('maxFileSize')}: 10MB • {t('maxFiles')}: {maxImages}
                  </p>
                </div>

                <Button
                  className="mt-4 bg-purple-500/20 text-purple-300 transition-all duration-300 hover:bg-purple-500/30 hover:text-purple-200"
                  disabled={isUploading}
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDropZoneClick();
                  }}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {t('selectImage')}
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 font-medium text-sm text-white">
                  {t('selectedFiles', { count: selectedFiles.length })}
                  <Sparkles className="h-3 w-3 text-purple-400" />
                </Label>
                <Button
                  disabled={isUploading}
                  onClick={handleRemoveAllFiles}
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-red-400"
                >
                  <X className="mr-1 h-3 w-3" />
                  {t('removeAll')}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-1">
                <AnimatePresence>
                  {previews.map((preview, index) => (
                    <motion.div
                      key={preview.file.name}
                      animate={{ opacity: 1, scale: 1 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="group relative aspect-[4/3]"
                    >
                      <Image
                        alt={preview.file.name}
                        className="h-full w-full rounded-lg border border-gray-800 object-cover transition-all duration-300 group-hover:border-purple-500/30"
                        src={preview.url}
                        width={150}
                        height={150}
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
                      <div className="absolute bottom-1 left-1 right-1 flex flex-col gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
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
                  ? t('maxFilesReached')
                  : t('addMoreImages', {
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
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-pink-600 hover:shadow-purple-500/25 disabled:cursor-not-allowed disabled:opacity-50 relative overflow-hidden group"
            disabled={
              selectedFiles.length === 0 ||
              isUploading ||
              compressionProgress !== null
            }
            onClick={handleUpload}
            size="lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            {compressionProgress ? (
              <>
                <ImageIcon className="mr-2 h-5 w-5 animate-pulse relative z-10" />
                <span className="relative z-10 text-lg">
                  Compressing... ({compressionProgress.current}/
                  {compressionProgress.total})
                </span>
              </>
            ) : isUploading ? (
              <>
                <Upload className="mr-2 h-5 w-5 animate-spin relative z-10" />
                <span className="relative z-10 text-lg">{t('uploading')}</span>
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5 relative z-10" />
                <span className="relative z-10 text-lg">
                  {selectedFiles.length === 1
                    ? t('sharePhoto')
                    : t('sharePhotos', { count: selectedFiles.length })}
                </span>
              </>
            )}
          </Button>

          {compressionProgress && (
            <div className="mt-2 space-y-1">
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                  style={{
                    width: `${(compressionProgress.current / compressionProgress.total) * 100}%`,
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
              initial={{ opacity: 0, y: -10 }}
              className="text-center text-yellow-400 text-sm font-medium mt-3"
            >
              🎉 {t('allPhotosShared')}
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
              {t('maxPhotosReachedUpload')}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </div>
  );
}
