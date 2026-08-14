import { ActiveTab } from "../types";
import { Language } from "../data/translations";
import {
  ACCOUNTING_SECTORS,
  getSectorSkillDistribution,
  SECTOR_ICON_STYLES,
  SectorRoadmap
} from "./AccountingSectorsSection";
import { SectorDetailPanel } from "./SectorDetailPanel";
import {
  ArrowLeft,
  Sparkles,
  Briefcase,
  TrendingUp,
  Layers,
  Play,
  Calculator,
  BookOpen,
  FileText,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface SectorDetailSectionProps {
  sectorId: string;
  onBack: () => void;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenOdooWithEntry?: (entryData: any) => void;
  onChangeSector?: (sectorId: string) => void;
  appLanguage?: Language;
}

export function SectorDetailSection({
  sectorId,
  onBack,
  onSelectTab,
  onOpenOdooWithEntry,
  onChangeSector,
  appLanguage = "ar"
}: SectorDetailSectionProps) {
  const isEn = appLanguage === "en";
  const sector =
    ACCOUNTING_SECTORS.find((s) => s.id === sectorId) || ACCOUNTING_SECTORS[0];

  const sectorIndex = ACCOUNTING_SECTORS.findIndex((s) => s.id === sector.id);
  const prevSector =
    ACCOUNTING_SECTORS[(sectorIndex - 1 + ACCOUNTING_SECTORS.length) % ACCOUNTING_SECTORS.length];
  const nextSector = ACCOUNTING_SECTORS[(sectorIndex + 1) % ACCOUNTING_SECTORS.length];

  const skills = getSectorSkillDistribution(sector);
  const SectorIcon = sector.icon;

  const quickLinks = [
    {
      id: "odooJournal",
      label: isEn ? "Odoo Journal Simulator" : "محاكي أودو Odoo التفاعلي",
      icon: Play,
      color: "text-emerald-300 bg-emerald-500/10 border-emerald-400/30"
    },
    {
      id: "lab",
      label: isEn ? "Journal Entry Lab" : "معمل القيود المحاسبية",
      icon: Calculator,
      color: "text-indigo-300 bg-indigo-500/10 border-indigo-400/30"
    },
    {
      id: "courses",
      label: isEn ? "Professional Courses" : "كورسات الشهادات المهنية",
      icon: BookOpen,
      color: "text-amber-300 bg-amber-500/10 border-amber-400/30"
    },
    {
      id: "taxGuide",
      label: isEn ? "Tax Guide" : "الدليل الضريبي المصري",
      icon: FileText,
      color: "text-rose-300 bg-rose-500/10 border-rose-400/30"
    }
  ];

  return (
    <section className="space-y-6 animate-fadeIn pb-12 relative">
      {/* Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#160D28] hover:bg-[#1f1337] border border-white/15 hover:border-purple-400/50 text-white text-xs font-black transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isEn ? "All Accounting Sectors" : "كل تخصصات المحاسبة"}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onChangeSector?.(prevSector.id)}
            className="inline-flex items-center gap-1 px-3.5 py-2.5 rounded-2xl bg-[#160D28] hover:bg-[#1f1337] border border-white/15 hover:border-amber-400/50 text-slate-300 hover:text-amber-300 text-xs font-bold transition-all cursor-pointer shadow-lg"
          >
            <ChevronRight className="w-4 h-4" />
            <span className="hidden sm:inline">{prevSector.name}</span>
          </button>

          <button
            onClick={() => onChangeSector?.(nextSector.id)}
            className="inline-flex items-center gap-1 px-3.5 py-2.5 rounded-2xl bg-[#160D28] hover:bg-[#1f1337] border border-white/15 hover:border-amber-400/50 text-slate-300 hover:text-amber-300 text-xs font-bold transition-all cursor-pointer shadow-lg"
          >
            <span className="hidden sm:inline">{nextSector.name}</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sector Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1A102F] via-[#2A1647] to-[#120B20] border-2 border-amber-500/30 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <div className={`p-5 rounded-3xl ${SECTOR_ICON_STYLES[sector.color] || SECTOR_ICON_STYLES.blue} shadow-2xl shrink-0`}>
            <SectorIcon className="w-12 h-12" />
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-black">
                {sector.badge}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[11px] font-bold">
                {sector.stages.length} {isEn ? "Stages" : "مراحل تدريبية"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {sector.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">{sector.nameEn}</p>

            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-3xl">
              {sector.fullOverview}
            </p>
          </div>

          <div className="bg-[#1C122E] border border-white/10 rounded-2xl p-4 text-xs space-y-1.5 min-w-[240px] lg:min-w-[260px]">
            <div className="text-slate-400 font-bold flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isEn ? "Average Salary Range:" : "متوسط راتب التخصص:"}</span>
            </div>
            <div className="text-base font-black text-emerald-300 font-mono">{sector.averageSalaryRange}</div>
            <div className="text-[10px] text-slate-400">حسب حجم الشركة والخبرة العملية</div>
          </div>
        </div>
      </div>

      {/* Skills Distribution */}
      <div className="bg-[#120B21] border-2 border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>{isEn ? "Core Skills You Will Master" : "المهارات الأساسية التي ستتقنها في هذا التخصص"}</span>
          </h2>
          <span className="text-xs text-purple-300 font-bold">
            {isEn ? `${skills.length} key skills` : `${skills.length} مهارات محورية`}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((sk, idx) => (
            <div key={idx} className="bg-[#1A112C] border border-purple-500/20 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black text-white">{sk.skill}</span>
                <span className="px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-400/30 text-[10px] font-black font-mono">
                  {sk.percentage}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 via-purple-500 to-indigo-500"
                  style={{ width: `${sk.percentage}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{sk.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Related Content Links */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-black text-slate-300 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>{isEn ? "Related Content:" : "محتوى مرتبط بهذا التخصص:"}</span>
        </span>
        {quickLinks.map((ql) => {
          const IconComp = ql.icon;
          return (
            <button
              key={ql.id}
              onClick={() => onSelectTab(ql.id as ActiveTab)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border text-xs font-black transition-all cursor-pointer hover:scale-105 ${ql.color}`}
            >
              <IconComp className="w-4 h-4" />
              <span>{ql.label}</span>
            </button>
          );
        })}
      </div>

      {/* Everything related to the sector */}
      <SectorDetailPanel
        sector={sector}
        isEn={isEn}
        onSelectTab={onSelectTab}
        onOpenOdooWithEntry={onOpenOdooWithEntry}
      />

      {/* Other Sectors Quick Switch */}
      <div className="bg-[#120B21] border border-white/10 rounded-3xl p-5 space-y-3">
        <h4 className="text-sm font-black text-white flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-amber-400" />
          <span>{isEn ? "Browse Other Sectors" : "استكشف تخصصات أخرى"}</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {ACCOUNTING_SECTORS.map((s) => {
            const sIcon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => onChangeSector?.(s.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                  s.id === sector.id
                    ? "bg-amber-500/20 text-amber-300 border-amber-400/40"
                    : "bg-[#1A112C] text-slate-300 border-white/10 hover:border-purple-400/40 hover:text-white"
                }`}
              >
                <span className={`w-6 h-6 rounded-lg ${SECTOR_ICON_STYLES[s.color] || SECTOR_ICON_STYLES.blue} flex items-center justify-center shrink-0`}>
                  <sIcon className="w-3.5 h-3.5 text-white" />
                </span>
                <span>{s.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
