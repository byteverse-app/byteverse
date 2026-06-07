export type AccessTier = 'default' | 'early_access' | 'tester' | 'founding' | 'unlimited';
export type ProviderSource = 'platform' | 'byok' | 'local';
export type InviteCodeType = 'referral' | 'early_access' | 'tester';

export interface TierConfig {
  tier: AccessTier;
  daily_platform_limit: number | null;
  monthly_platform_limit: number | null;
  rolling_window_hours: number;
  requires_invite: boolean;
  description: string | null;
}

export interface UsageSnapshot {
  tier: AccessTier;
  dailyLimit: number | null;
  monthlyLimit: number | null;
  dailyUsed: number;
  monthlyUsed: number;
  bonusCredits: number;
  dailyRemaining: number | null;
  monthlyRemaining: number | null;
  windowStartedAt: string | null;
  windowResetsAt: string | null;
  isUnlimited: boolean;
}

export interface InviteValidation {
  valid: boolean;
  code?: string;
  type?: InviteCodeType;
  grantsTier?: AccessTier;
  bonusCredits?: number;
  referrerId?: string;
  error?: string;
}
