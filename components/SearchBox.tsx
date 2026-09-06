export function SearchBox({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form action="/distribuitori" method="get" role="search" className="flex flex-wrap gap-3">
      <label htmlFor="cauta" className="sr-only">
        Caută după nume, categorie sau județ
      </label>
      <input
        id="cauta"
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="Nume, categorie sau județ"
        className="min-w-0 flex-1 border-b-2 border-ink bg-transparent px-1 py-3 text-lg placeholder:text-muted focus:border-accent focus:outline-none"
      />
      <button
        type="submit"
        className="border-b-2 border-accent bg-accent px-6 py-3 font-medium text-white hover:bg-ink hover:border-ink"
      >
        Caută
      </button>
    </form>
  );
}
