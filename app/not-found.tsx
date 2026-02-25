import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-stone-950 to-black flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4 drop-shadow-2xl">404</h1>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-gold-400 bg-clip-text text-transparent mb-4">Page Not Found</h2>
        <p className="text-orange-200 mb-8 text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white px-8 py-4 rounded-lg font-bold transition-all duration-200 shadow-xl shadow-red-500/50 hover:shadow-2xl hover:scale-105"
        >
          <Home className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
