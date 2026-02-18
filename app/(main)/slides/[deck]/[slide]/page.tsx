import { AlertCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { LandscapeEnforcer } from "@/components/slides";
import { SlidePlayer } from "@/components/slides/slide-player";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { listDeckSlugs, loadDeck } from "@/lib/slides";

export const dynamicParams = false;

interface PageProps {
  params: Promise<{ deck: string; slide: string }>;
}

export async function generateStaticParams() {
  const slugs = listDeckSlugs();
  const params: { deck: string; slide: string }[] = [];

  for (const deck of slugs) {
    const result = loadDeck(deck);
    if (result.success) {
      for (let i = 0; i < result.presentation.slides.length; i++) {
        params.push({ deck, slide: String(i) });
      }
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { deck: deckSlug, slide: slideParam } = await params;
  const locale = await getLocale();
  const result = loadDeck(deckSlug, locale);

  if (!result.success) {
    return { title: "Deck Not Found" };
  }

  const { meta, slides } = result.presentation;
  const slideIndex = Math.max(
    0,
    Math.min(Number.parseInt(slideParam, 10) || 0, slides.length - 1),
  );
  const slide = slides[slideIndex];
  const isFirstSlide = slideIndex === 0;

  const seoTitle = meta.seo?.title ?? `${meta.title} | ${meta.author}`;
  const seoDescription =
    meta.seo?.description ?? `Slide ${slideIndex + 1}: ${slide.headline}`;
  const seoImage = meta.seo?.image;

  return {
    title: isFirstSlide ? seoTitle : `${slide.headline} | ${meta.title}`,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: "website",
      ...(seoImage && { images: [{ url: seoImage }] }),
    },
    twitter: {
      card: seoImage ? "summary_large_image" : "summary",
      title: seoTitle,
      description: seoDescription,
      ...(seoImage && { images: [seoImage] }),
    },
  };
}

export default async function SlideViewPage({ params }: PageProps) {
  const { deck: deckSlug, slide: slideParam } = await params;
  const locale = await getLocale();
  const result = loadDeck(deckSlug, locale);

  if (!result.success) {
    if (result.errors.some((e) => e.path === "file")) {
      notFound();
    }

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
      Number.parseInt(slideParam, 10) || 0,
      presentation.slides.length - 1,
    ),
  );

  return (
    <div className="relative ml-[calc(-50vw+50%)] w-screen">
      <LandscapeEnforcer>
        <SlidePlayer
          presentation={presentation}
          deckSlug={deckSlug}
          currentSlide={currentSlide}
        />
      </LandscapeEnforcer>
    </div>
  );
}
