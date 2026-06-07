-- Access control, referrals, gamification, waitlist, and feedback

-- Extend profiles
alter table public.profiles
  add column if not exists access_tier text not null default 'default'
    check (access_tier in ('default', 'early_access', 'tester', 'founding', 'unlimited')),
  add column if not exists referral_code text unique,
  add column if not exists referred_by uuid references public.profiles(id) on delete set null,
  add column if not exists signup_code_used text,
  add column if not exists platform_credits_bonus int not null default 0,
  add column if not exists creator_score int not null default 0,
  add column if not exists streak_current int not null default 0,
  add column if not exists streak_best int not null default 0,
  add column if not exists streak_last_active date,
  add column if not exists onboarding_completed_at timestamptz,
  add column if not exists is_admin boolean not null default false;

create index if not exists profiles_referral_code_idx on public.profiles(referral_code);
create index if not exists profiles_access_tier_idx on public.profiles(access_tier);

-- Tier configuration (admin-configurable)
create table if not exists public.access_tier_config (
  tier text primary key,
  daily_platform_limit int,
  monthly_platform_limit int,
  rolling_window_hours int not null default 24,
  requires_invite boolean not null default true,
  description text
);

insert into public.access_tier_config (tier, daily_platform_limit, monthly_platform_limit, rolling_window_hours, requires_invite, description)
values
  ('default', 5, 20, 24, true, 'Invite signup — 5 full courses per 24h rolling window'),
  ('early_access', 15, 60, 24, true, 'Early access — higher limits'),
  ('founding', 50, 200, 24, true, 'Founding members — generous limits'),
  ('tester', null, null, 24, false, 'Internal beta — unlimited platform usage'),
  ('unlimited', null, null, 24, false, 'Admin override — unlimited')
on conflict (tier) do nothing;

-- Rolling 24h usage window
create table if not exists public.platform_usage_windows (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  window_started_at timestamptz not null default now(),
  courses_completed int not null default 0,
  last_consumed_at timestamptz,
  unique (user_id)
);

create index if not exists platform_usage_windows_user_idx on public.platform_usage_windows(user_id);

-- Monthly usage
create table if not exists public.platform_usage_monthly (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  month text not null,
  courses_completed int not null default 0,
  unique (user_id, month)
);

create index if not exists platform_usage_monthly_user_month_idx on public.platform_usage_monthly(user_id, month);

-- Course generation session tracking
create table if not exists public.course_generation_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  provider_source text not null check (provider_source in ('platform', 'byok', 'local')),
  outline_completed_at timestamptz,
  content_stages_total int not null default 0,
  content_stages_completed int not null default 0,
  fully_completed_at timestamptz,
  credit_consumed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, project_id)
);

create index if not exists course_generation_sessions_project_idx on public.course_generation_sessions(project_id);

