import { getTranslations } from "next-intl/server";

export async function MinimalExperiences() {
  const t = await getTranslations("homepage.experience");
  const experiences = t.raw("items") as Array<{
    company: string;
    role: string;
    period: string;
    tech: string;
    description: string;
    current: boolean;
  }>;

  return (
    <section className="space-y-5">
      <h2 className="font-mono font-normal text-xs text-muted-foreground/60 uppercase">
        {t("title")}
      </h2>
      <div className="space-y-0 wm-stagger-1">
        {experiences.map((exp) => (
          <div
            className="group wm-reveal border-border/60 border-t py-4 first:border-t-0 first:pt-0"
            key={`${exp.company}-${exp.role}-${exp.period}`}
          >
            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="font-display font-medium text-base text-foreground">
                {exp.company}
                {exp.current && (
                  <span className="ml-2 inline-block size-1.5 rounded-full bg-accent" />
                )}
              </h3>
              <span className="font-mono text-xs text-muted-foreground/50">
                {exp.period}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground text-pretty">
              {exp.role}
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground/80 text-pretty">
              {exp.description}
            </p>
            <p className="mt-1.5 font-mono text-xs text-muted-foreground/60">
              {exp.tech}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
