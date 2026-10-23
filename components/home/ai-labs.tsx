import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Reveal } from "@/components/motion/reveal";
import { PortraitCanvas } from "./portrait-canvas";

export function AiLabs() {
  return (
    <Reveal
      as="section"
      id="ai-labs"
      aria-labelledby="ai-labs-title"
      className="bg-accent px-4 py-24 text-paper sm:px-7 md:py-36"
    >
      <div className="grid items-end gap-12 md:grid-cols-12 md:gap-x-8">
        <div data-reveal className="md:col-span-5">
          <PortraitCanvas light className="text-paper" />
          <p className="mt-3 text-small">Tocá el retrato.</p>
        </div>

        <div className="md:col-span-7 md:pb-4">
          <div
            data-reveal
            role="img"
            aria-label="Logotipo de Ai Labs"
            className="aspect-[1295/324] w-[min(100%,26rem)] bg-paper [mask:url(/ailabs-lockup-horizontal.svg)_left/contain_no-repeat]"
          />
          <h2
            id="ai-labs-title"
            data-reveal
            className="display mt-10 text-head"
          >
            Fundador de Ai Labs
          </h2>
          <p data-reveal className="mt-6 max-w-[38rem] text-lead leading-snug">
            Ai Labs es el estudio que fundé en El Salvador para diseñar y
            construir productos con inteligencia artificial. Trabajamos con
            empresas de Latinoamérica desde la estrategia hasta el software en
            producción, y somos la casa de Cafe Cursor.
          </p>
          <div data-reveal className="mt-10">
            <Link
              href="/book"
              className="btn [--btn-bg:var(--color-paper)] [--btn-fg:var(--color-ink)]"
            >
              Hablemos de tu proyecto
              <Icon icon={ArrowUpRight01Icon} size={18} />
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
