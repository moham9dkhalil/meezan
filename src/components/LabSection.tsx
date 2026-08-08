import React, { useState, useEffect } from "react";
import { LAB_SCENARIOS, ACCOUNTS_LIST } from "../data/labScenarios";
import { LabEntryItem, LabScenario } from "../types";
import { JournalLearningGuide } from "./JournalLearningGuide";
import { CelebrationParticles, fireCelebrationParticles } from "./CelebrationParticles";
import {
  Calculator,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Scale,
  TrendingUp,
  PieChart,
  Building2,
  Sparkles,
  Lightbulb,
  HelpCircle,
  Zap,
  BarChart3,
  Activity,
  Coins,
  Award,
  ShieldCheck,
  Percent,
  CheckCircle2,
  ArrowRightLeft,
  FileSpreadsheet,
  ArrowUpRight,
  ChevronDown,
  FileText,
  Printer,
  Sliders,
  Database,
  Cpu,
  Layers,
  Check,
  Send,
  Download,
  BookOpen
} from "lucide-react";

type LabSubMode = "entryGuide" | "erpJournal" | "journal" | "ratios" | "depreciation" | "breakeven" | "bankRec";

interface LabSectionProps {
  onSolveLabEntry?: (xpReward?: number, title?: string) => void;
}

export function LabSection({ onSolveLabEntry }: LabSectionProps = {}) {
  const [activeSubMode, setActiveSubMode] = useState<LabSubMode>("erpJournal");
  const [presetTarget, setPresetTarget] = useState<{
    debitAcc: string;
    creditAcc: string;
    amount: number;
    memo: string;
  } | null>(null);

  const handleLoadPresetToJournal = (debitAcc: string, creditAcc: string, amount: number, memo: string) => {
    setPresetTarget({ debitAcc, creditAcc, amount, memo });
    setActiveSubMode("erpJournal");
  };

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 space-y-8 animate-fadeIn">
      {/* SECTION HEADER */}
      <div className="bg-gradient-to-br from-[#0b1329] via-[#0d1838] to-[#121c42] border border-cyan-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="absolute top-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-black shadow-inner">
            <Calculator className="w-4 h-4 text-cyan-400" />
            <span>المعمل المحاسبي والمالي المتقدم</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            مختبر المحاكاة والتحليل المالي التطبيقي
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            بيئة تفاعلية متكاملة لاختبار القيود المحاسبية المركبة، تحليل النسب المالية، حساب إهلاك الأصول، دراسة نقطة التعادل CVP، ومطابقة التسويات البنكية فورياً.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-extrabold text-cyan-300">
            <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>محاكاة فورية حية</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>تقارير تشخيصية أوتوماتيكية</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>مطابقة معايير IFRS / GAAP</span>
            </span>
          </div>
        </div>

        {/* Quick Badges / Stats Card */}
        <div className="z-10 w-full lg:w-auto shrink-0 bg-black/40 border border-white/10 p-5 rounded-2xl backdrop-blur-xl space-y-3 min-w-[260px]">
          <div className="flex items-center justify-between text-xs font-extrabold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>الأدوات المتاحة بالمعمل</span>
            </span>
            <span className="text-cyan-300 font-black">5 أدوات</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
            <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-slate-300 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-cyan-400" />
              <span>القيود والتوازن</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-slate-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>النسب والتشخيص</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
              <span>إهلاك الأصول</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-slate-300 flex items-center gap-1.5">
              <PieChart className="w-3.5 h-3.5 text-amber-400" />
              <span>نقطة التعادل</span>
            </div>
          </div>
        </div>
      </div>

      {/* LAB NAVIGATION MODES SWITCHER */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveSubMode("entryGuide")}
          className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2.5 border whitespace-nowrap shrink-0 ${
            activeSubMode === "entryGuide"
              ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white border-purple-400 shadow-xl shadow-purple-600/30 scale-102"
              : "bg-[#0d1424] text-slate-300 border-white/10 hover:border-white/20 hover:text-white"
          }`}
        >
          <BookOpen className="w-4 h-4 text-purple-300" />
          <span>تعلم إعداد القيد المحاسبي 🎓</span>
          <span className="px-2 py-0.5 rounded-full bg-purple-400/20 text-purple-200 text-[10px] font-black border border-purple-400/30">
            مرشد تفاعلي
          </span>
        </button>

        <button
          onClick={() => setActiveSubMode("erpJournal")}
          className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2.5 border whitespace-nowrap shrink-0 ${
            activeSubMode === "erpJournal"
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-xl shadow-purple-600/30 scale-102"
              : "bg-[#0d1424] text-slate-300 border-white/10 hover:border-white/20 hover:text-white"
          }`}
        >
          <Building2 className="w-4 h-4 text-purple-400" />
          <span>قيود ERP الأكاديمية (أودو وديناميك)</span>
          <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black border border-amber-400/30">Odoo & Dynamics</span>
        </button>

        <button
          onClick={() => setActiveSubMode("journal")}
          className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2.5 border whitespace-nowrap shrink-0 ${
            activeSubMode === "journal"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400 shadow-xl shadow-blue-600/30 scale-102"
              : "bg-[#0d1424] text-slate-300 border-white/10 hover:border-white/20 hover:text-white"
          }`}
        >
          <Scale className="w-4 h-4 text-cyan-400" />
          <span>تدريب القيود والتوازن (أساسي)</span>
        </button>

        <button
          onClick={() => setActiveSubMode("ratios")}
          className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2.5 border whitespace-nowrap shrink-0 ${
            activeSubMode === "ratios"
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-xl shadow-emerald-600/30 scale-102"
              : "bg-[#0d1424] text-slate-300 border-white/10 hover:border-white/20 hover:text-white"
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>النسب الماليّة والتشخيص الذكي</span>
        </button>

        <button
          onClick={() => setActiveSubMode("depreciation")}
          className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2.5 border whitespace-nowrap shrink-0 ${
            activeSubMode === "depreciation"
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-400 shadow-xl shadow-purple-600/30 scale-102"
              : "bg-[#0d1424] text-slate-300 border-white/10 hover:border-white/20 hover:text-white"
          }`}
        >
          <TrendingUp className="w-4 h-4 text-purple-400" />
          <span>محاكي إهلاك الأصول</span>
        </button>

        <button
          onClick={() => setActiveSubMode("breakeven")}
          className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2.5 border whitespace-nowrap shrink-0 ${
            activeSubMode === "breakeven"
              ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-400 shadow-xl shadow-amber-600/30 scale-102"
              : "bg-[#0d1424] text-slate-300 border-white/10 hover:border-white/20 hover:text-white"
          }`}
        >
          <PieChart className="w-4 h-4 text-amber-400" />
          <span>تحليل التعادل والربحية CVP</span>
        </button>

        <button
          onClick={() => setActiveSubMode("bankRec")}
          className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2.5 border whitespace-nowrap shrink-0 ${
            activeSubMode === "bankRec"
              ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400 shadow-xl shadow-cyan-600/30 scale-102"
              : "bg-[#0d1424] text-slate-300 border-white/10 hover:border-white/20 hover:text-white"
          }`}
        >
          <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
          <span>التسوية البنكية والمطابقة</span>
        </button>
      </div>

      {/* RENDER ACTIVE SUB MODE */}
      {activeSubMode === "entryGuide" && (
        <JournalLearningGuide
          onLoadPresetToJournal={handleLoadPresetToJournal}
          onSwitchToERPJournal={() => setActiveSubMode("erpJournal")}
        />
      )}
      {activeSubMode === "erpJournal" && <ERPJournalLab presetTarget={presetTarget} onOpenGuide={() => setActiveSubMode("entryGuide")} />}
      {activeSubMode === "journal" && (
        <JournalEntriesLab
          onOpenGuide={() => setActiveSubMode("entryGuide")}
          onSolveLabEntry={onSolveLabEntry}
        />
      )}
      {activeSubMode === "ratios" && <FinancialRatiosLab />}
      {activeSubMode === "depreciation" && <DepreciationLab />}
      {activeSubMode === "breakeven" && <BreakEvenLab />}
      {activeSubMode === "bankRec" && <BankReconciliationLab />}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. JOURNAL ENTRIES & ACCOUNTING EQUATION LAB
