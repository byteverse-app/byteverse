import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleSupabaseClient } from '@/lib/supabase/server';
import { internalError } from '@/lib/api/errorResponse';

export async function POST(request: NextRequest) {
  try {
    const { email, name, useCase, role, teamSize } = await request.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const supabase = createServiceRoleSupabaseClient();
    const { error } = await supabase.from('waitlist_entries').upsert(
      {
        email: email.trim().toLowerCase(),
        name: name?.trim() || null,
        use_case: useCase?.trim() || null,
        role: role?.trim() || null,
        team_size: teamSize?.trim() || null,
        status: 'pending',
      },
      { onConflict: 'email' }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: 'You are on the waitlist. We will send an invite soon.' });
  } catch (error) {
    return internalError(error, 'waitlist');
  }
}
