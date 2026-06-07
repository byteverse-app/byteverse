-- ByteVerse: unlimited platform AI for all access tiers.
-- Usage tables remain for analytics; generation is no longer blocked by quotas.

update public.access_tier_config
set
  daily_platform_limit = null,
  monthly_platform_limit = null,
  description = case tier
    when 'default' then 'Standard access — unlimited platform AI'
    when 'early_access' then 'Early access — unlimited platform AI'
    when 'founding' then 'Founding member — unlimited platform AI'
    else description
  end
where tier in ('default', 'early_access', 'founding');
