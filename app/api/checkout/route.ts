import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CartItem } from '@/types';
import { getProductById } from '@/lib/products';
import { isJuiceOneGallonSize } from '@/lib/utils';
import { getStripe, stripeSecretKeyMissing } from '@/lib/stripe/server';
import { buildCheckoutMetadata } from '@/lib/stripe/checkoutMetadata';
import { toAbsoluteUrl } from '@/lib/utils/absoluteUrl';
import { getRatesWithFallback } from '@/lib/easyship/rates';
import { selectRateByServiceName } from '@/lib/easyship/selectRate';
import { HANDLING_FEE_USD, SHIPPING_SERVICES } from '@/lib/constants/shipping';

const ALLOWED_SERVICES = new Set<string>([
  SHIPPING_SERVICES.UPS_GROUND,
  SHIPPING_SERVICES.UPS_2ND_DAY,
]);

export async function POST(request: NextRequest) {
  console.log('Checkout API: Request received');

  if (stripeSecretKeyMissing) {
    console.error('STRIPE_SECRET_KEY is not configured');
    return NextResponse.json(
      { error: 'Payment system not configured. Please contact support.' },
      { status: 500 }
    );
  }

  if (!process.env.NEXT_PUBLIC_APP_URL) {
    console.error('NEXT_PUBLIC_APP_URL is not configured');
    return NextResponse.json(
      { error: 'App configuration error. Please contact support.' },
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
    } = body;

    console.log('Checkout API: Processing', items?.length ?? 0, 'items');

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    if (!email?.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!shippingAddress?.line1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
      return NextResponse.json({ error: 'Complete shipping address is required' }, { status: 400 });
    }

    if (!shippingService || !ALLOWED_SERVICES.has(shippingService)) {
      return NextResponse.json(
        { error: 'Valid shipping service is required (UPS Ground or UPS 2nd Day Air)' },
        { status: 400 }
      );
    }

    for (const item of items) {
      const catalog = getProductById(item.product.id);
      if (catalog?.requiresSweetnessChoice && !item.juiceSweetness) {
        return NextResponse.json(
          { error: 'Sweetened or unsweetened is required for this product' },
          { status: 400 }
        );
      }
    }

    const gallonItems = items.filter((item) => isJuiceOneGallonSize(item.selectedVariant.size));
    const totalGallons = gallonItems.reduce((sum, item) => sum + item.quantity, 0);

    if (gallonItems.length > 0 && totalGallons < 2) {
      return NextResponse.json(
        { error: 'Gallon orders require a minimum of 2 gallons' },
        { status: 400 }
      );
    }

    const destination = {
      firstName: shippingAddress.firstName.trim(),
      lastName: shippingAddress.lastName.trim(),
      addressLine1: shippingAddress.line1.trim(),
      addressLine2: shippingAddress.line2?.trim(),
      city: shippingAddress.city.trim(),
      state: shippingAddress.state.trim().toUpperCase().slice(0, 2),
      postalCode: shippingAddress.postalCode.trim(),
      phone: shippingAddress.phone.replace(/\D/g, '').slice(0, 15) || '7135550100',
      email: email.trim(),
    };

    const ratesResult = await getRatesWithFallback(destination, items);
    const selected = selectRateByServiceName(ratesResult, shippingService);

    if (!selected) {
      return NextResponse.json(
        { error: 'Could not verify shipping rate for the selected service. Please refresh quotes.' },
        { status: 400 }
      );
    }

    const shippingUsd = selected.totalCharge + HANDLING_FEE_USD;
    const shippingCents = Math.round(shippingUsd * 100);

    const stripeLineName = (item: CartItem) => {
      const base = `${item.product.name} (${item.selectedVariant.size})`;
      if (item.juiceSweetness === 'sweetened') return `${base} — Sweetened`;
      if (item.juiceSweetness === 'unsweetened') return `${base} — Unsweetened`;
      return base;
    };

    const productLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => {
      const abs = toAbsoluteUrl(item.product.image);
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: stripeLineName(item),
            description: `${item.product.description}${item.selectedVariant.servings ? ` - ${item.selectedVariant.servings}` : ''}`,
            images: abs ? [abs] : [],
          },
          unit_amount: item.selectedVariant.price,
        },
        quantity: item.quantity,
      };
    });

    const shippingLineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: 'usd',
        product_data: {
          name: `Shipping — ${selected.serviceName}`,
          description: `Includes ${HANDLING_FEE_USD.toFixed(2)} handling (insulation & cold pack).`,
        },
        unit_amount: shippingCents,
      },
      quantity: 1,
    };

    const metadata = buildCheckoutMetadata(items, {
      customer_email: email.trim(),
      ship_service: shippingService,
      ship_fallback: ratesResult.isFallback ? 'true' : 'false',
      ship_city: destination.city,
      ship_state: destination.state,
      ship_zip: destination.postalCode,
      ship_line1: destination.addressLine1.slice(0, 500),
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [...productLineItems, shippingLineItem],
      mode: 'payment',
      customer_email: email.trim(),
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
      phone_number_collection: { enabled: true },
      metadata,
      payment_intent_data: {
        metadata: {
          app: 'djcuisine',
          ship_service: shippingService,
        },
      },
    });

    console.log('Checkout API: Session created successfully:', session.id);
    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error: unknown) {
    const err = error as { message?: string; type?: string; code?: string; statusCode?: number };
    console.error('Checkout API: Error occurred:', error);

    return NextResponse.json(
      {
        error: err.message || 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
