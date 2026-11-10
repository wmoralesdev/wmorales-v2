import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HalftoneIcon } from "@/components/halftone-icon";
import { Icon } from "@/components/icon";
import { Reveal } from "@/components/motion/reveal";
import { getDictionary } from "@/lib/i18n/server";
import { faqs } from "@/lib/site";

export async function Faq() {
  const t = await getDictionary();
  return (
    <Reveal
      as="section"
      id="preguntas"
      aria-labelledby="preguntas-title"
      className="px-4 py-16 sm:px-7 md:py-24"
    >
      {/* The same split as "About me": the title holds the left column and stays
          in view while the questions scroll. */}
      <div className="md:grid md:grid-cols-12 md:gap-x-8">
        <div className="md:sticky md:top-10 md:col-span-4 md:self-start">
          <h2 id="preguntas-title" data-reveal className="display text-head">
            {t.faq.title}
          </h2>
          <HalftoneIcon
            shape={["sparkle", "chat", "heart", "target", "cloud", "cursor"]}
            grid={13}
            motion="morph"
            className="mt-10 hidden w-full max-w-[11rem] text-accent md:block"
          />
        </div>
        <div className="mt-6 space-y-2 md:col-span-8 md:col-start-5 md:mt-0">
          {faqs[t.lang].map((f) => (
            <details
              key={f.q}
              data-reveal
              className="group -mx-4 transition-colors duration-200 open:bg-surface sm:-mx-6"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-4 py-4 text-[1.0625rem] leading-snug sm:px-6 md:text-[1.25rem] [&::-webkit-details-marker]:hidden">
                <h3 className="font-normal">{f.q}</h3>
                <Icon
                  icon={ArrowDown01Icon}
                  size={20}
                  strokeWidth={2}
                  className="shrink-0 transition-transform duration-300 ease-(--ease-out) group-open:-rotate-180"
                />
              </summary>
              <p className="max-w-[calc(48ch+2rem)] px-4 pb-4 text-[0.9375rem] sm:max-w-[calc(48ch+3rem)] sm:px-6 sm:pb-5 md:text-[1rem]">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
