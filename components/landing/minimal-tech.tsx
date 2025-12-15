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

export function MinimalTech() {
  return (
    <section className="space-y-4">
      <h2 className="font-mono text-[11px] font-normal uppercase tracking-[0.2em] text-muted-foreground/60">
        Stack
      </h2>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <span
            key={tech}
            className="rounded border border-border/60 px-2 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
          >
            {tech}
          </span>
        ))}
      </div>
    </section>
  );
}
