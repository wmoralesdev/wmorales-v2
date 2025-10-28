"use client";

import { useTranslations } from "next-intl";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Constants
const MOBILE_BREAKPOINT = 640;
const QR_CODE_SIZE_MOBILE = 200;
const QR_CODE_SIZE_DESKTOP = 256;

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
  const t = useTranslations("events");

  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventUrl);
    toast.success(t("linkCopied"));
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-md border-gray-800 bg-gray-900/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            {t("shareEvent")}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {t("scanToJoin")}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-6">
          <div className="rounded-lg bg-white p-4">
            <QRCode
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
              size={
                typeof window !== "undefined" &&
                window.innerWidth < MOBILE_BREAKPOINT
                  ? QR_CODE_SIZE_MOBILE
                  : QR_CODE_SIZE_DESKTOP
              }
              value={eventUrl}
            />
          </div>
          <div className="w-full space-y-3">
            <p className="text-center text-gray-400 text-sm">
              {t("orShareLink")}
            </p>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-gray-300 text-sm"
                readOnly
                type="text"
                value={eventUrl}
              />
              <Button
                className="border-gray-700 hover:bg-gray-800"
                onClick={handleCopyLink}
                variant="outline"
              >
                {t("copy")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
