import { supabase } from "./supabase";
import { UserProfile, LearningTrack } from "../types";

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || "";
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || "";
export const SUPABASE_CONFIGURED = Boolean(
  SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes("YOUR-PROJECT") &&
    !SUPABASE_ANON_KEY.includes("your-supabase") &&
    !SUPABASE_ANON_KEY.includes("your-anon")
);

// When the Supabase env vars are absent we fall back to the built-in API auth
// (handled by the serverless function), so registration works with zero
// external configuration. Set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY (and
// run supabase/migrations/0001_profiles.sql) to switch to real Supabase auth.
const USING_API = !SUPABASE_CONFIGURED;

// ---------------------------------------------------------------------------
// API-mode session storage (localStorage)
// ---------------------------------------------------------------------------
const API_TOKEN_KEY = "meezan_api_token";
const API_USER_KEY = "meezan_auth_user";

function apiToken(): string | null {
  try {
    return localStorage.getItem(API_TOKEN_KEY);
  } catch {
    return null;
  }
}
function storeApiSession(token: string, user: UserProfile) {
  try {
    localStorage.setItem(API_TOKEN_KEY, token);
    localStorage.setItem(API_USER_KEY, JSON.stringify(user));
  } catch {}
}
function clearApiSession() {
  try {
    localStorage.removeItem(API_TOKEN_KEY);
    localStorage.removeItem(API_USER_KEY);
  } catch {}
}
function storedApiUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(API_USER_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Supabase-mode token cache (mirrored so synchronous API headers can read it)
// ---------------------------------------------------------------------------
let cachedToken: string | null = null;
supabase.auth.getSession().then(({ data }) => {
  cachedToken = data?.session?.access_token ?? null;
}).catch(() => {
  cachedToken = null;
});
supabase.auth.onAuthStateChange((_event, session) => {
  cachedToken = session?.access_token ?? null;
});

export function getAccessToken(): string | null {
  return USING_API ? apiToken() : cachedToken;
}

// ---------------------------------------------------------------------------
// Supabase profile mapping + lookups
// ---------------------------------------------------------------------------
export interface SupabaseProfile {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: string;
  learning_track: LearningTrack;
  xp: number;
  streak: number;
  joined_date: string;
  progress: Record<string, unknown>;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export function mapProfileToUser(p: SupabaseProfile): UserProfile {
  return {
    id: p.id,
    name: p.name,
    email: p.email,
    role: p.role,
    avatar: p.avatar,
    xp: p.xp,
    streak: p.streak,
    joinedDate: p.joined_date,
    isLoggedIn: true,
    isAdmin: p.is_admin,
    learningTrack: p.learning_track,
  };
}

async function getProfileById(id: string): Promise<SupabaseProfile | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return data as SupabaseProfile;
}

// ---------------------------------------------------------------------------
// Sign up
// ---------------------------------------------------------------------------
export async function signUp(input: {
  name: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
  learningTrack: LearningTrack;
}): Promise<{ session: boolean }> {
  if (USING_API) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await res.json().catch(() => ({} as any));
    if (!res.ok) throw new Error(data?.error || "فشل إنشاء الحساب. حاول مرة أخرى.");
    storeApiSession(data.token, data.user);
    return { session: Boolean(data.token) };
  }

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        name: input.name,
        avatar: input.avatar,
        role: input.role,
        learning_track: input.learningTrack,
      },
      emailRedirectTo: `${window.location.origin}/`,
    },
  });
  if (error) throw error;
  return { session: Boolean(data.session) };
}

