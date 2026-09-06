/** Pliaza diacriticele romanesti si produce un slug ASCII. */
export function foldDiacritics(input: string): string {
  return input
    .replace(/[șş]/g, "s")
    .replace(/[ȘŞ]/g, "S")
    .replace(/[țţ]/g, "t")
    .replace(/[ȚŢ]/g, "T")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function slugify(input: string): string {
  return foldDiacritics(input)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Normalizare pentru cautare: fara diacritice, minuscule, spatii colapsate. */
export function normalizeSearch(input: string): string {
  return foldDiacritics(input).toLowerCase().replace(/\s+/g, " ").trim();
}
