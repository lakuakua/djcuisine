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
import { SHIPPING_SERVICES, LOCAL_PICKUP, STATE_TO_ZONE, getShippingRate } from '@/lib/constants/shipping';
import { SHIPPING_CONFIG } from '@/lib/shipping';

const ALLOWED_SERVICES = new Set<string>([
  SHIPPING_SERVICES.UPS_GROUND,
  SHIPPING_SERVICES.UPS_2ND_DAY,
  'Local Pickup',
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

    console.log('Checkout API: Processing', items?.length ?? 0, 'items with service:', shippingService);

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    // Ensure all items have quantity (migration/fallback for cart data)
    const validatedItems = items.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
    }));

    if (!email?.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!shippingService || !ALLOWED_SERVICES.has(shippingService)) {
      return NextResponse.json(
        { error: 'Valid shipping service is required (UPS Ground, UPS 2nd Day Air, or Local Pickup)' },
        { status: 400 }
      );
    }

    // If not local pickup, validate shipping address
    if (shippingService !== 'Local Pickup') {
      if (!shippingAddress?.line1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
        return NextResponse.json({ error: 'Complete shipping address is required' }, { status: 400 });
      }
    }

    for (const item of validatedItems) {
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

    const gallonItems = validatedItems.filter((item) => isJuiceOneGallonSize(item.selectedVariant.size));
    const totalGallons = gallonItems.reduce((sum, item) => sum + item.quantity, 0);

    if (gallonItems.length > 0 && totalGallons < 2) {
      return NextResponse.json(
        { error: 'Gallon orders require a minimum of 2 gallons' },
        { status: 400 }
      );
    }

    // Determine shipping cost
    let shippingCents = 0;
    let destination: any;
    let isFallback = false;

    if (shippingService === 'Local Pickup') {
      // No shipping cost for local pickup
      shippingCents = 0;
      destination = {
        firstName: '',
        lastName: '',
        addressLine1: LOCAL_PICKUP.addressLine1,
        addressLine2: '',
        city: LOCAL_PICKUP.city,
        state: LOCAL_PICKUP.state,
        postalCode: LOCAL_PICKUP.postalCode,
        phone: LOCAL_PICKUP.phone,
        email: email.trim(),
      };
    } else {
      // Use weight/zone-based shipping rates
      destination = {
        firstName: shippingAddress!.firstName.trim(),
        lastName: shippingAddress!.lastName.trim(),
        addressLine1: shippingAddress!.line1.trim(),
        addressLine2: shippingAddress!.line2?.trim(),
        city: shippingAddress!.city.trim(),
        state: shippingAddress!.state.trim().toUpperCase().slice(0, 2),
        postalCode: shippingAddress!.postalCode.trim(),
        phone: shippingAddress!.phone.replace(/\D/g, '').slice(0, 15) || '7135550100',
        email: email.trim(),
      };

      // Calculate shipping using weight/zone matrix
      const zone = STATE_TO_ZONE[destination.state] || 'south';
      let shippingUsd = 0;
      let itemCount = 0;

      for (const item of validatedItems) {
        // Use the first variant's SKU as a representative
        const sku = `${item.product.id.toUpperCase()}-${item.selectedVariant.id.toUpperCase()}`;
        const service = shippingService === SHIPPING_SERVICES.UPS_GROUND ? 'ground' : 'secondDay';
        const rate = getShippingRate(sku, zone, service);
        shippingUsd += rate;
        itemCount += item.quantity;
      }

      shippingCents = Math.round(shippingUsd * 100);
    }

    const stripeLineName = (item: CartItem) => {
      let base = `${item.product.name} (${item.selectedVariant.size})`;
      if (item.spiceLevel) base += ` — ${item.spiceLevel.charAt(0).toUpperCase() + item.spiceLevel.slice(1)}`;
      if (item.juiceSweetness === 'sweetened') return `${base} — Sweetened`;
      if (item.juiceSweetness === 'unsweetened') return `${base} — Unsweetened`;
      return base;
    };

    const productLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = validatedItems.map((item) => {
      // Build absolute URL safely - images are optional for Stripe
      let images: string[] = [];
      if (item.product.image) {
        try {
          const abs = toAbsoluteUrl(item.product.image);
          if (abs && abs.startsWith('http')) {
            images = [abs];
          }
        } catch (e) {
          console.warn('Failed to build image URL, skipping:', e);
        }
      }

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: stripeLineName(item),
            description: `${item.product.description}${item.selectedVariant.servings ? ` - ${item.selectedVariant.servings}` : ''}`,
            ...(images.length > 0 ? { images } : {}),
          },
          unit_amount: item.selectedVariant.price,
        },
        quantity: item.quantity,
      };
    });

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [...productLineItems];
    const subtotalCents = validatedItems.reduce(
      (sum, item) => sum + item.selectedVariant.price * item.quantity,
      0
    );
    const taxCents = Math.round(subtotalCents * SHIPPING_CONFIG.TAX_RATE);
    if (taxCents > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Tax',
            description: `Sales tax (${(SHIPPING_CONFIG.TAX_RATE * 100).toFixed(2)}%)`,
          },
          unit_amount: taxCents,
        },
        quantity: 1,
      });
    }

    // Add shipping line item only if not pickup
    if (shippingService !== 'Local Pickup') {
      const shippingLineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Shipping — ${shippingService}`,
            description: `Shipping service: ${shippingService}.`,
          },
          unit_amount: shippingCents,
        },
        quantity: 1,
      };
      lineItems.push(shippingLineItem);
    }

    const metadata = buildCheckoutMetadata(items, {
      customer_email: email.trim(),
      ship_service: shippingService,
      ship_fallback: isFallback ? 'true' : 'false',
      ship_city: destination.city,
      ship_state: destination.state,
      ship_zip: destination.postalCode,
      ship_line1: destination.addressLine1.slice(0, 500),
    });

    const appUrlRaw =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
      'https://djcuisine.vercel.app';

    const appUrl = String(appUrlRaw || 'https://djcuisine.vercel.app').trim();
    const finalAppUrl = appUrl.replace(/\/$/, '');
    
    // Validate URLs before sending to Stripe
    if (!finalAppUrl || typeof finalAppUrl !== 'string' || !finalAppUrl.startsWith('http')) {
      console.error('Invalid app URL construction:', { 
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL, 
        VERCEL_URL: process.env.VERCEL_URL, 
        finalAppUrl, 
        appUrl,
      });
      return NextResponse.json(
        { error: 'Invalid app configuration: APP_URL not properly set', debug: finalAppUrl },
        { status: 500 }
      );
    }

    const successUrl = `${finalAppUrl}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${finalAppUrl}/checkout`;

    console.log('Stripe URLs:', { successUrl, cancelUrl });
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: email.trim(),
      success_url: successUrl,
      cancel_url: cancelUrl,
      phone_number_collection: { enabled: true },
      metadata,
      payment_intent_data: {
        metadata: {
          app: 'djcuisine',
          ship_service: shippingService,
          is_pickup: shippingService === 'Local Pickup' ? 'true' : 'false',
          ship_phone: destination.phone,
          ship_email: destination.email,
        },
      },
    });

    console.log('Checkout API: Session created successfully:', session.id);
    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error: unknown) {
    const err = error as { message?: string; type?: string; code?: string; statusCode?: number };
    const errorMessage = err.message || String(error) || 'Internal server error';
    console.error('Checkout API: Error occurred:', {
      message: errorMessage,
      type: err.type,
      code: err.code,
      stack: error instanceof Error ? error.stack : undefined,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
    });

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
