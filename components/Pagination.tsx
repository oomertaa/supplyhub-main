import Link from "next/link";

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

  return (
    <nav aria-label="Paginare" className="mt-10 flex items-center justify-between gap-4 text-sm">
      {page > 1 ? (
        <Link href={href(page - 1)} rel="prev" className="hover:text-accent hover:underline">
          Pagina anterioară
        </Link>
      ) : (
        <span className="text-rule">Pagina anterioară</span>
      )}
      <span className="text-muted">
        Pagina {page} din {pageCount}
      </span>
      {page < pageCount ? (
        <Link href={href(page + 1)} rel="next" className="hover:text-accent hover:underline">
          Pagina următoare
        </Link>
      ) : (
        <span className="text-rule">Pagina următoare</span>
      )}
    </nav>
  );
}
