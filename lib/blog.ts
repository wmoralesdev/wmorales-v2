import fs from "node:fs";
import path from "node:path";
import * as Markdoc from "@markdoc/markdoc";
import { slug as createSlug } from "github-slugger";
import matter from "gray-matter";
import readingTime from "reading-time";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import { codeToHtml } from "shiki";

const POSTS_DIRECTORY = path.join(process.cwd(), "content/blog");
const MDOC_POSTS_DIRECTORY = path.join(process.cwd(), "content/posts");
const MD_FILE_REGEX = /\.md$/;
const MDOC_FILE_REGEX = /\.mdoc$/;
const LOCALE_MD_FILE_REGEX = /\.(en|es)\.md$/;
const LOCALE_MDOC_FILE_REGEX = /\.(en|es)\.mdoc$/;
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

function getSlugFromMdocFileName(fileName: string): string {
  // Handle both formats: "hello-world.mdoc" and "hello-world.en.mdoc"
  if (LOCALE_MDOC_FILE_REGEX.test(fileName)) {
    return fileName.replace(LOCALE_MDOC_FILE_REGEX, "");
  }
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
  locale: string,
): { path: string; type: "md" | "mdoc" } | null {
  const localeFile = path.join(POSTS_DIRECTORY, `${slug}.${locale}.md`);
  if (fs.existsSync(localeFile)) {
    return { path: localeFile, type: "md" };
  }

  const defaultFile = path.join(
    POSTS_DIRECTORY,
    `${slug}.${DEFAULT_LOCALE}.md`,
  );
  if (fs.existsSync(defaultFile)) {
    return { path: defaultFile, type: "md" };
  }

  const legacyFile = path.join(POSTS_DIRECTORY, `${slug}.md`);
  if (fs.existsSync(legacyFile)) {
    return { path: legacyFile, type: "md" };
  }

  const localeMdocFile = path.join(
    MDOC_POSTS_DIRECTORY,
    `${slug}.${locale}.mdoc`,
  );
  if (fs.existsSync(localeMdocFile)) {
    return { path: localeMdocFile, type: "mdoc" };
  }

  const defaultMdocFile = path.join(
    MDOC_POSTS_DIRECTORY,
    `${slug}.${DEFAULT_LOCALE}.mdoc`,
  );
  if (fs.existsSync(defaultMdocFile)) {
    return { path: defaultMdocFile, type: "mdoc" };
  }

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

    const rawDate = data.publishedAt || data.date || new Date();
    const publishedAt =
      rawDate instanceof Date ? rawDate.toISOString() : String(rawDate);
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
    };
  } catch {
    return null;
  }
}

