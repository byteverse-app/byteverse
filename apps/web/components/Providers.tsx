'use client';

import { Suspense } from 'react';
import { CourseCreationProvider } from '@/contexts/CourseCreationContext';
import { CourseProvider } from '@/contexts/CourseContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import AppShell from '@/components/AppShell';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CourseProvider>
        <CourseCreationProvider>
          <AppShell>
            <Suspense fallback={null}>
              {children}
            </Suspense>
          </AppShell>
        </CourseCreationProvider>
      </CourseProvider>
    </ThemeProvider>
  );
}


