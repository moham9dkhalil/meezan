import { useState } from "react";
import { ActiveTab } from "../types";
import { Language } from "../data/translations";
import {
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

interface OnboardingTopSectionProps {
  onSelectTab: (tab: ActiveTab) => void;
  onOpenStage?: (stageId: number) => void;
  onOpenSector?: (sectorId: string) => void;
  appLanguage?: Language;
}

export function OnboardingTopSection({ onSelectTab, onOpenStage, onOpenSector, appLanguage = "ar" }: OnboardingTopSectionProps) {
  const isEn = appLanguage === "en";
  const [selectedSector, setSelectedSector] = useState(() => localStorage.getItem("meezan_preferred_sector") || "");

  const selectSector = (sectorId: string) => {
    localStorage.setItem("meezan_preferred_sector", sectorId);
    setSelectedSector(sectorId);
    onOpenSector?.(sectorId);
  };

  return (
    <section className="relative pt-2 pb-4 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 space-y-8">

        {/* FIRST 10 MINUTES — ONBOARDING STEPS */}
        <div className="rounded-3xl border border-emerald-400/25 bg-emerald-500/5 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div>
              <p className="text-emerald-300 text-xs font-black mb-1">{isEn ? "YOUR FIRST 10 MINUTES" : "أول 10 دقائق لك في ميزان"}</p>
              <h2 className="text-xl sm:text-2xl font-black text-white">{isEn ? "Finish with one balanced journal entry." : "اخرج بقيد محاسبي متوازن تفهمه وتطبّقه."}</h2>
            </div>
            <span className="self-start sm:self-auto rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-bold text-slate-300">{isEn ? "Try first, sign up later" : "جرّب أولًا، وأنشئ حسابك لاحقًا"}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { n: "1", title: isEn ? "Understand" : "افهم", desc: isEn ? "A short, guided lesson" : "درس قصير وموجّه", action: () => onOpenStage?.(1) },
              { n: "2", title: isEn ? "Apply" : "طبّق", desc: isEn ? "Record a practical entry" : "سجّل قيدًا عمليًا", action: () => onSelectTab("odooJournal") },
              { n: "3", title: isEn ? "Check yourself" : "اختبر نفسك", desc: isEn ? "Get instant feedback" : "احصل على تغذية راجعة فورية", action: () => onSelectTab("smartQuizzes") },
            ].map((step) => (
              <button key={step.n} onClick={step.action} className="text-right rtl:text-right ltr:text-left group flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1224]/70 hover:border-emerald-400/50 hover:bg-emerald-500/10 p-4 transition-colors cursor-pointer">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-sm font-black text-emerald-300">{step.n}</span>
                <span><span className="block text-sm font-black text-white">{step.title}</span><span className="block text-xs text-slate-400 mt-0.5">{step.desc}</span></span>
              </button>
            ))}
          </div>
        </div>

        {/* PROMINENT SECTOR SELECTION QUESTION WIZARD CARD */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E1133] via-[#2D164E] to-[#140B22] border-2 border-amber-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
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
                {isEn
                  ? "Pick your industry focus (contracting, factories & cost, real estate, restaurants, tech, taxes, etc.) to instantly get a tailored learning map, journal entries, and chart of accounts!"
                  : "اختر تخصصك القطاعي (المقاولات، المصانع والتكاليف، العقارات، المطاعم، التكنولوجيا، الضرائب، إلخ) للحصول فوراً على خريطة التعلم والقيود وشجرة الحسابات المخصصة!"}
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
                  onClick={() => selectSector(sec.id)}
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

          {selectedSector && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4">
              <div><p className="text-sm font-black text-emerald-200">تم حفظ اختيارك لمسارك المهني</p><p className="mt-1 text-xs text-slate-300">سنستخدمه لتقديم التخصص والتمارين المناسبة لك أولًا.</p></div>
              <button onClick={() => onOpenSector?.(selectedSector)} className="rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-black text-white hover:bg-emerald-600">عرض خريطتي التعليمية</button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
