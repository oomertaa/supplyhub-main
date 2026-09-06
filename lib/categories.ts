import { slugify } from "./slugify.ts";

export type SeedCategory = {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
};

/** Categoriile initiale. seed.sql se genereaza din acest fisier. */
const RAW: Array<[name: string, description: string]> = [
  [
    "Panouri fotovoltaice",
    "Distribuitori de module fotovoltaice monocristaline și bifaciale, pentru instalații rezidențiale, comerciale și parcuri de producție.",
  ],
  [
    "Invertoare",
    "Invertoare on-grid, hibride și off-grid, optimizatoare și accesorii de monitorizare pentru sisteme fotovoltaice.",
  ],
  [
    "Baterii de stocare",
    "Sisteme de stocare cu litiu pentru autoconsum rezidențial și industrial, de la module de câțiva kWh la rack-uri de înaltă tensiune.",
  ],
  [
    "Sisteme de montaj",
    "Structuri pentru acoperiș înclinat, terasă și balastate, cleme, profile și elemente de prindere.",
  ],
  [
    "Pompe de căldură",
    "Pompe de căldură aer-apă, sol-apă și aer-aer, plus module hidraulice și boilere asociate.",
  ],
  [
    "Stații de încărcare EV",
    "Stații AC și DC pentru locuințe, flote și spații publice, împreună cu soluțiile de management al încărcării.",
  ],
  [
    "Cabluri și accesorii",
    "Cabluri solare, conectori, protecții DC și AC, tablouri și consumabile de instalare.",
  ],
  [
    "Structuri și tracker-e",
    "Structuri fixe pentru sol și sisteme de urmărire pe una sau două axe, pentru parcuri fotovoltaice.",
  ],
];

export const SEED_CATEGORIES: readonly SeedCategory[] = RAW.map(
  ([name, description], i) => ({ name, slug: slugify(name), description, sortOrder: i + 1 }),
);
