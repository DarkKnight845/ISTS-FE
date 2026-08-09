/**
 * Format an ISO date string for display in ticket tables and drawers.
 * Returns "—" for missing/invalid dates.
 *
 * Example output: "Aug 8, 2026, 8:30 AM" or "Aug 8, 2026" when time is excluded.
 */
export function formatTicketDate(value: string | null | undefined, includeTime = true): string {
  if (!value) return '—';
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...(includeTime ? { hour: 'numeric', minute: '2-digit' } : {}),
  });
}

/**
 * Short time-only formatter for message timestamps.
 */
export function formatMessageTime(value: string | null | undefined): string {
  if (!value) return '';
  const normalized = value.endsWith('Z') || value.endsWith('+00:00') ? value : `${value}Z`;
  const date = new Date(normalized);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}
