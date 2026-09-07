import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryIcon } from "@/components/CategoryIcon";
import { PageHeader } from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import { SupplierRow } from "@/components/SupplierRow";
import { getCategories, getCategory, listSuppliers } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";
import { SEED_CATEGORIES } from "@/lib/categories";

export const revalidate = 3600;
// Categoriile se pot adauga din Supabase dupa deploy, deci nu blocam parametrii.
export const dynamicParams = true;

export async function generateStaticParams() {
  const categories = await getCategories();
  const slugs = categories.length ? categories.map((c) => c.slug) : SEED_CATEGORIES.map((c) => c.slug);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return { title: "Categorie negăsită | SupplyHub" };

  return pageMetadata({
    title: `Distribuitori ${category.name.toLowerCase()} în România`,
    description:
      category.description ??
      `Lista distribuitorilor de ${category.name.toLowerCase()} din România, cu date de contact și acoperire teritorială.`,
    path: `/categorii/${category.slug}`,
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ pagina?: string }>;
}) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const page = Number(sp.pagina ?? "1") || 1;
  const [category, result, categories] = await Promise.all([
    getCategory(slug),
    listSuppliers({ category: slug, page }),
    getCategories(),
  ]);
  if (!category) notFound();

  const others = categories.filter((c) => c.slug !== category.slug);

  return (
    <>
      <PageHeader
        eyebrow="Categorie"
        icon={<CategoryIcon slug={category.slug} className="size-5.5" />}
        title={`Distribuitori ${category.name.toLowerCase()}`}
        lead={category.description ?? undefined}
        crumbs={[
          { name: "Acasă", path: "/" },
          { name: "Distribuitori", path: "/distribuitori" },
          { name: category.name, path: `/categorii/${category.slug}` },
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
              Categoria este în curs de completare
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              Între timp, poți căuta în lista completă de distribuitori: mulți furnizori acoperă mai
              multe categorii decât cele declarate.
            </p>
            <Link href="/distribuitori" className="btn btn-secondary mt-6">
              Vezi tot catalogul
            </Link>
          </div>
        )}

        <Pagination
          page={result.page}
          pageCount={result.pageCount}
          basePath={`/categorii/${category.slug}`}
          params={{}}
        />

        {others.length > 0 && (
          <section className="mt-12 border-t border-line pt-8">
            <h2 className="text-sm font-bold text-ink">Alte categorii de echipamente</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {others.map((c) => (
                <li key={c.slug}>
                  <Link href={`/categorii/${c.slug}`} className="chip">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
