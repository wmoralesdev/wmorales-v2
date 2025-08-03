'use client';

import { Grid3x3, QrCode, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type LiveEventHeaderProps = {
  activeViewers: number;
  onShowQRCode: () => void;
  eventSlug: string;
  locale: string;
};

export function LiveEventHeader({
  activeViewers,
  onShowQRCode,
  eventSlug,
  locale,
}: LiveEventHeaderProps) {
  const t = useTranslations('events');
  const router = useRouter();

  const handleViewGallery = () => {
    router.push(`/${locale}/events/${eventSlug}/gallery`);
  };

  return (
    <div className="mb-4 sm:mb-8 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            LIVE
          </Badge>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Users className="h-4 w-4" />
            <span>
              {activeViewers} {t('watching')}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleViewGallery}
            variant="outline"
            className="border-gray-700 hover:bg-gray-800"
          >
            <Grid3x3 className="h-4 w-4 mr-2" />
            {t('viewGallery')}
          </Button>
          <Button
            onClick={onShowQRCode}
            variant="outline"
            className="border-purple-500/30 hover:bg-purple-500/10"
          >
            <QrCode className="h-4 w-4 mr-2" />
            {t('showQRCode')}
          </Button>
        </div>
      </div>
    </div>
  );
}