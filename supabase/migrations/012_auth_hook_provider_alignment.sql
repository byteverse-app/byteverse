-- Align disposable-email hook OAuth provider bypass with invite hook (add linkedin_oidc)

create or replace function public.hook_block_disposable_email(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  email text;
  email_domain text;
  provider text;
  is_blocked int;
begin
  email := lower(trim(coalesce(event->'user'->>'email', '')));
  provider := coalesce(event->'user'->'app_metadata'->>'provider', '');

  if provider in ('google', 'apple', 'github', 'azure', 'facebook', 'linkedin_oidc') then
    return '{}'::jsonb;
  end if;

  if email = '' or position('@' in email) = 0 then
    return '{}'::jsonb;
  end if;

  email_domain := split_part(email, '@', 2);

  select count(*) into is_blocked
  from public.blocked_email_domains b
  where b.domain = email_domain;

  if is_blocked > 0 then
    return jsonb_build_object(
      'error', jsonb_build_object(
        'message', 'Temporary email addresses are not allowed.',
        'http_code', 403
      )
    );
  end if;

  return '{}'::jsonb;
end;
$$;
