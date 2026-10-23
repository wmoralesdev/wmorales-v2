import { Reveal } from "@/components/motion/reveal";
import { facts } from "@/lib/site";

const record = [
  {
    title: "Stack",
    items: [
      ["TypeScript", "Lenguaje"],
      ["Next.js y React", "Web"],
      [".NET", "Backend"],
      ["PostgreSQL", "Datos"],
      ["AWS y Azure", "Cloud"],
    ],
  },
  {
    title: "Con IA",
    items: [
      ["Cursor", "Agentes de código"],
      ["OpenAI", "Modelos"],
      ["Supabase", "Backends rápidos"],
      ["Evaluaciones", "Calidad"],
      ["Talleres", "Adopción"],
    ],
  },
] as const;

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
            Soy Walter Morales, consultor de inteligencia artificial e ingeniero
            de software en San Salvador. Fundé Ai Labs para que las empresas de
            la región dejen de experimentar con IA y empiecen a operarla: casos
            de uso con retorno claro, agentes que funcionan con datos reales y
            equipos que saben usarlos. Antes pasé más de seis años construyendo
            software para clientes de Estados Unidos y Latinoamérica. Como
            Cursor Ambassador de El Salvador, reúno a más de 550 builders en
            hackathons, talleres y Cafe Cursor.
          </p>

          <div className="mt-16 grid gap-10 sm:grid-cols-2 sm:gap-16">
            {record.map((col) => (
              <div key={col.title} data-reveal>
                <h3 className="font-semibold text-small">{col.title}</h3>
                <ul className="mt-3 space-y-2.5">
                  {col.items.map(([name, note]) => (
                    <li
                      key={name}
                      className="flex justify-between gap-4 text-small"
                    >
                      <span>{name}</span>
                      <span className="text-muted">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
