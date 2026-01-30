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
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id || '');

  const selectedVariant = product.variants.find(v => v.id === selectedVariantId) || product.variants[0];

  const handleAddToCart = () => {
    if (selectedVariant) {
      addItem(product, selectedVariant);
    }
  };

  return (
    <div className="bg-gray-900 border border-gold-800 rounded-lg overflow-hidden hover:border-gold-600 transition-all duration-300 shadow-lg hover:shadow-gold-900/50">
      {/* Product Image */}
      <div className="relative h-56 bg-gray-800">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-600">
            <span className="text-sm">No image available</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gold-300 mb-2">{product.name}</h3>

        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Size Selector (if product has multiple variants) */}
        {product.variants.length > 1 && !product.isSingleSize && (
          <div className="mb-4">
            <label className="text-xs text-gray-500 mb-1 block">Select Size:</label>
            <select
              value={selectedVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
              className="w-full bg-gray-800 border border-gold-800 text-gold-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gold-600"
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
            <span className="text-xs bg-gold-900/50 text-gold-400 px-2 py-1 rounded inline-block">
              {selectedVariant?.size}
              {selectedVariant?.servings && ` • ${selectedVariant.servings}`}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gold-400">
            {formatPrice(selectedVariant?.price || 0)}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-gold-600 hover:bg-gold-500 text-black px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors duration-200"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
