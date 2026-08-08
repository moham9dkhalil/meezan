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
  Calendar
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

// Chart of Accounts for Odoo
const ODOO_ACCOUNTS = [
  { code: "101000", name: "101000 البنك - الحساب الجاري الرئيسية", type: "Asset", category: "أصول متداولة" },
  { code: "102000", name: "102000 الصندوق / الخزينة الرئيسية", type: "Asset", category: "أصول متداولة" },
  { code: "110000", name: "110000 حسابات العملاء (Accounts Receivable)", type: "Asset", category: "أصول متداولة" },
  { code: "120000", name: "120000 مخزون البضائع (Inventory)", type: "Asset", category: "أصول متداولة" },
  { code: "150000", name: "150000 الأصول الثابتة - الآلات والمعدات", type: "Asset", category: "أصول غير متداولة" },
  { code: "151000", name: "151000 الأصول الثابتة - أجهزة كمبيوتر وتكنولوجيا", type: "Asset", category: "أصول غير متداولة" },
  { code: "210000", name: "210000 حسابات الموردين (Accounts Payable)", type: "Liability", category: "خصوم متداولة" },
  { code: "220000", name: "220000 مصلحة الضرائب - ضريبة القيمة المضافة 14%", type: "Liability", category: "خصوم متداولة" },
  { code: "230000", name: "230000 مستحقات التأمينات الاجتماعية والرواتب", type: "Liability", category: "خصوم متداولة" },
  { code: "300000", name: "300000 رأس المال المدفوع", type: "Equity", category: "حقوق ملكية" },
  { code: "400000", name: "400000 إيرادات المبيعات (Sales Revenue)", type: "Revenue", category: "إيرادات" },
  { code: "410000", name: "410000 إيرادات خدمات واستشارات", type: "Revenue", category: "إيرادات" },
  { code: "500000", name: "500000 تكلفة البضاعة المباعة (COGS)", type: "Expense", category: "مصروفات" },
  { code: "510000", name: "510000 مصروف الإيجار - المقر الرئيسي", type: "Expense", category: "مصروفات" },
  { code: "520000", name: "520000 مصروف أجور ورواتب الموظفين", type: "Expense", category: "مصروفات" },
  { code: "530000", name: "530000 مصروفات تسويق وإعلانات", type: "Expense", category: "مصروفات" },
  { code: "540000", name: "540000 خصم نقدي مسموح به (تعجيل دفع)", type: "Expense", category: "مصروفات" },
];

interface AccountAutocompleteProps {
  value: string;
  onChange: (accountCode: string) => void;
  disabled?: boolean;
}

