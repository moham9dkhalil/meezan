import React, { useState } from "react";
import { TradingSimulator } from "./TradingSimulator";
import { FinancialDataVisualizer } from "./FinancialDataVisualizer";
import { SmartAccountantDictionary } from "./SmartAccountantDictionary";
import {
  Calculator,
  Scale,
  TrendingUp,
  DollarSign,
  Percent,
  PieChart,
  Receipt,
  Coins,
  Building2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Printer,
  Copy,
  Check,
  FileSpreadsheet,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  HelpCircle,
  RefreshCw,
  FileText,
  Zap,
  Sliders,
  BarChart2,
  BarChart3,
  BookOpen
} from "lucide-react";

type ToolType = "dictionary" | "datavis" | "trading" | "dep" | "eq" | "ratio" | "vat" | "breakeven" | "tvm";

export function ToolsSection() {
  const [activeTool, setActiveTool] = useState<ToolType>("datavis");
  const [copied, setCopied] = useState(false);

  // ─────────────────────────────────────────────────────────────
  // 1. ASSET DEPRECIATION STATE
  // ─────────────────────────────────────────────────────────────
  const [depName, setDepName] = useState("سيارة نقل بضائع");
  const [depCost, setDepCost] = useState(250000);
  const [depSalvage, setDepSalvage] = useState(25000);
  const [depLife, setDepLife] = useState(5);
  const [depMethod, setDepMethod] = useState<"sl" | "ddb" | "syd">("sl");

  // Calculations for Depreciation
  const depBase = Math.max(0, depCost - depSalvage);
  
  // Straight line
  const slAnnual = depLife > 0 ? depBase / depLife : 0;

  // Double declining
  const ddbRate = depLife > 0 ? 2 / depLife : 0;

  // Sum of years digits
  const sydSum = (depLife * (depLife + 1)) / 2;

  // Schedule generator
  const getDepSchedule = () => {
    let schedule = [];
    let bookVal = depCost;
    let accumDep = 0;

    for (let year = 1; year <= depLife; year++) {
      let annual = 0;
      if (depMethod === "sl") {
        annual = slAnnual;
      } else if (depMethod === "ddb") {
        annual = bookVal * ddbRate;
        if (bookVal - annual < depSalvage) {
          annual = Math.max(0, bookVal - depSalvage);
        }
      } else if (depMethod === "syd") {
        const remainingYears = depLife - year + 1;
        annual = sydSum > 0 ? depBase * (remainingYears / sydSum) : 0;
      }

      annual = Math.round(annual);
      accumDep += annual;
      bookVal = Math.max(depSalvage, depCost - accumDep);

      schedule.push({
        year,
        annual,
        accumDep,
        bookVal
      });
    }
    return schedule;
  };

  const schedule = getDepSchedule();
  const currentYearDep = schedule[0]?.annual || 0;

  // ─────────────────────────────────────────────────────────────
  // 2. ACCOUNTING EQUATION & WORKING CAPITAL STATE
  // ─────────────────────────────────────────────────────────────
  const [eqCurrAssets, setEqCurrAssets] = useState(300000);
  const [eqNonCurrAssets, setEqNonCurrAssets] = useState(500000);
  const [eqCurrLiab, setEqCurrLiab] = useState(150000);
  const [eqNonCurrLiab, setEqNonCurrLiab] = useState(250000);
  const [eqCapital, setEqCapital] = useState(300000);
  const [eqRetained, setEqRetained] = useState(100000);

  const totalAssets = eqCurrAssets + eqNonCurrAssets;
  const totalLiab = eqCurrLiab + eqNonCurrLiab;
  const totalEquity = eqCapital + eqRetained;
  const isBalanced = totalAssets === totalLiab + totalEquity;
  const balanceDiff = Math.abs(totalAssets - (totalLiab + totalEquity));

  const workingCapital = eqCurrAssets - eqCurrLiab;
  const workingCapitalRatio = eqCurrLiab > 0 ? (eqCurrAssets / eqCurrLiab).toFixed(2) : "0";

  // ─────────────────────────────────────────────────────────────
  // 3. FINANCIAL RATIOS STATE
  // ─────────────────────────────────────────────────────────────
  const [rRevenue, setRRevenue] = useState(600000);
  const [rCogs, setRCogs] = useState(360000);
  const [rOpExp, setROpExp] = useState(90000);
  const [rCurrAssets, setRCurrAssets] = useState(240000);
  const [rCurrLiab, setRCurrLiab] = useState(120000);
  const [rInventory, setRInventory] = useState(60000);
  const [rEquity, setREquity] = useState(400000);
  const [rTotalAssets, setRTotalAssets] = useState(650000);

  const grossProfit = rRevenue - rCogs;
  const netIncome = grossProfit - rOpExp;
  const grossMargin = rRevenue > 0 ? (grossProfit / rRevenue) * 100 : 0;
  const netMargin = rRevenue > 0 ? (netIncome / rRevenue) * 100 : 0;
  const currentRatio = rCurrLiab > 0 ? rCurrAssets / rCurrLiab : 0;
  const quickRatio = rCurrLiab > 0 ? (rCurrAssets - rInventory) / rCurrLiab : 0;
  const roe = rEquity > 0 ? (netIncome / rEquity) * 100 : 0;
  const roa = rTotalAssets > 0 ? (netIncome / rTotalAssets) * 100 : 0;

  // ─────────────────────────────────────────────────────────────
  // 4. VAT & INVOICE CALCULATOR STATE
  // ─────────────────────────────────────────────────────────────
  const [vatAmountInput, setVatAmountInput] = useState(10000);
  const [vatRate, setVatRate] = useState(14); // 14% Egypt standard
  const [vatType, setVatType] = useState<"exclusive" | "inclusive">("exclusive");
  const [vatCategory, setVatCategory] = useState<"sales" | "purchases">("sales");

  let netVal = 0;
  let taxVal = 0;
  let grossVal = 0;

  if (vatType === "exclusive") {
    netVal = vatAmountInput;
    taxVal = (netVal * vatRate) / 100;
    grossVal = netVal + taxVal;
  } else {
    grossVal = vatAmountInput;
    netVal = grossVal / (1 + vatRate / 100);
    taxVal = grossVal - netVal;
  }

  // ─────────────────────────────────────────────────────────────
  // 5. BREAK-EVEN & CVP CALCULATOR STATE
  // ─────────────────────────────────────────────────────────────
  const [beFixedCost, setBeFixedCost] = useState(150000);
  const [beUnitPrice, setBeUnitPrice] = useState(500);
  const [beVarCost, setBeVarCost] = useState(300);
  const [beTargetProfit, setBeTargetProfit] = useState(50000);

  const contribMargin = beUnitPrice - beVarCost;
  const contribRatio = beUnitPrice > 0 ? (contribMargin / beUnitPrice) * 100 : 0;
  const breakEvenUnits = contribMargin > 0 ? Math.ceil(beFixedCost / contribMargin) : 0;
  const breakEvenRevenue = breakEvenUnits * beUnitPrice;
  const targetUnits = contribMargin > 0 ? Math.ceil((beFixedCost + beTargetProfit) / contribMargin) : 0;
  const targetRevenue = targetUnits * beUnitPrice;

  // ─────────────────────────────────────────────────────────────
  // 6. TIME VALUE OF MONEY & COMPOUND INTEREST STATE
  // ─────────────────────────────────────────────────────────────
  const [tvmPV, setTvmPV] = useState(50000);
  const [tvmRate, setTvmRate] = useState(12);
  const [tvmYears, setTvmYears] = useState(5);
  const [tvmCompounds, setTvmCompounds] = useState(12); // monthly
  const [tvmMonthlyAdd, setTvmMonthlyAdd] = useState(1000);

  // Future value calculation with monthly contributions
  const calculateFV = () => {
    const r = tvmRate / 100 / tvmCompounds;
    const n = tvmYears * tvmCompounds;
    let fvPV = tvmPV * Math.pow(1 + r, n);
    let fvPMT = 0;
    if (r > 0) {
      fvPMT = tvmMonthlyAdd * ((Math.pow(1 + r, n) - 1) / r);
    } else {
      fvPMT = tvmMonthlyAdd * n;
    }
    return Math.round(fvPV + fvPMT);
  };

  const fvTotal = calculateFV();
  const totalInvested = tvmPV + tvmMonthlyAdd * tvmYears * tvmCompounds;
  const totalInterest = Math.max(0, fvTotal - totalInvested);

  // ─────────────────────────────────────────────────────────────
  // COPY SUMMARY HANDLER
  // ─────────────────────────────────────────────────────────────
  const handleCopySummary = () => {
    let text = "";
    if (activeTool === "dictionary") {
      text = `📖 قاموس المحاسب الذكي:\n- مرجع شامل للبحث الفوري في المصطلحات المحاسبية باللغتين العربية والإنجليزية، مع الشرح المبسط والأمثلة وصياغة القيود المحاسبية.`;
    } else if (activeTool === "datavis") {
      text = `📊 تقرير تصور بيانات الدخل والمصروفات:\n- أداة تفاعلية متكاملة لتحليل الاتجاهات الشهرية، هيكل التكاليف، ومصادر الإيرادات عبر Recharts.`;
    } else if (activeTool === "dep") {
      text = `📊 تقرير إهلاك الأصول (${depName}):\n- تكلفة الأصل: ${depCost.toLocaleString()} ج.م\n- الخردة: ${depSalvage.toLocaleString()} ج.م\n- العمر الإنتاجي: ${depLife} سنوات\n- مصروف الإهلاك السنوي (${depMethod === "sl" ? "القسط الثابت" : depMethod === "ddb" ? "المتناقص المضاعف" : "مجموع السنين"}): ${currentYearDep.toLocaleString()} ج.م/سنة`;
    } else if (activeTool === "eq") {
      text = `⚖️ تقرير الميزانية والمعادلة المحاسبية:\n- إجمالي الأصول: ${totalAssets.toLocaleString()} ج.م\n- إجمالي الخصوم: ${totalLiab.toLocaleString()} ج.م\n- إجمالي حقوق الملكية: ${totalEquity.toLocaleString()} ج.م\n- الحالة: ${isBalanced ? "متوازنة 100%" : "غير متوازنة"}\n- رأس المال العامل: ${workingCapital.toLocaleString()} ج.م`;
    } else if (activeTool === "vat") {
      text = `🧾 تقرير ضريبة القيمة المضافة VAT (${vatRate}%):\n- المبلغ الصافي قبل الضريبة: ${Math.round(netVal).toLocaleString()} ج.م\n- قيمة الضريبة: ${Math.round(taxVal).toLocaleString()} ج.م\n- المبلغ الإجمالي الشامل: ${Math.round(grossVal).toLocaleString()} ج.م`;
    } else if (activeTool === "breakeven") {
      text = `🎯 تقرير نقطة التعادل CVP:\n- التكاليف الثابتة: ${beFixedCost.toLocaleString()} ج.م\n- هامش المساهمة للوحدة: ${contribMargin.toLocaleString()} ج.م (${contribRatio.toFixed(1)}%)\n- كمية التعادل: ${breakEvenUnits.toLocaleString()} وحدة (${breakEvenRevenue.toLocaleString()} ج.م)\n- للربح المستهدف (${beTargetProfit.toLocaleString()} ج.م): يلزم بيع ${targetUnits.toLocaleString()} وحدة`;
    } else if (activeTool === "ratios") {
      text = `📈 تقرير النسب المالية:\n- نسبة التداول: ${currentRatio.toFixed(2)}x\n- السيولة السريعة: ${quickRatio.toFixed(2)}x\n- هامش صافي الربح: ${netMargin.toFixed(1)}%\n- العائد على الملكية ROE: ${roe.toFixed(1)}%`;
    } else {
      text = `💰 تقرير القيمة المستقبلية والفائدة المركبة:\n- المبلغ الأولي: ${tvmPV.toLocaleString()} ج.م\n- المساهمة الشهرية: ${tvmMonthlyAdd.toLocaleString()} ج.م\n- النسبة السنوية: ${tvmRate}%\n- القيمة المستقبلية المتوقعة بعد ${tvmYears} سنوات: ${fvTotal.toLocaleString()} ج.م (أرباح فوائد: ${totalInterest.toLocaleString()} ج.م)`;
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 space-y-8 animate-fadeIn">
      {/* SECTION HEADER BANNER */}
      <div className="bg-gradient-to-br from-[#110e2e] via-[#1a1442] to-[#0c122c] border border-orange-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs font-black shadow-inner">
            <Calculator className="w-4 h-4 text-orange-400" />
            <span>حاسبات وأدوات مالية ومحاسبية معتمدة</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            حاسبة المحاسب التنفيذي والأدوات المالية الذكية
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            حزمة حاسبات احترافية متكاملة لحساب الإهلاك المركب، تسوية الضريبة VAT، تحليل التعادل CVP، موازنة الميزانية العمومية، وتوليد قيود اليومية أوتوماتيكياً.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-extrabold text-orange-300">
            <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>نتائج وحسابات لحظية</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>توليد قيود أوتوماتيكي</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>مطابقة ومعايير IFRS</span>
            </span>
          </div>
        </div>

        {/* Quick Actions & Copier Box */}
        <div className="z-10 w-full lg:w-auto shrink-0 bg-black/40 border border-white/10 p-5 rounded-2xl backdrop-blur-xl space-y-3 min-w-[260px]">
          <div className="flex items-center justify-between text-xs font-extrabold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>تصدير ومشاركة النتائج</span>
            </span>
            <span className="text-orange-400 font-black">جاهز للطباعة</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="flex-1 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 transition-all cursor-pointer hover:scale-102"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>تم النسخ للحافظة!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>نسخ ملخص الحسابات</span>
                </>
              )}
            </button>

            <button
              onClick={() => window.print()}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 cursor-pointer transition-all"
              title="طباعة التقرير"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* TOOLS TABS SWITCHER */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5">
        <button
          onClick={() => setActiveTool("dictionary")}
          className={`p-3.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 border text-center relative overflow-hidden ${
            activeTool === "dictionary"
              ? "bg-gradient-to-br from-indigo-600 via-blue-600 to-emerald-600 text-white border-indigo-400 shadow-xl shadow-indigo-600/30 scale-102"
              : "bg-[#0d1424] text-slate-300 border-white/10 hover:border-indigo-500/40 hover:text-white"
          }`}
        >
          <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded-full bg-indigo-500 text-white text-[9px] font-black">
            ذكي 📖
          </div>
          <BookOpen className="w-5 h-5 text-indigo-300" />
          <span>قاموس المحاسب</span>
        </button>

        <button
          onClick={() => setActiveTool("datavis")}
          className={`p-3.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 border text-center relative overflow-hidden ${
            activeTool === "datavis"
              ? "bg-gradient-to-br from-emerald-600 via-teal-600 to-indigo-800 text-white border-emerald-400 shadow-xl shadow-emerald-600/30 scale-102"
              : "bg-[#0d1424] text-slate-300 border-white/10 hover:border-emerald-500/40 hover:text-white"
          }`}
        >
          <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-black text-[9px] font-black">
            تفاعلي 📊
          </div>
          <BarChart3 className="w-5 h-5 text-emerald-300" />
          <span>تصور البيانات</span>
        </button>

        <button
          onClick={() => setActiveTool("trading")}
          className={`p-3.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 border text-center relative overflow-hidden ${
            activeTool === "trading"
              ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white border-indigo-400 shadow-xl shadow-indigo-600/30 scale-102"
              : "bg-[#0d1424] text-slate-300 border-white/10 hover:border-indigo-500/40 hover:text-white"
          }`}
        >
          <BarChart2 className="w-5 h-5 text-amber-300" />
          <span>محاكي التداول</span>
        </button>

        <button
          onClick={() => setActiveTool("dep")}
          className={`p-3.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 border text-center ${
            activeTool === "dep"
              ? "bg-gradient-to-br from-orange-600 to-amber-600 text-white border-orange-400 shadow-xl shadow-orange-600/30 scale-102"
              : "bg-[#0d1424] text-slate-300 border-white/10 hover:border-white/20 hover:text-white"
          }`}
        >
          <TrendingUp className="w-5 h-5 text-orange-400" />
          <span>حاسبة الإهلاك</span>
        </button>

        <button
          onClick={() => setActiveTool("vat")}
          className={`p-3.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 border text-center ${
            activeTool === "vat"
              ? "bg-gradient-to-br from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-xl shadow-emerald-600/30 scale-102"
              : "bg-[#0d1424] text-slate-300 border-white/10 hover:border-white/20 hover:text-white"
          }`}
        >
          <Receipt className="w-5 h-5 text-emerald-400" />
          <span>ضريبة VAT</span>
        </button>

        <button
          onClick={() => setActiveTool("eq")}
          className={`p-3.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 border text-center ${
            activeTool === "eq"
              ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-blue-400 shadow-xl shadow-blue-600/30 scale-102"
              : "bg-[#0d1424] text-slate-300 border-white/10 hover:border-white/20 hover:text-white"
          }`}
        >
          <Scale className="w-5 h-5 text-cyan-400" />
          <span>موازن المعادلة</span>
        </button>

        <button
          onClick={() => setActiveTool("breakeven")}
          className={`p-3.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 border text-center ${
            activeTool === "breakeven"
              ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white border-purple-400 shadow-xl shadow-purple-600/30 scale-102"
              : "bg-[#0d1424] text-slate-300 border-white/10 hover:border-white/20 hover:text-white"
          }`}
        >
          <PieChart className="w-5 h-5 text-purple-400" />
          <span>نقطة التعادل</span>
        </button>

        <button
          onClick={() => setActiveTool("ratios")}
          className={`p-3.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 border text-center ${
            activeTool === "ratios"
              ? "bg-gradient-to-br from-indigo-600 to-cyan-600 text-white border-indigo-400 shadow-xl shadow-indigo-600/30 scale-102"
              : "bg-[#0d1424] text-slate-300 border-white/10 hover:border-white/20 hover:text-white"
          }`}
        >
          <Activity className="w-5 h-5 text-indigo-400" />
          <span>النسب المالية</span>
        </button>

        <button
          onClick={() => setActiveTool("tvm")}
          className={`p-3.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 border text-center ${
            activeTool === "tvm"
              ? "bg-gradient-to-br from-amber-600 to-red-600 text-white border-amber-400 shadow-xl shadow-amber-600/30 scale-102"
              : "bg-[#0d1424] text-slate-300 border-white/10 hover:border-white/20 hover:text-white"
          }`}
        >
          <Coins className="w-5 h-5 text-amber-400" />
          <span>الفائدة المركبة</span>
        </button>
      </div>

      {/* ACTIVE TOOL CONTENT CONTAINER */}
      <div className="bg-[#0d1424] border border-indigo-500/25 rounded-3xl p-4 md:p-6 shadow-2xl space-y-6">

        {/* ─────────────────────────────────────────────────────────────
            TOOL 0: SMART ACCOUNTANT DICTIONARY (قاموس المحاسب الذكي)
           ───────────────────────────────────────────────────────────── */}
        {activeTool === "dictionary" && <SmartAccountantDictionary />}

        {/* ─────────────────────────────────────────────────────────────
            TOOL 1: FINANCIAL DATA VISUALIZER (تصور بيانات الدخل والمصروفات)
           ───────────────────────────────────────────────────────────── */}
        {activeTool === "datavis" && <FinancialDataVisualizer />}

        {/* ─────────────────────────────────────────────────────────────
            TOOL 1: ACCOUNTING TRADING SIMULATOR (محاكي تداول المحاسبة)
           ───────────────────────────────────────────────────────────── */}
        {activeTool === "trading" && <TradingSimulator />}

        {/* ─────────────────────────────────────────────────────────────
            TOOL 1: ASSET DEPRECIATION SUITE
           ───────────────────────────────────────────────────────────── */}
        {activeTool === "dep" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-400" />
                  <span>حاسبة إهلاك الأصول الثابتة وإعداد الجدول (Asset Depreciation)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  تطبيق حسابات الإهلاك بأشهر الطرق المحاسبية مع توليد القيد والتجديد التلقائي.
                </p>
              </div>

              {/* Method Selector */}
              <div className="flex items-center gap-1.5 bg-[#101a30] p-1.5 rounded-xl border border-white/10 text-xs font-extrabold shrink-0">
                <button
                  onClick={() => setDepMethod("sl")}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                    depMethod === "sl" ? "bg-orange-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  القسط الثابت
                </button>
                <button
                  onClick={() => setDepMethod("ddb")}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                    depMethod === "ddb" ? "bg-orange-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  المتناقص المضاعف
                </button>
                <button
                  onClick={() => setDepMethod("syd")}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                    depMethod === "syd" ? "bg-orange-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  مجموع السنين
                </button>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-[#101a30] p-4 rounded-2xl border border-white/10">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">اسم الأصل الثابت:</label>
                <input
                  type="text"
                  value={depName}
                  onChange={(e) => setDepName(e.target.value)}
                  className="w-full bg-[#080c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">تكلفة الشراء الأصلية:</label>
                <input
                  type="number"
                  value={depCost}
                  onChange={(e) => setDepCost(Number(e.target.value))}
                  className="w-full bg-[#080c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">قيمة الخردة المقدرة (Salvage):</label>
                <input
                  type="number"
                  value={depSalvage}
                  onChange={(e) => setDepSalvage(Number(e.target.value))}
                  className="w-full bg-[#080c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">العمر الإنتاجي (سنوات):</label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={depLife}
                  onChange={(e) => setDepLife(Number(e.target.value))}
                  className="w-full bg-[#080c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-orange-400"
                />
              </div>
            </div>

            {/* Main Result Card */}
            <div className="bg-gradient-to-r from-orange-500/15 via-amber-500/15 to-orange-500/15 border border-orange-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-right">
                <span className="text-xs font-bold text-orange-300 block">
                  مصروف الإهلاك للسنة الأولى ({depMethod === "sl" ? "القسط الثابت" : depMethod === "ddb" ? "المتناقص المضاعف" : "مجموع أرقام السنين"})
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white block">
                  {currentYearDep.toLocaleString()} جنيه / سنوياً
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs font-black shrink-0">
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-slate-200">
                  <span className="text-slate-400 font-normal block text-[10px]">القيمة القابلة للإهلاك:</span>
                  <span className="text-amber-400">{depBase.toLocaleString()} ج.م</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-slate-200">
                  <span className="text-slate-400 font-normal block text-[10px]">معدل الإهلاك:</span>
                  <span className="text-cyan-400">
                    {depMethod === "sl"
                      ? `${((1 / depLife) * 100).toFixed(1)}%`
                      : depMethod === "ddb"
                      ? `${(ddbRate * 100).toFixed(1)}%`
                      : "متغير"}
                  </span>
                </div>
              </div>
            </div>

            {/* Generated Journal Entry Box */}
            <div className="bg-[#080c1c] p-4 rounded-2xl border border-white/10 space-y-3">
              <div className="text-xs font-black text-amber-300 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                <span>قيد اليومية الأوتوماتيكي المقابل لإثبات الإهلاك (Journal Entry)</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-2 text-xs font-bold">
                <div className="flex justify-between text-red-300">
                  <span>من حـ/ مصروف إهلاك {depName}</span>
                  <span>{currentYearDep.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between text-emerald-300 pr-6">
                  <span>إلى حـ/ مجمع إهلاك {depName}</span>
                  <span>{currentYearDep.toLocaleString()} ج.م</span>
                </div>
                <div className="text-[10px] text-slate-400 pt-1 border-t border-white/5 font-normal">
                  (إثبات قيد الإهلاك السنوي للأصل بأسلوب {depMethod === "sl" ? "القسط الثابت" : depMethod === "ddb" ? "المتناقص المضاعف" : "مجموع السنين"})
                </div>
              </div>
            </div>

            {/* Yearly Schedule Table */}
            <div className="bg-[#080c1c] p-4 rounded-2xl border border-white/10 space-y-3">
              <div className="text-xs font-black text-slate-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-orange-400" />
                <span>جدول الإهلاك والقيمة الدفتريّة المتبقية عبر السنوات (Depreciation Schedule)</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-white/10 font-bold">
                      <th className="pb-2">السنة</th>
                      <th className="pb-2">مصروف الإهلاك</th>
                      <th className="pb-2">مجمع الإهلاك المتراكم</th>
                      <th className="pb-2">القيمة الدفتريّة للأصل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-bold">
                    {schedule.map((row) => (
                      <tr key={row.year} className="hover:bg-white/5 transition-colors">
                        <td className="py-2.5 text-orange-300">السنة {row.year}</td>
                        <td className="py-2.5 text-slate-200">{row.annual.toLocaleString()} ج.م</td>
                        <td className="py-2.5 text-amber-400">{row.accumDep.toLocaleString()} ج.م</td>
                        <td className="py-2.5 text-emerald-400">{row.bookVal.toLocaleString()} ج.م</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TOOL 2: VAT & INVOICE CALCULATOR
           ───────────────────────────────────────────────────────────── */}
        {activeTool === "vat" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-emerald-400" />
                  <span>حاسبة ضريبة القيمة المضافة والفواتير (VAT & Invoice Calculator)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  حساب الفواتير الصافية والشاملة للضريبة وتوليد القيود المحاسبية للضريبة المقبوضة أو المدفوعة.
                </p>
              </div>

              {/* VAT Type Switcher */}
              <div className="flex items-center gap-1.5 bg-[#101a30] p-1.5 rounded-xl border border-white/10 text-xs font-extrabold shrink-0">
                <button
                  onClick={() => setVatType("exclusive")}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                    vatType === "exclusive" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  غير شامل للضريبة (+VAT)
                </button>
                <button
                  onClick={() => setVatType("inclusive")}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                    vatType === "inclusive" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  شامل للضريبة (Incl. VAT)
                </button>
              </div>
            </div>

            {/* Inputs & Rate Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#101a30] p-4 rounded-2xl border border-white/10">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  المبلغ المدخل ({vatType === "exclusive" ? "قبل الضريبة" : "الشامل للضريبة"}):
                </label>
                <input
                  type="number"
                  value={vatAmountInput}
                  onChange={(e) => setVatAmountInput(Number(e.target.value))}
                  className="w-full bg-[#080c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">نسبة ضريبة القيمة المضافة %:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={vatRate}
                    onChange={(e) => setVatRate(Number(e.target.value))}
                    className="w-full bg-[#080c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-emerald-400"
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setVatRate(14)}
                      className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-cyan-300 hover:bg-white/10"
                    >
                      14% (مصر)
                    </button>
                    <button
                      onClick={() => setVatRate(15)}
                      className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-emerald-300 hover:bg-white/10"
                    >
                      15% (السعودية)
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">نوع العملية (لإعداد القيد):</label>
                <select
                  value={vatCategory}
                  onChange={(e) => setVatCategory(e.target.value as any)}
                  className="w-full bg-[#080c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-emerald-400"
                >
                  <option value="sales">عملية مبيعات (ضريبة مخرجات مجمعة)</option>
                  <option value="purchases">عملية مشتريات (ضريبة مدخلات مستردة)</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#080c1c] border border-white/10 rounded-2xl p-4 text-center space-y-1">
                <span className="text-[11px] font-bold text-slate-400 block">المبلغ الصافي (قبل الضريبة)</span>
                <span className="text-xl font-black text-white block">
                  {Math.round(netVal).toLocaleString()} ج.م
                </span>
              </div>

              <div className="bg-[#080c1c] border border-emerald-500/30 rounded-2xl p-4 text-center space-y-1">
                <span className="text-[11px] font-bold text-emerald-400 block">قيمة الضريبة المضافة ({vatRate}%)</span>
                <span className="text-2xl font-black text-emerald-400 block">
                  {Math.round(taxVal).toLocaleString()} ج.م
                </span>
              </div>

              <div className="bg-[#080c1c] border border-white/10 rounded-2xl p-4 text-center space-y-1">
                <span className="text-[11px] font-bold text-slate-400 block">المبلغ الإجمالي الشامل</span>
                <span className="text-xl font-black text-cyan-400 block">
                  {Math.round(grossVal).toLocaleString()} ج.م
                </span>
              </div>
            </div>

            {/* VAT Journal Entry Auto-Generator */}
            <div className="bg-[#080c1c] p-4 rounded-2xl border border-white/10 space-y-3">
              <div className="text-xs font-black text-emerald-300 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>قيد اليومية المحاسبي لضريبة القيمة المضافة ({vatCategory === "sales" ? "فاتورة مبيعات" : "فاتورة مشتريات"})</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-2 text-xs font-bold">
                {vatCategory === "sales" ? (
                  <>
                    <div className="flex justify-between text-red-300">
                      <span>من حـ/ النقدية بالصندوق / البنك (أو العملاء)</span>
                      <span>{Math.round(grossVal).toLocaleString()} ج.م</span>
                    </div>
                    <div className="flex justify-between text-emerald-300 pr-6">
                      <span>إلى حـ/ المبيعات (الصافي)</span>
                      <span>{Math.round(netVal).toLocaleString()} ج.م</span>
                    </div>
                    <div className="flex justify-between text-emerald-300 pr-6">
                      <span>إلى حـ/ ضريبة القيمة المضافة (مخرجات / دائنة)</span>
                      <span>{Math.round(taxVal).toLocaleString()} ج.م</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between text-red-300">
                      <span>من حـ/ المشتريات (الصافي)</span>
                      <span>{Math.round(netVal).toLocaleString()} ج.م</span>
                    </div>
                    <div className="flex justify-between text-red-300">
                      <span>من حـ/ ضريبة القيمة المضافة (مدخلات / مدينة مستردة)</span>
                      <span>{Math.round(taxVal).toLocaleString()} ج.م</span>
                    </div>
                    <div className="flex justify-between text-emerald-300 pr-6">
                      <span>إلى حـ/ النقدية / البنك (أو الموردون)</span>
                      <span>{Math.round(grossVal).toLocaleString()} ج.م</span>
                    </div>
                  </>
                )}

                <div className="text-[10px] text-slate-400 pt-1 border-t border-white/5 font-normal">
                  (إثبات معاملة {vatCategory === "sales" ? "مبيعات" : "مشتريات"} وتوجيه حساب ضريبة القيمة المضافة للجهة الضريبية)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TOOL 3: ACCOUNTING EQUATION BALANCER
           ───────────────────────────────────────────────────────────── */}
        {activeTool === "eq" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-cyan-400" />
                  <span>موازن ومحلل المعادلة المحاسبية ورأس المال العامل (Accounting Equation & Working Capital)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  فحص توازن الميزانية العمومية وتحليل مؤشرات رأس المال العامل والسيولة الهيكلية.
                </p>
              </div>

              <div
                className={`px-4 py-2 rounded-xl text-xs font-black border flex items-center gap-2 ${
                  isBalanced
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : "bg-red-500/20 text-red-300 border-red-500/30"
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>{isBalanced ? "الميزانية متوازنة 100% ✓" : `فارق غير متوازن: ${balanceDiff.toLocaleString()} ج.م`}</span>
              </div>
            </div>

            {/* Inputs Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Assets Section */}
              <div className="bg-[#101a30] p-4 rounded-2xl border border-cyan-500/30 space-y-3">
                <div className="text-xs font-black text-cyan-300 border-b border-cyan-500/20 pb-2">
                  🏛️ الأصول (Assets) = {totalAssets.toLocaleString()} ج.م
                </div>

                <div className="space-y-2.5 text-xs font-bold">
                  <div>
                    <label className="text-slate-300 block mb-1">الأصول المتداولة (النقدية، المخزون، المدينون):</label>
                    <input
                      type="number"
                      value={eqCurrAssets}
                      onChange={(e) => setEqCurrAssets(Number(e.target.value))}
                      className="w-full bg-[#080c1c] border border-white/10 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">الأصول غير المتداولة (الآلات، العقارات):</label>
                    <input
                      type="number"
                      value={eqNonCurrAssets}
                      onChange={(e) => setEqNonCurrAssets(Number(e.target.value))}
                      className="w-full bg-[#080c1c] border border-white/10 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Liabilities Section */}
              <div className="bg-[#101a30] p-4 rounded-2xl border border-red-500/30 space-y-3">
                <div className="text-xs font-black text-red-300 border-b border-red-500/20 pb-2">
                  💳 الخصوم (Liabilities) = {totalLiab.toLocaleString()} ج.م
                </div>

                <div className="space-y-2.5 text-xs font-bold">
                  <div>
                    <label className="text-slate-300 block mb-1">الخصوم المتداولة (الموردون، أوراق الدفع):</label>
                    <input
                      type="number"
                      value={eqCurrLiab}
                      onChange={(e) => setEqCurrLiab(Number(e.target.value))}
                      className="w-full bg-[#080c1c] border border-white/10 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">الخصوم طويلة الأجل (القروض البنكية):</label>
                    <input
                      type="number"
                      value={eqNonCurrLiab}
                      onChange={(e) => setEqNonCurrLiab(Number(e.target.value))}
                      className="w-full bg-[#080c1c] border border-white/10 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Equity Section */}
              <div className="bg-[#101a30] p-4 rounded-2xl border border-indigo-500/30 space-y-3">
                <div className="text-xs font-black text-indigo-300 border-b border-indigo-500/20 pb-2">
                  💎 حقوق الملكية (Equity) = {totalEquity.toLocaleString()} ج.م
                </div>

                <div className="space-y-2.5 text-xs font-bold">
                  <div>
                    <label className="text-slate-300 block mb-1">رأس المال المدفوع:</label>
                    <input
                      type="number"
                      value={eqCapital}
                      onChange={(e) => setEqCapital(Number(e.target.value))}
                      className="w-full bg-[#080c1c] border border-white/10 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">الأرباح المبقاة / المحتجزة:</label>
                    <input
                      type="number"
                      value={eqRetained}
                      onChange={(e) => setEqRetained(Number(e.target.value))}
                      className="w-full bg-[#080c1c] border border-white/10 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Working Capital Scorecard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#080c1c] p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 block">صافي رأس المال العامل (Working Capital)</span>
                <span className="text-2xl font-black text-emerald-400 block">
                  {workingCapital.toLocaleString()} ج.م
                </span>
                <p className="text-[10px] text-slate-400 font-medium">
                  الأصول المتداولة ({eqCurrAssets.toLocaleString()}) - الخصوم المتداولة ({eqCurrLiab.toLocaleString()})
                </p>
              </div>

              <div className="bg-[#080c1c] p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 block">نسبة رأس المال العامل (تغطية الالتزامات القصيرة)</span>
                <span className="text-2xl font-black text-cyan-400 block">
                  {workingCapitalRatio}x
                </span>
                <p className="text-[10px] text-slate-400 font-medium">
                  {Number(workingCapitalRatio) >= 1.5 ? "نسبة ممتازة وتوفر أماناً للسيولة التشغيلية" : "مستوى سيولة يحتاج للمتابعة"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TOOL 4: BREAK-EVEN & CVP ANALYSIS
           ───────────────────────────────────────────────────────────── */}
        {activeTool === "breakeven" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-400" />
                <span>حاسبة نقطة التعادل والتحليل المالي للارباح CVP (Cost-Volume-Profit)</span>
              </h3>
              <p className="text-xs text-slate-400">
                حساب حجم المبيعات الأدنى لتغطية التكاليف وتحديد المبيعات المطلوبة لتحقيق ربح مستهدف.
              </p>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-[#101a30] p-4 rounded-2xl border border-white/10">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">إجمالي التكاليف الثابتة:</label>
                <input
                  type="number"
                  value={beFixedCost}
                  onChange={(e) => setBeFixedCost(Number(e.target.value))}
                  className="w-full bg-[#080c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">سعر بيع الوحدة الواحدة:</label>
                <input
                  type="number"
                  value={beUnitPrice}
                  onChange={(e) => setBeUnitPrice(Number(e.target.value))}
                  className="w-full bg-[#080c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">التكلفة المتغيرة للوحدة:</label>
                <input
                  type="number"
                  value={beVarCost}
                  onChange={(e) => setBeVarCost(Number(e.target.value))}
                  className="w-full bg-[#080c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">الربح المستهدف (Target Profit):</label>
                <input
                  type="number"
                  value={beTargetProfit}
                  onChange={(e) => setBeTargetProfit(Number(e.target.value))}
                  className="w-full bg-[#080c1c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-purple-400"
                />
              </div>
            </div>

            {/* Results Grid Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#080c1c] border border-purple-500/30 rounded-2xl p-4 text-center space-y-1">
                <span className="text-[11px] font-bold text-slate-400 block">هامش المساهمة للوحدة</span>
                <span className="text-2xl font-black text-purple-400 block">{contribMargin.toLocaleString()} ج.م</span>
                <span className="text-[10px] text-slate-400 font-bold block">نسبة المساهمة: {contribRatio.toFixed(1)}%</span>
              </div>

              <div className="bg-[#080c1c] border border-amber-500/30 rounded-2xl p-4 text-center space-y-1">
                <span className="text-[11px] font-bold text-amber-300 block">نقطة التعادل (كمية)</span>
                <span className="text-2xl font-black text-amber-400 block">{breakEvenUnits.toLocaleString()} وحدة</span>
                <span className="text-[10px] text-slate-400 font-bold block">إيراد التعادل: {breakEvenRevenue.toLocaleString()} ج.م</span>
              </div>

              <div className="bg-[#080c1c] border border-emerald-500/30 rounded-2xl p-4 text-center space-y-1">
                <span className="text-[11px] font-bold text-emerald-300 block">لتحقيق الربح المستهدف</span>
                <span className="text-2xl font-black text-emerald-400 block">{targetUnits.toLocaleString()} وحدة</span>
                <span className="text-[10px] text-slate-400 font-bold block">مبيعات مطلوبة: {targetRevenue.toLocaleString()} ج.م</span>
              </div>

              <div className="bg-[#080c1c] border border-cyan-500/30 rounded-2xl p-4 text-center space-y-1">
                <span className="text-[11px] font-bold text-cyan-300 block">هامش الأمان المقدر</span>
                <span className="text-2xl font-black text-cyan-400 block">
                  {targetUnits > breakEvenUnits ? `${(((targetUnits - breakEvenUnits) / targetUnits) * 100).toFixed(1)}%` : "0%"}
                </span>
                <span className="text-[10px] text-slate-400 font-bold block">مؤشر درجة خطورة المبيعات</span>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TOOL 5: FINANCIAL RATIOS CALCULATOR
           ───────────────────────────────────────────────────────────── */}
        {activeTool === "ratios" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" />
                <span>حاسبة ومحلل النسب المالية (Financial Ratios Suite)</span>
              </h3>
              <p className="text-xs text-slate-400">
                حساب مؤشرات السيولة، الربحية، والعائد على رأس المال بمدخلات مرنة.
              </p>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#101a30] p-4 rounded-2xl border border-white/10 text-xs font-bold">
              <div>
                <label className="text-slate-300 block mb-1">المبيعات:</label>
                <input
                  type="number"
                  value={rRevenue}
                  onChange={(e) => setRRevenue(Number(e.target.value))}
                  className="w-full bg-[#080c1c] border border-white/10 rounded-xl p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">تكلفة المبيعات:</label>
                <input
                  type="number"
                  value={rCogs}
                  onChange={(e) => setRCogs(Number(e.target.value))}
                  className="w-full bg-[#080c1c] border border-white/10 rounded-xl p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">المصروفات التشغيلية:</label>
                <input
                  type="number"
                  value={rOpExp}
                  onChange={(e) => setROpExp(Number(e.target.value))}
                  className="w-full bg-[#080c1c] border border-white/10 rounded-xl p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">الأصول المتداولة:</label>
                <input
                  type="number"
                  value={rCurrAssets}
                  onChange={(e) => setRCurrAssets(Number(e.target.value))}
                  className="w-full bg-[#080c1c] border border-white/10 rounded-xl p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">الخصوم المتداولة:</label>
                <input
                  type="number"
                  value={rCurrLiab}
                  onChange={(e) => setRCurrLiab(Number(e.target.value))}
                  className="w-full bg-[#080c1c] border border-white/10 rounded-xl p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">المخزون السلعي:</label>
                <input
                  type="number"
                  value={rInventory}
                  onChange={(e) => setRInventory(Number(e.target.value))}
                  className="w-full bg-[#080c1c] border border-white/10 rounded-xl p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">حقوق الملكية:</label>
                <input
                  type="number"
                  value={rEquity}
                  onChange={(e) => setREquity(Number(e.target.value))}
                  className="w-full bg-[#080c1c] border border-white/10 rounded-xl p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">إجمالي الأصول:</label>
                <input
                  type="number"
                  value={rTotalAssets}
                  onChange={(e) => setRTotalAssets(Number(e.target.value))}
                  className="w-full bg-[#080c1c] border border-white/10 rounded-xl p-2 text-white"
                />
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#080c1c] border border-indigo-500/30 rounded-2xl p-4 text-center space-y-1">
                <span className="text-[11px] font-bold text-slate-400 block">نسبة التداول</span>
                <span className="text-2xl font-black text-indigo-400 block">{currentRatio.toFixed(2)}x</span>
                <span className="text-[10px] text-slate-400 font-bold block">الهدف ≥ 1.5x</span>
              </div>

              <div className="bg-[#080c1c] border border-cyan-500/30 rounded-2xl p-4 text-center space-y-1">
                <span className="text-[11px] font-bold text-slate-400 block">السيولة السريعة</span>
                <span className="text-2xl font-black text-cyan-400 block">{quickRatio.toFixed(2)}x</span>
                <span className="text-[10px] text-slate-400 font-bold block">بدون المخزون</span>
              </div>

              <div className="bg-[#080c1c] border border-emerald-500/30 rounded-2xl p-4 text-center space-y-1">
                <span className="text-[11px] font-bold text-slate-400 block">هامش صافي الربح</span>
                <span className="text-2xl font-black text-emerald-400 block">{netMargin.toFixed(1)}%</span>
                <span className="text-[10px] text-slate-400 font-bold block">صافي الربح: {netIncome.toLocaleString()} ج.م</span>
              </div>

              <div className="bg-[#080c1c] border border-amber-500/30 rounded-2xl p-4 text-center space-y-1">
                <span className="text-[11px] font-bold text-slate-400 block">العائد على الملكية ROE</span>
                <span className="text-2xl font-black text-amber-400 block">{roe.toFixed(1)}%</span>
                <span className="text-[10px] text-slate-400 font-bold block">ROA: {roa.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TOOL 6: TIME VALUE OF MONEY & COMPOUND INTEREST
           ───────────────────────────────────────────────────────────── */}
        {activeTool === "tvm" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-400" />
                <span>حاسبة القيمة الزمنية للنقود والفائدة المركبة (Time Value of Money & Compound Interest)</span>
              </h3>
              <p className="text-xs text-slate-400">
                حساب النمو المتوقع للاستثمارات والمدخرات مع المساهمات الدورية المركبة.
              </p>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-[#101a30] p-4 rounded-2xl border border-white/10 text-xs font-bold">
              <div>
                <label className="text-slate-300 block mb-1">المبلغ الأولي (PV):</label>
                <input
                  type="number"
                  value={tvmPV}
                  onChange={(e) => setTvmPV(Number(e.target.value))}
                  className="w-full bg-[#080c1c] border border-white/10 rounded-xl p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">المساهمة الشهرية الإضافية:</label>
                <input
                  type="number"
                  value={tvmMonthlyAdd}
                  onChange={(e) => setTvmMonthlyAdd(Number(e.target.value))}
                  className="w-full bg-[#080c1c] border border-white/10 rounded-xl p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">معدل الفائدة/العائد السنوي %:</label>
                <input
                  type="number"
                  value={tvmRate}
                  onChange={(e) => setTvmRate(Number(e.target.value))}
                  className="w-full bg-[#080c1c] border border-white/10 rounded-xl p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">عدد السنوات (N):</label>
                <input
                  type="number"
                  value={tvmYears}
                  onChange={(e) => setTvmYears(Number(e.target.value))}
                  className="w-full bg-[#080c1c] border border-white/10 rounded-xl p-2 text-white"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="text-slate-300 block mb-1">التكرار بالسنة:</label>
                <select
                  value={tvmCompounds}
                  onChange={(e) => setTvmCompounds(Number(e.target.value))}
                  className="w-full bg-[#080c1c] border border-white/10 rounded-xl p-2 text-white"
                >
                  <option value={12}>شهرياً (12 مرة)</option>
                  <option value={4}>ربع سنوي (4 مرات)</option>
                  <option value={1}>سنوياً (مرة واحدة)</option>
                </select>
              </div>
            </div>

            {/* Results Display */}
            <div className="bg-gradient-to-r from-amber-500/15 via-red-500/15 to-amber-500/15 border border-amber-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-right">
                <span className="text-xs font-bold text-amber-300 block">
                  القيمة المستقبلية الكلية المتوقعة (Future Value - FV)
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white block">
                  {fvTotal.toLocaleString()} جنيه
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs font-black shrink-0">
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-slate-200">
                  <span className="text-slate-400 font-normal block text-[10px]">إجمالي الأموال المستثمرة:</span>
                  <span className="text-slate-200">{totalInvested.toLocaleString()} ج.م</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-slate-200">
                  <span className="text-slate-400 font-normal block text-[10px]">صافي أرباح العائد المركب:</span>
                  <span className="text-emerald-400">{totalInterest.toLocaleString()} ج.م</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
