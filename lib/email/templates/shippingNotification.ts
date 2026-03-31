/**
 * Shipping notification email template
 * Sent when order ships via Easyship (with tracking info)
 */

export interface ShippingNotificationData {
  orderNumber: string;
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
}

export function buildShippingNotificationEmail(data: ShippingNotificationData) {
  const shippingAddress = data.shippingAddress
    ? `${data.shippingAddress.name || ''}<br/>
${data.shippingAddress.line1 || ''}<br/>
${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postal_code || ''}`
    : 'Address not available';

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
    .highlight-box { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; border-radius: 4px; }
    .tracking-box { background-color: #eff6ff; border: 2px solid #3b82f6; padding: 20px; border-radius: 6px; margin: 20px 0; text-align: center; }
    .tracking-number { font-size: 18px; font-weight: bold; color: #1e40af; font-family: monospace; margin: 10px 0; }
    .tracking-link { display: inline-block; margin-top: 10px; }
    .tracking-link a { background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
    .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📦 Your Order Has Shipped!</h1>
    </div>
    <div class="content">
      <div class="section">
        <p style="font-size: 16px;">Hi${data.customerName ? ' ' + data.customerName : ''},</p>
        <p>Great news! Your order #${data.orderNumber} has been shipped and is on its way to you!</p>
      </div>

      <!-- TRACKING INFO SECTION -->
      <div style="background-color: #eff6ff; border: 2px solid #3b82f6; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
        <div class="section-title" style="color: #3b82f6; font-size: 18px; margin-bottom: 15px;">🚚 Tracking Information</div>
        
        <div class="tracking-box">
          <div style="color: #3b82f6; font-weight: 600; margin-bottom: 10px;">Your Tracking Number</div>
          <div class="tracking-number">${data.trackingNumber}</div>
          <div style="color: #666; font-size: 14px; margin-top: 5px;">Via ${data.carrier}</div>
          <div class="tracking-link">
            <a href="https://www.${data.carrier?.toLowerCase().includes('ups') ? 'ups' : data.carrier?.toLowerCase().includes('fedex') ? 'fedex' : 'usps'}.com" target="_blank">
              Track Your Package
            </a>
          </div>
        </div>

        <div class="section" style="margin-top: 15px;">
          <div class="section-title">Delivery Details</div>
          <div class="info-row">
            <span class="label">Carrier</span>
            <span class="value">${data.carrier}</span>
          </div>
          <div class="info-row">
            <span class="label">Estimated Delivery</span>
            <span class="value">${new Date(data.estimatedDeliveryDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div class="section" style="margin-top: 15px;">
          <div class="section-title">Shipping To</div>
          <div style="color: #555; line-height: 1.8; padding: 10px 0;">
            ${shippingAddress}
          </div>
        </div>

        <div class="highlight-box" style="margin-top: 15px;">
          <strong>⏰ Important:</strong> Please plan to be available to receive your package. Our BBQ items need to be stored in the refrigerator/freezer immediately upon arrival.
        </div>
      </div>

      <div style="margin-top: 30px; padding: 20px; background-color: #f3f4f6; border-radius: 6px;">
        <p style="margin: 0; color: #555;">
          If you have any questions about your order or shipment, reply to this email or contact us at <strong>support@djcuisine.com</strong>
        </p>
      </div>

      <div class="footer">
        <p>DJ Cuisine — The Best BBQ in H-Town<br/>
        This is an automated message, please do not reply directly.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
📦 Your Order Has Shipped!
──────────────────────────────────────

Hi${data.customerName ? ' ' + data.customerName : ''},

Great news! Your order #${data.orderNumber} has been shipped and is on its way to you!

TRACKING INFORMATION
──────────────────────────────────────
Tracking Number: ${data.trackingNumber}
Carrier: ${data.carrier}
Estimated Delivery: ${new Date(data.estimatedDeliveryDate).toLocaleDateString()}

SHIPPING TO
──────────────────────────────────────
${data.shippingAddress ? `${data.shippingAddress.name || ''}\n${data.shippingAddress.line1 || ''}\n${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postal_code || ''}` : 'Address not available'}

IMPORTANT: Please plan to be available to receive your package. Our BBQ items need to be stored in the refrigerator/freezer immediately upon arrival.

════════════════════════════════════════

If you have any questions, contact us at support@djcuisine.com

---
DJ Cuisine — The Best BBQ in H-Town
This is an automated message, please do not reply directly.
  `;

  return { html, text };
}
