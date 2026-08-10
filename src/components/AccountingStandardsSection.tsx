import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ActiveTab } from "../types";
import { Language } from "../data/translations";
import {
  STANDARDS_FAMILIES,
  ALL_STANDARDS,
  TOTAL_STANDARDS,
  AccountingStandard
} from "../data/standards";
import {
  Search,
  BookOpenCheck,
  Copy,
  Check,
  Sparkles,
  Target,
  Scale,
  Ruler,
  FileSearch,
  Lightbulb,
  PenLine,
  MessageCircleQuestion,
  ClipboardList,
  ShieldCheck,
  ArrowRight,
  Layers,
  Hash
} from "lucide-react";

interface AccountingStandardsSectionProps {
  onSelectTab?: (tab: ActiveTab) => void;
  appLanguage?: Language;
}

const FAMILY_STYLE: Record<
  string,
  { active: string; chip: string; text: string }
> = {
  ifrs: {
    active: "border-indigo-400/70 bg-indigo-600/25 text-indigo-100",
    chip: "bg-indigo-500/15 text-indigo-300 border-indigo-400/30",
    text: "text-indigo-300",
  },
  ias: {
    active: "border-purple-400/70 bg-purple-600/25 text-purple-100",
    chip: "bg-purple-500/15 text-purple-300 border-purple-400/30",
    text: "text-purple-300",
  },
  framework: {
    active: "border-amber-400/70 bg-amber-500/20 text-amber-100",
    chip: "bg-amber-500/15 text-amber-300 border-amber-400/30",
    text: "text-amber-300",
  },
  ifric: {
    active: "border-cyan-400/70 bg-cyan-600/20 text-cyan-100",
    chip: "bg-cyan-500/15 text-cyan-300 border-cyan-400/30",
    text: "text-cyan-300",
  },
  eas: {
    active: "border-emerald-400/70 bg-emerald-600/20 text-emerald-100",
    chip: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    text: "text-emerald-300",
  },
  gaap: {
    active: "border-rose-400/70 bg-rose-600/20 text-rose-100",
    chip: "bg-rose-500/15 text-rose-300 border-rose-400/30",
    text: "text-rose-300",
  },
};

function DetailBlock({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: string;
}) {
  if (!value) return null;
  return (
    <div className="bg-[#131029] border border-purple-500/20 rounded-xl p-3.5 space-y-1.5">
      <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-400">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-xs sm:text-[13px] text-slate-200 font-medium leading-relaxed whitespace-pre-line">
        {value}
      </p>
    </div>
  );
}

