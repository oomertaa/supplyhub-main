import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-28">
      <h1 className="text-display font-semibold">Pagina nu există</h1>
      <p className="mt-5 max-w-lg text-lg text-muted">
        Adresa cerută nu corespunde niciunui distribuitor, categorie sau articol din catalog.
      </p>
      <p className="mt-8">
        <Link href="/distribuitori" className="border-b-2 border-accent pb-1 font-medium hover:text-accent">
          Vezi toți distribuitorii
        </Link>
      </p>
    </div>
  );
}
