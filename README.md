# SupplyHub

Catalog B2B, în limba română, al distribuitorilor de echipamente pentru energie verde:
panouri fotovoltaice, invertoare, baterii, sisteme de montaj, pompe de căldură, stații de
încărcare EV, cabluri și structuri.

Next.js 15 (App Router) + Supabase + Vercel. Articolele sunt fișiere MDX în repo.
Nu există panou de administrare, autentificare, conturi publice sau plăți: distribuitorii se
adaugă direct din dashboard-ul Supabase.

---

## 1. Rulare locală

Node 20.9 sau mai nou. Pentru `npm run seed:gen` este nevoie de Node 22.6+, pentru că
scriptul importă direct fișiere `.ts`. Scriptul nu face parte din `npm run build`, deci un Node
mai vechi nu blochează deploy-ul.

```bash
npm install
cp .env.example .env.local   # completează valorile
npm run dev                  # http://localhost:3000
```

Aplicația pornește și fără Supabase configurat: paginile se randează goale și în consolă apare
un avertisment. Util pentru lucrul la interfață, inutil pentru conținut.

### Baza de date

În Supabase → SQL Editor, rulează în ordine:

1. `schema.sql` — tabele, indexuri, triggere, politici RLS
2. `seed.sql` — 42 de județe, 8 categorii, 5 distribuitori de exemplu

`seed.sql` este **generat**. Nu îl edita manual: modifică `lib/counties.ts` sau
`lib/categories.ts` și rulează `npm run seed:gen` (necesită Node 22.6+, care poate importa
direct fișiere `.ts`). Astfel lista de județe din router și cea din bază nu pot să divergă.

Șterge distribuitorii de exemplu după ce introduci date reale:

```sql
delete from public.suppliers
 where slug in ('solaris-distributie','voltaria-energy','termocore-instal',
                'amper-mobility','structura-solar');
```

### Variabile de mediu

| Variabilă | Rol |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL-ul proiectului Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cheie publică, citește doar ce permit politicile RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Cheie server-side pentru scrierea lead-urilor. Nu o expune în client |
| `RESEND_API_KEY` | Cheie Resend pentru notificări |
| `ADMIN_EMAIL` | Adresa care primește o copie a fiecărei cereri |
| `FROM_EMAIL` | Expeditorul. **Domeniul trebuie verificat în Resend**, altfel trimiterea eșuează |
| `NEXT_PUBLIC_SITE_URL` | Domeniul public, folosit pentru canonical, OG și sitemap |

---

## 2. Adăugarea unui distribuitor din dashboard-ul Supabase

### Pasul 1 — rândul din `suppliers`

Table Editor → `suppliers` → Insert row.

Obligatorii: `slug` (unic, fără diacritice, ex. `solaris-distributie`), `name`, `status`.
Lasă `status = 'draft'` cât timp lucrezi la fișă; publicul vede doar `published`.

- `short_description` — o frază, apare în listări și în meta description
- `long_description` — markdown simplu: paragrafe, `## titluri`, liste cu `-`, `**bold**`,
  `[link](https://...)`. Nu se compilează JSX, deci un `<` rătăcit nu strică pagina
- `county_id` — județul sediului. Ia `id`-ul din tabela `counties`
- `national` — `true` dacă livrează în toată țara. Atunci `supplier_counties` este ignorat
  complet și distribuitorul apare pe toate cele 42 de pagini de județ
- `verified`, `featured` — marcajul „verificat" și apariția pe prima pagină
- `logo_url` — vezi mai jos

`search_text` se completează singur, prin trigger. Nu îl edita.

### Pasul 2 — categoriile (`supplier_categories`)

Ai nevoie de `id`-ul distribuitorului și de `id`-urile categoriilor. Cel mai rapid, din SQL
Editor:

```sql
insert into public.supplier_categories (supplier_id, category_id)
select s.id, c.id
  from public.suppliers s, public.categories c
 where s.slug = 'slug-ul-firmei'
   and c.slug in ('panouri-fotovoltaice', 'invertoare');
```

### Pasul 3 — județele deservite (`supplier_counties`)

Numai pentru distribuitorii cu `national = false`:

```sql
insert into public.supplier_counties (supplier_id, county_id)
select s.id, j.id
  from public.suppliers s, public.counties j
 where s.slug = 'slug-ul-firmei'
   and j.code in ('CJ', 'BH', 'SM');   -- coduri de pe plăcuțe
```

### Pasul 4 — logo-ul

Storage → creează o dată bucket-ul `logos`, marcat **public**. Încarcă fișierul, copiază URL-ul
public și pune-l în `suppliers.logo_url`. Fără logo, lista afișează inițialele firmei, în același
spațiu — deci nu apare deplasare de conținut.

