/**
 * Pictograma pentru fiecare categorie de echipament. Slug necunoscut =>
 * simbol generic, deci categoriile adaugate ulterior in Supabase nu strica
 * grila.
 */
const PATHS: Record<string, React.ReactNode> = {
  "panouri-fotovoltaice": (
    <>
      <path d="M3.5 15.5 6 5h12l2.5 10.5H3.5Z" />
      <path d="M12 5v10.5M4.8 10.2h14.4M12 15.5V20M9 20h6" />
    </>
  ),
  invertoare: (
    <>
      <rect x="4" y="3.5" width="16" height="17" rx="2" />
      <path d="M13.5 7 9.5 13h5l-4 4.5" />
    </>
  ),
  "baterii-de-stocare": (
    <>
      <rect x="3" y="7" width="15" height="10" rx="2" />
      <path d="M21 10.5v3M6.5 10v4M10 10v4M13.5 10v4" />
    </>
  ),
  "sisteme-de-montaj": (
    <>
      <path d="M3 8h18M3 14h18" />
      <path d="M8 4.5 6 19.5M16 4.5l-2 15" />
    </>
  ),
  "pompe-de-caldura": (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 8.5V12l2.5 1.5" />
    </>
  ),
  "statii-de-incarcare-ev": (
    <>
      <path d="M5 20V6a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v14M4 20h11" />
      <path d="M9.5 8 7.5 11.5h3L8.5 15" />
      <path d="M14 9h3a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0v-5" />
    </>
  ),
  "cabluri-si-accesorii": (
    <>
      <path d="M5 4v5a4 4 0 0 0 4 4h6a4 4 0 0 1 4 4v3" />
      <path d="M3 4h4M17 20h4" />
      <circle cx="12" cy="13" r="1" />
    </>
  ),
  "structuri-si-tracker-e": (
    <>
      <path d="M4 10.5 13 5l4.5 6.5L8.5 17 4 10.5Z" />
      <path d="M11 15.5 9.5 21M6.5 21h6" />
      <path d="M18 4.5 20.5 7" />
    </>
  ),
};

const FALLBACK = (
  <>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M9 12h6M12 9v6" />
  </>
);

export function CategoryIcon({ slug, className }: { slug: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className ?? "size-5"}
    >
      {PATHS[slug] ?? FALLBACK}
    </svg>
  );
}
