-- Revoke public execute on profile bootstrap trigger (security advisor)

revoke execute on function public.handle_new_user() from public, anon, authenticated;
