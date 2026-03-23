'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { getProductsByCategory } from '@/lib/products';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const categoryTitles: Record<string, string> = {
  chicken: 'Chicken',
  turkey: 'Turkey',
  beef: 'Beef',
  lamb: 'Lamb',
  seafood: 'Seafood',
  'whole-poultry': 'Whole Poultry',
  sausage: 'Sausage',
  sides: 'Sides Per Tray',
  juices: 'DJCUISINE Juices',
};

const categoryDescriptions: Record<string, string> = {
  chicken:
    'Chicken legs & thighs and wings. Choose your size: Big Tray (serves 8-10), Half Tray (serves 4-5), or individual Plate.',
  turkey:
    'Turkey wings and legs available in Big Tray (serves 8-10) or Half Tray (serves 4-5) sizes.',
  beef: 'Premium beef ribs, steak tips, and kabobs. Available in Big Tray, Half Tray, or Plate sizes.',
  lamb: 'Premium lamb cuts available in Big Tray (serves 8-10), Half Tray (serves 4-5), or individual Plate.',
  seafood: 'Fresh grilled shrimp. Choose Big Tray, Half Tray, or 5 Sticks for individual servings.',
  'whole-poultry':
    'Whole smoked and grilled poultry including rooster, guinea fowl, hen, and rabbit. Perfect for special occasions.',
  sausage: 'Premium grilled deer meat sausage. Each order includes 5 pieces.',
  sides:
    "Sides per tray in full or half sizes. Potatoes au gratin, corn on the cob, stir-fried seafood noodles, seafood mac & cheese, and Chef DJ's salad.",
  juices:
    'Zobo, Pineapple Ginger (gallon, half gallon, or 16 oz), and Watermelon, Ginger & Pineapple (gallon). Gallon orders require a minimum of 2 gallons.',
};

interface CategoryPageClientProps {
  slug: string;
}

export default function CategoryPageClient({ slug }: CategoryPageClientProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const products = getProductsByCategory(slug);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950">
      <Header onCartOpen={() => setCartOpen(true)} />
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-8 inline-flex items-center font-medium text-stone-400 transition-colors hover:text-gold-400"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {categoryTitles[slug] || 'Products'}
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-stone-400">
            {categoryDescriptions[slug] ??
              'Browse our products and add your favorites to the cart.'}
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-lg text-orange-300">No products found in this category.</p>
          </div>
        )}
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}
