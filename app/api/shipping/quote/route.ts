import { NextRequest, NextResponse } from 'next/server';
import type { CartItem } from '@/types';
import { getProductById } from '@/lib/products';
import { PERISHABLE_SHIPPING_NOTICE, SHIPPING_SERVICES } from '@/lib/constants/shipping';
import { quoteRegionalShippingUsd } from '@/lib/shipping/regionalQuote';

function addBusinessDays(from: Date, days: number): Date {
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return d;
}

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

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart items are required' }, { status: 400 });
    }

    if (!destination?.city || !destination.state || !destination.postalCode) {
      return NextResponse.json(
        { error: 'Destination city, state, and postal code are required' },
        { status: 400 }
      );
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.product || !item.selectedVariant) {
        return NextResponse.json(
          { error: `Item ${i + 1} is missing required product or variant data` },
          { status: 400 }
        );
      }
      if (typeof item.quantity !== 'number' || item.quantity <= 0) {
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

    const state = destination.state.trim().toUpperCase().slice(0, 2);
    const cartItems = items as CartItem[];

    const quoted = quoteRegionalShippingUsd(cartItems, state);
    if (!quoted.ok) {
      return NextResponse.json({ error: quoted.error }, { status: 400 });
    }

    const now = new Date();
    const groundEta = addBusinessDays(now, 5);
    const secondDayEta = addBusinessDays(now, 2);

    const rates = [
      {
        service: SHIPPING_SERVICES.UPS_GROUND,
        cost: quoted.upsGroundUsd,
        currency: 'USD',
        estimatedDeliveryDate: groundEta.toISOString(),
        transitDays: 5,
      },
      {
        service: SHIPPING_SERVICES.UPS_2ND_DAY,
        cost: quoted.ups2ndDayUsd,
        currency: 'USD',
        estimatedDeliveryDate: secondDayEta.toISOString(),
        transitDays: 2,
      },
    ];

    return NextResponse.json({
      rates,
      handlingFee: 0,
      isFallback: false,
      fallbackForcedByEnv: false,
      parcelCount: null,
      easyshipParcelCount: null,
      usedConsolidatedParcel: false,
      quoteBoxes: [],
      liveAttemptError: null,
      perishableNotice: PERISHABLE_SHIPPING_NOTICE,
      pricingSource: 'regional_excel',
      zone: quoted.zone,
    });
  } catch (e) {
    console.error('[shipping/quote]', e);
    return NextResponse.json({ error: 'Failed to fetch shipping quote' }, { status: 500 });
  }
}
