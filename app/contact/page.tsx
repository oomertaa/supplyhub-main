import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Scrie redacției SupplyHub pentru corecții, listări noi sau întrebări despre catalog.",
  path: "/contact",
});

const EMAIL = "contact@supplyhub.ro";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <Breadcrumbs crumbs={[{ name: "Acasă", path: "/" }, { name: "Contact", path: "/contact" }]} />
      <h1 className="max-w-3xl text-display font-semibold">Contact</h1>

      <div className="prose mt-10">
        <p>
          Scrie-ne la <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. Răspundem în zilele lucrătoare.
        </p>

        <h2>Vrei să apari în catalog</h2>
        <p>
          Trimite denumirea firmei, site-ul, categoriile de echipamente pe care le distribui,
          județele în care livrezi și o persoană de contact. Adăugăm firma după verificarea datelor.
        </p>

        <h2>O informație publicată este greșită</h2>
        <p>
          Indică pagina și datele corecte. Corecțiile de contact se fac în aceeași zi lucrătoare.
        </p>

        <h2>Cereri privind datele personale</h2>
        <p>
          Pentru acces, rectificare sau ștergerea datelor trimise printr-o cerere de ofertă,
          folosește aceeași adresă și menționează data cererii.
        </p>
      </div>
    </div>
  );
}
