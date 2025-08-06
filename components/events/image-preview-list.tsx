'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ImagePreview = {
  file: File;
  url: string;
};

type ImagePreviewListProps = {
  previews: ImagePreview[];
  captions: { [key: string]: string };
  onCaptionChange: (fileName: string, caption: string) => void;
  onRemove: (file: File) => void;
};

export function ImagePreviewList({
  previews,
  captions,
  onCaptionChange,
  onRemove,
}: ImagePreviewListProps) {
  const t = useTranslations('events');

  if (previews.length === 0) return null;

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-sm font-medium text-gray-300">
        {t('selectedPhotos', { count: previews.length })}
      </h3>
      <AnimatePresence>
        {previews.map((preview, index) => (
          <motion.div
            key={preview.file.name + index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.2 }}
            className="flex gap-4 p-4 bg-gray-800/50 rounded-lg"
          >
            <div className="relative w-20 h-20 flex-shrink-0">
              <Image
                src={preview.url}
                alt={preview.file.name}
                fill
                className="object-cover rounded-md"
              />
              <button
                onClick={() => onRemove(preview.file)}
                className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-sm text-gray-300 truncate">
                {preview.file.name}
              </p>
              <div>
                <Label htmlFor={`caption-${index}`} className="sr-only">
                  {t('caption')}
                </Label>
                <Input
                  id={`caption-${index}`}
                  type="text"
                  placeholder={t('addCaption')}
                  value={captions[preview.file.name] || ''}
                  onChange={(e) =>
                    onCaptionChange(preview.file.name, e.target.value)
                  }
                  className="bg-gray-900 border-gray-700 text-sm h-8"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
