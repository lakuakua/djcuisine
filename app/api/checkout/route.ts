import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CartItem } from '@/types';

// Validate environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not configured');
}

if (!process.env.NEXT_PUBLIC_APP_URL) {
  throw new Error('NEXT_PUBLIC_APP_URL is not configured');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  console.log('Checkout API: Request received');
  
  try {
    const { items }: { items: CartItem[] } = await request.json();
    console.log('Checkout API: Processing', items.length, 'items');

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    // Validate gallon minimum
    const gallonItems = items.filter(
      (item) => item.selectedVariant.size === '1 Gallon'
    );
    const totalGallons = gallonItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    if (gallonItems.length > 0 && totalGallons < 2) {
      return NextResponse.json(
        { error: 'Gallon orders require a minimum of 2 gallons' },
        { status: 400 }
      );
    }

    // Create line items for Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${item.product.name} (${item.selectedVariant.size})`,
            description: `${item.product.description}${item.selectedVariant.servings ? ` - ${item.selectedVariant.servings}` : ''}`,
            images: item.product.image ? [item.product.image] : [],
          },
          unit_amount: item.selectedVariant.price,
        },
        quantity: item.quantity,
      })
    );

    // Create Stripe checkout session
    console.log('Checkout API: Creating Stripe session...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}`,
      metadata: {
        orderType: 'online',
      },
    });

    console.log('Checkout API: Session created successfully:', session.id);
    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('Checkout API: Error occurred:', error);
    console.error('Error details:', {
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode
    });
    
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      },
      { status: 500 }
    );
  }
}
