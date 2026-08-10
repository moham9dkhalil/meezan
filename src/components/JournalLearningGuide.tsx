import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Scale,
  Building2,
  Calculator,
  Search,
  Check,
  Zap,
  Award,
  Info,
  Layers,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Play,
  Copy,
  Filter,
  Tag,
  X
} from "lucide-react";

interface JournalLearningGuideProps {
  onLoadPresetToJournal?: (debitAcc: string, creditAcc: string, amount: number, memo: string) => void;
  onSwitchToERPJournal?: () => void;
}

// ─────────────────────────────────────────────────────────────
// ACCOUNT DICTIONARY DATA (Chart of Accounts / دليل الحسابات)
// ─────────────────────────────────────────────────────────────
export interface AccountInfo {
  code: string;
  name: string;
  type: "أصول متداولة" | "أصول غير متداولة" | "خصوم متداولة" | "خصوم غير متداولة" | "حقوق ملكية" | "إيرادات" | "مصروفات";
  nature: "مدين (Dr)" | "دائن (Cr)";
  statement: string;
  whenDebit: string;
  whenCredit: string;
  example: string;
}

const ACCOUNTS_DICTIONARY: AccountInfo[] = [
  // 1100s - CURRENT ASSETS (أصول متداولة)
  {
    code: "1101",
    name: "الصندوق / الخزينة الرئيسي (Cash in Hand)",
    type: "أصول متداولة",
    nature: "مدين (Dr)",
    statement: "الميزانية العمومية (المركز المالي)",
    whenDebit: "عند استلام مبالغ نقدية ودخول نقدية جديدة للخزينة (زيادة).",
    whenCredit: "عند دفع مصاريف أو سداد مبالغ نقدية من الخزينة (نقص).",
    example: "تحصيل 5,000 ج.م نقداً من عميل -> الصندوق (مدين بـ 5,000 ج.م)."
  },
  {
    code: "1102",
    name: "البنك / الحساب الجاري (Bank Current Account)",
    type: "أصول متداولة",
    nature: "مدين (Dr)",
    statement: "الميزانية العمومية (المركز المالي)",
    whenDebit: "عند إيداع مبالغ أو تحويلات بنكية واردة أو شيكات محصلة (زيادة).",
    whenCredit: "عند سداد تحويلات للخارج أو سحب شيكات لموردين (نقص).",
    example: "تحويل بنكي من عميل بـ 10,000 ج.م -> البنك (مدين بـ 10,000 ج.م)."
  },
  {
    code: "1103",
    name: "العملاء / المدينون (Accounts Receivable)",
    type: "أصول متداولة",
    nature: "مدين (Dr)",
    statement: "الميزانية العمومية (المركز المالي)",
    whenDebit: "عند البيع للعميل بالآجل (على الحساب) دون قبض الثمن فوراً (زيادة حقنا لدى العميل).",
    whenCredit: "عندما يقوم العميل بسداد المستحق عليه نقداً أو بالبنك (نقص المديونية).",
    example: "بيع بضاعة بالآجل لعميل بـ 8,000 ج.م -> حساب العملاء (مدين بـ 8,000 ج.م)."
  },
  {
    code: "1104",
    name: "مخزون البضائع / المشتريات (Inventory / Purchases)",
    type: "أصول متداولة",
    nature: "مدين (Dr)",
    statement: "الميزانية العمومية (المركز المالي)",
    whenDebit: "عند شراء بضاعة بغرض إعادة بيعها أو جلب خامات للتشغيل (زيادة المخزون).",
    whenCredit: "عند صرف بضاعة مباعة (تكلفة المبيعات) أو إرجاع بضاعة للمورد.",
    example: "شراء بضاعة بـ 12,000 ج.م -> المخزون / المشتريات (مدين بـ 12,000 ج.م)."
  },
  {
    code: "1105",
    name: "أوراق قبض / شيكات برسم التحصيل (Notes Receivable)",
    type: "أصول متداولة",
    nature: "مدين (Dr)",
    statement: "الميزانية العمومية (المركز المالي)",
    whenDebit: "عند استلام كمبيالة أو شيك مؤجل من العميل إثباتاً للحق.",
    whenCredit: "عند تحصيل قيمة الشيك بالبنك أو رفضه وإعادته للعميل.",
    example: "استلام كمبيالة من عميل بـ 15,000 ج.م -> أوراق القبض (مدين)."
  },
  {
    code: "1106",
    name: "مصاريف مدفوعة مقدماً (Prepaid Expenses)",
    type: "أصول متداولة",
    nature: "مدين (Dr)",
    statement: "الميزانية العمومية (المركز المالي)",
    whenDebit: "عند سداد إيجار أو تأمين سُنوي مقدماً قبل الاستفادة منه.",
    whenCredit: "نهاية كل شهر/سنة عند إهلاك الجزء المستنفد وتحويله لمصروف.",
    example: "سداد إيجار سنة مقدماً 24,000 ج.م -> مصاريف مدفوعة مقدماً (مدين)."
  },
  {
    code: "1107",
    name: "إيرادات مستحقة التحصيل (Accrued Revenues)",
    type: "أصول متداولة",
    nature: "مدين (Dr)",
    statement: "الميزانية العمومية (المركز المالي)",
    whenDebit: "عند تقديم خدمة للعميل ولم يتم تحصيل قيمتها أو إصدار الفاتورة بعد.",
    whenCredit: "عند تحصيل المبلغ المستحق فعلياً بالبنك أو الصندوق.",
    example: "تقديم استشارة بـ 6,000 ج.م أُنجزت ولم تُحصل -> إيراد مستحق (مدين)."
  },

  // 1200s - NON-CURRENT ASSETS (أصول غير متداولة)
  {
    code: "1201",
    name: "الأراضي (Land)",
    type: "أصول غير متداولة",
    nature: "مدين (Dr)",
    statement: "الميزانية العمومية (المركز المالي)",
    whenDebit: "عند شراء أراضٍ لاستخدامها في مقر الشركة أو المصنع (أصل لا يُهلك).",
    whenCredit: "عند بيع أرض أو الاستغناء عنها.",
    example: "شراء قطعة أرض لبناء مقر بـ 500,000 ج.م -> حـ/ الأراضي (مدين)."
  },
  {
    code: "1202",
    name: "المباني والعقارات (Buildings)",
    type: "أصول غير متداولة",
    nature: "مدين (Dr)",
    statement: "الميزانية العمومية (المركز المالي)",
    whenDebit: "عند شراء أو إنشاء مبانٍ ومقرات تشغيلية.",
    whenCredit: "عند بيع العقار أو هدمه واستبعاده من الدفاتر.",
    example: "شراء مقر إداري بـ 300,000 ج.م -> حـ/ المباني (مدين)."
  },
  {
    code: "1203",
    name: "الآلات والمعدات الإنتاجية (Machinery & Equipment)",
    type: "أصول غير متداولة",
    nature: "مدين (Dr)",
    statement: "الميزانية العمومية (المركز المالي)",
    whenDebit: "عند شراء خطوط إنتاج أو آلات مصنع جديدة.",
    whenCredit: "عند بيع الآلات أو تخريدها واستبعادها.",
    example: "شراء خط إنتاج بـ 150,000 ج.م -> حـ/ الآلات والمعدات (مدين)."
  },
  {
    code: "1204",
    name: "أجهزة الكمبيوتر والتقنية (IT Hardware & Software)",
    type: "أصول غير متداولة",
    nature: "مدين (Dr)",
    statement: "الميزانية العمومية (المركز المالي)",
    whenDebit: "عند شراء خوادم، أجهزة حاسوب، أو برامج وأدوات رقمية دائمة.",
    whenCredit: "عند التخلص من الأجهزة القديمة وتخريدها.",
    example: "شراء أجهزة حاسوب للشركة بـ 40,000 ج.م -> حـ/ أجهزة التقنية (مدين)."
  },
  {
    code: "1205",
    name: "وسائل النقل والسيارات (Vehicles & Fleet)",
    type: "أصول غير متداولة",
    nature: "مدين (Dr)",
    statement: "الميزانية العمومية (المركز المالي)",
    whenDebit: "عند شراء سيارات شحن أو سيارات تنقل للموظفين.",
    whenCredit: "عند بيع السيارة واستبعاد قيمتها الأصلية.",
    example: "شراء سيارة نقل بضائع بـ 90,000 ج.م -> حـ/ السيارات (مدين)."
  },
  {
    code: "1206",
    name: "الأثاث والتجهيزات المكتبية (Furniture & Fixtures)",
    type: "أصول غير متداولة",
    nature: "مدين (Dr)",
    statement: "الميزانية العمومية (المركز المالي)",
    whenDebit: "عند شراء مكاتب، كراسي، ديكورات وتكييفات للمقر.",
    whenCredit: "عند الاستغناء عن الأثاث أو بيعه مستعملاً.",
    example: "تأثيث المقر بـ 25,000 ج.م -> حـ/ الأثاث والتجهيزات (مدين)."
  },
  {
    code: "1207",
    name: "مجمع إهلاك الأصول الثابتة (Accumulated Depreciation)",
    type: "أصول غير متداولة",
    nature: "دائن (Cr)",
    statement: "الميزانية العمومية (حساب مقابل يخصم من الأصل)",
    whenDebit: "عند إقفال تخريد الأصل أو بيعه وتصفية مجمعه.",
    whenCredit: "عند إثبات قيد الإهلاك الدوري السنوي أو الشهري للأصل.",
    example: "إثبات إهلاك السيارات السنوي 9,000 ج.م -> مجمع إهلاك السيارات (دائن)."
  },

  // 2100s - CURRENT LIABILITIES (خصوم متداولة)
  {
    code: "2101",
    name: "الموردون / الدائنون (Accounts Payable)",
    type: "خصوم متداولة",
    nature: "دائن (Cr)",
    statement: "الميزانية العمومية (المركز المالي)",
    whenDebit: "عند سداد المبالغ المستحقة للمورد وتصفية دينه (نقص الالتزام علينا).",
    whenCredit: "عند الشراء من المورد بالآجل وعدم الدفع فوراً (زيادة الالتزام علينا).",
    example: "شراء بضاعة بالآجل من مورد بـ 15,000 ج.م -> حساب الموردين (دائن بـ 15,000 ج.م)."
  },
  {
    code: "2102",
    name: "أوراق دفع / شيكات برسم السداد (Notes Payable)",
    type: "خصوم متداولة",
    nature: "دائن (Cr)",
    statement: "الميزانية العمومية (المركز المالي)",
    whenDebit: "عند سداد الشيك وصرف قيمته من حساب البنك.",
    whenCredit: "عند تحرير وتقديم شيك مؤجل أو كمبيالة للمورد ضماناً للدين.",
    example: "إصدار شيك مؤجل للمورد بـ 20,000 ج.م -> أوراق الدفع (دائن)."
  },
  {
    code: "2103",
    name: "مصاريف مستحقة غير مدفوعة (Accrued Expenses)",
    type: "خصوم متداولة",
    nature: "دائن (Cr)",
    statement: "الميزانية العمومية (المركز المالي)",
    whenDebit: "عند صرف وسداد المصروف المستحق فعلياً نقداً أو بنكياً.",
    whenCredit: "نهاية الشهر عند استحقاق رواتب/إيجار/كهرباء لم تُدفع بعد إثباتاً للالتزام.",
    example: "إثبات رواتب الشهر المستحقة 35,000 ج.م -> رواتب مستحقة (دائن)."
  },
  {
    code: "2104",
    name: "إيرادات مقبوضة مقدماً (Unearned / Deferred Revenue)",
    type: "خصوم متداولة",
    nature: "دائن (Cr)",
    statement: "الميزانية العمومية (المركز المالي)",
    whenDebit: "عند تنفيذ الخدمة وتحويل المبلغ المقبوض إلى إيراد محقق.",
    whenCredit: "عند استلام دفعة مقدمة من العميل قبل تنفيذ الخدمة أو تسليم البضاعة.",
    example: "استلام 18,000 ج.م مقدماً لعقد صيانة -> إيراد مقبوض مقدماً (دائن)."
  },
  {
    code: "2105",
    name: "ضريبة القيمة المضافة المستحقة (VAT Payable)",
    type: "خصوم متداولة",
    nature: "دائن (Cr)",
    statement: "الميزانية العمومية (المركز المالي)",
    whenDebit: "عند سداد الضريبة للهيئة أو مقاصة ضريبة المشتريات المدفوعة.",
    whenCredit: "عند تحصيل ضريبة مبيعات من العملاء لحساب الهيئة الضريبية.",
    example: "تحصيل ضريبة 14% بقيمة 1,400 ج.م -> ضريبة القيمة المضافة (دائن)."
  },

  // 2200s - NON-CURRENT LIABILITIES (خصوم غير متداولة)
  {
    code: "2201",
    name: "القروض البنكية طويلة الأجل (Long-term Bank Loans)",
    type: "خصوم غير متداولة",
    nature: "دائن (Cr)",
    statement: "الميزانية العمومية (المركز المالي)",
    whenDebit: "عند سداد أقساط القرض البنكي ونقص الالتزام.",
    whenCredit: "عند استلام مبلغ القرض البنكي الممول للنشاط وزيادة المديونية.",
    example: "استلام قرض تمويلي بـ 200,000 ج.م بالبنك -> القروض طويلة الأجل (دائن)."
  },

  // 3100s - EQUITY (حقوق الملكية)
  {
    code: "3101",
    name: "رأس المال المدفوع (Owner's Capital)",
    type: "حقوق ملكية",
    nature: "دائن (Cr)",
    statement: "الميزانية العمومية (المركز المالي)",
    whenDebit: "عند تخفيض رأس المال أو إقفال تصفية النشاط.",
    whenCredit: "عند تأسيس الشركة أو زيادة ضخ استثمارات إضافية من المالك.",
    example: "بدء النشاط بضخ 100,000 ج.م في البنك -> رأس المال (دائن بـ 100,000 ج.م)."
  },
  {
    code: "3102",
    name: "الأرباح المبقاة / المدورة (Retained Earnings)",
    type: "حقوق ملكية",
    nature: "دائن (Cr)",
    statement: "الميزانية العمومية (المركز المالي)",
    whenDebit: "عند توزيع أرباح على الشركاء أو تغطية خسائر سنوية.",
    whenCredit: "نهاية كل فترة مالية عند إقفال صافي أرباح الشركة فيها.",
    example: "ترحيل صافي ربح السنة 45,000 ج.م -> الأرباح المبقاة (دائن)."
  },
  {
    code: "3103",
    name: "المسحوبات الشخصية للملاك (Drawings / Owner Withdrawals)",
    type: "حقوق ملكية",
    nature: "مدين (Dr)",
    statement: "الميزانية العمومية (حساب مخفض للملكية)",
    whenDebit: "عند سحب المالك مبالغ نقدية أو بضاعة لاستخدامه الشخصي.",
    whenCredit: "عند إقفال الحساب نهاية السنة المالية في جاري المالك أو رأس المال.",
    example: "سحب المالك 3,000 ج.م نقداً لأغراضه الشخصية -> المسحوبات الشخصية (مدين)."
  },

  // 4100s - REVENUES (الإيرادات)
  {
    code: "4101",
    name: "إيراد المبيعات الرئيسية (Sales Revenue)",
    type: "إيرادات",
    nature: "دائن (Cr)",
    statement: "قائمة الدخل (الأرباح والخسائر)",
    whenDebit: "عند إقفال الحساب نهاية السنة أو إثبات مردودات المبيعات.",
    whenCredit: "عند تحقيق عمليات بيع بضاعة أو منتجات للعملاء (زيادة الإيراد).",
    example: "بيع بضاعة بمبلغ 20,000 ج.م -> إيراد المبيعات (دائن بـ 20,000 ج.م)."
  },
  {
    code: "4102",
    name: "إيرادات الخدمات والاستشارات (Service Revenue)",
    type: "إيرادات",
    nature: "دائن (Cr)",
    statement: "قائمة الدخل (الأرباح والخسائر)",
    whenDebit: "عند إقفال الحساب نهاية الفترة الماليّة.",
    whenCredit: "عند تقديم خدمات استشارية أو تنفيدية للعملاء وتثبيت الحق.",
    example: "إنجاز خدمة صيانة بـ 8,000 ج.م -> إيراد الخدمات (دائن)."
  },

  // 5100s & 5200s - EXPENSES & COGS (المصروفات والتكاليف)
  {
    code: "5101",
    name: "تكلفة البضاعة المباعة (Cost of Goods Sold - COGS)",
    type: "مصروفات",
    nature: "مدين (Dr)",
    statement: "قائمة الدخل (خصم من المبيعات لحساب مجمل الربح)",
    whenDebit: "عند بيع بضاعة لتسجيل التكلفة الأصلية للمخزون المباع.",
    whenCredit: "عند إقفال الحساب نهاية السنة في ملخص قائمة الدخل.",
    example: "تسجيل تكلفة البضاعة المباعة بـ 11,000 ج.م -> حـ/ COGS (مدين)."
  },
  {
    code: "5201",
    name: "مصروف الرواتب والأجور (Salaries & Wages)",
    type: "مصروفات",
    nature: "مدين (Dr)",
    statement: "قائمة الدخل (الأرباح والخسائر)",
    whenDebit: "عند استحقاق رواتب الموظفين والعمال عن الشهر.",
    whenCredit: "عند إقفال الحساب نهاية السنّة المالّية.",
    example: "إثبات مسير رواتب الشهر 30,000 ج.م -> مصروف الرواتب (مدين)."
  },
  {
    code: "5202",
    name: "مصروف إيجار المقر والمخازن (Rent Expense)",
    type: "مصروفات",
    nature: "مدين (Dr)",
    statement: "قائمة الدخل (الأرباح والخسائر)",
    whenDebit: "عند استحقاق أو استنفاد قيمة إيجار المكاتب والفروع.",
    whenCredit: "عند إقفال الحساب بنهاية الفترة المالية.",
    example: "استحقاق إيجار المقر بـ 5,000 ج.م -> مصروف الإيجار (مدين)."
  },
  {
    code: "5203",
    name: "مصروف الكهرباء والمياه والمنافع (Utilities Expense)",
    type: "مصروفات",
    nature: "مدين (Dr)",
    statement: "قائمة الدخل (الأرباح والخسائر)",
    whenDebit: "عند ورود ودفع فواتير الكهرباء، المياه، والإنترنت.",
    whenCredit: "عند إقفال الحساب نهاية السنة.",
    example: "دفع فاتورة كهرباء بـ 1,200 ج.م -> مصروف الكهرباء (مدين)."
  },
  {
    code: "5204",
    name: "مصروف التسويق والدعاية (Marketing & Advertising)",
    type: "مصروفات",
    nature: "مدين (Dr)",
    statement: "قائمة الدخل (الأرباح والخسائر)",
    whenDebit: "عند إطلاق حملات إعلانية وتكبد مصاريف الترويج.",
    whenCredit: "عند إقفال الحساب بنهاية السنة.",
    example: "سداد 4,000 ج.م إعلانات ممولة -> مصروف التسويق (مدين)."
  },
  {
    code: "5205",
    name: "مصروف إهلاك الأصول الثابتة (Depreciation Expense)",
    type: "مصروفات",
    nature: "مدين (Dr)",
    statement: "قائمة الدخل (الأرباح والخسائر)",
    whenDebit: "عند تسجيل النقص التدريجي في قيمة الأصل الثابت سنوياً.",
    whenCredit: "عند إقفال الحساب في ملخص الدخل نهاية الفترة.",
    example: "تسجيل إهلاك الآلات السنوي بـ 6,000 ج.م -> مصروف الإهلاك (مدين)."
  },
  {
    code: "5206",
    name: "مصاريف عمومية وإدارية متنوعة (General & Admin)",
    type: "مصروفات",
    nature: "مدين (Dr)",
    statement: "قائمة الدخل (الأرباح والخسائر)",
    whenDebit: "عند تكبد أدوات مكتبية، ضيافة، أو مصاريف حكومية ونثرية.",
    whenCredit: "عند إقفال الحساب بنهاية الفترة.",
    example: "شراء أدوات ضيافة بـ 500 ج.م -> مصاريف عمومية وإدارية (مدين)."
  }
];

