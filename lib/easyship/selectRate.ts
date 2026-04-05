import { SHIPPING_SERVICES } from '@/lib/constants/shipping';
import type { GetRatesResult, ShippingRateResult } from './rates';

export function selectRateByServiceName(
  result: GetRatesResult,
  serviceName: string
): ShippingRateResult | null {
  if (!result.success || !result.rates) return null;
  if (serviceName === SHIPPING_SERVICES.UPS_GROUND) {
    return result.rates.upsGround ?? null;
  }
  if (serviceName === SHIPPING_SERVICES.UPS_2ND_DAY) {
    return result.rates.ups2ndDay ?? null;
  }
  return null;
}
