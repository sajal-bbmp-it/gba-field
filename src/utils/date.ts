export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const pad2 = (n: number) => String(n).padStart(2, '0');

/** Today's date as YYYY-MM-DD in the device's local timezone. */
export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function parse(v: string | null | undefined): Date | null {
  if (!v) {
    return null;
  }
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

/** "09:42 am" (12h) or "09:42" (24h). */
export function fmtTime(v: string | null | undefined, hour12?: boolean): string {
  const d = parse(v);
  if (!d) {
    return '—';
  }
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    ...(hour12 === undefined ? {} : { hour12 }),
  });
}

/** "12 Oct, 09:42 am". */
export function fmtDateTime(v: string | null | undefined): string {
  const d = parse(v);
  if (!d) {
    return '—';
  }
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

/** Decimal hours → "7h 05m". */
export function fmtHours(h: number | null | undefined): string {
  if (h == null) {
    return '—';
  }
  const total = Math.round(Number(h) * 60);
  return `${Math.floor(total / 60)}h ${pad2(total % 60)}m`;
}
