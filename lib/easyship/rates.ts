import { AxiosError } from 'axios';
import type { CartItem } from '@/types';
import { SHIPPING_ORIGIN, SHIPPING_SERVICES } from '@/lib/constants/shipping';
import {
  buildConsolidatedPirateShipParcelForRates,
  buildPirateShipParcelsForRates,
  type PirateShipParcelSpec,
} from '@/lib/shipping/pirateShipParcelsForEasyship';
import { getEasyshipClient } from './client';
import {
  createEasyshipItemFromSpec,
  formatAddressForEasyship,
  calculateDeliveryDate,
  filterUPSRates,
  findUPSGroundRate,
  findUPS2ndDayRate,
} from './utils';
import type { EasyshipRateRequest, EasyshipRatesResponse, EasyshipRate } from './types';

export interface ShippingRateResult {
  serviceName: string;
  totalCharge: number;
  currency: string;
  estimatedDeliveryDate: Date;
  transitDays: number;
  courierId?: string;
  rateDetails?: EasyshipRate;
}

export interface GetRatesResult {
  success: boolean;
  rates?: {
    upsGround?: ShippingRateResult;
    ups2ndDay?: ShippingRateResult;
  };
  error?: string;
  isFallback?: boolean;
  /** When live failed but fallback returned rates — first Easyship error message. */
  liveAttemptError?: string;
  /** Parcels actually sent in the successful Easyship /rates call. */
  easyshipParcelCount?: number;
  /** True when multi-parcel failed and a single consolidated box was used. */
  usedConsolidatedParcel?: boolean;
  /** Parcel dimensions/weights actually sent to Easyship for this successful quote. */
  ratedParcelSpecs?: PirateShipParcelSpec[];
}

const DEFAULT_ORIGIN_EMAIL = 'orders@djcuisine.com';
/** Valid-format placeholder when the customer has not entered an email yet (rates still need contact_email). */
const DEFAULT_DESTINATION_EMAIL_FOR_RATES = 'rates-quote@djcuisine.com';

function parseEasyshipAxiosMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const data = error.response?.data as Record<string, unknown> | undefined;
    if (data && typeof data === 'object') {
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        const parts = (data.errors as Array<{ message?: string; field?: string }>).map((e) =>
          [e.field, e.message].filter(Boolean).join(': ')
        );
        const joined = parts.filter(Boolean).join('; ');
        if (joined) return joined;
      }
      if (typeof data.message === 'string') return data.message;
      if (typeof data.detail === 'string') return data.detail;
      if (typeof data.error === 'string') return data.error;
      const errObj = data.error;
      if (errObj && typeof errObj === 'object' && errObj !== null && 'message' in errObj) {
        const m = (errObj as { message?: string }).message;
        if (typeof m === 'string') return m;
      }
      if (status === 422) {
        try {
          const s = JSON.stringify(data);
          return s.length > 600 ? `${s.slice(0, 600)}…` : s;
        } catch {
          /* fall through */
        }
      }
    }
    if (status) return `Easyship HTTP ${status}`;
  }
  if (error instanceof Error) return error.message;
  return 'Failed to fetch shipping rates';
}

/**
 * One parcel with multiple line items (matches Easyship 2024-09 + working geestore flow).
 * Sending multiple top-level `parcels` often returns HTTP 422.
 * `contains_liquids` must be false with `dry_food_supplements` or Easyship rejects the request.
 */
function parcelsFromSpecs(specs: PirateShipParcelSpec[]) {
  const items = specs.map((p) =>
    createEasyshipItemFromSpec(
      p.sku,
      1,
      p.weightLb,
      p.lengthIn,
      p.widthIn,
      p.heightIn,
      p.declaredUsd,
      false
    )
  );
  return [{ items }];
}

