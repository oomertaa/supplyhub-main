import type { Metadata } from "next";
import type { Supplier } from "@/types/db";

export const SITE_NAME = "SupplyHub";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://supplyhub.ro").replace(
  /\/$/,
  "",
);

export function absolute(pathname: string): string {
  return `${SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string;
}): Metadata {
  const url = absolute(opts.path);
  const title = `${opts.title} | ${SITE_NAME}`;
  return {
    title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: opts.description,
      url,
      siteName: SITE_NAME,
      locale: "ro_RO",
      type: opts.type ?? "website",
      images: opts.image ? [{ url: opts.image }] : undefined,
      ...(opts.publishedTime ? { publishedTime: opts.publishedTime } : {}),
    },
    twitter: {
      card: opts.image ? "summary_large_image" : "summary",
      title,
      description: opts.description,
    },
  };
}

/** „Nume – distribuitor {categorie} în {județ}" */
export function supplierTitle(supplier: Supplier): string {
  const category = supplier.categories[0]?.name.toLowerCase();
  const where = supplier.national ? "România" : (supplier.county?.name ?? "România");
  return category
    ? `${supplier.name} – distribuitor ${category} în ${where}`
    : `${supplier.name} – distribuitor echipamente verzi în ${where}`;
}

export type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absolute(c.path),
    })),
  };
}

export function organizationJsonLd(supplier: Supplier) {
  const address = supplier.address || supplier.city || supplier.county?.name;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: supplier.name,
    url: supplier.website ?? absolute(`/distribuitori/${supplier.slug}`),
    ...(supplier.logo_url ? { logo: supplier.logo_url } : {}),
    ...(supplier.short_description ? { description: supplier.short_description } : {}),
    ...(supplier.founded_year ? { foundingDate: String(supplier.founded_year) } : {}),
    ...(supplier.email || supplier.phone
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "sales",
            ...(supplier.email ? { email: supplier.email } : {}),
            ...(supplier.phone ? { telephone: supplier.phone } : {}),
          },
        }
      : {}),
    ...(address
      ? {
          address: {
            "@type": "PostalAddress",
            addressCountry: "RO",
            ...(supplier.address ? { streetAddress: supplier.address } : {}),
            ...(supplier.city ? { addressLocality: supplier.city } : {}),
            ...(supplier.county?.name ? { addressRegion: supplier.county.name } : {}),
          },
        }
      : {}),
  };
}

export function mapsUrl(supplier: Supplier): string | null {
  const parts = [supplier.name, supplier.address, supplier.city, supplier.county?.name].filter(
    Boolean,
  );
  if (parts.length < 2) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parts.join(", "))}`;
}
