"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Link de navigatie care isi marcheaza singur sectiunea curenta. */
export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`inline-flex items-center rounded-tile px-3 py-2 text-sm font-medium transition-colors ${
        active ? "bg-accent-soft text-accent" : "text-ink-soft hover:bg-sunken hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}
