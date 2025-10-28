import type { Event, EventContent } from "@prisma/client";
import { AlertTriangle, Sparkles } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  getEventBySlug,
  getUserEventImages,
} from "@/app/actions/events.actions";
import { BackToTop } from "@/components/common/backtotop";
import { InnerHero } from "@/components/common/inner-hero";
import { EventGallery } from "@/components/events/event-gallery";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/server";
import type { ExtendedEventImage } from "@/lib/types/event.types";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// Prisma type with includes
type EventWithContentAndImages = Event & {
  content: EventContent[];
  images: ExtendedEventImage[];
  contributors: number;
};

// Generate metadata for SEO
export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;

  try {
    const event = await getEventBySlug(slug);
    const eventContent =
      event.content.find((c) => c.language === locale) || event.content[0];

    return {
      title: eventContent.title,
      description: eventContent.description || "Event photo gallery",
    };
  } catch {
    return {
      title: "Event Not Found",
      description: "This event could not be found.",
    };
  }
}

// Server-side user images fetching
async function getUserImagesWithAuth(eventId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    return await getUserEventImages(eventId);
  } catch {
    return [];
  }
}

export default async function EventPage({ params }: Props) {
  const { locale, slug } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  // Get translations
  const t = await getTranslations("events");

  // Fetch event data first, then user images with the event ID
  const event = await getEventBySlug(slug);

  // Fetch user images for this specific event (Next.js 15 server-side advantage)
  const userImages = await getUserImagesWithAuth(event.id).then((images) =>
    images.map((img) => ({
      ...img,
      caption: img.caption || undefined,
      createdAt: img.createdAt,
    }))
  );

  const isEventEnded = event.endsAt && new Date() > event.endsAt;

  // Use the event directly since it now matches our Prisma type
  const eventForGallery: EventWithContentAndImages = {
    ...event,
    images: event.images.map((img) => ({
      ...img,
      caption: img.caption || null,
      profile: {
        name: img.profile.name || "Unknown",
        avatar: img.profile.avatar || undefined,
      },
    })),
  };

  return (
    <div className="min-h-screen">
      <InnerHero
        description={event.content[0].description || t("sharePhotos")}
        icon={Sparkles}
        title={event.content[0].title}
      />

      <div className="container mx-auto py-16 lg:px-4">
        {isEventEnded && (
          <Alert className="mb-6 border-yellow-500/30 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-300">
              {t("eventEnded")}
            </AlertDescription>
          </Alert>
        )}

        <EventGallery event={eventForGallery} initialUserImages={userImages} />
      </div>

      <BackToTop />
    </div>
  );
}
