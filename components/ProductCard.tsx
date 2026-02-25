'use client';

import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants?.[0]?.id || '');
  const [isAdding, setIsAdding] = useState(false);

  // Ensure product has variants
  if (!product.variants || product.variants.length === 0) {
    console.error(`Product ${product.name} has no variants!`, product);
    return (
      <div className="bg-gray-900 border border-red-800 rounded-lg p-4">
        <p className="text-red-400">Error: Product configuration issue</p>
      </div>
    );
  }

  const selectedVariant = product.variants.find(v => v.id === selectedVariantId) || product.variants[0];

  const handleAddToCart = () => {
    console.log('Add to cart clicked', { product: product.name, selectedVariant });
    if (selectedVariant) {
      setIsAdding(true);
      addItem(product, selectedVariant);
      console.log('Item added successfully');
      
      // Visual feedback
      setTimeout(() => setIsAdding(false), 500);
    } else {
      console.error('No variant selected!');
    }
  };

  return (
    <div className="bg-gradient-to-br from-stone-950 to-black border-2 border-red-900/40 rounded-lg overflow-hidden hover:border-red-600 transition-all duration-300 shadow-lg hover:shadow-red-700/40 hover:shadow-xl hover:scale-105">
      {/* Product Image */}
      <div className="relative h-56 bg-black group/image">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover brightness-110 group-hover/image:brightness-115 transition-all duration-300"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-600">
            <span className="text-sm">No image available</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-5">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">{product.name}</h3>

        <p className="text-sm text-orange-200 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Size Selector (if product has multiple variants) */}
        {product.variants.length > 1 && !product.isSingleSize && (
          <div className="mb-4">
            <label className="text-xs text-orange-300 mb-1 block font-semibold">Select Size:</label>
            <select
              value={selectedVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
              className="w-full bg-stone-950 border-2 border-red-900/50 text-orange-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-500/50 transition-all"
            >
              {product.variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.size} - {formatPrice(variant.price)}
                  {variant.servings && ` (${variant.servings})`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Single size indicator */}
        {product.isSingleSize && (
          <div className="mb-3">
            <span className="text-xs bg-gradient-to-r from-red-900/60 to-orange-900/60 text-orange-200 px-2 py-1 rounded inline-block font-bold border border-red-800/50 shadow-sm">
              {selectedVariant?.size}
              {selectedVariant?.servings && ` • ${selectedVariant.servings}`}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            {formatPrice(selectedVariant?.price || 0)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`px-5 py-2 rounded-lg font-bold flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl ${
              isAdding 
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-orange-500/50 scale-105' 
                : 'bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white shadow-red-500/50 hover:scale-110'
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{isAdding ? 'Added!' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
