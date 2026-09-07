import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import { SupplierRow } from "@/components/SupplierRow";
import { IconPin } from "@/components/Icons";
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
    <>
      <PageHeader
        eyebrow="Județ"
        icon={<IconPin className="size-5.5" />}
        title={`Distribuitori în județul ${county.name}`}
        lead={`Firme cu sediu sau acoperire declarată în ${county.name}, plus distribuitorii care livrează în toată țara.`}
        crumbs={[
          { name: "Acasă", path: "/" },
          { name: "Distribuitori", path: "/distribuitori" },
          { name: county.name, path: `/judete/${county.slug}` },
        ]}
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <p className="mb-3 text-sm font-medium text-muted">
          {result.total === 0
            ? "Niciun distribuitor listat momentan"
            : result.total === 1
              ? "1 distribuitor"
              : `${result.total} distribuitori`}
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
              Încă nu avem distribuitori listați pentru {county.name}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              Lista completă acoperă și furnizori care livrează național, în toate județele.
            </p>
            <Link href="/distribuitori" className="btn btn-secondary mt-6">
              Vezi tot catalogul
            </Link>
          </div>
        )}

        <Pagination
          page={result.page}
          pageCount={result.pageCount}
          basePath={`/judete/${county.slug}`}
          params={{}}
        />

        <section className="mt-12 border-t border-line pt-8">
          <h2 className="text-sm font-bold text-ink">Caută în alt județ</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {COUNTIES.filter((c) => c.slug !== county.slug).map((c) => (
              <li key={c.slug}>
                <Link href={`/judete/${c.slug}`} className="chip">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
