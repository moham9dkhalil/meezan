import React, { useState, useMemo, useRef } from "react";
import * as XLSX from "xlsx";
import {
  FileSpreadsheet,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Download,
  Upload,
  Play,
  RotateCcw,
  Copy,
  Check,
  Zap,
  BookOpen,
  Keyboard,
  Award,
  Layers,
  ChevronRight,
  Calculator,
  Plus,
  Trash2,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  DollarSign,
  Percent,
  BarChart3,
  PieChart,
  FileText,
  Table,
  Grid,
  Filter,
  Save,
  RefreshCw
} from "lucide-react";

// ==================== TYPES & INTERFACES ====================

export interface CellMeta {
  value: string;
  bold?: boolean;
  italic?: boolean;
  align?: "left" | "center" | "right";
  bg?: "default" | "green" | "blue" | "red" | "yellow" | "purple";
  numFormat?: "general" | "currency" | "percent" | "number";
}

export interface Sheet {
  id: string;
  name: string;
  icon: string;
  rowCount: number;
  colCount: number; // Number of columns e.g. 6 (A-F) or 8 (A-H)
  grid: { [cellId: string]: CellMeta };
}

export interface FormulaItem {
  id: string;
  name: string;
  nameAr: string;
  category: "أساسية" | "مالية" | "بحث ورابط" | "شرطية" | "نصوص وتاريخ";
  syntax: string;
  description: string;
  accountingUse: string;
  exampleData: {
    formula: string;
    result: string;
    explanation: string;
  };
}

export interface ExcelShortcut {
  key: string;
  description: string;
  category: "تنسيق أرقام" | "تنقل وتحديد" | "معادلات وصيغ" | "إدارة الشيتات";
  actionNote?: string;
}

export interface ExcelChallenge {
  id: string;
  title: string;
  description: string;
  task: string;
  expectedFormula: string[];
  gridSetup: { [key: string]: string };
  hint: string;
  xpReward: number;
}

// Helper to convert index to Column Letter (0 -> A, 1 -> B, ...)
const getColLetter = (index: number): string => {
  return String.fromCharCode(65 + index);
};

// ==================== INITIAL DEFAULT SHEETS ====================

