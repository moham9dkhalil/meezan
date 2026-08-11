const CONSENT_KEY = "meezan_consent";

export type ConsentValue = "accepted" | "declined" | null;

export function getConsent(): ConsentValue {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "accepted" || v === "declined" ? v : null;
  } catch {
    return null;
  }
}

export function hasAnalyticsConsent(): boolean {
  return getConsent() === "accepted";
}

export function setConsent(value: "accepted" | "declined") {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // storage unavailable → treat measurements as disabled
  }
}