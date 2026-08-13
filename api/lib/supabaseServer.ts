// Lazy Supabase server client. Imported dynamically inside the endpoints that
// need it so a missing/failing @supabase/supabase-js install can never crash the
// whole serverless function (which would otherwise take /api/health, /api/chat,
// etc. down with FUNCTION_INVOCATION_FAILED).

let client: any = null;
let attempted = false;

export async function getSupabaseServer(): Promise<any | null> {
  if (attempted) return client;
  attempted = true;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  try {
    const mod = await import("@supabase/supabase-js");
    client = mod.createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    return client;
  } catch (e) {
    console.error("Supabase server client init failed:", e);
    return null;
  }
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
