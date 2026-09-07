import { IconSearch } from "./Icons";

/** Cautarea libera. `size="lg"` pentru hero, implicit pentru restul paginilor. */
export function SearchBox({
  defaultValue = "",
  size = "md",
}: {
  defaultValue?: string;
  size?: "md" | "lg";
}) {
  const lg = size === "lg";

  return (
    <form
      action="/distribuitori"
      method="get"
      role="search"
      className="flex flex-col gap-2.5 sm:flex-row"
    >
      <label htmlFor="cauta" className="sr-only">
        Caută după nume, categorie sau județ
      </label>
      <div className="relative flex-1">
        <IconSearch
          className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted ${lg ? "size-5" : "size-4"}`}
        />
        <input
          id="cauta"
          name="q"
          type="search"
          defaultValue={defaultValue}
          placeholder="Nume firmă, echipament sau județ"
          className={`field pl-11 ${lg ? "py-3.5 text-base" : ""}`}
        />
      </div>
      <button type="submit" className={`btn btn-primary ${lg ? "px-7 py-3.5 text-base" : ""}`}>
        Caută
      </button>
    </form>
  );
}
