// Lazy @vercel/blob loader. Imported by api/index.ts so the package (which
// requires Node >= 20) is only evaluated when an endpoint actually needs Blob
// storage and is never loaded at module init — otherwise the static import
// would crash the whole serverless function (FUNCTION_INVOCATION_FAILED) on the
// Node 18 runtime that Vercel uses by default.
let mod: any = null;

async function load() {
  if (!mod) mod = await import("@vercel/blob");
  return mod;
}

export async function get(...args: any[]) {
  return (await load()).get(...args);
}

export async function put(...args: any[]) {
  return (await load()).put(...args);
}