// ─────────────────────────────────────────────────────────────
// INTERACTIVE GUIDED TRANSACTIONS STEPPER DATA
// ─────────────────────────────────────────────────────────────
interface GuidedScenario {
  id: string;
  title: string;
  category: string;
  story: string;
  debitAcc: string;
  creditAcc: string;
  amount: number;
  explanation: string;
  debitReason: string;
  creditReason: string;
  goldenRule: string;
}

const GUIDED_SCENARIOS: GuidedScenario[] = [
  {
    id: "sc-1",
    title: "1️⃣ إيداع رأس المال وبدء النشاط في البنك",
    category: "تمويل وتأسيس",
    story: "قام أصحاب الشركة بضخ مبلغ 200,000 ج.م نقداً من حسابهم الخاص وإيداعه في الحساب الجاري للشركة بالبنك كبداية للنشاط التجاري.",
    debitAcc: "البنك (الحساب الجاري)",
    creditAcc: "رأس المال",
    amount: 200000,
    explanation: "البنك أصل زاد بتمويل من أصحاب الشركة (رأس المال كالتزام دائن للشركة تجاه ملاكها).",
    debitReason: "حساب البنك (أصل متداول) دخلت فيه النقدية فزاد، وزيادة الأصل تجعله مديداً (Dr).",
    creditReason: "حساب رأس المال (حقوق ملكية) نشأ وزاد بضخ تمويل الملاك، وزيادة حقوق الملكية تجعلها دائنة (Cr).",
    goldenRule: "من حـ/ البنك (مدين) إلى حـ/ رأس المال (دائن)"
  },
  {
    id: "sc-2",
    title: "2️⃣ شراء أثاث ومعدات مكتبية بشيك بنكي",
    category: "أصول ثابتة",
    story: "اشترت الشركة أثاثاً وأجهزة مكتبية بمبلغ 15,000 ج.م لاستخدامها في مقر الشركة، وتم دفع القيمة بالكامل عن طريق تحويل بنكي.",
    debitAcc: "الأصول الثابتة - الأثاث والمعدات",
    creditAcc: "البنك (الحساب الجاري)",
    amount: 15000,
    explanation: "مبادلة أصل بأصل: امتلكنا أصل جديد (أثاث) مقابل نقص أصل آخر (البنك).",
    debitReason: "حساب الأثاث (أصل ثابت) زاد باقتناء أصول جديدة، وزيادة الأصل = مدين (Dr).",
    creditReason: "حساب البنك (أصل متداول) نقص بسبب صرف المبلغ، ونقص الأصل = دائن (Cr).",
    goldenRule: "من حـ/ الأثاث والمعدات (مدين) إلى حـ/ البنك (دائن)"
  },
  {
    id: "sc-3",
    title: "3️⃣ بيع بضاعة لعميل نقداً واستلام المبلغ بالصندوق",
    category: "مبيعات وإيرادات",
    story: "باعت الشركة بضاعة لعميل بمبلغ 8,500 ج.م وقام العميل بدفع المبلغ فوراً نقداً في خزينة الشركة.",
    debitAcc: "الصندوق (الخزينة)",
    creditAcc: "إيراد المبيعات",
    amount: 8500,
    explanation: "تحقيق إيراد مبيعات ترتب عليه استلام نقدية فورية بالخزينة.",
    debitReason: "حساب الصندوق (أصل متداول) استلم النقدية فزاد، وزيادة الأصل = مدين (Dr).",
    creditReason: "حساب المبيعات (إيراد) تحقق واستفادت منه الشركة، والزيادة في الإيراد = دائن (Cr).",
    goldenRule: "من حـ/ الصندوق (مدين) إلى حـ/ إيراد المبيعات (دائن)"
  },
  {
    id: "sc-4",
    title: "4️⃣ شراء بضاعة ومخزون من مورد على الحساب (بالآجل)",
    category: "مشتريات والتزامات",
    story: "اشترت الشركة بضاعة من (شركة الأمل) بمبلغ 25,000 ج.م على الحساب (بالآجل) دون دفع أي مبالغ فوراً.",
    debitAcc: "المخزون / المشتريات",
    creditAcc: "الموردون - شركة الأمل",
    amount: 25000,
    explanation: "استلام مخزون جديد مع ترتب دين والتزام على الشركة لصالح المورد.",
    debitReason: "حساب المخزون (أصل) دخلت فيه بضاعة جديدة فزاد، وزيادة الأصل = مدين (Dr).",
    creditReason: "حساب الموردون (التزام/خصوم) زاد الدين الواجب سداده مستقبلاً، وزيادة الخصوم = دائن (Cr).",
    goldenRule: "من حـ/ المخزون والمشتريات (مدين) إلى حـ/ الموردين (دائن)"
  },
  {
    id: "sc-5",
    title: "5️⃣ سداد إيجار المقر الرئيسي بشيك بنكي",
    category: "مصروفات تشغيلية",
    story: "سددت الشركة قيمة إيجار المقر الرئيسي البالغة 6,000 ج.م عن الشهر الحالي بواسطة شيك مسحوب على البنك.",
    debitAcc: "مصروف الإيجار",
    creditAcc: "البنك (الحساب الجاري)",
    amount: 6000,
    explanation: "تكبد مصروف مقابل الاستفادة من المكان مع نقص في حساب البنك.",
    debitReason: "حساب مصروف الإيجار (مصروف) تم تحمله وتكبده، وزيادة المصروف = مدين (Dr).",
    creditReason: "حساب البنك (أصل) نقص بخصم قيمة الشيك، ونقص الأصل = دائن (Cr).",
    goldenRule: "من حـ/ مصروف الإيجار (مدين) إلى حـ/ البنك (دائن)"
  },
  {
    id: "sc-6",
    title: "6️⃣ تحصيل مبلغ مستحق من عميل سابق بشيك",
    category: "تحصيل وسداد",
    story: "قام العميل (مؤسسة النور) بسداد مبلغ 12,000 ج.م بشيك بنكي مسدداً جزءاً من ديونه السابقة المتأخرة.",
    debitAcc: "البنك (الحساب الجاري)",
    creditAcc: "العملاء - مؤسسة النور",
    amount: 12000,
    explanation: "نقص مديونية العميل المستحقة للشركة مقابل زيادة رصيد البنك بالنقدية المودعة.",
    debitReason: "حساب البنك (أصل) زاد باستلام الشيك، وزيادة الأصل = مدين (Dr).",
    creditReason: "حساب العملاء (أصل) نقصت مديونيتهم وتسوى جزء من حقنا لديهم، ونقص الأصل = دائن (Cr).",
    goldenRule: "من حـ/ البنك (مدين) إلى حـ/ العملاء (دائن)"
  }
];

