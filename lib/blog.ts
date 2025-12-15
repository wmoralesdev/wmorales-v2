import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkRehype from "remark-rehype";

const POSTS_DIRECTORY = path.join(process.cwd(), "content/blog");
const MD_FILE_REGEX = /\.md$/;
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
}

function getSlugFromFileName(fileName: string): string {
  // Handle both formats: "hello-world.md" and "hello-world.en.md"
  if (LOCALE_MD_FILE_REGEX.test(fileName)) {
    return fileName.replace(LOCALE_MD_FILE_REGEX, "");
  }
  return fileName.replace(MD_FILE_REGEX, "");
}

function findPostFile(slug: string, locale: string): string | null {
  // Try locale-specific file first: hello-world.en.md or hello-world.es.md
  const localeFile = path.join(POSTS_DIRECTORY, `${slug}.${locale}.md`);
  if (fs.existsSync(localeFile)) {
    return localeFile;
  }

  // Fallback to default locale
  const defaultFile = path.join(POSTS_DIRECTORY, `${slug}.${DEFAULT_LOCALE}.md`);
  if (fs.existsSync(defaultFile)) {
    return defaultFile;
  }

  // Fallback to old format without locale: hello-world.md
  const legacyFile = path.join(POSTS_DIRECTORY, `${slug}.md`);
  if (fs.existsSync(legacyFile)) {
    return legacyFile;
  }

  return null;
}

export function getAllPosts(locale: string = DEFAULT_LOCALE): PostMeta[] {
  ensurePostsDirectory();

  const fileNames = fs.readdirSync(POSTS_DIRECTORY);
  
  // Get unique slugs (handling both old format and new locale-specific format)
  const slugSet = new Set<string>();
  fileNames.forEach((fileName) => {
    if (fileName.endsWith(".md")) {
      slugSet.add(getSlugFromFileName(fileName));
    }
  });

  const posts = Array.from(slugSet)
    .map((slug) => {
      const filePath = findPostFile(slug, locale);
      if (!filePath) {
        return null;
      }

      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);

      const readingTimeResult = readingTime(content);

      return {
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
      } as PostMeta;
    })
    .filter((post): post is PostMeta => post !== null);

  return posts
    .filter((post) => post.published !== false)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string, locale: string = DEFAULT_LOCALE): Promise<Post | null> {
  ensurePostsDirectory();

  const filePath = findPostFile(slug, locale);

  if (!filePath) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const readingTimeResult = readingTime(content);

  const processedContent = await remark()
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: "github-dark",
      keepBackground: false,
    })
    .use(rehypeStringify)
    .process(content);
  const contentHtml = processedContent.toString();

  return {
    meta: {
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
    },
    contentHtml,
  };
}

export function formatDate(dateString: string, locale: string = DEFAULT_LOCALE): string {
  return new Date(dateString).toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
