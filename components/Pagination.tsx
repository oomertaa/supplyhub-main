import Link from "next/link";
import { IconArrowLeft, IconArrowRight } from "./Icons";

export function Pagination({
  page,
  pageCount,
  basePath,
  params,
}: {
  page: number;
  pageCount: number;
  basePath: string;
  params: Record<string, string | undefined>;
}) {
  if (pageCount <= 1) return null;

  const href = (p: number) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) qs.set(k, v);
    if (p > 1) qs.set("pagina", String(p));
    const s = qs.toString();
    return s ? `${basePath}?${s}` : basePath;
  };

  const disabled = "btn btn-secondary btn-sm pointer-events-none opacity-45";

  return (
    <nav
      aria-label="Paginare"
      className="mt-8 flex items-center justify-between gap-4 rounded-card border border-line bg-paper px-4 py-3"
    >
      {page > 1 ? (
        <Link href={href(page - 1)} rel="prev" className="btn btn-secondary btn-sm">
          <IconArrowLeft className="size-4" />
          <span className="hidden sm:inline">Pagina anterioară</span>
          <span className="sm:hidden">Înapoi</span>
        </Link>
      ) : (
        <span className={disabled} aria-hidden="true">
          <IconArrowLeft className="size-4" />
          <span className="hidden sm:inline">Pagina anterioară</span>
          <span className="sm:hidden">Înapoi</span>
        </span>
      )}

      <span className="text-sm text-muted">
        Pagina <strong className="font-semibold text-ink">{page}</strong> din {pageCount}
      </span>

      {page < pageCount ? (
        <Link href={href(page + 1)} rel="next" className="btn btn-secondary btn-sm">
          <span className="hidden sm:inline">Pagina următoare</span>
          <span className="sm:hidden">Înainte</span>
          <IconArrowRight className="size-4" />
        </Link>
      ) : (
        <span className={disabled} aria-hidden="true">
          <span className="hidden sm:inline">Pagina următoare</span>
          <span className="sm:hidden">Înainte</span>
          <IconArrowRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
