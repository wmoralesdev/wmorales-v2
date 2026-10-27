import { HalftoneIcon } from "@/components/halftone-icon";
import { HalftonePhoto } from "@/components/halftone-photo";
import { Reveal } from "@/components/motion/reveal";
import type { Localized } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/server";
import { type CommunityEvent, events, photo, stats } from "@/lib/site";

type Tile =
  | { type: "heading"; tone: string }
  | {
      type: "stat";
      value: number;
      suffix: string;
      caption: Localized<string>;
      tone: string;
    }
  | { type: "event"; event: CommunityEvent; tone: string }
  | { type: "icon"; tone: string };

// Stat tiles read the same numbers the rest of the site shows.
const stat = (value: number) => {
  const found = stats.find((s) => s.value === value);
  if (!found) throw new Error(`Unknown stat: ${value}`);
  return { type: "stat" as const, ...found, caption: found.label };
};

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
  { ...stat(1), tone: "bg-accent text-snow" },
  {
    type: "event",
    event: event("Cafe Cursor III"),
    tone: "bg-surface text-ink",
  },
  { type: "event", event: event("Cursor Meetup"), tone: "bg-surface text-ink" },
  { ...stat(3), tone: "bg-lilac text-ink" },
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
  { ...stat(75), tone: "bg-accent text-snow" },
  {
    type: "event",
    event: event("Cafe Cursor II"),
    tone: "bg-surface text-ink",
  },
];

const big =
  "display text-[15vw] leading-none sm:text-[clamp(2.75rem,6.4vw,7rem)]";
const caption =
  "absolute inset-x-3 bottom-3 text-center text-small leading-tight sm:bottom-[18px]";

export async function Community() {
  const t = await getDictionary();
  return (
    <Reveal
      as="section"
      id="comunidad"
      aria-labelledby="comunidad-title"
      className="px-2 pb-2 sm:px-3 sm:pb-3"
    >
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {tiles.map((tile, i) => (
          <li
            key={tile.type === "event" ? tile.event.name : `${tile.type}-${i}`}
            data-reveal={tile.type === "event" ? undefined : ""}
            className={`relative aspect-square overflow-clip ${tile.tone}`}
          >
            {tile.type === "event" ? (
              <a
                href={tile.event.href}
                target="_blank"
                rel="noreferrer"
                aria-label={t.community.album(tile.event.name, tile.event.year)}
                className="group/event flex size-full flex-col"
              >
                <div className="relative flex-1">
                  <HalftonePhoto
                    photo={photo(tile.event.photo, t.lang)}
                    tone={tile.tone}
                    fill
                    sizes="(min-width: 640px) 25vw, 50vw"
                  />
                </div>
                <p className="flex items-baseline justify-between gap-2 px-3 py-2.5 text-small leading-tight">
                  <span className="font-semibold group-hover/event:underline">
                    {tile.event.name}
                  </span>
                  <span className="tabular-nums opacity-70">
                    {tile.event.year}
                  </span>
                </p>
              </a>
            ) : tile.type === "heading" ? (
              <div className="grid size-full place-items-center">
                <h2
                  id="comunidad-title"
                  className="display text-[7vw] leading-none sm:text-[clamp(1.75rem,3.3vw,3.75rem)]"
                >
                  {t.community.title}
                </h2>
                <span className={caption}>Cursor El Salvador</span>
              </div>
            ) : tile.type === "stat" ? (
              <div className="grid size-full place-items-center">
                <p className={big}>
                  <span data-count={tile.value}>{tile.value}</span>
                  {tile.suffix}
                </p>
                <span className={caption}>{tile.caption[t.lang]}</span>
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
