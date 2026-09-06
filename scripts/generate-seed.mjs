// Genereaza seed.sql din lib/counties.ts si lib/categories.ts.
// Ruleaza: npm run seed:gen  (necesita Node 22.6+ pentru import direct de .ts)
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { COUNTIES } from "../lib/counties.ts";
import { SEED_CATEGORIES } from "../lib/categories.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const q = (v) => (v === null || v === undefined ? "null" : `'${String(v).replace(/'/g, "''")}'`);

// 5 distribuitori de exemplu. Sterge-i dupa ce introduci date reale.
const SUPPLIERS = [
  {
    slug: "solaris-distributie",
    name: "Solaris Distribuție",
    short_description:
      "Distribuitor de module fotovoltaice și invertoare, cu stoc în depozitul din Cluj și livrare în toată țara.",
    long_description:
      "Solaris Distribuție lucrează exclusiv cu instalatori și dezvoltatori. Portofoliul acoperă module monocristaline de 550–700 Wp, invertoare on-grid și hibride, plus structura de montaj aferentă.\n\nComenzile confirmate până la ora 14:00 pleacă din depozit în aceeași zi. Pentru proiecte peste 100 kWp există ofertare dedicată și grafic de livrare pe tranșe.",
    website: "https://exemplu-solaris.ro",
    phone: "+40 264 000 000",
    email: "vanzari@exemplu-solaris.ro",
    contact_person: "Andrei Pop",
    address: "Str. Fabricii 12",
    city: "Cluj-Napoca",
    county: "CJ",
    national: true,
    founded_year: 2014,
    employee_range: "11-50",
    verified: true,
    featured: true,
    categories: ["panouri-fotovoltaice", "invertoare", "sisteme-de-montaj"],
    counties: [],
  },
  {
    slug: "voltaria-energy",
    name: "Voltaria Energy",
    short_description:
      "Invertoare hibride și sisteme de stocare pentru rezidențial și comercial mic, cu suport tehnic în limba română.",
    long_description:
      "Voltaria Energy importă direct invertoare hibride și baterii de înaltă tensiune. Echipa tehnică asigură punerea în funcțiune la distanță și înlocuirea în garanție din stocul propriu.\n\nPentru instalatorii parteneri există training de configurare și acces la un canal de suport dedicat.",
    website: "https://exemplu-voltaria.ro",
    phone: "+40 21 000 0000",
    email: "office@exemplu-voltaria.ro",
    contact_person: "Ioana Dumitrescu",
    address: "Bd. Timișoara 84",
    city: "București",
    county: "B",
    national: false,
    founded_year: 2019,
    employee_range: "1-10",
    verified: true,
    featured: true,
    categories: ["invertoare", "baterii-de-stocare"],
    counties: ["B", "IF", "PH", "CT", "BZ"],
  },
  {
    slug: "termocore-instal",
    name: "Termocore Instal",
    short_description:
      "Pompe de căldură aer-apă și module hidraulice, cu depozit în Brașov și service autorizat.",
    long_description:
      "Termocore Instal distribuie pompe de căldură pentru locuințe individuale și clădiri de birouri, împreună cu boilerele și vasele tampon asociate.\n\nService-ul propriu acoperă centrul și sudul țării, cu intervenție în maximum 48 de ore pentru echipamentele aflate în garanție.",
    website: "https://exemplu-termocore.ro",
    phone: "+40 268 000 000",
    email: "comenzi@exemplu-termocore.ro",
    contact_person: "Mihai Rusu",
    address: "Str. Zizinului 145",
    city: "Brașov",
    county: "BV",
    national: false,
    founded_year: 2011,
    employee_range: "51-200",
    verified: true,
    featured: false,
    categories: ["pompe-de-caldura"],
    counties: ["BV", "CV", "HR", "SB", "MS", "AG", "DB"],
  },
  {
    slug: "amper-mobility",
    name: "Amper Mobility",
    short_description:
      "Stații de încărcare AC și DC pentru flote, parcări publice și clădiri de birouri.",
    long_description:
      "Amper Mobility furnizează stații de încărcare de la 7 kW la 180 kW, împreună cu platforma de management al încărcării și integrarea în sistemele de facturare.\n\nEchipa oferă dimensionare gratuită a puterii disponibile în branșament înainte de comandă.",
    website: "https://exemplu-amper.ro",
    phone: "+40 256 000 000",
    email: "contact@exemplu-amper.ro",
    contact_person: "Raluca Ilie",
    address: "Calea Aradului 22",
    city: "Timișoara",
    county: "TM",
    national: true,
    founded_year: 2021,
    employee_range: "11-50",
    verified: false,
    featured: false,
    categories: ["statii-de-incarcare-ev", "cabluri-si-accesorii"],
    counties: [],
  },
  {
    slug: "structura-solar",
    name: "Structura Solar",
    short_description:
      "Structuri de montaj pe sol și tracker-e pe o axă pentru parcuri fotovoltaice, cu producție proprie.",
    long_description:
      "Structura Solar produce structuri fixe și sisteme de urmărire pe o axă, cu calcul static și proiect de fundare incluse pentru proiectele peste 1 MWp.\n\nLivrarea se face direct în șantier, pe tranșe corelate cu graficul de montaj.",
    website: "https://exemplu-structura.ro",
    phone: "+40 232 000 000",
    email: "proiecte@exemplu-structura.ro",
    contact_person: "Cristian Moraru",
    address: "Șos. Păcurari 180",
    city: "Iași",
    county: "IS",
    national: false,
    founded_year: 2016,
    employee_range: "51-200",
    verified: true,
    featured: false,
    categories: ["structuri-si-tracker-e", "sisteme-de-montaj"],
    counties: ["IS", "NT", "BC", "VS", "SV", "BT", "GL"],
  },
];

