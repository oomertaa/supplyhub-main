import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SupplierRow } from "@/components/SupplierRow";
import { formatDate, getAllPosts, getPost } from "@/lib/blog";
import { getCategories, getSuppliersForCategories } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;
// Articolele sunt fisiere din repo: setul e complet la build.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Articol negăsit | SupplyHub" };

  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    image: post.cover,
    type: "article",
    publishedTime: post.date,
  });
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const [categories, related] = await Promise.all([
    getCategories(),
    getSuppliersForCategories(post.relatedCategories, 3),
  ]);
  const linked = categories.filter((c) => post.relatedCategories.includes(c.slug));

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <Breadcrumbs
        crumbs={[
          { name: "Acasă", path: "/" },
          { name: "Analize", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />

      <article>
        <header className="max-w-3xl">
          <h1 className="text-display font-semibold">{post.title}</h1>
          <p className="mt-5 text-lg text-muted">{post.description}</p>
          <p className="mt-5 text-sm text-muted">
            {formatDate(post.date)}, {post.readingMinutes} min de citit, de {post.author}
          </p>
        </header>

        {post.cover && (
          <div className="relative mt-10 aspect-[16/7] w-full overflow-hidden border border-rule">
            <Image
              src={post.cover}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="prose mt-12" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </article>

      {linked.length > 0 && (
        <section className="mt-14 max-w-3xl border-t border-rule pt-8">
          <h2 className="text-sm font-semibold">Categorii din articol</h2>
          <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-[0.95rem]">
            {linked.map((c) => (
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

      {related.length > 0 && (
        <section className="mt-12 max-w-3xl border border-rule p-6">
          <h2 className="text-xl font-semibold tracking-tight">Distribuitori relevanți</h2>
          <p className="mt-2 text-muted">
            Firme care vând echipamentele discutate în articol.
          </p>
          <div className="mt-4">
            {related.map((s) => (
              <SupplierRow key={s.id} supplier={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
