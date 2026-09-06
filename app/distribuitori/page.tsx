import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Filters } from "@/components/Filters";
import { Pagination } from "@/components/Pagination";
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
    <div className="mx-auto max-w-6xl px-5 py-14">
      <Breadcrumbs
        crumbs={[
          { name: "Acasă", path: "/" },
          { name: "Distribuitori", path: "/distribuitori" },
        ]}
      />

      <h1 className="max-w-3xl text-display font-semibold">Distribuitori</h1>
      <p className="mt-5 max-w-2xl text-lg text-muted">
        Firme care vând echipamente pentru energie verde către instalatori, dezvoltatori și
        departamente de achiziții.
      </p>

      <div className="mt-10 max-w-2xl">
        <SearchBox defaultValue={sp.q ?? ""} />
      </div>

      <div className="mt-10">
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
      </div>

      <p className="mt-6 text-sm text-muted" aria-live="polite">
        {result.total === 0
          ? "Niciun rezultat"
          : result.total === 1
            ? "1 distribuitor"
            : `${result.total} distribuitori`}
      </p>

      {result.items.length > 0 ? (
        <div className="mt-2">
          {result.items.map((s) => (
            <SupplierRow key={s.id} supplier={s} />
          ))}
        </div>
      ) : (
        <div className="mt-8 border-y border-rule py-14">
          <h2 className="text-xl font-semibold tracking-tight">Niciun distribuitor pe filtrele astea</h2>
          <p className="mt-3 max-w-xl text-muted">
            Încearcă fără filtrul de județ: distribuitorii care livrează național apar oricum, iar
            mulți furnizori acoperă mai multe categorii decât cele declarate.
          </p>
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
  );
}
