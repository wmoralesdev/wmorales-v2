'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import QRCode from 'react-qr-code';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type QRCodeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventUrl: string;
};

export function QRCodeDialog({
  open,
  onOpenChange,
  eventUrl,
}: QRCodeDialogProps) {
  const t = useTranslations('events');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventUrl);
    toast.success(t('linkCopied'));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-gray-800 bg-gray-900/95 backdrop-blur-xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            {t('shareEvent')}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {t('scanToJoin')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-6">
          <div className="bg-white p-4 rounded-lg">
            <QRCode
              value={eventUrl}
              size={
                typeof window !== 'undefined' && window.innerWidth < 640
                  ? 200
                  : 256
              }
              level="H"
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
          <div className="w-full space-y-3">
            <p className="text-sm text-gray-400 text-center">
              {t('orShareLink')}
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={eventUrl}
                readOnly
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300"
              />
              <Button
                onClick={handleCopyLink}
                variant="outline"
                className="border-gray-700 hover:bg-gray-800"
              >
                {t('copy')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
