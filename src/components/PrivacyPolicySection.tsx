import React from "react";
import { ShieldCheck, User, Database, Mail, Cookie, FileText } from "lucide-react";

export const PrivacyPolicySection: React.FC = () => {
  const s = (t: string) => `text-xs text-slate-300 leading-relaxed space-y-2 ${t ? "" : ""}`;
  return (
    <div className="max-w-3xl mx-auto px-4 pt-8 pb-16 space-y-6 dir-rtl">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-black">
          <ShieldCheck className="w-4 h-4" />
          سياسة الخصوصية
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">سياسة الخصوصية لمنصة ميزان</h1>
        <p className="text-[11px] text-slate-400">آخر تحديث: آب / أغسطس 2026</p>
      </div>

      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-black text-white flex items-center gap-2"><Database className="w-4 h-4 text-indigo-400" /> البيانات التي نجمعها</h2>
        <div className={s("")}>
          <p>عند إنشاء حسابك نقوم بمعالجة: الاسم، البريد الإلكتروني، وكلمة المرور (مشفّرة بمعيار scrypt ولا تُخزَّن كنص صريح إطلاقاً). داخل حسابك نخزّن تقدّمك التعليمي (نقاط XP، الدروس المكتملة، البطاقات، النتائج).</p>
          <p>عند إرسال تذكرة دعم أو بلاغ محتوى نجمع الاسم والبريد والرسالة للرد ومعالجة طلبك فقط.</p>
          <p>المراجعات والتقييمات المنشورة في المجتمع تُعرض مع الاسم الذي تختاره.</p>
        </div>
      </section>

      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-black text-white flex items-center gap-2"><Cookie className="w-4 h-4 text-amber-400" /> القياسات والكوكيز</h2>
        <div className={s("")}>
          <p>تستخدم المنصة تخزيناً محلياً على جهازك (localStorage) لتشغيل تجربة التعلم وحفظ تفضيلاتك. القياسات التحليلية لا تُفعَّل إلا بعد حصول موافقتك الصريحة عبر شريط الموافقة، وتُخزَّن على جهازك فقط ولا تُرسل لأي طرف ثالث.</p>
          <p>يمكنك تغيير القرار في أي وقت. رفض القياسات لا يمنعك من استخدام المنصة.</p>
        </div>
      </section>

      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-black text-white flex items-center gap-2"><Mail className="w-4 h-4 text-emerald-400" /> التخزين والمشاركة</h2>
        <div className={s("")}>
          <p>تُخزَّن بيانات الحسابات والمحتوى المنشور في مزود استضافة آمن (Vercel Blob). لا نبيع بياناتك ولا نتشاركها مع أي طرف لأغراض التسويق.</p>
          <p>قد نستخدم بيانات الاستخدام (مجهولة الهوية) لتحسين المحتوى فقط بعد الموافقة.</p>
        </div>
      </section>

      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-black text-white flex items-center gap-2"><User className="w-4 h-4 text-cyan-400" /> حقوقك</h2>
        <div className={s("")}>
          <p>لديك الحق في طلب نسخة من بياناتك، تصحيحها، أو حذف حسابك وبياناتك كلياً. لتنفيذ ذلك راسلنا عبر صفحة الدعم أو البريد المباشر support@meezan.app.</p>
          <p>يحق لك رفض معالجة بيانات غير أساسية في أي وقت.</p>
        </div>
      </section>

      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-black text-white flex items-center gap-2"><FileText className="w-4 h-4 text-rose-400" /> التعديلات والتواصل</h2>
        <div className={s("")}>
          <p>قد تُحدَّث هذه السياسة من وقت لآخر ويُوضع تاريخ آخر مراجعة في أعلى الصفحة. الاستمرار في استخدام المنصة بعد التحديث يعني قبولك للسياسة المحدّثة.</p>
          <p>لأي استفسار: <span dir="ltr" className="text-emerald-300 font-bold">support@meezan.app</span></p>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicySection;