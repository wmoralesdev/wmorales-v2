import * as stylex from "@stylexjs/stylex";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  SlideBody,
  SlideBreakdown,
  SlideCardGrid,
  SlideFootnote,
  SlideFrame,
  SlideHeadline,
  SlideList,
  SlideSubline,
  SlideTimeline,
} from "@/components/slides";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { mergeSx } from "@/lib/stylex/sx";
import { colors, fonts, radii } from "@/lib/stylex/tokens.stylex";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("designSystem.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

const styles = stylex.create({
  page: {
    display: "flex",
    flexDirection: "column",
    gap: "4rem",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  overview: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: "1.25rem",
    fontWeight: 600,
    letterSpacing: "-0.025em",
    textWrap: "balance",
    color: colors.foreground,
  },
  sectionLead: {
    marginTop: "0.5rem",
    fontSize: "0.875rem",
    color: colors.mutedForeground,
    textWrap: "pretty",
  },
  cardPad: {
    paddingTop: "1.5rem",
  },
  muted: {
    fontSize: "0.875rem",
    color: colors.mutedForeground,
    textWrap: "pretty",
  },
  scaleStack: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  scaleItem: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  scaleHeader: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  scaleName: {
    fontFamily: fonts.display,
    fontSize: "1.125rem",
    fontWeight: 600,
    color: colors.foreground,
  },
  codeChip: {
    borderRadius: radii.md,
    backgroundColor: colors.muted,
    paddingInline: "0.5rem",
    paddingBlock: "0.25rem",
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    color: colors.mutedForeground,
  },
  inlineCode: {
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
  },
  example: {
    borderLeftWidth: 2,
    borderLeftStyle: "solid",
    borderLeftColor: `color-mix(in oklch, ${colors.accent}, transparent 50%)`,
    paddingLeft: "1rem",
  },
  pageTitleExample: {
    fontFamily: fonts.display,
    fontSize: "1.875rem",
    fontWeight: 600,
    letterSpacing: "-0.025em",
    color: colors.foreground,
    "@media (min-width: 640px)": {
      fontSize: "2.25rem",
    },
  },
  bodyExample: {
    fontSize: "0.875rem",
    color: colors.mutedForeground,
    lineHeight: 1.625,
  },
  metaDate: {
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    color: colors.mutedForeground,
  },
  metaTags: {
    marginTop: "0.5rem",
    display: "flex",
    gap: "0.5rem",
  },
  monoBadge: {
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
  },
  smallHeading: {
    fontFamily: fonts.display,
    fontSize: "1rem",
    fontWeight: 500,
    color: colors.foreground,
  },
  split: {
    display: "grid",
    gap: "1.5rem",
    "@media (min-width: 768px)": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  },
  doCard: {
    borderColor: "color-mix(in oklch, #22c55e, transparent 80%)",
  },
  dontCard: {
    borderColor: "color-mix(in oklch, #ef4444, transparent 80%)",
  },
  doTitle: {
    color: "#22c55e",
  },
  dontTitle: {
    color: "#ef4444",
  },
  advice: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  adviceTitle: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: colors.foreground,
  },
  adviceCode: {
    marginTop: "0.25rem",
    display: "block",
    borderRadius: radii.md,
    backgroundColor: colors.muted,
    padding: "0.5rem",
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
  },
  adviceDontCode: {
    marginTop: "0.25rem",
    display: "block",
    borderRadius: radii.md,
    backgroundColor: colors.muted,
    padding: "0.5rem",
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    color: "#ef4444",
  },
  adviceBody: {
    marginTop: "0.25rem",
    fontSize: "0.875rem",
    color: colors.mutedForeground,
    textWrap: "pretty",
  },
  palette: {
    display: "grid",
    gap: "1rem",
    "@media (min-width: 640px)": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  },
  swatchRow: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  swatchMeta: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  swatch: {
    width: "2rem",
    height: "2rem",
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
  },
  swatchAccent: {
    backgroundColor: colors.accent,
  },
  swatchForeground: {
    backgroundColor: colors.foreground,
  },
  swatchMuted: {
    backgroundColor: colors.muted,
  },
  swatchBorder: {
    backgroundColor: colors.border,
  },
  swatchMutedForeground: {
    backgroundColor: colors.mutedForeground,
  },
  swatchBackground: {
    backgroundColor: colors.background,
  },
  swatchName: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: colors.foreground,
  },
  swatchCode: {
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    color: colors.mutedForeground,
  },
  swatchDesc: {
    fontSize: "0.75rem",
    color: colors.mutedForeground,
    textWrap: "pretty",
  },
  spacingLabel: {
    marginBottom: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    color: colors.foreground,
  },
  spacingList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  spacingRow: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  spacingSize: {
    width: "4rem",
  },
  spacingBarWrap: {
    flex: 1,
  },
  spacingBar: {
    height: "1rem",
    backgroundColor: colors.accent,
  },
  spacingCode: {
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    color: colors.mutedForeground,
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  preview: {
    overflow: "hidden",
    borderRadius: radii.lg,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
  },
  frame: {
    maxHeight: "16rem",
  },
  frameInner: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  snippet: {
    marginTop: "1rem",
    display: "block",
    borderRadius: radii.md,
    backgroundColor: colors.muted,
    paddingInline: "0.75rem",
    paddingBlock: "0.5rem",
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    color: colors.mutedForeground,
  },
  slideType: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: colors.foreground,
  },
  headlineDemo: {
    fontSize: "1.5rem",
    "@media (min-width: 768px)": {
      fontSize: "1.875rem",
    },
  },
  sublineDemo: {
    fontSize: "1.125rem",
  },
  bodyDemo: {
    fontSize: "1rem",
  },
  footnoteDemo: {
    marginTop: 0,
    paddingTop: 0,
  },
  listDemo: {
    fontSize: "1rem",
  },
  variantLabel: {
    marginBottom: "0.75rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    color: colors.foreground,
  },
});

