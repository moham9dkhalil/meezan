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
  Play
} from "lucide-react";

interface JournalLearningGuideProps {
  onLoadPresetToJournal?: (debitAcc: string, creditAcc: string, amount: number, memo: string) => void;
  onSwitchToERPJournal?: () => void;
}

// ─────────────────────────────────────────────────────────────
// ACCOUNT DICTIONARY DATA
// ─────────────────────────────────────────────────────────────
interface AccountInfo {
  name: string;
  type: "أصول متداولة" | "أصول غير متداولة" | "خصوم متداولة" | "خصوم غير متداولة" | "حقوق ملكية" | "إيرادات" | "مصروفات";
  nature: "مدين (Dr)" | "دائن (Cr)";
  statement: string;
  whenDebit: string;
  whenCredit: string;
  example: string;
}

const ACCOUNTS_DICTIONARY: AccountInfo[] = [
  {
    name: "الصندوق / الخزينة (Cash in Hand)",
    type: "أصول متداولة",
    nature: "مدين (Dr)",
    statement: "الميزانية العمومية (المركز المالي)",
    whenDebit: "عند استلام مبالغ نقدية ودخول نقدية جديدة للخزينة (زيادة).",
    whenCredit: "عند دفع مصاريف أو سداد مبالغ نقدية من الخزينة (نقص).",
    example: "تحصيل 5,000 ج.م نقداً من عميل -> الصندوق (مدين بـ 5,000 ج.م)."
  },
  {
    name: "البنك / الحساب الجاري (Bank Account)",
    type: "أصول متداولة",
    nature: "مدين (Dr)",
    statement: "الميزانية العمومية (المركز المالي)",
    whenDebit: "عند إيداع مبالغ أو تحويلات بنكية واردة أو شيكات محصلة (زيادة).",
    whenCredit: "عند سداد تحويلات للخارج أو سحب شيكات لموردين (نقص).",
    example: "تحويل بنكي من عميل بـ 10,000 ج.م -> البنك (مدين بـ 10,000 ج.م)."
  },
  {
    name: "العملاء / المدينون (Accounts Receivable)",
    type: "أصول متداولة",
    nature: "مدين (Dr)",
    statement: "الميزانية العمومية (المركز المالي)",
    whenDebit: "عند البيع للعميل بالآجل (على الحساب) دون قبض الثمن فوراً (زيادة حقنا لدى العميل).",
    whenCredit: "عندما يقوم العميل بسداد المستحق عليه نقداً أو بالبنك (نقص المديونية).",
    example: "بيع بضاعة بالآجل لعميل بـ 8,000 ج.م -> حساب العملاء (مدين بـ 8,000 ج.م)."
  },
  {
    name: "الموردون / الدائنون (Accounts Payable)",
    type: "خصوم متداولة",
    nature: "دائن (Cr)",
    statement: "الميزانية العمومية (المركز المالي)",
    whenDebit: "عند سداد المبالغ المستحقة للمورد وتصفية دينه (نقص الالتزام علينا).",
    whenCredit: "عند الشراء من المورد بالآجل وعدم الدفع فوراً (زيادة الالتزام علينا).",
    example: "شراء بضاعة بالآجل من مورد بـ 15,000 ج.م -> حساب الموردين (دائن بـ 15,000 ج.م)."
  },
  {
    name: "المبيعات / إيراد النشاط (Sales Revenue)",
    type: "إيرادات",
    nature: "دائن (Cr)",
    statement: "قائمة الدخل (الأرباح والخسائر)",
    whenDebit: "عند إقفال الحساب نهاية السنة أو إرجاع مبيعات (مردودات مبيعات).",
    whenCredit: "عند تحقيق عمليات بيع بضاعة أو تقديم خدمة للعملاء (زيادة الإيراد).",
    example: "بيع بضاعة بمبلغ 20,000 ج.م -> المبيعات (دائن بـ 20,000 ج.م)."
  },
  {
    name: "المشتريات / المخزون (Purchases / Inventory)",
    type: "أصول متداولة",
    nature: "مدين (Dr)",
    statement: "قائمة الدخل / الميزانية",
    whenDebit: "عند شراء بضاعة بغرض إعادة بيعها (زيادة المخزون).",
    whenCredit: "عند إرجاع بضاعة للمورد (مردودات مشتريات) أو إقفال الحساب.",
    example: "شراء مخزون بضاعة بـ 12,000 ج.م -> المشتريات/المخزون (مدين بـ 12,000 ج.م)."
  },
  {
    name: "رأس المال (Capital)",
    type: "حقوق ملكية",
    nature: "دائن (Cr)",
    statement: "الميزانية العمومية (المركز المالي)",
    whenDebit: "عند تخفيض رأس المال أو إقفال تصفية النشاط.",
    whenCredit: "عند تأسيس الشركة أو زيادة ضخ استثمارات إضافية من المالك.",
    example: "بدء النشاط بضخ 100,000 ج.م في البنك -> رأس المال (دائن بـ 100,000 ج.م)."
  },
  {
    name: "مصروف الإيجار / الكهرباء / الرواتب (Expenses)",
    type: "مصروفات",
    nature: "مدين (Dr)",
    statement: "قائمة الدخل (الأرباح والخسائر)",
    whenDebit: "عند استحقاق أو تكبد المصروف واستفادة الشركة من الخدمة (زيادة المصروف).",
    whenCredit: "عند إقفال الحسابات نهاية الفترة المالية في حساب الأرباح والخسائر.",
    example: "دفع إيجار المقر 4,000 ج.م بشيك -> مصروف الإيجار (مدين بـ 4,000 ج.م)."
  },
  {
    name: "الأصول الثابتة - آلات / سيارات / أثاث (Fixed Assets)",
    type: "أصول غير متداولة",
    nature: "مدين (Dr)",
    statement: "الميزانية العمومية (المركز المالي)",
    whenDebit: "عند اقتناء وشراء أصول جديدة لاستخدامها في التشغيل.",
    whenCredit: "عند استبعاد الأصل أو بيعه أو تكهينه.",
    example: "شراء أجهزة كمبيوتر للمكتب بـ 30,000 ج.م -> حـ/ الأجهزة والمعدات (مدين)."
  },
  {
    name: "مجمع الإهلاك (Accumulated Depreciation)",
    type: "أصول غير متداولة",
    nature: "دائن (Cr)",
    statement: "الميزانية العمومية (حساب مقابل للأصل)",
    whenDebit: "عند استبعاد الأصل المباع وتصفية حسابه.",
    whenCredit: "عند إثبات الإهلاك الدوري السنوي أو الشهري للأصل.",
    example: "إثبات إهلاك سنوي للسيارات 5,000 ج.م -> مجمع إهلاك السيارات (دائن)."
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
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedGuidedScenario, setSelectedGuidedScenario] = useState<GuidedScenario>(GUIDED_SCENARIOS[0]);

  // Quiz State
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const filteredDictionary = ACCOUNTS_DICTIONARY.filter(
    (acc) =>
      acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.nature.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      {/* TAB 3: ACCOUNT CLASSIFICATION DICTIONARY */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "dictionary" && (
        <div className="bg-[#080d1e] p-6 rounded-3xl border border-white/10 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-black text-white">مستكشف دليل الحسابات وقواعد الاختيار ("أي حساب أختار؟")</h3>
              <p className="text-xs text-slate-300">ابحث عن أي حساب لتعرف فورياً تصنيفه في القوائم وطبيعته ومتى يكون مديناً أو دائناً.</p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث باسم الحساب (مثل البنك، العملاء)..."
                className="w-full bg-[#10182b] border border-white/10 rounded-2xl pr-10 pl-4 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDictionary.map((acc, idx) => (
              <div key={idx} className="bg-[#0b1328] p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-sm font-black text-white">{acc.name}</span>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {acc.nature}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-300 font-bold">
                  <span className="px-2 py-0.5 rounded bg-white/5 text-purple-300 border border-white/10">{acc.type}</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">{acc.statement}</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 font-medium">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200">
                    <b>متى يكون مديناً (Dr)؟</b> {acc.whenDebit}
                  </div>
                  <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200">
                    <b>متى يكون دائناً (Cr)؟</b> {acc.whenCredit}
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-white/5 text-[11px] text-slate-400 font-mono">
                  <b>مثال:</b> {acc.example}
                </div>
              </div>
            ))}
          </div>
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
