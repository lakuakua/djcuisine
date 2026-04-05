# Email System Architecture

## Email Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    DJ Cuisine Order Flow                        │
└─────────────────────────────────────────────────────────────────┘

1. CUSTOMER PLACES ORDER
   ↓
   Stripe Checkout Session Created
   ↓

2. PAYMENT PROCESSING
   ↓
   Customer completes payment
   ↓

3. STRIPE WEBHOOK (POST /api/webhooks/stripe/route.ts)
   ↓
   Event: checkout.session.completed
   ↓
   ├─ Create Order in Database
   ├─ Create Shipment with Easyship
   └─ Get Tracking Number + Estimated Delivery Date
   ↓

4. EMAIL NOTIFICATIONS (via Resend SDK)
   ├─ CUSTOMER EMAIL
   │  │  Recipient: order.customerEmail
   │  │  Template: buildShippingNotificationEmail()
   │  │  Content:
   │  │  ├─ Order number & date
   │  │  ├─ Tracking number + carrier link
   │  │  ├─ Estimated delivery date
   │  │  ├─ Shipping address
   │  │  ├─ Order summary (items, total)
   │  │  └─ Perishable handling instructions
   │  └─ Sent via: Resend (onboarding@resend.dev or verified domain)
   │
   └─ ADMIN EMAIL
      │  Recipient: ADMIN_EMAIL env var
      │  Template: sendAdminShippingNotificationEmail()
      │  Content:
      │  ├─ Order number
      │  ├─ Customer email
      │  ├─ Order total
      │  ├─ Carrier
      │  └─ Tracking number
      └─ Sent via: Resend (same sender)
   ↓

5. DELIVERY TRACKING (continuous)
   ↓
   Easyship Webhook updates tracking status
   ├─ In Transit
   ├─ Out for Delivery
   └─ Delivered
   ↓
   Optional: Send additional status emails
```

## System Components

```
┌──────────────────────────────────────────────────────────────┐
│                    RESEND INFRASTRUCTURE                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  API Endpoint: https://api.resend.com/emails                │
│  Authentication: Bearer {RESEND_API_KEY}                    │
│  Sender Domain: onboarding@resend.dev (test)                │
│               or verified domain (production)               │
│  Rate Limit: 5 requests/second per team                     │
│  Idempotency: Unique keys prevent duplicate sends          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
         ↑
         │ API Calls (via resend package)
         │
┌────────┴──────────────────────────────────────────────────────┐
│              DJ CUISINE EMAIL SERVICE                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  File: lib/email/resend.ts                                  │
│  ├─ getResendClient()                                       │
│  │  └─ Initializes Resend SDK with API key                │
│  │                                                          │
│  ├─ sendResendEmail(params)                                │
│  │  ├─ Core function using official SDK                   │
│  │  ├─ Error handling: { data, error } pattern            │
│  │  ├─ Idempotency key support                            │
│  │  └─ Logging + monitoring                               │
│  │                                                          │
│  ├─ sendShippingNotificationEmail(params)                 │
│  │  ├─ Customer-facing shipping notification              │
│  │  ├─ Uses: buildShippingNotificationEmail() template   │
│  │  └─ Called on order shipment                           │
│  │                                                          │
│  └─ sendAdminShippingNotificationEmail(params)            │
│     ├─ Admin-facing order alert                           │
│     ├─ Includes tracking + order summary                  │
│     └─ Called on order shipment                           │
│                                                              │
│  File: lib/email/templates/shippingNotification.ts         │
│  ├─ buildShippingNotificationEmail()                       │
│  │  ├─ Builds HTML template                               │
│  │  ├─ Builds plain text version                          │
│  │  └─ Includes all order details                         │
│  │                                                          │
│  └─ Returns: { html, text }                               │
│                                                              │
│  File: app/api/test-email/route.ts                         │
│  └─ POST /api/test-email                                  │
│     ├─ For development testing                            │
│     ├─ Sends test notification                            │
│     └─ Returns: { success, results }                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
         ↑
         │ Called from
         │
┌────────┴──────────────────────────────────────────────────────┐
│              INTEGRATION POINTS                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Stripe Webhook Handler                                  │
│     File: app/api/webhooks/stripe/route.ts                 │
│     Event: checkout.session.completed                      │
│     ├─ Creates Order record                                │
│     ├─ Creates Easyship Shipment                           │
│     └─ Calls sendShippingNotificationEmail()              │
│                                                              │
│  2. Easyship Integration                                    │
│     File: lib/easyship/                                    │
│     Data Collected:                                        │
│     ├─ tracking number                                     │
│     ├─ carrier (UPS, FedEx, etc.)                         │
│     ├─ estimated delivery date                             │
│     └─ Passed to email template                           │
│                                                              │
│  3. Database (Prisma)                                       │
│     File: prisma/schema.prisma                             │
│     Model: Order                                           │
│     ├─ Stores customer email                              │
│     ├─ Stores order details                               │
│     ├─ Tracks email status                                │
│     └─ Tracks shipment info                               │
│                                                              │
│  4. Test Endpoint (Development)                            │
│     File: app/api/test-email/route.ts                      │
│     Purpose: Manual testing without webhook               │
│     ├─ Generate test shipping notification                │
│     └─ Verify email sending works                         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow

