import type { CartItem } from '@/types';
import { getProductById } from '@/lib/products';
import { lineItemToExcelSku } from '@/lib/catalogSku';
import { getShippingRate, SHIPPING_SERVICES, STATE_TO_ZONE, type Zone } from '@/lib/constants/shipping';

function serviceToKind(serviceName: string): 'ground' | 'secondDay' | null {
  if (serviceName === SHIPPING_SERVICES.UPS_GROUND) return 'ground';
  if (serviceName === SHIPPING_SERVICES.UPS_2ND_DAY) return 'secondDay';
  return null;
}

export type RegionalQuoteResult =
  | {
      ok: true;
      zone: Zone;
      upsGroundUsd: number;
      ups2ndDayUsd: number;
    }
  | { ok: false; error: string };

/**
 * Sums per-line regional rates from the catalog spreadsheet (per unit × quantity).
 */
export function quoteRegionalShippingUsd(
  items: CartItem[],
  stateCode: string
): RegionalQuoteResult {
  const zone = STATE_TO_ZONE[stateCode.trim().toUpperCase().slice(0, 2)] ?? ('south' as Zone);

  let upsGroundUsd = 0;
  let ups2ndDayUsd = 0;

  for (const item of items) {
    const catalog = getProductById(item.product.id);
    if (catalog?.pickupOnly) continue;

    const sku = lineItemToExcelSku(item.product.id, item.selectedVariant.id);
    if (!sku) {
      return {
        ok: false,
        error: `No regional shipping rate for ${item.product.name} (${item.selectedVariant.size}).`,
      };
    }

    const g = getShippingRate(sku, zone, 'ground');
    const d = getShippingRate(sku, zone, 'secondDay');
    if (g == null || d == null) {
      return {
        ok: false,
        error: `Shipping is not available for ${item.product.name} to your region.`,
      };
    }

    const q = item.quantity;
    upsGroundUsd += g * q;
    ups2ndDayUsd += d * q;
  }

  return { ok: true, zone, upsGroundUsd, ups2ndDayUsd };
}

export function shippingUsdForService(
  items: CartItem[],
  stateCode: string,
  shippingService: string
): { ok: true; totalUsd: number } | { ok: false; error: string } {
  const q = quoteRegionalShippingUsd(items, stateCode);
  if (!q.ok) return q;
  const kind = serviceToKind(shippingService);
  if (!kind) return { ok: false, error: 'Invalid shipping service' };
  const totalUsd = kind === 'ground' ? q.upsGroundUsd : q.ups2ndDayUsd;
  return { ok: true, totalUsd };
}
