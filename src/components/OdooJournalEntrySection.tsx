import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { playSound } from "../utils/soundEffects";
import {
  Building2,
  Check,
  Plus,
  Trash2,
  Sparkles,
  Zap,
  BookOpen,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  Printer,
  RotateCcw,
  Scale,
  List,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  History,
  Send,
  HelpCircle,
  Eye,
  Copy,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
  Download,
  Share2,
  Save,
  Loader2,
  Volume2,
  VolumeX,
  X,
  RefreshCw,
  Calendar,
  Grid,
  Bot,
  User,
  Settings,
  MoreVertical,
  Landmark,
  TrendingUp,
  DollarSign
} from "lucide-react";

export interface OdooJournalItem {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: "Asset" | "Liability" | "Equity" | "Revenue" | "Expense";
  partner: string;
  label: string;
  analyticAccount: string;
  tax: string;
  debit: number;
  credit: number;
}

export interface OdooEntryRecord {
  id: string;
  name: string; // e.g. MISC/2026/08/0001
  date: string;
  journal: string;
  partner: string;
  ref: string;
  status: "draft" | "posted" | "cancelled";
  totalDebit: number;
  totalCredit: number;
  items: OdooJournalItem[];
  explanation?: string;
}

interface OdooJournalEntrySectionProps {
  onAwardXp?: (amount: number, title: string, message: string) => void;
}

export interface OdooAccount {
  code: string;
  name: string;
  type: "Asset" | "Liability" | "Equity" | "Revenue" | "Expense";
  category: string;
  openingBalance?: number;
  isCustom?: boolean;
}

// Chart of Accounts for Odoo
const ODOO_ACCOUNTS: OdooAccount[] = [
  { code: "101000", name: "101000 البنك - الحساب الجاري الرئيسية", type: "Asset", category: "أصول متداولة", openingBalance: 150000 },
  { code: "102000", name: "102000 الصندوق / الخزينة الرئيسية", type: "Asset", category: "أصول متداولة", openingBalance: 45000 },
  { code: "110000", name: "110000 حسابات العملاء (Accounts Receivable)", type: "Asset", category: "أصول متداولة", openingBalance: 85000 },
  { code: "120000", name: "120000 مخزون البضائع (Inventory)", type: "Asset", category: "أصول متداولة", openingBalance: 120000 },
  { code: "150000", name: "150000 الأصول الثابتة - الآلات والمعدات", type: "Asset", category: "أصول غير متداولة", openingBalance: 350000 },
  { code: "151000", name: "151000 الأصول الثابتة - أجهزة كمبيوتر وتكنولوجيا", type: "Asset", category: "أصول غير متداولة", openingBalance: 95000 },
  { code: "210000", name: "210000 حسابات الموردين (Accounts Payable)", type: "Liability", category: "خصوم متداولة", openingBalance: 65000 },
  { code: "220000", name: "220000 مصلحة الضرائب - ضريبة القيمة المضافة 14%", type: "Liability", category: "خصوم متداولة", openingBalance: 14000 },
  { code: "230000", name: "230000 مستحقات التأمينات الاجتماعية والرواتب", type: "Liability", category: "خصوم متداولة", openingBalance: 25000 },
  { code: "300000", name: "300000 رأس المال المدفوع", type: "Equity", category: "حقوق ملكية", openingBalance: 700000 },
  { code: "400000", name: "400000 إيرادات المبيعات (Sales Revenue)", type: "Revenue", category: "إيرادات", openingBalance: 0 },
  { code: "410000", name: "410000 إيرادات خدمات واستشارات", type: "Revenue", category: "إيرادات", openingBalance: 0 },
  { code: "500000", name: "500000 تكلفة البضاعة المباعة (COGS)", type: "Expense", category: "مصروفات", openingBalance: 0 },
  { code: "510000", name: "510000 مصروف الإيجار - المقر الرئيسي", type: "Expense", category: "مصروفات", openingBalance: 0 },
  { code: "520000", name: "520000 مصروف أجور ورواتب الموظفين", type: "Expense", category: "مصروفات", openingBalance: 0 },
  { code: "530000", name: "530000 مصروفات تسويق وإعلانات", type: "Expense", category: "مصروفات", openingBalance: 0 },
  { code: "540000", name: "540000 خصم نقدي مسموح به (تعجيل دفع)", type: "Expense", category: "مصروفات", openingBalance: 0 },
];

interface AccountAutocompleteProps {
  value: string;
  onChange: (accountCode: string) => void;
  disabled?: boolean;
  accounts?: OdooAccount[];
}

function AccountAutocompleteInput({ value, onChange, disabled, accounts }: AccountAutocompleteProps) {
  const accountListToUse = accounts && accounts.length > 0 ? accounts : ODOO_ACCOUNTS;
  const selectedAccount = accountListToUse.find((a) => a.code === value);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (selectedAccount) {
      setQuery(selectedAccount.name);
    } else {
      setQuery(value || "");
    }
  }, [value, selectedAccount]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        if (selectedAccount) {
          setQuery(selectedAccount.name);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedAccount]);

  const filteredAccounts = accountListToUse.filter(
    (acc) =>
      acc.code.includes(query.trim()) ||
      acc.name.toLowerCase().includes(query.toLowerCase().trim()) ||
      acc.category.toLowerCase().includes(query.toLowerCase().trim())
  );

  const handleSelect = (code: string) => {
    const acc = accountListToUse.find((a) => a.code === code);
    if (acc) {
      setQuery(acc.name);
      onChange(code);
    }
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (!disabled) setIsOpen(true);
          }}
          disabled={disabled}
          placeholder="ابحث بالرمز أو الاسم..."
          className="w-full bg-[#120b1a] border border-white/10 rounded-lg pr-2.5 pl-7 py-1.5 text-xs text-white font-bold outline-none focus:border-purple-400 focus:bg-[#180f25] placeholder:text-slate-500 placeholder:font-normal transition-all"
        />
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none transition-transform ${isOpen ? "rotate-180 text-purple-300" : ""}`} />
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 right-0 w-72 sm:w-80 max-h-64 overflow-y-auto bg-[#180f26] border border-purple-500/40 rounded-xl shadow-2xl p-1.5 space-y-1 backdrop-blur-xl animate-fadeIn">
          <div className="px-2 py-1 text-[10px] text-purple-300 font-bold border-b border-white/10 flex justify-between items-center">
            <span>دليل الحسابات - Odoo COA</span>
            <span className="text-slate-400 font-mono">{filteredAccounts.length} نتيجة</span>
          </div>

          {filteredAccounts.length === 0 ? (
            <div className="p-3 text-center text-xs text-slate-400 font-bold">
              لا توجد نتائج مطابقة لـ "{query}"
            </div>
          ) : (
            filteredAccounts.map((acc) => {
              const isSelected = acc.code === value;
              return (
                <button
                  key={acc.code}
                  type="button"
                  onClick={() => handleSelect(acc.code)}
                  className={`w-full text-right px-2.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? "bg-purple-600/30 text-purple-200 border border-purple-400/40"
                      : "hover:bg-purple-500/15 text-slate-200 border border-transparent"
                  }`}
                >
                  <div className="flex flex-col gap-0.5 truncate text-right">
                    <span className="truncate text-white font-black">{acc.name}</span>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span className="text-purple-300 font-mono bg-purple-500/20 px-1.5 py-0.2 rounded border border-purple-400/20">
                        {acc.code}
                      </span>
                      <span className="text-slate-400">{acc.category}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-black shrink-0 ${
                    acc.type === "Asset" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30" :
                    acc.type === "Liability" ? "bg-amber-500/20 text-amber-300 border border-amber-400/30" :
                    acc.type === "Expense" ? "bg-rose-500/20 text-rose-300 border border-rose-400/30" :
                    acc.type === "Revenue" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30" :
                    "bg-indigo-500/20 text-indigo-300 border border-indigo-400/30"
                  }`}>
                    {acc.type}
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

const ANALYTIC_ACCOUNTS = [
  "بدون مركز تكلفة",
  "المشروع أ - فرع القاهرة",
  "إدارة التسويق والمبيعات",
  "إدارة تكنولوجيا المعلومات IT",
  "مصنع الإنتاج الرئيسي",
  "الإدارة العامة والتنفيذية"
];

const TAX_OPTIONS = [
  "بدون ضريبة (0%)",
  "ضريبة قيمة مضافة 14% (شامل)",
  "ضريبة خصم من المصدر 1%",
  "ضريبة خصم من المصدر 3%"
];

// Preset learning templates
const INITIAL_ENTRIES: OdooEntryRecord[] = [
  {
    id: "rec-1",
    name: "INV/2026/08/0012",
    date: "2026-08-01",
    journal: "Customer Invoices (فواتير عملاء)",
    partner: "شركة المستقبل للتجارة والتوكيلات",
    ref: "INV-8821",
    status: "posted",
    totalDebit: 11400,
    totalCredit: 11400,
    explanation: "اثبات فاتورة مبيعات آجل بمبلغ 10,000 ج.م مضافاً إليها 14% ضريبة قيمة مضافة. الحساب المدين: العملاء بـ 11,400 ج.م، الحسابات الدائنة: مبيعات 10,000 ج.م وضريبة قيمة مضافة 1,400 ج.م.",
    items: [
      {
        id: "1",
        accountCode: "110000",
        accountName: "حسابات العملاء (Accounts Receivable)",
        accountType: "Asset",
        partner: "شركة المستقبل للتجارة والتوكيلات",
        label: "فاتورة مبيعات رقم INV-8821",
        analyticAccount: "إدارة التسويق والمبيعات",
        tax: "بدون ضريبة (0%)",
        debit: 11400,
        credit: 0
      },
      {
        id: "2",
        accountCode: "400000",
        accountName: "إيرادات المبيعات (Sales Revenue)",
        accountType: "Revenue",
        partner: "شركة المستقبل للتجارة والتوكيلات",
        label: "بيع أجهزة ومعدات برمجية",
        analyticAccount: "إدارة التسويق والمبيعات",
        tax: "ضريبة قيمة مضافة 14% (شامل)",
        debit: 0,
        credit: 10000
      },
      {
        id: "3",
        accountCode: "220000",
        accountName: "مصلحة الضرائب - ضريبة القيمة المضافة 14%",
        accountType: "Liability",
        partner: "مصلحة الضرائب المصرية",
        label: "ضريبة قيمة مضافة مخرجات 14%",
        analyticAccount: "بدون مركز تكلفة",
        tax: "بدون ضريبة (0%)",
        debit: 0,
        credit: 1400
      }
    ]
  },
  {
    id: "rec-2",
    name: "BILL/2026/08/0045",
    date: "2026-08-01",
    journal: "Vendor Bills (فواتير موردين)",
    partner: "شركة العقارات الوطنية",
    ref: "RENT-AUG-2026",
    status: "draft",
    totalDebit: 8000,
    totalCredit: 8000,
    explanation: "قيد إثبات مصروف إيجار المقر الإداري لشهر أغسطس. يجعل حساب مصروف الإيجار مديناً وحساب الموردين/البنك دائناً بمبلغ 8,000 ج.م.",
    items: [
      {
        id: "10",
        accountCode: "510000",
        accountName: "مصروف الإيجار - المقر الرئيسي",
        accountType: "Expense",
        partner: "شركة العقارات الوطنية",
        label: "إيجار المقر الإداري - أغسطس 2026",
        analyticAccount: "الإدارة العامة والتنفيذية",
        tax: "بدون ضريبة (0%)",
        debit: 8000,
        credit: 0
      },
      {
        id: "11",
        accountCode: "101000",
        accountName: "البنك - الحساب الجاري",
        accountType: "Asset",
        partner: "البنك الأهلي المصري",
        label: "شيك سداد إيجار أغسطس",
        analyticAccount: "بدون مركز تكلفة",
        tax: "بدون ضريبة (0%)",
        debit: 0,
        credit: 8000
      }
    ]
  }
];