```
Customer Checkout
    ↓
Stripe Payment
    ↓
checkout.session.completed Webhook
    ↓
Order Created {
  id: "ord_123",
  customerEmail: "customer@example.com",
  orderNumber: "ORD-20260331-001",
  total: 4800,
  status: "PAYMENT_PROCESSING"
}
    ↓
Easyship Shipment Created {
  trackingNumber: "1Z999AA10123456784",
  carrier: "UPS",
  estimatedDeliveryDate: "2026-04-02",
  status: "LABEL_CREATED"
}
    ↓
sendShippingNotificationEmail({
  orderNumber: "ORD-20260331-001",
  customerEmail: "customer@example.com",
  customerName: "John Doe",
  orderTotal: 4800,
  currency: "USD",
  trackingNumber: "1Z999AA10123456784",
  carrier: "UPS",
  estimatedDeliveryDate: "2026-04-02",
  shippingAddress: {...},
  orderDate: "2026-03-31T20:30:00Z"
})
    ↓
buildShippingNotificationEmail() creates:
{
  html: "<html>...<h1>Your Order Has Shipped!</h1>...",
  text: "Your Order Has Shipped!..."
}
    ↓
Resend API Call:
{
  from: "DJ Cuisine <onboarding@resend.dev>",
  to: "customer@example.com",
  subject: "Your DJ Cuisine Order #ORD-20260331-001 Has Shipped! 📦",
  html: "...",
  text: "...",
  idempotencyKey: "shipping-ORD-20260331-001"
}
    ↓
Resend Response:
{
  data: { id: "msg_abc123..." },
  error: null
}
    ↓
Email Delivered ✅
```

## Environment Variable Flow

```
.env.local (or Vercel deployment)
    ├─ RESEND_API_KEY
    │  └─ lib/email/resend.ts → getResendClient()
    │
    ├─ ORDER_EMAIL_FROM
    │  └─ lib/email/resend.ts → sendResendEmail({ from })
    │
    └─ ADMIN_EMAIL
       └─ lib/email/resend.ts → sendAdminShippingNotificationEmail()
```

## Error Handling Flow

```
sendResendEmail() called
    ↓
try {
    getResendClient() → Validates RESEND_API_KEY
    ↓
    resend.emails.send({...}) → API Call
    ↓
    Response: { data, error }
        ├─ If error: Log error, return false
        └─ If success: Log message ID, return true
}
catch (error) {
    Log exception
    return false
}
```

## Testing Flow (Development)

```
Manual Test via cURL
    ↓
POST /api/test-email
{
  "orderNumber": "ORD-TEST-001",
  "customerEmail": "delivered@resend.dev",
  "orderTotal": 12500
}
    ↓
sendShippingNotificationEmail() → ✅ SUCCESS (test address)
sendAdminShippingNotificationEmail() → ✅ SUCCESS
    ↓
Response:
{
  "success": true,
  "results": {
    "customerEmail": { "sent": true, "to": "delivered@resend.dev" },
    "adminEmail": { "sent": true },
    "order": { "orderNumber": "ORD-TEST-001", "total": "$125.00" }
  }
}
```

## Production Deployment Checklist

```
Pre-Launch
├─ [ ] Verify domain at https://resend.com/domains
├─ [ ] Add DNS records (SPF, DKIM)
├─ [ ] Wait 24-48 hours for propagation
├─ [ ] Update RESEND_API_KEY (production key)
├─ [ ] Update ORDER_EMAIL_FROM (verified domain)
├─ [ ] Update ADMIN_EMAIL
├─ [ ] Deploy to production
└─ [ ] Test with real customer order

Integration
├─ [ ] Stripe webhook calls email functions
├─ [ ] Easyship provides tracking data
├─ [ ] Order database stores email status
├─ [ ] Admin receives notifications
├─ [ ] Customer receives notifications
└─ [ ] Monitor for failed sends

Monitoring
├─ [ ] Log all email sends
├─ [ ] Alert on send failures
├─ [ ] Track bounce/complaint rates
├─ [ ] Review email templates regularly
└─ [ ] Monitor Resend dashboard for issues
```

---

This architecture ensures reliable, production-ready email notifications using Resend's official Node.js SDK with proper error handling, idempotency, and monitoring.
