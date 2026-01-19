export type ProductCategory = 'big-trays' | 'plates' | 'juices';

export type JuiceSize = '1-gallon' | 'half-gallon' | '16oz';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image?: string;
  // For juice products
  juiceSize?: JuiceSize;
  // For tray products
  isBigTray?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface CheckoutSession {
  sessionId: string;
  url: string;
}
