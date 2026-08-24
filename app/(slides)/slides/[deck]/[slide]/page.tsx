import * as stylex from "@stylexjs/stylex";
import { AlertCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { LandscapeEnforcer } from "@/components/slides";
import { SlidePlayer } from "@/components/slides/slide-player";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { listDeckSlugs, loadDeck } from "@/lib/slides";
import { icon } from "@/lib/stylex/icons";
import { colors, fonts } from "@/lib/stylex/tokens.stylex";

export const dynamicParams = false;

interface PageProps {
  params: Promise<{ deck: string; slide: string }>;
}

const styles = stylex.create({
  error: {
    marginInline: "auto",
    maxWidth: "42rem",
    paddingInline: "1.5rem",
    paddingBlock: "4rem",
  },
  intro: {
    marginBottom: "1rem",
  },
  list: {
    listStylePosition: "inside",
    listStyleType: "disc",
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
  },
  path: {
    fontWeight: 600,
  },
  back: {
    marginTop: "1rem",
    display: "inline-block",
    fontSize: "0.875rem",
    color: colors.mutedForeground,
    ":hover": {
      color: colors.foreground,
    },
  },
});

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
      <div {...stylex.props(styles.error)}>
        <Alert variant="destructive">
          <AlertCircle {...stylex.props(icon.md)} />
          <AlertTitle>Validation Error</AlertTitle>
          <AlertDescription>
            <p {...stylex.props(styles.intro)}>
              The deck <code>{deckSlug}</code> has validation errors:
            </p>
            <ul {...stylex.props(styles.list)}>
              {result.errors.map((error) => (
                <li key={`${error.path}-${error.message}`}>
                  <span {...stylex.props(styles.path)}>[{error.path}]</span>{" "}
                  {error.message}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
        <Link href="/slides" {...stylex.props(styles.back)}>
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
    <div>
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
