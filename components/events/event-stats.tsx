"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatDistanceToNowLocalized } from "@/lib/utils";
import type { EventStatsData } from "../../lib/types/event.types";

type EventStatsProps = {
  stats: EventStatsData;
  locale: string;
  variant?: "live" | "post";
  className?: string;
};

export function EventStats({
  stats,
  locale,
  variant = "live",
  className = "",
}: EventStatsProps) {
  const t = useTranslations("events");

  if (variant === "live") {
    return (
      <Card
        className={cn(
          "rounded-none border-0 border-gray-800 border-t bg-gray-900/80 shadow-none backdrop-blur-xl sm:rounded-lg sm:border sm:border-t-0 sm:shadow-md",
          className
        )}
      >
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="font-bold text-3xl text-white">
                {stats.totalPhotos}
              </p>
              <p className="text-gray-400 text-sm">{t("totalPhotos")}</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-3xl text-purple-400">
                {stats.contributors}
              </p>
              <p className="text-gray-400 text-sm">{t("contributors")}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Post-event variant with 3 columns
  return (
    <div className={`grid grid-cols-3 gap-2 sm:gap-4 ${className}`}>
      <div className="rounded-lg bg-gray-800/50 p-2 text-center sm:p-3">
        <p className="font-bold text-lg text-white sm:text-xl lg:text-2xl">
          {stats.totalPhotos}
        </p>
        <p className="text-gray-400 text-xs sm:text-sm">{t("totalPhotos")}</p>
      </div>
      <div className="rounded-lg bg-gray-800/50 p-2 text-center sm:p-3">
        <p className="font-bold text-lg text-white sm:text-xl lg:text-2xl">
          {stats.contributors}
        </p>
        <p className="text-gray-400 text-xs sm:text-sm">{t("contributors")}</p>
      </div>
      <div className="rounded-lg bg-gray-800/50 p-2 text-center sm:p-3">
        <p className="font-bold text-white text-xs sm:text-sm lg:text-base">
          {formatDistanceToNowLocalized(
            stats.eventDate || stats.createdAt,
            locale,
            {
              addSuffix: true,
            }
          )}
        </p>
        <p className="text-gray-400 text-xs sm:text-sm">{t("eventDate")}</p>
      </div>
    </div>
  );
}
