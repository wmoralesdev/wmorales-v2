import * as stylex from "@stylexjs/stylex";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { getAllEvents } from "@/lib/events";
import { colors, fonts, radii } from "@/lib/stylex/tokens.stylex";
import { EventsCarousel } from "./events-carousel";

const styles = stylex.create({
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  title: {
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    fontWeight: 400,
    textTransform: "uppercase",
    color: `color-mix(in oklch, ${colors.mutedForeground}, transparent 40%)`,
  },
  card: {
    position: "relative",
    display: "block",
    height: "12rem",
    width: "20rem",
    flexShrink: 0,
    overflow: "hidden",
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: `color-mix(in oklch, ${colors.border}, transparent 40%)`,
    transitionProperty: "border-color",
    transitionDuration: "150ms",
    ":hover": {
      borderColor: `color-mix(in oklch, ${colors.accent}, transparent 50%)`,
    },
    ":focus-visible": {
      outline: "none",
      boxShadow: `0 0 0 2px ${colors.accent}`,
    },
  },
  image: {
    objectFit: "cover",
    transitionProperty: "transform",
    transitionDuration: "200ms",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "flex-end",
    backgroundColor: `color-mix(in oklch, ${colors.background}, transparent 20%)`,
    opacity: 0,
    transitionProperty: "opacity",
    transitionDuration: "200ms",
  },
  overlayTitle: {
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    paddingInline: "0.75rem",
    paddingBottom: "0.75rem",
    fontFamily: fonts.display,
    fontSize: "0.875rem",
    fontWeight: 500,
    color: colors.foreground,
  },
});

export async function MinimalEventsMarquee() {
  const locale = await getLocale();
  const t = await getTranslations("homepage.events");
  const events = getAllEvents(locale);

  if (events.length === 0) {
    return null;
  }

  return (
    <section {...stylex.props(styles.section)}>
      <h2 {...stylex.props(styles.title)}>{t("title")}</h2>
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
      href={link}
      rel="noopener noreferrer"
      target="_blank"
      {...stylex.props(styles.card)}
    >
      <Image
        alt={title}
        fill
        sizes="320px"
        src={coverImage}
        data-wm-zoom
        {...stylex.props(styles.image)}
      />
      <div className="wm-hover-overlay" {...stylex.props(styles.overlay)}>
        <span {...stylex.props(styles.overlayTitle)}>{title}</span>
      </div>
    </a>
  );
}
