import Link from "next/link";
import { Logo } from "./Logo";
import { NavLink } from "./NavLink";

const NAV = [
  { href: "/distribuitori", label: "Distribuitori" },
  { href: "/blog", label: "Analize" },
  { href: "/despre", label: "Despre" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="z-40 border-b border-line bg-paper/90 shadow-bar backdrop-blur sm:sticky sm:top-0">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <div className="flex items-center gap-2">
          <nav aria-label="Navigare principală" className="-mx-1 hidden sm:block">
            <ul className="flex items-center gap-0.5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href}>{item.label}</NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <Link href="/contact" className="btn btn-primary btn-sm ml-1 hidden lg:inline-flex">
            Adaugă o firmă
          </Link>
        </div>
      </div>

      {/* Sub 640px navigatia trece pe un rand propriu, derulabil orizontal. */}
      <nav aria-label="Navigare principală" className="border-t border-line-soft sm:hidden">
        <ul className="mx-auto flex max-w-6xl gap-0.5 overflow-x-auto px-3 py-1.5">
          {NAV.map((item) => (
            <li key={item.href} className="shrink-0">
              <NavLink href={item.href}>{item.label}</NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
