export interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
  idempotencyKey?: string;
}

/**
 * Resend HTTP API. Set RESEND_API_KEY and ORDER_EMAIL_FROM.
 */
export async function sendResendEmail(params: SendEmailParams): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.ORDER_EMAIL_FROM?.trim();
  if (!apiKey || !from) {
    console.warn('[Email] RESEND_API_KEY or ORDER_EMAIL_FROM missing');
    return false;
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  if (params.idempotencyKey) {
    headers['Idempotency-Key'] = params.idempotencyKey;
  }

  const body: Record<string, unknown> = {
    from,
    to: [params.to],
    subject: params.subject,
    text: params.text,
  };
  if (params.html) {
    body.html = params.html;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error('[Email] Resend error', res.status, await res.text());
    return false;
  }
  return true;
}
