'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const clearCart = useCartStore((state) => state.clearCart);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Clear cart after successful payment
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-stone-950 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <CheckCircle className="h-24 w-24 text-orange-400 mx-auto mb-4 drop-shadow-2xl" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4 drop-shadow-xl">
            Order Successful!
          </h1>
          <p className="text-orange-200 text-xl mb-2 font-bold">
            Thank you for your order!
          </p>
          <p className="text-stone-300">
            We've received your payment and will start preparing your delicious BBQ right away.
          </p>
        </div>

        {sessionId && (
          <div className="bg-stone-950/80 border-2 border-red-900/40 rounded-lg p-6 mb-8 shadow-xl">
            <p className="text-sm text-orange-200 mb-2 font-semibold">Order Reference</p>
            <p className="text-orange-400 font-mono text-xs break-all">
              {sessionId}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-stone-950/80 border-2 border-red-900/40 rounded-lg p-6 shadow-xl">
            <h2 className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent font-bold text-xl mb-3">What's Next?</h2>
            <ul className="text-sm text-orange-200 space-y-2 text-left">
              <li>• You'll receive an email confirmation shortly</li>
              <li>• We'll notify you when your order is ready</li>
              <li>• For catering orders, we'll contact you to confirm details</li>
            </ul>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white px-8 py-4 rounded-lg font-bold text-xl transition-all duration-200 shadow-xl shadow-red-500/50 hover:shadow-2xl hover:scale-105"
          >
            Back to Home
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>

          <p className="text-sm text-gray-500">
            Questions? Call us at{' '}
            <a href="tel:+1234567890" className="text-gold-400 hover:text-gold-300">
              (123) 456-7890
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
