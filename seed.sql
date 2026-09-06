-- SupplyHub — date initiale.
-- FISIER GENERAT. Nu edita manual: modifica lib/counties.ts sau
-- lib/categories.ts, apoi ruleaza `npm run seed:gen`.
-- Se ruleaza dupa schema.sql.

begin;

-- 42 judete (41 + Bucuresti)
insert into public.counties (code, name, slug, sort_order) values
  ('AB', 'Alba', 'alba', 1),
  ('AR', 'Arad', 'arad', 2),
  ('AG', 'Argeș', 'arges', 3),
  ('BC', 'Bacău', 'bacau', 4),
  ('BH', 'Bihor', 'bihor', 5),
  ('BN', 'Bistrița-Năsăud', 'bistrita-nasaud', 6),
  ('BT', 'Botoșani', 'botosani', 7),
  ('BV', 'Brașov', 'brasov', 8),
  ('BR', 'Brăila', 'braila', 9),
  ('B', 'București', 'bucuresti', 10),
  ('BZ', 'Buzău', 'buzau', 11),
  ('CS', 'Caraș-Severin', 'caras-severin', 12),
  ('CL', 'Călărași', 'calarasi', 13),
  ('CJ', 'Cluj', 'cluj', 14),
  ('CT', 'Constanța', 'constanta', 15),
  ('CV', 'Covasna', 'covasna', 16),
  ('DB', 'Dâmbovița', 'dambovita', 17),
  ('DJ', 'Dolj', 'dolj', 18),
  ('GL', 'Galați', 'galati', 19),
  ('GR', 'Giurgiu', 'giurgiu', 20),
  ('GJ', 'Gorj', 'gorj', 21),
  ('HR', 'Harghita', 'harghita', 22),
  ('HD', 'Hunedoara', 'hunedoara', 23),
  ('IL', 'Ialomița', 'ialomita', 24),
  ('IS', 'Iași', 'iasi', 25),
  ('IF', 'Ilfov', 'ilfov', 26),
  ('MM', 'Maramureș', 'maramures', 27),
  ('MH', 'Mehedinți', 'mehedinti', 28),
  ('MS', 'Mureș', 'mures', 29),
  ('NT', 'Neamț', 'neamt', 30),
  ('OT', 'Olt', 'olt', 31),
  ('PH', 'Prahova', 'prahova', 32),
  ('SM', 'Satu Mare', 'satu-mare', 33),
  ('SJ', 'Sălaj', 'salaj', 34),
  ('SB', 'Sibiu', 'sibiu', 35),
  ('SV', 'Suceava', 'suceava', 36),
  ('TR', 'Teleorman', 'teleorman', 37),
  ('TM', 'Timiș', 'timis', 38),
  ('TL', 'Tulcea', 'tulcea', 39),
  ('VS', 'Vaslui', 'vaslui', 40),
  ('VL', 'Vâlcea', 'valcea', 41),
  ('VN', 'Vrancea', 'vrancea', 42)
on conflict (code) do update set name = excluded.name, slug = excluded.slug, sort_order = excluded.sort_order;

-- 8 categorii
insert into public.categories (slug, name, description, sort_order) values
  ('panouri-fotovoltaice', 'Panouri fotovoltaice', 'Distribuitori de module fotovoltaice monocristaline și bifaciale, pentru instalații rezidențiale, comerciale și parcuri de producție.', 1),
  ('invertoare', 'Invertoare', 'Invertoare on-grid, hibride și off-grid, optimizatoare și accesorii de monitorizare pentru sisteme fotovoltaice.', 2),
  ('baterii-de-stocare', 'Baterii de stocare', 'Sisteme de stocare cu litiu pentru autoconsum rezidențial și industrial, de la module de câțiva kWh la rack-uri de înaltă tensiune.', 3),
  ('sisteme-de-montaj', 'Sisteme de montaj', 'Structuri pentru acoperiș înclinat, terasă și balastate, cleme, profile și elemente de prindere.', 4),
  ('pompe-de-caldura', 'Pompe de căldură', 'Pompe de căldură aer-apă, sol-apă și aer-aer, plus module hidraulice și boilere asociate.', 5),
  ('statii-de-incarcare-ev', 'Stații de încărcare EV', 'Stații AC și DC pentru locuințe, flote și spații publice, împreună cu soluțiile de management al încărcării.', 6),
  ('cabluri-si-accesorii', 'Cabluri și accesorii', 'Cabluri solare, conectori, protecții DC și AC, tablouri și consumabile de instalare.', 7),
  ('structuri-si-tracker-e', 'Structuri și tracker-e', 'Structuri fixe pentru sol și sisteme de urmărire pe una sau două axe, pentru parcuri fotovoltaice.', 8)
