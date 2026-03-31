import { randomBytes } from 'crypto';

/** Human-readable order id, e.g. DJ-20260327-A1B2C3 */
export function generateOrderNumber(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const suffix = randomBytes(3).toString('hex').toUpperCase();
  return `DJ-${y}${m}${day}-${suffix}`;
}
