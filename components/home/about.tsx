import { HalftoneIcon } from "@/components/halftone-icon";
import { HalftoneLogo } from "@/components/halftone-logo";
import { Reveal } from "@/components/motion/reveal";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { getDictionary } from "@/lib/i18n/server";
import type { LogoName } from "@/lib/logo-dots";
import { facts } from "@/lib/site";

type Note = keyof Dictionary["about"]["notes"];

// The AI tools he works with every day, printed as halftone logos. Logos live in
// /public/logos; the last tile stands for everything else.
const tools: { name: string; note: Note; logo: LogoName }[] = [
  { name: "Cursor", note: "code", logo: "cursor" },
  { name: "Claude Code", note: "code", logo: "claudecode" },
  { name: "Codex", note: "code", logo: "codex" },
  { name: "Cognition", note: "autonomous", logo: "cognition" },
  { name: "OpenAI", note: "models", logo: "openai" },
  { name: "Mistral", note: "open", logo: "mistral" },
  { name: "Grok", note: "bots", logo: "grok" },
  { name: "ElevenLabs", note: "voice", logo: "elevenlabs" },
];

export async function About() {
  const t = await getDictionary();
  return (
    <Reveal
      as="section"
      id="sobre-mi"
      aria-labelledby="sobre-mi-title"
      className="px-4 py-16 sm:px-7 md:py-24"
    >
      <div className="grid gap-y-12 md:grid-cols-12 md:gap-x-8">
        {/* Stays in view beside the taller column, so the left side is never empty. */}
        <div className="md:sticky md:top-10 md:col-span-4 md:self-start">
          <h2
            id="sobre-mi-title"
            data-reveal
            className="display text-head text-ink"
          >
            {t.about.title}
          </h2>
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-1">
            {facts.map((f) => (
              <div key={f.label.es} data-reveal>
                <dt className="text-muted text-small">{f.label[t.lang]}</dt>
                <dd className="font-semibold text-small">{f.value[t.lang]}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="md:col-span-8 md:col-start-5">
          <p
            data-reveal
            className="max-w-[24em] font-semibold text-[1.25rem] leading-[1.25] tracking-[-0.02em] md:text-[clamp(1.5rem,1rem+1.1vw,2rem)]"
          >
            {t.about.intro}
          </p>

          <div data-reveal className="mt-12">
            <h3 className="font-semibold text-small">{t.about.tools}</h3>
            <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
              {tools.map((tool) => (
                <li
                  key={tool.name}
                  data-icon-hover
                  className="group flex min-h-32 flex-col justify-between gap-5 bg-surface p-4"
                >
                  <HalftoneLogo
                    name={tool.logo}
                    className="size-12 text-accent"
                  />
                  <div>
                    <p className="font-semibold text-small">{tool.name}</p>
                    <p className="text-muted text-small">
                      {t.about.notes[tool.note]}
                    </p>
                  </div>
                </li>
              ))}
              <li
                data-icon-hover
                className="col-span-2 flex items-center gap-4 bg-ink p-4 text-paper sm:col-span-1 sm:min-h-32 sm:flex-col sm:items-stretch sm:justify-between sm:gap-5"
              >
                <HalftoneIcon
                  shape="plus"
                  motion="hover"
                  className="size-12 shrink-0 text-lilac"
                />
                <div>
                  <p className="font-semibold text-small">{t.about.more}</p>
                  <p className="text-small opacity-70">Supabase, evals, MCP</p>
                </div>
              </li>
            </ul>
          </div>

          <p data-reveal className="mt-8 text-muted text-small">
            <span className="font-semibold text-ink">{t.about.stackLabel}</span>{" "}
            {t.about.stack}
          </p>
        </div>
      </div>
    </Reveal>
  );
}
