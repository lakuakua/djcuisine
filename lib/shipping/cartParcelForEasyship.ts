import type { CartItem } from '@/types';

export interface LinePhysicalSpec {
  sku: string;
  name: string;
  quantity: number;
  /** Per-unit weight in pounds */
  weightLbPerUnit: number;
  lengthIn: number;
  widthIn: number;
  heightIn: number;
  /** Unit price USD for customs / declared value */
  unitPriceUsd: number;
  containsLiquids: boolean;
}

/** Heuristic dimensions + weight per catalog line for Easyship rating. */
export function cartLineToPhysicalSpec(item: CartItem): LinePhysicalSpec {
  const { product, selectedVariant: v } = item;
  const size = v.size;
  const q = item.quantity;
  const baseName = `${product.name} (${size})`;
  const sku = `${product.id}-${v.id}`;

  let weightLbPerUnit = 5;
  let lengthIn = 12;
  let widthIn = 10;
  let heightIn = 6;
  let containsLiquids = false;

  if (product.category === 'juices') {
    containsLiquids = true;
    if (size.startsWith('1 Gallon')) {
      weightLbPerUnit = 8;
      lengthIn = 8;
      widthIn = 8;
      heightIn = 10;
    } else if (size.startsWith('Half Gallon')) {
      weightLbPerUnit = 4.5;
      lengthIn = 7;
      widthIn = 5;
      heightIn = 8;
    } else if (size.includes('32 oz')) {
      weightLbPerUnit = 2.2;
      lengthIn = 3;
      widthIn = 3;
      heightIn = 9;
    } else if (size.includes('16 oz')) {
      weightLbPerUnit = 1.1;
      lengthIn = 3;
      widthIn = 3;
      heightIn = 8;
    }
  } else if (size === 'Big Tray') {
    weightLbPerUnit = 18;
    lengthIn = 18;
    widthIn = 12;
    heightIn = 4;
  } else if (size === 'Full Tray') {
    weightLbPerUnit = 20;
    lengthIn = 20;
    widthIn = 12;
    heightIn = 4;
  } else if (size === 'Half Tray') {
    weightLbPerUnit = 9;
    lengthIn = 12;
    widthIn = 10;
    heightIn = 3;
  } else if (size === 'Plate') {
    weightLbPerUnit = 2.5;
    lengthIn = 9;
    widthIn = 6;
    heightIn = 2;
  } else if (size === 'Whole') {
    weightLbPerUnit = 5;
    lengthIn = 10;
    widthIn = 8;
    heightIn = 5;
  } else if (size === '5 Sticks' || size === '5 Pieces') {
    weightLbPerUnit = 0.8;
    lengthIn = 8;
    widthIn = 5;
    heightIn = 2;
  }

  const unitPriceUsd = v.price / 100;

  return {
    sku,
    name: baseName,
    quantity: q,
    weightLbPerUnit,
    lengthIn,
    widthIn,
    heightIn,
    unitPriceUsd,
    containsLiquids,
  };
}

export function totalCartWeightLb(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const spec = cartLineToPhysicalSpec(item);
    return sum + spec.weightLbPerUnit * spec.quantity;
  }, 0);
}
