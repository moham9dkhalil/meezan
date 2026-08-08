import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Receipt,
  QrCode,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Info,
  HelpCircle,
  Calculator,
  ShieldCheck,
  FileText,
  Copy,
  Check,
  Printer,
  Sparkles,
  Search,
  ChevronLeft,
  X,
  ExternalLink,
  Code,
  Zap,
  BookOpen
} from "lucide-react";

export interface InvoiceSectionInfo {
  id: string;
  title: string;
  badge: string;
  importance: string;
  formula?: string;
  legalStandard: string;
  examples: string[];
  mistakesToAvoid: string[];
  techDetails?: string;
}

export const INVOICE_SECTIONS_DATA: Record<string, InvoiceSectionInfo> = {
  seller_info: {
    id: "seller_info",
    title: "بيانات المورد الرسمية والرقم الضريبي (Seller Info & VAT TIN)",
    badge: "شرط قانوني جوهري ⚖️",
    importance:
      "تعد بيانات المورد الأساس القانوني الأولي لمعرفة الشخص الخاضع للضريبة الملتزم بتحصيل الضريبة المضافة وتوريدها للجهة المختصة. بدون الرقم الضريبي للمورد (15 رقم)، تصبح الفاتورة باطلة ولا يحق للمشتري خصم ضريبتها.",
    legalStandard:
      "يشترط نظام ضريبة القيمة المضافة (المادة 53 من اللائحة) إدراج الاسم الرسمي للمنشأة، العنوان الوطني المسجل، ورقم التسجيل الضريبي (VAT TIN) المكون من 15 رقماً ويبدأ وينتهي برقم 3.",
    examples: [
      "الاسم: شركة الميزان للتكنولوجيا والحلول البرمجية المحدودة",
      "الرقم الضريبي: 310892401900003 (15 رقم معتمد)",
      "السجل التجاري: 1010892041 | العنوان: الرياض - حي العليا - طريق الملك فهد"
    ],
    mistakesToAvoid: [
      "استخدام اسم تجاري مشهور أو فرعي غير مسجل في شهادة التسجيل الضريبي.",
      "كتابة رقم ضريبي غير فعال أو ملغى لدى الهيئة.",
      "إغفال إدراج العنوان الوطني التفصيل للمورد."
    ],
    techDetails:
      "في نظام الفوترة الإلكترونية (ZATCA / ETA XML)، يُخزن اسم المورد في الوسم <cac:AccountingSupplierParty> ويُشترط مطابقتة تماماً لشهادة CSID الرقمية."
  },

  invoice_type: {
    id: "invoice_type",
    title: "عنوان ونوع الفاتورة الضريبية (Invoice Category & Type)",
    badge: "تصنيف الفوترة 🏷️",
    importance:
      "يحدد نوع الفاتورة المسار الضريبي المتطلب؛ فالفاتورة الضريبية القياسية (B2B) تتطلب التدقيق والمشاركة الفورية معنا الهيئة (Clearance Mode)، بينما الفاتورة المبسطة (B2C) تعتمد على الإرسال والترخيص خلال 24 ساعة (Reporting Mode).",
    legalStandard:
      "يجب كتابة عبارة 'فاتورة ضريبية' (Standard Tax Invoice) للمعاملات بين المنشآت B2B، أو 'فاتورة ضريبية مبسطة' (Simplified Tax Invoice) للمبيعات الموجهة للأفراد المستهلكين B2C.",
    examples: [
      "B2B: فاتورة ضريبية أصلية لصفقة بين شركتين بقيمة 50,000 ريال.",
      "B2C: فاتورة ضريبية مبسطة مطبوعة من كاشير مطعم أو محل تجزئة لعميل فرد."
    ],
    mistakesToAvoid: [
      "كتابة كلمة 'فاتورة مبيعات' أو 'سند قبض' بدلاً من العنوان الصريح 'فاتورة ضريبية'.",
      "إصدار فاتورة مبسطة B2C لشركة ترغب في خصم ضريبة المدخلات بدون إدراج رقمها الضريبي."
    ],
    techDetails:
      "يُرمز لنوع الفاتورة في كود XML بالرمز '388' للفاتورة الضريبية و Subtype '0100000' للقياسية و '0200000' للمبسطة."
  },

  metadata: {
    id: "metadata",
    title: "الرقم التسلسلي وتاريخ التوريد والوقت (Invoice Serial & Timestamp)",
    badge: "التسلسل والزمن ⏱️",
    importance:
      "يمنع التسلسل الأبجدي/الرقمي غير المنقطع إمكانية التلاعب أو حذف الفواتير. كما يحدد تاريخ التوريد الربع الضريبي المستحق الذي يجب إدراج الفاتورة فيه فوراً.",
    legalStandard:
      "المادة 53 تتطلب رقماً تسلسلياً فريداً للفاتورة لا يتكرر أبداً، وتاريخ إصدار الفاتورة وتاريخ التوريد الفعلي إذا كان مختلفاً عن تاريخ الإصدار.",
    formula: "Invoice ID = INV-{YEAR}-{BRANCH}-{INCREMENTAL_NUMBER}",
    examples: [
      "رقم التسلسل: INV-2026-00894 (متسلسل تلقائياً وبدون فجوات)",
      "تاريخ ووقت الإصدار: 2026-08-07 10:30:15 UTC",
      "تاريخ التوريد: 2026-08-07"
    ],
    mistakesToAvoid: [
      "وجود فجوات تسلسلية (Gaps) بين أرقام الفواتير الصادرة.",
      "تاريخ توريد سابق أو لاحق بفترة طويلة دون إثبات سند التسليم المستندي.",
      "تكرار نفس رقم الفاتورة لعميلين مختلفين."
    ],
    techDetails:
      "تتطلب مرحلة الربط (Phase 2) خوارزمية الربط بالكتل (Cryptographic Stamp Chain) حيث ترتبط كل فاتورة بـ Hash الفاتورة التي سبقتها فوراً لمنع التعديل."
  },

  buyer_info: {
    id: "buyer_info",
    title: "بيانات العميل المشتري والرقم الضريبي (Buyer Info & VAT No)",
    badge: "حق الخصم الضريبي 🏢",
    importance:
      "في فواتير B2B، تعتبر بيانات المشتري وركمه الضريبي شرطاً لا يقبل الاستثناء ليتمكن العميل من خصم ضريبة القيمة المضافة المدفوعة كضريبة مدخلات في إقراره.",
    legalStandard:
      "إدراج الاسم القانوني للعميل، الرقم الضريبي (إن وجد)، والعنوان الوطني للعميل إذا تجاوزت قيمة المعاملة الحد المعين أو لمعاملات B2B.",
    examples: [
      "اسم المنشأة المشترية: شركة الأفق للحلول المحاسبية والاستشارات",
      "الرقم الضريبي للعميل: 300982301900003",
      "العنوان: شارع التخصصي - حي السليمانية - الرياض"
    ],
    mistakesToAvoid: [
      " ترك بيانات العميل فارغة أو كتابة 'عميل نقدي' في فواتير B2B التي تتجاوز قيمتها 1,000 ريال.",
      "أخطاء في نقل الرقم الضريبي للعميل مما يحرمه من خصم الضريبة."
    ]
  },

  line_items: {
    id: "line_items",
    title: "تفاصيل الأصناف والخدمات والأسعار (Line Items & Discounts)",
    badge: "صلب الفاتورة 📦",
    importance:
      "تبيان دقيق ونوعية السلعة أو الخدمة المباعة مع الكمية، سعر الوحدة، والخصم الممنوح، للتحقق من صحة تطبيق نسبة الضريبة المناسبة (15% أو 0% أو معفى).",
    legalStandard:
      "يجب إدراج وصف كامل للسلع/الخدمات، كمية السلع أو عدد الخدمات، سعر الوحدة غير شامل الضريبة، وأي خصومات أو تخفيضات تجارية قبل الضريبة.",
    formula: "المبلغ الخاضع للسلعة = (الكمية × سعر الوحدة) - الخصم المباشر",
    examples: [
      "اشتراك ERP: 2 وحدة × 4,500 ريال - خصم 500 = 8,500 ريال خاضع للضريبة",
      "خدمات استشارية: 5 ساعات × 300 ريال - خصم 100 = 1,400 ريال"
    ],
    mistakesToAvoid: [
      "وصف مبهم مثل 'بضائع متنوعة' دون تحديد السلعة دقيقاً.",
      "تطبيق الخصم بعد حساب الضريبة بدلاً من تطبيقه قبل حساب الضريبة."
    ]
  },

  net_amount: {
    id: "net_amount",
    title: "إجمالي المبلغ الخاضع للضريبة قبل الضريبة (Taxable Base Amount)",
    badge: "وعاء الضريبة 💰",
    importance:
      "هو المجموع الكلي للأسعار الصافية لجميع الأصناف بعد الخصومات المباشرة وقبل إضافة ضريبة القيمة المضافة. هذا الرقم هو الوعاء الضريبي المباشر للإقرار.",
    formula: "إجمالي صافي المبلغ = ∑ (المبالغ الخاضعة لكل صنف بعد الخصم)",
    legalStandard:
      "يجب إظهار صافي المبلغ الخاضع لكل نسبة ضريبية على حدة (النسبة الأساسية 15%، نسبة الصفر 0%، والمعفى) بشكل واضح وقابل للمطابقة.",
    examples: [
      "صافي الصنف الأول: 8,500 ريال",
      "صافي الصنف الثاني: 3,000 ريال",
      "صافي الصنف الثالث: 1,400 ريال",
      "إجمالي المبلغ الخاضع للضريبة = 12,900.00 ريال"
    ],
    mistakesToAvoid: [
      "خلط المبيعات المعفاة أو الخاضعة لنسبة الصفر مع المبيعات الخاضعة للنسبة الأساسية 15%."
    ]
  },

  vat_rate_amount: {
    id: "vat_rate_amount",
    title: "مبلغ وقيمة ضريبة القيمة المضافة (VAT Calculation 15%)",
    badge: "طريقة الحساب 🧮",
    importance:
      "الرقم الأكثر أهمية ودقة بالفاتورة! يمثل أمانة مالية يحصلها البائع لحساب الهيئة. يجب حسابه بالدقة المكونة من خانتين عشريتين مع التقريب النظامي الصحيح.",
    legalStandard:
      "تطبيق النسبة المعتمدة (15% في السعودية، 5% في الإمارات/عمان، 14% في مصر) وإظهار مبلغ الضريبة الإجمالي بالعملة المحلية بشكل مستقل وصريح.",
    formula:
      "مبلغ الضريبة = إجمالي المبلغ الخاضع × (نسبة الضريبة ÷ 100)\nمثال: 12,900.00 × 0.15 = 1,935.00 ريال",
    examples: [
      "طريقة الحساب للأسعار غير الشاملة: 12,900 × 15% = 1,935.00 ريال ضريبة",
      "طريقة استخراج الضريبة من السعر الشامل: السعر الشامل ÷ 1.15 × 0.15"
    ],
    mistakesToAvoid: [
      "أخطاء التقريب العشري (Rounding errors) في الهليلات/القروش.",
      "عرض الضريبة بعملة أجنبية فقط دون تحويلها للعملة الوطنية بسعر الصرف الرسمي يوم الفاتورة."
    ],
    techDetails:
      "في نظام الفوترة، يُشترط أن يتوافق مبلغ الضريبة على مستوى الصنف <cac:TaxTotal> مع المجموع الكلي للضريبة بدقة متناهية متوافقة مع شروط ZATCA Schematron Rules."
  },

  grand_total: {
    id: "grand_total",
    title: "الإجمالي النهائي شامل الضريبة والتفقيط (Grand Total Amount)",
    badge: "المبلغ النهائي 💳",
    importance:
      "المبلغ الكلي المستحق على المشتري سداده شامل ضريبة القيمة المضافة، بالإضافة للتفقيط الحرفي النصي للوقاية من التزوير والتلاعب بالحسابات.",
    formula: "الإجمالي الكلي شامل الضريبة = إجمالي المبلغ الخاضع + إجمالي الضريبة",
    legalStandard:
      "كتابة المبلغ النهائي أرقاماً وكتابة المجموع بالكلمات (التفقيط) لبيان القيمة النهائية بوضوح.",
    examples: [
      "12,900.00 ريال (المبلغ) + 1,935.00 ريال (الضريبة) = 14,835.00 ريال سعودي",
      "التفقيط: فقط أربعة عشر ألفاً وثمانمائة وخمسة وثلاثون ريالاً سعودياً لا غير"
    ],
    mistakesToAvoid: [
      "اختلاف المجموع بالأرقام عن التفقيط المكتوب نصاً.",
      "تجميع الضريبة مرتين أو إهمال الخصم في الحساب النهائي."
    ]
  },

  qr_code: {
    id: "qr_code",
    title: "رمز الاستجابة السريعة المشفّر (ZATCA Base64 TLV Encrypted QR Code)",
    badge: "التشفير الإلكتروني 📲",
    importance:
      "قلب الفوترة الإلكترونية الحديثة! يتيح لمفتشي الهيئة وللعميل مسح الفاتورة فوراً عبر تطبيق الهيئة للتأكد من أصالتها، وتسجيلها المباشر في قاعدة بيانات الدولة دون تزوير.",
    legalStandard:
      "إلزامي لجميع الفواتير. يتكون من ترميز TLV (Tag-Length-Value) المشفّر بصيغة Base64 ويحتوي على 5 حقول رئيسية للفاتورة المبسطة و9 حقول للفاتورة B2B المربوطة.",
    formula:
      "Structure: Tag 1 (Seller Name) + Tag 2 (VAT TIN) + Tag 3 (Timestamp) + Tag 4 (Invoice Total) + Tag 5 (VAT Amount) -> TLV Encoding -> Base64 String",
    examples: [
      "محتوى الـ QR المشفّر: AQ1BbE1pemFuIENvCg8zMTA4OTI0MDE5MDAwMDM...",
      "عند مسح الكود بالتطبيق يعرض فوراً: اسم الشركة، الرقم الضريبي، الوقت، المبلغ والضريبة."
    ],
    mistakesToAvoid: [
      "إنشاء QR يحتوي على رابط URL عادي بدلاً من ترميز TLV Base64 المعتمد.",
      "عدم تطابق البيانات المكتوبة في الكود مع المبالغ المطبوعة على الورقة."
    ],
    techDetails:
      "تستخدم الهيئة خوارزميات ECDSA (Secp256k1) للتوقيع الرقمي، ويحتوي رمز QR في مرحلة الربط أيضاً على ECDSA Signature و Public Key و Hash الفاتورة."
  },

  uuid_hash: {
    id: "uuid_hash",
    title: "المعرف الفريد (UUID) والختم الرقمي (Cryptographic Stamp & Hash)",
    badge: "البصمة الرقمية 🔐",
    importance:
      "معرف رقمي عالمي يتكون من 128-بت يضمن عدم تكرار الفاتورة في العالم أجمع، مع بصمة رقمية تشفيرية تميز الفاتورة لمنع التلاعب بالبيانات بعد إصدارها.",
    legalStandard:
      "يتوجب توليد UUID بصيغة Version 4 مع خوارزمية SHA-256 لحساب Hash الفاتورة وحفظه في سجلات الفوترة الإلكترونية السحابية.",
    examples: [
      "UUID: c4a89f10-7212-4d8e-9a1f-[#2026-Mizan-EInvoice]",
      "SHA-256 Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    ],
    mistakesToAvoid: [
      "توليد UUID ثابت أو معاد استخدامه.",
      "تعديل أي حرف بالفاتورة بعد توقيع الـ Hash مما يؤدي لتلف الختم الرقمي."
    ]
  },

  payment_method: {
    id: "payment_method",
    title: "طريقة السداد وتاريخ الاستحقاق والبنك (Payment Terms & IBAN)",
    badge: "التسوية والمطابقة 🏦",
    importance:
      "تسهل عملية السداد وتوضح الموعد المالي النهائي، وتساعد في عمليات المطابقة البنكية الدورية بين الحساب البنكي والإقرارات الضريبية.",
    legalStandard:
      "بيان طريقة السداد (نقداً، تحويل بنكي، سداد، مدى) ورقم الحساب البنكي الدولي IBAN مع تحديد شروط الائتمان وموعد الاستحقاق.",
    examples: [
      "طريقة الدفع: تحويل بنكي إلى حساب الشركة - بنك الراجحي",
      "IBAN: SA03 8000 0000 6080 1010 9901",
      "شروط السداد: صافي 30 يوماً من تاريخ التوريد"
    ],
    mistakesToAvoid: [
      "إغفال موعد الاستحقاق في المبيعات الآجلة."
    ]
  }
};

export function InteractiveTaxInvoiceModel() {
  const [invoiceMode, setInvoiceMode] = useState<"b2b" | "b2c">("b2b");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("vat_rate_amount");
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);
  const [copiedQr, setCopiedQr] = useState<boolean>(false);

  const activeInfo = INVOICE_SECTIONS_DATA[selectedSectionId] || INVOICE_SECTIONS_DATA["vat_rate_amount"];

  const getSectionHighlightClass = (sectionId: string) => {
    const isSelected = selectedSectionId === sectionId;
    const isHovered = hoveredSectionId === sectionId;

    if (isSelected) {
      return "ring-2 ring-amber-400 bg-amber-500/15 shadow-lg shadow-amber-500/20 border-amber-400";
    }
    if (isHovered) {
      return "ring-2 ring-indigo-400 bg-indigo-500/15 border-indigo-400 cursor-pointer";
    }
    return "border border-dashed border-white/20 hover:border-indigo-400/60 bg-white/5 cursor-pointer transition-all";
  };

  return (
    <div className="space-y-8 font-sans">
      {/* HEADER BAR & INVOICE SELECTOR */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0b1329] via-[#111e3f] to-[#0b1329] border border-indigo-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>أداة الشرح التفاعلي لبنية الفاتورة الضريبية الإلكترونية معتمدة 2026</span>
            </span>
            <h3 className="text-xl font-black text-white">
              النموذج التفاعلي الشارح للفاتورة الضريبية الرسمية 📄🔍
            </h3>
            <p className="text-xs text-slate-300">
              اضغط على أي جزء داخل الفاتورة (مثل: ضريبة القيمة المضافة، كود QR، الرقم الضريبي، الخ) لعرض الشرح القانوني وطريقة الحساب التفصيلية وشروط الامتثال لدى الهيئة.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/10 shrink-0">
            <button
              onClick={() => setInvoiceMode("b2b")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                invoiceMode === "b2b"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Building2 className="w-4 h-3.5" />
              <span>فاتورة بين الشركات (B2B Standard)</span>
            </button>

            <button
              onClick={() => setInvoiceMode("b2c")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                invoiceMode === "b2c"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Receipt className="w-4 h-3.5" />
              <span>فاتورة مبسطة للأفراد (B2C Simplified)</span>
            </button>
          </div>
        </div>

        {/* Quick Clickable Hotspots Navigation Chips */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">أبرز الأجزاء التفاعلية:</span>
          {[
            { id: "vat_rate_amount", label: "🧮 حساب الضريبة 15%" },
            { id: "qr_code", label: "📲 كود QR المشفّر Base64" },
            { id: "seller_info", label: "🏛️ بيانات المورد وركمه الضريبي" },
            { id: "buyer_info", label: "🏢 بيانات المشتري (B2B)" },
            { id: "line_items", label: "📦 الأصناف والأسعار والخصم" },
            { id: "net_amount", label: "💰 المبلغ الخاضع قبل الضريبة" },
            { id: "metadata", label: "⏱️ الرقم التسلسلي والتاريخ" },
            { id: "uuid_hash", label: "🔐 المعرف الفريد UUID والختم" },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setSelectedSectionId(chip.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                selectedSectionId === chip.id
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT: INVOICE CANVAS & DETAILED EXPLAINER DRAWER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (7 COLS): INTERACTIVE INVOICE PAPER CANVAS */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-2 font-bold">
            <span className="flex items-center gap-1.5 text-indigo-300">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>نموذج حقيقي تفاعلي - اضغط على أي جزء ملون للشرح</span>
            </span>
            <span className="text-[11px] bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-md font-mono">
              ZATCA / ETA Standard Compliant 🟢
            </span>
          </div>

          {/* INVOICE CANVAS CARD */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#090d1f] border-2 border-indigo-500/40 shadow-2xl space-y-6 relative overflow-hidden">
            
            {/* Watermark Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent pointer-events-none" />

            {/* SECTION 1: SELLER INFO & INVOICE TYPE HEADER */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pb-4 border-b border-white/10">
              
              {/* Seller Info Block */}
              <div
                onClick={() => setSelectedSectionId("seller_info")}
                onMouseEnter={() => setHoveredSectionId("seller_info")}
                onMouseLeave={() => setHoveredSectionId(null)}
                className={`sm:col-span-7 p-3.5 rounded-2xl relative ${getSectionHighlightClass("seller_info")}`}
              >
                <span className="absolute -top-2.5 right-3 bg-amber-400 text-slate-950 font-extrabold text-[9px] px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  <span>انقر للشرح: بيانات المورد</span>
                </span>

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                      م
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white leading-tight">شركة الميزان الرقمي للتكنولوجيا والحلول</h4>
                      <p className="text-[10px] text-slate-400 font-mono">Al-Mizan Digital Tech Ltd.</p>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-300 space-y-0.5 font-sans pt-1">
                    <p>السجل التجاري (CR): <span className="font-mono font-bold text-indigo-300">1010892041</span></p>
                    <p className="flex items-center gap-1">
                      الرقم الضريبي (VAT TIN):{" "}
                      <span className="font-mono font-black text-amber-300 bg-amber-500/20 px-1.5 rounded">
                        310892401900003
                      </span>
                    </p>
                    <p className="text-[10px] text-slate-400">العنوان: طريق الملك فهد - حي العليا - الرياض - المملكة العربية السعودية</p>
                  </div>
                </div>
              </div>

              {/* Invoice Category Title Block */}
              <div
                onClick={() => setSelectedSectionId("invoice_type")}
                onMouseEnter={() => setHoveredSectionId("invoice_type")}
                onMouseLeave={() => setHoveredSectionId(null)}
                className={`sm:col-span-5 p-3.5 rounded-2xl text-center flex flex-col justify-center relative ${getSectionHighlightClass("invoice_type")}`}
              >
                <span className="absolute -top-2.5 left-3 bg-purple-400 text-slate-950 font-extrabold text-[9px] px-2 py-0.5 rounded-md shadow-sm">
                  عنوان الفاتورة
                </span>

                <span className="text-[10px] font-black uppercase text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full inline-block mx-auto mb-1 border border-indigo-500/30">
                  {invoiceMode === "b2b" ? "Standard Tax Invoice" : "Simplified Tax Invoice"}
                </span>
                <h3 className="text-sm font-black text-white">
                  {invoiceMode === "b2b" ? "فاتورة ضريبية رسمية (B2B)" : "فاتورة ضريبية مبسطة (B2C)"}
                </h3>
                <p className="text-[9px] text-emerald-400 font-mono font-bold mt-1">
                  مرحلة الربط والتكامل مع الهيئة 🟢
                </p>
              </div>

            </div>

            {/* SECTION 2: METADATA GRID (Serial, Dates, Payment) */}
            <div
              onClick={() => setSelectedSectionId("metadata")}
              onMouseEnter={() => setHoveredSectionId("metadata")}
              onMouseLeave={() => setHoveredSectionId(null)}
              className={`p-3.5 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs relative ${getSectionHighlightClass("metadata")}`}
            >
              <span className="absolute -top-2.5 right-3 bg-indigo-400 text-slate-950 font-extrabold text-[9px] px-2 py-0.5 rounded-md shadow-sm">
                الرقم التسلسلي والتاريخ
              </span>

              <div>
                <span className="text-[10px] text-slate-400 block font-bold">رقم الفاتورة:</span>
                <span className="font-mono font-black text-indigo-300">INV-2026-00894</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">تاريخ الإصدار والوقت:</span>
                <span className="font-mono font-bold text-white text-[11px]">2026-08-07 10:30</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">تاريخ التوريد:</span>
                <span className="font-mono font-bold text-white text-[11px]">2026-08-07</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">طريقة الدفع:</span>
                <span className="font-bold text-emerald-400 text-[11px]">تحويل بنكي / سداد</span>
              </div>
            </div>

            {/* SECTION 3: BUYER INFO (B2B vs B2C) */}
            {invoiceMode === "b2b" ? (
              <div
                onClick={() => setSelectedSectionId("buyer_info")}
                onMouseEnter={() => setHoveredSectionId("buyer_info")}
                onMouseLeave={() => setHoveredSectionId(null)}
                className={`p-3.5 rounded-2xl relative ${getSectionHighlightClass("buyer_info")}`}
              >
                <span className="absolute -top-2.5 right-3 bg-sky-400 text-slate-950 font-extrabold text-[9px] px-2 py-0.5 rounded-md shadow-sm">
                  بيانات المشتري (B2B)
                </span>

                <div className="space-y-1">
                  <h5 className="font-black text-xs text-sky-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>بيانات العميل المشتري (Buyer Information):</span>
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-200">
                    <div>
                      <span className="text-slate-400 block text-[10px]">اسم المنشأة المشترية:</span>
                      <span className="font-black text-white">شركة الأفق للحلول المحاسبية والاستشارات</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">الرقم الضريبي للعميل (VAT No):</span>
                      <span className="font-mono font-bold text-amber-300 bg-amber-500/20 px-1 rounded">
                        300982301900003
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">العنوان التجاري:</span>
                      <span className="text-[11px]">شارع التخصصي - حي السليمانية - الرياض</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setSelectedSectionId("buyer_info")}
                onMouseEnter={() => setHoveredSectionId("buyer_info")}
                onMouseLeave={() => setHoveredSectionId(null)}
                className={`p-3 rounded-xl text-xs text-purple-200 flex items-center justify-between relative ${getSectionHighlightClass("buyer_info")}`}
              >
                <span>فاتورة مبسطة للأفراد B2C - لا تتطلب الرقم الضريبي للعميل</span>
                <span className="font-mono text-[10px] text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">
                  كود العميل: CASH-CUST-001
                </span>
              </div>
            )}

            {/* SECTION 4: LINE ITEMS TABLE */}
            <div
              onClick={() => setSelectedSectionId("line_items")}
              onMouseEnter={() => setHoveredSectionId("line_items")}
              onMouseLeave={() => setHoveredSectionId(null)}
              className={`p-3.5 rounded-2xl space-y-2 relative ${getSectionHighlightClass("line_items")}`}
            >
              <span className="absolute -top-2.5 right-3 bg-emerald-400 text-slate-950 font-extrabold text-[9px] px-2 py-0.5 rounded-md shadow-sm">
                جدول الأصناف والأسعار والخصم
              </span>

              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-right text-[11px]">
                  <thead>
                    <tr className="bg-indigo-950/80 text-indigo-200 font-black border-b border-white/10">
                      <th className="py-2.5 px-2">#</th>
                      <th className="py-2.5 px-3">السلعة / الخدمة</th>
                      <th className="py-2.5 px-2 text-center">الكمية</th>
                      <th className="py-2.5 px-2">سعر الوحدة</th>
                      <th className="py-2.5 px-2">الخصم</th>
                      <th className="py-2.5 px-2">المبلغ الخاضع</th>
                      <th className="py-2.5 px-2 text-center">النسبة</th>
                      <th className="py-2.5 px-2">الضريبة</th>
                      <th className="py-2.5 px-3 font-black text-white">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-black/30">
                    <tr className="hover:bg-white/5">
                      <td className="py-2.5 px-2 font-mono font-bold text-indigo-400">01</td>
                      <td className="py-2.5 px-3 font-bold text-white">
                        ترخيص برنامج ميزان ERP المحاسبي
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold">2</td>
                      <td className="py-2.5 px-2 font-mono">4,500.00</td>
                      <td className="py-2.5 px-2 font-mono text-emerald-400">500.00</td>
                      <td className="py-2.5 px-2 font-mono font-bold text-white">8,500.00</td>
                      <td className="py-2.5 px-2 text-center font-mono text-indigo-300 font-bold">15%</td>
                      <td className="py-2.5 px-2 font-mono font-bold text-amber-300">1,275.00</td>
                      <td className="py-2.5 px-3 font-mono font-black text-emerald-400">9,775.00</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="py-2.5 px-2 font-mono font-bold text-indigo-400">02</td>
                      <td className="py-2.5 px-3 font-bold text-white">
                        إعداد وربط الفوترة الإلكترونية ZATCA
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold">1</td>
                      <td className="py-2.5 px-2 font-mono">3,000.00</td>
                      <td className="py-2.5 px-2 font-mono text-slate-500">0.00</td>
                      <td className="py-2.5 px-2 font-mono font-bold text-white">3,000.00</td>
                      <td className="py-2.5 px-2 text-center font-mono text-indigo-300 font-bold">15%</td>
                      <td className="py-2.5 px-2 font-mono font-bold text-amber-300">450.00</td>
                      <td className="py-2.5 px-3 font-mono font-black text-emerald-400">3,450.00</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="py-2.5 px-2 font-mono font-bold text-indigo-400">03</td>
                      <td className="py-2.5 px-3 font-bold text-white">
                        استشارات وتدريب محاسبي
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold">5</td>
                      <td className="py-2.5 px-2 font-mono">300.00</td>
                      <td className="py-2.5 px-2 font-mono text-emerald-400">100.00</td>
                      <td className="py-2.5 px-2 font-mono font-bold text-white">1,400.00</td>
                      <td className="py-2.5 px-2 text-center font-mono text-indigo-300 font-bold">15%</td>
                      <td className="py-2.5 px-2 font-mono font-bold text-amber-300">210.00</td>
                      <td className="py-2.5 px-3 font-mono font-black text-emerald-400">1,610.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 5: TOTALS & VAT CALCULATION BREAKDOWN */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
              
              {/* QR CODE BLOCK (5 COLS) */}
              <div
                onClick={() => setSelectedSectionId("qr_code")}
                onMouseEnter={() => setHoveredSectionId("qr_code")}
                onMouseLeave={() => setHoveredSectionId(null)}
                className={`sm:col-span-5 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 relative ${getSectionHighlightClass("qr_code")}`}
              >
                <span className="absolute -top-2.5 right-3 bg-amber-400 text-slate-950 font-extrabold text-[9px] px-2 py-0.5 rounded-md shadow-sm">
                  كود QR المشفّر
                </span>

                <div className="bg-white p-2.5 rounded-2xl shadow-xl border-2 border-indigo-400/50">
                  <QrCode className="w-24 h-24 text-slate-950" />
                </div>
                <div className="space-y-0.5 text-right w-full">
                  <span className="text-[10px] font-mono font-black text-amber-300 block text-center">
                    ZATCA TLV Base64 Encrypted
                  </span>
                  <p className="text-[9px] text-slate-400 text-center">امسح الكود عبر تطبيق الهيئة للتحقق الحوري</p>
                </div>
              </div>

              {/* TOTALS SUMMARY BLOCK (7 COLS) */}
              <div className="sm:col-span-7 space-y-2">
                
                {/* Net Amount Box */}
                <div
                  onClick={() => setSelectedSectionId("net_amount")}
                  onMouseEnter={() => setHoveredSectionId("net_amount")}
                  onMouseLeave={() => setHoveredSectionId(null)}
                  className={`p-2.5 rounded-xl flex items-center justify-between text-xs relative ${getSectionHighlightClass("net_amount")}`}
                >
                  <span className="text-slate-300 font-bold">الإجمالي قبل الضريبة (Taxable Base):</span>
                  <span className="font-mono font-black text-white text-sm">12,900.00 ريال</span>
                </div>

                {/* VAT Calculation Box (CRITICAL HOTSPOT) */}
                <div
                  onClick={() => setSelectedSectionId("vat_rate_amount")}
                  onMouseEnter={() => setHoveredSectionId("vat_rate_amount")}
                  onMouseLeave={() => setHoveredSectionId(null)}
                  className={`p-3 rounded-2xl flex items-center justify-between text-xs relative ${getSectionHighlightClass("vat_rate_amount")}`}
                >
                  <span className="absolute -top-2.5 left-3 bg-amber-400 text-slate-950 font-extrabold text-[9px] px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                    <Calculator className="w-3 h-3" />
                    <span>هام: ضريبة القيمة المضافة 15%</span>
                  </span>

                  <div>
                    <span className="font-black text-amber-300 block text-xs">ضريبة القيمة المضافة (15% VAT):</span>
                    <span className="text-[10px] text-slate-300 font-mono">12,900.00 × 15%</span>
                  </div>
                  <span className="font-mono font-black text-amber-300 text-base">1,935.00 ريال</span>
                </div>

                {/* Grand Total Box */}
                <div
                  onClick={() => setSelectedSectionId("grand_total")}
                  onMouseEnter={() => setHoveredSectionId("grand_total")}
                  onMouseLeave={() => setHoveredSectionId(null)}
                  className={`p-3 rounded-2xl flex items-center justify-between text-xs bg-gradient-to-r from-emerald-950/60 to-indigo-950/60 border border-emerald-500/40 relative ${getSectionHighlightClass("grand_total")}`}
                >
                  <div>
                    <span className="font-black text-white block text-sm">الإجمالي النهائي شامل الضريبة:</span>
                    <span className="text-[9px] text-emerald-300 font-bold">فقط أربعة عشر ألفاً وثمانمائة وخمسة وثلاثون ريالاً سعودياً</span>
                  </div>
                  <span className="font-mono font-black text-emerald-400 text-lg">14,835.00 ريال</span>
                </div>

              </div>

            </div>

            {/* SECTION 6: FOOTER DIGITAL STAMP & UUID */}
            <div
              onClick={() => setSelectedSectionId("uuid_hash")}
              onMouseEnter={() => setHoveredSectionId("uuid_hash")}
              onMouseLeave={() => setHoveredSectionId(null)}
              className={`p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-slate-400 font-mono relative ${getSectionHighlightClass("uuid_hash")}`}
            >
              <div>
                <span className="text-slate-500 block">الفاتورة المشفّرة والمعرف الفريد (UUID):</span>
                <span className="text-indigo-300 font-bold">c4a89f10-7212-4d8e-9a1f-2026MizanInvoice</span>
              </div>
              <div className="text-left">
                <span className="text-slate-500 block">التوقيع الرقمي (Cryptographic Hash):</span>
                <span className="text-emerald-400 font-bold">SHA-256: e3b0c44298fc1c149afbf4c8...</span>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN (5 COLS): DETAILED LEGAL & CALCULATION EXPLAINER DRAWER */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-300 font-black">
            <span className="flex items-center gap-1.5 text-amber-400">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>الشرح والأنظمة المتعلقة بالجزء المحدد</span>
            </span>
            <span className="text-[10px] text-slate-400">كود الجزء: {activeInfo.id}</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeInfo.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="p-6 rounded-3xl bg-gradient-to-br from-[#0e162f] via-[#121c3b] to-[#0e162f] border-2 border-indigo-500/40 shadow-2xl space-y-5"
            >
              {/* Active Section Header */}
              <div className="space-y-2 border-b border-white/10 pb-4">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-block">
                  {activeInfo.badge}
                </span>
                <h3 className="text-lg font-black text-white leading-snug">
                  {activeInfo.title}
                </h3>
              </div>

              {/* Legal Importance */}
              <div className="space-y-1.5 text-xs">
                <h4 className="font-black text-indigo-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>الأهمية والامتثال الضريبي:</span>
                </h4>
                <p className="text-slate-200 leading-relaxed text-[11px] bg-black/40 p-3 rounded-2xl border border-white/5">
                  {activeInfo.importance}
                </p>
              </div>

              {/* Legal Standard Requirement */}
              <div className="space-y-1.5 text-xs">
                <h4 className="font-black text-sky-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-sky-400" />
                  <span>شرط النظام واللائحة التنفيذية:</span>
                </h4>
                <p className="text-slate-200 leading-relaxed text-[11px] bg-sky-950/30 p-3 rounded-2xl border border-sky-500/20">
                  {activeInfo.legalStandard}
                </p>
              </div>

              {/* Formula & Calculation Method (if available) */}
              {activeInfo.formula && (
                <div className="space-y-1.5 text-xs">
                  <h4 className="font-black text-amber-300 flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-amber-400" />
                    <span>طريقة الحساب والمعادلة الرياضية:</span>
                  </h4>
                  <div className="p-3.5 rounded-2xl bg-black/60 border border-amber-500/30 font-mono text-amber-200 text-xs whitespace-pre-line leading-relaxed">
                    {activeInfo.formula}
                  </div>
                </div>
              )}

              {/* Examples */}
              <div className="space-y-1.5 text-xs">
                <h4 className="font-black text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>أمثلة تطبيقية معتمدة:</span>
                </h4>
                <ul className="space-y-1 text-slate-300 text-[11px] bg-emerald-950/20 p-3 rounded-2xl border border-emerald-500/20 list-disc list-inside">
                  {activeInfo.examples.map((ex, idx) => (
                    <li key={idx} className="leading-relaxed">{ex}</li>
                  ))}
                </ul>
              </div>

              {/* Mistakes to Avoid */}
              <div className="space-y-1.5 text-xs">
                <h4 className="font-black text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>أخطاء قاتلة تجنب الوقوع فيها:</span>
                </h4>
                <ul className="space-y-1 text-slate-300 text-[11px] bg-rose-950/30 p-3 rounded-2xl border border-rose-500/20 list-disc list-inside">
                  {activeInfo.mistakesToAvoid.map((m, idx) => (
                    <li key={idx} className="leading-relaxed text-rose-200">{m}</li>
                  ))}
                </ul>
              </div>

              {/* Tech Implementation Notes */}
              {activeInfo.techDetails && (
                <div className="space-y-1 text-xs">
                  <h4 className="font-black text-purple-300 flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-purple-400" />
                    <span>التنفيذ البرمجي ومرحلة الربط (ZATCA Phase 2):</span>
                  </h4>
                  <p className="text-[11px] text-purple-200 font-mono bg-purple-950/30 p-3 rounded-2xl border border-purple-500/20 leading-relaxed">
                    {activeInfo.techDetails}
                  </p>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
