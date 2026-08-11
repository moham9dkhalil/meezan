import { UserProfile, LearningTrack } from "../types";

export const TOKEN_KEY = "meezan_auth_token";

// Cloud account (email+password) stored server-side, blob-backed on Vercel.
// The app still keeps a local offline copy of the profile for instant launch.

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

async function apiFetch(path: string, options: RequestInit = {}, token?: string | null) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || data?.details || `فشل الاتصال بالسيرفر (${res.status})`);
  }
  return data;
}

export interface CloudAuthPayload {
  user: UserProfile;
  token: string;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
  learningTrack?: LearningTrack;
}

export function registerAccount(input: SignupInput): Promise<CloudAuthPayload> {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function loginAccount(email: string, password: string): Promise<CloudAuthPayload> {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function fetchMe(token: string): Promise<{ user: UserProfile }> {
  return apiFetch("/api/auth/me", { method: "GET" }, token);
}

export function updateProfile(
  patch: Partial<UserProfile>,
  token: string
): Promise<{ user: UserProfile }> {
  return apiFetch("/api/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(patch),
  }, token);
}

export interface CloudSyncState {
  savedAt: string;
  xp: number;
  streak: number;
}

export function fetchSync(token: string): Promise<{ state: CloudSyncState | null }> {
  return apiFetch("/api/sync", { method: "GET" }, token);
}

export function pushSync(state: CloudSyncState, token: string): Promise<{ ok: boolean }> {
  return apiFetch("/api/sync", {
    method: "PUT",
    body: JSON.stringify({ state }),
  }, token);
}