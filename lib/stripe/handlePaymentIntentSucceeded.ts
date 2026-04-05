import type Stripe from 'stripe';
import { prisma } from '@/lib/db/prisma';
import { getProductById } from '@/lib/products';
import { sendPickupOrderConfirmationEmail, sendOrderConfirmationEmail, sendAdminOrderNotificationEmail } from '@/lib/email/resend';
import { generateOrderNumber } from '@/lib/utils/orderNumber';
import {
  formatPickupDisplay,
  isPickupAtLeastHoursAfter,
  parsePickupAtIso,
  PICKUP_MIN_LEAD_MS,
} from '@/lib/pickup/schedule';

type ParsedLine = {
  description: string;
  quantity: number;
  amountTotalCents: number;
};

function parseCartLines(cartLines: string | undefined): ParsedLine[] {
  if (!cartLines) return [];
  return cartLines.split(';').map((line) => {
    const [productId, variantId, qtyRaw, extrasRaw] = line.split(':');
    const quantity = Number(qtyRaw || 0);
    const product = getProductById(productId);
    const variant = product?.variants.find((v) => v.id === variantId);
    const extras = extrasRaw || '';
    const sweet =
      extras.includes('S') ? 'Sweetened' : extras.includes('U') ? 'Unsweetened' : '';
    const spice =
      extras.includes('M') ? 'Mild' : extras.includes('P') ? 'Spicy' : '';
    const labelExtras = [spice, sweet].filter(Boolean).join(' — ');
    const name = product ? product.name : productId;
    const size = variant?.size ? ` (${variant.size})` : '';
    const description = `${name}${size}${labelExtras ? ` — ${labelExtras}` : ''}`;
    const price = variant?.price ?? 0;
    return {
      description,
      quantity: Number.isFinite(quantity) ? quantity : 0,
      amountTotalCents: price * (Number.isFinite(quantity) ? quantity : 0),
    };
  });
}

export async function handlePaymentIntentSucceeded(
  pi: Stripe.PaymentIntent,
  options?: { eventCreatedSec?: number }
): Promise<void> {
  const customerEmail =
    (typeof pi.receipt_email === 'string' ? pi.receipt_email : undefined) ||
    (typeof pi.metadata?.customer_email === 'string' ? pi.metadata.customer_email : undefined);
  if (!customerEmail) {
    console.warn('[PaymentIntent] Missing customer email', pi.id);
  }

  const isPickup =
    pi.metadata?.is_pickup === 'true' || pi.metadata?.ship_service === 'Local Pickup';

  const purchaseMs = (options?.eventCreatedSec ?? pi.created) * 1000;
  const pickupAtIso = typeof pi.metadata?.pickup_at === 'string' ? pi.metadata.pickup_at : undefined;
  const pickupMs = parsePickupAtIso(pickupAtIso);
  let pickupDisplay: string | undefined;
  if (isPickup && pickupAtIso) {
    pickupDisplay = formatPickupDisplay(pickupAtIso);
    if (
      pickupMs != null &&
      !isPickupAtLeastHoursAfter(pickupMs, purchaseMs, PICKUP_MIN_LEAD_MS)
    ) {
      console.warn('[PaymentIntent] pickup_at within 24h of payment event', {
        paymentIntentId: pi.id,
        pickup_at: pickupAtIso,
      });
    }
  }

  const orderNumber = generateOrderNumber();
  const lines = parseCartLines(pi.metadata?.cart_lines);
  const orderTotal = pi.amount_received ?? pi.amount ?? 0;

  try {
    await prisma.order.create({
      data: {
        orderNumber,
        stripeCheckoutSessionId: pi.id,
        stripePaymentIntentId: pi.id,
        status: 'PAID',
        customerEmail: customerEmail ?? null,
        amountTotalCents: orderTotal,
        currency: pi.currency || 'usd',
        shippingJson: JSON.stringify({
          line1: pi.metadata?.ship_line1,
          city: pi.metadata?.ship_city,
          state: pi.metadata?.ship_state,
          postal_code: pi.metadata?.ship_zip,
          ...(isPickup && pickupAtIso ? { pickup_at: pickupAtIso, pickup_display: pickupDisplay } : {}),
        }),
        lineItemsJson: JSON.stringify(lines),
      },
    });
  } catch (e) {
    console.error('[PaymentIntent] Persist order failed', e);
  }

  if (isPickup && customerEmail) {
    await sendPickupOrderConfirmationEmail({
      orderNumber,
      customerEmail,
      orderTotal,
      currency: pi.currency || 'usd',
      scheduledPickupDisplay: pickupDisplay,
      orderDate: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    });
  } else if (customerEmail) {
    await sendOrderConfirmationEmail({
      orderNumber,
      customerEmail,
      orderTotal,
      currency: pi.currency || 'usd',
      items: lines.map((l) => ({
        name: l.description,
        quantity: l.quantity,
        unitPrice: l.quantity ? Math.round(l.amountTotalCents / l.quantity) : 0,
        totalPrice: l.amountTotalCents,
      })),
      orderDate: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    });
  }

  if (customerEmail) {
    await sendAdminOrderNotificationEmail({
      orderNumber,
      customerEmail,
      customerPhone: pi.metadata?.customer_phone || pi.metadata?.ship_phone,
      orderTotal,
      currency: pi.currency || 'usd',
      items: lines,
      shippingAddress: {
        line1: pi.metadata?.ship_line1,
        city: pi.metadata?.ship_city,
        state: pi.metadata?.ship_state,
        postalCode: pi.metadata?.ship_zip,
      },
      isPickup,
      pickupScheduledDisplay: pickupDisplay,
    });
  }
}
