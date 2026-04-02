import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe/server';
import { persistStripeOrder, type LineItemRow } from '@/lib/orders/persistStripeOrder';
import { sendOrderEmails } from '@/lib/email/orderEmails';
import { sendPickupOrderConfirmationEmail } from '@/lib/email/resend';

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

  if (!piId) {
    console.warn('[Checkout Webhook] No payment_intent on session', session.id);
    return;
  }

  const pi = await stripe.paymentIntents.retrieve(piId);
  if (pi.metadata?.webhook_processed === 'true') {
    console.log('[Checkout Webhook] Already processed PI', piId);
    return;
  }

  const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ['line_items', 'line_items.data.price'],
  });

  const { orderNumber, created } = await persistStripeOrder(fullSession, piId);

  const lines: LineItemRow[] = (fullSession.line_items?.data ?? []).map((line) => ({
    description: line.description || 'Item',
    quantity: line.quantity ?? 0,
    amountTotalCents: line.amount_total ?? 0,
  }));

  if (created) {
    try {
      // Check if this is a pickup order
      const isPickup = pi.metadata?.is_pickup === 'true';
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

  await stripe.paymentIntents.update(piId, {
    metadata: {
      ...pi.metadata,
      webhook_processed: 'true',
      webhook_processed_at: new Date().toISOString(),
      checkout_session_id: fullSession.id,
      order_number: orderNumber,
    },
  });

  console.log('[Checkout Webhook] Processed session', fullSession.id, orderNumber);
}
