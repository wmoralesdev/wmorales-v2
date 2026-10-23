import { HalftonePhoto } from "@/components/halftone-photo";
import { Reveal } from "@/components/motion/reveal";
import { type Photo, photos } from "@/lib/site";

type Tile =
  | { type: "heading"; word: string; caption: string; tone: string }
  | {
      type: "stat";
      value: number;
      suffix: string;
      caption: string;
      tone: string;
    }
  | { type: "word"; word: string; caption: string; tone: string }
  | { type: "photo"; photo: Photo; tone: string };

const tiles: Tile[] = [
  {
    type: "heading",
    word: "Comunidad",
    caption: "Cursor El Salvador",
    tone: "bg-ink text-paper",
  },
  { type: "photo", photo: photos.hackathon2, tone: "bg-lilac text-ink" },
  {
    type: "stat",
    value: 550,
    suffix: "+",
    caption: "builders en la comunidad",
    tone: "bg-accent text-paper",
  },
  {
    type: "stat",
    value: 7,
    suffix: "",
    caption: "eventos desde 2025",
    tone: "bg-lilac text-ink",
  },
  { type: "photo", photo: photos.meetup, tone: "bg-surface text-ink" },
  {
    type: "word",
    word: "Café",
    caption: "Cafe Cursor, tres ediciones",
    tone: "bg-surface text-ink",
  },
  { type: "photo", photo: photos.cafe3, tone: "bg-accent text-paper" },
  {
    type: "stat",
    value: 450,
    suffix: "+",
    caption: "asistentes presenciales en 2025",
    tone: "bg-ink text-paper",
  },
  { type: "photo", photo: photos.workshop, tone: "bg-lilac text-ink" },
  {
    type: "stat",
    value: 6,
    suffix: "+",
    caption: "años construyendo software",
    tone: "bg-accent text-paper",
  },
  { type: "photo", photo: photos.cafe1, tone: "bg-surface text-ink" },
  {
    type: "word",
    word: "Hack",
    caption: "Dos hackathons en San Salvador",
    tone: "bg-ink text-paper",
  },
];

const big =
  "display text-[22vw] leading-none sm:text-[clamp(3.5rem,9vw,9.5rem)]";
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
            key={t.type === "photo" ? t.photo.src : `${t.type}-${i}`}
            data-reveal={t.type === "photo" ? undefined : ""}
            className={`relative grid aspect-square place-items-center overflow-clip ${t.tone}`}
          >
            {t.type === "photo" ? (
              <HalftonePhoto
                photo={t.photo}
                tone={t.tone}
                fill
                sizes="(min-width: 640px) 25vw, 50vw"
              />
            ) : t.type === "heading" ? (
              <>
                <h2
                  id="comunidad-title"
                  className="display text-[9.6vw] leading-none sm:text-[clamp(2.25rem,4.6vw,5rem)]"
                >
                  {t.word}
                </h2>
                <span className={caption}>{t.caption}</span>
              </>
            ) : t.type === "stat" ? (
              <>
                <p className={big}>
                  <span data-count={t.value}>{t.value}</span>
                  {t.suffix}
                </p>
                <span className={caption}>{t.caption}</span>
              </>
            ) : (
              <>
                <p className={big}>{t.word}</p>
                <span className={caption}>{t.caption}</span>
              </>
            )}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
