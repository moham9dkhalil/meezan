import { ActiveTab } from "../types";
import { Language } from "../data/translations";
import { PhoneDeviceMockup } from "./PhoneDeviceMockup";
import {
  ArrowLeft,
  Sparkles,
  Calculator,
  Check,
  Download,
  Building2,
  Briefcase,
  HardHat,
  Factory,
  ShoppingCart,
  Utensils,
  Hospital,
  Building,
  Laptop,
  FileCheck2
} from "lucide-react";

interface HeroSectionProps {
  onSelectTab: (tab: ActiveTab) => void;
  onOpenStage: (stageId: number) => void;
  onOpenDownloadModal?: () => void;
  onOpenSector?: (sectorId: string) => void;
  appLanguage?: Language;
}

export function HeroSection({ onSelectTab, onOpenStage, onOpenDownloadModal, onOpenSector, appLanguage = "ar" }: HeroSectionProps) {
  const isEn = appLanguage === "en";

  return (
    <section className="relative pt-6 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-right space-y-6">
            
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-black backdrop-blur-xl shadow-lg">
              <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
              <span>{isEn ? "#1 AI-Powered Accounting Platform" : "المنصة المحاسبية الأولى بالذكاء الاصطناعي"}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.25] text-white">
              {isEn ? "Meezan Platform — Learn Accounting " : "تطبيق ميزان — تعلّم المحاسبة "}
              <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                {isEn ? "Smart & Interactively" : "بأسلوب ذكي وتفاعلي"}
              </span>
            </h1>

            {/* Description */}
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
              {isEn
                ? "An all-in-one platform featuring 32 interactive learning stages, professional certificate courses, journal entry simulator, instant AI assistant, financial calculators, and a comprehensive digital library."
                : "تطبيق متكامل يضم 32 مرحلة تعليمية تفاعلية، مع كورسات شهادات مهنية، معمل قيود محاسبية، شات ذكاء اصطناعي فوري، حاسبات مالية، ومكتبة كتب شاملة."}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2 w-full">
              <button
                onClick={() => onSelectTab("path")}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-black text-lg shadow-2xl shadow-indigo-600/50 hover:shadow-indigo-600/70 hover:-translate-y-1 transition-all cursor-pointer flex items-center gap-3 border border-white/20"
              >
                <span>{isEn ? "Start Learning Free" : "ابدأ التعلم الآن"}</span>
                <ArrowLeft className="w-6 h-6 rtl:rotate-0 ltr:rotate-180" />
              </button>

              <button
                onClick={() => onSelectTab("odooJournal")}
                className="px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-800/80 via-purple-900/90 to-indigo-900/90 hover:from-purple-700 hover:to-indigo-800 text-purple-100 font-extrabold text-base shadow-xl shadow-purple-900/30 hover:-translate-y-1 transition-all cursor-pointer flex items-center gap-2.5 border border-purple-400/40 backdrop-blur-xl"
              >
                <Building2 className="w-5 h-5 text-purple-300" />
                <span>{isEn ? "Odoo ERP Journal Lab 🏢" : "تسجيل قيود أودو Odoo 🏢"}</span>
                <span className="text-[10px] font-black bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-md border border-purple-400/40">Odoo v17</span>
              </button>
            </div>

            {/* Statistics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 w-full max-w-2xl">
              <div className="glass-panel p-3.5 rounded-2xl text-center border border-white/10 bg-white/5">
                <span className="block text-2xl font-black text-indigo-400">32</span>
                <span className="text-xs font-bold text-gray-300 mt-0.5 block">{isEn ? "Learning Stages" : "مرحلة تعليمية"}</span>
              </div>

              <div className="glass-panel p-3.5 rounded-2xl text-center border border-white/10 bg-white/5">
                <span className="block text-2xl font-black text-emerald-400">+1000</span>
                <span className="text-xs font-bold text-gray-300 mt-0.5 block">{isEn ? "Interactive Lessons" : "درس تفاعلي"}</span>
              </div>

              <div className="glass-panel p-3.5 rounded-2xl text-center border border-white/10 bg-white/5">
                <span className="block text-2xl font-black text-amber-400">+500</span>
                <span className="text-xs font-bold text-gray-300 mt-0.5 block">{isEn ? "Active Learners" : "مستخدم نشط"}</span>
              </div>

              <div className="glass-panel p-3.5 rounded-2xl text-center border border-white/10 bg-white/5">
                <span className="block text-2xl font-black text-pink-400">AI</span>
                <span className="text-xs font-bold text-gray-300 mt-0.5 block">{isEn ? "Smart Assistant" : "مساعد ذكي"}</span>
              </div>
            </div>

          </div>

          <div className="lg:col-span-5 flex justify-center relative">

            {/* Ambient Multi-Layer Background Glow behind phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-88 h-88 bg-gradient-to-tr from-indigo-600/40 via-purple-600/30 to-pink-500/25 rounded-full blur-3xl pointer-events-none" />

            <PhoneDeviceMockup
              appName="تطبيق ميزان"
              onSelectTab={onSelectTab}
              onOpenStage={onOpenStage}
              onOpenDownloadModal={onOpenDownloadModal}
            />

          </div>

        </div>

        {/* PROMINENT SECTOR SELECTION QUESTION WIZARD CARD */}
        <div className="mt-14 relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E1133] via-[#2D164E] to-[#140B22] border-2 border-amber-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-black">
                <Briefcase className="w-4 h-4 text-amber-300 animate-bounce" />
                <span>{isEn ? "Career Specialization Question" : "سؤال تحديد المسار المحاسبي والقطاع"}</span>
              </div>
              <h3 className="text-xl sm:text-3xl font-black text-white">
                {isEn ? "Which accounting field do you plan to work in?" : "في أي مجال محاسبي تخطط للعمل؟ 🎯"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                اختر تخصصك القطاعي (المقاولات، المصانع والتكاليف، العقارات، المطاعم، التكنولوجيا، الضرائب، إلخ) للحصول فوراً على خريطة التعلم والقيود وشجرة الحسابات المخصصة!
              </p>
            </div>

            <button
              onClick={() => onSelectTab("sectors")}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-amber-500/30 transition-all cursor-pointer hover:scale-105"
            >
              <span>{isEn ? "View All Sector Roadmaps" : "استكشاف كل خرائط القطاعات ←"}</span>
            </button>
          </div>

          {/* QUICK SECTOR BUTTON CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { id: "contracting", name: "محاسب مقاولات", icon: HardHat, color: "text-amber-300", badge: "الأكثر طلباً" },
              { id: "industrial", name: "محاسب مصانع وتكاليف", icon: Factory, color: "text-purple-300", badge: "تكاليف" },
              { id: "retail", name: "محاسب تجارة وتجزئة", icon: ShoppingCart, color: "text-emerald-300", badge: "مبيعات" },
              { id: "hospitality", name: "محاسب مطاعم وفنادق", icon: Utensils, color: "text-rose-300", badge: "ضيافة" },
              { id: "healthcare", name: "محاسب مستشفيات وتأمين", icon: Hospital, color: "text-cyan-300", badge: "طبي" },
              { id: "realestate", name: "محاسب عقارات وتطوير", icon: Building, color: "text-blue-300", badge: "أراضي" },
              { id: "tech_startups", name: "محاسب شركات ناشئة SaaS", icon: Laptop, color: "text-indigo-300", badge: "تكنولوجيا" },
              { id: "taxation_audit", name: "محاسب ضرائب ومراجعة", icon: FileCheck2, color: "text-yellow-300", badge: "فحص ضريبي" },
            ].map((sec) => {
              const IconComp = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => onOpenSector?.(sec.id)}
                  className="p-3.5 rounded-2xl bg-[#130B22] hover:bg-[#1f1137] border border-white/10 hover:border-amber-400/50 transition-all cursor-pointer flex flex-col items-center text-center space-y-2 group shadow-md"
                >
                  <div className={`p-2.5 rounded-xl bg-white/5 group-hover:scale-110 transition-transform ${sec.color}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    {sec.name}
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 font-bold">
                    {sec.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
