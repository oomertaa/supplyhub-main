import Link from "next/link";

/** Marca vizuala: patrat cu simbol, plus numele scris. */
export function Logo({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2.5"
      aria-label="SupplyHub, pagina principală"
    >
      <span
        aria-hidden="true"
        className="grid size-8 shrink-0 place-items-center rounded-tile bg-accent text-white transition-colors group-hover:bg-accent-strong"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4.5">
          <path d="M13 3 5 13.5h5.5L10 21l8-10.5h-5.5L13 3Z" />
        </svg>
      </span>
      <span
        className={`text-[1.0625rem] font-bold tracking-tight ${tone === "dark" ? "text-white" : "text-ink"}`}
      >
        Supply<span className={tone === "dark" ? "text-accent-line" : "text-accent"}>Hub</span>
      </span>
    </Link>
  );
}
