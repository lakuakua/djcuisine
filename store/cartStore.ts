import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, ProductVariant, CartItem } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, selectedVariant: ProductVariant, quantity?: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getGallonCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, selectedVariant: ProductVariant, quantity = 1) => {
        set((state) => {
          // Check if this exact product + variant combination exists
          const existingItem = state.items.find(
            (item) => item.product.id === product.id && item.selectedVariant.id === selectedVariant.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id && item.selectedVariant.id === selectedVariant.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { product, selectedVariant, quantity }],
          };
        });
      },

      removeItem: (productId: string, variantId: string) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === productId && item.selectedVariant.id === variantId)
          ),
        }));
      },

      updateQuantity: (productId: string, variantId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId && item.selectedVariant.id === variantId
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
          .filter((item) => item.selectedVariant.size === '1 Gallon')
          .reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'djcuisine_cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
