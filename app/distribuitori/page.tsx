import type { Metadata } from "next";
import Link from "next/link";
import { Filters } from "@/components/Filters";
import { Pagination } from "@/components/Pagination";
import { PageHeader } from "@/components/PageHeader";
import { SearchBox } from "@/components/SearchBox";
import { SupplierRow } from "@/components/SupplierRow";
import { getCategories, getCounties, listSuppliers } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

type SearchParams = Promise<{
  q?: string;
  categorie?: string;
  judet?: string;
  verificat?: string;
  pagina?: string;
}>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  const bits: string[] = [];
  if (sp.categorie) bits.push(sp.categorie.replace(/-/g, " "));
  if (sp.judet) bits.push(`în ${sp.judet.replace(/-/g, " ")}`);

  return {
    ...pageMetadata({
      title: bits.length
        ? `Distribuitori ${bits.join(" ")}`
        : "Distribuitori de echipamente pentru energie verde",
      description:
        "Caută distribuitori după categorie de echipament, județ servit și status de verificare. Cere ofertă direct de la firmă.",
      path: "/distribuitori",
    }),
    // Paginile filtrate nu se indexeaza separat; canonical trimite la lista completa.
    robots: bits.length || sp.pagina ? { index: false, follow: true } : undefined,
  };
}

function resultLabel(total: number) {
  if (total === 0) return "Niciun rezultat";
  return total === 1 ? "1 distribuitor" : `${total} distribuitori`;
}

export default async function SuppliersPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const page = Number(sp.pagina ?? "1") || 1;

  const [categories, counties, result] = await Promise.all([
    getCategories(),
    getCounties(),
    listSuppliers({
      q: sp.q,
      category: sp.categorie,
      county: sp.judet,
      verified: sp.verificat === "1",
      page,
    }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title="Distribuitori"
        lead="Firme care vând echipamente pentru energie verde către instalatori, dezvoltatori și departamente de achiziții."
        crumbs={[
          { name: "Acasă", path: "/" },
          { name: "Distribuitori", path: "/distribuitori" },
        ]}
      >
        <div className="mt-8 max-w-2xl">
          <SearchBox defaultValue={sp.q ?? ""} />
        </div>
      </PageHeader>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <Filters
          categories={categories}
          counties={counties}
          active={{
            q: sp.q,
            categorie: sp.categorie,
            judet: sp.judet,
            verificat: sp.verificat,
          }}
        />

        <p className="mt-7 mb-3 text-sm font-medium text-muted" aria-live="polite">
          {resultLabel(result.total)}
        </p>

        {result.items.length > 0 ? (
          <div className="grid gap-4">
            {result.items.map((s) => (
              <SupplierRow key={s.id} supplier={s} />
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center sm:p-12">
            <h2 className="text-xl font-bold tracking-tight text-ink">
              Niciun distribuitor pe filtrele astea
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              Încearcă fără filtrul de județ: distribuitorii care livrează național apar oricum, iar
              mulți furnizori acoperă mai multe categorii decât cele declarate.
            </p>
            <Link href="/distribuitori" className="btn btn-secondary mt-6">
              Vezi tot catalogul
            </Link>
          </div>
        )}

        <Pagination
          page={result.page}
          pageCount={result.pageCount}
          basePath="/distribuitori"
          params={{
            q: sp.q,
            categorie: sp.categorie,
            judet: sp.judet,
            verificat: sp.verificat,
          }}
        />
      </div>
    </>
  );
}
