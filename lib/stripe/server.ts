import Stripe from 'stripe';

/** Single Stripe API version for server routes + webhooks. */
export const STRIPE_API_VERSION: Stripe.LatestApiVersion = '2023-10-16';

let stripeSingleton: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  if (!stripeSingleton) {
    stripeSingleton = new Stripe(key, { apiVersion: STRIPE_API_VERSION });
  }
  return stripeSingleton;
}

export const stripeSecretKeyMissing = !process.env.STRIPE_SECRET_KEY?.trim();
