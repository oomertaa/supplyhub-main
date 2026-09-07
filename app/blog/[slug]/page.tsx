import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SupplierRow } from "@/components/SupplierRow";
import { IconArrowLeft, IconClock } from "@/components/Icons";
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
    <>
      <div className="border-b border-line bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <Breadcrumbs
            crumbs={[
              { name: "Acasă", path: "/" },
              { name: "Analize", path: "/blog" },
              { name: post.title, path: `/blog/${post.slug}` },
            ]}
          />

          <div className="mt-7 max-w-3xl">
            <p className="eyebrow">Analiză</p>
            <h1 className="mt-3 text-display font-bold text-ink">{post.title}</h1>
            <p className="mt-4 text-lg leading-relaxed text-muted">{post.description}</p>
            <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
              <IconClock className="size-4 text-accent/70" />
              {formatDate(post.date)}
              <span aria-hidden="true" className="text-line">
                ·
              </span>
              {post.readingMinutes} min de citit
              <span aria-hidden="true" className="text-line">
                ·
              </span>
              de {post.author}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <article className="card max-w-3xl p-6 sm:p-10">
          {post.cover && (
            <div className="relative mb-9 aspect-[16/7] w-full overflow-hidden rounded-tile border border-line">
              <Image
                src={post.cover}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="prose" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        </article>

        <div className="mt-6 max-w-3xl space-y-6">
          {linked.length > 0 && (
            <section className="card p-6">
              <h2 className="text-sm font-bold text-ink">Categorii din articol</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {linked.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/categorii/${c.slug}`} className="chip">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {related.length > 0 && (
            <section>
              <h2 className="text-title font-bold text-ink">Distribuitori relevanți</h2>
              <p className="mt-2 text-muted">Firme care vând echipamentele discutate în articol.</p>
              <div className="mt-5 grid gap-4">
                {related.map((s) => (
                  <SupplierRow key={s.id} supplier={s} />
                ))}
              </div>
            </section>
          )}

          <p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
            >
              <IconArrowLeft className="size-4" />
              Toate analizele
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
