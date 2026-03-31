import {
  FALLBACK_SHIPPING_RATES,
  SHIPPING_SERVICES,
  STATE_TO_ZONE,
} from '@/lib/constants/shipping';
import type { CartItem } from '@/types';
import { totalCartWeightLb } from '@/lib/shipping/cartParcelForEasyship';
import { calculateDeliveryDate } from './utils';
import type { GetRatesResult } from './rates';

export function getFallbackRates(state: string, items: CartItem[]): GetRatesResult {
  const zone = STATE_TO_ZONE[state.toUpperCase()] || 'ZONE_5';
  const zoneRates = FALLBACK_SHIPPING_RATES[zone];
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
