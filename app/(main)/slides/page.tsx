import { AlertTriangle, Calendar, FileText, Presentation } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import { DeckShareButton } from "@/components/slides/deck-share-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listDecks } from "@/lib/slides";
import type { InvalidDeckMeta } from "@/lib/slides/fs";

export const metadata: Metadata = {
  title: "All Presentations | Slides",
  description: "Browse all available presentation decks",
};

const isDev = process.env.NODE_ENV === "development";

function InvalidDeckCard({ deck }: { deck: InvalidDeckMeta }) {
  return (
    <Card className="border-destructive/40 bg-destructive/5 opacity-80">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
            <AlertTriangle className="size-5 text-destructive" />
          </div>
          <div className="space-y-1">
            <CardTitle className="font-display text-lg font-semibold text-destructive/80">
              {deck.slug}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Failed to load — validation errors
            </p>
            {isDev && (
              <ul className="mt-1 space-y-0.5">
                {deck.errors.map((err) => (
                  <li
                    key={`${err.path}-${err.message}`}
                    className="font-mono text-xs text-destructive/70"
                  >
                    <span className="font-semibold">[{err.path}]</span>{" "}
                    {err.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <Badge variant="destructive" className="shrink-0">
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
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-8 space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          Presentations
        </h1>
        <p className="text-muted-foreground">
          Browse and view all available presentation decks.
        </p>
      </div>

      {decks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="mb-4 size-12 text-muted-foreground/50" />
            <p className="text-lg font-medium text-muted-foreground">
              No presentations found
            </p>
            <p className="mt-1 text-sm text-muted-foreground/70">
              Add JSON files to <code className="text-xs">content/slides/</code>{" "}
              to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {decks.map((deck) =>
            deck.invalid ? (
              <InvalidDeckCard key={deck.slug} deck={deck} />
            ) : (
              <div key={deck.slug} className="relative">
                <Link href={`/slides/${deck.slug}`}>
                  <Card className="transition-colors hover:bg-muted/30 pr-28">
                    <CardHeader className="flex flex-row items-start gap-4">
                      <div className="flex items-start gap-4 min-w-0 flex-1">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                          <Presentation className="size-5 text-accent" />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <CardTitle className="font-display text-lg font-semibold">
                            {deck.title}
                          </CardTitle>
                          {deck.date && (
                            <p className="flex items-center gap-1 text-xs text-muted-foreground/70">
                              <Calendar className="size-3" />
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
                <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2">
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
