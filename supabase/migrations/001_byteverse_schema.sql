-- ByteVerse (separate from Sudar) — creator projects and exports

create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz default now()
);

create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'Untitled module',
  status text not null default 'draft' check (status in ('draft', 'generating', 'ready', 'exported')),
  template_id text default 'birb-micro',
  metadata jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.folders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  color text default '#6366f1',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.sources (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  type text not null check (type in ('file', 'url', 'text')),
  name text,
  storage_path text,
  chunk_count int default 0,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists public.chat_sessions (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text default 'Main',
  messages jsonb not null default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.modules (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade unique,
  outline_json jsonb,
  content_json jsonb,
  pedagogy_meta jsonb default '{}',
  workspace_state jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.exports (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  format text not null check (format in ('scorm', 'html', 'json')),
  storage_path text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.folders enable row level security;
alter table public.sources enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.modules enable row level security;
alter table public.exports enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "projects_own" on public.projects for all using (auth.uid() = user_id);
create policy "folders_own" on public.folders for all using (auth.uid() = user_id);
create policy "sources_via_project" on public.sources for all using (
  exists (select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid())
);
create policy "chat_via_project" on public.chat_sessions for all using (
  exists (select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid())
);
create policy "modules_via_project" on public.modules for all using (
  exists (select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid())
);
create policy "exports_via_project" on public.exports for all using (
  exists (select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid())
);