const INITIAL_SHEETS: Sheet[] = [
  {
    id: "sheet_pnl",
    name: "قائمة الدخل (P&L)",
    icon: "📊",
    rowCount: 14,
    colCount: 6,
    grid: {
      A1: { value: "البيان المحاسبي", bold: true, align: "center", bg: "blue" },
      B1: { value: "المبلغ ($)", bold: true, align: "center", bg: "blue" },
      C1: { value: "النسبة المئوية (%)", bold: true, align: "center", bg: "blue" },
      D1: { value: "ملاحظات وتوجيه القيد", bold: true, align: "center", bg: "blue" },

      A2: { value: "إجمالي الإيرادات (المبيعات)", bold: true },
      B2: { value: "250000", numFormat: "currency" },
      C2: { value: "=B2/B2", numFormat: "percent" },
      D2: { value: "المبيعات الرئيسية الخاضعة للضريبة" },

      A3: { value: "مردودات ومسموحات المبيعات" },
      B3: { value: "10000", numFormat: "currency" },
      C3: { value: "=B3/B2", numFormat: "percent" },
      D3: { value: "خصومات تجارية ومردودات عملاء" },

      A4: { value: "صافي المبيعات (Net Revenue)", bold: true, bg: "green" },
      B4: { value: "=B2-B3", bold: true, numFormat: "currency", bg: "green" },
      C4: { value: "=B4/B2", bold: true, numFormat: "percent", bg: "green" },
      D4: { value: "صافي التدفقات النقدية التشغيلية" },

      A5: { value: "تكلفة المبيعات (COGS)" },
      B5: { value: "120000", numFormat: "currency" },
      C5: { value: "=B5/B2", numFormat: "percent" },
      D5: { value: "تكلفة تكوين وصيانة المخزون المباع" },

      A6: { value: "مجمل الربح (Gross Profit)", bold: true, bg: "green" },
      B6: { value: "=B4-B5", bold: true, numFormat: "currency", bg: "green" },
      C6: { value: "=B6/B2", bold: true, numFormat: "percent", bg: "green" },
      D6: { value: "هامش مجمل الربح التشغيلي" },

      A7: { value: "مصاريف الأجور والرواتب" },
      B7: { value: "35000", numFormat: "currency" },
      C7: { value: "=B7/B2", numFormat: "percent" },

      A8: { value: "مصاريف الإيجار والمرافق" },
      B8: { value: "15000", numFormat: "currency" },
      C8: { value: "=B8/B2", numFormat: "percent" },

      A9: { value: "مصاريف التسويق والإعلان" },
      B9: { value: "12000", numFormat: "currency" },
      C9: { value: "=B9/B2", numFormat: "percent" },

      A10: { value: "إجمالي المصاريف التشغيلية", bold: true, bg: "yellow" },
      B10: { value: "=SUM(B7:B9)", bold: true, numFormat: "currency", bg: "yellow" },
      C10: { value: "=B10/B2", bold: true, numFormat: "percent", bg: "yellow" },

      A11: { value: "صافي الربح قبل الضريبة (EBIT)", bold: true, bg: "purple" },
      B11: { value: "=B6-B10", bold: true, numFormat: "currency", bg: "purple" },
      C11: { value: "=B11/B2", bold: true, numFormat: "percent", bg: "purple" },

      A12: { value: "ضريبة القيمة المضافة والدخل (15%)" },
      B12: { value: "=B11*0.15", numFormat: "currency" },
      C12: { value: "=B12/B2", numFormat: "percent" },

      A13: { value: "صافي الربح النهائي (Net Profit)", bold: true, bg: "green" },
      B13: { value: "=B11-B12", bold: true, numFormat: "currency", bg: "green" },
      C13: { value: "=B13/B2", bold: true, numFormat: "percent", bg: "green" },
      D13: { value: "صافي الفائض المالي القابل للتوزيع" }
    }
  },
  {
    id: "sheet_payroll",
    name: "كشف الأجور (Payroll)",
    icon: "💼",
    rowCount: 8,
    colCount: 7,
    grid: {
      A1: { value: "الكود", bold: true, align: "center", bg: "blue" },
      B1: { value: "اسم الموظف", bold: true, align: "center", bg: "blue" },
      C1: { value: "الراتب الأساسي", bold: true, align: "center", bg: "blue" },
      D1: { value: "البدلات والإضافي", bold: true, align: "center", bg: "blue" },
      E1: { value: "إجمالي المستحق", bold: true, align: "center", bg: "blue" },
      F1: { value: "التأمينات (10%)", bold: true, align: "center", bg: "blue" },
      G1: { value: "صافي الراتب", bold: true, align: "center", bg: "blue" },

      A2: { value: "EMP-101", align: "center" },
      B2: { value: "أحمد عبد الله المالي" },
      C2: { value: "8500", numFormat: "currency" },
      D2: { value: "1500", numFormat: "currency" },
      E2: { value: "=C2+D2", bold: true, numFormat: "currency" },
      F2: { value: "=E2*0.1", numFormat: "currency" },
      G2: { value: "=E2-F2", bold: true, numFormat: "currency", bg: "green" },

      A3: { value: "EMP-102", align: "center" },
      B3: { value: "سارة محمد علي" },
      C3: { value: "12000", numFormat: "currency" },
      D3: { value: "2500", numFormat: "currency" },
      E3: { value: "=C3+D3", bold: true, numFormat: "currency" },
      F3: { value: "=E3*0.1", numFormat: "currency" },
      G3: { value: "=E3-F3", bold: true, numFormat: "currency", bg: "green" },

      A4: { value: "EMP-103", align: "center" },
      B4: { value: "خالد إبراهيم حسن" },
      C4: { value: "9500", numFormat: "currency" },
      D4: { value: "1000", numFormat: "currency" },
      E4: { value: "=C4+D4", bold: true, numFormat: "currency" },
      F4: { value: "=E4*0.1", numFormat: "currency" },
      G4: { value: "=E4-F4", bold: true, numFormat: "currency", bg: "green" },

      A5: { value: "EMP-104", align: "center" },
      B5: { value: "منى يوسف السيد" },
      C5: { value: "11000", numFormat: "currency" },
      D5: { value: "2000", numFormat: "currency" },
      E5: { value: "=C5+D5", bold: true, numFormat: "currency" },
      F5: { value: "=E5*0.1", numFormat: "currency" },
      G5: { value: "=E5-F5", bold: true, numFormat: "currency", bg: "green" },

      A6: { value: "الإجمالي النهائي", bold: true, bg: "yellow" },
      B6: { value: "4 موظفين", bold: true, align: "center", bg: "yellow" },
      C6: { value: "=SUM(C2:C5)", bold: true, numFormat: "currency", bg: "yellow" },
      D6: { value: "=SUM(D2:D5)", bold: true, numFormat: "currency", bg: "yellow" },
      E6: { value: "=SUM(E2:E5)", bold: true, numFormat: "currency", bg: "yellow" },
      F6: { value: "=SUM(F2:F5)", bold: true, numFormat: "currency", bg: "yellow" },
      G6: { value: "=SUM(G2:G5)", bold: true, numFormat: "currency", bg: "green" }
    }
  },
  {
    id: "sheet_tb",
    name: "ميزان المراجعة (Trial Balance)",
    icon: "⚖️",
    rowCount: 10,
    colCount: 6,
    grid: {
      A1: { value: "رقم الحساب", bold: true, align: "center", bg: "purple" },
      B1: { value: "اسم الحساب المحاسبي", bold: true, align: "center", bg: "purple" },
      C1: { value: "المدين (Debit)", bold: true, align: "center", bg: "purple" },
      D1: { value: "الدائن (Credit)", bold: true, align: "center", bg: "purple" },
      E1: { value: "رصيد المدين النهائي", bold: true, align: "center", bg: "purple" },
      F1: { value: "رصيد الدائن النهائي", bold: true, align: "center", bg: "purple" },

      A2: { value: "101000", align: "center" }, B2: { value: "الصندوق - النقدية بالخزينة" }, C2: { value: "45000", numFormat: "currency" }, D2: { value: "0", numFormat: "currency" }, E2: { value: "=C2-D2", numFormat: "currency" }, F2: { value: "0", numFormat: "currency" },
      A3: { value: "102000", align: "center" }, B3: { value: "البنك - الحساب الجاري" }, C3: { value: "185000", numFormat: "currency" }, D3: { value: "0", numFormat: "currency" }, E3: { value: "=C3-D3", numFormat: "currency" }, F3: { value: "0", numFormat: "currency" },
      A4: { value: "103000", align: "center" }, B4: { value: "العملاء - ذمم مدينة" }, C4: { value: "62000", numFormat: "currency" }, D4: { value: "0", numFormat: "currency" }, E4: { value: "=C4-D4", numFormat: "currency" }, F4: { value: "0", numFormat: "currency" },
      A5: { value: "201000", align: "center" }, B5: { value: "الموردون - ذمم دائنة" }, C5: { value: "0", numFormat: "currency" }, D5: { value: "42000", numFormat: "currency" }, E5: { value: "0", numFormat: "currency" }, F5: { value: "=D5-C5", numFormat: "currency" },
      A6: { value: "301000", align: "center" }, B6: { value: "رأس المال المدفوع" }, C6: { value: "0", numFormat: "currency" }, D6: { value: "250000", numFormat: "currency" }, E6: { value: "0", numFormat: "currency" }, F6: { value: "=D6-C6", numFormat: "currency" },
      A7: { value: "401000", align: "center" }, B7: { value: "إيراد المبيعات" }, C7: { value: "0", numFormat: "currency" }, D7: { value: "120000", numFormat: "currency" }, E7: { value: "0", numFormat: "currency" }, F7: { value: "=D7-C7", numFormat: "currency" },
      A8: { value: "501000", align: "center" }, B8: { value: "مصاريف إدارية وعمومية" }, C8: { value: "20000", numFormat: "currency" }, D8: { value: "0", numFormat: "currency" }, E8: { value: "=C8-D8", numFormat: "currency" }, F8: { value: "0", numFormat: "currency" },

      A9: { value: "المجموع الكلي", bold: true, bg: "yellow" },
      B9: { value: "مطابقة الميزان", bold: true, align: "center", bg: "yellow" },
      C9: { value: "=SUM(C2:C8)", bold: true, numFormat: "currency", bg: "yellow" },
      D9: { value: "=SUM(D2:D8)", bold: true, numFormat: "currency", bg: "yellow" },
      E9: { value: "=SUM(E2:E8)", bold: true, numFormat: "currency", bg: "green" },
      F9: { value: "=SUM(F2:F8)", bold: true, numFormat: "currency", bg: "green" }
    }
  },
  {
    id: "sheet_bank",
    name: "تسوية البنك (Bank Recon)",
    icon: "🏦",
    rowCount: 8,
    colCount: 4,
    grid: {
      A1: { value: "البيان المحاسبي", bold: true, align: "center", bg: "blue" },
      B1: { value: "المبلغ ($)", bold: true, align: "center", bg: "blue" },
      C1: { value: "الحالة والنوع", bold: true, align: "center", bg: "blue" },
      D1: { value: "ملاحظات المطابقة", bold: true, align: "center", bg: "blue" },

      A2: { value: "رصيد البنك وفق كشف الحساب البنكي" },
      B2: { value: "145000", numFormat: "currency" },
      C2: { value: "كشف البنك" },
      D2: { value: "كشف بنك الأهلي شهر يوليو" },

      A3: { value: "يضاف: إيداعات نقدية بالطريق (لم تظهر بالكشف)" },
      B3: { value: "12000", numFormat: "currency" },
      C3: { value: "إيداع معلق" },

      A4: { value: "يخصم: شيكات صادرة لم تقدم للصرف بعد" },
      B4: { value: "8500", numFormat: "currency" },
      C4: { value: "شيكات معلقة" },

      A5: { value: "الرصيد المعدل للبنك (Adjusted Bank Balance)", bold: true, bg: "green" },
      B5: { value: "=B2+B3-B4", bold: true, numFormat: "currency", bg: "green" },
      C5: { value: "الرصيد المعتمد", bold: true },

      A6: { value: "رصيد البنك بكتّاب الدفاتر المحاسبية" },
      B6: { value: "148500", numFormat: "currency" },
      C6: { value: "دفتر الأستاذ" },

      A7: { value: "يخصم: مصاريف وعمولات بنكية غير مسجلة" },
      B7: { value: "0", numFormat: "currency" },

      A8: { value: "الرصيد المعدل بالدفاتر (Adjusted Book Balance)", bold: true, bg: "green" },
      B8: { value: "=B6-B7", bold: true, numFormat: "currency", bg: "green" },
      C8: { value: "الرصيد المطابق", bold: true }
    }
  }
];

