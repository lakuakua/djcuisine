# Deployment Guide - DJ Cuisine

## Pre-Deployment Checklist

Before deploying to production:

- [ ] Replace test Stripe keys with live keys
- [ ] Add real product images to `/public/images/`
- [ ] Replace placeholder logo with actual logo
- [ ] Update contact information (phone, email)
- [ ] Test checkout flow end-to-end
- [ ] Set up Stripe webhook for order confirmations
- [ ] Configure custom domain
- [ ] Test on multiple devices and browsers

## Option 1: Deploy to Vercel (Recommended)

Vercel is made by the creators of Next.js and offers the best experience.

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: DJ Cuisine ecommerce site"
git branch -M main
git remote add origin https://github.com/yourusername/djcuisine.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Import your `djcuisine` repository
5. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Step 3: Add Environment Variables

In Vercel dashboard → Settings → Environment Variables, add:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Step 4: Deploy

Click "Deploy" and wait for build to complete.

### Step 5: Configure Custom Domain

1. Go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

## Option 2: Deploy to Netlify

### Step 1: Build Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Step 2: Deploy

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select repository
4. Add environment variables (same as Vercel)
5. Deploy

## Option 3: Deploy to Your Own Server

### Requirements

- Node.js 18+
- PM2 or similar process manager
- Nginx (for reverse proxy)
- SSL certificate (Let's Encrypt)

### Step 1: Build Application

```bash
npm run build
```

### Step 2: Start with PM2

```bash
npm install -g pm2
pm2 start npm --name "djcuisine" -- start
pm2 save
pm2 startup
```

### Step 3: Configure Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 4: SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Post-Deployment Setup

### 1. Configure Stripe Webhook

Stripe needs to notify your app about successful payments.

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhook`
3. Select events: `checkout.session.completed`
4. Copy webhook signing secret

Create `/app/api/webhook/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    // TODO: Save order to database, send confirmation email
    console.log('Payment successful:', session.id);
  }

  return NextResponse.json({ received: true });
}
```

Add to `.env.local`:
```
STRIPE_WEBHOOK_SECRET=whsec_your_secret
```

### 2. Set Up Email Notifications

Install SendGrid or similar:

```bash
npm install @sendgrid/mail
```

Create `/lib/email.ts`:

```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendOrderConfirmation(
  email: string,
  orderDetails: any
) {
  const msg = {
    to: email,
    from: 'orders@djcuisine.com',
    subject: 'Order Confirmation - DJ Cuisine',
    html: `
      <h1>Thank you for your order!</h1>
      <p>Your order has been confirmed.</p>
      <!-- Add order details -->
    `,
  };

  await sgMail.send(msg);
}
```

### 3. Add Analytics

Add Google Analytics to `app/layout.tsx`:

```typescript
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 4. Set Up Database (Optional)

For order history and user accounts:

```bash
npm install prisma @prisma/client
npx prisma init
```

Create `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Order {
  id            String   @id @default(cuid())
  stripeId      String   @unique
  customerEmail String
  total         Int
  items         Json
  status        String
  createdAt     DateTime @default(now())
}
```

## Monitoring & Maintenance

### Performance Monitoring

- Use Vercel Analytics (built-in)
- Or add [Sentry](https://sentry.io) for error tracking

### Regular Tasks

- Monitor Stripe dashboard for orders
- Check error logs weekly
- Update dependencies monthly: `npm update`
- Backup database regularly (if using one)
- Review analytics for insights

### Scaling Considerations

As your business grows:

1. **Add CDN** - Cloudflare for static assets
2. **Database** - PostgreSQL or MongoDB for orders
3. **Caching** - Redis for cart sessions
4. **Queue System** - Bull/BullMQ for order processing
5. **Load Balancer** - For multiple server instances

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Stripe Webhook Not Working

- Check webhook URL is correct
- Verify webhook secret matches
- Check server logs for errors
- Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhook`

### Images Not Loading

- Ensure images are in `/public/images/`
- Check file permissions
- Verify image paths in `lib/products.ts`
- Add domain to `next.config.js` if using external images

### Cart Not Persisting

- Check localStorage is enabled
- Verify domain matches in browser
- Clear browser cache and test

## Support

For deployment issues:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Netlify: [netlify.com/support](https://netlify.com/support)
- Stripe: [stripe.com/support](https://stripe.com/support)

## Security Best Practices

- [ ] Never commit `.env.local` to git
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS only (no HTTP)
- [ ] Set up rate limiting for API routes
- [ ] Regularly update dependencies
- [ ] Use Stripe's test mode for development
- [ ] Validate all user inputs
- [ ] Implement CSRF protection

---

**Ready to launch? Good luck with DJ Cuisine! 🚀**
