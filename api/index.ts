import express from "express";
import crypto from "crypto";

// NOTE: Vercel's @vercel/node bundler cannot resolve relative "./lib/*.ts"
// imports inside the serverless function (the build fails and the old function
// is kept). So the Blob + Supabase server helpers are inlined here instead of
// imported from ./lib.
//
// Blob persistence (Vercel Blob) targets Node >= 20, so on the default Node 18
// runtime we degrade to in-memory storage (seed data is still served). Set the
// project runtime to Node 20+ and provide BLOB_READ_WRITE_TOKEN for durability.
const blobGet = async (..._args: any[]): Promise<any> => undefined;
const blobPut = async (..._args: any[]): Promise<any> => undefined;

// Supabase server client targets Node >= 22; on Node 18 we can't load it, so
// admin verification degrades to 503. Set runtime to Node 20+ and supply
// SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY to enable the admin panel.
async function getSupabaseServer(): Promise<any | null> {
  return null;
}
function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

// Seed reviews â€” kept inline because Vercel only packs the api/ folder into the
// lambda; any import reaching outside it (e.g. ../src/...) fails at runtime.
const INITIAL_REVIEWS = [
  {
    id: "r1",
    stars: 5,
    name: "Ø£Ø­Ù…Ø¯ Ø§Ù„Ø³ÙŠØ¯",
    role: "Ø·Ø§Ù„Ø¨ Ù…Ø­Ø§Ø³Ø¨Ø© â€” Ø¬Ø§Ù…Ø¹Ø© Ø§Ù„Ù‚Ø§Ù‡Ø±Ø©",
    text: "ØµØ±Ø§Ø­Ø©ØŒ Ù…ÙŠØ²Ø§Ù† ØºÙŠÙ‘Ø± ÙÙ‡Ù…ÙŠ Ù„Ù„Ù…Ø­Ø§Ø³Ø¨Ø© ØªÙ…Ø§Ù…Ø§Ù‹. ÙƒÙ†Øª Ø¯Ø§ÙŠÙ…Ù‹Ø§ Ø£ØªØ®ÙˆÙ Ù…Ù† Ø§Ù„Ù‚ÙŠÙˆØ¯ ÙˆØ§Ù„ØªØ³ÙˆÙŠØ§ØªØŒ Ù„ÙƒÙ† Ø§Ù„Ø´Ø±Ø­ Ø¨Ø§Ù„Ø¹Ø±Ø¨ÙŠ ÙˆØ§Ù„ØªØ·Ø¨ÙŠÙ‚ Ø§Ù„Ø¹Ù…Ù„ÙŠ Ø¨Ø§Ù„Ù…Ø¹Ù…Ù„ Ø®Ù„Ù‘Ø§Ù†ÙŠ Ø£Ø³ØªÙˆØ¹Ø¨ ÙÙŠ Ø£Ø³Ø¨ÙˆØ¹ÙŠÙ† Ø£ÙƒØ«Ø± Ù…Ù† ØªØ±Ù… Ø¬Ø§Ù…Ø¹ÙŠ ÙƒØ§Ù…Ù„.",
    createdAt: "Ù…Ù†Ø° ÙŠÙˆÙ…ÙŠÙ†"
  },
  {
    id: "r2",
    stars: 5,
    name: "Ø³Ø§Ø±Ø© Ø§Ù„Ø­Ø±Ø¨ÙŠ",
    role: "Ù…Ø­Ø§Ø³Ø¨Ø© Ø­Ø¯ÙŠØ«Ø© Ø§Ù„ØªØ®Ø±Ø¬ â€” Ø§Ù„Ø±ÙŠØ§Ø¶",
    text: "Ù…Ø¹Ù…Ù„ Ø§Ù„Ù‚ÙŠÙˆØ¯ Ù‡ÙŠ Ø§Ù„Ù…ÙŠØ²Ø© Ø§Ù„Ø£ÙØ¶Ù„ Ø¨Ø§Ù„Ù†Ø³Ø¨Ø© Ù„ÙŠ! Ø¨ØªØ·Ø¨Ù‘Ù‚ Ø§Ù„Ù‚ÙŠØ¯ Ø¨Ù†ÙØ³Ùƒ ÙˆØªØ´ÙˆÙ Ø§Ù„ØªÙˆØ§Ø²Ù† ÙˆØ§Ù„ØµØ­Ø© ÙÙˆØ±Ø§Ù‹. Ø¯Ù‡ Ø®Ù„Ù‘Ø§Ù†ÙŠ Ø£ØªØºÙ„Ø¨ Ø¹Ù„Ù‰ Ø¹Ù‚Ø¯Ø© Ø§Ù„Ù…Ø¯ÙŠÙ† ÙˆØ§Ù„Ø¯Ø§Ø¦Ù† Ø¨Ø³Ù‡ÙˆÙ„Ø© Ø´Ø¯ÙŠØ¯Ø©.",
    createdAt: "Ù…Ù†Ø° 4 Ø£ÙŠØ§Ù…"
  },
  {
    id: "r3",
    stars: 5,
    name: "Ù…Ø­Ù…Ø¯ Ø§Ù„Ø¹Ù„ÙŠ",
    role: "Ù…Ø­Ø§Ø³Ø¨ Ù…Ø§Ù„ÙŠ â€” Ø§Ù„Ø®Ø¨Ø±",
    text: "ÙƒÙ†Øª Ù…Ø­ØªØ§Ø¬ Ø£ØªØ¬Ù‡Ø² Ù„Ø´Ù‡Ø§Ø¯Ø© CMA ÙˆÙ„Ù‚ÙŠØª ÙÙŠ Ù…ÙŠØ²Ø§Ù† ÙƒÙˆØ±Ø³ ÙƒØ§Ù…Ù„ Ø¨Ù…Ø³ØªÙˆÙ‰ Ø¹Ø§Ù„ÙŠ Ø¬Ø¯Ù‹Ø§ ÙˆÙ…Ø³Ø§Ø¹Ø¯ AI Ø¨ÙŠÙØ³Ø±Ù„ÙŠ Ø§Ù„Ù…Ø¹Ø§ÙŠÙŠØ± Ø§Ù„Ù…Ø¹Ù‚Ø¯Ø© ÙÙˆØ±Ø§Ù‹ Ø¨Ø§Ù„Ù„ØºØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©. ØªØ·Ø¨ÙŠÙ‚ 10/10.",
    createdAt: "Ù…Ù†Ø° Ø£Ø³Ø¨ÙˆØ¹"
  },
  {
    id: "r4",
    stars: 5,
    name: "Ù†ÙˆØ±Ø© Ø§Ù„ÙÙ‡Ø¯",
    role: "Ù…Ø­Ø§Ø³Ø¨Ø© â€” Ø´Ø±ÙƒØ© Ø§Ù„Ù…Ø±Ø§Ø¹ÙŠ",
    text: "Ø¨Ø·Ø§Ù‚Ø§Øª Ø§Ù„Ù…ØµØ·Ù„Ø­Ø§Øª Ø§Ù„Ù…Ø­Ø§Ø³Ø¨ÙŠØ© Ø¯ÙŠ ÙƒÙ†Ø² Ø­Ù‚ÙŠÙ‚ÙŠ. ÙƒÙ„ ÙŠÙˆÙ… Ø¨Ø±Ø§Ø¬Ø¹ 10 Ø¨Ø·Ø§Ù‚Ø§Øª Ø¨Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ© ÙˆØ§Ù„Ø¹Ø±Ø¨ÙŠØ© ÙÙŠ Ø·Ø±ÙŠÙ‚ÙŠ Ù„Ù„Ø¹Ù…Ù„ØŒ ÙˆÙ…Ø³ØªÙˆØ§ÙŠ ØªØ­Ø³Ù† Ø¨Ø´ÙƒÙ„ Ù…Ù„Ø­ÙˆØ¸.",
    createdAt: "Ù…Ù†Ø° Ø£Ø³Ø¨ÙˆØ¹ÙŠÙ†"
  },
  {
    id: "r5",
    stars: 4,
    name: "ÙŠÙˆØ³Ù Ø¨Ø§Ø­Ø§Ø±Ø«",
    role: "Ù…Ø­Ø§Ø³Ø¨ â€” Ø¬Ø¯Ø©",
    text: "ØªØ·Ø¨ÙŠÙ‚ Ù…Ù…ØªØ§Ø§Ø§Ø§Ø² Ø¨Ø¬Ø¯ØŒ ÙˆØ§Ù„ØªØ­ÙÙŠØ² Ø¨Ø§Ù„Ù†Ø¬ÙˆÙ… ÙˆØ§Ù„Ø¥Ù†Ø¬Ø§Ø²Ø§Øª Ø®Ù„Ø§Ù†ÙŠ Ù…Ù„ØªØ²Ù… Ø¨Ø§Ù„ØªØ¹Ù„Ù… ÙŠÙˆÙ…ÙŠØ§Ù‹. Ø¨Ø§Ù†ØªØ¸Ø§Ø± Ø¥Ø¶Ø§ÙØ© Ø§Ù„Ù…Ø²ÙŠØ¯ Ù…Ù† Ø­Ø§Ù„Ø§Øª Ù…Ø¹Ø§Ù„Ø¬Ø© Ø§Ù„Ø²ÙƒØ§Ø© ÙˆØ§Ù„Ø¶Ø±ÙŠØ¨Ø©.",
    createdAt: "Ù…Ù†Ø° 3 Ø£Ø³Ø§Ø¨ÙŠØ¹"
  },
  {
    id: "r6",
    stars: 5,
    name: "Ø®Ø§Ù„Ø¯ Ø§Ù„Ù‚Ø­Ø·Ø§Ù†ÙŠ",
    role: "Ù…Ù‡Ù†Ø¯Ø³ ØªØ­ÙˆÙ„ Ù„Ù„Ù…Ø­Ø§Ø³Ø¨Ø© â€” Ø§Ù„Ø¸Ù‡Ø±Ø§Ù†",
    text: "Ø£Ù†Ø§ Ø®Ø±ÙŠØ¬ Ù‡Ù†Ø¯Ø³Ø© ÙˆØ¨Ø­ÙˆÙ„ Ù„Ù…Ø¬Ø§Ù„ Ø§Ù„Ù…Ø­Ø§Ø³Ø¨Ø©ØŒ Ù…ÙŠØ²Ø§Ù† Ø¬Ø¹Ù„ Ø§Ù„Ø±Ø­Ù„Ø© Ù…Ù…ØªØ¹Ø© ÙˆØ³Ù„Ø³Ø© Ø¬Ø¯Ø§Ù‹. Ø§Ù„ØªØ¯Ø±Ø¬ ÙÙŠ Ø§Ù„Ù€ 32 Ù…Ø±Ø­Ù„Ø© Ù…Ù†Ø¸Ù‘Ù… Ù„Ù„ØºØ§ÙŠØ© ÙˆØ§Ù„Ø§Ø®ØªØ¨Ø§Ø±Ø§Øª Ø¨ØªØ«Ø¨Øª Ø§Ù„Ù…Ø¹Ù„ÙˆÙ…Ø©.",
    createdAt: "Ù…Ù†Ø° Ø´Ù‡Ø±"
  }
];