export function OdooJournalEntrySection({ onAwardXp }: OdooJournalEntrySectionProps) {
  // Main Section Tab Switcher: "editor" (Odoo Journal Form & List), "practice" ( اتعلم قيود أودو ), "guide" ( دليل أودو المحاسبي من أ إلى ي ), "coa" (شجرة الحسابات)
  const [mainSectionTab, setMainSectionTab] = useState<"editor" | "practice" | "guide" | "coa">("editor");
  const [isPracticeFullscreen, setIsPracticeFullscreen] = useState<boolean>(false);

  // Dynamic Chart of Accounts State
  const [accountsList, setAccountsList] = useState<OdooAccount[]>(ODOO_ACCOUNTS);
  const [coaSearchQuery, setCoaSearchQuery] = useState("");
  const [coaTypeFilter, setCoaTypeFilter] = useState<string>("all");
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [selectedLedgerAccountCode, setSelectedLedgerAccountCode] = useState<string | null>(null);

  const [newAccountForm, setNewAccountForm] = useState<{
    code: string;
    name: string;
    type: "Asset" | "Liability" | "Equity" | "Revenue" | "Expense";
    category: string;
    openingBalance: number;
  }>({
    code: "",
    name: "",
    type: "Asset",
    category: "أصول متداولة",
    openingBalance: 0
  });

  // Odoo Chatter Floating Chat Drawer State
  const [isChatterOpen, setIsChatterOpen] = useState<boolean>(false);

  // Field Helper Popover State (مساعد حقول أودو التفاعلي)
  const [fieldHelperOpen, setFieldHelperOpen] = useState<boolean>(false);
  const [activeHelperField, setActiveHelperField] = useState<string>("journal");

  // Main View Switcher for Editor: "tree" (Odoo List View) or "form" (Odoo Single Sheet View)
  const [viewMode, setViewMode] = useState<"form" | "tree">("form");

  // All Entries Database in state
  const [entries, setEntries] = useState<OdooEntryRecord[]>(INITIAL_ENTRIES);
  const [activeEntryIndex, setActiveEntryIndex] = useState<number>(0);

  // Active Entry State inside Form View
  const currentRecord = entries[activeEntryIndex] || entries[0];

  // ==========================================
  // ODOO PRACTICE & QUIZ MODE ( اتعلم قيود أودو )
  // ==========================================
  const ODOO_PRACTICE_SCENARIOS = [
    {
      id: "p1",
      title: "تمرين 1: شراء أجهزة كمبيوتر ولابتوبات نقدًا للإدارة",
      difficulty: "مبتدئ ERP 🟢",
      story: "شراء أجهزة لابتوب حاسوب آلي للإدارة العامة بمبلغ 25,000 ج.م نقدًا مسددة من الخزينة الرئيسية بدون ضريبة.",
      goalDescription: "قم باختيار وتوجيه القيد المزدوج الصحيح في شاشة أودو لتسجيل الأصل الثابت والخزينة.",
      correctAccounts: [
        { accountCode: "151000", side: "debit", amount: 25000 },
        { accountCode: "102000", side: "credit", amount: 25000 }
      ],
      explanation: "شراء أصل ثابت يزيد الأصول في الجانب المدين (Debit) بمبلغ 25,000 ج.م، والسداد نقدًا ينقص الخزينة في الجانب الدائن (Credit) بنفس المبلغ."
    },
    {
      id: "p2",
      title: "تمرين 2: إثبات فاتورة مبيعات بآجل + ضريبة قيمة مضافة 14%",
      difficulty: "متوسط ERP 🟡",
      story: "أصدرت الشركة فاتورة مبيعات بآجل 30 يوم لـ 'شركة المستقبل' بمبلغ 10,000 ج.م خاضعة لضريبة القيمة المضافة 14% (1,400 ج.م). إجمالي المستحق على العميل 11,400 ج.م.",
      goalDescription: "سجل قيد المبيعات المركب واثبات التزام الضريبة ومديونية العملاء.",
      correctAccounts: [
        { accountCode: "110000", side: "debit", amount: 11400 },
        { accountCode: "400000", side: "credit", amount: 10000 },
        { accountCode: "220000", side: "credit", amount: 1400 }
      ],
      explanation: "العملاء أصل متداول يزيد في المدين بإجمالي 11,400 ج.م، إيرادات المبيعات دائنه بـ 10,000 ج.م، وضريبة القيمة المضافة مخرجات دائنة بـ 1,400 ج.م لمصلحة الضرائب."
    },
    {
      id: "p3",
      title: "تمرين 3: سداد إيجار المقر بشيك وتخصيصه لمركز تكلفة",
      difficulty: "محترف ERP 🔴",
      story: "سداد مصروف إيجار المقر الإداري لشهر أغسطس بمبلغ 8,000 ج.م بشيك بنكي مسحوب على البنك الأهلي، وتخصيصه لمركز تكلفة 'الإدارة العامة والتنفيذية'.",
      goalDescription: "سجل قيد المصروف والبنوك وربطه بمركز التكلفة التحليلي المناسب.",
      correctAccounts: [
        { accountCode: "510000", side: "debit", amount: 8000 },
        { accountCode: "101000", side: "credit", amount: 8000 }
      ],
      explanation: "المصروفات طبيعتها مدينة بـ 8,000 ج.م، والبنوك أصل يقل بالجانب الدائن بـ 8,000 ج.م."
    },
    {
      id: "p4",
      title: "تمرين 4: إثبات استحقاق الرواتب والأجور واستقطاع التأمينات",
      difficulty: "خبير ERP 🏆",
      story: "إثبات استحقاق الرواتب الإجمالية للموظفين بمبلغ 30,000 ج.م، مع خصم تأمينات اجتماعية مستحقة 3,000 ج.م، وسداد الصافي نقدًا من الخزينة.",
      goalDescription: "قم بتوجيه القيد المركب للاستحقاق والاستقطاعات والخزينة.",
      correctAccounts: [
        { accountCode: "520000", side: "debit", amount: 30000 },
        { accountCode: "230000", side: "credit", amount: 3000 },
        { accountCode: "102000", side: "credit", amount: 27000 }
      ],
      explanation: "مصروف الأجور والرواتب مدين بالإجمالي 30,000 ج.م. التزامات التأمينات دائنة بـ 3,000 ج.م. الخزينة دائنة بالصافي المسدد 27,000 ج.م."
    }
  ];

  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceItems, setPracticeItems] = useState<OdooJournalItem[]>([
    { id: "pr1", accountCode: "151000", accountName: "الأصول الثابتة - أجهزة كمبيوتر وتكنولوجيا", accountType: "Asset", partner: "شركة التكنولوجيا", label: "شراء أجهزة كمبيوتر", analyticAccount: "الإدارة العامة والتنفيذية", tax: "بدون ضريبة (0%)", debit: 25000, credit: 0 },
    { id: "pr2", accountCode: "102000", accountName: "الصندوق / الخزينة الرئيسية", accountType: "Asset", partner: "الخزينة الرئيسية", label: "سداد نقدًا", analyticAccount: "بدون مركز تكلفة", tax: "بدون ضريبة (0%)", debit: 0, credit: 25000 }
  ]);

  const [practiceCheckFeedback, setPracticeCheckFeedback] = useState<{
    status: "success" | "error";
    message: string;
    whyText: string;
    correctionSteps: string;
  } | null>(null);

  // Handle Practice Check Logic
  const handleVerifyPracticeEntry = () => {
    playSound.click();
    const scenario = ODOO_PRACTICE_SCENARIOS[practiceIndex];
    const totalDeb = practiceItems.reduce((s, i) => s + (Number(i.debit) || 0), 0);
    const totalCred = practiceItems.reduce((s, i) => s + (Number(i.credit) || 0), 0);

    // Check 1: Balance
    if (Math.abs(totalDeb - totalCred) > 0.01) {
      playSound.error();
      setPracticeCheckFeedback({
        status: "error",
        message: "❌ القيد غير متوازن ماليًا!",
        whyText: `مجموع أسطر المدين (${totalDeb.toLocaleString("ar-EG")} ج.م) لا يساوي مجموع أسطر الدائن (${totalCred.toLocaleString("ar-EG")} ج.م). الفرق الحالي: ${Math.abs(totalDeb - totalCred).toLocaleString("ar-EG")} ج.م.`,
        correctionSteps: "في نظام Odoo ERP والمعايير المحاسبية الدولية، يرفض النظام ترحيل القيد إذا كان الفرق أكبر من صفر. قم بضبط القيم ليتساوى إجمالي المدين والدائن."
      });
      return;
    }

    if (totalDeb === 0) {
      playSound.error();
      setPracticeCheckFeedback({
        status: "error",
        message: "⚠️ القيد يحتوي على قيم صفرية!",
        whyText: "لم تقم بمدخلات مالية حقيقية للبنود.",
        correctionSteps: "أدخل المبالغ المالية الصحيحة للمدين والدائن حسب نص التمرين."
      });
      return;
    }

    // Check 2: Correct accounts and sides
    let isMatch = true;
    let errorReason = "";
    let errorWhy = "";

    for (const req of scenario.correctAccounts) {
      const matchedItem = practiceItems.find((i) => i.accountCode === req.accountCode);
      if (!matchedItem) {
        isMatch = false;
        errorReason = `حساب مفقود في القيد: [${req.accountCode}]`;
        errorWhy = `لم تقم باختيار الحساب المالي المخصص في شجرة حسابات Odoo لهذا القيد (${req.accountCode}).`;
        break;
      }

      const itemAmount = req.side === "debit" ? matchedItem.debit : matchedItem.credit;
      const wrongSideAmount = req.side === "debit" ? matchedItem.credit : matchedItem.debit;

      if (wrongSideAmount > 0) {
        isMatch = false;
        errorReason = `وضع القيمة في الجانب الخاطئ للحساب [${req.accountCode}]`;
        errorWhy = `لقد وضعت المبلغ في جانب الـ ${req.side === "debit" ? "دائن (Credit)" : "مدين (Debit)"} بينما يجب أن يكون في جانب الـ ${req.side === "debit" ? "المدين (Debit)" : "الدائن (Credit)"} حسب طبيعة الحساب المحاسبي!`;
        break;
      }

      if (Math.abs(itemAmount - req.amount) > 1) {
        isMatch = false;
        errorReason = `المبلغ غير دقيق للحساب [${req.accountCode}]`;
        errorWhy = `المبلغ المكتوب هو ${itemAmount.toLocaleString("ar-EG")} ج.م بينما المبلغ المطلوب حسب معطيات التمرين هو ${req.amount.toLocaleString("ar-EG")} ج.م.`;
        break;
      }
    }

    if (!isMatch) {
      playSound.error();
      setPracticeCheckFeedback({
        status: "error",
        message: `❌ خطأ في التوجيه المحاسبي: ${errorReason}`,
        whyText: errorWhy,
        correctionSteps: `💡 التصويب الصحيح وفق قواعد أودو:\n${scenario.explanation}`
      });
    } else {
      playSound.levelUp();
      setPracticeCheckFeedback({
        status: "success",
        message: "🎉 ممتاز جداً! التوجيه المحاسبي وقيد Odoo صحيح 100%",
        whyText: scenario.explanation,
        correctionSteps: "تم إحراز نقاط الخبرة (XP). يمكنك الانتقال للتمرين التالي لتطوير مهاراتك في ERP!"
      });
      if (onAwardXp) {
        onAwardXp(25, "خبير قيود Odoo 🌟", `أتقنت حظر أخطاء أودو في ${scenario.title}`);
      }
    }
  };

  // Add line in Practice
  const handleAddPracticeLine = () => {
    playSound.click();
    const newItem: OdooJournalItem = {
      id: Date.now().toString(),
      accountCode: "101000",
      accountName: "البنك - الحساب الجاري",
      accountType: "Asset",
      partner: "شريك جديد",
      label: "بند قيد تمرين",
      analyticAccount: "بدون مركز تكلفة",
      tax: "بدون ضريبة (0%)",
      debit: 0,
      credit: 0
    };
    setPracticeItems((prev) => [...prev, newItem]);
  };

  const [voucherNo, setVoucherNo] = useState(currentRecord?.name || "MISC/2026/08/0001");
  const [journalType, setJournalType] = useState(currentRecord?.journal || "Miscellaneous Operations (عمليات متنوعة)");
  const [date, setDate] = useState(currentRecord?.date || new Date().toISOString().split("T")[0]);
  const [partner, setPartner] = useState(currentRecord?.partner || "شركة الأمل للتجارة والتوكيلات");
  const [referenceDoc, setRefDoc] = useState(currentRecord?.ref || "REF-2026-9901");
  const [status, setStatus] = useState<"draft" | "posted" | "cancelled">(currentRecord?.status || "draft");
  const [explanationText, setExplanationText] = useState(currentRecord?.explanation || "");

  // Active items array inside current entry
  const [items, setItems] = useState<OdooJournalItem[]>(currentRecord?.items || []);

  // Form Notebook Tab ("items" | "explanation" | "gl" | "other")
  const [activeFormTab, setActiveFormTab] = useState<"items" | "explanation" | "gl" | "other">("items");

  // Chatter Tab Mode ("chat" | "notes" | "scenarios")
  const [chatterTab, setChatterTab] = useState<"chat" | "notes" | "scenarios">("chat");

  // Odoo AI Interactive Chat Messages State
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: "user" | "odoo_ai"; text: string; time: string }>>([
    {
      id: "m1",
      sender: "odoo_ai",
      text: "مرحباً بك في شات Odoo ERP المحاسبي! 🟣\nأنا مساعدك الذكي لمراجعة وتوجيه قيود اليومية. يمكنك استفساري عن أي قيد، تحليل الحسابات، ضريبة القيمة المضافة، أو كيفية معالجة الحسابات الدائنة والمدينة.",
      time: "الآن"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Send Odoo AI Chat Message
  const handleSendOdooChatMessage = async (e?: React.FormEvent, customMsg?: string) => {
    if (e) e.preventDefault();
    const msg = (customMsg || chatInput).trim();
    if (!msg || isChatLoading) return;

    playSound.click();
    const nowStr = new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
    const userMsgObj = { id: Date.now().toString(), sender: "user" as const, text: msg, time: nowStr };

    setChatMessages((prev) => [...prev, userMsgObj]);
    if (!customMsg) setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/odoo-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          currentEntry: currentRecord,
          history: chatMessages.map((m) => ({ role: m.sender === "user" ? "user" : "model", text: m.text }))
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر الحصول على إجابة من شات Odoo.");

      const replyText = data.reply || "أهلاً بك! أنا مساعد Odoo المحاسبي. كيف يمكنني مساعدتك؟";
      playSound.levelUp();

      const aiMsgObj = { id: (Date.now() + 1).toString(), sender: "odoo_ai" as const, text: replyText, time: nowStr };
      setChatMessages((prev) => [...prev, aiMsgObj]);

      // Sync with audit trail notes
      setChatterNotes((prev) => [
        {
          id: Date.now().toString(),
          user: "مساعد Odoo الذكي",
          text: `[سؤال]: ${msg}\n[رد Odoo]: ${replyText.slice(0, 90)}...`,
          time: "الآن",
          type: "note"
        },
        ...prev
      ]);
    } catch (err: any) {
      console.error(err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "odoo_ai",
          text: `⚠️ تعذر الاتصال بمساعد Odoo الذكي: ${err.message || "يرجى التحقق من المفتاح بالبيئة"}`,
          time: nowStr
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Chatter Messages
  const [chatterNotes, setChatterNotes] = useState<Array<{ id: string; user: string; text: string; time: string; type: "audit" | "note" }>>([
    { id: "c1", user: "نظام Odoo ERP", text: "تم إنشاء القيد المحاسبي في حالة مسودة (Draft).", time: "اليوم 10:00 ص", type: "audit" },
    { id: "c2", user: "المحاسب المالي", text: "يرجى مراجعة القيمة المضافة ومراكز التكلفة قبل الترحيل.", time: "اليوم 10:15 ص", type: "note" }
  ]);
  const [newNoteInput, setNewNoteInput] = useState("");

  // Search & Filters in Tree View
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "posted" | "cancelled">("all");
  const [journalFilter, setJournalFilter] = useState<string>("all");
  const [startDateFilter, setStartDateFilter] = useState<string>("");
  const [endDateFilter, setEndDateFilter] = useState<string>("");

  // Print Voucher Modal State
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [entryToPrint, setEntryToPrint] = useState<OdooEntryRecord | null>(null);

  // Notification Toast
  const [notification, setNotification] = useState<{ msg: string; type: "success" | "warning" | "info" } | null>(null);

  // Export to Excel/CSV
  const handleExportCSV = (entriesToExport: OdooEntryRecord[]) => {
    playSound.click();
    if (entriesToExport.length === 0) {
      setNotification({ msg: "لا توجد قيود لتصديرها!", type: "warning" });
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // UTF-8 BOM
    csvContent += "رقم القيد,التاريخ,دفتر اليومية,رمز الحساب,اسم الحساب,الشريك,البيان,مدين,دائن,الحالة\n";

    entriesToExport.forEach((entry) => {
      entry.items.forEach((item) => {
        const row = [
          `"${entry.name}"`,
          `"${entry.date}"`,
          `"${entry.journal.replace(/"/g, '""')}"`,
          `"${item.accountCode}"`,
          `"${item.accountName.replace(/"/g, '""')}"`,
          `"${(item.partner || entry.partner).replace(/"/g, '""')}"`,
          `"${(item.label || "").replace(/"/g, '""')}"`,
          item.debit || 0,
          item.credit || 0,
          `"${entry.status}"`
        ].join(",");
        csvContent += row + "\n";
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Odoo_Journal_Entries_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotification({ msg: "تم تصدير القيود المحاسبية بنجاح لملف Excel/CSV! 📊", type: "success" });
  };

  const handleOpenPrintModal = (entry: OdooEntryRecord) => {
    playSound.click();
    setEntryToPrint(entry);
    setPrintModalOpen(true);
  };

  // Save Entry States
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [showUnbalancedWarning, setShowUnbalancedWarning] = useState(false);

  // AI Explanation Modal State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [selectedEntryForAi, setSelectedEntryForAi] = useState<OdooEntryRecord | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isSpeakingAi, setIsSpeakingAi] = useState(false);
  const [copiedAi, setCopiedAi] = useState(false);

  const handleExplainJournalWithAi = async (entry: OdooEntryRecord) => {
    playSound.click();
    setSelectedEntryForAi(entry);
    setAiModalOpen(true);
    setAiError(null);
    setCopiedAi(false);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeakingAi(false);
    }

    // Check if cached
    if (entry.explanation && entry.explanation.length > 60 && !entry.explanation.includes("يقوم هذا القيد")) {
      setAiExplanation(entry.explanation);
      return;
    }

    setAiLoading(true);
    setAiExplanation("");

    try {
      const response = await fetch("/api/explain-journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entry })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "تعذر الحصول على شرح المساعد.");
      }

      const explanationResult = data.explanation || "لم يتم التوصل لشرح مناسب للقيد.";
      setAiExplanation(explanationResult);

      setEntries(prev =>
        prev.map(item => item.id === entry.id ? { ...item, explanation: explanationResult } : item)
      );
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "حدث خطأ أثناء التواصل مع Gemini API.");
    } finally {
      setAiLoading(false);
    }
  };

  const toggleSpeechAi = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeakingAi) {
      window.speechSynthesis.cancel();
      setIsSpeakingAi(false);
    } else {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#_`]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "ar-SA";
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeakingAi(false);
      utterance.onerror = () => setIsSpeakingAi(false);
      setIsSpeakingAi(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const copyAiExplanation = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAi(true);
    setTimeout(() => setCopiedAi(false), 2000);
  };

  // Sync state when index changes
  const loadEntry = (index: number) => {
    const rec = entries[index];
    if (!rec) return;
    setActiveEntryIndex(index);
    setVoucherNo(rec.name);
    setJournalType(rec.journal);
    setDate(rec.date);
    setPartner(rec.partner);
    setRefDoc(rec.ref);
    setStatus(rec.status);
    setItems(rec.items);
    setExplanationText(rec.explanation || "");
    setViewMode("form");
  };

  // Create New Entry
  const handleCreateNew = () => {
    playSound.click();
    const todayStr = new Date().toISOString().split("T")[0];
    const newName = `MISC/2026/08/00${entries.length + 10}`;
    const newRec: OdooEntryRecord = {
      id: Date.now().toString(),
      name: newName,
      date: todayStr,
      journal: "Miscellaneous Operations (عمليات متنوعة)",
      partner: "عميل / مورد جديد",
      ref: "NEW-REF",
      status: "draft",
      totalDebit: 0,
      totalCredit: 0,
      items: [
        {
          id: "1",
          accountCode: "101000",
          accountName: "البنك - الحساب الجاري",
          accountType: "Asset",
          partner: "البنك الأهلي المصري",
          label: "بيان القيد المحاسبي",
          analyticAccount: "بدون مركز تكلفة",
          tax: "بدون ضريبة (0%)",
          debit: 0,
          credit: 0
        },
        {
          id: "2",
          accountCode: "400000",
          accountName: "إيرادات المبيعات (Sales Revenue)",
          accountType: "Revenue",
          partner: "عميل جديد",
          label: "إيراد مبيعات",
          analyticAccount: "إدارة التسويق والمبيعات",
          tax: "بدون ضريبة (0%)",
          debit: 0,
          credit: 0
        }
      ],
      explanation: "قم بإدخال تفاصيل القيد وشرح المدين والدائن هنا."
    };

    setEntries((prev) => [newRec, ...prev]);
    setActiveEntryIndex(0);
    setVoucherNo(newRec.name);
    setJournalType(newRec.journal);
    setDate(newRec.date);
    setPartner(newRec.partner);
    setRefDoc(newRec.ref);
    setStatus("draft");
    setItems(newRec.items);
    setExplanationText(newRec.explanation || "");
    setViewMode("form");
    setNotification({ msg: "تم فتح قيد محاسبي جديد في مسودة أودو 📝", type: "info" });
  };

  // Calculations
  const totalDebit = items.reduce((sum, item) => sum + (Number(item.debit) || 0), 0);
  const totalCredit = items.reduce((sum, item) => sum + (Number(item.credit) || 0), 0);
  const difference = Math.abs(totalDebit - totalCredit);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;

  // Add line to journal items
  const handleAddLine = () => {
    playSound.click();
    const newItem: OdooJournalItem = {
      id: Date.now().toString(),
      accountCode: "101000",
      accountName: "البنك - الحساب الجاري",
      accountType: "Asset",
      partner: partner || "شريك جديد",
      label: "شرح بند القيد المحاسبي",
      analyticAccount: "بدون مركز تكلفة",
      tax: "بدون ضريبة (0%)",
      debit: 0,
      credit: difference > 0 && totalDebit < totalCredit ? difference : 0
    };
    setItems((prev) => [...prev, newItem]);
  };

  // Update line
  const handleUpdateItem = (id: string, field: keyof OdooJournalItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (field === "accountCode") {
          const selectedAcc = accountsList.find((a) => a.code === value);
          return {
            ...item,
            accountCode: value,
            accountName: selectedAcc ? selectedAcc.name : item.accountName,
            accountType: selectedAcc ? (selectedAcc.type as any) : item.accountType
          };
        }

        return { ...item, [field]: value };
      })
    );
  };

  // Calculate dynamic account running balance from posted entries
  const calculateAccountBalances = (accCode: string, accType: string, openingBal = 0) => {
    let totalDebit = 0;
    let totalCredit = 0;
    let txCount = 0;

    entries.forEach((entry) => {
      if (entry.status === "posted") {
        entry.items.forEach((item) => {
          if (item.accountCode === accCode) {
            totalDebit += Number(item.debit) || 0;
            totalCredit += Number(item.credit) || 0;
            txCount++;
          }
        });
      }
    });

    let netBalance = openingBal;
    if (accType === "Asset" || accType === "Expense") {
      netBalance = openingBal + totalDebit - totalCredit;
    } else {
      netBalance = openingBal + totalCredit - totalDebit;
    }

    return { totalDebit, totalCredit, netBalance, txCount };
  };

  // Handle adding new account to COA
  const handleAddNewAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountForm.code.trim() || !newAccountForm.name.trim()) {
      setNotification({ msg: "يرجى تعبئة رمز واسم الحساب المحاسبي!", type: "warning" });
      return;
    }

    if (accountsList.some((a) => a.code === newAccountForm.code.trim())) {
      setNotification({ msg: `كود الحساب (${newAccountForm.code.trim()}) موجود بالفعل في شجرة الحسابات!`, type: "warning" });
      return;
    }

    playSound.success();
    const cleanName = newAccountForm.name.trim();
    const formattedName = cleanName.startsWith(newAccountForm.code.trim())
      ? cleanName
      : `${newAccountForm.code.trim()} ${cleanName}`;

    const newAcc: OdooAccount = {
      code: newAccountForm.code.trim(),
      name: formattedName,
      type: newAccountForm.type,
      category: newAccountForm.category || "حساب فرعي مخصص",
      openingBalance: Number(newAccountForm.openingBalance) || 0,
      isCustom: true
    };

    setAccountsList((prev) => [...prev, newAcc]);
    setIsAddAccountModalOpen(false);
    setNewAccountForm({
      code: "",
      name: "",
      type: "Asset",
      category: "أصول متداولة",
      openingBalance: 0
    });

    setNotification({
      msg: `تم إضافة الحساب المحاسبي (${formattedName}) بنجاح لشجرة حسابات أودو! 🌳`,
      type: "success"
    });

    if (onAwardXp) {
      onAwardXp(15, "إضافة حساب أودو جديد 🌳", `سجلت الحساب رقم (${newAcc.code}) في دليل شجرة الحسابات!`);
    }
  };

  // Handle deleting custom account
  const handleDeleteCustomAccount = (accCode: string) => {
    playSound.click();
    setAccountsList((prev) => prev.filter((a) => a.code !== accCode));
    setNotification({ msg: `تم حذف الحساب (${accCode}) من شجرة الحسابات.`, type: "info" });
  };

  // Remove line
  const handleRemoveLine = (id: string) => {
    if (items.length <= 1) {
      setNotification({ msg: "يجب أن يحتوي قيد أودو على سطرين على الأقل!", type: "warning" });
      return;
    }
    playSound.click();
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Auto-balance
  const handleAutoBalance = () => {
    if (isBalanced) {
      setNotification({ msg: "القيد متوازن بالفعل! إجمالي المدين يساوي إجمالي الدائن.", type: "info" });
      return;
    }

    playSound.success();
    const diff = Math.abs(totalDebit - totalCredit);
    if (totalDebit > totalCredit) {
      const newItem: OdooJournalItem = {
        id: Date.now().toString(),
        accountCode: "101000",
        accountName: "البنك - الحساب الجاري",
        accountType: "Asset",
        partner: partner,
        label: "موازنة تلقائية لميزان القيد",
        analyticAccount: "بدون مركز تكلفة",
        tax: "بدون ضريبة (0%)",
        debit: 0,
        credit: diff
      };
      setItems((prev) => [...prev, newItem]);
    } else {
      const newItem: OdooJournalItem = {
        id: Date.now().toString(),
        accountCode: "101000",
        accountName: "البنك - الحساب الجاري",
        accountType: "Asset",
        partner: partner,
        label: "موازنة تلقائية لميزان القيد",
        analyticAccount: "بدون مركز تكلفة",
        tax: "بدون ضريبة (0%)",
        debit: diff,
        credit: 0
      };
      setItems((prev) => [...prev, newItem]);
    }
    setNotification({ msg: "تمت موازنة القيد تلقائياً بنجاح! ✨", type: "success" });
  };

  // Post entry
  const handlePostEntry = () => {
    if (!isBalanced) {
      playSound.error();
      setNotification({
        msg: `لا يمكن ترحيل قيد غير متوازن! الفارق الحالي: ${difference.toLocaleString("ar-EG")} ج.م`,
        type: "warning"
      });
      return;
    }

    playSound.levelUp();
    setStatus("posted");

    // Update in entries list
    setEntries((prev) =>
      prev.map((rec, i) =>
        i === activeEntryIndex
          ? { ...rec, status: "posted", items, totalDebit, totalCredit }
          : rec
      )
    );

    // Add chatter note
    setChatterNotes((prev) => [
      {
        id: Date.now().toString(),
        user: "نظام Odoo ERP",
        text: `تم ترحيل القيد ${voucherNo} بنجاح واعتماده في دفاتري الأستاذ العام (Posted).`,
        time: "الآن",
        type: "audit"
      },
      ...prev
    ]);

    setNotification({
      msg: `تم اعتماد القيد ${voucherNo} وترحيله بنجاح إلى الأستاذ العام بمحاكي Odoo ERP! 🎉`,
      type: "success"
    });

    if (onAwardXp) {
      onAwardXp(30, "محترف أودو Odoo 🏆", "قم بتسجيل واعتمد قيد محاسبي مركّب ومتوازن في محاكي Odoo!");
    }
  };

  // Reset draft
  const handleResetDraft = () => {
    playSound.click();
    setStatus("draft");
    setEntries((prev) =>
      prev.map((rec, i) => (i === activeEntryIndex ? { ...rec, status: "draft" } : rec))
    );
    setNotification({ msg: "تم تحويل القيد إلى مسودة (Draft) للتعديل.", type: "info" });
  };

  // Save Entry Handler
  const handleSaveEntry = () => {
    if (isSaving) return;

    if (items.length === 0) {
      playSound.error();
      setNotification({ msg: "لا يمكن حفظ قيد بدون بنود محاسبية!", type: "warning" });
      return;
    }

    // Automatic Balance Checking Constraint
    if (!isBalanced) {
      playSound.error();
      setShowUnbalancedWarning(true);
      setNotification({
        msg: `🚨 تحذير: لا يمكن حفظ القيد وهو غير متوازن! مجموع المدين (${totalDebit.toLocaleString("ar-EG")} ج.م) لا يساوي مجموع الدائن (${totalCredit.toLocaleString("ar-EG")} ج.م). الفرق الحالي: ${difference.toLocaleString("ar-EG")} ج.م`,
        type: "warning"
      });
      return;
    }

    setShowUnbalancedWarning(false);
    playSound.click();
    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate database save delay
    setTimeout(() => {
      setEntries((prev) =>
        prev.map((rec, i) =>
          i === activeEntryIndex
            ? {
                ...rec,
                name: voucherNo,
                journal: journalType,
                date,
                partner,
                ref: referenceDoc,
                status,
                items,
                totalDebit,
                totalCredit,
                explanation: explanationText
              }
            : rec
        )
      );

      setIsSaving(false);
      setSaveSuccess(true);

      const now = new Date();
      const timeStr = now.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
      setLastSavedTime(timeStr);

      playSound.success();

      setNotification({
        msg: `تم حفظ القيد المحاسبي (${voucherNo}) بنجاح في قاعدة بيانات أودو! 💾`,
        type: "success"
      });

      setChatterNotes((prev) => [
        {
          id: Date.now().toString(),
          user: "المحاسب (أنت)",
          text: `تم حفظ التعديلات على القيد ${voucherNo} في تمام الساعة ${timeStr}.`,
          time: "الآن",
          type: "note"
        },
        ...prev
      ]);

      if (onAwardXp) {
        onAwardXp(15, "حفظ القيد المحاسبي 💾", "تم حفظ وتوثيق بيانات القيد في محاكي Odoo ERP!");
      }

      setTimeout(() => {
        setSaveSuccess(false);
      }, 3500);
    }, 1000);
  };

  // Add Chatter Note
  const handleAddChatterNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteInput.trim()) return;
    playSound.click();
    setChatterNotes((prev) => [
      {
        id: Date.now().toString(),
        user: "المحاسب (أنت)",
        text: newNoteInput,
        time: "الآن",
        type: "note"
      },
      ...prev
    ]);
    setNewNoteInput("");
  };

  // Filtered Tree Entries
  const filteredEntries = entries.filter((e) => {
    const matchesQuery =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.partner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.journal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.ref.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    const matchesJournal = journalFilter === "all" || e.journal.includes(journalFilter);
    const matchesStartDate = !startDateFilter || e.date >= startDateFilter;
    const matchesEndDate = !endDateFilter || e.date <= endDateFilter;

    return matchesQuery && matchesStatus && matchesJournal && matchesStartDate && matchesEndDate;
  });

  return (
    <div className="w-full space-y-4 pb-12 text-right dir-rtl font-sans bg-[#0E0B12] text-slate-100 p-2 sm:p-4 rounded-3xl min-h-screen">
      
      {/* ODOO SYSTEM NAVIGATION HEADER / TOP BAR */}
      <div className="bg-[#1C1625] border border-purple-500/30 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
        
        {/* Left Brand & App Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#714B67] via-[#8F5982] to-[#00A09D] flex items-center justify-center text-white shadow-lg shadow-purple-900/40">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black text-white tracking-wide">Odoo v17 Accounting</span>
              <span className="bg-[#714B67]/40 text-purple-200 border border-[#714B67] text-[10px] font-black px-2 py-0.5 rounded-md">
                محاكي أودو المحاسبي الأصلي
              </span>
            </div>
            <p className="text-[11px] text-slate-400">شاشة تسجيل وتوجيه قيود اليومية المحاسبية واختبار المهارات</p>
          </div>
        </div>

        {/* 3 Main Sections Tabs Switcher */}
        <div className="flex items-center gap-1.5 bg-[#120D1A] p-1.5 rounded-2xl border border-white/10 overflow-x-auto">
          <button
            onClick={() => { playSound.click(); setMainSectionTab("editor"); }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
              mainSectionTab === "editor"
                ? "bg-gradient-to-r from-[#714B67] to-[#00A09D] text-white shadow-lg shadow-purple-900/40 ring-1 ring-white/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <FileText className="w-4 h-4 text-purple-300" />
            <span>محاكي قيود أودو</span>
          </button>

          <button
            onClick={() => { playSound.click(); setMainSectionTab("practice"); }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
              mainSectionTab === "practice"
                ? "bg-gradient-to-r from-[#714B67] to-[#00A09D] text-white shadow-lg shadow-purple-900/40 ring-1 ring-white/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>اتعلم قيود أودو 🎯</span>
          </button>

          <button
            onClick={() => { playSound.click(); setMainSectionTab("guide"); }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
              mainSectionTab === "guide"
                ? "bg-gradient-to-r from-[#714B67] to-[#00A09D] text-white shadow-lg shadow-purple-900/40 ring-1 ring-white/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <BookOpen className="w-4 h-4 text-cyan-300" />
            <span>دليل أودو المحاسبي من أ إلى ي 📚</span>
          </button>

          <button
            onClick={() => { playSound.click(); setMainSectionTab("coa"); }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
              mainSectionTab === "coa"
                ? "bg-gradient-to-r from-[#714B67] to-[#00A09D] text-white shadow-lg shadow-purple-900/40 ring-1 ring-white/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Grid className="w-4 h-4 text-emerald-300" />
            <span>شجرة الحسابات (Chart of Accounts) 🌳</span>
          </button>
        </div>

        {/* View Switchers & Controls (List View vs Form View - Only visible in editor) */}
        {mainSectionTab === "editor" && (
          <div className="flex items-center gap-2">
            <div className="bg-[#120D1A] p-1 rounded-xl border border-white/10 flex items-center gap-1">
              <button
                onClick={() => setViewMode("tree")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "tree"
                    ? "bg-[#714B67] text-white shadow-md font-black"
                    : "text-slate-400 hover:text-white"
                }`}
                title="عرض قائمة القيود (List / Tree View)"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">قائمة القيود</span>
              </button>

              <button
                onClick={() => setViewMode("form")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "form"
                    ? "bg-[#714B67] text-white shadow-md font-black"
                    : "text-slate-400 hover:text-white"
                }`}
                title="عرض استمارة القيد (Form View)"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">استمارة القيد</span>
              </button>
            </div>

            <button
              onClick={handleCreateNew}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center gap-1.5 border border-emerald-400/30"
            >
              <Plus className="w-4 h-4" />
              <span>جديد (New)</span>
            </button>

            {/* Odoo Chatter & AI Button Trigger */}
            <button
              onClick={() => { playSound.click(); setIsChatterOpen(true); }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#714B67] to-[#00A09D] hover:opacity-90 text-white text-xs sm:text-sm font-black flex items-center gap-2 cursor-pointer transition-all hover:scale-105 shadow-lg shadow-purple-900/40 border border-teal-300/30"
              title="فتح شات ومساعد أودو المحاسبي الذكي"
            >
              <Bot className="w-4 h-4 text-amber-300 animate-bounce" />
              <span className="hidden sm:inline">Odoo Chatter 💬</span>
            </button>
          </div>
        )}
      </div>

      {/* NOTIFICATION FEEDBACK TOAST */}
      {notification && (
        <div className={`p-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between gap-3 animate-slideDown shadow-xl ${
          notification.type === "success" ? "bg-emerald-500/20 text-emerald-200 border border-emerald-500/40" :
          notification.type === "warning" ? "bg-amber-500/20 text-amber-200 border border-amber-500/40" :
          "bg-purple-500/20 text-purple-200 border border-purple-500/40"
        }`}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{notification.msg}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-white/60 hover:text-white cursor-pointer px-2">✕</button>
        </div>
      )}

      {/* MAIN SECTION TAB 1: ODOO EDITOR (LIST & FORM VIEWS) */}
      {mainSectionTab === "editor" && (
        <>
          {/* VIEW MODE 1: ODOO LIST / TREE VIEW */}
          {viewMode === "tree" && (
        <div className="bg-[#150F21] border border-purple-500/30 rounded-3xl p-4 sm:p-6 space-y-4 shadow-2xl">
          {/* SEARCH & ADVANCED FILTER TOOLBAR */}
          <div className="flex flex-col gap-3 pb-4 border-b border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <input
                  type="text"
                  placeholder="بحث برقم القيد، اسم الشريك، المرجع..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0d0814] border border-white/10 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-400"
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1 bg-[#0d0814] p-1 rounded-xl border border-white/10 text-xs font-bold overflow-x-auto">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    statusFilter === "all" ? "bg-purple-600 text-white font-black" : "text-slate-400 hover:text-white"
                  }`}
                >
                  الكل ({entries.length})
                </button>
                <button
                  onClick={() => setStatusFilter("draft")}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    statusFilter === "draft" ? "bg-amber-500 text-slate-950 font-black" : "text-amber-400/70 hover:text-amber-300"
                  }`}
                >
                  مسودة ({entries.filter(e => e.status === "draft").length})
                </button>
                <button
                  onClick={() => setStatusFilter("posted")}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    statusFilter === "posted" ? "bg-emerald-500 text-slate-950 font-black" : "text-emerald-400/70 hover:text-emerald-300"
                  }`}
                >
                  مرحّل ({entries.filter(e => e.status === "posted").length})
                </button>
              </div>

              {/* Export to Excel / CSV */}
              <button
                onClick={() => handleExportCSV(filteredEntries)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/50 hover:to-teal-600/50 text-emerald-200 border border-emerald-500/40 text-xs font-black flex items-center gap-2 cursor-pointer transition-all hover:scale-105 shadow-md"
                title="تصدير جميع القيود المعروضة إلى ملف CSV / Excel"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
                <span>تصدير Excel / CSV 📊</span>
              </button>
            </div>

            {/* Date Filters & Journal Filter Row */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-300">
              <div className="flex items-center gap-1.5 bg-[#0d0814] px-3 py-1.5 rounded-xl border border-white/10">
                <Filter className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>الدفتر:</span>
                <select
                  value={journalFilter}
                  onChange={(e) => setJournalFilter(e.target.value)}
                  className="bg-transparent text-white outline-none cursor-pointer"
                >
                  <option value="all" className="bg-[#120B1A]">جميع الدفاتر</option>
                  <option value="Miscellaneous" className="bg-[#120B1A]">عمليات متنوعة (Miscellaneous)</option>
                  <option value="Bank" className="bg-[#120B1A]">البنك والحسابات الجارية</option>
                  <option value="Sales" className="bg-[#120B1A]">يومية المبيعات</option>
                  <option value="Purchases" className="bg-[#120B1A]">يومية المشتريات</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-[#0d0814] px-3 py-1.5 rounded-xl border border-white/10">
                <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>من:</span>
                <input
                  type="date"
                  value={startDateFilter}
                  onChange={(e) => setStartDateFilter(e.target.value)}
                  className="bg-transparent text-white outline-none font-mono text-[11px]"
                />
                <span>إلى:</span>
                <input
                  type="date"
                  value={endDateFilter}
                  onChange={(e) => setEndDateFilter(e.target.value)}
                  className="bg-transparent text-white outline-none font-mono text-[11px]"
                />
                {(startDateFilter || endDateFilter) && (
                  <button
                    onClick={() => { setStartDateFilter(""); setEndDateFilter(""); }}
                    className="text-amber-400 hover:text-white text-[10px] underline ml-1 cursor-pointer"
                  >
                    مسح
                  </button>
                )}
              </div>

              <div className="mr-auto text-xs text-slate-400 font-bold">
                نتائج الفلترة: <span className="text-purple-300 font-mono font-black text-sm">{filteredEntries.length}</span> من أصل <span className="font-mono">{entries.length}</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0d0814]">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#241733] text-purple-200 font-black border-b border-white/10">
                <tr>
                  <th className="p-3.5">رقم القيد (Number)</th>
                  <th className="p-3.5">التاريخ (Date)</th>
                  <th className="p-3.5">دفتر اليومية (Journal)</th>
                  <th className="p-3.5">الشريك / المتعامل (Partner)</th>
                  <th className="p-3.5">المرجع (Reference)</th>
                  <th className="p-3.5 text-left">إجمالي القيد (Total)</th>
                  <th className="p-3.5 text-center">الحالة (State)</th>
                  <th className="p-3.5 text-center">شرح المساعد (AI)</th>
                  <th className="p-3.5 text-center">فتح القيد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300 font-bold">
                {filteredEntries.map((rec, idx) => (
                  <tr
                    key={rec.id}
                    onClick={() => loadEntry(entries.indexOf(rec))}
                    className="hover:bg-purple-500/10 cursor-pointer transition-colors group"
                  >
                    <td className="p-3.5 font-mono font-black text-purple-300 group-hover:underline">
                      {rec.name}
                    </td>
                    <td className="p-3.5 font-mono text-slate-400">{rec.date}</td>
                    <td className="p-3.5">{rec.journal}</td>
                    <td className="p-3.5 text-white">{rec.partner}</td>
                    <td className="p-3.5 font-mono text-slate-400">{rec.ref}</td>
                    <td className="p-3.5 text-left font-mono font-black text-emerald-400">
                      {rec.totalDebit.toLocaleString("ar-EG")} ج.م
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                          rec.status === "posted"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            : rec.status === "cancelled"
                            ? "bg-red-500/20 text-red-300 border-red-500/40"
                            : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        }`}
                      >
                        {rec.status === "posted" ? "مرحّل (Posted)" : rec.status === "cancelled" ? "ملغى" : "مسودة (Draft)"}
                      </span>
                    </td>
                    <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleExplainJournalWithAi(rec)}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600/40 via-indigo-600/40 to-amber-500/20 hover:from-purple-600/60 hover:to-indigo-600/60 text-amber-200 border border-purple-400/40 text-xs font-black flex items-center gap-1.5 mx-auto cursor-pointer transition-all hover:scale-105 shadow-md shadow-purple-900/30"
                        title="شرح المنطق المحاسبي لهذا القيد بواسطة الذكاء الاصطناعي Gemini"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                        <span>شرح المساعد</span>
                      </button>
                    </td>
                    <td className="p-3.5 text-center">
                      <button className="p-1.5 rounded-lg bg-purple-500/20 text-purple-200 group-hover:bg-purple-500/40">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: ODOO SINGLE ENTRY FORM SHEET (FULL SCREEN WIDTH) */}
      {viewMode === "form" && (
        <div className="w-full space-y-4">
          
          {/* MAIN FORM SHEET CANVAS (FULL WIDTH) */}
          <div className="w-full space-y-4">
            
            {/* ODOO FORM CONTROL BAR / BREADCRUMBS & PAGINATION */}
            <div className="bg-[#160E1F] border border-purple-500/30 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3">
              
              {/* Odoo Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleSaveEntry}
                  disabled={isSaving}
                  className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-lg transition-all cursor-pointer flex items-center gap-2 border ${
                    saveSuccess
                      ? "bg-emerald-600 text-white border-emerald-400/80 shadow-emerald-500/40 ring-2 ring-emerald-400/50 scale-105"
                      : isSaving
                      ? "bg-purple-900/60 text-purple-200 border-purple-500/40 cursor-wait"
                      : "bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white border-purple-400/40 shadow-purple-900/40"
                  }`}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
                      <span>جاري الحفظ...</span>
                    </>
                  ) : saveSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-200 animate-bounce" />
                      <span>تم الحفظ! ✓</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-purple-300" />
                      <span>حفظ القيد (Save)</span>
                    </>
                  )}
                </button>

                {status === "draft" ? (
                  <button
                    onClick={handlePostEntry}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#714B67] to-[#008784] hover:opacity-90 text-white font-black text-xs sm:text-sm shadow-lg shadow-purple-900/30 transition-all cursor-pointer flex items-center gap-1.5 border border-purple-400/30"
                  >
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>اعتماد القيد وترحيله (Post)</span>
                  </button>
                ) : (
                  <button
                    onClick={handleResetDraft}
                    className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 font-bold text-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-300" />
                    <span>إعادة إلى مسودة (Reset to Draft)</span>
                  </button>
                )}

                <button
                  onClick={handleAutoBalance}
                  disabled={isBalanced}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                    isBalanced
                      ? "bg-white/5 text-slate-500 border-white/5 cursor-not-allowed"
                      : "bg-emerald-600/20 hover:bg-emerald-600/30 border-emerald-400/50 text-emerald-200 shadow-md"
                  }`}
                >
                  <Scale className="w-4 h-4 text-emerald-400" />
                  <span>موازنة القيد</span>
                </button>

                <button
                  onClick={() => { playSound.click(); setFieldHelperOpen(true); }}
                  className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#714B67] to-[#00A09D] hover:opacity-90 border border-teal-300/40 text-white text-xs sm:text-sm font-black flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 shadow-lg shadow-purple-900/30 ring-1 ring-white/20"
                  title="مساعد حقول أودو والتوجيه المحاسبي والتأثير المالي"
                >
                  <HelpCircle className="w-4 h-4 text-amber-300 animate-bounce" />
                  <span>💡 مساعد الحقول وإرشادات Odoo</span>
                </button>

                <button
                  onClick={() => handleExplainJournalWithAi(currentRecord)}
                  className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-purple-600/30 to-indigo-600/30 hover:from-amber-500/30 hover:to-indigo-600/40 text-amber-200 border border-amber-400/40 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-105"
                  title="شرح المنطق المحاسبي لهذا القيد بواسطة Gemini AI"
                >
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>شرح المساعد ✨</span>
                </button>

                <button
                  onClick={() => handleOpenPrintModal(currentRecord)}
                  className="px-3.5 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 border border-purple-400/40 text-purple-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                  title="معاينة وطباعة سند القيد الرسمي"
                >
                  <Printer className="w-4 h-4 text-purple-300" />
                  <span>سند القيد (طباعة) 🖨️</span>
                </button>

                <button
                  onClick={() => handleExportCSV([currentRecord])}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                  title="تصدير هذا القيد لملف Excel/CSV"
                >
                  <Download className="w-4 h-4 text-emerald-300" />
                  <span>تصدير Excel 📊</span>
                </button>
              </div>

              {/* Odoo Pagination Controls */}
              <div className="flex items-center gap-3 dir-ltr">
                <span className="text-xs text-slate-400 font-mono font-bold">
                  {activeEntryIndex + 1} / {entries.length}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={activeEntryIndex === 0}
                    onClick={() => loadEntry(activeEntryIndex - 1)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={activeEntryIndex >= entries.length - 1}
                    onClick={() => loadEntry(activeEntryIndex + 1)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Status Ribbon Pill */}
                <div className="flex items-center rounded-lg overflow-hidden border border-white/10 text-[11px] font-black">
                  <span className={`px-2.5 py-1 ${status === "draft" ? "bg-amber-500 text-slate-950" : "bg-white/5 text-slate-500"}`}>Draft</span>
                  <span className={`px-2.5 py-1 ${status === "posted" ? "bg-emerald-500 text-slate-950" : "bg-white/5 text-slate-500"}`}>Posted</span>
                  <span className={`px-2.5 py-1 ${status === "cancelled" ? "bg-red-500 text-white" : "bg-white/5 text-slate-500"}`}>Cancelled</span>
                </div>
              </div>
            </div>

            {/* ODOO FORM SHEET PAPER WRAPPER */}
            <div className="bg-[#120B1A] border-2 border-purple-500/40 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* UNBALANCED SAVE BLOCKER WARNING BANNER */}
              {showUnbalancedWarning && !isBalanced && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-red-600/30 via-red-500/20 to-amber-500/20 border-2 border-red-500/60 text-red-100 flex flex-wrap items-center justify-between gap-3 shadow-2xl animate-shake">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-red-500 text-white font-black animate-bounce shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="text-xs sm:text-sm font-bold space-y-0.5">
                      <p className="text-white font-black text-sm flex items-center gap-1.5">
                        <span>🚨 تم منع الحفظ: القيد المحاسبي غير متوازن!</span>
                      </p>
                      <p className="text-red-200">
                        مجموع المدين (<b className="font-mono text-white">{totalDebit.toLocaleString("ar-EG")} ج.م</b>) لا يساوي مجموع الدائن (<b className="font-mono text-white">{totalCredit.toLocaleString("ar-EG")} ج.م</b>). الفرق المتبقي:{" "}
                        <span className="font-mono font-black text-amber-300 underline text-sm">{difference.toLocaleString("ar-EG")} ج.م</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleAutoBalance}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 font-black text-xs shrink-0 cursor-pointer transition-all hover:scale-105 shadow-md flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>موازنة تلقائية ⚡</span>
                  </button>
                </div>
              )}

              {/* Document Header Name */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-purple-300 font-bold uppercase tracking-widest block">
                    سند اليومية (Journal Entry)
                  </span>
                  <input
                    type="text"
                    value={voucherNo}
                    onChange={(e) => setVoucherNo(e.target.value)}
                    disabled={status === "posted"}
                    className="text-2xl sm:text-3xl font-black text-white bg-transparent outline-none border-b border-dashed border-purple-400/40 focus:border-purple-300 font-mono tracking-tight"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">ميزان القيد:</span>
                  <span className={`px-3 py-1 rounded-xl text-xs font-black border font-mono ${
                    isBalanced
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse"
                  }`}>
                    {isBalanced ? "✓ متوازن (0.00 ج.م)" : `⚠️ فارق: ${difference.toLocaleString("ar-EG")} ج.م`}
                  </span>
                </div>
              </div>

              {/* Document Form Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold block">دفتر اليومية (Journal):</label>
                  <select
                    value={journalType}
                    onChange={(e) => setJournalType(e.target.value)}
                    disabled={status === "posted"}
                    className="w-full bg-[#09050d] border border-white/10 rounded-xl px-3 py-2 text-white font-bold outline-none focus:border-purple-400"
                  >
                    <option value="Miscellaneous Operations (عمليات متنوعة)">Miscellaneous Operations (عمليات متنوعة)</option>
                    <option value="Customer Invoices (فواتير عملاء)">Customer Invoices (فواتير عملاء)</option>
                    <option value="Vendor Bills (فواتير موردين)">Vendor Bills (فواتير موردين)</option>
                    <option value="Bank (البنك)">Bank (البنك)</option>
                    <option value="Cash (الصندوق الخزينة)">Cash (الصندوق الخزينة)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold block">الشريك / المتعامل (Partner):</label>
                  <input
                    type="text"
                    value={partner}
                    onChange={(e) => setPartner(e.target.value)}
                    disabled={status === "posted"}
                    placeholder="اسم الشريك"
                    className="w-full bg-[#09050d] border border-white/10 rounded-xl px-3 py-2 text-white font-bold outline-none focus:border-purple-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold block">المرجع المستندي (Reference):</label>
                  <input
                    type="text"
                    value={referenceDoc}
                    onChange={(e) => setRefDoc(e.target.value)}
                    disabled={status === "posted"}
                    placeholder="رقم الفاتورة أو المرجع"
                    className="w-full bg-[#09050d] border border-white/10 rounded-xl px-3 py-2 text-white font-bold outline-none focus:border-purple-400 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 font-bold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>تاريخ القيد (Accounting Date):</span>
                    </label>
                    {status !== "posted" && (
                      <button
                        type="button"
                        onClick={() => {
                          playSound.click();
                          setDate(new Date().toISOString().split("T")[0]);
                        }}
                        className="text-[10px] text-purple-300 hover:text-white font-bold cursor-pointer underline px-1 py-0.5 rounded hover:bg-purple-500/20 transition-colors"
                        title="تعيين تاريخ اليوم الحالي"
                      >
                        تاريخ اليوم
                      </button>
                    )}
                  </div>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={status === "posted"}
                    className="w-full bg-[#09050d] border border-purple-500/30 rounded-xl px-3 py-2 text-white font-bold outline-none focus:border-purple-400 font-mono transition-colors"
                  />
                </div>
              </div>

              {/* ODOO NOTEBOOK TABS */}
              <div className="border-t border-white/10 pt-4 space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
                  <button
                    onClick={() => setActiveFormTab("items")}
                    className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeFormTab === "items"
                        ? "bg-[#714B67] text-white shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Layers className="w-4 h-4 text-purple-300" />
                    <span>بنود القيد (Journal Items)</span>
                  </button>

                  <button
                    onClick={() => setActiveFormTab("explanation")}
                    className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeFormTab === "explanation"
                        ? "bg-amber-600 text-white shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Lightbulb className="w-4 h-4 text-amber-300" />
                    <span>الشرح التعليمي القيد 🎓</span>
                  </button>

                  <button
                    onClick={() => setActiveFormTab("gl")}
                    className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeFormTab === "gl"
                        ? "bg-emerald-600 text-white shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
                    <span>الأستاذ العام (General Ledger)</span>
                  </button>
                </div>

                {/* TAB CONTENT: JOURNAL ITEMS TABLE */}
                {activeFormTab === "items" && (
                  <div className="space-y-3">
                    {/* REAL-TIME AUTO-BALANCE VERIFICATION BANNER */}
                    <div
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 flex flex-wrap items-center justify-between gap-3 ${
                        isBalanced
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-200 shadow-lg shadow-emerald-950/20"
                          : "bg-gradient-to-r from-red-500/20 via-red-600/15 to-amber-500/20 border-red-500/50 text-red-100 shadow-xl shadow-red-950/40"
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <div
                          className={`p-2.5 rounded-2xl font-black shrink-0 ${
                            isBalanced ? "bg-emerald-500 text-slate-950 shadow-md" : "bg-red-500 text-white shadow-md animate-bounce"
                          }`}
                        >
                          <Scale className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-black text-sm text-white">التحقق التلقائي من توازن القيد (Debits == Credits):</span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-black ${
                                isBalanced
                                  ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/40"
                                  : "bg-red-400/30 text-red-200 border border-red-400/50"
                              }`}
                            >
                              {isBalanced ? "✓ القيد متوازن" : "⚠️ غير متوازن"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-200 font-medium leading-relaxed">
                            {isBalanced ? (
                              <span>
                                ممتاز! مجموع المدين (<b className="text-red-400 font-mono font-bold">{totalDebit.toLocaleString("ar-EG")} ج.م</b>) يساوي تماماً مجموع الدائن (<b className="text-emerald-400 font-mono font-bold">{totalCredit.toLocaleString("ar-EG")} ج.م</b>). القيد جاهز للحفظ والاعتماد.
                              </span>
                            ) : (
                              <span>
                                تنبيه مرئي أثناء الكتابة: مجموع المدين (<b className="text-red-400 font-mono font-bold">{totalDebit.toLocaleString("ar-EG")} ج.م</b>) لا يطابق مجموع الدائن (<b className="text-emerald-400 font-mono font-bold">{totalCredit.toLocaleString("ar-EG")} ج.م</b>). الفرق غير المتوازن = <b className="text-amber-300 font-mono font-bold text-sm underline">{difference.toLocaleString("ar-EG")} ج.م</b>.
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {!isBalanced && status !== "posted" && (
                        <button
                          onClick={handleAutoBalance}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer hover:scale-105 shrink-0"
                          title="موازنة القيد تلقائياً بإضافة سطر فارق"
                        >
                          <Sparkles className="w-4 h-4 text-slate-950" />
                          <span>موازنة تلقائية الآن ⚡</span>
                        </button>
                      )}
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#08050e]">
                      <table className="w-full text-right text-xs">
                        <thead className="bg-[#1e1329] text-purple-200 font-black border-b border-white/10">
                          <tr>
                            <th className="p-3 w-8 text-center">#</th>
                            <th className="p-3 min-w-[250px]">الحساب (Account Autocomplete)</th>
                            <th className="p-3 min-w-[130px]">الشريك (Partner)</th>
                            <th className="p-3 min-w-[180px]">البيان (Label)</th>
                            <th className="p-3 min-w-[150px]">مركز التكلفة (Analytic)</th>
                            <th className="p-3 min-w-[130px]">الضريبة (Tax)</th>
                            <th className="p-3 min-w-[110px] text-left text-red-400">مدين (Debit)</th>
                            <th className="p-3 min-w-[110px] text-left text-emerald-400">دائن (Credit)</th>
                            <th className="p-3 w-10 text-center">حذف</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-bold text-slate-200">
                          <AnimatePresence initial={false}>
                            {items.map((item, idx) => (
                              <motion.tr
                                key={item.id}
                                initial={{ opacity: 0, y: -12, backgroundColor: "rgba(168, 85, 247, 0.25)" }}
                                animate={{ opacity: 1, y: 0, backgroundColor: "rgba(0, 0, 0, 0)" }}
                                exit={{ opacity: 0, x: -20, height: 0 }}
                                transition={{ duration: 0.35, ease: "easeOut" }}
                                className="hover:bg-purple-500/5 transition-colors"
                              >
                                <td className="p-2.5 text-center text-slate-500 font-mono text-[11px]">{idx + 1}</td>
                                
                                <td className="p-2">
                                  <AccountAutocompleteInput
                                    value={item.accountCode}
                                    onChange={(newCode) => handleUpdateItem(item.id, "accountCode", newCode)}
                                    disabled={status === "posted"}
                                    accounts={accountsList}
                                  />
                                </td>

                                <td className="p-2">
                                  <input
                                    type="text"
                                    value={item.partner}
                                    onChange={(e) => handleUpdateItem(item.id, "partner", e.target.value)}
                                    disabled={status === "posted"}
                                    className="w-full bg-[#120b1a] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-purple-400"
                                  />
                                </td>

                                <td className="p-2">
                                  <input
                                    type="text"
                                    value={item.label}
                                    onChange={(e) => handleUpdateItem(item.id, "label", e.target.value)}
                                    disabled={status === "posted"}
                                    className="w-full bg-[#120b1a] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-purple-400"
                                  />
                                </td>

                                <td className="p-2">
                                  <select
                                    value={item.analyticAccount}
                                    onChange={(e) => handleUpdateItem(item.id, "analyticAccount", e.target.value)}
                                    disabled={status === "posted"}
                                    className="w-full bg-[#120b1a] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-purple-400"
                                  >
                                    {ANALYTIC_ACCOUNTS.map((cc, cIdx) => (
                                      <option key={cIdx} value={cc}>{cc}</option>
                                    ))}
                                  </select>
                                </td>

                                <td className="p-2">
                                  <select
                                    value={item.tax}
                                    onChange={(e) => handleUpdateItem(item.id, "tax", e.target.value)}
                                    disabled={status === "posted"}
                                    className="w-full bg-[#120b1a] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-purple-400"
                                  >
                                    {TAX_OPTIONS.map((tx, tIdx) => (
                                      <option key={tIdx} value={tx}>{tx}</option>
                                    ))}
                                  </select>
                                </td>

                                <td className="p-2 text-left">
                                  <input
                                    type="number"
                                    value={item.debit === 0 ? "" : item.debit}
                                    placeholder="0.00"
                                    onChange={(e) => handleUpdateItem(item.id, "debit", Number(e.target.value) || 0)}
                                    disabled={status === "posted"}
                                    className="w-24 bg-[#120b1a] border border-red-500/30 rounded-lg px-2 py-1.5 text-xs text-red-300 font-mono font-black text-left outline-none focus:border-red-400"
                                  />
                                </td>

                                <td className="p-2 text-left">
                                  <input
                                    type="number"
                                    value={item.credit === 0 ? "" : item.credit}
                                    placeholder="0.00"
                                    onChange={(e) => handleUpdateItem(item.id, "credit", Number(e.target.value) || 0)}
                                    disabled={status === "posted"}
                                    className="w-24 bg-[#120b1a] border border-emerald-500/30 rounded-lg px-2 py-1.5 text-xs text-emerald-300 font-mono font-black text-left outline-none focus:border-emerald-400"
                                  />
                                </td>

                                <td className="p-2 text-center">
                                  {status !== "posted" && (
                                    <button
                                      onClick={() => handleRemoveLine(item.id)}
                                      className="p-1 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </td>
                              </motion.tr>
                            ))}
                          </AnimatePresence>
                        </tbody>

                        <tfoot className="bg-[#180f24] font-black border-t border-purple-500/30 text-white">
                          <tr>
                            <td colSpan={6} className="p-3 text-right">
                              <span>الإجمالي العام (Total):</span>
                            </td>
                            <td className="p-3 text-left font-mono text-sm text-red-400 bg-red-500/10">
                              {totalDebit.toLocaleString("ar-EG")} ج.م
                            </td>
                            <td className="p-3 text-left font-mono text-sm text-emerald-400 bg-emerald-500/10">
                              {totalCredit.toLocaleString("ar-EG")} ج.م
                            </td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {status !== "posted" && (
                      <button
                        onClick={handleAddLine}
                        className="text-xs font-bold text-purple-300 hover:text-purple-200 flex items-center gap-1.5 cursor-pointer py-1"
                      >
                        <Plus className="w-4 h-4 text-purple-400" />
                        <span>إضافة سطر جديد (Add a line)</span>
                      </button>
                    )}
                  </div>
                )}

                {/* TAB CONTENT: EDUCATIONAL EXPLANATION */}
                {activeFormTab === "explanation" && (
                  <div className="bg-[#191126] p-4 rounded-2xl border border-amber-500/30 space-y-4 text-xs leading-relaxed">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2 text-amber-300 font-black text-sm">
                        <Lightbulb className="w-5 h-5 text-amber-400" />
                        <span>التوجيه والتحليل المحاسبي لهذا القيد (Accounting Logic):</span>
                      </div>

                      <button
                        onClick={() => handleExplainJournalWithAi(currentRecord)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-purple-600/30 to-indigo-600/30 hover:from-amber-500/30 hover:to-indigo-600/40 text-amber-200 border border-amber-400/40 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all hover:scale-102"
                      >
                        <Sparkles className="w-4 h-4 text-amber-400 animate-bounce" />
                        <span>شرح المساعد المحاسبي (Gemini AI) ✨</span>
                      </button>
                    </div>

                    <p className="text-slate-200 text-sm font-medium">
                      {explanationText || "يقوم هذا القيد بإثبات العملية المالية وتوزيع التأثير على عناصر القوائم المالية بفرادي الحسابات."}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 space-y-1">
                        <span className="font-bold text-red-300 block">جانب المدين (Debit Items):</span>
                        <ul className="list-disc list-inside text-slate-300 space-y-1">
                          {items.filter(i => i.debit > 0).map(i => (
                            <li key={i.id}>
                              <span className="font-bold text-white">{i.accountName}</span>: زيادات في الأصول أو المصروفات بمبلغ <span className="font-mono font-bold text-red-300">{i.debit.toLocaleString("ar-EG")} ج.م</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                        <span className="font-bold text-emerald-300 block">جانب الدائن (Credit Items):</span>
                        <ul className="list-disc list-inside text-slate-300 space-y-1">
                          {items.filter(i => i.credit > 0).map(i => (
                            <li key={i.id}>
                              <span className="font-bold text-white">{i.accountName}</span>: زيادات في الإيرادات أو التزامات بمبلغ <span className="font-mono font-bold text-emerald-300">{i.credit.toLocaleString("ar-EG")} ج.م</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: GENERAL LEDGER IMPACT */}
                {activeFormTab === "gl" && (
                  <div className="bg-[#0b101c] p-4 rounded-2xl border border-emerald-500/30 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-300 font-black text-sm">
                        <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                        <span>تأثير الترحيل الفوري على دفتر الأستاذ العام (General Ledger Audit):</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                        status === "posted" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      }`}>
                        {status === "posted" ? "حركة معتمدة ومرحلة" : "في انتظار الاعتماد والترحيل"}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {items.map((it) => (
                        <div key={it.id} className="p-3 rounded-xl bg-[#12192a] border border-white/5 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-mono font-black text-purple-300 block">{it.accountCode} - {it.accountName}</span>
                            <span className="text-[11px] text-slate-400">{it.label} ({it.analyticAccount})</span>
                          </div>
                          <div className="text-left font-mono font-black">
                            {it.debit > 0 && <span className="text-red-400 block">+ {it.debit.toLocaleString("ar-EG")} ج.م (مدين)</span>}
                            {it.credit > 0 && <span className="text-emerald-400 block">+ {it.credit.toLocaleString("ar-EG")} ج.م (دائن)</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* BOTTOM SAVE & ACTION FOOTER SECTION */}
              <div className="pt-6 border-t-2 border-dashed border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl border transition-all ${
                    saveSuccess 
                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 animate-pulse" 
                      : "bg-purple-500/10 border-purple-500/30 text-purple-300"
                  }`}>
                    <Save className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-white">حفظ وتوثيق القيد المحاسبي في أودو</h4>
                      {lastSavedTime && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-mono border border-emerald-500/30">
                          آخر حفظ: {lastSavedTime}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      احفظ التعديلات الحالية في سجلات Odoo للرجوع إليها أو تعديل البنود لاحقاً
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={handleSaveEntry}
                    disabled={isSaving}
                    className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2.5 border ${
                      saveSuccess
                        ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white border-emerald-400/80 shadow-emerald-600/40 ring-4 ring-emerald-500/30 scale-105"
                        : isSaving
                        ? "bg-purple-900/80 text-purple-200 border-purple-500/40 cursor-wait opacity-90"
                        : "bg-gradient-to-r from-purple-700 via-purple-800 to-indigo-800 hover:from-purple-600 hover:to-indigo-700 text-white border-purple-400/50 shadow-purple-900/50 hover:-translate-y-0.5"
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-purple-200" />
                        <span>جاري حفظ القيد في Odoo...</span>
                      </>
                    ) : saveSuccess ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-200 animate-bounce" />
                        <span>تم حفظ القيد بنجاح! ✓</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 text-purple-300" />
                        <span>حفظ القيد المحاسبي (Save Entry)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </>
      )}

      {/* FLOATING ODOO CHATTER & AI ASSISTANT TRIGGER BUTTON */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => { playSound.click(); setIsChatterOpen(!isChatterOpen); }}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#714B67] via-[#8F5982] to-[#00A09D] text-white font-black text-xs sm:text-sm shadow-2xl shadow-purple-900/80 border-2 border-white/20 transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
          title="فتح/إغلاق Odoo Chatter & AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300 animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#120a1c] animate-pulse" />
          </div>
          <span className="font-black text-xs sm:text-sm">Odoo Chatter & AI</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-mono">
            {chatMessages.length}
          </span>
        </button>
      </div>

      {/* ODOO CHATTER & AI ASSISTANT FLOATING MODAL DRAWER */}
      {isChatterOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex justify-start sm:justify-end p-2 sm:p-4 animate-fadeIn dir-rtl text-right">
          <div className="w-full max-w-lg sm:max-w-md h-full max-h-[92vh] my-auto bg-[#171022] border-2 border-[#714B67] rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between relative overflow-hidden space-y-4">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#714B67]/20 rounded-full blur-2xl pointer-events-none" />

            {/* Odoo Chatter Drawer Header */}
            <div className="space-y-3 border-b border-white/10 pb-3 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#714B67] to-[#00A09D] flex items-center justify-center text-white shadow-md">
                    <Bot className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <span>Odoo Chatter & AI Assistant</span>
                      <span className="bg-[#00A09D]/20 text-cyan-300 border border-[#00A09D]/40 text-[9px] font-black px-1.5 py-0.5 rounded">
                        v17 Live
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">المساعد المحاسبي الذكي وشات أودو التفاعلي</p>
                  </div>
                </div>

                <button
                  onClick={() => { playSound.click(); setIsChatterOpen(false); }}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center font-black text-sm cursor-pointer transition-colors"
                  title="إغلاق الشات"
                >
                  ✕
                </button>
              </div>

              {/* Chatter Navigation Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-[#0c0714] p-1 rounded-2xl border border-white/10 text-[11px] font-black">
                <button
                  type="button"
                  onClick={() => setChatterTab("chat")}
                  className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    chatterTab === "chat"
                      ? "bg-[#714B67] text-white shadow-md font-black"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>شات أودو</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChatterTab("notes")}
                  className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    chatterTab === "notes"
                      ? "bg-[#714B67] text-white shadow-md font-black"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>ملاحظات ({chatterNotes.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChatterTab("scenarios")}
                  className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    chatterTab === "scenarios"
                      ? "bg-[#714B67] text-white shadow-md font-black"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>تمارين Odoo</span>
                </button>
              </div>
            </div>

            {/* CHATTER DRAWER BODY */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3 relative z-10">
              {/* CHATTER TAB 1: ODOO INTERACTIVE AI CHAT */}
              {chatterTab === "chat" && (
                <div className="space-y-3">
                  {/* Quick Suggestions Chips */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-purple-300 block">أسئلة محاسبية مقترحة:</span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSendOdooChatMessage(undefined, "اشرح لي المنطق المحاسبي للقيد المعروض حالياً بكافة تفاصيله")}
                        className="px-2.5 py-1 rounded-lg bg-[#211536] hover:bg-[#2d1c4a] border border-[#714B67]/40 text-[10px] text-purple-200 font-bold transition-all cursor-pointer text-right"
                      >
                        💡 اشرح القيد الحالي
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendOdooChatMessage(undefined, "كيف أسجل فاتورة مبيعات آجل مع ضريبة القيمة المضافة 14% في أودو؟")}
                        className="px-2.5 py-1 rounded-lg bg-[#211536] hover:bg-[#2d1c4a] border border-[#714B67]/40 text-[10px] text-purple-200 font-bold transition-all cursor-pointer text-right"
                      >
                        🧾 فاتورة مبيعات + ضريبة
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendOdooChatMessage(undefined, "كيف أتحقق من توازن القيد وطريقة ربط حساب بمركز تكلفة بأودو؟")}
                        className="px-2.5 py-1 rounded-lg bg-[#211536] hover:bg-[#2d1c4a] border border-[#714B67]/40 text-[10px] text-purple-200 font-bold transition-all cursor-pointer text-right"
                      >
                        ⚖️ توازن القيد ومراكز التكلفة
                      </button>
                    </div>
                  </div>

                  {/* Messages Feed Container */}
                  <div className="space-y-3 max-h-72 sm:max-h-80 overflow-y-auto pr-1 text-xs">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-2xl space-y-1.5 transition-all ${
                          msg.sender === "user"
                            ? "bg-[#25183a] border border-purple-400/30 text-white mr-4"
                            : "bg-[#0f0a17] border border-[#714B67]/40 text-slate-200 ml-1"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-1.5">
                            {msg.sender === "odoo_ai" ? (
                              <span className="font-black text-cyan-300 flex items-center gap-1">
                                <Bot className="w-3 h-3 text-[#00A09D]" />
                                <span>مساعد Odoo الذكي</span>
                              </span>
                            ) : (
                              <span className="font-black text-purple-300 flex items-center gap-1">
                                <User className="w-3 h-3 text-purple-400" />
                                <span>المحاسب (أنت)</span>
                              </span>
                            )}
                          </div>
                          <span className="text-slate-500 font-mono">{msg.time}</span>
                        </div>

                        <p className="whitespace-pre-line leading-relaxed text-xs font-sans">
                          {msg.text}
                        </p>

                        {msg.sender === "odoo_ai" && (
                          <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                            <button
                              type="button"
                              onClick={() => toggleSpeechAi(msg.text)}
                              className="text-[10px] text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Volume2 className="w-3 h-3" />
                              <span>استماع</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}

                    {isChatLoading && (
                      <div className="p-3 rounded-2xl bg-[#0f0a17] border border-[#714B67]/40 text-purple-300 text-xs flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-[#00A09D]" />
                        <span>جاري تحليل استفسارك في Odoo AI...</span>
                      </div>
                    )}
                  </div>

                  {/* Input & Send Form */}
                  <form onSubmit={handleSendOdooChatMessage} className="space-y-2 pt-1 border-t border-white/10">
                    <div className="relative">
                      <textarea
                        rows={2}
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendOdooChatMessage();
                          }
                        }}
                        placeholder="اسأل مساعد Odoo الذكي عن أي قيد أو حساب..."
                        className="w-full bg-[#0c0714] border border-[#714B67]/50 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-[#00A09D] transition-colors resize-none"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isChatLoading || !chatInput.trim()}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#714B67] to-[#00A09D] hover:opacity-90 disabled:opacity-40 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                    >
                      {isChatLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>جاري التفكير...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>إرسال لمساعد Odoo</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* CHATTER TAB 2: AUDIT LOG NOTES */}
              {chatterTab === "notes" && (
                <div className="space-y-3">
                  <form onSubmit={handleAddChatterNote} className="space-y-2">
                    <textarea
                      rows={2}
                      value={newNoteInput}
                      onChange={(e) => setNewNoteInput(e.target.value)}
                      placeholder="أضف ملاحظة توثيقية أو توجيه على هذا القيد..."
                      className="w-full bg-[#0c0714] border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-400"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 rounded-xl bg-[#714B67]/40 hover:bg-[#714B67]/70 border border-[#714B67]/60 text-purple-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>تسجيل ملاحظة (Log Note)</span>
                    </button>
                  </form>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {chatterNotes.map((note) => (
                      <div key={note.id} className="p-3 rounded-2xl bg-[#0e0817] border border-white/5 space-y-1 text-xs">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-purple-300">{note.user}</span>
                          <span className="text-slate-500 font-mono">{note.time}</span>
                        </div>
                        <p className="text-slate-300 leading-snug whitespace-pre-line">{note.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CHATTER TAB 3: ODOO SCENARIOS & EXERCISES */}
              {chatterTab === "scenarios" && (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  <div className="p-2.5 rounded-xl bg-[#211536] border border-purple-500/30 text-[11px] text-purple-200 font-bold">
                    اختر تمرين عملي لتحميله مباشرة في شاشة أودو:
                  </div>

                  {INITIAL_ENTRIES.map((rec, i) => (
                    <div
                      key={rec.id}
                      className="w-full text-right p-3 rounded-2xl bg-[#0e0817] hover:bg-[#1f152f] border border-white/10 transition-all group flex flex-col justify-between gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-black text-purple-300 bg-[#714B67]/30 px-2 py-0.5 rounded border border-[#714B67]/50">
                          {rec.name}
                        </span>
                        <span className="text-[10px] text-slate-400">{rec.journal.split(" ")[0]}</span>
                      </div>

                      <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                        {rec.partner}
                      </span>

                      <div className="flex items-center gap-1.5 pt-1 border-t border-white/5">
                        <button
                          type="button"
                          onClick={() => {
                            loadEntry(i);
                            setIsChatterOpen(false);
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-[#714B67] hover:bg-[#5a3b52] text-white text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-sm"
                        >
                          <Eye className="w-3 h-3 text-white" />
                          <span>تحميل في القيد</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleExplainJournalWithAi(rec)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 text-[11px] font-bold text-amber-200 flex items-center gap-1 cursor-pointer transition-all"
                          title="شرح المنطق المحاسبي لهذا القيد"
                        >
                          <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                          <span>شرح المساعد</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* MAIN SECTION TAB 2: ODOO PRACTICE & QUIZ LAB (اتعلم قيود أودو - شاشة مستقلة) */}
      {mainSectionTab === "practice" && (
        <div className={`space-y-6 animate-fadeIn ${
          isPracticeFullscreen 
            ? "fixed inset-0 z-50 overflow-y-auto bg-[#0A0612] p-4 sm:p-8 dir-rtl text-right min-h-screen" 
            : "relative"
        }`}>
          {/* Practice Header Banner */}
          <div className="bg-gradient-to-r from-[#1E132D] via-[#2A1B3D] to-[#170E24] border-2 border-[#714B67] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-tr from-[#714B67] to-[#00A09D] text-white font-black shadow-lg">
                  <Sparkles className="w-7 h-7 text-amber-300 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white">اتعلم قيود أودو (Odoo Practice Lab)</h2>
                    <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-black px-2.5 py-0.5 rounded-full">
                      شاشة تمارين مستقلة
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300">
                    اختر التمرين وسجّل القيد بنفسك في استمارة أودو. عند ارتكاب أي خطأ، يُبيّن لك النظام موقع الخطأ بالتحديد والتفسير العلمي وفق المعايير!
                  </p>
                </div>
              </div>

              {/* Fullscreen & Scenario Switcher Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    playSound.click();
                    setIsPracticeFullscreen(!isPracticeFullscreen);
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 text-purple-200 font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                  title="توسيع الشاشة بالكامل للتمرين بدون تشتيت"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isPracticeFullscreen ? "إغلاق الشاشة الكاملة ✕" : "عرض في شاشة كاملة 🖥️"}</span>
                </button>

                {/* Practice Scenario Switcher Pills */}
                <div className="flex items-center gap-1.5 bg-[#120a1c] p-1.5 rounded-2xl border border-white/10 overflow-x-auto">
                  {ODOO_PRACTICE_SCENARIOS.map((sc, idx) => (
                    <button
                      key={sc.id}
                      onClick={() => {
                        playSound.click();
                        setPracticeIndex(idx);
                        setPracticeCheckFeedback(null);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                        practiceIndex === idx
                          ? "bg-[#714B67] text-white shadow-lg shadow-purple-900/50 ring-1 ring-white/30"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span>{sc.title.split(":")[0]}</span>
                      <span className="mr-1 text-[10px] opacity-80">({sc.difficulty})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Scenario Card Details */}
            {(() => {
              const activeScenario = ODOO_PRACTICE_SCENARIOS[practiceIndex];
              return (
                <div className="p-4 rounded-2xl bg-[#140b21] border border-purple-500/30 space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center justify-between font-black">
                    <span className="text-amber-300 text-sm flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      <span>{activeScenario.title}</span>
                    </span>
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30 text-xs">
                      {activeScenario.difficulty}
                    </span>
                  </div>
                  <p className="text-slate-200 leading-relaxed font-bold">
                    📝 <b>المطلوب:</b> {activeScenario.story}
                  </p>
                  <p className="text-cyan-300 text-xs">
                    🎯 <b>الهدف:</b> {activeScenario.goalDescription}
                  </p>
                </div>
              );
            })()}
          </div>

          {/* Practice Interactive Odoo Sheet Container */}
          <div className="bg-[#150F21] border-2 border-[#714B67] rounded-3xl p-5 sm:p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-black text-white">استمارة قيد اليومية (Odoo Practice Entry Form)</h3>
              </div>
              <button
                onClick={handleAddPracticeLine}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 text-purple-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة سطر قيد</span>
              </button>
            </div>

            {/* Practice Journal Items Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0d0717]">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-[#1a0e2e] text-slate-300 font-black border-b border-white/10">
                    <th className="p-3 w-10 text-center">#</th>
                    <th className="p-3 min-w-[200px]">الحساب المحاسبي (Account)</th>
                    <th className="p-3 min-w-[150px]">الشرح / البيان (Label)</th>
                    <th className="p-3 w-32 text-center">مدين (Debit)</th>
                    <th className="p-3 w-32 text-center">دائن (Credit)</th>
                    <th className="p-3 w-12 text-center">حذف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {practiceItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-purple-500/10 transition-colors">
                      <td className="p-3 text-center font-mono text-slate-400">{index + 1}</td>
                      <td className="p-2">
                        <AccountAutocompleteInput
                          value={item.accountCode}
                          accounts={accountsList}
                          onChange={(code) => {
                            setPracticeItems((prev) =>
                              prev.map((pi) => {
                                if (pi.id !== item.id) return pi;
                                const acc = accountsList.find((a) => a.code === code);
                                return {
                                  ...pi,
                                  accountCode: code,
                                  accountName: acc ? acc.name : pi.accountName,
                                  accountType: acc ? (acc.type as any) : pi.accountType
                                };
                              })
                            );
                          }}
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPracticeItems((prev) =>
                              prev.map((pi) => (pi.id === item.id ? { ...pi, label: val } : pi))
                            );
                          }}
                          className="w-full bg-[#180f29] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-purple-400"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={item.debit || ""}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setPracticeItems((prev) =>
                              prev.map((pi) => (pi.id === item.id ? { ...pi, debit: val } : pi))
                            );
                          }}
                          placeholder="0"
                          className="w-full bg-[#180f29] border border-emerald-500/30 rounded-xl px-3 py-1.5 text-xs text-center font-mono font-black text-emerald-300 outline-none focus:border-emerald-400"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={item.credit || ""}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setPracticeItems((prev) =>
                              prev.map((pi) => (pi.id === item.id ? { ...pi, credit: val } : pi))
                            );
                          }}
                          placeholder="0"
                          className="w-full bg-[#180f29] border border-cyan-500/30 rounded-xl px-3 py-1.5 text-xs text-center font-mono font-black text-cyan-300 outline-none focus:border-cyan-400"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => {
                            if (practiceItems.length <= 1) return;
                            setPracticeItems((prev) => prev.filter((pi) => pi.id !== item.id));
                          }}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#120721] font-mono font-black text-xs text-slate-200 border-t border-white/10">
                    <td colSpan={3} className="p-3 text-left">مجموع أسطر القيد:</td>
                    <td className="p-3 text-center text-emerald-400">
                      {practiceItems.reduce((s, i) => s + (Number(i.debit) || 0), 0).toLocaleString("ar-EG")} ج.م
                    </td>
                    <td className="p-3 text-center text-cyan-400">
                      {practiceItems.reduce((s, i) => s + (Number(i.credit) || 0), 0).toLocaleString("ar-EG")} ج.م
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Verify & Check Button */}
            <div className="flex justify-center pt-2">
              <button
                onClick={handleVerifyPracticeEntry}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#714B67] via-purple-700 to-[#00A09D] hover:opacity-95 text-white font-black text-sm sm:text-base shadow-xl shadow-purple-900/50 cursor-pointer transition-all hover:scale-105 flex items-center gap-2 border border-purple-400/40"
              >
                <Sparkles className="w-5 h-5 text-amber-300 animate-bounce" />
                <span>التحقق واختبار القيد في أودو (Verify Entry)</span>
              </button>
            </div>

            {/* Feedback & Error Analysis Box */}
            {practiceCheckFeedback && (
              <div className={`p-5 rounded-2xl border-2 space-y-3 animate-fadeIn ${
                practiceCheckFeedback.status === "success"
                  ? "bg-emerald-950/40 border-emerald-500 text-emerald-100"
                  : "bg-red-950/50 border-red-500 text-red-100"
              }`}>
                <div className="flex items-center gap-2 font-black text-base sm:text-lg">
                  {practiceCheckFeedback.status === "success" ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 animate-bounce" />
                  )}
                  <span>{practiceCheckFeedback.message}</span>
                </div>

                <div className="space-y-2 text-xs sm:text-sm leading-relaxed font-sans">
                  <div className="p-3 rounded-xl bg-black/30 border border-white/10 space-y-1">
                    <span className="font-black text-amber-300 flex items-center gap-1.5">
                      <Search className="w-4 h-4 text-amber-300" />
                      <span>أين الخطأ بظبط؟</span>
                    </span>
                    <p className="text-slate-200">{practiceCheckFeedback.whyText}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-black/30 border border-white/10 space-y-1">
                    <span className="font-black text-cyan-300 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-cyan-300" />
                      <span>التفسير المحاسبي والقواعد في Odoo:</span>
                    </span>
                    <p className="text-slate-200 whitespace-pre-line">{practiceCheckFeedback.correctionSteps}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MAIN SECTION TAB 3: ODOO ACCOUNTING GUIDE A-Z (دليل أودو المحاسبي من أ إلى ي) */}
      {mainSectionTab === "guide" && (
        <div className="space-y-6 animate-fadeIn text-right dir-rtl">
          
          {/* Guide Header Banner */}
          <div className="bg-gradient-to-r from-[#1E132D] via-[#2A1B3D] to-[#170E24] border-2 border-[#714B67] rounded-3xl p-6 shadow-2xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-[#714B67] to-[#00A09D] text-white font-black shadow-lg">
                <BookOpen className="w-7 h-7 text-cyan-300" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">دليل أودو المحاسبي الشامل من الألف إلى الياء (Odoo Accounting A-Z)</h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  شرح تفصيلي خطوة بخطوة لمنطق Odoo ERP المحاسبي المعروض وفق معايير المحاسبة الدولية والممارسات العملية.
                </p>
              </div>
            </div>
          </div>

          {/* 7 Modules Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Chapter 1 */}
            <div className="p-5 rounded-2xl bg-[#150d24] border border-purple-500/30 space-y-2 hover:border-[#00A09D] transition-colors shadow-lg">
              <div className="flex items-center gap-2 font-black text-base text-purple-300">
                <span className="w-7 h-7 rounded-xl bg-[#714B67] text-white flex items-center justify-center text-xs">1</span>
                <h3>1. الفلسفة ونواة نظام Odoo المحاسبي</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                يعتمد أودو على محرك قيد مزدوج آلي (Single Ledger & Double Entry System). كل حركة في المبيعات، المخزون، أو المشتريات تولّد قيد محاسبي خلفي تلقائي، بحيث تتطابق ميزانية الشركة لحظياً مع الواقع المالي بدون ترحيل يدوي منفصل.
              </p>
            </div>

            {/* Chapter 2 */}
            <div className="p-5 rounded-2xl bg-[#150d24] border border-purple-500/30 space-y-2 hover:border-[#00A09D] transition-colors shadow-lg">
              <div className="flex items-center gap-2 font-black text-base text-cyan-300">
                <span className="w-7 h-7 rounded-xl bg-[#00A09D] text-white flex items-center justify-center text-xs">2</span>
                <h3>2. دفاتر اليومية (Journals) وتسلسلات الرقم التلقائي</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                ينقسّم أودو العمليات إلى 5 دفاتر محددة:
                <br />• <b>Customer Invoices:</b> فواتير العملاء
                <br />• <b>Vendor Bills:</b> فواتير الموردين
                <br />• <b>Bank / Cash:</b> البنك والصندوق
                <br />• <b>Miscellaneous:</b> العمليات المتنوعة والتسويات
              </p>
            </div>

            {/* Chapter 3 */}
            <div className="p-5 rounded-2xl bg-[#150d24] border border-purple-500/30 space-y-2 hover:border-[#00A09D] transition-colors shadow-lg">
              <div className="flex items-center gap-2 font-black text-base text-amber-300">
                <span className="w-7 h-7 rounded-xl bg-amber-600 text-white flex items-center justify-center text-xs">3</span>
                <h3>3. شجرة الحسابات والربط الآلي لضريبة 14%</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                يحتوي أودو على دليل حسابات مرقم (Chart of Accounts). عند تحديد منتج خاضع لضريبة القيمة المضافة، يحسب أودو 14% تلقائياً ويوجّهها لحساب مصلحة الضرائب الدائنة أو المدينة فور اعتماد القيد.
              </p>
            </div>

            {/* Chapter 4 */}
            <div className="p-5 rounded-2xl bg-[#150d24] border border-purple-500/30 space-y-2 hover:border-[#00A09D] transition-colors shadow-lg">
              <div className="flex items-center gap-2 font-black text-base text-emerald-300">
                <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs">4</span>
                <h3>4. دورة حياة القيد: مسودة (Draft) وترحيل (Posted)</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                • <b>Draft (مسودة):</b> القيد قابل للتعديل والإلغاء وتغيير القيم ولا يؤثر على القوائم المالية المعتمدة.
                <br />• <b>Posted (مرحّل):</b> القيد مغلق والمعتمد ويُرحل فوراً للأستاذ العام وميزان المراجعة والميزانية.
              </p>
            </div>

            {/* Chapter 5 */}
            <div className="p-5 rounded-2xl bg-[#150d24] border border-purple-500/30 space-y-2 hover:border-[#00A09D] transition-colors shadow-lg">
              <div className="flex items-center gap-2 font-black text-base text-indigo-300">
                <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs">5</span>
                <h3>5. المحاسبة التحليلية ومراكز التكلفة (Analytic Accounting)</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                تسمح أودو بربط أسطر القيد بمركز تكلفة (Analytic Account) مثل "الإدارة العامة"، "مشروع أ"، "فرع القاهرة"، مما يعطي تقارير ربحية دقيقة لكل قسم بدون تعقيد شجرة الحسابات.
              </p>
            </div>

            {/* Chapter 6 */}
            <div className="p-5 rounded-2xl bg-[#150d24] border border-purple-500/30 space-y-2 hover:border-[#00A09D] transition-colors shadow-lg">
              <div className="flex items-center gap-2 font-black text-base text-pink-300">
                <span className="w-7 h-7 rounded-xl bg-pink-600 text-white flex items-center justify-center text-xs">6</span>
                <h3>6. التسويات البنكية ومطابقة حسابات المتعاملين (Reconciliation)</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                يقوم أودو بمطابقة الدفعات النقدية مع فواتير البيع والشراء لتقفيل الديون واستخراج تقارير أعمار الديون (Aged Receivables / Payables) بدقة عالية.
              </p>
            </div>

            {/* Chapter 7 */}
            <div className="p-5 rounded-2xl bg-[#150d24] border border-purple-500/30 md:col-span-2 space-y-2 hover:border-[#00A09D] transition-colors shadow-lg">
              <div className="flex items-center gap-2 font-black text-base text-yellow-300">
                <span className="w-7 h-7 rounded-xl bg-yellow-600 text-black font-black flex items-center justify-center text-xs">7</span>
                <h3>7. القوائم والتقارير المالية الختامية (Financial Reports)</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                تنتج القيود المرحّلة تلقائياً: ميزان المراجعة (Trial Balance)، دفتر الأستاذ العام (General Ledger)، قائمة الدخل (Profit & Loss)، والميزانية العمومية (Balance Sheet) التي يمكن تصديرها إلى Excel بنقرة زر!
              </p>
            </div>

          </div>
        </div>
      )}

      {/* MAIN SECTION TAB 4: ODOO CHART OF ACCOUNTS (شجرة الحسابات المحاسبية) */}
      {mainSectionTab === "coa" && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#1E1231] via-[#2A1845] to-[#120B20] border-2 border-purple-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-[#714B67] to-[#00A09D] text-white shadow-lg shadow-purple-900/50">
                  <Grid className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                    <span>شجرة الحسابات (Odoo Chart of Accounts - COA)</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs border border-emerald-500/30 font-bold">
                      دليل إلكتروني ديناميكي
                    </span>
                  </h2>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">
                    إدارة دليل الحسابات الموحد، إضافة حسابات فرعية، ومتابعة الأرصدة الحالية التراكمية الناتجة من القيود المرحّلة تلقائياً.
                  </p>
                </div>
              </div>

              <button
                onClick={() => { playSound.click(); setIsAddAccountModalOpen(true); }}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#714B67] to-[#00A09D] hover:opacity-90 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-purple-900/40 transition-all cursor-pointer hover:scale-105"
              >
                <Plus className="w-4 h-4 text-emerald-300" />
                <span>+ إضافة حساب جديد لشجرة أودو</span>
              </button>
            </div>

            {/* Financial Overview Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { type: "Asset", title: "إجمالي الأصول (Assets)", color: "cyan", icon: Landmark },
                { type: "Liability", title: "إجمالي الخصوم (Liabilities)", color: "amber", icon: Scale },
                { type: "Equity", title: "حقوق الملكية (Equity)", color: "indigo", icon: Building2 },
                { type: "Revenue", title: "إجمالي الإيرادات (Revenue)", color: "emerald", icon: TrendingUp },
                { type: "Expense", title: "إجمالي المصروفات (Expense)", color: "rose", icon: DollarSign },
              ].map((card) => {
                const typeAccounts = accountsList.filter((a) => a.type === card.type);
                const totalTypeBalance = typeAccounts.reduce((sum, acc) => {
                  const balInfo = calculateAccountBalances(acc.code, acc.type, acc.openingBalance);
                  return sum + balInfo.netBalance;
                }, 0);

                const IconComponent = card.icon;

                return (
                  <div
                    key={card.type}
                    onClick={() => { playSound.click(); setCoaTypeFilter(coaTypeFilter === card.type ? "all" : card.type); }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      coaTypeFilter === card.type
                        ? "bg-purple-600/30 border-purple-400 ring-2 ring-purple-400/30 shadow-lg"
                        : "bg-[#110A1A] border-white/10 hover:border-purple-500/40"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="font-bold">{card.title}</span>
                      <IconComponent className="w-4 h-4 text-purple-300" />
                    </div>
                    <div className="text-base font-black font-mono text-white mt-1">
                      {totalTypeBalance.toLocaleString("ar-EG")} <span className="text-[10px] text-slate-400 font-sans">ج.م</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold mt-1">
                      عدد الحسابات: <span className="text-purple-300 font-mono">{typeAccounts.length}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Search & Type Filter Toolbar */}
          <div className="bg-[#150F21] border border-purple-500/20 rounded-2xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Type Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
                <span className="text-slate-400 ml-1">تصفية حسب النوع:</span>
                {[
                  { id: "all", label: "الكل" },
                  { id: "Asset", label: "الأصول (Asset)" },
                  { id: "Liability", label: "الخصوم (Liability)" },
                  { id: "Equity", label: "حقوق الملكية (Equity)" },
                  { id: "Revenue", label: "الإيرادات (Revenue)" },
                  { id: "Expense", label: "المصروفات (Expense)" },
                ].map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => { playSound.click(); setCoaTypeFilter(pill.id); }}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      coaTypeFilter === pill.id
                        ? "bg-gradient-to-r from-[#714B67] to-[#00A09D] text-white shadow-md font-black"
                        : "bg-white/5 hover:bg-white/10 text-slate-300"
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={coaSearchQuery}
                  onChange={(e) => setCoaSearchQuery(e.target.value)}
                  placeholder="ابحث برمز أو اسم الحساب..."
                  className="w-full bg-[#0d0717] border border-white/10 rounded-xl pr-9 pl-3 py-2 text-xs text-white outline-none focus:border-purple-400"
                />
                {coaSearchQuery && (
                  <button
                    onClick={() => setCoaSearchQuery("")}
                    className="absolute left-2.5 top-2.5 text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic Accounts Table */}
          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0d0717] shadow-2xl">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#1C132B] text-purple-200 font-black border-b border-white/10">
                <tr>
                  <th className="p-3.5 w-28">رمز الحساب (Code)</th>
                  <th className="p-3.5 min-w-[220px]">اسم الحساب (Account Name)</th>
                  <th className="p-3.5 w-28 text-center">النوع (Type)</th>
                  <th className="p-3.5 min-w-[140px]">الفئة (Category)</th>
                  <th className="p-3.5 text-left font-mono">الرصيد الافتتاحي</th>
                  <th className="p-3.5 text-left font-mono text-red-300">حركات المدين</th>
                  <th className="p-3.5 text-left font-mono text-emerald-300">حركات الدائن</th>
                  <th className="p-3.5 text-left font-mono text-amber-300">الرصيد التراكمي الحالي</th>
                  <th className="p-3.5 text-center w-28">دفتر الحساب</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-bold text-slate-200">
                {accountsList
                  .filter((acc) => {
                    const matchesQuery =
                      acc.code.includes(coaSearchQuery.trim()) ||
                      acc.name.toLowerCase().includes(coaSearchQuery.toLowerCase().trim()) ||
                      acc.category.toLowerCase().includes(coaSearchQuery.toLowerCase().trim());
                    const matchesType = coaTypeFilter === "all" || acc.type === coaTypeFilter;
                    return matchesQuery && matchesType;
                  })
                  .map((acc) => {
                    const balInfo = calculateAccountBalances(acc.code, acc.type, acc.openingBalance);

                    return (
                      <tr key={acc.code} className="hover:bg-purple-500/10 transition-colors group">
                        <td className="p-3.5 font-mono font-black text-purple-300">
                          <div className="flex items-center gap-1.5">
                            <span>{acc.code}</span>
                            {acc.isCustom && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                                مخصص
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-3.5 text-white font-black text-sm group-hover:text-amber-200 transition-colors">
                          {acc.name}
                        </td>

                        <td className="p-3.5 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black border inline-block ${
                              acc.type === "Asset" ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/30" :
                              acc.type === "Liability" ? "bg-amber-500/20 text-amber-300 border-amber-400/30" :
                              acc.type === "Expense" ? "bg-rose-500/20 text-rose-300 border-rose-400/30" :
                              acc.type === "Revenue" ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30" :
                              "bg-indigo-500/20 text-indigo-300 border-indigo-400/30"
                            }`}
                          >
                            {acc.type}
                          </span>
                        </td>

                        <td className="p-3.5 text-slate-300">{acc.category}</td>

                        <td className="p-3.5 text-left font-mono text-slate-400">
                          {(acc.openingBalance || 0).toLocaleString("ar-EG")} ج.م
                        </td>

                        <td className="p-3.5 text-left font-mono text-red-400">
                          {balInfo.totalDebit.toLocaleString("ar-EG")} ج.م
                        </td>

                        <td className="p-3.5 text-left font-mono text-emerald-400">
                          {balInfo.totalCredit.toLocaleString("ar-EG")} ج.م
                        </td>

                        <td className="p-3.5 text-left font-mono font-black text-amber-300 text-sm">
                          {balInfo.netBalance.toLocaleString("ar-EG")} ج.م
                        </td>

                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => { playSound.click(); setSelectedLedgerAccountCode(acc.code); }}
                              className="px-2.5 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 text-purple-200 text-xs font-black flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
                              title="استخراج كشف حساب تفصيلي لجميع القيود"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-cyan-300" />
                              <span>الكشف ({balInfo.txCount})</span>
                            </button>

                            {acc.isCustom && (
                              <button
                                onClick={() => handleDeleteCustomAccount(acc.code)}
                                className="p-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-300 cursor-pointer"
                                title="حذف الحساب المخصص"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* MODAL: ADD NEW ACCOUNT TO ODOO CHART OF ACCOUNTS */}
      {isAddAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#150d24] border-2 border-purple-500/40 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl shadow-purple-950/80">
            <div className="bg-gradient-to-r from-[#25153a] to-[#12091d] p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-600 text-white">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-white">إضافة حساب جديد لشجرة أودو (Odoo COA)</h3>
              </div>
              <button
                onClick={() => setIsAddAccountModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewAccount} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold">كود / رمز الحساب المحاسبي (Code) *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: 103000"
                  value={newAccountForm.code}
                  onChange={(e) => setNewAccountForm({ ...newAccountForm, code: e.target.value })}
                  className="w-full bg-[#0d0717] border border-white/10 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-purple-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">اسم الحساب (Account Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: البنك العربي الأفريقي الدولي"
                  value={newAccountForm.name}
                  onChange={(e) => setNewAccountForm({ ...newAccountForm, name: e.target.value })}
                  className="w-full bg-[#0d0717] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-400 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">نوع الحساب (Type) *</label>
                  <select
                    value={newAccountForm.type}
                    onChange={(e) => setNewAccountForm({ ...newAccountForm, type: e.target.value as any })}
                    className="w-full bg-[#0d0717] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-400 cursor-pointer font-bold"
                  >
                    <option value="Asset" className="bg-[#120B1A]">أصول (Asset)</option>
                    <option value="Liability" className="bg-[#120B1A]">خصوم (Liability)</option>
                    <option value="Equity" className="bg-[#120B1A]">حقوق ملكية (Equity)</option>
                    <option value="Revenue" className="bg-[#120B1A]">إيرادات (Revenue)</option>
                    <option value="Expense" className="bg-[#120B1A]">مصروفات (Expense)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">الفئة الرئيسية (Category)</label>
                  <input
                    type="text"
                    placeholder="أصول متداولة / خصوم متداولة"
                    value={newAccountForm.category}
                    onChange={(e) => setNewAccountForm({ ...newAccountForm, category: e.target.value })}
                    className="w-full bg-[#0d0717] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">الرصيد الافتتاحي (Opening Balance)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={newAccountForm.openingBalance || ""}
                  onChange={(e) => setNewAccountForm({ ...newAccountForm, openingBalance: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#0d0717] border border-emerald-500/30 rounded-xl px-3 py-2 text-emerald-300 font-mono font-black outline-none focus:border-emerald-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddAccountModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#714B67] to-[#00A09D] hover:opacity-90 text-white font-black cursor-pointer shadow-lg shadow-purple-900/40"
                >
                  حفظ الحساب الآن 💾
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ACCOUNT LEDGER STATEMENT (كشف حساب تفصيلي) */}
      {selectedLedgerAccountCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#120a1f] border-2 border-purple-500/40 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-purple-950/80">
            {(() => {
              const accObj = accountsList.find((a) => a.code === selectedLedgerAccountCode);
              const txs: Array<{ entry: OdooEntryRecord; item: OdooJournalItem }> = [];

              entries.forEach((entry) => {
                if (entry.status === "posted") {
                  entry.items.forEach((item) => {
                    if (item.accountCode === selectedLedgerAccountCode) {
                      txs.push({ entry, item });
                    }
                  });
                }
              });

              let runningBal = accObj?.openingBalance || 0;

              return (
                <>
                  <div className="bg-gradient-to-r from-[#211235] via-[#2d1847] to-[#1a0e2a] p-5 border-b border-purple-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 text-black shadow-lg">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                          <span>دفتر الأستاذ للحساب (General Ledger)</span>
                          <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] border border-cyan-400/30 font-mono">
                            {selectedLedgerAccountCode}
                          </span>
                        </h3>
                        <p className="text-xs text-amber-300 font-bold">
                          {accObj?.name || selectedLedgerAccountCode}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedLedgerAccountCode(null)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-4 bg-[#0b0614] border-b border-white/10 flex flex-wrap items-center justify-between text-xs font-bold text-slate-300">
                    <div>الرصيد الافتتاحي: <span className="font-mono text-purple-300">{(accObj?.openingBalance || 0).toLocaleString("ar-EG")} ج.م</span></div>
                    <div>عدد القيود المرحّلة: <span className="font-mono text-amber-300">{txs.length}</span></div>
                  </div>

                  <div className="overflow-y-auto p-4 flex-1">
                    {txs.length === 0 ? (
                      <div className="py-12 text-center text-slate-400 font-bold space-y-2">
                        <p>لا توجد قيود مرحّلة تؤثر على هذا الحساب حتى الآن.</p>
                        <p className="text-xs text-slate-500">قم بترحيـل (Post) القيود المحاسبية من محاكي أودو لظهر حركاتها هنا تلقائياً.</p>
                      </div>
                    ) : (
                      <table className="w-full text-right text-xs">
                        <thead className="bg-[#1e1333] text-purple-200 font-black border-b border-white/10">
                          <tr>
                            <th className="p-2.5">التاريخ</th>
                            <th className="p-2.5">رقم القيد</th>
                            <th className="p-2.5">المتعامل / الشريك</th>
                            <th className="p-2.5">البيان / الشرح</th>
                            <th className="p-2.5 text-left text-red-400">مدين</th>
                            <th className="p-2.5 text-left text-emerald-400">دائن</th>
                            <th className="p-2.5 text-left text-amber-300">الرصيد التراكمي</th>
                            <th className="p-2.5 text-center">فتح القيد</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-bold text-slate-200">
                          {txs.map(({ entry, item }, idx) => {
                            const d = Number(item.debit) || 0;
                            const c = Number(item.credit) || 0;

                            if (accObj?.type === "Asset" || accObj?.type === "Expense") {
                              runningBal += d - c;
                            } else {
                              runningBal += c - d;
                            }

                            return (
                              <tr key={idx} className="hover:bg-purple-500/10">
                                <td className="p-2.5 font-mono text-slate-400">{entry.date}</td>
                                <td className="p-2.5 font-mono text-purple-300 font-black">{entry.name}</td>
                                <td className="p-2.5 text-white">{item.partner || entry.partner}</td>
                                <td className="p-2.5 text-slate-300">{item.label || entry.explanation}</td>
                                <td className="p-2.5 text-left font-mono text-red-400">{d.toLocaleString("ar-EG")}</td>
                                <td className="p-2.5 text-left font-mono text-emerald-400">{c.toLocaleString("ar-EG")}</td>
                                <td className="p-2.5 text-left font-mono font-black text-amber-300">
                                  {runningBal.toLocaleString("ar-EG")} ج.م
                                </td>
                                <td className="p-2.5 text-center">
                                  <button
                                    onClick={() => {
                                      loadEntry(entries.indexOf(entry));
                                      setMainSectionTab("editor");
                                      setSelectedLedgerAccountCode(null);
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 text-purple-200 text-[11px] font-bold cursor-pointer"
                                  >
                                    معاينة
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>

                  <div className="p-4 bg-[#0d0717] border-t border-purple-500/20 flex justify-end">
                    <button
                      onClick={() => setSelectedLedgerAccountCode(null)}
                      className="px-5 py-2 rounded-xl bg-purple-700 text-white font-bold text-xs cursor-pointer"
                    >
                      إغلاق الكشف
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* AI EXPLANATION MODAL */}
      {aiModalOpen && selectedEntryForAi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#120a1f] border border-purple-500/40 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-purple-950/80">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#211235] via-[#2d1847] to-[#1a0e2a] p-5 border-b border-purple-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-400 to-purple-600 text-black shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <span>شرح المساعد المحاسبي (Gemini AI)</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] border border-amber-400/30">
                      ذكاء اصطناعي
                    </span>
                  </h3>
                  <p className="text-xs text-purple-300 font-medium">
                    تحليل المنطق المحاسبي للقيد: <span className="font-mono font-bold text-amber-300">{selectedEntryForAi.name}</span> ({selectedEntryForAi.partner})
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setAiModalOpen(false);
                  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                  setIsSpeakingAi(false);
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Entry Summary Strip */}
            <div className="bg-[#0b0614] px-5 py-3 border-b border-white/5 flex flex-wrap items-center justify-between text-xs font-bold text-slate-300 gap-2">
              <div className="flex items-center gap-3">
                <span>التاريخ: <b className="text-purple-300">{selectedEntryForAi.date}</b></span>
                <span>•</span>
                <span>الدفتر: <b className="text-purple-300">{selectedEntryForAi.journal.split(" ")[0]}</b></span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span>إجمالي القيد:</span>
                <span className="text-emerald-400 font-black">{selectedEntryForAi.totalDebit.toLocaleString("ar-EG")} ج.م</span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {aiLoading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                    <Sparkles className="w-6 h-6 text-amber-400 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-white text-base">جاري تحليل القيد المحاسبي بواسطة Gemini API...</p>
                    <p className="text-xs text-purple-300">نقوم بتفكيك الطرفين المدين والدائن واستخراج التأثير على القوائم المالية</p>
                  </div>
                </div>
              ) : aiError ? (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                    <span>تعذر جلب الشرح من الذكاء الاصطناعي</span>
                  </div>
                  <p>{aiError}</p>
                  <button
                    onClick={() => handleExplainJournalWithAi(selectedEntryForAi)}
                    className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer mt-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>إعادة المحاولة</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Formatted Explanation Content */}
                  <div className="p-4 rounded-2xl bg-[#190d2e] border border-purple-500/20 whitespace-pre-line leading-relaxed space-y-2">
                    {aiExplanation}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 bg-[#0d0717] border-t border-purple-500/20 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {aiExplanation && !aiLoading && (
                  <>
                    <button
                      onClick={() => toggleSpeechAi(aiExplanation)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 border transition-all cursor-pointer ${
                        isSpeakingAi
                          ? "bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/30"
                          : "bg-purple-600/30 hover:bg-purple-600/50 border-purple-400/40 text-purple-200"
                      }`}
                    >
                      {isSpeakingAi ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
                      <span>{isSpeakingAi ? "إيقاف القراءة الصوتيّة" : "استماع للشرح صوتاً 🔊"}</span>
                    </button>

                    <button
                      onClick={() => copyAiExplanation(aiExplanation)}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedAi ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedAi ? "تم النسخ!" : "نسخ الشرح"}</span>
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                {!aiLoading && selectedEntryForAi && (
                  <button
                    onClick={() => handleExplainJournalWithAi(selectedEntryForAi)}
                    className="px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 text-purple-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-purple-300" />
                    <span>توليد جديد</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setAiModalOpen(false);
                    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                    setIsSpeakingAi(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-bold text-xs cursor-pointer hover:opacity-90 transition-opacity"
                >
                  إغلاق
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* PRINT JOURNAL VOUCHER MODAL */}
      {printModalOpen && entryToPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn print:p-0 print:bg-white print:static">
          <div className="bg-[#150d24] border border-purple-500/40 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto flex flex-col shadow-2xl print:bg-white print:text-black print:border-none print:shadow-none print:max-w-none print:w-full print:rounded-none">
            
            {/* Modal Header Controls (Hidden on Print) */}
            <div className="p-4 bg-[#1e1333] border-b border-purple-500/30 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-black text-white">معاينة وطباعة سند القيد المحاسبي</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة السند الآن 🖨️</span>
                </button>
                <button
                  onClick={() => setPrintModalOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE VOUCHER SHEET PAPER */}
            <div className="p-6 sm:p-8 space-y-6 text-slate-100 print:text-black print:p-6 bg-[#120a1f] print:bg-white font-sans">
              
              {/* Header Company Details */}
              <div className="border-b-2 border-purple-500/40 print:border-black pb-5 flex items-start justify-between">
                <div className="space-y-1">
                  <h1 className="text-xl sm:text-2xl font-black text-white print:text-black tracking-tight">
                    شركة الأمل للحلول المالية والتجارية
                  </h1>
                  <p className="text-xs text-purple-300 print:text-slate-600 font-bold">
                    نظام Odoo ERP المحاسبي - وحدة إدارة الحسابات العامة
                  </p>
                  <p className="text-[11px] text-slate-400 print:text-slate-500">
                    العنوان: القاهرة، جمهورية مصر العربية | هاتف: +20 100 000 0000
                  </p>
                </div>
                
                <div className="text-left space-y-1">
                  <div className="inline-block px-3 py-1 rounded-lg bg-purple-500/20 print:bg-slate-200 border border-purple-400/30 print:border-slate-400 text-xs font-black font-mono text-purple-200 print:text-black">
                    {entryToPrint.name}
                  </div>
                  <div className="text-[11px] text-slate-400 print:text-slate-600 font-bold">
                    حالة القيد: <span className="font-black text-purple-300 print:text-black">{entryToPrint.status === "posted" ? "مرحّل ورسمي (Posted)" : "مسودة (Draft)"}</span>
                  </div>
                </div>
              </div>

              {/* Voucher Meta Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#1d122e] print:bg-slate-100 border border-white/10 print:border-slate-300 text-xs">
                <div>
                  <span className="text-slate-400 print:text-slate-600 font-bold block">تاريخ القيد:</span>
                  <span className="font-mono font-black text-white print:text-black text-sm">{entryToPrint.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 print:text-slate-600 font-bold block">دفتر اليومية:</span>
                  <span className="font-bold text-purple-200 print:text-black">{entryToPrint.journal.split(" ")[0]}</span>
                </div>
                <div>
                  <span className="text-slate-400 print:text-slate-600 font-bold block">الشريك / المتعامل:</span>
                  <span className="font-bold text-white print:text-black">{entryToPrint.partner}</span>
                </div>
                <div>
                  <span className="text-slate-400 print:text-slate-600 font-bold block">رقم المرجع:</span>
                  <span className="font-mono font-bold text-amber-300 print:text-black">{entryToPrint.ref}</span>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-purple-300 print:text-black uppercase tracking-wider">تفاصيل بنود القيد المحاسبي</h4>
                <div className="overflow-x-auto rounded-xl border border-white/10 print:border-black">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-[#211438] print:bg-slate-200 text-purple-200 print:text-black font-black border-b border-white/10 print:border-black">
                      <tr>
                        <th className="p-2.5 text-center">#</th>
                        <th className="p-2.5">رمز الحساب</th>
                        <th className="p-2.5">اسم الحساب والبيان</th>
                        <th className="p-2.5">مركز التكلفة</th>
                        <th className="p-2.5 text-left">مدين (ج.م)</th>
                        <th className="p-2.5 text-left">دائن (ج.م)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 print:divide-slate-300 text-slate-200 print:text-black font-bold">
                      {entryToPrint.items.map((item, idx) => (
                        <tr key={item.id}>
                          <td className="p-2.5 text-center font-mono text-slate-400 print:text-black text-[11px]">{idx + 1}</td>
                          <td className="p-2.5 font-mono text-purple-300 print:text-black">{item.accountCode}</td>
                          <td className="p-2.5">
                            <div className="text-white print:text-black">{item.accountName}</div>
                            {item.label && <div className="text-[10px] text-slate-400 print:text-slate-600">{item.label}</div>}
                          </td>
                          <td className="p-2.5 text-slate-300 print:text-black text-[11px]">{item.analyticAccount}</td>
                          <td className="p-2.5 text-left font-mono text-red-300 print:text-black font-black">
                            {item.debit > 0 ? item.debit.toLocaleString("ar-EG") : "-"}
                          </td>
                          <td className="p-2.5 text-left font-mono text-emerald-300 print:text-black font-black">
                            {item.credit > 0 ? item.credit.toLocaleString("ar-EG") : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-[#1b102e] print:bg-slate-200 font-black border-t-2 border-purple-500/40 print:border-black text-white print:text-black">
                      <tr>
                        <td colSpan={4} className="p-3 text-right">الإجمالي الكلي للقيد:</td>
                        <td className="p-3 text-left font-mono text-red-300 print:text-black font-black text-sm">
                          {entryToPrint.totalDebit.toLocaleString("ar-EG")} ج.م
                        </td>
                        <td className="p-3 text-left font-mono text-emerald-300 print:text-black font-black text-sm">
                          {entryToPrint.totalCredit.toLocaleString("ar-EG")} ج.م
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Explanation Note */}
              {entryToPrint.explanation && (
                <div className="p-3 rounded-xl bg-[#1a0f2b] print:bg-slate-100 border border-white/10 print:border-slate-300 text-xs text-slate-300 print:text-black space-y-1">
                  <span className="font-black text-purple-300 print:text-black block">شرح القيد المحاسبي:</span>
                  <p className="leading-relaxed">{entryToPrint.explanation}</p>
                </div>
              )}

              {/* Official Signatures Section */}
              <div className="pt-8 mt-6 border-t border-purple-500/30 print:border-slate-400 grid grid-cols-3 gap-4 text-center text-xs font-bold text-slate-300 print:text-black">
                <div className="space-y-8">
                  <p>المحاسب إعداد القيد</p>
                  <div className="border-b border-dashed border-slate-500 w-3/4 mx-auto" />
                  <p className="text-[10px] text-slate-500 font-mono">التوقيع والتاريخ</p>
                </div>
                <div className="space-y-8">
                  <p>المراجع الداخلي</p>
                  <div className="border-b border-dashed border-slate-500 w-3/4 mx-auto" />
                  <p className="text-[10px] text-slate-500 font-mono">التوقيع والتاريخ</p>
                </div>
                <div className="space-y-8">
                  <p>اعتماد المدير المالي</p>
                  <div className="border-b border-dashed border-slate-500 w-3/4 mx-auto" />
                  <p className="text-[10px] text-slate-500 font-mono">الختم والتوقيع</p>
                </div>
              </div>

            </div>

            {/* Printable Modal Footer Actions */}
            <div className="p-4 bg-[#1a0f2b] border-t border-purple-500/30 flex items-center justify-between print:hidden">
              <button
                onClick={() => handleExportCSV([entryToPrint])}
                className="px-4 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/40 text-emerald-200 text-xs font-black flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>تصدير Excel</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs cursor-pointer hover:opacity-90 flex items-center gap-1.5 shadow-lg"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة الورقة (Print)</span>
                </button>
                <button
                  onClick={() => setPrintModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SMART FIELD HELPER MODAL / DRAWER */}
      {fieldHelperOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn dir-rtl">
          <div className="bg-[#1C132B] border-2 border-[#714B67] rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#714B67] to-[#00A09D] text-white font-black shadow-md">
                  <HelpCircle className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">دليل المساعد التفاعلي لحقول Odoo</h3>
                  <p className="text-xs text-slate-400">شرح وظيفة كل عنصر في شاشة قيود اليومية محاسبياً وتنفيذياً</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setFieldHelperOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Field Explanations List */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 text-xs sm:text-sm">
              <div className="p-3 rounded-2xl bg-[#25183b] border border-purple-500/30 space-y-1">
                <span className="font-black text-purple-300 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-purple-300" />
                  <span>دفتر اليومية (Journal)</span>
                </span>
                <p className="text-slate-300 leading-relaxed">
                  في Odoo، ينظم كل قيد داخل دفتر محاسبي محدد (مثل المبيعات Customer Invoices، الموردين Vendor Bills، البنك Bank، الخزينة Cash، العمليات المتنوعة Miscellaneous). يحدد الدفتر السلسلة الرقمية ونوع الحساب المالي الافتراضي.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#25183b] border border-purple-500/30 space-y-1">
                <span className="font-black text-cyan-300 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-cyan-300" />
                  <span>اسم الشريك / المتعامل (Partner)</span>
                </span>
                <p className="text-slate-300 leading-relaxed">
                  يُمثل العميل أو المورد أو الموظف المرتبط بالقيد. يساعد أودو في توجيه ميزان المراجعة التحليلي وشاشة متابعة أعمار الديون (Aged Receivables / Payables).
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#25183b] border border-purple-500/30 space-y-1">
                <span className="font-black text-amber-300 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-300" />
                  <span>تاريخ القيد (Accounting Date)</span>
                </span>
                <p className="text-slate-300 leading-relaxed">
                  التاريخ الذي يؤثر فيه القيد على القوائم المالية والدورة المحاسبية المغلقة أو المفتوحة في Odoo.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#25183b] border border-purple-500/30 space-y-1">
                <span className="font-black text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>أسطر القيد (Journal Items - Debit vs Credit)</span>
                </span>
                <p className="text-slate-300 leading-relaxed">
                  • <b>المدين (Debit):</b> يُستخدم لتسجيل الزيادة في الأصول والمصروفات، أو النقص في الالتزامات.
                  <br />• <b>الدائن (Credit):</b> يُستخدم لتسجيل الزيادة في الإيرادات والالتزامات ورأس المال، أو النقص في الأصول.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#25183b] border border-purple-500/30 space-y-1">
                <span className="font-black text-indigo-300 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-indigo-300" />
                  <span>الحساب التحليلي / مركز التكلفة (Analytic Account)</span>
                </span>
                <p className="text-slate-300 leading-relaxed">
                  يسمح أودو بتوزيع المصروف أو الإيراد على مراكز تكلفة (مثل: الإدارة العامة، خط الإنتاج، مشروع أ، قسم التسويق) دون تغيير شجرة الحسابات الرئيسية.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setFieldHelperOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#714B67] hover:bg-[#5e3d55] text-white font-black text-xs cursor-pointer shadow-lg"
              >
                فهمت ذلك، إغلاق المساعد ✓
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
