-- R2 per-user credentials + project cover image
-- Run in Supabase SQL Editor

create table if not exists user_r2_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  account_id text not null,
  access_key_id text not null,
  secret_access_key text not null,
  bucket_name text not null,
  public_base_url text not null,
  updated_at timestamptz not null default now()
);

alter table user_r2_settings enable row level security;

create policy "Users select own r2 settings" on user_r2_settings
  for select to authenticated using (auth.uid() = user_id);

create policy "Users insert own r2 settings" on user_r2_settings
  for insert to authenticated with check (auth.uid() = user_id);

create policy "Users update own r2 settings" on user_r2_settings
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users delete own r2 settings" on user_r2_settings
  for delete to authenticated using (auth.uid() = user_id);

alter table projects add column if not exists image_url text;
