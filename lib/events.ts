import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const EVENTS_DIRECTORY = path.join(process.cwd(), "content/events");
const MDOC_FILE_REGEX = /\.mdoc$/;
const LOCALE_MDOC_FILE_REGEX = /\.(en|es)\.mdoc$/;
const DEFAULT_LOCALE = "en";

export type EventMeta = {
  slug: string;
  title: string;
  date: string;
  location?: string;
  coverImage: string;
  link: string;
  published?: boolean;
};

function getSlugFromFileName(fileName: string): string {
  if (LOCALE_MDOC_FILE_REGEX.test(fileName)) {
    return fileName.replace(LOCALE_MDOC_FILE_REGEX, "");
  }
  return fileName.replace(MDOC_FILE_REGEX, "");
}

function findEventFile(slug: string, locale: string): string | null {
  // Try locale-specific file first
  const localeFile = path.join(EVENTS_DIRECTORY, `${slug}.${locale}.mdoc`);
  if (fs.existsSync(localeFile)) {
    return localeFile;
  }

  // Fallback to default locale
  const defaultFile = path.join(
    EVENTS_DIRECTORY,
    `${slug}.${DEFAULT_LOCALE}.mdoc`,
  );
  if (fs.existsSync(defaultFile)) {
    return defaultFile;
  }

  // Fallback to non-localized file
  const genericFile = path.join(EVENTS_DIRECTORY, `${slug}.mdoc`);
  if (fs.existsSync(genericFile)) {
    return genericFile;
  }

  return null;
}

function parseEventMeta(filePath: string, slug: string): EventMeta | null {
  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);

    const rawDate = data.date || new Date();
    const date =
      rawDate instanceof Date ? rawDate.toISOString() : String(rawDate);

    if (!data.coverImage || !data.link) {
      return null;
    }

    return {
      slug,
      title: data.title || slug,
      date,
      location: data.location,
      coverImage: data.coverImage,
      link: data.link,
      published: data.published !== false,
    };
  } catch {
    return null;
  }
}

export function getAllEvents(locale: string = DEFAULT_LOCALE): EventMeta[] {
  if (!fs.existsSync(EVENTS_DIRECTORY)) {
    return [];
  }

  const fileNames = fs.readdirSync(EVENTS_DIRECTORY);
  const slugSet = new Set<string>();

  for (const fileName of fileNames) {
    // Skip template files
    if (fileName.startsWith("_")) {
      continue;
    }
    if (fileName.endsWith(".mdoc")) {
      slugSet.add(getSlugFromFileName(fileName));
    }
  }

  const events: EventMeta[] = [];

  for (const slug of slugSet) {
    const filePath = findEventFile(slug, locale);
    if (!filePath) {
      continue;
    }

    const meta = parseEventMeta(filePath, slug);
    if (meta && meta.published !== false) {
      events.push(meta);
    }
  }

  return events.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
