import Link from "next/link";
import { SupplierLogo } from "./SupplierLogo";
import type { SupplierCard } from "@/types/db";

export function SupplierRow({ supplier }: { supplier: SupplierCard }) {
  const location = supplier.national
    ? "Livrează în toată țara"
    : [supplier.city, supplier.county?.name].filter(Boolean).join(", ") || "Locație neprecizată";

  return (
    <article className="grid grid-cols-[56px_1fr] gap-x-4 gap-y-3 border-b border-rule py-7 sm:grid-cols-[56px_1fr_auto] sm:gap-x-6">
      <SupplierLogo name={supplier.name} src={supplier.logo_url} />

      <div className="min-w-0">
        <h3 className="text-lg font-semibold tracking-tight">
          <Link href={`/distribuitori/${supplier.slug}`} className="hover:text-accent hover:underline">
            {supplier.name}
          </Link>
          {supplier.verified && (
            <span className="ml-2 align-middle text-xs font-medium text-accent" title="Date de contact verificate de echipa SupplyHub">
              verificat
            </span>
          )}
        </h3>

        {supplier.short_description && (
          <p className="mt-1.5 max-w-2xl text-[0.95rem] text-muted">{supplier.short_description}</p>
        )}

        {supplier.categories.length > 0 && (
          <p className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-sm">
            {supplier.categories.map((c, i) => (
              <span key={c.slug}>
                <Link href={`/categorii/${c.slug}`} className="text-muted hover:text-accent hover:underline">
                  {c.name}
                </Link>
                {i < supplier.categories.length - 1 && <span className="text-rule">,</span>}
              </span>
            ))}
          </p>
        )}
      </div>

      <p className="col-start-2 text-sm text-muted sm:col-start-3 sm:text-right">{location}</p>
    </article>
  );
}
