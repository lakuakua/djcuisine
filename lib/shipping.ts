// Shipping fee structure for DJ Cuisine

export {
  PIRATE_SHIP_BOXES,
  aggregateCartForPirateShip,
  estimatePirateShipPacking,
  formatPirateShipGuideBullets,
  juiceGallonEquivalent,
  type CartShippingAggregate,
  type PirateShipPackingEstimate,
} from './shipping/pirateShipBoxes';

export const SHIPPING_CONFIG = {
  // Flat shipping rate for orders (NOT USED - actual rates from Easyship)
  FLAT_RATE: 1500, // $15.00 in cents (fallback only)
  
  // NO FREE SHIPPING - All orders must pay for shipping
  // Shipping calculated via Easyship API based on weight/destination
  FREE_SHIPPING_THRESHOLD: Infinity, // Disable free shipping completely
  
  // Local pickup fee
  LOCAL_DELIVERY_FEE: 0, // $0.00 in cents
  
  // Tax rate for Texas
  TAX_RATE: 0.0825, // 8.25% Texas sales tax
};

export interface ShippingCalculation {
  subtotal: number;
  tax: number;
  shippingFee: number;
  total: number;
  isFreeShipping: boolean;
}

/**
 * Calculate shipping fees, tax, and total for an order
 * @param subtotal Order subtotal in cents
 * @param isLocalDelivery Whether this is a local delivery (Richmond, TX area)
 * @returns Shipping calculation breakdown
 */
export function calculateOrderTotal(
  subtotal: number,
  isLocalDelivery: boolean = false
): ShippingCalculation {
  // Calculate tax
  const tax = Math.round(subtotal * SHIPPING_CONFIG.TAX_RATE);
  
  // Determine shipping fee
  let shippingFee = 0;
  let isFreeShipping = false;
  
  if (subtotal >= SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD) {
    // Free shipping for orders over threshold
    isFreeShipping = true;
    shippingFee = 0;
  } else if (isLocalDelivery) {
    // Local pickup - no shipping fee
    shippingFee = SHIPPING_CONFIG.LOCAL_DELIVERY_FEE;
  } else {
    // Standard flat rate shipping
    shippingFee = SHIPPING_CONFIG.FLAT_RATE;
  }
  
  // Calculate total
  const total = subtotal + tax + shippingFee;
  
  return {
    subtotal,
    tax,
    shippingFee,
    total,
    isFreeShipping,
  };
}

/**
 * Format cents to currency string
 * @param cents Amount in cents
 * @returns Formatted currency string
 */
export function formatShippingPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

/**
 * Get shipping message based on order total
 * @param subtotal Order subtotal in cents
 * @returns Shipping message for customer
 */
export function getShippingMessage(subtotal: number): string {
  // All orders require shipping payment - no free shipping threshold
  return 'Shipping costs calculated at checkout based on weight and destination.';
}
