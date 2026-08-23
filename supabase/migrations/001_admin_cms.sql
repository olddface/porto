-- Migration: admin CMS (projects.body + authenticated write RLS)
-- Run in Supabase SQL Editor on existing databases

-- Replace details[] with markdown body
alter table projects add column if not exists body text not null default '';

update projects
set body = array_to_string(details, E'\n\n')
where body = '' and details is not null and array_length(details, 1) > 0;

alter table projects drop column if exists details;

-- Authenticated write policies (public SELECT unchanged)
create policy "Authenticated insert profiles" on profiles
  for insert to authenticated with check (true);
create policy "Authenticated update profiles" on profiles
  for update to authenticated using (true) with check (true);
create policy "Authenticated delete profiles" on profiles
  for delete to authenticated using (true);

create policy "Authenticated insert social_links" on social_links
  for insert to authenticated with check (true);
create policy "Authenticated update social_links" on social_links
  for update to authenticated using (true) with check (true);
create policy "Authenticated delete social_links" on social_links
  for delete to authenticated using (true);

create policy "Authenticated insert experiences" on experiences
  for insert to authenticated with check (true);
create policy "Authenticated update experiences" on experiences
  for update to authenticated using (true) with check (true);
create policy "Authenticated delete experiences" on experiences
  for delete to authenticated using (true);

create policy "Authenticated insert skill_groups" on skill_groups
  for insert to authenticated with check (true);
create policy "Authenticated update skill_groups" on skill_groups
  for update to authenticated using (true) with check (true);
create policy "Authenticated delete skill_groups" on skill_groups
  for delete to authenticated using (true);

create policy "Authenticated insert projects" on projects
  for insert to authenticated with check (true);
create policy "Authenticated update projects" on projects
  for update to authenticated using (true) with check (true);
create policy "Authenticated delete projects" on projects
  for delete to authenticated using (true);
