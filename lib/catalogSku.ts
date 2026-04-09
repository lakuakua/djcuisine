/**
 * Maps catalog product id + variant id to Excel SKU keys in `SKU_SHIPPING_RATES` / `djcuisine_products .xlsx`.
 * Rows with no regional rates in the sheet are omitted — those lines are pickup-only (`pickupOnly` on the product).
 */

const PRODUCT_VARIANT_TO_EXCEL_SKU: Record<string, Record<string, string>> = {
  'chicken-leg-thighs': {
    big: 'CHICKEN-LEG-THIGHS-BIG',
    half: 'CHICKEN-LEG-THIGHS-HALF',
    plate: 'CHICKEN-LEG-THIGHS-PLATE',
  },
  'chicken-wings': {
    big: 'CHICKEN-WINGS-BIG',
    half: 'CHICKEN-WINGS-HALF',
    plate: 'CHICKEN-WINGS-PLATE',
  },
  'chicken-breast': {
    big: 'CHICKEN-BREAST-BIG',
    half: 'CHICKEN-BREAST-HALF',
  },
  'turkey-wings': {
    big: 'TURKEY-WINGS-BIG',
    half: 'TURKEY-WINGS-HALF',
  },
  'turkey-legs': {
    big: 'TURKEY-LEGS-BIG',
    half: 'TURKEY-LEGS-HALF',
  },
  'beef-ribs': {
    big: 'BEEF-RIBS-BIG',
    half: 'BEEF-RIBS-HALF',
    plate: 'BEEF-RIBS-PLATE',
  },
  'beef-steak-tips': {
    big: 'BEEF-STEAK-TIPS-BIG',
    half: 'BEEF-STEAK-TIPS-HALF',
    plate: 'BEEF-STEAK-TIPS-PLATE',
  },
  'beef-kabob': {
    big: 'BEEF-KABOB-BIG',
    half: 'BEEF-KABOB-HALF',
  },
  lamb: {
    big: 'LAMB-BIG',
    half: 'LAMB-HALF',
    plate: 'LAMB-PLATE',
  },
  'smoked-rooster': { whole: 'SMOKED-ROOSTER' },
  'smoked-guinea-fowl': { whole: 'SMOKED-GUINEA-FOWL' },
  'smoked-hen': { whole: 'SMOKED-HEN' },
  'smoked-rabbit': { whole: 'SMOKED-RABBIT' },
  'grilled-rooster': { whole: 'GRILLED-ROOSTER' },
  'grilled-guinea-fowl': { whole: 'GRILLED-GUINEA-FOWL' },
  'deer-sausage': { '5-pieces': 'DEER-SAUSAGE-5PC' },
  zobo: {
    '1gal': 'ZOBO-1GAL',
    half: 'ZOBO-HALFGAL',
    '16oz': 'ZOBO-16OZ',
    '32oz': 'ZOBO-32OZ',
  },
  'pineapple-ginger': {
    '1gal': 'PINEAPPLE-GINGER-1GAL',
    half: 'PINEAPPLE-GINGER-HALFGAL',
    '16oz': 'PINEAPPLE-GINGER-16OZ',
    '32oz': 'PINEAPPLE-GINGER-32OZ',
  },
  'watermelon-ginger-pineapple': {
    '1gal': 'WATERMELON-GINGER-PINEAPPLE',
  },
};

export function lineItemToExcelSku(productId: string, variantId: string): string | null {
  return PRODUCT_VARIANT_TO_EXCEL_SKU[productId]?.[variantId] ?? null;
}
