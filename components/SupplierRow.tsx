import Link from "next/link";
import { SupplierLogo } from "./SupplierLogo";
import { VerifiedBadge } from "./VerifiedBadge";
import { IconArrowRight, IconGlobe, IconPin } from "./Icons";
import type { SupplierCard } from "@/types/db";

/** Un distribuitor din liste: card propriu, cu contur si stare de hover. */
export function SupplierRow({ supplier }: { supplier: SupplierCard }) {
  const location = supplier.national
    ? "Livrează în toată țara"
    : [supplier.city, supplier.county?.name].filter(Boolean).join(", ") || "Locație neprecizată";
  const LocationIcon = supplier.national ? IconGlobe : IconPin;

  return (
    <article className="card card-hover group p-5 sm:p-6">
      <div className="flex gap-4 sm:gap-5">
        <SupplierLogo name={supplier.name} src={supplier.logo_url} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
            <h3 className="text-lg font-bold tracking-tight text-ink">
              <Link
                href={`/distribuitori/${supplier.slug}`}
                className="transition-colors group-hover:text-accent"
              >
                {supplier.name}
              </Link>
            </h3>
            {supplier.verified && <VerifiedBadge />}
          </div>

          <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-muted">
            <LocationIcon className="size-4 text-accent/70" />
            {location}
          </p>

          {supplier.short_description && (
            <p className="mt-2.5 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-soft">
              {supplier.short_description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-4">
        <ul className="flex min-w-0 flex-wrap gap-1.5">
          {supplier.categories.slice(0, 4).map((c) => (
            <li key={c.slug}>
              <Link href={`/categorii/${c.slug}`} className="chip">
                {c.name}
              </Link>
            </li>
          ))}
          {supplier.categories.length > 4 && (
            <li className="chip border-dashed">+{supplier.categories.length - 4}</li>
          )}
        </ul>

        <Link
          href={`/distribuitori/${supplier.slug}`}
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
        >
          Vezi profilul
          <IconArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