function AccountAutocompleteInput({ value, onChange, disabled }: AccountAutocompleteProps) {
  const selectedAccount = ODOO_ACCOUNTS.find((a) => a.code === value);
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

  const filteredAccounts = ODOO_ACCOUNTS.filter(
    (acc) =>
      acc.code.includes(query.trim()) ||
      acc.name.toLowerCase().includes(query.toLowerCase().trim()) ||
      acc.category.toLowerCase().includes(query.toLowerCase().trim())
  );

  const handleSelect = (code: string) => {
    const acc = ODOO_ACCOUNTS.find((a) => a.code === code);
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
  // Main View Switcher: "tree" (Odoo List View) or "form" (Odoo Single Sheet View)
  const [viewMode, setViewMode] = useState<"form" | "tree">("form");

  // All Entries Database in state
  const [entries, setEntries] = useState<OdooEntryRecord[]>(INITIAL_ENTRIES);
  const [activeEntryIndex, setActiveEntryIndex] = useState<number>(0);

  // Active Entry State inside Form View
  const currentRecord = entries[activeEntryIndex] || entries[0];

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

  // Chatter Messages
  const [chatterNotes, setChatterNotes] = useState<Array<{ id: string; user: string; text: string; time: string; type: "audit" | "note" }>>([
    { id: "c1", user: "نظام Odoo ERP", text: "تم إنشاء القيد المحاسبي في حالة مسودة (Draft).", time: "اليوم 10:00 ص", type: "audit" },
    { id: "c2", user: "المحاسب المالي", text: "يرجى مراجعة القيمة المضافة ومراكز التكلفة قبل التترحيل.", time: "اليوم 10:15 ص", type: "note" }
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
          const selectedAcc = ODOO_ACCOUNTS.find((a) => a.code === value);
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
    <div className="space-y-4 pb-12 text-right dir-rtl font-sans bg-[#0E0B12] text-slate-100 p-2 sm:p-4 rounded-3xl min-h-screen">
      
      {/* ODOO SYSTEM NAVIGATION HEADER / TOP BAR */}
      <div className="bg-[#1C1625] border border-purple-500/30 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
        
        {/* Left Brand & App Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#714B67] via-[#8F5982] to-[#008784] flex items-center justify-center text-white shadow-lg shadow-purple-900/40">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black text-white tracking-wide">Odoo v17 Accounting</span>
              <span className="bg-[#714B67]/30 text-purple-200 border border-[#714B67]/60 text-[10px] font-black px-2 py-0.5 rounded-md">
                محاكي أودو المحاسبي
              </span>
            </div>
            <p className="text-[11px] text-slate-400">شاشة تسجيل وتوجيه قيود اليومية المحاسبية المعتمدة</p>
          </div>
        </div>

        {/* View Switchers & Controls (List View vs Form View) */}
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
        </div>
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

      {/* VIEW MODE 2: ODOO SINGLE ENTRY FORM SHEET */}
      {viewMode === "form" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* MAIN FORM SHEET CANVAS (Cols 8 or 9) */}
          <div className="lg:col-span-8 space-y-4">
            
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

          {/* RIGHT SIDEBAR: ODOO CHATTER & AUDIT TRAIL (Cols 4 or 3) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Odoo Practical Exercises Card */}
            <div className="bg-[#181123] border border-purple-500/30 rounded-3xl p-4 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-amber-300 font-black text-xs">
                <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>تحميل تمارين أودو العملية (Odoo Scenarios)</span>
              </div>

              <div className="space-y-2">
                {INITIAL_ENTRIES.map((rec, i) => (
                  <div
                    key={rec.id}
                    className="w-full text-right p-3 rounded-2xl bg-[#0e0817] hover:bg-[#1f152f] border border-white/10 transition-all group flex flex-col justify-between gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-black text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-400/30">
                        {rec.name}
                      </span>
                      <span className="text-[10px] text-slate-400">{rec.journal.split(" ")[0]}</span>
                    </div>
                    <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                      {rec.partner}
                    </span>
                    <div className="flex items-center gap-1.5 pt-1 border-t border-white/5">
                      <button
                        onClick={() => loadEntry(i)}
                        className="flex-1 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-bold text-slate-300 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <Eye className="w-3 h-3 text-purple-400" />
                        <span>تحميل</span>
                      </button>
                      <button
                        onClick={() => handleExplainJournalWithAi(rec)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 text-[11px] font-bold text-amber-200 flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
                        title="شرح المنطق المحاسبي لهذا القيد"
                      >
                        <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                        <span>شرح المساعد</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Odoo Chatter Panel (Log Note, Send Message, Audit Trail) */}
            <div className="bg-[#181123] border border-purple-500/30 rounded-3xl p-4 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-white font-black text-xs">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <span>Odoo Chatter (سجل الملاحظات والتدقيق)</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Audit Log</span>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddChatterNote} className="space-y-2">
                <textarea
                  rows={2}
                  value={newNoteInput}
                  onChange={(e) => setNewNoteInput(e.target.value)}
                  placeholder="أضف ملاحظة محاسبية أو توجيه على القيد..."
                  className="w-full bg-[#0e0817] border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-400"
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 text-purple-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إضافة ملاحظة (Log Note)</span>
                </button>
              </form>

              {/* Timeline Notes */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {chatterNotes.map((note) => (
                  <div key={note.id} className="p-3 rounded-2xl bg-[#0e0817] border border-white/5 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-purple-300">{note.user}</span>
                      <span className="text-slate-500 font-mono">{note.time}</span>
                    </div>
                    <p className="text-slate-300 leading-snug">{note.text}</p>
                  </div>
                ))}
              </div>
            </div>

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

    </div>
  );
}
