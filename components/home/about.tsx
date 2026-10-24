import { HalftoneIcon } from "@/components/halftone-icon";
import { HalftoneLogo } from "@/components/halftone-logo";
import { Reveal } from "@/components/motion/reveal";
import { facts } from "@/lib/site";

// The AI tools he works with every day, printed as halftone logos. Logos live in
// /public/logos; the last tile stands for everything else.
const tools: { name: string; note: string; logo: string; scale?: number }[] = [
  { name: "Cursor", note: "Agentes de código", logo: "/logos/cursor.svg" },
  {
    name: "Claude Code",
    note: "Agentes de código",
    logo: "/logos/claudecode.svg",
    scale: 1.15,
  },
  { name: "Codex", note: "Agentes de código", logo: "/logos/codex.svg" },
  {
    name: "Cognition",
    note: "Agentes autónomos",
    logo: "/logos/cognition.svg",
    scale: 1.3,
  },
  { name: "OpenAI", note: "Modelos", logo: "/logos/openai.svg", scale: 1.45 },
  { name: "Mistral", note: "Modelos abiertos", logo: "/logos/mistral.svg" },
  { name: "Grok", note: "Modelos y bots", logo: "/logos/grok.svg" },
  { name: "ElevenLabs", note: "Voz", logo: "/logos/elevenlabs.svg" },
];

export function About() {
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
            Quién soy
          </h2>
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-1">
            {facts.map((f) => (
              <div key={f.label} data-reveal>
                <dt className="text-muted text-small">{f.label}</dt>
                <dd className="font-semibold text-small">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="md:col-span-8 md:col-start-5 lg:col-span-7 lg:col-start-5">
          <p
            data-reveal
            className="text-[1.1875rem] leading-[1.4] md:text-[clamp(1.375rem,1.75vw,1.75rem)]"
          >
            Cofundé Ai Labs para que las empresas de la región pasen de
            experimentar con IA a operarla. Llevo más de seis años construyendo
            software, y hoy soy Regional Lead de SpaceXAI Ambassadors y
            Ambassador de Codex, Mistral y Cognition.
          </p>

          <div data-reveal className="mt-16">
            <h3 className="font-semibold text-small">Con IA</h3>
            <ul className="mt-4 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {tools.map((t) => (
                <li
                  key={t.name}
                  className="group flex min-h-36 flex-col justify-between gap-6 bg-surface p-4"
                >
                  <HalftoneLogo
                    src={t.logo}
                    scale={t.scale}
                    className="size-10 text-accent"
                  />
                  <div>
                    <p className="font-semibold text-small">{t.name}</p>
                    <p className="text-muted text-small">{t.note}</p>
                  </div>
                </li>
              ))}
              <li className="flex min-h-36 flex-col justify-between gap-6 bg-ink p-4 text-paper">
                <HalftoneIcon shape="plus" className="size-10 text-lilac" />
                <div>
                  <p className="font-semibold text-small">Y más</p>
                  <p className="text-small opacity-70">Supabase, evals, MCP</p>
                </div>
              </li>
            </ul>
          </div>

          <p data-reveal className="mt-10 text-muted text-small">
            <span className="font-semibold text-ink">Stack:</span> TypeScript
            con Next.js y React, y .NET, sobre PostgreSQL en AWS y Azure.
          </p>
        </div>
      </div>
    </Reveal>
  );
}
