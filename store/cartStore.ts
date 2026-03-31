import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, ProductVariant, CartItem, JuiceSweetness } from '@/types';
import { isJuiceOneGallonSize } from '@/lib/utils';

function lineMatches(
  item: CartItem,
  productId: string,
  variantId: string,
  juiceSweetness?: JuiceSweetness
): boolean {
  if (item.product.id !== productId || item.selectedVariant.id !== variantId) {
    return false;
  }
  const a = item.juiceSweetness ?? undefined;
  const b = juiceSweetness ?? undefined;
  return a === b;
}

interface CartStore {
  items: CartItem[];
  addItem: (
    product: Product,
    selectedVariant: ProductVariant,
    quantity?: number,
    juiceSweetness?: JuiceSweetness
  ) => void;
  removeItem: (productId: string, variantId: string, juiceSweetness?: JuiceSweetness) => void;
  updateQuantity: (
    productId: string,
    variantId: string,
    quantity: number,
    juiceSweetness?: JuiceSweetness
  ) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getGallonCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, selectedVariant, quantity = 1, juiceSweetness) => {
        if (product.requiresSweetnessChoice && !juiceSweetness) {
          return;
        }

        set((state) => {
          const existingItem = state.items.find((item) =>
            lineMatches(item, product.id, selectedVariant.id, juiceSweetness)
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                lineMatches(item, product.id, selectedVariant.id, juiceSweetness)
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
          };

          return {
            items: [...state.items, newItem],
          };
        });
      },

      removeItem: (productId, variantId, juiceSweetness) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !lineMatches(item, productId, variantId, juiceSweetness)
          ),
        }));
      },

      updateQuantity: (productId, variantId, quantity, juiceSweetness) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId, juiceSweetness);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            lineMatches(item, productId, variantId, juiceSweetness)
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

      getGallonCount: () => {
        const state = get();
        return state.items
          .filter((item) => isJuiceOneGallonSize(item.selectedVariant.size))
          .reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'djcuisine_cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
