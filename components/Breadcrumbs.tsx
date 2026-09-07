import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { IconChevronRight } from "./Icons";
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo";

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <>
      <nav aria-label="Navigare ierarhică" className="text-sm">
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-muted">
          {crumbs.map((c, i) => (
            <li key={c.path} className="flex items-center gap-1.5">
              {i > 0 && <IconChevronRight className="size-3.5 text-line" />}
              {i === crumbs.length - 1 ? (
                <span className="line-clamp-1 font-medium text-ink-soft">{c.name}</span>
              ) : (
                <Link href={c.path} className="transition-colors hover:text-accent hover:underline">
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
