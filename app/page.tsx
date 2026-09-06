import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";
import { CategoryGrid } from "@/components/CategoryGrid";
import { SupplierRow } from "@/components/SupplierRow";
import { countSuppliersPerCategory, getCategories, getFeatured } from "@/lib/queries";
import { getAllPosts, formatDate } from "@/lib/blog";
import { COUNTIES } from "@/lib/counties";

export const revalidate = 3600;

export default async function HomePage() {
  const [categories, featured, counts] = await Promise.all([
    getCategories(),
    getFeatured(4),
    countSuppliersPerCategory(),
  ]);
  const posts = getAllPosts().slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-5">
      <section className="border-b border-rule py-20 sm:py-28">
        <h1 className="max-w-4xl text-display font-semibold">
          Distribuitorii de echipamente pentru energie verde, într-un singur catalog
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">
          Panouri fotovoltaice, invertoare, baterii, pompe de căldură și stații de încărcare.
          Caută după produs sau județ, compară furnizorii și cere ofertă direct de la ei.
        </p>
        <div className="mt-10 max-w-2xl">
          <SearchBox />
        </div>
        <p className="mt-4 text-sm text-muted">
          {categories.length} categorii de echipamente, acoperire în toate cele {COUNTIES.length} de
          județe.
        </p>
      </section>

      <section className="py-16" aria-labelledby="categorii">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="categorii" className="text-2xl font-semibold tracking-tight">
            Caută după tipul de echipament
          </h2>
          <Link href="/distribuitori" className="text-sm hover:text-accent hover:underline">
            Vezi toți distribuitorii
          </Link>
        </div>
        <CategoryGrid categories={categories} counts={counts} />
      </section>

      {featured.length > 0 && (
        <section className="border-t border-rule py-16" aria-labelledby="recomandati">
          <h2 id="recomandati" className="text-2xl font-semibold tracking-tight">
            Distribuitori recomandați
          </h2>
          <p className="mt-2 max-w-2xl text-muted">
            Firme cu date de contact verificate și stoc declarat pentru mai multe categorii.
          </p>
          <div className="mt-8">
            {featured.map((s) => (
              <SupplierRow key={s.id} supplier={s} />
            ))}
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="border-t border-rule py-16" aria-labelledby="analize">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
            <h2 id="analize" className="text-2xl font-semibold tracking-tight">
              Analize pentru instalatori și dezvoltatori
            </h2>
            <Link href="/blog" className="text-sm hover:text-accent hover:underline">
              Toate articolele
            </Link>
          </div>
          <ul className="grid gap-x-10 sm:grid-cols-3">
            {posts.map((p) => (
              <li key={p.slug} className="border-t border-rule py-5">
                <Link href={`/blog/${p.slug}`} className="group block">
                  <h3 className="font-semibold tracking-tight group-hover:text-accent">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted">{p.description}</p>
                  <p className="mt-3 text-sm text-muted">
                    {formatDate(p.date)}, {p.readingMinutes} min de citit
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
