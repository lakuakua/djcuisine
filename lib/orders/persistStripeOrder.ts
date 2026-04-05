import type Stripe from 'stripe';
import { prisma } from '@/lib/db/prisma';
import { generateOrderNumber } from '@/lib/utils/orderNumber';

export type LineItemRow = {
  description: string;
  quantity: number;
  amountTotalCents: number;
};

/**
 * Create Order row from expanded Checkout Session. Idempotent on session id.
 */
export async function persistStripeOrder(
  session: Stripe.Checkout.Session,
  paymentIntentId: string | null
): Promise<{ orderNumber: string; created: boolean }> {
  const existing = await prisma.order.findUnique({
    where: { stripeCheckoutSessionId: session.id },
  });
  if (existing) {
    return { orderNumber: existing.orderNumber, created: false };
  }

  const lines: LineItemRow[] = (session.line_items?.data ?? []).map((line) => ({
    description: line.description || 'Item',
    quantity: line.quantity ?? 0,
    amountTotalCents: line.amount_total ?? 0,
  }));

  const email =
    session.customer_details?.email || session.customer_email || null;
  const phone = session.customer_details?.phone || null;
  const ship = session.shipping_details?.address;

  let orderNumber = generateOrderNumber();
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await prisma.order.create({
        data: {
          orderNumber,
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: paymentIntentId,
          status: 'PAID',
          customerEmail: email,
          customerPhone: phone,
          amountTotalCents: session.amount_total ?? 0,
          currency: session.currency || 'usd',
          shippingJson: ship ? JSON.stringify(ship) : null,
          lineItemsJson: JSON.stringify(lines),
        },
      });
      return { orderNumber, created: true };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes('Unique constraint') && msg.includes('orderNumber')) {
        orderNumber = generateOrderNumber();
        continue;
      }
      throw e;
    }
  }
  throw new Error('Could not allocate unique orderNumber');
}
