import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo";

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <>
      <nav aria-label="Navigare ierarhică" className="mb-8 text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {crumbs.map((c, i) => (
            <li key={c.path} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true" className="text-rule">/</span>}
              {i === crumbs.length - 1 ? (
                <span className="text-ink">{c.name}</span>
              ) : (
                <Link href={c.path} className="hover:text-accent hover:underline">
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
