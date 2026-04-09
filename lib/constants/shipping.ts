/**
 * Shipping origin, pickup, and US regional UPS rates (DJ Cuisine — Houston / Katy, TX).
 * Per-SKU rates come from `djcuisine_products .xlsx` → {@link SKU_SHIPPING_RATES} in `lib/skuShippingData.ts`.
 * Do not use third-party carrier APIs (no Easyship) for checkout pricing.
 */

import { SKU_SHIPPING_RATES } from '@/lib/skuShippingData';

export { SKU_SHIPPING_RATES };

export const SHIPPING_ORIGIN = {
  companyName: 'DJ Cuisine',
  addressLine1: process.env.EASYSHIP_ORIGIN_ADDRESS_LINE1 ?? '1234 Commerce St',
  city: process.env.EASYSHIP_ORIGIN_CITY ?? 'Houston',
  state: 'TX',
  postalCode: process.env.EASYSHIP_ORIGIN_POSTAL_CODE ?? '77001',
  phone: process.env.EASYSHIP_ORIGIN_PHONE ?? '7135550100',
  contactEmail: process.env.EASYSHIP_ORIGIN_EMAIL,
};

export const LOCAL_PICKUP = {
  companyName: 'DJ Cuisine',
  addressLine1: '3043 Narrow Stream Way',
  city: 'Katy',
  state: 'TX',
  postalCode: '77493',
  phone: '7135550100',
};

export const HANDLING_FEE_USD = 5;

export const SHIPPING_SERVICES = {
  UPS_GROUND: 'UPS Ground',
  UPS_2ND_DAY: 'UPS 2nd Day Air',
} as const;

export const PERISHABLE_SHIPPING_NOTICE =
  'Perishable items require someone to receive the package on delivery day. Please plan to be available.';

/** Legacy: kept so `lib/easyship/*` imports do not break; checkout does not call Easyship. */
export const EASYSHIP_API_BASE_URL = 'https://public-api.easyship.com/2024-09';
export const EASYSHIP_SANDBOX_API_BASE_URL = 'https://public-api-sandbox.easyship.com/2024-09';

/** Legacy slug used by older packing helpers. */
export const EASYSHIP_ITEM_CATEGORY_SLUG = {
  DRY_FOOD_SUPPLEMENTS: 'dry_food_supplements',
} as const;

export const FALLBACK_SHIPPING_RATES = {
  ZONE_1: { ground: 25, secondDay: 55 },
  ZONE_2: { ground: 35, secondDay: 65 },
  ZONE_3: { ground: 45, secondDay: 75 },
  ZONE_4: { ground: 55, secondDay: 85 },
  ZONE_5: { ground: 65, secondDay: 95 },
  ZONE_6: { ground: 75, secondDay: 105 },
  ZONE_7: { ground: 85, secondDay: 115 },
} as const;

export const ZONE_NAMES = {
  NORTHEAST: 'northeast',
  MIDWEST: 'midwest',
  SOUTH: 'south',
  WEST: 'west',
} as const;

export type Zone = (typeof ZONE_NAMES)[keyof typeof ZONE_NAMES];

export const STATE_TO_ZONE: Record<string, Zone> = {
  MA: ZONE_NAMES.NORTHEAST,
  VT: ZONE_NAMES.NORTHEAST,
  NH: ZONE_NAMES.NORTHEAST,
  ME: ZONE_NAMES.NORTHEAST,
  CT: ZONE_NAMES.NORTHEAST,
  RI: ZONE_NAMES.NORTHEAST,
  NY: ZONE_NAMES.NORTHEAST,
  NJ: ZONE_NAMES.NORTHEAST,
  PA: ZONE_NAMES.NORTHEAST,
  MD: ZONE_NAMES.NORTHEAST,
  DE: ZONE_NAMES.NORTHEAST,
  DC: ZONE_NAMES.NORTHEAST,

  WI: ZONE_NAMES.MIDWEST,
  MI: ZONE_NAMES.MIDWEST,
  MN: ZONE_NAMES.MIDWEST,
  IA: ZONE_NAMES.MIDWEST,
  MO: ZONE_NAMES.MIDWEST,
  IL: ZONE_NAMES.MIDWEST,
  IN: ZONE_NAMES.MIDWEST,
  OH: ZONE_NAMES.MIDWEST,
  KY: ZONE_NAMES.MIDWEST,
  ND: ZONE_NAMES.MIDWEST,
  SD: ZONE_NAMES.MIDWEST,
  NE: ZONE_NAMES.MIDWEST,
  KS: ZONE_NAMES.MIDWEST,

  TX: ZONE_NAMES.SOUTH,
  LA: ZONE_NAMES.SOUTH,
  OK: ZONE_NAMES.SOUTH,
  AR: ZONE_NAMES.SOUTH,
  MS: ZONE_NAMES.SOUTH,
  AL: ZONE_NAMES.SOUTH,
  TN: ZONE_NAMES.SOUTH,
  FL: ZONE_NAMES.SOUTH,
  GA: ZONE_NAMES.SOUTH,
  SC: ZONE_NAMES.SOUTH,
  NC: ZONE_NAMES.SOUTH,
  VA: ZONE_NAMES.SOUTH,
  WV: ZONE_NAMES.SOUTH,

  CA: ZONE_NAMES.WEST,
  OR: ZONE_NAMES.WEST,
  WA: ZONE_NAMES.WEST,
  ID: ZONE_NAMES.WEST,
  MT: ZONE_NAMES.WEST,
  WY: ZONE_NAMES.WEST,
  CO: ZONE_NAMES.WEST,
  NM: ZONE_NAMES.WEST,
  AZ: ZONE_NAMES.WEST,
  UT: ZONE_NAMES.WEST,
  NV: ZONE_NAMES.WEST,
  AK: ZONE_NAMES.WEST,
  HI: ZONE_NAMES.WEST,
};

/**
 * Per-unit shipping in USD for a catalog Excel SKU and destination zone.
 * Returns null if the SKU has no row in the spreadsheet (pickup-only items).
 */
export function getShippingRate(
  sku: string | undefined,
  zone: Zone,
  service: 'ground' | 'secondDay'
): number | null {
  if (!sku) return null;
  const rates = SKU_SHIPPING_RATES[sku];
  if (!rates?.[zone]) return null;
  return service === 'ground' ? rates[zone].ground : rates[zone].secondDay;
}
