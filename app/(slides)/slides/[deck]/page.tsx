import { AlertCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Deck, LandscapeEnforcer } from "@/components/slides";
import { SlideNavigation } from "@/components/slides/slide-navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { listDeckSlugs, loadDeck } from "@/lib/slides";

interface PageProps {
  params: Promise<{ deck: string }>;
  searchParams: Promise<{ slide?: string }>;
}

export async function generateStaticParams() {
  const slugs = listDeckSlugs();
  return slugs.map((deck) => ({ deck }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { deck: deckSlug } = await params;
  const result = loadDeck(deckSlug);

  if (!result.success) {
    return {
      title: "Deck Not Found",
    };
  }

  return {
    title: `${result.presentation.meta.title} | Slides`,
    description: `Presentation by ${result.presentation.meta.author}`,
  };
}

export default async function DeckPreviewPage({
  params,
  searchParams,
}: PageProps) {
  const { deck: deckSlug } = await params;
  const { slide: slideParam } = await searchParams;
  const result = loadDeck(deckSlug);

  if (!result.success) {
    // Check if deck exists but has validation errors
    if (result.errors.some((e) => e.path === "file")) {
      notFound();
    }

    // Show validation errors
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Validation Error</AlertTitle>
          <AlertDescription>
            <p className="mb-4">
              The deck <code>{deckSlug}</code> has validation errors:
            </p>
            <ul className="list-inside list-disc space-y-1 font-mono text-xs">
              {result.errors.map((error) => (
                <li key={`${error.path}-${error.message}`}>
                  <span className="font-semibold">[{error.path}]</span>{" "}
                  {error.message}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
        <Link
          href="/slides"
          className="mt-4 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to all decks
        </Link>
      </div>
    );
  }

  const { presentation } = result;
  const currentSlide = Math.max(
    0,
    Math.min(
      Number.parseInt(slideParam || "0", 10) || 0,
      presentation.slides.length - 1,
    ),
  );

  return (
    <LandscapeEnforcer>
      <div className="flex min-h-dvh flex-col">
        {/* Slide viewer */}
        <div className="flex flex-1 items-center justify-center bg-muted/30 p-4 md:p-8">
          <div className="w-full max-w-6xl overflow-hidden rounded-lg shadow-lg">
            <Deck
              presentation={presentation}
              currentSlide={currentSlide}
              printMode={false}
            />
          </div>
        </div>

        {/* Navigation */}
        <SlideNavigation
          deckSlug={deckSlug}
          currentSlide={currentSlide}
          totalSlides={presentation.slides.length}
        />
      </div>
    </LandscapeEnforcer>
  );
}
