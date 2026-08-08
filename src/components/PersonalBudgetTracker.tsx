import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  PieChart,
  Plus,
  Trash2,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  Home,
  Car,
  ShoppingCart,
  HeartPulse,
  CreditCard,
  Smile,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export interface BudgetItem {
  id: string;
  title: string;
  amount: number;
  category: "housing" | "transport" | "living" | "health_family" | "debts" | "entertainment" | "savings";
  type: "income" | "expense";
  isNeed: boolean; // Needs vs Wants classification for 50/30/20 rule
}

export const BUDGET_CATEGORIES = [
  { id: "housing", name: "🏠 السكن والمرافق", color: "from-blue-500 to-indigo-600", textHex: "text-blue-400" },
  { id: "transport", name: "🚗 المواصلات والنقل", color: "from-sky-500 to-cyan-600", textHex: "text-sky-400" },
  { id: "living", name: "🛒 المعيشة والتسوق", color: "from-amber-500 to-orange-600", textHex: "text-amber-400" },
  { id: "health_family", name: "🏥 الصحة والأسرة", color: "from-rose-500 to-pink-600", textHex: "text-rose-400" },
  { id: "debts", name: "💳 القروض والالتزامات", color: "from-red-500 to-red-700", textHex: "text-red-400" },
  { id: "entertainment", name: "🏖️ الترفيه والكماليات", color: "from-purple-500 to-violet-600", textHex: "text-purple-400" },
  { id: "savings", name: "💰 الادخار والاستثمار", color: "from-emerald-500 to-teal-600", textHex: "text-emerald-400" }
];

export const INITIAL_INCOMES = [
  { id: "inc_1", title: "الراتب الشهري الأساسي والبدلات", amount: 18000, category: "savings", type: "income", isNeed: true },
  { id: "inc_2", title: "دخل مشروع جانبي / استشارات", amount: 3500, category: "savings", type: "income", isNeed: true },
];

export const INITIAL_EXPENSES: BudgetItem[] = [
  { id: "exp_1", title: "إيجار السكن / القسط العقاري الشهري", amount: 4500, category: "housing", type: "expense", isNeed: true },
  { id: "exp_2", title: "فواتير الكهرباء والماء والإنترنت", amount: 800, category: "housing", type: "expense", isNeed: true },
  { id: "exp_3", title: "وقود وصيانة السيارة وتأمينها", amount: 1200, category: "transport", type: "expense", isNeed: true },
  { id: "exp_4", title: "مشتريات السوبرماركت والمعيشة", amount: 3000, category: "living", type: "expense", isNeed: true },
  { id: "exp_5", title: "رسوم المدارس والتأمين الصحي للأسرة", amount: 2000, category: "health_family", type: "expense", isNeed: true },
  { id: "exp_6", title: "قسط البنك / البطاقة الائتمانية", amount: 2200, category: "debts", type: "expense", isNeed: true },
  { id: "exp_7", title: "مطاعم، كافيهات وترفيه نهاية الأسبوع", amount: 1800, category: "entertainment", type: "expense", isNeed: false },
  { id: "exp_8", title: "اشتراكات رقمية وتسوق شخصي", amount: 700, category: "entertainment", type: "expense", isNeed: false },
];