export default async function DesignSystemPage() {
  const t = await getTranslations("designSystem");
  return (
    <div {...stylex.props(styles.page)}>
      <section {...stylex.props(styles.overview)}>
        <h2 {...stylex.props(styles.sectionTitle)}>{t("overview.title")}</h2>
        <Card>
          <CardContent className={stylex.props(styles.cardPad).className}>
            <p {...stylex.props(styles.muted)}>{t("overview.description")}</p>
          </CardContent>
        </Card>
      </section>

      <section {...stylex.props(styles.section)}>
        <div>
          <h2 {...stylex.props(styles.sectionTitle)}>
            {t("typography.title")}
          </h2>
          <p {...stylex.props(styles.sectionLead)}>
            {t("typography.description")}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("typography.scale.title")}</CardTitle>
            <CardDescription>
              {t("typography.scale.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className={stylex.props(styles.scaleStack).className}>
            <div {...stylex.props(styles.scaleStack)}>
              <div {...stylex.props(styles.scaleItem)}>
                <div {...stylex.props(styles.scaleHeader)}>
                  <h3 {...stylex.props(styles.scaleName)}>
                    {t("typography.scale.pageTitle.name")}
                  </h3>
                  <code {...stylex.props(styles.codeChip)}>
                    1.875rem / 2.25rem
                  </code>
                </div>
                <p {...stylex.props(styles.muted)}>
                  {t.rich("typography.scale.pageTitle.description", {
                    code: (chunks) => (
                      <code {...stylex.props(styles.inlineCode)}>{chunks}</code>
                    ),
                  })}
                </p>
                <div {...stylex.props(styles.example)}>
                  <h1 {...stylex.props(styles.pageTitleExample)}>
                    {t("typography.scale.pageTitle.example")}
                  </h1>
                </div>
              </div>

              <Separator />

              <div {...stylex.props(styles.scaleItem)}>
                <div {...stylex.props(styles.scaleHeader)}>
                  <h3 {...stylex.props(styles.scaleName)}>
                    {t("typography.scale.sectionTitle.name")}
                  </h3>
                  <code {...stylex.props(styles.codeChip)}>1.25rem</code>
                </div>
                <p {...stylex.props(styles.muted)}>
                  {t("typography.scale.sectionTitle.description")}
                </p>
                <div {...stylex.props(styles.example)}>
                  <h2 {...stylex.props(styles.sectionTitle)}>
                    {t("typography.scale.sectionTitle.example")}
                  </h2>
                </div>
              </div>

              <Separator />

              <div {...stylex.props(styles.scaleItem)}>
                <div {...stylex.props(styles.scaleHeader)}>
                  <h3 {...stylex.props(styles.scaleName)}>
                    {t("typography.scale.bodyText.name")}
                  </h3>
                  <code {...stylex.props(styles.codeChip)}>0.875rem</code>
                </div>
                <p {...stylex.props(styles.muted)}>
                  {t.rich("typography.scale.bodyText.description", {
                    code: (chunks) => (
                      <code {...stylex.props(styles.inlineCode)}>{chunks}</code>
                    ),
                  })}
                </p>
                <div {...stylex.props(styles.example)}>
                  <p {...stylex.props(styles.bodyExample)}>
                    {t("typography.scale.bodyText.example")}
                  </p>
                </div>
              </div>

              <Separator />

              <div {...stylex.props(styles.scaleItem)}>
                <div {...stylex.props(styles.scaleHeader)}>
                  <h3 {...stylex.props(styles.scaleName)}>
                    {t("typography.scale.metaText.name")}
                  </h3>
                  <code {...stylex.props(styles.codeChip)}>
                    0.75rem / fonts.mono
                  </code>
                </div>
                <p {...stylex.props(styles.muted)}>
                  {t.rich("typography.scale.metaText.description", {
                    code: (chunks) => (
                      <code {...stylex.props(styles.inlineCode)}>{chunks}</code>
                    ),
                  })}
                </p>
                <div {...stylex.props(styles.example)}>
                  <time {...stylex.props(styles.metaDate)}>
                    {t("typography.scale.metaText.exampleDate")}
                  </time>
                  <div {...stylex.props(styles.metaTags)}>
                    <Badge
                      variant="outline"
                      className={stylex.props(styles.monoBadge).className}
                    >
                      {t("typography.scale.metaText.exampleTag")}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div {...stylex.props(styles.scaleItem)}>
                <div {...stylex.props(styles.scaleHeader)}>
                  <h3 {...stylex.props(styles.scaleName)}>
                    {t("typography.scale.smallHeading.name")}
                  </h3>
                  <code {...stylex.props(styles.codeChip)}>
                    1rem / fonts.display
                  </code>
                </div>
                <p {...stylex.props(styles.muted)}>
                  {t.rich("typography.scale.smallHeading.description", {
                    code: (chunks) => (
                      <code {...stylex.props(styles.inlineCode)}>{chunks}</code>
                    ),
                  })}
                </p>
                <div {...stylex.props(styles.example)}>
                  <h3 {...stylex.props(styles.smallHeading)}>
                    {t("typography.scale.smallHeading.example")}
                  </h3>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div {...stylex.props(styles.split)}>
          <Card className={stylex.props(styles.doCard).className}>
            <CardHeader>
              <CardTitle className={stylex.props(styles.doTitle).className}>
                {t("typography.dosAndDonts.do.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className={stylex.props(styles.advice).className}>
              <div>
                <p {...stylex.props(styles.adviceTitle)}>
                  {t("typography.dosAndDonts.do.useCanonical.title")}
                </p>
                <code {...stylex.props(styles.adviceCode)}>
                  {t("typography.dosAndDonts.do.useCanonical.classes")}
                </code>
              </div>
              <div>
                <p {...stylex.props(styles.adviceTitle)}>
                  {t("typography.dosAndDonts.do.maintainConsistency.title")}
                </p>
                <p {...stylex.props(styles.adviceBody)}>
                  {t(
                    "typography.dosAndDonts.do.maintainConsistency.description",
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className={stylex.props(styles.dontCard).className}>
            <CardHeader>
              <CardTitle className={stylex.props(styles.dontTitle).className}>
                {t("typography.dosAndDonts.dont.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className={stylex.props(styles.advice).className}>
              <div>
                <p {...stylex.props(styles.adviceTitle)}>
                  {t("typography.dosAndDonts.dont.avoidArbitrary.title")}
                </p>
                <code {...stylex.props(styles.adviceDontCode)}>
                  {t("typography.dosAndDonts.dont.avoidArbitrary.classes")}
                </code>
              </div>
              <div>
                <p {...stylex.props(styles.adviceTitle)}>
                  {t("typography.dosAndDonts.dont.dontMix.title")}
                </p>
                <p {...stylex.props(styles.adviceBody)}>
                  {t("typography.dosAndDonts.dont.dontMix.description")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section {...stylex.props(styles.section)}>
        <div>
          <h2 {...stylex.props(styles.sectionTitle)}>{t("colors.title")}</h2>
          <p {...stylex.props(styles.sectionLead)}>{t("colors.description")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("colors.palette.title")}</CardTitle>
            <CardDescription>{t("colors.palette.description")}</CardDescription>
          </CardHeader>
          <CardContent className={stylex.props(styles.scaleStack).className}>
            <div {...stylex.props(styles.palette)}>
              <div {...stylex.props(styles.swatchRow)}>
                <div {...stylex.props(styles.swatchMeta)}>
                  <div {...stylex.props(styles.swatch, styles.swatchAccent)} />
                  <div>
                    <p {...stylex.props(styles.swatchName)}>
                      {t("colors.palette.accent.name")}
                    </p>
                    <code {...stylex.props(styles.swatchCode)}>
                      colors.accent
                    </code>
                  </div>
                </div>
                <p {...stylex.props(styles.swatchDesc)}>
                  {t("colors.palette.accent.description")}
                </p>
              </div>

              <div {...stylex.props(styles.swatchRow)}>
                <div {...stylex.props(styles.swatchMeta)}>
                  <div
                    {...stylex.props(styles.swatch, styles.swatchForeground)}
                  />
                  <div>
                    <p {...stylex.props(styles.swatchName)}>
                      {t("colors.palette.foreground.name")}
                    </p>
                    <code {...stylex.props(styles.swatchCode)}>
                      colors.foreground
                    </code>
                  </div>
                </div>
                <p {...stylex.props(styles.swatchDesc)}>
                  {t("colors.palette.foreground.description")}
                </p>
              </div>

              <div {...stylex.props(styles.swatchRow)}>
                <div {...stylex.props(styles.swatchMeta)}>
                  <div {...stylex.props(styles.swatch, styles.swatchMuted)} />
                  <div>
                    <p {...stylex.props(styles.swatchName)}>
                      {t("colors.palette.muted.name")}
                    </p>
                    <code {...stylex.props(styles.swatchCode)}>
                      colors.muted
                    </code>
                  </div>
                </div>
                <p {...stylex.props(styles.swatchDesc)}>
                  {t("colors.palette.muted.description")}
                </p>
              </div>

              <div {...stylex.props(styles.swatchRow)}>
                <div {...stylex.props(styles.swatchMeta)}>
                  <div {...stylex.props(styles.swatch, styles.swatchBorder)} />
                  <div>
                    <p {...stylex.props(styles.swatchName)}>
                      {t("colors.palette.border.name")}
                    </p>
                    <code {...stylex.props(styles.swatchCode)}>
                      colors.border
                    </code>
                  </div>
                </div>
                <p {...stylex.props(styles.swatchDesc)}>
                  {t("colors.palette.border.description")}
                </p>
              </div>

              <div {...stylex.props(styles.swatchRow)}>
                <div {...stylex.props(styles.swatchMeta)}>
                  <div
                    {...stylex.props(
                      styles.swatch,
                      styles.swatchMutedForeground,
                    )}
                  />
                  <div>
                    <p {...stylex.props(styles.swatchName)}>
                      {t("colors.palette.mutedForeground.name")}
                    </p>
                    <code {...stylex.props(styles.swatchCode)}>
                      colors.mutedForeground
                    </code>
                  </div>
                </div>
                <p {...stylex.props(styles.swatchDesc)}>
                  {t("colors.palette.mutedForeground.description")}
                </p>
              </div>

              <div {...stylex.props(styles.swatchRow)}>
                <div {...stylex.props(styles.swatchMeta)}>
                  <div
                    {...stylex.props(styles.swatch, styles.swatchBackground)}
                  />
                  <div>
                    <p {...stylex.props(styles.swatchName)}>
                      {t("colors.palette.background.name")}
                    </p>
                    <code {...stylex.props(styles.swatchCode)}>
                      colors.background
                    </code>
                  </div>
                </div>
                <p {...stylex.props(styles.swatchDesc)}>
                  {t("colors.palette.background.description")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section {...stylex.props(styles.section)}>
        <div>
          <h2 {...stylex.props(styles.sectionTitle)}>{t("spacing.title")}</h2>
          <p {...stylex.props(styles.sectionLead)}>
            {t("spacing.description")}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("spacing.scale.title")}</CardTitle>
            <CardDescription>{t("spacing.scale.description")}</CardDescription>
          </CardHeader>
          <CardContent className={stylex.props(styles.scaleStack).className}>
            <div>
              <p {...stylex.props(styles.spacingLabel)}>
                {t("spacing.scale.commonValues")}
              </p>
              <div {...stylex.props(styles.spacingList)}>
                {[2, 3, 4, 6, 8, 12, 16].map((size) => (
                  <div key={size} {...stylex.props(styles.spacingRow)}>
                    <div {...stylex.props(styles.spacingSize)}>
                      <code {...stylex.props(styles.spacingCode)}>
                        {size * 4}px
                      </code>
                    </div>
                    <div {...stylex.props(styles.spacingBarWrap)}>
                      <div
                        {...mergeSx(
                          stylex.props(styles.spacingBar),
                          undefined,
                          {
                            width: `${size * 4}px`,
                          },
                        )}
                      />
                    </div>
                    <code {...stylex.props(styles.spacingCode)}>
                      {size * 0.25}rem
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div {...stylex.props(styles.split)}>
          <Card className={stylex.props(styles.doCard).className}>
            <CardHeader>
              <CardTitle className={stylex.props(styles.doTitle).className}>
                {t("spacing.dosAndDonts.do.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p {...stylex.props(styles.muted)}>
                {t.rich("spacing.dosAndDonts.do.description", {
                  code: (chunks) => (
                    <code {...stylex.props(styles.inlineCode)}>{chunks}</code>
                  ),
                })}
              </p>
            </CardContent>
          </Card>

          <Card className={stylex.props(styles.dontCard).className}>
            <CardHeader>
              <CardTitle className={stylex.props(styles.dontTitle).className}>
                {t("spacing.dosAndDonts.dont.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p {...stylex.props(styles.muted)}>
                {t.rich("spacing.dosAndDonts.dont.description", {
                  code: (chunks) => (
                    <code {...stylex.props(styles.inlineCode)}>{chunks}</code>
                  ),
                })}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section {...stylex.props(styles.section)}>
        <div>
          <h2 {...stylex.props(styles.sectionTitle)}>
            {t("components.title")}
          </h2>
          <p {...stylex.props(styles.sectionLead)}>
            {t("components.description")}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("components.button.title")}</CardTitle>
            <CardDescription>
              {t("components.button.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className={stylex.props(styles.scaleStack).className}>
            <div {...stylex.props(styles.row)}>
              <Button>{t("components.button.variants.default")}</Button>
              <Button variant="outline">
                {t("components.button.variants.outline")}
              </Button>
              <Button variant="ghost">
                {t("components.button.variants.ghost")}
              </Button>
              <Button variant="link">
                {t("components.button.variants.link")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("components.badge.title")}</CardTitle>
            <CardDescription>
              {t("components.badge.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className={stylex.props(styles.scaleStack).className}>
            <div {...stylex.props(styles.row)}>
              <Badge>{t("components.badge.variants.default")}</Badge>
              <Badge variant="outline">
                {t("components.badge.variants.outline")}
              </Badge>
              <Badge variant="secondary">
                {t("components.badge.variants.secondary")}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      <section {...stylex.props(styles.section)}>
        <div>
          <h2 {...stylex.props(styles.sectionTitle)}>{t("slides.title")}</h2>
          <p {...stylex.props(styles.sectionLead)}>{t("slides.description")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("slides.frame.title")}</CardTitle>
            <CardDescription>{t("slides.frame.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div {...stylex.props(styles.preview)}>
              <SlideFrame className={stylex.props(styles.frame).className}>
                <div {...stylex.props(styles.frameInner)}>
                  <SlideHeadline>Example Slide</SlideHeadline>
                  <SlideSubline>16:9 aspect ratio canvas</SlideSubline>
                </div>
              </SlideFrame>
            </div>
            <code {...stylex.props(styles.snippet)}>
              {"<SlideFrame>...</SlideFrame>"}
            </code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("slides.typography.title")}</CardTitle>
            <CardDescription>
              {t("slides.typography.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className={stylex.props(styles.scaleStack).className}>
            <div {...stylex.props(styles.scaleStack)}>
              <div {...stylex.props(styles.scaleItem)}>
                <div {...stylex.props(styles.scaleHeader)}>
                  <span {...stylex.props(styles.slideType)}>
                    {t("slides.typography.headline")}
                  </span>
                  <code {...stylex.props(styles.codeChip)}>SlideHeadline</code>
                </div>
                <div {...stylex.props(styles.example)}>
                  <SlideHeadline
                    className={stylex.props(styles.headlineDemo).className}
                  >
                    Bold Statement Here
                  </SlideHeadline>
                </div>
              </div>

              <Separator />

              <div {...stylex.props(styles.scaleItem)}>
                <div {...stylex.props(styles.scaleHeader)}>
                  <span {...stylex.props(styles.slideType)}>
                    {t("slides.typography.subline")}
                  </span>
                  <code {...stylex.props(styles.codeChip)}>SlideSubline</code>
                </div>
                <div {...stylex.props(styles.example)}>
                  <SlideSubline
                    className={stylex.props(styles.sublineDemo).className}
                  >
                    Supporting tagline or subtitle
                  </SlideSubline>
                </div>
              </div>

              <Separator />

              <div {...stylex.props(styles.scaleItem)}>
                <div {...stylex.props(styles.scaleHeader)}>
                  <span {...stylex.props(styles.slideType)}>
                    {t("slides.typography.body")}
                  </span>
                  <code {...stylex.props(styles.codeChip)}>SlideBody</code>
                </div>
                <div {...stylex.props(styles.example)}>
                  <SlideBody
                    className={stylex.props(styles.bodyDemo).className}
                  >
                    Body text for supporting paragraphs, readable at
                    presentation distance.
                  </SlideBody>
                </div>
              </div>

              <Separator />

              <div {...stylex.props(styles.scaleItem)}>
                <div {...stylex.props(styles.scaleHeader)}>
                  <span {...stylex.props(styles.slideType)}>
                    {t("slides.typography.footnote")}
                  </span>
                  <code {...stylex.props(styles.codeChip)}>SlideFootnote</code>
                </div>
                <div {...stylex.props(styles.example)}>
                  <SlideFootnote
                    className={stylex.props(styles.footnoteDemo).className}
                  >
                    Source: Example citation or footnote
                  </SlideFootnote>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("slides.list.title")}</CardTitle>
            <CardDescription>{t("slides.list.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <SlideList
              items={[
                "First bullet point with important info",
                "Second point explaining a concept",
                "Third point with actionable item",
                "Fourth point wrapping up the list",
              ]}
              className={stylex.props(styles.listDemo).className}
            />
            <code {...stylex.props(styles.snippet)}>
              {'<SlideList items={["Item 1", "Item 2"]} />'}
            </code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("slides.breakdown.title")}</CardTitle>
            <CardDescription>
              {t("slides.breakdown.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className={stylex.props(styles.scaleStack).className}>
            <div>
              <p {...stylex.props(styles.variantLabel)}>Bars variant:</p>
              <SlideBreakdown
                items={[
                  { label: "Category A", value: 75 },
                  { label: "Category B", value: 45 },
                  { label: "Category C", value: 90 },
                ]}
                variant="bars"
              />
            </div>
            <Separator />
            <div>
              <p {...stylex.props(styles.variantLabel)}>Stats variant:</p>
              <SlideBreakdown
                items={[
                  { label: "Metric A", value: 85 },
                  { label: "Metric B", value: 62 },
                  { label: "Metric C", value: 94 },
                ]}
                variant="stats"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("slides.cardGrid.title")}</CardTitle>
            <CardDescription>
              {t("slides.cardGrid.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SlideCardGrid
              cards={[
                {
                  title: "Feature One",
                  subtitle: "2024",
                  description: "Short description of the first feature.",
                },
                {
                  title: "Feature Two",
                  subtitle: "2025",
                  items: ["Sub-item A", "Sub-item B", "Sub-item C"],
                },
                {
                  title: "Feature Three",
                  description: "Another feature with a brief explanation.",
                },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("slides.timeline.title")}</CardTitle>
            <CardDescription>
              {t("slides.timeline.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className={stylex.props(styles.scaleStack).className}>
            <div>
              <p {...stylex.props(styles.variantLabel)}>Horizontal:</p>
              <SlideTimeline
                events={[
                  {
                    title: "Phase 1",
                    description: "Initial setup",
                    metric: "Q1",
                  },
                  {
                    title: "Phase 2",
                    description: "Development",
                    metric: "Q2",
                  },
                  { title: "Phase 3", description: "Launch", metric: "Q3" },
                ]}
                direction="horizontal"
              />
            </div>
            <Separator />
            <div>
              <p {...stylex.props(styles.variantLabel)}>Vertical:</p>
              <SlideTimeline
                events={[
                  {
                    title: "Step 1",
                    description: "Define the problem",
                    metric: "Week 1",
                  },
                  {
                    title: "Step 2",
                    description: "Research solutions",
                    metric: "Week 2",
                  },
                  {
                    title: "Step 3",
                    description: "Implement and test",
                    metric: "Week 3",
                  },
                ]}
                direction="vertical"
              />
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
