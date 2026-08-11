import React, { useState, useEffect } from "react";
import { LifeBuoy, Mail, Send, ChevronDown, AlertTriangle, MessageSquareHeart, CheckCircle2, Loader2 } from "lucide-react";
import { fetchFaq, createTicket, FaqItem } from "../utils/cms";

type SupportTab = "contact" | "faq" | "report";

export const SupportSection: React.FC = () => {
  const [tab, setTab] = useState<SupportTab>("contact");
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("عام");

  const [errorArea, setErrorArea] = useState("");
  const [errorPage, setErrorPage] = useState("المحتوى التعليمي");
  const [errorDesc, setErrorDesc] = useState("");

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchFaq().then(setFaq).catch(() => setFaq([]));
  }, []);

  const submitTicket = async (payload: {
    name: string;
    email: string;
    subject: string;
    message: string;
    category: string;
  }) => {
    setFormError("");
    if (!payload.name.trim() || !payload.email.includes("@") || !payload.subject.trim() || !payload.message.trim()) {
      setFormError("يرجى إكمال كافة الحقول المطلوبة.");
      return;
    }
    setSending(true);
    try {
      await createTicket(payload);
      setSent(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setErrorArea("");
      setErrorPage("المحتوى التعليمي");
      setErrorDesc("");
      setTimeout(() => setSent(false), 5000);
    } catch (e: any) {
      setFormError(e.message || "تعذر إرسال التذكرة. حاول لاحقاً.");
    } finally {
      setSending(false);
    }
  };

  const inputCls =
    "w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500";
  const labelCls = "block text-xs font-bold text-slate-300 mb-1";

  return (
    <div className="max-w-5xl mx-auto px-4 pt-6 space-y-6 dir-rtl">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-black mb-3">
          <LifeBuoy className="w-4 h-4" />
          {tab === "faq" ? "الأسئلة الشائعة" : tab === "report" ? "الإبلاغ عن خطأ محتوى" : "فريق الدعم يعمل لأجلك"}
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">مركز الدعم والتواصل</h2>
        <p className="text-sm text-slate-400 mt-1">تواصل معنا، تصفح الأسئلة الشائعة، أو أبلغنا عن خطأ في المحتوى — نرد خلال يوم عمل.</p>
      </div>

      <div className="flex gap-2 justify-center flex-wrap">
        {([
          { id: "contact", label: "تواصل معنا / تذكرة", icon: Mail },
          { id: "faq", label: "الأسئلة الشائعة", icon: ChevronDown },
          { id: "report", label: "إبلاغ عن خطأ محتوى", icon: AlertTriangle },
        ] as { id: SupportTab; label: string; icon: any }[]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
              tab === t.id
                ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30"
                : "bg-slate-800/60 text-slate-300 hover:bg-slate-700 border-slate-700"
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "contact" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-base font-black text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-400" />
              إنشاء تذكرة دعم
            </h4>
            <div>
              <label className={labelCls}>الاسم</label>
              <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="اسمك الكامل" />
            </div>
            <div>
              <label className={labelCls}>البريد الإلكتروني</label>
              <input className={inputCls} dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
            </div>
            <div>
              <label className={labelCls}>الموضوع</label>
              <input className={inputCls} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="موضوع الطلب" />
            </div>
            <div>
              <label className={labelCls}>القسم التنظيمي</label>
              <select className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)}>
                <option>عام</option>
                <option>الحسابات والاشتراك</option>
                <option>المحتوى التعليمي</option>
                <option>الشهادات</option>
                <option>مساعد الذكاء الاصطناعي</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>تفاصيل الطلب</label>
              <textarea className={`${inputCls} min-h-[110px]`} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="اشرح مشكلتك أو استفسارك بالتفصيل" />
            </div>
            {formError && <p className="text-xs text-rose-400 font-bold">{formError}</p>}
            <button
              onClick={() => submitTicket({ name, email, subject, message, category })}
              disabled={sending}
              className="w-full px-5 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              إرسال التذكرة
            </button>
            {sent && (
              <p className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-pulse">
                <CheckCircle2 className="w-4 h-4" />
                تم استلام تذكرتك بنجاح. سيقوم فريق الدعم بالتواصل معك.
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5">
              <h4 className="text-sm font-black text-white mb-2">قنوات التواصل المباشرة</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                البريد المباشر: <span dir="ltr" className="text-emerald-300 font-bold">support@meezan.app</span>
                <br />
                ردود الدعم يتم الرد عليها خلال يوم عمل واحد.
              </p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5">
              <h4 className="text-sm font-black text-white mb-2 flex items-center gap-2">
                <MessageSquareHeart className="w-4 h-4 text-pink-400" />
                كيف نعالج التذاكر؟
              </h4>
              <ol className="text-xs text-slate-400 space-y-1.5 list-decimal list-inside">
                <li>تصل التذكرة وتُصنف (استفسار / خطأ / اقتراح).</li>
                <li>يراجعها الفريق ويحدّث حالتها (قيد الدراسة / قيد المعالجة / تم الحل).</li>
                <li>تتلقى تحديثاً عبر التذكرة بالموقع أو البريد.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {tab === "faq" && (
        <div className="space-y-3 max-w-3xl mx-auto">
          {faq.length === 0 && <p className="text-center text-xs text-slate-400">جارٍ تحميل الأسئلة الشائعة...</p>}
          {faq.map((item) => (
            <div key={item.id} className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}
                className="w-full flex items-center justify-between p-4 text-right cursor-pointer hover:bg-slate-800/40 transition-colors"
              >
                <span className="text-sm font-black text-white">{item.question}</span>
                <ChevronDown className={`w-4 h-4 text-indigo-400 transition-transform ${openFaq === item.id ? "rotate-180" : ""}`} />
              </button>
              {openFaq === item.id && (
                <p className="px-4 pb-4 text-xs text-slate-300 leading-relaxed">{item.answer}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "report" && (
        <div className="max-w-2xl mx-auto bg-slate-900/60 border border-rose-500/30 rounded-2xl p-6 space-y-4">
          <h4 className="text-base font-black text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            الإبلاغ عن خطأ في المحتوى
          </h4>
          <div>
            <label className={labelCls}>القسم المتأثر</label>
            <select className={inputCls} value={errorArea} onChange={(e) => setErrorArea(e.target.value)}>
              <option value="">اختر القسم…</option>
              <option>المراحل التعليمية والدروس</option>
              <option>دليل الضرائب</option>
              <option>المعايير المحاسبية</option>
              <option>الاختبارات والأسئلة</option>
              <option>الحاسبات والأدوات</option>
              <option>مكتبة ومراجع</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>الصفحة أو النقطة المحددة</label>
            <input className={inputCls} value={errorPage} onChange={(e) => setErrorPage(e.target.value)} placeholder="مثال: نسبة الزكاة في النشاط التجاري" />
          </div>
          <div>
            <label className={labelCls}>وصف الخطأ ودقة تفاصيله</label>
            <textarea className={`${inputCls} min-h-[120px]`} value={errorDesc} onChange={(e) => setErrorDesc(e.target.value)} placeholder="اكتب الخطأ وما ينبغي أن يكون صحيحاً" />
          </div>
          {formError && <p className="text-xs text-rose-400 font-bold">{formError}</p>}
          <button
            onClick={() =>
              submitTicket({
                name: "زائر المنصة",
                email: email || "guest@meezan.app",
                subject: `تبليغ خطأ محتوى: ${errorPage || "غير محدد"}`,
                message: `القسم: ${errorArea || "غير محدد"}\nالصفحة: ${errorPage}\n\n${errorDesc}`,
                category: "خطأ محتوى",
              })
            }
            disabled={sending}
            className="w-full px-5 py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            إرسال البلاغ
          </button>
        </div>
      )}
    </div>
  );
};

export default SupportSection;