'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      router.push('/admin/orders');
      router.refresh();
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-red-900/40 bg-stone-900/80 p-8 shadow-xl">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">
          DJ Cuisine Admin
        </h1>
        <p className="text-stone-400 text-sm mb-6">Enter the admin password to view orders.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-stone-600 bg-stone-950 px-4 py-3 text-white placeholder-stone-500 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
              placeholder="Password"
              required
            />
          </div>
          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-red-600 to-orange-500 px-4 py-3 font-bold text-white hover:from-red-500 hover:to-orange-400 disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-stone-500">
          <Link href="/" className="text-gold-400 hover:text-gold-300">
            ← Back to store
          </Link>
        </p>
      </div>
    </div>
  );
}
