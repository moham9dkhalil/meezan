import express from "express";
import handler from "./api/index";

let logs: string[] = [];
const origErr = console.error;
console.error = (...a: any[]) => { logs.push(a.map(String).join(" ")); };

const app = express();
app.use(express.json({ limit: "25mb" }));
app.use((req, res) => { handler(req, res); });

app.listen(3012, async () => {
  for (const opts of [
    { label: "me-notoken", method: "GET", path: "/api/auth/me" },
    { label: "health", method: "GET", path: "/api/health" },
    { label: "reviews", method: "GET", path: "/api/reviews" },
  ] as const) {
    try {
      const r = await fetch(`http://localhost:3012${opts.path}`, { method: opts.method });
      console.log(opts.label, r.status, (await r.text()).slice(0, 120));
    } catch (e: any) {
      console.log(opts.label, "FETCH_ERR", (e && e.message || e));
    }
  }
  console.error = origErr;
  console.log("SERVER_LOGS", logs.join("\n"));
  process.exit(0);
});
