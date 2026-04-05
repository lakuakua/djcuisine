'use client';

import { JuiceSweetness, Product, SpiceLevel } from '@/types';
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
  const [juiceSweetness, setJuiceSweetness] = useState<JuiceSweetness | ''>('');
  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel | ''>('');
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
  const isJuice = product.category === 'juices';

  const handleAddToCart = () => {
    if (!selectedVariant) {
      console.error('No variant selected!');
      return;
    }
    if (product.requiresSweetnessChoice && !juiceSweetness) {
      return;
    }
    if (product.requiresSpiceLevel && !spiceLevel) {
      return;
    }
    setIsAdding(true);
    const sweetness =
      product.requiresSweetnessChoice && juiceSweetness
        ? juiceSweetness
        : undefined;
    const spice =
      product.requiresSpiceLevel && spiceLevel ? spiceLevel : undefined;
    addItem(product, selectedVariant, 1, sweetness, spice);
    setTimeout(() => setIsAdding(false), 500);
  };

  const needsFlavor = Boolean(product.requiresSweetnessChoice);
  const needsSpice = Boolean(product.requiresSpiceLevel);
  const canAdd =
    selectedVariant &&
    (!needsFlavor || (juiceSweetness === 'sweetened' || juiceSweetness === 'unsweetened')) &&
    (!needsSpice || (spiceLevel === 'mild' || spiceLevel === 'spicy'));

  return (
    <div className="overflow-hidden rounded-xl border border-red-900/35 bg-gradient-to-br from-stone-950 to-black shadow-lg shadow-black/30 ring-1 ring-white/5 transition-all duration-300 hover:border-gold-600/40 hover:shadow-xl hover:shadow-gold-900/10 hover:ring-gold-500/15">
      {/* Juices: white mat + object-contain for label art. All other categories: cover crop. */}
      {isJuice ? (
        <div className="relative h-60 w-full rounded-t-xl bg-white sm:h-64 group/image">
          {product.image ? (
            <div className="absolute inset-3">
              <div className="relative h-full w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  unoptimized
                  className="object-contain object-center transition-transform duration-500 group-hover/image:scale-[1.02]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-600">
              <span className="text-sm">No image available</span>
            </div>
          )}
        </div>
      ) : (
        <div className="relative h-56 bg-black group/image">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover brightness-110 transition-all duration-300 group-hover/image:brightness-115"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-600">
              <span className="text-sm">No image available</span>
            </div>
          )}
        </div>
      )}

      {/* Product Details */}
      <div className="p-5">
        <h3 className="mb-2 text-lg font-semibold tracking-tight text-white">
          {product.name}
        </h3>

        <p className="mb-4 text-sm leading-relaxed text-stone-300">
          {product.description}
        </p>

        {/* Size Selector (if product has multiple variants) */}
        {product.variants.length > 1 && !product.isSingleSize && (
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-semibold text-stone-400">Select size</label>
            <select
              value={selectedVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
              className="w-full rounded-lg border border-red-900/40 bg-stone-950 px-3 py-2.5 text-sm text-stone-200 transition-all focus:border-gold-600/60 focus:outline-none focus:ring-2 focus:ring-gold-500/25"
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

        {needsFlavor && (
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-semibold text-stone-400">
              Flavor <span className="text-red-400">*</span>
            </label>
            <select
              value={juiceSweetness}
              onChange={(e) =>
                setJuiceSweetness((e.target.value as JuiceSweetness | '') || '')
              }
              required
              aria-required="true"
              className="w-full rounded-lg border border-red-900/40 bg-stone-950 px-3 py-2.5 text-sm text-stone-200 transition-all focus:border-gold-600/60 focus:outline-none focus:ring-2 focus:ring-gold-500/25"
            >
              <option value="">Choose sweetened or unsweetened</option>
              <option value="unsweetened">Unsweetened</option>
              <option value="sweetened">Sweetened</option>
            </select>
          </div>
        )}

        {needsSpice && (
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-semibold text-stone-400">
              Spice level <span className="text-red-400">*</span>
            </label>
            <select
              value={spiceLevel}
              onChange={(e) => setSpiceLevel((e.target.value as SpiceLevel | '') || '')}
              required
              aria-required="true"
              className="w-full rounded-lg border border-red-900/40 bg-stone-950 px-3 py-2.5 text-sm text-stone-200 transition-all focus:border-gold-600/60 focus:outline-none focus:ring-2 focus:ring-gold-500/25"
            >
              <option value="">Choose mild or spicy</option>
              <option value="mild">Mild</option>
              <option value="spicy">Spicy</option>
            </select>
          </div>
        )}

        {/* Single size indicator */}
        {product.isSingleSize && (
          <div className="mb-3">
            <span className="inline-block rounded-md border border-red-900/40 bg-stone-900/80 px-2 py-1 text-xs font-semibold text-stone-200">
              {selectedVariant?.size}
              {selectedVariant?.servings && ` • ${selectedVariant.servings}`}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold tabular-nums text-white">
            {formatPrice(selectedVariant?.price || 0)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={isAdding || !canAdd}
            className={`flex items-center space-x-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-all duration-200 ${
              isAdding
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md'
                : 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md hover:brightness-110 active:scale-[0.98]'
            } disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{isAdding ? 'Added!' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
