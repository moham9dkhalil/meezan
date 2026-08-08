import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Scale,
  RefreshCw,
  Play,
  Zap,
  CheckCircle2,
  AlertCircle,
  FileText,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Building2,
  Receipt,
  Layers,
  History,
  Info
} from "lucide-react";

export interface AssetMarketData {
  id: string;
  name: string;
  symbol: string;
  category: "stock" | "commodity" | "bond";
  price: number;
  prevPrice: number;
  changePercent: number;
  icon: string;
  description: string;
  volatility: "منخفضة" | "متوسطة" | "عالية";
}

export interface PortfolioPosition {
  assetId: string;
  quantity: number;
  avgCostBasis: number;
}

export interface JournalEntryRecord {
  id: string;
  timestamp: string;
  tradeType: "BUY" | "SELL" | "REVALUATION" | "SCENARIO";
  assetName: string;
  quantity: number;
  price: number;
  totalAmount: number;
  commission: number;
  paymentMethod: "CASH" | "MARGIN";
  debitAccount: string;
  debitAmount: number;
  creditAccount: string;
  creditAmount: number;
  feeAccount?: string;
  feeAmount?: number;
  note: string;
}

const INITIAL_ASSETS: AssetMarketData[] = [
  {
    id: "TECH",
    name: "سهم شركة التقنية المتطورة",
    symbol: "TECH",
    category: "stock",
    price: 150,
    prevPrice: 150,
    changePercent: 0,
    icon: "💻",
    description: "قطاع البرمجيات والذكاء الاصطناعي — نمو مرتفع وتقلبات متوسطة",
    volatility: "عالية"
  },
  {
    id: "ENGY",
    name: "سهم الشرق للطاقة والغاز",
    symbol: "ENGY",
    category: "stock",
    price: 85,
    prevPrice: 85,
    changePercent: 0,
    icon: "⚡",
    description: "قطاع الطاقة النظيفة والتكرير — عوائد مستقرة وتوزيعات نقديّة",
    volatility: "متوسطة"
  },
  {
    id: "GOLD",
    name: "سبائك الذهب الاستثماري",
    symbol: "GOLD",
    category: "commodity",
    price: 2400,
    prevPrice: 2400,
    changePercent: 0,
    icon: "🪙",
    description: "ملاذ آمن للتحوط ضد التضخم وتقلبات الأسواق العالمية",
    volatility: "منخفضة"
  },
  {
    id: "BOND",
    name: "سندات الخزينة السيادية",
    symbol: "BOND",
    category: "bond",
    price: 1000,
    prevPrice: 1000,
    changePercent: 0,
    icon: "📜",
    description: "أوراق مالية مضمونة بعائد ثوابت وسعر فائدة سنوي 5%",
    volatility: "منخفضة"
  }
];

