import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { COUNTIES } from "@/lib/counties";
import { getCategories, getPublishedSlugs } from "@/lib/queries";
import { getAllPosts } from "@/lib/blog";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, supplierSlugs] = await Promise.all([getCategories(), getPublishedSlugs()]);
  const posts = getAllPosts();
  const now = new Date();

  const statics = [
    "/",
    "/distribuitori",
    "/blog",
    "/despre",
    "/contact",
    "/termeni-si-conditii",
    "/politica-de-confidentialitate",
  ].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "/" ? 1 : 0.7,
  }));

  return [
    ...statics,
    ...supplierSlugs.map((slug) => ({
      url: `${SITE_URL}/distribuitori/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...categories.map((c) => ({
      url: `${SITE_URL}/categorii/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...COUNTIES.map((c) => ({
      url: `${SITE_URL}/judete/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
