import { HalftoneIcon } from "@/components/halftone-icon";
import { HalftonePhoto } from "@/components/halftone-photo";
import { Reveal } from "@/components/motion/reveal";
import { type CommunityEvent, events, photos } from "@/lib/site";

type Tile =
  | { type: "heading"; tone: string }
  | {
      type: "stat";
      value: number;
      suffix: string;
      caption: string;
      tone: string;
    }
  | { type: "event"; event: CommunityEvent; tone: string }
  | { type: "icon"; tone: string };

const event = (name: string) => {
  const found = events.find((e) => e.name === name);
  if (!found) throw new Error(`Unknown event: ${name}`);
  return found;
};

// 12 cells: a 4x3 grid on desktop, 2x6 on phones. Each event opens its album.
const tiles: Tile[] = [
  { type: "heading", tone: "bg-ink text-paper" },
  {
    type: "event",
    event: event("Cursor Hackathon II"),
    tone: "bg-lilac text-ink",
  },
  {
    type: "stat",
    value: 550,
    suffix: "+",
    caption: "builders en la comunidad",
    tone: "bg-accent text-paper",
  },
  {
    type: "event",
    event: event("Cafe Cursor III"),
    tone: "bg-surface text-ink",
  },
  { type: "event", event: event("Cursor Meetup"), tone: "bg-surface text-ink" },
  {
    type: "stat",
    value: 450,
    suffix: "+",
    caption: "asistentes presenciales en 2025",
    tone: "bg-lilac text-ink",
  },
  {
    type: "event",
    event: event("Cursor Workshop"),
    tone: "bg-lilac text-ink",
  },
  { type: "icon", tone: "bg-ink text-accent" },
  { type: "event", event: event("Cafe Cursor I"), tone: "bg-lilac text-ink" },
  {
    type: "event",
    event: event("Cursor Hackathon"),
    tone: "bg-surface text-ink",
  },
  {
    type: "stat",
    value: events.length,
    suffix: "",
    caption: "eventos desde 2025",
    tone: "bg-accent text-paper",
  },
  {
    type: "event",
    event: event("Cafe Cursor II"),
    tone: "bg-surface text-ink",
  },
];

const big =
  "display text-[calc(15vw*var(--display-fit)*var(--display-scale))] leading-none sm:text-[calc(clamp(2.75rem,6.4vw,7rem)*var(--display-fit)*var(--display-scale))]";
const caption =
  "absolute inset-x-3 bottom-3 text-center text-small leading-tight sm:bottom-[18px]";

export function Community() {
  return (
    <Reveal
      as="section"
      id="comunidad"
      aria-labelledby="comunidad-title"
      className="px-2 pb-2 md:pb-2"
    >
      <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-2">
        {tiles.map((t, i) => (
          <li
            key={t.type === "event" ? t.event.name : `${t.type}-${i}`}
            data-reveal={t.type === "event" ? undefined : ""}
            className={`relative aspect-square overflow-clip ${t.tone}`}
          >
            {t.type === "event" ? (
              <a
                href={t.event.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${t.event.name}, ${t.event.year}: ver álbum de fotos`}
                className="group/event flex size-full flex-col"
              >
                <div className="relative flex-1">
                  <HalftonePhoto
                    photo={photos[t.event.photo]}
                    tone={t.tone}
                    fill
                    sizes="(min-width: 640px) 25vw, 50vw"
                  />
                </div>
                <p className="flex items-baseline justify-between gap-2 px-3 py-2.5 text-small leading-tight">
                  <span className="font-semibold group-hover/event:underline">
                    {t.event.name}
                  </span>
                  <span className="tabular-nums opacity-70">
                    {t.event.year}
                  </span>
                </p>
              </a>
            ) : t.type === "heading" ? (
              <div className="grid size-full place-items-center">
                <h2
                  id="comunidad-title"
                  className="display text-[calc(7vw*var(--display-fit)*var(--display-scale))] leading-none sm:text-[calc(clamp(1.75rem,3.3vw,3.75rem)*var(--display-fit)*var(--display-scale))]"
                >
                  Comunidad
                </h2>
                <span className={caption}>Cursor El Salvador</span>
              </div>
            ) : t.type === "stat" ? (
              <div className="grid size-full place-items-center">
                <p className={big}>
                  <span data-count={t.value}>{t.value}</span>
                  {t.suffix}
                </p>
                <span className={caption}>{t.caption}</span>
              </div>
            ) : (
              <div className="grid size-full place-items-center">
                <HalftoneIcon
                  shape={["heart", "chat", "sparkle", "cursor"]}
                  grid={11}
                  motion="morph"
                  className="w-1/2"
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
