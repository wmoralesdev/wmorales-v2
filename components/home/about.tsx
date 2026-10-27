import { type CSSProperties, Fragment } from "react";
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

// Split for the scroll-lit read: each word lights up in turn as the paragraph
// crosses the viewport (see .lit in globals.css).
const split = (text: string) =>
  text.split(" ").map((word, i, all) => ({
    key: `${i}-${word}`,
    text: word,
    p: i / (all.length - 1),
  }));

export async function About() {
  const t = await getDictionary();
  const words = split(t.about.intro);
  return (
    <Reveal
      as="section"
      id="sobre-mi"
      aria-labelledby="sobre-mi-title"
      className="px-4 py-24 sm:px-7 md:py-40"
    >
      <div className="grid gap-y-12 md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-4">
          <h2
            id="sobre-mi-title"
            data-reveal
            className="display text-head text-ink"
          >
            {t.about.title}
          </h2>
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-1">
            {facts.map((f) => (
              <div key={f.label.es} data-reveal>
                <dt className="text-muted text-small">{f.label[t.lang]}</dt>
                <dd className="font-semibold text-small">{f.value[t.lang]}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="md:col-span-8 md:col-start-5 lg:col-span-7 lg:col-start-5">
          <p
            data-reveal
            className="lit font-semibold text-[1.375rem] leading-[1.25] tracking-[-0.02em] md:text-[clamp(1.75rem,1.1rem+1.4vw,2.5rem)]"
          >
            {words.map((w) => (
              <Fragment key={w.key}>
                <span
                  className="lit-word"
                  style={{ "--p": w.p } as CSSProperties}
                >
                  {w.text}
                </span>{" "}
              </Fragment>
            ))}
          </p>

          <div data-reveal className="mt-16">
            <h3 className="font-semibold text-small">{t.about.tools}</h3>
            <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
              {tools.map((tool) => (
                <li
                  key={tool.name}
                  data-icon-hover
                  className="group flex min-h-36 flex-col justify-between gap-6 bg-surface p-5"
                >
                  <HalftoneLogo
                    name={tool.logo}
                    className="size-16 text-accent"
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
                className="flex min-h-36 flex-col justify-between gap-6 bg-ink p-5 text-paper"
              >
                <HalftoneIcon
                  shape="plus"
                  motion="hover"
                  className="size-16 text-lilac"
                />
                <div>
                  <p className="font-semibold text-small">{t.about.more}</p>
                  <p className="text-small opacity-70">Supabase, evals, MCP</p>
                </div>
              </li>
            </ul>
          </div>

          <p data-reveal className="mt-10 text-muted text-small">
            <span className="font-semibold text-ink">{t.about.stackLabel}</span>{" "}
            {t.about.stack}
          </p>
        </div>
      </div>
    </Reveal>
  );
}
