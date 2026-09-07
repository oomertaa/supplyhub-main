import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";
import { CategoryGrid } from "@/components/CategoryGrid";
import { SupplierRow } from "@/components/SupplierRow";
import { IconArrowRight, IconClock } from "@/components/Icons";
import {
  countPublishedSuppliers,
  countSuppliersPerCategory,
  getCategories,
  getFeatured,
} from "@/lib/queries";
import { getAllPosts, formatDate } from "@/lib/blog";
import { COUNTIES } from "@/lib/counties";

export const revalidate = 3600;

const STEPS = [
  {
    title: "Caută echipamentul",
    body: "Filtrează după categorie, județ servit și status de verificare. Distribuitorii naționali apar la orice județ.",
  },
  {
    title: "Compară firmele",
    body: "Fiecare profil arată categoriile acoperite, aria de livrare, datele de contact și vechimea firmei.",
  },
  {
    title: "Cere ofertă direct",
    body: "Cererea ajunge la distribuitor, care îți răspunde pe email. SupplyHub nu intermediază și nu ia comision.",
  },
];

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-4 py-5 sm:px-6">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 text-2xl font-bold tracking-tight text-ink">{value}</dd>
    </div>
  );
}

function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  action,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lead?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id} className="mt-2.5 text-title font-bold text-ink">
          {title}
        </h2>
        {lead && <p className="mt-2.5 max-w-2xl text-muted">{lead}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
        >
          {action.label}
          <IconArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}

export default async function HomePage() {
  const [categories, featured, counts, supplierCount] = await Promise.all([
    getCategories(),
    getFeatured(4),
    countSuppliersPerCategory(),
    countPublishedSuppliers(),
  ]);
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      {/* Antet: propunerea catalogului si cautarea libera. */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="eyebrow">Catalog B2B · România</p>
          <h1 className="mt-4 max-w-4xl text-display font-bold text-ink">
            Distribuitorii de echipamente pentru energie verde, într-un singur catalog
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            Panouri fotovoltaice, invertoare, baterii, pompe de căldură și stații de încărcare.
            Caută după produs sau județ, compară furnizorii și cere ofertă direct de la ei.
          </p>

          <div className="mt-8 max-w-2xl">
            <SearchBox size="lg" />
          </div>

          {categories.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted">Căutate frecvent:</span>
              {categories.slice(0, 4).map((c) => (
                <Link key={c.slug} href={`/categorii/${c.slug}`} className="chip">
                  {c.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-line-soft bg-canvas">
          <dl className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-line-soft px-0 sm:grid-cols-4 sm:divide-y-0 sm:px-2">
            <Stat
              value={supplierCount > 0 ? String(supplierCount) : "—"}
              label="Distribuitori listați"
            />
            <Stat value={String(categories.length)} label="Categorii de echipamente" />
            <Stat value={String(COUNTIES.length)} label="Județe acoperite" />
            <Stat value="0 lei" label="Comision pe cerere" />
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <section className="py-14 sm:py-16" aria-labelledby="categorii">
          <SectionHeading
            id="categorii"
            eyebrow="Categorii"
            title="Caută după tipul de echipament"
            lead="Opt familii de produse, de la module fotovoltaice la stații de încărcare."
            action={{ href: "/distribuitori", label: "Vezi toți distribuitorii" }}
          />
          <CategoryGrid categories={categories} counts={counts} />
        </section>

        <section className="border-t border-line py-14 sm:py-16" aria-labelledby="cum-functioneaza">
          <SectionHeading
            id="cum-functioneaza"
            eyebrow="Cum funcționează"
            title="De la căutare la ofertă, în trei pași"
          />
          <ol className="grid gap-4 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="card p-6">
                <span className="grid size-8 place-items-center rounded-pill bg-accent-soft text-sm font-bold text-accent">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-bold tracking-tight text-ink">{s.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {featured.length > 0 && (
          <section className="border-t border-line py-14 sm:py-16" aria-labelledby="recomandati">
            <SectionHeading
              id="recomandati"
              eyebrow="Selecție"
              title="Distribuitori recomandați"
              lead="Firme cu date de contact verificate și stoc declarat pentru mai multe categorii."
              action={{ href: "/distribuitori?verificat=1", label: "Doar firme verificate" }}
            />
            <div className="grid gap-4 lg:grid-cols-2">
              {featured.map((s) => (
                <SupplierRow key={s.id} supplier={s} />
              ))}
            </div>
          </section>
        )}

        {posts.length > 0 && (
          <section className="border-t border-line py-14 sm:py-16" aria-labelledby="analize">
            <SectionHeading
              id="analize"
              eyebrow="Analize"
              title="Ce contează când alegi un furnizor"
              action={{ href: "/blog", label: "Toate articolele" }}
            />
            <ul className="grid gap-4 sm:grid-cols-3">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="card card-hover group flex h-full flex-col p-5">
                    <h3 className="font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-accent">
                      {p.title}
                    </h3>
                    <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">{p.description}</p>
                    <p className="mt-auto flex items-center gap-1.5 pt-4 text-sm text-muted">
                      <IconClock className="size-4 text-accent/70" />
                      {formatDate(p.date)} · {p.readingMinutes} min
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Invitatia pentru firmele care nu sunt inca in catalog. */}
        <section className="mb-16 rounded-card border border-accent-line bg-accent-soft p-7 sm:p-9">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="text-title font-bold text-ink">Distribui echipamente pentru energie verde?</h2>
              <p className="mt-2.5 text-ink-soft">
                Listarea în catalog este gratuită. Trimite datele firmei, iar redacția le verifică
                înainte de publicare.
              </p>
            </div>
            <Link href="/contact" className="btn btn-primary">
              Trimite datele firmei
              <IconArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
