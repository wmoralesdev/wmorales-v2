import { slug as createSlug } from "github-slugger";
import { PostTocClient, type TocItem } from "./post-toc-client";

type PostTocProps = {
  contentHtml: string;
};

/**
 * Extract H1 and H2 headings from rendered HTML and return TOC items.
 * Also ensures each heading has an id (adds one if missing).
 * Skips the first H1 (typically the post intro title).
 */
function extractTocItems(html: string): {
  items: TocItem[];
  htmlWithIds: string;
} {
  // Collect all headings with their positions for proper ordering
  const headingMatches: Array<{
    index: number;
    level: 1 | 2;
    attrs: string;
    content: string;
    fullMatch: string;
  }> = [];

  // Match H1 and H2 tags
  const h1Regex = /<h1([^>]*)>([\s\S]*?)<\/h1>/gi;
  const h2Regex = /<h2([^>]*)>([\s\S]*?)<\/h2>/gi;

  for (const match of html.matchAll(h1Regex)) {
    headingMatches.push({
      index: match.index ?? 0,
      level: 1,
      attrs: match[1],
      content: match[2],
      fullMatch: match[0],
    });
  }
  for (const match of html.matchAll(h2Regex)) {
    headingMatches.push({
      index: match.index ?? 0,
      level: 2,
      attrs: match[1],
      content: match[2],
      fullMatch: match[0],
    });
  }

  // Sort by position in document
  headingMatches.sort((a, b) => a.index - b.index);

  // Skip the first H1 (intro title)
  const firstH1Index = headingMatches.findIndex((h) => h.level === 1);
  const filteredHeadings =
    firstH1Index !== -1
      ? headingMatches.filter((_, i) => i !== firstH1Index)
      : headingMatches;

  const items: TocItem[] = [];
  let htmlWithIds = html;

  for (const heading of filteredHeadings) {
    const textContent = heading.content
      .replace(/<[^>]*>/g, "")
      .replace(/#$/, "")
      .trim();
    if (!textContent) continue;

    // Check if id already exists
    const idMatch = heading.attrs.match(/id=["']([^"']+)["']/);
    let id = idMatch ? idMatch[1] : null;

    // Generate id if missing
    if (!id) {
      id = createSlug(textContent);
      const tag = `h${heading.level}`;
      const newAttrs = heading.attrs
        ? `${heading.attrs} id="${id}"`
        : ` id="${id}"`;
      htmlWithIds = htmlWithIds.replace(
        heading.fullMatch,
        `<${tag}${newAttrs}>${heading.content}</${tag}>`,
      );
    }

    items.push({ id, title: textContent, level: heading.level });
  }

  return { items, htmlWithIds };
}

export function PostToc({ contentHtml }: PostTocProps) {
  const { items } = extractTocItems(contentHtml);

  if (items.length === 0) return null;

  return <PostTocClient items={items} />;
}

/**
 * Utility to ensure all H2 headings have IDs.
 * Call this before rendering PostBody and PostToc to keep HTML consistent.
 */
export function ensureHeadingIds(html: string): string {
  const { htmlWithIds } = extractTocItems(html);
  return htmlWithIds;
}
