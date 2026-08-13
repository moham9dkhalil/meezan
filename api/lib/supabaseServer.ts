// Server-side Supabase requires the SDK, which targets Node >= 22. On Vercel's
// default Node 18 runtime we cannot load it, so admin verification degrades
// gracefully to a 503. Set the project runtime to Node 20+ (and supply
// SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY) to enable the admin panel.
export async function getSupabaseServer(): Promise<any | null> {
  return null;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
