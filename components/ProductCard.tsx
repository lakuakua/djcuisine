'use client';

import { Product } from '@/types';
import { formatPrice, formatJuiceSize } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product);
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
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gold-300">{product.name}</h3>
          {product.juiceSize && (
            <span className="text-xs bg-gold-900/50 text-gold-400 px-2 py-1 rounded">
              {formatJuiceSize(product.juiceSize)}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gold-400">
            {formatPrice(product.price)}
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
