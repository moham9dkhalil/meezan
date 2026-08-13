import express from "express";
const app = express();
app.get("/api/health", (_req, res) => res.json({ status: "ok", app: "Meezan-min" }));
export default (req: any, res: any) => app(req, res);
