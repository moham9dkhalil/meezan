import { ActiveTab } from "../types";
import { Language } from "../data/translations";
import { Sparkles, ArrowLeft } from "lucide-react";

interface FeaturesSectionProps {
  onSelectTab: (tab: ActiveTab) => void;
  appLanguage?: Language;
}

export function FeaturesSection({ onSelectTab, appLanguage = "ar" }: FeaturesSectionProps) {
  const isEn = appLanguage === "en";

  const features = [
    {
      tab: "path" as ActiveTab,
      icon: "🗺️",
      title: isEn ? "32 Learning Stages + Interactive Lessons" : "المراحل التعليمية (32 مرحلة) + دروس تفاعلية",
      desc: isEn
        ? "From fundamental accounting principles and double-entry to financial statements, auditing, IFRS, and budgeting. Includes instant quizzes."
        : "من أساسيات المحاسبة والقيد المزدوج للقوائم المالية، المراجعة، المعايير الدولية IFRS، والموازنات. كل مرحلة تتضمن دروساً واختباراً فورياً.",
      tag: isEn ? "Complete Curriculum" : "منهج متكامل",
      accent: "from-indigo-500/20 to-indigo-600/5",
      border: "border-indigo-500/30",
      color: "text-indigo-400"
    },
    {
      tab: "sectors" as ActiveTab,
      icon: "🏢",
      title: isEn ? "Accounting Sectors & Fields" : "تخصصات وقطاعات المحاسبة",
      desc: isEn
        ? "Contracting, factories, real estate, banks, and more — with learning maps, journal entries, and chart of accounts per sector."
        : "المقاولات، المصانع، العقارات، البنوك والمزيد — خريطة تعلم وقيود وشجرة حسابات لكل مجال قطاعي.",
      tag: isEn ? "Fields" : "قطاعات",
      accent: "from-teal-500/20 to-teal-600/5",
      border: "border-teal-500/30",
      color: "text-teal-400"
    },
    {
      tab: "courses" as ActiveTab,
      icon: "🎓",
      title: isEn ? "Professional Certification Courses" : "كورسات شهادات مهنية",
      desc: isEn
        ? "Trusted curriculum inspired by top global certifications (Wharton, CMA, ACCA, IFRS) to prepare you for the global workforce."
        : "محتوى موثوق ومفصل مستوحي من أرقى الكورسات العالمية (Wharton، CMA، ACCA، IFRS) لتجهيزك لسوق العمل والشهادات الدولية.",
      tag: isEn ? "Professional Certs" : "شهادات مهنية",
      accent: "from-amber-500/20 to-amber-600/5",
      border: "border-amber-500/30",
      color: "text-amber-400"
    },
    {
      tab: "smartQuizzes" as ActiveTab,
      icon: "🧠",
      title: isEn ? "Smart Quizzes & Practice Tests" : "الاختبارات والتطبيقات الذكية",
      desc: isEn
        ? "Test your accounting level with instant feedback, weakness tracking, and adaptive practice sessions."
        : "اختبر مستواك المحاسبي مع تغذية راجعة فورية وتتبع نقاط الضعف وجلسات تطبيق متكيفة.",
      tag: isEn ? "Smart Assessment" : "تقييم ذكي",
      accent: "from-sky-500/20 to-sky-600/5",
      border: "border-sky-500/30",
      color: "text-sky-400"
    },
    {
      tab: "socpaExam" as ActiveTab,
      icon: "🏛️",
      title: isEn ? "SOCPA Exam Simulator" : "محاكي اختبار زمالة SOCPA",
      desc: isEn
        ? "Practice Saudi SOCPA fellowship questions with timed simulations, mock exams, and detailed answers."
        : "تدرب على أسئلة زمالة المحاسبين القانونيين السعودية مع محاكاة بالوقت واختبارات تجريبية وإجابات تفصيلية.",
      tag: isEn ? "SOCPA" : "زمالة سعودية",
      accent: "from-lime-500/20 to-lime-600/5",
      border: "border-lime-500/30",
      color: "text-lime-400"
    },
    {
      tab: "interviewQuestions" as ActiveTab,
      icon: "💼",
      title: isEn ? "Job Interview Q&A (Junior → CFO)" : "أسئلة مقابلات المحاسبة (من حديث التخرج لـ CFO)",
      desc: isEn
        ? "Model answers for every functional level — from accounting graduates to financial managers and CFOs."
        : "إجابات نموذجية لكل مستوى وظيفي — من حديث التخرج حتى مدير مالي وCFO.",
      tag: isEn ? "Career" : "وظيفي",
      accent: "from-rose-500/20 to-rose-600/5",
      border: "border-rose-500/30",
      color: "text-rose-400"
    },
    {
      tab: "studyTimer" as ActiveTab,
      icon: "⏱️",
      title: isEn ? "Study Focus Timer (Pomodoro)" : "مؤقت المذاكرة والتركيز (بومودورو)",
      desc: isEn
        ? "25-minute deep-focus sessions with smart breaks, session counters, and daily study goals."
        : "جلسات تركيز عميق 25 دقيقة مع راحة ذكية وعدّاد جلسات وأهداف يومية للمذاكرة.",
      tag: isEn ? "Focus" : "تركيز",
      accent: "from-orange-500/20 to-orange-600/5",
      border: "border-orange-500/30",
      color: "text-orange-400"
    },
    {
      tab: "lab" as ActiveTab,
      icon: "📝",
      title: isEn ? "Journal Entry Simulator Lab" : "معمل القيود المحاسبية",
      desc: isEn
        ? "Hands-on double-entry practice. Record sales, purchases, and expenses while verifying debit/credit equilibrium automatically."
        : "تطبيق عملي تفاعلي على القيد المزدوج. تسجّل قيود المبيعات، المشتريات، والمصروفات بنفسك وتتأكد من توازن المدين والدائن وصحتها فوراً.",
      tag: isEn ? "Practical Application" : "تطبيق عملي",
      accent: "from-blue-500/20 to-blue-600/5",
      border: "border-blue-500/30",
      color: "text-blue-400"
    },
    {
      tab: "odooJournal" as ActiveTab,
      icon: "⚙️",
      title: isEn ? "Odoo ERP Journal Screens" : "شاشات قيود أنظمة Odoo ERP",
      desc: isEn
        ? "Practice account selection and journal entries exactly like the real Odoo ERP system with smart guidance."
        : "توجيه واختيار الحسابات وتسجيل القيود كما في نظام Odoo الحقيقي مع إرشاد ذكي فوري.",
      tag: isEn ? "ERP" : "Odoo",
      accent: "from-slate-500/20 to-slate-600/5",
      border: "border-slate-500/30",
      color: "text-slate-300"
    },
    {
      tab: "taxGuide" as ActiveTab,
      icon: "🧾",
      title: isEn ? "Comprehensive Tax Guide 2026" : "دليل الضرائب العربي والأنظمة 2026",
      desc: isEn
        ? "Tax regulations, returns, e-invoicing (ZATCA), VAT, Zakat, and payroll deductions — updated and organized."
        : "اللوائح والإقرارات والفوترة الإلكترونية (زاتكا) والضريبة والزكاة والخصومات — محدث ومنظم لعام 2026.",
      tag: isEn ? "Tax" : "ضرائب 2026",
      accent: "from-yellow-500/20 to-yellow-600/5",
      border: "border-yellow-500/30",
      color: "text-yellow-400"
    },
    {
      tab: "excel" as ActiveTab,
      icon: "📊",
      title: isEn ? "Excel Templates & Formulas" : "قوالب وإكسيل المحاسب المالي",
      desc: isEn
        ? "Ready-made templates for financial statements, ratios, and formulas you can download and use."
        : "نماذج جاهزة للقوائم المالية والنسب والمعادلات يمكن تحميلها واستخدامها مباشرة.",
      tag: isEn ? "Templates" : "قوالب جاهزة",
      accent: "from-green-500/20 to-green-600/5",
      border: "border-green-500/30",
      color: "text-green-400"
    },
    {
      tab: "tools" as ActiveTab,
      icon: "🧮",
      title: isEn ? "Smart Financial Calculators" : "حاسبات مالية ذكية",
      desc: isEn
        ? "Straight-line & declining depreciation calculators, accounting equation balance, financial ratios, and compound interest."
        : "حاسبة الإهلاك للقسط الثابت، موازن المعادلة المحاسبية، حاسبة النسب المالية (السيولة والربحية)، وحاسبة الفائدة المركبة.",
      tag: isEn ? "Instant Calculators" : "أدوات فورية",
      accent: "from-orange-500/20 to-orange-600/5",
      border: "border-orange-500/30",
      color: "text-orange-400"
    },
    {
      tab: "accountingStandards" as ActiveTab,
      icon: "📐",
      title: isEn ? "All Accounting Standards (IFRS/IAS/EAS/GAAP)" : "معايير المحاسبة الدولية والمحلية",
      desc: isEn
        ? "Detailed explanation of each standard: scope, recognition, measurement, disclosure, examples, and constraints."
        : "شرح تفصيلي عميق لكل معيار: النطاق، الاعتراف، القياس، الإفصاح، أمثلة، وقيود — دولي ومصري وأمريكي.",
      tag: isEn ? "Standards" : "مرجع دولي",
      accent: "from-violet-500/20 to-violet-600/5",
      border: "border-violet-500/30",
      color: "text-violet-400"
    },
    {
      tab: "glossary" as ActiveTab,
      icon: "🔤",
      title: isEn ? "Accounting Dictionary & Glossary" : "قاموس ومعجم مصطلحات المحاسبة",
      desc: isEn
        ? "Simplified explanations of accounts, standards, and financial terms in clear Arabic and English."
        : "شرح مبسط لكافة الحسابات والمعايير والمصطلحات المالية بالعربية والإنجليزية.",
      tag: isEn ? "Dictionary" : "قاموس",
      accent: "from-cyan-500/20 to-cyan-600/5",
      border: "border-cyan-500/30",
      color: "text-cyan-400"
    },
    {
      tab: "flashcards" as ActiveTab,
      icon: "📖",
      title: isEn ? "Terminology Flashcards (500+)" : "بطاقات المصطلحات (500+ مصطلح)",
      desc: isEn
        ? "Master accounting and financial terminology in Arabic & English with interactive flip cards, random shuffling, and categorization."
        : "أتقن المصطلحات المحاسبية والمالية بالعربي والإنجليزي. بطاقات تفاعلية معخاصية المقلوب والخلط العشوائي والتصنيف الموضوعي.",
      tag: isEn ? "Interactive Glossary" : "قاموس تفاعلي",
      accent: "from-emerald-500/20 to-emerald-600/5",
      border: "border-emerald-500/30",
      color: "text-emerald-400"
    },
    {
      tab: "library" as ActiveTab,
      icon: "📚",
      title: isEn ? "Reference Book Library" : "مكتبة كتب ومراجع",
      desc: isEn
        ? "Complete library featuring 13 books & references on financial, cost, auditing, and corporate accounting with interactive readers."
        : "مكتبة متكاملة تضم 13 مرجعاً وكتاباً لمحاسبة المال، التكاليف، المراجعة، والشركات مع قارئ فصول تفاعلي ومقاطع مرجعية.",
      tag: isEn ? "Full Library" : "مكتبة شاملة",
      accent: "from-cyan-500/20 to-cyan-600/5",
      border: "border-cyan-500/30",
      color: "text-cyan-400"
    },
    {
      tab: "contentLibrary" as ActiveTab,
      icon: "🗞️",
      title: isEn ? "Curated Content Library" : "مكتبة المحتوى المنسّق",
      desc: isEn
        ? "Hand-picked lessons, tax materials, standards, and questions reviewed by specialists — updated live by the team."
        : "دروس ومواد ضريبية ومعايير وأسئلة مختارة يراجعها المختصون — تُحدَّث مباشرة من فريق المنصة.",
      tag: isEn ? "Curated" : "منسّق",
      accent: "from-indigo-500/20 to-indigo-600/5",
      border: "border-indigo-500/30",
      color: "text-indigo-400"
    },
    {
      tab: "ai" as ActiveTab,
      icon: "🤖",
      title: isEn ? "Instant AI Assistant" : "مساعد ذكاء اصطناعي فوري",
      desc: isEn
        ? "Ask Meezan's AI Assistant powered by Gemini for instant explanations, numerical examples, and journal entries directly in the app."
        : "اسأل مساعد ميزان المحاسبي المعزز بـ Gemini وخذ شرحاً مفصلاً وأمثلة بالأرقام والقيد المزدوج فوراً دون الخروج من التطبيق.",
      tag: isEn ? "AI Powered" : "ذكاء اصطناعي",
      accent: "from-purple-500/20 to-purple-600/5",
      border: "border-purple-500/30",
      color: "text-purple-400"
    },
    {
      tab: "community" as ActiveTab,
      icon: "👥",
      title: isEn ? "Accountants Community" : "مجتمع المحاسبين والخبراء",
      desc: isEn
        ? "Discussions, consultations, and practical sharing from practicing professionals — ask and answer with peers."
        : "نقاشات واستشارات ومشاركات عملية من الممارسين — اسأل وأجب مع زملائك المحاسبين.",
      tag: isEn ? "Community" : "مجتمع",
      accent: "from-pink-500/20 to-pink-600/5",
      border: "border-pink-500/30",
      color: "text-pink-400"
    },
    {
      tab: "testimonials" as ActiveTab,
      icon: "⭐",
      title: isEn ? "Learner Reviews & Ratings" : "تقييمات وآراء المتعلمين",
      desc: isEn
        ? "Read verified reviews from thousands of accounting students and professionals, and share your own feedback."
        : "شاهد تقييمات حقيقية من آلاف الطلاب والمحاسبين المهنيين المشاركين في المنصة، وشارك تجربتك وتقييمك الشخصي.",
      tag: isEn ? "Community" : "مجتمع ميزان",
      accent: "from-pink-500/20 to-pink-600/5",
      border: "border-pink-500/30",
      color: "text-pink-400"
    },
    {
      tab: "appDownload" as ActiveTab,
      icon: "📱",
      title: isEn ? "Meezan Mobile App (Android)" : "تطبيق ميزان المحاسبي للهواتف الذكية",
      desc: isEn
        ? "Download the Meezan APK for Android and take your learning anywhere — offline-friendly and fast."
        : "حمّل تطبيق ميزان للهواتف الذكية (APK) وتعلم أينما كنت — سريع ويعمل بسلاسة على الجوال.",
      tag: isEn ? "APK" : "تطبيق الجوال",
      accent: "from-emerald-500/20 to-emerald-600/5",
      border: "border-emerald-500/30",
      color: "text-emerald-400"
    },
    {
      tab: "support" as ActiveTab,
      icon: "🛟",
      title: isEn ? "Support & Tickets" : "الدعم والتواصل والتذاكر",
      desc: isEn
        ? "Contact us, browse FAQs, or report a content error — our support team responds within one business day."
        : "تواصل معنا، تصفح الأسئلة الشائعة، أو أبلغ عن خطأ في المحتوى — ويرد عليك فريق الدعم خلال يوم عمل.",
      tag: isEn ? "Help" : "دعم",
      accent: "from-blue-500/20 to-blue-600/5",
      border: "border-blue-500/30",
      color: "text-blue-400"
    }
  ];

  return (
    <section className="py-12 max-w-7xl mx-auto px-4">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>{isEn ? "What does Meezan offer?" : "ماذا يقدم لك تطبيق ميزان؟"}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
          {isEn ? "Complete System to Master Accounting" : "منظومة متكاملة لتعلم وإتقان المحاسبة"}
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-3 leading-relaxed">
          {isEn
            ? "Every tool and feature is crafted to help you understand and apply accounting with confidence and professionalism."
            : "صُممت كل أداة وشاشة بعناية لمساعدتك في فهم المحاسبة وتطبيقها عملياً بثقة واحترافية."}
        </p>
      </div>

      {/* Grid of Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat, idx) => (
          <div
            key={idx}
            onClick={() => onSelectTab(feat.tab)}
            className={`group relative rounded-3xl p-6 bg-gradient-to-br ${feat.accent} bg-[#0d1424] border ${feat.border} hover:border-white/30 transition-all duration-300 cursor-pointer hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full bg-white/5 border border-white/10 ${feat.color}`}>
                  {feat.tag}
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-white mb-2 group-hover:text-indigo-200 transition-colors">
                {feat.title}
              </h3>

              <p className="text-xs text-gray-300 leading-relaxed font-normal">
                {feat.desc}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-extrabold text-indigo-300 group-hover:text-white">
              <span>{isEn ? "Open Tool Now" : "انتقل للأداة الآن"}</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 rtl:rotate-0 ltr:rotate-180 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
