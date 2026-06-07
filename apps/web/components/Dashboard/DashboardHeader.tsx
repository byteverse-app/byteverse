'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface DashboardHeaderProps {
  activeTab?: 'all' | 'my' | 'featured' | 'library';
}

export default function DashboardHeader({ activeTab = 'all' }: DashboardHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 neu-header">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-syne font-bold text-sm tracking-tight text-white hover:text-brand-primary transition-colors">
              ByteVerse
            </Link>

            <nav className="hidden md:flex items-center gap-1 apple-glass rounded-full p-1.5">
              <Link
                href="/app?tab=all"
                className={`neu-nav-pill ${activeTab === 'all' ? 'active' : ''}`}
              >
                All
              </Link>
              <Link
                href="/app?tab=my"
                className={`neu-nav-pill ${activeTab === 'my' ? 'active' : ''}`}
              >
                My Courses
              </Link>
              <Link
                href="/app?tab=featured"
                className={`neu-nav-pill ${activeTab === 'featured' ? 'active' : ''}`}
              >
                Featured
              </Link>
              <Link
                href="/app?tab=library"
                className={`neu-nav-pill ${activeTab === 'library' ? 'active' : ''}`}
              >
                Library
              </Link>
              <Link href="/analytics" className="neu-nav-pill">
                Analytics
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/app/settings" className="hidden md:block text-xs text-text-secondary hover:text-white">
              Settings
            </Link>
            {user && (
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-xs text-text-secondary truncate max-w-[160px]">
                  {user.email}
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-xs text-text-secondary hover:text-white transition-colors"
                >
                  Sign out
                </button>
              </div>
            )}

            <Link
              href="/app/new"
              className="neu-accent-button px-6 py-2.5 text-white font-syne font-bold text-xs uppercase tracking-wider flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create
            </Link>

            <button
              onClick={toggleTheme}
              className="neu-icon-button"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
