# DJ Cuisine - Complete Setup Guide

This guide will help you set up the complete purchase experience for DJ Cuisine.

## Prerequisites

1. Node.js 18+ installed
2. Git installed
3. A Stripe account (for payment processing)
4. Vercel account (for deployment)

---

## Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/lakuakua/djcuisine.git
cd djcuisine

# Install dependencies
npm install
```

---

## Step 2: Configure Stripe

### A. Get Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign in or create an account
3. Navigate to **Developers** → **API Keys**
4. Copy your **Publishable key** and **Secret key**

### B. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...your_key_here
STRIPE_SECRET_KEY=sk_test_51...your_key_here

# App URL (for Stripe redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important:**
- For **development**, use test keys (starting with `pk_test_` and `sk_test_`)
- For **production**, use live keys (starting with `pk_live_` and `sk_live_`)

---

## Step 3: Test Locally

```bash
# Start the development server
npm run dev
```

Visit: http://localhost:3000

### Test the Complete Purchase Flow:

1. **Browse Products**
   - Go to any category (e.g., Chicken, Beef, Juices)
   - Select a product size from the dropdown
   - Click "Add" button
   - Verify "Added!" confirmation appears

2. **View Cart**
   - Click the cart icon in the header
   - Verify items are displayed correctly
   - Test quantity adjustment (+/- buttons)
   - Test removing items

3. **Checkout**
   - Click "Checkout" button
   - Should redirect to Stripe Checkout page
   - Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date, any CVC
   - Complete the payment

4. **Order Success**
   - Should redirect to `/success` page
   - Order reference ID should be displayed
   - Cart should be empty

### Common Test Cards:

| Card Number | Result |
|-------------|--------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Declined |
| 4000 0027 6000 3184 | 3D Secure Required |

---

## Step 4: Deploy to Vercel

### A. Install Vercel CLI

```bash
npm install -g vercel
```

### B. Login to Vercel

```bash
vercel login
```

### C. Deploy

```bash
# Deploy to production
vercel --prod
```

### D. Configure Production Environment Variables

In Vercel Dashboard:

1. Go to your project
2. Click **Settings** → **Environment Variables**
3. Add the following:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_... (your live key)
STRIPE_SECRET_KEY = sk_live_... (your live key)
NEXT_PUBLIC_APP_URL = https://your-domain.vercel.app
```

4. Click **Save**
5. Redeploy: `vercel --prod`

---

## Step 5: Testing Production

### Test the Live Site:

1. Visit your production URL
2. Add items to cart
3. Click Checkout
4. Use a REAL credit card (you'll be charged!)
5. Verify order success page

**Important:** Always test thoroughly in **test mode** before going live!

---

## Troubleshooting

### Issue: "Checkout button not working"

**Solution:**
1. Open Browser Console (F12)
2. Check for error messages
3. Verify environment variables are set:
   ```bash
   # In terminal
   echo $STRIPE_SECRET_KEY
   echo $NEXT_PUBLIC_APP_URL
   ```
4. Restart dev server after changing `.env.local`

### Issue: "No checkout URL received"

**Cause:** Missing or invalid Stripe keys

**Solution:**
1. Verify your `.env.local` file exists
2. Check that keys start with `pk_test_` and `sk_test_`
3. Ensure no extra spaces in keys
4. Restart the dev server

### Issue: "Stripe API version error"

**Solution:**
The app uses Stripe API version `2023-10-16`. If you get version errors:
1. Upgrade Stripe package: `npm install stripe@latest`
2. Or change the API version in `/app/api/checkout/route.ts`

### Issue: "Cart is empty after page refresh"

**Cause:** localStorage not persisting

**Solution:**
1. Check browser console for errors
2. Ensure browser allows localStorage
3. Try clearing browser cache
4. Test in incognito mode

### Issue: "Gallon minimum validation not working"

**Solution:**
The app enforces: Orders with 1-gallon juices MUST have at least 2 gallons.

- This is validated on both client and server
- Add more gallons to bypass the warning
- Or remove all gallons from cart

---

## Complete Purchase Flow Diagram

```
┌─────────────────┐
│  Browse Menu    │
│  (Category Page)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Select Variant │
│  (Size/Option)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Add to Cart    │
│  (Cart Store)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  View Cart      │
│  (Sidebar)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Click Checkout │
│  (Validation)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API: /checkout │
│  (Create Stripe │
│   Session)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Stripe Checkout│
│  (Payment Page) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Payment Success│
│  (Clear Cart)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Success Page   │
│  (Order Ref)    │
└─────────────────┘
```

---

## Business Rules

### 1. Product Variants
- Products have multiple sizes (Big Tray, Half Tray, Plate, etc.)
- Each variant has its own price
- Single-size products display size badge

### 2. Juice Gallon Minimum
- Orders containing 1-gallon juices MUST have at least 2 gallons
- Validated on client (Cart.tsx) and server (checkout API)
- Checkout button disabled if violated

### 3. Cart Persistence
- Cart saved to localStorage automatically
- Survives page refresh
- Cleared after successful order

### 4. Price Display
- All prices stored in cents (e.g., $19.99 = 1999)
- Formatted with `formatPrice()` utility
- Prevents floating-point errors

---

## Key Files

```
app/
  api/checkout/route.ts    # Stripe checkout session creation
  success/page.tsx         # Order success page
  category/[slug]/page.tsx # Category product listing

components/
  Cart.tsx                 # Shopping cart drawer
  ProductCard.tsx          # Product display with Add button
  Header.tsx               # Navigation and cart icon

lib/
  products.ts              # Product catalog (source of truth)
  utils.ts                 # Utility functions (formatPrice)

store/
  cartStore.ts             # Zustand cart state management

types/
  index.ts                 # TypeScript type definitions
```

---

## Support

If you encounter issues:

1. Check the browser console (F12)
2. Check the terminal logs
3. Verify environment variables
4. Review this guide
5. Check [Stripe Documentation](https://stripe.com/docs)

---

## Next Steps

### Phase 2 Enhancements (Future):

- [ ] Email order confirmations
- [ ] Admin dashboard for order management
- [ ] Shipping integration (Easyship)
- [ ] User accounts and order history
- [ ] Discount codes and promotions
- [ ] Delivery scheduling
- [ ] Product reviews

---

**Your DJ Cuisine ecommerce platform is ready to go!** 🎉
