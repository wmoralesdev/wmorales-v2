"use client";

import { Download, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { EventWithContentAndImages } from "../../lib/types/event.types";

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
  className = "",
}: PostEventHeaderProps) {
  const t = useTranslations("events");

  return (
    <Card
      className={`overflow-hidden rounded-none border-0 border-gray-800 bg-gray-900/80 shadow-none backdrop-blur-xl sm:rounded-lg sm:border sm:shadow-md ${className}`}
    >
      <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl sm:h-48 sm:w-48 lg:h-64 lg:w-64" />
      <CardHeader className="relative z-10 p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          <div>
            <CardTitle className="text-lg text-white sm:text-xl lg:text-2xl">
              <span className="block sm:inline">{event.content[0].title}</span>
              <Badge className="mt-2 ml-0 inline-flex border-gray-500/30 bg-gray-500/20 text-gray-300 sm:mt-0 sm:ml-2">
                {t("ended")}
              </Badge>
            </CardTitle>
            <CardDescription className="mt-2 text-gray-300 text-sm sm:text-base">
              {event.content[0].description}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              className="w-full border-purple-500/30 hover:bg-purple-500/10 sm:w-auto"
              onClick={onShare}
              size="sm"
              variant="outline"
            >
              <Share2 className="mr-2 h-4 w-4" />
              {t("share")}
            </Button>
            <Button
              className="w-full bg-purple-500 hover:bg-purple-600 sm:w-auto"
              disabled={isDownloading || event.images.length === 0}
              onClick={onDownloadAll}
              size="sm"
            >
              <Download className="mr-2 h-4 w-4" />
              {t("downloadAll")}
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
