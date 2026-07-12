type FbqParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    fbq?: (action: string, event: string, params?: FbqParams) => void;
  }
}

function fbqTrack(event: string, params?: FbqParams): void {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', event, params);
}

export function trackFacebookPageView(): void {
  fbqTrack('PageView');
}

export function trackFacebookInitiateCheckout(): void {
  fbqTrack('InitiateCheckout', { currency: 'USD' });
}

export function trackFacebookPurchase(params: {
  orderId: string;
  value?: number;
  currency?: string;
}): void {
  fbqTrack('Purchase', {
    currency: params.currency ?? 'USD',
    ...(params.value != null ? { value: params.value } : {}),
    order_id: params.orderId,
  });
}
