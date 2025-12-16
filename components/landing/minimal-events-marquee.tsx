import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { getAllEvents } from "@/lib/events";
import { EventsCarousel } from "./events-carousel";

export async function MinimalEventsMarquee() {
  const locale = await getLocale();
  const t = await getTranslations("homepage.events");
  const events = getAllEvents(locale);

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="space-y-5">
      <h2 className="font-mono text-xs font-normal uppercase tracking-[0.2em] text-muted-foreground/60">
        {t("title")}
      </h2>
      <EventsCarousel>
        {events.map((event) => (
          <EventCard
            key={event.slug}
            coverImage={event.coverImage}
            link={event.link}
            title={event.title}
          />
        ))}
      </EventsCarousel>
    </section>
  );
}

function EventCard({
  title,
  coverImage,
  link,
}: {
  title: string;
  coverImage: string;
  link: string;
}) {
  return (
    <a
      className="group relative block h-40 w-64 shrink-0 overflow-hidden rounded-md border border-border/60 transition-colors hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      href={link}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Image
        alt={title}
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        fill
        sizes="256px"
        src={coverImage}
      />
      {/* Overlay on hover/focus */}
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        <span className="w-full truncate px-3 pb-3 font-display text-sm font-medium text-foreground">
          {title}
        </span>
      </div>
    </a>
  );
}
