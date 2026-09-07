import Link from "next/link";
import { IconClose } from "./Icons";
import type { CategoryRow, CountyRow } from "@/types/db";

type Active = { q?: string; categorie?: string; judet?: string; verificat?: string };

function buildHref(active: Active, drop: keyof Active) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(active)) {
    if (v && k !== drop) qs.set(k, v);
  }
  const s = qs.toString();
  return s ? `/distribuitori?${s}` : "/distribuitori";
}

/** Eticheta unui filtru activ, cu buton de eliminare. */
function ActiveChip({ label, href }: { label: string; href: string }) {
  return (
    <Link href={href} className="chip chip-accent gap-1.5 pr-1.5 hover:bg-accent hover:text-white">
      {label}
      <span className="grid size-4 place-items-center rounded-pill bg-accent/10">
        <IconClose className="size-3" />
      </span>
      <span className="sr-only">Elimină filtrul</span>
    </Link>
  );
}

export function Filters({
  categories,
  counties,
  active,
}: {
  categories: CategoryRow[];
  counties: CountyRow[];
  active: Active;
}) {
  const categoryName = categories.find((c) => c.slug === active.categorie)?.name;
  const countyName = counties.find((c) => c.slug === active.judet)?.name;
  const hasFilters = Boolean(active.q || active.categorie || active.judet || active.verificat);

  return (
    <section aria-label="Filtre" className="card overflow-hidden">
      <form
        action="/distribuitori"
        method="get"
        className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-[1fr_1fr_auto_auto] lg:items-end"
      >
        <input type="hidden" name="q" value={active.q ?? ""} />

        <div>
          <label htmlFor="categorie" className="field-label">
            Categorie de echipament
          </label>
          <select id="categorie" name="categorie" defaultValue={active.categorie ?? ""} className="field">
            <option value="">Toate categoriile</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="judet" className="field-label">
            Județ servit
          </label>
          <select id="judet" name="judet" defaultValue={active.judet ?? ""} className="field">
            <option value="">Toată țara</option>
            {counties.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <label
          htmlFor="verificat"
          className="flex cursor-pointer items-center gap-2.5 rounded-tile border border-line bg-canvas px-3.5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:border-accent-line"
        >
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

        <button type="submit" className="btn btn-primary">
          Aplică filtrele
        </button>
      </form>

      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2 border-t border-line-soft bg-canvas px-4 py-3 sm:px-5">
          <span className="text-xs font-semibold uppercase tracking-[0.09em] text-muted">
            Filtre active
          </span>
          {active.q && <ActiveChip label={`„${active.q}”`} href={buildHref(active, "q")} />}
          {active.categorie && (
            <ActiveChip
              label={categoryName ?? active.categorie.replace(/-/g, " ")}
              href={buildHref(active, "categorie")}
            />
          )}
          {active.judet && (
            <ActiveChip
              label={countyName ?? active.judet.replace(/-/g, " ")}
              href={buildHref(active, "judet")}
            />
          )}
          {active.verificat === "1" && (
            <ActiveChip label="Doar verificați" href={buildHref(active, "verificat")} />
          )}
          <Link
            href="/distribuitori"
            className="ml-auto text-sm font-medium text-muted underline-offset-4 hover:text-accent hover:underline"
          >
            Resetează tot
          </Link>
        </div>
      )}
    </section>
  );
}