function getCalloutIcon(type: string): Markdoc.Tag {
  const iconAttrs = {
    xmlns: "http://www.w3.org/2000/svg",
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    class: "shrink-0",
  };

  switch (type) {
    case "tip":
      return new Markdoc.Tag("svg", iconAttrs, [
        new Markdoc.Tag(
          "path",
          {
            d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
          },
          [],
        ),
        new Markdoc.Tag("path", { d: "M9 18h6" }, []),
        new Markdoc.Tag("path", { d: "M10 22h4" }, []),
      ]);
    case "warning":
      return new Markdoc.Tag("svg", iconAttrs, [
        new Markdoc.Tag(
          "path",
          {
            d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
          },
          [],
        ),
        new Markdoc.Tag("path", { d: "M12 9v4" }, []),
        new Markdoc.Tag("path", { d: "M12 17h.01" }, []),
      ]);
    case "error":
      return new Markdoc.Tag("svg", iconAttrs, [
        new Markdoc.Tag("circle", { cx: "12", cy: "12", r: "10" }, []),
        new Markdoc.Tag("path", { d: "m15 9-6 6" }, []),
        new Markdoc.Tag("path", { d: "m9 9 6 6" }, []),
      ]);
    case "success":
      return new Markdoc.Tag("svg", iconAttrs, [
        new Markdoc.Tag(
          "path",
          { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" },
          [],
        ),
        new Markdoc.Tag("path", { d: "m9 11 3 3L22 4" }, []),
      ]);
    case "info":
    default:
      return new Markdoc.Tag("svg", iconAttrs, [
        new Markdoc.Tag("circle", { cx: "12", cy: "12", r: "10" }, []),
        new Markdoc.Tag("path", { d: "M12 16v-4" }, []),
        new Markdoc.Tag("path", { d: "M12 8h.01" }, []),
      ]);
  }
}

function getCalloutStyles(type: string = "info") {
  const styles = {
    info: { borderColor: "border-l-accent", textColor: "text-accent" },
    tip: { borderColor: "border-l-green-500", textColor: "text-green-500" },
    warning: { borderColor: "border-l-amber-500", textColor: "text-amber-500" },
    error: { borderColor: "border-l-red-500", textColor: "text-red-500" },
    success: { borderColor: "border-l-green-500", textColor: "text-green-500" },
  };
  return styles[type as keyof typeof styles] || styles.info;
}

function getCardBorder(variant: string = "default") {
  const borders = {
    default: "border-border/60",
    feature: "border-accent/50",
    warning: "border-amber-500/20",
    success: "border-green-500/20",
  };
  return borders[variant as keyof typeof borders] || borders.default;
}

function getSeparatorSpacing(spacing: string = "normal") {
  const spacings = {
    small: "my-4",
    normal: "my-8",
    large: "my-12",
  };
  return spacings[spacing as keyof typeof spacings] || spacings.normal;
}

async function preprocessCodeBlocks(
  content: string,
): Promise<{ processedContent: string; codeBlocks: Map<string, string> }> {
  const codeBlocks = new Map<string, string>();
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const matches: Array<{
    placeholder: string;
    lang: string;
    code: string;
    fullMatch: string;
  }> = [];
  let match;
  let index = 0;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const lang = match[1] || "text";
    const code = match[2];
    // Use a token Markdoc won't treat as formatting (e.g. __bold__).
    const placeholder = `@@CODE_BLOCK_${index}@@`;
    matches.push({
      placeholder,
      lang,
      code,
      fullMatch: match[0],
    });
    index++;
  }

  const processedBlocks = await Promise.all(
    matches.map(async ({ placeholder, lang, code }) => {
      try {
        const highlighted = await codeToHtml(code, {
          lang,
          theme: "github-dark",
        });
        const codeMatch = highlighted.match(/<code[^>]*>([\s\S]*?)<\/code>/);
        const codeContent = codeMatch ? codeMatch[1] : highlighted;

        const codeBase64 = Buffer.from(code, "utf8").toString("base64");

        const codeBlockHtml = `<div class="group relative my-4">
  <pre class="overflow-x-auto rounded-lg border border-border/60 bg-muted p-4"><code class="font-mono text-xs">${codeContent}</code></pre>
  <button class="absolute right-2 top-2 rounded border border-border/60 bg-background text-foreground px-2 py-1 font-mono text-xs opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted" data-code="${codeBase64}" onclick="const code = atob(this.dataset.code); navigator.clipboard.writeText(code); this.textContent='Copied!'; setTimeout(() => this.textContent='Copy', 2000);">Copy</button>
</div>`;

        return { placeholder, html: codeBlockHtml };
      } catch (error) {
        console.error(`Error highlighting code block:`, error);
        const escapedCode = code
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;");
        const codeBase64 = Buffer.from(code, "utf8").toString("base64");
        const fallbackHtml = `<div class="group relative my-4">
  <pre class="overflow-x-auto rounded-lg border border-border/60 bg-muted p-4"><code class="font-mono text-xs">${escapedCode}</code></pre>
  <button class="absolute right-2 top-2 rounded border border-border/60 bg-background text-foreground px-2 py-1 font-mono text-xs opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted" data-code="${codeBase64}" onclick="const code = atob(this.dataset.code); navigator.clipboard.writeText(code); this.textContent='Copied!'; setTimeout(() => this.textContent='Copy', 2000);">Copy</button>
</div>`;
        return { placeholder, html: fallbackHtml };
      }
    }),
  );

  let processedContent = content;
  for (let i = matches.length - 1; i >= 0; i--) {
    const { placeholder, html } = processedBlocks[i];
    const { fullMatch } = matches[i];
    codeBlocks.set(placeholder, html);
    processedContent = processedContent.replace(fullMatch, placeholder);
  }

  return { processedContent, codeBlocks };
}

function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

function getPlainTextFromNodes(nodes: Markdoc.Node[]): string {
  return nodes
    .map((node) => {
      const nodeType = node.type;
      if (nodeType === "text") {
        const content = node.attributes.content;
        return typeof content === "string" ? content : "";
      }
      if (nodeType === "code") {
        const content = node.attributes.content;
        return typeof content === "string" ? content : "";
      }
      return getPlainTextFromNodes(node.children ?? []);
    })
    .join("");
}