// ─────────────────────────────────────────────────────────────
function JournalEntriesLab({
  onOpenGuide,
  onSolveLabEntry
}: {
  onOpenGuide?: () => void;
  onSolveLabEntry?: (xpReward?: number, title?: string) => void;
}) {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
  const [showHint, setShowHint] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const categories = ["الكل", "عمليات المبيعات", "عمليات المشتريات", "قيود مركبة", "سداد وتحصيل", "تسويات جدارية", "حقوق الملكية والتمويل"];

  const filteredScenarios = LAB_SCENARIOS.filter(
    (s) => selectedCategory === "الكل" || s.category === selectedCategory
  );

  const currentScenario = filteredScenarios[scenarioIdx] || LAB_SCENARIOS[0];

  const [debitLines, setDebitLines] = useState<LabEntryItem[]>([
    { acc: ACCOUNTS_LIST[0], amt: "" }
  ]);
  const [creditLines, setCreditLines] = useState<LabEntryItem[]>([
    { acc: ACCOUNTS_LIST[5], amt: "" }
  ]);

  const [showCelebration, setShowCelebration] = useState(false);
  const [resultMsg, setResultMsg] = useState<{
    type: "success" | "error" | "warning";
    text: string;
    explanation?: string;
  } | null>(null);

  const handleSelectScenario = (idx: number) => {
    setScenarioIdx(idx);
    setDebitLines([{ acc: ACCOUNTS_LIST[0], amt: "" }]);
    setCreditLines([{ acc: ACCOUNTS_LIST[5], amt: "" }]);
    setResultMsg(null);
    setShowHint(false);
  };

  const addDebitLine = () => setDebitLines([...debitLines, { acc: ACCOUNTS_LIST[0], amt: "" }]);
  const removeDebitLine = (index: number) => {
    if (debitLines.length === 1) return;
    setDebitLines(debitLines.filter((_, i) => i !== index));
  };
  const updateDebitLine = (index: number, field: "acc" | "amt", val: any) => {
    const next = [...debitLines];
    next[index][field] = val;
    setDebitLines(next);
  };

  const addCreditLine = () => setCreditLines([...creditLines, { acc: ACCOUNTS_LIST[5], amt: "" }]);
  const removeCreditLine = (index: number) => {
    if (creditLines.length === 1) return;
    setCreditLines(creditLines.filter((_, i) => i !== index));
  };
  const updateCreditLine = (index: number, field: "acc" | "amt", val: any) => {
    const next = [...creditLines];
    next[index][field] = val;
    setCreditLines(next);
  };

  const debitTotal = debitLines.reduce((sum, item) => sum + (Number(item.amt) || 0), 0);
  const creditTotal = creditLines.reduce((sum, item) => sum + (Number(item.amt) || 0), 0);

  const resetEntry = () => {
    setDebitLines([{ acc: ACCOUNTS_LIST[0], amt: "" }]);
    setCreditLines([{ acc: ACCOUNTS_LIST[5], amt: "" }]);
    setResultMsg(null);
    setShowHint(false);
  };

  const handleCheck = () => {
    if (debitTotal === 0 && creditTotal === 0) {
      setResultMsg({
        type: "warning",
        text: "يرجى إدخال المبالغ في الحسابات أولاً قبل التحقق من القيد."
      });
      return;
    }

    if (debitTotal !== creditTotal) {
      const diff = Math.abs(debitTotal - creditTotal);
      const isDebitHigher = debitTotal > creditTotal;
      setResultMsg({
        type: "error",
        text: `❌ القيد غير متوازن! إجمالي المدين (${debitTotal.toLocaleString()} ج.م) لا يساوي إجمالي الدائن (${creditTotal.toLocaleString()} ج.م). الفارق: ${diff.toLocaleString()} ج.م`,
        explanation: isDebitHigher
          ? `💡 نصيحة التعديل المحاسبي: الجانب المدين زاد بمقدار ${diff.toLocaleString()} ج.م. أضف حساباً دافئاً أو زد قيمة الحسابات الدائنة بمبلغ ${diff.toLocaleString()} ج.م (مثل حـ/ المبيعات، حـ/ الموردون، أو حـ/ النقدية الدائنة).`
          : `💡 نصيحة التعديل المحاسبي: الجانب الدائن زاد بمقدار ${diff.toLocaleString()} ج.م. أضف حساباً مديناً أو زد قيمة الحسابات المدينة بمبلغ ${diff.toLocaleString()} ج.م (مثل حـ/ الصندوق، البنك، العملاء، أو المصروفات).`
      });
      return;
    }

    const expected = currentScenario.answer;

    const userDebitClean = debitLines
      .filter((l) => l.acc && Number(l.amt) > 0)
      .map((l) => `${l.acc}:${Number(l.amt)}`)
      .sort()
      .join("|");

    const userCreditClean = creditLines
      .filter((l) => l.acc && Number(l.amt) > 0)
      .map((l) => `${l.acc}:${Number(l.amt)}`)
      .sort()
      .join("|");

    const ansDebitClean = expected.debit
      .map((l) => `${l.acc}:${l.amt}`)
      .sort()
      .join("|");

    const ansCreditClean = expected.credit
      .map((l) => `${l.acc}:${l.amt}`)
      .sort()
      .join("|");

    if (userDebitClean === ansDebitClean && userCreditClean === ansCreditClean) {
      fireCelebrationParticles();
      setShowCelebration(true);
      setResultMsg({
        type: "success",
        text: "🎉 أحسنت صنعاً! القيد متوازن 100% وتوزيع الحسابات والمبالغ صحيح تماماً.",
        explanation: currentScenario.explanation
      });
      setScore((prev) => prev + 10);
      if (onSolveLabEntry) {
        onSolveLabEntry(50, currentScenario.title);
      }
    } else {
      setResultMsg({
        type: "warning",
        text: "⚠️ القيد متوازن حسابياً ولكن اختيارك لأسماء الحسابات أو المبالغ غير مطابق للعملية المطلوبة.",
        explanation: currentScenario.explanation
      });
    }
  };

  return (
    <div className="space-[#0d1424] space-y-6">
      {/* Categories Filter & Score Bar */}
      <div className="bg-[#0d1424] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setScenarioIdx(0);
                resetEntry();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white border-indigo-400"
                  : "bg-white/5 text-slate-400 border-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/50 text-purple-200 text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-300" />
              <span>تعلم إعداد القيد خطوة بخطوة 🎓</span>
            </button>
          )}

          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>نقاط التقييم: {score} XP</span>
          </div>
        </div>
      </div>

      {/* Scenarios Pills Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filteredScenarios.map((scenario, idx) => (
          <button
            key={scenario.id}
            onClick={() => handleSelectScenario(idx)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer border ${
              scenarioIdx === idx
                ? "bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/30"
                : "bg-[#0d1424] text-slate-400 border-white/10 hover:border-white/20 hover:text-white"
            }`}
          >
            <span>{scenario.title}</span>
            {scenario.difficulty && (
              <span className="mr-1.5 text-[9px] px-1.5 py-0.5 rounded bg-white/10 font-medium">
                {scenario.difficulty}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Active Scenario Card */}
      <div className="bg-[#0d1424] border border-blue-500/30 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between text-xs font-bold text-blue-300 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-black">
              سيناريو #{scenarioIdx + 1}
            </span>
            <span>{currentScenario.category}</span>
          </div>

          <button
            onClick={() => setShowHint(!showHint)}
            className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Lightbulb className="w-4 h-4" />
            <span>{showHint ? "إخفاء التلميح" : "تلميح المحاسب"}</span>
          </button>
        </div>

        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-black text-white">{currentScenario.title}</h3>
          <p className="text-sm sm:text-base font-bold text-slate-200 leading-relaxed bg-blue-950/40 p-4 rounded-2xl border border-blue-500/20">
            "{currentScenario.desc}"
          </p>

          {showHint && currentScenario.hint && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-bold flex items-start gap-2.5 animate-fadeIn">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><b>تلميح المحاسب:</b> {currentScenario.hint}</span>
            </div>
          )}
        </div>

        {/* Entry Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Debit Column */}
          <div className="bg-[#101a30] p-4 sm:p-5 rounded-2xl border border-red-500/30 space-y-4">
            <div className="flex items-center justify-between font-black text-sm text-red-400 border-b border-red-500/20 pb-2">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span>الطرف المدين (من حـ/)</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">زيادة أصول / مصروفات</span>
            </div>

            <div className="space-y-3">
              {debitLines.map((line, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select
                    value={line.acc}
                    onChange={(e) => updateDebitLine(idx, "acc", e.target.value)}
                    className="flex-1 bg-[#080c1c] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-bold outline-none focus:border-red-400 transition-colors"
                  >
                    {ACCOUNTS_LIST.map((acc, aIdx) => (
                      <option key={aIdx} value={acc}>
                        {acc}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    placeholder="المبلغ"
                    value={line.amt}
                    onChange={(e) =>
                      updateDebitLine(idx, "amt", e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="w-28 bg-[#080c1c] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-black text-center outline-none focus:border-red-400 transition-colors"
                  />

                  {debitLines.length > 1 && (
                    <button
                      onClick={() => removeDebitLine(idx)}
                      className="p-2 text-red-400 hover:text-red-300 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={addDebitLine}
              className="w-full py-2.5 rounded-xl border border-dashed border-red-500/40 text-red-300 hover:bg-red-500/10 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة حساب مدين آخر (قيد مركب)</span>
            </button>
          </div>

          {/* Credit Column */}
          <div className="bg-[#101a30] p-4 sm:p-5 rounded-2xl border border-emerald-500/30 space-y-4">
            <div className="flex items-center justify-between font-black text-sm text-emerald-400 border-b border-emerald-500/20 pb-2">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>الطرف الدائن (إلى حـ/)</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">زيادة خصوم / إيرادات</span>
            </div>

            <div className="space-y-3">
              {creditLines.map((line, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select
                    value={line.acc}
                    onChange={(e) => updateCreditLine(idx, "acc", e.target.value)}
                    className="flex-1 bg-[#080c1c] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-bold outline-none focus:border-emerald-400 transition-colors"
                  >
                    {ACCOUNTS_LIST.map((acc, aIdx) => (
                      <option key={aIdx} value={acc}>
                        {acc}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    placeholder="المبلغ"
                    value={line.amt}
                    onChange={(e) =>
                      updateCreditLine(idx, "amt", e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="w-28 bg-[#080c1c] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-black text-center outline-none focus:border-emerald-400 transition-colors"
                  />

                  {creditLines.length > 1 && (
                    <button
                      onClick={() => removeCreditLine(idx)}
                      className="p-2 text-red-400 hover:text-red-300 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={addCreditLine}
              className="w-full py-2.5 rounded-xl border border-dashed border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة حساب دائن آخر (قيد مركب)</span>
            </button>
          </div>
        </div>

        {/* Totals & Balance Bar */}
        <div className="bg-[#080c1c] p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between text-xs sm:text-sm font-bold gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-slate-300">
              إجمالي المدين: <b className="text-red-400 font-black">{debitTotal.toLocaleString()} ج.م</b>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">
              إجمالي الدائن: <b className="text-emerald-400 font-black">{creditTotal.toLocaleString()} ج.م</b>
            </span>
          </div>

          <span
            className={`px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 ${
              debitTotal === creditTotal && debitTotal > 0
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>
              {debitTotal === creditTotal && debitTotal > 0
                ? "القيد متوازن حسابياً ✓"
                : "غير متوازن (الفارق: " + Math.abs(debitTotal - creditTotal).toLocaleString() + " ج.م)"}
            </span>
          </span>
        </div>

        {/* Live T-Account Visualizer */}
        <div className="bg-[#080c1c] p-4 rounded-2xl border border-white/10 space-y-3">
          <div className="text-xs font-extrabold text-cyan-300 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
            <span>معاينة حية لترحيل الأستاذ العام (T-Accounts Live Preview)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Debit Ledger T-Box */}
            <div className="border border-red-500/30 rounded-xl overflow-hidden bg-[#0d1424]">
              <div className="bg-red-500/20 text-red-300 px-3 py-1.5 text-center text-xs font-black border-b border-red-500/30">
                جانب له / مدين (Dr)
              </div>
              <div className="p-3 text-xs space-y-1">
                {debitLines.map((l, i) => (
                  <div key={i} className="flex justify-between text-slate-300 font-bold">
                    <span>{l.acc || "اختر حساباً"}</span>
                    <span className="text-red-400">{l.amt ? Number(l.amt).toLocaleString() : 0} ج.م</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Credit Ledger T-Box */}
            <div className="border border-emerald-500/30 rounded-xl overflow-hidden bg-[#0d1424]">
              <div className="bg-emerald-500/20 text-emerald-300 px-3 py-1.5 text-center text-xs font-black border-b border-emerald-500/30">
                جانب عليه / دائن (Cr)
              </div>
              <div className="p-3 text-xs space-y-1">
                {creditLines.map((l, i) => (
                  <div key={i} className="flex justify-between text-slate-300 font-bold">
                    <span>{l.acc || "اختر حساباً"}</span>
                    <span className="text-emerald-400">{l.amt ? Number(l.amt).toLocaleString() : 0} ج.م</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Result Feedback Banner */}
        {resultMsg && (
          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm font-bold space-y-2 border animate-fadeIn ${
              resultMsg.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : resultMsg.type === "error"
                ? "bg-red-500/10 border-red-500/30 text-red-300"
                : "bg-amber-500/10 border-amber-500/30 text-amber-300"
            }`}
          >
            <div className="flex items-center gap-3">
              {resultMsg.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
              )}
              <span>{resultMsg.text}</span>
            </div>

            {resultMsg.explanation && (
              <div className="pt-2 border-t border-white/10 text-xs text-slate-300 leading-relaxed font-normal">
                <b>💡 المنطق المحاسبي للقيد:</b> {resultMsg.explanation}
              </div>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={handleCheck}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-blue-600/30 cursor-pointer transition-all hover:scale-102"
          >
            التحقق من صحة القيد
          </button>

          <button
            onClick={resetEntry}
            className="px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>إعادة تعيين</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. FINANCIAL RATIOS & DIAGNOSTICS LAB
// ─────────────────────────────────────────────────────────────
function FinancialRatiosLab() {
  const [revenue, setRevenue] = useState<number>(500000);
  const [cogs, setCogs] = useState<number>(300000);
  const [operatingExp, setOperatingExp] = useState<number>(80000);
  const [currentAssets, setCurrentAssets] = useState<number>(200000);
  const [currentLiabilities, setCurrentLiabilities] = useState<number>(100000);
  const [totalAssets, setTotalAssets] = useState<number>(600000);
  const [totalDebt, setTotalDebt] = useState<number>(220000);
  const [equity, setEquity] = useState<number>(380000);
  const [cash, setCash] = useState<number>(60000);

  // Calculations
  const grossProfit = revenue - cogs;
  const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
  const netIncome = grossProfit - operatingExp;
  const netMargin = revenue > 0 ? (netIncome / revenue) * 100 : 0;

  const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
  const quickRatio = currentLiabilities > 0 ? (currentAssets - (cogs * 0.2)) / currentLiabilities : 0; // Quick assets approximation
  const roe = equity > 0 ? (netIncome / equity) * 100 : 0;
  const roa = totalAssets > 0 ? (netIncome / totalAssets) * 100 : 0;
  const debtToEquity = equity > 0 ? totalDebt / equity : 0;

  // Diagnostics Rating
  const getHealthRating = () => {
    if (currentRatio >= 1.5 && netMargin >= 10 && debtToEquity <= 1.0) {
      return { status: "ممتاز أداء مالياً متيناً", color: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30" };
    } else if (currentRatio >= 1.0 && netMargin > 0) {
      return { status: "مقبول مع الحاجة لضبط السيولة", color: "text-amber-400 bg-amber-500/20 border-amber-500/30" };
    } else {
      return { status: "مخاطر سيولة ومديونية مرتفعة", color: "text-red-400 bg-red-500/20 border-red-500/30" };
    }
  };

  const health = getHealthRating();

  return (
    <div className="bg-[#0d1424] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span>محاكي التحليل والنسب المالية (Financial Ratios Diagnostics)</span>
          </h3>
          <p className="text-xs text-slate-400">
            غير قيم القوائم المالية لملاحظة التغير الفوري في النسب وتحليلات الإدارة المالية.
          </p>
        </div>

        <div className={`px-4 py-2 rounded-xl border text-xs font-black ${health.color}`}>
          <span>تقييم السلامة المالية: {health.status}</span>
        </div>
      </div>

      {/* Inputs Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Income Statement Controls */}
        <div className="bg-[#101a30] p-4 rounded-2xl border border-white/10 space-y-4">
          <h4 className="text-xs font-black text-cyan-300 border-b border-white/10 pb-2">
            📊 قائمة الدخل (Income Statement)
          </h4>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 font-bold mb-1">
                <span>إجمالي الإيرادات / المبيعات:</span>
                <span className="text-cyan-400 font-black">{revenue.toLocaleString()} ج.م</span>
              </div>
              <input
                type="range"
                min={100000}
                max={2000000}
                step={25000}
                value={revenue}
                onChange={(e) => setRevenue(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-bold mb-1">
                <span>تكلفة المبيعات (COGS):</span>
                <span className="text-amber-400 font-black">{cogs.toLocaleString()} ج.م</span>
              </div>
              <input
                type="range"
                min={50000}
                max={revenue}
                step={10000}
                value={cogs}
                onChange={(e) => setCogs(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-bold mb-1">
                <span>المصروفات التشغيلية:</span>
                <span className="text-purple-400 font-black">{operatingExp.toLocaleString()} ج.م</span>
              </div>
              <input
                type="range"
                min={10000}
                max={300000}
                step={5000}
                value={operatingExp}
                onChange={(e) => setOperatingExp(Number(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Balance Sheet Controls Assets */}
        <div className="bg-[#101a30] p-4 rounded-2xl border border-white/10 space-y-4">
          <h4 className="text-xs font-black text-emerald-300 border-b border-white/10 pb-2">
            🏛️ الأصول (Assets)
          </h4>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 font-bold mb-1">
                <span>الأصول المتداولة (Current Assets):</span>
                <span className="text-emerald-400 font-black">{currentAssets.toLocaleString()} ج.م</span>
              </div>
              <input
                type="range"
                min={50000}
                max={1000000}
                step={10000}
                value={currentAssets}
                onChange={(e) => setCurrentAssets(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-bold mb-1">
                <span>إجمالي الأصول (Total Assets):</span>
                <span className="text-emerald-300 font-black">{totalAssets.toLocaleString()} ج.م</span>
              </div>
              <input
                type="range"
                min={currentAssets}
                max={3000000}
                step={50000}
                value={totalAssets}
                onChange={(e) => setTotalAssets(Number(e.target.value))}
                className="w-full accent-emerald-300 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Liabilities & Equity */}
        <div className="bg-[#101a30] p-4 rounded-2xl border border-white/10 space-y-4">
          <h4 className="text-xs font-black text-red-300 border-b border-white/10 pb-2">
            ⚖️ الخصوم وحقوق الملكية (Liabilities & Equity)
          </h4>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 font-bold mb-1">
                <span>الخصوم المتداولة (Current Liab.):</span>
                <span className="text-red-400 font-black">{currentLiabilities.toLocaleString()} ج.م</span>
              </div>
              <input
                type="range"
                min={20000}
                max={500000}
                step={10000}
                value={currentLiabilities}
                onChange={(e) => setCurrentLiabilities(Number(e.target.value))}
                className="w-full accent-red-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-bold mb-1">
                <span>حقوق الملكية (Equity):</span>
                <span className="text-indigo-400 font-black">{equity.toLocaleString()} ج.م</span>
              </div>
              <input
                type="range"
                min={50000}
                max={2000000}
                step={25000}
                value={equity}
                onChange={(e) => setEquity(Number(e.target.value))}
                className="w-full accent-indigo-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-bold mb-1">
                <span>إجمالي الديون (Total Debt):</span>
                <span className="text-red-300 font-black">{totalDebt.toLocaleString()} ج.م</span>
              </div>
              <input
                type="range"
                min={10000}
                max={1500000}
                step={20000}
                value={totalDebt}
                onChange={(e) => setTotalDebt(Number(e.target.value))}
                className="w-full accent-red-300 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Key Ratios Output Scorecards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Current Ratio */}
        <div className="bg-[#080c1c] border border-white/10 rounded-2xl p-4 text-center space-y-1">
          <div className="text-[11px] font-bold text-slate-400">نسبة التداول (Current Ratio)</div>
          <div className="text-2xl font-black text-cyan-400">{currentRatio.toFixed(2)}x</div>
          <div className="text-[10px] text-slate-400 font-medium">النسبة المثالية ≥ 1.5x</div>
        </div>

        {/* Gross Margin */}
        <div className="bg-[#080c1c] border border-white/10 rounded-2xl p-4 text-center space-y-1">
          <div className="text-[11px] font-bold text-slate-400">هامش مجمل الربح</div>
          <div className="text-2xl font-black text-emerald-400">{grossMargin.toFixed(1)}%</div>
          <div className="text-[10px] text-slate-400 font-medium">مجمل الربح: {grossProfit.toLocaleString()} ج.م</div>
        </div>

        {/* Net Margin */}
        <div className="bg-[#080c1c] border border-white/10 rounded-2xl p-4 text-center space-y-1">
          <div className="text-[11px] font-bold text-slate-400">هامش صافي الربح</div>
          <div className={`text-2xl font-black ${netMargin >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {netMargin.toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-400 font-medium">صافي الربح: {netIncome.toLocaleString()} ج.م</div>
        </div>

        {/* ROE */}
        <div className="bg-[#080c1c] border border-white/10 rounded-2xl p-4 text-center space-y-1">
          <div className="text-[11px] font-bold text-slate-400">العائد على الملكية ROE</div>
          <div className="text-2xl font-black text-purple-400">{roe.toFixed(1)}%</div>
          <div className="text-[10px] text-slate-400 font-medium">العائد على الأصول ROA: {roa.toFixed(1)}%</div>
        </div>
      </div>

      {/* CFO Executive Recommendations */}
      <div className="bg-[#080c1c] p-4 sm:p-5 rounded-2xl border border-white/10 space-y-3">
        <div className="text-xs font-black text-cyan-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>توصيات التشخيص المالي التفاعلي (CFO Recommendations)</span>
        </div>

        <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside font-medium leading-relaxed">
          {currentRatio < 1.2 && (
            <li className="text-amber-300">
              ⚠️ <b>تنبيه سيولة:</b> نسبة التداول ({currentRatio.toFixed(2)}x) منخفضة نسبيًا، يوصى بتحسين إدارة النقدية أو تحصيل ذمم العملاء أسرع.
            </li>
          )}
          {debtToEquity > 1.5 && (
            <li className="text-red-300">
              ⚠️ <b>تنبيه رافعة مالية:</b> نسبة الدين إلى الملكية ({debtToEquity.toFixed(2)}) مرتفعة، مما يعرض الشركة لمخاطر فوائد الديون.
            </li>
          )}
          {netMargin > 15 && (
            <li className="text-emerald-300">
              ✓ <b>ربحية ممتازة:</b> هامش صافي الربح ({netMargin.toFixed(1)}%) يعكس كفاءة تشغيلية عالية وسيطرة جيدة على التكاليف.
            </li>
          )}
          <li>
            معدل العائد على حقوق الملكية ROE يبلغ <b>{roe.toFixed(1)}%</b>، وهو يعكس عائد المستثمر مقابل كل جنيه مستثمر برأس المال.
          </li>
        </ul>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. ASSET DEPRECIATION LAB
// ─────────────────────────────────────────────────────────────
function DepreciationLab() {
  const [assetName, setAssetName] = useState<string>("آلة تصنيع وتعبئة");
  const [cost, setCost] = useState<number>(100000);
  const [salvage, setSalvage] = useState<number>(10000);
  const [usefulLife, setUsefulLife] = useState<number>(5);

  const depreciableCost = Math.max(0, cost - salvage);

  // 1. Straight Line Method
  const annualStraightLine = usefulLife > 0 ? depreciableCost / usefulLife : 0;

  // 2. Double Declining Balance (DDB)
  const ddbRate = usefulLife > 0 ? (2 / usefulLife) : 0;
  let ddbSchedule: { year: number; dep: number; bookVal: number }[] = [];
  let currentBookVal = cost;

  for (let y = 1; y <= usefulLife; y++) {
    let dep = currentBookVal * ddbRate;
    if (currentBookVal - dep < salvage) {
      dep = Math.max(0, currentBookVal - salvage);
    }
    currentBookVal -= dep;
    ddbSchedule.push({ year: y, dep: Math.round(dep), bookVal: Math.round(currentBookVal) });
  }

  return (
    <div className="bg-[#0d1424] border border-purple-500/30 rounded-3xl p-6 shadow-2xl space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <span>محاكي إهلاك الأصول الثابتة (Depreciation Methods Lab)</span>
        </h3>
        <p className="text-xs text-slate-400">
          مقارنة فورية بين طرق الإهلاك المحاسبية الدولية: القسط الثابت وقسط مضاعف النسبة المتناقصة.
        </p>
      </div>

      {/* Asset Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-[#101a30] p-4 rounded-2xl border border-white/10">
        <div>
          <label className="text-[11px] font-bold text-slate-300 block mb-1">اسم الأصل:</label>
          <input
            type="text"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
            className="w-full bg-[#080c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-300 block mb-1">تكلفة الشراء (Cost):</label>
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
            className="w-full bg-[#080c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-300 block mb-1">قيمة الخردة/النفاية (Salvage):</label>
          <input
            type="number"
            value={salvage}
            onChange={(e) => setSalvage(Number(e.target.value))}
            className="w-full bg-[#080c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-300 block mb-1">العمر الإنتاجي (سنوات):</label>
          <input
            type="number"
            min={1}
            max={30}
            value={usefulLife}
            onChange={(e) => setUsefulLife(Number(e.target.value))}
            className="w-full bg-[#080c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold"
          />
        </div>
      </div>

      {/* Straight Line Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#080c1c] p-5 rounded-2xl border border-purple-500/30 space-y-3">
          <div className="flex items-center justify-between text-xs font-black text-purple-300 border-b border-white/10 pb-2">
            <span>طريقة القسط الثابت (Straight-Line Method)</span>
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">أبسط الأساليب</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-300 font-bold">
              <span>القابل للإهلاك (Depreciable Base):</span>
              <span className="text-white font-black">{depreciableCost.toLocaleString()} ج.م</span>
            </div>
            <div className="flex justify-between text-slate-300 font-bold">
              <span>الإهلاك السنوي الثابت:</span>
              <span className="text-purple-400 font-black text-base">{annualStraightLine.toLocaleString()} ج.م/سنة</span>
            </div>
          </div>

          {/* Generated Journal Entry */}
          <div className="pt-2 border-t border-white/10 text-[11px] space-y-1 bg-black/30 p-3 rounded-xl">
            <div className="font-bold text-cyan-300 mb-1">📜 قيد التسوية السنوي للإهلاك:</div>
            <div className="text-red-300">من حـ/ مصروف إهلاك {assetName} : {annualStraightLine.toLocaleString()} ج.م</div>
            <div className="text-emerald-300 pr-4">إلى حـ/ مجمع إهلاك {assetName} : {annualStraightLine.toLocaleString()} ج.م</div>
          </div>
        </div>

        {/* Double Declining Balance Schedule Table */}
        <div className="bg-[#080c1c] p-5 rounded-2xl border border-purple-500/30 space-y-3">
          <div className="flex items-center justify-between text-xs font-black text-purple-300 border-b border-white/10 pb-2">
            <span>جدول القسط المتناقص المضاعف (Double Declining)</span>
            <span className="text-amber-400 font-bold">معدل الإهلاك: {(ddbRate * 100).toFixed(0)}%</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-white/10 font-bold">
                  <th className="pb-1.5">السنة</th>
                  <th className="pb-1.5">قسط الإهلاك</th>
                  <th className="pb-1.5">القيمة الدفترية المتبقية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-bold">
                {ddbSchedule.map((s) => (
                  <tr key={s.year} className="text-slate-200">
                    <td className="py-1.5">السنة {s.year}</td>
                    <td className="py-1.5 text-purple-400">{s.dep.toLocaleString()} ج.م</td>
                    <td className="py-1.5 text-slate-400">{s.bookVal.toLocaleString()} ج.م</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. BREAK-EVEN & CVP LAB
// ─────────────────────────────────────────────────────────────
function BreakEvenLab() {
  const [fixedCosts, setFixedCosts] = useState<number>(120000);
  const [unitPrice, setUnitPrice] = useState<number>(500);
  const [unitVarCost, setUnitVarCost] = useState<number>(300);
  const [plannedUnits, setPlannedUnits] = useState<number>(800);

  const contribMargin = unitPrice - unitVarCost;
  const contribRatio = unitPrice > 0 ? (contribMargin / unitPrice) * 100 : 0;

  const breakEvenUnits = contribMargin > 0 ? Math.ceil(fixedCosts / contribMargin) : 0;
  const breakEvenSales = breakEvenUnits * unitPrice;

  const plannedRevenue = plannedUnits * unitPrice;
  const plannedTotalVarCost = plannedUnits * unitVarCost;
  const plannedNetProfit = plannedRevenue - (plannedTotalVarCost + fixedCosts);

  const marginOfSafetyUnits = Math.max(0, plannedUnits - breakEvenUnits);
  const marginOfSafetyRatio = plannedUnits > 0 ? (marginOfSafetyUnits / plannedUnits) * 100 : 0;

  return (
    <div className="bg-[#0d1424] border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <PieChart className="w-5 h-5 text-amber-400" />
          <span>محاكي تحليل التعادل والربحية (Break-Even & CVP Analysis)</span>
        </h3>
        <p className="text-xs text-slate-400">
          احسب دالة التكاليف، نقطة التعادل، وهامش الأمان مع تقديرات الأرباح التشغيلية عند حجوم المبيعات المختلفة.
        </p>
      </div>

      {/* CVP Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-[#101a30] p-4 rounded-2xl border border-white/10">
        <div>
          <label className="text-[11px] font-bold text-slate-300 block mb-1">إجمالي التكاليف الثابتة:</label>
          <input
            type="number"
            step={5000}
            value={fixedCosts}
            onChange={(e) => setFixedCosts(Number(e.target.value))}
            className="w-full bg-[#080c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-300 block mb-1">سعر بيع الوحدة:</label>
          <input
            type="number"
            step={10}
            value={unitPrice}
            onChange={(e) => setUnitPrice(Number(e.target.value))}
            className="w-full bg-[#080c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-300 block mb-1">التكلفة المتغيرة للوحدة:</label>
          <input
            type="number"
            step={10}
            value={unitVarCost}
            onChange={(e) => setUnitVarCost(Number(e.target.value))}
            className="w-full bg-[#080c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-300 block mb-1">المبيعات المستهدفة (وحدات):</label>
          <input
            type="number"
            step={50}
            value={plannedUnits}
            onChange={(e) => setPlannedUnits(Number(e.target.value))}
            className="w-full bg-[#080c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold"
          />
        </div>
      </div>

      {/* CVP Output Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#080c1c] border border-amber-500/30 rounded-2xl p-4 text-center space-y-1">
          <div className="text-[11px] font-bold text-slate-400">نقطة التعادل (وحدات)</div>
          <div className="text-2xl font-black text-amber-400">{breakEvenUnits.toLocaleString()} وحدة</div>
          <div className="text-[10px] text-slate-400 font-medium">قيمة التعادل: {breakEvenSales.toLocaleString()} ج.م</div>
        </div>

        <div className="bg-[#080c1c] border border-white/10 rounded-2xl p-4 text-center space-y-1">
          <div className="text-[11px] font-bold text-slate-400">هامش المساهمة للوحدة</div>
          <div className="text-2xl font-black text-emerald-400">{contribMargin.toLocaleString()} ج.م</div>
          <div className="text-[10px] text-slate-400 font-medium">نسبة المساهمة: {contribRatio.toFixed(1)}%</div>
        </div>

        <div className="bg-[#080c1c] border border-white/10 rounded-2xl p-4 text-center space-y-1">
          <div className="text-[11px] font-bold text-slate-400">هامش الأمان (Margin of Safety)</div>
          <div className="text-2xl font-black text-cyan-400">{marginOfSafetyRatio.toFixed(1)}%</div>
          <div className="text-[10px] text-slate-400 font-medium">{marginOfSafetyUnits.toLocaleString()} وحدة فوق التعادل</div>
        </div>

        <div className="bg-[#080c1c] border border-white/10 rounded-2xl p-4 text-center space-y-1">
          <div className="text-[11px] font-bold text-slate-400">صافي الربح المتوقع</div>
          <div className={`text-2xl font-black ${plannedNetProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {plannedNetProfit.toLocaleString()} ج.م
          </div>
          <div className="text-[10px] text-slate-400 font-medium">عند بيع {plannedUnits} وحدة</div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. BANK RECONCILIATION LAB
// ─────────────────────────────────────────────────────────────
function BankReconciliationLab() {
  const bankStatementBalance = 45000;
  const cashBookBalance = 48200;

  // Items to check / reconcile
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    item1: false,
    item2: false,
    item3: false,
    item4: false,
    item5: false
  });

  const toggleItem = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Adjustments calculations based on selections
  let adjustedBank = bankStatementBalance;
  let adjustedCash = cashBookBalance;

  if (checkedItems.item1) adjustedBank -= 6000; // Outstanding checks
  if (checkedItems.item2) adjustedBank += 8000; // Deposits in transit
  if (checkedItems.item3) adjustedCash -= 300;  // Bank service charges
  if (checkedItems.item4) adjustedCash += 1500; // Interest credited by bank
  if (checkedItems.item5) adjustedCash += 3000; // Note collected by bank

  const isMatched = adjustedBank === adjustedCash;

  return (
    <div className="bg-[#0d1424] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
            <span>محاكي التسوية البنكية ومطابقة الحسابات (Bank Reconciliation Simulator)</span>
          </h3>
          <p className="text-xs text-slate-400">
            حدد التسويات والفروقات بين كشف البنك ودفتر النقدية للوصول إلى الرصيد المعدل المتطابق.
          </p>
        </div>

        <div className={`px-4 py-2 rounded-xl text-xs font-black border ${
          isMatched
            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
            : "bg-amber-500/20 text-amber-300 border-amber-500/30"
        }`}>
          {isMatched ? "🎉 الحسابات متطابقة تماماً!" : "⚠️ لم تتطابق التسوية بعد"}
        </div>
      </div>

      {/* Starting Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#101a30] p-4 rounded-2xl border border-white/10 text-center">
          <div className="text-xs text-slate-400 font-bold mb-1">رصيد كشف البنك الخارجي:</div>
          <div className="text-xl font-black text-cyan-400">{bankStatementBalance.toLocaleString()} ج.م</div>
        </div>

        <div className="bg-[#101a30] p-4 rounded-2xl border border-white/10 text-center">
          <div className="text-xs text-slate-400 font-bold mb-1">رصيد دفتر النقدية بالشركة:</div>
          <div className="text-xl font-black text-indigo-400">{cashBookBalance.toLocaleString()} ج.م</div>
        </div>
      </div>

      {/* Reconciliation Checklist */}
      <div className="bg-[#080c1c] p-5 rounded-2xl border border-white/10 space-y-3">
        <h4 className="text-xs font-black text-cyan-300 border-b border-white/10 pb-2">
          📋 عناصر التسوية المعلقة والفروقات الختامية (اختر لتطبيق التسوية):
        </h4>

        <div className="space-y-2.5 text-xs font-bold text-slate-200">
          <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={checkedItems.item1}
              onChange={() => toggleItem("item1")}
              className="w-4 h-4 accent-cyan-400"
            />
            <span className="flex-1">شيكات حررتها الشركة للموردين ولم تقدم للصرف بالبنك بعد (شيكات بالطريق)</span>
            <span className="text-red-400 font-black">- 6,000 ج.م (تخصم من البنك)</span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={checkedItems.item2}
              onChange={() => toggleItem("item2")}
              className="w-4 h-4 accent-cyan-400"
            />
            <span className="flex-1">إيداعات نقدية بالطريق أرسلت للبنك ولم تدرج في كشف الحساب بعد</span>
            <span className="text-emerald-400 font-black">+ 8,000 ج.م (تضاف للبنك)</span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={checkedItems.item3}
              onChange={() => toggleItem("item3")}
              className="w-4 h-4 accent-cyan-400"
            />
            <span className="flex-1">مصاريف وعمولات بنكية خصمها البنك ولم تسجل في دفاتر الشركة</span>
            <span className="text-red-400 font-black">- 300 ج.م (تخصم من الدفاتر)</span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={checkedItems.item4}
              onChange={() => toggleItem("item4")}
              className="w-4 h-4 accent-cyan-400"
            />
            <span className="flex-1">فوائد دائنة أضافها البنك لحساب الشركة ولم تسجل بالدفاتر بعد</span>
            <span className="text-emerald-400 font-black">+ 1,500 ج.م (تضاف للدفاتر)</span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={checkedItems.item5}
              onChange={() => toggleItem("item5")}
              className="w-4 h-4 accent-cyan-400"
            />
            <span className="flex-1">تحصيل كمبيالة لصالح الشركة بواسطة البنك مباشرة</span>
            <span className="text-emerald-400 font-black">+ 3,000 ج.م (تضاف للدفاتر)</span>
          </label>
        </div>
      </div>

      {/* Adjusted Balances Result */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`p-4 rounded-2xl border text-center font-bold ${
          isMatched ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300" : "bg-black/30 border-white/10 text-slate-300"
        }`}>
          <div className="text-xs text-slate-400 mb-1">الرصيد المعدل لكشف البنك:</div>
          <div className="text-2xl font-black">{adjustedBank.toLocaleString()} ج.م</div>
        </div>

        <div className={`p-4 rounded-2xl border text-center font-bold ${
          isMatched ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300" : "bg-black/30 border-white/10 text-slate-300"
        }`}>
          <div className="text-xs text-slate-400 mb-1">الرصيد المعدل لدفتر الشركة:</div>
          <div className="text-2xl font-black">{adjustedCash.toLocaleString()} ج.م</div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 6. ERP JOURNAL ENTRY LAB (Odoo & Microsoft Dynamics Style)
// ─────────────────────────────────────────────────────────────

interface ERPJournalLine {
  id: string;
  accountCode: string;
  accountName: string;
  costCenter: string;
  label: string;
  debit: number | "";
  credit: number | "";
}

interface PostedERPVoucher {
  id: string;
  voucherNo: string;
  journalType: string;
  date: string;
  partner: string;
  memo: string;
  postedAt: string;
  lines: ERPJournalLine[];
  totalDebit: number;
}

const ERP_CHART_OF_ACCOUNTS = [
  { code: "110100", name: "النقدية بالصندوق الرئيسي", type: "أصول متداولة" },
  { code: "110200", name: "البنك الأهلي - الحساب الجاري", type: "أصول متداولة" },
  { code: "110300", name: "المدينون - حـ/ العملاء التجاريين", type: "أصول متداولة" },
  { code: "110400", name: "أوراق القبض (كمبيالات مقبوضة)", type: "أصول متداولة" },
  { code: "110500", name: "مخزون البضائع والمنتجات", type: "أصول متداولة" },
  { code: "120100", name: "ضريبة القيمة المضافة المدخلات (VAT 14% قابلة للخصم)", type: "أصول متداولة" },
  { code: "130100", name: "الأصول الثابتة - الآلات والمعدات", type: "أصول غير متداولة" },
  { code: "130200", name: "مجمع إهلاك الآلات والمعدات", type: "أصول مقابل" },
  { code: "210100", name: "الموردون - حـ/ الموردين والتجار", type: "خصوم متداولة" },
  { code: "210200", name: "ضريبة القيمة المضافة المخرجات (VAT 14% مستحقة للهيئة)", type: "خصوم متداولة" },
  { code: "210300", name: "الرواتب والأجور المستحقة", type: "خصوم متداولة" },
  { code: "210400", name: "مستحقات هيئة التأمينات الاجتماعية", type: "خصوم متداولة" },
  { code: "220100", name: "القروض البنكية طويلة الأجل", type: "خصوم طويلة الأجل" },
  { code: "310100", name: "رأس المال المدفوع", type: "حقوق الملكية" },
  { code: "310200", name: "الأرباح المبقاة والمرحلة", type: "حقوق الملكية" },
  { code: "410100", name: "إيرادات المبيعات التجارية", type: "إيرادات" },
  { code: "410200", name: "إيرادات تقديم خدمات واستشارات", type: "إيرادات" },
  { code: "410300", name: "خصم مكتسب (تعجيل دفع)", type: "إيرادات أخرى" },
  { code: "510100", name: "تكلفة البضاعة المباعة (COGS)", type: "مصروفات" },
  { code: "520100", name: "المشتريات السلعية", type: "مصروفات" },
  { code: "520200", name: "مصروف الرواتب والأجور الأساسية", type: "مصروفات" },
  { code: "520300", name: "مصروف إيجار المقار والفروع", type: "مصروفات" },
  { code: "520400", name: "مصروف الإهلاك السنوي", type: "مصروفات" },
  { code: "520500", name: "خصم مسموح به للعملاء", type: "مصروفات" }
];

const COST_CENTERS = [
  "بدون مركز تكلفة",
  "CC-101 (الفرع الرئيسي - القاهرة)",
  "CC-102 (فرع الإسكندرية)",
  "CC-201 (الإدارة العامة والتنفيذية)",
  "CC-301 (قطاع المبيعات والتسويق)",
  "CC-401 (المصنع ووحدة الإنتاج)"
];

function ERPJournalLab({ presetTarget, onOpenGuide }: { presetTarget?: { debitAcc: string; creditAcc: string; amount: number; memo: string } | null; onOpenGuide?: () => void }) {
  const [erpStyle, setErpStyle] = useState<"odoo" | "dynamics">("odoo");
  const [journalType, setJournalType] = useState<string>("MISC");
  const [voucherNo, setVoucherNo] = useState<string>("MISC/2026/0014");
  const [entryDate, setEntryDate] = useState<string>("2026-07-25");
  const [partner, setPartner] = useState<string>("طرف المعاملة التعليمية");
  const [refMemo, setRefMemo] = useState<string>("إثبات قيد تعليمي تطبيقي");
  const [status, setStatus] = useState<"draft" | "posted" | "cancelled">("draft");
  
  const [lines, setLines] = useState<ERPJournalLine[]>([
    {
      id: "line_1",
      accountCode: "110300",
      accountName: "المدينون - حـ/ العملاء التجاريين",
      costCenter: "CC-301 (قطاع المبيعات والتسويق)",
      label: "استحقاق فاتورة العميل",
      debit: 22800,
      credit: ""
    },
    {
      id: "line_2",
      accountCode: "410100",
      accountName: "إيرادات المبيعات التجارية",
      costCenter: "CC-301 (قطاع المبيعات والتسويق)",
      label: "قيمة المبيعات السلعية الصافية",
      debit: "",
      credit: 20000
    },
    {
      id: "line_3",
      accountCode: "210200",
      accountName: "ضريبة القيمة المضافة المخرجات (VAT 14% مستحقة للهيئة)",
      costCenter: "بدون مركز تكلفة",
      label: "إثبات ضريبة القيمة المضافة 14%",
      debit: "",
      credit: 2800
    }
  ]);

  React.useEffect(() => {
    if (presetTarget) {
      setRefMemo(presetTarget.memo);
      setLines([
        {
          id: "p_debit_1",
          accountCode: "110200",
          accountName: presetTarget.debitAcc,
          costCenter: "بدون مركز تكلفة",
          label: `[طرف مدين] - ${presetTarget.memo}`,
          debit: presetTarget.amount,
          credit: ""
        },
        {
          id: "p_credit_1",
          accountCode: "410100",
          accountName: presetTarget.creditAcc,
          costCenter: "بدون مركز تكلفة",
          label: `[طرف دائن] - ${presetTarget.memo}`,
          debit: "",
          credit: presetTarget.amount
        }
      ]);
      setStatus("draft");
    }
  }, [presetTarget]);

  const [postedVouchers, setPostedVouchers] = useState<PostedERPVoucher[]>([
    {
      id: "v_1",
      voucherNo: "BNK/2026/0002",
      journalType: "BNK",
      date: "2026-07-20",
      partner: "شركة الأمل للمقاولات",
      memo: "تحصيل مستحقات بشيك وتحمل خصم تعجيل دفع",
      postedAt: "2026-07-20 14:30",
      lines: [
        { id: "p1", accountCode: "110200", accountName: "البنك الأهلي - الحساب الجاري", costCenter: "بدون مركز تكلفة", label: "شيك محصل بالبنك", debit: 14250, credit: "" },
        { id: "p2", accountCode: "520500", accountName: "خصم مسموح به للعملاء", costCenter: "CC-301 (قطاع المبيعات والتسويق)", label: "خصم تعجيل دفع 5%", debit: 750, credit: "" },
        { id: "p3", accountCode: "110300", accountName: "المدينون - حـ/ العملاء التجاريين", costCenter: "CC-301 (قطاع المبيعات والتسويق)", label: "إغلاق حساب العميل بالكامل", debit: "", credit: 15000 }
      ],
      totalDebit: 15000
    }
  ]);

  const [selectedVoucherForPrint, setSelectedVoucherForPrint] = useState<PostedERPVoucher | null>(null);
  const [notification, setNotification] = useState<{ msg: string; type: "success" | "warning" | "info" } | null>(null);

  // Totals
  const totalDebit = lines.reduce((sum, line) => sum + (typeof line.debit === "number" ? line.debit : 0), 0);
  const totalCredit = lines.reduce((sum, line) => sum + (typeof line.credit === "number" ? line.credit : 0), 0);
  const difference = totalDebit - totalCredit;
  const isBalanced = Math.abs(difference) < 0.001 && totalDebit > 0;

  // Actions
  const handleAccountChange = (id: string, code: string) => {
    const accObj = ERP_CHART_OF_ACCOUNTS.find(a => a.code === code);
    if (!accObj) return;
    setLines(lines.map(l => l.id === id ? { ...l, accountCode: accObj.code, accountName: accObj.name } : l));
  };

  const handleLineChange = (id: string, field: keyof ERPJournalLine, val: any) => {
    setLines(lines.map(l => l.id === id ? { ...l, [field]: val } : l));
  };

  const addLine = () => {
    const newId = `line_${Date.now()}`;
    setLines([...lines, {
      id: newId,
      accountCode: "110100",
      accountName: "النقدية بالصندوق الرئيسي",
      costCenter: "بدون مركز تكلفة",
      label: "سطر قيد جديد",
      debit: "",
      credit: ""
    }]);
  };

  const removeLine = (id: string) => {
    if (lines.length <= 2) {
      showNotice("يجب أن يحتوي القيد على سطرين محاسبيين على الأقل", "warning");
      return;
    }
    setLines(lines.filter(l => l.id !== id));
  };

  // Auto Balance Odoo Feature
  const autoBalanceEntry = () => {
    if (difference === 0) {
      showNotice("القيد متوازن بالفعل! لا يوجد فارق لموازنته", "info");
      return;
    }
    const diffAbs = Math.abs(difference);
    const newId = `line_bal_${Date.now()}`;
    if (difference > 0) {
      // Debit is higher -> add credit line
      setLines([...lines, {
        id: newId,
        accountCode: "210100",
        accountName: "الموردون - حـ/ الموردين والتجار",
        costCenter: "بدون مركز تكلفة",
        label: "سطر موازنة القيد التلقائي (Odoo Auto-Balance)",
        debit: "",
        credit: diffAbs
      }]);
      showNotice(`تمت إضافة سطر دائن بمبلغ ${diffAbs.toLocaleString()} ج.م لموازنة القيد بنجاح!`, "success");
    } else {
      // Credit is higher -> add debit line
      setLines([...lines, {
        id: newId,
        accountCode: "110100",
        accountName: "النقدية بالصندوق الرئيسي",
        costCenter: "بدون مركز تكلفة",
        label: "سطر موازنة القيد التلقائي (Odoo Auto-Balance)",
        debit: diffAbs,
        credit: ""
      }]);
      showNotice(`تمت إضافة سطر مدين بمبلغ ${diffAbs.toLocaleString()} ج.م لموازنة القيد بنجاح!`, "success");
    }
  };

  // Auto Add VAT 14% Line
  const addVAT14Line = () => {
    const netBase = totalDebit > 0 ? totalDebit : totalCredit;
    if (netBase <= 0) {
      showNotice("يرجى إدخال مبلغ مالي أولاً قبل تطبيق ضريبة القيمة المضافة", "warning");
      return;
    }
    const vatAmount = Math.round(netBase * 0.14);
    const newId = `line_vat_${Date.now()}`;
    
    // Check if sales or purchases
    if (journalType === "INV") {
      setLines([...lines, {
        id: newId,
        accountCode: "210200",
        accountName: "ضريبة القيمة المضافة المخرجات (VAT 14% مستحقة للهيئة)",
        costCenter: "بدون مركز تكلفة",
        label: "إثبات ضريبة قيمة مضافة 14% أوتوماتيكياً",
        debit: "",
        credit: vatAmount
      }]);
    } else {
      setLines([...lines, {
        id: newId,
        accountCode: "120100",
        accountName: "ضريبة القيمة المضافة المدخلات (VAT 14% قابلة للخصم)",
        costCenter: "بدون مركز تكلفة",
        label: "إثبات ضريبة قيمة مضافة 14% أوتوماتيكياً",
        debit: vatAmount,
        credit: ""
      }]);
    }
    showNotice(`تمت إضافة سطر ضريبة القيمة المضافة (14%) بمبلغ ${vatAmount.toLocaleString()} ج.م`, "success");
  };

  // Load Preset ERP Templates
  const loadPreset = (preset: "sales" | "bill" | "payroll" | "receipt") => {
    setStatus("draft");
    if (preset === "sales") {
      setJournalType("INV");
      setVoucherNo(`INV/2026/00${Math.floor(Math.random() * 80 + 10)}`);
      setPartner("شركة الأمل للتجارة والتوزيع");
      setRefMemo("فاتورة مبيعات آجل شاملة ضريبة VAT 14%");
      setLines([
        { id: "s1", accountCode: "110300", accountName: "المدينون - حـ/ العملاء التجاريين", costCenter: "CC-301 (قطاع المبيعات والتسويق)", label: "استحقاق فاتورة العميل آجل", debit: 34200, credit: "" },
        { id: "s2", accountCode: "410100", accountName: "إيرادات المبيعات التجارية", costCenter: "CC-301 (قطاع المبيعات والتسويق)", label: "إيراد مبيعات بضاعة", debit: "", credit: 30000 },
        { id: "s3", accountCode: "210200", accountName: "ضريبة القيمة المضافة المخرجات (VAT 14% مستحقة للهيئة)", costCenter: "بدون مركز تكلفة", label: "ضريبة مخرجات VAT 14%", debit: "", credit: 4200 }
      ]);
      showNotice("تم تحميل نموذج فاتورة مبيعات ERP بنجاح", "info");
    } else if (preset === "bill") {
      setJournalType("BILL");
      setVoucherNo(`BILL/2026/00${Math.floor(Math.random() * 80 + 10)}`);
      setPartner("شركة الشروق للمعدات والآلات");
      setRefMemo("شراء آلات ومعدات للمصنع بالآجل مع خصم تعجيل دفع");
      setLines([
        { id: "b1", accountCode: "130100", accountName: "الأصول الثابتة - الآلات والمعدات", costCenter: "CC-401 (المصنع ووحدة الإنتاج)", label: "إثبات خط إنتاج جديد", debit: 100000, credit: "" },
        { id: "b2", accountCode: "120100", accountName: "ضريبة القيمة المضافة المدخلات (VAT 14% قابلة للخصم)", costCenter: "بدون مركز تكلفة", label: "ضريبة مدخلات قابلة للخصم 14%", debit: 14000, credit: "" },
        { id: "b3", accountCode: "210100", accountName: "الموردون - حـ/ الموردين والتجار", costCenter: "بدون مركز تكلفة", label: "استحقاق المورد بالصافي", debit: "", credit: 110000 },
        { id: "b4", accountCode: "410300", accountName: "خصم مكتسب (تعجيل دفع)", costCenter: "CC-201 (الإدارة العامة والتنفيذية)", label: "خصم تجاري ومكتسب", debit: "", credit: 4000 }
      ]);
      showNotice("تم تحميل نموذج فاتورة شراء أصول ERP بنجاح", "info");
    } else if (preset === "payroll") {
      setJournalType("MISC");
      setVoucherNo(`MISC/2026/00${Math.floor(Math.random() * 80 + 10)}`);
      setPartner("إدارة الموارد البشرية (Payroll Dept)");
      setRefMemo("قيد استحقاق رواتب الموظفين واستقطاعات التأمينات الاجتماعية");
      setLines([
        { id: "p1", accountCode: "520200", accountName: "مصروف الرواتب والأجور الأساسية", costCenter: "CC-201 (الإدارة العامة والتنفيذية)", label: "إجمالي أجور الشهر الإدارية", debit: 50000, credit: "" },
        { id: "p2", accountCode: "210300", accountName: "الرواتب والأجور المستحقة", costCenter: "بدون مركز تكلفة", label: "صافي الرواتب المستحقة للصرف", debit: "", credit: 44000 },
        { id: "p3", accountCode: "210400", accountName: "مستحقات هيئة التأمينات الاجتماعية", costCenter: "بدون مركز تكلفة", label: "استقطاع حصة التأمينات 12%", debit: "", credit: 6000 }
      ]);
      showNotice("تم تحميل قيد استحقاق الرواتب والأجور ERP بنجاح", "info");
    } else if (preset === "receipt") {
      setJournalType("BNK");
      setVoucherNo(`BNK/2026/00${Math.floor(Math.random() * 80 + 10)}`);
      setPartner("العميل / المؤسسة العربية للتجارة");
      setRefMemo("تحصيل مستحقات بشيك وممنوح خصم تعجيل دفع 5%");
      setLines([
        { id: "r1", accountCode: "110200", accountName: "البنك الأهلي - الحساب الجاري", costCenter: "بدون مركز تكلفة", label: "قيمة الشيك المودع بالبنك", debit: 19000, credit: "" },
        { id: "r2", accountCode: "520500", accountName: "خصم مسموح به للعملاء", costCenter: "CC-301 (قطاع المبيعات والتسويق)", label: "خصم تعجيل دفع 5%", debit: 1000, credit: "" },
        { id: "r3", accountCode: "110300", accountName: "المدينون - حـ/ العملاء التجاريين", costCenter: "CC-301 (قطاع المبيعات والتسويق)", label: "إغلاق ذمة العميل بالكامل", debit: "", credit: 20000 }
      ]);
      showNotice("تم تحميل قيد التحصيل البنكي ERP بنجاح", "info");
    }
  };

  // Post / Validate Journal Entry
  const handlePostEntry = () => {
    if (!isBalanced) {
      showNotice("لا يمكن اعتماد القيد! مجموع المدين يجب أن يساوي مجموع الدائن تماماً", "warning");
      return;
    }

    const newVoucher: PostedERPVoucher = {
      id: `v_${Date.now()}`,
      voucherNo,
      journalType,
      date: entryDate,
      partner,
      memo: refMemo,
      postedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      lines: [...lines],
      totalDebit
    };

    setStatus("posted");
    setPostedVouchers([newVoucher, ...postedVouchers]);
    showNotice(`🎉 تم اعتماد وترحيل القيد المحاسبي برقم ${voucherNo} إلى دفتر الأستاذ العام بنجاح!`, "success");
  };

  const handleCancelEntry = () => {
    setStatus("cancelled");
    showNotice("تم إلغاء القيد المحاسبي وإعادته لحالة الإلغاء", "warning");
  };

  const showNotice = (msg: string, type: "success" | "warning" | "info") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="bg-[#0b1222] border border-purple-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6 animate-fadeIn">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-black flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-purple-400" />
              <span>نظام ERP المحاسبي الكامل</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
              Odoo v17 & Dynamics 365 Architecture
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>تسجيل قيود اليومية بالنظام المحاسبي الذكي</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            محاكاة حقيقية لبيئة برامج المحاسبة الاحترافية: مراكز التكلفة، ترحيل الأستاذ العام، معالجة الضرائب، وسندات اليومية.
          </p>
        </div>

        {/* SYSTEM STYLE TOGGLE & GUIDE LINK */}
        <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-center">
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 border border-purple-400/40 text-purple-200 text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <BookOpen className="w-4 h-4 text-purple-300" />
              <span>تعلم إعداد القيد المحاسبي 🎓</span>
            </button>
          )}

          <div className="flex items-center gap-2 bg-[#060b14] p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setErpStyle("odoo")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                erpStyle === "odoo"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>أسلوب Odoo ERP</span>
            </button>
            <button
              onClick={() => setErpStyle("dynamics")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                erpStyle === "dynamics"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Dynamics 365 / SAP</span>
            </button>
          </div>
        </div>
      </div>

      {/* NOTIFICATION BANNER */}
      {notification && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 animate-slideDown ${
          notification.type === "success" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" :
          notification.type === "warning" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" :
          "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
        }`}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{notification.msg}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-white/60 hover:text-white cursor-pointer">✕</button>
        </div>
      )}

      {/* PRESET TEMPLATES BAR */}
      <div className="bg-[#070c18] p-4 rounded-2xl border border-white/10 space-y-2">
        <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>نماذج سريعة جاهزة للقيود المركبة المعقدة (اختر للتجربة الفوريه):</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => loadPreset("sales")}
            className="p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-200 text-xs font-bold text-right transition-all cursor-pointer flex items-center gap-2"
          >
            <span>🛒</span>
            <div>
              <div>فاتورة مبيعات Odoo</div>
              <div className="text-[10px] text-purple-400 font-normal">شاملة ضريبة VAT 14%</div>
            </div>
          </button>

          <button
            onClick={() => loadPreset("bill")}
            className="p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-200 text-xs font-bold text-right transition-all cursor-pointer flex items-center gap-2"
          >
            <span>📦</span>
            <div>
              <div>فاتورة مشتريات Dynamics</div>
              <div className="text-[10px] text-blue-400 font-normal">أصول + مراكز تكلفة</div>
            </div>
          </button>

          <button
            onClick={() => loadPreset("payroll")}
            className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-200 text-xs font-bold text-right transition-all cursor-pointer flex items-center gap-2"
          >
            <span>💼</span>
            <div>
              <div>مسير رواتب واستقطاعات</div>
              <div className="text-[10px] text-emerald-400 font-normal">تأمينات واستحقاقات</div>
            </div>
          </button>

          <button
            onClick={() => loadPreset("receipt")}
            className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-200 text-xs font-bold text-right transition-all cursor-pointer flex items-center gap-2"
          >
            <span>🏦</span>
            <div>
              <div>تحصيل بنكي وخصم</div>
              <div className="text-[10px] text-amber-400 font-normal">خصم تعجيل دفع 5%</div>
            </div>
          </button>
        </div>
      </div>

      {/* DOCUMENT HEADER FIELDS (ERP FORM) */}
      <div className="bg-[#080d1e] p-5 rounded-2xl border border-white/10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-black text-white">بيانات قيد اليومية (ERP Document Voucher)</span>
            <span className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 border ${
              status === "posted" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" :
              status === "cancelled" ? "bg-red-500/20 text-red-300 border-red-500/40" :
              "bg-amber-500/20 text-amber-300 border-amber-500/40"
            }`}>
              {status === "posted" && <Check className="w-3.5 h-3.5" />}
              <span>{status === "posted" ? "مرحل ومعتمد (Posted)" : status === "cancelled" ? "ملغى (Cancelled)" : "مسودة (Draft)"}</span>
            </span>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            {voucherNo}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-bold mb-1">دفتر اليومية (Journal Type):</label>
            <select
              value={journalType}
              onChange={(e) => setJournalType(e.target.value)}
              disabled={status === "posted"}
              className="w-full bg-[#11192e] border border-white/10 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-purple-400"
            >
              <option value="INV">INV - فواتير المبيعات (Customer Invoices)</option>
              <option value="BILL">BILL - فواتير المشتريات (Vendor Bills)</option>
              <option value="BNK">BNK - المعاملات البنكية (Bank Ledger)</option>
              <option value="CSH">CSH - الصندوق والنقدية (Cash Operations)</option>
              <option value="MISC">MISC - تسويات متنوعة (General Ledger)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">تاريخ القيد:</label>
            <input
              type="date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              disabled={status === "posted"}
              className="w-full bg-[#11192e] border border-white/10 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">الشريك / الجهة (Partner):</label>
            <input
              type="text"
              value={partner}
              onChange={(e) => setPartner(e.target.value)}
              disabled={status === "posted"}
              placeholder="اسم العميل أو المورد أو الموظف"
              className="w-full bg-[#11192e] border border-white/10 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">المرجع / الشرح العام:</label>
            <input
              type="text"
              value={refMemo}
              onChange={(e) => setRefMemo(e.target.value)}
              disabled={status === "posted"}
              placeholder="البيان الإجمالي للقيد"
              className="w-full bg-[#11192e] border border-white/10 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>
      </div>

      {/* DYNAMIC JOURNAL LINES TABLE */}
      <div className="bg-[#080d1e] p-5 rounded-2xl border border-white/10 space-y-4 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-purple-400" />
            <span>أسطر القيد المحاسبي المزدوج (Journal Entry Lines):</span>
          </h3>

          {status !== "posted" && (
            <div className="flex items-center gap-2">
              <button
                onClick={autoBalanceEntry}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5"
                title="حساب الفارق وإضافة سطر لموازنة القيد أوتوماتيكياً"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>موازنة الفارق أوتوماتيكياً</span>
              </button>

              <button
                onClick={addVAT14Line}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Percent className="w-3.5 h-3.5 text-cyan-400" />
                <span>إضافة ضريبة VAT 14%</span>
              </button>
            </div>
          )}
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#0e162b] text-slate-300 font-bold border-b border-white/10">
              <tr>
                <th className="p-3 w-10 text-center">#</th>
                <th className="p-3 min-w-[220px]">رمز الحساب واسمه (Account Code & Name)</th>
                <th className="p-3 min-w-[180px]">مركز التكلفة (Cost Center)</th>
                <th className="p-3 min-w-[180px]">البيان التفصيلي (Label)</th>
                <th className="p-3 w-32 text-center text-cyan-300">مدين Dr (EGP)</th>
                <th className="p-3 w-32 text-center text-emerald-300">دائن Cr (EGP)</th>
                {status !== "posted" && <th className="p-3 w-12 text-center">حذف</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium text-slate-200 bg-[#060b17]">
              {lines.map((line, idx) => (
                <tr key={line.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 text-center text-slate-500 font-mono">{idx + 1}</td>
                  
                  {/* Account Code & Name Select */}
                  <td className="p-2">
                    <select
                      value={line.accountCode}
                      onChange={(e) => handleAccountChange(line.id, e.target.value)}
                      disabled={status === "posted"}
                      className="w-full bg-[#11192e] border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-bold focus:outline-none focus:border-purple-400"
                    >
                      {ERP_CHART_OF_ACCOUNTS.map(acc => (
                        <option key={acc.code} value={acc.code}>
                          {acc.code} - {acc.name} ({acc.type})
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Cost Center */}
                  <td className="p-2">
                    <select
                      value={line.costCenter}
                      onChange={(e) => handleLineChange(line.id, "costCenter", e.target.value)}
                      disabled={status === "posted"}
                      className="w-full bg-[#11192e] border border-white/10 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-purple-400"
                    >
                      {COST_CENTERS.map(cc => (
                        <option key={cc} value={cc}>{cc}</option>
                      ))}
                    </select>
                  </td>

                  {/* Line Description Label */}
                  <td className="p-2">
                    <input
                      type="text"
                      value={line.label}
                      onChange={(e) => handleLineChange(line.id, "label", e.target.value)}
                      disabled={status === "posted"}
                      placeholder="بيان هذا السطر"
                      className="w-full bg-[#11192e] border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-purple-400"
                    />
                  </td>

                  {/* Debit Input */}
                  <td className="p-2">
                    <input
                      type="number"
                      value={line.debit}
                      onChange={(e) => {
                        const val = e.target.value === "" ? "" : parseFloat(e.target.value);
                        setLines(lines.map(l => l.id === line.id ? { ...l, debit: val, credit: val !== "" ? "" : l.credit } : l));
                      }}
                      disabled={status === "posted"}
                      placeholder="0.00"
                      className="w-full bg-[#11192e] border border-cyan-500/30 text-cyan-300 font-mono font-black text-center rounded-lg px-2 py-1.5 focus:outline-none focus:border-cyan-400"
                    />
                  </td>

                  {/* Credit Input */}
                  <td className="p-2">
                    <input
                      type="number"
                      value={line.credit}
                      onChange={(e) => {
                        const val = e.target.value === "" ? "" : parseFloat(e.target.value);
                        setLines(lines.map(l => l.id === line.id ? { ...l, credit: val, debit: val !== "" ? "" : l.debit } : l));
                      }}
                      disabled={status === "posted"}
                      placeholder="0.00"
                      className="w-full bg-[#11192e] border border-emerald-500/30 text-emerald-300 font-mono font-black text-center rounded-lg px-2 py-1.5 focus:outline-none focus:border-emerald-400"
                    />
                  </td>

                  {/* Remove Button */}
                  {status !== "posted" && (
                    <td className="p-2 text-center">
                      <button
                        onClick={() => removeLine(line.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                        title="حذف السطر"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ADD LINE BUTTON */}
        {status !== "posted" && (
          <button
            onClick={addLine}
            className="w-full py-2.5 rounded-xl border border-dashed border-white/20 hover:border-purple-400 text-slate-300 hover:text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 text-purple-400" />
            <span>إضافة سطر قيد محاسبي جديد (Add Line Item)</span>
          </button>
        )}

        {/* TOTALS & BALANCE BAR */}
        <div className="bg-[#050914] p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-black text-xs">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-around">
            <div className="text-center sm:text-right">
              <span className="text-slate-400 block text-[10px]">إجمالي المدين (Debit Total):</span>
              <span className="text-cyan-400 text-base font-mono">{totalDebit.toLocaleString()} ج.م</span>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-slate-400 block text-[10px]">إجمالي الدائن (Credit Total):</span>
              <span className="text-emerald-400 text-base font-mono">{totalCredit.toLocaleString()} ج.م</span>
            </div>
          </div>

          {/* BALANCE STATUS INDICATOR */}
          <div className={`px-4 py-2.5 rounded-xl border text-center font-bold flex items-center gap-2 ${
            isBalanced ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : "bg-amber-500/20 text-amber-300 border-amber-500/40"
          }`}>
            {isBalanced ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>القيد متوازن تماماً (Balanced Journal Entry)</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>غير متوازن! الفارق: <span className="font-mono text-white underline mx-1">{Math.abs(difference).toLocaleString()} ج.م</span></span>
              </>
            )}
          </div>
        </div>

        {/* REAL-TIME SMART ACCOUNTING ADVISOR PANEL */}
        <div className="bg-[#070d1e] p-4 sm:p-5 rounded-2xl border border-purple-500/30 space-y-3.5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="text-xs sm:text-sm font-black text-white">
                المستشار الذكي للتحقق من القيود والتوجيه الفوري
              </span>
            </div>
            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black ${
              isBalanced
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-red-500/20 text-red-300 border border-red-500/30"
            }`}>
              {isBalanced ? "حالة التوازن: سليمة 100% ✓" : "حالة التوازن: تطلب تعديل ⚠️"}
            </span>
          </div>

          {/* Visual Balance Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold text-slate-300">
              <span>نسبة توازن القيد (المدين مقابل الدائن):</span>
              <span className="font-mono text-purple-300">
                {totalDebit === 0 && totalCredit === 0
                  ? "0%"
                  : isBalanced
                  ? "100% متوازن"
                  : `${Math.round((Math.min(totalDebit, totalCredit) / Math.max(totalDebit, totalCredit)) * 100)}%`}
              </span>
            </div>
            <div className="w-full bg-[#03060f] h-2.5 rounded-full overflow-hidden border border-white/10 flex">
              <div
                className="bg-cyan-500 h-full transition-all duration-300"
                style={{
                  width: `${
                    totalDebit === 0 && totalCredit === 0
                      ? 0
                      : (totalDebit / (totalDebit + totalCredit || 1)) * 100
                  }%`
                }}
                title={`المدين: ${totalDebit.toLocaleString()} ج.م`}
              />
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{
                  width: `${
                    totalDebit === 0 && totalCredit === 0
                      ? 0
                      : (totalCredit / (totalDebit + totalCredit || 1)) * 100
                  }%`
                }}
                title={`الدائن: ${totalCredit.toLocaleString()} ج.م`}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1">
              <span className="text-cyan-400">جانب المدين (Dr): {totalDebit.toLocaleString()} ج.م</span>
              <span className="text-emerald-400">جانب الدائن (Cr): {totalCredit.toLocaleString()} ج.م</span>
            </div>
          </div>

          {/* Dynamic Smart Guidance Tips */}
          <div className="space-y-2 pt-1">
            {!isBalanced && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-bold space-y-1.5">
                <div className="flex items-center gap-2 text-amber-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>
                    {totalDebit > totalCredit
                      ? `الجانب المدين زاد بمقدار ${Math.abs(difference).toLocaleString()} ج.م عن الجانب الدائن.`
                      : `الجانب الدائن زاد بمقدار ${Math.abs(difference).toLocaleString()} ج.م عن الجانب المدين.`}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-normal leading-relaxed mr-6">
                  {totalDebit > totalCredit
                    ? `💡 نصيحة التوجيه المحاسبي: أضف سطر دائن آخر بقيمة ${Math.abs(difference).toLocaleString()} ج.م (مثل حـ/ المبيعات، حـ/ الموردين، أو الإيرادات) أو اضغط زر [موازنة الفارق أوتوماتيكياً].`
                    : `💡 نصيحة التوجيه المحاسبي: أضف سطر مدين آخر بقيمة ${Math.abs(difference).toLocaleString()} ج.م (مثل حـ/ الصندوق، حـ/ البنك، حـ/ العملاء، أو المصروفات) أو اضغط زر [موازنة الفارق أوتوماتيكياً].`}
                </p>
              </div>
            )}

            {isBalanced && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs font-bold flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>
                    ممتاز! القيد متوازن محاسبياً 100% (إجمالي المدين {totalDebit.toLocaleString()} ج.م = إجمالي الدائن {totalCredit.toLocaleString()} ج.م).
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">جاهز للترحيل</span>
              </div>
            )}

            {/* Empty Line Warning */}
            {lines.some(l => (l.debit === "" && l.credit === "") || (l.debit === 0 && l.credit === 0)) && (
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-xs flex items-center gap-2">
                <Lightbulb className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>تنبيه: يوجد أسطر تحتوي على مبالغ صفرية، يرجى استكمال قيم المدين/الدائن أو حذف السطر لمراجعة نظيفة.</span>
              </div>
            )}

            {/* Empty Label Warning */}
            {lines.some(l => !l.label || l.label.trim() === "") && (
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-xs flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>نصيحة توثيقية: كتابة بيان تفصيلي (Label) لكل سطر يُسَهّل عمليات المراجعة والتدقيق المحاسبي القادمة.</span>
              </div>
            )}

            {/* Rule Box */}
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span><b>القاعدة الذهبية للقيد المزدوج:</b> الأصول والمصروفات زيادة (مدين Dr) ، الخصوم والإيرادات وزيادة رأس المال (دائن Cr).</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION WORKFLOW BUTTONS */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {status === "draft" && (
            <button
              onClick={handlePostEntry}
              disabled={!isBalanced}
              className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 shadow-xl ${
                isBalanced
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30 scale-102"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5"
              }`}
            >
              <Send className="w-4 h-4" />
              <span>اعتماد وترحيل القيد للأستاذ العام (Post Entry)</span>
            </button>
          )}

          {status === "posted" && (
            <button
              onClick={handleCancelEntry}
              className="px-5 py-2.5 rounded-2xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-black transition-all cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>إلغاء / عكس القيد المحاسبي (Cancel / Reverse)</span>
            </button>
          )}
        </div>

        <div className="text-xs text-slate-400 font-bold">
          عدد القيود المرحلة المعتمدة في النظام: <span className="text-purple-300 font-mono text-sm">{postedVouchers.length}</span>
        </div>
      </div>

      {/* GENERAL LEDGER & POSTED HISTORY TABLE */}
      {postedVouchers.length > 0 && (
        <div className="bg-[#080d1e] p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>سجل القيود المعتمدة والمرحّلة في دفتر الأستاذ العام (General Ledger Posted Vouchers)</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {postedVouchers.map((v) => (
              <div key={v.id} className="bg-[#050914] p-4 rounded-xl border border-white/10 space-y-3 hover:border-purple-500/40 transition-all">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono font-bold text-[11px]">
                      {v.voucherNo}
                    </span>
                    <span className="text-xs font-bold text-white">{v.partner}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{v.postedAt}</span>
                </div>

                <div className="text-xs text-slate-300 font-medium">
                  {v.memo}
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                  <span className="text-slate-400">إجمالي القيد: <strong className="text-cyan-300 font-mono">{v.totalDebit.toLocaleString()} ج.م</strong></span>
                  <button
                    onClick={() => setSelectedVoucherForPrint(v)}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-purple-400" />
                    <span>طباعة سند القيد ERP Voucher</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRINT / VOUCHER PREVIEW MODAL */}
      {selectedVoucherForPrint && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-scaleUp">
            <button
              onClick={() => setSelectedVoucherForPrint(null)}
              className="absolute top-4 left-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
            >
              ✕
            </button>

            {/* VOUCHER HEADER */}
            <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">سند قيد يومية محاسبي (Journal Voucher)</h2>
                <p className="text-xs text-slate-500 font-bold">صادر عن النظام المحاسبي الموحد ERP Enterprise System</p>
              </div>
              <div className="text-left font-mono">
                <div className="text-sm font-black text-purple-700">{selectedVoucherForPrint.voucherNo}</div>
                <div className="text-xs text-slate-500">{selectedVoucherForPrint.date}</div>
              </div>
            </div>

            {/* METADATA */}
            <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>الشريك / الحساب التحليلي: <span className="text-slate-900">{selectedVoucherForPrint.partner}</span></div>
              <div>نوع الدفتر: <span className="text-slate-900">{selectedVoucherForPrint.journalType}</span></div>
              <div className="col-span-2">البيان الشامل: <span className="text-slate-900">{selectedVoucherForPrint.memo}</span></div>
            </div>

            {/* LINES TABLE */}
            <table className="w-full text-right text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-bold">
                  <th className="p-2 border border-slate-800">رمز الحساب واسمه</th>
                  <th className="p-2 border border-slate-800">مركز التكلفة</th>
                  <th className="p-2 border border-slate-800 text-center">مدين (EGP)</th>
                  <th className="p-2 border border-slate-800 text-center">دائن (EGP)</th>
                </tr>
              </thead>
              <tbody>
                {selectedVoucherForPrint.lines.map((l, i) => (
                  <tr key={i} className="border-b border-slate-200">
                    <td className="p-2 font-bold">{l.accountCode} - {l.accountName}</td>
                    <td className="p-2 text-slate-600">{l.costCenter}</td>
                    <td className="p-2 text-center font-mono font-bold text-cyan-800">{l.debit ? l.debit.toLocaleString() : "-"}</td>
                    <td className="p-2 text-center font-mono font-bold text-emerald-800">{l.credit ? l.credit.toLocaleString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-black text-slate-900">
                  <td colSpan={2} className="p-2 border border-slate-300">الإجمالي العام (Total)</td>
                  <td className="p-2 border border-slate-300 text-center font-mono text-cyan-900">{selectedVoucherForPrint.totalDebit.toLocaleString()} ج.م</td>
                  <td className="p-2 border border-slate-300 text-center font-mono text-emerald-900">{selectedVoucherForPrint.totalDebit.toLocaleString()} ج.م</td>
                </tr>
              </tfoot>
            </table>

            {/* SIGNATURES BOX */}
            <div className="grid grid-cols-3 gap-4 text-center text-xs font-bold text-slate-600 pt-6 border-t border-slate-200">
              <div>
                <div className="mb-8">توقيع المحاسب إعداد:</div>
                <div className="border-b border-slate-400 w-3/4 mx-auto"></div>
              </div>
              <div>
                <div className="mb-8">توقيع المراجع الداخلي:</div>
                <div className="border-b border-slate-400 w-3/4 mx-auto"></div>
              </div>
              <div>
                <div className="mb-8">اعتماد المدير المالي:</div>
                <div className="border-b border-slate-400 w-3/4 mx-auto"></div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة السند الآن</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