const app = express();
app.use(express.json({ limit: "25mb" }));

// Simple in-memory rate limiter for API abuse protection
const rateLimiter = (windowMs: number, maxRequests: number) => {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const entry = hits.get(ip);
    if (!entry || entry.resetAt <= now) {
      hits.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }
    entry.count += 1;
    if (entry.count > maxRequests) {
      return res.status(429).json({
        error: "Ù…Ø­Ø§ÙˆÙ„Ø§Øª ÙƒØ«ÙŠØ±Ø©. ÙŠØ±Ø¬Ù‰ Ø§Ù„Ø§Ù†ØªØ¸Ø§Ø± Ù‚Ù„ÙŠÙ„Ø§Ù‹ Ù‚Ø¨Ù„ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© Ù…Ø±Ø© Ø£Ø®Ø±Ù‰.",
      });
    }
    return next();
  };
};

// ---------------------------------------------------------------------------
// Reviews persistent storage
//   - Uses Vercel Blob when BLOB_READ_WRITE_TOKEN is set (persistent, free)
//   - Falls back to in-memory storage otherwise
// ---------------------------------------------------------------------------
const REVIEWS_BLOB = "meezan/reviews.json";
let memoryReviews: any[] | null = null;

function hasBlobToken() {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

async function loadReviews(): Promise<any[]> {
  const seed = () => memoryReviews || [...INITIAL_REVIEWS];
  if (!hasBlobToken()) return seed();

  try {
    const blob = await blobGet(REVIEWS_BLOB, { access: "public" });
    if (blob?.blob?.url) {
      const res = await fetch(blob.blob.url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          memoryReviews = data;
          return data;
        }
      }
    }
  } catch (e) {
    console.error("Blob read failed:", e);
  }
  return seed();
}

