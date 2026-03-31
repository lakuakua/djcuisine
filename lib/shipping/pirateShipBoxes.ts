import type { CartItem } from '@/types';

/** USPS / Pirate Ship style boxes used for fulfillment estimates. */
export const PIRATE_SHIP_BOXES = [
  {
    id: 'small' as const,
    label: 'Small',
    dimensionsInches: { length: 16, width: 10, depth: 12 },
    /** Ops guide: 1 gal OR up to eight 16 oz bottles OR ≤ half-pan meat (no big pans). */
    capacitySummary:
      'Up to 1 gallon of drinks, or up to eight 16 oz bottles, or up to one half-pan of meat (plates / smaller). Big trays do not fit.',
  },
  {
    id: 'medium' as const,
    label: 'Medium',
    dimensionsInches: { length: 20, width: 16, depth: 15 },
    capacitySummary: 'Up to 2 gallons of drinks and/or up to two big pans (full-size trays) of meat.',
  },
  {
    id: 'large' as const,
    label: 'Large',
    dimensionsInches: { length: 24, width: 20, depth: 20 },
    capacitySummary:
      'Up to 4 gallons of drinks and/or up to four big pans (full-size trays) of meat.',
  },
];

export interface CartShippingAggregate {
  /** Big Tray + Full Tray (sides) */
  bigPanCount: number;
  /** Half Tray lines (count) */
  halfPanCount: number;
  /** Plate lines — counted as half-pan equivalents for packing */
  halfPanSlotFromPlates: number;
  /** Whole birds, 5-sticks, sausage — light / small footprint */
  lightMeatHalfSlots: number;
  /** Juice volume in gallon equivalents (1 gal = 1, half gal = 0.5, 16 oz = 1/8, 32 oz = 1/4) */
  gallonEquivalent: number;
}

function isBigPanSize(size: string): boolean {
  return size === 'Big Tray' || size === 'Full Tray';
}

function isHalfPanSize(size: string): boolean {
  return size === 'Half Tray';
}

function isPlateSize(size: string): boolean {
  return size === 'Plate';
}

/** Juice gallon-equivalent for capacity (not for Stripe line items). */
export function juiceGallonEquivalent(size: string, quantity: number): number {
  if (size.startsWith('1 Gallon')) return quantity;
  if (size.startsWith('Half Gallon')) return 0.5 * quantity;
  if (size.includes('16 oz')) return (1 / 8) * quantity;
  if (size.includes('32 oz')) return (1 / 4) * quantity;
  return 0;
}

export function aggregateCartForPirateShip(items: CartItem[]): CartShippingAggregate {
  let bigPanCount = 0;
  let halfPanCount = 0;
  let halfPanSlotFromPlates = 0;
  let lightMeatHalfSlots = 0;
  let gallonEquivalent = 0;

  for (const item of items) {
    const { product, selectedVariant: v, quantity: q } = item;
    const n = q;
    const size = v.size;

    if (product.category === 'juices') {
      gallonEquivalent += juiceGallonEquivalent(size, n);
      continue;
    }

    if (isBigPanSize(size)) {
      bigPanCount += n;
      continue;
    }
    if (isHalfPanSize(size)) {
      halfPanCount += n;
      continue;
    }
    if (isPlateSize(size)) {
      halfPanSlotFromPlates += 0.5 * n;
      continue;
    }
    if (size === 'Whole') {
      lightMeatHalfSlots += n;
      continue;
    }
    if (size === '5 Sticks' || size === '5 Pieces') {
      lightMeatHalfSlots += 0.25 * n;
      continue;
    }

    lightMeatHalfSlots += 0.5 * n;
  }

  return {
    bigPanCount,
    halfPanCount,
    halfPanSlotFromPlates,
    lightMeatHalfSlots,
    gallonEquivalent,
  };
}

/** Half-pan “slots” for small/medium box logic (2 half trays ≈ one medium box pair). */
function totalHalfSlots(a: CartShippingAggregate): number {
  return (
    a.halfPanCount +
    a.halfPanSlotFromPlates +
    a.lightMeatHalfSlots
  );
}

export interface PirateShipPackingEstimate {
  small: number;
  medium: number;
  large: number;
  totalBoxes: number;
  /** Short explanation for support / packing */
  summaryLine: string;
}

/**
 * Heuristic box count for Pirate Ship–style packing (co-packs drinks + big pans when possible).
 * This is an estimate for labels and ops — actual packing may vary with insulation.
 */
export function estimatePirateShipPacking(items: CartItem[]): PirateShipPackingEstimate {
  const agg = aggregateCartForPirateShip(items);
  let B = agg.bigPanCount;
  let G = agg.gallonEquivalent;
  let H = totalHalfSlots(agg);

  let small = 0;
  let medium = 0;
  let large = 0;

  let guard = 0;
  while ((B > 0 || G > 1e-6 || H > 1e-6) && guard < 256) {
    guard++;

    // Large: 24×20×20 — up to 4 big pans and/or 4 gallons
    if (B >= 3 || G >= 3) {
      const bTake = Math.min(B, 4);
      const gTake = Math.min(G, 4);
      B -= bTake;
      G -= gTake;
      large++;
      continue;
    }

    if (B >= 4 || G >= 4) {
      const bTake = Math.min(B, 4);
      const gTake = Math.min(G, 4);
      B -= bTake;
      G -= gTake;
      large++;
      continue;
    }

    // Medium: 20×16×15 — up to 2 big pans and/or 2 gallons; also two half-pan slots
    if (B >= 2 || G >= 2 || H >= 2) {
      const bTake = Math.min(B, 2);
      const gTake = Math.min(G, 2);
      const hTake = Math.min(H, 2);
      B -= bTake;
      G -= gTake;
      H -= hTake;
      medium++;
      continue;
    }

    // Single big pan — needs at least medium (does not fit small)
    if (B >= 1) {
      const bTake = Math.min(B, 2);
      const gTake = Math.min(G, 2);
      const hTake = Math.min(H, 2);
      B -= bTake;
      G -= gTake;
      H -= hTake;
      medium++;
      continue;
    }

    // Half-pan + drinks that fit medium together
    if (H >= 1 && G >= 1) {
      H -= 1;
      G -= Math.min(G, 1);
      medium++;
      continue;
    }

    if (H >= 1) {
      H -= 1;
      small++;
      continue;
    }

    if (G >= 1) {
      G -= 1;
      small++;
      continue;
    }

    if (G > 1e-6) {
      G = 0;
      small++;
      continue;
    }

    if (H > 1e-6) {
      H = 0;
      small++;
      continue;
    }

    break;
  }

  const totalBoxes = small + medium + large;
  const parts: string[] = [];
  if (large) parts.push(`${large} large (24×20×20 in)`);
  if (medium) parts.push(`${medium} medium (20×16×15 in)`);
  if (small) parts.push(`${small} small (16×10×12 in)`);
  const summaryLine =
    totalBoxes === 0
      ? 'No ship-ready boxes estimated (empty cart).'
      : `Est. Pirate Ship packing: ${parts.join(', ')} — ${totalBoxes} box(es) total.`;

  return { small, medium, large, totalBoxes, summaryLine };
}

export function formatPirateShipGuideBullets(): string[] {
  return PIRATE_SHIP_BOXES.map(
    (b) =>
      `${b.label} ${b.dimensionsInches.length}×${b.dimensionsInches.width}×${b.dimensionsInches.depth} in — ${b.capacitySummary}`
  );
}
