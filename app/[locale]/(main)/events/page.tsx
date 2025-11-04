import { Sparkles } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

import { getActiveEvents } from "@/app/actions/events.actions";
import { EventsList } from "@/components/events/events-list";

// Force dynamic rendering to avoid database calls during build
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function EventsPage({ params }: Props) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const events = await getActiveEvents();

  // Get translations
  const t = await getTranslations("events");
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="mx-auto px-0 pt-20 pb-12 sm:container sm:px-4 sm:pt-24 sm:pb-16">
        <div className="mb-6 px-4 sm:mb-8 sm:px-0">
          <h1 className="bg-gradient-to-r from-foreground via-purple-200 to-purple-400 bg-clip-text font-bold text-2xl text-transparent tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-2 text-muted-foreground text-sm sm:text-base">
            {t("description")}
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sparkles className="h-5 w-5 animate-pulse text-purple-600 dark:text-purple-400" />
                {t("loadingEvents")}
              </div>
            </div>
          }
        >
          <EventsList events={events} />
        </Suspense>
      </div>
    </div>
  );
}
