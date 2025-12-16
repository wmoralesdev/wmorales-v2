import { slug as createSlug } from "github-slugger";
import { PostTocClient, type TocItem } from "./post-toc-client";

type PostTocProps = {
  contentHtml: string;
};

/**
 * Extract H2 headings from rendered HTML and return TOC items.
 * Also ensures each heading has an id (adds one if missing).
 */
function extractTocItems(html: string): {
  items: TocItem[];
  htmlWithIds: string;
} {
  const items: TocItem[] = [];
  // Match <h2 ...>...</h2> tags
  const h2Regex = /<h2([^>]*)>([\s\S]*?)<\/h2>/gi;

  const htmlWithIds = html.replace(h2Regex, (match, attrs, content) => {
    // Extract text content (strip inner HTML tags and trailing # anchor)
    const textContent = content
      .replace(/<[^>]*>/g, "")
      .replace(/#$/, "")
      .trim();
    if (!textContent) return match;

    // Check if id already exists
    const idMatch = attrs.match(/id=["']([^"']+)["']/);
    let id = idMatch ? idMatch[1] : null;

    // Generate id if missing
    if (!id) {
      id = createSlug(textContent);
      // Insert id into attributes
      const newAttrs = attrs ? `${attrs} id="${id}"` : ` id="${id}"`;
      items.push({ id, title: textContent });
      return `<h2${newAttrs}>${content}</h2>`;
    }

    items.push({ id, title: textContent });
    return match;
  });

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
