import Link from 'next/link';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#f4f4f8]">
      <header className="apple-glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5 bg-[#0e0f1a]">
        <span className="font-syne font-bold text-sm tracking-tight text-white">ByteVerse Demo</span>
        <Link href="/" className="text-xs font-space uppercase tracking-widest text-brand-primary hover:text-white transition-colors">
          ← Home
        </Link>
      </header>
      <iframe
        src="/bytecourse/bytecourse.html"
        title="ByteVerse microlearning demo"
        className="w-full border-0 block"
        style={{ height: 'calc(100vh - 57px)' }}
      />
    </div>
  );
}
