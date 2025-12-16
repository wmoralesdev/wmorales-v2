import { getTranslations } from "next-intl/server";

const technologies = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "Prisma",
  "Tailwind",
  "Vercel",
];

export async function MinimalTech() {
  const t = await getTranslations("homepage.stack");

  return (
    <section className="space-y-4">
      <h2 className="font-mono font-normal text-xs text-muted-foreground/60 uppercase tracking-[0.2em]">
        {t("title")}
      </h2>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <span
            className="rounded border border-border/60 px-2 py-0.5 font-mono text-xs text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
            key={tech}
          >
            {tech}
          </span>
        ))}
      </div>
    </section>
  );
}
