import { createServiceRoleSupabaseClient } from '@/lib/supabase/server';

export async function isAdminUser(userId: string): Promise<boolean> {
  const supabase = createServiceRoleSupabaseClient();
  const { data } = await supabase
    .from('profiles')
    .select('is_admin, access_tier')
    .eq('id', userId)
    .single();

  if (data?.is_admin) return true;
  if (data?.access_tier === 'tester' || data?.access_tier === 'unlimited') return true;

  const adminEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (adminEmails.length === 0) return false;

  const { data: authUser } = await supabase.auth.admin.getUserById(userId);
  const email = authUser?.user?.email?.toLowerCase();
  return !!email && adminEmails.includes(email);
}
