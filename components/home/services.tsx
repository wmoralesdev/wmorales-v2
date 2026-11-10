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
      className="bg-surface px-4 py-16 sm:px-7 md:py-24"
    >
      <h2 id="servicios-title" data-reveal className="display text-head">
        {t.services.title}
      </h2>
      <ul className="mt-8 grid gap-x-8 gap-y-8 md:mt-12 md:grid-cols-2 lg:grid-cols-3">
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
              className="mb-4 size-12 text-accent"
            />
            <h3 className="display text-[clamp(1.375rem,1.15rem+0.7vw,1.75rem)] leading-none">
              {s.name[t.lang]}
            </h3>
            <p className="mt-2 max-w-[38ch] text-body text-muted">
              {s.description[t.lang]}
            </p>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
