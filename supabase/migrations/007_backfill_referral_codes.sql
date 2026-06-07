-- Backfill referral codes for profiles created before migration 006

do $$
declare
  r record;
  v_code text;
begin
  for r in
    select id, display_name
    from public.profiles
    where referral_code is null
  loop
    v_code := public.generate_referral_code(r.display_name);
    while exists (select 1 from public.profiles where referral_code = v_code) loop
      v_code := public.generate_referral_code(r.display_name || random()::text);
    end loop;

    update public.profiles
    set referral_code = v_code
    where id = r.id;
  end loop;
end $$;
