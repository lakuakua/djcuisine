import { NextRequest, NextResponse } from 'next/server';
import type { CartItem } from '@/types';
import { getProductById } from '@/lib/products';
import { getRatesWithFallback } from '@/lib/easyship/rates';
import {
  HANDLING_FEE_USD,
  PERISHABLE_SHIPPING_NOTICE,
} from '@/lib/constants/shipping';
import {
  buildPirateShipParcelsForRates,
  parcelSpecsToQuoteBoxLines,
} from '@/lib/shipping/pirateShipParcelsForEasyship';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { destination, items } = body as {
      destination?: {
        firstName?: string;
        lastName?: string;
        addressLine1?: string;
        addressLine2?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        phone?: string;
        email?: string;
      };
      items?: CartItem[];
    };

    console.log('[shipping/quote] Received request with', items?.length ?? 0, 'items');
    console.log('[shipping/quote] Destination:', destination?.city, destination?.state);

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart items are required' }, { status: 400 });
    }

    if (!destination?.city || !destination.state || !destination.postalCode) {
      return NextResponse.json(
        { error: 'Destination city, state, and postal code are required' },
        { status: 400 }
      );
    }

    // Validate all items have required properties
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.product || !item.selectedVariant) {
        console.error(`[shipping/quote] Item ${i} missing product or selectedVariant:`, item);
        return NextResponse.json(
          { error: `Item ${i + 1} is missing required product or variant data` },
          { status: 400 }
        );
      }
      if (typeof item.quantity !== 'number' || item.quantity <= 0) {
        console.error(`[shipping/quote] Item ${i} has invalid quantity:`, item.quantity);
        return NextResponse.json(
          { error: `Item ${i + 1} has invalid quantity` },
          { status: 400 }
        );
      }
    }

    for (const item of items) {
      const catalog = getProductById(item.product?.id);
      if (catalog?.requiresSweetnessChoice && !item.juiceSweetness) {
        return NextResponse.json(
          { error: 'Sweetened or unsweetened is required for some juice products' },
          { status: 400 }
        );
      }
    }

    const fullDestination = {
      firstName: destination.firstName?.trim() || 'Customer',
      lastName: destination.lastName?.trim() || 'Name',
      addressLine1: destination.addressLine1?.trim() || '100 Main St',
      addressLine2: destination.addressLine2?.trim() || undefined,
      city: destination.city.trim(),
      state: destination.state.trim().toUpperCase().slice(0, 2),
      postalCode: destination.postalCode.trim(),
      phone: (destination.phone || '7135550100').replace(/\D/g, '').slice(0, 15) || '7135550100',
      email: destination.email?.trim(),
    };

    const cartItems = items as CartItem[];
    const parcelSpecs = buildPirateShipParcelsForRates(cartItems);
    console.log('[shipping/quote] Built parcel specs:', JSON.stringify(parcelSpecs, null, 2));
    
    const ratesResult = await getRatesWithFallback(fullDestination, cartItems);
    console.log('[shipping/quote] Got rates result:', {
      success: ratesResult.success,
      error: ratesResult.error,
      isFallback: ratesResult.isFallback,
      liveAttemptError: ratesResult.liveAttemptError,
      hasRates: !!ratesResult.rates,
    });

    const specsForDisplay = ratesResult.ratedParcelSpecs ?? parcelSpecs;
    const quoteBoxes = parcelSpecsToQuoteBoxLines(specsForDisplay);

    if (!ratesResult.success || !ratesResult.rates) {
      return NextResponse.json(
        { error: ratesResult.error || 'Failed to fetch shipping rates' },
        { status: 400 }
      );
    }

    const rates: Array<{
      service: string;
      cost: number;
      currency: string;
      estimatedDeliveryDate: string;
      transitDays: number;
      courierId?: string;
    }> = [];

    if (ratesResult.rates.upsGround) {
      const g = ratesResult.rates.upsGround;
      rates.push({
        service: g.serviceName,
        cost: g.totalCharge,
        currency: g.currency,
        estimatedDeliveryDate: g.estimatedDeliveryDate.toISOString(),
        transitDays: g.transitDays,
        courierId: g.courierId,
      });
    }
    if (ratesResult.rates.ups2ndDay) {
      const d = ratesResult.rates.ups2ndDay;
      rates.push({
        service: d.serviceName,
        cost: d.totalCharge,
        currency: d.currency,
        estimatedDeliveryDate: d.estimatedDeliveryDate.toISOString(),
        transitDays: d.transitDays,
        courierId: d.courierId,
      });
    }

    return NextResponse.json({
      rates,
      handlingFee: HANDLING_FEE_USD,
      isFallback: ratesResult.isFallback === true,
      /** True when USE_FALLBACK_RATES=true — Easyship API is never called. */
      fallbackForcedByEnv: process.env.USE_FALLBACK_RATES === 'true',
      /** Pirate Ship packing estimate (may differ if Easyship used a consolidated single parcel). */
      parcelCount: parcelSpecs.length,
      easyshipParcelCount: ratesResult.easyshipParcelCount,
      usedConsolidatedParcel: ratesResult.usedConsolidatedParcel === true,
      /** Boxes/dimensions/weights used for this quote (matches Easyship request). */
      quoteBoxes,
      /** When showing fallback after a failed live call — exact Easyship error summary. */
      liveAttemptError: ratesResult.liveAttemptError,
      perishableNotice: PERISHABLE_SHIPPING_NOTICE,
    });
  } catch (e) {
    console.error('[shipping/quote]', e);
    return NextResponse.json({ error: 'Failed to fetch shipping quote' }, { status: 500 });
  }
}
