export interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
  idempotencyKey?: string;
}

/**
 * Resend HTTP API. Set RESEND_API_KEY and ORDER_EMAIL_FROM.
 */
export async function sendResendEmail(params: SendEmailParams): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.ORDER_EMAIL_FROM?.trim();
  if (!apiKey || !from) {
    console.warn('[Email] RESEND_API_KEY or ORDER_EMAIL_FROM missing');
    return false;
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  if (params.idempotencyKey) {
    headers['Idempotency-Key'] = params.idempotencyKey;
  }

  const body: Record<string, unknown> = {
    from,
    to: [params.to],
    subject: params.subject,
    text: params.text,
  };
  if (params.html) {
    body.html = params.html;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error('[Email] Resend error', res.status, await res.text());
    return false;
  }
  return true;
}

/**
 * Send a shipping notification email (called when order ships)
 */
export async function sendShippingNotificationEmail(params: {
  orderNumber: string;
  customerEmail: string;
  customerName?: string;
  orderTotal: number;
  currency: string;
  shippingAddress?: {
    name?: string;
    line1?: string;
    city?: string;
    state?: string;
    postal_code?: string;
  };
  trackingNumber?: string;
  carrier?: string;
  estimatedDeliveryDate?: string;
  orderDate: string;
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
