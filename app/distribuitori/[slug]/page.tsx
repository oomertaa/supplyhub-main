import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { LeadForm } from "@/components/LeadForm";
import { SupplierLogo } from "@/components/SupplierLogo";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import {
  IconArrowRight,
  IconBuilding,
  IconCalendar,
  IconExternal,
  IconGlobe,
  IconMail,
  IconPhone,
  IconPin,
  IconUser,
  IconUsers,
} from "@/components/Icons";
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

/** Un rand din fisa firmei: pictograma, eticheta, valoare. */
function DataRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 border-b border-line-soft px-5 py-3.5 last:border-b-0">
      <span className="mt-0.5 text-accent/70">{icon}</span>
      <div className="min-w-0">
        <dt className="text-xs font-semibold uppercase tracking-[0.07em] text-muted">{label}</dt>
        <dd className="mt-0.5 min-w-0 break-words text-[0.9375rem] text-ink">{children}</dd>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold tracking-tight text-ink">{children}</h2>;
}

export default async function SupplierPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supplier = await getSupplier(slug);
  if (!supplier) notFound();

  const maps = mapsUrl(supplier);
  const served = supplier.national ? COUNTIES : supplier.counties;
  const location = supplier.national
    ? "Livrează în toată țara"
    : [supplier.city, supplier.county?.name].filter(Boolean).join(", ");

  return (
    <>
      {/* Antetul firmei: identitate, acoperire si actiunile principale. */}
      <div className="border-b border-line bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <Breadcrumbs
            crumbs={[
              { name: "Acasă", path: "/" },
              { name: "Distribuitori", path: "/distribuitori" },
              { name: supplier.name, path: `/distribuitori/${supplier.slug}` },
            ]}
          />

          <div className="mt-7 flex flex-wrap items-start gap-5 sm:gap-6">
            <SupplierLogo name={supplier.name} src={supplier.logo_url} size={80} />

            <div className="min-w-0 flex-1">
              <h1 className="text-display font-bold text-ink">{supplier.name}</h1>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {supplier.verified && <VerifiedBadge />}
                {location && (
                  <span className="chip">
                    {supplier.national ? (
                      <IconGlobe className="size-3.5 text-accent/70" />
                    ) : (
                      <IconPin className="size-3.5 text-accent/70" />
                    )}
                    {location}
                  </span>
                )}
                {supplier.founded_year && (
                  <span className="chip">
                    <IconCalendar className="size-3.5 text-accent/70" />
                    Din {supplier.founded_year}
                  </span>
                )}
              </div>

              {supplier.short_description && (
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
                  {supplier.short_description}
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#cere-oferta" className="btn btn-primary">
                  Cere ofertă
                  <IconArrowRight className="size-4" />
                </a>
                {supplier.website && (
                  <a
                    href={supplier.website}
                    target="_blank"
                    rel="noopener nofollow"
                    className="btn btn-secondary"
                  >
                    Vizitează site-ul
                    <IconExternal className="size-4" />
                  </a>
                )}
                {supplier.phone && (
                  <a href={`tel:${supplier.phone.replace(/\s+/g, "")}`} className="btn btn-secondary">
                    <IconPhone className="size-4" />
                    {supplier.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_21rem] lg:gap-10">
          <div className="min-w-0 space-y-6">
            {supplier.long_description && (
              <section className="card p-6 sm:p-8">
                <SectionTitle>Despre firmă</SectionTitle>
                <div className="prose mt-4">
                  <Markdown text={supplier.long_description} />
                </div>
              </section>
            )}

            {supplier.categories.length > 0 && (
              <section className="card p-6 sm:p-8">
                <SectionTitle>Categorii de produse</SectionTitle>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {supplier.categories.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/categorii/${c.slug}`} className="chip">
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="card p-6 sm:p-8">
              <SectionTitle>Județe deservite</SectionTitle>
              {served.length === 0 ? (
                <p className="mt-3 text-muted">Acoperirea teritorială nu este declarată.</p>
              ) : (
                <>
                  <p className="mt-3 text-[0.9375rem] text-muted">
                    {supplier.national
                      ? `Distribuitorul livrează în toate cele ${COUNTIES.length} de județe.`
                      : `Acoperire declarată în ${served.length} ${served.length === 1 ? "județ" : "județe"}.`}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {served.map((c) => (
                      <li key={c.slug}>
                        <Link href={`/judete/${c.slug}`} className="chip">
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>

            <section id="cere-oferta" className="card scroll-mt-28 overflow-hidden">
              <div className="border-b border-accent-line bg-accent-soft px-6 py-6 sm:px-8">
                <h2 className="text-title font-bold text-ink">Cere ofertă</h2>
                <p className="mt-2.5 max-w-xl text-ink-soft">
                  Completează cererea și {supplier.name} primește datele tale de contact. Răspunsul
                  vine direct de la distribuitor, pe email.
                </p>
              </div>
              <div className="p-6 sm:p-8">
                <LeadForm
                  supplierId={supplier.id}
                  supplierName={supplier.name}
                  supplierEmail={supplier.email}
                  sourcePage={`/distribuitori/${supplier.slug}`}
                />
              </div>
            </section>
          </div>

          {/* Fisa firmei, lipita de marginea de sus pe ecrane late. */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card overflow-hidden">
              <h2 className="border-b border-line bg-canvas px-5 py-3 text-sm font-bold text-ink">
                Date firmă
              </h2>
              <dl>
                {supplier.website && (
                  <DataRow icon={<IconGlobe />} label="Site">
                    <a
                      href={supplier.website}
                      target="_blank"
                      rel="noopener nofollow"
                      className="font-medium text-accent underline underline-offset-2"
                    >
                      {supplier.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  </DataRow>
                )}
                {supplier.phone && (
                  <DataRow icon={<IconPhone />} label="Telefon">
                    <a
                      href={`tel:${supplier.phone.replace(/\s+/g, "")}`}
                      className="hover:text-accent"
                    >
                      {supplier.phone}
                    </a>
                  </DataRow>
                )}
                {supplier.email && (
                  <DataRow icon={<IconMail />} label="Email">
                    <a href={`mailto:${supplier.email}`} className="hover:text-accent">
                      {supplier.email}
                    </a>
                  </DataRow>
                )}
                {supplier.contact_person && (
                  <DataRow icon={<IconUser />} label="Persoană de contact">
                    {supplier.contact_person}
                  </DataRow>
                )}
                {(supplier.address || supplier.city) && (
                  <DataRow icon={<IconPin />} label="Adresă">
                    {[supplier.address, supplier.city, supplier.county?.name]
                      .filter(Boolean)
                      .join(", ")}
                    {maps && (
                      <>
                        <br />
                        <a
                          href={maps}
                          target="_blank"
                          rel="noopener nofollow"
                          className="font-medium text-accent underline underline-offset-2"
                        >
                          Vezi pe Google Maps
                        </a>
                      </>
                    )}
                  </DataRow>
                )}
                {supplier.founded_year && (
                  <DataRow icon={<IconCalendar />} label="Din anul">
                    {supplier.founded_year}
                  </DataRow>
                )}
                {supplier.employee_range && (
                  <DataRow icon={<IconUsers />} label="Angajați">
                    {supplier.employee_range}
                  </DataRow>
                )}
                <DataRow icon={<IconBuilding />} label="Categorii acoperite">
                  {supplier.categories.length || "—"}
                </DataRow>
              </dl>

              <div className="border-t border-line bg-canvas p-4">
                <a href="#cere-oferta" className="btn btn-primary w-full">
                  Cere ofertă
                </a>
                <p className="mt-2.5 text-center text-xs text-muted">
                  Fără comision. Răspunsul vine direct de la firmă.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <JsonLd data={organizationJsonLd(supplier)} />
    </>
  );
}
