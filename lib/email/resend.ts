import { Resend } from 'resend';
import { LOCAL_PICKUP } from '@/lib/constants/shipping';

export interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
  idempotencyKey?: string;
}

/**
 * Initialize Resend client with API key from environment.
 * Set RESEND_API_KEY environment variable.
 * See: https://resend.com/docs/send-with-nodejs#1-install
 */
function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('[Email] RESEND_API_KEY environment variable is not set');
  }
  return new Resend(apiKey);
}

/**
 * Send email using Resend SDK.
 * Follows Resend best practices: https://resend.com/docs/send-with-nodejs
 */
export async function sendResendEmail(params: SendEmailParams): Promise<boolean> {
  try {
    const resend = getResendClient();
    const from = process.env.ORDER_EMAIL_FROM?.trim();
    
    if (!from) {
      console.warn('[Email] ORDER_EMAIL_FROM environment variable is not set');
      return false;
    }

    const { data, error } = await resend.emails.send({
      from,
      to: params.to,
      subject: params.subject,
      html: params.html || params.text,
      text: params.text,
      ...(params.idempotencyKey && { idempotencyKey: params.idempotencyKey }),
    });

    if (error) {
      console.error('[Email] Resend error:', error);
      return false;
    }

    console.log(`[Email] Sent successfully. Message ID: ${data?.id}`);
    return true;
  } catch (error) {
    console.error('[Email] Exception:', error);
    return false;
  }
}

/**
 * Send a shipping notification email (called when order ships)
 */
export async function sendShippingNotificationEmail(params: {
  orderNumber: string;
  customerEmail: string;
  customerName?: string;
  trackingNumber: string;
  carrier: string;
  estimatedDeliveryDate: string;
  shippingAddress?: {
    name?: string;
    line1?: string;
    city?: string;
    state?: string;
    postal_code?: string;
  };
}): Promise<boolean> {
  const { buildShippingNotificationEmail } = await import('./templates/shippingNotification');
  const { html, text } = buildShippingNotificationEmail(params);

  return sendResendEmail({
    to: params.customerEmail,
    subject: `Your DJ Cuisine Order #${params.orderNumber} Has Shipped! 📦`,
    text,
    html,
    idempotencyKey: `shipping-${params.orderNumber}`,
  });
}

/**
 * Send pickup order confirmation email (called immediately after payment)
 */
export async function sendPickupOrderConfirmationEmail(params: {
  orderNumber: string;
  customerEmail: string;
  customerName?: string;
  orderTotal: number;
  currency: string;
  items?: Array<{ name: string; quantity: number; unitPrice: number; totalPrice: number }>;
  orderDate: string;
  pickupAddress?: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  };
}): Promise<boolean> {
  const { buildPickupOrderConfirmationEmail } = await import('./templates/pickupOrderConfirmation');
  const address = params.pickupAddress || {
    line1: LOCAL_PICKUP.addressLine1,
    city: LOCAL_PICKUP.city,
    state: LOCAL_PICKUP.state,
    postalCode: LOCAL_PICKUP.postalCode,
    phone: LOCAL_PICKUP.phone,
  };
  const { html, subject } = buildPickupOrderConfirmationEmail({
    orderNumber: params.orderNumber,
    customerName: params.customerName,
    orderTotal: params.orderTotal,
    currency: params.currency,
    items: params.items,
    orderDate: params.orderDate,
    pickupAddress: address,
  });

  return sendResendEmail({
    to: params.customerEmail,
    subject,
    text:
      `Order Confirmation & Receipt\n\n` +
      `Order #${params.orderNumber}\n` +
      `Amount Paid: $${(params.orderTotal / 100).toFixed(2)}\n` +
      `Payment Method: Card\n\n` +
      `Pickup Location:\n${address.line1}\n${address.city}, ${address.state} ${address.postalCode}\nPhone: ${address.phone}\n\n` +
      `You will receive another email when your order is ready for pickup.`,
    html,
    idempotencyKey: `pickup-order-${params.orderNumber}`,
  });
}

/**
 * Send admin notification for new pickup orders.
 */