// Formulas Catalog Data
const EXCEL_FORMULAS: FormulaItem[] = [
  {
    id: "sum",
    name: "SUM",
    nameAr: "دالة الجمع الإجمالي",
    category: "أساسية",
    syntax: "=SUM(number1, [number2], ...)",
    description: "تجمع كافة الأرقام في نطاق محدد من الخلايا بسرعة وكفاءة عالية.",
    accountingUse: "تستخدم لحساب إجمالي المبيعات، إجمالي المصاريف، ومجاميع حركتي المدين والدائن في ميزان المراجعة.",
    exampleData: {
      formula: "=SUM(B2:B10)",
      result: "150,000 $",
      explanation: "تجمع قيم الخلايا من B2 إلى B10 لحساب إجمالي المقبوضات."
    }
  },
  {
    id: "average",
    name: "AVERAGE",
    nameAr: "دالة حساب المتوسط الحسابي",
    category: "أساسية",
    syntax: "=AVERAGE(number1, [number2], ...)",
    description: "تحسب متوسط القيم الرقمية في النطاق المحدد.",
    accountingUse: "حساب متوسط المبيعات الشهري، متوسط أسعار التكلفة، ومتوسط أجور العاملين.",
    exampleData: {
      formula: "=AVERAGE(B2:B5)",
      result: "10,250 $",
      explanation: "تحسب متوسط رواتب الموظفين في النطاق."
    }
  },
  {
    id: "vlookup",
    name: "VLOOKUP",
    nameAr: "دالة البحث العمودي",
    category: "بحث ورابط",
    syntax: "=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])",
    description: "تبحث عن قيمة معينة في العمود الأول لجدول وتسترجع قيمة من نفس الصف في عمود آخر.",
    accountingUse: "البحث عن أسماء الحسابات من دليل الحسابات، جلب أسعار المنتجات في الفواتير، واستخراج بيانات الموردين.",
    exampleData: {
      formula: '=VLOOKUP("101", A2:D100, 2, FALSE)',
      result: '"الصندوق - النقدية"',
      explanation: "تبحث عن كود الحساب 101 وترجع الاسم الموجود بالعمود الثاني من جدول الحسابات."
    }
  },
  {
    id: "if",
    name: "IF",
    nameAr: "الدالة الشرطية البسيطة",
    category: "شرطية",
    syntax: "=IF(logical_test, value_if_true, value_if_false)",
    description: "تختبر شرطاً منطقياً وترجع قيمة محددة إذا تحقق الشرط وقيمة أخرى إذا لم يتحقق.",
    accountingUse: "التحقق من توازن ميزان المراجعة (المدين = الدائن)، وتحديد ما إذا كان الحساب يحقق ربحاً أم خسارة.",
    exampleData: {
      formula: '=IF(B10=C10, "متوازن ✅", "غير متوازن ❌")',
      result: '"متوازن ✅"',
      explanation: "تفحص ما إذا كان مجموع طرف المدين يساوي مجموع طرف الدائن."
    }
  },
  {
    id: "count",
    name: "COUNT / COUNTA",
    nameAr: "دالة عدد الخلايا",
    category: "أساسية",
    syntax: "=COUNT(value1, [value2], ...)",
    description: "تعد عدد الخلايا التي تحتوي على أرقام أو نصوص داخل نطاق معين.",
    accountingUse: "حساب عدد أسطر الفواتير، عدد العملاء المسجلين، أو عدد العمليات المالية.",
    exampleData: {
      formula: "=COUNT(B2:B10)",
      result: "9 أسطر",
      explanation: "تعد عدد القيم الرقمية المدخلة."
    }
  },
  {
    id: "round",
    name: "ROUND",
    nameAr: "دالة تقريب المبالغ المالية",
    category: "أساسية",
    syntax: "=ROUND(number, num_digits)",
    description: "تقرب الرقم المالي إلى عدد محدد من الخانات العشرية وفق القواعد الرياضيات المعيارية.",
    accountingUse: "إلغاء كسور السنتات الإضافية وضبط الأرقام النهائية للقرارات الضريبية والقوائم المالية.",
    exampleData: {
      formula: "=ROUND(1245.876, 2)",
      result: "1,245.88 $",
      explanation: "تقرب المبلغ لأقرب خانتين عشريتين."
    }
  }
];

// Shortcuts Catalog Data
const EXCEL_SHORTCUTS: ExcelShortcut[] = [
  { key: "Alt + =", description: "إدراج الجمع التلقائي (AutoSUM) فوراً للخلايا المجاورة", category: "معادلات وصيغ", actionNote: "أسرع طريقة لجمع أرقام العمود في الميزانية" },
  { key: "Ctrl + Shift + $", description: "تطبيق تنسيق العملة ($) مع الفواصل العشرية", category: "تنسيق أرقام", actionNote: "يحول الرقم بسرعة إلى صياغة نقدية محترفة" },
  { key: "Ctrl + Shift + %", description: "تطبيق التنسيق المئوي (Percentage %)", category: "تنسيق أرقام" },
  { key: "F4", description: "تثبيت المراجع بالخلايا ($A$1) أو تكرار الإجراء الاخير", category: "معادلات وصيغ", actionNote: "ضرورية جداً عند كتابة دوال VLOOKUP ونطاقات البحث" },
  { key: "Ctrl + 1", description: "فتح نافذة تنسيق الخلايا الشاملة (Format Cells)", category: "تنسيق أرقام" },
  { key: "Ctrl + PageDown / PageUp", description: "التنقل بين أوراق العمل (Worksheets) بسرعة", category: "إدارة الشيتات" },
  { key: "Alt + H + O + I", description: "ضبط الاحتواء التلقائي لعرض الأعمدة بناءً على المحتوى", category: "تنسيق أرقام" },
  { key: "Ctrl + Shift + L", description: "تفعيل أو إلغاء تصفية البيانات (AutoFilter)", category: "تنقل وتحديد" },
  { key: "Ctrl + ~ (Tilde)", description: "إظهار كافة الصيغ والمعادلات بالشيت بدلاً من النتائج", category: "معادلات وصيغ" },
  { key: "Ctrl + Down Arrow", description: "الانتقال السريع إلى آخر صف يحتوي على بيانات بالنطاق", category: "تنقل وتحديد" },
  { key: "Ctrl + H", description: "البحث والاستبدال السريع داخل الشيت", category: "تنقل وتحديد" },
  { key: "F2", description: "تحرير صيغة الخلية المحددة مباشرة دون الماوس", category: "معادلات وصيغ" }
];

// Challenges Data
const EXCEL_CHALLENGES: ExcelChallenge[] = [
  {
    id: "ch1",
    title: "تحدي 1: حساب صافي الربح في القائمة المالية",
    description: "لديك جدول يحتوي على المبيعات (100,000$) في B2، وتكلفة المبيعات (60,000$) في B3، والمصاريف (15,000$) في B4.",
    task: "أدخل الصيغة المناسبة في الخلية B5 لحساب صافي الربح المتبقي.",
    expectedFormula: ["=B2-B3-B4", "=B2-(B3+B4)"],
    gridSetup: {
      A1: "البيان", B1: "القيمة",
      A2: "المبيعات", B2: "100000",
      A3: "تكلفة المبيعات", B3: "60000",
      A4: "المصاريف التشغيلية", B4: "15000",
      A5: "صافي الربح", B5: ""
    },
    hint: "اطرح تكلفة المبيعات والمصاريف من المبيعات: اكتب =B2-B3-B4",
    xpReward: 100
  },
  {
    id: "ch2",
    title: "تحدي 2: حساب إجمالي أجور الموظفين بشرط",
    description: "احسب مجموع الرواتب الموجودة في النطاق B2:B4 باستخدام دالة SUM.",
    task: "اكتب المعادلة في الخلية B5 لحساب مجموع الرواتب.",
    expectedFormula: ["=SUM(B2:B4)", "=B2+B3+B4"],
    gridSetup: {
      A1: "الموظف", B1: "الراتب",
      A2: "أحمد", B2: "5000",
      A3: "سارة", B3: "7000",
      A4: "محمد", B4: "6000",
      A5: "الإجمالي", B5: ""
    },
    hint: "اكتب =SUM(B2:B4) في الخلية B5",
    xpReward: 120
  },
  {
    id: "ch3",
    title: "تحدي 3: التحقق من توازن ميزان المراجعة بـ IF",
    description: "لديك إجمالي المدين في B2 (50000) وإجمالي الدائن في C2 (50000). نريد التأكد من توازنهما.",
    task: "اكتب في D2 معادلة IF تفحص B2=C2 وتعيد 1 في حالة التوازن و 0 في حالة الخلل.",
    expectedFormula: ['=IF(B2=C2, 1, 0)', '=IF(B2=C2,1,0)', '=IF(B2=C2, "1", "0")'],
    gridSetup: {
      A1: "البيان", B1: "المدين", C1: "الدائن", D1: "حالة التوازن",
      A2: "إجمالي الميزان", B2: "50000", C2: "50000", D2: ""
    },
    hint: "استخدم الصيغة =IF(B2=C2, 1, 0)",
    xpReward: 150
  }
];

