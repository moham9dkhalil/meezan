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
  Hash,
  ChevronLeft,
  Home
} from "lucide-react";

interface AccountingStandardsSectionProps {
  onSelectTab?: (tab: ActiveTab) => void;
  appLanguage?: Language;
}

const FAMILY_STYLE: Record<
  string,
  { active: string; chip: string; text: string; cardBorder: string }
> = {
  ifrs: {
    active: "border-indigo-400/70 bg-indigo-600/25 text-indigo-100",
    chip: "bg-indigo-500/15 text-indigo-300 border-indigo-400/30",
    text: "text-indigo-300",
    cardBorder: "hover:border-indigo-400/50",
  },
  ias: {
    active: "border-purple-400/70 bg-purple-600/25 text-purple-100",
    chip: "bg-purple-500/15 text-purple-300 border-purple-400/30",
    text: "text-purple-300",
    cardBorder: "hover:border-purple-400/50",
  },
  framework: {
    active: "border-amber-400/70 bg-amber-500/20 text-amber-100",
    chip: "bg-amber-500/15 text-amber-300 border-amber-400/30",
    text: "text-amber-300",
    cardBorder: "hover:border-amber-400/50",
  },
  ifric: {
    active: "border-cyan-400/70 bg-cyan-600/20 text-cyan-100",
    chip: "bg-cyan-500/15 text-cyan-300 border-cyan-400/30",
    text: "text-cyan-300",
    cardBorder: "hover:border-cyan-400/50",
  },
  eas: {
    active: "border-emerald-400/70 bg-emerald-600/20 text-emerald-100",
    chip: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    text: "text-emerald-300",
    cardBorder: "hover:border-emerald-400/50",
  },
  gaap: {
    active: "border-rose-400/70 bg-rose-600/20 text-rose-100",
    chip: "bg-rose-500/15 text-rose-300 border-rose-400/30",
    text: "text-rose-300",
    cardBorder: "hover:border-rose-400/50",
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
    <div className="bg-[#131029] border border-purple-500/20 rounded-2xl p-4 space-y-1.5">
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

function DetailCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-[#0d0a1e] border border-white/10 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-2.5">
        {icon}
        <h4 className="text-xs font-black text-white">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function isSuperseded(status: string): boolean {
  return status.includes("مستبدل") || status.includes("مرحلة") || status.includes("مستثنى");
}

export function AccountingStandardsSection({
  onSelectTab,
  appLanguage = "ar"
}: AccountingStandardsSectionProps) {
  const isEn = appLanguage === "en";
  const [activeFamilyId, setActiveFamilyId] = useState<string>("ifrs");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeFamily =
    STANDARDS_FAMILIES.find((f) => f.id === activeFamilyId) || STANDARDS_FAMILIES[0];

  const detailStandard = detailId
    ? ALL_STANDARDS.find((s) => s.id === detailId)
    : null;

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

  const openStandard = (std: AccountingStandard) => {
    setDetailId(std.id);
    setSearchQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBackToList = () => {
    setDetailId(null);
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

  // ─────────────────────────────────────────────────────────────
  // SEPARATE STANDARD DETAIL SCREEN
  // ─────────────────────────────────────────────────────────────
  if (detailStandard) {
    const fam = STANDARDS_FAMILIES.find((f) => f.id === detailStandard.family) || activeFamily;
    const style = FAMILY_STYLE[detailStandard.family] || FAMILY_STYLE.ifrs;
    const list = fam.standards;
    const idx = list.findIndex((s) => s.id === detailStandard.id);
    const prev = list[(idx - 1 + list.length) % list.length];
    const next = list[(idx + 1) % list.length];

    const fullText = useMemo(() => {
      const s = detailStandard;
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
    }, [detailStandard]);

    return (
      <section className="space-y-5 animate-fadeIn pb-12 relative">
        {/* TOP NAV BAR */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={goBackToList}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-slate-200 text-xs font-black cursor-pointer transition-all"
          >
            <ArrowRight className="w-4 h-4 text-cyan-400" />
            {isEn ? "All standards" : "العودة لكل المعايير"}
          </button>

          <span className={`px-3 py-1.5 rounded-xl border text-[11px] font-black ${style.chip}`}>
            {fam.icon} {isEn ? fam.labelEn : fam.labelAr}
          </span>

          <button
            onClick={() => handleCopy(fullText)}
            className="mr-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-slate-300 text-[10px] font-bold transition-all cursor-pointer"
          >
            {copiedId === "copy-all" ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copiedId === "copy-all"
              ? (isEn ? "Copied" : "تم النسخ")
              : (isEn ? "Copy full text" : "نسخ نص المعيار كاملاً")}
          </button>
        </div>

        {/* HEADER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#141031] via-[#1a1140] to-[#0d0a1e] border-2 border-purple-500/30 p-6 sm:p-8 space-y-4 shadow-2xl">
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-56 h-56 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1.5 rounded-full border text-[11px] font-black ${style.chip}`}>
              {fam.icon} {detailStandard.code}
            </span>
            {detailStandard.status && (
              <span
                className={`px-2.5 py-1 rounded-full border text-[10px] font-black flex items-center gap-1 ${
                  isSuperseded(detailStandard.status)
                    ? "bg-rose-950/40 border-rose-500/40 text-rose-200"
                    : "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                }`}
              >
                <ShieldCheck className="w-3 h-3" />
                {isEn
                  ? isSuperseded(detailStandard.status) ? "Superseded" : "Active"
                  : detailStandard.status}
              </span>
            )}
            {detailStandard.effective && (
              <span className="mr-auto px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                <Hash className="w-3 h-3" />
                {detailStandard.effective}
              </span>
            )}
          </div>

          <div className="relative z-10">
            <h1 className="text-xl sm:text-3xl font-black text-white leading-tight">
              {detailStandard.titleAr}
            </h1>
            {detailStandard.titleEn !== detailStandard.titleAr && (
              <p className="text-xs text-slate-400 font-bold mt-1">{detailStandard.titleEn}</p>
            )}
          </div>
        </div>

        {/* OVERVIEW */}
        <DetailCard
          icon={<Sparkles className="w-4 h-4 text-amber-400" />}
          title={isEn ? "Standard Overview" : "نبذة تعريفية"}
        >
          <p className="text-xs sm:text-[13px] text-slate-200 font-medium leading-relaxed">
            {detailStandard.summaryAr}
          </p>
        </DetailCard>

        {/* SCOPE */}
        <DetailCard
          icon={<Target className="w-4 h-4 text-cyan-400" />}
          title={isEn ? "Scope of Application" : "نطاق التطبيق"}
        >
          <p className="text-xs sm:text-[13px] text-slate-200 font-medium leading-relaxed">
            {detailStandard.scopeAr}
          </p>
        </DetailCard>

        {/* KEY POINTS */}
        <DetailCard
          icon={<BookOpenCheck className="w-4 h-4 text-indigo-400" />}
          title={
            <>
              {isEn ? "Key Points" : "أبرز النقاط الأساسية"}
              <span className="mr-2 px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-400/30 text-[10px] font-black font-mono">
                {detailStandard.pointsAr.length}
              </span>
            </>
          }
        >
          <div className="space-y-2">
            {detailStandard.pointsAr.map((p, i) => (
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
        </DetailCard>

        {/* RECOGNITION / MEASUREMENT / DISCLOSURE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <DetailBlock
            icon={<Scale className="w-3.5 h-3.5" />}
            label={isEn ? "Recognition" : "الاعتراف"}
            value={detailStandard.recognitionAr}
          />
          <DetailBlock
            icon={<Ruler className="w-3.5 h-3.5" />}
            label={isEn ? "Measurement" : "القياس"}
            value={detailStandard.measurementAr}
          />
          <DetailBlock
            icon={<FileSearch className="w-3.5 h-3.5" />}
            label={isEn ? "Disclosure" : "الإفصاح"}
            value={detailStandard.disclosureAr}
          />
        </div>

        {/* EXAMPLES */}
        {detailStandard.examplesAr && detailStandard.examplesAr.length > 0 && (
          <DetailCard
            icon={<Lightbulb className="w-4 h-4 text-amber-400" />}
            title={isEn ? "Practical Examples" : "أمثلة عملية"}
          >
            <div className="space-y-2.5">
              {detailStandard.examplesAr.map((ex, i) => (
                <div
                  key={i}
                  className="bg-amber-950/20 border border-amber-500/25 rounded-xl p-3.5 text-xs sm:text-[13px] text-amber-100 font-medium leading-relaxed flex items-start gap-2.5"
                >
                  <span className="text-amber-400 text-sm shrink-0 mt-0.5">◆</span>
                  <span>{ex}</span>
                </div>
              ))}
            </div>
          </DetailCard>
        )}

        {/* JOURNAL ENTRY */}
        {detailStandard.entryAr && (
          <DetailCard
            icon={<PenLine className="w-4 h-4 text-emerald-400" />}
            title={isEn ? "Journal Entry" : "القيد المحاسبي"}
          >
            <div className="bg-black/40 border border-emerald-500/20 rounded-xl p-3.5 font-mono text-xs text-emerald-200 font-bold leading-relaxed whitespace-pre-line">
              {detailStandard.entryAr}
            </div>
          </DetailCard>
        )}

        {/* NUMBERS */}
        {detailStandard.numbersAr && detailStandard.numbersAr.length > 0 && (
          <DetailCard
            icon={<Hash className="w-4 h-4 text-cyan-400" />}
            title={isEn ? "Key Numbers & Impacts" : "أرقام وتأثيرات جوهرية"}
          >
            <div className="space-y-2">
              {detailStandard.numbersAr.map((n, i) => (
                <div
                  key={i}
                  className="bg-cyan-950/20 border border-cyan-500/25 rounded-xl p-3 text-xs text-cyan-100 font-medium leading-relaxed"
                >
                  {n}
                </div>
              ))}
            </div>
          </DetailCard>
        )}

        {/* Q&A */}
        {detailStandard.qaAr && detailStandard.qaAr.length > 0 && (
          <DetailCard
            icon={<MessageCircleQuestion className="w-4 h-4 text-purple-400" />}
            title={isEn ? "Common Questions & Answers" : "أسئلة شائعة وإجاباتها"}
          >
            <div className="space-y-2.5">
              {detailStandard.qaAr.map((qa, i) => (
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
          </DetailCard>
        )}

        {/* NOTES */}
        {detailStandard.notesAr && (
          <DetailCard
            icon={<Sparkles className="w-4 h-4 text-rose-400" />}
            title={isEn ? "Notes" : "ملاحظات"}
          >
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              {detailStandard.notesAr}
            </p>
          </DetailCard>
        )}

        {/* PREV / NEXT + BACK */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => {
              openStandard(prev);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="text-right p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/50 hover:bg-white/[0.06] transition-all cursor-pointer group"
          >
            <span className="text-[10px] font-black text-cyan-400 flex items-center gap-1">
              <ArrowRight className="w-3.5 h-3.5" />
              {isEn ? "Previous standard" : "المعيار السابق"}
            </span>
            <span className="block mt-1 text-xs font-black text-white group-hover:text-cyan-200 truncate">
              {prev.code} — {prev.titleAr}
            </span>
          </button>

          <button
            onClick={() => {
              openStandard(next);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="text-right p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-400/50 hover:bg-white/[0.06] transition-all cursor-pointer group"
          >
            <span className="text-[10px] font-black text-indigo-400 flex items-center gap-1">
              <span className="mr-auto">{isEn ? "Next standard" : "المعيار التالي"}</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </span>
            <span className="block mt-1 text-xs font-black text-white group-hover:text-indigo-200 truncate">
              {next.code} — {next.titleAr}
            </span>
          </button>
        </div>

        <div className="flex justify-center pt-2">
          <button
            onClick={goBackToList}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-black cursor-pointer transition-all shadow-lg shadow-indigo-950"
          >
            <Home className="w-4 h-4" />
            {isEn ? "Back to all standards" : "العودة لجميع المعايير"}
          </button>
        </div>
      </section>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // STANDARDS LIST SCREEN
  // ─────────────────────────────────────────────────────────────
  const style = FAMILY_STYLE[activeFamily.id] || FAMILY_STYLE.ifrs;

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
              ? "Choose any standard to open it in a dedicated full screen with scope, recognition, measurement, disclosure, examples, journal entries and exam questions."
              : "اختر أي معيار وسيُفتح لك في شاشة منفصلة كاملة: نطاق التطبيق، الاعتراف، القياس، الإفصاح، أمثلة عملية، قيود محاسبية، وأسئلة الامتحانات الشائعة."}
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
                    onClick={() => openStandard(s)}
                    className="text-right p-4 rounded-2xl bg-[#0d0a20] border border-white/10 hover:border-indigo-400/50 hover:bg-[#141031] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-black ${st.chip}`}>
                        {f?.icon} {s.code}
                      </span>
                      <span className={`text-[10px] font-bold ${st.text}`}>{s.family}</span>
                      <ArrowRight className="mr-auto w-4 h-4 text-slate-500 group-hover:text-cyan-300 group-hover:-translate-x-0.5 transition-all" />
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
        <div className="space-y-4">
          {/* FAMILY TABS */}
          <div className="bg-[#0d0a20] border-2 border-indigo-500/25 rounded-3xl p-4 space-y-3">
            <h3 className="text-xs font-black text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>{isEn ? "Choose a standards family" : "اختر مجموعة المعايير"}</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {STANDARDS_FAMILIES.map((fam) => {
                const st = FAMILY_STYLE[fam.id] || FAMILY_STYLE.ifrs;
                const isActive = fam.id === activeFamily.id;
                return (
                  <button
                    key={fam.id}
                    onClick={() => setActiveFamilyId(fam.id)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all cursor-pointer text-center ${
                      isActive
                        ? `${st.active} shadow-lg scale-[1.02]`
                        : "bg-[#120f28] border-white/10 hover:border-indigo-500/40"
                    }`}
                  >
                    <span className="text-xl">{fam.icon}</span>
                    <span className="text-[10px] font-black text-white leading-tight">
                      {isEn ? fam.labelEn : fam.labelAr}
                    </span>
                    <span className={`text-[9px] font-bold ${st.text}`}>
                      {fam.standards.length} {isEn ? "items" : "معيار"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FAMILY INTRO */}
          <div className={`border rounded-2xl p-4 flex items-start gap-3 ${style.active.split(" ")[0]} bg-white/[0.02]`}>
            <span className="text-2xl">{activeFamily.icon}</span>
            <div>
              <h4 className="text-xs font-black text-white">
                {isEn ? activeFamily.labelEn : activeFamily.labelAr}
              </h4>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-1">
                {isEn ? activeFamily.introEn : activeFamily.introAr}
              </p>
            </div>
          </div>

          {/* STANDARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeFamily.standards.map((s) => {
              const st = FAMILY_STYLE[s.family] || FAMILY_STYLE.ifrs;
              return (
                <button
                  key={s.id}
                  onClick={() => openStandard(s)}
                  className={`text-right p-4 rounded-2xl bg-[#0d0a20] border border-white/10 hover:bg-[#141031] transition-all cursor-pointer group flex flex-col ${st.cardBorder}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-black ${st.chip}`}>
                      {s.code}
                    </span>
                    {s.status && (
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded-full border ${
                          isSuperseded(s.status)
                            ? "bg-rose-500/15 text-rose-300 border-rose-400/30"
                            : "bg-emerald-500/15 text-emerald-300 border-emerald-400/30"
                        }`}
                      >
                        {isSuperseded(s.status)
                          ? isEn ? "Superseded" : "مستبدل"
                          : isEn ? "Active" : "ساري"}
                      </span>
                    )}
                    <ArrowRight className="mr-auto w-4 h-4 text-slate-500 group-hover:text-cyan-300 group-hover:-translate-x-0.5 transition-all" />
                  </div>

                  <div className="mt-2.5 text-xs font-black text-white group-hover:text-indigo-200 leading-relaxed">
                    {s.titleAr}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium mt-1 line-clamp-3 flex-1">
                    {s.summaryAr}
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/5 text-[10px] font-black text-cyan-400 flex items-center gap-1.5">
                    <ClipboardList className="w-3.5 h-3.5" />
                    {isEn ? "Open standard screen" : "افتح شاشة المعيار كاملة"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