Hostname-ul Supabase este adăugat automat în `images.remotePatterns` din
`NEXT_PUBLIC_SUPABASE_URL`. Dacă schimbi proiectul, redeployează.

### Pasul 5 — publicarea

Treci `status` pe `published`. Fișa apare în maximum o oră, fără redeploy: paginile au
`revalidate = 3600`, iar rutele de distribuitor și de categorie au `dynamicParams = true`,
deci un slug generat după build este randat la cerere, nu returnează 404.

Sitemap-ul se reface tot la o oră. Dacă vrei publicare instantanee, apelează
`revalidatePath('/distribuitori')` dintr-un webhook Supabase sau declanșează un redeploy.

---

## 3. Adăugarea unui articol

Creează `content/blog/slug-articol.mdx`:

```mdx
---
title: "Titlul articolului"
description: "O frază pentru listare și meta description."
date: "2026-05-12"
author: "Redacția SupplyHub"
cover: "/images/articol.jpg"        # opțional
tags: ["achiziții", "fotovoltaice"]
related_categories: ["panouri-fotovoltaice", "invertoare"]
published: true
---

Conținutul articolului.
```

`related_categories` folosește slug-uri din tabela `categories`. Ele devin linkuri interne și
alimentează caseta „Distribuitori relevanți" de la finalul articolului, cu maximum 3 firme.

Timpul de citit se calculează automat. `published: false` scoate articolul din listă, din sitemap
și din rutele generate.

Articolele se citesc de pe disc **la build**. Un articol nou cere un commit și un redeploy.

### Imagini de copertă și fișiere statice

`public/` este servit la rădăcina site-ului. Pune imaginile de copertă în `public/images/` și
referă-le cu cale absolută: `cover: "/images/articol.jpg"`. Fișierul din `public/images/nume.jpg`
devine `https://supplyhub.ro/images/nume.jpg`.

Tot în `public/` pun și `favicon.ico`, `apple-touch-icon.png` și o imagine Open Graph implicită,
dacă vrei una. Momentan nu există niciuna: paginile fără copertă generează carduri Open Graph
fără imagine, ceea ce e valid, dar arată sărac la distribuire.

---

## 4. Deploy pe Vercel

1. Importă repo-ul în Vercel. Framework preset: Next.js. Fără build command custom, fără adapter.
2. Settings → Environment Variables: adaugă toate variabilele din `.env.example`, pentru
   Production și Preview. `SUPABASE_SERVICE_ROLE_KEY` rămâne fără prefix `NEXT_PUBLIC_`.
3. Settings → Domains: adaugă `supplyhub.ro` și setează `NEXT_PUBLIC_SITE_URL` pe același domeniu.
4. Deploy.

După fiecare schimbare de variabile de mediu este nevoie de un redeploy: valorile sunt citite la
build pentru `metadataBase` și pentru `images.remotePatterns`.

În Plausible, domeniul este momentan hardcodat ca `supplyhub.ro`, în `app/layout.tsx`
(`PLAUSIBLE_DOMAIN`). Schimbă-l dacă lansezi pe alt domeniu.

---

## 5. Decizii care merită știute

**Lead-urile sunt protejate prin absența oricărei politici RLS, nu prin absența RLS.** O tabelă
fără RLS activat este complet accesibilă cu cheia anon. De aceea `schema.sql` conține explicit
`alter table public.leads enable row level security;`, plus `revoke`. Scrierea se face exclusiv
server-side, cu cheia service-role, care ocolește RLS.

**Căutarea ignoră diacriticele.** Coloana `suppliers.search_text` conține numele, orașul, adresa,
descrierea scurtă, județul și categoriile, normalizate prin `unaccent`, și e întreținută de
triggere. Interogările din aplicație normalizează la fel textul introdus de utilizator, deci
„Brasov", „Brașov", „valcea" și „Vâlcea" dau aceleași rezultate. Indexul este GIN + `pg_trgm`.

**`dynamicParams` diferă pe rute, intenționat.** `true` pentru `/distribuitori/[slug]` și
`/categorii/[slug]`, pentru că sursa lor este baza de date și se schimbă între deploy-uri.
`false` pentru `/judete/[slug]` (lista de județe e o constantă în cod) și pentru `/blog/[slug]`
(fișierele sunt în repo). Slug-urile inexistente ajung la `notFound()`, deci nu se randează
pagini goale.

**Formularul de ofertă returnează succes chiar dacă emailul eșuează.** Rândul din `leads` este
sursa de adevăr; eșecul Resend se loghează, nu se propagă la utilizator. Honeypot-ul
(`website_url`) face cererea să fie aruncată tăcut, cu răspuns de succes.

**Filtrul de județ nu explodează în 42 de rânduri.** Distribuitorii cu `national = true` nu au
deloc rânduri în `supplier_counties`; interogarea le adaugă separat.

---

## 6. Probleme frecvente

