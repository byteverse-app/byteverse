import type { SupabaseClient, User } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { createClient } from './server';

type AuthSuccess = {
  user: User;
  supabase: SupabaseClient;
  response: null;
};

type AuthFailure = {
  user: null;
  supabase: null;
  response: NextResponse;
};

export type AuthResult = AuthSuccess | AuthFailure;

export async function requireAuth(): Promise<AuthResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      user: null,
      supabase: null,
      response: NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 }),
    };
  }

  return { user, supabase, response: null };
}
