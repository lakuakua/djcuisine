# Resend Email Setup Guide for DJ Cuisine

This guide follows [Resend's official Node.js documentation](https://resend.com/docs/send-with-nodejs) to set up transactional email notifications for DJ Cuisine.

## Prerequisites

Before proceeding, complete the following:

1. **Create a Resend Account**: Visit [https://resend.com](https://resend.com) and sign up
2. **Generate an API Key**: Go to [https://resend.com/api-keys](https://resend.com/api-keys) and create a new API key
3. **Store the API Key**: Add `RESEND_API_KEY` to your `.env.local` file (see Configuration section)

## Installation

The Resend Node.js SDK is already installed:

```bash
npm install resend
```

If not installed, run the command above.

## Configuration

### Environment Variables

Set these required environment variables in `.env.local`:

```env
# Resend API Key (from https://resend.com/api-keys)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx

# Sender email address
# For testing: use onboarding@resend.dev (Resend's default test domain)
# For production: verify your domain at https://resend.com/domains and use your verified domain
ORDER_EMAIL_FROM="DJ Cuisine <onboarding@resend.dev>"

# Admin notification email (for order alerts)
ADMIN_EMAIL=orders@djcuisine.com
```

### API Key Setup

1. Navigate to [https://resend.com/api-keys](https://resend.com/api-keys)
2. Click "Create API Key"
3. Copy the key
4. Add to `.env.local` as `RESEND_API_KEY`
5. **Important**: Never commit `.env.local` to Git (already in `.gitignore`)

## Email Sending Implementation

### Core Implementation

Our email system uses the official Resend SDK with best practices:

```typescript
// lib/email/resend.ts
import { Resend } from 'resend';

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('[Email] RESEND_API_KEY environment variable is not set');
  }
  return new Resend(apiKey);
}

export async function sendResendEmail(params: SendEmailParams): Promise<boolean> {
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
    idempotencyKey: params.idempotencyKey,
  });

  if (error) {
    console.error('[Email] Resend error:', error);
    return false;
  }

  console.log(`[Email] Sent successfully. Message ID: ${data?.id}`);
  return true;
}
```

**Key Implementation Details:**

1. **Resend SDK**: Uses official `resend` package instead of raw HTTP
2. **Error Handling**: Follows Resend's `{ data, error }` pattern (not throw)
3. **Idempotency**: Includes `idempotencyKey` to prevent duplicate sends
4. **Validation**: Checks for required environment variables with helpful errors

## Email Templates

### Shipping Notification Email (Customer)

Sent when an order ships with tracking information:

```typescript
// lib/email/templates/shippingNotification.ts
export function buildShippingNotificationEmail(data: ShippingNotificationData) {
  const html = `
    <!DOCTYPE html>
    <html>
      <body>
        <h1>📦 Your Order Has Shipped!</h1>
        <p>Order #${data.orderNumber}</p>
        ${data.trackingNumber ? `
          <p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
          <p><a href="https://tracking.ups.com">Track Your Package</a></p>
        ` : ''}
        <p><strong>Estimated Delivery:</strong> ${data.estimatedDeliveryDate}</p>
        <p><em>⚠️ Please be available to receive your order. Our products are perishable and must be refrigerated immediately.</em></p>
      </body>
    </html>
  `;
  // ... plain text version
  return { html, text };
}
```

### Admin Notification Email

Sent to admin when orders ship for monitoring:

```typescript
export async function sendAdminShippingNotificationEmail(params: {
  orderNumber: string;
  customerEmail: string;
  orderTotal: number;
  carrier?: string;
  trackingNumber?: string;
}): Promise<boolean> {
  // ... admin email logic
}
```

## Testing Email Sending

### Test Endpoint

A test endpoint is available at `POST /api/test-email` for development:

```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "orderNumber": "ORD-10025",
    "customerEmail": "balogunkunle@gmail.com",
    "orderTotal": 48000
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "results": {
    "customerEmail": {
      "sent": true,
      "to": "balogunkunle@gmail.com",
      "type": "Shipping Notification"
    },
    "adminEmail": {
      "sent": true,
      "type": "Admin Alert"
    },
    "order": {
      "orderNumber": "ORD-10025",
      "total": "$480.00",
      "tracking": "1Z999AA10123456784"
    }
  }
}
```

### Testing in Development (Sandbox Mode)

For testing without sending real emails:

**Option 1: Use Resend's Test Domain** (Recommended for MVP)

```env
ORDER_EMAIL_FROM="DJ Cuisine <onboarding@resend.dev>"
```

Test addresses that work with this setup:
- `delivered@resend.dev` - Email successfully delivered
- `bounced@resend.dev` - Email bounced
- `complained@resend.dev` - Email marked as spam
- `suppressed@resend.dev` - Email suppressed

**Option 2: Use Real Domain** (Production)

1. Verify your domain at [https://resend.com/domains](https://resend.com/domains)
2. Add your domain's DNS records (SPF, DKIM)
3. Update `.env.local`:
   ```env
   ORDER_EMAIL_FROM="DJ Cuisine <orders@djcuisine.com>"
   ```

## Resend Best Practices

### ✅ DO

1. **Store API key in environment variables**: Never hardcode keys
   ```typescript
   const apiKey = process.env.RESEND_API_KEY;
   ```

2. **Use the official Resend SDK**: Import from `resend` package
   ```typescript
   import { Resend } from 'resend';
   ```

3. **Handle errors properly**: Check `{ data, error }` response
   ```typescript
   const { data, error } = await resend.emails.send({...});
   if (error) { console.error(error); }
   ```

4. **Use idempotency keys**: Prevent duplicate emails on retry
   ```typescript
   idempotencyKey: `shipping-${orderNumber}`
   ```

5. **Include both HTML and text**: Fallback for email clients
   ```typescript
   {
     html: '<p>Order shipped</p>',
     text: 'Order shipped'
   }
   ```

6. **Use camelCase parameters**: Resend SDK uses camelCase
   ```typescript
   // ✅ Correct
   { idempotencyKey: '...', scheduledAt: '...' }
   
   // ❌ Wrong
   { idempotency_key: '...', scheduled_at: '...' }
   ```

### ❌ DON'T

1. **Don't hardcode API keys**: Always use environment variables
2. **Don't use `try/catch` for Resend errors**: Use `{ data, error }` pattern instead
3. **Don't mix snake_case with Resend SDK**: Use camelCase parameters
4. **Don't send from unverified domains in production**: Verify at https://resend.com/domains
5. **Don't use `onboarding@resend.dev` in production**: It's for testing only
6. **Don't import from `@resend/node`**: Package is just `resend`

## Integration Points

### Stripe Webhook Handler

When a payment succeeds, automatically send shipping notifications:

```typescript
// app/api/webhooks/stripe/route.ts
import { sendShippingNotificationEmail, sendAdminShippingNotificationEmail } from '@/lib/email/resend';

if (event.type === 'checkout.session.completed') {
  // Create shipment with Easyship
  const shipment = await createEasyshipShipment(order);
  
  // Send emails
  await sendShippingNotificationEmail({
    orderNumber: order.id,
    customerEmail: order.customerEmail,
    // ... other params
  });
  
  await sendAdminShippingNotificationEmail({
    orderNumber: order.id,
    // ... other params
  });
}
```

## Troubleshooting

### "RESEND_API_KEY is not set"

**Cause**: Environment variable not configured

**Solution**:
1. Add `RESEND_API_KEY=re_xxx` to `.env.local`
2. Restart dev server: `npm run dev`

### "The domain is not verified"

**Cause**: Using an unverified domain in production

**Solution**:
1. For testing: Use `onboarding@resend.dev` (no verification needed)
2. For production:
   - Verify your domain at https://resend.com/domains
   - Add DNS records (Resend provides instructions)
   - Wait 24-48 hours for DNS propagation
   - Update `ORDER_EMAIL_FROM` to use verified domain

### Email sends to `orders@djcuisine.com` but not external addresses

**Cause**: Test mode restrictions when using test domain

**Solution**:
1. Verify your domain (see "The domain is not verified" above)
2. Or use Resend's test email addresses (delivered@resend.dev, etc.)

### "Unexpected token" JSON error

**Cause**: Malformed JSON in API request (usually from smart quotes in `curl`)

**Solution**: Use straight quotes in `curl`:
```bash
# ✅ Correct
curl -d '{"email":"test@example.com"}'

# ❌ Wrong (smart quotes cause issues)
curl -d '{"email":"test@example.com"}'
```

## Production Deployment Checklist

- [ ] Verify domain at https://resend.com/domains
- [ ] Add DNS records (SPF, DKIM) provided by Resend
- [ ] Update `RESEND_API_KEY` in production environment variables
- [ ] Update `ORDER_EMAIL_FROM` to use verified domain
- [ ] Test with real email address (not Resend test addresses)
- [ ] Integrate with Stripe webhook handler
- [ ] Set up monitoring for email delivery failures
- [ ] Configure bounce/complaint handling
- [ ] Test email templates on multiple clients (Gmail, Outlook, Apple Mail)

## Resources

- **Resend Documentation**: https://resend.com/docs
- **Node.js SDK Guide**: https://resend.com/docs/send-with-nodejs
- **API Reference**: https://resend.com/docs/api-reference
- **Verify Domain**: https://resend.com/domains
- **API Keys**: https://resend.com/api-keys
- **Email Practices**: https://resend.com/docs/best-practices

## Support

For issues with Resend:
- Check Resend documentation: https://resend.com/docs
- Contact Resend support: https://resend.com/contact

For DJ Cuisine integration issues:
- Check this guide and `.env.local` configuration
- Review `lib/email/resend.ts` implementation
- Check server logs for detailed error messages
