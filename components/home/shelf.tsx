import { Reveal } from "@/components/motion/reveal";
import { events, experience, type IndexEntry } from "@/lib/site";

const kindTone: Record<IndexEntry["kind"], string> = {
  Consultoría: "bg-accent text-paper",
  Ingeniería: "bg-ink text-paper",
  Comunidad: "bg-lilac text-ink",
  Evento: "bg-surface text-ink md:bg-paper",
};

function Spine({ entry }: { entry: IndexEntry }) {
  const inner = (
    <>
      <span className="font-semibold text-[1.0625rem] leading-none md:text-[1.125rem]">
        {entry.name}
      </span>
      <span
        className={`px-1 py-0.5 text-small leading-none md:px-0.5 md:py-1.5 ${kindTone[entry.kind]}`}
      >
        {entry.kind}
      </span>
      <span className="text-muted text-small leading-none transition-colors duration-200 group-hover/spine:text-night-soft md:mt-auto">
        {entry.year}
      </span>
    </>
  );

  const cls =
    "group/spine inline-flex items-center gap-2 py-1 transition-colors duration-200 ease-(--ease-out) md:h-[26.25rem] md:min-w-[2.125rem] md:flex-1 md:gap-3 md:bg-surface md:px-0 md:py-4 md:[writing-mode:vertical-rl] md:hover:bg-ink md:hover:text-paper md:group-hover/shelf:text-muted md:hover:text-paper! md:focus-visible:bg-ink md:focus-visible:text-paper";

  return (
    <li className="contents">
      {entry.href ? (
        <a
          href={entry.href}
          target="_blank"
          rel="noopener noreferrer"
          title={`${entry.name}: ${entry.detail}`}
          className={`${cls} press`}
        >
          {inner}
        </a>
      ) : (
        <span title={`${entry.name}: ${entry.detail}`} className={cls}>
          {inner}
        </span>
      )}
    </li>
  );
}

export function Shelf() {
  const entries = [...experience, ...events];
  return (
    <Reveal
      as="section"
      id="trayectoria"
      aria-labelledby="trayectoria-title"
      className="px-4 py-24 sm:px-7 md:pt-40 md:pb-24"
    >
      <div
        data-reveal
        className="flex flex-col gap-3 md:flex-row md:items-baseline md:gap-10"
      >
        <h2
          id="trayectoria-title"
          className="display text-[clamp(2.75rem,6vw,4.5rem)]"
        >
          Trayectoria
        </h2>
        <p className="max-w-[40rem] text-body">
          Equipos donde construí software desde 2019 y los eventos que organicé
          con la comunidad de Cursor en San Salvador. Los eventos abren su álbum
          de fotos.
        </p>
      </div>
      <ul
        data-reveal
        className="group/shelf mt-10 flex flex-wrap gap-x-5 gap-y-3.5 md:mt-12 md:flex-nowrap md:gap-1.5"
      >
        {entries.map((e) => (
          <Spine key={e.name} entry={e} />
        ))}
      </ul>
    </Reveal>
  );
}
