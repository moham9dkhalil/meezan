import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || "";
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || "";

export const SUPABASE_CONFIGURED = Boolean(
  SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes("YOUR-PROJECT") &&
    !SUPABASE_ANON_KEY.includes("your-supabase") &&
    !SUPABASE_ANON_KEY.includes("your-anon")
);

// createClient throws on an empty URL, so fall back to a inert placeholder when
// the env vars are not yet configured (the app still works as a guest).
const FALLBACK_URL = "http://localhost:54321";
const FALLBACK_KEY = "public-anon-key";

export const supabase = createClient(
  SUPABASE_CONFIGURED ? SUPABASE_URL : FALLBACK_URL,
  SUPABASE_CONFIGURED ? SUPABASE_ANON_KEY : FALLBACK_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
