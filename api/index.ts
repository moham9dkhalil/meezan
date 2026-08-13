import express from "express";
import { get as blobGet, put as blobPut } from "./lib/blob";
import { getSupabaseServer, isSupabaseConfigured } from "./lib/supabaseServer";
const app = express();
app.get("/api/health", (_req, res) => res.json({ status: "ok", blob: typeof blobGet, sb: isSupabaseConfigured() }));
export default (req: any, res: any) => app(req, res);