-- Invite codes
create table if not exists public.invite_codes (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,
  type text not null check (type in ('referral', 'early_access', 'tester')),
  owner_user_id uuid references public.profiles(id) on delete set null,
  max_uses int,
  uses_count int not null default 0,
  grants_tier text not null default 'default'
    check (grants_tier in ('default', 'early_access', 'tester', 'founding', 'unlimited')),
  bonus_credits int not null default 0,
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists invite_codes_code_idx on public.invite_codes(code);

-- Referral events
create table if not exists public.referral_events (
  id uuid primary key default uuid_generate_v4(),
  referrer_id uuid references public.profiles(id) on delete set null,
  referee_id uuid not null references public.profiles(id) on delete cascade,
  event text not null check (event in ('signup', 'first_course_complete', 'byok_course_complete')),
  credits_awarded int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists referral_events_referrer_idx on public.referral_events(referrer_id);
create index if not exists referral_events_referee_idx on public.referral_events(referee_id);

-- Achievement definitions
create table if not exists public.achievement_definitions (
  id text primary key,
  title text not null,
  description text not null,
  icon text not null default 'star',
  points int not null default 10
);

insert into public.achievement_definitions (id, title, description, icon, points) values
  ('first_course', 'First Course', 'Complete your first full course generation', 'trophy', 10),
  ('exporter', 'Exporter', 'Export your first SCORM or HTML course', 'download', 5),
  ('byok_pioneer', 'BYOK Pioneer', 'Configure and test your own API key', 'key', 10),
  ('local_llm', 'Local LLM', 'Complete a course using a local model', 'cpu', 15),
  ('streak_3', 'On a Roll', '3-day creation streak', 'flame', 10),
  ('streak_7', 'Week Warrior', '7-day creation streak', 'flame', 25),
  ('streak_30', 'Creator Legend', '30-day creation streak', 'flame', 100),
  ('community_builder', 'Community Builder', '3 successful referral signups', 'users', 30),
  ('feedback_champion', 'Feedback Champion', 'Submit 5 feedback ratings', 'message', 15)
on conflict (id) do nothing;

-- User achievements
create table if not exists public.user_achievements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id text not null references public.achievement_definitions(id) on delete cascade,
  earned_at timestamptz not null default now(),
  metadata jsonb not null default '{}',
  unique (user_id, achievement_id)
);

create index if not exists user_achievements_user_idx on public.user_achievements(user_id);

-- Product feedback
create table if not exists public.product_feedback (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null,
  context text not null,
  rating int check (rating >= 1 and rating <= 5),
  comment text,
  project_id uuid references public.projects(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists product_feedback_user_idx on public.product_feedback(user_id);

-- Waitlist
create table if not exists public.waitlist_entries (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  name text,
  use_case text,
  role text,
  team_size text,
  status text not null default 'pending'
    check (status in ('pending', 'invited', 'signed_up')),
  invited_code_id uuid references public.invite_codes(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (email)
);

create index if not exists waitlist_entries_status_idx on public.waitlist_entries(status);

-- Showcase (public course previews)
alter table public.projects
  add column if not exists is_public_showcase boolean not null default false;

-- Helper: generate referral slug
create or replace function public.generate_referral_code(display text)
returns text
language plpgsql
as $$
declare
  base text;
  suffix text;
begin
  base := lower(regexp_replace(coalesce(nullif(trim(display), ''), 'user'), '[^a-z0-9]+', '-', 'g'));
  base := trim(both '-' from base);
  if length(base) > 12 then
    base := left(base, 12);
  end if;
  suffix := substr(md5(random()::text || clock_timestamp()::text), 1, 4);
  return base || '-' || suffix;
end;
$$;

-- Updated new-user handler
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_display_name text;
  v_referral_code text;
  v_tier text;
  v_bonus int;
  v_referred_by uuid;
  v_signup_code text;
begin
  v_display_name := coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));
  v_tier := coalesce(new.raw_user_meta_data->>'access_tier', 'default');
  v_bonus := coalesce((new.raw_user_meta_data->>'platform_credits_bonus')::int, 0);
  v_referred_by := (new.raw_user_meta_data->>'referred_by')::uuid;
  v_signup_code := new.raw_user_meta_data->>'invite_code';

  v_referral_code := public.generate_referral_code(v_display_name);
  while exists (select 1 from public.profiles where referral_code = v_referral_code) loop
    v_referral_code := public.generate_referral_code(v_display_name || random()::text);
  end loop;

  insert into public.profiles (
    id,
    display_name,
    access_tier,
    referral_code,
    referred_by,
    signup_code_used,
    platform_credits_bonus
  )
  values (
    new.id,
    v_display_name,
    v_tier,
    v_referral_code,
    v_referred_by,
    v_signup_code,
    v_bonus
  );

  return new;
end;
$$;

-- RLS policies
alter table public.access_tier_config enable row level security;
alter table public.platform_usage_windows enable row level security;
alter table public.platform_usage_monthly enable row level security;
alter table public.course_generation_sessions enable row level security;
alter table public.invite_codes enable row level security;
alter table public.referral_events enable row level security;
alter table public.achievement_definitions enable row level security;
alter table public.user_achievements enable row level security;
alter table public.product_feedback enable row level security;
alter table public.waitlist_entries enable row level security;

create policy "access_tier_config_read" on public.access_tier_config for select using (true);

create policy "usage_windows_own" on public.platform_usage_windows for all using (auth.uid() = user_id);
create policy "usage_monthly_own" on public.platform_usage_monthly for all using (auth.uid() = user_id);
create policy "generation_sessions_own" on public.course_generation_sessions for all using (auth.uid() = user_id);

create policy "invite_codes_read_active" on public.invite_codes for select using (is_active = true);
create policy "referral_events_own" on public.referral_events for select
  using (auth.uid() = referrer_id or auth.uid() = referee_id);

create policy "achievement_defs_read" on public.achievement_definitions for select using (true);
create policy "user_achievements_own" on public.user_achievements for select using (auth.uid() = user_id);

create policy "feedback_insert_own" on public.product_feedback for insert with check (auth.uid() = user_id);
create policy "feedback_select_own" on public.product_feedback for select using (auth.uid() = user_id);

-- Seed bootstrap invite codes
insert into public.invite_codes (code, type, grants_tier, bonus_credits, max_uses, is_active)
values
  ('BYTEVERSE-EARLY', 'early_access', 'early_access', 5, 1000, true),
  ('BYTEVERSE-BETA', 'tester', 'tester', 0, 500, true),
  ('BYTEVERSE-LAUNCH', 'early_access', 'default', 2, null, true)
on conflict (code) do nothing;