on conflict (slug) do update set name = excluded.name, description = excluded.description, sort_order = excluded.sort_order;

-- Distribuitori de exemplu
insert into public.suppliers (
  slug, name, short_description, long_description, website, phone, email,
  contact_person, address, city, county_id, national, founded_year,
  employee_range, verified, featured, status
) values (
  'solaris-distributie', 'Solaris Distribuție', 'Distribuitor de module fotovoltaice și invertoare, cu stoc în depozitul din Cluj și livrare în toată țara.', 'Solaris Distribuție lucrează exclusiv cu instalatori și dezvoltatori. Portofoliul acoperă module monocristaline de 550–700 Wp, invertoare on-grid și hibride, plus structura de montaj aferentă.

Comenzile confirmate până la ora 14:00 pleacă din depozit în aceeași zi. Pentru proiecte peste 100 kWp există ofertare dedicată și grafic de livrare pe tranșe.',
  'https://exemplu-solaris.ro', '+40 264 000 000', 'vanzari@exemplu-solaris.ro', 'Andrei Pop',
  'Str. Fabricii 12', 'Cluj-Napoca',
  (select id from public.counties where code = 'CJ'),
  true, 2014, '11-50'::employee_range,
  true, true, 'published'
) on conflict (slug) do nothing;
insert into public.supplier_categories (supplier_id, category_id)
select s.id, c.id from public.suppliers s, public.categories c
 where s.slug = 'solaris-distributie' and c.slug in ('panouri-fotovoltaice', 'invertoare', 'sisteme-de-montaj')
on conflict do nothing;

insert into public.suppliers (
  slug, name, short_description, long_description, website, phone, email,
  contact_person, address, city, county_id, national, founded_year,
  employee_range, verified, featured, status
) values (
  'voltaria-energy', 'Voltaria Energy', 'Invertoare hibride și sisteme de stocare pentru rezidențial și comercial mic, cu suport tehnic în limba română.', 'Voltaria Energy importă direct invertoare hibride și baterii de înaltă tensiune. Echipa tehnică asigură punerea în funcțiune la distanță și înlocuirea în garanție din stocul propriu.

Pentru instalatorii parteneri există training de configurare și acces la un canal de suport dedicat.',
  'https://exemplu-voltaria.ro', '+40 21 000 0000', 'office@exemplu-voltaria.ro', 'Ioana Dumitrescu',
  'Bd. Timișoara 84', 'București',
  (select id from public.counties where code = 'B'),
  false, 2019, '1-10'::employee_range,
  true, true, 'published'
) on conflict (slug) do nothing;
insert into public.supplier_categories (supplier_id, category_id)
select s.id, c.id from public.suppliers s, public.categories c
 where s.slug = 'voltaria-energy' and c.slug in ('invertoare', 'baterii-de-stocare')
on conflict do nothing;
insert into public.supplier_counties (supplier_id, county_id)
select s.id, j.id from public.suppliers s, public.counties j
 where s.slug = 'voltaria-energy' and j.code in ('B', 'IF', 'PH', 'CT', 'BZ')
on conflict do nothing;

