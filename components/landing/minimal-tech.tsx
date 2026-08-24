import * as stylex from "@stylexjs/stylex";
import { getTranslations } from "next-intl/server";
import { colors, fonts, radii } from "@/lib/stylex/tokens.stylex";

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

const styles = stylex.create({
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  title: {
    fontFamily: fonts.mono,
    fontWeight: 400,
    fontSize: "0.75rem",
    color: `color-mix(in oklch, ${colors.mutedForeground}, transparent 40%)`,
    textTransform: "uppercase",
  },
  list: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  chip: {
    borderRadius: radii.sm,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: `color-mix(in oklch, ${colors.border}, transparent 40%)`,
    paddingInline: "0.5rem",
    paddingBlock: "0.125rem",
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    color: colors.mutedForeground,
    transitionProperty: "color, border-color",
    transitionDuration: "150ms",
    ":hover": {
      borderColor: `color-mix(in oklch, ${colors.accent}, transparent 50%)`,
      color: colors.foreground,
    },
  },
});

export async function MinimalTech() {
  const t = await getTranslations("homepage.stack");

  return (
    <section {...stylex.props(styles.section)}>
      <h2 {...stylex.props(styles.title)}>{t("title")}</h2>
      <div {...stylex.props(styles.list)}>
        {technologies.map((tech) => (
          <span key={tech} {...stylex.props(styles.chip)}>
            {tech}
          </span>
        ))}
      </div>
    </section>
  );
}
