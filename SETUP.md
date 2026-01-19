# DJ Cuisine - Quick Setup Guide

## Step-by-Step Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Stripe

**Get Your Stripe Keys:**
1. Go to https://dashboard.stripe.com/register
2. Create an account or log in
3. Navigate to Developers → API keys
4. Copy your Publishable key and Secret key

**Add to Environment:**
1. Copy the example env file:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and add your keys:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Add Your Logo

Replace `/public/logo.png` with your actual logo (200x200px recommended)

### 4. Add Product Images (Optional)

Add product images to `/public/images/` following the naming convention in that directory's `.gitkeep` file.

If you don't add images, placeholder boxes will be shown (which is fine for testing).

### 5. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Testing the Checkout

Use Stripe's test card numbers:

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Auth**: 4000 0025 0000 3155

Any future expiry date and any 3-digit CVC will work.

## Customizing Products

Edit `/lib/products.ts` to:
- Add new products
- Change prices (remember: prices are in cents!)
- Update descriptions
- Add more categories

## Common Issues

### "Stripe is not configured"
- Make sure your `.env.local` file exists and has valid Stripe keys

### Images not showing
- Check that images are in `/public/images/` with correct filenames
- Images are optional - the site works without them

### Cart not persisting
- Check that localStorage is enabled in your browser
- This is a client-side feature and won't work in incognito mode

## Ready for Production?

### Before Deploying:

1. **Switch to Live Stripe Keys**
   - Use `pk_live_...` and `sk_live_...`

2. **Update App URL**
   ```env
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

3. **Add Real Product Images**
   - Professional photos recommended
   - Optimize images (use WebP format)

4. **Build and Test**
   ```bash
   npm run build
   npm start
   ```

5. **Deploy to Vercel** (Easiest)
   ```bash
   npm install -g vercel
   vercel
   ```

## Need Help?

Check the main [README.md](./README.md) for more detailed information.
