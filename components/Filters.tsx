import Link from "next/link";
import type { CategoryRow, CountyRow } from "@/types/db";

export function Filters({
  categories,
  counties,
  active,
}: {
  categories: CategoryRow[];
  counties: CountyRow[];
  active: { q?: string; categorie?: string; judet?: string; verificat?: string };
}) {
  const hasFilters = Boolean(active.q || active.categorie || active.judet || active.verificat);

  return (
    <form
      action="/distribuitori"
      method="get"
      className="grid gap-4 border-y border-rule py-5 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto_auto] lg:items-end"
    >
      <input type="hidden" name="q" value={active.q ?? ""} />

      <div>
        <label htmlFor="categorie" className="block text-sm font-medium">
          Categorie
        </label>
        <select
          id="categorie"
          name="categorie"
          defaultValue={active.categorie ?? ""}
          className="mt-1.5 w-full border border-rule bg-white px-3 py-2.5 text-sm"
        >
          <option value="">Toate categoriile</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="judet" className="block text-sm font-medium">
          Județ servit
        </label>
        <select
          id="judet"
          name="judet"
          defaultValue={active.judet ?? ""}
          className="mt-1.5 w-full border border-rule bg-white px-3 py-2.5 text-sm"
        >
          <option value="">Toată țara</option>
          {counties.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <label htmlFor="verificat" className="flex items-center gap-2 text-sm sm:py-2.5">
        <input
          id="verificat"
          type="checkbox"
          name="verificat"
          value="1"
          defaultChecked={active.verificat === "1"}
          className="size-4 accent-accent"
        />
        Doar verificați
      </label>

      <div className="flex gap-4">
        <button type="submit" className="bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-accent">
          Aplică
        </button>
        {hasFilters && (
          <Link href="/distribuitori" className="self-center text-sm text-muted hover:text-accent hover:underline">
            Resetează
          </Link>
        )}
      </div>
    </form>
  );
}
