import React, { useState } from "react";
import { ActiveTab } from "../types";
import {
  SectorRoadmap,
  getSectorSkillDistribution,
  getSectorExtendedOverview,
  SECTOR_ICON_STYLES
} from "./AccountingSectorsSection";
import {
  X,
  Sparkles,
  Briefcase,
  TrendingUp,
  Award,
  BookOpen,
  Calculator,
  Play,
  CheckCircle2,
  FileText,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  DollarSign,
  Share2,
  Check
} from "lucide-react";

interface SectorInfoModalProps {
  sector: SectorRoadmap | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenOdooWithEntry?: (entryData: any) => void;
  onNavigateToFullDetail?: (sectorId: string) => void;
  isEn?: boolean;
}

export function SectorInfoModal({
  sector,
  isOpen,
  onClose,
  onSelectTab,
  onOpenOdooWithEntry,
  onNavigateToFullDetail,
  isEn = false
}: SectorInfoModalProps) {
  if (!isOpen || !sector) return null;

  const [activeTab, setActiveTab] = useState<"overview" | "roles" | "skills" | "stages" | "interview">("overview");
  const [copied, setCopied] = useState(false);

  const skills = getSectorSkillDistribution(sector);
  const extendedOverview = getSectorExtendedOverview(sector);
  const SectorIcon = sector.icon;
  const iconStyle = SECTOR_ICON_STYLES[sector.color] || SECTOR_ICON_STYLES.amber;

  const handleShare = () => {
    const text = `تخصص محاسبة: ${sector.name}\n${sector.shortDesc}\nمنصة ميزان لتعلم المحاسبة: https://meezzan.vercel.app/`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyEntryToOdoo = () => {
    if (onOpenOdooWithEntry) {
      onOpenOdooWithEntry({
        explanation: sector.featuredEntry.title + " - " + sector.featuredEntry.explanation,
        items: [
          {
            accountCode: sector.featuredEntry.debitCode,
            debit: sector.featuredEntry.sampleAmount,
            credit: 0,
            label: sector.featuredEntry.debitAcc
          },
          {
            accountCode: sector.featuredEntry.creditCode,
            debit: 0,
            credit: sector.featuredEntry.sampleAmount,
            label: sector.featuredEntry.creditAcc
          }
        ]
      });
      onClose();
    } else {
      onSelectTab("odooJournal");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all">
        
        {/* TOP MODAL HEADER */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-indigo-500/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl ${iconStyle} flex items-center justify-center text-2xl shadow-xl shrink-0`}>
                <SectorIcon className="w-7 h-7 text-white" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-black">
                    {sector.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-mono dir-ltr">{sector.nameEn}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {sector.name}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all cursor-pointer"
                title="مشاركة تفاصيل التخصص"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-white/10">
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
              <div className="text-[11px] text-slate-400 font-medium">متوسط الأجور</div>
              <div className="text-xs sm:text-sm font-black text-emerald-400 mt-0.5">{sector.averageSalaryRange}</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
              <div className="text-[11px] text-slate-400 font-medium">المسميات الوظيفية</div>
              <div className="text-xs sm:text-sm font-black text-amber-300 mt-0.5">{sector.targetRoles.length} مسميات شائعة</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
              <div className="text-[11px] text-slate-400 font-medium">مراحل الخريطة</div>
              <div className="text-xs sm:text-sm font-black text-indigo-300 mt-0.5">{sector.stages.length} مراحل عملية</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
              <div className="text-[11px] text-slate-400 font-medium">التفاعل بأودو</div>
              <div className="text-xs sm:text-sm font-black text-teal-300 mt-0.5">جاهز للتطبيق 🚀</div>
            </div>
          </div>
        </div>

        {/* MODAL TABS NAVIGATION */}
        <div className="flex items-center gap-1 p-2 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80 overflow-x-auto">
          {[
            { id: "overview", label: "النظرة العامة والدورة", icon: BookOpen },
            { id: "roles", label: "الوظائف والمسئوليات", icon: Briefcase },
            { id: "skills", label: "توزيع المهارات", icon: TrendingUp },
            { id: "stages", label: "المراحل والقيد النموذجي", icon: Calculator },
            { id: "interview", label: "أسئلة المقابلات", icon: HelpCircle }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* MODAL CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-800 dark:text-slate-100">
          
          {/* TAB 1: OVERVIEW & CYCLE */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 rounded-2xl p-5 space-y-3">
                <h3 className="text-base font-black text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>نبذة شاملة عن تخصص {sector.name}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {extendedOverview.intro}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 space-y-3">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>طبيعة الدورة المستندية والمحاسبية</span>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {extendedOverview.accountingCycle}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 space-y-3">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span>المعايير والبرمجيات المطبقة</span>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {extendedOverview.standardsAndTools}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ROLES & RESPONSIBILITIES */}
          {activeTab === "roles" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-500" />
                  <span>المسميات الوظيفية المستهدفة في هذا القطاع</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sector.targetRoles.map((role, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/40 text-xs font-extrabold flex items-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{role}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>المسئوليات والمهام المحاسبية الرئيسية</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sector.keyResponsibilities.map((resp, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-start gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SKILLS DISTRIBUTION */}
          {activeTab === "skills" && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>المهارات المحاسبية المطلوبة ونسبة وزنها في هذا التخصص</span>
              </h3>

              <div className="space-y-4">
                {skills.map((sk, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs font-black">
                      <span className="text-slate-900 dark:text-white">{sk.skill}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                        {sk.percentage}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${sk.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{sk.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: STAGES & FEATURED JOURNAL ENTRY */}
          {activeTab === "stages" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-amber-500" />
                  <span>القيد المحاسبي النموذجي للقطاع</span>
                </h3>

                <div className="p-5 rounded-2xl bg-indigo-900 text-white space-y-4 shadow-xl border border-indigo-500/30">
                  <div>
                    <h4 className="text-sm font-black text-amber-300">{sector.featuredEntry.title}</h4>
                    <p className="text-xs text-slate-200 mt-1">{sector.featuredEntry.description}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono dir-rtl">
                    <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30 space-y-1">
                      <div className="text-[10px] text-emerald-300 font-bold">الحساب المدين (Debit)</div>
                      <div className="font-black text-white">{sector.featuredEntry.debitAcc}</div>
                      <div className="text-emerald-300 font-bold">{sector.featuredEntry.sampleAmount.toLocaleString()} ج.م</div>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/30 space-y-1">
                      <div className="text-[10px] text-rose-300 font-bold">الحساب الدائن (Credit)</div>
                      <div className="font-black text-white">{sector.featuredEntry.creditAcc}</div>
                      <div className="text-rose-300 font-bold">{sector.featuredEntry.sampleAmount.toLocaleString()} ج.م</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
                    <span className="text-[11px] text-slate-300 italic">{sector.featuredEntry.explanation}</span>
                    <button
                      onClick={handleApplyEntryToOdoo}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs cursor-pointer shadow-md flex items-center gap-1.5 transition-transform hover:scale-105"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>تطبيق في محاكي أودو 🚀</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-black text-slate-900 dark:text-white">مراحل المسار التعلمي</h3>
                <div className="space-y-3">
                  {sector.stages.map((stg) => (
                    <div
                      key={stg.number}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {stg.number}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">{stg.title}</h4>
                          <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold">
                            {stg.duration}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300">{stg.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: INTERVIEW QUESTIONS */}
          {activeTab === "interview" && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-500" />
                <span>أبرز أسئلة المقابلات الشخصية (Interview) لقطاع {sector.name}</span>
              </h3>

              <div className="space-y-4">
                {sector.interviewQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2"
                  >
                    <h4 className="text-xs sm:text-sm font-black text-indigo-600 dark:text-indigo-300 flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                        س
                      </span>
                      <span>{q.question}</span>
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-slate-200 pr-7 leading-relaxed bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/50">
                      <strong className="text-emerald-600 dark:text-emerald-400 ml-1">الإجابة النوذجية:</strong> {q.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 sm:p-5 bg-slate-100 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            تخصص <strong className="text-slate-900 dark:text-white">{sector.name}</strong> متصل بمحاكي أودو ومعمل القيود.
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToFullDetail && (
              <button
                onClick={() => {
                  onNavigateToFullDetail(sector.id);
                  onClose();
                }}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs cursor-pointer shadow-md flex items-center gap-1.5 transition-all"
              >
                <span>الانتقال للخريطة الكاملة للتخصص</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer transition-all"
            >
              إغلاق الشاشة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
