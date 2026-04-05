/** Minimum lead time from order (payment) to scheduled pickup — 24 hours */
export const PICKUP_MIN_LEAD_MS = 24 * 60 * 60 * 1000;

export function parsePickupAtIso(iso: string | undefined): number | null {
  if (!iso?.trim()) return null;
  const t = Date.parse(iso.trim());
  return Number.isNaN(t) ? null : t;
}

export function isPickupAtLeastHoursAfter(
  pickupMs: number,
  anchorMs: number,
  leadMs: number = PICKUP_MIN_LEAD_MS
): boolean {
  return Number.isFinite(pickupMs) && pickupMs >= anchorMs + leadMs;
}

export function formatPickupDisplay(
  iso: string,
  timeZone = 'America/Chicago'
): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
