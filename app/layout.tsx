import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

// Inlocuieste cu domeniul real inainte de lansare.
const PLAUSIBLE_DOMAIN = "supplyhub.ro";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — distribuitori de echipamente pentru energie verde`,
    template: `%s`,
  },
  description:
    "Catalogul distribuitorilor de panouri fotovoltaice, invertoare, baterii, pompe de căldură și stații de încărcare din România.",
  alternates: { canonical: "/" },
  openGraph: { siteName: SITE_NAME, locale: "ro_RO", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body className="flex min-h-dvh flex-col bg-canvas">
        <a
          href="#continut"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-tile focus:bg-accent focus:px-4 focus:py-2 focus:font-medium focus:text-white"
        >
          Sari la conținut
        </a>
        <SiteHeader />
        <main id="continut" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <Script
          defer
          data-domain={PLAUSIBLE_DOMAIN}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
