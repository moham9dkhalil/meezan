import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart as PieChartIcon,
  BarChart3,
  Sliders,
  Sparkles,
  Download,
  RotateCcw,
  PlusCircle,
  Edit3,
  Calendar,
  Check,
  AlertTriangle,
  Lightbulb,
  Building2,
  ShoppingCart,
  HardHat,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Info,
  CheckCircle2,
  ListFilter
} from "lucide-react";

// Types
export interface MonthlyData {
  month: string;
  monthShort: string;
  income: number;
  expenses: number;
  profit: number;
  margin: number;
}

export interface CategoryBreakdown {
  name: string;
  value: number;
  color: string;
  icon?: string;
}

// Default Presets
const PRESET_SCENARIOS = {
  tech: {
    name: "شركة خدمات وتقنية",
    icon: Building2,
    description: "نموذج اشتراكات ورسوم استشارية مع مصروفات رواتب وسيرفرات",
    data2026: [
      { month: "يناير", monthShort: "يناير", income: 85000, expenses: 52000 },
      { month: "فبراير", monthShort: "فبراير", income: 92000, expenses: 54000 },
      { month: "مارس", monthShort: "مارس", income: 105000, expenses: 58000 },
      { month: "أبريل", monthShort: "أبريل", income: 98000, expenses: 56000 },
      { month: "مايو", monthShort: "مايو", income: 112000, expenses: 61000 },
      { month: "يونيو", monthShort: "يونيو", income: 128000, expenses: 65000 },
      { month: "يوليو", monthShort: "يوليو", income: 120000, expenses: 63000 },
      { month: "أغسطس", monthShort: "أغسطس", income: 135000, expenses: 68000 },
      { month: "سبتمبر", monthShort: "سبتمبر", income: 142000, expenses: 70000 },
      { month: "أكتوبر", monthShort: "أكتوبر", income: 160000, expenses: 75000 },
      { month: "نوفمبر", monthShort: "نوفمبر", income: 155000, expenses: 72000 },
      { month: "ديسمبر", monthShort: "ديسمبر", income: 175000, expenses: 80000 }
    ],
    expensesBreakdown: [
      { name: "رواتب ومستحقات", value: 380000, color: "#3b82f6" },
      { name: "تكنولوجيا وسيرفرات", value: 120000, color: "#06b6d4" },
      { name: "تسويق وإعلانات", value: 110000, color: "#8b5cf6" },
      { name: "إيجار ومرافق", value: 90000, color: "#f59e0b" },
      { name: "إهلاك ومصروفات أخرى", value: 54000, color: "#ec4899" }
    ],
    incomeSources: [
      { name: "اشتراكات SaaS شهرية", value: 580000, color: "#10b981" },
      { name: "عقود استشارية", value: 420000, color: "#6366f1" },
      { name: "تطوير مخصص", value: 310000, color: "#3b82f6" },
      { name: "دعم فني وصيانة", value: 197000, color: "#f59e0b" }
    ]
  },
  ecommerce: {
    name: "متجر تجارة إلكترونية",
    icon: ShoppingCart,
    description: "مبيعات بضائع سريعة الدوران مع تكاليف شحن وتوريد وإعلانات",
    data2026: [
      { month: "يناير", monthShort: "يناير", income: 120000, expenses: 88000 },
      { month: "فبراير", monthShort: "فبراير", income: 110000, expenses: 82000 },
      { month: "مارس", monthShort: "مارس", income: 145000, expenses: 102000 },
      { month: "أبريل", monthShort: "أبريل", income: 160000, expenses: 115000 },
      { month: "مايو", monthShort: "مايو", income: 130000, expenses: 95000 },
      { month: "يونيو", monthShort: "يونيو", income: 125000, expenses: 90000 },
      { month: "يوليو", monthShort: "يوليو", income: 140000, expenses: 98000 },
      { month: "أغسطس", monthShort: "أغسطس", income: 155000, expenses: 108000 },
      { month: "سبتمبر", monthShort: "سبتمبر", income: 165000, expenses: 112000 },
      { month: "أكتوبر", monthShort: "أكتوبر", income: 180000, expenses: 122000 },
      { month: "نوفمبر", monthShort: "نوفمبر", income: 230000, expenses: 155000 }, // البلاك فرايدي
      { month: "ديسمبر", monthShort: "ديسمبر", income: 210000, expenses: 140000 }
    ],
    expensesBreakdown: [
      { name: "تكلفة البضاعة المباعة (COGS)", value: 650000, color: "#ef4444" },
      { name: "إعلانات وممولة", value: 280000, color: "#8b5cf6" },
      { name: "شحن وتوصيل", value: 180000, color: "#f59e0b" },
      { name: "تغليف وتخزين", value: 110000, color: "#06b6d4" },
      { name: "عمولات بوابة الدفع", value: 87000, color: "#10b981" }
    ],
    incomeSources: [
      { name: "مبيعات الموقع الإلكتروني", value: 1150000, color: "#10b981" },
      { name: "مبيعات التطبيق الذكي", value: 480000, color: "#3b82f6" },
      { name: "مبيعات المنصات الشريكة", value: 240000, color: "#8b5cf6" }
    ]
  },
  contracting: {
    name: "مؤسسة مقاولات وتوريدات",
    icon: HardHat,
    description: "تدفقات نقدية مرتبطة بدفعات المشاريع والمستخلصات المحاسبية",
    data2026: [
      { month: "يناير", monthShort: "يناير", income: 220000, expenses: 180000 },
      { month: "فبراير", monthShort: "فبراير", income: 190000, expenses: 165000 },
      { month: "مارس", monthShort: "مارس", income: 310000, expenses: 240000 },
      { month: "أبريل", monthShort: "أبريل", income: 150000, expenses: 140000 },
      { month: "مايو", monthShort: "مايو", income: 280000, expenses: 210000 },
      { month: "يونيو", monthShort: "يونيو", income: 340000, expenses: 260000 },
      { month: "يوليو", monthShort: "يوليو", income: 180000, expenses: 160000 },
      { month: "أغسطس", monthShort: "أغسطس", income: 290000, expenses: 220000 },
      { month: "سبتمبر", monthShort: "سبتمبر", income: 320000, expenses: 250000 },
      { month: "أكتوبر", monthShort: "أكتوبر", income: 410000, expenses: 310000 },
      { month: "نوفمبر", monthShort: "نوفمبر", income: 260000, expenses: 210000 },
      { month: "ديسمبر", monthShort: "ديسمبر", income: 380000, expenses: 290000 }
    ],
    expensesBreakdown: [
      { name: "مواد خام ومستلزمات", value: 1100000, color: "#f59e0b" },
      { name: "أجور عمالة ومقاولين", value: 850000, color: "#3b82f6" },
      { name: "إيجار معدات وآليات", value: 380000, color: "#06b6d4" },
      { name: "تراخيص وتأمين", value: 180000, color: "#8b5cf6" },
      { name: "مصاريف إدارية", value: 125000, color: "#ec4899" }
    ],
    incomeSources: [
      { name: "مستخلصات تنفيذ مشاريع", value: 2100000, color: "#10b981" },
      { name: "عقود صيانة وتشغيل", value: 850000, color: "#3b82f6" },
      { name: "توريدات خامات", value: 380000, color: "#f59e0b" }
    ]
  }
};

