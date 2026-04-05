import { NextRequest, NextResponse } from 'next/server';
import type { CartItem } from '@/types';
import { getProductById } from '@/lib/products';
import { getStripe, stripeSecretKeyMissing } from '@/lib/stripe/server';
import { buildCheckoutMetadata } from '@/lib/stripe/checkoutMetadata';
import { SHIPPING_CONFIG } from '@/lib/shipping';
import { SHIPPING_SERVICES, STATE_TO_ZONE, getShippingRate } from '@/lib/constants/shipping';
import {
  isPickupAtLeastHoursAfter,
  parsePickupAtIso,
  PICKUP_MIN_LEAD_MS,
} from '@/lib/pickup/schedule';

const ALLOWED_SERVICES = new Set<string>([
  SHIPPING_SERVICES.UPS_GROUND,
  SHIPPING_SERVICES.UPS_2ND_DAY,
  'Local Pickup',
]);

export async function POST(request: NextRequest) {
  if (stripeSecretKeyMissing) {
    return NextResponse.json(
      { error: 'Payment system not configured. Please contact support.' },
      { status: 500 }
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: 'Payment system not configured. Please contact support.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const {
      items,
      email,
      shippingAddress,
      shippingService,
      phone,
      pickupAt,
    }: {
      items: CartItem[];
      email?: string;
      shippingAddress?: {
        firstName: string;
        lastName: string;
        line1: string;
        line2?: string;
        city: string;
        state: string;
        postalCode: string;
        phone: string;
      };
      shippingService?: string;
      phone?: string;
      /** ISO 8601 — required for Local Pickup; must be ≥ 24h from now */
      pickupAt?: string;
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    if (!email?.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!shippingService || !ALLOWED_SERVICES.has(shippingService)) {
      return NextResponse.json(
        { error: 'Valid shipping service is required (UPS Ground, UPS 2nd Day Air, or Local Pickup)' },
        { status: 400 }
      );
    }

    if (shippingService !== 'Local Pickup') {
      if (!shippingAddress?.line1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
        return NextResponse.json({ error: 'Complete shipping address is required' }, { status: 400 });
      }
    } else {
      const pickupMs = parsePickupAtIso(pickupAt);
      if (pickupMs == null) {
        return NextResponse.json(
          { error: 'Choose a pickup date and time at least 24 hours from now.' },
          { status: 400 }
        );
      }
      if (!isPickupAtLeastHoursAfter(pickupMs, Date.now(), PICKUP_MIN_LEAD_MS)) {
        return NextResponse.json(
          { error: 'Pickup must be scheduled at least 24 hours after your order time.' },
          { status: 400 }
        );
      }
    }

    for (const item of items) {
      const catalog = getProductById(item.product.id);
      if (catalog?.requiresSweetnessChoice && !item.juiceSweetness) {
        return NextResponse.json(
          { error: 'Sweetened or unsweetened is required for this product' },
          { status: 400 }
        );
      }
      if (catalog?.requiresSpiceLevel && !item.spiceLevel) {
        return NextResponse.json(
          { error: 'Mild or Spicy is required for this product' },
          { status: 400 }
        );
      }
    }

    const subtotalCents = items.reduce(
      (sum, item) => sum + item.selectedVariant.price * item.quantity,
      0
    );
    const taxCents = Math.round(subtotalCents * SHIPPING_CONFIG.TAX_RATE);

    let shippingCents = 0;
    if (shippingService !== 'Local Pickup') {
      const state = shippingAddress!.state.trim().toUpperCase().slice(0, 2);
      const zone = STATE_TO_ZONE[state] || 'south';
      let shippingUsd = 0;
      for (const item of items) {
        const sku = `${item.product.id.toUpperCase()}-${item.selectedVariant.id.toUpperCase()}`;
        const service = shippingService === SHIPPING_SERVICES.UPS_GROUND ? 'ground' : 'secondDay';
        const rate = getShippingRate(sku, zone, service);
        shippingUsd += rate;
      }
      shippingCents = Math.round(shippingUsd * 100);
    }

    const amount = subtotalCents + taxCents + shippingCents;

    const customerPhone = shippingAddress?.phone || phone || '';
    const metadata = buildCheckoutMetadata(items, {
      customer_email: email.trim(),
      customer_phone: customerPhone,
      ship_service: shippingService,
      ship_city: shippingAddress?.city ?? 'Katy',
      ship_state: shippingAddress?.state ?? 'TX',
      ship_zip: shippingAddress?.postalCode ?? '77493',
      ship_line1: shippingAddress?.line1 ?? '3043 Narrow Stream Way',
      ship_phone: customerPhone,
    });

    const pickupAtIso =
      shippingService === 'Local Pickup' && pickupAt?.trim()
        ? pickupAt.trim().slice(0, 500)
        : undefined;

    const intent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      receipt_email: email.trim(),
      payment_method_types: ['card'],
      payment_method_options: {
        card: {},
      },
      metadata: {
        ...metadata,
        is_pickup: shippingService === 'Local Pickup' ? 'true' : 'false',
        ...(pickupAtIso ? { pickup_at: pickupAtIso } : {}),
      },
    });

    return NextResponse.json({ clientSecret: intent.client_secret });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[PaymentIntent] Error:', message);
    return NextResponse.json({ error: message || 'Payment failed' }, { status: 500 });
  }
}
