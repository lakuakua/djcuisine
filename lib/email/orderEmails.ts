import type Stripe from 'stripe';
import { sendResendEmail } from '@/lib/email/resend';
import type { LineItemRow } from '@/lib/orders/persistStripeOrder';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatMoney(cents: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

export function buildOrderEmailBodies(params: {
  orderNumber: string;
  session: Stripe.Checkout.Session;
  lines: LineItemRow[];
}): { text: string; html: string } {
  const { orderNumber, session, lines } = params;
  const total = formatMoney(session.amount_total ?? 0, session.currency || 'usd');
  const addr = session.shipping_details?.address;
  const shipBlock = addr
    ? [
        `Ship to:`,
        `${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}`,
        `${addr.city}, ${addr.state} ${addr.postal_code}`,
        addr.country || '',
      ]
        .filter(Boolean)
        .join('\n')
    : 'Shipping address: (collected at checkout)';

  const linesText = lines
    .map(
      (l) =>
        `  • ${l.description} × ${l.quantity}  ${formatMoney(l.amountTotalCents, session.currency || 'usd')}`
    )
    .join('\n');

  const text = [
    `Order ${orderNumber}`,
    '',
    `Total: ${total}`,
    '',
    shipBlock,
    '',
    'Items:',
    linesText,
    '',
    'Thank you for choosing DJ Cuisine!',
  ].join('\n');

  const rowsHtml = lines
    .map(
      (l) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #333">${escapeHtml(l.description)}</td><td style="padding:8px;border-bottom:1px solid #333;text-align:center">${l.quantity}</td><td style="padding:8px;border-bottom:1px solid #333;text-align:right">${formatMoney(l.amountTotalCents, session.currency || 'usd')}</td></tr>`
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family:system-ui,sans-serif;background:#0c0a09;color:#e7e5e4;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#1c1917;border:1px solid #44403c;border-radius:12px;padding:24px;">
    <h1 style="color:#fbbf24;font-size:22px;margin:0 0 8px;">DJ Cuisine</h1>
    <p style="margin:0 0 16px;color:#a8a29e;">Order <strong style="color:#fff;">${escapeHtml(orderNumber)}</strong></p>
    <p style="font-size:18px;color:#fff;margin:0 0 20px;">Total: ${escapeHtml(total)}</p>
    <pre style="white-space:pre-wrap;color:#d6d3d1;font-size:13px;background:#0c0a09;padding:12px;border-radius:8px;">${escapeHtml(shipBlock)}</pre>
    <table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:14px;">
      <thead><tr><th align="left" style="padding:8px;border-bottom:1px solid #57534e">Item</th><th style="padding:8px;border-bottom:1px solid #57534e">Qty</th><th align="right" style="padding:8px;border-bottom:1px solid #57534e">Amount</th></tr></thead>
      <tbody>${rowsHtml}</tbody>
    </table>
    <p style="margin-top:24px;color:#a8a29e;font-size:13px;">Questions? Reply to this email or call us.</p>
  </div>
</body>
</html>`;

  return { text, html };
}

export async function sendOrderEmails(params: {
  orderNumber: string;
  session: Stripe.Checkout.Session;
  lines: LineItemRow[];
  sessionId: string;
}): Promise<void> {
  const { orderNumber, session, lines, sessionId } = params;
  const { text, html } = buildOrderEmailBodies({ orderNumber, session, lines });
  const adminTo = process.env.ADMIN_ORDER_EMAIL?.trim();
  const customerEmail =
    session.customer_details?.email || session.customer_email || undefined;
  const sendCustomerCopy =
    Boolean(customerEmail) &&
    process.env.ORDER_CONFIRMATION_EMAIL_TO_CUSTOMER !== 'false';

  if (adminTo) {
    await sendResendEmail({
      to: adminTo,
      subject: `[DJ Cuisine] New order ${orderNumber}`,
      text: `[ADMIN]\n\n${text}`,
      html: `<p style="color:#f59e0b;font-weight:bold">New order (admin)</p>${html}`,
      idempotencyKey: `${sessionId}:admin`,
    });
  } else {
    console.warn('[Email] ADMIN_ORDER_EMAIL not set');
  }

  if (sendCustomerCopy && customerEmail) {
    await sendResendEmail({
      to: customerEmail,
      subject: `Order confirmed — ${orderNumber} — DJ Cuisine`,
      text,
      html,
      idempotencyKey: `${sessionId}:customer`,
    });
  }
}
