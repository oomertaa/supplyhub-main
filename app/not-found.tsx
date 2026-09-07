import Link from "next/link";
import { IconArrowRight, IconSearch } from "@/components/Icons";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="card mx-auto max-w-2xl p-8 text-center sm:p-12">
        <span className="mx-auto grid size-12 place-items-center rounded-pill bg-accent-soft text-accent">
          <IconSearch className="size-6" />
        </span>
        <p className="eyebrow mt-6 justify-center">Eroare 404</p>
        <h1 className="mt-3 text-display font-bold text-ink">Pagina nu există</h1>
        <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-muted">
          Adresa cerută nu corespunde niciunui distribuitor, categorie sau articol din catalog.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/distribuitori" className="btn btn-primary">
            Vezi toți distribuitorii
            <IconArrowRight className="size-4" />
          </Link>
          <Link href="/" className="btn btn-secondary">
            Înapoi la pagina principală
          </Link>
        </div>
      </div>
    </div>
  );
}
