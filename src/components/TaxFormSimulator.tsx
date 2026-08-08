import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calculator,
  Receipt,
  Building2,
  HelpCircle,
  Info,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Sparkles,
  RefreshCw,
  FileText,
  ShieldCheck,
  X,
  BookOpen,
  Download,
  Zap,
  ArrowRightLeft,
  DollarSign,
  PieChart,
  Lock,
  ChevronLeft
} from "lucide-react";

export interface FieldExplanation {
  fieldKey: string;
  title: string;
  code: string;
  type: "output" | "input" | "summary";
  purpose: string;
  legalCondition: string;
  calculationMethod: string;
  examples: string[];
  mistakesToAvoid: string[];
}

export const TAX_FORM_FIELD_EXPLANATIONS: Record<string, FieldExplanation> = {
  // OUTPUTS (SALES)
  std_sales: {
    fieldKey: "std_sales",
    title: "1. المبيعات المحلية الخاضعة للنسبة الأساسية (15%)",
    code: "LINE_01_OUTPUT",
    type: "output",
    purpose: "المجالات المبيعات المحلية للسلع والخدمات المقدمة داخل المملكة الخاضعة للنسبة المعتمدة 15%. يُحسب إجمالي الضريبة المحصلة من العملاء لحساب الهيئة.",
    legalCondition: "يجب إصدار فواتير ضريبية معتمدة لكل معاملة تتضمن اسم المورد ورقمه الضريبي وسعر الوحدة وقيمة الضريبة المستقلة.",
    calculationMethod: "المبلغ الضريبي = إجمالي المبيعات الخاضعة × 15%\nمثال: مبيعات بـ 100,000 ريال -> ضريبة مخرجات = 15,000 ريال.",
    examples: [
      "مبيعات الأجهزة الإلكترونية والمعدات للعملاء المحليين.",
      "تقديم الاستشارات الإدارية والبرمجية للشركات داخل الدولة.",
      "عقود الصيانة والإيجارات التجارية الخاضعة للضريبة."
    ],
    mistakesToAvoid: [
      "إدراج مبيعات معفاة أو خاضعة لنسبة الصفر ضمن هذه الخانة.",
      "عدم تعديل المبيعات بعد المردودات والتخفيضات بسندات إشعار دائن (Credit Notes)."
    ]
  },
  citizens_healthcare_edu: {
    fieldKey: "citizens_healthcare_edu",
    title: "2. المبيعات للمواطنين (الخدمات الصحية والتعليمية الخاصة المعفاة من الضريبة بالتحمل الحكومي)",
    code: "LINE_02_OUTPUT",
    type: "output",
    purpose: "الخدمات الصحية الأهلية والتعليم الألي الصادرة للمواطنين المسجلين حيث تتحمل الدولة قيمة الضريبة المضافة نيابة عن المواطن.",
    legalCondition: "يشترط وجود رقم الهوية الوطنية للمواطن والتحقق من أهليته في النظام وإصدار فاتورة توضح أن الضريبة الصافية مسددة بواسطة الدولة.",
    calculationMethod: "الضريبة المستحقة على الدولة = المبيعات للمواطنين × 15% (تُقيد كمخرجات وفي نفس الوقت تُطالب بها الدولة).",
    examples: [
      "رسوم الدراسة في المدارس والجامعات الأهلية للمواطنين.",
      "تكاليف العلاج والعمليات في المستشفيات الخاصة للمواطنين."
    ],
    mistakesToAvoid: [
      "تطبيق التحمل الحكومي على المقيمين أو الأجانب حيث تخضع خدماتهم للنسبة 15% بشكل كامل."
    ]
  },
  zero_sales: {
    fieldKey: "zero_sales",
    title: "3. المبيعات المحلية الخاضعة لنسبة الصفر (0%)",
    code: "LINE_03_OUTPUT",
    type: "output",
    purpose: "المبيعات المحلية المحددة بموجب النظام للنسبة الصفراء مثل توريدات وسائل النقل الدولي، الأدوية والمعدات الطبية المعتمدة، والاستثمار في الذهب والفضة والبلاتين الخام.",
    legalCondition: "أن تتطابق السلعة تماماً مع القوائم المعفاة والمعتمدة لدى وزارة الصحة وهيئة الزكاة والضريبة والجمارك.",
    calculationMethod: "المبلغ الضريبي = 0.00 ريال (مع احتفاظ الخاضع للضريبة بحق خصم ضريبة المدخلات المرتبطة بها).",
    examples: [
      "بيع الأدوية والأجهزة الطبية المسجلة لدى هيئة الغذاء والدواء.",
      "بيع سبائك الذهب بنقاء 99% أو أعلى لأغراض الاستثمار."
    ],
    mistakesToAvoid: [
      "الخلط بين السلع الخاضعة لنسبة الصفر (0%) والسلع المعفاة كلياً (Exempt)."
    ]
  },
  export_sales: {
    fieldKey: "export_sales",
    title: "4. الصادرات المباشرة خارج دول مجلس التعاون (0%)",
    code: "LINE_04_OUTPUT",
    type: "output",
    purpose: "توريدات السلع والخدمات المصدرة إلى خارج النطاق الجغرافي لدول مجلس التعاون الخليجي.",
    legalCondition: "يشترط إثبات خروج السلعة فعلياً مستندياً ببيان جمركي صادر وبوليصة شحن دولية خلال 90 يوماً من تاريخ التوريد.",
    calculationMethod: "المبلغ الضريبي = 0.00 ريال.",
    examples: [
      "تصدير بضائع ومصنوعات محلية إلى عميل في أوروبا أو أمريكا.",
      "تقديم خدمات برمجية واستشارية لعميل خارج مجلس التعاون."
    ],
    mistakesToAvoid: [
      "عدم الاحتفاظ بالبيانات الجمركية وبوالص الشحن الدولية في ملفات الإقرار."
    ]
  },
  exempt_sales: {
    fieldKey: "exempt_sales",
    title: "5. التوريدات (المبيعات) المعفاة من الضريبة",
    code: "LINE_05_OUTPUT",
    type: "output",
    purpose: "المعاملات المالية والخدمات المعفاة نصاً بنظام القيمة المضافة مثل بعض الخدمات المالية، إيجارات العقارات السكنية، وحسابات الفوائد البنكية.",
    legalCondition: "الخدمات المعفاة لا يتحمل المشتري عنها أي ضريبة، ولكن المكلف لا يحق له خصم ضريبة المدخلات المتعلقة بإجراء هذه الخدمات.",
    calculationMethod: "المبلغ الضريبي = 0.00 ريال (ويحظر خصم ضريبة المشتريات المرتبطة بها).",
    examples: [
      "عائدات تأجير الشقق والعقارات السكنية للأفراد.",
      "رسوم إصدار وتجديد بطاقات الائتمان والفوائد البنكية."
    ],
    mistakesToAvoid: [
      "المطالبة بخصم ضريبة مشتريات أو مصاريف لشركة تعمل حظرياً في نشاط معفى."
    ]
  },

  // INPUTS (PURCHASES)
  std_purchases: {
    fieldKey: "std_purchases",
    title: "6. المشتريات والمصاريف المحلية الخاضعة للنسبة الأساسية (15%)",
    code: "LINE_06_INPUT",
    type: "input",
    purpose: "جميع المشتريات والمصاريف التشغيلية والإدارية المحلية التي دفع عنها المكلف ضريبة قيمة مضافة 15% ويحق له استردادها كضريبة مدخلات.",
    legalCondition: "حيازة فاتورة ضريبية رسمية أصلية تشتمل على الرقم الضريبي للمورد واسم المكلف وتاريخ التوريد وصحة العبء المالي.",
    calculationMethod: "ضريبة المدخلات القابلة للخصم = قيمة المشتريات الخاضعة × 15%.\nمثال: مشتريات بـ 60,000 ريال -> ضريبة قابلة للاسترداد = 9,000 ريال.",
    examples: [
      "شراء المواد الخام والمخزون الموجه للبيع.",
      "مصاريف إيجار المكاتب التجارية، الكهرباء، الاتصالات، والدعاية والاعلان."
    ],
    mistakesToAvoid: [
      "خصم ضريبة فواتير غير ضريبية أو فواتير باسم أشخاص آخرين.",
      "خصم ضريبة المصاريف الشخصية أو سيارات الركاب الخاصة بالمدراء."
    ]
  },
  rcm_imports: {
    fieldKey: "rcm_imports",
    title: "7. الاستيرادات الخاضعة لآلية التكليف العكسي (Reverse Charge Mechanism - RCM)",
    code: "LINE_07_INPUT",
    type: "input",
    purpose: "الخدمات أو السلع المستوردة من موردين أجانب غير مقيمين؛ حيث يقوم المكلف المحلي باحتساب الضريبة كمخرجات ومدخلات في نفس الإقرار دون تدفق نقدي خارجي.",
    legalCondition: "إدراج الخدمة المستوردة في خانة التكليف العكسي وتوثيق الفاتورة الأجنبية وعقد الخدمة.",
    calculationMethod: "تُقيد الضريبة كمخرجات (تلتزم بدفعها) وفي نفس الوقت كمدخلات (تخصمها)، فالأثر الصافي = 0.00 ريال.",
    examples: [
      "اشتراكات السيرفرات والبرامج السحابية من شركات أجنبية (AWS, Google, Microsoft).",
      "استشارات هندسية أو تسويقية من مكاتب خارجية."
    ],
    mistakesToAvoid: [
      "إغفال الإفصاح عن الخدمات السحابية والأجنبية المستوردة في بند RCM."
    ]
  },
  capital_assets: {
    fieldKey: "capital_assets",
    title: "8. مشتريات الأصول الرأسمالية (Capital Assets Goods)",
    code: "LINE_08_INPUT",
    type: "input",
    purpose: "المعدات، الآلات، المباني والسيارات الإنتاجية التي يتجاوز عمرها الإنتاجي سنة وتُصنف كأصول ثابتة في الميزانية العمومية.",
    legalCondition: "تخضع لتنظيم تعديل الأصول الرأسمالية (فترة احتفاظ 5 سنوات للمنقولات و10 سنوات للعقارات).",
    calculationMethod: "ضريبة المدخلات = قيمة شراء الأصل الرأسمالي × 15%.",
    examples: [
      "شراء خط إنتاج جديد أو آلات تصنيع مصنع.",
      "شراء شاحنات نقل البضائع أو مبنى المكاتب الرئيسي."
    ],
    mistakesToAvoid: [
      "تسجيل أصل رأسمالي شخصي كأصل تجاري للمنشأة."
    ]
  },
  adjustments: {
    fieldKey: "adjustments",
    title: "9. التعديلات والخصومات والديون المعدومة (Adjustments & Bad Debts)",
    code: "LINE_09_ADJUST",
    type: "summary",
    purpose: "تعديل أخطاء الفترات السابقة، تسوية الديون المعدومة التي مرت عليها 12 شهراً ولم تُحصل، أو تعديل الفواتير الملغاة.",
    legalCondition: "إثبات الإجراءات القانونية لشطب الدين المعدوم وتوفير مستندات الإشعار الدائن والمدين.",
    calculationMethod: "يضاف أو يطرح مبلغ التعديل الضريبي مباشرة من صافي الضريبة.",
    examples: [
      "استرداد ضريبة فاتورة لعميل أعلن إفلاسه رسمياً بعد مرور سنة.",
      "تعديل خطأ حسابي في إقرار الربع السابق."
    ],
    mistakesToAvoid: [
      "خصم الديون المعدومة قبل انقضاء سنة كاملة من تاريخ الاستحقاق."
    ]
  }
};

