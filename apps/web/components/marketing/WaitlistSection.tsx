'use client';

import { useState } from 'react';

export default function WaitlistSection() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [useCase, setUseCase] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, useCase }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        setMessage(data.message);
        setEmail('');
      }
    } catch {
      setError('Could not join waitlist');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="waitlist" className="py-24 px-6 max-w-2xl mx-auto">
      <p className="font-space text-[10px] font-bold tracking-[0.5em] text-brand-primary uppercase mb-4 text-center">
        Early access
      </p>
      <h2 className="font-syne text-3xl md:text-4xl font-extrabold text-center mb-4">
        Join the waitlist
      </h2>
      <p className="text-center text-gray-400 text-sm mb-8">
        We&apos;re onboarding educators in small batches to learn from real usage and ship improvements fast.
        Join the waitlist and we&apos;ll send you an access code.
      </p>
      <form onSubmit={handleSubmit} className="apple-glass p-6 rounded-2xl border border-white/5 space-y-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30"
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30"
        />
        <input
          type="text"
          value={useCase}
          onChange={(e) => setUseCase(e.target.value)}
          placeholder="How will you use ByteVerse? (optional)"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {message && <p className="text-green-400 text-sm">{message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-brand-primary rounded-full font-syne font-bold text-sm hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Joining…' : 'Join waitlist'}
        </button>
      </form>
      <p className="text-center text-xs text-gray-500 mt-4">
        Have a code?{' '}
        <a href="/signup" className="text-brand-primary hover:underline">
          Sign up here
        </a>
      </p>
    </section>
  );
}
