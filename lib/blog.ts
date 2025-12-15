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

export function getAllPosts(): PostMeta[] {
  ensurePostsDirectory();

  const fileNames = fs.readdirSync(POSTS_DIRECTORY);
  const posts = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(MD_FILE_REGEX, "");
      const filePath = path.join(POSTS_DIRECTORY, fileName);
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
    });

  return posts
    .filter((post) => post.published !== false)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  ensurePostsDirectory();

  const filePath = path.join(POSTS_DIRECTORY, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
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

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
