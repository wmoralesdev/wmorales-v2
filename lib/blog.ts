import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import * as Markdoc from "@markdoc/markdoc";
import { codeToHtml } from "shiki";
import { slug as createSlug } from "github-slugger";

const POSTS_DIRECTORY = path.join(process.cwd(), "content/blog");
const MDOC_POSTS_DIRECTORY = path.join(process.cwd(), "content/posts");
const MD_FILE_REGEX = /\.md$/;
const MDOC_FILE_REGEX = /\.mdoc$/;
const LOCALE_MD_FILE_REGEX = /\.(en|es)\.md$/;
const DEFAULT_LOCALE = "en";

export type PostAttachment = {
  title: string;
  url: string;
  type?: "pdf" | "slides" | "repo" | "other";
};

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary?: string;
  tags?: string[];
  published?: boolean;
  readingTimeMinutes?: number;
  readingTimeText?: string;
  coverImage?: string;
  ogImage?: string;
  canonicalUrl?: string;
  attachments?: PostAttachment[];
};

export type Post = {
  meta: PostMeta;
  contentHtml: string;
};

function ensurePostsDirectory(): void {
  if (!fs.existsSync(POSTS_DIRECTORY)) {
    fs.mkdirSync(POSTS_DIRECTORY, { recursive: true });
  }
  if (!fs.existsSync(MDOC_POSTS_DIRECTORY)) {
    fs.mkdirSync(MDOC_POSTS_DIRECTORY, { recursive: true });
  }
}

function getSlugFromMdocFileName(fileName: string): string {
  return fileName.replace(MDOC_FILE_REGEX, "");
}

function getSlugFromFileName(fileName: string): string {
  // Handle both formats: "hello-world.md" and "hello-world.en.md"
  if (LOCALE_MD_FILE_REGEX.test(fileName)) {
    return fileName.replace(LOCALE_MD_FILE_REGEX, "");
  }
  return fileName.replace(MD_FILE_REGEX, "");
}

function findPostFile(
  slug: string,
  locale: string
): { path: string; type: "md" | "mdoc" } | null {
  // First try Markdown files in content/blog
  const localeFile = path.join(POSTS_DIRECTORY, `${slug}.${locale}.md`);
  if (fs.existsSync(localeFile)) {
    return { path: localeFile, type: "md" };
  }

  const defaultFile = path.join(
    POSTS_DIRECTORY,
    `${slug}.${DEFAULT_LOCALE}.md`
  );
  if (fs.existsSync(defaultFile)) {
    return { path: defaultFile, type: "md" };
  }

  const legacyFile = path.join(POSTS_DIRECTORY, `${slug}.md`);
  if (fs.existsSync(legacyFile)) {
    return { path: legacyFile, type: "md" };
  }

  // Then try Markdoc files in content/posts
  const mdocFile = path.join(MDOC_POSTS_DIRECTORY, `${slug}.mdoc`);
  if (fs.existsSync(mdocFile)) {
    return { path: mdocFile, type: "mdoc" };
  }

  return null;
}

function parseMdocMeta(filePath: string, slug: string): PostMeta | null {
  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    // Map Markdoc frontmatter to PostMeta format
    const publishedAt =
      data.publishedAt || data.date || new Date().toISOString();
    const readingTimeResult = readingTime(content);

    return {
      slug: data.slug || slug,
      title: data.title || slug,
      date: publishedAt,
      summary: data.description || data.summary,
      tags: data.tags || [],
      published: data.published !== false,
      readingTimeMinutes: Math.ceil(readingTimeResult.minutes),
      readingTimeText: readingTimeResult.text,
      coverImage: data.coverImage,
      ogImage: data.ogImage,
      canonicalUrl: data.canonicalUrl,
      attachments: data.attachments,
    } as PostMeta;
  } catch {
    return null;
  }
}

// Helper to get callout icon and colors
function getCalloutStyles(type: string = "info") {
  const styles = {
    info: { icon: "ℹ️", borderColor: "border-l-accent", textColor: "text-accent" },
    tip: { icon: "💡", borderColor: "border-l-green-500", textColor: "text-green-500" },
    warning: { icon: "⚠️", borderColor: "border-l-amber-500", textColor: "text-amber-500" },
    error: { icon: "❌", borderColor: "border-l-red-500", textColor: "text-red-500" },
    success: { icon: "✓", borderColor: "border-l-green-500", textColor: "text-green-500" },
  };
  return styles[type as keyof typeof styles] || styles.info;
}

