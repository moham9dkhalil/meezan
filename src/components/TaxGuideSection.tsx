import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Globe,
  Percent,
  Building2,
  Building,
  Coins,
  Receipt,
  Calculator,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Info,
  HelpCircle,
  RefreshCw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Scale,
  BookOpen,
  Award,
  Sliders,
  DollarSign,
  Printer,
  Download,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  Send,
  Upload,
  Eye,
  Lightbulb,
  PiggyBank,
  Users
} from "lucide-react";
import { ActiveTab } from "../types";
import { COUNTRIES_TAX_DATA, CountryTaxData, TaxStepGuide } from "../data/taxGuideData";
import { InteractiveTaxInvoiceModel } from "./InteractiveTaxInvoiceModel";
import { TaxFormSimulator } from "./TaxFormSimulator";
import { AssetDepreciationCalculator } from "./AssetDepreciationCalculator";
import { IncomeTaxCalculator } from "./IncomeTaxCalculator";
import { PersonalBudgetTracker } from "./PersonalBudgetTracker";
import { PayrollSimulator } from "./PayrollSimulator";

interface TaxGuideSectionProps {
  onSelectTab?: (tab: ActiveTab) => void;
}

export function TaxGuideSection({ onSelectTab }: TaxGuideSectionProps) {
  const [selectedCountryId, setSelectedCountryId] = useState<string>("saudi");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeSubTab, setActiveSubTab] = useState<
    "interactive_invoice" | "form_simulator" | "asset_depreciation" | "income_tax_calculator" | "personal_budget" | "payroll_simulator" | "wizard" | "samples" | "pitfalls" | "overview" | "details" | "steps" | "einvoicing" | "calculator" | "penalties" | "faqs"
  >("overview");

  // --- TAX PITFALLS & AUDIT SCANNER STATE ---
  const [pitfallCategoryFilter, setPitfallCategoryFilter] = useState<string>("all");
  const [activePitfallId, setActivePitfallId] = useState<string | null>("pitfall_1");
  const [scannerAnswers, setScannerAnswers] = useState<Record<string, boolean>>({
    q1_online_sales: true,
    q2_foreign_services: true,
    q3_credit_notes: false,
    q4_exempt_goods: false,
    q5_personal_expenses: false,
    q6_bank_reconcile: false,
  });
  const [scannerEvaluated, setScannerEvaluated] = useState<boolean>(false);

  // Selected Country Data
  const currentCountry = useMemo(() => {
    return COUNTRIES_TAX_DATA.find((c) => c.id === selectedCountryId) || COUNTRIES_TAX_DATA[0];
  }, [selectedCountryId]);

  // Selected Step Guide index
  const [activeGuideIdx, setActiveGuideIdx] = useState<number>(0);
  const [activeStepNum, setActiveStepNum] = useState<number>(1);

  // Accordion open states
  const [expandedTaxTypeId, setExpandedTaxTypeId] = useState<string | null>("vat");
  const [expandedFaqIdx, setExpandedFaqIdx] = useState<number | null>(0);

  // --- REAL INVOICE & REPORT SAMPLES STATE ---
  const [sampleCategory, setSampleCategory] = useState<"invoice" | "reports">("invoice");
  const [sampleInvoiceType, setSampleInvoiceType] = useState<"b2b" | "b2c">("b2b");
  const [showQrDetails, setShowQrDetails] = useState<boolean>(false);
  const [copiedSample, setCopiedSample] = useState<boolean>(false);
  const [activeReportType, setActiveReportType] = useState<
    "income_statement" | "balance_sheet" | "trial_balance" | "vat_reconciliation"
  >("income_statement");
  const [sampleReportPeriod, setSampleReportPeriod] = useState<"2026" | "2025">("2026");

  // --- LIVE CALCULATOR STATE ---
  const [calcTaxType, setCalcTaxType] = useState<string>("vat");
  const [calcAmount, setCalcAmount] = useState<number>(10000);
  const [calcExpenses, setCalcExpenses] = useState<number>(4000);
  const [calcIncludeVat, setCalcIncludeVat] = useState<boolean>(false);
  const [calcIncludeThreshold, setCalcIncludeThreshold] = useState<boolean>(true);

  // --- TAX DECLARATION GENERATOR & FILING WIZARD STATE ---
  const [wizardTaxType, setWizardTaxType] = useState<"vat" | "corporate" | "payroll" | "withholding">("vat");
  const [wizardPeriod, setWizardPeriod] = useState<string>("الربع الأول 2026 (Q1)");
  const [taxpayerName, setTaxpayerName] = useState<string>("شركة الميزان الرقمي للتجارة والتقنية");
  const [tinNumber, setTinNumber] = useState<string>("310892401900003");
  const [wizardStep, setWizardStep] = useState<number>(1); // 1: Info, 2: Financials, 3: Official Sheet, 4: Portal Simulator

  // Financial Inputs for Wizard
  const [stdSales, setStdSales] = useState<number>(350000); // المبيعات الخاضعة للنسبة الأساسية
  const [zeroSales, setZeroSales] = useState<number>(40000); // المبيعات الخاضعة لنسبة الصفر
  const [exemptSales, setExemptSales] = useState<number>(20000); // المبيعات المعفاة
  const [exportSales, setExportSales] = useState<number>(60000); // الصادرات
  
  const [stdPurchases, setStdPurchases] = useState<number>(180000); // المشتريات المحلية
  const [importPurchases, setImportPurchases] = useState<number>(50000); // الاستيرادات الجمركية
  const [capitalPurchases, setCapitalPurchases] = useState<number>(30000); // الأصول الرأسمالية
  const [priorCredit, setPriorCredit] = useState<number>(5000); // رصيد دائن مدور سابقاً

  const [simulatedPortalStep, setSimulatedPortalStep] = useState<number>(1);
  const [copiedSheet, setCopiedSheet] = useState<boolean>(false);

  // Filtered Countries or Content based on Search
  const isSearching = searchQuery.trim().length > 0;

  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    const query = searchQuery.toLowerCase();
    
    const matches: {
      country: CountryTaxData;
      type: "tax" | "step" | "penalty" | "faq";
      title: string;
      desc: string;
    }[] = [];

    COUNTRIES_TAX_DATA.forEach((country) => {
      // Check Country
      if (country.countryName.toLowerCase().includes(query) || country.authorityName.toLowerCase().includes(query)) {
        matches.push({
          country,
          type: "tax",
          title: `دليل ${country.countryName}`,
          desc: country.summary
        });
      }

      // Check Tax Types
      country.taxTypes.forEach((t) => {
        if (t.title.toLowerCase().includes(query) || t.summary.toLowerCase().includes(query)) {
          matches.push({
            country,
            type: "tax",
            title: `${t.title} (${country.countryName})`,
            desc: t.summary
          });
        }
      });

      // Check Step Guides
      country.stepGuides.forEach((g) => {
        if (g.title.toLowerCase().includes(query) || g.summary.toLowerCase().includes(query)) {
          matches.push({
            country,
            type: "step",
            title: `${g.title} (${country.countryName})`,
            desc: g.summary
          });
        }
      });

      // Check Penalties
      country.penalties.forEach((p) => {
        if (p.violation.toLowerCase().includes(query) || p.fineAmount.toLowerCase().includes(query)) {
          matches.push({
            country,
            type: "penalty",
            title: `غرامة: ${p.violation} (${country.countryName})`,
            desc: p.fineAmount
          });
        }
      });

      // Check FAQs
      country.faqs.forEach((f) => {
        if (f.q.toLowerCase().includes(query) || f.a.toLowerCase().includes(query)) {
          matches.push({
            country,
            type: "faq",
            title: `سؤال: ${f.q} (${country.countryName})`,
            desc: f.a
          });
        }
      });
    });

    return matches;
  }, [searchQuery, isSearching]);

  // Calculator Logic based on Country
  const calcResult = useMemo(() => {
    const amount = Number(calcAmount) || 0;
    const expenses = Number(calcExpenses) || 0;

    if (currentCountry.id === "saudi") {
      if (calcTaxType === "vat") {
        const vatRate = 0.15;
        let vatValue = 0;
        let baseValue = amount;
        if (calcIncludeVat) {
          baseValue = amount / 1.15;
          vatValue = amount - baseValue;
        } else {
          vatValue = amount * vatRate;
        }
        const inputVat = expenses * 0.15;
        const netPayable = Math.max(0, vatValue - inputVat);
        return {
          taxName: "ضريبة القيمة المضافة (15%) - السعودية",
          baseAmount: baseValue,
          taxAmount: vatValue,
          inputTax: inputVat,
          totalWithTax: baseValue + vatValue,
          netPayable,
          formula: "ضريبة المخرجات (15%) - ضريبة المدخلات المقبولة (15%) = صافي المستحقات لـ ZATCA",
          journalEntry: `من حـ/ ضريبة مخرجات (${vatValue.toFixed(2)}) | إلى حـ/ ضريبة مدخلات (${inputVat.toFixed(2)}) | إلى حـ/ هيئة الزكاة والضريبة والجمارك (${netPayable.toFixed(2)})`
        };
      } else if (calcTaxType === "zakat") {
        const netProfit = Math.max(0, amount - expenses);
        const zakatBase = amount; // simplified representation
        const zakatAmount = netProfit * 0.025;
        return {
          taxName: "الزكاة الشرعية للشركات (2.5%) - السعودية",
          baseAmount: amount,
          taxAmount: zakatAmount,
          netPayable: zakatAmount,
          formula: "(صافي الربح المعدل × 2.5%) أو على الوعاء الزكوي التمويلي",
          journalEntry: `من حـ/ مصروف الزكاة الشرعية (${zakatAmount.toFixed(2)}) | إلى حـ/ مخصص الزكاة والهيئة (${zakatAmount.toFixed(2)})`
        };
      } else if (calcTaxType === "corporate") {
        const netProfit = Math.max(0, amount - expenses);
        const corpTax = netProfit * 0.20;
        return {
          taxName: "ضريبة الدخل على حصة الأجنبي (20%) - السعودية",
          baseAmount: netProfit,
          taxAmount: corpTax,
          netPayable: corpTax,
          formula: "صافي الأرباح المعدلة للشركاء غير السعوديين × 20%",
          journalEntry: `من حـ/ مصروف ضريبة الدخل (${corpTax.toFixed(2)}) | إلى حـ/ هيئة الزكاة والضريبة والجمارك (${corpTax.toFixed(2)})`
        };
      }
    } else if (currentCountry.id === "egypt") {
      if (calcTaxType === "vat") {
        const vatRate = 0.14;
        let vatValue = 0;
        let baseValue = amount;
        if (calcIncludeVat) {
          baseValue = amount / 1.14;
          vatValue = amount - baseValue;
        } else {
          vatValue = amount * vatRate;
        }
        const inputVat = expenses * 0.14;
        const netPayable = Math.max(0, vatValue - inputVat);
        return {
          taxName: "ضريبة القيمة المضافة (14%) - مصر",
          baseAmount: baseValue,
          taxAmount: vatValue,
          inputTax: inputVat,
          totalWithTax: baseValue + vatValue,
          netPayable,
          formula: "ضريبة المخرجات (14%) - ضريبة المدخلات بالملف الإلكتروني (14%)",
          journalEntry: `من حـ/ جاري ضريبة القيمة المضافة (${vatValue.toFixed(2)}) | إلى حـ/ مصلحة الضرائب المصرية ETA (${netPayable.toFixed(2)})`
        };
      } else if (calcTaxType === "corporate") {
        const netProfit = Math.max(0, amount - expenses);
        const taxVal = netProfit * 0.225;
        return {
          taxName: "ضريبة أرباح الأشخاص الاعتبارية (22.5%) - مصر",
          baseAmount: netProfit,
          taxAmount: taxVal,
          netPayable: taxVal,
          formula: "صافي الربح الضريبي المعدل × 22.5%",
          journalEntry: `من حـ/ مصروف ضريبة أرباح الشركات (${taxVal.toFixed(2)}) | إلى حـ/ مصلحة الضرائب المصرية (${taxVal.toFixed(2)})`
        };
      }
    } else if (currentCountry.id === "uae") {
      if (calcTaxType === "corporate") {
        const netProfit = Math.max(0, amount - expenses);
        let taxableProfit = netProfit;
        if (calcIncludeThreshold) {
          taxableProfit = Math.max(0, netProfit - 375000);
        }
        const corpTax = taxableProfit * 0.09;
        return {
          taxName: "ضريبة الشركات (9%) - الإمارات",
          baseAmount: netProfit,
          exemptAmount: calcIncludeThreshold ? Math.min(375000, netProfit) : 0,
          taxableAmount: taxableProfit,
          taxAmount: corpTax,
          netPayable: corpTax,
          formula: "(صافي الأرباح - 375,000 درهم إعفاء) × 9%",
          journalEntry: `من حـ/ مصروف ضريبة الشركات (${corpTax.toFixed(2)}) | إلى حـ/ الهيئة الاتحادية للضرائب FTA (${corpTax.toFixed(2)})`
        };
      } else if (calcTaxType === "vat") {
        const vatRate = 0.05;
        let vatValue = amount * vatRate;
        const inputVat = expenses * 0.05;
        const netPayable = Math.max(0, vatValue - inputVat);
        return {
          taxName: "ضريبة القيمة المضافة (5%) - الإمارات",
          baseAmount: amount,
          taxAmount: vatValue,
          inputTax: inputVat,
          totalWithTax: amount + vatValue,
          netPayable,
          formula: "ضريبة المخرجات (5%) - ضريبة المدخلات المقبولة (5%)",
          journalEntry: `من حـ/ ضريبة المخرجات (${vatValue.toFixed(2)}) | إلى حـ/ FTA الإمارات (${netPayable.toFixed(2)})`
        };
      }
    }

    // Default Fallback Calculator
    const vatVal = amount * 0.15;
    return {
      taxName: `احتساب الضريبة القياسية - ${currentCountry.countryName}`,
      baseAmount: amount,
      taxAmount: vatVal,
      netPayable: vatVal,
      formula: "المبلغ الإجمالي × النسبة الضريبية المقررة",
      journalEntry: `من حـ/ مصروف الضريبة (${vatVal.toFixed(2)}) | إلى حـ/ التزامات السلطة الضريبية (${vatVal.toFixed(2)})`
    };
  }, [calcTaxType, calcAmount, calcExpenses, calcIncludeVat, calcIncludeThreshold, currentCountry]);

  // --- WIZARD DECLARATION RESULT COMPUTATION ---
  const wizardResult = useMemo(() => {
    let vatRate = 0.15; // default Saudi ZATCA
    if (currentCountry.id === "egypt") vatRate = 0.14;
    else if (currentCountry.id === "uae" || currentCountry.id === "bahrain") vatRate = 0.05;
    else if (currentCountry.id === "jordan") vatRate = 0.16;

    if (wizardTaxType === "vat") {
      const outputTaxStd = stdSales * vatRate;
      const outputTaxTotal = outputTaxStd;

      const inputTaxStd = stdPurchases * vatRate;
      const inputTaxImports = importPurchases * vatRate;
      const inputTaxCapital = capitalPurchases * vatRate;
      const inputTaxTotal = inputTaxStd + inputTaxImports + inputTaxCapital;

      const netTaxBeforePrior = outputTaxTotal - inputTaxTotal;
      const finalNetPayable = netTaxBeforePrior - priorCredit;

      // Sadad / Payment Ref code
      const sadadRefNumber = `SADAD-${currentCountry.authorityAbbr}-${Math.floor(100000000 + Math.random() * 900000000)}`;

      return {
        taxTypeTitle: `إقرار ضريبة القيمة المضافة (${(vatRate * 100).toFixed(0)}%) - ${currentCountry.countryName}`,
        outputTaxStd,
        outputTaxTotal,
        inputTaxStd,
        inputTaxImports,
        inputTaxCapital,
        inputTaxTotal,
        netTaxBeforePrior,
        finalNetPayable,
        isRefundable: finalNetPayable < 0,
        sadadRefNumber,
        journalEntry: finalNetPayable > 0
          ? `من حـ/ ضريبة المخرجات (${outputTaxTotal.toLocaleString()}) | إلى حـ/ ضريبة المدخلات (${inputTaxTotal.toLocaleString()}) | إلى حـ/ رصيد سابق مدور (${priorCredit.toLocaleString()}) | إلى حـ/ ${currentCountry.authorityName} (${finalNetPayable.toLocaleString()} ${currentCountry.currencySymbol})`
          : `من حـ/ ضريبة المخرجات (${outputTaxTotal.toLocaleString()}) | من حـ/ رصيد دائن مدور لـ ${currentCountry.authorityName} (${Math.abs(finalNetPayable).toLocaleString()}) | إلى حـ/ ضريبة المدخلات (${inputTaxTotal.toLocaleString()})`
      };
    } else if (wizardTaxType === "corporate") {
      const totalRevenue = stdSales + zeroSales + exportSales;
      const totalExpenses = stdPurchases + capitalPurchases + importPurchases;
      const netProfit = Math.max(0, totalRevenue - totalExpenses);
      
      let corpRate = 0.20;
      if (currentCountry.id === "egypt") corpRate = 0.225;
      else if (currentCountry.id === "uae") corpRate = netProfit > 375000 ? 0.09 : 0.0;
      else if (currentCountry.id === "qatar") corpRate = 0.10;

      const taxableBase = currentCountry.id === "uae" ? Math.max(0, netProfit - 375000) : netProfit;
      const corpTaxAmount = taxableBase * corpRate;
      const finalNetPayable = corpTaxAmount - priorCredit;

      return {
        taxTypeTitle: `إقرار ضريبة أرباح الشركات والدخل السنوي - ${currentCountry.countryName}`,
        totalRevenue,
        totalExpenses,
        netProfit,
        taxableBase,
        corpRate,
        corpTaxAmount,
        finalNetPayable,
        isRefundable: finalNetPayable < 0,
        sadadRefNumber: `CORP-${currentCountry.authorityAbbr}-${Math.floor(100000000 + Math.random() * 900000000)}`,
        journalEntry: `من حـ/ مصروف ضريبة أرباح الشركات (${corpTaxAmount.toLocaleString()}) | إلى حـ/ ${currentCountry.authorityName} (${corpTaxAmount.toLocaleString()} ${currentCountry.currencySymbol})`
      };
    } else if (wizardTaxType === "payroll") {
      const totalSalaries = stdSales;
      const taxExemptSalaries = zeroSales;
      const taxableSalaries = Math.max(0, totalSalaries - taxExemptSalaries);
      const payrollTaxVal = taxableSalaries * 0.10;
      const finalNetPayable = payrollTaxVal - priorCredit;

      return {
        taxTypeTitle: `إقرار ضريبة كسب العمل والأجور والرواتب - ${currentCountry.countryName}`,
        totalSalaries,
        taxExemptSalaries,
        taxableSalaries,
        payrollTaxVal,
        finalNetPayable,
        isRefundable: finalNetPayable < 0,
        sadadRefNumber: `PAYROLL-${currentCountry.authorityAbbr}-${Math.floor(100000000 + Math.random() * 900000000)}`,
        journalEntry: `من حـ/ أمانات ضريبة كسب العمل المستقطعة من الموظفين (${payrollTaxVal.toLocaleString()}) | إلى حـ/ ${currentCountry.authorityName} (${finalNetPayable.toLocaleString()} ${currentCountry.currencySymbol})`
      };
    } else {
      const totalPayments = stdSales;
      const whtRate = 0.05;
      const whtAmount = totalPayments * whtRate;
      const finalNetPayable = whtAmount - priorCredit;

      return {
        taxTypeTitle: `إقرار ضريبة الاستقطاع / الخصم والإضافة - ${currentCountry.countryName}`,
        totalPayments,
        whtRate,
        whtAmount,
        finalNetPayable,
        isRefundable: finalNetPayable < 0,
        sadadRefNumber: `WHT-${currentCountry.authorityAbbr}-${Math.floor(100000000 + Math.random() * 900000000)}`,
        journalEntry: `من حـ/ أمانات ضريبة الاستقطاع والخصم من الموردين (${whtAmount.toLocaleString()}) | إلى حـ/ ${currentCountry.authorityName} (${finalNetPayable.toLocaleString()} ${currentCountry.currencySymbol})`
      };
    }
  }, [wizardTaxType, currentCountry, stdSales, zeroSales, exemptSales, exportSales, stdPurchases, importPurchases, capitalPurchases, priorCredit]);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* SECTION HEADER & HERO BANNER */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#0a0f24] via-[#0d1636] to-[#121c45] border border-indigo-500/30 p-6 sm:p-10 overflow-hidden shadow-2xl">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-600/15 to-transparent rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-600/15 to-transparent rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-right max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-black">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>الدليل الشامل المحين للضرائب والفوترة الرقمية 2026</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              دليل الضرائب العربي والأنظمة المالية الدولية ⚖️
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              مرجعك التفاعلي المتكامل لفهم قوانين الضرائب (القيمة المضافة، ضريبة الشركات، الزكاة، ضريبة الاستقطاع، كسب العمل)، مع أدلة تقديم الإقرارات خطوة بخطوة، وشروط الفوترة الإلكترونية وحاسبة الضرائب التفاعلية لكل بلد.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
              <span className="text-[11px] font-bold text-slate-300 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>6+ دول عربية ودولية</span>
              </span>
              <span className="text-[11px] font-bold text-slate-300 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>أدلة تقديم الإقرارات بالفيديو والخطوات</span>
              </span>
              <span className="text-[11px] font-bold text-slate-300 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-pink-400" />
                <span>حاسبة احتساب صافي المستحقات</span>
              </span>
              <span className="text-[11px] font-bold text-slate-300 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>جدول الغرامات والجزاءات الرسمية</span>
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center justify-center p-6 rounded-3xl bg-black/40 border border-white/10 text-center w-full md:w-64 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-3xl shadow-xl border border-white/20">
              {currentCountry.flag}
            </div>
            <div>
              <div className="font-black text-white text-base">{currentCountry.countryName}</div>
              <div className="text-[11px] text-indigo-300 font-bold">{currentCountry.authorityName} ({currentCountry.authorityAbbr})</div>
            </div>
            <a
              href={currentCountry.officialPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <span>البوابة الرسمية</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {currentCountry.id === "saudi" && (
        <section className="rounded-3xl border border-emerald-400/25 bg-emerald-500/5 p-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-black"><ShieldAlert className="w-4 h-4" /> مصدر وتحديثات السعودية</div>
              <h2 className="text-lg font-black text-white mt-2">ابدأ من المرجع الرسمي قبل تقديم أي إقرار</h2>
              <p className="text-xs text-slate-300 leading-relaxed mt-2 max-w-3xl">راجعت هذه الروابط في 11 أغسطس 2026. استخدم المحاكيات للتعلّم فقط، ثم راجع البوابة والتعليمات الرسمية أو استشر مختصًا قبل أي تقديم أو سداد.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href="https://zatca.gov.sa/en/eServices/Pages/eServices-009.aspx" target="_blank" rel="noreferrer" className="px-3 py-2 rounded-xl border border-emerald-400/30 text-emerald-200 text-xs font-bold hover:bg-emerald-500/10 transition-colors">تقديم إقرار VAT</a>
              <a href="https://zatca.gov.sa/en/E-Invoicing/Introduction/Pages/What-is-e-invoicing.aspx" target="_blank" rel="noreferrer" className="px-3 py-2 rounded-xl border border-emerald-400/30 text-emerald-200 text-xs font-bold hover:bg-emerald-500/10 transition-colors">دليل فاتورة</a>
              <a href="https://zatca.gov.sa/en/HelpCenter/CustomerJourney/Pages/tax-journey.aspx" target="_blank" rel="noreferrer" className="px-3 py-2 rounded-xl border border-emerald-400/30 text-emerald-200 text-xs font-bold hover:bg-emerald-500/10 transition-colors">رحلة المكلف</a>
            </div>
          </div>
        </section>
      )}

      {/* SEARCH BAR & COUNTRY TABS BAR */}
      <div className="space-y-4">
        
        {/* Search Input */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="w-5 h-5 text-indigo-400 absolute right-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في دليل الضرائب (مثال: الفاتورة الإلكترونية، غرامة التأخير، ZATCA، ضريبة الشركات، الاستقطاع)..."
            className="w-full bg-[#0b1022] border border-indigo-500/30 rounded-2xl pr-12 pl-4 py-3.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 shadow-xl transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-black bg-white/10 w-5 h-5 rounded-full flex items-center justify-center"
            >
              ✕
            </button>
          )}
        </div>

        {/* SEARCH RESULTS OVERLAY IF SEARCHING */}
        {isSearching && (
          <div className="p-6 rounded-3xl bg-[#0b1022] border border-indigo-500/40 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between text-xs font-black text-white">
              <span>نتائج البحث عن "{searchQuery}": ({searchResults.length} نتيجة)</span>
              <button
                onClick={() => setSearchQuery("")}
                className="text-indigo-400 hover:underline cursor-pointer"
              >
                إغلاق البحث
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                لم نجد نتائج مطابقة لمصطلح البحث. جرب البحث عن: "فاتورة", "غرامة", "إقرار", "ZATCA", "ضريبة".
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-indigo-600">
                {searchResults.map((res, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedCountryId(res.country.id);
                      setSearchQuery("");
                    }}
                    className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-300 flex items-center gap-1.5">
                        <span>{res.country.flag}</span>
                        <span>{res.title}</span>
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                        {res.type === "tax" ? "نظام ضريبي" : res.type === "step" ? "دليل تقديم" : res.type === "penalty" ? "غرامة" : "سؤال وجواب"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2">{res.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Country Selector Selector Bar */}
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-[#0a0f24] border border-white/10 overflow-x-auto scrollbar-none">
          {COUNTRIES_TAX_DATA.map((country) => {
            const isSelected = selectedCountryId === country.id;
            return (
              <motion.button
                key={country.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSelectedCountryId(country.id);
                  setActiveGuideIdx(0);
                  setActiveStepNum(1);
                }}
                className={`relative px-4 py-3 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center gap-2.5 shrink-0 ${
                  isSelected ? "text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeCountryBg"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-600/30"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2 text-sm">
                  <span>{country.flag}</span>
                  <span className="text-xs font-black">{country.countryName}</span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* SELECTED COUNTRY HEADER INFO & SUB-NAVIGATION */}
      <div className="space-y-4">
        
        {/* Sequential Learning & Operations Journey Banner */}
        <div className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-indigo-950/60 border border-indigo-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>المسار الضريبي المتكامل (مرتب تسلسلياً من الأساسيات حتى التقديم والامتثال):</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto text-[11px] text-slate-300 font-bold shrink-0">
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">1️⃣ الأنظمة والأساسيات</span>
            <span>←</span>
            <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">2️⃣ الفواتير الإلكترونية</span>
            <span>←</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">3️⃣ محاكاة الإقرار</span>
            <span>←</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">4️⃣ خطوات التقديم</span>
            <span>←</span>
            <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">5️⃣ الوقاية والامتثال</span>
          </div>
        </div>

        {/* Sub-Tabs Navigation for the selected country (Sequentially Ordered) */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0b1022] border border-white/10 overflow-x-auto scrollbar-none">
          {[
            // STAGE 1: OVERVIEW & REGULATIONS
            { id: "overview", label: "1. نظرة عامة والنسب", icon: Percent, badge: "الأساسيات" },
            { id: "details", label: "2. التشريع والأنظمة", icon: BookOpen, badge: "اللوائح" },
            
            // STAGE 2: INVOICES & E-INVOICING
            { id: "interactive_invoice", label: "3. الفاتورة التفاعلية الشارحة", icon: Sparkles, badge: "تفاعلي ⚡" },
            { id: "einvoicing", label: "4. متطلبات الفوترة الإلكترونية", icon: Receipt, badge: "الربط والفلترة" },
            { id: "samples", label: "5. نماذج الفواتير والتقارير", icon: Eye, badge: "معاينة حية 📄" },

            // STAGE 3: CALCULATIONS & RETURN SIMULATION
            { id: "calculator", label: "6. حاسبة الضريبة الحية", icon: Calculator, badge: "حساب سريع" },
            { id: "form_simulator", label: "7. محاكي الإقرار الضريبي (Form Simulator)", icon: Calculator, badge: "النموذج الرسمي 📊" },
            { id: "asset_depreciation", label: "8. حاسبة إهلاك الأصول الثابتة", icon: Building2, badge: "أصول 🏢" },
            { id: "income_tax_calculator", label: "9. حاسبة ضريبة الدخل والشرائح", icon: Percent, badge: "شرائح 💵" },
            { id: "personal_budget", label: "10. محاكي الميزانية الشخصية والادخار", icon: PiggyBank, badge: "ميزانية 💰" },
            { id: "payroll_simulator", label: "11. محاكي كشوف الرواتب والتأمينات (Payroll)", icon: Users, badge: "جديد 👔" },
            { id: "wizard", label: "12. مولد ومساعد الإقرار", icon: Sparkles, badge: "تفاعلي 🔥" },

            // STAGE 4: SUBMISSION STEPS
            { id: "steps", label: "13. دليل تقديم الإقرار خطوة بخطوة", icon: FileText, badge: `${currentCountry.stepGuides.length} خطوات` },

            // STAGE 5: COMPLIANCE & PENALTIES
            { id: "pitfalls", label: "14. فاحص الأخطاء والثغرات", icon: ShieldAlert, badge: "دليل ووقاية ⚠️" },
            { id: "penalties", label: "15. جدول الغرامات والمهل", icon: ShieldAlert, badge: `${currentCountry.penalties.length} عقوبة` },
            { id: "faqs", label: "16. الأسئلة الشائعة", icon: HelpCircle, badge: "س & ج" },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`relative px-4 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4 text-indigo-300" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[9px] font-extrabold bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 px-1.5 py-0.2 rounded-md">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* CONTENT PANELS BASED ON SUB-TAB */}
        <AnimatePresence mode="wait">

          {/* TAX RETURN FORM SIMULATOR */}
          {activeSubTab === "form_simulator" && (
            <motion.div
              key="form_simulator"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <TaxFormSimulator />
            </motion.div>
          )}

          {/* ASSET DEPRECIATION CALCULATOR */}
          {activeSubTab === "asset_depreciation" && (
            <motion.div
              key="asset_depreciation"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <AssetDepreciationCalculator />
            </motion.div>
          )}

          {/* ANNUAL INCOME TAX CALCULATOR */}
          {activeSubTab === "income_tax_calculator" && (
            <motion.div
              key="income_tax_calculator"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <IncomeTaxCalculator />
            </motion.div>
          )}

          {/* PERSONAL BUDGET TRACKER & SAVINGS SIMULATOR */}
          {activeSubTab === "personal_budget" && (
            <motion.div
              key="personal_budget"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <PersonalBudgetTracker />
            </motion.div>
          )}

          {/* PAYROLL SIMULATION & GOSI CALCULATOR */}
          {activeSubTab === "payroll_simulator" && (
            <motion.div
              key="payroll_simulator"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <PayrollSimulator />
            </motion.div>
          )}

          {/* INTERACTIVE INVOICE EXPLAINER MODEL */}
          {activeSubTab === "interactive_invoice" && (
            <motion.div
              key="interactive_invoice"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <InteractiveTaxInvoiceModel />
            </motion.div>
          )}

          {/* SAMPLES: REAL INVOICE & FINANCIAL REPORTS VIEWER */}
          {activeSubTab === "samples" && (
            <motion.div
              key="samples"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Header Navigator Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0d1428] via-[#111e3f] to-[#0d1428] border border-indigo-500/30 shadow-xl space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-amber-400" />
                      <span>نماذج حقيقية وموثقة معتمدة من الهيئات الضريبية والمحاسبية</span>
                    </span>
                    <h3 className="text-xl font-black text-white">
                      معاينة شكل الفاتورة الإلكترونية والتقارير المالية الرسمية 📄
                    </h3>
                    <p className="text-xs text-slate-300">
                      استعرض الهيكل المعتمد للفاتورة الضريبية بكود QR والتشفير، إلى جانب شكل التقارير والقوائم المالية الرسمية (قائمة الدخل، الميزانية، ميزان المراجعة).
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSampleCategory("invoice")}
                      className={`px-4 py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer flex items-center gap-2 ${
                        sampleCategory === "invoice"
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30"
                          : "bg-black/40 text-slate-400 border border-white/10 hover:text-white"
                      }`}
                    >
                      <Receipt className="w-4 h-4 text-indigo-300" />
                      <span>1️⃣ شكل الفاتورة الإلكترونية</span>
                    </button>

                    <button
                      onClick={() => setSampleCategory("reports")}
                      className={`px-4 py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer flex items-center gap-2 ${
                        sampleCategory === "reports"
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30"
                          : "bg-black/40 text-slate-400 border border-white/10 hover:text-white"
                      }`}
                    >
                      <FileText className="w-4 h-4 text-purple-300" />
                      <span>2️⃣ شكل التقارير والقوائم المالية</span>
                    </button>
                  </div>
                </div>

                {/* Sub Controls Bar */}
                {sampleCategory === "invoice" ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-black/40 p-3 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-300 font-bold">نوع الفاتورة:</span>
                      <button
                        onClick={() => setSampleInvoiceType("b2b")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          sampleInvoiceType === "b2b"
                            ? "bg-indigo-600 text-white border border-indigo-400"
                            : "bg-white/5 text-slate-400 hover:text-white"
                        }`}
                      >
                        فاتورة ضريبية بين الشركات (B2B Tax Invoice)
                      </button>
                      <button
                        onClick={() => setSampleInvoiceType("b2c")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          sampleInvoiceType === "b2c"
                            ? "bg-purple-600 text-white border border-purple-400"
                            : "bg-white/5 text-slate-400 hover:text-white"
                        }`}
                      >
                        فاتورة ضريبية مبسطة للأفراد (B2C Simplified)
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                        مرحلة الربط: Phase 2 ZATCA / ETA Compliant 🟢
                      </span>
                      <button
                        onClick={() => window.print()}
                        className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>طباعة النموذج</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-black/40 p-3 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2 overflow-x-auto">
                      {[
                        { id: "income_statement", label: "📈 قائمة الدخل الشامل (P&L)" },
                        { id: "balance_sheet", label: "⚖️ قائمة المركز المالي (الميزانية)" },
                        { id: "trial_balance", label: "📑 ميزان المراجعة التحليلي" },
                        { id: "vat_reconciliation", label: "🏦 تقرير مطابقة الضريبة والبنوك" },
                      ].map((r) => (
                        <button
                          key={r.id}
                          onClick={() => setActiveReportType(r.id as any)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                            activeReportType === r.id
                              ? "bg-indigo-600 text-white border border-indigo-400"
                              : "bg-white/5 text-slate-400 hover:text-white"
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={sampleReportPeriod}
                        onChange={(e) => setSampleReportPeriod(e.target.value as any)}
                        className="bg-[#080c1c] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none"
                      >
                        <option value="2026">السنة المالية 2026</option>
                        <option value="2025">السنة المالية 2025 (مقارن)</option>
                      </select>

                      <button
                        onClick={() => window.print()}
                        className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>طباعة القائمة</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* VIEW 1: REAL E-INVOICE SAMPLE MODEL */}
              {sampleCategory === "invoice" && (
                <div className="p-6 sm:p-10 rounded-3xl bg-slate-950 border-2 border-indigo-500/40 shadow-2xl space-y-8 font-sans print:bg-white print:text-black">
                  
                  {/* Official Invoice Document Frame Header */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b-2 border-indigo-500/30 pb-6">
                    
                    {/* Supplier Meta */}
                    <div className="space-y-1.5 text-right">
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-indigo-600 text-white font-black text-sm">ميزان</span>
                        <div>
                          <h2 className="text-lg font-black text-white">شركة الميزان للتكنولوجيا والحلول البرمجية المحدودة</h2>
                          <p className="text-[11px] text-slate-400">Al-Mizan Digital Technology & Software Solutions Ltd.</p>
                        </div>
                      </div>

                      <div className="text-xs text-slate-300 font-medium space-y-0.5 pt-1">
                        <p>السجل التجاري (CR): <span className="font-mono font-bold text-indigo-300">1010892041</span></p>
                        <p>الرقم الضريبي (VAT TIN): <span className="font-mono font-bold text-amber-300">310892401900003</span></p>
                        <p>العنوان: طريق الملك فهد - حي العليا - الرياض - المملكة العربية السعودية</p>
                      </div>
                    </div>

                    {/* Badge & Invoice Type Title */}
                    <div className="text-center sm:text-left space-y-2 bg-black/50 p-4 rounded-2xl border border-white/10 shrink-0">
                      <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black uppercase">
                        {sampleInvoiceType === "b2b" ? "B2B Standard Tax Invoice" : "B2C Simplified Tax Invoice"}
                      </span>
                      <h3 className="text-xl font-black text-white">
                        {sampleInvoiceType === "b2b" ? "فاتورة ضريبية رسمية" : "فاتورة ضريبية مبسطة"}
                      </h3>
                      <p className="text-[10px] text-emerald-400 font-mono font-bold">معتمدة ومربوطة بـ {currentCountry.authorityName}</p>
                    </div>

                  </div>

                  {/* Metadata Grid (Serial, Date, UUID, Payment) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-black/40 p-4 rounded-2xl border border-white/10 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">رقم الفاتورة التسلسلي:</span>
                      <span className="font-mono font-black text-indigo-300 text-sm">INV-2026-00894</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">تاريخ الوقت والإصدار:</span>
                      <span className="font-mono font-bold text-white">2026-08-07T10:30:15Z</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">تاريخ التوريد المباشر:</span>
                      <span className="font-mono font-bold text-white">2026-08-07</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">طريقة الدفع والسداد:</span>
                      <span className="font-bold text-emerald-400">تحويل بنكي / سداد SADAD</span>
                    </div>
                  </div>

                  {/* Customer Info Block (B2B Mode) */}
                  {sampleInvoiceType === "b2b" ? (
                    <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                      <h4 className="font-black text-xs text-indigo-300 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-indigo-400" />
                        <span>بيانات العميل المشتري (Buyer Information):</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-200">
                        <div>
                          <span className="text-slate-400 block text-[10px]">اسم المنشأة المشتربة:</span>
                          <span className="font-black text-white">شركة الأفق للحلول المحاسبية والاستشارات</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">الرقم الضريبي للعميل (VAT No):</span>
                          <span className="font-mono font-bold text-amber-300">300982301900003</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">العنوان التجاري:</span>
                          <span>شارع التخصصي - حي السليمانية - الرياض</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200 flex items-center justify-between">
                      <span>فاتورة مبسطة موجهة للمستهلك النهائي (B2C) - لا تتطلب الرقم الضريبي للعميل</span>
                      <span className="font-mono text-[10px] text-purple-300">كود العميل: CASH-CUST-001</span>
                    </div>
                  )}

                  {/* ITEMIZED PRODUCTS & SERVICES TABLE */}
                  <div className="space-y-3">
                    <h4 className="font-black text-xs text-white flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-indigo-400" />
                      <span>جدول الأصناف والخدمات المقدمة (Line Items):</span>
                    </h4>

                    <div className="overflow-x-auto rounded-2xl border border-white/10">
                      <table className="w-full text-right text-xs">
                        <thead>
                          <tr className="bg-indigo-950/70 text-indigo-200 font-black border-b border-white/10">
                            <th className="py-3 px-3">#</th>
                            <th className="py-3 px-4">بيان السلعة / الخدمة</th>
                            <th className="py-3 px-3 text-center">الكمية</th>
                            <th className="py-3 px-3">سعر الوحدة</th>
                            <th className="py-3 px-3">الخصم</th>
                            <th className="py-3 px-3">المبلغ الخاضع</th>
                            <th className="py-3 px-3 text-center">النسبة</th>
                            <th className="py-3 px-3">مبلغ الضريبة</th>
                            <th className="py-3 px-4 font-black text-white">الإجمالي شامل الضريبة</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-black/20">
                          <tr className="hover:bg-white/5">
                            <td className="py-3.5 px-3 font-mono font-bold text-indigo-400">01</td>
                            <td className="py-3.5 px-4 font-bold text-white">
                              ترخيص برنامج ميزان ERP المحاسبي السحابي (اشتراك سنوي)
                              <span className="block text-[10px] text-slate-400 font-normal">شامل الوحدات المتقدمة وإدارة المخزون والتصنيع</span>
                            </td>
                            <td className="py-3.5 px-3 text-center font-mono font-bold">2</td>
                            <td className="py-3.5 px-3 font-mono">4,500.00</td>
                            <td className="py-3.5 px-3 font-mono text-emerald-400">500.00</td>
                            <td className="py-3.5 px-3 font-mono font-bold">8,500.00</td>
                            <td className="py-3.5 px-3 text-center font-mono text-indigo-300 font-bold">15%</td>
                            <td className="py-3.5 px-3 font-mono font-bold text-amber-300">1,275.00</td>
                            <td className="py-3.5 px-4 font-mono font-black text-emerald-400">9,775.00</td>
                          </tr>

                          <tr className="hover:bg-white/5">
                            <td className="py-3.5 px-3 font-mono font-bold text-indigo-400">02</td>
                            <td className="py-3.5 px-4 font-bold text-white">
                              خدمات إعداد وتأهيل الفوترة الإلكترونية (ZATCA Phase 2 Integration)
                              <span className="block text-[10px] text-slate-400 font-normal">توليد شهادات CSID واختبار الربط المباشر مع الهيئة</span>
                            </td>
                            <td className="py-3.5 px-3 text-center font-mono font-bold">1</td>
                            <td className="py-3.5 px-3 font-mono">3,000.00</td>
                            <td className="py-3.5 px-3 font-mono text-slate-500">0.00</td>
                            <td className="py-3.5 px-3 font-mono font-bold">3,000.00</td>
                            <td className="py-3.5 px-3 text-center font-mono text-indigo-300 font-bold">15%</td>
                            <td className="py-3.5 px-3 font-mono font-bold text-amber-300">450.00</td>
                            <td className="py-3.5 px-4 font-mono font-black text-emerald-400">3,450.00</td>
                          </tr>

                          <tr className="hover:bg-white/5">
                            <td className="py-3.5 px-3 font-mono font-bold text-indigo-400">03</td>
                            <td className="py-3.5 px-4 font-bold text-white">
                              استشارات ودعم محاسبي وتدريب الكادر (ساعات استشارية)
                              <span className="block text-[10px] text-slate-400 font-normal">جلسات توجيه شجرة الحسابات وإقفال القوائم</span>
                            </td>
                            <td className="py-3.5 px-3 text-center font-mono font-bold">5</td>
                            <td className="py-3.5 px-3 font-mono">300.00</td>
                            <td className="py-3.5 px-3 font-mono text-emerald-400">100.00</td>
                            <td className="py-3.5 px-3 font-mono font-bold">1,400.00</td>
                            <td className="py-3.5 px-3 text-center font-mono text-indigo-300 font-bold">15%</td>
                            <td className="py-3.5 px-3 font-mono font-bold text-amber-300">210.00</td>
                            <td className="py-3.5 px-4 font-mono font-black text-emerald-400">1,610.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* TOTALS & QR CODE CONTAINER */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    
                    {/* Dynamic ZATCA Encrypted QR Code Simulation Box */}
                    <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span>رمز الاستجابة السريعة المشفّر (ZATCA QR Code):</span>
                        </span>
                        <span className="text-[10px] text-indigo-300 font-mono font-bold">TLV Encoded Base64</span>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Simulated High Density Vector QR Code SVG */}
                        <div className="p-3 bg-white rounded-2xl shrink-0 shadow-lg border border-slate-300">
                          <svg className="w-28 h-28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="100" height="100" fill="white"/>
                            {/* Position Detection Patterns */}
                            <path d="M5 5h30v30H5zM10 10v20h20V10zM15 15h10v10H15z" fill="black"/>
                            <path d="M65 5h30v30H65zM70 10v20h20V10zM75 15h10v10H75z" fill="black"/>
                            <path d="M5 65h30v30H5zM10 70v20h20V70zM15 75h10v10H15z" fill="black"/>
                            {/* Data modules simulation */}
                            <path d="M40 10h5v5h-5zM50 10h10v5h-10zM45 20h5v10h-5zM55 25h10v5h-10zM10 40h15v5h-15zM30 40h10v10h-10zM45 40h15v5h-15zM65 40h10v10h-10zM80 40h15v5h-15zM40 55h5v15h-5zM55 55h10v5h-10zM70 55h20v5h-20zM40 75h15v5h-15zM60 75h10v10h-10zM75 70h15v5h-15zM45 85h10v10h-10zM60 85h15v5h-15zM80 85h15v10h-15z" fill="black"/>
                          </svg>
                        </div>

                        <div className="space-y-2 text-xs">
                          <p className="text-slate-300 text-[11px] leading-relaxed">
                            يتضمن كود الـ QR البيانات الخمسة الرئيسية المعتمدة قانونياً لفك التشفير عبر تطبيق الهيئة الرسمي.
                          </p>
                          <button
                            onClick={() => setShowQrDetails(!showQrDetails)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-[11px] font-bold cursor-pointer transition-all"
                          >
                            {showQrDetails ? "إخفاء التشفير الداخلي" : "فك تشفير حقول الـ TLV Tags 🔍"}
                          </button>
                        </div>
                      </div>

                      {/* Decoded TLV Tag Viewer */}
                      {showQrDetails && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="p-3.5 rounded-xl bg-slate-900 border border-indigo-500/30 space-y-1.5 text-[10px] font-mono"
                        >
                          <p className="text-emerald-400 font-bold font-sans">بيانات الـ TLV المفكوكة (Tag-Length-Value):</p>
                          <p className="text-slate-300"><span className="text-indigo-400 font-bold">Tag 1 (Seller):</span> شركة الميزان للتكنولوجيا والحلول البرمجية</p>
                          <p className="text-slate-300"><span className="text-indigo-400 font-bold">Tag 2 (VAT No):</span> 310892401900003</p>
                          <p className="text-slate-300"><span className="text-indigo-400 font-bold">Tag 3 (Timestamp):</span> 2026-08-07T10:30:15Z</p>
                          <p className="text-slate-300"><span className="text-indigo-400 font-bold">Tag 4 (Total Amount):</span> 14835.00</p>
                          <p className="text-slate-300"><span className="text-indigo-400 font-bold">Tag 5 (VAT Total):</span> 1935.00</p>
                        </motion.div>
                      )}
                    </div>

                    {/* Totals Summary Box */}
                    <div className="p-5 rounded-2xl bg-black/60 border border-indigo-500/30 space-y-3 text-xs">
                      <div className="flex items-center justify-between py-1 border-b border-white/10 text-slate-300">
                        <span>الإجمالي قبل الخصم والضريبة:</span>
                        <span className="font-mono font-bold text-white">13,500.00 SAR</span>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-white/10 text-slate-300">
                        <span>إجمالي الخصم الممنوح:</span>
                        <span className="font-mono font-bold text-emerald-400">- 600.00 SAR</span>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-white/10 text-slate-300">
                        <span>المبلغ الخاضع للضريبة (Taxable Amount):</span>
                        <span className="font-mono font-bold text-white">12,900.00 SAR</span>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-white/10 text-slate-300">
                        <span>إجمالي ضريبة القيمة المضافة (15% VAT):</span>
                        <span className="font-mono font-bold text-amber-300">1,935.00 SAR</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 text-sm font-black text-white bg-indigo-950/60 p-3 rounded-xl border border-indigo-500/40">
                        <span>المبلغ الإجمالي المستحق (Total Payable):</span>
                        <span className="font-mono text-emerald-400 text-lg">14,835.00 SAR</span>
                      </div>
                    </div>

                  </div>

                  {/* Footer Stamps & Terms */}
                  <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
                    <div>
                      <p className="font-bold text-slate-300">الشروط والأحكام:</p>
                      <p>الدفع مستحق خلال 14 يوماً من تاريخ الإصدار. الفاتورة مولدة وموقعة إلكترونياً ولا تحتاج إلى ختم يدوي.</p>
                    </div>

                    <div className="text-center sm:text-left shrink-0">
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-[10px]">
                        ZATCA Certified E-Invoice Signature ✅
                      </span>
                    </div>
                  </div>

                </div>
              )}

              {/* VIEW 2: REAL OFFICIAL FINANCIAL STATEMENTS & REPORTS */}
              {sampleCategory === "reports" && (
                <div className="p-6 sm:p-10 rounded-3xl bg-slate-950 border-2 border-indigo-500/40 shadow-2xl space-y-8 font-sans print:bg-white print:text-black">
                  
                  {/* Company & Statement Document Header */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-indigo-500/30 pb-6">
                    <div className="space-y-1 text-right">
                      <span className="text-xs font-black text-indigo-400 uppercase tracking-widest block">
                        شركة الميزان للتكنولوجيا والحلول البرمجية (ش.م.م)
                      </span>
                      <h2 className="text-2xl font-black text-white">
                        {activeReportType === "income_statement" && "قائمة الدخل الشامل (Statement of Comprehensive Income)"}
                        {activeReportType === "balance_sheet" && "قائمة المركز المالي / الميزانية العمومية (Balance Sheet)"}
                        {activeReportType === "trial_balance" && "تقرير ميزان المراجع التحليلي العام (Trial Balance Report)"}
                        {activeReportType === "vat_reconciliation" && "تقرير مطابقة إقرار القيمة المضافة ومطابقة البنوك"}
                      </h2>
                      <p className="text-xs text-slate-300">
                        عن الفترة المالية المنتهية في 31 ديسمبر {sampleReportPeriod} - معدة وفقاً لمعايير التقرير المالي الدولية (IFRS)
                      </p>
                    </div>

                    <div className="bg-black/50 p-4 rounded-2xl border border-white/10 text-center space-y-1 shrink-0">
                      <span className="text-xs font-bold text-indigo-300 block">حالة المراجعة التدقيقية:</span>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/30">
                        مراجعة ومصادقة محاسب قانوني (Audited) 🟢
                      </span>
                    </div>
                  </div>

                  {/* 1️⃣ INCOME STATEMENT VIEW */}
                  {activeReportType === "income_statement" && (
                    <div className="space-y-6">
                      <div className="overflow-x-auto rounded-2xl border border-white/10">
                        <table className="w-full text-right text-xs">
                          <thead>
                            <tr className="bg-indigo-950/80 text-indigo-200 font-black border-b border-white/10">
                              <th className="py-3.5 px-4">البند / المكون المالي (Financial Component)</th>
                              <th className="py-3.5 px-4 font-mono text-left">السنة الحالية ({sampleReportPeriod})</th>
                              <th className="py-3.5 px-4 font-mono text-left">السنة السابقة ({Number(sampleReportPeriod) - 1})</th>
                              <th className="py-3.5 px-4 text-center">نسبة التغير %</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 bg-black/20">
                            <tr className="bg-white/5 font-bold text-indigo-300">
                              <td className="py-3 px-4">الإيرادات التشغيلية المباشرة (Operating Revenues)</td>
                              <td className="py-3 px-4 font-mono text-left font-black text-white">4,850,000 ر.س</td>
                              <td className="py-3 px-4 font-mono text-left text-slate-300">3,900,000 ر.س</td>
                              <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400">+24.3%</td>
                            </tr>
                            <tr className="hover:bg-white/5">
                              <td className="py-3 px-4 text-slate-300 font-medium">(-) تكلفة البضاعة والخدمات المباعة (COGS)</td>
                              <td className="py-3 px-4 font-mono text-left font-bold text-rose-300">(1,940,000) ر.س</td>
                              <td className="py-3 px-4 font-mono text-left text-slate-400">(1,600,000) ر.س</td>
                              <td className="py-3 px-4 text-center font-mono text-slate-400">+21.2%</td>
                            </tr>
                            <tr className="bg-indigo-950/40 font-black text-white border-y border-indigo-500/30">
                              <td className="py-3.5 px-4 text-amber-300 text-sm">= مجمل الربح (Gross Profit)</td>
                              <td className="py-3.5 px-4 font-mono text-left text-amber-300 text-sm font-black">2,910,000 ر.س</td>
                              <td className="py-3.5 px-4 font-mono text-left text-slate-200">2,300,000 ر.س</td>
                              <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-400">+26.5%</td>
                            </tr>

                            <tr className="hover:bg-white/5">
                              <td className="py-3 px-4 text-slate-300 font-medium">(-) المصاريف العمومية والإدارية (General Admin Expenses)</td>
                              <td className="py-3 px-4 font-mono text-left text-rose-300">(820,000) ر.س</td>
                              <td className="py-3 px-4 font-mono text-left text-slate-400">(710,000) ر.س</td>
                              <td className="py-3 px-4 text-center font-mono text-slate-400">+15.4%</td>
                            </tr>
                            <tr className="hover:bg-white/5">
                              <td className="py-3 px-4 text-slate-300 font-medium">(-) مصاريف التسويق والدعاية والإعلان</td>
                              <td className="py-3 px-4 font-mono text-left text-rose-300">(340,000) ر.س</td>
                              <td className="py-3 px-4 font-mono text-left text-slate-400">(290,000) ر.س</td>
                              <td className="py-3 px-4 text-center font-mono text-slate-400">+17.2%</td>
                            </tr>
                            <tr className="bg-purple-950/30 font-bold text-purple-200">
                              <td className="py-3 px-4">= الأرباح قبل الإهلاك والتمويل والضرائب (EBITDA)</td>
                              <td className="py-3 px-4 font-mono text-left font-black text-purple-300">1,750,000 ر.س</td>
                              <td className="py-3 px-4 font-mono text-left text-slate-300">1,300,000 ر.س</td>
                              <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400">+34.6%</td>
                            </tr>

                            <tr className="hover:bg-white/5">
                              <td className="py-3 px-4 text-slate-300 font-medium">(-) الإهلاك والإطفاء (Depreciation & Amortization)</td>
                              <td className="py-3 px-4 font-mono text-left text-rose-300">(180,000) ر.س</td>
                              <td className="py-3 px-4 font-mono text-left text-slate-400">(150,000) ر.س</td>
                              <td className="py-3 px-4 text-center font-mono text-slate-400">+20.0%</td>
                            </tr>
                            <tr className="hover:bg-white/5">
                              <td className="py-3 px-4 text-slate-300 font-medium">(-) التكاليف والأعباء التمويلية (Finance Costs)</td>
                              <td className="py-3 px-4 font-mono text-left text-rose-300">(45,000) ر.س</td>
                              <td className="py-3 px-4 font-mono text-left text-slate-400">(50,000) ر.س</td>
                              <td className="py-3 px-4 text-center font-mono text-emerald-400">-10.0%</td>
                            </tr>
                            <tr className="hover:bg-white/5">
                              <td className="py-3 px-4 text-amber-400 font-bold">(-) مخصص الزكاة والضريبة المقدر (Tax Provision)</td>
                              <td className="py-3 px-4 font-mono text-left font-bold text-amber-400">(190,000) ر.س</td>
                              <td className="py-3 px-4 font-mono text-left text-slate-400">(140,000) ر.س</td>
                              <td className="py-3 px-4 text-center font-mono text-amber-400">+35.7%</td>
                            </tr>

                            <tr className="bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-950 font-black text-white border-y-2 border-emerald-400">
                              <td className="py-4 px-4 text-emerald-300 text-base">= صافي الربح النهائي للفترة (Net Profit After Tax)</td>
                              <td className="py-4 px-4 font-mono text-left text-emerald-400 text-lg font-black">1,335,000 ر.س</td>
                              <td className="py-4 px-4 font-mono text-left text-slate-200">960,000 ر.س</td>
                              <td className="py-4 px-4 text-center font-mono font-black text-emerald-300">+39.0%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* 2️⃣ BALANCE SHEET VIEW */}
                  {activeReportType === "balance_sheet" && (
                    <div className="space-y-6">
                      
                      <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-200">
                        <span className="font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>حالة توازن الميزانية العمومية:</span>
                        </span>
                        <span className="font-mono font-black text-emerald-400">
                          إجمالي الأصول (6,450,000) = إجمالي الخصوم وحقوق الملكية (6,450,000) ⚖️
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* ASSETS BOX */}
                        <div className="p-5 rounded-2xl bg-black/40 border border-indigo-500/30 space-y-4">
                          <h4 className="font-black text-sm text-indigo-300 border-b border-white/10 pb-2">
                            أولاً: جانب الأصول (Assets)
                          </h4>

                          <div className="space-y-3 text-xs">
                            <div className="space-y-1.5">
                              <span className="font-black text-indigo-400 block text-[11px]">1. الأصول غير المتداولة (Non-Current Assets):</span>
                              <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                                <span>العقارات والآلات والمعدات (صافي):</span>
                                <span className="font-mono font-bold">2,100,000 ر.س</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                                <span>الأصول غير الملموسة والبرامج:</span>
                                <span className="font-mono font-bold">450,000 ر.س</span>
                              </div>
                            </div>

                            <div className="space-y-1.5 pt-2">
                              <span className="font-black text-indigo-400 block text-[11px]">2. الأصول المتداولة (Current Assets):</span>
                              <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                                <span>النقدية وما يعادلها بالبنوك:</span>
                                <span className="font-mono font-bold text-emerald-400">1,850,000 ر.س</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                                <span>الذمم المدينة والعملاء (Net Receivables):</span>
                                <span className="font-mono font-bold">1,250,000 ر.س</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                                <span>المخزون السلعي والتجاري:</span>
                                <span className="font-mono font-bold">800,000 ر.س</span>
                              </div>
                            </div>

                            <div className="flex justify-between pt-3 text-sm font-black text-white bg-indigo-950/60 p-3 rounded-xl border border-indigo-500/30">
                              <span>إجمالي الأصول (Total Assets):</span>
                              <span className="font-mono text-indigo-300">6,450,000 ر.س</span>
                            </div>
                          </div>
                        </div>

                        {/* EQUITY & LIABILITIES BOX */}
                        <div className="p-5 rounded-2xl bg-black/40 border border-purple-500/30 space-y-4">
                          <h4 className="font-black text-sm text-purple-300 border-b border-white/10 pb-2">
                            ثانياً: جانب حقوق الملكية والالتزامات (Equity & Liabilities)
                          </h4>

                          <div className="space-y-3 text-xs">
                            <div className="space-y-1.5">
                              <span className="font-black text-purple-400 block text-[11px]">1. حقوق الملكية (Shareholders' Equity):</span>
                              <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                                <span>رأس المال المدفوع والمصرح به:</span>
                                <span className="font-mono font-bold">2,500,000 ر.س</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                                <span>الأرباح المبقاة المدورة (Retained Earnings):</span>
                                <span className="font-mono font-bold text-emerald-400">1,835,000 ر.س</span>
                              </div>
                            </div>

                            <div className="space-y-1.5 pt-2">
                              <span className="font-black text-purple-400 block text-[11px]">2. الالتزامات (Liabilities):</span>
                              <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                                <span>قروض وتسهيلات بنكية طويلة الأجل:</span>
                                <span className="font-mono font-bold">900,000 ر.س</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                                <span>الموردون والذمم الدائنة التجاريون:</span>
                                <span className="font-mono font-bold">825,000 ر.س</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                                <span>مخصص الزكاة والضريبة المستحق سدادها:</span>
                                <span className="font-mono font-bold text-amber-300">390,000 ر.س</span>
                              </div>
                            </div>

                            <div className="flex justify-between pt-3 text-sm font-black text-white bg-purple-950/60 p-3 rounded-xl border border-purple-500/30">
                              <span>إجمالي حقوق الملكية والخصوم:</span>
                              <span className="font-mono text-purple-300">6,450,000 ر.س</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* 3️⃣ TRIAL BALANCE VIEW */}
                  {activeReportType === "trial_balance" && (
                    <div className="space-y-4">
                      <div className="overflow-x-auto rounded-2xl border border-white/10">
                        <table className="w-full text-right text-xs">
                          <thead>
                            <tr className="bg-indigo-950/80 text-indigo-200 font-black border-b border-white/10">
                              <th className="py-3.5 px-4">رقم الحساب</th>
                              <th className="py-3.5 px-4">اسم الحساب في دليل الحسابات العام (COA)</th>
                              <th className="py-3.5 px-4 text-center">الرصيد مدين (Debit SAR)</th>
                              <th className="py-3.5 px-4 text-center">الرصيد دائن (Credit SAR)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 bg-black/20 font-mono">
                            <tr className="hover:bg-white/5">
                              <td className="py-3 px-4 font-bold text-indigo-400">10101</td>
                              <td className="py-3 px-4 font-sans font-bold text-white">النقدية بالبنوك الحسابات الجارية</td>
                              <td className="py-3 px-4 text-center text-emerald-400 font-bold">1,850,000.00</td>
                              <td className="py-3 px-4 text-center text-slate-500">-</td>
                            </tr>
                            <tr className="hover:bg-white/5">
                              <td className="py-3 px-4 font-bold text-indigo-400">10201</td>
                              <td className="py-3 px-4 font-sans font-bold text-white">حسابات العملاء والمدينون التجاريون</td>
                              <td className="py-3 px-4 text-center text-emerald-400 font-bold">1,250,000.00</td>
                              <td className="py-3 px-4 text-center text-slate-500">-</td>
                            </tr>
                            <tr className="hover:bg-white/5">
                              <td className="py-3 px-4 font-bold text-indigo-400">20101</td>
                              <td className="py-3 px-4 font-sans font-bold text-white">الموردون والذمم الدائنة</td>
                              <td className="py-3 px-4 text-center text-slate-500">-</td>
                              <td className="py-3 px-4 text-center text-rose-300 font-bold">825,000.00</td>
                            </tr>
                            <tr className="hover:bg-white/5">
                              <td className="py-3 px-4 font-bold text-indigo-400">20205</td>
                              <td className="py-3 px-4 font-sans font-bold text-white">أمانات ضريبة القيمة المضافة المستحقة (VAT Payable)</td>
                              <td className="py-3 px-4 text-center text-slate-500">-</td>
                              <td className="py-3 px-4 text-center text-amber-300 font-bold">290,000.00</td>
                            </tr>
                            <tr className="hover:bg-white/5">
                              <td className="py-3 px-4 font-bold text-indigo-400">30101</td>
                              <td className="py-3 px-4 font-sans font-bold text-white">رأس المال الاسمي المدفوع</td>
                              <td className="py-3 px-4 text-center text-slate-500">-</td>
                              <td className="py-3 px-4 text-center text-purple-300 font-bold">2,500,000.00</td>
                            </tr>
                            <tr className="hover:bg-white/5">
                              <td className="py-3 px-4 font-bold text-indigo-400">40101</td>
                              <td className="py-3 px-4 font-sans font-bold text-white">إيرادات المبيعات والخدمات الرقمية</td>
                              <td className="py-3 px-4 text-center text-slate-500">-</td>
                              <td className="py-3 px-4 text-center text-purple-300 font-bold">4,850,000.00</td>
                            </tr>
                            <tr className="hover:bg-white/5">
                              <td className="py-3 px-4 font-bold text-indigo-400">50101</td>
                              <td className="py-3 px-4 font-sans font-bold text-white">مصاريف التشغيل والأجور والرواتب</td>
                              <td className="py-3 px-4 text-center text-emerald-400 font-bold">5,365,000.00</td>
                              <td className="py-3 px-4 text-center text-slate-500">-</td>
                            </tr>
                            <tr className="bg-indigo-950/80 font-black text-white text-sm border-t-2 border-indigo-400">
                              <td className="py-4 px-4 font-sans text-amber-300" colSpan={2}>الإجمالي المتوازن لميزان المراجعة (Balanced Total)</td>
                              <td className="py-4 px-4 text-center text-emerald-400 font-black">8,465,000.00</td>
                              <td className="py-4 px-4 text-center text-emerald-400 font-black">8,465,000.00</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* 4️⃣ VAT RECONCILIATION VIEW */}
                  {activeReportType === "vat_reconciliation" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-1">
                          <span className="text-slate-400 block">إجمالي مخرجات المبيعات:</span>
                          <span className="text-xl font-mono font-black text-indigo-300">727,500 SAR</span>
                          <span className="text-[10px] text-indigo-200 block">ضريبة 15% محصلة من العملاء</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-1">
                          <span className="text-slate-400 block">إجمالي مدخلات المشتريات:</span>
                          <span className="text-xl font-mono font-black text-purple-300">437,500 SAR</span>
                          <span className="text-[10px] text-purple-200 block">ضريبة 15% مخصومة للموردين</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
                          <span className="text-slate-400 block">صافي الضريبة الواجبة السداد:</span>
                          <span className="text-xl font-mono font-black text-emerald-400">290,000 SAR</span>
                          <span className="text-[10px] text-emerald-200 block">رقم سداد SADAD: 894019230</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Report Footnote & Stamp */}
                  <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                    <div>
                      <p className="font-bold text-white">توقيع ومصادقة المراجع القانوني:</p>
                      <p>تم فحص واختبار القوائم وفقاً لقواعد ومعايير المراجعة الدولية المعتمَدة في الهيئة السعودية للمراجعين والمحاسبين (SOCPA).</p>
                    </div>

                    <div className="text-center sm:text-left shrink-0">
                      <span className="px-3 py-1.5 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-bold text-[11px]">
                        SOCPA Certified Auditor Stamp 🛡️
                      </span>
                    </div>
                  </div>

                </div>
              )}

            </motion.div>
          )}

          {/* PITFALLS: TAX RETURN PITFALLS & AUDIT PREVENTION GUIDELINES */}
          {activeSubTab === "pitfalls" && (
            <motion.div
              key="pitfalls"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Top Banner Header */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1a0c0c] via-[#2a1015] to-[#1a0c0c] border border-rose-500/30 shadow-2xl space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black text-rose-400 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
                      <span>دليل الحماية الوقائية وتفادي الأخطاء والغرامات الضريبية</span>
                    </span>
                    <h3 className="text-xl font-black text-white">
                      أهم ثغرات الإقرارات الضريبية وكيفية تجنب الوقوع في الأخطاء الفتاكة ⚠️
                    </h3>
                    <p className="text-xs text-slate-300">
                      بحث واستقصاء ميداني شامل يغطي أكثر الثغرات والأخطاء الشائعة التي تسبب إعادة الفحص الضريبي، فرض الغرامات العالية، وإلغاء خصم الضريبة لدى {currentCountry.authorityName}.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-3.5 py-1.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>محدّث بآخر تعليمات المراجعة لعام 2026</span>
                    </span>
                  </div>
                </div>

                {/* Categories Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
                  {[
                    { id: "all", label: "جميع الثغرات والأخطاء (6 ثغرات رئيسية)" },
                    { id: "input_vat", label: "🛒 خصم ضريبة المدخلات" },
                    { id: "revenue_time", label: "⏱️ توقيت استحقاق المبيعات" },
                    { id: "withholding", label: "🌐 الموردين الأجانب و WHT" },
                    { id: "credit_notes", label: "📑 الإشعارات الدائنة والخصم" },
                    { id: "reconciliation", label: "⚖️ مطابقة القوائم المالية" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setPitfallCategoryFilter(cat.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                        pitfallCategoryFilter === cat.id
                          ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30 border border-rose-400"
                          : "bg-black/40 text-slate-400 hover:text-white border border-white/10"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* INTERACTIVE SELF-AUDIT PITFALL SCANNER WIDGET */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121026] via-[#1a1438] to-[#121026] border border-purple-500/30 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>أداة التقييم الذكي قبل رفع الإقرار النهائي</span>
                    </span>
                    <h4 className="text-lg font-black text-white">
                      فاحص ثغرات ومخاطر الإقرار (Smart Tax Audit Scanner) 🔍
                    </h4>
                    <p className="text-xs text-slate-300">
                      حدد الممارسات الموجودة في عمليتك المحاسبية لاكتشاف الثغرات وتلقي الحلول الفورية لتفادي الغرامات.
                    </p>
                  </div>

                  <button
                    onClick={() => setScannerEvaluated(true)}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 cursor-pointer flex items-center gap-2 shrink-0 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>فحص وتحليل مستوى المخاطر الآن</span>
                  </button>
                </div>

                {/* Questions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      key: "q1_online_sales",
                      title: "1. المبيعات الإلكترونية وبوابات الدفع (Mada / Stripe / Tap)",
                      desc: "هل تبيع أونلاين وتقوم بتسجيل المبيعات بعد خصم عمولة البوابة بدلاً من القيمة الإجمالية الأصلية؟",
                    },
                    {
                      key: "q2_foreign_services",
                      title: "2. اشتراكات البرامج والخدمات الأجنبية (AWS / Meta / Google)",
                      desc: "هل تدفع اشتراكات سحابية لشركات خارج الدولة دون إعداد إقرار ضريبة الاستقطاع (WHT)؟",
                    },
                    {
                      key: "q3_credit_notes",
                      title: "3. الإشعارات الدائنة والخصومات (Credit Notes)",
                      desc: "هل أصدرت إشعارات دائنة لتخفيض المبيعات دون وجود فاتورة أصلية مرجعية أو سند إرجاع؟",
                    },
                    {
                      key: "q4_exempt_goods",
                      title: "4. السلع المعفاة والمصروفات المشتركة",
                      desc: "هل تمارس نشاطاً يجمع بين سلع خاضعة ومعفاة وخصمت 100% من ضريبة المشتريات العامة؟",
                    },
                    {
                      key: "q5_personal_expenses",
                      title: "5. مصروفات الإدارة والسيارات الشخصية",
                      desc: "هل أدرجت فواتير نفقات ترفيهية أو سيارات خاصة للمدراء ضمن ضريبة المشتريات القابلة للخصم؟",
                    },
                    {
                      key: "q6_bank_reconcile",
                      title: "6. مطابقة كشف الحساب البنكي وإجماليات المبيعات",
                      desc: "هل توجد مبالغ دخلت حساب البنك التجاري ولم تُدرج ضمن الإقرار الضريبي الحالي؟",
                    },
                  ].map((q) => {
                    const isChecked = scannerAnswers[q.key];
                    return (
                      <div
                        key={q.key}
                        onClick={() =>
                          setScannerAnswers({
                            ...scannerAnswers,
                            [q.key]: !isChecked,
                          })
                        }
                        className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                          isChecked
                            ? "bg-rose-950/40 border-rose-500/50 shadow-md shadow-rose-900/20"
                            : "bg-black/40 border-white/10 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h5 className="font-black text-xs text-white leading-snug">{q.title}</h5>
                          <div
                            className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                              isChecked
                                ? "bg-rose-500 border-rose-400 text-white"
                                : "border-slate-600 bg-black/40"
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{q.desc}</p>
                      </div>
                    );
                  })}
                </div>

                {/* RESULTS EVALUATION BOX */}
                {scannerEvaluated && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-5 rounded-2xl bg-slate-900 border-2 border-amber-500/40 space-y-4 font-sans"
                  >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-3">
                      <div className="space-y-1 text-right">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">نتيجة الفحص التقييمي:</span>
                        <h5 className="text-base font-black text-white flex items-center gap-2">
                          {Object.values(scannerAnswers).filter(Boolean).length >= 3 ? (
                            <>
                              <span className="px-2.5 py-1 rounded-lg bg-rose-500 text-white text-xs font-black">
                                🛑 مخاطرة ضريبية مرتفعة جداً
                              </span>
                              <span>يتطلب تصحيحاً فورياً قبل تقديم الإقرار لـ {currentCountry.authorityAbbr}</span>
                            </>
                          ) : Object.values(scannerAnswers).filter(Boolean).length > 0 ? (
                            <>
                              <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-xs font-black">
                                ⚠️ مخاطرة متوسطة
                              </span>
                              <span>توجد بعض النقاط التي تتطلب تعديلاً لمنع إعادة الفحص</span>
                            </>
                          ) : (
                            <>
                              <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-xs font-black">
                                ✅ إقرار آمن ومنضبط
                              </span>
                              <span>إقرارك ملتزم بالأنظمة والضوابط القانونية المعتمدة</span>
                            </>
                          )}
                        </h5>
                      </div>

                      <div className="text-center bg-black/50 p-3 rounded-xl border border-white/10 shrink-0">
                        <span className="text-[10px] text-slate-400 block font-bold">عدد الثغرات المكتشفة:</span>
                        <span className="text-xl font-mono font-black text-rose-400">
                          {Object.values(scannerAnswers).filter(Boolean).length} / 6
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <p className="font-bold text-amber-300">💡 التوصية المحاسبية المباشرة من خبراء ميزان:</p>
                      <ul className="space-y-1.5 text-slate-300 text-[11px] list-disc list-inside">
                        {scannerAnswers.q1_online_sales && (
                          <li>سجّل المبيعات الإلكترونية بالقيمة الإجمالية قبل الخصم، وعامل عمولة البوابة كمصروف تشغيلي مستقل.</li>
                        )}
                        {scannerAnswers.q2_foreign_services && (
                          <li>قدم إقرار ضريبة الاستقطاع (WHT) للموردين الأجانب في موعده لتجنب غرامة التأخير 1% إلى 2% شهرياً.</li>
                        )}
                        {scannerAnswers.q3_credit_notes && (
                          <li>تأكد من ربط كل إشعار دائن بالرقم المرجعي للفاتورة الأصلية الاحتفاظ بسند ارتجاع موثق.</li>
                        )}
                        {scannerAnswers.q4_exempt_goods && (
                          <li>طبّق المعادلة التنسيبية (Pro-Rata) لفصل ضريبة المشتريات المتعلقة بالتوريدات المعفاة.</li>
                        )}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* DETAILED PITFALL CARDS GRID */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="text-lg font-black text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    <span>سجل الثغرات الشائعة والأخطاء الميدانية الموثقة:</span>
                  </h4>
                  <span className="text-xs text-slate-400 font-bold">دليل تفصيلي بالأثر والحل الوقائي</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      id: "pitfall_1",
                      category: "input_vat",
                      title: "1. ثغرة خصم ضريبة المشتريات على فواتير غير مكتملة أو معلّقة",
                      risk: "مرتفع جداً 🛑",
                      riskColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
                      problem:
                        "يقوم المحاسب بخصم ضريبة القيمة المضافة على فواتير شراء غير محتويّة على كود QR معتمد، أو من موردين غير مسجلين في الضريبة، أو مر عليها أكثر من 5 سنوات مالية.",
                      impact: "إلغاء خصم الضريبة بالكامل، مطالبات مالية بأصل الضريبة المستحقة، وغرامة تقديم معلومات خاطئة قد تصل إلى 50%.",
                      solution:
                        "التحقق التلقائي من حالة الرقم الضريبي للمورد عبر بوابة الهيئة الرسمية، والاعتماد الحصري على فواتير الفوترة الإلكترونية المكتملة البيانات.",
                      caseStudy:
                        "مؤسسة خصمت 45,000 ريال ضريبة مشتريات من مورد ملغى رقمه الضريبي؛ عند الفحص تم إلغاء الخصم وفرض غرامة 22,500 ريال.",
                    },
                    {
                      id: "pitfall_2",
                      category: "revenue_time",
                      title: "2. ثغرة تأخير الإفصاح عن المبيعات الآجلة لحين السداد النقدي",
                      risk: "مرتفع جداً 🛑",
                      riskColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
                      problem:
                        "اعتماد مبدأ النقد بدلاً من مبدأ الاستحقاق؛ حيث يُؤجّل الإفصاح عن الفاتورة الضريبية الصادرة في الربع الحالي لحين تحصيل قيمتها من العميل في الربع القادم.",
                      impact: "اعتبار الإقرار السابق ناتجا عن تهرب ضريبي جزئي أو تقديم بيانات غير دقيقة، وتطبيق غرامات التعديل والتأخير.",
                      solution:
                        "تاريخ الاستحقاق الضريبي هو الأسبق من: أصدار الفاتورة، تسليم السلعة/الخدمة، أو استلام الثمن. يجب إدراج الفاتورة فور صدورها.",
                      caseStudy:
                        "شركة أصدرت فاتورة بـ 200,000 ريال في ديسمبر وأفصحت عنها في يناير بعد التحصيل؛ فرضت الهيئة غرامة تأخير على الإقرار الأول.",
                    },
                    {
                      id: "pitfall_3",
                      category: "withholding",
                      title: "3. ثغرة إغفال ضريبة الاستقطاع (WHT) للخدمات المستوردة أونلاين",
                      risk: "مرتفع ⚠️",
                      riskColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
                      problem:
                        "دفع مبالغ لشركات أجنبية مقابل برامج سحابية (AWS, Google, Zoom, OpenAI) وتراخيص وإعلانات دون تقديم إقرار ضريبة الاستقطاع الشهرية.",
                      impact: "حرمان المنشأة من اعتماد هذه المصروفات زكوياً/ضريبياً، وفرض غرامة تأخير سداد 1% عن كل 30 يوم تأخير.",
                      solution:
                        "استقطاع النسبة القانونية (تتراوح بين 5% و15%) وتوريدها للهيئة خلال الـ 15 يوماً الأولى من الشهر التالي للدفع.",
                      caseStudy:
                        "شركة سددت 100,000 $ إعلانات لفيسبوك؛ توجب عليها توريد 5% (5,000 $) كضريبة استقطاع لحماية المصروف من الرفض.",
                    },
                    {
                      id: "pitfall_4",
                      category: "credit_notes",
                      title: "4. ثغرة إصدار الإشعارات الدائنة عشوائياً لتخفيض المبيعات",
                      risk: "مرتفع ⚠️",
                      riskColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
                      problem:
                        "إصدار إشعار دائن (Credit Note) لتخفيض إجمالي مبيعات الفترة السابقة دون وجود رقم مرجعي للفاتورة الأصلية أو دون وجود سند استلام مرتجع.",
                      impact: "رفض الفاحص الضريبي للإشعار الدائن وإعادة إضافة الضريبة المخصومة لحساب المبيعات المستحقة.",
                      solution:
                        "ربط الإشعار الدائن آلياً برقم الفاتورة الإلكترونية المرجعية والتأكد من توثيق سبب التعديل (ارتجاع بضاعة / خصم مسموح).",
                      caseStudy:
                        "إصدار إشعار دائن بقيمة 50,000 ريال دون إرفاق محضر مرتجع، أسفر عن رفض التخفيض ومطالبة بـ 7,500 ريال ضريبة.",
                    },
                    {
                      id: "pitfall_5",
                      category: "reconciliation",
                      title: "5. ثغرة وجود فروقات بين إقرار الضريبة والإيرادات السنوية في القوائم",
                      risk: "متوسط ℹ️",
                      riskColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
                      problem:
                        "عدم مطابقة مجموع إقرارات ضريبة القيمة المضافة الـ 4 خلال السنة مع إجمالي الإيرادات المفصح عنها في قائمة الدخل والنموذج الزكوي السنوي.",
                      impact: "إشعارات آليّة من نظام الهيئة لطلب الاستفسار، وإخضاع المنشأة لفحص ضريبي ميداني مكثف.",
                      solution:
                        "إجراء مصفوفة مطابقة ضريبة القيمة المضافة (VAT Reconciliation Matrix) بنهاية كل سنة مالية وقبل رفع الإقرار الزكوي النهائي.",
                      caseStudy:
                        "فارق 300,000 ريال بين الإقرارات والقوائم بسبب فروق تقييم العملة الأجنبية؛ تم حلها بتقديم مذكرة تسوية توضيحية.",
                    },
                    {
                      id: "pitfall_6",
                      category: "input_vat",
                      title: "6. ثغرة خصم الضريبة على مصاريف الترفيه والسيارات الشخصية",
                      risk: "مرتفع ⚠️",
                      riskColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
                      problem:
                        "إدراج ضريبة القيمة المضافة المدفوعة على وجبات الطعام والضيافة، وهدايا العملاء، والسيارات الخاصة بالمدراء التنفيذيين ضمن الضريبة القابلة للخصم.",
                      impact: "القانون يستثني صراحة هذه المصروفات من الخصم؛ وخصمها يعد مخالفة تتوجب التعديل والغرامة.",
                      solution:
                        "توجيه هذه الفواتير في النظام المحاسبي إلى حساب مصروف شامل الضريبة (Non-Deductible Input VAT) وعدم ترحيلها لإقرار الضريبة.",
                      caseStudy:
                        "خصم 12,000 ريال ضريبة عن شراء سيارة فاخرة لاستخدام المدير؛ ألغت الهيئة الخصم وفرضت غرامة تعديل.",
                    },
                  ]
                    .filter(
                      (p) => pitfallCategoryFilter === "all" || p.category === pitfallCategoryFilter
                    )
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-6 rounded-3xl bg-black/50 border border-white/10 hover:border-indigo-500/40 transition-all space-y-4 shadow-xl font-sans"
                      >
                        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                          <h5 className="font-black text-sm text-white leading-snug">{item.title}</h5>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border shrink-0 ${item.riskColor}`}>
                            {item.risk}
                          </span>
                        </div>

                        <div className="space-y-2.5 text-xs">
                          <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/20 text-rose-200">
                            <span className="font-bold text-rose-300 block text-[11px] mb-0.5">🛑 طبيعة المشكلة والخطأ:</span>
                            <p className="text-[11px] text-slate-300 leading-relaxed">{item.problem}</p>
                          </div>

                          <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/20 text-amber-200">
                            <span className="font-bold text-amber-300 block text-[11px] mb-0.5">⚖️ الأثر المالي والغرامة المتوقعة:</span>
                            <p className="text-[11px] text-slate-300 leading-relaxed">{item.impact}</p>
                          </div>

                          <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-200">
                            <span className="font-bold text-emerald-300 block text-[11px] mb-0.5">✅ الإجراء الوقائي والحل المعتمد:</span>
                            <p className="text-[11px] text-slate-300 leading-relaxed">{item.solution}</p>
                          </div>

                          <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-200">
                            <span className="font-bold text-indigo-300 block text-[11px] mb-0.5">📊 حالة دراسية واقعية:</span>
                            <p className="text-[11px] text-slate-300 leading-relaxed">{item.caseStudy}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* QUICK COMPARISON TABLE: MISTAKE VS STANDARD */}
              <div className="p-6 rounded-3xl bg-black/60 border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="text-base font-black text-white flex items-center gap-2">
                    <Scale className="w-5 h-5 text-indigo-400" />
                    <span>مقارنة حاسمة: الممارسة الخاطئة الشائعة مقابل المعيار القانوني الصحيح</span>
                  </h4>
                  <span className="text-xs text-indigo-300 font-bold">معايير امتثال {currentCountry.authorityName}</span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-white/10">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-indigo-950/80 text-indigo-200 font-black border-b border-white/10">
                        <th className="py-3.5 px-4">موضوع المعاملة</th>
                        <th className="py-3.5 px-4 text-rose-400">❌ الخطأ الشائع (Red Flag)</th>
                        <th className="py-3.5 px-4 text-emerald-400">✅ التصرف القانوني الصحيح</th>
                        <th className="py-3.5 px-4 text-indigo-300">🤖 أتمتة نظام ميزان المحاسبي</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-black/20 text-[11px]">
                      <tr className="hover:bg-white/5">
                        <td className="py-3 px-4 font-bold text-white">خصم ضريبة المشتريات</td>
                        <td className="py-3 px-4 text-slate-300">خصم أي فاتورة بها مبلغ ضريبة بغض النظر عن بياناتها.</td>
                        <td className="py-3 px-4 text-slate-300">خصم الفواتير الإلكترونية المعتمدة ذات الرقم الضريبي الفعال فقط.</td>
                        <td className="py-3 px-4 text-emerald-400 font-bold">فحص آلي للـ QR والرقم الضريبي عند إدخال الفاتورة.</td>
                      </tr>
                      <tr className="hover:bg-white/5">
                        <td className="py-3 px-4 font-bold text-white">المبيعات الإلكترونية</td>
                        <td className="py-3 px-4 text-slate-300">تسجيل صافي المبلغ الوارد للبنك بعد خصم العمولة.</td>
                        <td className="py-3 px-4 text-slate-300">تسجيل إجمالي الفاتورة وقيد العمولة كمصروف مستقل.</td>
                        <td className="py-3 px-4 text-emerald-400 font-bold">تفكيك تلقائي للمبيعات والعمولات عبر API المتاجر.</td>
                      </tr>
                      <tr className="hover:bg-white/5">
                        <td className="py-3 px-4 font-bold text-white">خدمات المورد الأجنبي</td>
                        <td className="py-3 px-4 text-slate-300">تجاهل الدفعات الأجنبية وعدم رفع إقرار استقطاع.</td>
                        <td className="py-3 px-4 text-slate-300">رفع إقرار WHT وتوريد الضريبة خلال 15 يوماً من الشهر التالي.</td>
                        <td className="py-3 px-4 text-emerald-400 font-bold">توليد آلي لإقرار ضريبة الاستقطاع فور تسجيل المصروف.</td>
                      </tr>
                      <tr className="hover:bg-white/5">
                        <td className="py-3 px-4 font-bold text-white">الديون المعدومة</td>
                        <td className="py-3 px-4 text-slate-300">خصم ضريبة الدين المعدوم بمجرد تأخر العميل عن السداد.</td>
                        <td className="py-3 px-4 text-slate-300">الانتظار 12 شهراً وإثبات الملاحقة القضائية وشطب الدين أصولياً.</td>
                        <td className="py-3 px-4 text-emerald-400 font-bold">متابعة عمر اعمار الذمم وتحديد الأهلية للخصم الضريبي.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* EXPERT ADVICE FOOTER BANNER */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-indigo-900/40 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                <div className="space-y-1 text-right">
                  <h5 className="font-black text-white text-sm flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span>نصيحة الخبير الضريبي من منصة ميزان:</span>
                  </h5>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    "معظم الغرامات الضريبية لا تنتج عن قصد التهرب، بل عن أخطاء إجرائية بسيطة في توقيت الاعتراف بالإيراد أو عدم اكتمال بيانات الفواتير. استخدامك للتدقيق الآلي في ميزان يضمن مطابقة إقرارك بنسبة 100% مع متطلبات {currentCountry.authorityName}."
                  </p>
                </div>

                <button
                  onClick={() => setActiveSubTab("wizard")}
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg shadow-indigo-600/30 shrink-0 cursor-pointer transition-all flex items-center gap-2"
                >
                  <span>الانتقال لمولد الإقرار وتجربة الرفع 🚀</span>
                </button>
              </div>

            </motion.div>
          )}

          {/* 0. TAX DECLARATION GENERATOR & FILING WIZARD */}
          {activeSubTab === "wizard" && (
            <motion.div
              key="wizard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Stepper Header Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0d1428] via-[#101b3b] to-[#0d1428] border border-indigo-500/30 shadow-xl space-y-6">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div className="space-y-1">
                    <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>نظام توليد ومحاكاة الإقرارات الضريبية الرسمية من الصفر</span>
                    </span>
                    <h3 className="text-xl font-black text-white">
                      إعداد ورفع الإقرار الضريبي لـ {currentCountry.countryName} ({currentCountry.authorityAbbr}) 📄
                    </h3>
                    <p className="text-xs text-slate-300">
                      أدخل البيانات الماليّة للمنشأة لتوليد شيت الإقرار الضريبي الرسمي المعتمد، ثم اتبع محاكي الرفع المباشر على بوابة {currentCountry.authorityName}.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-3 py-1.5 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 text-xs font-bold flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-indigo-400" />
                      <span>{currentCountry.flag} {currentCountry.countryName}</span>
                    </span>
                  </div>
                </div>

                {/* Progress Steps Header */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { step: 1, title: "1. بيانات المكلف والإقرار", desc: "نوع الضريبة والفترة" },
                    { step: 2, title: "2. المبيعات والمشتريات", desc: "تعبئة القيم والمدخلات" },
                    { step: 3, title: "3. الشيت الرسمي المولد", desc: "معاينة الإقرار والقيد" },
                    { step: 4, title: "4. محاكي الرفع والسداد", desc: "خطوات البوابة و SADAD" },
                  ].map((s) => (
                    <button
                      key={s.step}
                      onClick={() => setWizardStep(s.step)}
                      className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                        wizardStep === s.step
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-300 text-white shadow-lg shadow-indigo-600/30"
                          : wizardStep > s.step
                          ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                          : "bg-black/30 border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black">{s.title}</span>
                        {wizardStep > s.step && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <span className="text-[10px] block opacity-80 mt-0.5">{s.desc}</span>
                    </button>
                  ))}
                </div>

              </div>

              {/* STEP 1: TAXPAYER & TAX TYPE SELECTION */}
              {wizardStep === 1 && (
                <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1428] border border-white/10 space-y-6">
                  <h4 className="font-black text-white text-base flex items-center gap-2 border-b border-white/10 pb-3">
                    <Building2 className="w-5 h-5 text-indigo-400" />
                    <span>الخطوة 1: حدد نوع الإقرار والبيانات الرسمية للمنشأة المكلفة</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Tax Type */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-200 block">
                        اختر نوع الإقرار الضريبي المراد إعداده:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          { id: "vat", label: "ضريبة القيمة المضافة (VAT)", desc: "إقرار المخرجات والمدخلات الفترية" },
                          { id: "corporate", label: "ضريبة أرباح الشركات", desc: "الإقرار السنوي للأرباح التجارية" },
                          { id: "payroll", label: "ضريبة كسب العمل والرواتب", desc: "استقطاعات الأجور والموظفين" },
                          { id: "withholding", label: "ضريبة الاستقطاع / الخصم", desc: "المدفوعات لغير المقيمين والموردين" },
                        ].map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setWizardTaxType(t.id as any)}
                            className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                              wizardTaxType === t.id
                                ? "bg-indigo-600/30 border-indigo-400 text-white shadow-md"
                                : "bg-black/30 border-white/10 text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            <span className="text-xs font-black block text-white">{t.label}</span>
                            <span className="text-[10px] text-slate-400">{t.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Period & Taxpayer Info */}
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-300 block">اسم المنشأة / المكلف:</label>
                        <input
                          type="text"
                          value={taxpayerName}
                          onChange={(e) => setTaxpayerName(e.target.value)}
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-indigo-400"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-300 block">الرقم الضريبي (TIN):</label>
                          <input
                            type="text"
                            value={tinNumber}
                            onChange={(e) => setTinNumber(e.target.value)}
                            className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-indigo-400"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-300 block">الفترة الضريبية للإقرار:</label>
                          <select
                            value={wizardPeriod}
                            onChange={(e) => setWizardPeriod(e.target.value)}
                            className="w-full bg-[#080c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-indigo-400"
                          >
                            <option value="الربع الأول 2026 (Q1)">الربع الأول 2026 (Q1)</option>
                            <option value="الربع الثاني 2026 (Q2)">الربع الثاني 2026 (Q2)</option>
                            <option value="الربع الثالث 2026 (Q3)">الربع الثالث 2026 (Q3)</option>
                            <option value="الربع الرابع 2026 (Q4)">الربع الرابع 2026 (Q4)</option>
                            <option value="الإقرار الشهري - يناير 2026">الإقرار الشهري - يناير 2026</option>
                            <option value="الإقرار السنوي الشامل 2025">الإقرار السنوي الشامل 2025</option>
                          </select>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="flex justify-end pt-4 border-t border-white/10">
                    <button
                      onClick={() => setWizardStep(2)}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
                    >
                      <span>الانتقال لإدخال المبيعات والمشتريات</span>
                      <ArrowRight className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: FINANCIAL INPUTS */}
              {wizardStep === 2 && (
                <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1428] border border-white/10 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <h4 className="font-black text-white text-base flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-indigo-400" />
                      <span>الخطوة 2: تعبئة قيم المبيعات (المخرجات) والمشتريات (المدخلات)</span>
                    </h4>

                    <div className="text-xs text-indigo-300 font-bold bg-indigo-500/20 px-3 py-1 rounded-xl border border-indigo-500/30">
                      العملة: {currentCountry.currencySymbol} ({currentCountry.currency})
                    </div>
                  </div>

                  {/* FINANCIAL INPUTS GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Output Sales Box */}
                    <div className="p-5 rounded-2xl bg-black/40 border border-indigo-500/30 space-y-4">
                      <h5 className="font-black text-indigo-300 text-xs flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-indigo-400" />
                        <span>أولاً: المبيعات والإيرادات (ضريبة المخرجات)</span>
                      </h5>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-300 block">
                            1. المبيعات الخاضعة للنسبة الأساسية ({currentCountry.id === "egypt" ? "14%" : currentCountry.id === "uae" ? "5%" : "15%"})
                          </label>
                          <input
                            type="number"
                            value={stdSales}
                            onChange={(e) => setStdSales(Number(e.target.value))}
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-indigo-400"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-300 block">
                            2. المبيعات الخاضعة لنسبة الصفر (0%)
                          </label>
                          <input
                            type="number"
                            value={zeroSales}
                            onChange={(e) => setZeroSales(Number(e.target.value))}
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-indigo-400"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-300 block">
                            3. الصادرات المباشرة للخارج (0%)
                          </label>
                          <input
                            type="number"
                            value={exportSales}
                            onChange={(e) => setExportSales(Number(e.target.value))}
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-indigo-400"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-300 block">
                            4. المبيعات والمعاملات المعفاة من الضريبة
                          </label>
                          <input
                            type="number"
                            value={exemptSales}
                            onChange={(e) => setExemptSales(Number(e.target.value))}
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-indigo-400"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Input Purchases Box */}
                    <div className="p-5 rounded-2xl bg-black/40 border border-purple-500/30 space-y-4">
                      <h5 className="font-black text-purple-300 text-xs flex items-center gap-2">
                        <Coins className="w-4 h-4 text-purple-400" />
                        <span>ثانياً: المشتريات والمصروفات (ضريبة المدخلات الخصمية)</span>
                      </h5>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-300 block">
                            1. المشتريات والمصاريف المحلية المؤهلة للخصم
                          </label>
                          <input
                            type="number"
                            value={stdPurchases}
                            onChange={(e) => setStdPurchases(Number(e.target.value))}
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-purple-400"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-300 block">
                            2. الاستيرادات المباشرة عبر الجمارك (الرسوم المباشرة)
                          </label>
                          <input
                            type="number"
                            value={importPurchases}
                            onChange={(e) => setImportPurchases(Number(e.target.value))}
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-purple-400"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-300 block">
                            3. شراء الأصول الثابتة والمعدات الرأسمالية
                          </label>
                          <input
                            type="number"
                            value={capitalPurchases}
                            onChange={(e) => setCapitalPurchases(Number(e.target.value))}
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-purple-400"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-300 block">
                            4. رصيد دائن مدور من الفترات السابقة (خصم إضافي)
                          </label>
                          <input
                            type="number"
                            value={priorCredit}
                            onChange={(e) => setPriorCredit(Number(e.target.value))}
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-400"
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <button
                      onClick={() => setWizardStep(1)}
                      className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
                    >
                      الرجوع
                    </button>

                    <button
                      onClick={() => setWizardStep(3)}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
                    >
                      <span>توليد ومعاينة شيت الإقرار الضريبي الرسمي</span>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: OFFICIAL PRINTABLE TAX STATEMENT SHEET */}
              {wizardStep === 3 && (
                <div className="space-y-6">
                  
                  {/* Action Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#0d1428] border border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{currentCountry.flag}</span>
                      <div>
                        <h4 className="font-black text-white text-sm">نموذج شيت الإقرار الضريبي الرسمي المولد</h4>
                        <p className="text-[11px] text-slate-400">{wizardResult.taxTypeTitle} | {wizardPeriod}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const sheetText = `نموذج الإقرار الضريبي الرسمي - ${currentCountry.countryName}\nالمنشأة: ${taxpayerName}\nالرقم الضريبي: ${tinNumber}\nالفترة: ${wizardPeriod}\nالصافي المستحق: ${wizardResult.finalNetPayable.toLocaleString()} ${currentCountry.currencySymbol}\nرقم سداد: ${wizardResult.sadadRefNumber}`;
                          navigator.clipboard.writeText(sheetText);
                          setCopiedSheet(true);
                          setTimeout(() => setCopiedSheet(false), 2500);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedSheet ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedSheet ? "تم النسخ!" : "نسخ الشيت"}</span>
                      </button>

                      <button
                        onClick={() => window.print()}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/30"
                      >
                        <Printer className="w-4 h-4" />
                        <span>طباعة الإقرار (Print)</span>
                      </button>

                      <button
                        onClick={() => setWizardStep(4)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                      >
                        <span>محاكي الرفع على البوابة</span>
                        <ArrowRight className="w-4 h-4 rotate-180" />
                      </button>
                    </div>
                  </div>

                  {/* OFFICIAL PRINTABLE TAX RETURN SHEET CARD */}
                  <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 border-2 border-indigo-500/40 space-y-8 shadow-2xl text-slate-100 font-sans print:bg-white print:text-black print:border-none">
                    
                    {/* Header Banner */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-indigo-500/30 pb-6">
                      <div className="text-right space-y-1">
                        <span className="text-xs font-black text-indigo-400 block uppercase tracking-widest">{currentCountry.authorityName} ({currentCountry.authorityAbbr})</span>
                        <h2 className="text-xl sm:text-2xl font-black text-white">{wizardResult.taxTypeTitle}</h2>
                        <p className="text-xs text-slate-300">نموذج ملخص الإقرار الضريبي المعتمد إلكترونياً</p>
                      </div>

                      <div className="text-center sm:text-left bg-black/40 p-4 rounded-2xl border border-white/10 space-y-1">
                        <div className="text-3xl">{currentCountry.flag}</div>
                        <div className="font-mono text-xs text-indigo-300 font-bold">المرجع: {wizardResult.sadadRefNumber}</div>
                        <div className="text-[10px] text-slate-400">تاريخ التوليد: {new Date().toLocaleDateString("ar-EG")}</div>
                      </div>
                    </div>

                    {/* Taxpayer Meta Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-black/40 p-4 rounded-2xl border border-white/10 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">اسم المكلف / المنشأة:</span>
                        <span className="font-black text-white text-sm">{taxpayerName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">الرقم الضريبي (TIN):</span>
                        <span className="font-mono font-bold text-amber-300 text-sm">{tinNumber}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">الفترة الضريبية:</span>
                        <span className="font-bold text-indigo-300">{wizardPeriod}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">حالة الإقرار:</span>
                        <span className="font-black text-emerald-400">جاهز للرفع والتنفيذ 🟢</span>
                      </div>
                    </div>

                    {/* ITEMIZED BOXES TABLE */}
                    <div className="space-y-3">
                      <h3 className="font-black text-white text-sm flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-400" />
                        <span>تفاصيل خانات نماذج الهيئة الرسمية (Box Items Breakdown):</span>
                      </h3>

                      <div className="overflow-x-auto rounded-2xl border border-white/10">
                        <table className="w-full text-right text-xs">
                          <thead>
                            <tr className="bg-indigo-950/60 text-indigo-200 font-black border-b border-white/10">
                              <th className="py-3 px-4">رقم الخانة</th>
                              <th className="py-3 px-4">بيان الخانة الضريبية</th>
                              <th className="py-3 px-4">المبلغ الخاضع ({currentCountry.currencySymbol})</th>
                              <th className="py-3 px-4">مبلغ الضريبة ({currentCountry.currencySymbol})</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 bg-black/20">
                            <tr className="hover:bg-white/5 font-medium">
                              <td className="py-3 px-4 font-mono font-bold text-indigo-400">Box 1</td>
                              <td className="py-3 px-4 text-white">المبيعات الخاضعة للنسبة الأساسية</td>
                              <td className="py-3 px-4 font-mono">{stdSales.toLocaleString()}</td>
                              <td className="py-3 px-4 font-mono font-bold text-indigo-300">
                                {wizardResult.outputTaxStd ? wizardResult.outputTaxStd.toLocaleString() : "0"}
                              </td>
                            </tr>
                            <tr className="hover:bg-white/5 font-medium">
                              <td className="py-3 px-4 font-mono font-bold text-indigo-400">Box 2</td>
                              <td className="py-3 px-4 text-white">المبيعات الخاضعة لنسبة الصفر (0%)</td>
                              <td className="py-3 px-4 font-mono">{zeroSales.toLocaleString()}</td>
                              <td className="py-3 px-4 font-mono text-slate-400">0.00</td>
                            </tr>
                            <tr className="hover:bg-white/5 font-medium">
                              <td className="py-3 px-4 font-mono font-bold text-indigo-400">Box 3</td>
                              <td className="py-3 px-4 text-white">الصادرات المباشرة للخارج (0%)</td>
                              <td className="py-3 px-4 font-mono">{exportSales.toLocaleString()}</td>
                              <td className="py-3 px-4 font-mono text-slate-400">0.00</td>
                            </tr>
                            <tr className="hover:bg-white/5 font-medium">
                              <td className="py-3 px-4 font-mono font-bold text-indigo-400">Box 4</td>
                              <td className="py-3 px-4 text-white">المبيعات المعفاة من الضريبة</td>
                              <td className="py-3 px-4 font-mono">{exemptSales.toLocaleString()}</td>
                              <td className="py-3 px-4 font-mono text-slate-400">0.00</td>
                            </tr>
                            <tr className="bg-indigo-950/40 font-black text-white">
                              <td className="py-3 px-4 font-mono text-amber-400">Box 5</td>
                              <td className="py-3 px-4">إجمالي ضريبة المخرجات (Output Tax)</td>
                              <td className="py-3 px-4 font-mono">{(stdSales + zeroSales + exportSales + exemptSales).toLocaleString()}</td>
                              <td className="py-3 px-4 font-mono text-amber-300 font-black">
                                {wizardResult.outputTaxTotal ? wizardResult.outputTaxTotal.toLocaleString() : "0"}
                              </td>
                            </tr>

                            <tr className="hover:bg-white/5 font-medium">
                              <td className="py-3 px-4 font-mono font-bold text-purple-400">Box 6</td>
                              <td className="py-3 px-4 text-white">المشتريات المحلية الخاضعة والخصمية</td>
                              <td className="py-3 px-4 font-mono">{stdPurchases.toLocaleString()}</td>
                              <td className="py-3 px-4 font-mono text-purple-300">
                                {wizardResult.inputTaxStd ? wizardResult.inputTaxStd.toLocaleString() : "0"}
                              </td>
                            </tr>
                            <tr className="hover:bg-white/5 font-medium">
                              <td className="py-3 px-4 font-mono font-bold text-purple-400">Box 7</td>
                              <td className="py-3 px-4 text-white">الاستيرادات الجمركية الخاضعة للضريبة</td>
                              <td className="py-3 px-4 font-mono">{importPurchases.toLocaleString()}</td>
                              <td className="py-3 px-4 font-mono text-purple-300">
                                {wizardResult.inputTaxImports ? wizardResult.inputTaxImports.toLocaleString() : "0"}
                              </td>
                            </tr>
                            <tr className="hover:bg-white/5 font-medium">
                              <td className="py-3 px-4 font-mono font-bold text-purple-400">Box 8</td>
                              <td className="py-3 px-4 text-white">الأصول والمعدات الرأسمالية الخاضعة</td>
                              <td className="py-3 px-4 font-mono">{capitalPurchases.toLocaleString()}</td>
                              <td className="py-3 px-4 font-mono text-purple-300">
                                {wizardResult.inputTaxCapital ? wizardResult.inputTaxCapital.toLocaleString() : "0"}
                              </td>
                            </tr>
                            <tr className="bg-purple-950/40 font-black text-white">
                              <td className="py-3 px-4 font-mono text-pink-400">Box 9</td>
                              <td className="py-3 px-4">إجمالي ضريبة المدخلات المقبولة (Input Tax)</td>
                              <td className="py-3 px-4 font-mono">{(stdPurchases + importPurchases + capitalPurchases).toLocaleString()}</td>
                              <td className="py-3 px-4 font-mono text-pink-300 font-black">
                                {wizardResult.inputTaxTotal ? wizardResult.inputTaxTotal.toLocaleString() : "0"}
                              </td>
                            </tr>

                            <tr className="hover:bg-white/5 font-medium">
                              <td className="py-3 px-4 font-mono font-bold text-emerald-400">Box 10</td>
                              <td className="py-3 px-4 text-emerald-300">خصم رصيد دائن مدور من الفترات السابقة</td>
                              <td className="py-3 px-4 font-mono text-slate-400">-</td>
                              <td className="py-3 px-4 font-mono text-emerald-400 font-bold">({priorCredit.toLocaleString()})</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* FINAL NET SUMMARY BOX */}
                    <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-[#0d163a] to-purple-950 border-2 border-emerald-400/50 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
                      <div className="space-y-1 text-right">
                        <span className="text-xs font-black text-indigo-300 block">النتيجة النهائية للإقرار الضريبي:</span>
                        <h3 className="text-lg font-black text-white">
                          {wizardResult.isRefundable ? "رصيد دائن مسترد لصالح المكلف 🟢" : "صافي الضريبة الواجبة السداد للهيئة 🔴"}
                        </h3>
                        <p className="text-xs text-slate-300 font-mono">
                          رقم فاتورة سداد SADAD المعين: <span className="text-amber-300 font-black">{wizardResult.sadadRefNumber}</span>
                        </p>
                      </div>

                      <div className="text-center sm:text-left bg-black/60 px-6 py-4 rounded-2xl border border-emerald-400/40">
                        <span className="text-xs text-slate-400 block font-bold">المبلغ المستحق النهائى:</span>
                        <span className="text-3xl font-black text-emerald-400">
                          {wizardResult.finalNetPayable.toLocaleString()} {currentCountry.currencySymbol}
                        </span>
                      </div>
                    </div>

                    {/* AUTO JOURNAL ENTRY */}
                    <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1.5 font-mono text-xs">
                      <span className="text-slate-400 block text-[10px] font-sans font-bold text-indigo-300">
                        القيد المحاسبي التلقائي لتوجيه الإقرار بالدفاتر:
                      </span>
                      <p className="text-emerald-300 font-bold leading-relaxed">
                        {wizardResult.journalEntry}
                      </p>
                    </div>

                  </div>

                </div>
              )}

              {/* STEP 4: INTERACTIVE PORTAL SUBMISSION SIMULATOR */}
              {wizardStep === 4 && (
                <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1428] border border-white/10 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <span className="text-xs font-black text-amber-400 uppercase tracking-widest block">محاكي الرفع المباشر بالخطوات والتنفيذ</span>
                      <h4 className="font-black text-white text-lg mt-1">
                        كيفية رفع الإقرار على بوابة {currentCountry.authorityName} ({currentCountry.authorityAbbr})
                      </h4>
                    </div>

                    <a
                      href={currentCountry.officialPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg"
                    >
                      <span>فتح بوابة {currentCountry.authorityAbbr} الرسمية</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* SIMULATOR INTERACTIVE STEPS */}
                  <div className="space-y-4">
                    {[
                      {
                        step: 1,
                        title: `1️⃣ تسجيل الدخول إلى بوابة ${currentCountry.authorityName}`,
                        desc: `قم بالدخول إلى البوابة الرسمية عبر النفاذ الموحد أو باستخدام اسم المستخدم وكلمة المرور الخاصة بمنشأتك (${currentCountry.authorityAbbr}).`,
                        proTip: "تأكد من اختيار اسم الفرع أو السجل التجاري المناسب إن كان للمنشأة أكثر من فرع.",
                        screenLabel: "شاشة تسجيل الدخول والنفاذ الموحد"
                      },
                      {
                        step: 2,
                        title: "2️⃣ الانتقال لقسم الإقرارات الضريبية (Tax Returns Management)",
                        desc: `من القائمة الرئيسية اختَر [الخدمات الضريبية] 👈 [إقرارات ضريبة القيمة المضافة / أرباح الشركات] 👈 ثم انقر [تقديم الإقرار عن الفترة ${wizardPeriod}].`,
                        proTip: "ستظهر حالة الإقرار كـ (جاهز للتقديم) أو (متأخر) إن تجاوز الموعد المعتمد.",
                        screenLabel: "شاشة اختيار الفترة المالية والإقرار"
                      },
                      {
                        step: 3,
                        title: "3️⃣ نقل خانات الشيت المولد تلقائياً إلى حقول البوابة",
                        desc: `قم بنقل الأرقام المقابلة من الشيت المولد بالخطوة السابقة:\n- Box 1 المبيعات الخاضعة 15%: ${stdSales.toLocaleString()} ${currentCountry.currencySymbol}\n- Box 6 المشتريات المحلية: ${stdPurchases.toLocaleString()} ${currentCountry.currencySymbol}\n- Box 7 الاستيرادات الجمركية: ${importPurchases.toLocaleString()} ${currentCountry.currencySymbol}`,
                        proTip: "تقوم البوابة بحساب الضريبة تلقائياً فور كتابة المبالغ الخاضعة للتحقق من المطابقة.",
                        screenLabel: "شاشة تعبئة الخانات الحسابية للإقرار"
                      },
                      {
                        step: 4,
                        title: "4️⃣ إرفاق المستندات ومطابقة ملف الفواتير الإلكترونية (Fatoora)",
                        desc: "في حال طلبت البوابة مراجعة عينة أو ملف المخرجات والمدخلات، قم بإرفاق ملف Excel المولد من النظام أو الشهادة الجمركية.",
                        proTip: "تأكد من إدراج الكود المرجعي للشهادة الجمركية إن وجدت استيرادات للربط مع هيئة الجمارك.",
                        screenLabel: "شاشة المرفقات ومطابقة الفواتير"
                      },
                      {
                        step: 5,
                        title: "5️⃣ مراجعة التعهد الرسمي وإرسال الإقرار (Submit)",
                        desc: "قم بالتعليم على خانة [أقر أنا المكلف بصحة كافة البيانات المدخلة وأنها تمثل الواقع المالي للمنشأة] ثم اضغط [إرسال الإقرار].",
                        proTip: "ستصلك رسالة نصية وبريد إلكتروني فور الإرسال يتضمن الرقم المرجعي للتسليم.",
                        screenLabel: "شاشة التعهد والتأكيد النهائي"
                      },
                      {
                        step: 6,
                        title: "6️⃣ صدور فاتورة سداد (SADAD Bill) وسداد المستحق",
                        desc: `يتم إصدار رقم فاتورة سداد المالي فورياً (${wizardResult.sadadRefNumber}). قم بسداد المبلغ (${wizardResult.finalNetPayable.toLocaleString()} ${currentCountry.currencySymbol}) عبر تطبيق البنك بقسم سداد/الخدمات الحكومية.`,
                        proTip: "احتفظ بإيصال السداد الإلكتروني لتقديمه لمراجع الحسابات إغلاقاً للفحص الضريبي.",
                        screenLabel: "شاشة الفاتورة النهائية وإيصال التسليم"
                      }
                    ].map((st) => (
                      <div
                        key={st.step}
                        onClick={() => setSimulatedPortalStep(st.step)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                          simulatedPortalStep === st.step
                            ? "bg-gradient-to-r from-indigo-950/90 to-purple-950/90 border-indigo-400 shadow-xl"
                            : "bg-black/30 border-white/10 hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h5 className="font-black text-sm text-white">{st.title}</h5>
                          <span className="text-[10px] text-indigo-300 font-bold bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                            {st.screenLabel}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed font-medium whitespace-pre-line">
                          {st.desc}
                        </p>

                        {st.proTip && (
                          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-xs flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                            <span><strong>ملاحظة هامة:</strong> {st.proTip}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* SIMULATOR SUCCESS BANNER */}
                  <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-500/40 text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                    <h4 className="font-black text-white text-base">تهانينا! اكتمل إعداد ومحاكاة تقديم الإقرار الضريبي بنجاح 🎉</h4>
                    <p className="text-xs text-emerald-200 max-w-2xl mx-auto">
                      يمكنك الآن الاعتماد على هذا الشيت والتوجيه المحاسبي ورفعه فوراً على البوابة الرسمية دون أخطاء أو غرامات تأخير.
                    </p>
                  </div>

                </div>
              )}

            </motion.div>
          )}

          {/* 1. OVERVIEW & KEY RATES TAB */}
          {activeSubTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Country Summary & Authority Card */}
              <div className="p-6 rounded-3xl bg-[#0d1428] border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{currentCountry.flag}</span>
                    <div>
                      <h3 className="font-black text-white text-lg">{currentCountry.countryName}</h3>
                      <p className="text-xs text-indigo-300 font-bold">{currentCountry.authorityName} ({currentCountry.authorityAbbr})</p>
                    </div>
                  </div>

                  <span className="text-xs font-black text-emerald-300 bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/30 self-start sm:self-center">
                    {currentCountry.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {currentCountry.summary}
                </p>
              </div>

              {/* Key Rates Grid */}
              <div className="space-y-3">
                <h3 className="font-black text-white text-base flex items-center gap-2">
                  <Percent className="w-5 h-5 text-indigo-400" />
                  <span>النسب الضريبية الرسمية لـ {currentCountry.countryName}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {currentCountry.keyRates.map((rate, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="p-5 rounded-3xl bg-[#0d1428] border border-white/10 space-y-3 relative overflow-hidden shadow-lg group"
                    >
                      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${rate.color} flex items-center justify-center text-white font-black text-sm shadow-md`}>
                        %
                      </div>

                      <div className="space-y-1">
                        <span className="text-2xl font-black text-white block tracking-tight">
                          {rate.rate}
                        </span>
                        <h4 className="text-xs font-black text-slate-200">{rate.label}</h4>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-normal">
                        {rate.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Links to Step Guides */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-[#0d1428] to-purple-950/60 border border-indigo-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    <h3 className="font-black text-white text-base">أدلة التقديم والإقرارات السريعة</h3>
                  </div>
                  <button
                    onClick={() => setActiveSubTab("steps")}
                    className="text-xs font-black text-indigo-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <span>عرض كافة الأدلة ({currentCountry.stepGuides.length})</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentCountry.stepGuides.map((guide, idx) => (
                    <div
                      key={guide.id}
                      onClick={() => {
                        setActiveGuideIdx(idx);
                        setActiveStepNum(1);
                        setActiveSubTab("steps");
                      }}
                      className="p-4 rounded-2xl bg-black/40 hover:bg-white/5 border border-white/10 cursor-pointer transition-all space-y-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-xs text-white group-hover:text-indigo-300 transition-colors">
                          {guide.title}
                        </h4>
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{guide.estimatedTime}</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{guide.summary}</p>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

          {/* 2. TAX TYPES & LEGISLATION DEEP DIVE */}
          {activeSubTab === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                {currentCountry.taxTypes.map((tax) => {
                  const isExpanded = expandedTaxTypeId === tax.id;
                  return (
                    <div
                      key={tax.id}
                      className="rounded-3xl bg-[#0d1428] border border-white/10 overflow-hidden shadow-xl transition-all"
                    >
                      {/* Accordion Header */}
                      <button
                        onClick={() => setExpandedTaxTypeId(isExpanded ? null : tax.id)}
                        className="w-full p-6 text-right flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold">
                            ⚖️
                          </div>
                          <div>
                            <h3 className="font-black text-white text-base sm:text-lg">{tax.title}</h3>
                            <p className="text-xs text-slate-400 mt-0.5">{tax.ratesOverview}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="hidden sm:inline-block text-xs font-bold text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-xl border border-indigo-500/30">
                            التفاصيل والأحكام
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-indigo-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {/* Accordion Content */}
                      {isExpanded && (
                        <div className="p-6 pt-0 border-t border-white/10 space-y-6 animate-fadeIn">
                          <p className="text-xs text-slate-300 leading-relaxed font-medium pt-4">
                            {tax.summary}
                          </p>

                          {tax.details.map((dt, dIdx) => (
                            <div key={dIdx} className="space-y-3 p-5 rounded-2xl bg-black/40 border border-white/5">
                              <h4 className="font-black text-indigo-300 text-sm flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                                <span>{dt.heading}</span>
                              </h4>
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {dt.content}
                              </p>

                              {dt.bulletPoints && (
                                <ul className="space-y-2 pt-1">
                                  {dt.bulletPoints.map((bp, bIdx) => (
                                    <li key={bIdx} className="text-xs text-slate-300 flex items-start gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                                      <span>{bp}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}

                              {/* Example Box */}
                              {dt.example && (
                                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border border-indigo-500/30 space-y-2">
                                  <div className="text-xs font-black text-amber-300 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-amber-400" />
                                    <span>{dt.example.title}</span>
                                  </div>
                                  <p className="text-xs text-slate-300"><strong className="text-white">السيناريو:</strong> {dt.example.scenario}</p>
                                  <p className="text-xs text-emerald-300 font-bold"><strong className="text-white">طريقة الاحتساب:</strong> {dt.example.calculation}</p>
                                  {dt.example.journalEntry && (
                                    <div className="pt-2 text-[11px] font-mono text-indigo-200 bg-black/60 p-2.5 rounded-lg border border-white/10">
                                      <span className="text-slate-400 block text-[9px]">القيد المحاسبي النموذجي:</span>
                                      {dt.example.journalEntry}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* 3. STEP-BY-STEP FILING GUIDES */}
          {activeSubTab === "steps" && (
            <motion.div
              key="steps"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Guide Selector Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {currentCountry.stepGuides.map((guide, idx) => (
                  <button
                    key={guide.id}
                    onClick={() => {
                      setActiveGuideIdx(idx);
                      setActiveStepNum(1);
                    }}
                    className={`px-4 py-3 rounded-2xl font-black text-xs shrink-0 cursor-pointer transition-all border ${
                      activeGuideIdx === idx
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400 shadow-lg"
                        : "bg-[#0d1428] text-slate-400 border-white/10 hover:text-white"
                    }`}
                  >
                    <span>{guide.title}</span>
                  </button>
                ))}
              </div>

              {/* Active Guide Viewer */}
              {currentCountry.stepGuides[activeGuideIdx] && (
                <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1428] border border-white/10 space-y-6">
                  
                  {/* Guide Top Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                    <div>
                      <h3 className="font-black text-white text-lg sm:text-xl">
                        {currentCountry.stepGuides[activeGuideIdx].title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {currentCountry.stepGuides[activeGuideIdx].summary}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>الاستغراق: {currentCountry.stepGuides[activeGuideIdx].estimatedTime}</span>
                      </span>
                      <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-3 py-1.5 rounded-xl border border-indigo-500/30">
                        {currentCountry.stepGuides[activeGuideIdx].portalName}
                      </span>
                    </div>
                  </div>

                  {/* Required Documents Checklist */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                    <h4 className="text-xs font-black text-slate-200 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      <span>المستندات والمتطلبات الواجب تجهيزها مسبقاً:</span>
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {currentCountry.stepGuides[activeGuideIdx].requiredDocs.map((doc, dIdx) => (
                        <li key={dIdx} className="text-xs text-slate-300 flex items-center gap-2 bg-white/5 p-2 rounded-xl">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Interactive Steps Process Flow */}
                  <div className="space-y-4 pt-2">
                    <h4 className="font-black text-white text-base">خطوات التنفيذ التفاعلية:</h4>

                    <div className="space-y-3">
                      {currentCountry.stepGuides[activeGuideIdx].steps.map((st) => {
                        const isCurrent = activeStepNum === st.stepNum;
                        return (
                          <div
                            key={st.stepNum}
                            onClick={() => setActiveStepNum(st.stepNum)}
                            className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                              isCurrent
                                ? "bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border-indigo-400 shadow-xl"
                                : "bg-black/30 border-white/10 hover:bg-white/5"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center ${
                                  isCurrent ? "bg-indigo-600 text-white shadow-md" : "bg-white/10 text-slate-300"
                                }`}>
                                  {st.stepNum}
                                </span>
                                <h5 className="font-black text-sm text-white">{st.title}</h5>
                              </div>

                              <span className="text-[10px] text-slate-400 font-bold">
                                {isCurrent ? "الخطوة الحالية 📌" : "انقر للتفاصيل"}
                              </span>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed pr-11">
                              {st.description}
                            </p>

                            {st.proTip && (
                              <div className="mr-11 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 text-xs flex items-start gap-2">
                                <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                                <span><strong>نصيحة الخبير:</strong> {st.proTip}</span>
                              </div>
                            )}

                            {st.warning && (
                              <div className="mr-11 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <span><strong>تحذير هائل:</strong> {st.warning}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}
            </motion.div>
          )}

          {/* 4. E-INVOICING SYSTEM SPECS */}
          {activeSubTab === "einvoicing" && (
            <motion.div
              key="einvoicing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1428] border border-white/10 space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-xs font-black text-indigo-400 uppercase tracking-widest block">نظام الفوترة الرقمية والربط الفوري</span>
                    <h3 className="font-black text-white text-xl mt-1">
                      {currentCountry.eInvoicingSystem.systemName}
                    </h3>
                  </div>

                  <span className="text-xs font-black text-emerald-300 bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                    {currentCountry.eInvoicingSystem.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Phase 1 Box */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">1</span>
                      <h4 className="font-black text-white text-sm">المرحلة الأولى: الفوترة وحفظ البيانات</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {currentCountry.eInvoicingSystem.phase1Desc}
                    </p>
                  </div>

                  {/* Phase 2 Box */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-purple-600 text-white font-black text-xs flex items-center justify-center">2</span>
                      <h4 className="font-black text-white text-sm">المرحلة الثانية: الربط والتكامل مع APIs</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {currentCountry.eInvoicingSystem.phase2Desc}
                    </p>
                  </div>

                </div>

                {/* QR Code Rules & Tech Specs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <h4 className="font-black text-amber-300 text-xs flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-amber-400" />
                      <span>قواعد الـ QR Code والبيانات المطلوبة بالحقول:</span>
                    </h4>
                    <ul className="space-y-2">
                      {currentCountry.eInvoicingSystem.qrCodeRules.map((rule, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <h4 className="font-black text-indigo-300 text-xs flex items-center gap-2">
                      <Globe className="w-4 h-4 text-indigo-400" />
                      <span>المواصفات التقنية والصيغ الرقمية المعاييرية:</span>
                    </h4>
                    <ul className="space-y-2">
                      {currentCountry.eInvoicingSystem.technicalSpecs.map((spec, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

              </div>
            </motion.div>
          )}

          {/* 5. LIVE COUNTRY TAX CALCULATOR */}
          {activeSubTab === "calculator" && (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Controls Column */}
              <div className="p-6 rounded-3xl bg-[#0d1428] border border-white/10 space-y-5 lg:col-span-1">
                <div className="flex items-center gap-2 text-white font-black text-base border-b border-white/10 pb-3">
                  <Calculator className="w-5 h-5 text-indigo-400" />
                  <span>مدخلات الحاسبة الضريبية</span>
                </div>

                {/* Select Tax Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-300 block">
                    نوع الضريبة المُراد احتسابها
                  </label>
                  <select
                    value={calcTaxType}
                    onChange={(e) => setCalcTaxType(e.target.value)}
                    className="w-full bg-[#080c1c] border border-white/15 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
                  >
                    <option value="vat">ضريبة القيمة المضافة (VAT)</option>
                    <option value="corporate">ضريبة أرباح الشركات / الدخل</option>
                    {currentCountry.id === "saudi" && <option value="zakat">الزكاة الشرعية للشركات (2.5%)</option>}
                  </select>
                </div>

                {/* Amount Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-300 block">
                    المبلغ الإجمالي / المبيعات الخاضعة ({currentCountry.currencySymbol})
                  </label>
                  <input
                    type="number"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
                  />
                </div>

                {/* Expenses Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-300 block">
                    المشتريات والخصومات المقبولة ({currentCountry.currencySymbol})
                  </label>
                  <input
                    type="number"
                    value={calcExpenses}
                    onChange={(e) => setCalcExpenses(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
                  />
                </div>

                {/* Checkboxes for special rules */}
                {calcTaxType === "vat" && (
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={calcIncludeVat}
                      onChange={(e) => setCalcIncludeVat(e.target.checked)}
                      className="rounded text-indigo-600 accent-indigo-600"
                    />
                    <span>المبلغ شامل الضريبة الضمنية (Inclusive)</span>
                  </label>
                )}

                {currentCountry.id === "uae" && calcTaxType === "corporate" && (
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={calcIncludeThreshold}
                      onChange={(e) => setCalcIncludeThreshold(e.target.checked)}
                      className="rounded text-indigo-600 accent-indigo-600"
                    />
                    <span>تطبيق حد الإعفاء لضريبة الشركات (375,000 درهم)</span>
                  </label>
                )}
              </div>

              {/* Result Breakdown Column */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c132e] to-[#111938] border border-indigo-500/30 lg:col-span-2 space-y-6 flex flex-col justify-between shadow-2xl">
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/20 px-2.5 py-0.5 rounded border border-indigo-500/30">
                        {currentCountry.countryName}
                      </span>
                      <h3 className="font-black text-white text-lg mt-1">{calcResult.taxName}</h3>
                    </div>

                    <div className="text-left">
                      <span className="text-xs text-slate-400 block">الصافي الواجب السداد:</span>
                      <span className="text-2xl font-black text-emerald-400">
                        {calcResult.netPayable.toLocaleString(undefined, { maximumFractionDigits: 2 })} {currentCountry.currencySymbol}
                      </span>
                    </div>
                  </div>

                  {/* Calculation Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-center">
                      <span className="text-[10px] text-slate-400 block font-bold">المبلغ الأساسي</span>
                      <span className="text-sm font-black text-white">{calcResult.baseAmount.toLocaleString()} {currentCountry.currencySymbol}</span>
                    </div>

                    {calcResult.inputTax !== undefined && (
                      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-center">
                        <span className="text-[10px] text-slate-400 block font-bold">ضريبة المدخلات المستردة</span>
                        <span className="text-sm font-black text-pink-400">{calcResult.inputTax.toLocaleString()} {currentCountry.currencySymbol}</span>
                      </div>
                    )}

                    {calcResult.exemptAmount !== undefined && (
                      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-center">
                        <span className="text-[10px] text-slate-400 block font-bold">حد الإعفاء المعفي</span>
                        <span className="text-sm font-black text-amber-400">{calcResult.exemptAmount.toLocaleString()} {currentCountry.currencySymbol}</span>
                      </div>
                    )}

                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-center">
                      <span className="text-[10px] text-slate-400 block font-bold">الضريبة الإجمالية</span>
                      <span className="text-sm font-black text-indigo-300">{calcResult.taxAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} {currentCountry.currencySymbol}</span>
                    </div>
                  </div>

                  {/* Formula Box */}
                  <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-xs text-slate-300 space-y-1">
                    <span className="font-bold text-amber-300 block">معادلة الاحتساب القانونية:</span>
                    <p className="font-mono text-indigo-200">{calcResult.formula}</p>
                  </div>

                  {/* Journal Entry Preview */}
                  <div className="p-4 rounded-2xl bg-black/60 border border-indigo-500/30 text-xs space-y-1">
                    <span className="font-bold text-slate-400 block text-[10px]">توجيه القيد المحاسبي في الدفاتر:</span>
                    <p className="font-mono text-emerald-300 text-[11px]">{calcResult.journalEntry}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-200 text-center">
                  ملاحظة: هذه الحسابات استرشادية مبنية على اللوائح الرسمية، ويجب مطابقتها مع مراجع الحسابات المعتمد.
                </div>

              </div>
            </motion.div>
          )}

          {/* 6. PENALTIES & LEGAL DEADLINES */}
          {activeSubTab === "penalties" && (
            <motion.div
              key="penalties"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-3xl bg-[#0d1428] border border-white/10 space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-6 h-6 text-red-400" />
                  <h3 className="font-black text-white text-lg">جدول المخالفات والغرامات المالية لـ {currentCountry.countryName}</h3>
                </div>
                <p className="text-xs text-slate-400">
                  تفاصيل الجزاءات الإدارية والعقوبات الصارمة المقررة لمنع التخلف أو التهرب الضريبي طبقاً للائحة الرسمية.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 font-black">
                        <th className="py-3 px-4">نوع المخالفة الضريبية</th>
                        <th className="py-3 px-4">مبلغ أو نسبة الغرامة</th>
                        <th className="py-3 px-4">درجة الخطورة</th>
                        <th className="py-3 px-4">المستند / السند القانوني</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {currentCountry.penalties.map((pen, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 font-black text-white max-w-xs">{pen.violation}</td>
                          <td className="py-4 px-4 font-bold text-amber-300">{pen.fineAmount}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border ${
                              pen.severity === "critical"
                                ? "bg-red-500/20 text-red-300 border-red-500/40"
                                : pen.severity === "high"
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                : "bg-blue-500/20 text-blue-300 border-blue-500/40"
                            }`}>
                              {pen.severity === "critical" ? "حرجة جداً 🚨" : pen.severity === "high" ? "عالية ⚠️" : "متوسطة ℹ️"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-400 text-[11px]">{pen.legalBasis}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* 7. FAQS & AUDIT ADVICE */}
          {activeSubTab === "faqs" && (
            <motion.div
              key="faqs"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <h3 className="font-black text-white text-base flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-400" />
                <span>الأسئلة الأكثر تكراراً والتحذيرات الضريبية:</span>
              </h3>

              <div className="space-y-3">
                {currentCountry.faqs.map((faq, fIdx) => {
                  const isOpen = expandedFaqIdx === fIdx;
                  return (
                    <div
                      key={fIdx}
                      className="rounded-2xl bg-[#0d1428] border border-white/10 overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFaqIdx(isOpen ? null : fIdx)}
                        className="w-full p-4 text-right flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                      >
                        <span className="font-black text-xs sm:text-sm text-white flex items-center gap-2">
                          <span className="text-indigo-400 font-mono">س:</span>
                          <span>{faq.q}</span>
                        </span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </button>

                      {isOpen && (
                        <div className="p-4 pt-0 border-t border-white/5 text-xs text-slate-300 leading-relaxed font-medium bg-black/20">
                          <strong className="text-emerald-400 block mb-1">الإجابة والعمل بالنص التنفيذي:</strong>
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

    </div>
  );
}
