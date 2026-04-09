/**
 * Regional shipping tests — totals must match `SKU_SHIPPING_RATES` in `lib/skuShippingData.ts`
 * (generated from `djcuisine_products .xlsx`). No live carrier APIs.
 */
import { describe, it, expect } from 'vitest';
import type { CartItem } from '@/types';
import { getProductById } from '@/lib/products';
import { SKU_SHIPPING_RATES } from '@/lib/skuShippingData';
import { STATE_TO_ZONE, SHIPPING_SERVICES, type Zone } from '@/lib/constants/shipping';
import { lineItemToExcelSku } from '@/lib/catalogSku';
import { quoteRegionalShippingUsd, shippingUsdForService } from '@/lib/shipping/regionalQuote';

/** Human-readable; same data as `djcuisine_products .xlsx` / Easyship_Template sheet. */
const PRICING_SOURCE =
  'djcuisine_products .xlsx (Easyship_Template) -> lib/skuShippingData.ts -> SKU_SHIPPING_RATES';

function cartLine(productId: string, variantId: string, quantity: number): CartItem {
  const product = getProductById(productId);
  if (!product) throw new Error(`Unknown product: ${productId}`);
  const selectedVariant = product.variants.find((v) => v.id === variantId);
  if (!selectedVariant) throw new Error(`Unknown variant ${variantId} for ${productId}`);
  return { product, selectedVariant, quantity };
}

/** Sum UPS Ground / 2nd Day in USD directly from the Excel-backed table (same source as production). */
function sumFromExcelSheet(
  stateCode: string,
  items: CartItem[],
  kind: 'ground' | 'secondDay'
): number {
  const zone = (STATE_TO_ZONE[stateCode] ?? 'south') as Zone;
  let total = 0;
  for (const item of items) {
    const catalog = getProductById(item.product.id);
    if (catalog?.pickupOnly) continue;
    const sku = lineItemToExcelSku(item.product.id, item.selectedVariant.id);
    if (!sku) throw new Error(`No Excel SKU for ${item.product.id} / ${item.selectedVariant.id}`);
    const row = SKU_SHIPPING_RATES[sku];
    if (!row) throw new Error(`Missing SKU row in Excel data: ${sku}`);
    const rate = row[zone][kind];
    total += rate * item.quantity;
  }
  return total;
}

/** Five US locations — one per region we model (Northeast, Midwest, South, West) + second South. */
const LOCATIONS = [
  { state: 'NY', label: 'New York, NY', zone: 'northeast' as const },
  { state: 'IL', label: 'Chicago, IL', zone: 'midwest' as const },
  { state: 'TX', label: 'Houston, TX', zone: 'south' as const },
  { state: 'CA', label: 'Los Angeles, CA', zone: 'west' as const },
  { state: 'FL', label: 'Miami, FL', zone: 'south' as const },
] as const;

describe(`Regional shipping (${PRICING_SOURCE})`, () => {
  it('prints confirmation that tests use the Excel-backed SKU matrix', () => {
    const skuCount = Object.keys(SKU_SHIPPING_RATES).length;
    expect(skuCount).toBeGreaterThan(10);
    // Visible in `npm run test` output
    console.log('\n--- Shipping test source ---');
    console.log(`  ${PRICING_SOURCE}`);
    console.log(`  Loaded ${skuCount} SKU regional rows (Northeast / Midwest / South / West).`);
    console.log('----------------------------\n');
  });

  it.each(LOCATIONS)(
    'single line item: 1× Chicken Leg & Thighs Big Tray — $state ($label) → zone $zone',
    ({ state, label, zone }) => {
      const items = [cartLine('chicken-leg-thighs', 'big', 1)];
      const expectedGround = sumFromExcelSheet(state, items, 'ground');
      const expected2Day = sumFromExcelSheet(state, items, 'secondDay');

      const q = quoteRegionalShippingUsd(items, state);
      expect(q.ok).toBe(true);
      if (!q.ok) throw new Error('unreachable');
      expect(q.zone).toBe(zone);
      expect(q.upsGroundUsd).toBe(expectedGround);
      expect(q.ups2ndDayUsd).toBe(expected2Day);

      const sku = 'CHICKEN-LEG-THIGHS-BIG';
      expect(SKU_SHIPPING_RATES[sku][zone].ground).toBe(expectedGround);
      expect(SKU_SHIPPING_RATES[sku][zone].secondDay).toBe(expected2Day);
    }
  );

  it('two different SKUs together (South / TX): 1× Big chicken leg-thighs + 1× Plate', () => {
    const state = 'TX';
    const items = [
      cartLine('chicken-leg-thighs', 'big', 1),
      cartLine('chicken-leg-thighs', 'plate', 1),
    ];
    const expectedGround = sumFromExcelSheet(state, items, 'ground');
    const expected2 = sumFromExcelSheet(state, items, 'secondDay');

    const q = quoteRegionalShippingUsd(items, state);
    expect(q.ok).toBe(true);
    if (!q.ok) throw new Error('unreachable');
    expect(q.zone).toBe('south');
    expect(q.upsGroundUsd).toBe(expectedGround);
    expect(q.ups2ndDayUsd).toBe(expected2);
    // South: 30 + 25 = 55 ground, 60 + 50 = 110 2nd (from Excel rows for those SKUs)
    expect(q.upsGroundUsd).toBe(55);
    expect(q.ups2ndDayUsd).toBe(110);
  });

  it('two different SKUs together (West / CA): 1× Beef Steak Tips Big + 1× Lamb Plate', () => {
    const state = 'CA';
    const items = [
      cartLine('beef-steak-tips', 'big', 1),
      cartLine('lamb', 'plate', 1),
    ];
    const expectedGround = sumFromExcelSheet(state, items, 'ground');
    const q = quoteRegionalShippingUsd(items, state);
    expect(q.ok).toBe(true);
    if (!q.ok) throw new Error('unreachable');
    expect(q.zone).toBe('west');
    expect(q.upsGroundUsd).toBe(expectedGround);
    // West: BEEF-STEAK-TIPS-BIG 60 + LAMB-PLATE 40 = 100
    expect(q.upsGroundUsd).toBe(100);
  });

  it('quantity multiplier (Northeast / NY): 2× Chicken Leg & Thighs Half Tray', () => {
    const state = 'NY';
    const items = [cartLine('chicken-leg-thighs', 'half', 2)];
    const q = quoteRegionalShippingUsd(items, state);
    expect(q.ok).toBe(true);
    if (!q.ok) throw new Error('unreachable');
    expect(q.zone).toBe('northeast');
    // NE half tray ground 30 × 2 = 60
    expect(q.upsGroundUsd).toBe(60);
    expect(q.ups2ndDayUsd).toBe(120);
  });

  it('shippingUsdForService matches Excel sum for UPS Ground vs 2nd Day (Midwest / IL)', () => {
    const state = 'IL';
    const items = [cartLine('chicken-wings', 'half', 1)];
    const g = shippingUsdForService(items, state, SHIPPING_SERVICES.UPS_GROUND);
    const d = shippingUsdForService(items, state, SHIPPING_SERVICES.UPS_2ND_DAY);
    expect(g.ok && d.ok).toBe(true);
    if (!g.ok || !d.ok) throw new Error('unreachable');
    expect(g.totalUsd).toBe(sumFromExcelSheet(state, items, 'ground'));
    expect(d.totalUsd).toBe(sumFromExcelSheet(state, items, 'secondDay'));
    expect(g.totalUsd).toBe(30);
    expect(d.totalUsd).toBe(60);
  });
});
