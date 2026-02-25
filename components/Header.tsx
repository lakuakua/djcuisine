'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface HeaderProps {
  onCartOpen: () => void;
}

export default function Header({ onCartOpen }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Our Menu', href: '/#categories' },
    { name: 'Shop', href: '/shop' },
    { name: 'Contact', href: '/contact' },
    { name: 'About Us', href: '/about' },
  ];

  return (
    <header className="bg-gradient-to-r from-black via-stone-950 to-black border-b border-red-900/30 shadow-lg sticky top-0 z-50 backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="relative h-16 w-40 sm:h-20 sm:w-48">
                <Image
                  src="/images/LogoGIF.png"
                  alt="DJCUISINE Logo"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-orange-200 hover:text-red-400 transition-colors text-sm font-bold"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Cart Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onCartOpen}
              className="relative p-2 text-orange-300 hover:text-red-400 transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-orange-300 hover:text-red-400"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-red-900/30 bg-gradient-to-b from-black to-stone-950">
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-orange-200 hover:text-red-400 transition-colors text-base font-semibold py-2"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
