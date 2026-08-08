import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  Building2,
  Calculator,
  HelpCircle,
  Info,
  Sparkles,
  RefreshCw,
  FileText,
  ShieldAlert,
  BookOpen,
  PieChart,
  Download,
  Layers,
  TrendingDown,
  CheckCircle2,
  Printer,
  ChevronLeft
} from "lucide-react";

export interface AssetCategoryPreset {
  id: string;
  name: string;
  icon: string;
  defaultYears: number;
  zatcaRate: number; // ZATCA tax pool depreciation rate %
  description: string;
}

export const ASSET_PRESETS: AssetCategoryPreset[] = [
  {
    id: "buildings",
    name: "المباني والإنشاءات العقارية 🏢",
    icon: "Building2",
    defaultYears: 20,
    zatcaRate: 5,
    description: "المباني الثابتة والمكاتب والمستودعات المصنوعة من الخرسانة (نسبة الزكاة والضريبة 5%)."
  },
  {
    id: "machinery",
    name: "الآلات والمعدات الصناعية ⚙️",
    icon: "Layers",
    defaultYears: 10,
    zatcaRate: 10,
    description: "آلات المصانع، خطوط الإنتاج، والمعدات الميكانيكية الثقيلة (نسبة الهيئة 10%)."
  },
  {
    id: "vehicles",
    name: "السيارات ووسائل النقل 🚚",
    icon: "TrendingDown",
    defaultYears: 4,
    zatcaRate: 25,
    description: "سيارات الركاب الميدانية، الشاحنات، والحافلات (نسبة الهيئة 25%)."
  },
  {
    id: "it_hardware",
    name: "أجهزة الكمبيوتر والتقنية 💻",
    icon: "Sparkles",
    defaultYears: 4,
    zatcaRate: 25,
    description: "السيرفرات، الحواسيب المحمولة، الشبكات والبرمجيات (نسبة الهيئة 25%)."
  },
  {
    id: "furniture",
    name: "الأثاث والديكور والتجهيزات 🛋️",
    icon: "FileText",
    defaultYears: 10,
    zatcaRate: 10,
    description: "المكاتب، الكنب، أجهزة التكييف والتجهيزات المكتبية (نسبة الهيئة 10%)."
  }
];

export interface ScheduleRow {
  year: number;
  startBookValue: number;
  depreciationExpense: number;
  accumulatedDepreciation: number;
  endBookValue: number;
}