export async function sendAdminOrderNotificationEmail(params: {
  orderNumber: string;
  customerEmail: string;
  orderTotal: number;
  currency: string;
  items?: Array<{ description: string; quantity: number; amountTotalCents: number }>;
  shippingAddress?: { line1?: string; city?: string; state?: string; postalCode?: string };
  isPickup?: boolean;
}): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  if (!adminEmail) {
    console.warn('[Email] ADMIN_EMAIL not set, skipping admin notification');
    return false;
  }

  const formatMoney = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: params.currency.toUpperCase(),
    }).format(cents / 100);
  };

  const lineItemsText = (params.items ?? [])
    .map((line) => {
      const itemTotal = formatMoney(line.amountTotalCents);
      return `- ${line.description} × ${line.quantity}  ${itemTotal}`;
    })
    .join('\n');

  const locationLabel = params.isPickup ? 'Pickup Location' : 'Ship To';
  const addressText = params.isPickup
    ? `${LOCAL_PICKUP.addressLine1}\n${LOCAL_PICKUP.city}, ${LOCAL_PICKUP.state} ${LOCAL_PICKUP.postalCode}\nPhone: ${LOCAL_PICKUP.phone}`
    : `${params.shippingAddress?.line1 ?? '—'}\n${params.shippingAddress?.city ?? ''} ${params.shippingAddress?.state ?? ''} ${params.shippingAddress?.postalCode ?? ''}`.trim();

  const text = `
New Pickup Order

Order Number: ${params.orderNumber}
Customer Email: ${params.customerEmail}
Order Total: ${formatMoney(params.orderTotal)}

${locationLabel}:
${addressText}

Items:
${lineItemsText || '—'}
  `;

  const lineItemsHtml = (params.items ?? [])
    .map((line) => {
      const itemTotal = formatMoney(line.amountTotalCents);
      return `<tr><td style="padding:6px 0;">${line.description}</td><td style="padding:6px 0; text-align:center;">${line.quantity}</td><td style="padding:6px 0; text-align:right;">${itemTotal}</td></tr>`;
    })
    .join('');

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="margin: 0 0 12px;">New ${params.isPickup ? 'Pickup' : 'Shipping'} Order</h2>
    <p><strong>Order:</strong> ${params.orderNumber}</p>
    <p><strong>Customer:</strong> ${params.customerEmail}</p>
    <p><strong>Total:</strong> ${formatMoney(params.orderTotal)}</p>
    <p><strong>${locationLabel}:</strong> ${addressText.replace(/\n/g, ', ')}</p>
    <h3 style="margin: 16px 0 8px;">Items</h3>
    <table style="width:100%; border-collapse:collapse; font-size:14px;">
      <thead>
        <tr>
          <th align="left" style="border-bottom:1px solid #e5e7eb; padding-bottom:6px;">Item</th>
          <th align="center" style="border-bottom:1px solid #e5e7eb; padding-bottom:6px;">Qty</th>
          <th align="right" style="border-bottom:1px solid #e5e7eb; padding-bottom:6px;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${lineItemsHtml || '<tr><td colspan="3" style="padding:6px 0;">—</td></tr>'}
      </tbody>
    </table>
  </div>
</body>
</html>
  `;

  return sendResendEmail({
    to: adminEmail,
    subject: `[Admin] New Pickup Order #${params.orderNumber}`,
    text,
    html,
    idempotencyKey: `admin-pickup-${params.orderNumber}`,
  });
}

/**
 * Send order confirmation email (called immediately after payment)
 */
export async function sendOrderConfirmationEmail(params: {
  orderNumber: string;
  customerEmail: string;
  customerName?: string;
  orderTotal: number;
  currency: string;
  items?: Array<{ name: string; quantity: number; unitPrice: number; totalPrice: number }>;
  handlingFee?: number;
  shippingCost?: number;
  tax?: number;
  orderDate: string;
}): Promise<boolean> {
  const { buildOrderConfirmationEmail } = await import('./templates/orderConfirmation');
  const { html, text, subject } = buildOrderConfirmationEmail(params);

  return sendResendEmail({
    to: params.customerEmail,
    subject,
    text,
    html,
    idempotencyKey: `order-${params.orderNumber}`,
  });
}

/**
 * Send shipping notification to admin (for monitoring)
 */
export async function sendAdminShippingNotificationEmail(params: {
  orderNumber: string;
  customerEmail: string;
  orderTotal: number;
  currency: string;
  carrier?: string;
  trackingNumber?: string;
}): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  if (!adminEmail) {
    console.warn('[Email] ADMIN_EMAIL not set, skipping admin notification');
    return false;
  }

  const formatMoney = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: params.currency.toUpperCase(),
    }).format(cents / 100);
  };

  const text = `
Order Shipped Notification

Order Number: ${params.orderNumber}
Customer Email: ${params.customerEmail}
Order Total: ${formatMoney(params.orderTotal)}
Carrier: ${params.carrier || 'Unknown'}
${params.trackingNumber ? `Tracking Number: ${params.trackingNumber}` : ''}

---
This is an automated notification from DJ Cuisine.
  `;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; }
    .header { background-color: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 6px 6px 0 0; }
    .content { background-color: white; padding: 20px; border-radius: 0 0 6px 6px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">📦 Order Shipped</h2>
    </div>
    <div class="content">
      <p><strong>Order:</strong> ${params.orderNumber}</p>
      <p><strong>Customer:</strong> ${params.customerEmail}</p>
      <p><strong>Amount:</strong> ${formatMoney(params.orderTotal)}</p>
      <p><strong>Carrier:</strong> ${params.carrier || 'Unknown'}</p>
      ${params.trackingNumber ? `<p><strong>Tracking:</strong> ${params.trackingNumber}</p>` : ''}
    </div>
  </div>
</body>
</html>
  `;

  return sendResendEmail({
    to: adminEmail,
    subject: `[Admin] Order #${params.orderNumber} Shipped`,
    text,
    html,
    idempotencyKey: `admin-shipping-${params.orderNumber}`,
  });
}