// Helper to get card border color
function getCardBorder(variant: string = "default") {
  const borders = {
    default: "border-border/60",
    feature: "border-accent/50",
    warning: "border-amber-500/20",
    success: "border-green-500/20",
  };
  return borders[variant as keyof typeof borders] || borders.default;
}

// Helper to get separator spacing
function getSeparatorSpacing(spacing: string = "normal") {
  const spacings = {
    small: "my-4",
    normal: "my-8",
    large: "my-12",
  };
  return spacings[spacing as keyof typeof spacings] || spacings.normal;
}

// Pre-process code blocks: extract and highlight with Shiki
async function preprocessCodeBlocks(content: string): Promise<{ processedContent: string; codeBlocks: Map<string, string> }> {
  const codeBlocks = new Map<string, string>();
  // Match code blocks with optional language identifier
  // Handles: ```lang\ncode``` and ```\ncode```
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const matches: Array<{ placeholder: string; lang: string; code: string; fullMatch: string }> = [];
  let match;
  let index = 0;

  // Collect all matches first
  while ((match = codeBlockRegex.exec(content)) !== null) {
    const lang = match[1] || "text";
    const code = match[2];
    const placeholder = `__CODE_BLOCK_${index}__`;
    matches.push({
      placeholder,
      lang,
      code,
      fullMatch: match[0],
    });
    index++;
  }

  // Process all code blocks in parallel
  const processedBlocks = await Promise.all(
    matches.map(async ({ placeholder, lang, code }) => {
      try {
        const highlighted = await codeToHtml(code, {
          lang,
          theme: "github-dark",
        });
        // Extract just the code content (Shiki wraps it in pre/code)
        const codeMatch = highlighted.match(/<code[^>]*>([\s\S]*?)<\/code>/);
        const codeContent = codeMatch ? codeMatch[1] : highlighted;
        
        // Escape the code content for embedding in HTML
        const escapedCode = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        
        // Escape code for data attribute (base64 encode to avoid issues)
        const codeBase64 = Buffer.from(code, 'utf8').toString('base64');
        
        // Create wrapper with copy button
        const codeBlockHtml = `<div class="group relative my-4">
  <pre class="overflow-x-auto rounded-lg border border-border/60 bg-muted p-4"><code class="font-mono text-xs">${codeContent}</code></pre>
  <button class="absolute right-2 top-2 rounded border border-border/60 bg-background px-2 py-1 font-mono text-xs opacity-0 transition-opacity group-hover:opacity-100" data-code="${codeBase64}" onclick="const code = atob(this.dataset.code); navigator.clipboard.writeText(code); this.textContent='Copied!'; setTimeout(() => this.textContent='Copy', 2000);">Copy</button>
</div>`;
        
        return { placeholder, html: codeBlockHtml };
      } catch (error) {
        console.error(`Error highlighting code block:`, error);
        // Fallback: plain code block with escaped HTML
        const escapedCode = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        const codeBase64 = Buffer.from(code, 'utf8').toString('base64');
        const fallbackHtml = `<div class="group relative my-4">
  <pre class="overflow-x-auto rounded-lg border border-border/60 bg-muted p-4"><code class="font-mono text-xs">${escapedCode}</code></pre>
  <button class="absolute right-2 top-2 rounded border border-border/60 bg-background px-2 py-1 font-mono text-xs opacity-0 transition-opacity group-hover:opacity-100" data-code="${codeBase64}" onclick="const code = atob(this.dataset.code); navigator.clipboard.writeText(code); this.textContent='Copied!'; setTimeout(() => this.textContent='Copy', 2000);">Copy</button>
</div>`;
        return { placeholder, html: fallbackHtml };
      }
    })
  );

  // Build the map and replace in reverse order to preserve indices
  let processedContent = content;
  for (let i = matches.length - 1; i >= 0; i--) {
    const { placeholder, html } = processedBlocks[i];
    const { fullMatch } = matches[i];
    codeBlocks.set(placeholder, html);
    processedContent = processedContent.replace(fullMatch, placeholder);
  }

  return { processedContent, codeBlocks };
}

