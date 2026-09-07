import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { IconArrowRight, IconClock } from "@/components/Icons";
import { getAllPosts, formatDate } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Analize pentru piața de echipamente verzi",
  description:
    "Articole despre alegerea echipamentelor, termene de livrare, garanții și practica de achiziție din piața românească.",
  path: "/blog",
});

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <>
      <PageHeader
        eyebrow="Analize"
        title="Analize"
        lead="Ce contează când alegi un distribuitor: stoc real, termene, garanție și suport tehnic."
        crumbs={[
          { name: "Acasă", path: "/" },
          { name: "Analize", path: "/blog" },
        ]}
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        {posts.length === 0 ? (
          <div className="card p-8 text-center sm:p-12">
            <h2 className="text-xl font-bold tracking-tight text-ink">Primele articole apar în curând</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              Până atunci, catalogul de distribuitori este complet funcțional.
            </p>
            <Link href="/distribuitori" className="btn btn-secondary mt-6">
              Vezi distribuitorii
            </Link>
          </div>
        ) : (
          <ul className="grid gap-4 lg:grid-cols-2">
            {posts.map((p) => (
              <li key={p.slug}>
                <article className="card card-hover group flex h-full flex-col p-6 sm:p-7">
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
                    <IconClock className="size-4 text-accent/70" />
                    {formatDate(p.date)}
                    <span aria-hidden="true" className="text-line">
                      ·
                    </span>
                    {p.readingMinutes} min de citit
                    <span aria-hidden="true" className="text-line">
                      ·
                    </span>
                    {p.author}
                  </p>

                  <h2 className="mt-3 text-xl font-bold leading-snug tracking-tight text-ink">
                    <Link href={`/blog/${p.slug}`} className="transition-colors group-hover:text-accent">
                      {p.title}
                    </Link>
                  </h2>

                  <p className="mt-2.5 leading-relaxed text-muted">{p.description}</p>

                  <p className="mt-auto pt-5 text-sm font-semibold text-accent">
                    <span className="inline-flex items-center gap-1.5">
                      Citește analiza
                      <IconArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </p>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