export function AssetDepreciationCalculator() {
  // Inputs
  const [assetName, setAssetName] = useState<string>("معدة تصنيع وتغليف هيدروليكية");
  const [cost, setCost] = useState<number>(100000);
  const [salvageValue, setSalvageValue] = useState<number>(10000);
  const [usefulLife, setUsefulLife] = useState<number>(5);
  const [method, setMethod] = useState<"straight_line" | "declining" | "double_declining" | "zatca_pool">("straight_line");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("machinery");

  // Handler for preset selection
  const handleSelectPreset = (preset: AssetCategoryPreset) => {
    setSelectedPresetId(preset.id);
    setUsefulLife(preset.defaultYears);
  };

  // Reset Form
  const handleReset = () => {
    setAssetName("معدة جديدة");
    setCost(50000);
    setSalvageValue(5000);
    setUsefulLife(5);
    setMethod("straight_line");
  };

  // Calculate Schedule
  const calculationResult = useMemo(() => {
    const safeCost = Math.max(0, cost);
    const safeSalvage = Math.max(0, Math.min(salvageValue, safeCost));
    const safeYears = Math.max(1, Math.min(usefulLife, 50));
    const depreciableAmount = safeCost - safeSalvage;

    const schedule: ScheduleRow[] = [];
    let currentBookValue = safeCost;
    let accumulatedDep = 0;

    if (method === "straight_line") {
      const annualDep = depreciableAmount / safeYears;

      for (let yr = 1; yr <= safeYears; yr++) {
        const startVal = currentBookValue;
        // In final year, snap to salvage
        const dep = yr === safeYears ? startVal - safeSalvage : Math.min(annualDep, startVal - safeSalvage);
        accumulatedDep += dep;
        currentBookValue = startVal - dep;

        schedule.push({
          year: yr,
          startBookValue: Math.round(startVal),
          depreciationExpense: Math.round(dep),
          accumulatedDepreciation: Math.round(accumulatedDep),
          endBookValue: Math.round(currentBookValue)
        });
      }
    } else if (method === "declining") {
      // Single Declining Balance (Rate = 1 / Years)
      const rate = 1 / safeYears;

      for (let yr = 1; yr <= safeYears; yr++) {
        const startVal = currentBookValue;
        let dep = (startVal - safeSalvage) * rate;

        if (yr === safeYears || startVal - dep < safeSalvage) {
          dep = Math.max(0, startVal - safeSalvage);
        }

        accumulatedDep += dep;
        currentBookValue = startVal - dep;

        schedule.push({
          year: yr,
          startBookValue: Math.round(startVal),
          depreciationExpense: Math.round(dep),
          accumulatedDepreciation: Math.round(accumulatedDep),
          endBookValue: Math.round(currentBookValue)
        });
      }
    } else if (method === "double_declining") {
      // Double Declining Balance (Rate = (1 / Years) * 2)
      const rate = (1 / safeYears) * 2;

      for (let yr = 1; yr <= safeYears; yr++) {
        const startVal = currentBookValue;
        let dep = startVal * rate;

        // Cannot drop below salvage value
        if (startVal - dep < safeSalvage || yr === safeYears) {
          dep = Math.max(0, startVal - safeSalvage);
        }

        accumulatedDep += dep;
        currentBookValue = startVal - dep;

        schedule.push({
          year: yr,
          startBookValue: Math.round(startVal),
          depreciationExpense: Math.round(dep),
          accumulatedDepreciation: Math.round(accumulatedDep),
          endBookValue: Math.round(currentBookValue)
        });
      }
    } else if (method === "zatca_pool") {
      // ZATCA Income Tax Law (Pool System)
      const preset = ASSET_PRESETS.find((p) => p.id === selectedPresetId) || ASSET_PRESETS[1];
      const poolRate = preset.zatcaRate / 100;

      for (let yr = 1; yr <= safeYears; yr++) {
        const startVal = currentBookValue;
        let dep = startVal * poolRate;

        if (yr === safeYears) {
          dep = Math.max(0, startVal - safeSalvage);
        }

        accumulatedDep += dep;
        currentBookValue = startVal - dep;

        schedule.push({
          year: yr,
          startBookValue: Math.round(startVal),
          depreciationExpense: Math.round(dep),
          accumulatedDepreciation: Math.round(accumulatedDep),
          endBookValue: Math.round(currentBookValue)
        });
      }
    }

    const firstYearDep = schedule.length > 0 ? schedule[0].depreciationExpense : 0;
    const monthlyDep = firstYearDep / 12;
    const effectiveDepRate = safeCost > 0 ? (firstYearDep / safeCost) * 100 : 0;

    return {
      safeCost,
      safeSalvage,
      safeYears,
      depreciableAmount,
      firstYearDep,
      monthlyDep,
      effectiveDepRate,
      schedule
    };
  }, [cost, salvageValue, usefulLife, method, selectedPresetId]);

  return (
    <div className="space-y-8 font-sans">
      
      {/* HEADER BAR */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0a1226] via-[#121c3b] to-[#0a1226] border border-indigo-500/30 shadow-2xl space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>أداة المحاسبة المالية والضريبية الذكية (Fixed Assets Depreciation Calculator)</span>
            </span>
            <h3 className="text-2xl font-black text-white">
              حاسبة إهلاك الأصول الثابتة وجداول العبء السنوي 🏢⚙️
            </h3>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              قم باحتساب القسط السنوي والشهري لإهلاك الأصول الثابتة وفقاً للمعاير الدولية (IFRS - IAS 16) ولائحة هيئة الزكاة والضريبة والجمارك (ZATCA Pool Method)، مع بناء الجدول الإهلاكي التراكمي الشامل.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border border-white/10"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>إعادة ضبط الأرقام</span>
          </button>
        </div>

        {/* PRESET ASSET CATEGORIES BAR */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-300 block flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>اختر فئة الأصل لتطبيق النسبة المعيارية تلقائياً:</span>
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {ASSET_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-3 rounded-2xl border text-right transition-all group cursor-pointer ${
                  selectedPresetId === preset.id
                    ? "bg-indigo-600/20 border-indigo-400 ring-2 ring-indigo-400/40"
                    : "bg-black/40 border-white/10 hover:border-indigo-500/40"
                }`}
              >
                <div className="text-xs font-black text-white group-hover:text-indigo-300 mb-1">
                  {preset.name}
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                  <span>{preset.defaultYears} سنوات</span>
                  <span className="text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded">
                    نسبة الهيئة: {preset.zatcaRate}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* TWO COLUMN INPUT & RESULTS PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: PARAMETER INPUTS */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 rounded-3xl bg-[#0a1024] border-2 border-indigo-500/30 shadow-xl space-y-5">
            <div className="border-b border-white/10 pb-3">
              <h4 className="font-black text-indigo-300 text-sm sm:text-base flex items-center gap-2">
                <Calculator className="w-5 h-5 text-indigo-400" />
                <span>بيانات الأصل الثابت والتكلفة</span>
              </h4>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Asset Name */}
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">مسمى الأصل / البيان:</label>
                <input
                  type="text"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              {/* Purchase Cost */}
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">
                  تكلفة الشراء الأصلية (غير شاملة الضريبة المستردة - ريال):
                </label>
                <input
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              {/* Salvage / Residual Value */}
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">
                  القيمة المتبقية التقديرية (الخردة / النفاية - Salvage Value):
                </label>
                <input
                  type="number"
                  value={salvageValue}
                  onChange={(e) => setSalvageValue(Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-400"
                />
                <span className="text-[10px] text-slate-400">
                  * القيمة المقدرة لبيع الأصل كخردة بعد انتهاء عمره الإنتاجي.
                </span>
              </div>

              {/* Useful Life (Years) */}
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">
                  العمر الإنتاجي الافتراضي (بالسنوات):
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={usefulLife}
                  onChange={(e) => setUsefulLife(Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              {/* Method Selector */}
              <div className="space-y-2 pt-2">
                <label className="text-slate-300 font-bold block">طريقة الإهلاك المحاسبية / الضريبية:</label>
                
                <div className="space-y-2">
                  <label
                    onClick={() => setMethod("straight_line")}
                    className={`p-3 rounded-2xl border block cursor-pointer transition-all ${
                      method === "straight_line"
                        ? "bg-indigo-600/20 border-indigo-400 ring-1 ring-indigo-400"
                        : "bg-black/30 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-white">طريقة القسط الثابت (Straight-Line)</span>
                      <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded">الأكثر استخداماً</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      قسط سنوي متساوي تماماً طوال سنوات العمر الإنتاجي.
                    </p>
                  </label>

                  <label
                    onClick={() => setMethod("declining")}
                    className={`p-3 rounded-2xl border block cursor-pointer transition-all ${
                      method === "declining"
                        ? "bg-indigo-600/20 border-indigo-400 ring-1 ring-indigo-400"
                        : "bg-black/30 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-white">طريقة القسط المتناقص (Declining Balance)</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      إهلاك أعلى في السنوات الأولى يتناقص تدريجياً مع مرور الوقت.
                    </p>
                  </label>

                  <label
                    onClick={() => setMethod("double_declining")}
                    className={`p-3 rounded-2xl border block cursor-pointer transition-all ${
                      method === "double_declining"
                        ? "bg-indigo-600/20 border-indigo-400 ring-1 ring-indigo-400"
                        : "bg-black/30 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-white">القسط المتناقص المزدوج (Double Declining 200%)</span>
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">للحواسيب والتقنية</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      مضاعفة نسبة الإهلاك لمواجهة التطور التكنولوجي السريع للأصول.
                    </p>
                  </label>

                  <label
                    onClick={() => setMethod("zatca_pool")}
                    className={`p-3 rounded-2xl border block cursor-pointer transition-all ${
                      method === "zatca_pool"
                        ? "bg-indigo-600/20 border-indigo-400 ring-1 ring-indigo-400"
                        : "bg-black/30 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-white">طريقة المجموعات الضريبية (ZATCA Tax Pool)</span>
                      <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">لإقرار الدخل والزكاة</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      تطبيق نسب الفئات المعتمدة بنظام ضريبة الدخل والزكاة في المملكة.
                    </p>
                  </label>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: CALCULATION RESULTS & ANNUAL SCHEDULE TABLE */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SUMMARY STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 space-y-1">
              <span className="text-[10px] font-bold text-indigo-300 uppercase block">قسط الإهلاك السنوي (السنة 1)</span>
              <div className="text-xl font-black text-white font-mono">
                {calculationResult.firstYearDep.toLocaleString()} ريال
              </div>
              <span className="text-[10px] text-slate-400 block">
                نسبة الإهلاك: {calculationResult.effectiveDepRate.toFixed(1)}%
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/30 space-y-1">
              <span className="text-[10px] font-bold text-purple-300 uppercase block">المصروف الشهري المقدر</span>
              <div className="text-xl font-black text-white font-mono">
                {Math.round(calculationResult.monthlyDep).toLocaleString()} ريال / شهر
              </div>
              <span className="text-[10px] text-slate-400 block">
                يُقيد شهرية في الأرباح والخسائر
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 space-y-1">
              <span className="text-[10px] font-bold text-emerald-300 uppercase block">الوعاء القابل للإهلاك</span>
              <div className="text-xl font-black text-white font-mono">
                {calculationResult.depreciableAmount.toLocaleString()} ريال
              </div>
              <span className="text-[10px] text-slate-400 block">
                (التكلفة - قيمة الخردة)
              </span>
            </div>

          </div>

          {/* ANNUAL DEPRECIATION SCHEDULE TABLE */}
          <div className="p-6 rounded-3xl bg-[#0a1024] border border-white/10 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="space-y-0.5">
                <h4 className="font-black text-white text-sm sm:text-base flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <span>جدول الإهلاك السنوي للأصل ({assetName})</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  تتبع حركة القيمة الدفترية ومجمع الإهلاك طوال العمر الإنتاجي ({calculationResult.safeYears} سنوات)
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-500/20 px-2.5 py-1 rounded-xl">
                {method === "straight_line" && "القسط الثابت"}
                {method === "declining" && "القسط المتناقص"}
                {method === "double_declining" && "المتناقص المزدوج"}
                {method === "zatca_pool" && "فئات الهيئة ZATCA"}
              </span>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-white/5 text-slate-300 border-b border-white/10 text-[11px] font-bold">
                    <th className="p-3">السنة</th>
                    <th className="p-3">القيمة بداية السنة</th>
                    <th className="p-3">قسط الإهلاك السنوي</th>
                    <th className="p-3">مجمع الإهلاك المتراكم</th>
                    <th className="p-3">القيمة الدفترية نهاية السنة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {calculationResult.schedule.map((row) => (
                    <tr key={row.year} className="hover:bg-indigo-500/10 transition-colors">
                      <td className="p-3 font-bold text-amber-300">السنة {row.year}</td>
                      <td className="p-3 text-slate-200">{row.startBookValue.toLocaleString()} ريال</td>
                      <td className="p-3 text-indigo-300 font-black">{row.depreciationExpense.toLocaleString()} ريال</td>
                      <td className="p-3 text-purple-300">{row.accumulatedDepreciation.toLocaleString()} ريال</td>
                      <td className="p-3 text-emerald-300 font-bold">{row.endBookValue.toLocaleString()} ريال</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* ACCOUNTING & ZATCA TAX GUIDANCE CARD */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0f172a] to-slate-900 border border-white/10 space-y-4 text-xs">
            
            <div className="flex items-center gap-2 text-amber-300 font-black border-b border-white/10 pb-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>التوجيه المحاسبي والقيود النموذجية (Accounting Entry & ZATCA Rules)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Journal Entry Example */}
              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                <span className="font-bold text-indigo-300 block">📝 قيد إثبات مصروف الإهلاك السنوي:</span>
                <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-200 border border-white/5 space-y-1">
                  <div className="flex justify-between">
                    <span>من حـ/ مصروف إهلاك الأصل ({assetName})</span>
                    <span className="text-indigo-400">{calculationResult.firstYearDep.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 pr-3">
                    <span>إلى حـ/ مجمع إهلاك الأصل المتراكم</span>
                    <span className="text-purple-400">{calculationResult.firstYearDep.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">
                  يُظهر مصروف الإهلاك في قائمة الدخل (P&L)، بينما يُطرح مجمع الإهلاك من تكلفة الأصل في الميزانية العمومية.
                </p>
              </div>

              {/* ZATCA Tax Rule Difference */}
              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                <span className="font-bold text-emerald-300 block">⚖️ الفرق بين الإهلاك المحاسبي والإقرار الزكوي:</span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  تعتمد هيئة الزكاة والضريبة والجمارك (ZATCA) نظام <strong className="text-amber-300">مجموعات الأصول (Pool System)</strong> طبقاً للمادة 17 من نظام ضريبة الدخل، حيث يتم تجميع الأصول حسب الفئة وتطبيق النسبة النظامية بدلاً من العمر الافتراضي الفردي للأصل.
                </p>
                <div className="text-[10px] text-amber-200 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                  💡 عند وجود فرق بين الإهلاك المحاسبي والإهلاك الزكوي، يُجرى تعديل على صافي الربح المحاسبي في إقرار ضريبة الدخل.
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
