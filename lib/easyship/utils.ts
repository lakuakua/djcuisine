import { EASYSHIP_ITEM_CATEGORY_SLUG } from '@/lib/constants/shipping';
import type { EasyshipAddress, EasyshipItem } from './types';

/** Easyship expects E.164; bare 10-digit US numbers often yield HTTP 422. */
export function toE164US(phone: string): string {
  const trimmed = phone.trim();
  if (trimmed.startsWith('+')) return trimmed;
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  if (digits.length >= 10) return `+1${digits.slice(-10)}`;
  return '+17135550100';
}

export function poundsToKg(pounds: number): number {
  return Math.round(pounds * 0.453592 * 100) / 100;
}

export function inchesToCm(inches: number): number {
  return Math.round(inches * 2.54 * 100) / 100;
}

export function formatAddressForEasyship(address: {
  firstName: string;
  lastName: string;
  company?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  email?: string;
}): EasyshipAddress {
  return {
    line_1: address.addressLine1,
    line_2: address.addressLine2 || undefined,
    city: address.city,
    state: address.state,
    postal_code: address.postalCode,
    country_alpha2: 'US',
    contact_name: `${address.firstName} ${address.lastName}`,
    contact_phone: toE164US(address.phone),
    contact_email: address.email,
    company_name: address.company || undefined,
  };
}

export function createEasyshipItemFromSpec(
  _sku: string,
  quantity: number,
  weightLbPerUnit: number,
  lengthInches: number,
  widthInches: number,
  heightInches: number,
  priceUsdPerUnit: number,
  containsLiquids: boolean
): EasyshipItem {
  return {
    actual_weight: poundsToKg(weightLbPerUnit),
    declared_customs_value: Math.max(0.01, priceUsdPerUnit * quantity),
    declared_currency: 'USD',
    dimensions: {
      length: inchesToCm(lengthInches),
      width: inchesToCm(widthInches),
      height: inchesToCm(heightInches),
    },
    quantity,
    origin_country_alpha2: 'US',
    category: EASYSHIP_ITEM_CATEGORY_SLUG.DRY_FOOD_SUPPLEMENTS,
    contains_liquids: containsLiquids,
  };
}

type EasyshipRateLike = {
  courier_name?: string;
  courier_service?: { name?: string; umbrella_name?: string; courier_id?: string };
  courier_id?: string;
  full_description?: string;
  min_delivery_time?: number;
  max_delivery_time?: number;
  total_charge?: number;
  currency?: string;
};

function getCourierLabel(rate: EasyshipRateLike): string {
  return rate.courier_name || rate.courier_service?.name || rate.courier_service?.umbrella_name || '';
}

/**
 * Keep UPS + FedEx (no freight). Many Easyship accounts return FedEx only for some lanes;
 * UPS-only filtering caused empty rates and "UPS shipping not available" in production.
 */
export function filterUPSRates(rates: EasyshipRateLike[]): EasyshipRateLike[] {
  return rates.filter((rate) => {
    const label = getCourierLabel(rate).toUpperCase();
    return (
      (label.includes('UPS') && !label.includes('MAIL')) ||
      (label.includes('FEDEX') && !label.includes('FREIGHT'))
    );
  });
}

export function findUPSGroundRate(rates: EasyshipRateLike[]) {
  return rates.find((rate) => {
    const name = getCourierLabel(rate).toUpperCase();
    const desc = rate.full_description?.toUpperCase() || '';
    const isUPSGround =
      (name.includes('UPS') && name.includes('GROUND')) ||
      (desc.includes('UPS') && desc.includes('GROUND'));
    const isFedExGround =
      (name.includes('FEDEX') && name.includes('GROUND')) ||
      (desc.includes('FEDEX') && desc.includes('GROUND'));
    return isUPSGround || isFedExGround;
  });
}

export function findUPS2ndDayRate(rates: EasyshipRateLike[]) {
  return rates.find((rate) => {
    const name = getCourierLabel(rate).toUpperCase();
    const desc = rate.full_description?.toUpperCase() || '';
    const isUPS2ndDay =
      (name.includes('UPS') && (name.includes('2ND') || name.includes('2 DAY'))) ||
      (desc.includes('UPS') && (desc.includes('2ND') || desc.includes('2 DAY')));
    const isFedEx2Day =
      (name.includes('FEDEX') && name.includes('2')) || (desc.includes('FEDEX') && desc.includes('2'));
    return isUPS2ndDay || isFedEx2Day;
  });
}

export function calculateDeliveryDate(transitDays: number, shipDate?: Date): Date {
  const ship = shipDate || new Date();
  const delivery = new Date(ship);
  let addedDays = 0;
  while (addedDays < transitDays) {
    delivery.setDate(delivery.getDate() + 1);
    if (delivery.getDay() !== 0 && delivery.getDay() !== 6) {
      addedDays++;
    }
  }
  return delivery;
}
