'use client';

import { CloudUpload, Image as ImageIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

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
  className = '',
}: ImageUploadDropzoneProps) {
  const t = useTranslations('events');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    onFilesSelected(Array.from(files));
  };

  return (
    <div
      className={cn(
        'relative border-2 border-dashed rounded-lg p-6 sm:p-8 transition-all cursor-pointer',
        isDragActive && !isDragReject
          ? 'border-purple-500 bg-purple-500/10'
          : isDragReject
            ? 'border-red-500 bg-red-500/10'
            : 'border-gray-700 hover:border-gray-600 bg-gray-800/50',
        className
      )}
      onClick={() => fileInputRef.current?.click()}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isLoadingUserImages}
      />

      <div className="text-center">
        {isDragActive ? (
          isDragReject ? (
            <>
              <ImageIcon className="h-12 w-12 text-red-400 mx-auto mb-3" />
              <p className="text-red-400 text-sm">{t('onlyImageFiles')}</p>
            </>
          ) : (
            <>
              <CloudUpload className="h-12 w-12 text-purple-400 mx-auto mb-3 animate-pulse" />
              <p className="text-purple-300 text-sm">{t('dropToUpload')}</p>
            </>
          )
        ) : (
          <>
            <CloudUpload className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-300 text-sm sm:text-base mb-2">
              {t('dragPhotosHere')}
            </p>
            <p className="text-gray-500 text-xs sm:text-sm">
              {t('orClickToSelect', { max: maxImages })}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