export function ExcelSection() {
  const [activeSubTab, setActiveSubTab] = useState<"grid" | "formulas" | "shortcuts" | "challenges">("grid");

  // Sheets state
  const [sheets, setSheets] = useState<Sheet[]>(INITIAL_SHEETS);
  const [activeSheetId, setActiveSheetId] = useState<string>("sheet_pnl");
  const [selectedCell, setSelectedCell] = useState<string>("B2");
  const [cellInput, setCellInput] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Formula Search & Filters
  const [formulaSearch, setFormulaSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");

  // Challenge state
  const [activeChallengeIdx, setActiveChallengeIdx] = useState<number>(0);
  const [challengeUserFormula, setChallengeUserFormula] = useState("");
  const [challengeResult, setChallengeResult] = useState<{ success: boolean; msg: string } | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [userXp, setUserXp] = useState<number>(0);

  // Copy Feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Active Sheet Helper
  const currentSheet = useMemo(() => {
    return sheets.find((s) => s.id === activeSheetId) || sheets[0];
  }, [sheets, activeSheetId]);

  // Handle Cell Click
  const handleCellClick = (cellId: string) => {
    setSelectedCell(cellId);
    const cellMeta = currentSheet.grid[cellId];
    setCellInput(cellMeta ? cellMeta.value : "");
  };

  // Safe Cell Value Evaluator
  const evaluateCellValue = (
    cellKey: string,
    gridData: { [cellId: string]: CellMeta },
    visited: Set<string> = new Set()
  ): { rawNum: number; displayStr: string } => {
    const cell = gridData[cellKey];
    if (!cell || !cell.value) return { rawNum: 0, displayStr: "" };

    const raw = cell.value.trim();

    // If non-formula
    if (!raw.startsWith("=")) {
      const num = parseFloat(raw.replace(/,/g, "").replace(/\$/g, "").replace(/%/g, ""));
      const isNum = !isNaN(num) && raw !== "";

      let formatted = raw;
      if (isNum && cell.numFormat === "currency") {
        formatted = `$ ${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      } else if (isNum && cell.numFormat === "percent") {
        formatted = `${(num * (raw.includes("%") ? 1 : 100)).toFixed(1)}%`;
      } else if (isNum && cell.numFormat === "number") {
        formatted = num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }

      return { rawNum: isNaN(num) ? 0 : num, displayStr: formatted };
    }

    // Handle Circular Reference
    if (visited.has(cellKey)) {
      return { rawNum: 0, displayStr: "#CIRCULAR!" };
    }
    visited.add(cellKey);

    const formula = raw.substring(1).trim().toUpperCase();

    try {
      // 1. SUM(A1:A5) or SUM(A1, B1, C1)
      if (formula.startsWith("SUM(") && formula.endsWith(")")) {
        const inner = formula.substring(4, formula.length - 1);
        let sum = 0;

        if (inner.includes(":")) {
          const [start, end] = inner.split(":");
          const startCol = start.charAt(0);
          const startRow = parseInt(start.substring(1));
          const endCol = end.charAt(0);
          const endRow = parseInt(end.substring(1));

          const startColIdx = startCol.charCodeAt(0) - 65;
          const endColIdx = endCol.charCodeAt(0) - 65;

          for (let c = startColIdx; c <= endColIdx; c++) {
            const colLetter = getColLetter(c);
            for (let r = startRow; r <= endRow; r++) {
              const res = evaluateCellValue(`${colLetter}${r}`, gridData, new Set(visited));
              sum += res.rawNum;
            }
          }
        } else {
          const parts = inner.split(",");
          for (const p of parts) {
            const res = evaluateCellValue(p.trim(), gridData, new Set(visited));
            sum += res.rawNum;
          }
        }

        let formatted = sum.toLocaleString("en-US", { maximumFractionDigits: 2 });
        if (cell.numFormat === "currency") formatted = `$ ${sum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (cell.numFormat === "percent") formatted = `${(sum * 100).toFixed(1)}%`;

        return { rawNum: sum, displayStr: formatted };
      }

      // 2. AVERAGE(A1:A5)
      if (formula.startsWith("AVERAGE(") && formula.endsWith(")")) {
        const inner = formula.substring(8, formula.length - 1);
        let sum = 0;
        let count = 0;

        if (inner.includes(":")) {
          const [start, end] = inner.split(":");
          const startCol = start.charAt(0);
          const startRow = parseInt(start.substring(1));
          const endCol = end.charAt(0);
          const endRow = parseInt(end.substring(1));

          const startColIdx = startCol.charCodeAt(0) - 65;
          const endColIdx = endCol.charCodeAt(0) - 65;

          for (let c = startColIdx; c <= endColIdx; c++) {
            const colLetter = getColLetter(c);
            for (let r = startRow; r <= endRow; r++) {
              const res = evaluateCellValue(`${colLetter}${r}`, gridData, new Set(visited));
              sum += res.rawNum;
              count++;
            }
          }
        }
        const avg = count > 0 ? sum / count : 0;
        let formatted = avg.toLocaleString("en-US", { maximumFractionDigits: 2 });
        if (cell.numFormat === "currency") formatted = `$ ${avg.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        return { rawNum: avg, displayStr: formatted };
      }

      // 3. COUNT(A1:A5)
      if (formula.startsWith("COUNT(") && formula.endsWith(")")) {
        const inner = formula.substring(6, formula.length - 1);
        let count = 0;
        if (inner.includes(":")) {
          const [start, end] = inner.split(":");
          const startCol = start.charAt(0);
          const startRow = parseInt(start.substring(1));
          const endRow = parseInt(end.substring(1));
          for (let r = startRow; r <= endRow; r++) {
            const res = evaluateCellValue(`${startCol}${r}`, gridData, new Set(visited));
            if (res.displayStr !== "") count++;
          }
        }
        return { rawNum: count, displayStr: `${count}` };
      }

      // 4. IF(condition, trueVal, falseVal)
      if (formula.startsWith("IF(")) {
        const inner = formula.substring(3, formula.length - 1);
        const parts = inner.split(",");
        if (parts.length >= 2) {
          const condExpr = parts[0].trim();
          // evaluate condition
          let evalCond = condExpr.replace(/([A-H])([1-9][0-9]?)/g, (_, col, row) => {
            const res = evaluateCellValue(`${col}${row}`, gridData, new Set(visited));
            return res.rawNum.toString();
          });
          evalCond = evalCond.replace(/=/g, "===");
          // eslint-disable-next-line no-eval
          const condPass = Boolean(Function(`"use strict"; return (${evalCond})`)());
          const chosen = condPass ? parts[1].trim() : parts[2] ? parts[2].trim() : "";

          // Check if chosen is cell ref
          if (/^[A-H][1-9][0-9]?$/.test(chosen)) {
            return evaluateCellValue(chosen, gridData, new Set(visited));
          }
          const cleanChosen = chosen.replace(/"/g, "");
          const numChosen = parseFloat(cleanChosen);
          return { rawNum: isNaN(numChosen) ? 0 : numChosen, displayStr: cleanChosen };
        }
      }

      // 5. Basic arithmetic like B2-B3, B11*0.15, B2/B2, etc.
      let expr = formula;
      expr = expr.replace(/([A-H])([1-9][0-9]?)/g, (_, col, row) => {
        const res = evaluateCellValue(`${col}${row}`, gridData, new Set(visited));
        return res.rawNum.toString();
      });

      if (/^[0-9+\-*/(). ]+$/.test(expr)) {
        // eslint-disable-next-line no-eval
        const numRes = Function(`"use strict"; return (${expr})`)();
        if (typeof numRes === "number" && !isNaN(numRes)) {
          let formatted = Number.isInteger(numRes)
            ? numRes.toString()
            : numRes.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

          if (cell.numFormat === "currency") formatted = `$ ${numRes.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          if (cell.numFormat === "percent") formatted = `${(numRes * 100).toFixed(1)}%`;

          return { rawNum: numRes, displayStr: formatted };
        }
      }

      return { rawNum: 0, displayStr: raw };
    } catch {
      return { rawNum: 0, displayStr: "#VALUE!" };
    }
  };

  // Update Formula or Cell Value
  const handleCellInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setCellInput(newVal);

    setSheets((prevSheets) =>
      prevSheets.map((sheet) => {
        if (sheet.id === activeSheetId) {
          const existingMeta = sheet.grid[selectedCell] || { value: "" };
          return {
            ...sheet,
            grid: {
              ...sheet.grid,
              [selectedCell]: {
                ...existingMeta,
                value: newVal
              }
            }
          };
        }
        return sheet;
      })
    );
  };

  // Apply Formatting to Selected Cell
  const handleApplyFormatting = (key: keyof CellMeta, value: any) => {
    setSheets((prevSheets) =>
      prevSheets.map((sheet) => {
        if (sheet.id === activeSheetId) {
          const existing = sheet.grid[selectedCell] || { value: "" };
          const updatedValue = existing[key] === value && typeof value === "boolean" ? false : value;
          return {
            ...sheet,
            grid: {
              ...sheet.grid,
              [selectedCell]: {
                ...existing,
                [key]: updatedValue
              }
            }
          };
        }
        return sheet;
      })
    );
  };

  // Add New Row
  const handleAddRow = () => {
    setSheets((prev) =>
      prev.map((s) => (s.id === activeSheetId ? { ...s, rowCount: s.rowCount + 1 } : s))
    );
    showToast("تمت إضافة صف جديد للشيت الحالية!");
  };

  // Add New Column
  const handleAddColumn = () => {
    setSheets((prev) =>
      prev.map((s) => (s.id === activeSheetId ? { ...s, colCount: Math.min(s.colCount + 1, 10) } : s))
    );
    showToast("تمت إضافة عمود جديد للشيت الحالية!");
  };

  // Reset Active Sheet
  const handleResetSheet = () => {
    const initial = INITIAL_SHEETS.find((s) => s.id === activeSheetId);
    if (initial) {
      setSheets((prev) =>
        prev.map((s) => (s.id === activeSheetId ? { ...initial } : s))
      );
      showToast("تمت إعادة ضبط الشيت الحالية إلى القيمة الأصلية.");
    }
  };

  // Add New Custom Sheet
  const handleAddSheet = () => {
    const newId = `sheet_custom_${Date.now()}`;
    const newName = `ورقة عمل ${sheets.length + 1}`;
    const newSheet: Sheet = {
      id: newId,
      name: newName,
      icon: "📑",
      rowCount: 10,
      colCount: 6,
      grid: {
        A1: { value: "العنوان الرئيسية", bold: true, align: "center", bg: "blue" },
        B1: { value: "القيمة المباشرة", bold: true, align: "center", bg: "blue" }
      }
    };
    setSheets((prev) => [...prev, newSheet]);
    setActiveSheetId(newId);
    showToast(`تم إنشاء ${newName} بنجاح!`);
  };

  // Export active sheet to native .xlsx file
  const handleExportXLSX = () => {
    try {
      const wb = XLSX.utils.book_new();
      
      const wsData: any[][] = [];
      for (let r = 1; r <= currentSheet.rowCount; r++) {
        const rowVals: any[] = [];
        for (let c = 0; c < currentSheet.colCount; c++) {
          const colLetter = getColLetter(c);
          const cellId = `${colLetter}${r}`;
          const res = evaluateCellValue(cellId, currentSheet.grid);
          const cellMeta = currentSheet.grid[cellId];
          const rawVal = cellMeta ? cellMeta.value : "";
          
          if (!isNaN(res.rawNum) && rawVal.trim() !== "" && !rawVal.includes("%") && !rawVal.includes("$") && !isNaN(Number(rawVal))) {
            rowVals.push(res.rawNum);
          } else {
            rowVals.push(res.displayStr || rawVal);
          }
        }
        wsData.push(rowVals);
      }

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      
      // Auto column width
      ws["!cols"] = Array.from({ length: currentSheet.colCount }, () => ({ wch: 22 }));

      const cleanName = currentSheet.name.replace(/[:\\/?*\[\]]/g, "").substring(0, 31);
      XLSX.utils.book_append_sheet(wb, ws, cleanName);
      
      XLSX.writeFile(wb, `${currentSheet.name}_Meezan_Excel.xlsx`);
      showToast(`تم تصدير ورقة العمل (${currentSheet.name}) بنجاح بصيغة Microsoft Excel (.xlsx) 📊`);
    } catch (err) {
      console.error(err);
      showToast("حدث خطأ أثناء التصدير بصيغة Excel!");
    }
  };

  // Export full workbook with ALL sheets into one .xlsx file
  const handleExportAllSheetsXLSX = () => {
    try {
      const wb = XLSX.utils.book_new();

      sheets.forEach((sheet) => {
        const wsData: any[][] = [];
        for (let r = 1; r <= sheet.rowCount; r++) {
          const rowVals: any[] = [];
          for (let c = 0; c < sheet.colCount; c++) {
            const colLetter = getColLetter(c);
            const cellId = `${colLetter}${r}`;
            const res = evaluateCellValue(cellId, sheet.grid);
            const cellMeta = sheet.grid[cellId];
            const rawVal = cellMeta ? cellMeta.value : "";

            if (!isNaN(res.rawNum) && rawVal.trim() !== "" && !rawVal.includes("%") && !rawVal.includes("$") && !isNaN(Number(rawVal))) {
              rowVals.push(res.rawNum);
            } else {
              rowVals.push(res.displayStr || rawVal);
            }
          }
          wsData.push(rowVals);
        }

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        ws["!cols"] = Array.from({ length: sheet.colCount }, () => ({ wch: 22 }));
        const cleanName = sheet.name.replace(/[:\\/?*\[\]]/g, "").substring(0, 31);
        XLSX.utils.book_append_sheet(wb, ws, cleanName);
      });

      XLSX.writeFile(wb, `دفتر_الحسابات_الكامل_Meezan_Workbook.xlsx`);
      showToast(`تم تصدير دفتر الحسابات بالكامل (${sheets.length} أوراق) في ملف Excel موحد (.xlsx)! 🚀`);
    } catch (err) {
      console.error(err);
      showToast("حدث خطأ أثناء تصدير دفتر الحسابات الكامل!");
    }
  };

  // Import XLSX / XLS / CSV File Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const newGrid: { [cellId: string]: CellMeta } = {};
        let maxCols = 4;

        json.forEach((row, rIdx) => {
          if (!row || row.length === 0) return;
          maxCols = Math.max(maxCols, row.length);
          row.forEach((cellVal, cIdx) => {
            const colLetter = getColLetter(cIdx);
            const cellId = `${colLetter}${rIdx + 1}`;
            newGrid[cellId] = {
              value: cellVal !== undefined && cellVal !== null ? String(cellVal) : "",
              bold: rIdx === 0
            };
          });
        });

        setSheets((prev) =>
          prev.map((s) =>
            s.id === activeSheetId
              ? {
                  ...s,
                  rowCount: Math.max(json.length, 8),
                  colCount: Math.min(maxCols, 10),
                  grid: newGrid
                }
              : s
          )
        );
        showToast("تم استيراد وقراءة ملف الإكسيل (.xlsx) بنجاح وإدراجه في الشيت الحالية! 📥");
      } catch (err) {
        console.error(err);
        showToast("حدث خطأ أثناء قراءة ملف الإكسيل!");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Toast helper
  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Copy shortcut text
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Submit Challenge Answer
  const handleCheckChallenge = () => {
    const curChallenge = EXCEL_CHALLENGES[activeChallengeIdx];
    const cleanedUser = challengeUserFormula.trim().replace(/\s+/g, "").toUpperCase();
    const isCorrect = curChallenge.expectedFormula.some((f) => f.trim().replace(/\s+/g, "").toUpperCase() === cleanedUser);

    if (isCorrect) {
      setChallengeResult({
        success: true,
        msg: `إجابة صحيحة ممتاز! 🎉 كسبت ${curChallenge.xpReward} نقطة XP`
      });
      if (!completedChallenges.includes(curChallenge.id)) {
        setCompletedChallenges((prev) => [...prev, curChallenge.id]);
        setUserXp((prev) => prev + curChallenge.xpReward);
      }
    } else {
      setChallengeResult({
        success: false,
        msg: `الصيغة غير مطابقة. حاول مرة أخرى! تلميح: ${curChallenge.hint}`
      });
    }
  };

  const selectedCellMeta = currentSheet.grid[selectedCell] || { value: "" };

  return (
    <div className="min-h-screen bg-[#070A17] text-white py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* NOTIFICATION TOAST */}
        {notification && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-xs sm:text-sm border border-emerald-400 animate-bounce flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span>{notification}</span>
          </div>
        )}

        {/* HERO BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-indigo-950 p-6 sm:p-8 border border-emerald-500/20 shadow-2xl">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl text-center md:text-right">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>نموذج محاكي إكسيل المحاسبي الحقيقي (Live Excel Engine)</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight bg-gradient-to-r from-white via-emerald-100 to-teal-200 bg-clip-text text-transparent">
                برنامج إكسيل المحاسبي والتفاعلي المكتمل 📊
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                شيت إكسيل حي متعدد أوراق العمل (P&L, Payroll, Trial Balance)، يدعم المعادلات المحاسبية، التنسيق الشرطي، وتصدير واستيراد ملفات CSV الحقيقية.
              </p>

              {/* Sub-Tabs Nav Bar */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2">
                <button
                  onClick={() => setActiveSubTab("grid")}
                  className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                    activeSubTab === "grid"
                      ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-105"
                      : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>الشيت التفاعلي الحقيقي</span>
                </button>

                <button
                  onClick={() => setActiveSubTab("formulas")}
                  className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                    activeSubTab === "formulas"
                      ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-105"
                      : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>موسوعة الدوال ({EXCEL_FORMULAS.length})</span>
                </button>

                <button
                  onClick={() => setActiveSubTab("shortcuts")}
                  className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                    activeSubTab === "shortcuts"
                      ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-105"
                      : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                  }`}
                >
                  <Keyboard className="w-4 h-4" />
                  <span>الاختصارات السريعة</span>
                </button>

                <button
                  onClick={() => setActiveSubTab("challenges")}
                  className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                    activeSubTab === "challenges"
                      ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-105"
                      : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>تحديات واختبارات</span>
                  {userXp > 0 && (
                    <span className="bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded text-[10px] font-black">
                      +{userXp} XP
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Stat Card */}
            <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-4 space-y-3 w-full md:w-72 backdrop-blur-md shrink-0">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 border-b border-white/10 pb-2">
                <span>محرك الإكسيل المحاسبي</span>
                <span className="text-emerald-400 font-mono">v2026 Engine</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
                  <span className="block text-lg font-black text-emerald-400">{sheets.length}</span>
                  <span className="text-[10px] text-slate-300">أوراق عمل (Sheets)</span>
                </div>
                <div className="p-2 rounded-xl bg-teal-950/40 border border-teal-500/20">
                  <span className="block text-lg font-black text-teal-300">SUM / IF</span>
                  <span className="text-[10px] text-slate-300">دوال حية مجسدة</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= TAB 1: REAL LIVE INTERACTIVE SPREADSHEET ================= */}
        {activeSubTab === "grid" && (
          <div className="space-y-4">

            {/* WORKSHEETS TABS BAR */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar bg-slate-900/90 border border-white/10 p-2 rounded-2xl">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {sheets.map((sheet) => {
                  const isActive = sheet.id === activeSheetId;
                  return (
                    <button
                      key={sheet.id}
                      onClick={() => {
                        setActiveSheetId(sheet.id);
                        setSelectedCell("B2");
                        const meta = sheet.grid["B2"];
                        setCellInput(meta ? meta.value : "");
                      }}
                      className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 border border-emerald-400/50 scale-102"
                          : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-white/5"
                      }`}
                    >
                      <span className="text-sm">{sheet.icon}</span>
                      <span>{sheet.name}</span>
                    </button>
                  );
                })}

                <button
                  onClick={handleAddSheet}
                  className="px-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                  title="إضافة ورقة عمل جديدة"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ورقة جديدة</span>
                </button>
              </div>

              {/* XLSX / CSV Import & Export buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                  title="استيراد ملف Excel حقيقي (.xlsx / .csv)"
                >
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">استيراد Excel</span>
                </button>

                <button
                  onClick={handleExportXLSX}
                  className="px-3 py-1.5 rounded-xl bg-teal-600/30 hover:bg-teal-600/50 text-teal-200 border border-teal-500/30 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                  title="تصدير ورقة العمل الحالية بصيغة Microsoft Excel (.xlsx)"
                >
                  <Download className="w-3.5 h-3.5 text-teal-300" />
                  <span>تصدير الشيت (.xlsx)</span>
                </button>

                <button
                  onClick={handleExportAllSheetsXLSX}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 cursor-pointer transition-all border border-emerald-400/30"
                  title="تصدير جميع أوراق العمل في ملف Excel موحد (.xlsx)"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>تصدير كامل الملف (.xlsx)</span>
                </button>
              </div>
            </div>

            {/* REAL EXCEL TOOLBAR (Formatting & Structure controls) */}
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-xl">
              
              {/* Text formatting & Alignment */}
              <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-white/10">
                <button
                  onClick={() => handleApplyFormatting("bold", !selectedCellMeta.bold)}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    selectedCellMeta.bold ? "bg-emerald-500 text-slate-950 font-black" : "text-slate-400 hover:text-white"
                  }`}
                  title="خط عريض Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleApplyFormatting("italic", !selectedCellMeta.italic)}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    selectedCellMeta.italic ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                  title="مائل Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>

                <div className="w-px h-4 bg-white/10 mx-1" />

                <button
                  onClick={() => handleApplyFormatting("align", "right")}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    selectedCellMeta.align === "right" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                  title="محاذاة لليمين"
                >
                  <AlignRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleApplyFormatting("align", "center")}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    selectedCellMeta.align === "center" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                  title="محاذاة للوسط"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleApplyFormatting("align", "left")}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    selectedCellMeta.align === "left" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                  title="محاذاة لليسار"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Background Highlight Colors */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-slate-400 font-bold px-1">اللون:</span>
                {[
                  { id: "default", name: "افتراضي", color: "bg-slate-800 border-slate-600" },
                  { id: "green", name: "أخضر المجموع", color: "bg-emerald-600 border-emerald-400" },
                  { id: "blue", name: "أزرق العنوان", color: "bg-blue-600 border-blue-400" },
                  { id: "yellow", name: "أصفر للتنبيه", color: "bg-amber-500 border-amber-300" },
                  { id: "purple", name: "بنفسجي", color: "bg-purple-600 border-purple-400" }
                ].map((bgItem) => (
                  <button
                    key={bgItem.id}
                    onClick={() => handleApplyFormatting("bg", bgItem.id)}
                    className={`w-5 h-5 rounded-md border transition-transform cursor-pointer ${bgItem.color} ${
                      selectedCellMeta.bg === bgItem.id ? "scale-125 ring-2 ring-white" : "opacity-80 hover:opacity-100"
                    }`}
                    title={bgItem.name}
                  />
                ))}
              </div>

              {/* Number Formatting Controls */}
              <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-white/10 text-xs">
                <button
                  onClick={() => handleApplyFormatting("numFormat", "currency")}
                  className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors ${
                    selectedCellMeta.numFormat === "currency" ? "bg-emerald-500 text-slate-950" : "text-slate-300 hover:text-white"
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>عملة ($)</span>
                </button>
                <button
                  onClick={() => handleApplyFormatting("numFormat", "percent")}
                  className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors ${
                    selectedCellMeta.numFormat === "percent" ? "bg-emerald-500 text-slate-950" : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Percent className="w-3.5 h-3.5" />
                  <span>نسبة (%)</span>
                </button>
                <button
                  onClick={() => handleApplyFormatting("numFormat", "general")}
                  className={`px-2 py-1 rounded-lg font-bold transition-colors ${
                    !selectedCellMeta.numFormat || selectedCellMeta.numFormat === "general" ? "bg-slate-800 text-white" : "text-slate-400"
                  }`}
                >
                  عام
                </button>
              </div>

              {/* Rows & Columns controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddRow}
                  className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 text-xs font-bold border border-white/10 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>صف جديد</span>
                </button>
                <button
                  onClick={handleAddColumn}
                  className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 text-xs font-bold border border-white/10 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 text-teal-400" />
                  <span>عمود جديد</span>
                </button>
                <button
                  onClick={handleResetSheet}
                  className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded-xl border border-rose-500/30 text-xs"
                  title="إعادة ضبط الشيت"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* FORMULA BAR (fx) */}
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-slate-950 p-2.5 border-b border-white/10 flex items-center gap-3">
                <div className="px-3 py-1 bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-xs sm:text-sm rounded-lg shrink-0">
                  {selectedCell}
                </div>
                <div className="text-emerald-400 font-serif italic text-sm font-black shrink-0">fx</div>
                <input
                  type="text"
                  value={cellInput}
                  onChange={handleCellInputChange}
                  placeholder="أدخل قيمة أو معادلة إكسيل تبدأ بـ = (مثال: =SUM(B2:B10) أو =B2-B3)..."
                  className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3.5 py-1.5 text-xs sm:text-sm font-mono text-emerald-300 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* SPREADSHEET GRID TABLE */}
              <div className="p-2 sm:p-4 overflow-x-auto no-scrollbar">
                <table className="w-full text-right border-collapse font-sans text-xs sm:text-sm min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 font-mono text-center">
                      <th className="w-10 p-2 border border-slate-800 bg-slate-900">#</th>
                      {Array.from({ length: currentSheet.colCount }).map((_, colIdx) => (
                        <th key={colIdx} className="p-2 border border-slate-800 min-w-[120px]">
                          {getColLetter(colIdx)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: currentSheet.rowCount }).map((_, rowIdx) => {
                      const rowNum = rowIdx + 1;
                      return (
                        <tr key={rowNum} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-2 border border-slate-800 bg-slate-950 text-slate-500 font-mono text-center font-bold">
                            {rowNum}
                          </td>

                          {Array.from({ length: currentSheet.colCount }).map((_, colIdx) => {
                            const colLetter = getColLetter(colIdx);
                            const cellId = `${colLetter}${rowNum}`;
                            const cellMeta = currentSheet.grid[cellId] || { value: "" };
                            const rawVal = cellMeta.value || "";
                            const isFormula = rawVal.startsWith("=");
                            const evaluated = evaluateCellValue(cellId, currentSheet.grid);
                            const isSelected = selectedCell === cellId;

                            // Color styling
                            let bgClass = "bg-slate-900/40 text-slate-200";
                            if (cellMeta.bg === "green") bgClass = "bg-emerald-950/80 text-emerald-200 border-emerald-500/40";
                            if (cellMeta.bg === "blue") bgClass = "bg-blue-950/80 text-blue-200 border-blue-500/40";
                            if (cellMeta.bg === "yellow") bgClass = "bg-amber-950/80 text-amber-200 border-amber-500/40";
                            if (cellMeta.bg === "purple") bgClass = "bg-purple-950/80 text-purple-200 border-purple-500/40";

                            let alignClass = "text-right";
                            if (cellMeta.align === "center") alignClass = "text-center";
                            if (cellMeta.align === "left") alignClass = "text-left dir-ltr";

                            return (
                              <td
                                key={cellId}
                                onClick={() => handleCellClick(cellId)}
                                className={`p-2.5 border border-slate-800 cursor-pointer transition-all relative font-mono text-xs ${bgClass} ${
                                  isSelected
                                    ? "bg-emerald-950 ring-2 ring-emerald-400 z-10 font-black text-white shadow-lg"
                                    : "hover:bg-white/5"
                                }`}
                              >
                                <div className={`flex items-center justify-between gap-1 overflow-hidden ${alignClass}`}>
                                  <span
                                    className={`truncate ${cellMeta.bold ? "font-black text-white" : ""} ${
                                      cellMeta.italic ? "italic" : ""
                                    } ${isFormula && !isSelected ? "text-emerald-400 font-bold" : ""}`}
                                  >
                                    {evaluated.displayStr}
                                  </span>

                                  {isFormula && (
                                    <span className="text-[9px] text-emerald-500 font-sans opacity-70 shrink-0 font-bold">
                                      fx
                                    </span>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* GRID FOOTER SUMMARY & HELP */}
              <div className="bg-slate-950 p-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-emerald-300 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    الخلية المحددة: <strong className="font-mono text-white bg-slate-900 px-1.5 py-0.5 rounded border border-white/10">{selectedCell}</strong>
                  </span>
                  <span className="text-slate-600">|</span>
                  <span>الصيغة المخزنة: <span className="text-slate-200 font-mono">{selectedCellMeta.value || "(فارغ)"}</span></span>
                </div>

                <div className="flex items-center gap-4 text-[11px]">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500" /> صيغة محسوبة (fx)</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-slate-600" /> إدخال مباشر</span>
                </div>
              </div>
            </div>

            {/* QUICK EXCEL TIPS */}
            <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3">
              <Zap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 space-y-1">
                <p className="font-bold text-emerald-300">نصائح احترافية في التعامل مع نماذج الإكسيل الحقيقية:</p>
                <p>
                  يمكنك استخدام صيغ الجمع <code className="bg-emerald-950 text-emerald-300 px-1 py-0.5 rounded font-mono">=SUM(B2:B10)</code>، أو حساب النسبة المئوية <code className="bg-emerald-950 text-emerald-300 px-1 py-0.5 rounded font-mono">=B4/B2</code>، أو إجراء العمليات الرياضية مثل <code className="bg-emerald-950 text-emerald-300 px-1 py-0.5 rounded font-mono">=B2-B3</code>. كما يمكنك تصدير النتيجة إلى ملف CSV حقيقي بالضغط على زر التصدير في الأعلى.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 2: FORMULAS CATALOG ================= */}
        {activeSubTab === "formulas" && (
          <div className="space-y-6">
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-white/10 rounded-2xl p-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formulaSearch}
                  onChange={(e) => setFormulaSearch(e.target.value)}
                  placeholder="ابحث عن اسم الدالة (مثل VLOOKUP)..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl pr-9 pl-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
                {["الكل", "أساسية", "مالية", "بحث ورابط", "شرطية"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Formulas Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {EXCEL_FORMULAS.filter((f) => {
                const matchCat = selectedCategory === "الكل" || f.category === selectedCategory;
                const matchSearch =
                  f.name.toLowerCase().includes(formulaSearch.toLowerCase()) ||
                  f.nameAr.includes(formulaSearch) ||
                  f.description.includes(formulaSearch);
                return matchCat && matchSearch;
              }).map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-white/10 hover:border-emerald-500/50 rounded-2xl p-5 space-y-4 transition-all hover:shadow-xl group"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xl text-emerald-400">{item.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-[10px] text-emerald-300 font-bold">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-200">{item.nameAr}</h3>
                    </div>

                    <button
                      onClick={() => {
                        setActiveSubTab("grid");
                        setCellInput(item.exampleData.formula);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1 shrink-0 transition-all cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>جرب في الشيت</span>
                    </button>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 font-bold block">طريقة صياغة الدالة (Syntax):</span>
                    <div className="bg-slate-950 p-2.5 rounded-xl font-mono text-xs text-emerald-300 border border-emerald-500/20 dir-ltr text-left overflow-x-auto">
                      {item.syntax}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                    <p><strong className="text-white">الشرح:</strong> {item.description}</p>
                    <p><strong className="text-emerald-400">الاستخدام المحاسبي:</strong> {item.accountingUse}</p>
                  </div>

                  <div className="bg-slate-950/80 border border-white/5 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                      <span>مثال عملي تطبيقي:</span>
                      <span className="text-emerald-400 font-mono">{item.exampleData.result}</span>
                    </div>
                    <div className="font-mono text-xs text-indigo-300 dir-ltr text-left">
                      {item.exampleData.formula}
                    </div>
                    <p className="text-[11px] text-slate-400">{item.exampleData.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: KEYBOARD SHORTCUTS ================= */}
        {activeSubTab === "shortcuts" && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="p-3 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  <Keyboard className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">اختصارات لوحة المفاتيح للمحاسب المالي السريع</h2>
                  <p className="text-xs text-slate-400">وفر أكثر من 50% من وقت عملك اليومي باستخدام اختصارات الإكسيل المحترفة.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {EXCEL_SHORTCUTS.map((sc, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950 border border-white/10 hover:border-emerald-500/40 rounded-2xl p-4 flex items-start justify-between gap-3 transition-all group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono font-black text-xs dir-ltr">
                          {sc.key}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400">
                          {sc.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium">{sc.description}</p>
                      {sc.actionNote && (
                        <p className="text-[11px] text-emerald-400 font-bold">💡 {sc.actionNote}</p>
                      )}
                    </div>

                    <button
                      onClick={() => handleCopy(sc.key, sc.key)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="نسخ الاختصار"
                    >
                      {copiedKey === sc.key ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: CHALLENGES & QUIZZES ================= */}
        {activeSubTab === "challenges" && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-amber-950 text-amber-400 border border-amber-500/30">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">تحديات كتابة معادلات الإكسيل المحاسبي</h2>
                    <p className="text-xs text-slate-400">اختبر مهاراتك الفعلية واكسب نقاط XP عند الإجابة الصحيحة!</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {EXCEL_CHALLENGES.map((ch, idx) => (
                    <button
                      key={ch.id}
                      onClick={() => {
                        setActiveChallengeIdx(idx);
                        setChallengeUserFormula("");
                        setChallengeResult(null);
                      }}
                      className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                        activeChallengeIdx === idx
                          ? "bg-emerald-500 text-slate-950 scale-110 shadow-lg shadow-emerald-500/30"
                          : completedChallenges.includes(ch.id)
                          ? "bg-emerald-950 border border-emerald-500/50 text-emerald-400"
                          : "bg-white/5 text-slate-400 border border-white/10"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {EXCEL_CHALLENGES[activeChallengeIdx] && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-emerald-400">
                        {EXCEL_CHALLENGES[activeChallengeIdx].title}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                        +{EXCEL_CHALLENGES[activeChallengeIdx].xpReward} XP
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">
                      {EXCEL_CHALLENGES[activeChallengeIdx].description}
                    </p>
                    <p className="text-xs font-bold text-emerald-300">
                      🎯 المطلوب: {EXCEL_CHALLENGES[activeChallengeIdx].task}
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-white/10 rounded-xl p-3 overflow-x-auto">
                    <table className="w-full text-center border-collapse font-mono text-xs">
                      <thead>
                        <tr className="bg-slate-900 text-slate-400">
                          <th className="p-2 border border-slate-800">#</th>
                          <th className="p-2 border border-slate-800">A</th>
                          <th className="p-2 border border-slate-800">B</th>
                          <th className="p-2 border border-slate-800">C</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2, 3, 4, 5].map((row) => (
                          <tr key={row}>
                            <td className="p-2 border border-slate-800 text-slate-500 font-bold bg-slate-900">{row}</td>
                            {["A", "B", "C"].map((col) => {
                              const cellKey = `${col}${row}`;
                              const val = EXCEL_CHALLENGES[activeChallengeIdx].gridSetup[cellKey] || "";
                              return (
                                <td
                                  key={cellKey}
                                  className={`p-2 border border-slate-800 ${
                                    val === "" ? "bg-amber-950/30 text-amber-300 font-bold" : "text-slate-300"
                                  }`}
                                >
                                  {val === "" ? "؟ (أدخل الصيغة)" : val}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-300 block">اكتب صيغة الإكسيل الصحيحة هنا:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={challengeUserFormula}
                        onChange={(e) => setChallengeUserFormula(e.target.value)}
                        placeholder="مثال: =B2-B3-B4"
                        className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-emerald-300 focus:outline-none focus:border-emerald-500 dir-ltr text-left"
                      />
                      <button
                        onClick={handleCheckChallenge}
                        className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/20 shrink-0 cursor-pointer"
                      >
                        تحقق من الحل
                      </button>
                    </div>
                  </div>

                  {challengeResult && (
                    <div
                      className={`p-4 rounded-xl border flex items-center gap-3 text-xs sm:text-sm font-bold ${
                        challengeResult.success
                          ? "bg-emerald-950/80 border-emerald-500 text-emerald-300"
                          : "bg-rose-950/80 border-rose-500 text-rose-300"
                      }`}
                    >
                      {challengeResult.success ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                      <span>{challengeResult.msg}</span>
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
