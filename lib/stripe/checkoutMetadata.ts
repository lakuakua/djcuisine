import { createHash } from 'crypto';
import type { CartItem } from '@/types';
import { estimatePirateShipPacking } from '@/lib/shipping/pirateShipBoxes';

/**
 * Stripe Checkout Session metadata: max 50 keys, 500 chars per value.
 * Used for support lookup; line items remain the source of truth in Stripe.
 */
export function buildCheckoutMetadata(
  items: CartItem[],
  shippingFields?: Record<string, string>
): Record<string, string> {
  const lines = items.map((item) => {
    const sweet =
      item.juiceSweetness === 'sweetened'
        ? 'S'
        : item.juiceSweetness === 'unsweetened'
          ? 'U'
          : '';
    return `${item.product.id}:${item.selectedVariant.id}:${item.quantity}${sweet ? ':' + sweet : ''}`;
  });
  const fingerprint = createHash('sha256').update(lines.sort().join('|')).digest('hex').slice(0, 32);

  const meta: Record<string, string> = {
    order_type: 'online',
    app: 'djcuisine',
    item_count: String(items.length),
    line_count: String(
      items.reduce((sum, i) => sum + i.quantity, 0)
    ),
    cart_fingerprint: fingerprint,
  };

  const joined = lines.join(';');
  if (joined.length <= 480) {
    meta.cart_lines = joined;
  } else {
    meta.cart_lines = joined.slice(0, 477) + '...';
  }

  const packing = estimatePirateShipPacking(items);
  const packingShort = [
    packing.large ? `L${packing.large}` : '',
    packing.medium ? `M${packing.medium}` : '',
    packing.small ? `S${packing.small}` : '',
  ]
    .filter(Boolean)
    .join('+');
  if (packingShort) {
    meta.packing_boxes = packingShort.slice(0, 500);
  }

  if (shippingFields) {
    for (const [k, v] of Object.entries(shippingFields)) {
      if (v) meta[k] = v.slice(0, 500);
    }
  }

  return meta;
}
