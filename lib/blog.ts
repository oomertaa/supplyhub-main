import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  cover: string | null;
  tags: string[];
  relatedCategories: string[];
  published: boolean;
  readingMinutes: number;
};

export type Post = PostMeta & { content: string };

function readingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function parse(fileName: string): Post | null {
  const raw = fs.readFileSync(path.join(BLOG_DIR, fileName), "utf8");
  const { data, content } = matter(raw);
  if (!data.title || !data.date) return null;

  return {
    slug: fileName.replace(/\.mdx?$/, ""),
    title: String(data.title),
    description: String(data.description ?? ""),
    date: new Date(data.date).toISOString().slice(0, 10),
    author: String(data.author ?? "Redacția SupplyHub"),
    cover: data.cover ? String(data.cover) : null,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    relatedCategories: Array.isArray(data.related_categories)
      ? data.related_categories.map(String)
      : [],
    published: data.published !== false,
    readingMinutes: readingMinutes(content),
    content,
  };
}

/** Toate articolele publicate, cele mai noi primele. Se citeste la build. */
export function getAllPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map(parse)
    .filter((p): p is Post => p !== null && p.published)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | null {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