async function saveReviews(reviews: any[]) {
  memoryReviews = reviews;
  if (!hasBlobToken()) return;
  try {
    await blobPut(REVIEWS_BLOB, JSON.stringify(reviews, null, 2), {
      contentType: "application/json",
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
  } catch (e) {
    console.error("Blob write failed:", e);
  }
}

const geminiLimiter = rateLimiter(60 * 1000, 15);
const reviewLimiter = rateLimiter(60 * 1000, 5);
const authLimiter = rateLimiter(60 * 1000, 15);

// ---------------------------------------------------------------------------
// AI payload guards: bound the cost of each Gemini call (message length,
// conversation history, and inline image size). Details are never echoed.
// ---------------------------------------------------------------------------
const MAX_TEXT_CHARS = 6000;
const MAX_HISTORY_TURNS = 20;
const MAX_IMAGE_BASE64_LEN = 14_000_000; // ~10MB file encoded as base64
const MAX_JOURNAL_ENTRY_JSON_LEN = 250_000;

function aiPayloadError(body: any): string | null {
  if (!body || typeof body !== "object") return "Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª ØºÙŠØ± ØµØ§Ù„Ø­Ø©.";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (message.length > MAX_TEXT_CHARS) return "Ø§Ù„Ø±Ø³Ø§Ù„Ø© Ø·ÙˆÙŠÙ„Ø© Ø¬Ø¯Ø§Ù‹. ÙŠØ±Ø¬Ù‰ ØªÙ‚ØµÙŠØ±Ù‡Ø§ ÙˆØ¥Ø¹Ø§Ø¯Ø© Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø©.";
  if (Array.isArray(body.history)) {
    if (body.history.length > MAX_HISTORY_TURNS) return "Ø³Ø¬Ù„ Ø§Ù„Ù…Ø­Ø§Ø¯Ø«Ø© ÙƒØ¨ÙŠØ± Ø¬Ø¯Ø§Ù‹. Ø§Ø¨Ø¯Ø£ Ù…Ø­Ø§Ø¯Ø«Ø© Ø¬Ø¯ÙŠØ¯Ø©.";
    for (const h of body.history) {
      const t = h?.text || "";
      const img = h?.image?.data || "";
      if ((typeof t === "string" && t.length > MAX_TEXT_CHARS) || (typeof img === "string" && img.length > MAX_IMAGE_BASE64_LEN)) {
        return "Ø£Ø­Ø¯ Ø¹Ù†Ø§ØµØ± Ø³Ø¬Ù„ Ø§Ù„Ù…Ø­Ø§Ø¯Ø«Ø© ÙŠØªØ¬Ø§ÙˆØ² Ø§Ù„Ø­Ø¯ Ø§Ù„Ù…Ø³Ù…ÙˆØ­.";
      }
    }
  }
  const imgData = typeof body.image?.data === "string" ? body.image.data : "";
  if (imgData.length > MAX_IMAGE_BASE64_LEN) return "Ø­Ø¬Ù… Ø§Ù„ØµÙˆØ±Ø© ÙŠØªØ¬Ø§ÙˆØ² Ø§Ù„Ø­Ø¯ Ø§Ù„Ù…Ø³Ù…ÙˆØ­ (10 Ù…ÙŠØ¬Ø§Ø¨Ø§ÙŠØª).";
  if (body.entry !== undefined) {
    try {
      const size = JSON.stringify(body.entry)?.length || 0;
      if (size > MAX_JOURNAL_ENTRY_JSON_LEN) return "ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ù‚ÙŠØ¯ ÙƒØ¨ÙŠØ±Ø© Ø¬Ø¯Ø§Ù‹.";
    } catch {
      return "ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ù‚ÙŠØ¯ ØºÙŠØ± ØµØ§Ù„Ø­Ø©.";
    }
  }
  return null;
}

// Reviews Endpoint - GET all reviews
app.get("/api/reviews", async (_req, res) => {
  const reviews = await loadReviews();
  res.json({ reviews });
});

// Reviews Endpoint - POST new review
app.post("/api/reviews", reviewLimiter, async (req, res) => {
  const { name, role, text, stars } = req.body || {};
  if (!name || !text || !String(name).trim() || !String(text).trim()) {
    return res.status(400).json({ error: "Ø§Ù„Ø§Ø³Ù… ÙˆØ§Ù„Ø±Ø£ÙŠ Ù…Ø·Ù„ÙˆØ¨Ø§Ù†" });
  }
  const starCount = Math.min(5, Math.max(1, parseInt(stars, 10) || 5));
  const newRev = {
    id: Date.now().toString(),
    stars: starCount,
    name: String(name).trim().slice(0, 80),
    role: String(role || "Ù…ØªØ¹Ù„Ù… ÙÙŠ Ù…ÙŠØ²Ø§Ù†").trim().slice(0, 120),
    text: String(text).trim().slice(0, 1000),
    createdAt: "Ø§Ù„Ø¢Ù†",
    submittedAt: new Date().toISOString(),
  };
  const reviews = await loadReviews();
  reviews.unshift(newRev);
  await saveReviews(reviews);
  res.json({ review: newRev });
});

// ---------------------------------------------------------------------------
// Gemini AI Assistant
// We call the Gemini REST API directly with the built-in fetch (available on
// Node 18+, which is what the serverless runtime uses). The @google/genai SDK
// requires Node >= 20 and would crash module load there, so we avoid it.
// ---------------------------------------------------------------------------
async function generateGeminiText(
  contents: any,
  systemInstruction: string,
  temperature: number
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY غير متوفر في البيئة.");
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
  const payload = {
    contents:
      typeof contents === "string"
        ? [{ role: "user", parts: [{ text: contents }] }]
        : contents,
    systemInstruction: { parts: [{ text: systemInstruction }] },
    generationConfig: { temperature },
  };
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) {
    const detail = await resp.text().catch(() => "");
    throw new Error(`Gemini HTTP ${resp.status}: ${detail.slice(0, 300)}`);
  }
  const data = await resp.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  return parts.map((p: any) => p.text || "").join("");
}

// ---------------------------------------------------------------------------
// Gemini AI Assistant
// ---------------------------------------------------------------------------
app.post("/api/chat", geminiLimiter, async (req, res) => {
  try {
    const payloadError = aiPayloadError(req.body);
    if (payloadError) {
      return res.status(400).json({ error: payloadError });
    }
    const { message, history, persona, image } = req.body;
    if (!message && !image) {
      return res.status(400).json({ error: "Ø§Ù„Ø±Ø³Ø§Ù„Ø© Ø£Ùˆ Ø§Ù„ØµÙˆØ±Ø© Ù…Ø·Ù„ÙˆØ¨ Ø¥Ø±Ø³Ø§Ù„Ù‡Ø§" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "Ù…ÙØªØ§Ø­ GEMINI_API_KEY ØºÙŠØ± Ù…ØªÙˆÙØ± ÙÙŠ Ø§Ù„Ø¨ÙŠØ¦Ø©.",
      });
    }

    let personaInstruction = `Ø£Ù†Øª "Ù…Ø³Ø§Ø¹Ø¯ Ù…ÙŠØ²Ø§Ù†"ØŒ Ù…Ø¹Ù„Ù… ÙˆØ®Ø¨ÙŠØ± Ù…Ø­ØªØ±Ù ÙÙŠ Ø¹Ù„Ù… Ø§Ù„Ù…Ø­Ø§Ø³Ø¨Ø© Ø§Ù„Ù…Ø§Ù„ÙŠØ© ÙˆÙ‚Ø±Ø§Ø¡Ø© Ø§Ù„ÙÙˆØ§ØªÙŠØ± ÙˆØ§Ù„Ù…Ø³ØªÙ†Ø¯Ø§Øª Ø§Ù„Ù…Ø­Ø§Ø³Ø¨ÙŠØ© Ø¨Ø§Ù„Ù„ØºØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©.`;

    if (persona === "ifrs") {
      personaInstruction = `Ø£Ù†Øª "Ù…Ø³ØªØ´Ø§Ø± Ù…Ø¹Ø§ÙŠÙŠØ± IFRS Ø§Ù„Ø¯ÙˆÙ„ÙŠØ©"ØŒ Ø®Ø¨ÙŠØ± Ù…ØªØ®ØµØµ ÙÙŠ Ø§Ù„Ù…Ø¹Ø§ÙŠÙŠØ± Ø§Ù„Ù…Ø­Ø§Ø³Ø¨ÙŠØ© Ø§Ù„Ø¯ÙˆÙ„ÙŠØ© (IFRS/IAS). Ù‚Ù… Ø¨Ø¥Ø¬Ø§Ø¨Ø© Ø§Ù„Ø£Ø³Ø¦Ù„Ø© ÙˆØªØ­Ù„ÙŠÙ„ Ø§Ù„Ù…Ø³ØªÙ†Ø¯Ø§Øª Ù…Ø¹ Ø±Ø¨Ø·Ù‡Ø§ Ø¨Ø±Ù‚Ù… Ø§Ù„Ù…Ø¹ÙŠØ§Ø± Ø§Ù„Ù…Ø¹Ù†ÙŠ (Ù…Ø«Ù„ IFRS 15, IFRS 16, IAS 16) ÙˆØ¥Ø¹Ø·Ø§Ø¡ Ø£Ù…Ø«Ù„Ø© Ù…Ø¹Ø§Ù„Ø¬Ø© Ù‚ÙŠÙˆØ¯ Ø¨Ø§Ù„Ø¬Ù†ÙŠÙ‡/Ø§Ù„Ø±ÙŠØ§Ù„.`;
    } else if (persona === "socpa") {
      personaInstruction = `Ø£Ù†Øª "Ù…Ø¯Ø±Ø¨ Ø²Ù…Ø§Ù„Ø© SOCPA & CMA"ØŒ Ø£Ø³ØªØ§Ø° Ù…ØªØ®ØµØµ ÙÙŠ Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ø·Ù„Ø§Ø¨ Ù„Ø§Ø®ØªØ¨Ø§Ø±Ø§Øª Ø§Ù„Ù‡ÙŠØ¦Ø© Ø§Ù„Ø³Ø¹ÙˆØ¯ÙŠØ© Ù„Ù„Ù…Ø±Ø§Ø¬Ø¹ÙŠÙ† ÙˆØ§Ù„Ù…Ø­Ø§Ø³Ø¨ÙŠÙ† (SOCPA) ÙˆØ§Ø®ØªØ¨Ø§Ø± Ø§Ù„Ù…Ø§Ù„ÙŠ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯ (CMA). Ù‚Ù… Ø¨ØªØ²ÙˆÙŠØ¯ Ø§Ù„Ø·Ø§Ù„Ø¨ Ø¨ØªÙ…Ø§Ø±ÙŠÙ† Ø®ÙŠØ§Ø±Ø§Øª Ù…ØªØ¹Ø¯Ø¯Ø© Ù…Ø¹ Ø§Ù„Ø´Ø±Ø­ ÙˆØ§Ù„ØªÙØ³ÙŠØ± ÙˆØ§Ù„Ø­Ù„ Ø§Ù„Ø±ÙŠØ§Ø¶ÙŠ ÙˆØ§Ù„Ù…Ø­Ø§Ø³Ø¨ÙŠ Ø§Ù„Ù…Ù†Ù‡Ø¬ÙŠ.`;
    } else if (persona === "odoo") {
      personaInstruction = `Ø£Ù†Øª "Ø®Ø¨ÙŠØ± Ù†Ø¸Ù… Odoo ERP ÙˆØ§Ù„Ù…ÙŠÙƒÙ†Ø© Ø§Ù„Ù…Ø­Ø§Ø³Ø¨ÙŠØ©"ØŒ Ù…ØªÙ…Ø±Ø³ ÙÙŠ ØªÙˆØ¬ÙŠÙ‡ Ø§Ù„Ù‚ÙŠÙˆØ¯ Ø§Ù„ÙŠÙˆÙ…ÙŠØ©ØŒ Ø¯ÙØ§ØªØ± Ø§Ù„ÙŠÙˆÙ…ÙŠØ© (Journal Entries)ØŒ Ø¯Ù„ÙŠÙ„ Ø§Ù„Ø­Ø³Ø§Ø¨Ø§Øª (Chart of Accounts)ØŒ ÙˆÙ‚Ø±Ø§Ø¡Ø© Ø§Ù„ÙÙˆØ§ØªÙŠØ± Ù„Ø¥Ù†Ø´Ø§Ø¡ Ù‚ÙŠÙˆØ¯ Odoo v17.`;
    } else if (persona === "analysis") {
      personaInstruction = `Ø£Ù†Øª "Ù…Ø­Ù„Ù„ Ù…Ø§Ù„ÙŠ Ø®Ø¨ÙŠØ±"ØŒ Ù…ØªØ®ØµØµ ÙÙŠ ØªØ­Ù„ÙŠÙ„ Ø§Ù„Ù‚ÙˆØ§Ø¦Ù… Ø§Ù„Ù…Ø§Ù„ÙŠØ©ØŒ Ø§Ù„Ù†Ø³Ø¨ Ø§Ù„Ù…Ø§Ù„ÙŠØ© (Ratios)ØŒ Ø§Ù„ØªØ¯ÙÙ‚Ø§Øª Ø§Ù„Ù†Ù‚Ø¯ÙŠØ©ØŒ ÙˆÙ‚Ø±Ø§Ø¡Ø© Ø§Ù„Ù…Ø³ØªÙ†Ø¯Ø§Øª ÙˆØ§Ù„ØªÙ‚Ø§Ø±ÙŠØ± Ø§Ù„Ù…Ø§Ù„ÙŠØ© Ù„Ù„Ø´Ø±ÙƒØ§Øª Ø¨Ø£Ø³Ù„ÙˆØ¨ Ø§Ø­ØªØ±Ø§ÙÙŠ ÙˆØ±Ø³ÙˆÙ…ÙŠ.`;
    }

    const systemInstruction = `${personaInstruction}
Ù…Ù‡Ù…ØªÙƒ Ø¥Ø¬Ø§Ø¨Ø© Ø£Ø³Ø¦Ù„Ø© Ø§Ù„Ø·Ù„Ø§Ø¨ ÙˆØ§Ù„Ù…ØªØ¹Ù„Ù…ÙŠÙ† ÙˆØªØ­Ù„ÙŠÙ„ Ø£ÙŠ Ù…Ø³ØªÙ†Ø¯Ø§Øª Ø£Ùˆ ÙÙˆØ§ØªÙŠØ± Ø£Ùˆ ØµÙˆØ± Ù…Ø±ÙÙ‚Ø© Ø¨Ø£Ø³Ù„ÙˆØ¨ Ù…Ø¨Ø³Ø·ØŒ ÙˆØ§ÙÙŠØŒ Ù…Ø´Ø¬Ø¹ ÙˆÙˆØ§Ø¶Ø­ Ø¬Ø¯Ø§Ù‹ Ø¨Ø§Ù„Ù„ØºØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©.
Ø¥Ø°Ø§ Ø£Ø±ÙÙ‚ Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù… ØµÙˆØ±Ø© (Ù…Ø«Ù„ ÙØ§ØªÙˆØ±Ø©ØŒ Ø¥ÙŠØµØ§Ù„ØŒ Ø£Ùˆ Ù‚Ø§Ø¦Ù…Ø© Ù…Ø§Ù„ÙŠØ©)ØŒ Ù‚Ù… Ø¨Ù‚Ø±Ø§Ø¡Ø© Ø¨ÙŠØ§Ù†Ø§ØªÙ‡Ø§ Ø¨Ø¯Ù‚Ø© ÙˆØ§Ø³ØªØ®Ø±Ø§Ø¬ Ø§Ù„Ù…Ø¨Ø§Ù„Øº ÙˆØ§Ù„ØªØ§Ø±ÙŠØ® ÙˆØ£Ø³Ù…Ø§Ø¡ Ø§Ù„Ø£Ø·Ø±Ø§Ù ÙˆØ§Ù„ØªÙˆØ¬ÙŠÙ‡ Ø§Ù„Ù…Ø­Ø§Ø³Ø¨ÙŠ Ø§Ù„ØµØ­ÙŠØ­.
Ø¹Ù†Ø¯ Ø¥Ø¹Ø·Ø§Ø¡ Ù‚ÙŠÙˆØ¯ Ù…Ø­Ø§Ø³Ø¨ÙŠØ©ØŒ ÙˆØ§ØµÙ„ Ø§Ø³ØªØ®Ø¯Ø§Ù… Ø§Ù„ØµÙŠØº Ø§Ù„Ù‚ÙŠØ§Ø³ÙŠØ© Ø§Ù„Ù…Ù†Ø¸Ù…Ø© Ù…Ø«Ù„:
[Ù…Ù† Ø­Ù€/ Ø§Ø³Ù… Ø§Ù„Ø­Ø³Ø§Ø¨] - (Ù…Ø¯ÙŠÙ†)
[Ø¥Ù„Ù‰ Ø­Ù€/ Ø§Ø³Ù… Ø§Ù„Ø­Ø³Ø§Ø¨] - (Ø¯Ø§Ø¦Ù†)
Ø§Ø¬Ø¹Ù„ Ø±Ø¯ÙˆØ¯Ùƒ Ù…Ù†Ø³Ù‚Ø© Ø¨Ø£Ø³Ù„ÙˆØ¨ Ù†Ø¸ÙŠÙ Ù…Ø¹ Ù†Ù‚Ø§Ø· ÙˆØ§Ø¶Ø­Ø© ÙˆØ±Ø¤ÙˆØ³ Ø£Ù‚Ù„Ø§Ù… Ø³Ù‡Ù„Ø© Ø§Ù„Ù‚Ø±Ø§Ø¡Ø©.`;

    let contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      contents = history.map((h: { sender: string; text: string; image?: { mimeType: string; data: string } }) => {
        const parts: any[] = [];
        if (h.text) {
          parts.push({ text: h.text });
        }
        if (h.image && h.image.data) {
          const cleanBase64 = h.image.data.includes(",") ? h.image.data.split(",")[1] : h.image.data;
          parts.push({
            inlineData: {
              mimeType: h.image.mimeType || "image/jpeg",
              data: cleanBase64,
            },
          });
        }
        return {
          role: h.sender === "user" ? "user" : "model",
          parts,
        };
      });
    }

    const currentParts: any[] = [];
    const userTextPrompt = message || "ÙŠØ±Ø¬Ù‰ ØªØ­Ù„ÙŠÙ„ ÙˆØ¯Ø±Ø§Ø³Ø© Ù‡Ø°Ù‡ Ø§Ù„ØµÙˆØ±Ø© Ø£Ùˆ Ø§Ù„Ù…Ø³ØªÙ†Ø¯ Ø§Ù„Ù…Ø­Ø§Ø³Ø¨ÙŠ ÙˆØªÙˆØ¬ÙŠÙ‡Ù‡ Ù…Ø­Ø§Ø³Ø¨ÙŠØ§Ù‹ ÙˆØ§Ø³ØªØ®Ø±Ø§Ø¬ Ù‚ÙŠÙˆØ¯ Ø§Ù„ÙŠÙˆÙ…ÙŠØ© Ø§Ù„ØªÙØµÙŠÙ„ÙŠØ© Ø§Ù„Ù…Ù…ÙƒÙ†Ø©.";
    currentParts.push({ text: userTextPrompt });

    if (image && image.data) {
      const cleanBase64 = image.data.includes(",") ? image.data.split(",")[1] : image.data;
      currentParts.push({
        inlineData: {
          mimeType: image.mimeType || "image/jpeg",
          data: cleanBase64,
        },
      });
    }

    contents.push({
      role: "user",
      parts: currentParts,
    });

    const reply = (await generateGeminiText(contents, systemInstruction, 0.7))
      || "عذراً، لم أستطع توليد إجابة في الوقت الحالي.";
    return res.json({ reply });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({
      error: "Ø­Ø¯Ø« Ø®Ø·Ø£ Ø£Ø«Ù†Ø§Ø¡ Ø§Ù„ØªÙˆØ§ØµÙ„ Ù…Ø¹ Ù…Ø³Ø§Ø¹Ø¯ Ù…ÙŠØ²Ø§Ù† Ø§Ù„Ø°ÙƒÙŠ. Ø­Ø§ÙˆÙ„ Ù…Ø±Ø© Ø£Ø®Ø±Ù‰.",
    });
  }
});

