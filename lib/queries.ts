import { getPublicClient, warnMissingConfig } from "./supabase.ts";
import { normalizeSearch } from "./slugify.ts";
import type { CategoryRow, CountyRow, Supplier, SupplierCard } from "@/types/db";

const CARD_COLUMNS =
  "id, slug, name, short_description, logo_url, city, national, verified, county:counties!county_id(id, code, name, slug, sort_order), links:supplier_categories(category:categories(slug, name))";

const FULL_COLUMNS =
  "*, county:counties!county_id(id, code, name, slug, sort_order), links:supplier_categories(category:categories(*)), served:supplier_counties(county:counties(id, code, name, slug, sort_order))";

export const PAGE_SIZE = 20;

/* eslint-disable @typescript-eslint/no-explicit-any */
function toCard(row: any): SupplierCard {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    short_description: row.short_description,
    logo_url: row.logo_url,
    city: row.city,
    national: row.national,
    verified: row.verified,
    county: row.county ?? null,
    categories: (row.links ?? []).map((l: any) => l.category).filter(Boolean),
  };
}

function toSupplier(row: any): Supplier {
  const { links, served, ...rest } = row;
  return {
    ...rest,
    county: row.county ?? null,
    categories: (links ?? []).map((l: any) => l.category).filter(Boolean),
    counties: (served ?? []).map((s: any) => s.county).filter(Boolean),
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getCounties(): Promise<CountyRow[]> {
  const db = getPublicClient();
  if (!db) return warnMissingConfig("getCounties"), [];
  const { data } = await db.from("counties").select("*").order("sort_order");
  return (data as CountyRow[]) ?? [];
}

export async function getCategories(): Promise<CategoryRow[]> {
  const db = getPublicClient();
  if (!db) return warnMissingConfig("getCategories"), [];
  const { data } = await db.from("categories").select("*").order("sort_order");
  return (data as CategoryRow[]) ?? [];
}

export async function getCategory(slug: string): Promise<CategoryRow | null> {
  const db = getPublicClient();
  if (!db) return warnMissingConfig("getCategory"), null;
  const { data } = await db.from("categories").select("*").eq("slug", slug).maybeSingle();
  return (data as CategoryRow) ?? null;
}

export async function getPublishedSlugs(): Promise<string[]> {
  const db = getPublicClient();
  if (!db) return warnMissingConfig("getPublishedSlugs"), [];
  const { data } = await db.from("suppliers").select("slug").eq("status", "published");
  return (data ?? []).map((r: { slug: string }) => r.slug);
}

export async function getSupplier(slug: string): Promise<Supplier | null> {
  const db = getPublicClient();
  if (!db) return warnMissingConfig("getSupplier"), null;
  const { data } = await db
    .from("suppliers")
    .select(FULL_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data ? toSupplier(data) : null;
}

export async function getFeatured(limit = 6): Promise<SupplierCard[]> {
  const db = getPublicClient();
  if (!db) return warnMissingConfig("getFeatured"), [];
  const { data } = await db
    .from("suppliers")
    .select(CARD_COLUMNS)
    .eq("status", "published")
    .eq("featured", true)
    .order("name")
    .limit(limit);
  return (data ?? []).map(toCard);
}

/** ID-urile distribuitorilor legati de o categorie — un singur query cu JOIN. */
async function supplierIdsForCategory(slug: string): Promise<number[] | null> {
  const db = getPublicClient();
  if (!db) return null;
  const { data } = await db
    .from("supplier_categories")
    .select("supplier_id, categories!inner(slug)")
    .eq("categories.slug", slug);
  return (data ?? []).map((r: { supplier_id: number }) => r.supplier_id);
}

/** ID-urile distribuitorilor care servesc explicit un judet — un singur query cu JOIN. */
async function supplierIdsForCounty(slug: string): Promise<number[] | null> {
  const db = getPublicClient();
  if (!db) return null;
  const { data } = await db
    .from("supplier_counties")
    .select("supplier_id, counties!inner(slug)")
    .eq("counties.slug", slug);
  return (data ?? []).map((r: { supplier_id: number }) => r.supplier_id);
}

export type SupplierFilters = {
  category?: string;
  county?: string;
  verified?: boolean;
  q?: string;
  page?: number;
  pageSize?: number;
};

export type SupplierListResult = {
  items: SupplierCard[];
  total: number;
  page: number;
  pageCount: number;
};

export async function listSuppliers(filters: SupplierFilters = {}): Promise<SupplierListResult> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = filters.pageSize ?? PAGE_SIZE;
  const empty: SupplierListResult = { items: [], total: 0, page, pageCount: 0 };

  const db = getPublicClient();
  if (!db) return warnMissingConfig("listSuppliers"), empty;

  let query = db
    .from("suppliers")
    .select(CARD_COLUMNS, { count: "exact" })
    .eq("status", "published");

  if (filters.verified) query = query.eq("verified", true);

  if (filters.category) {
    const ids = await supplierIdsForCategory(filters.category);
    if (!ids || ids.length === 0) return empty;
    query = query.in("id", ids);
  }

  if (filters.county) {
    const ids = await supplierIdsForCounty(filters.county);
    if (!ids) return empty;
    // Distribuitorii nationali servesc orice judet, fara randuri in supplier_counties.
    query = ids.length ? query.or(`national.eq.true,id.in.(${ids.join(",")})`) : query.eq("national", true);
  }

  if (filters.q) {
    const needle = normalizeSearch(filters.q);
    if (needle) query = query.ilike("search_text", `%${needle}%`);
  }

  const from = (page - 1) * pageSize;
  const { data, count, error } = await query
    .order("featured", { ascending: false })
    .order("verified", { ascending: false })
    .order("name")
    .range(from, from + pageSize - 1);

  if (error) {
    console.error("[supplyhub] listSuppliers:", error.message);
    return empty;
  }

  const total = count ?? 0;
  return {
    items: (data ?? []).map(toCard),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

/** Distribuitori pentru caseta „Distribuitori relevanți" din articole. */
export async function getSuppliersForCategories(
  slugs: string[],
  limit = 3,
): Promise<SupplierCard[]> {
  if (!slugs.length) return [];
  const db = getPublicClient();
  if (!db) return warnMissingConfig("getSuppliersForCategories"), [];

  const { data: cats } = await db.from("categories").select("id").in("slug", slugs);
  const catIds = (cats ?? []).map((c: { id: number }) => c.id);
  if (!catIds.length) return [];

  const { data: links } = await db
    .from("supplier_categories")
    .select("supplier_id")
    .in("category_id", catIds);
  const ids = [...new Set((links ?? []).map((l: { supplier_id: number }) => l.supplier_id))];
  if (!ids.length) return [];

  const { data } = await db
    .from("suppliers")
    .select(CARD_COLUMNS)
    .eq("status", "published")
    .in("id", ids)
    .order("featured", { ascending: false })
    .order("name")
    .limit(limit);
  return (data ?? []).map(toCard);
}

export async function countSuppliersPerCategory(): Promise<Record<string, number>> {
  const db = getPublicClient();
  if (!db) return warnMissingConfig("countSuppliersPerCategory"), {};
  const { data } = await db
    .from("supplier_categories")
    .select("category:categories(slug), supplier:suppliers!inner(status)")
    .eq("supplier.status", "published");
  const out: Record<string, number> = {};
  /* eslint-disable @typescript-eslint/no-explicit-any */
  for (const row of (data as any[]) ?? []) {
    const slug = row?.category?.slug;
    if (slug) out[slug] = (out[slug] ?? 0) + 1;
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
  return out;
}
