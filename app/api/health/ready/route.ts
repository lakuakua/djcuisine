import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Single checklist for local Stripe + Easyship + DB testing.
 * GET /api/health/ready
 */
export async function GET() {
  const stripeSecret = Boolean(process.env.STRIPE_SECRET_KEY?.trim());
  const stripeWebhook = Boolean(process.env.STRIPE_WEBHOOK_SECRET?.trim());
  const appUrl = Boolean(process.env.NEXT_PUBLIC_APP_URL?.trim());
  const publishable = Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim());

  const easyshipKey = Boolean(process.env.EASYSHIP_API_KEY?.trim());
  const easyshipFallback = process.env.USE_FALLBACK_RATES === 'true';
  const dbUrl = Boolean(process.env.DATABASE_URL?.trim());

  const stripeReady = stripeSecret && appUrl;
  const easyshipReady = easyshipKey || easyshipFallback;
  const ordersReady = dbUrl;

  const readyForPaymentTest = stripeReady && easyshipReady;
  const readyForFullTest = readyForPaymentTest && stripeWebhook && ordersReady;

  return NextResponse.json({
    readyForFullTest,
    readyForPaymentTest,
    checks: {
      stripeSecretKey: stripeSecret,
      stripePublishableKey: publishable,
      stripeWebhookSecret: stripeWebhook,
      nextPublicAppUrl: appUrl,
      databaseUrl: dbUrl,
      easyshipApiKey: easyshipKey,
      easyshipFallbackRates: easyshipFallback,
    },
    steps: {
      stripe:
        'Use test keys (pk_test_/sk_test_), NEXT_PUBLIC_APP_URL, and STRIPE_WEBHOOK_SECRET from `stripe listen` or Dashboard.',
      easyship:
        'Set EASYSHIP_API_KEY (sandbox or prod) or USE_FALLBACK_RATES=true for checkout without Easyship.',
      database:
        'Set DATABASE_URL (e.g. file:./prisma/dev.db) and run `npx prisma migrate dev` so webhooks can save orders.',
      webhook: 'Run `npm run stripe:listen` in a second terminal while testing payments locally.',
    },
  });
}
