// Lazy @vercel/blob loader. Imported by api/index.ts so the heavy dependency is
// only evaluated when an endpoint actually needs Blob storage (and never at
// module load, which would otherwise crash the whole serverless function with
// FUNCTION_INVOCATION_FAILED on runtimes where the package's top-level code is
// incompatible).
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
