import { hasAnalyticsConsent } from "./privacy";

export interface LocalAnalyticsEvent {
  name: string;
  at: string;
}

const STORAGE_KEY = "meezan_local_analytics";
const MAX_EVENTS = 100;

// Privacy-first product measurement: events stay in the learner's browser and
// are only recorded AFTER explicit consent (GDPR-style). The consent banner is
// shown on first visit and links to the privacy policy page.
export function trackLocalEvent(name: string) {
  if (!hasAnalyticsConsent()) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const events: LocalAnalyticsEvent[] = raw ? JSON.parse(raw) : [];
    events.push({ name, at: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
  } catch {
    // Analytics must never affect learning when storage is unavailable.
  }
}

export function getLocalAnalytics(): LocalAnalyticsEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
