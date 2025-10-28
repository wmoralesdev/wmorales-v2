import GithubSlugger from "github-slugger";
import readingTime from "reading-time";

export function calculateReadingTime(content: string) {
  return readingTime(content);
}

export function extractHeadings(content: string) {
  const slugger = new GithubSlugger();
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Array<{ id: string; text: string; level: number }> = [];

  let match: RegExpExecArray | null = headingRegex.exec(content);
  while (match !== null) {
    const level = match[1].length;
    const text = match[2];
    const id = slugger.slug(text);
    match = headingRegex.exec(content);

    headings.push({ id, text, level });
  }

  return headings;
}

export function formatDate(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function generateExcerpt(content: string, maxLength = 160) {
  // Remove markdown syntax
  const plainText = content
    .replace(/^#{1,6}\s+/gm, "") // Remove headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links
    .replace(/[*_`~]/g, "") // Remove emphasis
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "") // Remove images
    .replace(/\n+/g, " ") // Replace newlines with spaces
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // Cut at last complete word
  const trimmed = plainText.substring(0, maxLength);
  const lastSpace = trimmed.lastIndexOf(" ");

  return `${trimmed.substring(0, lastSpace)}...`;
}
