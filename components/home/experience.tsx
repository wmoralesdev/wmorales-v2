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
      className="px-4 py-16 sm:px-7 md:py-24"
    >
      <h2 id="trayectoria-title" data-reveal className="display text-head">
        {t.experience.title}
      </h2>

      {/* Every row shares one split: a label on the left line, its content from
          the third column to the right line. */}

      {/* Now */}
      <div className="mt-8 grid gap-x-8 gap-y-6 border-ink/15 border-t pt-6 md:mt-12 md:grid-cols-12">
        <h3 data-reveal className="text-muted text-small md:col-span-2">
          {t.experience.now}
        </h3>

        <div className="grid gap-x-8 gap-y-8 md:col-span-10 lg:grid-cols-2">
          <article
            id="ai-labs"
            data-reveal
            data-icon-hover
            className="grid grid-cols-[3rem_1fr] gap-x-4"
          >
            <HalftoneIcon
              shape="sparkle"
              motion="hover"
              className="size-12 text-accent"
            />
            <div>
              <div
                role="img"
                aria-label={t.logo(aiLabs.name)}
                className="aspect-[1295/324] w-36 bg-ink [mask:url(/ailabs-lockup-horizontal.svg)_left/contain_no-repeat]"
              />
              <p className="mt-3 font-semibold text-body">Co-Founder</p>
              <p className="mt-1 max-w-[46ch] text-body text-muted">
                {aiLabs.line[t.lang]}
              </p>
            </div>
          </article>

          <article
            id="mediconecto"
            data-reveal
            data-icon-hover
            className="grid grid-cols-[3rem_1fr] gap-x-4"
          >
            <HalftoneIcon
              shape="plus"
              motion="hover"
              className="size-12 text-accent"
            />
            <div>
              <a
                href={mediconecto.url}
                target="_blank"
                rel="noreferrer"
                className="-my-2 inline-flex min-h-11 items-center gap-1.5 font-bold font-display text-[1.5rem] leading-none tracking-[-0.035em]"
              >
                <span className="link-underline">{mediconecto.name}</span>
                <Icon icon={ArrowUpRight01Icon} size={18} />
              </a>
              <p className="mt-3 font-semibold text-body">{mediconecto.role}</p>
              <p className="mt-1 max-w-[46ch] text-body text-muted">
                {mediconecto.line[t.lang]}
              </p>
            </div>
          </article>
        </div>
      </div>

      {/* Ambassador */}
      <div className="mt-10 grid gap-x-8 gap-y-6 border-ink/15 border-t pt-6 md:grid-cols-12">
        <h3 data-reveal className="text-muted text-small md:col-span-2">
          {t.experience.ambassador}
        </h3>
        <ul className="grid grid-cols-2 gap-x-8 gap-y-6 md:col-span-10 lg:grid-cols-4">
          {ambassadorships.map((a) => (
            <li
              key={a.name}
              data-reveal
              data-icon-hover
              className="group flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <HalftoneLogo
                name={a.logo}
                className="size-12 shrink-0 text-accent"
              />
              <div>
                <p className="font-semibold text-body leading-tight">
                  {a.name}
                </p>
                <p className="mt-0.5 text-muted text-small">{a.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Before */}
      <div className="mt-10 grid gap-x-8 gap-y-6 border-ink/15 border-t pt-6 md:grid-cols-12">
        <h3 data-reveal className="text-muted text-small md:col-span-2">
          {t.experience.before}
        </h3>
        <ol className="grid gap-x-10 gap-y-5 sm:grid-cols-2 md:col-span-10">
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
