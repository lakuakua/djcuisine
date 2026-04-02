/**
 * Stripe Checkout requires absolute image URLs for product_data.images.
 */
export function toAbsoluteUrl(pathOrUrl: string | undefined): string | undefined {
  if (!pathOrUrl) return undefined;
  if (typeof pathOrUrl !== 'string') return undefined;
  
  try {
    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
      return pathOrUrl;
    }
  } catch (e) {
    return undefined;
  }
  
  const baseRaw = process.env.NEXT_PUBLIC_APP_URL ?? '';
  const base = String(baseRaw).trim().replace(/\/$/, '');
  if (!base) return undefined;
  
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  const encodedPath =
    '/' +
    path
      .split('/')
      .filter(Boolean)
      .map((segment) => encodeURIComponent(segment))
      .join('/');
  return `${base}${encodedPath}`;
}
