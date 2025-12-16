import { getTranslations } from "next-intl/server";

const experiences = [
  {
    company: "Applaudo Studios",
    role: "Senior Software Engineer",
    period: "2022 – Present",
    tech: "React, Next.js, TypeScript, Node.js",
    current: true,
  },
  {
    company: "Grupo Cassa",
    role: "Full Stack Developer",
    period: "2021 – 2022",
    tech: "Vue.js, .NET, SQL Server",
    current: false,
  },
  {
    company: "Freelance",
    role: "Web Developer",
    period: "2019 – 2021",
    tech: "React, Node.js, PostgreSQL",
    current: false,
  },
];

export async function MinimalExperiences() {
  const t = await getTranslations("homepage.experience");

  return (
    <section className="space-y-5">
      <h2 className="font-mono font-normal text-xs text-muted-foreground/60 uppercase tracking-[0.2em]">
        {t("title")}
      </h2>
      <div className="space-y-0">
        {experiences.map((exp, idx) => (
          <div
            className="group border-border/60 border-t py-4 first:border-t-0 first:pt-0"
            key={idx}
          >
            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="font-display font-medium text-base text-foreground">
                {exp.company}
                {exp.current && (
                  <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                )}
              </h3>
              <span className="font-mono text-xs text-muted-foreground/50">
                {exp.period}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">{exp.role}</p>
            <p className="mt-1.5 font-mono text-xs text-muted-foreground/60">
              {exp.tech}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
