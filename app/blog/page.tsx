import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
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
    <div className="mx-auto max-w-6xl px-5 py-14">
      <Breadcrumbs
        crumbs={[
          { name: "Acasă", path: "/" },
          { name: "Analize", path: "/blog" },
        ]}
      />

      <h1 className="max-w-3xl text-display font-semibold">Analize</h1>
      <p className="mt-5 max-w-2xl text-lg text-muted">
        Ce contează când alegi un distribuitor: stoc real, termene, garanție și suport tehnic.
      </p>

      {posts.length === 0 ? (
        <p className="mt-14 border-t border-rule pt-10 text-muted">
          Primele articole apar în curând.
        </p>
      ) : (
        <div className="mt-12">
          {posts.map((p) => (
            <article key={p.slug} className="border-t border-rule py-8">
              <h2 className="max-w-3xl text-2xl font-semibold tracking-tight">
                <Link href={`/blog/${p.slug}`} className="hover:text-accent hover:underline">
                  {p.title}
                </Link>
              </h2>
              <p className="mt-3 max-w-2xl text-muted">{p.description}</p>
              <p className="mt-4 text-sm text-muted">
                {formatDate(p.date)}, {p.readingMinutes} min de citit, de {p.author}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
