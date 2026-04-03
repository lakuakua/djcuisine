'use client';

import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, isJuiceOneGallonSize } from '@/lib/utils';
import { SHIPPING_CONFIG } from '@/lib/shipping';
import { getProductById } from '@/lib/products';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotal = useCartStore((state) => state.getTotal);
  const getGallonCount = useCartStore((state) => state.getGallonCount);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const gallonCount = getGallonCount();
  const hasGallonMinimumIssue =
    items.some((item) => isJuiceOneGallonSize(item.selectedVariant.size)) &&
    gallonCount < 2;

  // Check if cart contains ANY shippable products
  const hasShippableProducts = items.some((item) => {
    const product = getProductById(item.product.id);
    return !product?.pickupOnly;
  });

  // Calculate order totals (tax only; shipping calculated at checkout)
  const subtotal = getTotal();
  const taxCents = Math.round(subtotal * SHIPPING_CONFIG.TAX_RATE);
  const totalCents = subtotal + taxCents;

  const handleCheckout = (mode: 'ship' | 'pickup') => {
    if (hasGallonMinimumIssue) {
      alert('Gallon orders require a minimum of 2 gallons. Please add more gallons to your cart.');
      return;
    }

    if (items.length === 0) {
      alert('Your cart is empty. Please add items before checkout.');
      return;
    }

    setIsCheckingOut(true);
    onClose();
    router.push(mode === 'pickup' ? '/pickup' : '/checkout');
    setIsCheckingOut(false);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Cart Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-gradient-to-b from-stone-950 via-black to-stone-950 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-red-900/30 bg-gradient-to-r from-stone-950 to-black shadow-md">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Your Cart</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-900/30 rounded-lg transition-colors"
              aria-label="Close cart"
            >
              <X className="h-6 w-6 text-orange-300" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-orange-400">
                <ShoppingBag className="h-16 w-16 mb-4" />
                <p className="text-lg font-semibold">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedVariant.id}-${item.juiceSweetness ?? ''}-${item.spiceLevel ?? ''}`}
                    className="bg-gradient-to-br from-stone-900 to-black border border-red-900/40 rounded-lg p-4 shadow-md hover:shadow-red-700/30 transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-orange-300">
                          {item.selectedVariant.size}
                          {item.selectedVariant.servings && ` • ${item.selectedVariant.servings}`}
                        </p>
                        {item.juiceSweetness && (
                          <p className="text-xs text-stone-400 mt-0.5 capitalize">
                            Flavor: {item.juiceSweetness}
                          </p>
                        )}
                        {item.spiceLevel && (
                          <p className="text-xs text-stone-400 mt-0.5 capitalize">
                            Spice: {item.spiceLevel}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          removeItem(
                            item.product.id,
                            item.selectedVariant.id,
                            item.juiceSweetness,
                            item.spiceLevel
                          )
                        }
                        className="text-red-400 hover:text-red-300 text-sm font-semibold"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 bg-stone-950 rounded-lg p-1 border border-red-900/30">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedVariant.id,
                              item.quantity - 1,
                              item.juiceSweetness,
                              item.spiceLevel
                            )
                          }
                          className="p-1 hover:bg-red-900/30 rounded transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4 text-orange-400" />
                        </button>
                        <span className="text-orange-200 w-8 text-center font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedVariant.id,
                              item.quantity + 1,
                              item.juiceSweetness,
                              item.spiceLevel
                            )
                          }
                          className="p-1 hover:bg-red-900/30 rounded transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4 text-orange-400" />
                        </button>
                      </div>
                      <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent font-bold text-lg">
                        {formatPrice(item.selectedVariant.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Gallon Minimum Warning */}
                {hasGallonMinimumIssue && (
                  <div className="bg-red-900/40 border-2 border-red-600 rounded-lg p-4 shadow-lg">
                    <p className="text-red-200 text-sm font-bold">
                      ⚠️ Gallon orders require a minimum of 2 gallons. You currently have {gallonCount} gallon(s).
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-red-900/30 p-6 bg-gradient-to-b from-stone-950 to-black shadow-inner shadow-black/50">
              {/* Price Breakdown */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-orange-200">Subtotal</span>
                  <span className="text-orange-100 font-bold">{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-orange-200">Tax (8.25%)</span>
                  <span className="text-orange-100 font-bold">{formatPrice(taxCents)}</span>
                </div>

                {/* Pickup-only notice */}
                {!hasShippableProducts && (
                  <div className="text-xs text-center py-2 px-3 bg-green-900/30 border border-green-700/50 rounded shadow-md">
                    <p className="text-green-300 font-semibold">✓ Local Pickup Only - No shipping available for these items</p>
                  </div>
                )}
                
                <div className="border-t border-red-900/50 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-orange-200">Total</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                      {formatPrice(totalCents)}
                    </span>
                  </div>
                </div>
              </div>
              
              {hasShippableProducts ? (
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => handleCheckout('ship')}
                    disabled={hasGallonMinimumIssue || isCheckingOut}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 disabled:from-gray-800 disabled:to-gray-900 disabled:cursor-not-allowed text-white disabled:text-gray-500 py-4 rounded-lg font-bold text-xl transition-all duration-200 shadow-xl shadow-red-500/50 hover:shadow-2xl hover:scale-105 disabled:shadow-none disabled:scale-100"
                  >
                    {isCheckingOut ? 'Processing...' : 'Checkout (Shipping)'}
                  </button>
                  <button
                    onClick={() => handleCheckout('pickup')}
                    disabled={hasGallonMinimumIssue || isCheckingOut}
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 disabled:from-gray-800 disabled:to-gray-900 disabled:cursor-not-allowed text-white disabled:text-gray-500 py-4 rounded-lg font-bold text-xl transition-all duration-200 shadow-xl shadow-emerald-500/40 hover:shadow-2xl hover:scale-105 disabled:shadow-none disabled:scale-100"
                  >
                    {isCheckingOut ? 'Processing...' : 'Checkout (Pickup)'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleCheckout('pickup')}
                  disabled={hasGallonMinimumIssue || isCheckingOut}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 disabled:from-gray-800 disabled:to-gray-900 disabled:cursor-not-allowed text-white disabled:text-gray-500 py-4 rounded-lg font-bold text-xl transition-all duration-200 shadow-xl shadow-emerald-500/40 hover:shadow-2xl hover:scale-105 disabled:shadow-none disabled:scale-100"
                >
                  {isCheckingOut ? 'Processing...' : 'Checkout (Pickup)'}
                </button>
              )}
              
              {/* Order Notice */}
              <p className="text-xs text-center text-orange-300 font-semibold mt-3">
                ⏰ 24-hour notice required for all orders
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
