"use client";

import type { Event, EventContent, EventImage } from "@prisma/client";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Calendar, Image, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNowLocalized } from "@/lib/utils";

export type EventWithContent = Event & {
  content: EventContent[];
  images: EventImage[];
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export function EventsList({ events }: { events: EventWithContent[] }) {
  const t = useTranslations("events");
  const locale = useLocale();

  if (events.length === 0) {
    return (
      <Card className="border-border bg-card/60 backdrop-blur-xl">
        <CardContent className="pt-6">
          <div className="text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-purple-600 opacity-50 dark:text-purple-400" />
            <p className="font-medium text-lg text-foreground">
              {t("noActiveEvents")}
            </p>
            <p className="mt-2 text-muted-foreground">{t("checkBackLater")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      animate="visible"
      className="space-y-0 sm:space-y-4"
      initial="hidden"
      variants={containerVariants}
    >
      {events.map((event) => (
        <motion.div key={event.id} variants={itemVariants}>
          <Link href={`/events/${event.slug}`}>
            <Card className="group cursor-pointer rounded-none border-0 border-border border-b bg-card/60 shadow-none backdrop-blur-xl transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 sm:rounded-lg sm:border sm:shadow-md">
              <CardHeader className="p-4 sm:px-6 md:py-0">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base text-foreground transition-colors group-hover:text-purple-600 dark:group-hover:text-purple-300 sm:text-lg">
                      {event.content[0].title}
                    </CardTitle>
                    <CardDescription className="mt-1 text-muted-foreground text-sm">
                      {event.content[0].description || t("sharePhotos")}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {event.endsAt && new Date() > event.endsAt ? (
                      <Badge
                        className="border-muted-foreground/30 bg-muted/10 text-muted-foreground text-xs"
                        variant="outline"
                      >
                        {t("ended")}
                      </Badge>
                    ) : (
                      <Badge
                        className="border-green-500/30 bg-green-500/10 text-green-600 text-xs dark:text-green-300"
                        variant="outline"
                      >
                        <span className="mr-1 h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                        LIVE
                      </Badge>
                    )}
                    <Badge
                      className="border-purple-500/30 bg-purple-500/10 text-purple-600 text-xs dark:text-purple-300"
                      variant="outline"
                    >
                      {t("photosCount", { count: event.images?.length ?? 0 })}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:px-6 sm:pt-0">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-xs sm:text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-purple-600 dark:text-purple-400 sm:h-4 sm:w-4" />
                      <span>
                        {formatDistanceToNowLocalized(
                          new Date(event.createdAt),
                          locale,
                          {
                            addSuffix: true,
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Image className="h-3 w-3 text-purple-600 dark:text-purple-400 sm:h-4 sm:w-4" />
                      <span>{t("maxPhotos", { count: event.maxImages })}</span>
                    </div>
                    {event.endsAt && new Date() < event.endsAt && (
                      <div className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-purple-600 dark:text-purple-400 sm:h-4 sm:w-4" />
                        <span>
                          {t("endsIn", {
                            time: formatDistanceToNowLocalized(
                              new Date(event.endsAt),
                              locale,
                              {
                                addSuffix: true,
                              }
                            ),
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 transition-all hover:from-purple-600 hover:to-purple-700 group-hover:shadow-purple-500/40 sm:w-auto"
                    size="sm"
                  >
                    {t("viewGallery")}
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