async function renderMdocContent(content: string): Promise<string> {
  try {
    const { processedContent, codeBlocks } =
      await preprocessCodeBlocks(content);

    const ast = Markdoc.parse(processedContent);

    const config = {
      tags: {
        callout: {
          attributes: {
            type: { type: String, default: "info" },
            title: { type: String },
          },
          render: "Callout",
          transform(node: Markdoc.Node, config: Markdoc.Config) {
            const typeRaw = node.attributes.type;
            const titleRaw = node.attributes.title;
            const type = typeof typeRaw === "string" ? typeRaw : "info";
            const title = typeof titleRaw === "string" ? titleRaw : undefined;
            const styles = getCalloutStyles(type);

            const childrenRenderable = ensureArray(
              Markdoc.transform(node.children, config),
            );

            const icon = getCalloutIcon(type);

            return new Markdoc.Tag(
              "div",
              {
                class: `my-4 rounded-lg border border-border/60 ${styles.borderColor} bg-muted/30 p-4`,
              },
              [
                new Markdoc.Tag("div", { class: "flex gap-3" }, [
                  new Markdoc.Tag(
                    "span",
                    { class: `${styles.textColor} mt-0.5` },
                    [icon],
                  ),
                  new Markdoc.Tag("div", { class: "flex-1 space-y-1" }, [
                    ...(title
                      ? [
                          new Markdoc.Tag(
                            "p",
                            {
                              class:
                                "font-display text-sm font-medium text-foreground leading-tight",
                            },
                            [title],
                          ),
                        ]
                      : []),
                    new Markdoc.Tag(
                      "div",
                      { class: "text-sm text-muted-foreground [&>p]:m-0" },
                      childrenRenderable,
                    ),
                  ]),
                ]),
              ],
            );
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
            const titleRaw = node.attributes.title;
            const descriptionRaw = node.attributes.description;
            const variantRaw = node.attributes.variant;

            const title = typeof titleRaw === "string" ? titleRaw : undefined;
            const description =
              typeof descriptionRaw === "string" ? descriptionRaw : undefined;
            const variant =
              typeof variantRaw === "string" ? variantRaw : "default";

            const borderColor = getCardBorder(variant);
            const childrenRenderable = ensureArray(
              Markdoc.transform(node.children, config),
            );

            return new Markdoc.Tag(
              "div",
              {
                class: `my-4 rounded-lg border ${borderColor} bg-muted/20 p-4`,
              },
              [
                ...(title
                  ? [
                      new Markdoc.Tag(
                        "p",
                        {
                          class:
                            "font-display text-base font-medium text-foreground",
                        },
                        [title],
                      ),
                    ]
                  : []),
                ...(description
                  ? [
                      new Markdoc.Tag(
                        "p",
                        { class: "mt-1 text-xs text-muted-foreground" },
                        [description],
                      ),
                    ]
                  : []),
                new Markdoc.Tag(
                  "div",
                  { class: "mt-3 text-sm text-muted-foreground" },
                  childrenRenderable,
                ),
              ],
            );
          },
        },
        video: {
          selfClosing: true,
          attributes: {
            src: { type: String, required: true },
            title: { type: String },
            poster: { type: String },
          },
          render: "Video",
          transform(node: Markdoc.Node) {
            const srcRaw = node.attributes.src;
            const posterRaw = node.attributes.poster;
            const titleRaw = node.attributes.title;

            const src = typeof srcRaw === "string" ? srcRaw : "";
            const poster =
              typeof posterRaw === "string" ? posterRaw : undefined;
            const title = typeof titleRaw === "string" ? titleRaw : undefined;

            return new Markdoc.Tag(
              "video",
              {
                controls: true,
                class: "my-4 w-full rounded-lg border border-border/60",
                ...(poster ? { poster } : {}),
                ...(title ? { title } : {}),
              },
              [new Markdoc.Tag("source", { src, type: "video/mp4" }, [])],
            );
          },
        },
        separator: {
          selfClosing: true,
          attributes: {
            spacing: { type: String, default: "normal" },
          },
          render: "Separator",
          transform(node: Markdoc.Node) {
            const spacingRaw = node.attributes.spacing;
            const spacing =
              typeof spacingRaw === "string"
                ? getSeparatorSpacing(spacingRaw)
                : getSeparatorSpacing();

            return new Markdoc.Tag(
              "hr",
              { class: `${spacing} border-t border-border/60` },
              [],
            );
          },
        },
        "code-block": {
          attributes: {
            language: { type: String },
            filename: { type: String },
          },
          render: "CodeBlock",
        },
        "cursor-link": {
          attributes: {
            href: { type: String, required: true },
            target: { type: String, default: "_blank" },
          },
          render: "CursorLink",
          transform(node: Markdoc.Node, config: Markdoc.Config) {
            const hrefRaw = node.attributes.href;
            const targetRaw = node.attributes.target;

            const href = typeof hrefRaw === "string" ? hrefRaw : "";
            const target = typeof targetRaw === "string" ? targetRaw : "_blank";

            const childrenRenderable = ensureArray(
              Markdoc.transform(node.children, config),
            );

            return new Markdoc.Tag(
              "a",
              {
                href,
                target,
                rel: target === "_blank" ? "noopener noreferrer" : undefined,
                class:
                  "inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 font-mono text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 no-underline! decoration-transparent!",
              },
              [
                new Markdoc.Tag(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    class: "shrink-0",
                  },
                  [
                    new Markdoc.Tag(
                      "path",
                      {
                        d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
                      },
                      [],
                    ),
                    new Markdoc.Tag(
                      "polyline",
                      { points: "15 3 21 3 21 9" },
                      [],
                    ),
                    new Markdoc.Tag(
                      "line",
                      { x1: "10", y1: "14", x2: "21", y2: "3" },
                      [],
                    ),
                  ],
                ),
                new Markdoc.Tag("span", {}, childrenRenderable),
              ],
            );
          },
        },
        tweet: {
          selfClosing: true,
          attributes: {
            id: { type: String },
            url: { type: String },
          },
          render: "Tweet",
          transform(node: Markdoc.Node) {
            const idRaw = node.attributes.id;
            const urlRaw = node.attributes.url;

            let tweetUrl = "";
            if (typeof urlRaw === "string" && urlRaw) {
              // Normalize URL - remove query params but keep the full path
              try {
                const urlObj = new URL(urlRaw);
                const host = urlObj.hostname.toLowerCase();
                if (host === "x.com" || host.endsWith(".x.com")) {
                  urlObj.hostname = "twitter.com";
                }
                urlObj.search = "";
                urlObj.hash = "";
                tweetUrl = `${urlObj.origin}${urlObj.pathname}`;
              } catch {
                tweetUrl = urlRaw;
              }
            } else if (typeof idRaw === "string" && idRaw) {
              tweetUrl = `https://twitter.com/i/status/${idRaw}`;
            }

            return new Markdoc.Tag(
              "div",
              {
                class:
                  "not-prose my-6 flex justify-center [&_.twitter-tweet]:m-0! [&_.twitter-tweet]:mx-auto! [&_.twitter-tweet]:not-italic! [&_.twitter-tweet-rendered]:mx-auto!",
              },
              [
                new Markdoc.Tag(
                  "blockquote",
                  {
                    class: "twitter-tweet",
                    "data-theme": "dark",
                  },
                  [
                    new Markdoc.Tag(
                      "a",
                      {
                        href: tweetUrl,
                        target: "_blank",
                        rel: "noopener noreferrer",
                      },
                      [tweetUrl],
                    ),
                  ],
                ),
              ],
            );
          },
        },
      },
      nodes: {
        heading: {
          transform(node: Markdoc.Node, config: Markdoc.Config) {
            const levelRaw = node.attributes.level;
            const level =
              typeof levelRaw === "number" && levelRaw >= 1 && levelRaw <= 6
                ? levelRaw
                : 2;

            const plainText = getPlainTextFromNodes(node.children ?? []);
            const headingId = createSlug(plainText);

            const headingClasses = {
              1: "font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl mt-8",
              2: "font-display text-xl font-semibold tracking-tight text-foreground mt-8",
              3: "font-display text-lg font-semibold text-foreground mt-6",
              4: "font-display text-base font-medium text-foreground mt-4",
            };

            const classes =
              headingClasses[level as keyof typeof headingClasses] ||
              headingClasses[2];

            const childrenRenderable = ensureArray(
              Markdoc.transform(node.children, config),
            );

            return new Markdoc.Tag(
              `h${level}`,
              { id: headingId, class: `group ${classes}` },
              [
                ...childrenRenderable,
                new Markdoc.Tag(
                  "a",
                  {
                    href: `#${headingId}`,
                    class:
                      "ml-2 text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100",
                  },
                  ["#"],
                ),
              ],
            );
          },
        },
        fence: {
          transform(node: Markdoc.Node) {
            const code = node.attributes.content || "";
            const codeText = typeof code === "string" ? code : "";

            return new Markdoc.Tag("div", { class: "group relative my-4" }, [
              new Markdoc.Tag(
                "pre",
                {
                  class:
                    "overflow-x-auto rounded-lg border border-border/60 bg-muted p-4",
                },
                [
                  new Markdoc.Tag("code", { class: "font-mono text-xs" }, [
                    codeText,
                  ]),
                ],
              ),
              new Markdoc.Tag(
                "button",
                {
                  class:
                    "absolute right-2 top-2 rounded border border-border/60 bg-background text-foreground px-2 py-1 font-mono text-xs opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted",
                  onclick:
                    "navigator.clipboard.writeText(this.closest('.group').querySelector('code').textContent); this.textContent='Copied!'; setTimeout(() => this.textContent='Copy', 2000);",
                },
                ["Copy"],
              ),
            ]);
          },
        },
      },
    };

    const errors = Markdoc.validate(ast, config);
    if (errors.length > 0 && process.env.NODE_ENV === "development") {
      console.warn(
        "Markdoc validation warnings (non-blocking):",
        errors.length,
        "issues found",
      );
    }

    const renderable = Markdoc.transform(ast, config);
    let html = Markdoc.renderers.html(renderable);

    for (const [placeholder, codeHtml] of codeBlocks.entries()) {
      html = html.replace(placeholder, codeHtml);
    }

    return html;
  } catch (error) {
    console.error("Error rendering Markdoc:", error);
    return `<div class="prose-minimal">${content}</div>`;
  }
}

