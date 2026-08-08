import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  Calculator,
  Percent,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Building2,
  UserCheck,
  DollarSign,
  PieChart,
  HelpCircle,
  FileText,
  Info,
  CheckCircle2,
  RefreshCw,
  ArrowRightLeft,
  ChevronLeft
} from "lucide-react";

export interface TaxBracket {
  min: number;
  max: number | null; // null means infinity
  rate: number; // e.g. 0.10 for 10%
  label: string;
}

export interface PresetSystem {
  id: string;
  name: string;
  entityType: "individual" | "corporate";
  currency: string;
  defaultExemption: number;
  flatRate?: number; // if corporate flat rate
  brackets: TaxBracket[];
  description: string;
}

export const TAX_PRESET_SYSTEMS: PresetSystem[] = [
  {
    id: "saudi_corporate",
    name: "المملكة العربية السعودية - ضريبة دخل الشركات غير السعودية (20%) 🇸🇦",
    entityType: "corporate",
    currency: "ريال",
    defaultExemption: 0,
    flatRate: 0.20,
    brackets: [
      { min: 0, max: null, rate: 0.20, label: "نسبة مقطوعة للشركات والأجنبي (20%)" }
    ],
    description: "تُفرض ضريبة الدخل في السعودية بنسبة 20% على حصة الشريك الأجنبي في الشركات المقيمة، وعلى الأشخاص غير المقيمين الذين يمارسون نشاطاً في المملكة."
  },
  {
    id: "saudi_natural_person",
    name: "السعودية - نشاط الأفراد الأجانب غير المقيمين (20%) 🇸🇦",
    entityType: "individual",
    currency: "ريال",
    defaultExemption: 0,
    flatRate: 0.20,
    brackets: [
      { min: 0, max: null, rate: 0.20, label: "نشاط اقتصادي غير مقيم (20%)" }
    ],
    description: "ضريبة الدخل على النشاط الفردي غير المقيم أو الأنشطة المستهدفة من الهيئة العامة للزكاة والضريبة والجمارك."
  },
  {
    id: "egypt_individual",
    name: "جمهورية مصر العربية - كسب العمل والأفراد (شرائح تصاعدية) 🇪🇬",
    entityType: "individual",
    currency: "جنيه",
    defaultExemption: 20000,
    brackets: [
      { min: 0, max: 40000, rate: 0.00, label: "الشريحة 1: المعفاة (0%)" },
      { min: 40000, max: 55000, rate: 0.10, label: "الشريحة 2: (10%)" },
      { min: 55000, max: 70000, rate: 0.15, label: "الشريحة 3: (15%)" },
      { min: 70000, max: 200000, rate: 0.20, label: "الشريحة 4: (20%)" },
      { min: 200000, max: 400000, rate: 0.225, label: "الشريحة 5: (22.5%)" },
      { min: 400000, max: null, rate: 0.25, label: "الشريحة 6: (25%)" }
    ],
    description: "شرائح تصاعدية على صافي الدخل السنوي للأفراد وفقاً لتحديثات قانون ضريبة الدخل المصري."
  },
  {
    id: "uae_corporate",
    name: "الإمارات العربية المتحدة - ضريبة الشركات (9%) 🇦🇪",
    entityType: "corporate",
    currency: "درهم",
    defaultExemption: 375000,
    brackets: [
      { min: 0, max: 375000, rate: 0.00, label: "الشريحة المعفاة (0% حتى 375,000 درهم)" },
      { min: 375000, max: null, rate: 0.09, label: "الشريحة الخاضعة (9% لما زاد)" }
    ],
    description: "تُطبق ضريبة الشركات الاتحادية بنسبة 0% على الأرباح حتى 375,000 درهم، وبنسبة 9% على الأرباح التي تتجاوز هذا المبلغ."
  },
  {
    id: "jordan_individual",
    name: "المملكة الأردنية الهاشمية - دخل الأفراد (شرائح) 🇯🇴",
    entityType: "individual",
    currency: "دينار",
    defaultExemption: 9000,
    brackets: [
      { min: 0, max: 5000, rate: 0.05, label: "الشريحة الأولى (5%)" },
      { min: 5000, max: 10000, rate: 0.10, label: "الشريحة الثانية (10%)" },
      { min: 10000, max: 15000, rate: 0.15, label: "الشريحة الثالثة (15%)" },
      { min: 15000, max: 20000, rate: 0.20, label: "الشريحة الرابعة (20%)" },
      { min: 20000, max: null, rate: 0.25, label: "الشريحة الخامسة (25%)" }
    ],
    description: "شرائح تصاعدية بعد خصم الإعفاء الشخصي والعائلي في الأردن."
  },
  {
    id: "custom_brackets",
    name: "نظام شرائح تصاعدي مخصص (Custom Custom Tax System) ⚙️",
    entityType: "individual",
    currency: "عملة",
    defaultExemption: 30000,
    brackets: [
      { min: 0, max: 50000, rate: 0.00, label: "معفى (0%)" },
      { min: 50000, max: 150000, rate: 0.10, label: "شريحة منخفضة (10%)" },
      { min: 150000, max: 300000, rate: 0.18, label: "شريحة متوسطة (18%)" },
      { min: 300000, max: null, rate: 0.25, label: "الشريحة العليا (25%)" }
    ],
    description: "نموذج افتراضي قابل للتعديل يتيح حساب ضريبة الدخل بناءً على أي هيكل شرائح مخصص."
  }
];