// ─────────────────────────────────────────────────────────────
// INTERACTIVE QUIZ QUESTIONS FOR TESTING KNOWLEDGE
// ─────────────────────────────────────────────────────────────
interface QuizQuestion {
  id: number;
  question: string;
  options: { label: string; isCorrect: boolean; reason: string }[];
}

const KNOWLEDGE_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "عندما تشتري الشركة أجهزة كمبيوتر نقداً بمبلغ 10,000 ج.م، ما هو الحساب الذي يوضع في جانب المدين (Dr)؟",
    options: [
      { label: "حـ/ الصندوق (الخزينة)", isCorrect: false, reason: "خطأ، الصندوق نقص بدفع المبلغ وبالتالي هو دائن (Cr)." },
      { label: "حـ/ الأجهزة والمعدات (الأصول الثابتة)", isCorrect: true, reason: "إجابة صحيحة! الأجهزة أصل زاد باقتنائه فيكون مديناً (Dr)." },
      { label: "حـ/ المبيعات", isCorrect: false, reason: "خطأ، المبيعات إيرادات ولا علاقة لها بشراء الأصول." },
      { label: "حـ/ رأس المال", isCorrect: false, reason: "خطأ، رأس المال يتعلق بتمويل الملاك فقط." }
    ]
  },
  {
    id: 2,
    question: "ما هي الطبيعة الأصلية لحسابات 'المصروفات' و 'الأصول' عند نشأتها وزيادتها؟",
    options: [
      { label: "دائنة دائماً (Credit)", isCorrect: false, reason: "خطأ، الدائن هو طبيعة الخصوم والإيرادات وحقوق الملكية." },
      { label: "مدينة دائماً (Debit)", isCorrect: true, reason: "ممتاز! القاعدة المحاسبية: الأصول والمصروفات طبيعتها مدينة (Dr) تزيد في المدين وتنقص في الدائن." },
      { label: "حسب رغبة المحاسب", isCorrect: false, reason: "خطأ، القيد المزدوج يخضع لقواعد محاسبية دولية صارمة." }
    ]
  },
  {
    id: 3,
    question: "قامت الشركة ببيع بضاعة لعميل على الحساب (بالآجل) بمبلغ 30,000 ج.م، ما الطرف الدائن في هذا القيد؟",
    options: [
      { label: "حـ/ العملاء", isCorrect: false, reason: "خطأ، حساب العملاء أصل زاد بالمديونية فيكون مديناً (Dr)." },
      { label: "حـ/ المبيعات (الإيراد)", isCorrect: true, reason: "إجابة ممتازة! الإيرادات طبيعتها دائنة (Cr) وتزيد دائماً في الجانب الدائن عند تحقق البيع." },
      { label: "حـ/ الموردين", isCorrect: false, reason: "خطأ، الموردون يتعلقون بالمشتريات وليس المبيعات." }
    ]
  }
];

