import Link from "next/link";

const NAV = [
  { href: "/distribuitori", label: "Distribuitori" },
  { href: "/blog", label: "Analize" },
  { href: "/despre", label: "Despre" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Supply<span className="text-accent">Hub</span>
        </Link>
        <nav aria-label="Navigare principală">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-accent hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
