export type ProductCategory = 'chicken' | 'turkey' | 'beef' | 'lamb' | 'seafood' | 'whole-poultry' | 'sausage' | 'sides' | 'juices';

/** Sweetened vs unsweetened (Zobo & Pineapple Ginger). */
export type JuiceSweetness = 'sweetened' | 'unsweetened';

export interface ProductVariant {
  id: string;
  size: string; // "Big Tray", "Half Tray", "Plate", "1 Gallon", "Half Gallon", "16oz", "Whole", "5 Sticks"
  price: number; // in cents
  servings?: string; // "Serves 8-10", "Serves 4-5", "1 Person", etc.
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  image?: string;
  variants: ProductVariant[];
  // For products without variants (single size only)
  isSingleSize?: boolean;
  /** Second dropdown: sweetened vs unsweetened (mandatory when set). */
  requiresSweetnessChoice?: boolean;
}

export interface CartItem {
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
  /** Set when product.requiresSweetnessChoice (e.g. Zobo, Pineapple Ginger). */
  juiceSweetness?: JuiceSweetness;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface CheckoutSession {
  sessionId: string;
  url: string;
}
