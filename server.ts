import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

// Gemini via the REST API (fetch is built into Node 18+, no SDK needed).
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

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: "25mb" }));

  // Guards to bound the cost of each Gemini call (message / history / image)
  const MAX_TEXT_CHARS = 6000;
  const MAX_HISTORY_TURNS = 30;
  const MAX_IMAGE_BASE64_LEN = 14_000_000;
const MAX_JOURNAL_ENTRY_JSON_LEN = 250_000;
  const aiGuard = (body: any): string | null => {
    if (!body || typeof body !== "object") return "البيانات غير صالحة.";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (message.length > MAX_TEXT_CHARS) return "الرسالة طويلة جداً. يرجى تقصيرها وإعادة المحاولة.";
    if (Array.isArray(body.history) && body.history.length > MAX_HISTORY_TURNS) return "سجل المحادثة كبير جداً. ابدأ محادثة جديدة.";
    const imgData = typeof body.image?.data === "string" ? body.image.data : "";
    if (imgData.length > MAX_IMAGE_BASE64_LEN) return "حجم الصورة يتجاوز الحد المسموح (10 ميجابايت).";
    return null;
  };

  // Gemini AI Assistant Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const guardError = aiGuard(req.body);
      if (guardError) {
        return res.status(400).json({ error: guardError });
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

      // Construct contents array with history if provided
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
                data: cleanBase64
              }
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
            data: cleanBase64
          }
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
        error: "حدث خطأ أثناء التواصل مع مساعد ميزان الذكي. حاول مرة أخرى.",
      });
    }
  });

  // Gemini AI Journal Entry Explanation Endpoint
  app.post("/api/explain-journal", async (req, res) => {
    try {
      const { entry } = req.body;
      if (!entry) {
        return res.status(400).json({ error: "تفاصيل القيد المحاسبي مطلوبة" });
      }
      let entryDetailsStr: string;
      try {
        entryDetailsStr = JSON.stringify(entry, null, 2);
      } catch {
        return res.status(400).json({ error: "تفاصيل القيد المحاسبي غير صالحة." });
      }
      if (entryDetailsStr.length > MAX_JOURNAL_ENTRY_JSON_LEN) {
        return res.status(400).json({ error: "تفاصيل القيد كبيرة جداً." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "مفتاح GEMINI_API_KEY غير متوفر في البيئة.",
        });
      }

      const prompt = `قم بتحليل القيد المحاسبي المحفوظ التالي بشكل تفصيلي وشرح المنطق المحاسبي للمتعلم:

بيانات القيد:
${entryDetailsStr}

يرجى تقديم الشرح باللغة العربية بالهيكل التالي:
1. 🎯 **فكرة العملية المالية (motive/transaction)**: ما هو الحدث الاقتصادي أو المعاملة المالية التي يعبر عنها هذا القيد بأسلوب حيوي وسهل.
2. 🔴 **تحليل جانب المدين (Debit Side)**: لماذا تم جعل هذه الحسابات مدينة؟ (طبيعتها، زيادة/نقص، أصل/مصروف).
3. 🟢 **تحليل جانب الدائن (Credit Side)**: لماذا تم جعل هذه الحسابات دائنة؟ (طبيعتها، زيادة/نقص، التزام/إيراد/حقوق ملكية).
4. 📊 **التأثير على القوائم المالية**: التأثير الدقيق على الميزانية العمومية (المركز المالي) وقائمة الدخل.
5. 💡 **نصيحة محاسبية ذهبية للمتعلم**: كيفية تذكر ومعالجة هذا القيد في الامتحانات والواقع العملي دون الوقوع في أخطاء شائع.`;

      const systemInstruction = `أنت "مساعد ميزان الخبير المحاسبي"، معلم محاسبة متخصص ومتمرس.
تساعد الطلاب والمتعلمين على فهم المنطق المحاسبي العميق للقيود المحاسبية وتطبيق قاعدة القيد المزدوج ومعايير المحاسبة (IFRS/GAAP) بأسلوب ممتع، مشجع، وافي، ومنسق بنقاط واضحة جداً.`;

      const explanation = (await generateGeminiText(prompt, systemInstruction, 0.5))
        || "لم يتم التوصل لشرح مناسب للقيد.";
      return res.json({ explanation });
    } catch (error: any) {
      console.error("Gemini Journal Explanation Error:", error);
      return res.status(500).json({
        error: "حدث خطأ أثناء تحليل القيد بواسطة الذكاء الاصطناعي. حاول مرة أخرى.",
      });
    }
  });

  // Odoo AI Interactive Chatter Endpoint
  app.post("/api/odoo-chat", async (req, res) => {
    try {
      const guardError = aiGuard(req.body);
      if (guardError) {
        return res.status(400).json({ error: guardError });
      }
      const { message, currentEntry, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "الرسالة مطلوبة" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "مفتاح GEMINI_API_KEY غير متوفر في البيئة.",
        });
      }

      const entryContext = currentEntry
        ? `البيانات الحالية للقيد المحاسبي المعروض بـ Odoo:
- رقم القيد: ${currentEntry.name}
- دفتر اليومية: ${currentEntry.journal}
- الشريك: ${currentEntry.partner}
- تاريخ القيد: ${currentEntry.date}
- المرجع: ${currentEntry.ref}
- الحالة: ${currentEntry.status}
- إجمالي المدين والدائن: ${currentEntry.totalDebit} ج.م / ${currentEntry.totalCredit} ج.م
- بنود القيد:
${currentEntry.items?.map((it: any) => `  * [${it.accountCode}] ${it.accountName} | بيان: ${it.label} | مدين: ${it.debit} | دائن: ${it.credit}`).join("\n")}`
        : "لا يوجد قيد محدد حالياً.";

      const chatPrompt = `أنت "مساعد Odoo ERP المحاسبي الذكي" (Odoo AI Chatter Assistant).
تصلك رسالة وسؤال من مستخدم نظام Odoo المحاسبي في شاشة قيود اليومية.

السياق الحالي للنظام:
${entryContext}

سجل المحادثة السابقة:
${history && history.length > 0 ? history.map((h: any) => `${h.role === 'user' ? 'المستخدم' : 'Odoo AI'}: ${h.text}`).join('\n') : 'لا توجد محادثة سابقة.'}

رسالة المستخدم الجديدة:
"${message}"

يرجى الإجابة بدقة بالغة باللغة العربية، بأسلوب خبير أنظمة Odoo ERP المحاسبية والمعايير المحاسبية الدولية (IFRS).
- قدم إجابات مباشرة، واضحة، ومنسقة بنقاط سهلة القراءة.
- إذا كان السؤال عن كيفية إعداد قيد معين أو تعديل حقل في أودو، وضح الخطوات المحددة بالزر والحقل.
- اجعل الأسلوب مهنياً ودوداً ومباشراً كخبراء Odoo ERP.`;

      const reply = (await generateGeminiText(chatPrompt, `أنت مساعد Odoo ERP المحاسبي الذكي المدمج في نظام ميزان. تجيب بدقة عالية وبأسلوب منظم وواضح عن جميع أسئلة القيود والمحاسبة بنظام Odoo.`, 0.6))
        || "أهلاً بك! أنا مساعد Odoo المحاسبي. كيف يمكنني مساعدتك في هذا القيد؟";
      return res.json({ reply });
    } catch (error: any) {
      console.error("Odoo AI Chat Error:", error);
      return res.status(500).json({
        error: "حدث خطأ أثناء معالجة استفسارك بواسطة مساعد Odoo الذكي.",
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "Meezan" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
