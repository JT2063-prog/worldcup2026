// Shared time formatting — supports AEST (fixed) or the viewer's local device timezone.

const LS_KEY = 'wc2026_time_mode'; // 'AEST' | 'LOCAL'

export function getTimeMode() {
  try { return localStorage.getItem(LS_KEY) || 'AEST'; } catch { return 'AEST'; }
}
export function setTimeMode(mode) {
  try { localStorage.setItem(LS_KEY, mode); } catch {}
}

// Returns the IANA timezone string to use for Intl formatting, or undefined
// (which makes Intl use the browser's own local timezone automatically).
function zoneFor(mode) {
  return mode === 'AEST' ? 'Australia/Sydney' : undefined;
}

export function fmtTime(date, mode) {
  return date.toLocaleString('en-AU', {
    timeZone: zoneFor(mode), hour: '2-digit', minute: '2-digit', hour12: false,
  });
}

export function fmtDateShort(date, mode) {
  return date.toLocaleString('en-AU', {
    timeZone: zoneFor(mode), weekday: 'short', day: 'numeric', month: 'short',
  });
}

export function fmtDateLong(date, mode) {
  return date.toLocaleString('en-AU', {
    timeZone: zoneFor(mode), weekday: 'long', day: 'numeric', month: 'long',
  });
}

export function fmtDateTime(date, mode) {
  return date.toLocaleString('en-AU', {
    timeZone: zoneFor(mode), weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
}

export function modeLabel(mode) {
  if (mode === 'AEST') return 'AEST';
  // Show the actual local zone abbreviation e.g. "AEDT", "PDT", "GMT+1"
  try {
    const parts = new Intl.DateTimeFormat('en-AU', { timeZoneName: 'short' }).formatToParts(new Date());
    const tz = parts.find(p => p.type === 'timeZoneName');
    return tz ? tz.value : 'Local';
  } catch { return 'Local'; }
}