export function PersonalBudgetTracker() {
  const [incomes, setIncomes] = useState<BudgetItem[]>(INITIAL_INCOMES as BudgetItem[]);
  const [expenses, setExpenses] = useState<BudgetItem[]>(INITIAL_EXPENSES);

  // New Item Form State
  const [newTitle, setNewTitle] = useState<string>("");
  const [newAmount, setNewAmount] = useState<number>(500);
  const [newCategory, setNewCategory] = useState<BudgetItem["category"]>("living");
  const [newType, setNewType] = useState<"income" | "expense">("expense");
  const [newIsNeed, setNewIsNeed] = useState<boolean>(true);

  // Currency
  const [currency, setCurrency] = useState<string>("ريال");

  // Preset Template Loader
  const handleLoadPreset = (presetType: "average_employee" | "family" | "freelancer") => {
    if (presetType === "average_employee") {
      setIncomes([
        { id: "inc_1", title: "الراتب الشهري الرئيسي", amount: 12000, category: "savings", type: "income", isNeed: true }
      ]);
      setExpenses([
        { id: "exp_1", title: "إيجار السكن / القسط", amount: 3000, category: "housing", type: "expense", isNeed: true },
        { id: "exp_2", title: "فواتير الخدمات والاتصالات", amount: 600, category: "housing", type: "expense", isNeed: true },
        { id: "exp_3", title: "وقود ومصاريف سيارة", amount: 800, category: "transport", type: "expense", isNeed: true },
        { id: "exp_4", title: "معيشة وسوبرماركت", amount: 2200, category: "living", type: "expense", isNeed: true },
        { id: "exp_5", title: "قسط القروض الشخصية", amount: 1500, category: "debts", type: "expense", isNeed: true },
        { id: "exp_6", title: "ترفيه ومطاعم", amount: 1200, category: "entertainment", type: "expense", isNeed: false },
      ]);
    } else if (presetType === "family") {
      setIncomes([
        { id: "inc_1", title: "راتب الزوج الأساسي", amount: 22000, category: "savings", type: "income", isNeed: true },
        { id: "inc_2", title: "راتب الزوجة / دخل إضافي", amount: 8000, category: "savings", type: "income", isNeed: true }
      ]);
      setExpenses([
        { id: "exp_1", title: "قسط عقاري مالي", amount: 7500, category: "housing", type: "expense", isNeed: true },
        { id: "exp_2", title: "فواتير المنزل والشغالة", amount: 2500, category: "housing", type: "expense", isNeed: true },
        { id: "exp_3", title: "مصاريف سيارتين ووقود", amount: 2000, category: "transport", type: "expense", isNeed: true },
        { id: "exp_4", title: "المقاضي الشهرية والأطعمة", amount: 4500, category: "living", type: "expense", isNeed: true },
        { id: "exp_5", title: "أقساط المدارس والأبناء", amount: 3500, category: "health_family", type: "expense", isNeed: true },
        { id: "exp_6", title: "سفر وترفيه عائلي", amount: 2500, category: "entertainment", type: "expense", isNeed: false },
      ]);
    } else if (presetType === "freelancer") {
      setIncomes([
        { id: "inc_1", title: "عقود برمجة واستشارات", amount: 15000, category: "savings", type: "income", isNeed: true },
        { id: "inc_2", title: "أرباح مبيعات متجر إلكتروني", amount: 6000, category: "savings", type: "income", isNeed: true }
      ]);
      setExpenses([
        { id: "exp_1", title: "سكن ومكتب عمل مشتركة", amount: 3500, category: "housing", type: "expense", isNeed: true },
        { id: "exp_2", title: "اشتراكات برمجيات وسيرفرات", amount: 1200, category: "living", type: "expense", isNeed: true },
        { id: "exp_3", title: "تأمين طبي شخصي وادخار طوارئ", amount: 2000, category: "health_family", type: "expense", isNeed: true },
        { id: "exp_4", title: "معيشة ومطاعم", amount: 3000, category: "living", type: "expense", isNeed: true },
        { id: "exp_5", title: "تسويق وإعلانات للمتجر", amount: 2500, category: "entertainment", type: "expense", isNeed: false },
      ]);
    }
  };

  // Add Item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newAmount <= 0) return;

    const newItem: BudgetItem = {
      id: "custom_" + Date.now(),
      title: newTitle.trim(),
      amount: newAmount,
      category: newCategory,
      type: newType,
      isNeed: newIsNeed
    };

    if (newType === "income") {
      setIncomes([...incomes, newItem]);
    } else {
      setExpenses([...expenses, newItem]);
    }

    setNewTitle("");
    setNewAmount(500);
  };

  // Delete Item
  const handleDeleteItem = (id: string, type: "income" | "expense") => {
    if (type === "income") {
      setIncomes(incomes.filter((i) => i.id !== id));
    } else {
      setExpenses(expenses.filter((e) => e.id !== id));
    }
  };

  // Reset to initial
  const handleReset = () => {
    setIncomes(INITIAL_INCOMES as BudgetItem[]);
    setExpenses(INITIAL_EXPENSES);
  };

  // Calculations Engine
  const summary = useMemo(() => {
    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    // 50/30/20 Rule Breakdown
    const needsAmount = expenses.filter((e) => e.isNeed).reduce((sum, item) => sum + item.amount, 0);
    const wantsAmount = expenses.filter((e) => !e.isNeed).reduce((sum, item) => sum + item.amount, 0);

    const needsPct = totalIncome > 0 ? (needsAmount / totalIncome) * 100 : 0;
    const wantsPct = totalIncome > 0 ? (wantsAmount / totalIncome) * 100 : 0;
    const savingsPct = totalIncome > 0 ? (Math.max(0, netSavings) / totalIncome) * 100 : 0;

    // Category Breakdown
    const categoryTotals: Record<string, number> = {};
    expenses.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

    // Rating
    let ratingStatus: { label: string; color: string; desc: string } = {
      label: "ممتاز جداً 🌟",
      color: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30",
      desc: "تحقق نسبة ادخار مثالية تتجاوز 20%، مما يعزز الاستقرار المالي وبناء المحفظة الاستثمارية."
    };

    if (netSavings < 0) {
      ratingStatus = {
        label: "عجز مالي خطر ⚠️",
        color: "text-rose-400 bg-rose-500/20 border-rose-500/30",
        desc: "المصاريف تتجاوز الدخل الشهري. يجب خفض الكماليات وإعادة جدولة الالتزامات فوراً لتجنب الاستدانة."
      };
    } else if (savingsRate < 10) {
      ratingStatus = {
        label: "ادخار منخفض ⚠️",
        color: "text-amber-400 bg-amber-500/20 border-amber-500/30",
        desc: "نسبة الادخار أقل من 10%. ينصح بضبط مصاريف الكماليات والترفيه لتأمين صندوق الطوارئ."
      };
    } else if (savingsRate < 20) {
      ratingStatus = {
        label: "متوازن وجيد ⚖️",
        color: "text-sky-400 bg-sky-500/20 border-sky-500/30",
        desc: "الوضع المالي متوازن قريب من قاعدة (50/30/20)، ويمكن رفعه بتحديد أهداف ادخارية واضحة."
      };
    }

    return {
      totalIncome,
      totalExpenses,
      netSavings,
      savingsRate,
      needsAmount,
      wantsAmount,
      needsPct,
      wantsPct,
      savingsPct,
      categoryTotals,
      ratingStatus
    };
  }, [incomes, expenses]);

  return (
    <div className="space-y-8 font-sans">
      
      {/* HEADER BAR */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0a1226] via-[#121c3b] to-[#0a1226] border border-indigo-500/30 shadow-2xl space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>أداة إدارة وتخطيط الميزانية المالية الشخصية (Personal Budget Tracker)</span>
            </span>
            <h3 className="text-2xl font-black text-white">
              محاكي الميزانية الشخصية وتحليل الادخار 💰📊
            </h3>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              قم بتنظيم الدخل والمصاريف الشهرية، وتصنيف الاحتياجات الأساسية مقابل الكماليات، واكتشف نسبة الادخار الصافية طبقاً لقاعدة التخطيط المالي الشهيرة (50% احتياجات / 30% رغبات / 20% ادخار).
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

        {/* QUICK PRESETS */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-300 block flex items-center gap-1.5">
            <PiggyBank className="w-4 h-4 text-indigo-400" />
            <span>اختر نموذج ميزانية جاهز للمحاكاة المباشرة:</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleLoadPreset("average_employee")}
              className="p-3 rounded-2xl bg-black/40 border border-white/10 hover:border-indigo-500/40 text-right transition-all cursor-pointer group"
            >
              <div className="text-xs font-black text-white group-hover:text-indigo-300">
                👔 ميزانية موظف متوسط (12,000 ريال)
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                توزيع قياسي لإيجار السكن والقرض والمعيشة مع ادخار جزئي.
              </p>
            </button>

            <button
              onClick={() => handleLoadPreset("family")}
              className="p-3 rounded-2xl bg-black/40 border border-white/10 hover:border-purple-500/40 text-right transition-all cursor-pointer group"
            >
              <div className="text-xs font-black text-white group-hover:text-purple-300">
                👨‍👩‍👧‍👦 ميزانية أسرة (30,000 ريال)
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                تغطي أقساط العقار والمدارس والسيارة والترفيه العائلي.
              </p>
            </button>

            <button
              onClick={() => handleLoadPreset("freelancer")}
              className="p-3 rounded-2xl bg-black/40 border border-white/10 hover:border-emerald-500/40 text-right transition-all cursor-pointer group"
            >
              <div className="text-xs font-black text-white group-hover:text-emerald-300">
                💻 ميزانية مستقل / رائد أعمال (21,000 ريال)
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                تراعي مصاريف الأدوات البرمجية والتأمين وصندوق الطوارئ.
              </p>
            </button>
          </div>
        </div>

      </div>

      {/* TOP STATS SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        {/* Total Income */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 space-y-1">
          <span className="text-[10px] font-bold text-emerald-300 uppercase block flex items-center justify-between">
            <span>إجمالي الدخل الشهري</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </span>
          <div className="text-2xl font-black text-white font-mono">
            {summary.totalIncome.toLocaleString()} {currency}
          </div>
          <span className="text-[10px] text-slate-400 block">
            من ({incomes.length}) مصادر دخل
          </span>
        </div>

        {/* Total Expenses */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/60 to-slate-900 border border-rose-500/30 space-y-1">
          <span className="text-[10px] font-bold text-rose-300 uppercase block flex items-center justify-between">
            <span>إجمالي المصاريف والالتزامات</span>
            <ArrowDownRight className="w-4 h-4 text-rose-400" />
          </span>
          <div className="text-2xl font-black text-white font-mono">
            {summary.totalExpenses.toLocaleString()} {currency}
          </div>
          <span className="text-[10px] text-slate-400 block">
            تستنزف {summary.totalIncome > 0 ? ((summary.totalExpenses / summary.totalIncome) * 100).toFixed(1) : 0}% من الدخل
          </span>
        </div>

        {/* Net Savings */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 space-y-1">
          <span className="text-[10px] font-bold text-indigo-300 uppercase block flex items-center justify-between">
            <span>صافي الفائض / الادخار الشهري</span>
            <PiggyBank className="w-4 h-4 text-indigo-400" />
          </span>
          <div className={`text-2xl font-black font-mono ${summary.netSavings >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {summary.netSavings.toLocaleString()} {currency}
          </div>
          <span className="text-[10px] text-slate-400 block">
            نسبة الادخار الصافية: <strong className="text-indigo-300">{summary.savingsRate.toFixed(1)}%</strong>
          </span>
        </div>

        {/* Financial Rating Status */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-black border border-white/10 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">تقييم الوضع المالي</span>
          <div className={`inline-block text-xs font-black px-2.5 py-1 rounded-xl border ${summary.ratingStatus.color}`}>
            {summary.ratingStatus.label}
          </div>
          <p className="text-[10px] text-slate-400 leading-tight pt-1">
            {summary.ratingStatus.desc}
          </p>
        </div>

      </div>

      {/* VISUAL CHART & 50/30/20 RULE ANALYSIS */}
      <div className="p-6 rounded-3xl bg-[#0b1022] border border-white/10 shadow-xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="space-y-0.5">
            <h4 className="font-black text-white text-sm sm:text-base flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-400" />
              <span>التحليل البياني وقاعدة التخطيط المالي (50% احتياجات / 30% رغبات / 20% ادخار)</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              مقارنة التوزيع الفعلي لميزانيتك مع المعايير التوجيهية للخبراء الماليين
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-bold">العملة المستخدمة:</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-black/60 border border-white/15 rounded-xl px-2.5 py-1 text-xs font-bold text-amber-300 focus:outline-none"
            >
              <option value="ريال">ريال سعودي 🇸🇦</option>
              <option value="درهم">درهم إماراتي 🇦🇪</option>
              <option value="جنيه">جنيه مصري 🇪🇬</option>
              <option value="دينار">دينار أردني 🇯🇴</option>
              <option value="دولار">دولار $</option>
            </select>
          </div>
        </div>

        {/* STACKED GRAPH BAR */}
        <div className="space-y-3">
          <div className="h-8 w-full rounded-2xl bg-slate-950 p-1 flex overflow-hidden border border-white/10">
            {/* Needs Segment */}
            <div
              style={{ width: `${Math.min(100, summary.needsPct)}%` }}
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-l-xl transition-all duration-500 relative group cursor-pointer"
              title={`الاحتياجات الأساسية: ${summary.needsAmount.toLocaleString()} ${currency} (${summary.needsPct.toFixed(1)}%)`}
            />
            {/* Wants Segment */}
            <div
              style={{ width: `${Math.min(100 - summary.needsPct, summary.wantsPct)}%` }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-500 relative group cursor-pointer"
              title={`الرغبات والكماليات: ${summary.wantsAmount.toLocaleString()} ${currency} (${summary.wantsPct.toFixed(1)}%)`}
            />
            {/* Savings Segment */}
            <div
              style={{ width: `${Math.max(0, summary.savingsPct)}%` }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-r-xl transition-all duration-500 relative group cursor-pointer"
              title={`الادخار الصافي: ${summary.netSavings.toLocaleString()} ${currency} (${summary.savingsPct.toFixed(1)}%)`}
            />
          </div>

          {/* THREE PILLARS BREAKDOWN COMPARISON */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. Needs Pillar */}
            <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-300">1. الاحتياجات الأساسية (Needs)</span>
                <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                  المستهدف: 50%
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-black text-white font-mono">
                  {summary.needsAmount.toLocaleString()} {currency}
                </span>
                <span className={`text-xs font-bold font-mono ${summary.needsPct <= 50 ? "text-emerald-400" : "text-amber-400"}`}>
                  {summary.needsPct.toFixed(1)}% من الدخل
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-snug">
                تشمل السكن، الفواتير، الغذاء، الأقساط الأساسية والنقل الذي لا يمكن الاستغناء عنه.
              </p>
            </div>

            {/* 2. Wants Pillar */}
            <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-300">2. الرغبات والكماليات (Wants)</span>
                <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                  المستهدف: 30%
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-black text-white font-mono">
                  {summary.wantsAmount.toLocaleString()} {currency}
                </span>
                <span className={`text-xs font-bold font-mono ${summary.wantsPct <= 30 ? "text-emerald-400" : "text-amber-400"}`}>
                  {summary.wantsPct.toFixed(1)}% من الدخل
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-snug">
                تشمل المطاعم، الكافيهات، السفر، الاشتراكات والترفيه والتسوق الشخصي غير الضروري.
              </p>
            </div>

            {/* 3. Savings Pillar */}
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-300">3. الادخار والاستثمار (Savings)</span>
                <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                  المستهدف: 20%+
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-black text-white font-mono">
                  {summary.netSavings.toLocaleString()} {currency}
                </span>
                <span className={`text-xs font-bold font-mono ${summary.savingsPct >= 20 ? "text-emerald-400" : "text-amber-400"}`}>
                  {summary.savingsPct.toFixed(1)}% من الدخل
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-snug">
                تُوجه لبناء صندوق الطوارئ (3-6 أشهر)، الاستثمار، والتقاعد والأهداف المستقبلية.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* TWO COLUMN INTERACTIVE ITEMS MANAGERS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: INCOME & ADD ITEM FORM */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* ADD NEW ITEM FORM */}
          <form onSubmit={handleAddItem} className="p-6 rounded-3xl bg-[#0b1022] border-2 border-indigo-500/30 shadow-xl space-y-4">
            <div className="border-b border-white/10 pb-3 flex items-center justify-between">
              <h4 className="font-black text-indigo-300 text-sm sm:text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" />
                <span>إضافة بنود جديدة للميزانية</span>
              </h4>
            </div>

            <div className="space-y-3 text-xs">
              
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-black/50 border border-white/10 font-bold">
                <button
                  type="button"
                  onClick={() => setNewType("expense")}
                  className={`py-1.5 rounded-lg transition-all ${
                    newType === "expense" ? "bg-rose-600 text-white shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  🔴 مصروف / التزام
                </button>
                <button
                  type="button"
                  onClick={() => setNewType("income")}
                  className={`py-1.5 rounded-lg transition-all ${
                    newType === "income" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  🟢 مصدر دخل
                </button>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">مسمى البند:</label>
                <input
                  type="text"
                  placeholder="مثال: فاتورة الجوال، اشتراك النادي..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">المبلغ الشهرى ({currency}):</label>
                <input
                  type="number"
                  min={1}
                  value={newAmount}
                  onChange={(e) => setNewAmount(Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              {newType === "expense" && (
                <>
                  {/* Category */}
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold block">تصنيف المصروف:</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as BudgetItem["category"])}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none"
                    >
                      {BUDGET_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Need vs Want toggle */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="isNeedCheck"
                      checked={newIsNeed}
                      onChange={(e) => setNewIsNeed(e.target.checked)}
                      className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                    />
                    <label htmlFor="isNeedCheck" className="text-slate-300 text-xs font-bold cursor-pointer">
                      مصروف ضروري وبحاجة ماسة (Needs) وليس كماليات
                    </label>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs transition-all shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة إلى القائمة</span>
              </button>

            </div>
          </form>

          {/* INCOME SOURCES LIST */}
          <div className="p-6 rounded-3xl bg-[#0b1022] border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="font-black text-emerald-300 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>مصادر الدخل الإجمالية ({incomes.length})</span>
              </h4>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-lg">
                {summary.totalIncome.toLocaleString()} {currency}
              </span>
            </div>

            <div className="space-y-2">
              {incomes.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between hover:border-emerald-500/30 transition-all text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block">{item.title}</span>
                    <span className="text-[10px] text-slate-400 block">مصدر دخل ثابت</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-emerald-400 text-sm">
                      +{item.amount.toLocaleString()} {currency}
                    </span>
                    <button
                      onClick={() => handleDeleteItem(item.id, "income")}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: DETAILED EXPENSES LIST */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="p-6 rounded-3xl bg-[#0b1022] border border-white/10 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="space-y-0.5">
                <h4 className="font-black text-rose-300 text-sm sm:text-base flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-rose-400" />
                  <span>قائمة المصاريف والالتزامات التفصيلية ({expenses.length})</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  انقر على أي بند للتعديل أو الحذف والمتابعة
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/20 px-2.5 py-1 rounded-xl border border-rose-500/30">
                {summary.totalExpenses.toLocaleString()} {currency}
              </span>
            </div>

            {/* EXPENSES LIST */}
            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {expenses.map((item) => {
                const categoryObj = BUDGET_CATEGORIES.find((c) => c.id === item.category) || BUDGET_CATEGORIES[2];
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-black/40 border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white">{item.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.isNeed
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        }`}>
                          {item.isNeed ? "ضروري 🏠" : "كماليات 🏖️"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[10px] text-slate-400">
                        <span className={categoryObj.textHex}>{categoryObj.name}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <span className="font-mono font-black text-rose-400 text-sm">
                        -{item.amount.toLocaleString()} {currency}
                      </span>
                      <button
                        onClick={() => handleDeleteItem(item.id, "expense")}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                        title="حذف المصروف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* FINANCIAL ADVICE & SAVINGS STRATEGY CARD */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0f172a] to-slate-900 border border-white/10 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-black border-b border-white/10 pb-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>توصيات التخطيط المالي وبناء ثروة مستدامة:</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-slate-300 leading-relaxed">
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="font-bold text-emerald-300 block">💡 أولوية بناء صندوق الطوارئ:</span>
                <p>
                  احتفظ بمبلغ يعادل 3 إلى 6 أفراد من إجمالي المصاريف الشهرية ({Math.round(summary.totalExpenses * 4).toLocaleString()} {currency}) في حساب ادخاري منفصل مرتفع السيولة.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="font-bold text-indigo-300 block">📈 قاعدة اقتطاع الادخار أولاً:</span>
                <p>
                  حول نسبة الادخار ({summary.savingsPct.toFixed(1)}%) تلقائياً إلى محفظتك الاستثمارية فور نزول الراتب وقبل بدء الإنفاق على المصاريف اليومية.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
