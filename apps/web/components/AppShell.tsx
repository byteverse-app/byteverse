'use client';

import CosmicBackground from '@/components/marketing/CosmicBackground';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-brand-primary/30">
      <CosmicBackground />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