export function FinancialDataVisualizer() {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<keyof typeof PRESET_SCENARIOS>("tech");
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [activeChartView, setActiveChartView] = useState<"trend" | "category" | "sources" | "quarterly">("trend");
  const [chartStyle, setChartStyle] = useState<"area" | "bar" | "line">("area");
  
  // Custom Editable Monthly Data
  const [monthlyList, setMonthlyList] = useState(() => {
    return PRESET_SCENARIOS.tech.data2026;
  });

  const [expensesCategoryList, setExpensesCategoryList] = useState(() => {
    return PRESET_SCENARIOS.tech.expensesBreakdown;
  });

  const [incomeSourcesList, setIncomeSourcesList] = useState(() => {
    return PRESET_SCENARIOS.tech.incomeSources;
  });

  // Switch Scenario Preset
  const handleSelectScenario = (key: keyof typeof PRESET_SCENARIOS) => {
    setSelectedScenarioKey(key);
    const scenario = PRESET_SCENARIOS[key];
    setMonthlyList(scenario.data2026);
    setExpensesCategoryList(scenario.expensesBreakdown);
    setIncomeSourcesList(scenario.incomeSources);
  };

  // Modify month value
  const handleUpdateMonthVal = (index: number, field: "income" | "expenses", value: number) => {
    const updated = [...monthlyList];
    updated[index] = {
      ...updated[index],
      [field]: Math.max(0, value)
    };
    setMonthlyList(updated);
  };

  // Computed Monthly Metrics
  const computedMonthlyData: MonthlyData[] = useMemo(() => {
    return monthlyList.map((m) => {
      const profit = m.income - m.expenses;
      const margin = m.income > 0 ? (profit / m.income) * 100 : 0;
      return {
        ...m,
        profit,
        margin: parseFloat(margin.toFixed(1))
      };
    });
  }, [monthlyList]);

  // Totals & Annual KPI Calculations
  const totalAnnualIncome = useMemo(() => computedMonthlyData.reduce((acc, curr) => acc + curr.income, 0), [computedMonthlyData]);
  const totalAnnualExpenses = useMemo(() => computedMonthlyData.reduce((acc, curr) => acc + curr.expenses, 0), [computedMonthlyData]);
  const totalAnnualProfit = totalAnnualIncome - totalAnnualExpenses;
  const overallNetMargin = totalAnnualIncome > 0 ? (totalAnnualProfit / totalAnnualIncome) * 100 : 0;
  const avgMonthlyIncome = Math.round(totalAnnualIncome / 12);
  const avgMonthlyExpense = Math.round(totalAnnualExpenses / 12);
  const expenseToIncomeRatio = totalAnnualIncome > 0 ? (totalAnnualExpenses / totalAnnualIncome) * 100 : 0;

  // Best & Lowest Profit Month
  const sortedMonthsByIncome = [...computedMonthlyData].sort((a, b) => b.income - a.income);
  const bestIncomeMonth = sortedMonthsByIncome[0];
  const sortedMonthsByProfit = [...computedMonthlyData].sort((a, b) => b.profit - a.profit);
  const highestProfitMonth = sortedMonthsByProfit[0];

  // Quarterly Data Aggregation (Q1, Q2, Q3, Q4)
  const quarterlyData = useMemo(() => {
    const quarters = [
      { name: "الربع الأول Q1 (يناير-مارس)", income: 0, expenses: 0, profit: 0 },
      { name: "الربع الثاني Q2 (أبريل-يونيو)", income: 0, expenses: 0, profit: 0 },
      { name: "الربع الثالث Q3 (يوليو-سبتمبر)", income: 0, expenses: 0, profit: 0 },
      { name: "الربع الرابع Q4 (أكتوبر-ديسمبر)", income: 0, expenses: 0, profit: 0 }
    ];

    computedMonthlyData.forEach((item, idx) => {
      const qIndex = Math.floor(idx / 3);
      if (quarters[qIndex]) {
        quarters[qIndex].income += item.income;
        quarters[qIndex].expenses += item.expenses;
        quarters[qIndex].profit += item.profit;
      }
    });

    return quarters;
  }, [computedMonthlyData]);

  // Export CSV Handler
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,الشهر,الدخل (إيرادات),المصروفات,صافي الربح,هامش الربح %\n";
    computedMonthlyData.forEach((row) => {
      csvContent += `${row.month},${row.income},${row.expenses},${row.profit},${row.margin}%\n`;
    });
    csvContent += `الإجمالي السنوي,${totalAnnualIncome},${totalAnnualExpenses},${totalAnnualProfit},${overallNetMargin.toFixed(1)}%\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `تقرير_اتجاهات_الدخل_والمصروفات_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format Currency Helper
  const fmt = (num: number) => num.toLocaleString() + " ج.م";

  return (
    <div className="space-y-6 animate-fadeIn text-right dir-rtl">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#101935] p-5 rounded-2xl border border-indigo-500/30 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <BarChart3 className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>أداة تصور بيانات الدخل والمصروفات السنوية</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                  تفاعلي Recharts 📊
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                تحليل اتجاهات التدفق النقدي، هيكل المصروفات، ومراقبة الربحية مع لوحة تحكم وتعديل حية.
              </p>
            </div>
          </div>
        </div>

        {/* Year & Export Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center bg-black/40 border border-white/10 p-1 rounded-xl text-xs font-bold">
            {[2026, 2025, 2024].map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  selectedYear === year
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-black cursor-pointer transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>تصدير CSV</span>
          </button>
        </div>
      </div>

      {/* SCENARIO PRESETS BAR */}
      <div className="p-4 rounded-2xl bg-[#0c1326] border border-white/10 space-y-3">
        <div className="flex items-center justify-between text-xs font-extrabold text-slate-300">
          <span className="flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>اختر نموذج النشاط أو حمل بيانات تجريبية:</span>
          </span>
          <span className="text-[11px] text-slate-400">يمكنك تعديل الأرقام بحرية أسفل اللوحة</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(Object.keys(PRESET_SCENARIOS) as Array<keyof typeof PRESET_SCENARIOS>).map((key) => {
            const scenario = PRESET_SCENARIOS[key];
            const Icon = scenario.icon;
            const isSelected = selectedScenarioKey === key;

            return (
              <button
                key={key}
                onClick={() => handleSelectScenario(key)}
                className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer flex items-start gap-3 relative overflow-hidden ${
                  isSelected
                    ? "bg-gradient-to-br from-indigo-950/80 to-purple-950/80 border-indigo-400/80 ring-1 ring-indigo-400/40 shadow-xl"
                    : "bg-black/30 border-white/10 hover:border-white/20 hover:bg-white/5"
                }`}
              >
                <span className={`p-2 rounded-lg shrink-0 ${isSelected ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-400"}`}>
                  <Icon className="w-5 h-5" />
                </span>
                <div className="space-y-1">
                  <h4 className={`text-xs font-black ${isSelected ? "text-white" : "text-slate-200"}`}>
                    {scenario.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {scenario.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* TOP SUMMARY KPI METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* KPI 1: Annual Total Income */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0c1836] to-[#081026] border border-emerald-500/30 space-y-2 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>إجمالي الدخل السنوي</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black">
              +14.2% مقارنة بالعام السابق
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 tracking-tight">
            {fmt(totalAnnualIncome)}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            متوسط شهري: <span className="text-white font-bold">{fmt(avgMonthlyIncome)}</span>
          </p>
        </div>

        {/* KPI 2: Annual Total Expenses */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1d0e1c] to-[#120813] border border-rose-500/30 space-y-2 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-rose-400" />
              <span>إجمالي المصروفات السنوية</span>
            </span>
            <span className="text-[10px] text-rose-300 font-bold bg-rose-500/20 px-2 py-0.5 rounded-full">
              {expenseToIncomeRatio.toFixed(1)}% من الإيرادات
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-400 tracking-tight">
            {fmt(totalAnnualExpenses)}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            متوسط شهري: <span className="text-white font-bold">{fmt(avgMonthlyExpense)}</span>
          </p>
        </div>

        {/* KPI 3: Net Annual Profit & Margin */}
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${
          totalAnnualProfit >= 0
            ? "from-[#0c2420] to-[#071714] border-cyan-500/30"
            : "from-[#290c0c] to-[#1a0707] border-red-500/40"
        } border space-y-2 relative overflow-hidden shadow-lg`}>
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-cyan-400" />
              <span>صافي الربح السنوي</span>
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              overallNetMargin >= 25
                ? "bg-emerald-500/20 text-emerald-300"
                : overallNetMargin >= 10
                ? "bg-amber-500/20 text-amber-300"
                : "bg-rose-500/20 text-rose-300"
            }`}>
              هامش: {overallNetMargin.toFixed(1)}%
            </span>
          </div>
          <div className={`text-xl sm:text-2xl font-black tracking-tight ${totalAnnualProfit >= 0 ? "text-cyan-300" : "text-rose-400"}`}>
            {fmt(totalAnnualProfit)}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            أعلى شهر ربحية: <span className="text-amber-300 font-bold">{highestProfitMonth?.month} ({fmt(highestProfitMonth?.profit || 0)})</span>
          </p>
        </div>

        {/* KPI 4: Financial Health Index */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#181333] to-[#0d0a1f] border border-purple-500/30 space-y-2 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>مؤشر الصحة المالية</span>
            </span>
            <span className="text-[10px] text-purple-300 font-black bg-purple-500/20 px-2 py-0.5 rounded-full">
              آمن ومتزن 🟢
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-purple-300 tracking-tight flex items-center gap-2">
            <span>{overallNetMargin >= 20 ? "ممتاز (A+)" : overallNetMargin >= 10 ? "جيد جداً (B)" : "يحتاج مراجعة (C)"}</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            تغطية الإيرادات للمصروفات: <span className="text-white font-bold">{(totalAnnualIncome / (totalAnnualExpenses || 1)).toFixed(2)}x</span>
          </p>
        </div>
      </div>

      {/* MAIN CHART CONTAINER & CONTROLS */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#090f21] border border-indigo-500/30 space-y-6 shadow-2xl">
        {/* CHART TABS AND TYPE TOGGLE */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveChartView("trend")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
                activeChartView === "trend"
                  ? "bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30"
                  : "bg-white/5 text-slate-300 border-white/5 hover:text-white"
              }`}
            >
              <BarChart3 className="w-4 h-4 text-amber-300" />
              <span>اتجاهات الدخل والمصروفات (12 شهر)</span>
            </button>

            <button
              onClick={() => setActiveChartView("category")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
                activeChartView === "category"
                  ? "bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30"
                  : "bg-white/5 text-slate-300 border-white/5 hover:text-white"
              }`}
            >
              <PieChartIcon className="w-4 h-4 text-rose-400" />
              <span>هيكل المصروفات</span>
            </button>

            <button
              onClick={() => setActiveChartView("sources")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
                activeChartView === "sources"
                  ? "bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30"
                  : "bg-white/5 text-slate-300 border-white/5 hover:text-white"
              }`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>مصادر الإيرادات</span>
            </button>

            <button
              onClick={() => setActiveChartView("quarterly")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
                activeChartView === "quarterly"
                  ? "bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30"
                  : "bg-white/5 text-slate-300 border-white/5 hover:text-white"
              }`}
            >
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>المقارنة الربع سنوية (Q1-Q4)</span>
            </button>
          </div>

          {/* Style Selector if Trend View */}
          {activeChartView === "trend" && (
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-bold shrink-0">
              <button
                onClick={() => setChartStyle("area")}
                className={`px-3 py-1 rounded-lg cursor-pointer ${chartStyle === "area" ? "bg-indigo-600 text-white font-extrabold" : "text-slate-400"}`}
              >
                مساحات Area
              </button>
              <button
                onClick={() => setChartStyle("bar")}
                className={`px-3 py-1 rounded-lg cursor-pointer ${chartStyle === "bar" ? "bg-indigo-600 text-white font-extrabold" : "text-slate-400"}`}
              >
                أعمدة Bar
              </button>
              <button
                onClick={() => setChartStyle("line")}
                className={`px-3 py-1 rounded-lg cursor-pointer ${chartStyle === "line" ? "bg-indigo-600 text-white font-extrabold" : "text-slate-400"}`}
              >
                خطوط Line
              </button>
            </div>
          )}
        </div>

        {/* RENDER ACTIVE RECHARTS GRAPH */}
        <div className="w-full h-80 sm:h-96 min-h-[320px] pt-2">
          {/* VIEW 1: MONTHLY TRENDS CHART */}
          {activeChartView === "trend" && (
            <ResponsiveContainer width="100%" height="100%">
              {chartStyle === "area" ? (
                <AreaChart data={computedMonthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 11, fontWeight: "bold" }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} tickFormatter={(val) => `${(val / 1000).toFixed(0)}ك`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0c142c", borderColor: "#38bdf8", borderRadius: "16px", color: "#fff", fontSize: "12px", textAlign: "right" }}
                    formatter={(val: any) => [fmt(Number(val)), ""]}
                  />
                  <Legend wrapperStyle={{ paddingTop: "15px", fontSize: "12px", fontWeight: "bold" }} />
                  <Area type="monotone" dataKey="income" name="إجمالي الدخل (الإيرادات)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#incomeGrad)" />
                  <Area type="monotone" dataKey="expenses" name="المصروفات التشغيلية" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#expenseGrad)" />
                  <Area type="monotone" dataKey="profit" name="صافي الربح" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#profitGrad)" />
                </AreaChart>
              ) : chartStyle === "bar" ? (
                <BarChart data={computedMonthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 11, fontWeight: "bold" }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} tickFormatter={(val) => `${(val / 1000).toFixed(0)}ك`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0c142c", borderColor: "#38bdf8", borderRadius: "16px", color: "#fff", fontSize: "12px", textAlign: "right" }}
                    formatter={(val: any) => [fmt(Number(val)), ""]}
                  />
                  <Legend wrapperStyle={{ paddingTop: "15px", fontSize: "12px", fontWeight: "bold" }} />
                  <Bar dataKey="income" name="إجمالي الدخل" fill="#10b981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expenses" name="المصروفات" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="profit" name="صافي الربح" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={computedMonthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 11, fontWeight: "bold" }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} tickFormatter={(val) => `${(val / 1000).toFixed(0)}ك`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0c142c", borderColor: "#38bdf8", borderRadius: "16px", color: "#fff", fontSize: "12px", textAlign: "right" }}
                    formatter={(val: any) => [fmt(Number(val)), ""]}
                  />
                  <Legend wrapperStyle={{ paddingTop: "15px", fontSize: "12px", fontWeight: "bold" }} />
                  <Line type="monotone" dataKey="income" name="إجمالي الدخل" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="expenses" name="المصروفات" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="profit" name="صافي الربح" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          )}

          {/* VIEW 2: EXPENSES CATEGORY BREAKDOWN (Pie/Bar) */}
          {activeChartView === "category" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full items-center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={expensesCategoryList}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {expensesCategoryList.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0c142c", borderColor: "#f43f5e", borderRadius: "16px", color: "#fff", fontSize: "12px", textAlign: "right" }}
                    formatter={(val: any) => [fmt(Number(val)), "المبلغ"]}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend List Table */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black text-slate-300 border-b border-white/10 pb-2 flex items-center justify-between">
                  <span>تصنيف المصروفات التشغيلية</span>
                  <span>المبلغ الإجمالي</span>
                </h4>
                {expensesCategoryList.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-200 font-bold">{item.name}</span>
                    </div>
                    <span className="text-white font-black">{fmt(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 3: INCOME SOURCES BREAKDOWN */}
          {activeChartView === "sources" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full items-center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={incomeSourcesList}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {incomeSourcesList.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0c142c", borderColor: "#10b981", borderRadius: "16px", color: "#fff", fontSize: "12px", textAlign: "right" }}
                    formatter={(val: any) => [fmt(Number(val)), "المبلغ"]}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-2.5">
                <h4 className="text-xs font-black text-slate-300 border-b border-white/10 pb-2 flex items-center justify-between">
                  <span>توزيع مصادر الإيرادات والمبيعات</span>
                  <span>القيمة المقدرة</span>
                </h4>
                {incomeSourcesList.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-200 font-bold">{item.name}</span>
                    </div>
                    <span className="text-emerald-400 font-black">{fmt(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 4: QUARTERLY (Q1 - Q4) BAR CHART */}
          {activeChartView === "quarterly" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quarterlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11, fontWeight: "bold" }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} tickFormatter={(val) => `${(val / 1000).toFixed(0)}ك`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0c142c", borderColor: "#38bdf8", borderRadius: "16px", color: "#fff", fontSize: "12px", textAlign: "right" }}
                  formatter={(val: any) => [fmt(Number(val)), ""]}
                />
                <Legend wrapperStyle={{ paddingTop: "15px", fontSize: "12px", fontWeight: "bold" }} />
                <Bar dataKey="income" name="إيرادات الربع" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expenses" name="مصروفات الربع" fill="#f43f5e" radius={[8, 8, 0, 0]} />
                <Bar dataKey="profit" name="صافي ربح الربع" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* AI FINANCIAL ANALYSIS & INSIGHTS CARD */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0d162d] via-[#101b3b] to-[#0c142c] border border-amber-500/30 space-y-3 shadow-lg">
        <div className="flex items-center gap-2 text-amber-300 font-black text-sm">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>تحليل وتوصيات ميزان المالي المحاسبي:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 block">شهر الذروة الإيرادية 🌟</span>
            <p className="text-xs font-black text-emerald-400">
              {bestIncomeMonth?.month} بـ {fmt(bestIncomeMonth?.income || 0)}
            </p>
            <p className="text-[10px] text-slate-400">يشكل أكبر نسبة تدفق نقدي وارد خلال العام.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 block">نسبة هامش الربحية التشغيلية 📈</span>
            <p className="text-xs font-black text-cyan-300">
              {overallNetMargin.toFixed(1)}% ({totalAnnualProfit >= 0 ? "أرباح صَافية" : "عَجز مالي"})
            </p>
            <p className="text-[10px] text-slate-400">تُظهر قدرة النشاط على توليد سيولة نقدية بعد تغطية المصاريف.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 block">توصية المحاسب القانوني 💡</span>
            <p className="text-xs font-bold text-slate-200">
              {overallNetMargin >= 25
                ? "أداء مالي مميز! يُنصح باستثمار 15% من الفائض في مخصصات التوسع والتطوير."
                : overallNetMargin >= 10
                ? "ربحية متزنة. ترشيد المصروفات الإدارية بـ 5% سيرفع هامش الربح بصورة ملحوظة."
                : "تنبيه: نسبة المصروفات مرتفعة. يُفضل مراجعة عقود التوريد وإعادة تشكيل التكاليف الثابتة."}
            </p>
          </div>
        </div>
      </div>

      {/* EDITABLE MONTHLY DATA TABLE & SIMULATOR */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0a0f20] border border-white/10 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="space-y-0.5">
            <h4 className="font-black text-sm text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-emerald-400" />
              <span>جدول تعديل أرقام الدخل والمصروفات الشهري (المحاكي اللحظي)</span>
            </h4>
            <p className="text-xs text-slate-400 font-medium">
              عدّل أرقام الدخل والمصروفات لكل شهر لمعاينة تأثيرها المباشر على جميع الرسوم البيانية أعلاه!
            </p>
          </div>

          <button
            onClick={() => handleSelectScenario(selectedScenarioKey)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-extrabold cursor-pointer transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>إعادة التعيين للنموذج الأولي</span>
          </button>
        </div>

        {/* Table Overflow Container */}
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#101830] text-slate-300 font-black border-b border-white/10">
              <tr>
                <th className="p-3">الشهر</th>
                <th className="p-3 text-emerald-400">الدخل / الإيرادات (ج.م)</th>
                <th className="p-3 text-rose-400">المصروفات التشغيلية (ج.م)</th>
                <th className="p-3 text-cyan-300">صافي الربح / الخسارة</th>
                <th className="p-3 text-purple-300">هامش الربح %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-bold">
              {computedMonthlyData.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors bg-black/20">
                  <td className="p-3 text-white font-extrabold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>{row.month}</span>
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={row.income}
                      onChange={(e) => handleUpdateMonthVal(idx, "income", parseFloat(e.target.value) || 0)}
                      className="bg-[#0c142c] border border-emerald-500/30 focus:border-emerald-400 rounded-lg px-2.5 py-1 text-xs text-emerald-300 font-extrabold outline-none w-32"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={row.expenses}
                      onChange={(e) => handleUpdateMonthVal(idx, "expenses", parseFloat(e.target.value) || 0)}
                      className="bg-[#0c142c] border border-rose-500/30 focus:border-rose-400 rounded-lg px-2.5 py-1 text-xs text-rose-300 font-extrabold outline-none w-32"
                    />
                  </td>
                  <td className={`p-3 font-black ${row.profit >= 0 ? "text-cyan-300" : "text-rose-400"}`}>
                    {fmt(row.profit)}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-black ${
                      row.margin >= 20 ? "bg-emerald-500/20 text-emerald-300" : row.margin >= 0 ? "bg-amber-500/20 text-amber-300" : "bg-rose-500/20 text-rose-300"
                    }`}>
                      {row.margin}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#121c38] font-black text-xs text-white border-t border-white/20">
              <tr>
                <td className="p-3 text-amber-300">الإجمالي السنوي</td>
                <td className="p-3 text-emerald-400">{fmt(totalAnnualIncome)}</td>
                <td className="p-3 text-rose-400">{fmt(totalAnnualExpenses)}</td>
                <td className={`p-3 ${totalAnnualProfit >= 0 ? "text-cyan-300" : "text-rose-400"}`}>{fmt(totalAnnualProfit)}</td>
                <td className="p-3 text-purple-300">{overallNetMargin.toFixed(1)}%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
