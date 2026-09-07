import Link from "next/link";
import { Logo } from "./Logo";
import { SEED_CATEGORIES } from "@/lib/categories";

const SITE_LINKS = [
  { href: "/distribuitori", label: "Toți distribuitorii" },
  { href: "/blog", label: "Analize" },
  { href: "/despre", label: "Despre" },
  { href: "/contact", label: "Contact" },
];

const LEGAL_LINKS = [
  { href: "/termeni-si-conditii", label: "Termeni și condiții" },
  { href: "/politica-de-confidentialitate", label: "Politica de confidențialitate" },
];

const linkClass = "text-white/70 transition-colors hover:text-white hover:underline underline-offset-4";
const headingClass = "text-xs font-semibold uppercase tracking-[0.11em] text-white/50";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-deep text-white/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo tone="dark" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            Catalogul distribuitorilor de echipamente pentru energie verde din România. Fără
            listare plătită, fără comision pe cererile de ofertă.
          </p>
        </div>

        <nav aria-label="Categorii">
          <h2 className={headingClass}>Categorii</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {SEED_CATEGORIES.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link href={`/categorii/${c.slug}`} className={linkClass}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Site">
          <h2 className={headingClass}>Site</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {SITE_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Legal">
          <h2 className={headingClass}>Legal</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-white/50 sm:px-6">
          <p>© {new Date().getFullYear()} SupplyHub</p>
          <p>Catalog independent, actualizat de redacție.</p>
        </div>
      </div>
    </footer>
  );
}
