-- Require valid invite on email signup, harden handle_new_user, lock invite_codes RLS

-- Shared invite validation (mirrors apps/web/lib/access/inviteCodes.ts)
create or replace function public.validate_invite_code_internal(raw_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text;
  v_referral_slug text;
  v_referrer_id uuid;
  v_referrer_code text;
  v_invite record;
begin
  if raw_code is null or length(trim(raw_code)) < 4 then
    return jsonb_build_object('valid', false, 'error', 'Invite code is required.');
  end if;

  v_referral_slug := lower(trim(raw_code));
  select id, referral_code into v_referrer_id, v_referrer_code
  from public.profiles
  where referral_code = v_referral_slug
  limit 1;

  if found then
    return jsonb_build_object(
      'valid', true,
      'code', v_referrer_code,
      'type', 'referral',
      'grants_tier', 'default',
      'bonus_credits', 2,
      'referrer_id', v_referrer_id
    );
  end if;

  v_code := upper(trim(raw_code));
  select * into v_invite
  from public.invite_codes
  where code = v_code and is_active = true
  limit 1;

  if not found then
    return jsonb_build_object('valid', false, 'error', 'Invalid or expired invite code.');
  end if;

  if v_invite.expires_at is not null and v_invite.expires_at < now() then
    return jsonb_build_object('valid', false, 'error', 'This invite code has expired.');
  end if;

  if v_invite.max_uses is not null and v_invite.uses_count >= v_invite.max_uses then
    return jsonb_build_object('valid', false, 'error', 'This invite code has reached its usage limit.');
  end if;

  return jsonb_build_object(
    'valid', true,
    'code', v_invite.code,
    'type', v_invite.type,
    'grants_tier', v_invite.grants_tier,
    'bonus_credits', v_invite.bonus_credits,
    'referrer_id', v_invite.owner_user_id
  );
end;
$$;

revoke execute on function public.validate_invite_code_internal(text) from public, anon, authenticated;
grant execute on function public.validate_invite_code_internal(text) to supabase_auth_admin;

-- Combined before-user-created hook: disposable email + invite requirement
create or replace function public.hook_before_user_created(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  disposable_result jsonb;
  invite_code text;
  validation jsonb;
  provider text;
begin
  disposable_result := public.hook_block_disposable_email(event);
  if disposable_result ? 'error' then
    return disposable_result;
  end if;

  provider := coalesce(event->'user'->'app_metadata'->>'provider', '');

  -- OAuth signups: invite is verified post-auth via httpOnly cookie + callback
  if provider in ('google', 'apple', 'github', 'azure', 'facebook', 'linkedin_oidc') then
    return '{}'::jsonb;
  end if;

  invite_code := nullif(trim(coalesce(event->'user'->'raw_user_meta_data'->>'invite_code', '')), '');
  if invite_code is null then
    return jsonb_build_object(
      'error', jsonb_build_object(
        'message', 'An invite or referral code is required to sign up.',
        'http_code', 403
      )
    );
  end if;

  validation := public.validate_invite_code_internal(invite_code);
  if not coalesce((validation->>'valid')::boolean, false) then
    return jsonb_build_object(
      'error', jsonb_build_object(
        'message', coalesce(validation->>'error', 'Invalid invite code.'),
        'http_code', 403
      )
    );
  end if;

  return '{}'::jsonb;
end;
$$;

revoke execute on function public.hook_before_user_created(jsonb) from public, anon, authenticated;
grant execute on function public.hook_before_user_created(jsonb) to supabase_auth_admin;

-- Harden profile creation: derive tier/bonus/referrer from validated invite only
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
  v_invite_raw text;
  validation jsonb;
begin
  v_display_name := coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));
  v_invite_raw := new.raw_user_meta_data->>'invite_code';

  v_tier := 'default';
  v_bonus := 0;
  v_referred_by := null;
  v_signup_code := null;

  if v_invite_raw is not null and length(trim(v_invite_raw)) >= 4 then
    validation := public.validate_invite_code_internal(v_invite_raw);
    if coalesce((validation->>'valid')::boolean, false) then
      v_tier := coalesce(validation->>'grants_tier', 'default');
      v_bonus := coalesce((validation->>'bonus_credits')::int, 0);
      v_referred_by := (validation->>'referrer_id')::uuid;
      v_signup_code := validation->>'code';
    end if;
  end if;

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

-- Lock down invite_codes: no public enumeration
drop policy if exists "invite_codes_read_active" on public.invite_codes;
revoke select on public.invite_codes from anon, authenticated;

-- Deactivate seeded bootstrap codes (distribute via waitlist/admin only)
update public.invite_codes
set is_active = false
where code in ('BYTEVERSE-EARLY', 'BYTEVERSE-BETA', 'BYTEVERSE-LAUNCH');
