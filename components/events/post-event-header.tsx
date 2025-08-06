'use client';

import { Download, Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { EventWithContentAndImages } from '../../lib/types/event.types';

type PostEventHeaderProps = {
  event: EventWithContentAndImages;
  onShare: () => void;
  onDownloadAll: () => void;
  isDownloading: boolean;
  className?: string;
};

export function PostEventHeader({
  event,
  onShare,
  onDownloadAll,
  isDownloading,
  className = '',
}: PostEventHeaderProps) {
  const t = useTranslations('events');

  return (
    <Card
      className={`border-0 sm:border border-gray-800 bg-gray-900/80 backdrop-blur-xl overflow-hidden rounded-none sm:rounded-lg shadow-none sm:shadow-md ${className}`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-purple-500/10 rounded-full blur-3xl" />
      <CardHeader className="relative z-10 p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          <div>
            <CardTitle className="text-lg sm:text-xl lg:text-2xl text-white">
              <span className="block sm:inline">{event.content[0].title}</span>
              <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30 ml-0 sm:ml-2 mt-2 sm:mt-0 inline-flex">
                {t('ended')}
              </Badge>
            </CardTitle>
            <CardDescription className="text-gray-300 mt-2 text-sm sm:text-base">
              {event.content[0].description}
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={onShare}
              size="sm"
              variant="outline"
              className="border-purple-500/30 hover:bg-purple-500/10 w-full sm:w-auto"
            >
              <Share2 className="h-4 w-4 mr-2" />
              {t('share')}
            </Button>
            <Button
              onClick={onDownloadAll}
              disabled={isDownloading || event.images.length === 0}
              size="sm"
              className="bg-purple-500 hover:bg-purple-600 w-full sm:w-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              {t('downloadAll')}
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
