import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HalftoneIcon } from "@/components/halftone-icon";
import { Icon } from "@/components/icon";
import { Reveal } from "@/components/motion/reveal";
import { faqs } from "@/lib/site";

export function Faq() {
  return (
    <Reveal
      as="section"
      id="preguntas"
      aria-labelledby="preguntas-title"
      className="px-4 py-24 sm:px-7 md:py-40"
    >
      <h2 id="preguntas-title" data-reveal className="display text-head">
        Preguntas frecuentes
      </h2>
      <div className="mt-12 md:mt-20 md:grid md:grid-cols-12 md:gap-x-8">
        <div className="hidden md:col-span-3 md:block">
          <HalftoneIcon
            shape={["sparkle", "chat", "heart", "target", "cloud", "cursor"]}
            grid={13}
            motion="morph"
            className="sticky top-10 w-full max-w-[15rem] text-accent"
          />
        </div>
        <div className="space-y-2 md:col-span-8 md:col-start-5 md:space-y-4">
          {faqs.map((f) => (
            <details
              key={f.q}
              data-reveal
              className="group -mx-4 px-4 py-4 transition-colors duration-200 open:bg-surface sm:-mx-6 sm:px-6 sm:py-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[1.1875rem] leading-snug md:text-[1.4375rem] [&::-webkit-details-marker]:hidden">
                <h3 className="font-normal">{f.q}</h3>
                <Icon
                  icon={ArrowDown01Icon}
                  size={24}
                  strokeWidth={2}
                  className="shrink-0 transition-transform duration-300 ease-(--ease-out) group-open:-rotate-180"
                />
              </summary>
              <p className="max-w-[48ch] pt-4 text-[1rem] md:text-[1.0625rem]">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
