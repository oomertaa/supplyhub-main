import Link from "next/link";
import type { CategoryRow } from "@/types/db";

export function CategoryGrid({
  categories,
  counts = {},
}: {
  categories: CategoryRow[];
  counts?: Record<string, number>;
}) {
  return (
    <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((c) => {
        const n = counts[c.slug] ?? 0;
        return (
          <li key={c.slug} className="border-t border-rule py-5">
            <Link href={`/categorii/${c.slug}`} className="group block">
              <h3 className="font-semibold tracking-tight group-hover:text-accent">{c.name}</h3>
              <p className="mt-1 text-sm text-muted">
                {n === 0
                  ? "În curs de completare"
                  : n === 1
                    ? "1 distribuitor"
                    : `${n} distribuitori`}
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
