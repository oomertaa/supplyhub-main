export type EmployeeRange = "1-10" | "11-50" | "51-200" | "200+";
export type SupplierStatus = "draft" | "published";

export type CountyRow = {
  id: number;
  code: string;
  name: string;
  slug: string;
  sort_order: number;
};

export type CategoryRow = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  parent_id: number | null;
  sort_order: number;
};

export type SupplierRow = {
  id: number;
  slug: string;
  name: string;
  short_description: string | null;
  long_description: string | null;
  logo_url: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  contact_person: string | null;
  address: string | null;
  city: string | null;
  county_id: number | null;
  national: boolean;
  founded_year: number | null;
  employee_range: EmployeeRange | null;
  verified: boolean;
  featured: boolean;
  status: SupplierStatus;
  created_at: string;
  updated_at: string;
};

/** Distribuitor cu relatiile rezolvate, forma folosita in pagini. */
export type Supplier = SupplierRow & {
  county: CountyRow | null;
  categories: CategoryRow[];
  counties: CountyRow[];
};

export type SupplierCard = Pick<
  SupplierRow,
  "id" | "slug" | "name" | "short_description" | "logo_url" | "city" | "national" | "verified"
> & {
  county: CountyRow | null;
  categories: Pick<CategoryRow, "slug" | "name">[];
};
