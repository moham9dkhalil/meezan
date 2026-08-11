import { useMemo } from "react";
import { ShieldCheck, BookOpenCheck, Award, BarChart3, LockKeyhole, ExternalLink } from "lucide-react";
import { getLocalAnalytics } from "../utils/analytics";

export function TrustCenterSection() {
  const events = useMemo(() => getLocalAnalytics(), []);
  const completedLessons = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("meezan_completed_lessons") || "[]").length; } catch { return 0; }
  }, []);

  const cards = [
    { icon: BookOpenCheck, title: "المحتوى والمراجع", text: "كل درس تعليمي يُراجع قبل النشر. المحتوى الضريبي والمهني إرشادي فقط، ويجب التحقق من النص النظامي أو المختص عند اتخاذ قرار فعلي.", accent: "text-sky-300" },
    { icon: Award, title: "قواعد الشهادة", text: "شهادة الإتمام تثبت إكمالك لمسار داخل ميزان، وليست ترخيصًا مهنيًا أو بديلًا عن شهادات الجهات المنظمة. تحقق منها متاح برقمها عند تسجيلها على الخادم.", accent: "text-amber-300" },
    { icon: LockKeyhole, title: "الخصوصية", text: "يحفظ الموقع تقدّمك محليًا على جهازك أولًا. لا نستخدم سجل الاستخدام المحلي لتتبعك عبر المواقع. أنشئ حسابًا فقط عندما تريد مزامنة تقدّمك بين أجهزتك.", accent: "text-emerald-300" },
  ];

  return <section className="max-w-5xl mx-auto px-4 py-10 space-y-7">
    <div className="text-center max-w-2xl mx-auto">
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-400/20 px-3 py-1 text-xs font-black text-emerald-300"><ShieldCheck className="w-4 h-4" /> مركز الثقة والشفافية</div>
      <h1 className="text-3xl sm:text-4xl font-black text-white mt-4">تعلّم واضح، وتقدّم تملكه أنت</h1>
      <p className="text-sm leading-relaxed text-slate-300 mt-3">هنا تجد حدود المحتوى، قواعد الشهادات، وطريقة استخدام بياناتك داخل ميزان.</p>
    </div>

    <div className="grid md:grid-cols-3 gap-4">
      {cards.map(({ icon: Icon, title, text, accent }) => <article key={title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"><Icon className={`w-7 h-7 ${accent}`} /><h2 className="font-black text-white mt-4">{title}</h2><p className="text-xs text-slate-300 leading-relaxed mt-2">{text}</p></article>)}
    </div>

    <div className="rounded-3xl border border-indigo-400/20 bg-indigo-500/5 p-6">
      <div className="flex items-center gap-2 text-indigo-200"><BarChart3 className="w-5 h-5" /><h2 className="font-black">ملخص تقدّمك على هذا الجهاز</h2></div>
      <div className="grid grid-cols-2 gap-3 mt-4"><div className="rounded-2xl bg-black/15 p-4"><span className="block text-2xl font-black text-white">{completedLessons}</span><span className="text-xs text-slate-400">دروس مكتملة</span></div><div className="rounded-2xl bg-black/15 p-4"><span className="block text-2xl font-black text-white">{events.length}</span><span className="text-xs text-slate-400">تفاعلات محفوظة محليًا</span></div></div>
      <p className="text-xs text-slate-400 leading-relaxed mt-4">هذه الأرقام محفوظة في متصفحك فقط لمساعدتك على فهم استخدامك. لا تُرسل كتحليلات تسويقية دون موافقتك.</p>
    </div>

    <div className="rounded-3xl border border-amber-400/20 bg-amber-500/5 p-6 text-sm text-slate-200 leading-relaxed">
      <h2 className="font-black text-white mb-2">قبل النشر العام</h2>
      راجع صفحة الخصوصية والشروط مع مستشار قانوني في بلد التشغيل، واعتمد أي محتوى ضريبي أو مهني من مختص مؤهل. للمراجع الرسمية، استخدم دائمًا مواقع الجهات المنظمة مثل <a className="text-amber-300 underline inline-flex items-center gap-1" href="https://www.ifrs.org/" target="_blank" rel="noreferrer">IFRS Foundation <ExternalLink className="w-3 h-3" /></a> والجهة الضريبية المختصة في بلدك.
    </div>
  </section>;
}
