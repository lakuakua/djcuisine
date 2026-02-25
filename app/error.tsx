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
    <div className="min-h-screen bg-gradient-to-b from-black via-stone-950 to-black flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4 drop-shadow-2xl" />
        <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4">
          Something went wrong!
        </h2>
        <p className="text-orange-200 mb-8 text-lg">
          We encountered an error while loading this page. Please try again.
        </p>
        <button
          onClick={() => reset()}
          className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white px-8 py-3 rounded-lg font-bold transition-all duration-200 shadow-xl shadow-red-500/50 hover:shadow-2xl hover:scale-105"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