insert into public.suppliers (
  slug, name, short_description, long_description, website, phone, email,
  contact_person, address, city, county_id, national, founded_year,
  employee_range, verified, featured, status
) values (
  'termocore-instal', 'Termocore Instal', 'Pompe de căldură aer-apă și module hidraulice, cu depozit în Brașov și service autorizat.', 'Termocore Instal distribuie pompe de căldură pentru locuințe individuale și clădiri de birouri, împreună cu boilerele și vasele tampon asociate.

Service-ul propriu acoperă centrul și sudul țării, cu intervenție în maximum 48 de ore pentru echipamentele aflate în garanție.',
  'https://exemplu-termocore.ro', '+40 268 000 000', 'comenzi@exemplu-termocore.ro', 'Mihai Rusu',
  'Str. Zizinului 145', 'Brașov',
  (select id from public.counties where code = 'BV'),
  false, 2011, '51-200'::employee_range,
  true, false, 'published'
) on conflict (slug) do nothing;
insert into public.supplier_categories (supplier_id, category_id)
select s.id, c.id from public.suppliers s, public.categories c
 where s.slug = 'termocore-instal' and c.slug in ('pompe-de-caldura')
on conflict do nothing;
insert into public.supplier_counties (supplier_id, county_id)
select s.id, j.id from public.suppliers s, public.counties j
 where s.slug = 'termocore-instal' and j.code in ('BV', 'CV', 'HR', 'SB', 'MS', 'AG', 'DB')
on conflict do nothing;

insert into public.suppliers (
  slug, name, short_description, long_description, website, phone, email,
  contact_person, address, city, county_id, national, founded_year,
  employee_range, verified, featured, status
) values (
  'amper-mobility', 'Amper Mobility', 'Stații de încărcare AC și DC pentru flote, parcări publice și clădiri de birouri.', 'Amper Mobility furnizează stații de încărcare de la 7 kW la 180 kW, împreună cu platforma de management al încărcării și integrarea în sistemele de facturare.

Echipa oferă dimensionare gratuită a puterii disponibile în branșament înainte de comandă.',
  'https://exemplu-amper.ro', '+40 256 000 000', 'contact@exemplu-amper.ro', 'Raluca Ilie',
  'Calea Aradului 22', 'Timișoara',
  (select id from public.counties where code = 'TM'),
  true, 2021, '11-50'::employee_range,
  false, false, 'published'
) on conflict (slug) do nothing;
insert into public.supplier_categories (supplier_id, category_id)
select s.id, c.id from public.suppliers s, public.categories c
 where s.slug = 'amper-mobility' and c.slug in ('statii-de-incarcare-ev', 'cabluri-si-accesorii')
on conflict do nothing;

insert into public.suppliers (
  slug, name, short_description, long_description, website, phone, email,
  contact_person, address, city, county_id, national, founded_year,
  employee_range, verified, featured, status
) values (
  'structura-solar', 'Structura Solar', 'Structuri de montaj pe sol și tracker-e pe o axă pentru parcuri fotovoltaice, cu producție proprie.', 'Structura Solar produce structuri fixe și sisteme de urmărire pe o axă, cu calcul static și proiect de fundare incluse pentru proiectele peste 1 MWp.

Livrarea se face direct în șantier, pe tranșe corelate cu graficul de montaj.',
  'https://exemplu-structura.ro', '+40 232 000 000', 'proiecte@exemplu-structura.ro', 'Cristian Moraru',
  'Șos. Păcurari 180', 'Iași',
  (select id from public.counties where code = 'IS'),
  false, 2016, '51-200'::employee_range,
  true, false, 'published'
) on conflict (slug) do nothing;
insert into public.supplier_categories (supplier_id, category_id)
select s.id, c.id from public.suppliers s, public.categories c
 where s.slug = 'structura-solar' and c.slug in ('structuri-si-tracker-e', 'sisteme-de-montaj')
on conflict do nothing;
insert into public.supplier_counties (supplier_id, county_id)
select s.id, j.id from public.suppliers s, public.counties j
 where s.slug = 'structura-solar' and j.code in ('IS', 'NT', 'BC', 'VS', 'SV', 'BT', 'GL')
on conflict do nothing;

-- Reconstruieste indexul de cautare pentru randurile inserate mai sus.
select public.rebuild_supplier_search(id) from public.suppliers;

commit;
