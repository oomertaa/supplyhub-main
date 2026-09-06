-- SupplyHub — schema Postgres (Supabase)
-- Se ruleaza o singura data, in SQL Editor, inaintea lui seed.sql.

-- ---------------------------------------------------------------------------
-- Extensii
-- ---------------------------------------------------------------------------
create schema if not exists extensions;
create extension if not exists unaccent with schema extensions;
create extension if not exists pg_trgm with schema extensions;

-- ---------------------------------------------------------------------------
-- Tipuri
-- ---------------------------------------------------------------------------
do $$ begin
  create type employee_range as enum ('1-10', '11-50', '51-200', '200+');
exception when duplicate_object then null; end $$;

do $$ begin
  create type supplier_status as enum ('draft', 'published');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Judete
-- ---------------------------------------------------------------------------
create table if not exists public.counties (
  id          bigint generated always as identity primary key,
  code        text   not null unique,
  name        text   not null unique,
  slug        text   not null unique,
  sort_order  integer not null default 0
);

-- ---------------------------------------------------------------------------
-- Categorii (maximum un nivel de imbricare)
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id          bigint generated always as identity primary key,
  slug        text   not null unique,
  name        text   not null,
  description text,
  parent_id   bigint references public.categories (id) on delete set null,
  sort_order  integer not null default 0
);

create index if not exists categories_parent_idx on public.categories (parent_id);

create or replace function public.categories_max_one_level()
returns trigger
language plpgsql
as $$
declare
  grandparent bigint;
begin
  if new.parent_id is null then
    return new;
  end if;
  if new.parent_id = new.id then
    raise exception 'O categorie nu poate fi propriul parinte';
  end if;
  select parent_id into grandparent from public.categories where id = new.parent_id;
  if grandparent is not null then
    raise exception 'Ierarhia categoriilor este limitata la un nivel';
  end if;
  return new;
end $$;

drop trigger if exists categories_max_one_level on public.categories;
create trigger categories_max_one_level
  before insert or update of parent_id on public.categories
  for each row execute function public.categories_max_one_level();