**Paginile se randează, dar listele sunt goale.** Variabilele Supabase lipsesc sau sunt greșite.
Verifică în consolă avertismentul `[supplyhub] Supabase nu este configurat`.

**Un distribuitor cu `status = 'published'` nu apare.** Cache-ul de o oră. Așteaptă sau
redeployează. Dacă tot nu apare, verifică în Supabase că politica `suppliers_public_read` există
și că RLS este activ.

**Logo-ul nu se încarcă, eroarea menționează `remotePatterns`.** Hostname-ul se derivă din
`NEXT_PUBLIC_SUPABASE_URL` la build. Dacă ai schimbat proiectul Supabase, redeployează.

**Emailurile nu ajung, dar lead-urile apar în bază.** Comportament intenționat. Verifică în Resend
că domeniul din `FROM_EMAIL` este validat și uită-te în logurile funcției pe Vercel.

**Formularul returnează eroare la trimitere.** Cel mai probabil lipsește
`SUPABASE_SERVICE_ROLE_KEY` din mediul de pe Vercel. Fără ea, inserarea în `leads` este blocată
de RLS, corect.

### Publicare instantanee, fără așteptarea unei ore

Adaugă o rută care invalidează cache-ul și cheam-o dintr-un Database Webhook din Supabase, pe
`INSERT` și `UPDATE` în `suppliers`:

```ts
// app/api/revalidate/route.ts
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  if (request.headers.get("x-revalidate-token") !== process.env.REVALIDATE_TOKEN) {
    return new Response("Nu", { status: 401 });
  }
  revalidatePath("/distribuitori");
  revalidatePath("/", "layout");
  return Response.json({ ok: true });
}
```

Adaugă `REVALIDATE_TOKEN` în variabilele de mediu și trimite-l ca header din webhook.

---

## 7. Structura

```
app/                     rute (toate în română)
  actions/lead.ts        server action pentru cererile de ofertă
  distribuitori/         listă + fișă distribuitor
  categorii/[slug]/      pagină de categorie
  judete/[slug]/         pagină de județ
  blog/                  listă + articol
  sitemap.ts, robots.ts
components/              UI, fără librării externe
content/blog/            articole MDX
public/images/           imagini de copertă și fișiere statice
lib/
  counties.ts            sursa unică pentru județe
  categories.ts          categoriile inițiale
  queries.ts             acces la date
  markdown.tsx           randare sigură a markdown-ului din bază
  seo.ts                 metadate, JSON-LD, breadcrumbs
scripts/generate-seed.mjs
schema.sql, seed.sql
```

---

## 8. Sistemul vizual

Nu există librărie de componente. Totul stă în `app/globals.css`: variabilele din blocul
`@theme` devin automat utilitare Tailwind (`bg-canvas`, `text-muted`, `border-line`,
`rounded-card`, `shadow-lift` etc.), iar în `@layer components` sunt definite clasele
refolosite în toată aplicația.

| Grup | Variabile | Rol |
| --- | --- | --- |
| Suprafețe | `--color-canvas`, `--color-paper`, `--color-sunken`, `--color-deep` | fundalul paginii, cardurile, benzile secundare, subsolul |
| Text | `--color-ink`, `--color-ink-soft`, `--color-muted` | titluri, corp de text, text secundar |
| Contururi | `--color-line`, `--color-line-soft` | conturul blocurilor, separatoarele din interiorul lor |
| Accent | `--color-accent`, `--color-accent-strong`, `--color-accent-soft`, `--color-accent-line` | verdele mărcii, starea de hover, fundalul și conturul aferente |
| Stări | `--color-danger`, `--color-danger-soft`, `--color-danger-line` | erorile din formulare |

Clase de componentă: `.card` și `.card-hover` (blocul de bază și starea lui de hover),
`.btn` cu `.btn-primary` / `.btn-secondary` / `.btn-sm`, `.field` și `.field-label` pentru
formulare, `.chip` și `.chip-accent` pentru etichete, `.eyebrow` pentru eticheta de deasupra
titlurilor de secțiune. `.prose` rămâne pentru corpul articolelor și al paginilor de text.

Regula de delimitare: conținutul stă pe carduri albe, pe un fundal `canvas`; antetul fiecărei
pagini este o bandă albă cu contur inferior. Nu adăuga separatoare de un pixel acolo unde un
card spune deja unde începe și unde se termină un bloc.

Pictogramele sunt SVG scrise de mână în `components/Icons.tsx` (interfață) și
`components/CategoryIcon.tsx` (câte una pentru fiecare categorie de echipament, cu simbol
generic pentru slug-urile adăugate ulterior în Supabase). Nu se instalează pachete de iconițe.

Pagina de vânzare de la `listare.supplyhub.ro` este un produs separat, pe alt host. Nu este
referită nicăieri în acest proiect și nu apare în sitemap.
