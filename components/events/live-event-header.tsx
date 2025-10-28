"use client";

import { Grid3x3, QrCode, Users } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  const t = useTranslations("events");

  return (
    <div className="mb-4 px-4 sm:mb-8 sm:px-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Badge className="border-green-500/30 bg-green-500/20 text-green-400">
            <span className="mr-1.5 h-2 w-2 animate-pulse rounded-full bg-green-400" />
            LIVE
          </Badge>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Users className="h-4 w-4" />
            <span>
              {activeViewers} {t("watching")}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            asChild
            className="border-gray-700 hover:bg-gray-800"
            variant="outline"
          >
            <Link href={`/${locale}/events/${eventSlug}/gallery`}>
              <Grid3x3 className="mr-2 h-4 w-4" />
              {t("viewGallery")}
            </Link>
          </Button>
          <Button
            className="border-purple-500/30 hover:bg-purple-500/10"
            onClick={onShowQRCode}
            variant="outline"
          >
            <QrCode className="mr-2 h-4 w-4" />
            {t("showQRCode")}
          </Button>
        </div>
      </div>
    </div>
  );
}
