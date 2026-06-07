'use client';

import Link from 'next/link';
import AnalyticsDashboard from '@/components/Analytics/AnalyticsDashboard';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 neu-header">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-syne font-bold text-sm tracking-tight hover:text-brand-primary transition-colors">
            ByteVerse
          </Link>
          <Link href="/app" className="text-xs font-space uppercase tracking-widest text-brand-primary hover:text-white transition-colors">
            ← Dashboard
          </Link>
        </div>
      </header>
      <AnalyticsDashboard />
    </div>
  );
}

