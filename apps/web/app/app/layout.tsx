import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PendingInviteHandler from '@/components/auth/PendingInviteHandler';
import NpsSurveyHandler from '@/components/feedback/NpsSurveyHandler';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/app');
  }

  return (
    <>
      <PendingInviteHandler />
      <NpsSurveyHandler />
      {children}
    </>
  );
}
