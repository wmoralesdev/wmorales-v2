import * as stylex from "@stylexjs/stylex";
import { getTranslations } from "next-intl/server";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, fonts } from "@/lib/stylex/tokens.stylex";

const styles = stylex.create({
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
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
    flexDirection: "column",
  },
  item: {
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: `color-mix(in oklch, ${colors.border}, transparent 40%)`,
    paddingBlock: "1rem",
    ":first-child": {
      borderTopWidth: 0,
      paddingTop: 0,
    },
  },
  row: {
    display: "flex",
    flexDirection: "column",
    gap: "0.125rem",
    "@media (min-width: 640px)": {
      flexDirection: "row",
      alignItems: "baseline",
      justifyContent: "space-between",
    },
  },
  company: {
    fontFamily: fonts.display,
    fontWeight: 500,
    fontSize: "1rem",
    color: colors.foreground,
  },
  currentDot: {
    marginLeft: "0.5rem",
    display: "inline-block",
    width: "0.375rem",
    height: "0.375rem",
    borderRadius: "9999px",
    backgroundColor: colors.accent,
  },
  period: {
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    color: `color-mix(in oklch, ${colors.mutedForeground}, transparent 50%)`,
  },
  role: {
    marginTop: "0.125rem",
    fontSize: "0.875rem",
    color: colors.mutedForeground,
    textWrap: "pretty",
  },
  description: {
    marginTop: "0.375rem",
    fontSize: "0.875rem",
    color: `color-mix(in oklch, ${colors.mutedForeground}, transparent 20%)`,
    textWrap: "pretty",
  },
  tech: {
    marginTop: "0.375rem",
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    color: `color-mix(in oklch, ${colors.mutedForeground}, transparent 40%)`,
  },
});

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
    <section {...stylex.props(styles.section)}>
      <h2 {...stylex.props(styles.title)}>{t("title")}</h2>
      <div {...stylex.props(styles.list)}>
        {experiences.map((exp) => (
          <div
            key={`${exp.company}-${exp.role}-${exp.period}`}
            {...mergeSx(stylex.props(styles.item), "wm-reveal")}
          >
            <div {...stylex.props(styles.row)}>
              <h3 {...stylex.props(styles.company)}>
                {exp.company}
                {exp.current && <span {...stylex.props(styles.currentDot)} />}
              </h3>
              <span {...stylex.props(styles.period)}>{exp.period}</span>
            </div>
            <p {...stylex.props(styles.role)}>{exp.role}</p>
            <p {...stylex.props(styles.description)}>{exp.description}</p>
            <p {...stylex.props(styles.tech)}>{exp.tech}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
