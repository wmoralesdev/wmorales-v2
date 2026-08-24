import * as stylex from "@stylexjs/stylex";
import { AlertTriangle, Calendar, FileText, Presentation } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import { DeckShareButton } from "@/components/slides/deck-share-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listDecks } from "@/lib/slides";
import type { InvalidDeckMeta } from "@/lib/slides/fs";
import { colors, fonts, radii } from "@/lib/stylex/tokens.stylex";

export const metadata: Metadata = {
  title: "All Presentations | Slides",
  description: "Browse all available presentation decks",
};

const isDev = process.env.NODE_ENV === "development";

const styles = stylex.create({
  page: {
    marginInline: "auto",
    maxWidth: "56rem",
    paddingInline: "1.5rem",
    paddingBlock: "2rem",
  },
  intro: {
    marginBottom: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  heading: {
    fontFamily: fonts.display,
    fontSize: "1.875rem",
    fontWeight: 600,
    letterSpacing: "-0.025em",
    color: colors.foreground,
  },
  lead: {
    color: colors.mutedForeground,
  },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingBlock: "3rem",
    textAlign: "center",
  },
  emptyIcon: {
    marginBottom: "1rem",
    width: "3rem",
    height: "3rem",
    color: `color-mix(in oklch, ${colors.mutedForeground}, transparent 50%)`,
  },
  emptyTitle: {
    fontSize: "1.125rem",
    fontWeight: 500,
    color: colors.mutedForeground,
  },
  emptyHint: {
    marginTop: "0.25rem",
    fontSize: "0.875rem",
    color: `color-mix(in oklch, ${colors.mutedForeground}, transparent 30%)`,
  },
  emptyCode: {
    fontSize: "0.75rem",
  },
  grid: {
    display: "grid",
    gap: "1rem",
  },
  invalidCard: {
    borderColor: `color-mix(in oklch, ${colors.destructive}, transparent 60%)`,
    backgroundColor: `color-mix(in oklch, ${colors.destructive}, transparent 95%)`,
    opacity: 0.8,
  },
  invalidHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "1rem",
  },
  invalidBody: {
    display: "flex",
    alignItems: "flex-start",
    gap: "1rem",
  },
  invalidIconWrap: {
    display: "flex",
    width: "2.5rem",
    height: "2.5rem",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.lg,
    backgroundColor: `color-mix(in oklch, ${colors.destructive}, transparent 90%)`,
  },
  invalidIcon: {
    width: "1.25rem",
    height: "1.25rem",
    color: colors.destructive,
  },
  invalidCopy: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  invalidTitle: {
    fontFamily: fonts.display,
    fontSize: "1.125rem",
    fontWeight: 600,
    color: `color-mix(in oklch, ${colors.destructive}, transparent 20%)`,
  },
  invalidHint: {
    fontSize: "0.875rem",
    color: colors.mutedForeground,
  },
  errorList: {
    marginTop: "0.25rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.125rem",
  },
  errorItem: {
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    color: `color-mix(in oklch, ${colors.destructive}, transparent 30%)`,
  },
  errorPath: {
    fontWeight: 600,
  },
  invalidBadge: {
    flexShrink: 0,
  },
  deckWrap: {
    position: "relative",
  },
  deckCard: {
    paddingRight: "7rem",
    transitionProperty: "background-color",
    transitionDuration: "150ms",
    ":hover": {
      backgroundColor: `color-mix(in oklch, ${colors.muted}, transparent 70%)`,
    },
  },
  deckHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: "1rem",
  },
  deckBody: {
    display: "flex",
    alignItems: "flex-start",
    gap: "1rem",
    minWidth: 0,
    flex: 1,
  },
  deckIconWrap: {
    display: "flex",
    width: "2.5rem",
    height: "2.5rem",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.lg,
    backgroundColor: `color-mix(in oklch, ${colors.accent}, transparent 90%)`,
  },
  deckIcon: {
    width: "1.25rem",
    height: "1.25rem",
    color: colors.accent,
  },
  deckCopy: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    minWidth: 0,
  },
  deckTitle: {
    fontFamily: fonts.display,
    fontSize: "1.125rem",
    fontWeight: 600,
  },
  deckDate: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    fontSize: "0.75rem",
    color: `color-mix(in oklch, ${colors.mutedForeground}, transparent 30%)`,
  },
  calendar: {
    width: "0.75rem",
    height: "0.75rem",
  },
  deckActions: {
    position: "absolute",
    right: "1rem",
    top: "50%",
    display: "flex",
    transform: "translateY(-50%)",
    alignItems: "center",
    gap: "0.5rem",
  },
});

