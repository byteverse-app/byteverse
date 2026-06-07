import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatesDir = resolve(__dirname, 'templates');

export function buildEmailTemplate(contentFileName, title = 'ByteVerse') {
  const base = readFileSync(resolve(templatesDir, 'base.html'), 'utf8');
  const content = readFileSync(resolve(templatesDir, contentFileName), 'utf8');
  return base.replace('{{CONTENT}}', content).replace('{{TITLE}}', title);
}

export const TEMPLATE_MAP = {
  confirmation: {
    contentFile: 'confirmation.content.html',
    subjectKey: 'mailer_subjects_confirmation',
    contentKey: 'mailer_templates_confirmation_content',
    title: 'Confirm your ByteVerse account',
  },
  magicLink: {
    contentFile: 'magic-link.content.html',
    subjectKey: 'mailer_subjects_magic_link',
    contentKey: 'mailer_templates_magic_link_content',
    title: 'Your ByteVerse sign-in link',
  },
  recovery: {
    contentFile: 'recovery.content.html',
    subjectKey: 'mailer_subjects_recovery',
    contentKey: 'mailer_templates_recovery_content',
    title: 'Reset your ByteVerse password',
  },
  invite: {
    contentFile: 'invite.content.html',
    subjectKey: 'mailer_subjects_invite',
    contentKey: 'mailer_templates_invite_content',
    title: "You're invited to ByteVerse",
  },
  emailChange: {
    contentFile: 'email-change.content.html',
    subjectKey: 'mailer_subjects_email_change',
    contentKey: 'mailer_templates_email_change_content',
    title: 'Confirm your new ByteVerse email',
  },
  reauthentication: {
    contentFile: 'reauthentication.content.html',
    subjectKey: 'mailer_subjects_reauthentication',
    contentKey: 'mailer_templates_reauthentication_content',
    title: 'Your ByteVerse verification code',
  },
  passwordChanged: {
    contentFile: 'password-changed.content.html',
    subjectKey: 'mailer_subjects_password_changed_notification',
    contentKey: 'mailer_templates_password_changed_notification_content',
    title: 'Your ByteVerse password was changed',
    notificationEnabledKey: 'mailer_notifications_password_changed_enabled',
  },
  emailChanged: {
    contentFile: 'email-changed.content.html',
    subjectKey: 'mailer_subjects_email_changed_notification',
    contentKey: 'mailer_templates_email_changed_notification_content',
    title: 'Your ByteVerse email address was changed',
    notificationEnabledKey: 'mailer_notifications_email_changed_enabled',
  },
};

export const AUTH_EMAIL_SUBJECTS = {
  confirmation: 'Confirm your ByteVerse account',
  magicLink: 'Your ByteVerse sign-in link',
  recovery: 'Reset your ByteVerse password',
  invite: "You're invited to ByteVerse",
  emailChange: 'Confirm your new ByteVerse email',
  reauthentication: '{{ .Token }} is your ByteVerse verification code',
  passwordChanged: 'Your ByteVerse password was changed',
  emailChanged: 'Your ByteVerse email address was changed',
};

export function buildAuthEmailPatchPayload() {
  const payload = {};

  for (const [key, config] of Object.entries(TEMPLATE_MAP)) {
    const subject = AUTH_EMAIL_SUBJECTS[key];
    payload[config.subjectKey] = subject;
    payload[config.contentKey] = buildEmailTemplate(config.contentFile, config.title);
    if (config.notificationEnabledKey) {
      payload[config.notificationEnabledKey] = true;
    }
  }

  return payload;
}
