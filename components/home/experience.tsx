import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HalftoneIcon } from "@/components/halftone-icon";
import { HalftoneLogo } from "@/components/halftone-logo";
import { Icon } from "@/components/icon";
import { Reveal } from "@/components/motion/reveal";
import { getDictionary } from "@/lib/i18n/server";
import { aiLabs, ambassadorships, experience, mediconecto } from "@/lib/site";

/**
 * Career only: what Walter does now, then where he worked before. Community
 * events live in their own section.
 */
export async function Experience() {
  const t = await getDictionary();
  return (
    <Reveal
      as="section"
      id="trayectoria"
      aria-labelledby="trayectoria-title"
      className="px-4 py-24 sm:px-7 md:py-32"
    >
      <h2 id="trayectoria-title" data-reveal className="display text-head">
        {t.experience.title}
      </h2>

      {/* Now */}
      <div className="mt-12 grid gap-x-8 gap-y-10 border-ink/15 border-t pt-8 md:mt-16 md:grid-cols-12">
        <h3 data-reveal className="text-muted text-small md:col-span-2">
          {t.experience.now}
        </h3>

        <div className="space-y-10 md:col-span-6">
          <article
            id="ai-labs"
            data-reveal
            data-icon-hover
            className="grid grid-cols-[3.5rem_1fr] gap-x-5"
          >
            <HalftoneIcon
              shape="sparkle"
              motion="hover"
              className="size-14 text-accent"
            />
            <div>
              <div
                role="img"
                aria-label={t.logo(aiLabs.name)}
                className="aspect-[1295/324] w-44 bg-ink [mask:url(/ailabs-lockup-horizontal.svg)_left/contain_no-repeat]"
              />
              <p className="mt-3 font-semibold text-body">Co-Founder</p>
              <p className="mt-1 max-w-[46ch] text-muted text-body">
                {aiLabs.line[t.lang]}
              </p>
            </div>
          </article>

          <article
            id="mediconecto"
            data-reveal
            data-icon-hover
            className="grid grid-cols-[3.5rem_1fr] gap-x-5"
          >
            <HalftoneIcon
              shape="plus"
              motion="hover"
              className="size-14 text-accent"
            />
            <div>
              <a
                href={mediconecto.url}
                target="_blank"
                rel="noreferrer"
                className="link-underline inline-flex items-center gap-1.5 font-display font-bold text-[1.75rem] leading-none tracking-[-0.035em]"
              >
                {mediconecto.name}
                <Icon icon={ArrowUpRight01Icon} size={20} />
              </a>
              <p className="mt-3 font-semibold text-body">{mediconecto.role}</p>
              <p className="mt-1 max-w-[46ch] text-muted text-body">
                {mediconecto.line[t.lang]}
              </p>
            </div>
          </article>
        </div>

        <ul className="grid grid-cols-2 gap-x-6 gap-y-5 md:col-span-4">
          {ambassadorships.map((a) => (
            <li key={a.name} data-reveal data-icon-hover className="group">
              <HalftoneLogo
                name={a.logo}
                className="mb-3 size-16 text-accent"
              />
              <p className="font-semibold text-body leading-tight">{a.name}</p>
              <p className="mt-0.5 text-muted text-small">{a.role}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Before */}
      <div className="mt-14 grid gap-x-8 gap-y-8 border-ink/15 border-t pt-8 md:grid-cols-12">
        <h3 data-reveal className="text-muted text-small md:col-span-2">
          {t.experience.before}
        </h3>
        <ol className="grid gap-x-10 gap-y-7 sm:grid-cols-2 md:col-span-10">
          {experience.map((job) => (
            <li
              key={job.name}
              data-reveal
              className="grid grid-cols-[3.25rem_1fr] gap-x-4"
            >
              <span className="text-muted text-small tabular-nums leading-[1.6]">
                {job.year}
              </span>
              <div>
                <p className="text-body leading-snug">
                  <span className="font-semibold">{job.name}</span>
                  <span className="text-muted">, {job.role}</span>
                </p>
                <p className="mt-1 text-muted text-small">
                  {job.detail[t.lang]}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Reveal>
  );
}
