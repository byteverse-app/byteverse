-- Auth profile bootstrap, folders, and workspace state columns

alter table public.projects
  add column if not exists metadata jsonb not null default '{}';

alter table public.modules
  add column if not exists workspace_state jsonb default '{}';

create table if not exists public.folders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  color text default '#6366f1',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.folders enable row level security;

create policy "folders_own" on public.folders for all using (auth.uid() = user_id);

-- Split profiles policy: INSERT handled by security definer trigger
drop policy if exists "profiles_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
