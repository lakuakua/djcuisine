/** Minimum lead time from order (payment) to scheduled pickup — 24 hours */
export const PICKUP_MIN_LEAD_MS = 24 * 60 * 60 * 1000;

const YMD_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

function formatYmdInTimeZone(ms: number, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(ms));
  const y = parts.find((p) => p.type === 'year')?.value;
  const m = parts.find((p) => p.type === 'month')?.value;
  const d = parts.find((p) => p.type === 'day')?.value;
  if (!y || !m || !d) return '';
  return `${y}-${m}-${d}`;
}

/** Earliest allowed pickup calendar date (YYYY-MM-DD) in `timeZone`, relative to `anchorMs` + 24h */
export function minPickupDateYmd(anchorMs: number, timeZone = 'America/Chicago'): string {
  return formatYmdInTimeZone(anchorMs + PICKUP_MIN_LEAD_MS, timeZone);
}

/** Strict YYYY-MM-DD */
export function isValidYmd(s: string): boolean {
  const t = s.trim();
  if (!YMD_RE.test(t)) return false;
  const [y, m, d] = t.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

export function isPickupYmdAllowed(
  pickupYmd: string,
  anchorMs: number,
  timeZone = 'America/Chicago'
): boolean {
  const p = pickupYmd.trim();
  if (!isValidYmd(p)) return false;
  const min = minPickupDateYmd(anchorMs, timeZone);
  return p >= min;
}

/** Display label for a civil calendar date (no time) */
export function formatPickupDateDisplay(ymd: string): string {
  const t = ymd.trim();
  if (!YMD_RE.test(t)) return ymd;
  const [ys, ms, ds] = t.split('-');
  const y = Number(ys);
  const m = Number(ms);
  const d = Number(ds);
  if (!y || !m || !d) return ymd;
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const day = new Date(Date.UTC(y, m - 1, d));
  const weekday = weekdays[day.getUTCDay()];
  return `${weekday}, ${months[m - 1]} ${d}, ${y}`;
}

/** Legacy: full ISO from older checkouts */
export function ymdFromLegacyPickupMetadata(raw: string | undefined): string | undefined {
  if (!raw?.trim()) return undefined;
  const t = raw.trim();
  if (YMD_RE.test(t)) return t;
  const ms = Date.parse(t);
  if (Number.isNaN(ms)) return undefined;
  return formatYmdInTimeZone(ms, 'America/Chicago');
}
