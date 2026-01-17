import { getTranslations } from "next-intl/server";

const technologies = [
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind",
  "Node.js",
  "NestJS",
  ".NET",
  "PostgreSQL",
  "MongoDB",
  "SQL Server",
  "Prisma",
  "Docker",
  "AWS",
  "Azure",
  "Vercel",
  "OpenAI",
  "Cursor",
];

export async function MinimalTech() {
  const t = await getTranslations("homepage.stack");

  return (
    <section className="space-y-4">
      <h2 className="font-mono font-normal text-xs text-muted-foreground/60 uppercase">
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