export function IncomeTaxCalculator() {
  // Preset Selection
  const [selectedSystemId, setSelectedSystemId] = useState<string>("saudi_corporate");
  const currentSystem = useMemo(
    () => TAX_PRESET_SYSTEMS.find((s) => s.id === selectedSystemId) || TAX_PRESET_SYSTEMS[0],
    [selectedSystemId]
  );

  // Income & Deduction Inputs
  const [grossIncome, setGrossIncome] = useState<number>(350000);
  const [personalExemption, setPersonalExemption] = useState<number>(currentSystem.defaultExemption);
  const [socialSecurityDeduction, setSocialSecurityDeduction] = useState<number>(15000);
  const [businessExpensesDeduction, setBusinessExpensesDeduction] = useState<number>(35000);
  const [charityDeduction, setCharityDeduction] = useState<number>(10000);

  // Update default exemption when system changes
  const handleSystemSelect = (sys: PresetSystem) => {
    setSelectedSystemId(sys.id);
    setPersonalExemption(sys.defaultExemption);
  };

  // Reset inputs
  const handleReset = () => {
    setGrossIncome(250000);
    setPersonalExemption(currentSystem.defaultExemption);
    setSocialSecurityDeduction(10000);
    setBusinessExpensesDeduction(20000);
    setCharityDeduction(5000);
  };

  // Calculations Engine
  const calculationResult = useMemo(() => {
    const safeGross = Math.max(0, grossIncome);
    const safePersonalEx = Math.max(0, personalExemption);
    const safeSocial = Math.max(0, socialSecurityDeduction);
    const safeBiz = Math.max(0, businessExpensesDeduction);
    const safeCharity = Math.max(0, charityDeduction);

    const totalDeductions = safePersonalEx + safeSocial + safeBiz + safeCharity;
    const taxableBase = Math.max(0, safeGross - totalDeductions);

    let totalTaxPayable = 0;
    const bracketBreakdown: Array<{
      label: string;
      range: string;
      ratePct: number;
      taxableInBracket: number;
      taxInBracket: number;
    }> = [];

    let marginalRate = 0;

    if (currentSystem.flatRate !== undefined && currentSystem.flatRate > 0) {
      // Flat rate calculation
      totalTaxPayable = taxableBase * currentSystem.flatRate;
      marginalRate = currentSystem.flatRate * 100;

      bracketBreakdown.push({
        label: `نسبة مقطوعة (${marginalRate}%)`,
        range: `من 0 إلى جميع الأرباح`,
        ratePct: marginalRate,
        taxableInBracket: taxableBase,
        taxInBracket: totalTaxPayable
      });
    } else {
      // Progressive brackets calculation
      let remainingTaxable = taxableBase;

      currentSystem.brackets.forEach((b) => {
        if (taxableBase > b.min) {
          const bracketSpan = b.max !== null ? b.max - b.min : Infinity;
          const taxableInThisBracket = Math.min(Math.max(0, taxableBase - b.min), bracketSpan);
          const taxForThisBracket = taxableInThisBracket * b.rate;

          if (taxableInThisBracket > 0) {
            totalTaxPayable += taxForThisBracket;
            marginalRate = b.rate * 100;
          }

          bracketBreakdown.push({
            label: b.label,
            range: `${b.min.toLocaleString()} - ${b.max ? b.max.toLocaleString() : "فأكثر"}`,
            ratePct: Math.round(b.rate * 1000) / 10,
            taxableInBracket: Math.round(taxableInThisBracket),
            taxInBracket: Math.round(taxForThisBracket)
          });
        }
      });
    }

    const netIncomeAfterTax = Math.max(0, safeGross - totalDeductions - totalTaxPayable);
    const effectiveTaxRate = safeGross > 0 ? (totalTaxPayable / safeGross) * 100 : 0;
    const taxToTaxableRate = taxableBase > 0 ? (totalTaxPayable / taxableBase) * 100 : 0;

    // Percentages for visual breakdown
    const deductionsPct = safeGross > 0 ? Math.min(100, (totalDeductions / safeGross) * 100) : 0;
    const taxPct = safeGross > 0 ? Math.min(100, (totalTaxPayable / safeGross) * 100) : 0;
    const netIncomePct = Math.max(0, 100 - deductionsPct - taxPct);

    return {
      safeGross,
      totalDeductions,
      taxableBase,
      totalTaxPayable: Math.round(totalTaxPayable),
      netIncomeAfterTax: Math.round(netIncomeAfterTax),
      effectiveTaxRate,
      taxToTaxableRate,
      marginalRate,
      bracketBreakdown,
      deductionsPct,
      taxPct,
      netIncomePct
    };
  }, [
    grossIncome,
    personalExemption,
    socialSecurityDeduction,
    businessExpensesDeduction,
    charityDeduction,
    currentSystem
  ]);

  return (
    <div className="space-y-8 font-sans">
      
      {/* HEADER SECTION */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0a1128] via-[#121a3a] to-[#0a1128] border border-indigo-500/30 shadow-2xl space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>محاكي وحاسبة ضريبة الدخل المتقدمة (Annual Income Tax & Deductions Simulator)</span>
            </span>
            <h3 className="text-2xl font-black text-white">
              حاسبة ضريبة الدخل السنوية وتأثير الخصومات 📊💼
            </h3>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              قم باحتساب ضريبة الدخل للشركات أو الأفراد بناءً على شرائح الدخل والخصومات التشغيلية والإعفاءات المسموح بها، مع رؤية تحليل بياني فوري لأثر الضريبة على صافي الدخل والمعدل الفعلي.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border border-white/10"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>إعادة الضبط</span>
          </button>
        </div>

        {/* TAX SYSTEM SELECTOR GRID */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-300 block flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <span>اختر النظام الضريبي أو الدولة المراد محاكاتها:</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TAX_PRESET_SYSTEMS.map((sys) => (
              <button
                key={sys.id}
                onClick={() => handleSystemSelect(sys)}
                className={`p-3.5 rounded-2xl border text-right transition-all group cursor-pointer ${
                  selectedSystemId === sys.id
                    ? "bg-indigo-600/25 border-indigo-400 ring-2 ring-indigo-400/30 shadow-lg"
                    : "bg-black/40 border-white/10 hover:border-indigo-500/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-white group-hover:text-indigo-300">
                    {sys.name}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    sys.entityType === "corporate"
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  }`}>
                    {sys.entityType === "corporate" ? "شركات" : "أفراد"}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                  {sys.description}
                </p>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* INPUTS & RESULTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* INPUTS COLUMN */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 rounded-3xl bg-[#0b1022] border-2 border-indigo-500/30 shadow-xl space-y-5">
            
            <div className="border-b border-white/10 pb-3 flex items-center justify-between">
              <h4 className="font-black text-indigo-300 text-sm sm:text-base flex items-center gap-2">
                <Calculator className="w-5 h-5 text-indigo-400" />
                <span>إدخال الإيرادات والخصومات المعتمدة</span>
              </h4>
              <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-xl border border-amber-500/30">
                العملة: {currentSystem.currency}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Gross Annual Income */}
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block flex items-center justify-between">
                  <span>إجمالي الدخل / أرباح النشاط السنوية:</span>
                  <span className="text-indigo-400 font-mono font-black">{grossIncome.toLocaleString()} {currentSystem.currency}</span>
                </label>
                <input
                  type="number"
                  step={5000}
                  value={grossIncome}
                  onChange={(e) => setGrossIncome(Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              {/* DEDUCTIONS SECTION HEADER */}
              <div className="pt-2 border-t border-white/10 space-y-3">
                <span className="text-xs font-black text-amber-300 block flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>الخصومات والإعفاءات المسموح بها قانوناً:</span>
                </span>

                {/* Personal / Basic Exemption */}
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">
                    1. حد الإعفاء الأساسي / الشخصي (Basic Exemption Allowance):
                  </label>
                  <input
                    type="number"
                    value={personalExemption}
                    onChange={(e) => setPersonalExemption(Number(e.target.value))}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-400"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    * المبلغ المعفى نظاماً قبل بدء تطبيق أدنى شريحة.
                  </span>
                </div>

                {/* Social Security / Pension / Insurance */}
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">
                    2. اشتراكات التأمينات والتقاعد والتأمين الصحي المقبولة:
                  </label>
                  <input
                    type="number"
                    value={socialSecurityDeduction}
                    onChange={(e) => setSocialSecurityDeduction(Number(e.target.value))}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>

                {/* Operating / Business Expenses */}
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">
                    3. التكاليف والمصاريف التشغيلية المباشرة المعتمدة:
                  </label>
                  <input
                    type="number"
                    value={businessExpensesDeduction}
                    onChange={(e) => setBusinessExpensesDeduction(Number(e.target.value))}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-400"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    * المصاريف اللازمة لتحقيق الدخل المرفقة بـ فواتير ضريبية معتمدة.
                  </span>
                </div>

                {/* Charitable Donations */}
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">
                    4. التبرعات للجهات والمؤسسات الخيرية المعتمدة رسمياً:
                  </label>
                  <input
                    type="number"
                    value={charityDeduction}
                    onChange={(e) => setCharityDeduction(Number(e.target.value))}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* RESULTS & VISUAL CHARTS COLUMN */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* TOP METRIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/60 to-slate-900 border border-rose-500/30 space-y-1">
              <span className="text-[10px] font-bold text-rose-300 uppercase block">إجمالي الضريبة المستحقة</span>
              <div className="text-2xl font-black text-white font-mono">
                {calculationResult.totalTaxPayable.toLocaleString()} {currentSystem.currency}
              </div>
              <span className="text-[10px] text-slate-400 block">
                معدل الضريبة الفعلي: <strong className="text-rose-400">{calculationResult.effectiveTaxRate.toFixed(1)}%</strong>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 space-y-1">
              <span className="text-[10px] font-bold text-emerald-300 uppercase block">صافي الدخل المتبقي بعد الضريبة</span>
              <div className="text-2xl font-black text-white font-mono">
                {calculationResult.netIncomeAfterTax.toLocaleString()} {currentSystem.currency}
              </div>
              <span className="text-[10px] text-slate-400 block">
                يمثل <strong className="text-emerald-400">{calculationResult.netIncomePct.toFixed(1)}%</strong> من إجمالي الدخل
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 space-y-1">
              <span className="text-[10px] font-bold text-indigo-300 uppercase block">الوعاء الخاضع للضريبة</span>
              <div className="text-2xl font-black text-white font-mono">
                {calculationResult.taxableBase.toLocaleString()} {currentSystem.currency}
              </div>
              <span className="text-[10px] text-slate-400 block">
                بعد خصم {calculationResult.totalDeductions.toLocaleString()} إعفاءات
              </span>
            </div>

          </div>

          {/* VISUAL INCOME BREAKDOWN BAR (INTERACTIVE PROGRESSIVE GRAPH) */}
          <div className="p-6 rounded-3xl bg-[#0b1022] border border-white/10 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="space-y-0.5">
                <h4 className="font-black text-white text-sm sm:text-base flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-indigo-400" />
                  <span>الرسم البياني لتوزيع إجمالي الدخل السنوي</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  توزيع {calculationResult.safeGross.toLocaleString()} {currentSystem.currency} بين الخصومات والضريبة وصافي الربح
                </p>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-mono font-bold">
                <span className="text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded">
                  الشريحة العليا: {calculationResult.marginalRate}%
                </span>
              </div>
            </div>

            {/* STACKED BAR GRAPH */}
            <div className="space-y-2">
              <div className="h-7 w-full rounded-2xl bg-slate-950 p-1 flex overflow-hidden border border-white/10">
                {/* Deductions segment */}
                <div
                  style={{ width: `${calculationResult.deductionsPct}%` }}
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-l-xl transition-all duration-500 relative group cursor-pointer"
                  title={`إجمالي الخصومات: ${calculationResult.totalDeductions.toLocaleString()} (${calculationResult.deductionsPct.toFixed(1)}%)`}
                />
                {/* Tax segment */}
                <div
                  style={{ width: `${calculationResult.taxPct}%` }}
                  className="h-full bg-gradient-to-r from-rose-500 to-rose-600 transition-all duration-500 relative group cursor-pointer"
                  title={`الضريبة المستحقة: ${calculationResult.totalTaxPayable.toLocaleString()} (${calculationResult.taxPct.toFixed(1)}%)`}
                />
                {/* Net Income segment */}
                <div
                  style={{ width: `${calculationResult.netIncomePct}%` }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-r-xl transition-all duration-500 relative group cursor-pointer"
                  title={`صافي الدخل: ${calculationResult.netIncomeAfterTax.toLocaleString()} (${calculationResult.netIncomePct.toFixed(1)}%)`}
                />
              </div>

              {/* LEGEND */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 font-bold">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                  <span className="block text-[10px] text-slate-400">1. الخصومات والإعفاءات</span>
                  <span className="font-mono">{calculationResult.totalDeductions.toLocaleString()} ({calculationResult.deductionsPct.toFixed(1)}%)</span>
                </div>

                <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
                  <span className="block text-[10px] text-slate-400">2. عبء الضريبة المقصوص</span>
                  <span className="font-mono">{calculationResult.totalTaxPayable.toLocaleString()} ({calculationResult.taxPct.toFixed(1)}%)</span>
                </div>

                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                  <span className="block text-[10px] text-slate-400">3. صافي الدخل المتبقي</span>
                  <span className="font-mono">{calculationResult.netIncomeAfterTax.toLocaleString()} ({calculationResult.netIncomePct.toFixed(1)}%)</span>
                </div>
              </div>
            </div>

          </div>

          {/* BRACKET-BY-BRACKET TAX BREAKDOWN TABLE */}
          <div className="p-6 rounded-3xl bg-[#0b1022] border border-white/10 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="space-y-0.5">
                <h4 className="font-black text-white text-sm sm:text-base flex items-center gap-2">
                  <Percent className="w-5 h-5 text-indigo-400" />
                  <span>تفاصيل الشريحـات والتوزيع التصاعدي (Bracket Breakdown)</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  بيان توزيع الوعاء الخاضع ({calculationResult.taxableBase.toLocaleString()} {currentSystem.currency}) على الشرائح النظامية
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-white/5 text-slate-300 border-b border-white/10 text-[11px] font-bold">
                    <th className="p-3">اسم الشريحة</th>
                    <th className="p-3">نطاق الدخل</th>
                    <th className="p-3">نسبة الشريحة</th>
                    <th className="p-3">المبلغ الخاضع بالشريحة</th>
                    <th className="p-3">الضريبة المقتطعة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {calculationResult.bracketBreakdown.map((row, idx) => (
                    <tr key={idx} className="hover:bg-indigo-500/10 transition-colors">
                      <td className="p-3 font-bold text-white font-sans">{row.label}</td>
                      <td className="p-3 text-slate-300">{row.range}</td>
                      <td className="p-3 text-amber-300 font-bold">{row.ratePct}%</td>
                      <td className="p-3 text-indigo-300">{row.taxableInBracket.toLocaleString()} {currentSystem.currency}</td>
                      <td className="p-3 text-rose-300 font-black">{row.taxInBracket.toLocaleString()} {currentSystem.currency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* TAX COMPLIANCE & LEGAL NOTES */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0f172a] to-slate-900 border border-white/10 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-black border-b border-white/10 pb-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>ملاحظات نظامية حول الخصومات وإقرار ضريبة الدخل السنوي:</span>
            </div>
            <ul className="space-y-2 text-slate-300 text-[11px] leading-relaxed list-disc pr-4">
              <li>
                <strong className="text-white">الفواتير الضريبية المعتمدة:</strong> لا تُقبل المصاريف التشغيلية كخصومات ضريبية مالم تكن موثقة بفواتير ضريبية قانونية تحمل الرقم الضريبي للمورد.
              </li>
              <li>
                <strong className="text-white">الفرق بين المعدل الفعلي والمارجينال:</strong> المعدل الفعلي (Effective Rate) يمثل نسبة الضريبة الحقيقية مقارنة بـ إجمالي الدخل ({calculationResult.effectiveTaxRate.toFixed(1)}%)، بينما المعدل الحدّي (Marginal Rate) هو نسبة أعلى شريحة وصلت إليها أرباحك ({calculationResult.marginalRate}%).
              </li>
              <li>
                <strong className="text-white">تأخير التقديم:</strong> يُحظر التأخر عن الموعد المحدد لتقديم الإقرار السنوي لتجنب غرامات التأخير الصادرة من السلطات الضريبية.
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
