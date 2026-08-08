import React, { useState, useMemo } from "react";
import { speakText, stopSpeaking } from "../utils/textToSpeech";
import {
  Search,
  BookOpen,
  Volume2,
  Copy,
  Check,
  Bookmark,
  Sparkles,
  Filter,
  ArrowUpDown,
  Tag,
  Scale,
  Zap,
  RotateCcw,
  Languages,
  HelpCircle,
  ChevronDown,
  Info,
  ExternalLink,
  Layers,
  CheckCircle2
} from "lucide-react";

export interface AccountantTerm {
  id: string;
  ar: string;
  en: string;
  abbr?: string;
  category: string;
  classification: "أصول" | "خصوم" | "حقوق ملكية" | "إيرادات" | "مصروفات" | "معايير وتقارير" | "تحليل وإدارة";
  nature?: "مدين (Debit)" | "دائن (Credit)" | "تجميعي / محايد";
  simplifiedExplanation: string;
  practicalExample: string;
  journalExample?: string;
  ifrsRef?: string;
}

export const ACCOUNTING_DICTIONARY_DATA: AccountantTerm[] = [
  // 1. BASICS & ASSETS
  {
    id: "term-1",
    ar: "الأصول",
    en: "Assets",
    abbr: "ASST",
    category: "📊 الأساسيات والمبادئ",
    classification: "أصول",
    nature: "مدين (Debit)",
    simplifiedExplanation: "جميع الموارد الاقتصادية التي تمتلكها الشركة وتتوقع منها تحقيق منافع مالية مستقبلاً (مثل النقدية، المباني، والسيارات).",
    practicalExample: "شراء مبنى جديد بقيمة 1,000,000 ج.م لاستخدامه كمقر إداري يعتبر إضافة لأصول الشركة الثابتة.",
    journalExample: "من حـ/ الأصول الثابتة (المباني) إلى حـ/ النقدية",
    ifrsRef: "IAS 1 / Framework"
  },
  {
    id: "term-2",
    ar: "الأصول المتداولة",
    en: "Current Assets",
    abbr: "CA",
    category: "📊 الأساسيات والمبادئ",
    classification: "أصول",
    nature: "مدين (Debit)",
    simplifiedExplanation: "الأصول التي يمكن تحويلها إلى كاش أو استهلاكها خلال سنة مالية واحدة أو دورة تشغيلية أيهما أطول.",
    practicalExample: "النقود بالبنك، مخزون البضائع المتاحة للبيع، وحسابات العملاء الآجلة.",
    journalExample: "من حـ/ العملاء إلى حـ/ المبيعات (بيع بالآجل)"
  },
  {
    id: "term-3",
    ar: "الأصول غير المتداولة (الثابتة)",
    en: "Non-Current / Fixed Assets",
    abbr: "PPE",
    category: "📊 الأساسيات والمبادئ",
    classification: "أصول",
    nature: "مدين (Debit)",
    simplifiedExplanation: "ممتلكات آلات ومباني تُشترى للاستخدام الإنتاجي طويل الأجل وليس لإعادة بيعها فوراً.",
    practicalExample: "شراء خط إنتاج بمصنع يعمل لمدة 10 سنوات قادمة.",
    journalExample: "من حـ/ الآلات والمعدات إلى حـ/ الموردين",
    ifrsRef: "IAS 16"
  },
  {
    id: "term-4",
    ar: "الأصول غير الملموسة",
    en: "Intangible Assets",
    abbr: "IA",
    category: "📊 الأساسيات والمبادئ",
    classification: "أصول",
    nature: "مدين (Debit)",
    simplifiedExplanation: "أصول مالية ليس لها كيان مادي ملموس ولكنها تمنح الشركة قيمة تنافسية وحقوقاً قانونية.",
    practicalExample: "شهرة المحل التجارية (Goodwill)، العلامات التجارية، وحقوق برمجيات ERP.",
    journalExample: "من حـ/ الأصول غير الملموسة (برامج كمبيوتر) إلى حـ/ البنك",
    ifrsRef: "IAS 38"
  },

  // 2. LIABILITIES & EQUITY
  {
    id: "term-5",
    ar: "الخصوم (الالتزامات)",
    en: "Liabilities",
    abbr: "LIAB",
    category: "📊 الأساسيات والمبادئ",
    classification: "خصوم",
    nature: "دائن (Credit)",
    simplifiedExplanation: "الديون والالتزامات المستحقة على الشركة لصالح أطراف خارجية جراء معاملات سابقة.",
    practicalExample: "قرض بنكي مستحق السداد خلال 3 سنوات أو فواتير موردي البضائع.",
    journalExample: "من حـ/ المشتريات إلى حـ/ الموردين",
    ifrsRef: "IAS 1"
  },
  {
    id: "term-6",
    ar: "الخصوم المتداولة",
    en: "Current Liabilities",
    abbr: "CL",
    category: "📊 الأساسيات والمبادئ",
    classification: "خصوم",
    nature: "دائن (Credit)",
    simplifiedExplanation: "التزامات مالية واجبة السداد خلال فترة قصيرة أقل من 12 شهراً.",
    practicalExample: "حسابات الموردين (Accounts Payable)، والأجور المستحقة للعاملين نهاية الشهر.",
    journalExample: "من حـ/ مصروف الأجور إلى حـ/ الأجور المستحقة"
  },
  {
    id: "term-7",
    ar: "حقوق الملكية",
    en: "Owner's Equity",
    abbr: "EQ",
    category: "📊 الأساسيات والمبادئ",
    classification: "حقوق ملكية",
    nature: "دائن (Credit)",
    simplifiedExplanation: "صافي قيمة الشركة المتبقية للمالكين بعد طرح جميع الخصوم من إجمالي الأصول.",
    practicalExample: "رأس المال المدفوع بالإضافة إلى الأرباح المحتجزة من الأعوام السابقة.",
    journalExample: "المعادلة: حقوق الملكية = الأصول - الخصوم"
  },

  // 3. REVENUE & EXPENSES
  {
    id: "term-8",
    ar: "الإيرادات",
    en: "Revenue / Sales",
    abbr: "REV",
    category: "📊 الأساسيات والمبادئ",
    classification: "إيرادات",
    nature: "دائن (Credit)",
    simplifiedExplanation: "الأموال والمكاسب المتدفقة للشركة جراء بيع المنتجات أو تقديم الخدمات للعملاء.",
    practicalExample: "تحصيل قيمة بيع بضاعة نقداً بقيمة 50,000 ج.م.",
    journalExample: "من حـ/ النقدية بالبنك إلى حـ/ إيراد المبيعات",
    ifrsRef: "IFRS 15"
  },
  {
    id: "term-9",
    ar: "المصروفات",
    en: "Expenses",
    abbr: "EXP",
    category: "📊 الأساسيات والمبادئ",
    classification: "مصروفات",
    nature: "مدين (Debit)",
    simplifiedExplanation: "التكاليف المستنفدة والمسددة خلال الفترة لتسيير الأعمال وتحقيق الإيرادات.",
    practicalExample: "دفع ايجار المكتب، إيجار المخازن، وفواتير الكهرباء والدعاية.",
    journalExample: "من حـ/ مصروف الإيجار إلى حـ/ الخزينة"
  },
  {
    id: "term-10",
    ar: "القيد المزدوج",
    en: "Double-Entry Bookkeeping",
    abbr: "DEB",
    category: "📊 الأساسيات والمبادئ",
    classification: "معايير وتقارير",
    nature: "تجميعي / محايد",
    simplifiedExplanation: "نظام محاسبي ينص على أن كل عملية مالية لها طرفان متساويان بالقيمة: طرف مدين (آخذ) وطرف دائن (معطي).",
    practicalExample: "عند دفع 5000 ج.م نقداً لشراء أثاث، يزيد الأثاث (مدين) وتقل النقدية (دائن).",
    journalExample: "من حـ/ الأثاث (مدين) إلى حـ/ الخزينة (دائن)"
  },

  // 4. FINANCIAL STATEMENTS & IFRS
  {
    id: "term-11",
    ar: "الميزانية العمومية",
    en: "Balance Sheet",
    abbr: "BS",
    category: "⚖️ القوائم والتقارير المالية",
    classification: "معايير وتقارير",
    nature: "تجميعي / محايد",
    simplifiedExplanation: "تقرير مالي يوضح المركز المالي للشركة في لحظة زمنية معينة، ويعرض الأصول، الخصوم، وحقوق الملكية.",
    practicalExample: "تقرير المركز المالي للشركة في 31 ديسمبر 2025.",
    ifrsRef: "IAS 1"
  },
  {
    id: "term-12",
    ar: "قائمة الدخل",
    en: "Income Statement / P&L",
    abbr: "P&L",
    category: "⚖️ القوائم والتقارير المالية",
    classification: "معايير وتقارير",
    nature: "تجميعي / محايد",
    simplifiedExplanation: "قائمة مالية تلخص الإيرادات والمصروفات خلال فترة معينة لإظهار صافي الربح أو الخسارة.",
    practicalExample: "قائمة الدخل عن السنة المالية المنتهية في 2025.",
    ifrsRef: "IAS 1"
  },
  {
    id: "term-13",
    ar: "قائمة التدفقات النقدية",
    en: "Statement of Cash Flows",
    abbr: "CFS",
    category: "⚖️ القوائم والتقارير المالية",
    classification: "معايير وتقارير",
    nature: "تجميعي / محايد",
    simplifiedExplanation: "تقرير يفصل حركة النقدية الداخلة والخارجة عبر ثلاثة أنشطة: تشغيلية، استثمارية، وتمويلية.",
    practicalExample: "تتبع زيادة أو نقص السيولة النقدية الفعلية خلال العام.",
    ifrsRef: "IAS 7"
  },
  {
    id: "term-14",
    ar: "تعديلات التسوية الجردية",
    en: "Adjusting Journal Entries",
    abbr: "AJE",
    category: "⚖️ القوائم والتقارير المالية",
    classification: "معايير وتقارير",
    nature: "تجميعي / محايد",
    simplifiedExplanation: "قيود تُجرى في نهاية الفترة المالية لتطبيق مبدأ الاستحقاق وتسجيل المصروفات والإيرادات المستحقة أو المقدمة.",
    practicalExample: "تسجيل مصروف الإيجار المستحق عن شهر ديسمبر الذي لم يُسدد بعد.",
    journalExample: "من حـ/ مصروف الإيجار إلى حـ/ الإيجار المستحق"
  },
  {
    id: "term-15",
    ar: "الإهلاك / الاستهلاك",
    en: "Depreciation",
    abbr: "DEP",
    category: "⚖️ القوائم والتقارير المالية",
    classification: "مصروفات",
    nature: "مدين (Debit)",
    simplifiedExplanation: "التوزيع المنتظم لتكلفة الأصل الثابت على مدار عمره الإنتاجي المتوقع.",
    practicalExample: "إهلاك آلة تككلفتها 100,000 ج.م على مدى 10 سنوات بمعدل 10,000 ج.م سنوياً.",
    journalExample: "من حـ/ مصروف الإهلاك إلى حـ/ مجمع الإهلاك",
    ifrsRef: "IAS 16"
  },

  // 5. ANALYSIS & RATIOS
  {
    id: "term-16",
    ar: "تكلفة البضاعة المباعة",
    en: "Cost of Goods Sold",
    abbr: "COGS",
    category: "💵 التحليل المالي والتكاليف",
    classification: "مصروفات",
    nature: "مدين (Debit)",
    simplifiedExplanation: "التكاليف المباشرة لشراء أو تصنيع المنتجات المباعة خلال الفترة المالية.",
    practicalExample: "مخزون أول الفترة + المشتريات - مخزون آخر الفترة.",
    journalExample: "من حـ/ تكلفة المبيعات إلى حـ/ المخزون"
  },
  {
    id: "term-17",
    ar: "مجمل الربح",
    en: "Gross Profit",
    abbr: "GP",
    category: "💵 التحليل المالي والتكاليف",
    classification: "إيرادات",
    nature: "دائن (Credit)",
    simplifiedExplanation: "الربح المتبقي بعد خصم تكلفة البضاعة المباعة المباشرة من إجمالي الإيرادات.",
    practicalExample: "مبيعات بـ 500,000 - تكلفة مبيعات بـ 300,000 = مجمل ربح 200,000 ج.م."
  },
  {
    id: "term-18",
    ar: "الربح قبل الفوائد والضرائب",
    en: "Earnings Before Interest & Taxes",
    abbr: "EBIT",
    category: "💵 التحليل المالي والتكاليف",
    classification: "تحليل وإدارة",
    nature: "تجميعي / محايد",
    simplifiedExplanation: "مقياس للربحية التشغيلية الصافية للشركة قبل اقتطاع تكاليف التمويل والضرائب.",
    practicalExample: "مجمل الربح - المصروفات التشغيلية والعمومية."
  },
  {
    id: "term-19",
    ar: "نسبة السيولة السريعة",
    en: "Quick Ratio / Acid-Test",
    abbr: "QR",
    category: "💵 التحليل المالي والتكاليف",
    classification: "تحليل وإدارة",
    nature: "تجميعي / محايد",
    simplifiedExplanation: "مقياس لقدرة الشركة على سداد ديونها القريبة فوراً باستبعاد المخزون الصعب تحويله سريعاً.",
    practicalExample: "(الأصول المتداولة - المخزون) ÷ الخصوم المتداولة."
  },
  {
    id: "term-20",
    ar: "نقطة التعادل",
    en: "Break-Even Point",
    abbr: "BEP",
    category: "💵 التحليل المالي والتكاليف",
    classification: "تحليل وإدارة",
    nature: "تجميعي / محايد",
    simplifiedExplanation: "حجم المبيعات الذي تتساوى عنده الإيرادات الكلية مع التكاليف الكلية دون ربح أو خسارة.",
    practicalExample: "التكاليف الثابتة ÷ هامش المساهمة للوحدة."
  },

  // 6. TAX, AUDIT & ERP
  {
    id: "term-21",
    ar: "ضريبة القيمة المضافة",
    en: "Value Added Tax",
    abbr: "VAT",
    category: "🧾 الضرائب والتدقيق",
    classification: "خصوم",
    nature: "دائن (Credit)",
    simplifiedExplanation: "ضريبة غير مباشرة تفرض على استهلاك السلع والخدمات في كل مرحلة من مراحل سلاسل التوريد.",
    practicalExample: "تحصيل 14% ضريبة مضافة عند بيع الفواتير وتوريد الصافي للهيئة.",
    journalExample: "من حـ/ العملاء إلى مذكورين (حـ/ المبيعات + حـ/ ضريبة المخرجات)"
  },
  {
    id: "term-22",
    ar: "شجرة الحسابات",
    en: "Chart of Accounts",
    abbr: "COA",
    category: "💻 الأنظمة المحاسبية",
    classification: "معايير وتقارير",
    nature: "تجميعي / محايد",
    simplifiedExplanation: "دليل رقمي وهيكلي منظم لجميع الحسابات المالية بالشركة مقسمة حسب الأصول والخصوم والملكية والدخل.",
    practicalExample: "تكويد الأصول المتداولة برقم 11000 والنقدية برقم 11100."
  },
  {
    id: "term-23",
    ar: "ميزان المراجعة",
    en: "Trial Balance",
    abbr: "TB",
    category: "⚖️ القوائم والتقارير المالية",
    classification: "معايير وتقارير",
    nature: "تجميعي / محايد",
    simplifiedExplanation: "جدول يتضمن جميع أرصدة دفتر الأستاذ التأكد من توازن إجمالي المدين مع إجمالي الدائن قبل إعداد القوائم.",
    practicalExample: "التحقق من معادلة: إجمالي الأرصدة المدينة = إجمالي الأرصدة الدائنة."
  },
  {
    id: "term-24",
    ar: "مبدأ الاستحقاق",
    en: "Accrual Basis Accounting",
    abbr: "ACC",
    category: "📊 الأساسيات والمبادئ",
    classification: "معايير وتقارير",
    nature: "تجميعي / محايد",
    simplifiedExplanation: "الاعتراف بالإيرادات والمصروفات فور حدوثها واستحقاقها بغض النظر عن تاريخ الدفع أو التحصيل النقدي.",
    practicalExample: "تسجيل مبيعات بضاعة تم تسليمها اليوم حتى لو كان التحصيل الشهر القادم.",
    ifrsRef: "IAS 1"
  },
  {
    id: "term-25",
    ar: "الأرباح المبقاة (المدورة)",
    en: "Retained Earnings",
    abbr: "RE",
    category: "📊 الأساسيات والمبادئ",
    classification: "حقوق ملكية",
    nature: "دائن (Credit)",
    simplifiedExplanation: "تراكم صافي أرباح السنوات السابقة التي لم توزع على الشركاء وتم إعادة استثمارها بالشركة.",
    practicalExample: "تحويل 100,000 ج.م من أرباح العام لحساب الأرباح التراكمية للتوسع.",
    journalExample: "من حـ/ ملخص الدخل إلى حـ/ الأرباح المبقاة"
  }
];