// ---------------------------------------------------------------------------
// Sign in
// ---------------------------------------------------------------------------
export async function signIn(email: string, password: string): Promise<void> {
  if (USING_API) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({} as any));
    if (!res.ok) throw new Error(data?.error || "البريد أو كلمة المرور غير صحيحين.");
    storeApiSession(data.token, data.user);
    return;
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Sign out
// ---------------------------------------------------------------------------
export async function signOut(): Promise<void> {
  if (USING_API) {
    clearApiSession();
    return;
  }
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Reset password
// ---------------------------------------------------------------------------
export async function resetPassword(email: string): Promise<void> {
  if (USING_API) return; // no email service in API mode
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/`,
  });
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Upsert profile from the current session (used right after login/signup)
// ---------------------------------------------------------------------------
export async function upsertProfileFromSession(): Promise<UserProfile | null> {
  if (USING_API) return storedApiUser();

  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;
  if (!user) return null;

  const existing = await getProfileById(user.id);
  if (existing) return mapProfileToUser(existing);

  const meta = (user.user_metadata || {}) as Record<string, unknown>;
  const newRow = {
    id: user.id,
    email: (user.email || (meta.email as string) || "").toString(),
    name: (meta.name as string) || user.email?.split("@")[0] || "محاسب ميزان",
    avatar: (meta.avatar as string) || "👨‍💼",
    role: (meta.role as string) || "طالب محاسبة",
    learning_track: ((meta.learning_track as LearningTrack) || "corporate") as LearningTrack,
    xp: 150,
    streak: 1,
    joined_date: new Date().toLocaleDateString("ar-SA"),
    progress: {},
    is_admin: false,
  };

  const { data, error } = await supabase.from("profiles").upsert(newRow).select("*").maybeSingle();
  if (error || !data) return null;
  return mapProfileToUser(data as SupabaseProfile);
}

// ---------------------------------------------------------------------------
// Update profile
// ---------------------------------------------------------------------------
export async function updateMyProfile(patch: {
  name?: string;
  avatar?: string;
  role?: string;
  learningTrack?: LearningTrack;
}): Promise<UserProfile> {
  if (USING_API) {
    const token = apiToken();
    const res = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(patch),
    });
    const data = await res.json().catch(() => ({} as any));
    if (!res.ok) throw new Error(data?.error || "تعذر تحديث الملف الشخصي.");
    const user = data.user as UserProfile;
    storeApiSession(token || "", user);
    return user;
  }

  const { error: authErr } = await supabase.auth.updateUser({
    data: {
      name: patch.name,
      avatar: patch.avatar,
      role: patch.role,
      learning_track: patch.learningTrack,
    },
  });
  if (authErr) throw authErr;

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) throw new Error("غير مسجّل الدخول");

  const row: Record<string, unknown> = {};
  if (patch.name) row.name = patch.name;
  if (patch.avatar) row.avatar = patch.avatar;
  if (patch.role) row.role = patch.role;
  if (patch.learningTrack) row.learning_track = patch.learningTrack;

  const { error } = await supabase.from("profiles").update(row).eq("id", authData.user.id);
  if (error) throw error;

  const user = await upsertProfileFromSession();
  if (!user) throw new Error("تعذر تحديث الملف الشخصي");
  return user;
}

// ---------------------------------------------------------------------------
// Progress cloud sync
// ---------------------------------------------------------------------------
export interface CloudSyncState {
  savedAt: string;
  xp: number;
  streak: number;
  progress?: Record<string, unknown>;
}

function readLocalJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function readLocalNumber(key: string): number | undefined {
  try {
    const raw = localStorage.getItem(key);
    return raw ? Number(raw) : undefined;
  } catch {
    return undefined;
  }
}

export async function saveProgress(state: CloudSyncState): Promise<void> {
  if (USING_API) {
    const token = apiToken();
    const progress: Record<string, unknown> = { ...(state.progress || {}) };
    progress.completedLessons = readLocalJSON<string[]>("meezan_completed_lessons", []);
    const lab = readLocalNumber("meezan_solved_lab_entries_count");
    if (lab !== undefined) progress.solvedLabEntries = lab;
    const daily = readLocalNumber("meezan_daily_challenges_count");
    if (daily !== undefined) progress.dailyChallenges = daily;
    progress.unlockedBadges = readLocalJSON<string[]>("meezan_unlocked_badges", []);

    await fetch("/api/sync", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ state: { ...state, progress } }),
    });
    return;
  }

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return;

  const progress: Record<string, unknown> = { ...(state.progress || {}) };
  progress.completedLessons = readLocalJSON<string[]>("meezan_completed_lessons", []);
  const lab = readLocalNumber("meezan_solved_lab_entries_count");
  if (lab !== undefined) progress.solvedLabEntries = lab;
  const daily = readLocalNumber("meezan_daily_challenges_count");
  if (daily !== undefined) progress.dailyChallenges = daily;
  progress.unlockedBadges = readLocalJSON<string[]>("meezan_unlocked_badges", []);

  const { error } = await supabase
    .from("profiles")
    .update({ xp: state.xp, streak: state.streak, progress, updated_at: new Date().toISOString() })
    .eq("id", authData.user.id);
  if (error) throw error;
}

export async function loadProgress(): Promise<CloudSyncState | null> {
  if (USING_API) {
    const token = apiToken();
    if (!token) return null;
    try {
      const res = await fetch("/api/sync", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data?.state || null;
    } catch {
      return null;
    }
  }

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return null;
  const prof = await getProfileById(authData.user.id);
  if (!prof) return null;
  return {
    savedAt: prof.updated_at || new Date().toISOString(),
    xp: prof.xp,
    streak: prof.streak,
    progress: prof.progress || {},
  };
}

// ---------------------------------------------------------------------------
// Server-side admin check (reads ADMIN_EMAILS env via the API)
// ---------------------------------------------------------------------------
export async function fetchAdminStatus(): Promise<boolean> {
  const token = getAccessToken();
  if (!token) return false;
  try {
    const res = await fetch("/api/admin/check", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data?.isAdmin);
  } catch {
    return false;
  }
}
