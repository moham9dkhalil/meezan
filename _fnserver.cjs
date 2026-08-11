const express = require("express");
const handler = require("C:/Users/Khalil/AppData/Local/Temp/opencode/fn.cjs").default;
const app = express();
app.use(express.json({ limit: "25mb" }));
app.use((req, res) => handler(req, res));
app.listen(3013, async () => {
  const r = await fetch("http://localhost:3013/api/nonexistent123", { method: "GET" });
  console.log("nonexistent", r.status, (await r.text()).slice(0, 200));
  const r1 = await fetch("http://localhost:3013/api/auth/me", { method: "GET" });
  console.log("me-notoken", r1.status, (await r1.text()).slice(0, 200));
  const r2 = await fetch("http://localhost:3013/api/reviews", { method: "GET" });
  console.log("reviews", r2.status, (await r2.text()).slice(0, 120));
  process.exit(0);
});