export function SmartAccountantDictionary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedClassification, setSelectedClassification] = useState("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("meezan_dictionary_bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeModalTerm, setActiveModalTerm] = useState<AccountantTerm | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Filter Categories list
  const categories = useMemo(() => {
    const set = new Set(ACCOUNTING_DICTIONARY_DATA.map((t) => t.category));
    return Array.from(set);
  }, []);

  const classifications = ["أصول", "خصوم", "حقوق ملكية", "إيرادات", "مصروفات", "معايير وتقارير", "تحليل وإدارة"];

  // Toggle bookmark
  const toggleBookmark = (id: string) => {
    let updated: string[];
    if (bookmarks.includes(id)) {
      updated = bookmarks.filter((b) => b !== id);
    } else {
      updated = [...bookmarks, id];
    }
    setBookmarks(updated);
    try {
      localStorage.setItem("meezan_dictionary_bookmarks", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Copy helper
  const handleCopy = (term: AccountantTerm) => {
    const text = `📖 مصطلح محاسبي: ${term.ar} (${term.en})\n🏷️ التصنيف: ${term.classification} | الطبيعة: ${term.nature || "عام"}\n💡 الشرح المبسط: ${term.simplifiedExplanation}\n📌 مثال تطبيقي: ${term.practicalExample}`;
    navigator.clipboard.writeText(text);
    setCopiedId(term.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Text-To-Speech pronunciation helper
  const handleSpeak = (text: string, lang: "ar" | "en", id: string) => {
    setSpeakingId(id);
    speakText(
      text,
      lang,
      () => setSpeakingId(id),
      () => setSpeakingId(null),
      () => setSpeakingId(null)
    );
  };

  // Filtered terms
  const filteredTerms = useMemo(() => {
    return ACCOUNTING_DICTIONARY_DATA.filter((term) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        term.ar.toLowerCase().includes(q) ||
        term.en.toLowerCase().includes(q) ||
        (term.abbr && term.abbr.toLowerCase().includes(q)) ||
        term.simplifiedExplanation.toLowerCase().includes(q) ||
        term.practicalExample.toLowerCase().includes(q);

      const matchesCategory = selectedCategory === "ALL" || term.category === selectedCategory;
      const matchesClassification = selectedClassification === "ALL" || term.classification === selectedClassification;

      return matchesSearch && matchesCategory && matchesClassification;
    });
  }, [searchTerm, selectedCategory, selectedClassification]);

  return (
    <div className="space-y-6 text-right dir-rtl animate-fadeIn">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER BANNER
         ───────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1329] via-[#0b1226] to-[#080d1e] border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black shadow-lg">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>مرجع المصطلحات المحاسبية والمالية المزدوج ثنائي اللغة</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <span>📖 قاموس المحاسب الذكي</span>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-bold">
                عربي - English ⇄
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              ابحث فوراً عن أي مصطلح محاسبي باللغتين العربية والإنجليزية، واستكشف الشرح المبسط، طبيعة الحساب (مدين/دائن)، الأمثلة العملية، ومرجع معايير IFRS.
            </p>
          </div>

          {/* Dictionary Summary Chips */}
          <div className="flex items-center gap-3 shrink-0 bg-black/40 p-3.5 rounded-2xl border border-white/10 text-xs font-bold">
            <div className="text-center px-3 border-l border-white/10">
              <span className="text-slate-400 block text-[10px]">إجمالي المصطلحات</span>
              <span className="text-emerald-400 font-black text-base">{ACCOUNTING_DICTIONARY_DATA.length}</span>
            </div>
            <div className="text-center px-3 border-l border-white/10">
              <span className="text-slate-400 block text-[10px]">النتائج الحالية</span>
              <span className="text-indigo-300 font-black text-base">{filteredTerms.length}</span>
            </div>
            <div className="text-center px-3">
              <span className="text-slate-400 block text-[10px]">المفضلة ⭐</span>
              <span className="text-amber-300 font-black text-base">{bookmarks.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. INSTANT SEARCH BAR & FILTERS
         ───────────────────────────────────────────────────────────── */}
      <div className="p-5 rounded-3xl bg-[#090e1f] border border-white/10 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-indigo-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث بالاسم العربي، الإنجليزي، الاختصار (مثال: IFRS, COGS, الأصول)..."
              className="w-full bg-black/50 border border-white/15 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 rounded-2xl py-3.5 pr-12 pl-10 text-sm text-white placeholder:text-slate-400 outline-none transition-all font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5 cursor-pointer text-xs"
              >
                مسح ✖
              </button>
            )}
          </div>

          {/* Reset Filters */}
          {(searchTerm || selectedCategory !== "ALL" || selectedClassification !== "ALL") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("ALL");
                setSelectedClassification("ALL");
              }}
              className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>إعادة ضبط</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="text-slate-400 flex items-center gap-1 pl-1">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              <span>المحور:</span>
            </span>
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`px-3 py-1.5 rounded-xl border cursor-pointer transition-all ${
                selectedCategory === "ALL"
                  ? "bg-indigo-600 text-white border-indigo-400 shadow-md"
                  : "bg-white/5 text-slate-400 border-white/5 hover:text-white"
              }`}
            >
              جميع المحاور
            </button>

            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl border cursor-pointer transition-all ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white border-indigo-400 shadow-md"
                    : "bg-white/5 text-slate-400 border-white/5 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Classification Type Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="text-slate-400 flex items-center gap-1 pl-1">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>نوع الحساب:</span>
            </span>
            <button
              onClick={() => setSelectedClassification("ALL")}
              className={`px-3 py-1.5 rounded-xl border cursor-pointer transition-all ${
                selectedClassification === "ALL"
                  ? "bg-emerald-600 text-white border-emerald-400 shadow-md"
                  : "bg-white/5 text-slate-400 border-white/5 hover:text-white"
              }`}
            >
              الكل
            </button>

            {classifications.map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClassification(cls)}
                className={`px-3 py-1.5 rounded-xl border cursor-pointer transition-all ${
                  selectedClassification === cls
                    ? "bg-emerald-600 text-white border-emerald-400 shadow-md"
                    : "bg-white/5 text-slate-400 border-white/5 hover:text-white"
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. DICTIONARY TERMS CARDS GRID
         ───────────────────────────────────────────────────────────── */}
      {filteredTerms.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#090e1f] border border-white/10 space-y-3">
          <Info className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-lg font-black text-white">لم يتم العثور على مصطلحات تطابق بحثك</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            تأكد من كتابة الكلمة بشكل صحيح، أو اضغط على إعادة ضبط البحث لاستعراض جميع مصطلحات القاموس المحاسبي.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("ALL");
              setSelectedClassification("ALL");
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all cursor-pointer mt-2"
          >
            عرض كافة المصطلحات
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTerms.map((term) => {
            const isBookmarked = bookmarks.includes(term.id);
            const isSpeaking = speakingId === term.id;

            return (
              <div
                key={term.id}
                className={`p-5 rounded-3xl border transition-all space-y-4 flex flex-col justify-between relative overflow-hidden group ${
                  isBookmarked
                    ? "bg-[#0f172a] border-amber-500/40 shadow-xl shadow-amber-500/5"
                    : "bg-[#0b1022] border-white/10 hover:border-indigo-500/40 hover:bg-[#0e162d]"
                }`}
              >
                <div className="space-y-3">
                  {/* Top Header: Category Tag & Actions */}
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-[10px] font-black truncate">
                      {term.category}
                    </span>

                    <div className="flex items-center gap-1 shrink-0">
                      {/* Audio Speech */}
                      <button
                        onClick={() => handleSpeak(term.en, "en", term.id)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isSpeaking
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-400 animate-pulse"
                            : "bg-white/5 text-slate-400 hover:text-white border-white/5"
                        }`}
                        title="نطق المصطلح بالإنجليزي"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Bookmark */}
                      <button
                        onClick={() => toggleBookmark(term.id)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isBookmarked
                            ? "bg-amber-500/20 text-amber-300 border-amber-400/50"
                            : "bg-white/5 text-slate-400 hover:text-amber-300 border-white/5"
                        }`}
                        title="حفظ بالمفضلة"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-amber-400" : ""}`} />
                      </button>

                      {/* Copy */}
                      <button
                        onClick={() => handleCopy(term)}
                        className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white border border-white/5 cursor-pointer transition-all"
                        title="نسخ الشرح"
                      >
                        {copiedId === term.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Main Term Titles */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                        {term.ar}
                      </h3>
                      {term.abbr && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-black">
                          {term.abbr}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-extrabold text-indigo-300 dir-ltr text-right">
                      {term.en}
                    </div>
                  </div>

                  {/* Classification & Balance Nature */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-bold">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-white/10">
                      🏷️ {term.classification}
                    </span>
                    {term.nature && (
                      <span
                        className={`px-2 py-0.5 rounded-md border ${
                          term.nature.includes("مدين")
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                            : term.nature.includes("دائن")
                            ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                            : "bg-slate-800 text-slate-300 border-white/10"
                        }`}
                      >
                        ⚖️ {term.nature}
                      </span>
                    )}
                    {term.ifrsRef && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30 font-extrabold">
                        🌐 {term.ifrsRef}
                      </span>
                    )}
                  </div>

                  {/* Simplified Explanation Box */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1 text-xs text-slate-300 leading-relaxed font-medium">
                    <div className="text-[10px] font-black text-emerald-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>الشرح المبسط:</span>
                    </div>
                    <p>{term.simplifiedExplanation}</p>
                  </div>
                </div>

                {/* Footer Action: View Full Details Modal */}
                <button
                  onClick={() => setActiveModalTerm(term)}
                  className="w-full mt-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-black text-slate-200 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>عرض القيد والأمثلة العملية</span>
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. TERM DETAILS MODAL
         ───────────────────────────────────────────────────────────── */}
      {activeModalTerm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0c1226] border border-indigo-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-right dir-rtl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[11px] font-black text-emerald-400 block">{activeModalTerm.category}</span>
                <h3 className="text-xl font-black text-white">{activeModalTerm.ar}</h3>
                <span className="text-xs font-bold text-indigo-300 dir-ltr block text-right">{activeModalTerm.en}</span>
              </div>

              <button
                onClick={() => setActiveModalTerm(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 cursor-pointer font-bold text-xs"
              >
                إغلاق ✖
              </button>
            </div>

            {/* Content Details */}
            <div className="space-y-4 text-xs font-medium text-slate-200">
              {/* Properties */}
              <div className="grid grid-cols-2 gap-2 text-center font-bold">
                <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                  <span className="text-[10px] text-slate-400 block">تصنيف الحساب</span>
                  <span className="text-amber-300 text-sm">{activeModalTerm.classification}</span>
                </div>
                <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                  <span className="text-[10px] text-slate-400 block">طبيعة الرصيد</span>
                  <span className="text-emerald-400 text-sm">{activeModalTerm.nature || "غير محدد"}</span>
                </div>
              </div>

              {/* Simplified Explanation */}
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-1">
                <h4 className="font-black text-indigo-300 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>المفهوم المحاسبي المبسط:</span>
                </h4>
                <p className="text-slate-200 leading-relaxed">{activeModalTerm.simplifiedExplanation}</p>
              </div>

              {/* Practical Example */}
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1">
                <h4 className="font-black text-amber-300 text-xs flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-400" />
                  <span>مثال تطبيقي واقعي:</span>
                </h4>
                <p className="text-slate-300 leading-relaxed">{activeModalTerm.practicalExample}</p>
              </div>

              {/* Journal Entry Example if available */}
              {activeModalTerm.journalExample && (
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                  <h4 className="font-black text-emerald-300 text-xs flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-emerald-400" />
                    <span>صياغة القيد المحاسبي النموذجي:</span>
                  </h4>
                  <div className="p-2.5 rounded-xl bg-black/60 font-mono text-emerald-200 text-xs dir-rtl border border-emerald-500/20">
                    {activeModalTerm.journalExample}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleCopy(activeModalTerm)}
                className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                <span>نسخ التفاصيل بالكامل</span>
              </button>

              <button
                onClick={() => setActiveModalTerm(null)}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs cursor-pointer"
              >
                تم
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
