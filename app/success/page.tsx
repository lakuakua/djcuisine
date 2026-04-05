import { Suspense } from 'react';
import SuccessPageContent from './SuccessPageContent';

function SuccessLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black via-stone-950 to-black">
      <div className="text-center">
        <div className="mb-4 inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-red-500 border-r-transparent shadow-xl shadow-red-500/50" />
        <p className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-xl font-bold text-transparent">
          Loading...
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessLoading />}>
      <SuccessPageContent />
    </Suspense>
  );
}
