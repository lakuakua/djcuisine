# Stripe setup (DJ Cuisine)

This app uses **Stripe Checkout** (hosted payment page) and a **webhook** at `/api/webhooks/stripe` for `checkout.session.completed`.

## 1. Stripe account and API keys

1. Open [Stripe Dashboard](https://dashboard.stripe.com/register) and sign up or log in.
2. Stay in **Test mode** (toggle in the Dashboard header) while developing.
3. Go to **Developers → API keys**.
4. Copy:
   - **Publishable key** (`pk_test_...`)
   - **Secret key** (`sk_test_...` — click Reveal)

## 2. Local environment (`.env.local`)

In the project root, create or edit `.env.local` (this file is gitignored):

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL="file:./prisma/dev.db"
```

Run **`npx prisma migrate dev`** once so SQLite exists and the webhook can save orders.

Restart `npm run dev` after saving.

## 3. Webhook signing secret (required for order-paid handling)

Stripe must send events to your app with a secret so your server can verify requests.

### Option A — Local development (Stripe CLI)

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) (e.g. `brew install stripe/stripe-cli/stripe` on macOS).

2. **Webhook signing secret:** With `STRIPE_SECRET_KEY` already in `.env.local`, you can print the local signing secret without `stripe login`:

   ```bash
   set -a && source .env.local && set +a
   stripe listen --forward-to localhost:3000/api/webhooks/stripe --api-key "$STRIPE_SECRET_KEY" --print-secret
   ```

   Copy the `whsec_...` line into `.env.local` as `STRIPE_WEBHOOK_SECRET=...`.

3. **Forward events while testing:** In a **second terminal** (keep `npm run dev` running in the first):

   ```bash
   npm run stripe:listen
   ```

   This uses `scripts/stripe-listen.sh` and your `.env.local` secret key so you do **not** need `stripe login`.

4. Restart `npm run dev` after adding `STRIPE_WEBHOOK_SECRET`.

The CLI forwards events to `http://localhost:3000/api/webhooks/stripe`.

### Option B — Production (Vercel)

1. In [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks), **Add endpoint**.
2. **Endpoint URL:** `https://YOUR_DOMAIN/api/webhooks/stripe`  
   Example: `https://djcuisine.vercel.app/api/webhooks/stripe`
3. **Events:** select `checkout.session.completed`.
4. After creating, open the endpoint and under **Signing secret** click **Reveal**. Add to Vercel:

   - **Settings → Environment Variables →** `STRIPE_WEBHOOK_SECRET` = `whsec_...`

5. Use **live** keys (`pk_live_...`, `sk_live_...`) only when you switch Stripe to live mode and redeploy.

## 4. Vercel environment variables

Set these for **Production** (and Preview if you test PRs):

| Name | Example |
|------|---------|
| `NEXT_PUBLIC_APP_URL` | `https://djcuisine.vercel.app` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` or `pk_live_...` |
| `STRIPE_SECRET_KEY` | `sk_test_...` or `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` from the **production** webhook endpoint |

Redeploy after changing variables.

## 5. Verify configuration

- **Full checklist (Stripe + Easyship + DB + webhook):**  
  `GET /api/health/ready`  
  When `readyForFullTest` is `true`, you can run a complete test (payment + persisted order + Easyship quote path).

- **Stripe only:** `GET /api/health/stripe` — `{ "ok": true }` needs secret key + `NEXT_PUBLIC_APP_URL`.

- **Easyship only:** `GET /api/health/easyship` — shows whether an API key / fallback mode is configured.

- **Test checkout:** add items to the cart, go to **`/checkout`**, enter a US address, click **Get shipping rates**, choose UPS, then pay with Stripe test card:
  - **Card:** `4242 4242 4242 4242`
  - **Expiry:** any future date  
  - **CVC:** any 3 digits  
  - **ZIP:** any 5 digits  

- **Webhook:** after payment, Stripe Dashboard → **Developers → Webhooks →** your endpoint → **Recent deliveries** should show `200`.

## 6. Optional: email when an order is paid

See `.env.example` for Resend variables (`RESEND_API_KEY`, `ORDER_EMAIL_FROM`, `ADMIN_ORDER_EMAIL`). If unset, order details are logged on the server when the webhook runs.

## Troubleshooting

| Issue | What to check |
|--------|----------------|
| "Payment system not configured" | `STRIPE_SECRET_KEY` in `.env.local`, server restarted |
| Webhook returns 400 Invalid signature | `STRIPE_WEBHOOK_SECRET` matches the **same** environment (CLI `whsec` for local, Dashboard `whsec` for prod) |
| Webhook 500 / order not in admin after pay | `DATABASE_URL` set, `npx prisma migrate dev` run; check server logs |
| `readyForFullTest` false | See `GET /api/health/ready` → `steps` for each missing piece |
| Easyship quote fails | `EASYSHIP_API_KEY`, origin env vars, or set `USE_FALLBACK_RATES=true` for dev |
| Stripe test + Easyship prod key | Valid for dev; use Easyship **sandbox** key + `EASYSHIP_SANDBOX_MODE=true` to avoid production Easyship usage |
| Redirect wrong after pay | `NEXT_PUBLIC_APP_URL` matches the URL you use (including `https` in production) |
| Images missing on Stripe Checkout page | `NEXT_PUBLIC_APP_URL` must be reachable; product images use absolute URLs built from it |
