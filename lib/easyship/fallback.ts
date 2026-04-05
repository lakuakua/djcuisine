import {
  FALLBACK_SHIPPING_RATES,
  SHIPPING_SERVICES,
  STATE_TO_ZONE,
  ZONE_NAMES,
} from '@/lib/constants/shipping';
import type { CartItem } from '@/types';
import { totalCartWeightLb } from '@/lib/shipping/cartParcelForEasyship';
import { calculateDeliveryDate } from './utils';
import type { GetRatesResult } from './rates';

// Map new zone names to old ZONE_X keys for fallback rates
const zoneToLegacyZone: Record<string, keyof typeof FALLBACK_SHIPPING_RATES> = {
  [ZONE_NAMES.NORTHEAST]: 'ZONE_5',
  [ZONE_NAMES.MIDWEST]: 'ZONE_4',
  [ZONE_NAMES.SOUTH]: 'ZONE_1',
  [ZONE_NAMES.WEST]: 'ZONE_5',
};

export function getFallbackRates(state: string, items: CartItem[]): GetRatesResult {
  const newZone = STATE_TO_ZONE[state.toUpperCase()] || ZONE_NAMES.SOUTH;
  const legacyZone = zoneToLegacyZone[newZone] || 'ZONE_5';
  const zoneRates = FALLBACK_SHIPPING_RATES[legacyZone];
  const totalWeight = totalCartWeightLb(items);

  let groundRate = zoneRates.ground;
  let secondDayRate = zoneRates.secondDay;

  if (totalWeight > 60) {
    const extraWeight = totalWeight - 60;
    const extraCharge = Math.ceil(extraWeight / 30) * 10;
    groundRate += extraCharge;
    secondDayRate += extraCharge;
  }

  return {
    success: true,
    isFallback: true,
    rates: {
      upsGround: {
        serviceName: SHIPPING_SERVICES.UPS_GROUND,
        totalCharge: Math.round(groundRate * 100) / 100,
        currency: 'USD',
        estimatedDeliveryDate: calculateDeliveryDate(5),
        transitDays: 5,
      },
      ups2ndDay: {
        serviceName: SHIPPING_SERVICES.UPS_2ND_DAY,
        totalCharge: Math.round(secondDayRate * 100) / 100,
        currency: 'USD',
        estimatedDeliveryDate: calculateDeliveryDate(2),
        transitDays: 2,
      },
    },
  };
}
