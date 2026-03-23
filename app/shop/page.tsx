'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { allProducts } from '@/lib/products';
import { ShoppingBag } from 'lucide-react';

export default function ShopPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'chicken', name: 'Chicken' },
    { id: 'turkey', name: 'Turkey' },
    { id: 'beef', name: 'Beef' },
    { id: 'lamb', name: 'Lamb' },
    { id: 'seafood', name: 'Seafood' },
    { id: 'whole-poultry', name: 'Whole Poultry' },
    { id: 'sausage', name: 'Sausage' },
    { id: 'sides', name: 'Sides' },
    { id: 'juices', name: 'Juices' },
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? allProducts 
    : allProducts.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950">
      <Header onCartOpen={() => setCartOpen(true)} />
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShoppingBag className="h-12 w-12 text-red-500" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-gold-400 bg-clip-text text-transparent">
              Shop All Products
            </h1>
          </div>
          <p className="mx-auto max-w-2xl text-lg text-stone-400">
            Browse catering trays, plates, sides, and juices—add to cart and checkout when you&apos;re ready.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-3 justify-center flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md shadow-red-900/30'
                    : 'border border-stone-700 bg-stone-900/80 text-stone-300 hover:border-gold-700/50 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <>
            <p className="text-center text-stone-400 mb-6">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-orange-300 text-lg">No products found in this category.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