async function renderMdocContent(content: string): Promise<string> {
  try {
    // Pre-process code blocks with Shiki
    const { processedContent, codeBlocks } = await preprocessCodeBlocks(content);
    
    const ast = Markdoc.parse(processedContent);
    
    // Config with custom renderers for styled HTML output
    const config = {
      tags: {
        callout: {
          attributes: {
            type: { type: String, default: "info" },
            title: { type: String },
          },
          render: "Callout",
          transform(node: Markdoc.Node, config: Markdoc.Config) {
            const type = node.attributes.type || "info";
            const title = node.attributes.title;
            const styles = getCalloutStyles(type);
            const children = Markdoc.renderers.html(node.children, config);
            
            return `<div class="my-4 rounded-lg border border-border/60 ${styles.borderColor} bg-muted/30 p-4">
  <div class="flex gap-3">
    <span class="${styles.textColor}">${styles.icon}</span>
    <div class="space-y-1">
      ${title ? `<p class="font-display text-sm font-medium text-foreground">${title}</p>` : ""}
      <div class="text-sm text-muted-foreground">${children}</div>
    </div>
  </div>
</div>`;
          },
        },
        card: {
          attributes: {
            title: { type: String },
            description: { type: String },
            variant: { type: String, default: "default" },
          },
          render: "Card",
          transform(node: Markdoc.Node, config: Markdoc.Config) {
            const title = node.attributes.title;
            const description = node.attributes.description;
            const variant = node.attributes.variant || "default";
            const borderColor = getCardBorder(variant);
            const children = Markdoc.renderers.html(node.children, config);
            
            return `<div class="my-4 rounded-lg border ${borderColor} bg-muted/20 p-4">
  ${title ? `<p class="font-display text-base font-medium text-foreground">${title}</p>` : ""}
  ${description ? `<p class="mt-1 text-xs text-muted-foreground">${description}</p>` : ""}
  <div class="mt-3 text-sm text-muted-foreground">${children}</div>
</div>`;
          },
        },
        video: {
          attributes: {
            src: { type: String, required: true },
            title: { type: String },
            poster: { type: String },
          },
          render: "Video",
          transform(node: Markdoc.Node) {
            const src = node.attributes.src;
            const poster = node.attributes.poster;
            const title = node.attributes.title;
            
            return `<video controls class="my-4 w-full rounded-lg border border-border/60"${poster ? ` poster="${poster}"` : ""}${title ? ` title="${title}"` : ""}>
  <source src="${src}" type="video/mp4" />
</video>`;
          },
        },
        separator: {
          attributes: {
            spacing: { type: String, default: "normal" },
          },
          render: "Separator",
          transform(node: Markdoc.Node) {
            const spacing = getSeparatorSpacing(node.attributes.spacing);
            return `<hr class="${spacing} border-t border-border/60" />`;
          },
        },
        "code-block": {
          attributes: {
            language: { type: String },
            filename: { type: String },
          },
          render: "CodeBlock",
          // This will be handled by pre-processing, but we keep it for validation
        },
      },
      nodes: {
        heading: {
          transform(node: Markdoc.Node, config: Markdoc.Config) {
            const level = node.attributes.level as number;
            const text = Markdoc.renderers.html(node.children, config);
            const headingSlug = createSlug(text.replace(/<[^>]*>/g, "")); // Remove HTML tags for slug
            const headingId = headingSlug;
            
            const headingClasses = {
              1: "font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl mt-8",
              2: "font-display text-xl font-semibold tracking-tight text-foreground mt-8",
              3: "font-display text-lg font-semibold text-foreground mt-6",
              4: "font-display text-base font-medium text-foreground mt-4",
            };
            
            const classes = headingClasses[level as keyof typeof headingClasses] || headingClasses[2];
            
            return `<h${level} id="${headingId}" class="group ${classes}">
  ${text}
  <a href="#${headingId}" class="ml-2 text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100">#</a>
</h${level}>`;
          },
        },
        fence: {
          // Code blocks are pre-processed, so this shouldn't be hit, but handle gracefully
          transform(node: Markdoc.Node) {
            const code = node.attributes.content || "";
            return `<div class="group relative my-4">
  <pre class="overflow-x-auto rounded-lg border border-border/60 bg-muted p-4"><code class="font-mono text-xs">${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
  <button class="absolute right-2 top-2 rounded border border-border/60 bg-background px-2 py-1 font-mono text-xs opacity-0 transition-opacity group-hover:opacity-100" onclick="navigator.clipboard.writeText(this.closest('.group').querySelector('code').textContent); this.textContent='Copied!'; setTimeout(() => this.textContent='Copy', 2000);">Copy</button>
</div>`;
          },
        },
      },
    };

    // Validate but don't block rendering
    const errors = Markdoc.validate(ast, config);
    if (errors.length > 0 && process.env.NODE_ENV === "development") {
      console.warn("Markdoc validation warnings (non-blocking):", errors.length, "issues found");
    }

    // Transform and render
    const renderable = Markdoc.transform(ast, config);
    let html = Markdoc.renderers.html(renderable);
    
    // Post-process: replace code block placeholders with highlighted versions
    for (const [placeholder, codeHtml] of codeBlocks.entries()) {
      html = html.replace(placeholder, codeHtml);
    }
    
    return html;
  } catch (error) {
    console.error("Error rendering Markdoc:", error);
    // Fallback: return content as-is wrapped in a div
    return `<div class="prose-minimal">${content}</div>`;
  }
}

