-- Polymorphic images table (links to any parent row via from_table + from_id)
-- Run in Supabase SQL Editor

create table if not exists images (
  id uuid primary key default gen_random_uuid(),
  from_table text not null,
  from_id uuid not null,
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists images_from_lookup_idx on images (from_table, from_id);

alter table images enable row level security;

create policy "Public read images" on images for select using (true);

create policy "Authenticated insert images" on images
  for insert to authenticated with check (true);

create policy "Authenticated update images" on images
  for update to authenticated using (true) with check (true);

create policy "Authenticated delete images" on images
  for delete to authenticated using (true);
