import { Breadcrumbs } from "./Breadcrumbs";
import type { Crumb } from "@/lib/seo";

/**
 * Antetul comun al paginilor interioare: banda de sus, cu firimituri,
 * eticheta sectiunii, titlu si un paragraf de context.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  crumbs,
  icon,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  crumbs: Crumb[];
  icon?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-b border-line bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <Breadcrumbs crumbs={crumbs} />
        {icon && (
          <span className="mt-6 grid size-11 place-items-center rounded-tile bg-accent-soft text-accent">
            {icon}
          </span>
        )}
        <p className={`eyebrow ${icon ? "mt-4" : "mt-6"}`}>{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-display font-bold text-ink">{title}</h1>
        {lead && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{lead}</p>}
        {children}
      </div>
    </div>
  );
}
