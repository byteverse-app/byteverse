import { buildEmailTemplate } from './buildTemplate.mjs';

export function renderAuthEmailPreview(
  type: 'confirmation' | 'magicLink' | 'recovery' | 'invite',
  confirmationUrl = 'https://byteverse.app/auth/callback?code=preview',
) {
  const files = {
    confirmation: 'confirmation.content.html',
    magicLink: 'magic-link.content.html',
    recovery: 'recovery.content.html',
    invite: 'invite.content.html',
  } as const;

  const titles = {
    confirmation: 'Confirm your ByteVerse account',
    magicLink: 'Your ByteVerse sign-in link',
    recovery: 'Reset your ByteVerse password',
    invite: "You're invited to ByteVerse",
  };

  return buildEmailTemplate(files[type], titles[type]).replace(
    /\{\{\s*\.ConfirmationURL\s*\}\}/g,
    confirmationUrl,
  );
}
