-- Security advisor fixes: RLS policies for internal tables + function search_path

-- blocked_email_domains: no direct client access (auth hook uses security definer)
create policy "blocked_email_domains_no_client_access"
  on public.blocked_email_domains
  as restrictive
  for all
  to anon, authenticated
  using (false)
  with check (false);

create policy "blocked_email_domains_auth_admin_read"
  on public.blocked_email_domains
  for select
  to supabase_auth_admin
  using (true);

-- waitlist_entries: accessed only via service-role API routes
create policy "waitlist_entries_no_client_access"
  on public.waitlist_entries
  as restrictive
  for all
  to anon, authenticated
  using (false)
  with check (false);

-- Pin search_path on referral code generator (security definer callers rely on public schema)
create or replace function public.generate_referral_code(display text)
returns text
language plpgsql
set search_path = public
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
