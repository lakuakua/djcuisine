/**
 * Pickup notification email template
 * Sent when order is ready for pickup at local location
 */

export interface PickupNotificationData {
  orderNumber: string;
  customerName?: string;
  orderTotal: number;
  currency: string;
  pickupAddress: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  };
  pickupDateTime?: string;
  items?: Array<{ name: string; quantity: number }>;
}

export function buildPickupNotificationEmail(data: PickupNotificationData) {
  const formatMoney = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: data.currency.toUpperCase(),
    }).format(cents / 100);
  };

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; }
    .header { background-color: #1f2937; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { background-color: white; padding: 30px; border-radius: 0 0 8px 8px; }
    .section { margin-bottom: 25px; }
    .section-title { font-weight: 600; color: #1f2937; font-size: 16px; margin-bottom: 10px; }
    .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .info-row:last-child { border-bottom: none; }
    .label { color: #6b7280; font-weight: 500; }
    .value { color: #1f2937; font-weight: 600; }
    .highlight-box { background-color: #dcfce7; border-left: 4px solid #22c55e; padding: 15px; margin: 15px 0; border-radius: 4px; }
    .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
    .address-box { background-color: #f3f4f6; padding: 15px; border-radius: 4px; margin: 10px 0; }
    .address-line { margin: 5px 0; color: #1f2937; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Your Order is Ready!</h1>
    </div>
    <div class="content">
      <p>Hi${data.customerName ? ' ' + data.customerName : ''},</p>
      
      <p>Great news! Your DJ Cuisine order <strong>#${data.orderNumber}</strong> is ready for pickup.</p>
      
      <div class="highlight-box">
        <p style="margin-top: 0; margin-bottom: 10px; font-weight: 600; color: #166534;">✓ Please pick up your order at the location below</p>
        <p style="margin: 0; color: #166534;">We'll notify you when it's available. Please call ahead to confirm the pickup time.</p>
      </div>

      <div class="section">
        <div class="section-title">📍 Pickup Location</div>
        <div class="address-box">
          <div class="address-line"><strong>${data.pickupAddress.line1}</strong></div>
          <div class="address-line">${data.pickupAddress.city}, ${data.pickupAddress.state} ${data.pickupAddress.postalCode}</div>
          <div class="address-line"><strong>Phone:</strong> ${data.pickupAddress.phone}</div>
          ${data.pickupDateTime ? `<div class="address-line"><strong>Estimated Ready:</strong> ${data.pickupDateTime}</div>` : ''}
        </div>
      </div>

      <div class="section">
        <div class="section-title">📋 Order Details</div>
        <div class="info-row">
          <span class="label">Order Number:</span>
          <span class="value">#${data.orderNumber}</span>
        </div>
        <div class="info-row">
          <span class="label">Order Total:</span>
          <span class="value">${formatMoney(data.orderTotal)}</span>
        </div>
      </div>

      ${data.items && data.items.length > 0 ? `
      <div class="section">
        <div class="section-title">🛍️ Items in Your Order</div>
        <ul style="padding-left: 20px;">
          ${data.items.map(item => `<li>${item.name} (Qty: ${item.quantity})</li>`).join('')}
        </ul>
      </div>
      ` : ''}

      <div class="section" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px;">
        <p style="margin-top: 0; margin-bottom: 10px; font-weight: 600; color: #92400e;">⚠️ Important Reminder</p>
        <p style="margin: 0; color: #92400e;">Our food items are perishable and must be refrigerated or frozen immediately upon pickup. Please ensure someone is available to receive your order promptly.</p>
      </div>

      <div class="section">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">If you have any questions or need to reschedule your pickup, please don't hesitate to contact us.</p>
      </div>

      <div class="footer">
        <p>Thank you for ordering from DJ Cuisine!</p>
        <p>This is an automated email. Please do not reply directly.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  return { html, subject: `Your Order #${data.orderNumber} is Ready for Pickup!` };
}
