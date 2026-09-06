import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Pagination } from "@/components/Pagination";
import { SupplierRow } from "@/components/SupplierRow";
import { COUNTIES, getCounty } from "@/lib/counties";
import { listSuppliers } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;
// Lista de judete este o constanta din cod, nu se schimba intre deploy-uri.
export const dynamicParams = false;

export function generateStaticParams() {
  return COUNTIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const county = getCounty(slug);
  if (!county) return { title: "Județ negăsit | SupplyHub" };

  return pageMetadata({
    title: `Distribuitori echipamente energie verde în ${county.name}`,
    description: `Distribuitori de panouri fotovoltaice, invertoare, baterii și pompe de căldură care livrează în județul ${county.name}.`,
    path: `/judete/${county.slug}`,
  });
}

export default async function CountyPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ pagina?: string }>;
}) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const county = getCounty(slug);
  if (!county) notFound();

  const page = Number(sp.pagina ?? "1") || 1;
  const result = await listSuppliers({ county: slug, page });

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <Breadcrumbs
        crumbs={[
          { name: "Acasă", path: "/" },
          { name: "Distribuitori", path: "/distribuitori" },
          { name: county.name, path: `/judete/${county.slug}` },
        ]}
      />

      <h1 className="max-w-3xl text-display font-semibold">
        Distribuitori în județul {county.name}
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-muted">
        Firme cu sediu sau acoperire declarată în {county.name}, plus distribuitorii care livrează
        în toată țara.
      </p>

      <p className="mt-10 border-t border-rule pt-6 text-sm text-muted">
        {result.total === 0
          ? "Niciun distribuitor listat momentan"
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
        <p className="mt-6 max-w-xl text-muted">
          Încă nu avem distribuitori listați pentru {county.name}. Lista completă acoperă furnizori
          care livrează național.
        </p>
      )}

      <Pagination
        page={result.page}
        pageCount={result.pageCount}
        basePath={`/judete/${county.slug}`}
        params={{}}
      />
    </div>
  );
}
