import express from "express";
import { GoogleGenAI } from "@google/genai";
import { get as blobGet, put as blobPut } from "@vercel/blob";
import { INITIAL_REVIEWS } from "../src/data/seedReviews";

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

const geminiLimiter = rateLimiter(60 * 1000, 15);
const reviewLimiter = rateLimiter(60 * 1000, 5);

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
      error: "حدث خطأ أثناء التواصل مع مساعد ميزان الذكي.",
      details: error?.message,
    });
  }
});

// Gemini AI Journal Entry Explanation Endpoint
app.post("/api/explain-journal", geminiLimiter, async (req, res) => {
  try {
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
      error: "حدث خطأ أثناء تحليل القيد بواسطة الذكاء الاصطناعي.",
      details: error?.message,
    });
  }
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Meezan" });
});

const handler = (req: express.Request, res: express.Response) => {
  app(req, res);
};

export default handler;