export interface SamplePreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  values: {
    stdSales: number;
    citizensHealthcare: number;
    zeroSales: number;
    exportSales: number;
    exemptSales: number;
    stdPurchases: number;
    rcmImports: number;
    capitalAssets: number;
    adjustments: number;
    previousCredit: number;
  };
}

export const FORM_PRESETS: SamplePreset[] = [
  {
    id: "trading_co",
    name: "شركة تجارة وتجزئة متوسطة 🏬",
    badge: "الأكثر شيوعاً",
    description: "مبيعات محليّة 15% مع مشتريات مخزون ومصاريف تشغيلية يومية.",
    values: {
      stdSales: 450000,
      citizensHealthcare: 0,
      zeroSales: 25000,
      exportSales: 0,
      exemptSales: 0,
      stdPurchases: 280000,
      rcmImports: 15000,
      capitalAssets: 50000,
      adjustments: 0,
      previousCredit: 0
    }
  },
  {
    id: "tech_export",
    name: "شركة تقنية وتصدير خدمات 💻",
    badge: "استرداد ضريبي (Refund)",
    description: "مبيعات صادرات برمجية بـ 0% مع مشتريات سيرفرات وأصول رأسمالية مكثفة.",
    values: {
      stdSales: 80000,
      citizensHealthcare: 0,
      zeroSales: 0,
      exportSales: 350000,
      exemptSales: 0,
      stdPurchases: 120000,
      rcmImports: 45000,
      capitalAssets: 90000,
      adjustments: -2000,
      previousCredit: 5000
    }
  },
  {
    id: "medical_edu",
    name: "مجمع طبي ومدرسة أهلية 🏫🏥",
    badge: "تحمل حكومي + إعفاء",
    description: "مبيعات للمواطنين بتحمل الدولة + خدمات معفاة ومشتريات مستلزمات.",
    values: {
      stdSales: 120000,
      citizensHealthcare: 300000,
      zeroSales: 40000,
      exportSales: 0,
      exemptSales: 150000,
      stdPurchases: 210000,
      rcmImports: 10000,
      capitalAssets: 30000,
      adjustments: 0,
      previousCredit: 0
    }
  }
];

