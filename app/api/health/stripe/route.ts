import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Safe diagnostics: never exposes secret values.
 * GET /api/health/stripe
 */
export async function GET() {
  const hasPublishable = Boolean(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim()
  );
  const hasSecret = Boolean(process.env.STRIPE_SECRET_KEY?.trim());
  const hasWebhook = Boolean(process.env.STRIPE_WEBHOOK_SECRET?.trim());
  const hasAppUrl = Boolean(process.env.NEXT_PUBLIC_APP_URL?.trim());

  const ok = hasSecret && hasAppUrl;

  return NextResponse.json({
    ok,
    nextPublicAppUrl: hasAppUrl,
    stripeSecretKey: hasSecret,
    stripePublishableKey: hasPublishable,
    stripeWebhookSecret: hasWebhook,
    note: hasWebhook
      ? undefined
      : 'Add STRIPE_WEBHOOK_SECRET for /api/webhooks/stripe (Stripe CLI or Dashboard).',
  });
}
