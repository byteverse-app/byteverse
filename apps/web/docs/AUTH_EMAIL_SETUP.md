# ByteVerse Auth Email Setup (Resend + Supabase)

This guide configures branded ByteVerse auth emails (signup confirm, magic link, password reset).

## 1. Resend SMTP (one-time)

1. Create a [Resend](https://resend.com) account and add domain **`byteverse.app`**
2. Add DNS records Resend provides:
   - SPF (TXT)
   - DKIM (CNAME or TXT)
   - Optional DMARC: `_dmarc.byteverse.app`
3. In Resend → **SMTP**, create credentials and copy the password
4. Add to `apps/web/.env.local` (never commit):

```env
RESEND_SMTP_PASSWORD=re_...
AUTH_SMTP_FROM_EMAIL=noreply@auth.byteverse.app
SUPABASE_ACCESS_TOKEN=sbp_...
```

## 2. Deploy email templates

From `apps/web`:

```bash
# Preview HTML locally
node scripts/preview-auth-email.mjs confirmation

# Deploy templates to Supabase (requires SUPABASE_ACCESS_TOKEN)
node scripts/configure-auth-email.mjs

# Deploy templates + SMTP settings
node scripts/configure-auth-email.mjs --smtp

# Verify remote config
node scripts/verify-auth-email.mjs
```

## 3. Site URL and redirects

```bash
node scripts/configure-auth-domain.mjs
```

Ensure these redirect URLs are allowed:

- `http://localhost:3000/auth/callback`
- `https://byteverse.app/auth/callback`
- `https://byteverse.app/auth/confirm` (Safe Links landing page)

## 4. Custom auth domain (recommended for production)

Hides `*.supabase.co` from confirmation links.

1. Supabase Dashboard → **Project Settings → Custom Domains**
2. Add **`auth.byteverse.app`** and follow DNS instructions
3. After activation, auth email links use `https://auth.byteverse.app/auth/v1/verify?...`

Requires Supabase Pro. Until configured, emails are still ByteVerse-branded in body/sender; links may show `supabase.co`.

## 5. Rate limits

After enabling custom SMTP, increase auth email rate limits in Supabase Dashboard → **Authentication → Rate Limits**.

## 6. Test checklist

Run automated local checks:

```bash
node scripts/test-auth-email-templates.mjs
node scripts/verify-auth-email.mjs   # requires SUPABASE_ACCESS_TOKEN after deploy
```

Manual inbox checks:

- [ ] Signup → confirm email shows ByteVerse branding, link works
- [ ] Login → magic link email + redirect
- [ ] Forgot password → reset email + `/auth/reset-password`
- [ ] From address shows **ByteVerse** (not Supabase)
- [ ] Gmail and Outlook: logo loads, not spam
