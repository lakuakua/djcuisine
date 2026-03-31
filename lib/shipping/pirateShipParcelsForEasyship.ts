import type { CartItem } from '@/types';
import { PIRATE_SHIP_BOXES, estimatePirateShipPacking } from './pirateShipBoxes';
import { totalCartWeightLb } from './cartParcelForEasyship';

/**
 * One physical parcel per Pirate Ship box (16×10×12, 20×16×15, or 24×20×20 in).
 * Weight and declared value are split by box volume so Easyship rates match your packing.
 */
export type PirateShipParcelSpec = {
  sku: string;
  label: string;
  lengthIn: number;
  widthIn: number;
  heightIn: number;
  /** Total pounds in this box */
  weightLb: number;
  /** Declared value (USD) for this box */
  declaredUsd: number;
  containsLiquids: boolean;
};

/** API + checkout: one row per parcel used for the Easyship quote. */
export type QuoteBoxLine = {
  /** Pirate Ship tier name, e.g. Small / Medium / Large */
  tier: string;
  /** Line label from packing (e.g. "Medium 1/2") or "Consolidated" */
  label: string;
  /** e.g. "20×16×15 in" */
  dimensions: string;
  weightLb: number;
};

function tierFromSpec(p: PirateShipParcelSpec): string {
  if (p.sku.startsWith('djc-consolidated')) {
    return PIRATE_SHIP_BOXES[2].label;
  }
  const parts = p.sku.split('-');
  const id = parts[1];
  const box = PIRATE_SHIP_BOXES.find((b) => b.id === id);
  return box?.label ?? 'Box';
}

/** Serialize parcel specs for `/api/shipping/quote` and checkout UI. */
export function parcelSpecsToQuoteBoxLines(specs: PirateShipParcelSpec[]): QuoteBoxLine[] {
  return specs.map((p) => ({
    tier: tierFromSpec(p),
    label: p.label,
    dimensions: `${p.lengthIn}×${p.widthIn}×${p.heightIn} in`,
    weightLb: Math.round(p.weightLb * 100) / 100,
  }));
}

export function buildPirateShipParcelsForRates(items: CartItem[]): PirateShipParcelSpec[] {
  const packing = estimatePirateShipPacking(items);
  let { small, medium, large } = packing;

  const totalLb = totalCartWeightLb(items);
  const totalUsd = items.reduce(
    (s, i) => s + (i.selectedVariant.price / 100) * i.quantity,
    0
  );
  const hasJuice = items.some((i) => i.product.category === 'juices');

  let totalBoxes = small + medium + large;
  if (totalBoxes === 0) {
    small = 1;
    totalBoxes = 1;
  }

  const volSmall =
    PIRATE_SHIP_BOXES[0].dimensionsInches.length *
    PIRATE_SHIP_BOXES[0].dimensionsInches.width *
    PIRATE_SHIP_BOXES[0].dimensionsInches.depth;
  const volMedium =
    PIRATE_SHIP_BOXES[1].dimensionsInches.length *
    PIRATE_SHIP_BOXES[1].dimensionsInches.width *
    PIRATE_SHIP_BOXES[1].dimensionsInches.depth;
  const volLarge =
    PIRATE_SHIP_BOXES[2].dimensionsInches.length *
    PIRATE_SHIP_BOXES[2].dimensionsInches.width *
    PIRATE_SHIP_BOXES[2].dimensionsInches.depth;

  const totalVol = small * volSmall + medium * volMedium + large * volLarge;

  const safeLb = Math.max(1, totalLb);
  const safeUsd = Math.max(0.01, totalUsd);

  const out: PirateShipParcelSpec[] = [];

  const pushType = (count: number, boxIndex: 0 | 1 | 2) => {
    if (count <= 0) return;
    const dims = PIRATE_SHIP_BOXES[boxIndex].dimensionsInches;
    const v = boxIndex === 0 ? volSmall : boxIndex === 1 ? volMedium : volLarge;
    const volShare = (count * v) / totalVol;
    const weightPool = safeLb * volShare;
    const valuePool = safeUsd * volShare;
    const labelBase = PIRATE_SHIP_BOXES[boxIndex].label;

    for (let i = 0; i < count; i++) {
      const w = Math.max(0.5, weightPool / count);
      const val = Math.max(0.01, valuePool / count);
      out.push({
        sku: `djc-${PIRATE_SHIP_BOXES[boxIndex].id}-${i + 1}`,
        label: `${labelBase} ${i + 1}/${count}`,
        lengthIn: dims.length,
        widthIn: dims.width,
        heightIn: dims.depth,
        weightLb: w,
        declaredUsd: val,
        containsLiquids: hasJuice,
      });
    }
  };

  pushType(large, 2);
  pushType(medium, 1);
  pushType(small, 0);

  return out;
}

/**
 * Single parcel using the largest Pirate Ship box and total cart weight/value.
 * Used when multi-parcel /rates fails (some accounts reject multiple parcels on one request).
 */
export function buildConsolidatedPirateShipParcelForRates(
  items: CartItem[]
): PirateShipParcelSpec[] {
  const totalLb = Math.max(1, totalCartWeightLb(items));
  const totalUsd = Math.max(
    0.01,
    items.reduce((s, i) => s + (i.selectedVariant.price / 100) * i.quantity, 0)
  );
  const hasJuice = items.some((i) => i.product.category === 'juices');
  const dims = PIRATE_SHIP_BOXES[2].dimensionsInches;
  return [
    {
      sku: 'djc-consolidated-1',
      label: 'Consolidated',
      lengthIn: dims.length,
      widthIn: dims.width,
      heightIn: dims.depth,
      weightLb: totalLb,
      declaredUsd: totalUsd,
      containsLiquids: hasJuice,
    },
  ];
}
