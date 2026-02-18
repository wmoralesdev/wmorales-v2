import fs from "node:fs";
import path from "node:path";
import type { Presentation } from "./schema";
import { validatePresentation } from "./validate";

// =============================================================================
// Constants
// =============================================================================

const SLIDES_DIRECTORY = path.join(process.cwd(), "content/slides");
const JSON_FILE_REGEX = /\.json$/;
const LOCALE_JSON_FILE_REGEX = /\.(en|es)\.json$/;
const DEFAULT_LOCALE = "en";

// =============================================================================
// Types
// =============================================================================

export type DeckMeta = {
  slug: string;
  title: string;
  author: string;
  theme: "dark" | "light";
  accentColor: string;
  slideCount: number;
  date?: string;
  invalid?: false;
};

export type InvalidDeckMeta = {
  slug: string;
  invalid: true;
  errors: { path: string; message: string }[];
};

export type LoadDeckResult =
  | { success: true; presentation: Presentation }
  | { success: false; errors: { path: string; message: string }[] };

// =============================================================================
// File system utilities
// =============================================================================

/**
 * Check if the slides directory exists.
 */
export function slidesDirExists(): boolean {
  return fs.existsSync(SLIDES_DIRECTORY);
}

/**
 * Get the path to the slides directory.
 */
export function getSlidesDir(): string {
  return SLIDES_DIRECTORY;
}

/**
 * Extract the base slug from a filename, stripping locale suffix and extension.
 * Handles: slug.en.json, slug.es.json, slug.json
 */
function getSlugFromFileName(fileName: string): string {
  if (LOCALE_JSON_FILE_REGEX.test(fileName)) {
    return fileName.replace(LOCALE_JSON_FILE_REGEX, "");
  }
  return fileName.replace(JSON_FILE_REGEX, "");
}

/**
 * List all unique base deck slugs from the content/slides directory.
 * Deduplicates locale variants (e.g. slug.en.json + slug.es.json → slug).
 */
export function listDeckSlugs(): string[] {
  if (!slidesDirExists()) {
    return [];
  }

  const files = fs.readdirSync(SLIDES_DIRECTORY);
  const slugSet = new Set<string>();

  for (const file of files) {
    if (JSON_FILE_REGEX.test(file)) {
      slugSet.add(getSlugFromFileName(file));
    }
  }

  return Array.from(slugSet);
}

/**
 * Resolve the actual file path for a deck slug + locale.
 * Priority: slug.{locale}.json → slug.en.json (default) → slug.json (legacy)
 */
export function getDeckPath(
  slug: string,
  locale = DEFAULT_LOCALE,
): string | null {
  const localePath = path.join(SLIDES_DIRECTORY, `${slug}.${locale}.json`);
  if (fs.existsSync(localePath)) return localePath;

  if (locale !== DEFAULT_LOCALE) {
    const defaultPath = path.join(
      SLIDES_DIRECTORY,
      `${slug}.${DEFAULT_LOCALE}.json`,
    );
    if (fs.existsSync(defaultPath)) return defaultPath;
  }

  const legacyPath = path.join(SLIDES_DIRECTORY, `${slug}.json`);
  if (fs.existsSync(legacyPath)) return legacyPath;

  return null;
}

/**
 * Load and validate a deck by slug and optional locale.
 */
export function loadDeck(
  slug: string,
  locale = DEFAULT_LOCALE,
): LoadDeckResult {
  const filePath = getDeckPath(slug, locale);

  if (!filePath) {
    return {
      success: false,
      errors: [
        {
          path: "file",
          message: `Deck not found: ${slug}`,
        },
      ],
    };
  }

  let fileContents: string;
  try {
    fileContents = fs.readFileSync(filePath, "utf8");
  } catch (readError) {
    return {
      success: false,
      errors: [
        {
          path: "file",
          message: `Failed to read deck: ${readError instanceof Error ? readError.message : "Unknown error"}`,
        },
      ],
    };
  }

  let data: unknown;
  try {
    data = JSON.parse(fileContents);
  } catch (parseError) {
    return {
      success: false,
      errors: [
        {
          path: "json",
          message: `Invalid JSON: ${parseError instanceof Error ? parseError.message : "Unknown parse error"}`,
        },
      ],
    };
  }

  const validationResult = validatePresentation(data);

  if (validationResult.success) {
    return { success: true, presentation: validationResult.data };
  }

  return { success: false, errors: validationResult.errors };
}

/**
 * List all available decks with basic metadata for a given locale.
 * Invalid decks are included with their errors instead of being silently dropped.
 */
export function listDecks(
  locale = DEFAULT_LOCALE,
): (DeckMeta | InvalidDeckMeta)[] {
  const slugs = listDeckSlugs();
  const decks: (DeckMeta | InvalidDeckMeta)[] = [];

  for (const slug of slugs) {
    const result = loadDeck(slug, locale);
    if (result.success) {
      const { meta, slides } = result.presentation;
      decks.push({
        slug,
        title: meta.title,
        author: meta.author,
        theme: meta.theme,
        accentColor: meta.accentColor,
        slideCount: slides.length,
        date: meta.date,
      });
    } else {
      decks.push({ slug, invalid: true, errors: result.errors });
    }
  }

  return decks;
}

/**
 * Load raw JSON data for a deck (without validation).
 * Useful for debugging or when you want to handle validation separately.
 */
export function loadDeckRaw(
  slug: string,
  locale = DEFAULT_LOCALE,
): unknown | null {
  const filePath = getDeckPath(slug, locale);

  if (!filePath) {
    return null;
  }

  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch {
    return null;
  }
}
