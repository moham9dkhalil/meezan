import express from "express";
import crypto from "crypto";

const app = express();

app.get("/api/_probe2", (req, res) => {
  const hash = crypto.createHash("sha256").update(String(req.url || "")).digest("hex").slice(0, 8);
  res.json({ ok: true, hash, hasCrypto: true, isExpress: true });
});

export default function handler(req: any, res: any) {
  app(req, res);
}