export function AccountingStandardsSection({
  onSelectTab,
  appLanguage = "ar"
}: AccountingStandardsSectionProps) {
  const isEn = appLanguage === "en";
  const [activeFamilyId, setActiveFamilyId] = useState<string>("ifrs");
  const [selectedStandardId, setSelectedStandardId] = useState<string>("ifrs15");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeFamily =
    STANDARDS_FAMILIES.find((f) => f.id === activeFamilyId) || STANDARDS_FAMILIES[0];

  const searching = searchQuery.trim().length > 0;

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return ALL_STANDARDS.filter(
      (s) =>
        s.code.toLowerCase().includes(q) ||
        s.titleAr.includes(searchQuery.trim()) ||
        s.titleEn.toLowerCase().includes(q) ||
        (s.keywords || []).some((k) => k.toLowerCase().includes(q)) ||
        s.summaryAr.includes(searchQuery.trim()) ||
        s.scopeAr.includes(searchQuery.trim())
    );
  }, [searchQuery]);

  const selectedStandard =
    ALL_STANDARDS.find((s) => s.id === selectedStandardId) ||
    activeFamily.standards[0];

  const selectStandard = (std: AccountingStandard) => {
    setSelectedStandardId(std.id);
    setActiveFamilyId(std.family);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId("copy-all");
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // ignore
    }
  };

  const style = FAMILY_STYLE[activeFamily.id] || FAMILY_STYLE.ifrs;

  const fullText = useMemo(() => {
    const s = selectedStandard;
    return [
      `${s.code} — ${s.titleAr}`,
      s.summaryAr,
      `نطاق التطبيق: ${s.scopeAr}`,
      "أبرز النقاط:",
      ...s.pointsAr,
      s.recognitionAr ? `الاعتراف: ${s.recognitionAr}` : null,
      s.measurementAr ? `القياس: ${s.measurementAr}` : null,
      s.disclosureAr ? `الإفصاح: ${s.disclosureAr}` : null,
      ...(s.examplesAr?.length ? ["أمثلة عملية:", ...s.examplesAr] : []),
      s.entryAr ? `القيد المحاسبي: ${s.entryAr}` : null,
    ]
      .filter(Boolean)
      .join("\n\n");
  }, [selectedStandard]);

  return (
    <section className="space-y-6 animate-fadeIn pb-12 relative">
      {/* HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#101a3a] via-[#1a1140] to-[#0d0b26] border-2 border-indigo-500/30 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-purple-500/20 border border-amber-400/40 text-amber-300 text-xs font-black shadow-md">
            <BookOpenCheck className="w-4 h-4 text-amber-300" />
            <span>
              {isEn
                ? "All Accounting Standards - Deep Reference"
                : "المرجع الشامل لكل معايير المحاسبة"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            {isEn
              ? "Every Accounting Standard Explained in Depth"
              : "كل المعايير المحاسبية: IFRS, IAS, الإطار المفاهيمي, التفسيرات, المعايير المصرية و GAAP 📚"}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-3xl">
            {isEn
              ? "A complete, deep-dive reference for every international, Egyptian and US accounting standard: scope, recognition, measurement, disclosure, practical examples, journal entries and common exam questions — with nothing left out."
              : "مرجع تفصيلي شديد العمق لكل المعايير: نطاق التطبيق، الاعتراف، القياس، الإفصاح، أمثلة عملية، قيود محاسبية، وأسئلة الامتحانات الشائعة — من دون إغفال أي معيار."}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-bold text-slate-400">
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
              {TOTAL_STANDARDS} {isEn ? "Standards" : "معيار وتفسير"}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
              {STANDARDS_FAMILIES.length} {isEn ? "Families" : "مجموعات معايير"}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
              {isEn ? "IFRS 1-18 + IAS 1-41" : "IFRS 1-18 + IAS 1-41 + تفسيرات + مصرية + أمريكية"}
            </span>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            isEn
              ? "Search any standard, keyword or topic (e.g., revenue, leases, impairment, ECL, IFRS 9, مخزون)..."
              : "ابحث في أي معيار أو كلمة (مثال: الإيراد، الإيجار، انخفاض القيمة، المخزون، الشهرة، ECL، IFRS 9)..."
          }
          className="w-full bg-[#0d0a20] border border-white/15 rounded-2xl pr-10 pl-10 py-3 text-xs text-white placeholder-slate-400 outline-none focus:border-indigo-400 shadow-lg"
        />
        {searching && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* SEARCH RESULTS */}
      {searching ? (
        <div className="space-y-3">
          <div className="text-[11px] text-slate-400 font-bold">
            {isEn ? "Search results:" : "نتائج البحث:"}{" "}
            <span className="text-amber-300 font-mono">{searchResults.length}</span>{" "}
            {isEn ? "standard(s)" : "معيار"}
          </div>
          {searchResults.length === 0 ? (
            <div className="bg-[#0d0a20] border border-white/10 rounded-3xl p-10 text-center space-y-3">
              <div className="text-4xl">🔍</div>
              <p className="text-sm font-black text-white">
                {isEn ? "No matching standard found" : "لا يوجد معيار مطابق"}
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black cursor-pointer transition-all"
              >
                {isEn ? "Clear search" : "مسح البحث"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {searchResults.map((s) => {
                const f = STANDARDS_FAMILIES.find((x) => x.id === s.family);
                const st = FAMILY_STYLE[s.family] || FAMILY_STYLE.ifrs;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      selectStandard(s);
                      setSearchQuery("");
                    }}
                    className={`text-right p-3.5 rounded-2xl bg-[#0d0a20] border border-white/10 hover:border-indigo-400/50 hover:bg-[#141031] transition-all cursor-pointer group`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-black ${st.chip}`}>
                        {f?.icon} {s.code}
                      </span>
                      <span className={`text-[10px] font-bold ${st.text}`}>{s.family}</span>
                    </div>
                    <div className="mt-1.5 text-xs font-black text-white group-hover:text-indigo-200 leading-relaxed">
                      {s.titleAr}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium mt-1 line-clamp-2">
                      {s.summaryAr}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-5">
          {/* SIDEBAR */}
          <aside className="lg:w-96 shrink-0 space-y-4">
            {/* FAMILY TABS */}
            <div className="bg-[#0d0a20] border-2 border-indigo-500/25 rounded-3xl p-4 space-y-3">
              <h3 className="text-xs font-black text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>{isEn ? "Standards Family" : "مجموعة المعايير"}</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
                {STANDARDS_FAMILIES.map((fam) => {
                  const st = FAMILY_STYLE[fam.id] || FAMILY_STYLE.ifrs;
                  const isActive = fam.id === activeFamily.id;
                  return (
                    <button
                      key={fam.id}
                      onClick={() => {
                        setActiveFamilyId(fam.id);
                        setSelectedStandardId(fam.standards[0].id);
                        setSearchQuery("");
                      }}
                      className={`flex items-center gap-2.5 p-3 rounded-2xl border-2 transition-all cursor-pointer text-right ${
                        isActive
                          ? `${st.active} shadow-lg scale-[1.01]`
                          : "bg-[#120f28] border-white/10 hover:border-indigo-500/40"
                      }`}
                    >
                      <span className="text-xl">{fam.icon}</span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[11px] font-black text-white leading-tight truncate">
                          {isEn ? fam.labelEn : fam.labelAr}
                        </span>
                        <span className={`block text-[10px] font-bold ${st.text}`}>
                          {fam.standards.length} {isEn ? "items" : "معيار"}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STANDARD LIST */}
            <div className="bg-[#0d0a20] border-2 border-indigo-500/25 rounded-3xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-white flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-cyan-300" />
                  <span>{isEn ? "Standards in this family" : "معايير هذه المجموعة"}</span>
                </h3>
                <span className="text-[10px] font-bold text-slate-400 font-mono">
                  {activeFamily.standards.length}
                </span>
              </div>
              <div className="space-y-1.5 max-h-[28rem] overflow-y-auto pr-1 scrollbar-thin">
                {activeFamily.standards.map((s) => {
                  const isActive = s.id === selectedStandardId;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStandardId(s.id)}
                      className={`w-full text-right p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-600/30 to-purple-600/20 border-indigo-400/60 shadow-md"
                          : "bg-white/[0.03] border-white/5 hover:bg-white/[0.07] hover:border-white/15"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded-md text-[9px] font-black border shrink-0 ${
                            isActive ? "bg-amber-500/20 text-amber-300 border-amber-400/40" : "bg-white/10 text-slate-300 border-white/10"
                          }`}
                        >
                          {s.code}
                        </span>
                        <span
                          className={`text-[11px] font-black leading-tight ${
                            isActive ? "text-white" : "text-slate-300"
                          }`}
                        >
                          {s.titleAr}
                        </span>
                        {s.status && (
                          <span
                            className={`mr-auto text-[8px] font-black px-1.5 py-0.5 rounded-full border shrink-0 ${
                              s.status.includes("مستبدل") || s.status.includes("مرحلة")
                                ? "bg-rose-500/15 text-rose-300 border-rose-400/30"
                                : "bg-emerald-500/15 text-emerald-300 border-emerald-400/30"
                            }`}
                          >
                            {s.status.includes("مستبدل") || s.status.includes("مرحلة")
                              ? isEn ? "Superseded" : "مستبدل"
                              : isEn ? "Active" : "ساري"}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* DETAIL PANEL */}
          <main className="flex-1 min-w-0 space-y-4">
            {/* HEADER */}
            <div className="bg-gradient-to-br from-[#141031] to-[#0d0a1e] border-2 border-purple-500/30 rounded-3xl p-5 sm:p-6 space-y-3 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black ${style.chip}`}>
                    {activeFamily.icon} {selectedStandard.code}
                  </span>
                  <span className={`text-[10px] font-black ${style.text}`}>
                    {isEn ? selectedStandard.titleEn : selectedStandard.titleAr}
                  </span>
                  <span className="mr-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400">
                    <Hash className="w-3 h-3" />
                    {selectedStandard.effective || "—"}
                  </span>
                </div>
                <h2 className="mt-2 text-lg sm:text-2xl font-black text-white leading-tight">
                  {selectedStandard.titleAr}
                </h2>
                {selectedStandard.titleEn !== selectedStandard.titleAr && (
                  <p className="text-[11px] text-slate-400 font-bold">{selectedStandard.titleEn}</p>
                )}

                <button
                  onClick={() => handleCopy(fullText)}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 text-[10px] font-bold transition-all cursor-pointer"
                >
                  {copiedId === "copy-all" ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  {copiedId === "copy-all"
                    ? (isEn ? "Copied" : "تم النسخ")
                    : (isEn ? "Copy full text" : "نسخ نص المعيار كاملاً")}
                </button>
              </div>
            </div>

            {/* STATUS BADGE */}
            {selectedStandard.status && (
              <div
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-[11px] font-black ${
                  selectedStandard.status.includes("مستبدل") || selectedStandard.status.includes("مرحلة")
                    ? "bg-rose-950/30 border-rose-500/30 text-rose-200"
                    : "bg-emerald-950/30 border-emerald-500/30 text-emerald-200"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {isEn
                    ? `Status: ${selectedStandard.status}`
                    : `الحالة: ${selectedStandard.status}`}
                </span>
              </div>
            )}

            {/* SUMMARY */}
            <div className="bg-[#0d0a1e] border border-white/10 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-black text-white">
                  {isEn ? "Standard Overview" : "نبذة تعريفية"}
                </h4>
              </div>
              <p className="text-xs sm:text-[13px] text-slate-200 font-medium leading-relaxed">
                {selectedStandard.summaryAr}
              </p>
            </div>

            {/* SCOPE */}
            <div className="bg-[#0d0a1e] border border-white/10 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-black text-white">
                  {isEn ? "Scope of Application" : "نطاق التطبيق"}
                </h4>
              </div>
              <p className="text-xs sm:text-[13px] text-slate-200 font-medium leading-relaxed">
                {selectedStandard.scopeAr}
              </p>
            </div>

            {/* KEY POINTS */}
            <div className="bg-[#0d0a1e] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-2.5">
              <div className="flex items-center gap-2 mb-1">
                <BookOpenCheck className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-black text-white">
                  {isEn ? "Key Points" : "أبرز النقاط الأساسية"}
                </h4>
                <span className="mr-auto px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-400/30 text-[10px] font-black font-mono">
                  {selectedStandard.pointsAr.length}
                </span>
              </div>
              <div className="space-y-2">
                {selectedStandard.pointsAr.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 bg-white/[0.03] border border-white/5 rounded-xl p-3"
                  >
                    <span className="w-5 h-5 rounded-lg bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-xs sm:text-[13px] text-slate-200 font-medium leading-relaxed">
                      {p}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* RECOGNITION / MEASUREMENT / DISCLOSURE */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <DetailBlock
                icon={<Scale className="w-3.5 h-3.5" />}
                label={isEn ? "Recognition" : "الاعتراف"}
                value={selectedStandard.recognitionAr}
              />
              <DetailBlock
                icon={<Ruler className="w-3.5 h-3.5" />}
                label={isEn ? "Measurement" : "القياس"}
                value={selectedStandard.measurementAr}
              />
              <DetailBlock
                icon={<FileSearch className="w-3.5 h-3.5" />}
                label={isEn ? "Disclosure" : "الإفصاح"}
                value={selectedStandard.disclosureAr}
              />
            </div>

            {/* EXAMPLES */}
            {selectedStandard.examplesAr && selectedStandard.examplesAr.length > 0 && (
              <div className="bg-[#0d0a1e] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-2.5">
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-black text-white">
                    {isEn ? "Practical Examples" : "أمثلة عملية"}
                  </h4>
                </div>
                {selectedStandard.examplesAr.map((ex, i) => (
                  <div
                    key={i}
                    className="bg-amber-950/20 border border-amber-500/25 rounded-xl p-3.5 text-xs sm:text-[13px] text-amber-100 font-medium leading-relaxed flex items-start gap-2.5"
                  >
                    <span className="text-amber-400 text-sm shrink-0 mt-0.5">◆</span>
                    <span>{ex}</span>
                  </div>
                ))}
              </div>
            )}

            {/* JOURNAL ENTRY */}
            {selectedStandard.entryAr && (
              <div className="bg-[#0d0a1e] border border-white/10 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-2">
                  <PenLine className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-black text-white">
                    {isEn ? "Journal Entry" : "القيد المحاسبي"}
                  </h4>
                </div>
                <div className="bg-black/40 border border-emerald-500/20 rounded-xl p-3.5 font-mono text-xs text-emerald-200 font-bold leading-relaxed whitespace-pre-line">
                  {selectedStandard.entryAr}
                </div>
              </div>
            )}

            {/* NUMBERS */}
            {selectedStandard.numbersAr && selectedStandard.numbersAr.length > 0 && (
              <div className="bg-[#0d0a1e] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-black text-white">
                    {isEn ? "Key Numbers & Impacts" : "أرقام وتأثيرات جوهرية"}
                  </h4>
                </div>
                {selectedStandard.numbersAr.map((n, i) => (
                  <div
                    key={i}
                    className="bg-cyan-950/20 border border-cyan-500/25 rounded-xl p-3 text-xs text-cyan-100 font-medium leading-relaxed"
                  >
                    {n}
                  </div>
                ))}
              </div>
            )}

            {/* Q&A */}
            {selectedStandard.qaAr && selectedStandard.qaAr.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MessageCircleQuestion className="w-4 h-4 text-purple-400" />
                  <h4 className="text-xs font-black text-white">
                    {isEn ? "Common Questions & Answers" : "أسئلة شائعة وإجاباتها"}
                  </h4>
                </div>
                <div className="space-y-2.5">
                  {selectedStandard.qaAr.map((qa, i) => (
                    <div
                      key={i}
                      className="bg-[#0d0a1e] border border-purple-500/20 rounded-2xl p-4 space-y-1.5"
                    >
                      <p className="text-xs font-black text-purple-200 leading-relaxed flex items-start gap-2">
                        <span className="px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[9px] font-black shrink-0 mt-0.5">
                          س
                        </span>
                        {qa.q}
                      </p>
                      <p className="text-xs text-slate-300 font-medium leading-relaxed flex items-start gap-2">
                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[9px] font-black shrink-0 mt-0.5">
                          ج
                        </span>
                        {qa.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NOTES */}
            {selectedStandard.notesAr && (
              <div className="bg-[#0d0a1e] border border-white/10 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-rose-400" />
                  <h4 className="text-xs font-black text-white">
                    {isEn ? "Notes" : "ملاحظات"}
                  </h4>
                </div>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  {selectedStandard.notesAr}
                </p>
              </div>
            )}

            {/* PREV / NEXT NAV */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold">
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  {selectedStandard.code} — {selectedStandard.titleAr}
                </span>
              </div>
              <button
                onClick={() => {
                  const list = activeFamily.standards;
                  const idx = list.findIndex((s) => s.id === selectedStandard.id);
                  const next = list[(idx + 1) % list.length];
                  setSelectedStandardId(next.id);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-black cursor-pointer transition-all shadow-lg shadow-indigo-950"
              >
                {isEn ? "Next standard" : "المعيار التالي"}
                <span className="mr-1.5">←</span>
              </button>
            </div>
          </main>
        </div>
      )}
    </section>
  );
}

