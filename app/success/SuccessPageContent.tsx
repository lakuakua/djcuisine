'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function SuccessPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black via-stone-950 to-black px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <CheckCircle className="mx-auto mb-4 h-24 w-24 text-orange-400 drop-shadow-2xl" />
          <h1 className="mb-4 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-5xl font-bold text-transparent drop-shadow-xl">
            Order Successful!
          </h1>
          <p className="mb-2 text-xl font-bold text-orange-200">Thank you for your order!</p>
          <p className="text-stone-300">
            We&apos;ve received your payment and will start preparing your delicious BBQ right away.
          </p>
        </div>

        {sessionId && (
          <div className="mb-8 rounded-lg border-2 border-red-900/40 bg-stone-950/80 p-6 shadow-xl">
            <p className="mb-2 text-sm font-semibold text-orange-200">Order Reference</p>
            <p className="break-all font-mono text-xs text-orange-400">{sessionId}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="rounded-lg border-2 border-red-900/40 bg-stone-950/80 p-6 shadow-xl">
            <h2 className="mb-3 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-xl font-bold text-transparent">
              What&apos;s Next?
            </h2>
            <ul className="space-y-2 text-left text-sm text-orange-200">
              <li>• You&apos;ll receive an email confirmation shortly</li>
              <li>• We&apos;ll notify you when your order is ready</li>
              <li>• For catering orders, we&apos;ll contact you to confirm details</li>
            </ul>
          </div>

          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-red-600 to-orange-500 px-8 py-4 text-xl font-bold text-white shadow-xl shadow-red-500/50 transition-all duration-200 hover:from-red-500 hover:to-orange-400 hover:shadow-2xl hover:scale-105"
          >
            Back to Home
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>

          <p className="text-sm text-gray-500">
            Questions? Call us at{' '}
            <a href="tel:+19792213114" className="text-gold-400 hover:text-gold-300">
              (979) 221-3114
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
