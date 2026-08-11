import express from "express";
import crypto from "crypto";
import { GoogleGenAI } from "@google/genai";
import { get as blobGet, put as blobPut } from "@vercel/blob";

// Seed reviews — kept inline because Vercel only packs the api/ folder into the
// lambda; any import reaching outside it (e.g. ../src/...) fails at runtime.
const INITIAL_REVIEWS = [
  {
    id: "r1",
    stars: 5,
    name: "أحمد السيد",
    role: "طالب محاسبة — جامعة القاهرة",
    text: "صراحة، ميزان غيّر فهمي للمحاسبة تماماً. كنت دايمًا أتخوف من القيود والتسويات، لكن الشرح بالعربي والتطبيق العملي بالمعمل خلّاني أستوعب في أسبوعين أكثر من ترم جامعي كامل.",
    createdAt: "منذ يومين"
  },
  {
    id: "r2",
    stars: 5,
    name: "سارة الحربي",
    role: "محاسبة حديثة التخرج — الرياض",
    text: "معمل القيود هي الميزة الأفضل بالنسبة لي! بتطبّق القيد بنفسك وتشوف التوازن والصحة فوراً. ده خلّاني أتغلب على عقدة المدين والدائن بسهولة شديدة.",
    createdAt: "منذ 4 أيام"
  },
  {
    id: "r3",
    stars: 5,
    name: "محمد العلي",
    role: "محاسب مالي — الخبر",
    text: "كنت محتاج أتجهز لشهادة CMA ولقيت في ميزان كورس كامل بمستوى عالي جدًا ومساعد AI بيفسرلي المعايير المعقدة فوراً باللغة العربية. تطبيق 10/10.",
    createdAt: "منذ أسبوع"
  },
  {
    id: "r4",
    stars: 5,
    name: "نورة الفهد",
    role: "محاسبة — شركة المراعي",
    text: "بطاقات المصطلحات المحاسبية دي كنز حقيقي. كل يوم براجع 10 بطاقات بالإنجليزية والعربية في طريقي للعمل، ومستواي تحسن بشكل ملحوظ.",
    createdAt: "منذ أسبوعين"
  },
  {
    id: "r5",
    stars: 4,
    name: "يوسف باحارث",
    role: "محاسب — جدة",
    text: "تطبيق ممتااااز بجد، والتحفيز بالنجوم والإنجازات خلاني ملتزم بالتعلم يومياً. بانتظار إضافة المزيد من حالات معالجة الزكاة والضريبة.",
    createdAt: "منذ 3 أسابيع"
  },
  {
    id: "r6",
    stars: 5,
    name: "خالد القحطاني",
    role: "مهندس تحول للمحاسبة — الظهران",
    text: "أنا خريج هندسة وبحول لمجال المحاسبة، ميزان جعل الرحلة ممتعة وسلسة جداً. التدرج في الـ 32 مرحلة منظّم للغاية والاختبارات بتثبت المعلومة.",
    createdAt: "منذ شهر"
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
        error: "محاولات كثيرة. يرجى الانتظار قليلاً قبل المحاولة مرة أخرى.",
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
  if (!body || typeof body !== "object") return "البيانات غير صالحة.";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (message.length > MAX_TEXT_CHARS) return "الرسالة طويلة جداً. يرجى تقصيرها وإعادة المحاولة.";
  if (Array.isArray(body.history)) {
    if (body.history.length > MAX_HISTORY_TURNS) return "سجل المحادثة كبير جداً. ابدأ محادثة جديدة.";
    for (const h of body.history) {
      const t = h?.text || "";
      const img = h?.image?.data || "";
      if ((typeof t === "string" && t.length > MAX_TEXT_CHARS) || (typeof img === "string" && img.length > MAX_IMAGE_BASE64_LEN)) {
        return "أحد عناصر سجل المحادثة يتجاوز الحد المسموح.";
      }
    }
  }
  const imgData = typeof body.image?.data === "string" ? body.image.data : "";
  if (imgData.length > MAX_IMAGE_BASE64_LEN) return "حجم الصورة يتجاوز الحد المسموح (10 ميجابايت).";
  if (body.entry !== undefined) {
    try {
      const size = JSON.stringify(body.entry)?.length || 0;
      if (size > MAX_JOURNAL_ENTRY_JSON_LEN) return "تفاصيل القيد كبيرة جداً.";
    } catch {
      return "تفاصيل القيد غير صالحة.";
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
    return res.status(400).json({ error: "الاسم والرأي مطلوبان" });
  }
  const starCount = Math.min(5, Math.max(1, parseInt(stars, 10) || 5));
  const newRev = {
    id: Date.now().toString(),
    stars: starCount,
    name: String(name).trim().slice(0, 80),
    role: String(role || "متعلم في ميزان").trim().slice(0, 120),
    text: String(text).trim().slice(0, 1000),
    createdAt: "الآن",
    submittedAt: new Date().toISOString(),
  };
  const reviews = await loadReviews();
  reviews.unshift(newRev);
  await saveReviews(reviews);
  res.json({ review: newRev });
});

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
      return res.status(400).json({ error: "الرسالة أو الصورة مطلوب إرسالها" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "مفتاح GEMINI_API_KEY غير متوفر في البيئة.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    let personaInstruction = `أنت "مساعد ميزان"، معلم وخبير محترف في علم المحاسبة المالية وقراءة الفواتير والمستندات المحاسبية باللغة العربية.`;

    if (persona === "ifrs") {
      personaInstruction = `أنت "مستشار معايير IFRS الدولية"، خبير متخصص في المعايير المحاسبية الدولية (IFRS/IAS). قم بإجابة الأسئلة وتحليل المستندات مع ربطها برقم المعيار المعني (مثل IFRS 15, IFRS 16, IAS 16) وإعطاء أمثلة معالجة قيود بالجنيه/الريال.`;
    } else if (persona === "socpa") {
      personaInstruction = `أنت "مدرب زمالة SOCPA & CMA"، أستاذ متخصص في إعداد الطلاب لاختبارات الهيئة السعودية للمراجعين والمحاسبين (SOCPA) واختبار المالي المعتمد (CMA). قم بتزويد الطالب بتمارين خيارات متعددة مع الشرح والتفسير والحل الرياضي والمحاسبي المنهجي.`;
    } else if (persona === "odoo") {
      personaInstruction = `أنت "خبير نظم Odoo ERP والميكنة المحاسبية"، متمرس في توجيه القيود اليومية، دفاتر اليومية (Journal Entries)، دليل الحسابات (Chart of Accounts)، وقراءة الفواتير لإنشاء قيود Odoo v17.`;
    } else if (persona === "analysis") {
      personaInstruction = `أنت "محلل مالي خبير"، متخصص في تحليل القوائم المالية، النسب المالية (Ratios)، التدفقات النقدية، وقراءة المستندات والتقارير المالية للشركات بأسلوب احترافي ورسومي.`;
    }

    const systemInstruction = `${personaInstruction}
مهمتك إجابة أسئلة الطلاب والمتعلمين وتحليل أي مستندات أو فواتير أو صور مرفقة بأسلوب مبسط، وافي، مشجع وواضح جداً باللغة العربية.
إذا أرفق المستخدم صورة (مثل فاتورة، إيصال، أو قائمة مالية)، قم بقراءة بياناتها بدقة واستخراج المبالغ والتاريخ وأسماء الأطراف والتوجيه المحاسبي الصحيح.
عند إعطاء قيود محاسبية، واصل استخدام الصيغ القياسية المنظمة مثل:
[من حـ/ اسم الحساب] - (مدين)
[إلى حـ/ اسم الحساب] - (دائن)
اجعل ردودك منسقة بأسلوب نظيف مع نقاط واضحة ورؤوس أقلام سهلة القراءة.`;

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
    const userTextPrompt = message || "يرجى تحليل ودراسة هذه الصورة أو المستند المحاسبي وتوجيهه محاسبياً واستخراج قيود اليومية التفصيلية الممكنة.";
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

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "عذراً، لم أستطع توليد إجابة في الوقت الحالي.";
    return res.json({ reply });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({
      error: "حدث خطأ أثناء التواصل مع مساعد ميزان الذكي. حاول مرة أخرى.",
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
      return res.status(400).json({ error: "تفاصيل القيد المحاسبي مطلوبة" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "مفتاح GEMINI_API_KEY غير متوفر في البيئة.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const entryDetailsStr = JSON.stringify(entry, null, 2);

    const prompt = `قم بتحليل القيد المحاسبي المحفوظ التالي بشكل تفصيلي وشرح المنطق المحاسبي للمتعلم:

بيانات القيد:
${entryDetailsStr}

يرجى تقديم الشرح باللغة العربية بالهيكل التالي:
1. 🎯 **فكرة العملية المالية (motive/transaction)**: ما هو الحدث الاقتصادي أو المعاملة المالية التي يعبر عنها هذا القيد بأسلوب حيوي وسهل.
2. 🔴 **تحليل جانب المدين (Debit Side)**: لماذا تم جعل هذه الحسابات مدينة؟ (طبيعتها، زيادة/نقص، أصل/مصروف).
3. 🟢 **تحليل جانب الدائن (Credit Side)**: لماذا تم جعل هذه الحسابات دائنة؟ (طبيعتها، زيادة/نقص، التزام/إيراد/حقوق ملكية).
4. 📊 **التأثير على القوائم المالية**: التأثير الدقيق على الميزانية العمومية (المركز المالي) وقائمة الدخل.
5. 💡 **نصيحة محاسبية ذهبية للمتعلم**: كيفية تذكر ومعالجة هذا القيد في الامتحانات والواقع العملي دون الوقوع في أخطاء شائعة.`;

    const systemInstruction = `أنت "مساعد ميزان الخبير المحاسبي"، معلم محاسبة متخصص ومتمرس.
تساعد الطلاب والمتعلمين على فهم المنطق المحاسبي العميق للقيود المحاسبية وتطبيق قاعدة القيد المزدوج ومعايير المحاسبة (IFRS/GAAP) بأسلوب ممتع، مشجع، وافي، ومنسق بنقاط واضحة جداً.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.5,
      },
    });

    const explanation = response.text || "لم يتم التوصل لشرح مناسب للقيد.";
    return res.json({ explanation });
  } catch (error: any) {
    console.error("Gemini Journal Explanation Error:", error);
    return res.status(500).json({
      error: "حدث خطأ أثناء تحليل القيد بواسطة الذكاء الاصطناعي. حاول مرة أخرى.",
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
      return res.status(400).json({ error: "يرجى إدخال اسم صحيح وبريد إلكتروني صالح." });
    }
    if (!password || String(password).length < 6) {
      return res.status(400).json({ error: "كلمة المرور يجب أن تكون 6 أحرف/أرقام على الأقل." });
    }

    const users = await loadUsers();
    if (users[cleanEmail]) {
      return res.status(409).json({ error: "يوجد حساب مسجل بالفعل بهذا البريد الإلكتروني. سجل دخولك مباشرة." });
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = await hashPassword(String(password), salt);
    const token = crypto.randomBytes(24).toString("hex");

    const newUser: StoredUser = {
      id: `usr_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
      email: cleanEmail,
      name: cleanName,
      role: String(role || "محاسب متدرب").slice(0, 80),
      avatar: String(avatar || "👨‍💼").slice(0, 8),
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
    res.status(500).json({ error: "حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى." });
  }
});

// Login to an existing account
app.post("/api/auth/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const cleanEmail = String(email || "").trim().toLowerCase();
    if (!cleanEmail || !password) {
      return res.status(400).json({ error: "يرجى إدخال البريد الإلكتروني وكلمة المرور." });
    }

    const users = await loadUsers();
    const user = users[cleanEmail];
    if (!user) {
      return res.status(401).json({ error: "لا يوجد حساب بهذا البريد الإلكتروني. أنشئ حساباً جديداً أولاً." });
    }

    const hash = await hashPassword(String(password), user.salt);
    if (hash !== user.passwordHash) {
      return res.status(401).json({ error: "كلمة المرور غير صحيحة. حاول مرة أخرى." });
    }

    const token = crypto.randomBytes(24).toString("hex");
    user.tokens = [...user.tokens.slice(-4), token];
    users[cleanEmail] = user;
    await saveUsers(users);
    res.json({ token, user: sanitizeUser(user) });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ error: "حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى." });
  }
});