export function getAllPosts(locale: string = DEFAULT_LOCALE): PostMeta[] {
  const posts: PostMeta[] = [];

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

        const rawDate = data.date || new Date();
        const postDate =
          rawDate instanceof Date ? rawDate.toISOString() : String(rawDate);

        posts.push({
          slug: data.slug || slug,
          title: data.title || slug,
          date: postDate,
          summary: data.summary,
          tags: data.tags,
          published: data.published ?? true,
          readingTimeMinutes: Math.ceil(readingTimeResult.minutes),
          readingTimeText: readingTimeResult.text,
          coverImage: data.coverImage,
          ogImage: data.ogImage,
          canonicalUrl: data.canonicalUrl,
          attachments: data.attachments,
        });
      } catch {}
    });
  }

  if (fs.existsSync(MDOC_POSTS_DIRECTORY)) {
    const mdocFileNames = fs.readdirSync(MDOC_POSTS_DIRECTORY);
    const slugSet = new Set<string>();

    mdocFileNames.forEach((fileName) => {
      if (fileName.endsWith(".mdoc")) {
        slugSet.add(getSlugFromMdocFileName(fileName));
      }
    });

    Array.from(slugSet).forEach((slug) => {
      const fileInfo = findPostFile(slug, locale);
      if (!fileInfo || fileInfo.type !== "mdoc") {
        return;
      }

      try {
        const meta = parseMdocMeta(fileInfo.path, slug);
        if (meta && meta.published !== false) {
          posts.push(meta);
        }
      } catch {}
    });
  }

  return posts
    .filter((post) => post.published !== false)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(
  slug: string,
  locale: string = DEFAULT_LOCALE,
): Promise<Post | null> {
  const fileInfo = findPostFile(slug, locale);

  if (!fileInfo) {
    return null;
  }

  const fileContents = fs.readFileSync(fileInfo.path, "utf8");
  const { data, content } = matter(fileContents);
  const readingTimeResult = readingTime(content);

  let contentHtml: string;

  if (fileInfo.type === "mdoc") {
    contentHtml = await renderMdocContent(content);
  } else {
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

  const rawPublishedAt = data.publishedAt || data.date || new Date();
  const publishedAt =
    rawPublishedAt instanceof Date
      ? rawPublishedAt.toISOString()
      : String(rawPublishedAt);

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
  locale: string = DEFAULT_LOCALE,
): string {
  return new Date(dateString).toLocaleDateString(
    locale === "es" ? "es-ES" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );
}
