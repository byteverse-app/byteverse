import Link from 'next/link';
import ByteVerseWordmark from '@/components/marketing/ByteVerseWordmark';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full neu-card p-8">
        <div className="mb-6">
          <ByteVerseWordmark size="nav" asLink className="hover:opacity-90 transition-opacity" />
        </div>
        <h1 className="text-2xl font-syne font-bold mb-2">{title}</h1>
        <p className="text-sm text-text-secondary font-space mb-6">{subtitle}</p>
        {children}
        {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-accent1 hover:underline">
            ← Home
          </Link>
        </p>
      </div>
    </div>
  );
}