export function getAllPosts(locale: string = DEFAULT_LOCALE): PostMeta[] {
  ensurePostsDirectory();

  const posts: PostMeta[] = [];

  // Read Markdown posts from content/blog
  if (fs.existsSync(POSTS_DIRECTORY)) {
    const fileNames = fs.readdirSync(POSTS_DIRECTORY);
    const slugSet = new Set<string>();

    fileNames.forEach((fileName) => {
      if (fileName.endsWith(".md")) {
        slugSet.add(getSlugFromFileName(fileName));
      }
    });

    Array.from(slugSet).forEach((slug) => {
      const fileInfo = findPostFile(slug, locale);
      if (!fileInfo || fileInfo.type !== "md") {
        return;
      }

      try {
        const fileContents = fs.readFileSync(fileInfo.path, "utf8");
        const { data, content } = matter(fileContents);
        const readingTimeResult = readingTime(content);

        posts.push({
          slug: data.slug || slug,
          title: data.title || slug,
          date: data.date || new Date().toISOString(),
          summary: data.summary,
          tags: data.tags,
          published: data.published ?? true,
          readingTimeMinutes: Math.ceil(readingTimeResult.minutes),
          readingTimeText: readingTimeResult.text,
          coverImage: data.coverImage,
          ogImage: data.ogImage,
          canonicalUrl: data.canonicalUrl,
          attachments: data.attachments,
        } as PostMeta);
      } catch {
        // Skip files that can't be parsed
      }
    });
  }

  // Read Markdoc posts from content/posts
  if (fs.existsSync(MDOC_POSTS_DIRECTORY)) {
    const mdocFileNames = fs.readdirSync(MDOC_POSTS_DIRECTORY);

    mdocFileNames.forEach((fileName) => {
      if (fileName.endsWith(".mdoc")) {
        const slug = getSlugFromMdocFileName(fileName);
        const filePath = path.join(MDOC_POSTS_DIRECTORY, fileName);
        const meta = parseMdocMeta(filePath, slug);

        if (meta && meta.published !== false) {
          posts.push(meta);
        }
      }
    });
  }

  return posts
    .filter((post) => post.published !== false)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(
  slug: string,
  locale: string = DEFAULT_LOCALE
): Promise<Post | null> {
  ensurePostsDirectory();

  const fileInfo = findPostFile(slug, locale);

  if (!fileInfo) {
    return null;
  }

  const fileContents = fs.readFileSync(fileInfo.path, "utf8");
  const { data, content } = matter(fileContents);
  const readingTimeResult = readingTime(content);

  let contentHtml: string;

  if (fileInfo.type === "mdoc") {
    // Render Markdoc content
    contentHtml = await renderMdocContent(content);
  } else {
    // Render Markdown content with Remark
    const processedContent = await remark()
      .use(remarkRehype)
      .use(rehypePrettyCode, {
        theme: "github-dark",
        keepBackground: false,
      })
      .use(rehypeStringify)
      .process(content);
    contentHtml = processedContent.toString();
  }

  // Normalize metadata (handle both .md and .mdoc formats)
  const publishedAt = data.publishedAt || data.date || new Date().toISOString();

  return {
    meta: {
      slug: data.slug || slug,
      title: data.title || slug,
      date: publishedAt,
      summary: data.description || data.summary,
      tags: data.tags || [],
      published: data.published !== false,
      readingTimeMinutes: Math.ceil(readingTimeResult.minutes),
      readingTimeText: readingTimeResult.text,
      coverImage: data.coverImage,
      ogImage: data.ogImage,
      canonicalUrl: data.canonicalUrl,
      attachments: data.attachments,
    },
    contentHtml,
  };
}

export function formatDate(
  dateString: string,
  locale: string = DEFAULT_LOCALE
): string {
  return new Date(dateString).toLocaleDateString(
    locale === "es" ? "es-ES" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
}