export function JournalLearningGuide({ onLoadPresetToJournal, onSwitchToERPJournal }: JournalLearningGuideProps) {
  const [activeTab, setActiveTab] = useState<"wizard" | "dictionary" | "scenarios" | "quiz">("wizard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("الكل");
  const [selectedNatureFilter, setSelectedNatureFilter] = useState<string>("الكل");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [wizardStep, setWizardStep] = useState(1);
  const [selectedGuidedScenario, setSelectedGuidedScenario] = useState<GuidedScenario>(GUIDED_SCENARIOS[0]);

  // Quiz State
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const filteredDictionary = ACCOUNTS_DICTIONARY.filter((acc) => {
    const matchesSearch =
      acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.statement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.whenDebit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.whenCredit.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategoryFilter === "الكل" || acc.type === selectedCategoryFilter;

    const matchesNature =
      selectedNatureFilter === "الكل" || acc.nature.includes(selectedNatureFilter);

    return matchesSearch && matchesCategory && matchesNature;
  });

  const copyToClipboard = (text: string, code: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOptionSelect = (idx: number) => {
    if (selectedOptionIdx !== null) return; // prevent multiple clicks
    setSelectedOptionIdx(idx);
    if (KNOWLEDGE_QUIZ[currentQuizIdx].options[idx].isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIdx + 1 < KNOWLEDGE_QUIZ.length) {
      setCurrentQuizIdx((prev) => prev + 1);
      setSelectedOptionIdx(null);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIdx(0);
    setSelectedOptionIdx(null);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-right" dir="rtl">
      {/* BANNER HEADER */}
      <div className="bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-black">
            <BookOpen className="w-4 h-4 text-purple-300" />
            <span>المرشد التفاعلي لتعلم القيود المحاسبية من الصفر</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white leading-snug">
            كيف تبني قيداً محاسبياً متوازناً وسليماً 100%؟
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            طريقة مبسطة وتفاعلية تفكك نظرية القيد المزدوج (Double-Entry System) لتعرف فورياً: من هو الطرف المدين؟ ومن هو الطرف الدائن؟ ولماذا؟
          </p>
        </div>

        <div className="z-10 shrink-0 flex flex-wrap gap-2">
          {onSwitchToERPJournal && (
            <button
              onClick={onSwitchToERPJournal}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer transition-all border border-purple-400/40"
            >
              <Building2 className="w-4 h-4" />
              <span>انتقل لمحاكي ERP مباشر</span>
            </button>
          )}
        </div>
      </div>

      {/* SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab("wizard")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border whitespace-nowrap shrink-0 ${
            activeTab === "wizard"
              ? "bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-600/30"
              : "bg-[#0b1222] text-slate-300 border-white/10 hover:border-white/20 hover:text-white"
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-300" />
          <span>المرشد الخطوي التفاعلي (Step-by-Step)</span>
        </button>

        <button
          onClick={() => setActiveTab("scenarios")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border whitespace-nowrap shrink-0 ${
            activeTab === "scenarios"
              ? "bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30"
              : "bg-[#0b1222] text-slate-300 border-white/10 hover:border-white/20 hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4 text-indigo-300" />
          <span>مكتبة التمارين والحالات العملية (6 أمثلة)</span>
        </button>

        <button
          onClick={() => setActiveTab("dictionary")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border whitespace-nowrap shrink-0 ${
            activeTab === "dictionary"
              ? "bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-600/30"
              : "bg-[#0b1222] text-slate-300 border-white/10 hover:border-white/20 hover:text-white"
          }`}
        >
          <Search className="w-4 h-4 text-cyan-300" />
          <span>مستكشف طبيعة الحسابات ("أي حساب أختار؟")</span>
        </button>

        <button
          onClick={() => setActiveTab("quiz")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border whitespace-nowrap shrink-0 ${
            activeTab === "quiz"
              ? "bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-600/30"
              : "bg-[#0b1222] text-slate-300 border-white/10 hover:border-white/20 hover:text-white"
          }`}
        >
          <Award className="w-4 h-4 text-emerald-300" />
          <span>اختبار قياس مهارة القيد المزدوج 🎯</span>
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 1: STEP-BY-STEP GUIDED WIZARD */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "wizard" && (
        <div className="bg-[#080d1e] p-6 rounded-3xl border border-white/10 space-y-6">
          {/* VISUAL STEPS INDICATOR */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 border-b border-white/10 pb-6">
            <div
              onClick={() => setWizardStep(1)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                wizardStep === 1
                  ? "bg-purple-600/20 border-purple-500 text-white shadow-lg"
                  : "bg-white/5 border-white/10 text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-purple-500/30 border border-purple-400 flex items-center justify-center font-black text-xs shrink-0 text-purple-300">
                1
              </div>
              <div>
                <div className="text-xs font-black">تحليل المعاملة المالية</div>
                <div className="text-[10px] opacity-70">ما الذي حدث بالظبط؟</div>
              </div>
            </div>

            <div
              onClick={() => setWizardStep(2)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                wizardStep === 2
                  ? "bg-purple-600/20 border-purple-500 text-white shadow-lg"
                  : "bg-white/5 border-white/10 text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-cyan-500/30 border border-cyan-400 flex items-center justify-center font-black text-xs shrink-0 text-cyan-300">
                2
              </div>
              <div>
                <div className="text-xs font-black">من أخذ ومن أعطى؟</div>
                <div className="text-[10px] opacity-70">تحديد الآخذ والمعطي</div>
              </div>
            </div>

            <div
              onClick={() => setWizardStep(3)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                wizardStep === 3
                  ? "bg-purple-600/20 border-purple-500 text-white shadow-lg"
                  : "bg-white/5 border-white/10 text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-emerald-500/30 border border-emerald-400 flex items-center justify-center font-black text-xs shrink-0 text-emerald-300">
                3
              </div>
              <div>
                <div className="text-xs font-black">تطبيق قاعدة الحسابات</div>
                <div className="text-[10px] opacity-70">المدين (Dr) والدائن (Cr)</div>
              </div>
            </div>

            <div
              onClick={() => setWizardStep(4)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                wizardStep === 4
                  ? "bg-purple-600/20 border-purple-500 text-white shadow-lg"
                  : "bg-white/5 border-white/10 text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-amber-500/30 border border-amber-400 flex items-center justify-center font-black text-xs shrink-0 text-amber-300">
                4
              </div>
              <div>
                <div className="text-xs font-black">صياغة القيد والتجربة</div>
                <div className="text-[10px] opacity-70">من حـ/ إلى حـ/</div>
              </div>
            </div>
          </div>

          {/* STEP 1 CONTENT */}
          {wizardStep === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-black">
                  1
                </div>
                <div>
                  <h3 className="text-base font-black text-white">الخطوة الأولى: تفكيك الحدث المالي إلى طرفين</h3>
                  <p className="text-xs text-slate-300">أي معاملة مالية تحدث في الشركة (شراء، بيع، دفع، استلام) تؤثر دائماً على حسابين على الأقل.</p>
                </div>
              </div>

              {/* Scenario Selector inside step 1 */}
              <div className="bg-[#0f172a] p-4 rounded-2xl border border-white/10 space-y-3">
                <label className="block text-xs font-black text-purple-300">اختر سيناريو تعليمي لتتبعه وتفهمه الآن:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {GUIDED_SCENARIOS.map((sc) => (
                    <button
                      key={sc.id}
                      onClick={() => setSelectedGuidedScenario(sc)}
                      className={`p-3 rounded-xl border text-xs text-right font-bold transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                        selectedGuidedScenario.id === sc.id
                          ? "bg-purple-600/30 border-purple-400 text-white shadow-md"
                          : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      <span>{sc.title}</span>
                      <span className="text-[10px] text-purple-300 font-mono self-end px-2 py-0.5 rounded bg-black/40">
                        {sc.amount.toLocaleString()} ج.م
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Story Details Card */}
              <div className="bg-gradient-to-br from-[#0c142c] to-[#111c3e] p-5 rounded-2xl border border-cyan-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-cyan-300">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <span>تفاصيل المعاملة المختارة:</span>
                </div>
                <p className="text-sm font-bold text-white leading-relaxed">
                  "{selectedGuidedScenario.story}"
                </p>
                <div className="p-3 rounded-xl bg-black/30 border border-white/10 text-xs text-slate-300 flex items-center justify-between">
                  <span>المبلغ المالي للمعاملة:</span>
                  <span className="text-base font-black text-cyan-400 font-mono">
                    {selectedGuidedScenario.amount.toLocaleString()} ج.م
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setWizardStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-lg flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span>الانتقال للخطوة 2: تحديد الآخذ والمعطي</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 CONTENT */}
          {wizardStep === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-black">
                  2
                </div>
                <div>
                  <h3 className="text-base font-black text-white">الخطوة الثانية: من أخذ الميزة؟ ومن أعطى الميزة؟</h3>
                  <p className="text-xs text-slate-300">في الفكر المحاسبي الأصيل: الحساب الذي <b>يأخذ</b> القيمة أو <b>يزيد</b> ميزانه هو المدين، والحساب الذي <b>يعطي</b> القيمة أو <b>ينقص</b> هو الدائن.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* DEBIT PARTY CARD */}
                <div className="bg-[#0b192e] p-5 rounded-2xl border border-cyan-500/40 space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 left-0 bg-cyan-500 text-slate-950 font-black text-[10px] px-3 py-1 rounded-br-xl">
                    الطرف المدين (DEBIT)
                  </div>
                  <div className="flex items-center gap-2 text-cyan-300 font-black text-sm">
                    <Scale className="w-4 h-4 text-cyan-400" />
                    <span>من الذي أخذ واستلم الميزة؟</span>
                  </div>
                  <div className="text-lg font-black text-white bg-black/40 p-3 rounded-xl border border-cyan-500/30">
                    {selectedGuidedScenario.debitAcc}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {selectedGuidedScenario.debitReason}
                  </p>
                </div>

                {/* CREDIT PARTY CARD */}
                <div className="bg-[#0e1c20] p-5 rounded-2xl border border-emerald-500/40 space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 left-0 bg-emerald-500 text-slate-950 font-black text-[10px] px-3 py-1 rounded-br-xl">
                    الطرف الدائن (CREDIT)
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300 font-black text-sm">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <span>من الذي أعطى أو مول الميزة؟</span>
                  </div>
                  <div className="text-lg font-black text-white bg-black/40 p-3 rounded-xl border border-emerald-500/30">
                    {selectedGuidedScenario.creditAcc}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {selectedGuidedScenario.creditReason}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setWizardStep(1)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>السابق</span>
                </button>

                <button
                  onClick={() => setWizardStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-lg flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span>الانتقال للخطوة 3: تطابق القاعدة الذهبية</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 CONTENT */}
          {wizardStep === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-black">
                  3
                </div>
                <div>
                  <h3 className="text-base font-black text-white">الخطوة الثالثة: مصفوفة طبيعة الحسابات الخمسة</h3>
                  <p className="text-xs text-slate-300">مراجعة المعايير المحاسبية الدولية لكيفية تصرف أنواع الحسابات عند الزيادة والنقص.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 text-xs text-center font-bold">
                <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-2">
                  <span className="block text-cyan-300 font-black text-sm">1. الأصول (Assets)</span>
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-[11px]">الزيادة = مدين (Dr)</div>
                  <div className="p-1.5 rounded-lg bg-red-500/20 text-red-300 text-[11px]">النقص = دائن (Cr)</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 space-y-2">
                  <span className="block text-red-300 font-black text-sm">2. المصروفات (Expenses)</span>
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-[11px]">الزيادة = مدين (Dr)</div>
                  <div className="p-1.5 rounded-lg bg-red-500/20 text-red-300 text-[11px]">النقص = دائن (Cr)</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-orange-950/40 border border-orange-500/30 space-y-2">
                  <span className="block text-orange-300 font-black text-sm">3. الخصوم (Liabilities)</span>
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-[11px]">الزيادة = دائن (Cr)</div>
                  <div className="p-1.5 rounded-lg bg-red-500/20 text-red-300 text-[11px]">النقص = مدين (Dr)</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-2">
                  <span className="block text-purple-300 font-black text-sm">4. الملكية (Equity)</span>
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-[11px]">الزيادة = دائن (Cr)</div>
                  <div className="p-1.5 rounded-lg bg-red-500/20 text-red-300 text-[11px]">النقص = مدين (Dr)</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                  <span className="block text-emerald-300 font-black text-sm">5. الإيرادات (Revenues)</span>
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-[11px]">الزيادة = دائن (Cr)</div>
                  <div className="p-1.5 rounded-lg bg-red-500/20 text-red-300 text-[11px]">النقص = مدين (Dr)</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-xs font-bold text-purple-200 flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-amber-400 shrink-0" />
                <span>
                  شرح المعاملة الحالية: <b>{selectedGuidedScenario.explanation}</b>
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setWizardStep(2)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>السابق</span>
                </button>

                <button
                  onClick={() => setWizardStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-lg flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span>الانتقال للخطوة 4: القيد النهائي وتجربته</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 CONTENT */}
          {wizardStep === 4 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-black">
                  4
                </div>
                <div>
                  <h3 className="text-base font-black text-white">الخطوة الرابعة: الصورة الرسمية النهائية للقيد المحاسبي</h3>
                  <p className="text-xs text-slate-300">هذا هو الشكل المستندي المحاسبي النهائي الذي يتم ترحيله في دفتر اليومية العامة أو نظام ERP.</p>
                </div>
              </div>

              {/* FINAL VOUCHER PRESENTATION */}
              <div className="bg-[#040814] p-6 rounded-2xl border border-purple-500/40 space-y-4 shadow-2xl relative">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-black text-purple-300">قيد يومية رقم #JV-2026-LEARN</span>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                    متوازن 100% ✓
                  </span>
                </div>

                <div className="space-y-2 text-sm font-bold font-mono">
                  <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 flex items-center justify-between">
                    <div>
                      <span className="text-cyan-400 font-black ml-2">[من حـ/]</span>
                      <span>{selectedGuidedScenario.debitAcc}</span>
                    </div>
                    <span className="text-base font-black">{selectedGuidedScenario.amount.toLocaleString()} ج.م (مدين)</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 flex items-center justify-between mr-6">
                    <div>
                      <span className="text-emerald-400 font-black ml-2">[إلى حـ/]</span>
                      <span>{selectedGuidedScenario.creditAcc}</span>
                    </div>
                    <span className="text-base font-black">{selectedGuidedScenario.amount.toLocaleString()} ج.م (دائن)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 text-xs text-slate-300 font-bold">
                  <b>البيان / الشرح:</b> {selectedGuidedScenario.story}
                </div>
              </div>

              {/* ACTION BUTTON TO TRY IN JOURNAL */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-right">
                  <h4 className="text-sm font-black text-white">هل تريد تطبيق هذا القيد عملياً الآن؟</h4>
                  <p className="text-xs text-slate-300">اضغط الزر لتحميل الحسابات والمبالغ فورياً في معمل اليومية للتأكد من توازنه وتجربته بنفسك.</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      if (onLoadPresetToJournal) {
                        onLoadPresetToJournal(
                          selectedGuidedScenario.debitAcc,
                          selectedGuidedScenario.creditAcc,
                          selectedGuidedScenario.amount,
                          selectedGuidedScenario.story
                        );
                      }
                    }}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-xl shadow-emerald-600/30 flex items-center gap-2 cursor-pointer transition-all border border-emerald-400/40"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>تطبيق القيد في المحاكي الآن</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-start">
                <button
                  onClick={() => setWizardStep(3)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>السابق</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 2: SCENARIO PRACTICE LIBRARY */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "scenarios" && (
        <div className="bg-[#080d1e] p-6 rounded-3xl border border-white/10 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-black text-white">مكتبة التمارين المحاسبية والعمليات الشائعة</h3>
              <p className="text-xs text-slate-300">6 أمثلة تطبيقية تفكك المعاملات المالية الأكثر تكراراً في الشركات.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GUIDED_SCENARIOS.map((sc) => (
              <div key={sc.id} className="bg-[#0c142c] p-5 rounded-2xl border border-white/10 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black">
                      {sc.category}
                    </span>
                    <span className="text-xs font-black text-cyan-400 font-mono">
                      {sc.amount.toLocaleString()} ج.م
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-white">{sc.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">"{sc.story}"</p>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs font-mono space-y-1">
                    <div className="text-cyan-300">من حـ/ {sc.debitAcc}</div>
                    <div className="text-emerald-300 mr-4">إلى حـ/ {sc.creditAcc}</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedGuidedScenario(sc);
                    setActiveTab("wizard");
                    setWizardStep(4);
                  }}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-purple-600/30 text-purple-200 border border-purple-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>عرض التحليل التفصيلي للسيناريو</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 3: ACCOUNT CLASSIFICATION DICTIONARY (CHART OF ACCOUNTS) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "dictionary" && (
        <div className="bg-[#080d1e] p-6 rounded-3xl border border-white/10 space-y-6">
          {/* HEADER & SEARCH BAR */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  الدليل المحاسبي الموحد COA
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {filteredDictionary.length} حساب من إجمالي {ACCOUNTS_DICTIONARY.length}
                </span>
              </div>
              <h3 className="text-xl font-black text-white">مستكشف دليل الحسابات الموحد وقواعد القيد المزدوج</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                تصفح شجرة ودليل الحسابات للتعرف فورياً على الرمز، الطبيعة (مدين/دائن)، القائمة المالية، وقواعد الزيادة والنقصان لكل حساب.
              </p>
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث بالرمز (1101) أو الاسم (البنك، العملاء)..."
                className="w-full bg-[#10182b] border border-white/10 rounded-2xl pr-10 pl-8 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-cyan-400 placeholder:text-slate-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute left-3 top-3 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* FILTERS & STATS RIBBON */}
          <div className="space-y-3">
            {/* CATEGORY TABS */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-black text-slate-400 shrink-0 ml-1 flex items-center gap-1">
                <Filter className="w-3 h-3 text-cyan-400" />
                التصنيف:
              </span>
              {[
                { id: "الكل", label: "الكل (جميع الحسابات)" },
                { id: "أصول متداولة", label: "🏢 أصول متداولة (1100)" },
                { id: "أصول غير متداولة", label: "🏗️ أصول غير متداولة (1200)" },
                { id: "خصوم متداولة", label: "💳 خصوم متداولة (2100)" },
                { id: "خصوم غير متداولة", label: "🏦 خصوم غير متداولة (2200)" },
                { id: "حقوق ملكية", label: "⚖️ حقوق ملكية (3100)" },
                { id: "إيرادات", label: "💰 إيرادات (4100)" },
                { id: "مصروفات", label: "💸 مصروفات وتكاليف (5100/5200)" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                    selectedCategoryFilter === cat.id
                      ? "bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-md shadow-cyan-500/10 font-black"
                      : "bg-[#0b1328] text-slate-400 border-white/10 hover:border-white/20 hover:text-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* NATURE TABS */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-slate-400 shrink-0 flex items-center gap-1">
                <Tag className="w-3 h-3 text-purple-400" />
                طبيعة الحساب:
              </span>
              {[
                { id: "الكل", label: "الكل" },
                { id: "مدين", label: "🟢 حسابات مدينة (Debit)" },
                { id: "دائن", label: "🔴 حسابات دائنة (Credit)" }
              ].map((nat) => (
                <button
                  key={nat.id}
                  onClick={() => setSelectedNatureFilter(nat.id)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                    selectedNatureFilter === nat.id
                      ? "bg-purple-600/30 text-purple-200 border-purple-400/50 font-black"
                      : "bg-white/5 text-slate-400 border-white/10 hover:text-white"
                  }`}
                >
                  {nat.label}
                </button>
              ))}
            </div>
          </div>

          {/* ACCOUNTS GRID */}
          {filteredDictionary.length === 0 ? (
            <div className="bg-[#0b1328] p-8 rounded-2xl border border-white/10 text-center space-y-2">
              <HelpCircle className="w-10 h-10 text-slate-500 mx-auto" />
              <h4 className="text-sm font-bold text-slate-300">لم نجد حسابات مطابقة للبحث أو التصفية</h4>
              <p className="text-xs text-slate-400">جرب البحث بكلمة مختلفة مثل "بنك"، "عملاء"، "مشتريات"، أو قم بإعادة ضبط الفلاتر.</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategoryFilter("الكل");
                  setSelectedNatureFilter("الكل");
                }}
                className="mt-2 px-4 py-1.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/40 text-cyan-200 text-xs font-bold border border-cyan-400/30 cursor-pointer"
              >
                إعادة ضبط جميع الفلاتر
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDictionary.map((acc) => {
                const isDebit = acc.nature.includes("مدين");
                const isCopied = copiedCode === acc.code;

                return (
                  <div
                    key={acc.code}
                    className="bg-[#0b1328] p-5 rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all space-y-3.5 group relative"
                  >
                    {/* ACCOUNT TOP ROW */}
                    <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-xs font-black font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                            {acc.code}
                          </span>
                          <span className="text-sm font-black text-white group-hover:text-cyan-200 transition-colors">
                            {acc.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-300 font-bold">
                          <span className="px-2 py-0.5 rounded bg-white/5 text-purple-300 border border-white/10">
                            {acc.type}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                            {acc.statement}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-black border ${
                            isDebit
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                              : "bg-rose-500/20 text-rose-300 border-rose-500/30"
                          }`}
                        >
                          {acc.nature}
                        </span>

                        <button
                          onClick={() => copyToClipboard(`${acc.code} - ${acc.name}`, acc.code)}
                          title="نسخ رمز واسم الحساب"
                          className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-[10px] font-bold border border-white/10 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{isCopied ? "تم النسخ!" : "نسخ الكود"}</span>
                        </button>
                      </div>
                    </div>

                    {/* DEBIT / CREDIT RULES */}
                    <div className="space-y-2 text-xs font-medium">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 leading-relaxed">
                        <b className="font-black text-emerald-300">متى يكون مديناً (Dr)؟</b>
                        <p className="mt-0.5 text-slate-200">{acc.whenDebit}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 leading-relaxed">
                        <b className="font-black text-rose-300">متى يكون دائناً (Cr)؟</b>
                        <p className="mt-0.5 text-slate-200">{acc.whenCredit}</p>
                      </div>
                    </div>

                    {/* PRACTICAL EXAMPLE */}
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-300 font-mono leading-relaxed flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <b className="text-amber-300 font-sans">مثال تطبيقي:</b> {acc.example}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 4: KNOWLEDGE QUIZ */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "quiz" && (
        <div className="bg-[#080d1e] p-6 rounded-3xl border border-white/10 space-y-6">
          {!quizFinished ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs text-purple-300 font-black">اختبار قياس الاستيعاب المحاسبي السريع</span>
                  <h3 className="text-base font-black text-white">
                    السؤال {currentQuizIdx + 1} من {KNOWLEDGE_QUIZ.length}
                  </h3>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-black">
                  النتيجة: {score} / {KNOWLEDGE_QUIZ.length}
                </div>
              </div>

              <div className="bg-[#0c142c] p-5 rounded-2xl border border-purple-500/30 space-y-4">
                <p className="text-sm font-black text-white leading-relaxed">
                  {KNOWLEDGE_QUIZ[currentQuizIdx].question}
                </p>

                <div className="space-y-2">
                  {KNOWLEDGE_QUIZ[currentQuizIdx].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={selectedOptionIdx !== null}
                      className={`w-full p-4 rounded-xl text-right text-xs font-bold border transition-all cursor-pointer flex items-center justify-between ${
                        selectedOptionIdx === null
                          ? "bg-white/5 border-white/10 text-slate-200 hover:bg-white/10"
                          : selectedOptionIdx === idx
                          ? opt.isCorrect
                            ? "bg-emerald-600/30 border-emerald-400 text-emerald-200 font-black"
                            : "bg-red-600/30 border-red-400 text-red-200 font-black"
                          : opt.isCorrect
                          ? "bg-emerald-600/20 border-emerald-500/50 text-emerald-300"
                          : "bg-white/5 border-white/5 text-slate-500 opacity-50"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {selectedOptionIdx === idx && (
                        <span>{opt.isCorrect ? "✓ صحيح" : "❌ غير صحيح"}</span>
                      )}
                    </button>
                  ))}
                </div>

                {selectedOptionIdx !== null && (
                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs font-bold text-purple-200 animate-fadeIn">
                    {KNOWLEDGE_QUIZ[currentQuizIdx].options[selectedOptionIdx].reason}
                  </div>
                )}
              </div>

              {selectedOptionIdx !== null && (
                <div className="flex justify-end">
                  <button
                    onClick={handleNextQuiz}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-lg flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <span>
                      {currentQuizIdx + 1 < KNOWLEDGE_QUIZ.length ? "السؤال التالي" : "مشاهدة التقييم النهائي"}
                    </span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-4 animate-fadeIn">
              <Award className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
              <h3 className="text-2xl font-black text-white">تهانينا! أكملت اختبار القيد المزدوج</h3>
              <p className="text-sm text-slate-300">
                نتيجتك هي <span className="text-emerald-400 font-black text-lg font-mono">{score} من {KNOWLEDGE_QUIZ.length}</span>
              </p>
              <div className="pt-2">
                <button
                  onClick={resetQuiz}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-lg cursor-pointer inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة الاختبار مرة أخرى</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