// Gemini AI Journal Entry Explanation Endpoint
app.post("/api/explain-journal", geminiLimiter, async (req, res) => {
  try {
    const payloadError = aiPayloadError(req.body);
    if (payloadError) {
      return res.status(400).json({ error: payloadError });
    }
    const { entry } = req.body;
    if (!entry) {
      return res.status(400).json({ error: "ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø­Ø§Ø³Ø¨ÙŠ Ù…Ø·Ù„ÙˆØ¨Ø©" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "Ù…ÙØªØ§Ø­ GEMINI_API_KEY ØºÙŠØ± Ù…ØªÙˆÙØ± ÙÙŠ Ø§Ù„Ø¨ÙŠØ¦Ø©.",
      });
    }

    const entryDetailsStr = JSON.stringify(entry, null, 2);

    const prompt = `Ù‚Ù… Ø¨ØªØ­Ù„ÙŠÙ„ Ø§Ù„Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø­Ø§Ø³Ø¨ÙŠ Ø§Ù„Ù…Ø­ÙÙˆØ¸ Ø§Ù„ØªØ§Ù„ÙŠ Ø¨Ø´ÙƒÙ„ ØªÙØµÙŠÙ„ÙŠ ÙˆØ´Ø±Ø­ Ø§Ù„Ù…Ù†Ø·Ù‚ Ø§Ù„Ù…Ø­Ø§Ø³Ø¨ÙŠ Ù„Ù„Ù…ØªØ¹Ù„Ù…:

Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù‚ÙŠØ¯:
${entryDetailsStr}

ÙŠØ±Ø¬Ù‰ ØªÙ‚Ø¯ÙŠÙ… Ø§Ù„Ø´Ø±Ø­ Ø¨Ø§Ù„Ù„ØºØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ© Ø¨Ø§Ù„Ù‡ÙŠÙƒÙ„ Ø§Ù„ØªØ§Ù„ÙŠ:
1. ðŸŽ¯ **ÙÙƒØ±Ø© Ø§Ù„Ø¹Ù…Ù„ÙŠØ© Ø§Ù„Ù…Ø§Ù„ÙŠØ© (motive/transaction)**: Ù…Ø§ Ù‡Ùˆ Ø§Ù„Ø­Ø¯Ø« Ø§Ù„Ø§Ù‚ØªØµØ§Ø¯ÙŠ Ø£Ùˆ Ø§Ù„Ù…Ø¹Ø§Ù…Ù„Ø© Ø§Ù„Ù…Ø§Ù„ÙŠØ© Ø§Ù„ØªÙŠ ÙŠØ¹Ø¨Ø± Ø¹Ù†Ù‡Ø§ Ù‡Ø°Ø§ Ø§Ù„Ù‚ÙŠØ¯ Ø¨Ø£Ø³Ù„ÙˆØ¨ Ø­ÙŠÙˆÙŠ ÙˆØ³Ù‡Ù„.
2. ðŸ”´ **ØªØ­Ù„ÙŠÙ„ Ø¬Ø§Ù†Ø¨ Ø§Ù„Ù…Ø¯ÙŠÙ† (Debit Side)**: Ù„Ù…Ø§Ø°Ø§ ØªÙ… Ø¬Ø¹Ù„ Ù‡Ø°Ù‡ Ø§Ù„Ø­Ø³Ø§Ø¨Ø§Øª Ù…Ø¯ÙŠÙ†Ø©ØŸ (Ø·Ø¨ÙŠØ¹ØªÙ‡Ø§ØŒ Ø²ÙŠØ§Ø¯Ø©/Ù†Ù‚ØµØŒ Ø£ØµÙ„/Ù…ØµØ±ÙˆÙ).
3. ðŸŸ¢ **ØªØ­Ù„ÙŠÙ„ Ø¬Ø§Ù†Ø¨ Ø§Ù„Ø¯Ø§Ø¦Ù† (Credit Side)**: Ù„Ù…Ø§Ø°Ø§ ØªÙ… Ø¬Ø¹Ù„ Ù‡Ø°Ù‡ Ø§Ù„Ø­Ø³Ø§Ø¨Ø§Øª Ø¯Ø§Ø¦Ù†Ø©ØŸ (Ø·Ø¨ÙŠØ¹ØªÙ‡Ø§ØŒ Ø²ÙŠØ§Ø¯Ø©/Ù†Ù‚ØµØŒ Ø§Ù„ØªØ²Ø§Ù…/Ø¥ÙŠØ±Ø§Ø¯/Ø­Ù‚ÙˆÙ‚ Ù…Ù„ÙƒÙŠØ©).
4. ðŸ“Š **Ø§Ù„ØªØ£Ø«ÙŠØ± Ø¹Ù„Ù‰ Ø§Ù„Ù‚ÙˆØ§Ø¦Ù… Ø§Ù„Ù…Ø§Ù„ÙŠØ©**: Ø§Ù„ØªØ£Ø«ÙŠØ± Ø§Ù„Ø¯Ù‚ÙŠÙ‚ Ø¹Ù„Ù‰ Ø§Ù„Ù…ÙŠØ²Ø§Ù†ÙŠØ© Ø§Ù„Ø¹Ù…ÙˆÙ…ÙŠØ© (Ø§Ù„Ù…Ø±ÙƒØ² Ø§Ù„Ù…Ø§Ù„ÙŠ) ÙˆÙ‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø¯Ø®Ù„.
5. ðŸ’¡ **Ù†ØµÙŠØ­Ø© Ù…Ø­Ø§Ø³Ø¨ÙŠØ© Ø°Ù‡Ø¨ÙŠØ© Ù„Ù„Ù…ØªØ¹Ù„Ù…**: ÙƒÙŠÙÙŠØ© ØªØ°ÙƒØ± ÙˆÙ…Ø¹Ø§Ù„Ø¬Ø© Ù‡Ø°Ø§ Ø§Ù„Ù‚ÙŠØ¯ ÙÙŠ Ø§Ù„Ø§Ù…ØªØ­Ø§Ù†Ø§Øª ÙˆØ§Ù„ÙˆØ§Ù‚Ø¹ Ø§Ù„Ø¹Ù…Ù„ÙŠ Ø¯ÙˆÙ† Ø§Ù„ÙˆÙ‚ÙˆØ¹ ÙÙŠ Ø£Ø®Ø·Ø§Ø¡ Ø´Ø§Ø¦Ø¹Ø©.`;

    const systemInstruction = `Ø£Ù†Øª "Ù…Ø³Ø§Ø¹Ø¯ Ù…ÙŠØ²Ø§Ù† Ø§Ù„Ø®Ø¨ÙŠØ± Ø§Ù„Ù…Ø­Ø§Ø³Ø¨ÙŠ"ØŒ Ù…Ø¹Ù„Ù… Ù…Ø­Ø§Ø³Ø¨Ø© Ù…ØªØ®ØµØµ ÙˆÙ…ØªÙ…Ø±Ø³.
ØªØ³Ø§Ø¹Ø¯ Ø§Ù„Ø·Ù„Ø§Ø¨ ÙˆØ§Ù„Ù…ØªØ¹Ù„Ù…ÙŠÙ† Ø¹Ù„Ù‰ ÙÙ‡Ù… Ø§Ù„Ù…Ù†Ø·Ù‚ Ø§Ù„Ù…Ø­Ø§Ø³Ø¨ÙŠ Ø§Ù„Ø¹Ù…ÙŠÙ‚ Ù„Ù„Ù‚ÙŠÙˆØ¯ Ø§Ù„Ù…Ø­Ø§Ø³Ø¨ÙŠØ© ÙˆØªØ·Ø¨ÙŠÙ‚ Ù‚Ø§Ø¹Ø¯Ø© Ø§Ù„Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø²Ø¯ÙˆØ¬ ÙˆÙ…Ø¹Ø§ÙŠÙŠØ± Ø§Ù„Ù…Ø­Ø§Ø³Ø¨Ø© (IFRS/GAAP) Ø¨Ø£Ø³Ù„ÙˆØ¨ Ù…Ù…ØªØ¹ØŒ Ù…Ø´Ø¬Ø¹ØŒ ÙˆØ§ÙÙŠØŒ ÙˆÙ…Ù†Ø³Ù‚ Ø¨Ù†Ù‚Ø§Ø· ÙˆØ§Ø¶Ø­Ø© Ø¬Ø¯Ø§Ù‹.`;

    const explanation = (await generateGeminiText(prompt, systemInstruction, 0.5))
      || "Ù„Ù… ÙŠØªÙ… Ø§Ù„ØªÙˆØµÙ„ Ù„Ø´Ø±Ø­ Ù…Ù†Ø§Ø³Ø¨ Ù„Ù„Ù‚ÙŠØ¯.";
    return res.json({ explanation });
  } catch (error: any) {
    console.error("Gemini Journal Explanation Error:", error);
    return res.status(500).json({
      error: "Ø­Ø¯Ø« Ø®Ø·Ø£ Ø£Ø«Ù†Ø§Ø¡ ØªØ­Ù„ÙŠÙ„ Ø§Ù„Ù‚ÙŠØ¯ Ø¨ÙˆØ§Ø³Ø·Ø© Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ. Ø­Ø§ÙˆÙ„ Ù…Ø±Ø© Ø£Ø®Ø±Ù‰.",
    });
  }
});

