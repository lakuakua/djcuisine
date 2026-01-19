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
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gold-400 mb-4">
            Order Successful!
          </h1>
          <p className="text-gray-300 text-lg mb-2">
            Thank you for your order!
          </p>
          <p className="text-gray-400">
            We've received your payment and will start preparing your delicious BBQ right away.
          </p>
        </div>

        {sessionId && (
          <div className="bg-gray-900 border border-gold-800 rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-400 mb-2">Order Reference</p>
            <p className="text-gold-300 font-mono text-xs break-all">
              {sessionId}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-gray-900 border border-gold-800 rounded-lg p-4">
            <h2 className="text-gold-400 font-semibold mb-2">What's Next?</h2>
            <ul className="text-sm text-gray-300 space-y-2 text-left">
              <li>• You'll receive an email confirmation shortly</li>
              <li>• We'll notify you when your order is ready</li>
              <li>• For catering orders, we'll contact you to confirm details</li>
            </ul>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center w-full bg-gold-600 hover:bg-gold-500 text-black px-8 py-4 rounded-lg font-bold transition-colors duration-200"
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