// Get current user from token
app.get("/api/auth/me", async (req, res) => {
  const token = getBearerToken(req);
  if (!token) return res.status(401).json({ error: "غير مصرح به." });
  const users = await loadUsers();
  const user = findUserByToken(users, token);
  if (!user) return res.status(401).json({ error: "انتهت صلاحية الجلسة. سجل دخولك مرة أخرى." });
  res.json({ user: sanitizeUser(user) });
});

// Update profile (name/avatar/role/xp/streak/learningTrack)
app.patch("/api/auth/profile", async (req, res) => {
  const token = getBearerToken(req);
  if (!token) return res.status(401).json({ error: "غير مصرح به." });
  const users = await loadUsers();
  const user = findUserByToken(users, token);
  if (!user) return res.status(401).json({ error: "انتهت صلاحية الجلسة. سجل دخولك مرة أخرى." });

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
  if (!token) return res.status(401).json({ error: "غير مصرح به." });
  const users = await loadUsers();
  const user = findUserByToken(users, token);
  if (!user) return res.status(401).json({ error: "انتهت صلاحية الجلسة. سجل دخولك مرة أخرى." });

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
  if (!token) return res.status(401).json({ error: "غير مصرح به." });
  const users = await loadUsers();
  const user = findUserByToken(users, token);
  if (!user) return res.status(401).json({ error: "انتهت صلاحية الجلسة. سجل دخولك مرة أخرى." });

  const state = req.body?.state;
  if (!state || typeof state !== "object") {
    return res.status(400).json({ error: "بيانات المزامنة غير صالحة." });
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
    return res.status(400).json({ error: "اسم المتدرب مطلوب" });
  }

  const id = `MIZAN-${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  let ownerEmail: string | undefined;
  const token = getBearerToken(req);
  if (token) {
    const users = await loadUsers();
    const user = findUserByToken(users, token);
    if (user) ownerEmail = user.email;
  }

  const record = {
    id,
    studentName: cleanName,
    jobTitle: String(jobTitle || "محاسب مالي معتمد / مراجع حسابات").trim().slice(0, 120),
    trackName: String(trackName || "دبلوم المحاسبة المالية والمعايير الدولية (IFRS)").trim().slice(0, 200),
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
    return res.status(400).json({ error: "معرف شهادة غير صالح." });
  }
  const certs = await loadCerts();
  const cert = certs[certId];
  if (!cert) {
    return res.status(404).json({ error: "لم يتم العثور على هذه الشهادة في سجل المنصة." });
  }
  res.json({ certificate: cert });
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Meezan" });
});

const handler = (req: express.Request, res: express.Response) => {
  app(req, res);
};

export default handler;
