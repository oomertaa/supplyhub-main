import Link from "next/link";
import { SEED_CATEGORIES } from "@/lib/categories";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-rule">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-semibold tracking-tight">
            Supply<span className="text-accent">Hub</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted">
            Catalogul distribuitorilor de echipamente pentru energie verde din România.
          </p>
        </div>

        <nav aria-label="Categorii">
          <h2 className="text-sm font-semibold">Categorii</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {SEED_CATEGORIES.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link href={`/categorii/${c.slug}`} className="hover:text-accent hover:underline">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Site">
          <h2 className="text-sm font-semibold">Site</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/distribuitori" className="hover:text-accent hover:underline">Toți distribuitorii</Link></li>
            <li><Link href="/blog" className="hover:text-accent hover:underline">Analize</Link></li>
            <li><Link href="/despre" className="hover:text-accent hover:underline">Despre</Link></li>
            <li><Link href="/contact" className="hover:text-accent hover:underline">Contact</Link></li>
          </ul>
        </nav>

        <nav aria-label="Legal">
          <h2 className="text-sm font-semibold">Legal</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/termeni-si-conditii" className="hover:text-accent hover:underline">Termeni și condiții</Link></li>
            <li><Link href="/politica-de-confidentialitate" className="hover:text-accent hover:underline">Politica de confidențialitate</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-rule">
        <p className="mx-auto max-w-6xl px-5 py-6 text-sm text-muted">
          © {new Date().getFullYear()} SupplyHub
        </p>
      </div>
    </footer>
  );
}
