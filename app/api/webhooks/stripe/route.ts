import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe/server';
import { handleCheckoutSessionCompleted } from '@/lib/stripe/handleCheckoutSessionCompleted';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!stripe || !webhookSecret) {
    console.error('[Stripe Webhook] Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('[Stripe Webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('[Stripe Webhook] checkout.session.completed', {
        sessionId: session.id,
        paymentIntent: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id,
        hasCustomerEmail: Boolean(session.customer_details?.email || session.customer_email),
      });
      await handleCheckoutSessionCompleted(session);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Stripe Webhook] Processing failed:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