// ---------------------------------------------------------------------------
// Auth + cloud sync storage (Vercel Blob when BLOB_READ_WRITE_TOKEN is set)
// ---------------------------------------------------------------------------
interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string;
  xp: number;
  streak: number;
  joinedDate: string;
  learningTrack?: string;
  passwordHash: string;
  salt: string;
  tokens: string[];
}

type UsersMap = Record<string, StoredUser>;

// ---------------------------------------------------------------------------
// Auth + cloud sync storage (Vercel Blob when BLOB_READ_WRITE_TOKEN is set)
// ---------------------------------------------------------------------------
const USERS_BLOB = "meezan/users.json";
let memoryUsers: UsersMap | null = null;

async function loadUsers(): Promise<UsersMap> {
  if (!hasBlobToken()) return memoryUsers || {};
  try {
    const blob = await blobGet(USERS_BLOB, { access: "public" });
    if (blob?.blob?.url) {
      const res = await fetch(blob.blob.url);
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === "object") {
          memoryUsers = data;
          return data;
        }
      }
    }
  } catch (e) {
    console.error("Users blob read failed:", e);
  }
  return memoryUsers || {};
}

async function saveUsers(map: UsersMap) {
  memoryUsers = map;
  if (!hasBlobToken()) return;
  try {
    await blobPut(USERS_BLOB, JSON.stringify(map), {
      contentType: "application/json",
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
  } catch (e) {
    console.error("Users blob write failed:", e);
  }
}

function hashPassword(password: string, salt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derived) => {
      if (err) return reject(err);
      resolve(derived.toString("hex"));
    });
  });
}

function isAdminEmail(email: string): boolean {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .includes(String(email || "").trim().toLowerCase());
}

function sanitizeUser(u: StoredUser) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    avatar: u.avatar,
    xp: u.xp,
    streak: u.streak,
    joinedDate: u.joinedDate,
    learningTrack: u.learningTrack,
    isAdmin: isAdminEmail(u.email),
    isLoggedIn: true,
  };
}

function findUserByToken(users: UsersMap, token: string): StoredUser | null {
  return Object.values(users).find((u) => u.tokens.includes(token)) || null;
}

function getBearerToken(req: express.Request): string | null {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return null;
  return header.slice(7).trim() || null;
}

