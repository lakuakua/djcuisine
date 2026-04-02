import { Resend } from 'resend';

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
    line1: '7554 Coral Terrace Drive',
    city: 'Cypress',
    state: 'TX',
    postalCode: '77433',
    phone: '(713) 555-0100',
  };
  const { html } = buildPickupOrderConfirmationEmail({
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
    subject: `Order Confirmed - DJ Cuisine #${params.orderNumber} (Local Pickup)`,
    text: `Order Confirmation\n\nOrder #${params.orderNumber}\nTotal: $${(params.orderTotal / 100).toFixed(2)}\n\nPickup Location:\n${address.line1}\n${address.city}, ${address.state} ${address.postalCode}\nPhone: ${address.phone}\n\nYou will receive another email when your order is ready for pickup.`,
    html,
    idempotencyKey: `pickup-order-${params.orderNumber}`,
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
