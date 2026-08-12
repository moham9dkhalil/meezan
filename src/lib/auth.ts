import { supabase } from "./supabase";
import { UserProfile, LearningTrack } from "../types";

// ---------------------------------------------------------------------------
// Real authentication + profile persistence backed by Supabase (Postgres).
// The Supabase client keeps the session in localStorage and refreshes the
// access token automatically; we mirror the access token in a module-level
// cache so synchronous code (API headers) can read it without await.
// ---------------------------------------------------------------------------

let cachedToken: string | null = null;

supabase.auth.getSession().then(({ data }) => {
  cachedToken = data.session?.access_token ?? null;
});

supabase.auth.onAuthStateChange((_event, session) => {
  cachedToken = session?.access_token ?? null;
});

export function getAccessToken(): string | null {
  return cachedToken;
}

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

// Returns the current user's profile, creating it from session metadata if the
// database row does not exist yet (defensive — the DB trigger also creates it).
export async function upsertProfileFromSession(): Promise<UserProfile | null> {
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

export async function signUp(input: {
  name: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
  learningTrack: LearningTrack;
}): Promise<{ session: boolean }> {
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

export async function signIn(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPassword(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/`,
  });
  if (error) throw error;
}

export async function updateMyProfile(patch: {
  name?: string;
  avatar?: string;
  role?: string;
  learningTrack?: LearningTrack;
}): Promise<UserProfile> {
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
// Progress cloud sync (XP / streak / detailed local progress) → Supabase.
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

// Server-side admin check (reads ADMIN_EMAILS env via the API).
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
