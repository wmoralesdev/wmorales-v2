import { HalftoneIcon } from "@/components/halftone-icon";
import { Reveal } from "@/components/motion/reveal";
import { services } from "@/lib/site";

export function Services() {
  return (
    <Reveal
      as="section"
      id="servicios"
      aria-labelledby="servicios-title"
      className="bg-surface px-4 py-24 sm:px-7 md:py-32"
    >
      <h2 id="servicios-title" data-reveal className="display text-head">
        Qué hago
      </h2>
      <ul className="mt-12 grid gap-x-8 gap-y-10 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <li
            key={s.name}
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
              {s.name}
            </h3>
            <p className="mt-3 max-w-[38ch] text-body text-muted">
              {s.description}
            </p>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
