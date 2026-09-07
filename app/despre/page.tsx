import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Despre SupplyHub",
  description:
    "SupplyHub este catalogul distribuitorilor de echipamente pentru energie verde din România, pentru instalatori, dezvoltatori și achiziții.",
  path: "/despre",
});

export default function DesprePage() {
  return (
    <>
      <PageHeader
        eyebrow="Proiectul"
        title="Despre SupplyHub"
        crumbs={[{ name: "Acasă", path: "/" }, { name: "Despre", path: "/despre" }]}
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="card max-w-3xl p-6 sm:p-10">
          <div className="prose">
            <p>
              SupplyHub este un catalog al firmelor care distribuie echipamente pentru energie verde în
              România: panouri fotovoltaice, invertoare, baterii de stocare, sisteme de montaj, pompe de
              căldură, stații de încărcare pentru vehicule electrice și accesoriile aferente.
            </p>
            <p>
              Publicul căruia i se adresează este format din instalatori, dezvoltatori de proiecte și
              persoane din achiziții, adică oameni care caută un furnizor, nu un produs de raft.
            </p>

            <h2>Cum se ajunge în catalog</h2>
            <p>
              Firmele sunt adăugate de redacție. Nu există înscriere automată și nu există plată pentru
              listare. Datele publicate provin de la firmă sau din surse publice și sunt verificate
              înainte de publicare.
            </p>
            <p>
              Marcajul „verificat" înseamnă că am confirmat datele de contact și obiectul de activitate
              direct cu firma. Nu este o recomandare comercială și nu spune nimic despre prețuri sau
              despre calitatea echipamentelor.
            </p>

            <h2>Cum funcționează cererile de ofertă</h2>
            <p>
              Când trimiți o cerere din pagina unui distribuitor, datele tale de contact ajung la acea
              firmă, care îți răspunde direct. SupplyHub nu intermediază tranzacția, nu percepe comision
              și nu este parte în contractul dintre tine și distribuitor.
            </p>

            <h2>Corecții</h2>
            <p>
              Dacă o informație publicată despre firma ta este greșită sau depășită, scrie-ne prin{" "}
              <Link href="/contact">pagina de contact</Link> și o corectăm.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