// Register a real account
app.post("/api/auth/register", authLimiter, async (req, res) => {
  try {
    const { name, email, password, role, avatar, learningTrack } = req.body || {};
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanName = String(name || "").trim().slice(0, 60);
    if (!cleanName || !cleanEmail.includes("@")) {
      return res.status(400).json({ error: "ÙŠØ±Ø¬Ù‰ Ø¥Ø¯Ø®Ø§Ù„ Ø§Ø³Ù… ØµØ­ÙŠØ­ ÙˆØ¨Ø±ÙŠØ¯ Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ ØµØ§Ù„Ø­." });
    }
    if (!password || String(password).length < 6) {
      return res.status(400).json({ error: "ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± ÙŠØ¬Ø¨ Ø£Ù† ØªÙƒÙˆÙ† 6 Ø£Ø­Ø±Ù/Ø£Ø±Ù‚Ø§Ù… Ø¹Ù„Ù‰ Ø§Ù„Ø£Ù‚Ù„." });
    }

    const users = await loadUsers();
    if (users[cleanEmail]) {
      return res.status(409).json({ error: "ÙŠÙˆØ¬Ø¯ Ø­Ø³Ø§Ø¨ Ù…Ø³Ø¬Ù„ Ø¨Ø§Ù„ÙØ¹Ù„ Ø¨Ù‡Ø°Ø§ Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ. Ø³Ø¬Ù„ Ø¯Ø®ÙˆÙ„Ùƒ Ù…Ø¨Ø§Ø´Ø±Ø©." });
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = await hashPassword(String(password), salt);
    const token = crypto.randomBytes(24).toString("hex");

    const newUser: StoredUser = {
      id: `usr_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
      email: cleanEmail,
      name: cleanName,
      role: String(role || "Ù…Ø­Ø§Ø³Ø¨ Ù…ØªØ¯Ø±Ø¨").slice(0, 80),
      avatar: String(avatar || "ðŸ‘¨â€ðŸ’¼").slice(0, 8),
      xp: 100,
      streak: 1,
      joinedDate: new Date().toLocaleDateString("ar-SA"),
      learningTrack: learningTrack || undefined,
      passwordHash,
      salt,
      tokens: [token],
    };

    users[cleanEmail] = newUser;
    await saveUsers(users);
    res.json({ token, user: sanitizeUser(newUser) });
  } catch (error: any) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Ø­Ø¯Ø« Ø®Ø·Ø£ Ø£Ø«Ù†Ø§Ø¡ Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø­Ø³Ø§Ø¨. Ø­Ø§ÙˆÙ„ Ù…Ø±Ø© Ø£Ø®Ø±Ù‰." });
  }
});

// Login to an existing account
app.post("/api/auth/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const cleanEmail = String(email || "").trim().toLowerCase();
    if (!cleanEmail || !password) {
      return res.status(400).json({ error: "ÙŠØ±Ø¬Ù‰ Ø¥Ø¯Ø®Ø§Ù„ Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ ÙˆÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ±." });
    }

    const users = await loadUsers();
    const user = users[cleanEmail];
    if (!user) {
      return res.status(401).json({ error: "Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø­Ø³Ø§Ø¨ Ø¨Ù‡Ø°Ø§ Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ. Ø£Ù†Ø´Ø¦ Ø­Ø³Ø§Ø¨Ø§Ù‹ Ø¬Ø¯ÙŠØ¯Ø§Ù‹ Ø£ÙˆÙ„Ø§Ù‹." });
    }

    const hash = await hashPassword(String(password), user.salt);
    if (hash !== user.passwordHash) {
      return res.status(401).json({ error: "ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± ØºÙŠØ± ØµØ­ÙŠØ­Ø©. Ø­Ø§ÙˆÙ„ Ù…Ø±Ø© Ø£Ø®Ø±Ù‰." });
    }

    const token = crypto.randomBytes(24).toString("hex");
    user.tokens = [...user.tokens.slice(-4), token];
    users[cleanEmail] = user;
    await saveUsers(users);
    res.json({ token, user: sanitizeUser(user) });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Ø­Ø¯Ø« Ø®Ø·Ø£ Ø£Ø«Ù†Ø§Ø¡ ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„. Ø­Ø§ÙˆÙ„ Ù…Ø±Ø© Ø£Ø®Ø±Ù‰." });
  }
});

// Get current user from token
app.get("/api/auth/me", async (req, res) => {
  const token = getBearerToken(req);
  if (!token) return res.status(401).json({ error: "ØºÙŠØ± Ù…ØµØ±Ø­ Ø¨Ù‡." });
  const users = await loadUsers();
  const user = findUserByToken(users, token);
  if (!user) return res.status(401).json({ error: "Ø§Ù†ØªÙ‡Øª ØµÙ„Ø§Ø­ÙŠØ© Ø§Ù„Ø¬Ù„Ø³Ø©. Ø³Ø¬Ù„ Ø¯Ø®ÙˆÙ„Ùƒ Ù…Ø±Ø© Ø£Ø®Ø±Ù‰." });
  res.json({ user: sanitizeUser(user) });
});

// Update profile (name/avatar/role/xp/streak/learningTrack)
app.patch("/api/auth/profile", async (req, res) => {
  const token = getBearerToken(req);
  if (!token) return res.status(401).json({ error: "ØºÙŠØ± Ù…ØµØ±Ø­ Ø¨Ù‡." });
  const users = await loadUsers();
  const user = findUserByToken(users, token);
  if (!user) return res.status(401).json({ error: "Ø§Ù†ØªÙ‡Øª ØµÙ„Ø§Ø­ÙŠØ© Ø§Ù„Ø¬Ù„Ø³Ø©. Ø³Ø¬Ù„ Ø¯Ø®ÙˆÙ„Ùƒ Ù…Ø±Ø© Ø£Ø®Ø±Ù‰." });

  const { name, avatar, role, learningTrack } = req.body || {};
  if (typeof req.body?.xp === "number" && Number.isFinite(req.body.xp)) user.xp = Math.max(0, Math.round(req.body.xp));
  if (typeof req.body?.streak === "number" && Number.isFinite(req.body.streak)) user.streak = Math.max(0, Math.round(req.body.streak));
  if (name) user.name = String(name).trim().slice(0, 60);
  if (avatar) user.avatar = String(avatar).slice(0, 8);
  if (role) user.role = String(role).slice(0, 80);
  if (learningTrack) user.learningTrack = learningTrack;

  users[user.email] = user;
  await saveUsers(users);
  res.json({ user: sanitizeUser(user) });
});

// Read cloud-saved learning state for the logged-in user
const memoryState = new Map<string, any>();

app.get("/api/sync", async (req, res) => {
  const token = getBearerToken(req);
  if (!token) return res.status(401).json({ error: "ØºÙŠØ± Ù…ØµØ±Ø­ Ø¨Ù‡." });
  const users = await loadUsers();
  const user = findUserByToken(users, token);
  if (!user) return res.status(401).json({ error: "Ø§Ù†ØªÙ‡Øª ØµÙ„Ø§Ø­ÙŠØ© Ø§Ù„Ø¬Ù„Ø³Ø©. Ø³Ø¬Ù„ Ø¯Ø®ÙˆÙ„Ùƒ Ù…Ø±Ø© Ø£Ø®Ø±Ù‰." });

  if (!hasBlobToken()) {
    return res.json({ state: memoryState.get(user.id) || null });
  }

  const STATE_BLOB = `meezan/state/${user.id}.json`;
  try {
    const blob = await blobGet(STATE_BLOB, { access: "public" });
    if (blob?.blob?.url) {
      const res2 = await fetch(blob.blob.url);
      if (res2.ok) {
        const data = await res2.json();
        if (data && typeof data === "object") return res.json({ state: data });
      }
    }
  } catch (e) {
    console.error("Sync read failed:", e);
  }
  res.json({ state: null });
});

// Save cloud learning state for the logged-in user
app.put("/api/sync", async (req, res) => {
  const token = getBearerToken(req);
  if (!token) return res.status(401).json({ error: "ØºÙŠØ± Ù…ØµØ±Ø­ Ø¨Ù‡." });
  const users = await loadUsers();
  const user = findUserByToken(users, token);
  if (!user) return res.status(401).json({ error: "Ø§Ù†ØªÙ‡Øª ØµÙ„Ø§Ø­ÙŠØ© Ø§Ù„Ø¬Ù„Ø³Ø©. Ø³Ø¬Ù„ Ø¯Ø®ÙˆÙ„Ùƒ Ù…Ø±Ø© Ø£Ø®Ø±Ù‰." });

  const state = req.body?.state;
  if (!state || typeof state !== "object") {
    return res.status(400).json({ error: "Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù…Ø²Ø§Ù…Ù†Ø© ØºÙŠØ± ØµØ§Ù„Ø­Ø©." });
  }

  const payload = { ...state, savedAt: state.savedAt || new Date().toISOString() };

  if (!hasBlobToken()) {
    memoryState.set(user.id, payload);
    return res.json({ ok: true, persisted: false });
  }

  const STATE_BLOB = `meezan/state/${user.id}.json`;
  try {
    await blobPut(STATE_BLOB, JSON.stringify(payload), {
      contentType: "application/json",
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    res.json({ ok: true, persisted: true });
  } catch (e) {
    console.error("Sync write failed:", e);
    memoryState.set(user.id, payload);
    res.json({ ok: true, persisted: false });
  }
});

// ---------------------------------------------------------------------------
// Digital certificates registry (verifiable share links)
// ---------------------------------------------------------------------------
const CERTS_BLOB = "meezan/certificates.json";
let memoryCerts: Record<string, any> | null = null;

async function loadCerts(): Promise<Record<string, any>> {
  if (!hasBlobToken()) return memoryCerts || {};
  try {
    const blob = await blobGet(CERTS_BLOB, { access: "public" });
    if (blob?.blob?.url) {
      const res = await fetch(blob.blob.url);
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === "object") {
          memoryCerts = data;
          return data;
        }
      }
    }
  } catch (e) {
    console.error("Certificates blob read failed:", e);
  }
  return memoryCerts || {};
}

async function saveCerts(map: Record<string, any>) {
  memoryCerts = map;
  if (!hasBlobToken()) return;
  try {
    await blobPut(CERTS_BLOB, JSON.stringify(map), {
      contentType: "application/json",
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
  } catch (e) {
    console.error("Certificates blob write failed:", e);
  }
}

// Issue a certificate (best-effort; bound to the logged-in user when possible)
app.post("/api/certificates", async (req, res) => {
  const { studentName, trackName, jobTitle } = req.body || {};
  const cleanName = String(studentName || "").trim().slice(0, 80);
  if (!cleanName) {
    return res.status(400).json({ error: "Ø§Ø³Ù… Ø§Ù„Ù…ØªØ¯Ø±Ø¨ Ù…Ø·Ù„ÙˆØ¨" });
  }

  const id = `MIZAN-${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  let ownerEmail: string | undefined;
  const token = getBearerToken(req);
  if (token && isSupabaseConfigured()) {
    const sb = await getSupabaseServer();
    if (sb) {
      const { data } = await sb.auth.getUser(token);
      if (data.user?.email) ownerEmail = data.user.email;
    }
  }

  const record = {
    id,
    studentName: cleanName,
    jobTitle: String(jobTitle || "Ù…Ø­Ø§Ø³Ø¨ Ù…Ø§Ù„ÙŠ Ù…Ø¹ØªÙ…Ø¯ / Ù…Ø±Ø§Ø¬Ø¹ Ø­Ø³Ø§Ø¨Ø§Øª").trim().slice(0, 120),
    trackName: String(trackName || "Ø¯Ø¨Ù„ÙˆÙ… Ø§Ù„Ù…Ø­Ø§Ø³Ø¨Ø© Ø§Ù„Ù…Ø§Ù„ÙŠØ© ÙˆØ§Ù„Ù…Ø¹Ø§ÙŠÙŠØ± Ø§Ù„Ø¯ÙˆÙ„ÙŠØ© (IFRS)").trim().slice(0, 200),
    issueDate: new Date().toLocaleDateString("ar-SA"),
    issuedAt: new Date().toISOString(),
    ownerEmail,
  };

  const certs = await loadCerts();
  certs[id] = record;
  await saveCerts(certs);

  res.json({ certificate: record });
});

// Public verification page API
app.get("/api/certificates/:id", async (req, res) => {
  const certId = String(req.params.id || "").trim().slice(0, 64);
  if (!/^MIZAN-[A-Z0-9-]+$/.test(certId)) {
    return res.status(400).json({ error: "Ù…Ø¹Ø±Ù Ø´Ù‡Ø§Ø¯Ø© ØºÙŠØ± ØµØ§Ù„Ø­." });
  }
  const certs = await loadCerts();
  const cert = certs[certId];
  if (!cert) {
    return res.status(404).json({ error: "Ù„Ù… ÙŠØªÙ… Ø§Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„Ù‰ Ù‡Ø°Ù‡ Ø§Ù„Ø´Ù‡Ø§Ø¯Ø© ÙÙŠ Ø³Ø¬Ù„ Ø§Ù„Ù…Ù†ØµØ©." });
  }
  res.json({ certificate: cert });
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Meezan" });
});

// ---------------------------------------------------------------------------
// Admin role guard + content CMS (lessons / tax / quiz / references) + support
// Content is edited from the admin panel and shown live, stored in blob
// (meezan/cms/<collection>.json) with an in-memory fallback.
// ---------------------------------------------------------------------------
const CMS_COLLECTIONS = ["lesson", "tax", "quiz", "reference"] as const;
type CmsCollection = (typeof CMS_COLLECTIONS)[number];

const memoryCms: Record<string, any[]> = { lesson: [], tax: [], quiz: [], reference: [] };

const CMS_SEEDS: Record<CmsCollection, any[]> = {
  lesson: [
    {
      id: "lesson-seed-1",
      title: "Ø£Ø³Ø§Ø³ÙŠØ§Øª Ø§Ù„Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø²Ø¯ÙˆØ¬",
      body: "ÙƒÙ„ Ø¹Ù…Ù„ÙŠØ© Ù…Ø§Ù„ÙŠØ© ØªØ¤Ø«Ø± ÙÙŠ Ø­Ø³Ø§Ø¨ÙŠÙ† Ø¹Ù„Ù‰ Ø§Ù„Ø£Ù‚Ù„: Ù…Ø¯ÙŠÙ† ÙˆØ¯Ø§Ø¦Ù†ØŒ ÙˆÙŠØ¬Ø¨ Ø£Ù† ØªÙƒÙˆÙ† Ø§Ù„Ù…Ø¬Ø§Ù…ÙŠØ¹ Ù…ØªÙˆØ§Ø²Ù†Ø© Ø¯Ø§Ø¦Ù…Ø§Ù‹. Ù…Ø«Ø§Ù„: Ø´Ø±Ø§Ø¡ Ø¨Ø¶Ø§Ø¹Ø© Ù†Ù‚Ø¯Ø§Ù‹ â€” Ø¨Ø¶Ø§Ø¹Ø© (Ù…Ø¯ÙŠÙ†) / Ø§Ù„ØµÙ†Ø¯ÙˆÙ‚ (Ø¯Ø§Ø¦Ù†).",
      category: "Ù…Ø¨Ø§Ø¯Ø¦ Ø§Ù„Ù…Ø­Ø§Ø³Ø¨Ø©",
      reference: "Ø§Ù„Ù…Ø¹ÙŠØ§Ø± Ø§Ù„Ø¹Ø§Ù… Ù„Ù„ØªØ´ØºÙŠÙ„ Ø§Ù„Ù…Ø­Ø§Ø³Ø¨ÙŠ",
      source: "Ù…ØµØ¯Ø± Ø§Ù„Ù…Ù†ØµØ©",
      reviewedBy: "",
      published: true,
      updatedAt: "",
    },
  ],
  tax: [
    {
      id: "tax-seed-1",
      title: "Ø§Ù„Ø²ÙƒØ§Ø© ÙˆØ§Ù„Ø¶Ø±ÙŠØ¨Ø© ÙÙŠ Ø§Ù„Ø³Ø¹ÙˆØ¯ÙŠØ© 2026",
      body: "ØªÙÙØ±Ø¶ Ø§Ù„Ø²ÙƒØ§Ø© Ø¹Ù„Ù‰ Ø§Ù„Ø£Ù†Ø´Ø·Ø© Ø§Ù„Ø®Ø§Ø¶Ø¹Ø© Ø¨Ù†Ø³Ø¨Ø© 2.5%ØŒ ÙˆØ§Ù„Ø¶Ø±ÙŠØ¨Ø© Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ© 15%. Ø§Ù„Ø§Ù„ØªØ²Ø§Ù… ÙŠØªÙ… Ø¹Ø¨Ø± Ø§Ù„Ø¥Ù‚Ø±Ø§Ø±Ø§Øª Ø§Ù„Ù…ÙˆØ­Ø¯Ø© Ù…Ø¹ Ù‡ÙŠØ¦Ø© Ø§Ù„Ø²ÙƒØ§Ø© ÙˆØ§Ù„Ø¶Ø±ÙŠØ¨Ø© ÙˆØ§Ù„Ø¬Ù…Ø§Ø±Ùƒ Ø­Ø³Ø¨ Ù…ÙŠØ¹Ø§Ø¯ ÙƒÙ„ Ù†Ø´Ø§Ø·.",
      category: "Ø§Ù„Ø£Ù†Ø¸Ù…Ø© Ø§Ù„Ø³Ø¹ÙˆØ¯ÙŠØ©",
      reference: "Ù‡ÙŠØ¦Ø© Ø§Ù„Ø²ÙƒØ§Ø© ÙˆØ§Ù„Ø¶Ø±ÙŠØ¨Ø© ÙˆØ§Ù„Ø¬Ù…Ø§Ø±Ùƒ",
      source: "zatca.gov.sa",
      reviewedBy: "",
      published: true,
      updatedAt: "",
    },
  ],
  quiz: [
    {
      id: "quiz-seed-1",
      title: "Ø³Ø¤Ø§Ù„: Ø£Ù†ÙˆØ§Ø¹ Ø§Ù„Ø­Ø³Ø§Ø¨Ø§Øª",
      body: "Ø£ÙŠ Ù…Ù† Ø§Ù„Ø¢ØªÙŠØ© ÙŠÙØ¹Ø¯ Ø­Ø³Ø§Ø¨ Ø£ØµÙ„ØŸ\nØ£) Ø§Ù„Ù…ÙˆØ±Ø¯ÙˆÙ†  Ø¨) Ø§Ù„Ù†Ù‚Ø¯ÙŠØ©  Ø¬) Ø±Ø£Ø³ Ø§Ù„Ù…Ø§Ù„  Ø¯) Ø§Ù„Ø¥ÙŠØ±Ø§Ø¯Ø§Øª\nØ§Ù„Ø¥Ø¬Ø§Ø¨Ø© Ø§Ù„Ù†Ù…ÙˆØ°Ø¬ÙŠØ©: Ø¨) Ø§Ù„Ù†Ù‚Ø¯ÙŠØ©.",
      category: "Ù…Ø¨Ø§Ø¯Ø¦ Ø§Ù„Ù…Ø­Ø§Ø³Ø¨Ø©",
      reference: "Ø§Ù„Ù…Ù†Ù‡Ø¬ Ø§Ù„Ø£Ø³Ø§Ø³ÙŠ",
      source: "Ù…ØµØ¯Ø± Ø§Ù„Ù…Ù†ØµØ©",
      reviewedBy: "",
      published: true,
      updatedAt: "",
    },
  ],
  reference: [
    {
      id: "reference-seed-1",
      title: "Ø¯Ù„ÙŠÙ„ Ø§Ù„Ù…Ø¹Ø§ÙŠÙŠØ± Ø§Ù„Ø¯ÙˆÙ„ÙŠØ© IFRS",
      body: "Ø±ÙˆØ§Ø¨Ø· ÙˆØ£Ø³Ø³ Ø§Ù„Ø§Ø¹ØªØ±Ø§Ù ÙˆØ§Ù„Ù‚ÙŠØ§Ø³ Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ© Ù„ÙƒÙ„ Ù…Ø¹ÙŠØ§Ø± IFRS/IAS Ù…Ø¹ Ù…Ù„Ø®ØµØ§Øª ÙˆØ§Ø±ØªØ¨Ø§Ø· Ù†ØµÙŠ Ù„ÙƒÙ„ Ù‚ÙŠØ¯ ØªØ·Ø¨ÙŠÙ‚ÙŠ.",
      category: "Ø§Ù„Ù…Ø¹Ø§ÙŠÙŠØ± Ø§Ù„Ø¯ÙˆÙ„ÙŠØ©",
      reference: "IFRS Foundation",
      source: "ifrs.org",
      reviewedBy: "",
      published: true,
      updatedAt: "",
    },
  ],
};

async function loadCms(collection: CmsCollection): Promise<any[]> {
  if (!hasBlobToken()) return memoryCms[collection];
  try {
    const blob = await blobGet(`meezan/cms/${collection}.json`, { access: "public" });
    if (blob?.blob?.url) {
      const res = await fetch(blob.blob.url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          memoryCms[collection] = data;
          return data;
        }
      }
    }
  } catch (e) {
    console.error(`CMS ${collection} read failed:`, e);
  }
  return memoryCms[collection];
}

async function saveCms(collection: CmsCollection, items: any[]) {
  memoryCms[collection] = items;
  if (!hasBlobToken()) return;
  try {
    await blobPut(`meezan/cms/${collection}.json`, JSON.stringify(items), {
      contentType: "application/json",
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
  } catch (e) {
    console.error(`CMS ${collection} write failed:`, e);
  }
}

// Verify the caller is an admin by validating the Supabase JWT and matching
// the user's email against the ADMIN_EMAILS environment variable.
async function resolveAdminUser(req: express.Request, res: express.Response): Promise<string | null> {
  const token = getBearerToken(req);
  if (!token) {
    res.status(401).json({ error: "ØºÙŠØ± Ù…ØµØ±Ø­ Ø¨Ù‡. Ø³Ø¬Ù„ Ø¯Ø®ÙˆÙ„Ùƒ Ø£ÙˆÙ„Ø§Ù‹." });
    return null;
  }
  if (!isSupabaseConfigured()) {
    res.status(503).json({ error: "Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Supabase ØºÙŠØ± Ù…Ø¶Ø¨ÙˆØ·Ø© Ø¹Ù„Ù‰ Ø§Ù„Ø®Ø§Ø¯Ù…." });
    return null;
  }
  const sb = await getSupabaseServer();
  if (!sb) {
    res.status(503).json({ error: "Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Supabase ØºÙŠØ± Ù…ØªØ§Ø­Ø© Ø¹Ù„Ù‰ Ø§Ù„Ø®Ø§Ø¯Ù…." });
    return null;
  }
  const { data, error } = await sb.auth.getUser(token);
  if (error || !data.user) {
    res.status(401).json({ error: "Ø¬Ù„Ø³Ø© ØºÙŠØ± ØµØ§Ù„Ø­Ø©. Ø³Ø¬Ù„ Ø¯Ø®ÙˆÙ„Ùƒ Ù…Ø±Ø© Ø£Ø®Ø±Ù‰." });
    return null;
  }
  const email = String(data.user.email || "").trim().toLowerCase();
  if (!isAdminEmail(email)) {
    res.status(403).json({ error: "Ù„ÙŠØ³Øª Ù„Ø¯ÙŠÙƒ ØµÙ„Ø§Ø­ÙŠØ© Ø§Ù„Ù…Ø´Ø±Ù." });
    return null;
  }
  return email;
}

// Lightweight endpoint the client calls to learn whether the signed-in user is
// an admin (used to reveal the admin panel in the UI).
app.get("/api/admin/check", async (req, res) => {
  const token = getBearerToken(req);
  if (!token || !isSupabaseConfigured()) return res.json({ isAdmin: false });
  const sb = await getSupabaseServer();
  if (!sb) return res.json({ isAdmin: false });
  const { data, error } = await sb.auth.getUser(token);
  if (error || !data.user) return res.json({ isAdmin: false });
  res.json({ isAdmin: isAdminEmail(String(data.user.email || "").trim().toLowerCase()) });
});

function sanitizeCmsItem(raw: any, existingId?: string) {
  const clean = existingId || `c-${Date.now().toString(36)}-${crypto.randomBytes(3).toString("hex")}`;
  return {
    id: String(raw.id || clean),
    title: String(raw.title || "").trim().slice(0, 200),
    body: String(raw.body || "").trim().slice(0, 20000),
    category: String(raw.category || "Ø¹Ø§Ù…").trim().slice(0, 80),
    reference: String(raw.reference || "").trim().slice(0, 200),
    source: String(raw.source || "").trim().slice(0, 300),
    reviewedBy: String(raw.reviewedBy || "").trim().slice(0, 120),
    published: !!raw.published,
    updatedAt: new Date().toISOString(),
  };
}

// Public CMS read (published items only)
app.get("/api/cms/:collection", async (req, res) => {
  const collection = String(req.params.collection || "").toLowerCase() as CmsCollection;
  if (!(CMS_COLLECTIONS as readonly string[]).includes(collection)) {
    return res.status(400).json({ error: "Ù…Ø¬Ù…ÙˆØ¹Ø© Ù…Ø­ØªÙˆÙ‰ ØºÙŠØ± Ù…Ø¹Ø±ÙˆÙØ©." });
  }
  const seeded = CMS_SEEDS[collection] || [];
  const stored = await loadCms(collection);
  const merged = [...stored, ...seeded.filter((s) => !stored.some((i) => i.id === s.id))];
  res.json({ items: merged.filter((i) => i.published) });
});

// Admin CMS read (all items, drafts included)
app.get("/api/admin/cms/:collection", async (req, res) => {
  const admin = await resolveAdminUser(req, res);
  if (!admin) return;
  const collection = String(req.params.collection || "").toLowerCase() as CmsCollection;
  if (!(CMS_COLLECTIONS as readonly string[]).includes(collection)) {
    return res.status(400).json({ error: "Ù…Ø¬Ù…ÙˆØ¹Ø© Ù…Ø­ØªÙˆÙ‰ ØºÙŠØ± Ù…Ø¹Ø±ÙˆÙØ©." });
  }
  const seeded = CMS_SEEDS[collection] || [];
  const stored = await loadCms(collection);
  const merged = [...stored, ...seeded.filter((s) => !stored.some((i) => i.id === s.id))];
  res.json({ items: merged });
});

// Admin CMS upsert (create or update)
app.post("/api/admin/cms/:collection", async (req, res) => {
  const admin = await resolveAdminUser(req, res);
  if (!admin) return;
  const collection = String(req.params.collection || "").toLowerCase() as CmsCollection;
  if (!(CMS_COLLECTIONS as readonly string[]).includes(collection)) {
    return res.status(400).json({ error: "Ù…Ø¬Ù…ÙˆØ¹Ø© Ù…Ø­ØªÙˆÙ‰ ØºÙŠØ± Ù…Ø¹Ø±ÙˆÙØ©." });
  }
  const items = await loadCms(collection);
  const raw = req.body?.item || {};
  const existingId = String(raw.id || "") || undefined;
  const item = sanitizeCmsItem(raw, existingId);
  const idx = items.findIndex((i) => i.id === item.id);
  if (idx >= 0) items[idx] = item;
  else items.unshift(item);
  await saveCms(collection, items);
  res.json({ item });
});

// Admin CMS delete
app.delete("/api/admin/cms/:collection/:id", async (req, res) => {
  const admin = await resolveAdminUser(req, res);
  if (!admin) return;
  const collection = String(req.params.collection || "").toLowerCase() as CmsCollection;
  if (!(CMS_COLLECTIONS as readonly string[]).includes(collection)) {
    return res.status(400).json({ error: "Ù…Ø¬Ù…ÙˆØ¹Ø© Ù…Ø­ØªÙˆÙ‰ ØºÙŠØ± Ù…Ø¹Ø±ÙˆÙØ©." });
  }
  const id = String(req.params.id || "").trim();
  const items = await loadCms(collection);
  const filtered = items.filter((i) => i.id !== id);
  await saveCms(collection, filtered);
  res.json({ ok: true });
});

// ---------------------------------------------------------------------------
// Support: FAQ + tickets
// ---------------------------------------------------------------------------
const FAQ_BLOB = "meezan/faq.json";
const TICKETS_BLOB = "meezan/tickets.json";
let memoryFaq: any[] | null = null;
let memoryTickets: Record<string, any> | null = null;

const FAQ_SEEDS = [
  { id: "faq-1", question: "ÙƒÙŠÙ Ø£Ø³Ø¬Ù„ Ø­Ø³Ø§Ø¨Ø§Ù‹ Ø¬Ø¯ÙŠØ¯Ø§Ù‹ØŸ", answer: "Ù…Ù† Ø£ÙŠÙ‚ÙˆÙ†Ø© Ø§Ù„Ø­Ø³Ø§Ø¨ ÙÙŠ Ø§Ù„Ø´Ø±ÙŠØ· Ø§Ù„Ø¹Ù„ÙˆÙŠ Ø§Ø®ØªØ± Ø¥Ù†Ø´Ø§Ø¡ Ø­Ø³Ø§Ø¨ Ø«Ù… Ø£Ø¯Ø®Ù„ Ø¨Ø±ÙŠØ¯Ùƒ ÙˆÙƒÙ„Ù…Ø© Ù…Ø±ÙˆØ± (6 Ø£Ø­Ø±Ù Ø¹Ù„Ù‰ Ø§Ù„Ø£Ù‚Ù„)." },
  { id: "faq-2", question: "Ù‡Ù„ Ø§Ù„Ù…Ù†ØµØ© Ù…Ø¬Ø§Ù†ÙŠØ©ØŸ", answer: "Ù†Ø¹Ù…ØŒ Ø§Ù„ØªØ¹Ù„Ù… Ø§Ù„Ø£Ø³Ø§Ø³ÙŠ ÙˆØ§Ù„Ù…ÙƒØªØ¨Ø© ÙˆØ§Ù„Ø§Ø®ØªØ¨Ø§Ø±Ø§Øª Ù…ØªØ§Ø­Ø© Ù…Ø¬Ø§Ù†Ø§Ù‹ØŒ ÙˆØªÙˆØ¬Ø¯ Ù…Ø³Ø§Ø±Ø§Øª Ø§Ø­ØªØ±Ø§ÙÙŠØ© Ù…Ø¯ÙÙˆØ¹Ø© Ù‚Ø±ÙŠØ¨Ø§Ù‹." },
  { id: "faq-3", question: "ÙƒÙŠÙ Ø£Ø­ØµÙ„ Ø¹Ù„Ù‰ Ø´Ù‡Ø§Ø¯ØªÙŠØŸ", answer: "Ø¨Ø¹Ø¯ Ø¥ÙƒÙ…Ø§Ù„ Ù…Ø³Ø§Ø± Ù…ØªØ®ØµØµ Ø³ØªØªÙ…ÙƒÙ† Ù…Ù† ØªÙˆÙ„ÙŠØ¯ Ø´Ù‡Ø§Ø¯Ø© Ù…ÙˆØ«Ù‘Ù‚Ø© Ø¨Ø±Ø§Ø¨Ø· ØªØ­Ù‚Ù‚ Ø¹Ø§Ù… Ù…Ù† Ù‚Ø³Ù… Ø§Ù„Ø­Ø³Ø§Ø¨ > Ø§Ù„Ø´Ù‡Ø§Ø¯Ø§Øª." },
  { id: "faq-4", question: "Ø£ÙŠÙ† ÙŠÙ…ÙƒÙ†Ù†ÙŠ Ø§Ù„ØªØ¨Ù„ÙŠØº Ø¹Ù† Ø®Ø·Ø£ ÙÙŠ Ø§Ù„Ù…Ø­ØªÙˆÙ‰ Ø£Ùˆ Ø§Ù‚ØªØ±Ø§Ø­ØŸ", answer: "Ø§Ø³ØªØ®Ø¯Ù… Ù†Ù…ÙˆØ°Ø¬ Ø§Ù„ØªØ¨Ù„ÙŠØº ÙÙŠ ØµÙØ­Ø© Ø§Ù„Ø¯Ø¹Ù… ÙˆØ³ÙŠØµÙ„Ùƒ ØªØªØ¨Ø¹ Ø¹Ø¨Ø± Ø¨Ø±ÙŠØ¯Ùƒ Ø£Ùˆ Ø§Ø±Ø¬Ø¹ Ù„Ø¯Ø¹Ù… Ù…Ù†ØµØªÙ†Ø§." },
];

async function loadFaq(): Promise<any[]> {
  if (!hasBlobToken()) return memoryFaq && memoryFaq.length ? memoryFaq : FAQ_SEEDS;
  try {
    const blob = await blobGet(FAQ_BLOB, { access: "public" });
    if (blob?.blob?.url) {
      const res = await fetch(blob.blob.url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          memoryFaq = data;
          return data;
        }
      }
    }
  } catch (e) {
    console.error("FAQ read failed:", e);
  }
  return FAQ_SEEDS;
}

async function loadTickets(): Promise<Record<string, any>> {
  if (!hasBlobToken()) return memoryTickets || {};
  try {
    const blob = await blobGet(TICKETS_BLOB, { access: "public" });
    if (blob?.blob?.url) {
      const res = await fetch(blob.blob.url);
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === "object") {
          memoryTickets = data;
          return data;
        }
      }
    }
  } catch (e) {
    console.error("Tickets read failed:", e);
  }
  return memoryTickets || {};
}

async function saveTickets(map: Record<string, any>) {
  memoryTickets = map;
  if (!hasBlobToken()) return;
  try {
    await blobPut(TICKETS_BLOB, JSON.stringify(map), {
      contentType: "application/json",
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
  } catch (e) {
    console.error("Tickets write failed:", e);
  }
}

// Public FAQ
app.get("/api/support/faq", async (_req, res) => {
  const faq = await loadFaq();
  res.json({ items: faq });
});

// Create a support ticket (public, rate-limited)
app.post("/api/support/tickets", rateLimiter(60 * 1000, 10), async (req, res) => {
  const { name, email, subject, message, category } = req.body || {};
  const cleanEmail = String(email || "").trim().toLowerCase().slice(0, 120);
  const cleanName = String(name || "").trim().slice(0, 80);
  const cleanSubject = String(subject || "").trim().slice(0, 200);
  const cleanMessage = String(message || "").trim().slice(0, 8000);
  if (!cleanName || !cleanEmail.includes("@") || !cleanSubject || !cleanMessage) {
    return res.status(400).json({ error: "ÙŠØ±Ø¬Ù‰ Ø¥ÙƒÙ…Ø§Ù„ ÙƒØ§ÙØ© Ø§Ù„Ø­Ù‚ÙˆÙ„ Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø©." });
  }

  const tickets = await loadTickets();
  const id = `TCK-${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  tickets[id] = {
    id,
    name: cleanName,
    email: cleanEmail,
    subject: cleanSubject,
    message: cleanMessage,
    category: String(category || "Ø¹Ø§Ù…").slice(0, 60),
    status: "open",
    createdAt: new Date().toISOString(),
    notes: "",
  };
  await saveTickets(tickets);
  res.json({ ticket: { id, status: "open", createdAt: new Date().toISOString() } });
});

// Admin: list tickets
app.get("/api/admin/tickets", async (_req, res) => {
  const admin = await resolveAdminUser(_req, res);
  if (!admin) return;
  const tickets = await loadTickets();
  res.json({ items: Object.values(tickets).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))) });
});

// Admin: update ticket status/notes
app.patch("/api/admin/tickets/:id", async (req, res) => {
  const admin = await resolveAdminUser(req, res);
  if (!admin) return;
  const id = String(req.params.id || "").trim();
  const tickets = await loadTickets();
  const ticket = tickets[id];
  if (!ticket) return res.status(404).json({ error: "Ø§Ù„ØªØ°ÙƒØ±Ø© ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯Ø©." });
  if (typeof req.body?.status === "string") ticket.status = String(req.body.status).slice(0, 20);
  if (typeof req.body?.notes === "string") ticket.notes = String(req.body.notes).slice(0, 3000);
  tickets[id] = ticket;
  await saveTickets(tickets);
  res.json({ ticket });
});

const handler = (req: express.Request, res: express.Response) => {
  app(req, res);
};

export default handler;
