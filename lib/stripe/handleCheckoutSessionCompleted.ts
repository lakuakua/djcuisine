import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe/server';
import { persistStripeOrder, type LineItemRow } from '@/lib/orders/persistStripeOrder';
import { sendOrderEmails } from '@/lib/email/orderEmails';
import { sendPickupOrderConfirmationEmail, sendAdminOrderNotificationEmail } from '@/lib/email/resend';

/**
 * Idempotent: sets payment_intent.metadata.webhook_processed on success path.
 */
export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  const stripe = getStripe();
  if (!stripe) {
    console.error('[Checkout Webhook] Stripe client unavailable');
    return;
  }

  const piId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id;
  let pi: Stripe.PaymentIntent | null = null;

  if (!piId) {
    console.warn('[Checkout Webhook] No payment_intent on session', session.id);
  } else {
    pi = await stripe.paymentIntents.retrieve(piId);
    if (pi.metadata?.webhook_processed === 'true') {
      console.log('[Checkout Webhook] Already processed PI', piId);
      return;
    }
  }

  const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ['line_items', 'line_items.data.price'],
  });

  let orderNumber = '';
  let created = true;
  try {
    const persisted = await persistStripeOrder(fullSession, piId ?? null);
    orderNumber = persisted.orderNumber;
    created = persisted.created;
  } catch (e) {
    console.error('[Checkout Webhook] Persist order failed, continuing with email only', e);
    orderNumber = `DJ-${fullSession.id.slice(-8).toUpperCase()}`;
    created = true;
  }

  const lines: LineItemRow[] = (fullSession.line_items?.data ?? []).map((line) => ({
    description: line.description || 'Item',
    quantity: line.quantity ?? 0,
    amountTotalCents: line.amount_total ?? 0,
  }));

  if (created) {
    try {
      // Check if this is a pickup order
      const isPickup =
        pi?.metadata?.is_pickup === 'true' ||
        fullSession.metadata?.ship_service === 'Local Pickup';
      const customerEmail = fullSession.customer_details?.email || fullSession.customer_email;
      const customerPhone = fullSession.customer_details?.phone;

      if (isPickup && customerEmail) {
        // Send pickup confirmation email
        const sent = await sendPickupOrderConfirmationEmail({
          orderNumber,
          customerEmail,
          orderTotal: fullSession.amount_total ?? 0,
          currency: fullSession.currency || 'usd',
          orderDate: new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        });
        console.log('[Checkout Webhook] Pickup confirmation send result', {
          orderNumber,
          sent,
        });
        await sendAdminOrderNotificationEmail({
          orderNumber,
          customerEmail,
          orderTotal: fullSession.amount_total ?? 0,
          currency: fullSession.currency || 'usd',
          items: lines,
        });
      } else {
        // Send regular order confirmation email
        await sendOrderEmails({
          orderNumber,
          session: fullSession,
          lines,
          sessionId: fullSession.id,
        });
        console.log('[Checkout Webhook] Order confirmation attempted', {
          orderNumber,
        });
      }
    } catch (e) {
      console.error('[Checkout Webhook] Email send failed:', e);
    }
  }

  if (piId && pi) {
    await stripe.paymentIntents.update(piId, {
      metadata: {
        ...pi.metadata,
        webhook_processed: 'true',
        webhook_processed_at: new Date().toISOString(),
        checkout_session_id: fullSession.id,
        order_number: orderNumber,
      },
    });
  } else {
    console.warn('[Checkout Webhook] Skipped PI metadata update (missing payment_intent)', {
      sessionId: fullSession.id,
      orderNumber,
    });
  }

  console.log('[Checkout Webhook] Processed session', fullSession.id, orderNumber);
}
