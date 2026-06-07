/**
 * Generates schema migration + batch SQL files for disposable domain blocklist.
 */
import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../../..');

const allDomains = require('disposable-email-domains');
const domains = [...new Set(allDomains.map((d) => d.toLowerCase().trim()))].sort();

const schemaSql = `-- Block disposable/temporary email domains at signup (before-user-created hook)

create table if not exists public.blocked_email_domains (
  domain text primary key
);

alter table public.blocked_email_domains enable row level security;

revoke all on public.blocked_email_domains from anon, authenticated, public;
grant select on public.blocked_email_domains to supabase_auth_admin;

create or replace function public.hook_block_disposable_email(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  email text;
  email_domain text;
  provider text;
  is_blocked int;
begin
  email := lower(trim(coalesce(event->'user'->>'email', '')));
  provider := coalesce(event->'user'->'app_metadata'->>'provider', '');

  if provider in ('google', 'apple', 'github', 'azure', 'facebook') then
    return '{}'::jsonb;
  end if;

  if email = '' or position('@' in email) = 0 then
    return '{}'::jsonb;
  end if;

  email_domain := split_part(email, '@', 2);

  select count(*) into is_blocked
  from public.blocked_email_domains b
  where b.domain = email_domain;

  if is_blocked > 0 then
    return jsonb_build_object(
      'error', jsonb_build_object(
        'message', 'Temporary email addresses are not allowed.',
        'http_code', 403
      )
    );
  end if;

  return '{}'::jsonb;
end;
$$;

revoke execute on function public.hook_block_disposable_email(jsonb) from public, anon, authenticated;
grant execute on function public.hook_block_disposable_email(jsonb) to supabase_auth_admin;
`;

writeFileSync(resolve(root, 'supabase/migrations/006_block_disposable_emails.sql'), schemaSql);

const batchDir = resolve(root, 'supabase/seeds/disposable_domains');
mkdirSync(batchDir, { recursive: true });

const batchSize = 10000;
let batchNum = 0;
for (let i = 0; i < domains.length; i += batchSize) {
  batchNum++;
  const batch = domains.slice(i, i + batchSize);
  const arrayLiteral = batch.map((d) => `'${d.replace(/'/g, "''")}'`).join(',');
  const sql = `insert into public.blocked_email_domains (domain)
select unnest(array[${arrayLiteral}]::text[])
on conflict (domain) do nothing;`;
  writeFileSync(resolve(batchDir, `batch_${String(batchNum).padStart(3, '0')}.sql`), sql);
}

console.log(`Schema migration written. ${domains.length} domains in ${batchNum} batch files.`);
