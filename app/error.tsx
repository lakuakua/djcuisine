'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gold-400 mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-400 mb-8">
          We encountered an error while loading this page. Please try again.
        </p>
        <button
          onClick={() => reset()}
          className="bg-gold-600 hover:bg-gold-500 text-black px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
