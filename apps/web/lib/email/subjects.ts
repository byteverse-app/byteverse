export const AUTH_EMAIL_SUBJECTS = {
  confirmation: 'Confirm your ByteVerse account',
  magicLink: 'Your ByteVerse sign-in link',
  recovery: 'Reset your ByteVerse password',
  invite: "You're invited to ByteVerse",
  emailChange: 'Confirm your new ByteVerse email',
  reauthentication: 'Your ByteVerse verification code',
  passwordChanged: 'Your ByteVerse password was changed',
  emailChanged: 'Your ByteVerse email address was changed',
} as const;

export type AuthEmailTemplateKey = keyof typeof AUTH_EMAIL_SUBJECTS;
