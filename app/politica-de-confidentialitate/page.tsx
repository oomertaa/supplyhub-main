import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Politica de confidențialitate",
  description:
    "Ce date personale prelucrează SupplyHub, în ce scop, cât timp le păstrează și ce drepturi ai.",
  path: "/politica-de-confidentialitate",
});

export default function ConfidentialitatePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <Breadcrumbs
        crumbs={[
          { name: "Acasă", path: "/" },
          { name: "Politica de confidențialitate", path: "/politica-de-confidentialitate" },
        ]}
      />
      <h1 className="max-w-3xl text-display font-semibold">Politica de confidențialitate</h1>

      <div className="prose mt-10">
        <p>
          Completează datele operatorului înainte de publicare: denumire, CUI, sediu și adresa de
          contact pentru protecția datelor.
        </p>

        <h2>Ce date colectăm</h2>
        <p>
          Când trimiți o cerere de ofertă, colectăm numele, adresa de email, opțional telefonul și
          denumirea firmei, mesajul scris de tine și pagina de pe care ai trimis cererea. Nu colectăm
          date prin conturi de utilizator, pentru că site-ul nu are conturi.
        </p>

        <h2>În ce scop și pe ce temei</h2>
        <p>
          Datele sunt folosite pentru a transmite cererea ta distribuitorului ales și pentru
          gestionarea internă a cererilor. Temeiul este consimțământul tău, exprimat prin bifarea
          casetei din formular, împreună cu interesul legitim de a documenta cererile primite.
        </p>

        <h2>Cui le transmitem</h2>
        <p>
          Cererea ajunge la distribuitorul selectat, care devine operator independent pentru datele
          primite, și la administratorul site-ului. Folosim furnizori care procesează date în numele
          nostru: găzduirea aplicației, baza de date și serviciul de trimitere a emailurilor.
        </p>

        <h2>Cât timp le păstrăm</h2>
        <p>
          Păstrăm cererile de ofertă 24 de luni de la primire, apoi le ștergem, cu excepția
          situațiilor în care o obligație legală impune o durată mai lungă.
        </p>

        <h2>Statistici de trafic</h2>
        <p>
          Măsurăm traficul cu Plausible Analytics, care nu folosește cookie-uri și nu colectează date
          care să te identifice personal. Din acest motiv site-ul nu afișează o casetă de consimțământ
          pentru cookie-uri.
        </p>

        <h2>Drepturile tale</h2>
        <p>
          Ai dreptul de acces, rectificare, ștergere, restricționare, opoziție și portabilitate,
          precum și dreptul de a-ți retrage consimțământul oricând. Cererile se trimit la adresa de
          contact a operatorului. Poți depune plângere la Autoritatea Națională de Supraveghere a
          Prelucrării Datelor cu Caracter Personal.
        </p>
      </div>
    </div>
  );
}
