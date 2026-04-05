/**
 * Order confirmation email template
 * Sent immediately after order is placed (no tracking info yet)
 */

interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderConfirmationData {
  orderNumber: string;
  customerName?: string;
  orderTotal: number;
  currency: string;
  items?: OrderItem[];
  shippingCost?: number;
  handlingFee?: number;
  tax?: number;
  orderDate: string;
}

export function buildOrderConfirmationEmail(data: OrderConfirmationData) {
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
    .highlight-box { background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 15px 0; border-radius: 4px; }
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
    .order-summary-table tr:last-child { border-bottom: none; }
    .order-summary-table td { padding: 10px 0; }
    .summary-label { text-align: right; padding-right: 20px; color: #6b7280; }
    .summary-value { text-align: right; font-weight: 600; color: #1f2937; }
    .summary-total { background-color: #f3f4f6; font-weight: bold; font-size: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Your Order Confirmed!</h1>
    </div>
    <div class="content">
      <div class="section">
        <p style="font-size: 16px;">Hi${data.customerName ? ' ' + data.customerName : ''},</p>
        <p>Thank you for your order! We've received your payment and your order is being prepared. This email serves as your order confirmation and receipt.</p>
      </div>

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
          <span class="value">${new Date(data.orderDate).toLocaleDateString()}</span>
        </div>
      </div>

      <!-- ORDER DETAILS SECTION -->
      <div style="background-color: #f0f9ff; border: 2px solid #0284c7; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
        <div class="section-title" style="color: #0284c7; font-size: 18px; margin-bottom: 15px;">📋 Your Order Details</div>
        
        <div class="section">
          <div class="info-row">
            <span class="label">Order Number</span>
            <span class="value">${data.orderNumber}</span>
          </div>
          <div class="info-row">
            <span class="label">Order Date</span>
            <span class="value">${new Date(data.orderDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title" style="margin-top: 15px;">Items</div>
          <table class="order-items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th class="item-qty">Qty</th>
                <th class="item-price">Price</th>
              </tr>
            </thead>
            <tbody>
              ${
                data.items && data.items.length > 0
                  ? data.items
                      .map(
                        (item) =>
                          `<tr>
                        <td class="item-name">${item.name}</td>
                        <td class="item-qty">${item.quantity}</td>
                        <td class="item-price">${formatMoney(item.totalPrice)}</td>
                      </tr>`
                      )
                      .join('')
                  : '<tr><td colspan="3" style="color: #999; text-align: center;">No items details available</td></tr>'
              }
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title" style="margin-top: 15px;">Order Summary</div>
          <table class="order-summary-table">
            <tr>
              <td class="summary-label">Subtotal:</td>
              <td class="summary-value">${formatMoney(data.items ? data.items.reduce((sum, item) => sum + item.totalPrice, 0) : data.orderTotal)}</td>
            </tr>
            ${data.handlingFee ? `<tr><td class="summary-label">Handling Fee:</td><td class="summary-value">${formatMoney(data.handlingFee)}</td></tr>` : ''}
            ${data.shippingCost ? `<tr><td class="summary-label">Shipping:</td><td class="summary-value">${formatMoney(data.shippingCost)}</td></tr>` : ''}
            ${data.tax ? `<tr><td class="summary-label">Tax:</td><td class="summary-value">${formatMoney(data.tax)}</td></tr>` : ''}
            <tr class="summary-total">
              <td class="summary-label">Total:</td>
              <td class="summary-value">${formatMoney(data.orderTotal)}</td>
            </tr>
          </table>
        </div>
      </div>

      <div class="highlight-box">
        <strong>📦 Next Step:</strong> We're preparing your order. You'll receive a shipping confirmation email with tracking details once your order ships.
      </div>

      <div style="margin-top: 30px; padding: 20px; background-color: #f3f4f6; border-radius: 6px;">
        <p style="margin: 0; color: #555;">
          If you have any questions about your order, reply to this email or contact us at <strong>orders@djcuisine.com</strong> or <strong>(979) 221-3114</strong>
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
✅ Your Order Confirmed!
──────────────────────────────────────

Hi${data.customerName ? ' ' + data.customerName : ''},

Thank you for your order! We've received your payment and your order is being prepared. This email serves as your order confirmation and receipt.

RECEIPT
Amount Paid: ${formatMoney(data.orderTotal)}
Payment Method: Card
Paid On: ${new Date(data.orderDate).toLocaleDateString()}

YOUR ORDER DETAILS
──────────────────────────────────────
Order Number: ${data.orderNumber}
Order Date: ${new Date(data.orderDate).toLocaleDateString()}

ITEMS ORDERED
${
  data.items && data.items.length > 0
    ? data.items
        .map((item) => `- ${item.name} (Qty: ${item.quantity}) ............. ${formatMoney(item.totalPrice)}`)
        .join('\n')
    : 'No item details available'
}

ORDER SUMMARY
${
  data.items
    ? `Subtotal: ${formatMoney(data.items.reduce((sum, item) => sum + item.totalPrice, 0))}`
    : `Subtotal: ${formatMoney(data.orderTotal)}`
}
${data.handlingFee ? `Handling Fee: ${formatMoney(data.handlingFee)}` : ''}
${data.shippingCost ? `Shipping: ${formatMoney(data.shippingCost)}` : ''}
${data.tax ? `Tax: ${formatMoney(data.tax)}` : ''}
─────────────────────────────
TOTAL: ${formatMoney(data.orderTotal)}

NEXT STEP
──────────────────────────────────────

We're preparing your order. You'll receive a shipping confirmation email with tracking details once your order ships.

════════════════════════════════════════

If you have any questions, contact us at orders@djcuisine.com or (979) 221-3114

---
DJ Cuisine — The Best BBQ in H-Town
This is an automated message, please do not reply directly.
  `;

  return {
    html,
    text,
    subject: `Order Confirmation & Receipt #${data.orderNumber}`,
  };
}
