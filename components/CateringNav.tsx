'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Meet the Chef', href: '#chef' },
  { name: 'Catering Menu', href: '#menu' },
  { name: 'Contact', href: '#contact' },
];

export default function CateringNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-red-900/30">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/catering" className="text-lg font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            DJCUISINE Catering
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-orange-200 hover:text-red-400 transition-colors text-sm font-semibold"
              >
                {item.name}
              </a>
            ))}
            <Link
              href="/"
              className="text-stone-400 hover:text-orange-300 transition-colors text-sm font-semibold"
            >
              Shop
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-orange-300"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-red-900/30 space-y-3">
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block text-orange-200 hover:text-red-400 py-2 font-semibold"
              >
                {item.name}
              </a>
            ))}
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block text-stone-400 hover:text-orange-300 py-2 font-semibold"
            >
              Shop
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
