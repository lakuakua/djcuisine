/**
 * Shipping origin, Easyship endpoints, and fallback zones (DJ Cuisine — Houston, TX).
 */

export const SHIPPING_ORIGIN = {
  companyName: 'DJ Cuisine',
  /** Set in production via EASYSHIP_ORIGIN_ADDRESS_LINE1 */
  addressLine1: process.env.EASYSHIP_ORIGIN_ADDRESS_LINE1 ?? '1234 Commerce St',
  city: process.env.EASYSHIP_ORIGIN_CITY ?? 'Houston',
  state: 'TX',
  postalCode: process.env.EASYSHIP_ORIGIN_POSTAL_CODE ?? '77001',
  phone: process.env.EASYSHIP_ORIGIN_PHONE ?? '7135550100',
  contactEmail: process.env.EASYSHIP_ORIGIN_EMAIL,
};

export const HANDLING_FEE_USD = 5; // insulation / ice packs (matches typical perishable ops)

export const SHIPPING_SERVICES = {
  UPS_GROUND: 'UPS Ground',
  UPS_2ND_DAY: 'UPS 2nd Day Air',
} as const;

export const PERISHABLE_SHIPPING_NOTICE =
  'Perishable items require someone to receive the package on delivery day. Please plan to be available.';

/** Easyship 2024-09 public API (rates + shipments). */
export const EASYSHIP_API_BASE_URL = 'https://public-api.easyship.com/2024-09';
export const EASYSHIP_SANDBOX_API_BASE_URL = 'https://public-api-sandbox.easyship.com/2024-09';

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

export const STATE_TO_ZONE: Record<string, keyof typeof FALLBACK_SHIPPING_RATES> = {
  TX: 'ZONE_1',
  LA: 'ZONE_1',
  OK: 'ZONE_1',
  AR: 'ZONE_1',
  MS: 'ZONE_2',
  AL: 'ZONE_2',
  TN: 'ZONE_2',
  NM: 'ZONE_2',
  MO: 'ZONE_3',
  KS: 'ZONE_3',
  CO: 'ZONE_3',
  AZ: 'ZONE_3',
  IA: 'ZONE_3',
  NE: 'ZONE_3',
  IL: 'ZONE_4',
  IN: 'ZONE_4',
  KY: 'ZONE_4',
  OH: 'ZONE_4',
  WI: 'ZONE_4',
  MN: 'ZONE_4',
  SD: 'ZONE_4',
  ND: 'ZONE_4',
  WY: 'ZONE_4',
  UT: 'ZONE_4',
  NV: 'ZONE_4',
  FL: 'ZONE_4',
  GA: 'ZONE_4',
  SC: 'ZONE_4',
  NC: 'ZONE_4',
  CA: 'ZONE_5',
  OR: 'ZONE_5',
  WA: 'ZONE_5',
  ID: 'ZONE_5',
  MT: 'ZONE_5',
  VA: 'ZONE_5',
  WV: 'ZONE_5',
  MD: 'ZONE_5',
  DE: 'ZONE_5',
  PA: 'ZONE_5',
  NJ: 'ZONE_5',
  NY: 'ZONE_5',
  CT: 'ZONE_5',
  RI: 'ZONE_5',
  MA: 'ZONE_5',
  VT: 'ZONE_5',
  NH: 'ZONE_5',
  ME: 'ZONE_5',
  MI: 'ZONE_6',
  AK: 'ZONE_7',
  HI: 'ZONE_7',
};
