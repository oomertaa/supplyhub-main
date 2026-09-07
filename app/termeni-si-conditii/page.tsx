import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Termeni și condiții",
  description: "Condițiile de utilizare a catalogului SupplyHub.",
  path: "/termeni-si-conditii",
});

export default function TermeniPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Termeni și condiții"
        crumbs={[ { name: "Acasă", path: "/" }, { name: "Termeni și condiții", path: "/termeni-si-conditii" }, ]}
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="card max-w-3xl p-6 sm:p-10">
          <div className="prose">
            <p>
              Prin utilizarea acestui site accepți condițiile de mai jos. Completează datele operatorului
              înainte de publicare: denumire, CUI, număr de înregistrare și sediu.
            </p>

            <h2>Obiectul site-ului</h2>
            <p>
              SupplyHub publică informații despre firme care distribuie echipamente pentru energie verde
              și facilitează transmiterea unei cereri de ofertă către acestea. Site-ul nu vinde
              echipamente, nu intermediază plăți și nu este parte în relația comercială dintre
              utilizator și distribuitor.
            </p>

            <h2>Informațiile publicate</h2>
            <p>
              Datele despre firme provin de la acestea sau din surse publice. Facem eforturi rezonabile
              să le menținem corecte, dar nu garantăm exactitatea, disponibilitatea stocurilor sau
              prețurile practicate. Deciziile comerciale luate pe baza informațiilor din catalog aparțin
              utilizatorului.
            </p>

            <h2>Cererile de ofertă</h2>
            <p>
              O cerere transmisă prin site ajunge la distribuitorul selectat și la administratorul
              site-ului. Nu garantăm primirea unui răspuns, termenul în care acesta ajunge sau conținutul
              ofertei.
            </p>

            <h2>Proprietate intelectuală</h2>
            <p>
              Denumirile și siglele firmelor listate aparțin titularilor lor și sunt folosite pentru
              identificare. Textele redacționale și structura catalogului aparțin operatorului site-ului.
            </p>

            <h2>Limitarea răspunderii</h2>
            <p>
              Nu răspundem pentru prejudicii rezultate din utilizarea informațiilor publicate, din
              indisponibilitatea temporară a site-ului sau din conduita comercială a firmelor listate.
            </p>

            <h2>Modificări</h2>
            <p>
              Acești termeni pot fi actualizați. Versiunea aplicabilă este cea publicată pe această
              pagină. Pentru prelucrarea datelor personale, vezi{" "}
              <Link href="/politica-de-confidentialitate">politica de confidențialitate</Link>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