-- ---------------------------------------------------------------------------
-- Distribuitori
-- ---------------------------------------------------------------------------
create table if not exists public.suppliers (
  id                bigint generated always as identity primary key,
  slug              text not null unique,
  name              text not null,
  short_description text,
  long_description  text,
  logo_url          text,
  website           text,
  phone             text,
  email             text,
  contact_person    text,
  address           text,
  city              text,
  county_id         bigint references public.counties (id) on delete set null,
  national          boolean not null default false,
  founded_year      integer check (founded_year between 1900 and 2100),
  employee_range    employee_range,
  verified          boolean not null default false,
  featured          boolean not null default false,
  status            supplier_status not null default 'draft',
  search_text       text not null default '',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists suppliers_status_idx   on public.suppliers (status);
create index if not exists suppliers_county_idx   on public.suppliers (county_id);
create index if not exists suppliers_national_idx on public.suppliers (national) where national;
create index if not exists suppliers_featured_idx on public.suppliers (featured) where featured;
create index if not exists suppliers_search_idx   on public.suppliers using gin (search_text extensions.gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- Legaturi
-- ---------------------------------------------------------------------------
create table if not exists public.supplier_categories (
  supplier_id bigint not null references public.suppliers (id)  on delete cascade,
  category_id bigint not null references public.categories (id) on delete cascade,
  primary key (supplier_id, category_id)
);
create index if not exists supplier_categories_category_idx on public.supplier_categories (category_id);

create table if not exists public.supplier_counties (
  supplier_id bigint not null references public.suppliers (id) on delete cascade,
  county_id   bigint not null references public.counties (id)  on delete cascade,
  primary key (supplier_id, county_id)
);
create index if not exists supplier_counties_county_idx on public.supplier_counties (county_id);

-- ---------------------------------------------------------------------------
-- Cereri de oferta
-- ---------------------------------------------------------------------------
create table if not exists public.leads (
  id             uuid primary key default gen_random_uuid(),
  supplier_id    bigint references public.suppliers (id) on delete set null,
  requester_name text not null,
  company        text,
  email          text not null,
  phone          text,
  message        text not null,
  source_page    text,
  consent        boolean not null default false,
  created_at     timestamptz not null default now()
);

create index if not exists leads_supplier_idx on public.leads (supplier_id, created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists suppliers_touch_updated_at on public.suppliers;
create trigger suppliers_touch_updated_at
  before update on public.suppliers
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Cautare fara diacritice
--   search_text este intretinut de triggere, deci nu are nevoie de functii
--   IMMUTABLE si nu se rupe cand unaccent isi schimba regulile.
-- ---------------------------------------------------------------------------
create or replace function public.ro_fold(input text)
returns text language sql stable as $$
  select lower(extensions.unaccent(translate(coalesce(input, ''), 'şţŞŢ', 'stST')));
$$;

create or replace function public.rebuild_supplier_search(p_supplier_id bigint)
returns void language sql as $$
  update public.suppliers s
     set search_text = public.ro_fold(
           concat_ws(' ',
             s.name, s.city, s.address, s.short_description,
             (select c.name from public.counties c where c.id = s.county_id),
             (select string_agg(cat.name, ' ')
                from public.supplier_categories sc
                join public.categories cat on cat.id = sc.category_id
               where sc.supplier_id = s.id)
           ))
   where s.id = p_supplier_id;
$$;

create or replace function public.suppliers_search_sync()
returns trigger language plpgsql as $$
begin
  new.search_text := public.ro_fold(
    concat_ws(' ',
      new.name, new.city, new.address, new.short_description,
      (select c.name from public.counties c where c.id = new.county_id),
      (select string_agg(cat.name, ' ')
         from public.supplier_categories sc
         join public.categories cat on cat.id = sc.category_id
        where sc.supplier_id = new.id)
    ));
  return new;
end $$;

drop trigger if exists suppliers_search_sync on public.suppliers;
create trigger suppliers_search_sync
  before insert or update of name, city, address, short_description, county_id
  on public.suppliers
  for each row execute function public.suppliers_search_sync();

create or replace function public.supplier_categories_search_sync()
returns trigger language plpgsql as $$
begin
  perform public.rebuild_supplier_search(coalesce(new.supplier_id, old.supplier_id));
  return null;
end $$;

drop trigger if exists supplier_categories_search_sync on public.supplier_categories;
create trigger supplier_categories_search_sync
  after insert or delete on public.supplier_categories
  for each row execute function public.supplier_categories_search_sync();

-- ---------------------------------------------------------------------------
-- Rolurile anon si authenticated exista deja in Supabase. Blocul de mai jos
-- exista doar ca schema.sql sa poata fi rulata si pe un Postgres local.
-- ---------------------------------------------------------------------------
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin noinherit;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin noinherit;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Row Level Security
--   RLS se activeaza explicit pe fiecare tabela. O tabela fara RLS activat
--   este complet accesibila cu cheia anon, chiar daca nu are nicio politica.
-- ---------------------------------------------------------------------------
alter table public.counties            enable row level security;
alter table public.categories          enable row level security;
alter table public.suppliers           enable row level security;
alter table public.supplier_categories enable row level security;
alter table public.supplier_counties   enable row level security;
alter table public.leads               enable row level security;

drop policy if exists counties_public_read on public.counties;
create policy counties_public_read on public.counties
  for select to anon, authenticated using (true);

drop policy if exists categories_public_read on public.categories;
create policy categories_public_read on public.categories
  for select to anon, authenticated using (true);

drop policy if exists suppliers_public_read on public.suppliers;
create policy suppliers_public_read on public.suppliers
  for select to anon, authenticated using (status = 'published');

drop policy if exists supplier_categories_public_read on public.supplier_categories;
create policy supplier_categories_public_read on public.supplier_categories
  for select to anon, authenticated using (true);

drop policy if exists supplier_counties_public_read on public.supplier_counties;
create policy supplier_counties_public_read on public.supplier_counties
  for select to anon, authenticated using (true);

-- leads: nicio politica. Inserarea se face server-side cu cheia service-role,
-- care ocoleste RLS. Privilegiile sunt revocate suplimentar, ca centura+bretele.
revoke all on public.leads from anon, authenticated;
