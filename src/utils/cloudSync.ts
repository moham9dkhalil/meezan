// Re-exports kept for backward compatibility with modules that still attach a
// bearer token to API calls (cms.ts, CoursesSection, CertificateModal). Real
// authentication is now handled by Supabase Auth — see src/lib/auth.ts.

import { getAccessToken } from "../lib/auth";

export type { CloudSyncState } from "../lib/auth";
export { saveProgress as pushSync, loadProgress as fetchSync } from "../lib/auth";

export function getToken(): string | null {
  return getAccessToken();
}

// Sessions are managed by Supabase Auth; nothing to persist manually.
export function setToken(_token: string | null): void {
  // no-op
}
