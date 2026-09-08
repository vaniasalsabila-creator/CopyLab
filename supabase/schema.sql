-- CopyLab schema — run this once in the Supabase SQL Editor
-- (Project → SQL Editor → New query → paste → Run)

create table if not exists folders (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at bigint not null
);

create table if not exists projects (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  folder_id text not null references folders(id) on delete cascade,
  name text not null,
  description text not null default '',
  created_at bigint not null,
  updated_at bigint not null
);

create table if not exists variations (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id text not null references projects(id) on delete cascade,
  name text not null,
  description text not null default '',
  created_at bigint not null
);

create table if not exists options (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  variation_id text not null references variations(id) on delete cascade,
  name text not null,
  created_at bigint not null,
  copy jsonb not null
);

-- Per-user app state that isn't tied to a single record (favorites, recents, prefs)
create table if not exists user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  favorites jsonb not null default '[]',
  recent jsonb not null default '[]',
  sidebar_collapsed boolean not null default false,
  theme text not null default 'light'
);

create index if not exists projects_folder_id_idx on projects(folder_id);
create index if not exists variations_project_id_idx on variations(project_id);
create index if not exists options_variation_id_idx on options(variation_id);

alter table folders enable row level security;
alter table projects enable row level security;
alter table variations enable row level security;
alter table options enable row level security;
alter table user_settings enable row level security;

create policy "Users manage their own folders" on folders
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own projects" on projects
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own variations" on variations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own options" on options
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own settings" on user_settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
