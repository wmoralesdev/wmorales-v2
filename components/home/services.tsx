import { HalftoneIcon } from "@/components/halftone-icon";
import { Reveal } from "@/components/motion/reveal";
import { getDictionary } from "@/lib/i18n/server";
import { services } from "@/lib/site";

export async function Services() {
  const t = await getDictionary();
  return (
    <Reveal
      as="section"
      id="servicios"
      aria-labelledby="servicios-title"
      className="bg-surface px-4 py-24 sm:px-7 md:py-32"
    >
      <h2 id="servicios-title" data-reveal className="display text-head">
        {t.services.title}
      </h2>
      <ul className="mt-12 grid gap-x-8 gap-y-10 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <li
            key={s.name.es}
            data-reveal
            data-icon-hover
            className="border-ink/15 border-t pt-5"
          >
            <HalftoneIcon
              shape={s.icon}
              motion="hover"
              className="mb-6 size-16 text-accent"
            />
            <h3 className="display text-[clamp(1.75rem,1.4rem+1vw,2.375rem)] leading-[0.95]">
              {s.name[t.lang]}
            </h3>
            <p className="mt-3 max-w-[38ch] text-body text-muted">
              {s.description[t.lang]}
            </p>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