const lines = [];
lines.push("-- SupplyHub — date initiale.");
lines.push("-- FISIER GENERAT. Nu edita manual: modifica lib/counties.ts sau");
lines.push("-- lib/categories.ts, apoi ruleaza `npm run seed:gen`.");
lines.push("-- Se ruleaza dupa schema.sql.");
lines.push("");
lines.push("begin;");
lines.push("");

lines.push(`-- ${COUNTIES.length} judete (41 + Bucuresti)`);
lines.push("insert into public.counties (code, name, slug, sort_order) values");
lines.push(
  COUNTIES.map((c) => `  (${q(c.code)}, ${q(c.name)}, ${q(c.slug)}, ${c.sortOrder})`).join(",\n") +
    "\non conflict (code) do update set name = excluded.name, slug = excluded.slug, sort_order = excluded.sort_order;",
);
lines.push("");

lines.push(`-- ${SEED_CATEGORIES.length} categorii`);
lines.push("insert into public.categories (slug, name, description, sort_order) values");
lines.push(
  SEED_CATEGORIES.map(
    (c) => `  (${q(c.slug)}, ${q(c.name)}, ${q(c.description)}, ${c.sortOrder})`,
  ).join(",\n") +
    "\non conflict (slug) do update set name = excluded.name, description = excluded.description, sort_order = excluded.sort_order;",
);
lines.push("");

lines.push("-- Distribuitori de exemplu");
for (const s of SUPPLIERS) {
  lines.push(`insert into public.suppliers (
  slug, name, short_description, long_description, website, phone, email,
  contact_person, address, city, county_id, national, founded_year,
  employee_range, verified, featured, status
) values (
  ${q(s.slug)}, ${q(s.name)}, ${q(s.short_description)}, ${q(s.long_description)},
  ${q(s.website)}, ${q(s.phone)}, ${q(s.email)}, ${q(s.contact_person)},
  ${q(s.address)}, ${q(s.city)},
  (select id from public.counties where code = ${q(s.county)}),
  ${s.national}, ${s.founded_year}, ${q(s.employee_range)}::employee_range,
  ${s.verified}, ${s.featured}, 'published'
) on conflict (slug) do nothing;`);

  if (s.categories.length) {
    lines.push(`insert into public.supplier_categories (supplier_id, category_id)
select s.id, c.id from public.suppliers s, public.categories c
 where s.slug = ${q(s.slug)} and c.slug in (${s.categories.map(q).join(", ")})
on conflict do nothing;`);
  }
  if (!s.national && s.counties.length) {
    lines.push(`insert into public.supplier_counties (supplier_id, county_id)
select s.id, j.id from public.suppliers s, public.counties j
 where s.slug = ${q(s.slug)} and j.code in (${s.counties.map(q).join(", ")})
on conflict do nothing;`);
  }
  lines.push("");
}

lines.push("-- Reconstruieste indexul de cautare pentru randurile inserate mai sus.");
lines.push("select public.rebuild_supplier_search(id) from public.suppliers;");
lines.push("");
lines.push("commit;");
lines.push("");

writeFileSync(join(root, "seed.sql"), lines.join("\n"), "utf8");
console.log(
  `seed.sql generat: ${COUNTIES.length} judete, ${SEED_CATEGORIES.length} categorii, ${SUPPLIERS.length} distribuitori.`,
);
