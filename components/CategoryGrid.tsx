import Link from "next/link";
import { CategoryIcon } from "./CategoryIcon";
import { IconArrowRight } from "./Icons";
import type { CategoryRow } from "@/types/db";

function countLabel(n: number) {
  if (n === 0) return "În curs de completare";
  return n === 1 ? "1 distribuitor" : `${n} distribuitori`;
}

export function CategoryGrid({
  categories,
  counts = {},
}: {
  categories: CategoryRow[];
  counts?: Record<string, number>;
}) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((c) => {
        const n = counts[c.slug] ?? 0;
        return (
          <li key={c.slug}>
            <Link
              href={`/categorii/${c.slug}`}
              className="card card-hover group flex h-full flex-col p-5"
            >
              <span className="grid size-10 place-items-center rounded-tile bg-accent-soft text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                <CategoryIcon slug={c.slug} className="size-5.5" />
              </span>

              <h3 className="mt-4 font-bold tracking-tight text-ink transition-colors group-hover:text-accent">
                {c.name}
              </h3>

              <p className="mt-auto flex items-center justify-between gap-2 pt-4 text-sm text-muted">
                {countLabel(n)}
                <IconArrowRight className="size-4 text-line transition-all group-hover:translate-x-0.5 group-hover:text-accent" />
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
