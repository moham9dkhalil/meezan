// Persistence uses Vercel Blob, which targets Node >= 20. On the default Node 18
// runtime the package cannot load, so we degrade to in-memory storage (the seed
// data is still served). Set the project runtime to Node 20+ and provide
// BLOB_READ_WRITE_TOKEN to enable durable storage across invocations.
export async function get(..._args: any[]): Promise<any> {
  return undefined;
}

export async function put(..._args: any[]): Promise<any> {
  return undefined;
}