function InvalidDeckCard({ deck }: { deck: InvalidDeckMeta }) {
  return (
    <Card className={stylex.props(styles.invalidCard).className}>
      <CardHeader className={stylex.props(styles.invalidHeader).className}>
        <div {...stylex.props(styles.invalidBody)}>
          <div {...stylex.props(styles.invalidIconWrap)}>
            <AlertTriangle {...stylex.props(styles.invalidIcon)} />
          </div>
          <div {...stylex.props(styles.invalidCopy)}>
            <CardTitle className={stylex.props(styles.invalidTitle).className}>
              {deck.slug}
            </CardTitle>
            <p {...stylex.props(styles.invalidHint)}>
              Failed to load — validation errors
            </p>
            {isDev && (
              <ul {...stylex.props(styles.errorList)}>
                {deck.errors.map((err) => (
                  <li
                    key={`${err.path}-${err.message}`}
                    {...stylex.props(styles.errorItem)}
                  >
                    <span {...stylex.props(styles.errorPath)}>
                      [{err.path}]
                    </span>{" "}
                    {err.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <Badge
          variant="destructive"
          className={stylex.props(styles.invalidBadge).className}
        >
          Invalid
        </Badge>
      </CardHeader>
    </Card>
  );
}

export default async function SlidesListPage() {
  const locale = await getLocale();
  const allDecks = listDecks(locale);
  const decks = [
    ...allDecks.filter((d) => !d.invalid),
    ...allDecks.filter((d) => d.invalid),
  ];

  return (
    <div {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.intro)}>
        <h1 {...stylex.props(styles.heading)}>Presentations</h1>
        <p {...stylex.props(styles.lead)}>
          Browse and view all available presentation decks.
        </p>
      </div>

      {decks.length === 0 ? (
        <Card>
          <CardContent className={stylex.props(styles.empty).className}>
            <FileText {...stylex.props(styles.emptyIcon)} />
            <p {...stylex.props(styles.emptyTitle)}>No presentations found</p>
            <p {...stylex.props(styles.emptyHint)}>
              Add JSON files to{" "}
              <code {...stylex.props(styles.emptyCode)}>content/slides/</code>{" "}
              to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div {...stylex.props(styles.grid)}>
          {decks.map((deck) =>
            deck.invalid ? (
              <InvalidDeckCard key={deck.slug} deck={deck} />
            ) : (
              <div key={deck.slug} {...stylex.props(styles.deckWrap)}>
                <Link href={`/slides/${deck.slug}`}>
                  <Card className={stylex.props(styles.deckCard).className}>
                    <CardHeader
                      className={stylex.props(styles.deckHeader).className}
                    >
                      <div {...stylex.props(styles.deckBody)}>
                        <div {...stylex.props(styles.deckIconWrap)}>
                          <Presentation {...stylex.props(styles.deckIcon)} />
                        </div>
                        <div {...stylex.props(styles.deckCopy)}>
                          <CardTitle
                            className={stylex.props(styles.deckTitle).className}
                          >
                            {deck.title}
                          </CardTitle>
                          {deck.date && (
                            <p {...stylex.props(styles.deckDate)}>
                              <Calendar {...stylex.props(styles.calendar)} />
                              {new Date(
                                `${deck.date}T12:00:00`,
                              ).toLocaleDateString(
                                locale === "es" ? "es-ES" : "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
                <div {...stylex.props(styles.deckActions)}>
                  <Badge variant="secondary">{deck.slideCount} slides</Badge>
                  <DeckShareButton slug={deck.slug} title={deck.title} />
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
