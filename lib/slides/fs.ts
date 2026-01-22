import fs from "node:fs";
import path from "node:path";
import type { Presentation } from "./schema";
import { validatePresentation } from "./validate";

// =============================================================================
// Constants
// =============================================================================

const SLIDES_DIRECTORY = path.join(process.cwd(), "content/slides");
const JSON_FILE_REGEX = /\.json$/;

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
 * Get the slug from a JSON filename.
 */
function getSlugFromFileName(fileName: string): string {
  return fileName.replace(JSON_FILE_REGEX, "");
}

/**
 * List all available deck slugs from the content/slides directory.
 */
export function listDeckSlugs(): string[] {
  if (!slidesDirExists()) {
    return [];
  }

  const files = fs.readdirSync(SLIDES_DIRECTORY);
  return files
    .filter((file) => JSON_FILE_REGEX.test(file))
    .map(getSlugFromFileName);
}

/**
 * List all available decks with basic metadata.
 * Only includes decks that pass validation.
 */
export function listDecks(): DeckMeta[] {
  const slugs = listDeckSlugs();
  const decks: DeckMeta[] = [];

  for (const slug of slugs) {
    const result = loadDeck(slug);
    if (result.success) {
      const { meta, slides } = result.presentation;
      decks.push({
        slug,
        title: meta.title,
        author: meta.author,
        theme: meta.theme,
        accentColor: meta.accentColor,
        slideCount: slides.length,
      });
    }
  }

  return decks;
}

/**
 * Get the file path for a deck by slug.
 */
export function getDeckPath(slug: string): string | null {
  const filePath = path.join(SLIDES_DIRECTORY, `${slug}.json`);
  return fs.existsSync(filePath) ? filePath : null;
}

/**
 * Load and validate a deck by slug.
 */
export function loadDeck(slug: string): LoadDeckResult {
  const filePath = getDeckPath(slug);

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
 * Load raw JSON data for a deck (without validation).
 * Useful for debugging or when you want to handle validation separately.
 */
export function loadDeckRaw(slug: string): unknown | null {
  const filePath = getDeckPath(slug);

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
