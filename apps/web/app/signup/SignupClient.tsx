'use client';



import Link from 'next/link';

import { useSearchParams } from 'next/navigation';

import { Suspense, useCallback, useEffect, useState } from 'react';

import { AuthShell } from '@/components/auth/AuthShell';

import { EmailSentState, getEmailSentCopy } from '@/components/auth/EmailSentState';

import { GoogleIcon } from '@/components/auth/GoogleIcon';

import { LinkedInIcon } from '@/components/auth/LinkedInIcon';

import { createClient } from '@/lib/supabase/client';

import { setPendingInvite } from '@/components/auth/PendingInviteHandler';

import { validateSignupEmail } from '@/lib/validation/emailPolicy';



function SignupForm() {

  const [fullName, setFullName] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [inviteCode, setInviteCode] = useState('');

  const [inviteValid, setInviteValid] = useState<boolean | null>(null);

  const [inviteMessage, setInviteMessage] = useState<string | null>(null);

  const [inviteGatePassed, setInviteGatePassed] = useState(false);

  const [validatingInvite, setValidatingInvite] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState(false);

  const searchParams = useSearchParams();

  const supabase = createClient();



  const nextParam = searchParams?.get('next') ?? '/app';

  const refParam = searchParams?.get('ref') ?? '';

  const inviteRequiredError = searchParams?.get('error') === 'invite_required';



  const validateInvite = useCallback(async (code: string, advanceOnSuccess = false) => {

    if (!code.trim()) {

      setInviteValid(null);

      setInviteMessage(null);

      return false;

    }



    setValidatingInvite(true);

    try {

      const res = await fetch('/api/invite/validate', {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({ code: code.trim() }),

      });

      const data = await res.json();

      const isValid = data.valid === true;

      setInviteValid(isValid);

      if (isValid) {

        setInviteMessage(

          data.type === 'referral'

            ? 'Referral invite — join the ByteVerse creator community'

            : `Early access invite accepted — welcome aboard`

        );

        if (advanceOnSuccess) {

          setInviteGatePassed(true);

        }

      } else {

        setInviteMessage(data.error || 'Invalid invite code');

        setInviteGatePassed(false);

      }

      return isValid;

    } catch {

      setInviteValid(false);

      setInviteMessage('Could not validate invite code');

      setInviteGatePassed(false);

      return false;

    } finally {

      setValidatingInvite(false);

    }

  }, []);



  useEffect(() => {

    if (refParam) {

      setInviteCode(refParam);

      void validateInvite(refParam, true);

    }

  }, [refParam, validateInvite]);



  useEffect(() => {

    if (inviteRequiredError) {

      setError('An invite or referral code is required before you can access ByteVerse.');

    }

  }, [inviteRequiredError]);



  function getCallbackUrl() {

    return `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextParam)}`;

  }



  async function handleInviteContinue(e: React.FormEvent) {

    e.preventDefault();

    setError(null);

    const isValid = await validateInvite(inviteCode, true);

    if (!isValid) {

      setError('Enter a valid invite or referral code to continue.');

    }

  }



  function handleChangeInvite() {

    setInviteGatePassed(false);

    setInviteValid(null);

    setInviteMessage(null);

    setError(null);

  }



  async function handleSignup(e: React.FormEvent) {

    e.preventDefault();

    setLoading(true);

    setError(null);



    if (password.length < 8) {

      setError('Password must be at least 8 characters.');

      setLoading(false);

      return;

    }



    if (!inviteCode.trim() || !inviteValid) {

      setError('An invite or referral code is required.');

      setLoading(false);

      return;

    }



    const emailCheck = validateSignupEmail(email);

    if (!emailCheck.ok) {

      setError(emailCheck.message);

      setLoading(false);

      return;

    }



    const validationRes = await fetch('/api/invite/validate', {

      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({ code: inviteCode.trim() }),

    });

    const validation = await validationRes.json();

    if (!validation.valid) {

      setError(validation.error || 'Invalid invite code.');

      setLoading(false);

      return;

    }



    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({

      email,

      password,

      options: {

        data: {

          full_name: fullName,

          invite_code: validation.code ?? inviteCode.trim(),

        },

        emailRedirectTo: getCallbackUrl(),

      },

    });



    if (signUpError) {

      setError(signUpError.message);

      setLoading(false);

    } else {

      setPendingInvite(inviteCode.trim());

      if (signUpData.session) {

        await fetch('/api/invite/redeem', {

          method: 'POST',

          headers: { 'Content-Type': 'application/json' },

          body: JSON.stringify({ code: inviteCode.trim() }),

        }).catch(() => {});

      }

      setSuccess(true);

      setLoading(false);

    }

  }



  async function handleOAuthSignUp(provider: 'google' | 'linkedin_oidc') {

    const label = provider === 'google' ? 'Google' : 'LinkedIn';

    if (!inviteCode.trim() || !inviteValid) {

      setError(`Enter a valid invite or referral code before continuing with ${label}.`);

      return;

    }



    try {

      setLoading(true);

      setError(null);



      const prepareRes = await fetch('/api/invite/prepare-oauth', {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({ code: inviteCode.trim() }),

      });

      const prepareData = await prepareRes.json();

      if (!prepareRes.ok || !prepareData.ok) {

        setError(prepareData.error || 'Invalid invite code.');

        setLoading(false);

        return;

      }



      setPendingInvite(inviteCode.trim());



      const { error: oauthError } = await supabase.auth.signInWithOAuth({

        provider,

        options: { redirectTo: getCallbackUrl() },

      });



      if (oauthError) {

        setError(`Unable to sign up with ${label}. Please try again.`);

        setLoading(false);

      }

    } catch {

      setError('Something went wrong. Please try again.');

      setLoading(false);

    }

  }



  if (success) {

    const copy = getEmailSentCopy('signup');

    return (

      <AuthShell

        title={copy.title}

        subtitle={copy.subtitle}

        footer={

          <Link href="/login" className="text-accent1 hover:underline">

            Back to sign in

          </Link>

        }

      >

        <EmailSentState variant="signup" />

      </AuthShell>

    );

  }



  return (

    <AuthShell

      title="Create your account"

      subtitle={

        inviteGatePassed

          ? 'Complete your account details below.'

          : 'ByteVerse is in early access. Enter your invite or referral code to join.'

      }

      footer={

        <span className="text-text-secondary">

          Already have an account?{' '}

          <Link href="/login" className="text-accent1 hover:underline">

            Sign in

          </Link>

          {' · '}

          <Link href="/#waitlist" className="text-accent1 hover:underline">

            Join waitlist

          </Link>

        </span>

      }

    >

      {!inviteGatePassed ? (

        <form onSubmit={handleInviteContinue} className="space-y-4">

          <div>

            <label className="block text-xs text-text-secondary mb-1">Invite or referral code</label>

            <input

              type="text"

              required

              autoFocus

              value={inviteCode}

              onChange={(e) => {

                setInviteCode(e.target.value);

                setInviteValid(null);

                setInviteMessage(null);

              }}

              placeholder="Enter your invite or referral code"

              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-primary/50"

            />

            {inviteMessage && (

              <p className={`mt-1 text-xs ${inviteValid ? 'text-green-400' : 'text-red-400'}`}>

                {inviteMessage}

              </p>

            )}

          </div>



          {error && (

            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">

              {error}

            </p>

          )}



          <button

            type="submit"

            disabled={validatingInvite || !inviteCode.trim()}

            className="w-full neu-accent-button py-3 text-white font-semibold disabled:opacity-50"

          >

            {validatingInvite ? 'Checking code…' : 'Continue'}

          </button>

        </form>

      ) : (

        <>

          <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-green-400/20 bg-green-400/5 px-4 py-3">

            <div className="min-w-0">

              <p className="text-xs text-text-secondary">Invite code</p>

              <p className="text-sm text-green-400 truncate">{inviteCode}</p>

              {inviteMessage && <p className="text-xs text-text-secondary mt-0.5">{inviteMessage}</p>}

            </div>

            <button

              type="button"

              onClick={handleChangeInvite}

              className="text-xs text-accent1 hover:underline shrink-0"

            >

              Change

            </button>

          </div>



          <div className="space-y-3 mb-4">

            <button

              type="button"

              onClick={() => handleOAuthSignUp('google')}

              disabled={loading || inviteValid !== true}

              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition-colors disabled:opacity-50"

            >

              <GoogleIcon />

              Continue with Google

            </button>

            <button

              type="button"

              onClick={() => handleOAuthSignUp('linkedin_oidc')}

              disabled={loading || inviteValid !== true}

              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition-colors disabled:opacity-50"

            >

              <LinkedInIcon />

              Continue with LinkedIn

            </button>

          </div>



          <div className="relative my-6">

            <div className="absolute inset-0 flex items-center">

              <div className="w-full border-t border-white/10" />

            </div>

            <div className="relative flex justify-center text-xs uppercase tracking-wider">

              <span className="bg-[var(--surface-card,#1a1a2e)] px-3 text-text-secondary">or</span>

            </div>

          </div>



          {error && (

            <p className="mb-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">

              {error}

            </p>

          )}



          <form onSubmit={handleSignup} className="space-y-4">

            <input

              type="text"

              required

              value={fullName}

              onChange={(e) => setFullName(e.target.value)}

              placeholder="Full name"

              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-primary/50"

            />

            <input

              type="email"

              required

              value={email}

              onChange={(e) => setEmail(e.target.value)}

              placeholder="you@example.com"

              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-primary/50"

            />

            <input

              type="password"

              required

              minLength={8}

              value={password}

              onChange={(e) => setPassword(e.target.value)}

              placeholder="Password (min 8 characters)"

              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-primary/50"

            />

            <button

              type="submit"

              disabled={loading || inviteValid !== true}

              className="w-full neu-accent-button py-3 text-white font-semibold disabled:opacity-50"

            >

              {loading ? 'Creating account…' : 'Create account'}

            </button>

          </form>

        </>

      )}

    </AuthShell>

  );

}



export default function SignupClient() {

  return (

    <Suspense fallback={

      <AuthShell title="Create your account" subtitle="Loading…">

        <div className="h-32" />

      </AuthShell>

    }>

      <SignupForm />

    </Suspense>

  );

}

