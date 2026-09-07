import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
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
    <>
      <PageHeader
        eyebrow="Scrie-ne"
        title="Contact"
        crumbs={[{ name: "Acasă", path: "/" }, { name: "Contact", path: "/contact" }]}
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="card max-w-3xl p-6 sm:p-10">
          <div className="prose">
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
      </div>
    </>
  );
}
