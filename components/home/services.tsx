import { Reveal } from "@/components/motion/reveal";
import { services } from "@/lib/site";

export function Services() {
  return (
    <Reveal
      as="section"
      id="servicios"
      aria-labelledby="servicios-title"
      className="bg-surface px-4 py-24 sm:px-7 md:py-[20vh]"
    >
      <ul className="group/list">
        <li data-reveal className="md:grid md:grid-cols-12 md:gap-x-8">
          <h2
            id="servicios-title"
            className="display text-[13vw] text-muted md:col-span-8 md:text-[clamp(3rem,6.4vw,6.5rem)]"
          >
            Qué hago
          </h2>
        </li>
        {services.map((s) => (
          <li
            key={s.name}
            data-reveal
            className="mt-7 transition-colors duration-200 ease-(--ease-out) md:mt-[clamp(1rem,2.2vw,2.25rem)] md:grid md:grid-cols-12 md:items-baseline md:gap-x-8 md:group-hover/list:text-muted md:hover:text-ink!"
          >
            <h3 className="display text-[13vw] leading-[0.92] md:col-span-8 md:text-[clamp(3rem,6.4vw,6.5rem)]">
              {s.name}
            </h3>
            <p className="mt-2 pl-4 text-body md:col-span-4 md:mt-0 md:pl-0">
              {s.description}
            </p>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
