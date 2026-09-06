import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
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
  const category = await getCategory(slug);
  if (!category) notFound();

  const page = Number(sp.pagina ?? "1") || 1;
  const result = await listSuppliers({ category: slug, page });

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <Breadcrumbs
        crumbs={[
          { name: "Acasă", path: "/" },
          { name: "Distribuitori", path: "/distribuitori" },
          { name: category.name, path: `/categorii/${category.slug}` },
        ]}
      />

      <h1 className="max-w-3xl text-display font-semibold">
        Distribuitori {category.name.toLowerCase()}
      </h1>
      {category.description && (
        <p className="mt-5 max-w-2xl text-lg text-muted">{category.description}</p>
      )}

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
          Categoria este în curs de completare. Între timp, poți căuta în lista completă de
          distribuitori.
        </p>
      )}

      <Pagination
        page={result.page}
        pageCount={result.pageCount}
        basePath={`/categorii/${category.slug}`}
        params={{}}
      />
    </div>
  );
}
