import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Safe diagnostics — never exposes the API key.
 * GET /api/health/easyship
 */
export async function GET() {
  const key = process.env.EASYSHIP_API_KEY?.trim();
  const hasKey = Boolean(key);
  const sandbox = process.env.EASYSHIP_SANDBOX_MODE === 'true';
  const fallbackOnly = process.env.USE_FALLBACK_RATES === 'true';
  const hasOrigin = Boolean(
    process.env.EASYSHIP_ORIGIN_ADDRESS_LINE1?.trim() &&
      process.env.EASYSHIP_ORIGIN_POSTAL_CODE?.trim()
  );

  return NextResponse.json({
    ok: hasKey || fallbackOnly,
    easyshipApiKey: hasKey,
    sandboxMode: sandbox,
    useFallbackRates: fallbackOnly,
    originConfigured: hasOrigin,
    note: !hasKey
      ? 'Set EASYSHIP_API_KEY for live UPS quotes, or USE_FALLBACK_RATES=true for zone estimates without Easyship.'
      : !hasOrigin
        ? 'Set EASYSHIP_ORIGIN_ADDRESS_LINE1 and EASYSHIP_ORIGIN_POSTAL_CODE for accurate rates.'
        : undefined,
  });
}
