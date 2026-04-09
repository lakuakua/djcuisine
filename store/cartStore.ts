import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, ProductVariant, CartItem, JuiceSweetness, SpiceLevel } from '@/types';

/** Session-only key: cleared when the tab/window session ends (not localStorage). */
const CART_STORAGE_KEY = 'djcuisine_cart_session';

if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('djcuisine_cart');
    sessionStorage.removeItem('djcuisine_cart');
  } catch {
    /* ignore */
  }
}

function lineMatches(
  item: CartItem,
  productId: string,
  variantId: string,
  juiceSweetness?: JuiceSweetness,
  spiceLevel?: SpiceLevel
): boolean {
  if (item.product.id !== productId || item.selectedVariant.id !== variantId) {
    return false;
  }
  const a = item.juiceSweetness ?? undefined;
  const b = juiceSweetness ?? undefined;
  const s1 = item.spiceLevel ?? undefined;
  const s2 = spiceLevel ?? undefined;
  return a === b && s1 === s2;
}

interface CartStore {
  items: CartItem[];
  addItem: (
    product: Product,
    selectedVariant: ProductVariant,
    quantity?: number,
    juiceSweetness?: JuiceSweetness,
    spiceLevel?: SpiceLevel
  ) => void;
  removeItem: (
    productId: string,
    variantId: string,
    juiceSweetness?: JuiceSweetness,
    spiceLevel?: SpiceLevel
  ) => void;
  updateQuantity: (
    productId: string,
    variantId: string,
    quantity: number,
    juiceSweetness?: JuiceSweetness,
    spiceLevel?: SpiceLevel
  ) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, selectedVariant, quantity = 1, juiceSweetness, spiceLevel) => {
        if (product.requiresSweetnessChoice && !juiceSweetness) {
          return;
        }
        if (product.requiresSpiceLevel && !spiceLevel) {
          return;
        }

        set((state) => {
          const existingItem = state.items.find((item) =>
            lineMatches(item, product.id, selectedVariant.id, juiceSweetness, spiceLevel)
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                lineMatches(item, product.id, selectedVariant.id, juiceSweetness, spiceLevel)
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          const newItem: CartItem = {
            product,
            selectedVariant,
            quantity,
            ...(juiceSweetness ? { juiceSweetness } : {}),
            ...(spiceLevel ? { spiceLevel } : {}),
          };

          return {
            items: [...state.items, newItem],
          };
        });
      },

      removeItem: (productId, variantId, juiceSweetness, spiceLevel) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !lineMatches(item, productId, variantId, juiceSweetness, spiceLevel)
          ),
        }));
      },

      updateQuantity: (productId, variantId, quantity, juiceSweetness, spiceLevel) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId, juiceSweetness, spiceLevel);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            lineMatches(item, productId, variantId, juiceSweetness, spiceLevel)
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        const state = get();
        return state.items.reduce(
          (total, item) => total + item.selectedVariant.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: CART_STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
