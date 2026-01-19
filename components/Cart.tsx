'use client';

import { useCartStore } from '@/store/cartStore';
import { formatPrice, formatJuiceSize } from '@/lib/utils';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const [mounted, setMounted] = useState(false);
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
  const hasGallonMinimumIssue = items.some(
    (item) => item.product.juiceSize === '1-gallon'
  ) && gallonCount < 2;

  const handleCheckout = async () => {
    if (hasGallonMinimumIssue) {
      alert('Gallon orders require a minimum of 2 gallons. Please add more gallons to your cart.');
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your checkout. Please try again.');
    }
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
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gold-800">
            <h2 className="text-2xl font-bold text-gold-400">Your Cart</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close cart"
            >
              <X className="h-6 w-6 text-gold-400" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingBag className="h-16 w-16 mb-4" />
                <p className="text-lg">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="bg-gray-800 border border-gold-900 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gold-300">
                          {item.product.name}
                        </h3>
                        {item.product.juiceSize && (
                          <p className="text-xs text-gray-400">
                            {formatJuiceSize(item.product.juiceSize)}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 bg-gray-900 rounded-lg p-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="p-1 hover:bg-gray-800 rounded"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4 text-gold-400" />
                        </button>
                        <span className="text-white w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="p-1 hover:bg-gray-800 rounded"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4 text-gold-400" />
                        </button>
                      </div>
                      <span className="text-gold-400 font-semibold">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Gallon Minimum Warning */}
                {hasGallonMinimumIssue && (
                  <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                    <p className="text-red-400 text-sm">
                      ⚠️ Gallon orders require a minimum of 2 gallons. You currently have {gallonCount} gallon(s).
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gold-800 p-6 bg-gray-900">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-white">Total</span>
                <span className="text-2xl font-bold text-gold-400">
                  {formatPrice(getTotal())}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={hasGallonMinimumIssue}
                className="w-full bg-gold-600 hover:bg-gold-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-black disabled:text-gray-500 py-4 rounded-lg font-bold text-lg transition-colors duration-200"
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
