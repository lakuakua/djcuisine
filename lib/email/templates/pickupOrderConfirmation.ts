/**
 * Pickup order confirmation email template
 * Sent immediately after order is placed with pickup option
 */

interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PickupOrderConfirmationData {
  orderNumber: string;
  customerName?: string;
  orderTotal: number;
  currency: string;
  items?: OrderItem[];
  handlingFee?: number;
  tax?: number;
  orderDate: string;
  /** Long calendar date (no time) */
  scheduledPickupDisplay?: string;
  pickupAddress: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  };
}

export function buildPickupOrderConfirmationEmail(data: PickupOrderConfirmationData) {
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
    .order-items-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    .order-items-table th { background-color: #f3f4f6; padding: 12px; text-align: left; font-weight: 600; border-bottom: 2px solid #e5e7eb; }
    .order-items-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
    .order-items-table tr:last-child td { border-bottom: none; }
    .item-name { color: #1f2937; font-weight: 500; }
    .item-qty { text-align: center; color: #6b7280; }
    .item-price { text-align: right; color: #1f2937; font-weight: 600; }
    .order-summary-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    .order-summary-table tr { border-bottom: 1px solid #e5e7eb; }
    .order-summary-table td { padding: 10px 0; }
    .order-summary-table tr:last-child { border-bottom: none; }
    .summary-label { text-align: right; color: #6b7280; font-weight: 500; }
    .summary-value { text-align: right; color: #1f2937; font-weight: 600; }
    .summary-total { font-weight: 700; font-size: 18px; }
    .address-box { background-color: #f3f4f6; padding: 15px; border-radius: 4px; margin: 10px 0; }
    .address-line { margin: 5px 0; color: #1f2937; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✓ Order Confirmed</h1>
    </div>
    <div class="content">
      <p>Hi${data.customerName ? ' ' + data.customerName : ''},</p>
      
      <p>Thank you for your order! We've received your order and it's being prepared. This email serves as your order confirmation and receipt.</p>

      <div class="section" style="background-color: #f8fafc; border: 1px solid #e5e7eb; padding: 14px; border-radius: 6px;">
        <div class="section-title">🧾 Receipt</div>
        <div class="info-row">
          <span class="label">Amount Paid</span>
          <span class="value">${formatMoney(data.orderTotal)}</span>
        </div>
        <div class="info-row">
          <span class="label">Payment Method</span>
          <span class="value">Card</span>
        </div>
        <div class="info-row">
          <span class="label">Paid On</span>
          <span class="value">${data.orderDate}</span>
        </div>
      </div>
      
      <div class="highlight-box">
        <p style="margin-top: 0; margin-bottom: 10px; font-weight: 600; color: #166534;">📍 Local Pickup Selected</p>
        <p style="margin: 0; color: #166534;">Your order will be ready for pickup at our location. We'll email you when it's ready to be picked up.</p>
      </div>

      ${
        data.scheduledPickupDisplay
          ? `
      <div class="section" style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 14px; border-radius: 6px;">
        <div class="section-title" style="margin-bottom: 6px;">📅 Your requested pickup date</div>
        <p style="margin: 0; color: #1e3a8a; font-weight: 600;">${data.scheduledPickupDisplay}</p>
        <p style="margin: 8px 0 0; color: #64748b; font-size: 13px;">Chosen date is at least 24 hours after your order so we can prepare. If you need to change it, reply to this email or call the pickup line.</p>
      </div>
      `
          : ''
      }

      <div class="section">
        <div class="section-title">📍 Pickup Location</div>
        <div class="address-box">
          <div class="address-line"><strong>${data.pickupAddress.line1}</strong></div>
          <div class="address-line">${data.pickupAddress.city}, ${data.pickupAddress.state} ${data.pickupAddress.postalCode}</div>
          <div class="address-line"><strong>Phone:</strong> ${data.pickupAddress.phone}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">📋 Order Summary</div>
        <div class="info-row">
          <span class="label">Order Number:</span>
          <span class="value">#${data.orderNumber}</span>
        </div>
        <div class="info-row">
          <span class="label">Order Date:</span>
          <span class="value">${data.orderDate}</span>
        </div>
      </div>

      ${data.items && data.items.length > 0 ? `
      <div class="section">
        <div class="section-title">🛍️ Order Items</div>
        <table class="order-items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th class="item-qty">Qty</th>
              <th class="item-price">Unit Price</th>
              <th class="item-price">Total</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map(item => `
            <tr>
              <td class="item-name">${item.name}</td>
              <td class="item-qty">${item.quantity}</td>
              <td class="item-price">${formatMoney(item.unitPrice)}</td>
              <td class="item-price">${formatMoney(item.totalPrice)}</td>
            </tr>
            `).join('')}
          </tbody>
        </table>

        <table class="order-summary-table">
          <tbody>
            <tr>
              <td class="summary-label">Subtotal:</td>
              <td class="summary-value">${formatMoney(data.items.reduce((sum, item) => sum + item.totalPrice, 0))}</td>
            </tr>
            ${data.handlingFee ? `
            <tr>
              <td class="summary-label">Handling Fee:</td>
              <td class="summary-value">${formatMoney(data.handlingFee)}</td>
            </tr>
            ` : ''}
            ${data.tax ? `
            <tr>
              <td class="summary-label">Tax:</td>
              <td class="summary-value">${formatMoney(data.tax)}</td>
            </tr>
            ` : ''}
            <tr style="border-top: 2px solid #1f2937;">
              <td class="summary-label summary-total">Total:</td>
              <td class="summary-value summary-total">${formatMoney(data.orderTotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      ` : ''}

      <div class="section" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px;">
        <p style="margin-top: 0; margin-bottom: 10px; font-weight: 600; color: #92400e;">⚠️ Important Reminder</p>
        <p style="margin: 0; color: #92400e;">Our food items are perishable. Please pick up your order promptly when notified and refrigerate or freeze immediately.</p>
      </div>

      <div class="section">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">You will receive another email when your order is ready for pickup. Thank you for choosing DJ Cuisine!</p>
      </div>

      <div class="footer">
        <p>Questions? Contact us or call the pickup location.</p>
        <p>This is an automated email. Please do not reply directly.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  return { html, subject: `Order Confirmation & Receipt #${data.orderNumber} - Local Pickup` };
}
