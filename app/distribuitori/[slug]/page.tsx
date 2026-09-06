import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { LeadForm } from "@/components/LeadForm";
import { SupplierLogo } from "@/components/SupplierLogo";
import { Markdown } from "@/lib/markdown";
import { getPublishedSlugs, getSupplier } from "@/lib/queries";
import { mapsUrl, organizationJsonLd, pageMetadata, supplierTitle } from "@/lib/seo";
import { COUNTIES } from "@/lib/counties";

export const revalidate = 3600;
// true, nu false: `generateStaticParams` ruleaza doar la build, iar distribuitorii
// adaugati ulterior in Supabase trebuie sa fie accesibili fara redeploy.
// Slug-urile inexistente ajung oricum la notFound() mai jos.
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supplier = await getSupplier(slug);
  if (!supplier) return { title: "Distribuitor negăsit | SupplyHub" };

  return pageMetadata({
    title: supplierTitle(supplier),
    description:
      supplier.short_description ??
      `Date de contact, categorii de produse și acoperire teritorială pentru ${supplier.name}.`,
    path: `/distribuitori/${supplier.slug}`,
    image: supplier.logo_url,
  });
}

function DataRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[9rem_1fr] gap-4 border-b border-rule py-3 text-[0.95rem]">
      <dt className="text-muted">{label}</dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </div>
  );
}

export default async function SupplierPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supplier = await getSupplier(slug);
  if (!supplier) notFound();

  const maps = mapsUrl(supplier);
  const served = supplier.national ? COUNTIES : supplier.counties;

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <Breadcrumbs
        crumbs={[
          { name: "Acasă", path: "/" },
          { name: "Distribuitori", path: "/distribuitori" },
          { name: supplier.name, path: `/distribuitori/${supplier.slug}` },
        ]}
      />

      <header className="flex flex-wrap items-start gap-6 border-b border-rule pb-10">
        <SupplierLogo name={supplier.name} src={supplier.logo_url} size={88} />
        <div className="min-w-0 flex-1">
          <h1 className="text-display font-semibold">{supplier.name}</h1>
          {supplier.short_description && (
            <p className="mt-4 max-w-2xl text-lg text-muted">{supplier.short_description}</p>
          )}
          <p className="mt-4 text-sm text-muted">
            {supplier.national
              ? "Livrează în toată țara"
              : [supplier.city, supplier.county?.name].filter(Boolean).join(", ")}
            {supplier.verified && <span className="ml-3 text-accent">date de contact verificate</span>}
          </p>
        </div>
      </header>

      <div className="grid gap-14 py-12 lg:grid-cols-[1fr_22rem]">
        <div className="min-w-0">
          {supplier.long_description && (
            <section className="prose">
              <Markdown text={supplier.long_description} />
            </section>
          )}

          {supplier.categories.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-semibold tracking-tight">Categorii de produse</h2>
              <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-2 text-[0.95rem]">
                {supplier.categories.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/categorii/${c.slug}`}
                      className="border border-rule px-3 py-1.5 hover:border-accent hover:text-accent"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight">Județe deservite</h2>
            {served.length === 0 ? (
              <p className="mt-3 text-muted">Acoperirea teritorială nu este declarată.</p>
            ) : (
              <>
                {supplier.national && (
                  <p className="mt-3 text-muted">
                    Distribuitorul livrează în toate cele {COUNTIES.length} de județe.
                  </p>
                )}
                <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-2 text-[0.95rem]">
                  {served.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/judete/${c.slug}`} className="text-muted hover:text-accent hover:underline">
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          <section id="cere-oferta" className="mt-14 border-t border-rule pt-10">
            <h2 className="text-2xl font-semibold tracking-tight">Cere ofertă</h2>
            <p className="mt-3 max-w-xl text-muted">
              Completează cererea și {supplier.name} primește datele tale de contact. Răspunsul vine
              direct de la distribuitor, pe email.
            </p>
            <div className="mt-8 max-w-2xl">
              <LeadForm
                supplierId={supplier.id}
                supplierName={supplier.name}
                supplierEmail={supplier.email}
                sourcePage={`/distribuitori/${supplier.slug}`}
              />
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <h2 className="text-sm font-semibold">Date firmă</h2>
          <dl className="mt-3 border-t border-rule">
            {supplier.website && (
              <DataRow label="Site">
                <a
                  href={supplier.website}
                  target="_blank"
                  rel="noopener nofollow"
                  className="text-accent underline underline-offset-2"
                >
                  {supplier.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </a>
              </DataRow>
            )}
            {supplier.phone && (
              <DataRow label="Telefon">
                <a href={`tel:${supplier.phone.replace(/\s+/g, "")}`} className="hover:text-accent">
                  {supplier.phone}
                </a>
              </DataRow>
            )}
            {supplier.email && (
              <DataRow label="Email">
                <a href={`mailto:${supplier.email}`} className="hover:text-accent">
                  {supplier.email}
                </a>
              </DataRow>
            )}
            {supplier.contact_person && <DataRow label="Persoană de contact">{supplier.contact_person}</DataRow>}
            {(supplier.address || supplier.city) && (
              <DataRow label="Adresă">
                {[supplier.address, supplier.city, supplier.county?.name].filter(Boolean).join(", ")}
                {maps && (
                  <>
                    <br />
                    <a
                      href={maps}
                      target="_blank"
                      rel="noopener nofollow"
                      className="text-accent underline underline-offset-2"
                    >
                      Vezi pe Google Maps
                    </a>
                  </>
                )}
              </DataRow>
            )}
            {supplier.founded_year && <DataRow label="Din anul">{supplier.founded_year}</DataRow>}
            {supplier.employee_range && <DataRow label="Angajați">{supplier.employee_range}</DataRow>}
          </dl>

          <a
            href="#cere-oferta"
            className="mt-6 inline-block bg-accent px-6 py-3 font-medium text-white hover:bg-ink"
          >
            Cere ofertă
          </a>
        </aside>
      </div>

      <JsonLd data={organizationJsonLd(supplier)} />
    </div>
  );
}