export async function getRates(
  destination: {
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
  },
  items: CartItem[]
): Promise<GetRatesResult> {
  const client = getEasyshipClient();
  if (!client) {
    return { success: false, error: 'Easyship is not configured' };
  }

  const originEmail = SHIPPING_ORIGIN.contactEmail?.trim() || DEFAULT_ORIGIN_EMAIL;
  const destEmail = destination.email?.trim() || DEFAULT_DESTINATION_EMAIL_FOR_RATES;

  const originAddress = formatAddressForEasyship({
    firstName: 'DJ',
    lastName: 'Cuisine',
    company: SHIPPING_ORIGIN.companyName,
    addressLine1: SHIPPING_ORIGIN.addressLine1,
    city: SHIPPING_ORIGIN.city,
    state: SHIPPING_ORIGIN.state,
    postalCode: SHIPPING_ORIGIN.postalCode,
    phone: SHIPPING_ORIGIN.phone,
    email: originEmail,
  });
  originAddress.company_name = SHIPPING_ORIGIN.companyName;

  const destinationAddress = formatAddressForEasyship({
    ...destination,
    email: destEmail,
  });

  const multiSpecs = buildPirateShipParcelsForRates(items);
  let easyshipParcelCount = multiSpecs.length;
  let usedConsolidatedParcel = false;
  /** Specs passed to Easyship for the successful /rates call (may be consolidated). */
  let ratedParcelSpecs: PirateShipParcelSpec[] = multiSpecs;

  const http = client.getClient();

  const postRates = async (parcelSpecs: PirateShipParcelSpec[]) => {
    const rateRequest: EasyshipRateRequest = {
      origin_address: originAddress,
      destination_address: destinationAddress,
      parcels: parcelsFromSpecs(parcelSpecs),
      shipping_settings: {
        units: { weight: 'kg', dimensions: 'cm' },
      },
      courier_settings: {
        show_courier_logo_url: false,
        apply_shipping_rules: true,
      },
      insurance: { is_insured: false },
      incoterms: 'DDU',
    };
    console.log('[Easyship] Posting rates request:', JSON.stringify(rateRequest, null, 2));
    const response = await http.post<EasyshipRatesResponse>('/rates', rateRequest);
    return response.data;
  };

  let responseData: EasyshipRatesResponse;
  try {
    responseData = await postRates(multiSpecs);
  } catch (firstErr) {
    console.error('[Easyship] getRates (Pirate Ship line items):', firstErr);
    if (firstErr instanceof AxiosError && firstErr.response?.data) {
      console.error('[Easyship] /rates body:', JSON.stringify(firstErr.response.data));
    }
    const firstMsg = parseEasyshipAxiosMessage(firstErr);
    try {
      const consolidated = buildConsolidatedPirateShipParcelForRates(items);
      responseData = await postRates(consolidated);
      usedConsolidatedParcel = true;
      easyshipParcelCount = 1;
      ratedParcelSpecs = consolidated;
      console.warn('[Easyship] Retried /rates with one consolidated box. First error was:', firstMsg);
    } catch (secondErr) {
      console.error('[Easyship] getRates (consolidated):', secondErr);
      if (secondErr instanceof AxiosError && secondErr.response?.data) {
        console.error('[Easyship] /rates body:', JSON.stringify(secondErr.response.data));
      }
      const secondMsg = parseEasyshipAxiosMessage(secondErr);
      return {
        success: false,
        error: `${firstMsg} | consolidated retry: ${secondMsg}`,
      };
    }
  }

  if (!responseData?.rates?.length) {
    return { success: false, error: 'No shipping rates available for this destination' };
  }

  const upsRates = filterUPSRates(responseData.rates);
  if (upsRates.length === 0) {
    return {
      success: false,
      error: 'No UPS or FedEx rates returned for this destination (check Easyship couriers for this origin)',
    };
  }

  const groundRate = findUPSGroundRate(upsRates);
  const secondDayRate = findUPS2ndDayRate(upsRates);

  const result: GetRatesResult = {
    success: true,
    rates: {},
    easyshipParcelCount,
    usedConsolidatedParcel,
    ratedParcelSpecs,
  };

  if (
    groundRate &&
    groundRate.min_delivery_time != null &&
    groundRate.max_delivery_time != null &&
    groundRate.total_charge != null
  ) {
    const transitDays = Math.ceil(
      (groundRate.min_delivery_time + groundRate.max_delivery_time) / 2
    );
    result.rates!.upsGround = {
      serviceName: SHIPPING_SERVICES.UPS_GROUND,
      totalCharge: groundRate.total_charge,
      currency: groundRate.currency || 'USD',
      estimatedDeliveryDate: calculateDeliveryDate(transitDays),
      transitDays,
      courierId: groundRate.courier_id || groundRate.courier_service?.courier_id,
      rateDetails: groundRate as EasyshipRate,
    };
  }

  if (secondDayRate && secondDayRate.total_charge != null) {
    result.rates!.ups2ndDay = {
      serviceName: SHIPPING_SERVICES.UPS_2ND_DAY,
      totalCharge: secondDayRate.total_charge,
      currency: secondDayRate.currency || 'USD',
      estimatedDeliveryDate: calculateDeliveryDate(2),
      transitDays: 2,
      courierId: secondDayRate.courier_id || secondDayRate.courier_service?.courier_id,
      rateDetails: secondDayRate as EasyshipRate,
    };
  }

  if (!result.rates!.upsGround && !result.rates!.ups2ndDay) {
    return {
      success: false,
      error:
        'Ground and expedited (2-day) services not found in UPS/FedEx quotes for this destination',
    };
  }

  return result;
}

export async function getRatesWithFallback(
  destination: Parameters<typeof getRates>[0],
  items: CartItem[],
  useFallback = false
): Promise<GetRatesResult> {
  const forceFallback = process.env.USE_FALLBACK_RATES === 'true';

  if (useFallback || forceFallback) {
    const { getFallbackRates } = await import('./fallback');
    return getFallbackRates(destination.state, items);
  }

  // LIVE RATES ONLY - NO FALLBACK
  const live = await getRates(destination, items);
  if (live.success && live.rates) {
    return live;
  }

  // If live rates fail, ALWAYS fall back to zone-based rates
  console.error('[Easyship] Live rates failed:', live.error);
  console.warn('[Easyship] Falling back to zone-based rates');
  const { getFallbackRates } = await import('./fallback');
  const fallbackResult = await getFallbackRates(destination.state, items);
  return {
    ...fallbackResult,
    liveAttemptError: live.error,
  };
}
