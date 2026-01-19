'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { getProductsByCategory } from '@/lib/products';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

const categoryTitles: Record<string, string> = {
  'big-trays': 'Big Trays - Catering',
  'plates': 'Individual Plates',
  'juices': 'Fresh Juices',
};

const categoryDescriptions: Record<string, string> = {
  'big-trays': 'Perfect for parties and events. Each tray serves 8-10 people.',
  'plates': 'Delicious individual meals with your choice of meat, two sides, and cornbread.',
  'juices': 'Freshly made beverages to complement your meal. Gallon orders require a minimum of 2 gallons.',
};

export default function CategoryPage({ params }: CategoryPageProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const { slug } = params;
  const products = getProductsByCategory(slug);

  return (
    <div className="min-h-screen bg-black">
      <Header onCartOpen={() => setCartOpen(true)} />
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-gold-400 hover:text-gold-300 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>

        {/* Category Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gold-400 mb-4">
            {categoryTitles[slug] || 'Products'}
          </h1>
          <p className="text-gray-400 text-lg">
            {categoryDescriptions[slug]}
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No products found in this category.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}