export function TradingSimulator() {
  // Market assets state
  const [marketAssets, setMarketAssets] = useState<AssetMarketData[]>(INITIAL_ASSETS);
  const [tradingDay, setTradingDay] = useState<number>(1);

  // Financial Position State (Company Initial Balance Sheet)
  const [cash, setCash] = useState<number>(500000); // النقدية في البنك
  const [initialCapital] = useState<number>(500000); // رأس المال المبدئي
  const [marginLoan, setMarginLoan] = useState<number>(0); // قروض وتسهيلات تداول (التزام)
  
  // Portfolio state
  const [portfolio, setPortfolio] = useState<PortfolioPosition[]>([]);

  // Accumulated realized P&L and fees
  const [realizedGains, setRealizedGains] = useState<number>(0);
  const [totalCommissions, setTotalCommissions] = useState<number>(0);

  // Journal Entry History
  const [journalEntries, setJournalEntries] = useState<JournalEntryRecord[]>([]);

  // Form State
  const [selectedAssetId, setSelectedAssetId] = useState<string>("TECH");
  const [tradeAction, setTradeAction] = useState<"BUY" | "SELL">("BUY");
  const [tradeQuantity, setTradeQuantity] = useState<number>(100);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "MARGIN">("CASH");
  const [activeSubTab, setActiveSubTab] = useState<"trade" | "balance" | "income" | "journal" | "scenarios">("trade");

  // Notification / Message
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>({
    text: "مرحباً بك في محاكي تداول المحاسبة! ابدأ بتنفيذ أول عملية تداول لمشاهدة تأثير القيد المزدوج فوراً.",
    type: "info"
  });

  const selectedAsset = marketAssets.find((a) => a.id === selectedAssetId) || marketAssets[0];
  const commissionRate = 0.0015; // 0.15% عمولة الوساطة المالية

  // Calculate current portfolio values
  const getAssetPosition = (assetId: string) => portfolio.find((p) => p.assetId === assetId);

  // Portfolio total cost basis
  const totalCostBasis = portfolio.reduce((acc, pos) => acc + pos.quantity * pos.avgCostBasis, 0);

  // Portfolio current fair market value
  const totalFairMarketValue = portfolio.reduce((acc, pos) => {
    const currentPrice = marketAssets.find((a) => a.id === pos.assetId)?.price || pos.avgCostBasis;
    return acc + pos.quantity * currentPrice;
  }, 0);

  // Unrealized Gain / Loss
  const totalUnrealizedGains = totalFairMarketValue - totalCostBasis;

  // Total Company Assets
  const totalAssets = cash + totalFairMarketValue;

  // Net Income = Realized Gains + Unrealized Gains - Commissions
  const netIncome = realizedGains + totalUnrealizedGains - totalCommissions;

  // Total Equity = Initial Capital + Net Income
  const totalEquity = initialCapital + netIncome;

  // Total Liabilities + Equity
  const totalLiabilitiesAndEquity = marginLoan + totalEquity;

  // Balance difference check
  const balanceDifference = Math.abs(totalAssets - totalLiabilitiesAndEquity);
  const isBalanceSheetEqual = balanceDifference < 0.01;

  // Handle Trade Execution
  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();

    if (tradeQuantity <= 0) {
      setStatusMessage({ text: "برجاء إدخال كمية صحيحة أكبر من صفر.", type: "error" });
      return;
    }

    const price = selectedAsset.price;
    const subtotal = price * tradeQuantity;
    const commission = Math.round(subtotal * commissionRate * 100) / 100;
    const totalOutflow = subtotal + commission;

    if (tradeAction === "BUY") {
      if (paymentMethod === "CASH" && cash < totalOutflow) {
        setStatusMessage({
          text: `السيولة النقدية المتاحة (${cash.toLocaleString()} ر.س) لا تكفي لإتمام الصفقة مع العمولة (${totalOutflow.toLocaleString()} ر.س). يمكنك اختيار التداول بالهامش/الائتمان.`,
          type: "error"
        });
        return;
      }

      // Execute BUY
      if (paymentMethod === "CASH") {
        setCash((prev) => prev - totalOutflow);
      } else {
        // Margin loan
        setMarginLoan((prev) => prev + totalOutflow);
      }

      setTotalCommissions((prev) => prev + commission);

      // Update portfolio
      setPortfolio((prev) => {
        const existing = prev.find((p) => p.assetId === selectedAsset.id);
        if (existing) {
          const newQty = existing.quantity + tradeQuantity;
          const newCostBasis = (existing.quantity * existing.avgCostBasis + subtotal) / newQty;
          return prev.map((p) => (p.assetId === selectedAsset.id ? { ...p, quantity: newQty, avgCostBasis: newCostBasis } : p));
        } else {
          return [...prev, { assetId: selectedAsset.id, quantity: tradeQuantity, avgCostBasis: price }];
        }
      });

      // Record Journal Entry
      const entry: JournalEntryRecord = {
        id: `TRD-${Date.now().toString().slice(-5)}`,
        timestamp: `يوم التداول ${tradingDay} - ${new Date().toLocaleTimeString("ar-SA")}`,
        tradeType: "BUY",
        assetName: selectedAsset.name,
        quantity: tradeQuantity,
        price,
        totalAmount: subtotal,
        commission,
        paymentMethod,
        debitAccount: `حـ/ الاستثمارات المالية (${selectedAsset.name})`,
        debitAmount: subtotal,
        creditAccount: paymentMethod === "CASH" ? "حـ/ النقدية في البنك" : "حـ/ قروض وتسهيلات تداول هامي",
        creditAmount: subtotal,
        feeAccount: "حـ/ مصروف عمولات تداول ومصاريف مالية",
        feeAmount: commission,
        note: `شراء ${tradeQuantity} وحدة بسعر ${price} ر.س + عمولة وساطة ${commission} ر.س (${paymentMethod === "CASH" ? "نقداً" : "بالائتمان"})`
      };

      setJournalEntries((prev) => [entry, ...prev]);
      setStatusMessage({
        text: `تم تنفيذ قيد شراء ${tradeQuantity} في ${selectedAsset.name} بنجاح وقيد العملية في الميزانية!`,
        type: "success"
      });
    } else {
      // SELL Action
      const pos = getAssetPosition(selectedAsset.id);
      if (!pos || pos.quantity < tradeQuantity) {
        setStatusMessage({
          text: `لا تملك كمية كافية من (${selectedAsset.name}) للبيع. الرصيد الحالي: ${pos ? pos.quantity : 0} وحدة.`,
          type: "error"
        });
        return;
      }

      const netInflow = subtotal - commission;
      const soldCostBasis = pos.avgCostBasis * tradeQuantity;
      const realizedGainFromTrade = subtotal - soldCostBasis;

      if (paymentMethod === "CASH") {
        setCash((prev) => prev + netInflow);
      } else {
        // Repay margin loan if exists
        const loanRepayment = Math.min(marginLoan, netInflow);
        const remainderCash = netInflow - loanRepayment;
        setMarginLoan((prev) => prev - loanRepayment);
        setCash((prev) => prev + remainderCash);
      }

      setRealizedGains((prev) => prev + realizedGainFromTrade);
      setTotalCommissions((prev) => prev + commission);

      // Update portfolio
      setPortfolio((prev) => {
        return prev
          .map((p) => {
            if (p.assetId === selectedAsset.id) {
              const remQty = p.quantity - tradeQuantity;
              return { ...p, quantity: remQty };
            }
            return p;
          })
          .filter((p) => p.quantity > 0);
      });

      // Record Journal Entry
      const entry: JournalEntryRecord = {
        id: `TRD-${Date.now().toString().slice(-5)}`,
        timestamp: `يوم التداول ${tradingDay} - ${new Date().toLocaleTimeString("ar-SA")}`,
        tradeType: "SELL",
        assetName: selectedAsset.name,
        quantity: tradeQuantity,
        price,
        totalAmount: subtotal,
        commission,
        paymentMethod,
        debitAccount: "حـ/ النقدية في البنك (صافي المحصل)",
        debitAmount: netInflow,
        creditAccount: `حـ/ الاستثمارات المالية (${selectedAsset.name} بالتكلفة)`,
        creditAmount: soldCostBasis,
        feeAccount: realizedGainFromTrade >= 0 ? "حـ/ أرباح تداول محققة (دائن)" : "حـ/ خسائر تداول محققة (مدين)",
        feeAmount: Math.abs(realizedGainFromTrade),
        note: `بيع ${tradeQuantity} وحدة بسعر ${price} ر.س — التكلفة: ${soldCostBasis.toLocaleString()} ر.س — صافي النتيجة: ${realizedGainFromTrade >= 0 ? "+" : ""}${realizedGainFromTrade.toLocaleString()} ر.س`
      };

      setJournalEntries((prev) => [entry, ...prev]);
      setStatusMessage({
        text: `تم بيع ${tradeQuantity} وحدة وإثبات قيد أرباح/خسائر التداول المحققة بصلب الميزانية بنجاح!`,
        type: "success"
      });
    }
  };

  // Trigger Market Tick (Simulate New Trading Day)
  const handleMarketTick = () => {
    setTradingDay((prev) => prev + 1);
    setMarketAssets((prev) =>
      prev.map((asset) => {
        // Random price movement (-5% to +6%)
        const factor = 1 + (Math.random() * 0.11 - 0.05);
        const newPrice = Math.max(10, Math.round(asset.price * factor * 10) / 10);
        const pct = Math.round(((newPrice - asset.price) / asset.price) * 1000) / 10;
        return {
          ...asset,
          prevPrice: asset.price,
          price: newPrice,
          changePercent: pct
        };
      })
    );

    setStatusMessage({
      text: `انتهت جلسة اليوم وأقفلت الأسعار الجديدة! تذكر تطبيق "قيد تسوية القيمة العادلة" لمعالجة الأرباح/الخسائر غير المحققة وفق معيار IFRS 9.`,
      type: "info"
    });
  };

  // Execute Fair Value Adjustment Entry
  const handleApplyFairValueRevaluation = () => {
    if (portfolio.length === 0) {
      setStatusMessage({ text: "لا توجد أصول مالية بالمحفظة لإعادة تقييمها حالياً.", type: "error" });
      return;
    }

    const entry: JournalEntryRecord = {
      id: `REVAL-${Date.now().toString().slice(-5)}`,
      timestamp: `يوم التداول ${tradingDay} - إقفال القيمة العادلة`,
      tradeType: "REVALUATION",
      assetName: "إجمالي محفظة الاستثمارات المالية",
      quantity: 1,
      price: totalFairMarketValue,
      totalAmount: totalUnrealizedGains,
      commission: 0,
      paymentMethod: "CASH",
      debitAccount: totalUnrealizedGains >= 0 ? "حـ/ أصول مالية - تسوية القيمة العادلة (مدين)" : "حـ/ أرباح وخسائر القيمة العادلة غير المحققة (مدين)",
      debitAmount: Math.abs(totalUnrealizedGains),
      creditAccount: totalUnrealizedGains >= 0 ? "حـ/ أرباح غير محققة من إعادة تقييم أوراق مالية (دائن)" : "حـ/ أصول مالية - تسوية القيمة العادلة (دائن)",
      creditAmount: Math.abs(totalUnrealizedGains),
      note: `إعادة تقييم القيمة العادلة للمحفظة وفق معيار IFRS 9 — إجمالي التعديل غير المحقق: ${totalUnrealizedGains >= 0 ? "+" : ""}${totalUnrealizedGains.toLocaleString()} ر.س`
    };

    setJournalEntries((prev) => [entry, ...prev]);
    setStatusMessage({
      text: `تم تسجيل قيد التسوية بنجاح وفق معايير IFRS! ظهر تأثير القيمة العادلة المباشر بصلب حقوق الملكية.`,
      type: "success"
    });
  };

  // Load Preset Educational Scenarios
  const handleLoadScenario = (scenarioType: "BUY_STOCK_CASH" | "MARGIN_LEVERAGE" | "COMMODITY_FLIP" | "YEAR_END_REVAL") => {
    if (scenarioType === "BUY_STOCK_CASH") {
      setSelectedAssetId("TECH");
      setTradeAction("BUY");
      setTradeQuantity(200);
      setPaymentMethod("CASH");
      setActiveSubTab("trade");
      setStatusMessage({
        text: "سيناريو جاهز: شراء 200 سهم بضمان النقدية المتوفرة بالبنك مع إثبات قيد العمولات المالية.",
        type: "info"
      });
    } else if (scenarioType === "MARGIN_LEVERAGE") {
      setSelectedAssetId("ENGY");
      setTradeAction("BUY");
      setTradeQuantity(1500);
      setPaymentMethod("MARGIN");
      setActiveSubTab("trade");
      setStatusMessage({
        text: "سيناريو التداول بالهامش: شراء 1500 سهم بالاعتماد على التسهيلات الائتمانية وإثبات التزام قروض التداول.",
        type: "info"
      });
    } else if (scenarioType === "COMMODITY_FLIP") {
      setSelectedAssetId("GOLD");
      setTradeAction("BUY");
      setTradeQuantity(20);
      setPaymentMethod("CASH");
      setActiveSubTab("trade");
      setStatusMessage({
        text: "سيناريو المضاربة على السلع: شراء 20 سبائك ذهب نقداً ثم التخطيط لبيعها عند ارتفاع القيمة السوقية.",
        type: "info"
      });
    } else if (scenarioType === "YEAR_END_REVAL") {
      handleMarketTick();
      setActiveSubTab("balance");
    }
  };

  // Reset Simulator
  const handleResetSimulator = () => {
    setCash(500000);
    setMarginLoan(0);
    setPortfolio([]);
    setRealizedGains(0);
    setTotalCommissions(0);
    setJournalEntries([]);
    setTradingDay(1);
    setMarketAssets(INITIAL_ASSETS);
    setStatusMessage({ text: "تم إعادة ضبط محاكي التداول ورأس المال المبدئي (500,000 ر.س) بنجاح.", type: "info" });
  };

  return (
    <div id="trading-simulator-root" className="space-y-6 text-slate-100">
      
      {/* SIMULATOR HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-[#0B1021] to-slate-900 border border-indigo-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-black">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>محاكي تداول المحاسبة المباشر — IFRS Live Trading</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>📊 محاكي التداول والقيد المزدوج الحقيقي</span>
            </h2>
            <p className="text-sm text-slate-300 font-medium leading-relaxed">
              نفّذ صفقات التداول في سوق مالي افتراضي (أسهم، ذهب، سندات)، وشاهد كيف تُترجم صفقات الشراء والبيع والتداول بالهامش فوراً إلى <strong className="text-amber-300">قيود يومية مزدوجة</strong> وتنعكس مباشرة على <strong className="text-cyan-300">الميزانية العمومية وقائمة الدخل</strong> في الوقت الحقيقي!
            </p>
          </div>

          {/* Quick Simulation Control Panel */}
          <div className="w-full lg:w-auto shrink-0 bg-black/40 border border-white/10 p-4 md:p-5 rounded-2xl backdrop-blur-xl space-y-3 min-w-[280px]">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="text-slate-300 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>يوم التداول الحالي:</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-600/40 text-indigo-200 border border-indigo-500/30 font-black">
                اليوم #{tradingDay}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleMarketTick}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer hover:scale-102"
              >
                <Play className="w-4 h-4 fill-current text-amber-300" />
                <span>تحريك السوق (يوم جديد)</span>
              </button>

              <button
                onClick={handleResetSimulator}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10 transition-all cursor-pointer"
                title="إعادة ضبط المحاكي"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STATUS & NOTIFICATION BAR */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs md:text-sm font-bold flex items-center gap-3 transition-all ${
            statusMessage.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200 shadow-lg shadow-emerald-900/20"
              : statusMessage.type === "error"
              ? "bg-rose-950/40 border-rose-500/40 text-rose-200 shadow-lg shadow-rose-900/20"
              : "bg-indigo-950/40 border-indigo-500/40 text-indigo-200 shadow-lg shadow-indigo-900/20"
          }`}
        >
          {statusMessage.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {statusMessage.type === "error" && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          {statusMessage.type === "info" && <Info className="w-5 h-5 text-indigo-400 shrink-0" />}
          <span className="leading-relaxed flex-1">{statusMessage.text}</span>
        </div>
      )}

      {/* TOP KPI SUMMARY DASHBOARD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        
        {/* Cash Position */}
        <div className="bg-[#0B1021] border border-white/10 p-4 rounded-2xl space-y-1.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>السيولة بالبنك (Cash)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl md:text-2xl font-black text-emerald-400 tracking-tight">
            {cash.toLocaleString()} <span className="text-xs text-slate-400">ر.س</span>
          </div>
          <div className="text-[11px] text-slate-400">متاحة للشراء والتداول المباشر</div>
        </div>

        {/* Total Assets */}
        <div className="bg-[#0B1021] border border-white/10 p-4 rounded-2xl space-y-1.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>إجمالي أصول الشركة</span>
            <Building2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl md:text-2xl font-black text-cyan-300 tracking-tight">
            {totalAssets.toLocaleString()} <span className="text-xs text-slate-400">ر.س</span>
          </div>
          <div className="text-[11px] text-slate-400">نقدية ({cash.toLocaleString()}) + محفظة ({totalFairMarketValue.toLocaleString()})</div>
        </div>

        {/* Total Equity & Capital */}
        <div className="bg-[#0B1021] border border-white/10 p-4 rounded-2xl space-y-1.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
            <span>حقوق الملكية (Equity)</span>
            <Scale className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl md:text-2xl font-black text-purple-300 tracking-tight">
            {totalEquity.toLocaleString()} <span className="text-xs text-slate-400">ر.س</span>
          </div>
          <div className="text-[11px] text-slate-400">
            رأس المال ({initialCapital.toLocaleString()}) + الصافي ({netIncome >= 0 ? "+" : ""}{netIncome.toLocaleString()})
          </div>
        </div>

        {/* Balance Sheet Check Status */}
        <div className={`border p-4 rounded-2xl space-y-1.5 relative overflow-hidden ${
          isBalanceSheetEqual ? "bg-emerald-950/20 border-emerald-500/30" : "bg-rose-950/20 border-rose-500/30"
        }`}>
          <div className="flex items-center justify-between text-xs font-bold">
            <span className={isBalanceSheetEqual ? "text-emerald-300" : "text-rose-300"}>معادلة الميزانية</span>
            <ShieldCheck className={`w-4 h-4 ${isBalanceSheetEqual ? "text-emerald-400" : "text-rose-400"}`} />
          </div>
          <div className={`text-lg md:text-xl font-black ${isBalanceSheetEqual ? "text-emerald-400" : "text-rose-400"}`}>
            {isBalanceSheetEqual ? "متوازنة تماماً ✅" : "غير متوازنة ❌"}
          </div>
          <div className="text-[11px] text-slate-400">
            الأصول = الالتزامات + حقوق الملكية
          </div>
        </div>

      </div>

      {/* NAVIGATION SUB-TABS */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab("trade")}
          className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === "trade"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "bg-black/30 text-slate-300 hover:bg-white/5 hover:text-white"
          }`}
        >
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span>منصة التداول والأسواق</span>
        </button>

        <button
          onClick={() => setActiveSubTab("balance")}
          className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === "balance"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "bg-black/30 text-slate-300 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Scale className="w-4 h-4 text-cyan-400" />
          <span>الميزانية العمومية الحية</span>
        </button>

        <button
          onClick={() => setActiveSubTab("income")}
          className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === "income"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "bg-black/30 text-slate-300 hover:bg-white/5 hover:text-white"
          }`}
        >
          <PieChart className="w-4 h-4 text-emerald-400" />
          <span>قائمة الدخل والأرباح</span>
        </button>

        <button
          onClick={() => setActiveSubTab("journal")}
          className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === "journal"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "bg-black/30 text-slate-300 hover:bg-white/5 hover:text-white"
          }`}
        >
          <History className="w-4 h-4 text-purple-400" />
          <span>دفتر القيود اليومية ({journalEntries.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("scenarios")}
          className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === "scenarios"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "bg-black/30 text-slate-300 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>سيناريوهات تعليمية جاهزة</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: TRADE & MARKET TERMINAL */}
      {/* ========================================================================= */}
      {activeSubTab === "trade" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* MARKET ASSETS LIST (8 COLS) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                <span>أسعار الأصول المتاحة بالتداول</span>
              </h3>
              <span className="text-xs text-slate-400">انقر على أي أصل لاختياره بالأمر</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {marketAssets.map((asset) => {
                const pos = getAssetPosition(asset.id);
                const isSelected = selectedAssetId === asset.id;
                const isUp = asset.changePercent >= 0;

                return (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAssetId(asset.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? "bg-indigo-950/60 border-indigo-500 shadow-xl shadow-indigo-900/30 ring-2 ring-indigo-500/40"
                        : "bg-[#0B1021] border-white/10 hover:border-white/20 hover:bg-black/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{asset.icon}</span>
                        <div>
                          <div className="font-black text-sm text-white">{asset.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{asset.symbol}</div>
                        </div>
                      </div>

                      <div className="text-left">
                        <div className="text-base font-black text-white">{asset.price.toLocaleString()} <span className="text-xs text-slate-400">ر.س</span></div>
                        <div className={`text-xs font-black flex items-center justify-end gap-1 ${isUp ? "text-emerald-400" : "text-rose-400"}`}>
                          {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          <span>{isUp ? "+" : ""}{asset.changePercent}%</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-2.5 line-clamp-1">{asset.description}</p>

                    {/* Position holdings indicator */}
                    {pos && pos.quantity > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className="text-amber-300 font-bold">المحفظة الممتلكة:</span>
                        <span className="font-black text-white">{pos.quantity} وحدة (بسعر متوسط {Math.round(pos.avgCostBasis)} ر.س)</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* PORTFOLIO SUMMARY CARD */}
            <div className="bg-[#0B1021] border border-white/10 p-5 rounded-2xl space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-sm text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>محفظة الشركة الاستثمارية الحالية</span>
                </h4>
                <button
                  onClick={handleApplyFairValueRevaluation}
                  className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>قيد تسوية IFRS 9</span>
                </button>
              </div>

              {portfolio.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs">
                  لا توجد صفقات مفتوحة بالمحفظة حالياً. استخدم نموذج التداول لإرسال أول أمر.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-right">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 font-bold">
                        <th className="pb-2">الأصل</th>
                        <th className="pb-2">الكمية</th>
                        <th className="pb-2">تكلفة الشراء</th>
                        <th className="pb-2">السعر الحالي</th>
                        <th className="pb-2">القيمة السوقية</th>
                        <th className="pb-2">ربح/خسارة غ.م</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium">
                      {portfolio.map((pos) => {
                        const asset = marketAssets.find((a) => a.id === pos.assetId);
                        const currPrice = asset?.price || pos.avgCostBasis;
                        const mktVal = pos.quantity * currPrice;
                        const costBasis = pos.quantity * pos.avgCostBasis;
                        const unGain = mktVal - costBasis;

                        return (
                          <tr key={pos.assetId}>
                            <td className="py-2.5 font-black text-white">{asset?.name || pos.assetId}</td>
                            <td className="py-2.5 font-bold text-slate-300">{pos.quantity}</td>
                            <td className="py-2.5 text-slate-300">{Math.round(pos.avgCostBasis).toLocaleString()} ر.س</td>
                            <td className="py-2.5 text-white font-bold">{currPrice.toLocaleString()} ر.س</td>
                            <td className="py-2.5 font-black text-cyan-300">{mktVal.toLocaleString()} ر.س</td>
                            <td className={`py-2.5 font-black ${unGain >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                              {unGain >= 0 ? "+" : ""}{unGain.toLocaleString()} ر.س
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* TRADE ORDER FORM & JOURNAL ENTRY PREVIEW (5 COLS) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#0B1021] border border-white/10 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-amber-400" />
                  <span>تجهيز أمر التداول وقيده المحاسبي</span>
                </h3>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
                  {selectedAsset.symbol}
                </span>
              </div>

              <form onSubmit={handleExecuteTrade} className="space-y-4">
                
                {/* BUY / SELL TOGGLE */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setTradeAction("BUY")}
                    className={`py-2 rounded-lg font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      tradeAction === "BUY"
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>أمر شراء (BUY)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTradeAction("SELL")}
                    className={`py-2 rounded-lg font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      tradeAction === "SELL"
                        ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Minus className="w-4 h-4" />
                    <span>أمر بيع (SELL)</span>
                  </button>
                </div>

                {/* QUANTITY INPUT */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-300 block">الكمية المطلوب تداولها:</label>
                  <input
                    type="number"
                    min={1}
                    value={tradeQuantity}
                    onChange={(e) => setTradeQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>

                {/* PAYMENT METHOD TOGGLE */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-300 block">طريقة السداد / المعالجة الماليّة:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("CASH")}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                        paymentMethod === "CASH"
                          ? "bg-indigo-600/30 border-indigo-400 text-indigo-200"
                          : "bg-black/30 border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      💵 نقداً (حساب البنك)
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("MARGIN")}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                        paymentMethod === "MARGIN"
                          ? "bg-purple-600/30 border-purple-400 text-purple-200"
                          : "bg-black/30 border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      💳 تداول بالهامش (ائتمان/دين)
                    </button>
                  </div>
                </div>

                {/* ORDER PREVIEW BREAKDOWN */}
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>قيمة الصفقة الأساسية:</span>
                    <span className="text-white font-mono font-bold">{(selectedAsset.price * tradeQuantity).toLocaleString()} ر.س</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>رسوم وعمولة التداول (0.15%):</span>
                    <span className="text-amber-400 font-mono font-bold">{(selectedAsset.price * tradeQuantity * commissionRate).toFixed(2)} ر.س</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between font-black text-sm text-white">
                    <span>صافي القيمة المطلوبة:</span>
                    <span className="text-emerald-400 font-mono">
                      {(selectedAsset.price * tradeQuantity * (1 + (tradeAction === "BUY" ? commissionRate : -commissionRate))).toLocaleString()} ر.س
                    </span>
                  </div>
                </div>

                {/* REAL-TIME JOURNAL ENTRY PREVIEW BOX */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-950 to-indigo-950/60 border border-indigo-500/30 space-y-2.5 text-xs">
                  <div className="font-black text-indigo-300 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>القيد المحاسبي المتولد تلقائياً (Double-Entry)</span>
                  </div>

                  <div className="space-y-1.5 font-mono text-[12px] bg-black/60 p-3 rounded-lg border border-white/10">
                    {tradeAction === "BUY" ? (
                      <>
                        <div className="text-emerald-300 flex justify-between">
                          <span>[من مدين] حـ/ استثمارات مالية ({selectedAsset.name})</span>
                          <span>{(selectedAsset.price * tradeQuantity).toLocaleString()} ر.س</span>
                        </div>
                        <div className="text-amber-300 flex justify-between">
                          <span>[من مدين] حـ/ مصروف عمولات ومصاريف تداول</span>
                          <span>{(selectedAsset.price * tradeQuantity * commissionRate).toFixed(2)} ر.س</span>
                        </div>
                        <div className="text-cyan-300 flex justify-between pr-4 pt-1 border-t border-white/10">
                          <span>[إلى دائن] {paymentMethod === "CASH" ? "حـ/ النقدية في البنك" : "حـ/ قروض وتسهيلات تداول"}</span>
                          <span>{(selectedAsset.price * tradeQuantity * (1 + commissionRate)).toLocaleString()} ر.س</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-emerald-300 flex justify-between">
                          <span>[من مدين] حـ/ النقدية في البنك (المحصل)</span>
                          <span>{(selectedAsset.price * tradeQuantity * (1 - commissionRate)).toLocaleString()} ر.س</span>
                        </div>
                        <div className="text-cyan-300 flex justify-between pr-4 pt-1 border-t border-white/10">
                          <span>[إلى دائن] حـ/ استثمارات مالية (التكلفة)</span>
                          <span>{(selectedAsset.price * tradeQuantity).toLocaleString()} ر.س</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer hover:scale-101 ${
                    tradeAction === "BUY"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30"
                      : "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-rose-600/30"
                  }`}
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>تأفيذ وإرسال القيد المحاسبي المباشر</span>
                </button>

              </form>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: LIVE BALANCE SHEET */}
      {/* ========================================================================= */}
      {activeSubTab === "balance" && (
        <div className="space-y-6">
          <div className="bg-[#0B1021] border border-white/10 p-6 rounded-3xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Scale className="w-6 h-6 text-cyan-400" />
                  <span>قائمة المركز المالي والميزانية العمومية الحية (Balance Sheet)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">تتغير الأرصدة تلقائياً مع كل قيد يومية أو تحرك بأسعار الأسواق وفق معايير IFRS</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black">
                  معادلة توازن الميزانية: 100% متوازنة
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* ASSETS COLUMN */}
              <div className="space-y-4 bg-black/40 p-5 rounded-2xl border border-cyan-500/20">
                <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
                  <h4 className="font-black text-base text-cyan-300 flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    <span>جانب الأصول (Assets)</span>
                  </h4>
                  <span className="font-mono text-sm font-black text-cyan-300">{totalAssets.toLocaleString()} ر.س</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 space-y-1">
                    <div className="flex justify-between font-bold text-slate-200">
                      <span>النقدية وما يعادلها بالبنك</span>
                      <span className="font-mono text-emerald-400">{cash.toLocaleString()} ر.س</span>
                    </div>
                    <p className="text-[11px] text-slate-400">السيولة الجاهزة للتسويات المالية والالتزامات</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 space-y-2">
                    <div className="flex justify-between font-bold text-slate-200">
                      <span>محفظة الاستثمارات والأوراق المالية (بالتكلفة)</span>
                      <span className="font-mono text-purple-300">{totalCostBasis.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-300 border-t border-white/10 pt-1.5">
                      <span>تسويات إعادة التقييم للقيمة العادلة (IFRS 9)</span>
                      <span className={`font-mono ${totalUnrealizedGains >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {totalUnrealizedGains >= 0 ? "+" : ""}{totalUnrealizedGains.toLocaleString()} ر.س
                      </span>
                    </div>
                    <div className="flex justify-between font-black text-cyan-300 border-t border-white/10 pt-1.5">
                      <span>إجمالي محفظة الاستثمارات بالقيمة السوقية العادلة</span>
                      <span className="font-mono">{totalFairMarketValue.toLocaleString()} ر.س</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex justify-between items-center font-black text-sm text-cyan-200">
                  <span>مجموع الأصول (TOTAL ASSETS)</span>
                  <span className="font-mono text-base">{totalAssets.toLocaleString()} ر.س</span>
                </div>
              </div>

              {/* LIABILITIES & EQUITY COLUMN */}
              <div className="space-y-4 bg-black/40 p-5 rounded-2xl border border-purple-500/20">
                <div className="flex items-center justify-between border-b border-purple-500/30 pb-3">
                  <h4 className="font-black text-base text-purple-300 flex items-center gap-2">
                    <Scale className="w-5 h-5" />
                    <span>الالتزامات وحقوق الملكية (Liabilities & Equity)</span>
                  </h4>
                  <span className="font-mono text-sm font-black text-purple-300">{totalLiabilitiesAndEquity.toLocaleString()} ر.س</span>
                </div>

                <div className="space-y-3 text-xs">
                  {/* LIABILITIES */}
                  <div className="p-3 rounded-xl bg-white/5 space-y-1">
                    <div className="text-xs font-black text-rose-300">أولاً: الالتزامات القصيرة الأجل (Liabilities)</div>
                    <div className="flex justify-between font-bold text-slate-200 pt-1">
                      <span>قروض وتسهيلات تداول بالهامش</span>
                      <span className="font-mono text-rose-400">{marginLoan.toLocaleString()} ر.س</span>
                    </div>
                  </div>

                  {/* EQUITY */}
                  <div className="p-3 rounded-xl bg-white/5 space-y-2">
                    <div className="text-xs font-black text-purple-300">ثانياً: حقوق الملكية (Owners' Equity)</div>
                    
                    <div className="flex justify-between text-slate-300">
                      <span>رأس المال المبدئي المستثمر</span>
                      <span className="font-mono font-bold text-white">{initialCapital.toLocaleString()} ر.س</span>
                    </div>

                    <div className="flex justify-between text-slate-300 border-t border-white/10 pt-1.5">
                      <span>الأرباح/الخسائر المحققة من التداول</span>
                      <span className={`font-mono font-bold ${realizedGains >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {realizedGains >= 0 ? "+" : ""}{realizedGains.toLocaleString()} ر.س
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-300 border-t border-white/10 pt-1.5">
                      <span>مصاريف العمولات ورسوم التداول</span>
                      <span className="font-mono font-bold text-rose-400">-{totalCommissions.toLocaleString()} ر.س</span>
                    </div>

                    <div className="flex justify-between text-slate-300 border-t border-white/10 pt-1.5">
                      <span>أرباح غير محققة (إعادة التقييم بالقيمة العادلة)</span>
                      <span className={`font-mono font-bold ${totalUnrealizedGains >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {totalUnrealizedGains >= 0 ? "+" : ""}{totalUnrealizedGains.toLocaleString()} ر.س
                      </span>
                    </div>

                    <div className="flex justify-between font-black text-purple-200 border-t border-white/10 pt-1.5">
                      <span>صافي حقوق الملكية الصافية</span>
                      <span className="font-mono text-sm">{totalEquity.toLocaleString()} ر.س</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex justify-between items-center font-black text-sm text-purple-200">
                  <span>مجموع الالتزامات وحقوق الملكية</span>
                  <span className="font-mono text-base">{totalLiabilitiesAndEquity.toLocaleString()} ر.س</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: LIVE INCOME STATEMENT */}
      {/* ========================================================================= */}
      {activeSubTab === "income" && (
        <div className="bg-[#0B1021] border border-white/10 p-6 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <PieChart className="w-6 h-6 text-emerald-400" />
                <span>قائمة الدخل ونتائج أعمال التداول (Income Statement)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">قياس الإيرادات والمصاريف وصافي أرباح/خسائر النشاط المالي</p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto bg-black/40 border border-white/10 p-6 rounded-2xl space-y-4 text-sm">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <span className="font-bold text-slate-300">أرباح/خسائر التداول المحققة (Realized Capital Gains)</span>
              <span className={`font-mono font-black ${realizedGains >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {realizedGains >= 0 ? "+" : ""}{realizedGains.toLocaleString()} ر.س
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <span className="font-bold text-slate-300">أرباح/خسائر إعادة التقييم بالقيمة العادلة غير المحققة (Unrealized)</span>
              <span className={`font-mono font-black ${totalUnrealizedGains >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {totalUnrealizedGains >= 0 ? "+" : ""}{totalUnrealizedGains.toLocaleString()} ر.س
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-white/10 text-rose-300">
              <span className="font-bold">خصم: مصروف عمولات ورسوم التداول المباشرة</span>
              <span className="font-mono font-black">-{totalCommissions.toLocaleString()} ر.س</span>
            </div>

            <div className="pt-3 border-t-2 border-indigo-500/40 flex justify-between items-center text-base font-black">
              <span className="text-white">صافي دخل/خسارة نشاط التداول الفترية:</span>
              <span className={`font-mono text-xl ${netIncome >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {netIncome >= 0 ? "+" : ""}{netIncome.toLocaleString()} ر.س
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: JOURNAL LEDGER */}
      {/* ========================================================================= */}
      {activeSubTab === "journal" && (
        <div className="bg-[#0B1021] border border-white/10 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <History className="w-6 h-6 text-purple-400" />
              <span>سجل القيود اليومية التلقائية والعمليات المزدوجة</span>
            </h3>
            <span className="text-xs text-slate-400">إجمالي القيود المسجلة: {journalEntries.length} قيد</span>
          </div>

          {journalEntries.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              لم يتم تسجيل أي صفقات أو قيود بعد. نفّذ أمر تداول من المنصة للبدء.
            </div>
          ) : (
            <div className="space-y-3">
              {journalEntries.map((entry) => (
                <div key={entry.id} className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-black text-white">
                    <span className="text-amber-400 font-mono">[{entry.id}] — {entry.timestamp}</span>
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                      {entry.tradeType}
                    </span>
                  </div>

                  <p className="text-slate-300 font-medium">{entry.note}</p>

                  <div className="bg-black/60 p-3 rounded-xl border border-white/5 font-mono space-y-1">
                    <div className="text-emerald-400 flex justify-between">
                      <span>(مدين) {entry.debitAccount}</span>
                      <span>{entry.debitAmount.toLocaleString()} ر.س</span>
                    </div>

                    {entry.feeAmount && entry.feeAmount > 0 && (
                      <div className="text-amber-300 flex justify-between">
                        <span>(مدين) {entry.feeAccount}</span>
                        <span>{entry.feeAmount.toLocaleString()} ر.س</span>
                      </div>
                    )}

                    <div className="text-cyan-300 flex justify-between pr-4 pt-1 border-t border-white/10">
                      <span>(دائن) {entry.creditAccount}</span>
                      <span>{entry.creditAmount.toLocaleString()} ر.س</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 5: PRESET EDUCATIONAL SCENARIOS */}
      {/* ========================================================================= */}
      {activeSubTab === "scenarios" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0B1021] border border-white/10 p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
              <Zap className="w-5 h-5" />
              <span>سيناريو 1: شراء أسهم بالكامل نقداً</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              محاكاة شراء 200 سهم من شركة التقنية المتطورة باستعمال النقدية بالبنك وإثبات مصروف عمولة التداول المباشر.
            </p>
            <button
              onClick={() => handleLoadScenario("BUY_STOCK_CASH")}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 text-xs font-black cursor-pointer transition-all"
            >
              تحميل السيناريو للتجربة
            </button>
          </div>

          <div className="bg-[#0B1021] border border-white/10 p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-purple-400 font-black text-sm">
              <Zap className="w-5 h-5" />
              <span>سيناريو 2: التداول بالهامش والرفع المالي</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              شراء كمية كبيرة بالاعتماد على التسهيلات الائتمانية دون نقص النقدية، مع إثبات التزام قروض التداول في الميزانية.
            </p>
            <button
              onClick={() => handleLoadScenario("MARGIN_LEVERAGE")}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-black cursor-pointer transition-all"
            >
              تحميل السيناريو للتجربة
            </button>
          </div>

          <div className="bg-[#0B1021] border border-white/10 p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-black text-sm">
              <Zap className="w-5 h-5" />
              <span>سيناريو 3: المضاربة على الذهب والسلع</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              شراء كميات من سبائك الذهب ومراقبة تحرك أسعارها لبيعها لاحقاً وتحقيق أرباح رأسمالية محققة.
            </p>
            <button
              onClick={() => handleLoadScenario("COMMODITY_FLIP")}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40 text-xs font-black cursor-pointer transition-all"
            >
              تحميل السيناريو للتجربة
            </button>
          </div>

          <div className="bg-[#0B1021] border border-white/10 p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-black text-sm">
              <Zap className="w-5 h-5" />
              <span>سيناريو 4: إعادة تقييم المحفظة بالسعر السائد (IFRS 9)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              إجراء قيد تسوية القيمة العادلة بنهاية فترة التداول لتعديل القيمة الدفترية للأوراق المالية.
            </p>
            <button
              onClick={() => handleLoadScenario("YEAR_END_REVAL")}
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/40 text-xs font-black cursor-pointer transition-all"
            >
              تحميل السيناريو للتجربة
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
