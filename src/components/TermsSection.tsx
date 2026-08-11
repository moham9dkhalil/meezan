import React from "react";
import { FileText, ShieldCheck, Scale, AlertTriangle, CreditCard } from "lucide-react";

export const TermsSection: React.FC = () => {
  const p = "text-xs text-slate-300 leading-relaxed";
  return (
    <div className="max-w-3xl mx-auto px-4 pt-8 pb-16 space-y-6 dir-rtl">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-black">
          <Scale className="w-4 h-4" />
          شروط الاستخدام
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">شروط الاستخدام لمنصة ميزان</h1>
        <p className="text-[11px] text-slate-400">سارية اعتباراً من: آب / أغسطس 2026</p>
      </div>

      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-black text-white flex items-center gap-2"><FileText className="w-4 h-4 text-indigo-400" /> 1. قبول الشروط</h2>
        <p className={p}>استخدامك لمنصة ميزان يعني موافقتك الكاملة على هذه الشروط. إذا لم توافق، يرجى عدم استخدام المنصة. نفتح للمستخدمين من عمر 18 سنة أو أكبر أو بإذن ولي الأمر.</p>
      </section>

      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-black text-white flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> 2. الحساب والأمان</h2>
        <p className={p}>أنت مسؤول عن الحفاظ على سرية بيانات الدخول الخاصة بك، وكل النشاطات التي تحدث عبر حسابك. التزم بتوفير بيانات دقيقة عند التسجيل. نحتفظ بحق إيقاف أي حساب يُستخدم بشكل مخالف.</p>
      </section>

      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-black text-white flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-400" /> 3. المحتوى التعليمي</h2>
        <p className={p}>المحتوى التعليمي يُعرض بغرض التعلم والمراجعة ولأغراض إرشادية عامة، ولا يُعد استشارة محاسبية/ضريبية/قانونية مهنية ملزمة. استشر مختصاً مرخّصاً قبل اتخاذ قرارات مالية تعتمد على المنصة. نبذل جهداً معقولاً لمراجعة المحتوى وتحديثه، لكننا لا نضمن خلوّه المطلق من الأخطاء.</p>
      </section>

      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-black text-white flex items-center gap-2"><CreditCard className="w-4 h-4 text-cyan-400" /> 4. الاشتراكات والمدفوعات</h2>
        <p className={p}>حالياً، المحتوى الأساسي متاح مجاناً. عند إطلاق أي مسارات مدفوعة ستُبيَّن الأسعار، طريقة الاشتراك، سياسة الاسترداد، والفوترة بوضوح قبل أي عملية دفع، وفق الشروط المعلنة حينها.</p>
      </section>

      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-black text-white flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-rose-400" /> 5. الحقوق والسلوك</h2>
        <p className={p}>جميع حقوق الملكية الفكرية للمحتوى والأسماء والشعارات تعود لمنصة ميزان. يُمنع نسخ المحتوى أو توزيعه تجارياً دون إذن. يُمنع نشر محتوى مسيء أو تسويقي غير مصرح به في المجتمع.</p>
      </section>

      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-black text-white flex items-center gap-2"><Scale className="w-4 h-4 text-indigo-400" /> 6. إخلاء مسؤولية ومسؤولية محدودة</h2>
        <p className={p}>توفر المنصة "كما هي". حتى أقصى حد يسمح به القانون، لا نتحمل مسؤولية الأضرار غير المباشرة الناتجة عن استخدام المنصة أو اعتماد المحتوى. في حال حدوث أي خلاف، يكون القانون المطبق وفق القوانين المحلية المطبقة على ميراث نشاط المنصة.</p>
      </section>

      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-black text-white">7. التواصل</h2>
        <p className={p}>للاستفسارات حول هذه الشروط: <span dir="ltr" className="text-emerald-300 font-bold">support@meezan.app</span></p>
      </section>
    </div>
  );
};

export default TermsSection;