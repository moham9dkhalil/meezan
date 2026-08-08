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
      title: isEn ? "32 Learning Stages + Interactive Lessons" : "32 مرحلة تعليمية + دروس تفاعلية",
      desc: isEn
        ? "From fundamental accounting principles and double-entry to financial statements, auditing, IFRS, and budgeting. Includes instant quizzes."
        : "من أساسيات المحاسبة والقيد المزدوج للقوائم المالية، المراجعة، المعايير الدولية IFRS، والموازنات. كل مرحلة تتضمن دروساً واختباراً فورياً.",
      tag: isEn ? "Complete Curriculum" : "منهج متكامل",
      accent: "from-indigo-500/20 to-indigo-600/5",
      border: "border-indigo-500/30",
      color: "text-indigo-400"
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
