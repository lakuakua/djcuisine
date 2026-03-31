import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe/server';
import { persistStripeOrder, type LineItemRow } from '@/lib/orders/persistStripeOrder';
import { sendOrderEmails } from '@/lib/email/orderEmails';

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
      await sendOrderEmails({
        orderNumber,
        session: fullSession,
        lines,
        sessionId: fullSession.id,
      });
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
