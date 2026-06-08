import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { checkUserInviteAccess } from '@/lib/access/requireInvite';
import PendingInviteHandler from '@/components/auth/PendingInviteHandler';
import NpsSurveyHandler from '@/components/feedback/NpsSurveyHandler';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/app');
  }

  const access = await checkUserInviteAccess(user.id, supabase);
  if (!access.hasAccess) {
    redirect('/signup?error=invite_required');
  }

  return (
    <>
      <PendingInviteHandler />
      <NpsSurveyHandler />
      {children}
    </>
  );
}
