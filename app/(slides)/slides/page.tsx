import { ArrowLeft, FileText, Presentation } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listDecks } from "@/lib/slides";

export const metadata: Metadata = {
  title: "All Presentations | Slides",
  description: "Browse all available presentation decks",
};

export default function SlidesListPage() {
  const decks = listDecks();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* Header */}
      <div className="mb-8 space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>

        <div className="space-y-2">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            Presentations
          </h1>
          <p className="text-muted-foreground">
            Browse and view all available presentation decks.
          </p>
        </div>
      </div>

      {/* Deck list */}
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
          {decks.map((deck) => (
            <Link key={deck.slug} href={`/slides/${deck.slug}`}>
              <Card className="transition-colors hover:bg-muted/30">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                      <Presentation className="size-5 text-accent" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="font-display text-lg font-semibold">
                        {deck.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        By {deck.author}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="capitalize"
                      style={{
                        borderColor: deck.accentColor,
                        color: deck.accentColor,
                      }}
                    >
                      {deck.theme}
                    </Badge>
                    <Badge variant="secondary">{deck.slideCount} slides</Badge>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
