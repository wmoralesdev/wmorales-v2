import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const POSTS_DIRECTORY = path.join(process.cwd(), "content/blog");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary?: string;
  tags?: string[];
  published?: boolean;
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

export async function getAllPosts(): Promise<PostMeta[]> {
  ensurePostsDirectory();

  const fileNames = fs.readdirSync(POSTS_DIRECTORY);
  const posts = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const filePath = path.join(POSTS_DIRECTORY, fileName);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug: data.slug || slug,
        title: data.title || slug,
        date: data.date || new Date().toISOString(),
        summary: data.summary,
        tags: data.tags,
        published: data.published ?? true,
      } as PostMeta;
    })
    .filter((post) => post.published !== false)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  ensurePostsDirectory();

  const filePath = path.join(POSTS_DIRECTORY, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    meta: {
      slug: data.slug || slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString(),
      summary: data.summary,
      tags: data.tags,
      published: data.published ?? true,
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