export function TaxFormSimulator() {
  // Input States
  const [stdSales, setStdSales] = useState<number>(300000);
  const [citizensHealthcare, setCitizensHealthcare] = useState<number>(0);
  const [zeroSales, setZeroSales] = useState<number>(20000);
  const [exportSales, setExportSales] = useState<number>(50000);
  const [exemptSales, setExemptSales] = useState<number>(0);

  const [stdPurchases, setStdPurchases] = useState<number>(180000);
  const [rcmImports, setRcmImports] = useState<number>(10000);
  const [capitalAssets, setCapitalAssets] = useState<number>(25000);
  const [adjustments, setAdjustments] = useState<number>(0);
  const [previousCredit, setPreviousCredit] = useState<number>(0);

  // Active Explanation Drawer / Modal
  const [activeExplainKey, setActiveExplainKey] = useState<string>("std_sales");
  const [vatRate, setVatRate] = useState<number>(15);
  const [entityName, setEntityName] = useState<string>("شركة الميزان للتكنولوجيا المحدودة");
  const [taxPeriod, setTaxPeriod] = useState<string>("الربع الثالث 2026 (Q3)");

  // Load Preset Handler
  const handleLoadPreset = (preset: SamplePreset) => {
    setStdSales(preset.values.stdSales);
    setCitizensHealthcare(preset.values.citizensHealthcare);
    setZeroSales(preset.values.zeroSales);
    setExportSales(preset.values.exportSales);
    setExemptSales(preset.values.exemptSales);
    setStdPurchases(preset.values.stdPurchases);
    setRcmImports(preset.values.rcmImports);
    setCapitalAssets(preset.values.capitalAssets);
    setAdjustments(preset.values.adjustments);
    setPreviousCredit(preset.values.previousCredit);
  };

  const handleResetForm = () => {
    setStdSales(0);
    setCitizensHealthcare(0);
    setZeroSales(0);
    setExportSales(0);
    setExemptSales(0);
    setStdPurchases(0);
    setRcmImports(0);
    setCapitalAssets(0);
    setAdjustments(0);
    setPreviousCredit(0);
  };

  // Calculations
  const calculations = useMemo(() => {
    const rateDecimal = vatRate / 100;

    // Output VAT Calculations
    const vatStdSales = stdSales * rateDecimal;
    const vatCitizens = citizensHealthcare * rateDecimal;
    const vatZero = 0;
    const vatExport = 0;
    const vatExempt = 0;

    const totalSalesAmount = stdSales + citizensHealthcare + zeroSales + exportSales + exemptSales;
    const totalOutputVat = vatStdSales + vatCitizens + vatZero + vatExport + vatExempt;

    // Input VAT Calculations
    const vatStdPurchases = stdPurchases * rateDecimal;
    const vatRcm = rcmImports * rateDecimal; // Balance out in outputs & inputs
    const vatCapital = capitalAssets * rateDecimal;

    const totalPurchasesAmount = stdPurchases + rcmImports + capitalAssets;
    const totalInputVat = vatStdPurchases + vatRcm + vatCapital;

    // Net Calculation
    const rawNetVat = totalOutputVat - totalInputVat;
    const finalNetVat = rawNetVat + adjustments - previousCredit;

    const isPayable = finalNetVat > 0;
    const isRefundable = finalNetVat < 0;

    // Effective Rate
    const effectiveRate = totalSalesAmount > 0 ? (totalOutputVat / totalSalesAmount) * 100 : 0;

    return {
      rateDecimal,
      vatStdSales,
      vatCitizens,
      vatZero,
      vatExport,
      vatExempt,
      totalSalesAmount,
      totalOutputVat,
      vatStdPurchases,
      vatRcm,
      vatCapital,
      totalPurchasesAmount,
      totalInputVat,
      rawNetVat,
      finalNetVat: Math.abs(finalNetVat),
      isPayable,
      isRefundable,
      effectiveRate
    };
  }, [
    stdSales,
    citizensHealthcare,
    zeroSales,
    exportSales,
    exemptSales,
    stdPurchases,
    rcmImports,
    capitalAssets,
    adjustments,
    previousCredit,
    vatRate
  ]);

  // Intelligent Real-Time Validation & Audit Alerts Engine
  const validationAlerts = useMemo(() => {
    const alerts: Array<{
      id: string;
      type: "error" | "warning" | "info" | "success";
      title: string;
      message: string;
      fieldKey?: string;
      actionableTip: string;
    }> = [];

    const { totalSalesAmount, totalPurchasesAmount, totalOutputVat, isRefundable, finalNetVat } = calculations;

    // 1. Zero Sales with High Purchases
    if (totalSalesAmount === 0 && totalPurchasesAmount > 0) {
      alerts.push({
        id: "zero_sales_purchases",
        type: "warning",
        title: "⚠️ مشتريات بدون مبيعات (شراء مخزون / مرحلة تأسيس)",
        message: `تم إدخال مشتريات ومصاريف بقيمة (${totalPurchasesAmount.toLocaleString()} ريال) دون وجود أي مبيعات مفصح عنها.`,
        fieldKey: "std_sales",
        actionableTip: "تأكد من الاحتفاظ بعقود التأسيس أو فواتير شراء المخزون، حيث قد يطلب الفاحص الضريبي مبرراً تجارياً منطقياً لتأخر المبيعات."
      });
    }

    // 2. Unusually High Purchases relative to Sales (>200%)
    if (totalSalesAmount > 0 && totalPurchasesAmount > totalSalesAmount * 2) {
      alerts.push({
        id: "high_purchases_ratio",
        type: "warning",
        title: "⚠️ ارتفاع نسبة ضريبة المدخلات مقارنة بالمخرجات (>200%)",
        message: `حجم المشتريات والمصاريف (${totalPurchasesAmount.toLocaleString()} ريال) يتجاوز ضعف إجمالي المبيعات (${totalSalesAmount.toLocaleString()} ريال).`,
        fieldKey: "std_purchases",
        actionableTip: "تأكد من أن جميع المشتريات مخصصة لأغراض النشاط الخاضع للضريبة وليست استهلاكات شخصية أو أصول خارج نطاق الضريبة."
      });
    }

    // 3. Partial Input Tax Deduction Risk (Exempt Sales + Std Purchases)
    if (exemptSales > 0 && stdPurchases > 0) {
      const exemptRatio = ((exemptSales / (totalSalesAmount || 1)) * 100).toFixed(1);
      alerts.push({
        id: "exempt_partial_deduction",
        type: "warning",
        title: "⚡ تنبيه الخصم النسبي (Partial Input Deduction Rule)",
        message: `تم إدخال توريدات معفاة (الخانة 05) بنسبة ${exemptRatio}% من المبيعات، مع وجود مشتريات خاضعة للضريبة.`,
        fieldKey: "exempt_sales",
        actionableTip: "نظاماً، لا يحق للمكلف خصم 100% من ضريبة المشتريات العامة إذا كان له نشاط معفى، ويجب تطبيق معادلة النسبية واستبعاد ضريبة التوريدات المعفاة."
      });
    }

    // 4. Exports & Zero-Rated Proof of Transport
    if (exportSales > 0 || zeroSales > 0) {
      const totalZeroAndExport = exportSales + zeroSales;
      alerts.push({
        id: "export_zero_proof",
        type: "info",
        title: "📄 شرط مستندات إثبات الشحن والتصدير (0%)",
        message: `يحتوي الإقرار على صادرات وتوريدات خاضعة لنسبة الصفر بقيمة (${totalZeroAndExport.toLocaleString()} ريال).`,
        fieldKey: "export_sales",
        actionableTip: "احرص على الاحتفاظ بالبيانات الجمركية المعتمدة وبوالص الشحن التي تثبت مغادرة البضائع للمملكة خلال 90 يوماً لتجنب إعادة احتسابها بنسبة 15%."
      });
    }

    // 5. Reverse Charge Mechanism (RCM)
    if (rcmImports > 0) {
      alerts.push({
        id: "rcm_import_check",
        type: "info",
        title: "🔄 التكليف العكسي للخدمات المستوردة (RCM)",
        message: `تم تسجيل خدمات مستوردة بقيمة (${rcmImports.toLocaleString()} ريال).`,
        fieldKey: "rcm_imports",
        actionableTip: "تأكد من قيد المبلغ في جانب المخرجات والمدخلات معاً، وأن المورد الأجنبي غير مقيم ولديه عقود رسمية مثبتة."
      });
    }

    // 6. Capital Assets Documentation
    if (capitalAssets > 100000) {
      alerts.push({
        id: "capital_assets_high",
        type: "info",
        title: "🏛️ مشتريات أصول رأسمالية ضخمة",
        message: `تم تسجيل أصول رأسمالية وثابتة بقيمة (${capitalAssets.toLocaleString()} ريال).`,
        fieldKey: "capital_assets",
        actionableTip: "يجب الاحتفاظ بجميع الفواتير والعقود الخاصة بالأصول المنقولة لمدة 5 سنوات، والعقارات لمدة 10 سنوات طبقاً للوائح تعديل الأصول الرأسمالية."
      });
    }

    // 7. High Refund Demand (> 50,000 SAR)
    if (isRefundable && finalNetVat > 50000) {
      alerts.push({
        id: "high_refund_audit",
        type: "warning",
        title: "🔍 طلب استرداد مالي مرتفع (توقع مراجعة الهيئة)",
        message: `الإقرار ينتهي برصيد دائن مسترد بقيمة (${finalNetVat.toLocaleString()} ريال).`,
        actionableTip: "طلبات الاسترداد النقدية الكبيرة تخضع لمراجعات وتدقيق آلي وميداني قبل التحويل. ننصح بفحص كشوفات الحساب البنكية ومطابقة مطالبات الضريبة."
      });
    }

    // 8. Large Adjustments or Bad Debts
    if (Math.abs(adjustments) > totalOutputVat * 0.25 && totalOutputVat > 0) {
      alerts.push({
        id: "large_adjustments",
        type: "warning",
        title: "⚠️ تسوية ضخمة أو شطب ديون معدومة عالي",
        message: `قيمة التعديلات والديون المعدومة (${adjustments.toLocaleString()} ريال) تمثل نسبة عالية مقارنة بضريبة المخرجات.`,
        fieldKey: "adjustments",
        actionableTip: "يشترط فشل تحصيل الدين لمدة 12 شهراً متواصلة وصدور إشعارات دائنة رسمية (Credit Notes) معتمدة قبل إجراء التعديل."
      });
    }

    // 9. All Good & Balanced
    if (alerts.length === 0 && totalSalesAmount > 0) {
      alerts.push({
        id: "all_clear",
        type: "success",
        title: "✅ الإقرار متوازن ومنطقي محاسبياً",
        message: "تم التحقق الفوري من جميع الخانات المعتمدة. المدخلات متوافقة مع القواعد الضريبية والنسب المعيارية.",
        actionableTip: "يمكنك طباعة ملخص الإقرار أو مراجعته مع المحاسب القانوني قبل التقديم النهائي عبر البوابة."
      });
    }

    return alerts;
  }, [
    stdSales,
    citizensHealthcare,
    zeroSales,
    exportSales,
    exemptSales,
    stdPurchases,
    rcmImports,
    capitalAssets,
    adjustments,
    previousCredit,
    calculations
  ]);

  // Helper map for field-level warning badges
  const fieldAlertMap = useMemo(() => {
    const map: Record<string, string> = {};
    validationAlerts.forEach((a) => {
      if (a.fieldKey) {
        map[a.fieldKey] = a.title;
      }
    });
    return map;
  }, [validationAlerts]);

  const activeExplanation = TAX_FORM_FIELD_EXPLANATIONS[activeExplainKey] || TAX_FORM_FIELD_EXPLANATIONS["std_sales"];

  return (
    <div className="space-y-8 font-sans">
      
      {/* HEADER BAR & SAMPLE PRESETS */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0a1226] via-[#101b3b] to-[#0a1226] border border-indigo-500/30 shadow-2xl space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>أداة المحاكاة الحية لإقرار ضريبة القيمة المضافة 2026 (VAT Return Simulator)</span>
            </span>
            <h3 className="text-2xl font-black text-white">
              محاكي الإقرار الضريبي الرسمي الحسابي والشارح 📊🧾
            </h3>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              قم بإدخال بياناتك المالية التجريبية للمبيعات والمشتريات لحساب صافي الضريبة المستحقة فورياً، مع التفاعل والضغط على أي خانة لعرض الشرح الفقهي والنظامي ومعايير الخصم الخاصة بها.
            </p>
          </div>

          {/* Quick Rate & Period Controls */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 bg-black/50 p-2 rounded-2xl border border-white/10">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 text-xs text-indigo-200 font-bold border border-indigo-500/30">
              <span>نسبة الضريبة:</span>
              <select
                value={vatRate}
                onChange={(e) => setVatRate(Number(e.target.value))}
                className="bg-transparent font-black text-amber-300 focus:outline-none cursor-pointer"
              >
                <option value={15} className="bg-slate-900">15% (السعودية)</option>
                <option value={5} className="bg-slate-900">5% (الإمارات / عمان)</option>
                <option value={14} className="bg-slate-900">14% (مصر)</option>
              </select>
            </div>

            <button
              onClick={handleResetForm}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>تفريغ</span>
            </button>
          </div>
        </div>

        {/* PRESETS BUTTONS BAR */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-300 block flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>تجربة فورية بنماذج جاهزة (تحميل بيانات تجريبية بضغطة واحدة):</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {FORM_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleLoadPreset(preset)}
                className="p-3.5 rounded-2xl bg-black/40 hover:bg-indigo-950/40 border border-white/10 hover:border-indigo-500/50 text-right transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-white group-hover:text-indigo-300 transition-colors">
                    {preset.name}
                  </span>
                  <span className="text-[10px] font-extrabold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md">
                    {preset.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">{preset.description}</p>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* REAL-TIME TAX AUDIT & VALIDATION ALERTS PANEL */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#0d152a] via-[#121c38] to-[#0d152a] border border-amber-500/30 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h4 className="text-sm font-black text-white">
              نظام التدقيق الفوري ومراجعة مخاطر الإقرار (Real-time Tax Audit Engine)
            </h4>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{validationAlerts.length} تنبيهات فحص مباشرة</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {validationAlerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => alert.fieldKey && setActiveExplainKey(alert.fieldKey)}
              className={`p-3.5 rounded-2xl border transition-all space-y-1.5 cursor-pointer ${
                alert.type === "warning"
                  ? "bg-amber-950/20 border-amber-500/40 hover:bg-amber-950/40"
                  : alert.type === "info"
                  ? "bg-sky-950/20 border-sky-500/40 hover:bg-sky-950/40"
                  : alert.type === "error"
                  ? "bg-rose-950/20 border-rose-500/40 hover:bg-rose-950/40"
                  : "bg-emerald-950/20 border-emerald-500/40 hover:bg-emerald-950/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-black ${
                  alert.type === "warning" ? "text-amber-300" : alert.type === "info" ? "text-sky-300" : alert.type === "error" ? "text-rose-300" : "text-emerald-300"
                }`}>
                  {alert.title}
                </span>
                {alert.fieldKey && (
                  <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded hover:text-amber-300">
                    انقر لشرح الخانة ↗
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">{alert.message}</p>
              <div className="text-[10px] text-amber-200/90 bg-black/40 p-2 rounded-xl border border-white/5 font-mono">
                💡 التوصية المحاسبية: {alert.actionableTip}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN TWO-COLUMN SIMULATOR & FIELD EXPLAINER DRAWER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (7 COLS): THE INTERACTIVE DECLARATION FORM SHEET */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* TOP ENTITY HEADER */}
          <div className="p-5 rounded-2xl bg-[#090e1f] border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 block">اسم الشركة / المكلف:</label>
              <input
                type="text"
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-indigo-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 block">الفترة الضريبية:</label>
              <input
                type="text"
                value={taxPeriod}
                onChange={(e) => setTaxPeriod(e.target.value)}
                className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-1.5 text-xs font-bold text-indigo-300 focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          {/* SECTION A: OUTPUT VAT (SALES / REVENUE) */}
          <div className="p-6 rounded-3xl bg-[#0a1024] border-2 border-indigo-500/30 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="font-black text-indigo-300 text-sm sm:text-base flex items-center gap-2">
                <Receipt className="w-5 h-5 text-indigo-400" />
                <span>أولاً: المبيعات والإيرادات (ضريبة المخرجات - Output VAT)</span>
              </h4>
              <span className="text-xs font-mono font-black text-indigo-300 bg-indigo-500/20 px-2.5 py-1 rounded-xl">
                إجمالي المخرجات: {calculations.totalOutputVat.toLocaleString()} ريال
              </span>
            </div>

            {/* FORM LINES FOR SALES */}
            <div className="space-y-3">
              
              {/* LINE 1: Standard Sales */}
              <div
                onClick={() => setActiveExplainKey("std_sales")}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  activeExplainKey === "std_sales"
                    ? "bg-indigo-600/20 border-indigo-400 ring-2 ring-indigo-400/40"
                    : "bg-black/30 border-white/10 hover:border-indigo-400/50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-extrabold text-indigo-400 bg-indigo-500/20 px-1.5 py-0.5 rounded">
                      الخانة 01
                    </span>
                    <label className="text-xs font-bold text-white">
                      المبيعات الخاضعة للنسبة الأساسية ({vatRate}%):
                    </label>
                  </div>
                  <button className="text-[10px] font-bold text-amber-300 hover:underline flex items-center gap-1 shrink-0">
                    <HelpCircle className="w-3 h-3 text-amber-400" />
                    <span>شرح الخانة</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1 font-semibold">المبلغ غير شامل الضريبة:</span>
                    <input
                      type="number"
                      value={stdSales}
                      onChange={(e) => setStdSales(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1 font-semibold">مبلغ الضريبة المحسوب ({vatRate}%):</span>
                    <div className="w-full bg-indigo-950/50 border border-indigo-500/30 rounded-xl px-3 py-2 text-xs font-mono font-black text-indigo-200">
                      {calculations.vatStdSales.toLocaleString()} ريال
                    </div>
                  </div>
                </div>
              </div>

              {/* LINE 2: Citizens Healthcare/Edu */}
              <div
                onClick={() => setActiveExplainKey("citizens_healthcare_edu")}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  activeExplainKey === "citizens_healthcare_edu"
                    ? "bg-indigo-600/20 border-indigo-400 ring-2 ring-indigo-400/40"
                    : "bg-black/30 border-white/10 hover:border-indigo-400/50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-extrabold text-indigo-400 bg-indigo-500/20 px-1.5 py-0.5 rounded">
                      الخانة 02
                    </span>
                    <label className="text-xs font-bold text-white">
                      المبيعات للمواطنين (القطاع الصحي والتعليمي الخاص - التحمل الحكومي):
                    </label>
                  </div>
                  <button className="text-[10px] font-bold text-amber-300 hover:underline flex items-center gap-1 shrink-0">
                    <HelpCircle className="w-3 h-3 text-amber-400" />
                    <span>شرح الخانة</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1 font-semibold">المبلغ غير شامل الضريبة:</span>
                    <input
                      type="number"
                      value={citizensHealthcare}
                      onChange={(e) => setCitizensHealthcare(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1 font-semibold">ضريبة مستحقة على الدولة:</span>
                    <div className="w-full bg-indigo-950/50 border border-indigo-500/30 rounded-xl px-3 py-2 text-xs font-mono font-black text-indigo-200">
                      {calculations.vatCitizens.toLocaleString()} ريال
                    </div>
                  </div>
                </div>
              </div>

              {/* LINE 3: Zero-Rated Sales */}
              <div
                onClick={() => setActiveExplainKey("zero_sales")}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  activeExplainKey === "zero_sales"
                    ? "bg-indigo-600/20 border-indigo-400 ring-2 ring-indigo-400/40"
                    : "bg-black/30 border-white/10 hover:border-indigo-400/50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-extrabold text-indigo-400 bg-indigo-500/20 px-1.5 py-0.5 rounded">
                      الخانة 03
                    </span>
                    <label className="text-xs font-bold text-white">
                      المبيعات المحلية الخاضعة لنسبة الصفر (0%):
                    </label>
                  </div>
                  <button className="text-[10px] font-bold text-amber-300 hover:underline flex items-center gap-1 shrink-0">
                    <HelpCircle className="w-3 h-3 text-amber-400" />
                    <span>شرح الخانة</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1 font-semibold">المبلغ الإجمالي:</span>
                    <input
                      type="number"
                      value={zeroSales}
                      onChange={(e) => setZeroSales(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1 font-semibold">مبلغ الضريبة (0%):</span>
                    <div className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-400">
                      0.00 ريال
                    </div>
                  </div>
                </div>
              </div>

              {/* LINE 4: Direct Exports */}
              <div
                onClick={() => setActiveExplainKey("export_sales")}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  activeExplainKey === "export_sales"
                    ? "bg-indigo-600/20 border-indigo-400 ring-2 ring-indigo-400/40"
                    : "bg-black/30 border-white/10 hover:border-indigo-400/50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-extrabold text-indigo-400 bg-indigo-500/20 px-1.5 py-0.5 rounded">
                      الخانة 04
                    </span>
                    <label className="text-xs font-bold text-white">
                      الصادرات المباشرة للخارج (0%):
                    </label>
                  </div>
                  <button className="text-[10px] font-bold text-amber-300 hover:underline flex items-center gap-1 shrink-0">
                    <HelpCircle className="w-3 h-3 text-amber-400" />
                    <span>شرح الخانة</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1 font-semibold">قيمة الصادرات:</span>
                    <input
                      type="number"
                      value={exportSales}
                      onChange={(e) => setExportSales(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1 font-semibold">مبلغ الضريبة (0%):</span>
                    <div className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-400">
                      0.00 ريال
                    </div>
                  </div>
                </div>
              </div>

              {/* LINE 5: Exempt Sales */}
              <div
                onClick={() => setActiveExplainKey("exempt_sales")}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  activeExplainKey === "exempt_sales"
                    ? "bg-indigo-600/20 border-indigo-400 ring-2 ring-indigo-400/40"
                    : "bg-black/30 border-white/10 hover:border-indigo-400/50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-extrabold text-indigo-400 bg-indigo-500/20 px-1.5 py-0.5 rounded">
                      الخانة 05
                    </span>
                    <label className="text-xs font-bold text-white">
                      التوريدات المعفاة من الضريبة (Exempt):
                    </label>
                  </div>
                  <button className="text-[10px] font-bold text-amber-300 hover:underline flex items-center gap-1 shrink-0">
                    <HelpCircle className="w-3 h-3 text-amber-400" />
                    <span>شرح الخانة</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1 font-semibold">قيمة التوريدات المعفاة:</span>
                    <input
                      type="number"
                      value={exemptSales}
                      onChange={(e) => setExemptSales(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1 font-semibold">مبلغ الضريبة:</span>
                    <div className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-400">
                      معفى (0.00 ريال)
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* SECTION B: INPUT VAT (PURCHASES / EXPENSES) */}
          <div className="p-6 rounded-3xl bg-[#0a1024] border-2 border-purple-500/30 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="font-black text-purple-300 text-sm sm:text-base flex items-center gap-2">
                <Calculator className="w-5 h-5 text-purple-400" />
                <span>ثانياً: المشتريات والمصاريف (ضريبة المدخلات - Input VAT)</span>
              </h4>
              <span className="text-xs font-mono font-black text-purple-300 bg-purple-500/20 px-2.5 py-1 rounded-xl">
                إجمالي المدخلات: {calculations.totalInputVat.toLocaleString()} ريال
              </span>
            </div>

            {/* FORM LINES FOR PURCHASES */}
            <div className="space-y-3">
              
              {/* LINE 6: Standard Purchases */}
              <div
                onClick={() => setActiveExplainKey("std_purchases")}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  activeExplainKey === "std_purchases"
                    ? "bg-purple-600/20 border-purple-400 ring-2 ring-purple-400/40"
                    : "bg-black/30 border-white/10 hover:border-purple-400/50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-extrabold text-purple-400 bg-purple-500/20 px-1.5 py-0.5 rounded">
                      الخانة 06
                    </span>
                    <label className="text-xs font-bold text-white">
                      المشتريات المحلية الخاضعة للنسبة الأساسية ({vatRate}%):
                    </label>
                  </div>
                  <button className="text-[10px] font-bold text-amber-300 hover:underline flex items-center gap-1 shrink-0">
                    <HelpCircle className="w-3 h-3 text-amber-400" />
                    <span>شرح الخانة</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1 font-semibold">المبلغ غير شامل الضريبة:</span>
                    <input
                      type="number"
                      value={stdPurchases}
                      onChange={(e) => setStdPurchases(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1 font-semibold">ضريبة مدخلات قابلة للخصم ({vatRate}%):</span>
                    <div className="w-full bg-purple-950/50 border border-purple-500/30 rounded-xl px-3 py-2 text-xs font-mono font-black text-purple-200">
                      {calculations.vatStdPurchases.toLocaleString()} ريال
                    </div>
                  </div>
                </div>
              </div>

              {/* LINE 7: RCM Imports */}
              <div
                onClick={() => setActiveExplainKey("rcm_imports")}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  activeExplainKey === "rcm_imports"
                    ? "bg-purple-600/20 border-purple-400 ring-2 ring-purple-400/40"
                    : "bg-black/30 border-white/10 hover:border-purple-400/50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-extrabold text-purple-400 bg-purple-500/20 px-1.5 py-0.5 rounded">
                      الخانة 07
                    </span>
                    <label className="text-xs font-bold text-white">
                      الاستيرادات الخاضعة للتكليف العكسي (RCM Services):
                    </label>
                  </div>
                  <button className="text-[10px] font-bold text-amber-300 hover:underline flex items-center gap-1 shrink-0">
                    <HelpCircle className="w-3 h-3 text-amber-400" />
                    <span>شرح الخانة</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1 font-semibold">قيم الخدمات المستوردة:</span>
                    <input
                      type="number"
                      value={rcmImports}
                      onChange={(e) => setRcmImports(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1 font-semibold">ضريبة التكليف العكسي (توازن المخرجات):</span>
                    <div className="w-full bg-purple-950/50 border border-purple-500/30 rounded-xl px-3 py-2 text-xs font-mono font-black text-purple-200">
                      {calculations.vatRcm.toLocaleString()} ريال
                    </div>
                  </div>
                </div>
              </div>

              {/* LINE 8: Capital Assets */}
              <div
                onClick={() => setActiveExplainKey("capital_assets")}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  activeExplainKey === "capital_assets"
                    ? "bg-purple-600/20 border-purple-400 ring-2 ring-purple-400/40"
                    : "bg-black/30 border-white/10 hover:border-purple-400/50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-extrabold text-purple-400 bg-purple-500/20 px-1.5 py-0.5 rounded">
                      الخانة 08
                    </span>
                    <label className="text-xs font-bold text-white">
                      مشتريات الأصول الرأسمالية (Capital Assets):
                    </label>
                  </div>
                  <button className="text-[10px] font-bold text-amber-300 hover:underline flex items-center gap-1 shrink-0">
                    <HelpCircle className="w-3 h-3 text-amber-400" />
                    <span>شرح الخانة</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1 font-semibold">قيمة الأصول الثابتة:</span>
                    <input
                      type="number"
                      value={capitalAssets}
                      onChange={(e) => setCapitalAssets(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1 font-semibold">ضريبة الأصول القابلة للخصم:</span>
                    <div className="w-full bg-purple-950/50 border border-purple-500/30 rounded-xl px-3 py-2 text-xs font-mono font-black text-purple-200">
                      {calculations.vatCapital.toLocaleString()} ريال
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* SECTION C: ADJUSTMENTS & PREVIOUS CREDITS */}
          <div
            onClick={() => setActiveExplainKey("adjustments")}
            className={`p-6 rounded-3xl bg-[#0a1024] border-2 transition-all cursor-pointer space-y-4 ${
              activeExplainKey === "adjustments"
                ? "border-amber-400 ring-2 ring-amber-400/30"
                : "border-amber-500/30 hover:border-amber-400/60"
            }`}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="font-black text-amber-300 text-sm sm:text-base flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-amber-400" />
                <span>ثالثاً: التعديلات والرصيد الدائن السابق (Adjustments & Carry Forward)</span>
              </h4>
              <button className="text-[10px] font-bold text-amber-300 hover:underline flex items-center gap-1 shrink-0">
                <HelpCircle className="w-3 h-3 text-amber-400" />
                <span>شرح الخانة</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-200 block">
                  التعديلات والديون المعدومة (+ / -):
                </label>
                <input
                  type="number"
                  value={adjustments}
                  onChange={(e) => setAdjustments(Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-400"
                  placeholder="0 (موجب لإضافة ضريبة، سالب لخصم)"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-200 block">
                  رصيد دائن مدور من إقرار سابق:
                </label>
                <input
                  type="number"
                  value={previousCredit}
                  onChange={(e) => setPreviousCredit(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-400"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (5 COLS): LIVE FINAL CALCULATION CARD & FIELD EXPLAINER DRAWER */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* LIVE NET RESULT SUMMARY CARD */}
          <div className={`p-6 rounded-3xl border-2 shadow-2xl space-y-5 transition-all ${
            calculations.isPayable
              ? "bg-gradient-to-br from-[#121129] via-[#1c1236] to-[#121129] border-amber-500/50"
              : "bg-gradient-to-br from-[#0c1a24] via-[#0f2833] to-[#0c1a24] border-emerald-500/50"
          }`}>
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  نتيجة الإقرار الضريبي النهائية
                </span>
                <h4 className="text-lg font-black text-white">
                  {calculations.isPayable ? "ضريبة واجبة السداد للهيئة 💳" : "رصيد دائن مسترد للمكلف 💚"}
                </h4>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-black border ${
                calculations.isPayable
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
              }`}>
                {calculations.isPayable ? "مستحق التوريد" : "مستحق الاسترداد"}
              </span>
            </div>

            {/* Calculations Quick Grid */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40">
                <span className="text-slate-300 font-bold">إجمالي ضريبة المخرجات (المبيعات):</span>
                <span className="font-mono font-black text-indigo-300 text-sm">
                  + {calculations.totalOutputVat.toLocaleString()} ريال
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40">
                <span className="text-slate-300 font-bold">إجمالي ضريبة المدخلات (المشتريات):</span>
                <span className="font-mono font-black text-purple-300 text-sm">
                  - {calculations.totalInputVat.toLocaleString()} ريال
                </span>
              </div>

              {adjustments !== 0 && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 text-[11px]">
                  <span className="text-slate-400">التعديلات والديون المعدومة:</span>
                  <span className="font-mono font-bold text-amber-300">
                    {adjustments > 0 ? `+ ${adjustments}` : adjustments} ريال
                  </span>
                </div>
              )}

              {previousCredit > 0 && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 text-[11px]">
                  <span className="text-slate-400">الرصيد الدائن السابق الخصم:</span>
                  <span className="font-mono font-bold text-emerald-300">
                    - {previousCredit.toLocaleString()} ريال
                  </span>
                </div>
              )}
            </div>

            {/* NET RESULT BIG DISPLAY */}
            <div className={`p-5 rounded-2xl border flex flex-col items-center justify-center text-center space-y-1 ${
              calculations.isPayable
                ? "bg-amber-950/40 border-amber-500/40 shadow-lg shadow-amber-500/10"
                : "bg-emerald-950/40 border-emerald-500/40 shadow-lg shadow-emerald-500/10"
            }`}>
              <span className="text-xs font-bold text-slate-300">
                {calculations.isPayable ? "الصافي المطلوب سداده للهيئة:" : "الصافي القابل للاسترداد أو التدوير:"}
              </span>
              <div className={`text-3xl font-black font-mono tracking-tight ${
                calculations.isPayable ? "text-amber-400" : "text-emerald-400"
              }`}>
                {calculations.finalNetVat.toLocaleString()} <span className="text-base font-sans font-bold">ريال</span>
              </div>
              <p className="text-[10px] text-slate-400 pt-1">
                {calculations.isPayable
                  ? "يجب تسديد هذا المبلغ قبل الموعد النهائي للفترة لتجنب غرامة التأخير 5%."
                  : "يمكنك تقديم طلب استرداد نقدي أو تدوير الرصيد للإقرار القادم."}
              </p>
            </div>

            {/* Print/Export Summary Button */}
            <button
              onClick={() => window.print()}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة وتصدير ملخص الإقرار الضريبي الرسمي</span>
            </button>

          </div>

          {/* DYNAMIC FIELD EXPLAINER DRAWER */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300 font-black">
              <span className="flex items-center gap-1.5 text-amber-400">
                <BookOpen className="w-4 h-4" />
                <span>دليل شرح الخانة المختارة والأنظمة</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                كود الخانة: {activeExplanation.code}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeExplanation.fieldKey}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="p-6 rounded-3xl bg-gradient-to-br from-[#0a1226] via-[#0f1936] to-[#0a1226] border-2 border-indigo-500/40 shadow-2xl space-y-4"
              >
                {/* Title & Badge */}
                <div className="space-y-1.5 border-b border-white/10 pb-3">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black inline-block ${
                    activeExplanation.type === "output"
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                      : activeExplanation.type === "input"
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}>
                    {activeExplanation.type === "output" ? "ضريبة مخرجات (مبيعات)" : activeExplanation.type === "input" ? "ضريبة مدخلات (مشتريات)" : "تسويات وتعديلات"}
                  </span>
                  <h4 className="text-base font-black text-white leading-snug">
                    {activeExplanation.title}
                  </h4>
                </div>

                {/* Purpose */}
                <div className="space-y-1 text-xs">
                  <h5 className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-indigo-400" />
                    <span>ماذا تتضمن هذه الخانة؟</span>
                  </h5>
                  <p className="text-slate-200 text-[11px] leading-relaxed bg-black/40 p-3 rounded-2xl border border-white/5">
                    {activeExplanation.purpose}
                  </p>
                </div>

                {/* Legal Condition */}
                <div className="space-y-1 text-xs">
                  <h5 className="font-bold text-sky-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                    <span>الشرط النظامي والامتثال القانوني:</span>
                  </h5>
                  <p className="text-slate-200 text-[11px] leading-relaxed bg-sky-950/30 p-3 rounded-2xl border border-sky-500/20">
                    {activeExplanation.legalCondition}
                  </p>
                </div>

                {/* Calculation Formula */}
                <div className="space-y-1 text-xs">
                  <h5 className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5 text-amber-400" />
                    <span>معادلة الحساب الضريبي:</span>
                  </h5>
                  <div className="p-3 rounded-2xl bg-black/60 border border-amber-500/30 font-mono text-amber-200 text-xs whitespace-pre-line leading-relaxed">
                    {activeExplanation.calculationMethod}
                  </div>
                </div>

                {/* Examples */}
                <div className="space-y-1 text-xs">
                  <h5 className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>أمثلة عملية شائعة:</span>
                  </h5>
                  <ul className="space-y-1 text-slate-300 text-[11px] bg-emerald-950/20 p-3 rounded-2xl border border-emerald-500/20 list-disc list-inside">
                    {activeExplanation.examples.map((ex, i) => (
                      <li key={i} className="leading-relaxed">{ex}</li>
                    ))}
                  </ul>
                </div>

                {/* Mistakes to Avoid */}
                <div className="space-y-1 text-xs">
                  <h5 className="font-bold text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>أخطاء شائعة يجب الوقاية منها:</span>
                  </h5>
                  <ul className="space-y-1 text-rose-200 text-[11px] bg-rose-950/30 p-3 rounded-2xl border border-rose-500/20 list-disc list-inside">
                    {activeExplanation.mistakesToAvoid.map((m, i) => (
                      <li key={i} className="leading-relaxed">{m}</li>
                    ))}
                  </ul>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>

    </div>
  );
}
