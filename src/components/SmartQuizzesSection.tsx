import React, { useState, useMemo, useEffect } from "react";
import { STAGES_DATA } from "../data/curriculum";
import { Stage, QuizQuestion } from "../types";
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Zap,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ChevronLeft,
  Flame,
  Brain,
  Target,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Clock,
  ShieldCheck,
  Check,
  Layers,
  GraduationCap,
  ListFilter,
  RefreshCw,
  Share2,
  Trophy,
  Scale
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// TYPES FOR QUIZ & FEEDBACK
// ─────────────────────────────────────────────────────────────
export interface StageQuizQuestion extends QuizQuestion {
  id: string;
  stageId: number;
  stageTitle: string;
  topicTag: string; // e.g. "القيد المزدوج", "معايير IFRS", "التسويات الجردية", "الضرائب والزكاة"
  difficulty: "سهل" | "متوسط" | "متقدم";
}

export interface QuizResultHistory {
  id: string;
  date: string;
  stageId: number;
  stageTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpentSeconds: number;
  xpEarned: number;
  wrongTopicTags: string[];
}

interface SmartQuizzesSectionProps {
  onAwardXp?: (amount: number, title: string, message: string) => void;
  onSelectTab?: (tab: string) => void;
  onOpenStage?: (stageId: number) => void;
}

// ─────────────────────────────────────────────────────────────
// RICH QUESTION BANK FOR STAGES & COMPREHENSIVE QUIZZES
// ─────────────────────────────────────────────────────────────
const COMPREHENSIVE_QUESTION_BANK: StageQuizQuestion[] = [
  // Stage 1: أساسيات المحاسبة والقيد المزدوج
  {
    id: "q-101",
    stageId: 1,
    stageTitle: "المرحلة 1: أساسيات المحاسبة والقيد المزدوج",
    topicTag: "طبيعة الحسابات والقيد المزدوج",
    difficulty: "سهل",
    q: "أي من الحسابات التالية يُعتبر حسابه ذو طبيعة مدينة افتراضياً (Debit Balance)؟",
    opts: ["حساب الأصول الثابتة والمصروفات", "حساب رأس المال والالتزامات", "حساب إيراد المبيعات", "حساب القروض الدائنة"],
    ans: 0,
    exp: "الأصول بجميع أنواعها والمصروفات ذات طبيعة مدينة، حيث تزيد بالطرف المدين وتقل بالطرف الدائن."
  },
  {
    id: "q-102",
    stageId: 1,
    stageTitle: "المرحلة 1: أساسيات المحاسبة والقيد المزدوج",
    topicTag: "معادلة الميزانية",
    difficulty: "سهل",
    q: "إذا بلغت إجمالي أصول الشركة 500,000 ج.م وإجمالي الخصوم 200,000 ج.م، فكم تبلغ حقوق الملكية؟",
    opts: ["300,000 ج.م", "700,000 ج.م", "200,000 ج.م", "500,000 ج.م"],
    ans: 0,
    exp: "وفق المعادلة المحاسبية الأساسية: الأصول = الخصوم + حقوق الملكية. وبالتالي: حقوق الملكية = 500,000 - 200,000 = 300,000 ج.م."
  },
  {
    id: "q-103",
    stageId: 1,
    stageTitle: "المرحلة 1: أساسيات المحاسبة والقيد المزدوج",
    topicTag: "القيود المحاسبية",
    difficulty: "متوسط",
    q: "تم شراء آلة جديدة بمبلغ 80,000 ج.م، تم سداد 30,000 ج.م نقداً والباقي بالأجل على الحساب. ما القيد الصحيح؟",
    opts: [
      "من حـ/ الآلات (80,000) إلى مذكورين: حـ/ النقدية (30,000) وحـ/ الموردين (50,000)",
      "من حـ/ النقدية (80,000) إلى حـ/ الآلات (80,000)",
      "من حـ/ الموردين (50,000) إلى حـ/ الآلات (50,000)",
      "من حـ/ الآلات (30,000) إلى حـ/ النقدية (30,000)"
    ],
    ans: 0,
    exp: "القيد المركب ينص على جعل الآلة مدينة بإجمالي القيمة (80,000)، والنقدية دائنة بالنقص الفعلي (30,000) وحساب الموردين دائن بالالتزام المتبقي (50,000)."
  },

  // Stage 2: التسويات الجردية ومبدأ الاستحقاق
  {
    id: "q-201",
    stageId: 2,
    stageTitle: "المرحلة 2: التسويات الجردية ومبدأ الاستحقاق",
    topicTag: "مبدأ الاستحقاق",
    difficulty: "متوسط",
    q: "قامت الشركة بدفع قيمة إيجار سنوي مقدم مقداره 24,000 ج.م بتاريخ 1 أكتوبر. كم يبلغ مصروف الإيجار في قائمة الدخل المنتهية بـ 31 ديسمبر؟",
    opts: ["6,000 ج.م", "24,000 ج.م", "18,000 ج.م", "12,000 ج.م"],
    ans: 0,
    exp: "المبلغ الإيجاري الشهري = 24,000 ÷ 12 = 2,000 ج.م. الفترة المستفادة من أكتوبر حتى ديسمبر هي 3 أشهر (3 × 2,000 = 6,000 ج.م) والباقي 18,000 يعتبر إيجار مقدم بالميزانية."
  },
  {
    id: "q-202",
    stageId: 2,
    stageTitle: "المرحلة 2: التسويات الجردية ومبدأ الاستحقاق",
    topicTag: "التسويات الجردية",
    difficulty: "متوسط",
    q: "ما القيد المحاسبي اللازم لتسجيل الأجور المستحقة للعاملين عن شهر ديسمبر ولم تُدفع بعد؟",
    opts: [
      "من حـ/ مصروف الأجور إلى حـ/ الأجور المستحقة",
      "من حـ/ الأجور المستحقة إلى حـ/ النقدية",
      "من حـ/ النقدية إلى حـ/ مصروف الأجور",
      "من حـ/ الأجور المستحقة إلى حـ/ أرباح وخسائر"
    ],
    ans: 0,
    exp: "يتم تحميل الفترة بمصروف الأجور (مدين) مقابل إثبات التزام بالأجور المستحقة (دائن) طبقاً لمبدأ الاستحقاق."
  },

  // Stage 3: إهلاك الأصول الثابتة
  {
    id: "q-301",
    stageId: 3,
    stageTitle: "المرحلة 3: إهلاك الأصول الثابتة IAS 16",
    topicTag: "معيار IAS 16 والإهلاك",
    difficulty: "متوسط",
    q: "سيارة تكلفتها 120,000 ج.م، وقيمتها التخريدية المقدرة 20,000 ج.م وعمرها الإنتاجي 5 سنوات. كم يبلغ الإهلاك السنوي بطريقة القسط الثابت؟",
    opts: ["20,000 ج.م", "24,000 ج.م", "100,000 ج.م", "15,000 ج.م"],
    ans: 0,
    exp: "قسط الإهلاك = (التكلفة - الخردة) ÷ العمر الإنتاجي = (120,000 - 20,000) ÷ 5 = 20,000 ج.م سنوياً."
  },
  {
    id: "q-302",
    stageId: 3,
    stageTitle: "المرحلة 3: إهلاك الأصول الثابتة IAS 16",
    topicTag: "مجمع الإهلاك والقيمة الدفترية",
    difficulty: "متقدم",
    q: "أين يُعرض حساب 'مجمع إهلاك الآلات' بالقوائم المالية وما هي طبيعته؟",
    opts: [
      "حساب أصل عكسي (Contra Asset) يظهر مطروحاً من تكلفة الأصل بالميزانية",
      "مصروف يظهر بقائمة الدخل مباشرة",
      "التزام متداول يظهر بالخصوم",
      "حق ملكية يضاف لرأس المال"
    ],
    ans: 0,
    exp: "مجمع الإهلاك هو حساب تقييم ذات طبيعة دائنة يُعرض مطروحاً من تكلفة الأصل بالمركز المالي للوصول للقيمة الدفترية الصافية."
  },

  // Stage 4: القوائم المالية والمعايير الدولية
  {
    id: "q-401",
    stageId: 4,
    stageTitle: "المرحلة 4: القوائم المالية والمعايير الدولية IFRS",
    topicTag: "قائمة التدفقات النقدية IAS 7",
    difficulty: "متقدم",
    q: "أي من المعاملات التالية تُصنف ضمن التدفقات النقدية من الأنشطة الاستثمارية بقائمة التدفقات؟",
    opts: [
      "شراء مبنى إداري جديد أو بيع آلات قديمة",
      "سداد توزيعات الأرباح على المساهمين",
      "تحصيل مبيعات النقدية من العملاء",
      "دفع أجور ومصروفات الصيانة"
    ],
    ans: 0,
    exp: "الأنشطة الاستثمارية تشمل تدفقات شراء أو بيع الأصول غير المتداولة (الثابتة والملموسة/غير الملموسة) والاستثمارات طويلة الأجل."
  },
  {
    id: "q-402",
    stageId: 4,
    stageTitle: "المرحلة 4: القوائم المالية والمعايير الدولية IFRS",
    topicTag: "معايير الإيرادات IFRS 15",
    difficulty: "متقدم",
    q: "ما هو الشرط الأساسي للاعتراف بالإيراد وفق معيار IFRS 15 للعملاء؟",
    opts: [
      "وفاء المنشأة بالتزام الأداء ونقل السيطرة على السلعة أو الخدمة للعميل",
      "التحصيل النقدي الفعلي في حسابات الشركة بالبنك",
      "توقيع العقد المبدئي مع العميل",
      "شراء المواد الخام الخاصة بالطلب"
    ],
    ans: 0,
    exp: "معيار IFRS 15 يعتمد على النموذج الخماسي، حيث يُعترف بالإيراد عند انتقال السيطرة (Control Transfer) والوفاء بالتزام الأداء."
  },

  // Stage 5: التكاليف ونقطة التعادل
  {
    id: "q-501",
    stageId: 5,
    stageTitle: "المرحلة 5: محاسبة التكاليف والتحليل المالي",
    topicTag: "نقطة التعادل والتكاليف",
    difficulty: "متوسط",
    q: "إذا كانت التكاليف الثابتة للشركة 100,000 ج.م، وسعر بيع الوحدة 50 ج.م، والتكلفة المتغيرة للوحدة 30 ج.م، فما كمية مبيعات التعادل؟",
    opts: ["5,000 وحدة", "2,000 وحدة", "3,333 وحدة", "10,000 وحدة"],
    ans: 0,
    exp: "هامش المساهمة للوحدة = 50 - 30 = 20 ج.م. نقطة التعادل بالوحدات = التكاليف الثابتة ÷ هامش المساهمة = 100,000 ÷ 20 = 5,000 وحدة."
  },
  {
    id: "q-502",
    stageId: 5,
    stageTitle: "المرحلة 5: محاسبة التكاليف والتحليل المالي",
    topicTag: "التحليل المالي والنسب",
    difficulty: "متقدم",
    q: "ماذا تعني زيادة نسبة التداول (Current Ratio) عن 2:1 في التحليل المالي للسيولة؟",
    opts: [
      "قدرة عالية للشركة على سداد التزاماتها قصيرة الأجل من أصولها المتداولة",
      "وجود عجز مالي خطر بالسيولة",
      "انخفاض المبيعات وارتفاع المصاريف",
      "زيادة القروض طويلة الأجل"
    ],
    ans: 0,
    exp: "نسبة التداول = الأصول المتداولة ÷ الخصوم المتداولة. وصولها لـ 2:1 يعني أن الأصول المتداولة تغطي الالتزامات القريبة مرتين مما يعزز أمان السيولة."
  },

  // Stage 6: المحاسبة الضريبية والزكاة
  {
    id: "q-601",
    stageId: 6,
    stageTitle: "المرحلة 6: المحاسبة الضريبية والزكاة الشرعية",
    topicTag: "ضريبة القيمة المضافة VAT",
    difficulty: "متوسط",
    q: "شركة اشترت بضاعة بمبلغ 100,000 ج.م وباعت بضاعة بمبلغ 150,000 ج.م (بخلاف ضريبة 15%). كم صافي الضريبة الواجب توريدها للهيئة؟",
    opts: ["7,500 ج.م", "22,500 ج.م", "15,000 ج.م", "5,000 ج.م"],
    ans: 0,
    exp: "ضريبة المخرجات (المبيعات) = 150,000 × 15% = 22,500 ج.م. ضريبة المدخلات (المشتريات) = 100,000 × 15% = 15,000 ج.م. الصافي الواجب التوريد = 22,500 - 15,000 = 7,500 ج.م."
  }
];

// Helper to construct questions for any given stage ID dynamically if not explicitly in bank
function generateStageQuestions(stage: Stage): StageQuizQuestion[] {
  const custom = COMPREHENSIVE_QUESTION_BANK.filter((q) => q.stageId === stage.id);
  if (custom.length >= 3) return custom;

  // Generate customized questions based on stage curriculum title & lessons
  const generated: StageQuizQuestion[] = [
    {
      id: `gen-${stage.id}-1`,
      stageId: stage.id,
      stageTitle: `المرحلة ${stage.id}: ${stage.name}`,
      topicTag: `الإطار العام لـ ${stage.name}`,
      difficulty: "متوسط",
      q: `ما هو الهدف الأساسي والتطبيق المحاسبي المباشر لموضوع (${stage.name})؟`,
      opts: [
        `ضمان إثبات المعاملات بدقة وتحقيق العرض العادل للقوائم المالية وفق المعايير`,
        `زيادة الأرباح الدفترية دون سندات أو فواتير رسمية`,
        `تأجيل تسجيل المصروفات للسنوات القادمة بصورة عشوائية`,
        `الغاء إعداد ميزان المراجعة ودفتر الأستاذ العام`
      ],
      ans: 0,
      exp: `الموضوع الرئيسية للمرحلة (${stage.name}) يهدف لإثبات العمليات بشكل منتظم ودقيق بما يتوافق مع مبادئ الإفصاح والشفافية المحاسبية.`
    },
    {
      id: `gen-${stage.id}-2`,
      stageId: stage.id,
      stageTitle: `المرحلة ${stage.id}: ${stage.name}`,
      topicTag: `التوجيه المحاسبي والمعالجة القياسية`,
      difficulty: "متوسط",
      q: `عند إثبات وتسجيل حركة مالية تتعلق بـ (${stage.name})، ما الركيزة الأساسية للتوجيه المحاسبي الصحيح؟`,
      opts: [
        `تحديد الحساب المدين والحساب الدائن بموجب سند رسمي ومطابقة القيد المزدوج`,
        `تسجيل المعاملة في نهاية العام فقط دون قيود يومية`,
        `الاعتماد على التقدير الشخصي الشفاهي دون وثائق`,
        `خصم المبلغ مباشرة من حقوق الملكية دون إثبات الأصول أو الخصوم`
      ],
      ans: 0,
      exp: `الركيزة الأساسية في المحاسبة المالية هي توثيق المعاملات بسند رسمي وتطبيق قيد اليومية المتوازن (إجمالي المدين = إجمالي الدائن).`
    },
    {
      id: `gen-${stage.id}-3`,
      stageId: stage.id,
      stageTitle: `المرحلة ${stage.id}: ${stage.name}`,
      topicTag: `الرقابة والتسويات الجردية`,
      difficulty: "متقدم",
      q: `كيف تؤثر التسويات والرقابة الدورية في (${stage.name}) على صحة القوائم المالية؟`,
      opts: [
        `تمنع تضخيم الإيرادات أو المصروفات وتضمن إدراج المستحقات والمقدمات بالفترة المناسبة`,
        `تؤدي لإلغاء القوائم المالية وتحويلها إلى تقارير غير معتمدة`,
        `تمنع سداد الضرائب والالتزامات المستحقة`,
        `تزيد التكاليف دون إضافة فائدة رقابية`
      ],
      ans: 0,
      exp: `التسويات الجردية والرقابة المستمرة تضمن تطبيق مبدأ الاستحقاق واستقلال الفترات المالية بشكل محايد وسليم.`
    }
  ];

  return [...custom, ...generated];
}

export function SmartQuizzesSection({
  onAwardXp,
  onSelectTab,
  onOpenStage
}: SmartQuizzesSectionProps) {
  // ─────────────────────────────────────────────────────────────
  // STATES
  // ─────────────────────────────────────────────────────────────
  const [activeSubTab, setActiveSubTab] = useState<"QUIZ" | "WEAKNESS_DASHBOARD" | "HISTORY">("QUIZ");
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<number>(0); // 0 = ALL
  const [selectedStageId, setSelectedStageId] = useState<number>(1);
  const [quizMode, setQuizMode] = useState<"STAGE" | "COMPREHENSIVE" | "WEAKNESS_TARGETED">("STAGE");

  // Quiz execution states
  const [quizQuestions, setQuizQuestions] = useState<StageQuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [quizActive, setQuizActive] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [showExplanationModal, setShowExplanationModal] = useState<StageQuizQuestion | null>(null);

  // Weaknesses state saved in localStorage
  const [weakTopics, setWeakTopics] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem("meezan_quiz_weakness_topics");
      return saved ? JSON.parse(saved) : { "التسويات الجردية": 2, "معايير IFRS": 1, "القيد المزدوج": 1 };
    } catch {
      return { "التسويات الجردية": 2, "معايير IFRS": 1 };
    }
  });

  // Quiz history state
  const [quizHistory, setQuizHistory] = useState<QuizResultHistory[]>(() => {
    try {
      const saved = localStorage.getItem("meezan_quiz_history_logs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ─────────────────────────────────────────────────────────────
  // TIMER EFFECT
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Save weaknesses and history
  const saveWeakTopicsToStorage = (updated: Record<string, number>) => {
    setWeakTopics(updated);
    try {
      localStorage.setItem("meezan_quiz_weakness_topics", JSON.stringify(updated));
    } catch {}
  };

  const saveHistoryToStorage = (newLog: QuizResultHistory) => {
    const updated = [newLog, ...quizHistory];
    setQuizHistory(updated);
    try {
      localStorage.setItem("meezan_quiz_history_logs", JSON.stringify(updated));
    } catch {}
  };

  // ─────────────────────────────────────────────────────────────
  // START QUIZ HANDLER
  // ─────────────────────────────────────────────────────────────
  const handleStartQuiz = (mode: "STAGE" | "COMPREHENSIVE" | "WEAKNESS_TARGETED", stageIdParam?: number) => {
    const targetStageId = stageIdParam || selectedStageId;
    setQuizMode(mode);
    setCurrentQIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setTimerSeconds(0);
    setIsTimerRunning(true);

    let questionsToUse: StageQuizQuestion[] = [];

    if (mode === "STAGE") {
      const stg = STAGES_DATA.find((s) => s.id === targetStageId) || STAGES_DATA[0];
      questionsToUse = generateStageQuestions(stg);
    } else if (mode === "COMPREHENSIVE") {
      // Pick random 10 questions across all question bank or stages
      questionsToUse = [...COMPREHENSIVE_QUESTION_BANK].sort(() => 0.5 - Math.random()).slice(0, 10);
      if (questionsToUse.length < 5) {
        // Fallback fill from stages
        STAGES_DATA.slice(0, 5).forEach((stg) => {
          questionsToUse.push(...generateStageQuestions(stg));
        });
        questionsToUse = questionsToUse.slice(0, 10);
      }
    } else if (mode === "WEAKNESS_TARGETED") {
      // Pick questions corresponding to user's registered weak topic tags
      const weakTags = Object.keys(weakTopics);
      questionsToUse = COMPREHENSIVE_QUESTION_BANK.filter((q) => weakTags.includes(q.topicTag));
      if (questionsToUse.length < 4) {
        // Fill from stage 1-5
        STAGES_DATA.slice(0, 3).forEach((stg) => {
          questionsToUse.push(...generateStageQuestions(stg));
        });
      }
      questionsToUse = questionsToUse.slice(0, 8);
    }

    setQuizQuestions(questionsToUse);
    setQuizActive(true);
  };

  // Answer Selection
  const handleSelectAnswer = (qIndex: number, optionIndex: number) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [qIndex]: optionIndex
    }));
  };

  // Submit Quiz Calculation & Instant Feedback Analysis
  const handleSubmitQuiz = () => {
    setIsTimerRunning(false);
    setIsSubmitted(true);

    let correctCount = 0;
    const wrongTags: string[] = [];

    quizQuestions.forEach((q, idx) => {
      const uAns = userAnswers[idx];
      if (uAns === q.ans) {
        correctCount++;
      } else {
        wrongTags.push(q.topicTag);
      }
    });

    const percentage = Math.round((correctCount / quizQuestions.length) * 100);
    const xpEarned = Math.round((correctCount / quizQuestions.length) * 100) + (percentage >= 80 ? 50 : 20);

    // Update Weaknesses count
    const updatedWeaknesses = { ...weakTopics };
    wrongTags.forEach((tag) => {
      updatedWeaknesses[tag] = (updatedWeaknesses[tag] || 0) + 1;
    });
    saveWeakTopicsToStorage(updatedWeaknesses);

    // Get current Stage Title
    const currentStageObj = STAGES_DATA.find((s) => s.id === selectedStageId);
    const stageTitleText = quizMode === "STAGE" ? currentStageObj?.name || `المرحلة ${selectedStageId}` : "اختبار تقييم عام";

    // Save History log
    const resultLog: QuizResultHistory = {
      id: `quiz-res-${Date.now()}`,
      date: new Date().toLocaleDateString("ar-EG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      stageId: selectedStageId,
      stageTitle: stageTitleText,
      score: correctCount,
      totalQuestions: quizQuestions.length,
      percentage,
      timeSpentSeconds: timerSeconds,
      xpEarned,
      wrongTopicTags: wrongTags
    };
    saveHistoryToStorage(resultLog);

    // Award XP globally
    if (onAwardXp) {
      onAwardXp(
        xpEarned,
        `اختبار مرحلة: ${stageTitleText}`,
        `حققت نتيجة ${percentage}% وحصلت على ${xpEarned} XP بـ قسم الاختبارات الذكية!`
      );
    }
  };

  // Filtered Stages for Stage Selection Dropdown/Grid
  const filteredStagesList = useMemo(() => {
    if (selectedLevelFilter === 0) return STAGES_DATA;
    return STAGES_DATA.filter((s) => s.level === selectedLevelFilter);
  }, [selectedLevelFilter]);

  // Current question item during quiz
  const activeQuestion = quizQuestions[currentQIndex];

  return (
    <div className="space-y-6 text-right dir-rtl animate-fadeIn">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER BANNER
         ───────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a0f24] via-[#0d1633] to-[#080c1d] border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-black shadow-lg">
              <Brain className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>نظام تقييم المستوى والتغذية الراجعة الذكية AI Feedback</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <span>🎯 قسم الاختبارات الذكية</span>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold">
                تقييم فوري + تحليل أخطاء
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              اختبر حصيلتك المحاسبية بعد كل مرحلة تعليمية، واحصل على تصحيح فوري مع تحليل دقيق لأسباب الأخطاء، ونقاط الضعف المخصصة لتعزيز فهمك للقواعد المحاسبية.
            </p>
          </div>

          {/* Overall Stats summary */}
          <div className="flex items-center gap-3 shrink-0 bg-black/50 p-4 rounded-2xl border border-white/10 text-xs font-bold shadow-xl">
            <div className="text-center px-3 border-l border-white/10">
              <span className="text-slate-400 block text-[10px]">الاختبارات المنفذة</span>
              <span className="text-emerald-400 font-black text-lg">{quizHistory.length}</span>
            </div>
            <div className="text-center px-3 border-l border-white/10">
              <span className="text-slate-400 block text-[10px]">متوسط الدقة</span>
              <span className="text-indigo-300 font-black text-lg">
                {quizHistory.length > 0
                  ? `${Math.round(quizHistory.reduce((acc, h) => acc + h.percentage, 0) / quizHistory.length)}%`
                  : "100%"}
              </span>
            </div>
            <div className="text-center px-3">
              <span className="text-slate-400 block text-[10px]">نقاط الضعف ⚠️</span>
              <span className="text-amber-400 font-black text-lg">{Object.keys(weakTopics).length}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-white/10 text-xs font-black">
          <button
            onClick={() => {
              setActiveSubTab("QUIZ");
              setQuizActive(false);
            }}
            className={`px-4 py-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === "QUIZ"
                ? "bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30"
                : "bg-white/5 text-slate-300 border-white/10 hover:text-white"
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>إجراء اختبار مرحلة</span>
          </button>

          <button
            onClick={() => setActiveSubTab("WEAKNESS_DASHBOARD")}
            className={`px-4 py-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 relative ${
              activeSubTab === "WEAKNESS_DASHBOARD"
                ? "bg-amber-600 text-white border-amber-400 shadow-lg shadow-amber-600/30"
                : "bg-white/5 text-slate-300 border-white/10 hover:text-white"
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-300" />
            <span>لوحة تحليل نقاط الضعف</span>
            {Object.keys(weakTopics).length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black">
                {Object.keys(weakTopics).length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab("HISTORY")}
            className={`px-4 py-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === "HISTORY"
                ? "bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-600/30"
                : "bg-white/5 text-slate-300 border-white/10 hover:text-white"
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>سجل النتائج السابقة</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN TAB 1: QUIZ SELECTOR OR ACTIVE QUIZ VIEW
         ───────────────────────────────────────────────────────────── */}
      {activeSubTab === "QUIZ" && !quizActive && (
        <div className="space-y-6">
          {/* Quick Quiz Modes Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mode A: Single Stage Test */}
            <div className="p-5 rounded-3xl bg-[#0c1228] border border-indigo-500/30 space-y-3 relative overflow-hidden group hover:border-indigo-400 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-black">
                🎯
              </div>
              <div>
                <h3 className="font-black text-white text-base">اختبار مرحلة تعليمية محددة</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  اختر مرحلة من 1 إلى 50 وأجرِ اختباراً مخصصاً لتقييم مدى استيعابك لمفاهيم وقواعد هذه المرحلة.
                </p>
              </div>
              <button
                onClick={() => handleStartQuiz("STAGE")}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                <span>بدء اختبار المرحلة المختارة ({selectedStageId})</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </div>

            {/* Mode B: Comprehensive Level Exam */}
            <div className="p-5 rounded-3xl bg-[#0c1228] border border-emerald-500/30 space-y-3 relative overflow-hidden group hover:border-emerald-400 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-black">
                🌐
              </div>
              <div>
                <h3 className="font-black text-white text-base">الاختبار التقييمي الشامل</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  اختبار تجميعي عشوائي من 10 أسئلة يغطي كافة جوانب المحاسبة المالية والقوائم والمعايير الدولية.
                </p>
              </div>
              <button
                onClick={() => handleStartQuiz("COMPREHENSIVE")}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <span>بدء الاختبار الشامل العام</span>
                <Zap className="w-4 h-4 text-amber-300" />
              </button>
            </div>

            {/* Mode C: Weakness Remediation Quiz */}
            <div className="p-5 rounded-3xl bg-[#0c1228] border border-amber-500/30 space-y-3 relative overflow-hidden group hover:border-amber-400 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 font-black">
                ⚡
              </div>
              <div>
                <h3 className="font-black text-white text-base">اختبار علاج نقاط الضعف</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  أسئلة مكثفة ومستهدفة خصيصاً للمواضيع والمفاهيم المحاسبية التي أخطأت بها في الاختبارات السابقة.
                </p>
              </div>
              <button
                onClick={() => handleStartQuiz("WEAKNESS_TARGETED")}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20"
              >
                <span>اختبار التعزيز والعلاج الفوري</span>
                <Sparkles className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Stage Selector Grid */}
          <div className="p-6 rounded-3xl bg-[#090e1f] border border-white/10 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <span>اختر المرحلة التعليمية للاختبار</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  حدد المرحلة التي أنهيت قراءتها لتقييم مستواك وفهمك القواعد المحاسبية
                </p>
              </div>

              {/* Level Filter Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
                <button
                  onClick={() => setSelectedLevelFilter(0)}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    selectedLevelFilter === 0
                      ? "bg-indigo-600 text-white border-indigo-400"
                      : "bg-white/5 text-slate-400 border-white/5 hover:text-white"
                  }`}
                >
                  جميع المراحل
                </button>
                <button
                  onClick={() => setSelectedLevelFilter(1)}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    selectedLevelFilter === 1
                      ? "bg-emerald-600 text-white border-emerald-400"
                      : "bg-white/5 text-slate-400 border-white/5 hover:text-white"
                  }`}
                >
                  المبتدئ 🌱
                </button>
                <button
                  onClick={() => setSelectedLevelFilter(2)}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    selectedLevelFilter === 2
                      ? "bg-blue-600 text-white border-blue-400"
                      : "bg-white/5 text-slate-400 border-white/5 hover:text-white"
                  }`}
                >
                  المتوسط 📊
                </button>
                <button
                  onClick={() => setSelectedLevelFilter(3)}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    selectedLevelFilter === 3
                      ? "bg-amber-600 text-white border-amber-400"
                      : "bg-white/5 text-slate-400 border-white/5 hover:text-white"
                  }`}
                >
                  المتقدم 🏆
                </button>
              </div>
            </div>

            {/* Stage Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredStagesList.map((stg) => {
                const isSelected = selectedStageId === stg.id;
                return (
                  <div
                    key={stg.id}
                    onClick={() => setSelectedStageId(stg.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden group ${
                      isSelected
                        ? "bg-gradient-to-br from-indigo-900/60 to-purple-900/40 border-indigo-400 shadow-xl shadow-indigo-600/20 scale-102"
                        : "bg-[#0b1022] border-white/10 hover:border-indigo-500/40 hover:bg-[#0e162d]"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xl">{stg.icon}</span>
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-slate-300 text-[10px] font-black">
                          مرحلة {stg.id}
                        </span>
                      </div>
                      <h4 className="font-black text-white text-sm group-hover:text-emerald-300 transition-colors line-clamp-1">
                        {stg.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {stg.sub}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-bold">
                      <span className="text-amber-400">+{stg.xp} XP</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStageId(stg.id);
                          handleStartQuiz("STAGE", stg.id);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span>اختبار</span>
                        <ArrowRight className="w-3 h-3 rotate-180" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. ACTIVE QUIZ INTERFACE (أثناء أداء الاختبار)
         ───────────────────────────────────────────────────────────── */}
      {activeSubTab === "QUIZ" && quizActive && activeQuestion && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#090e1f] border border-indigo-500/30 space-y-6 shadow-2xl relative">
          {/* Top Progress & Timer Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuizActive(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer text-xs font-bold"
              >
                الخروج من الاختبار ✖
              </button>
              <div>
                <span className="text-xs font-black text-indigo-400 block">{activeQuestion.stageTitle}</span>
                <span className="text-xs font-bold text-slate-400">
                  السؤال {currentQIndex + 1} من {quizQuestions.length}
                </span>
              </div>
            </div>

            {/* Timer & XP */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs font-bold text-amber-300">
                <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                <span>
                  {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, "0")}
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-xs font-black text-emerald-300">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>+100 XP أقصى مكافأة</span>
              </div>
            </div>
          </div>

          {/* Question Stepper Progress Line */}
          <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full transition-all duration-300"
              style={{ width: `${((currentQIndex + 1) / quizQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Body Card */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-black text-amber-400">
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-400/30">
                🏷️ الموضوع: {activeQuestion.topicTag}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-400/30 text-indigo-300">
                درجة الصعوبة: {activeQuestion.difficulty}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white leading-relaxed">
              {activeQuestion.q}
            </h3>

            {/* Options List */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              {activeQuestion.opts.map((opt, optIdx) => {
                const isSelected = userAnswers[currentQIndex] === optIdx;
                const isCorrect = activeQuestion.ans === optIdx;

                let optionClass = "bg-[#0e152d] border-white/10 hover:border-indigo-400 text-slate-200";

                if (isSelected) {
                  optionClass = "bg-indigo-600/40 border-indigo-400 text-white font-black shadow-lg shadow-indigo-600/20";
                }

                if (isSubmitted) {
                  if (isCorrect) {
                    optionClass = "bg-emerald-950/60 border-emerald-400 text-emerald-200 font-black";
                  } else if (isSelected && !isCorrect) {
                    optionClass = "bg-rose-950/60 border-rose-500 text-rose-200 font-black";
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectAnswer(currentQIndex, optIdx)}
                    disabled={isSubmitted}
                    className={`w-full p-4 rounded-2xl border text-right text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-between gap-3 ${optionClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center font-black text-xs shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                    {isSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Instant Explanation Box if Submitted or Requesting Explanation */}
          {isSubmitted && (
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 space-y-2 animate-fadeIn">
              <div className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>التغذية الراجعة والشرح المحاسبي العلمي:</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {activeQuestion.exp}
              </p>
            </div>
          )}

          {/* Bottom Actions Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQIndex === 0}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs disabled:opacity-30 cursor-pointer"
            >
              السابق
            </button>

            {!isSubmitted ? (
              currentQIndex < quizQuestions.length - 1 ? (
                <button
                  onClick={() => setCurrentQIndex((prev) => Math.min(quizQuestions.length - 1, prev + 1))}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>السؤال التالي</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-600/30"
                >
                  <span>تسليم ورقة الاختبار وتصحيح الإجابات 🎯</span>
                </button>
              )
            ) : (
              <button
                onClick={() => setQuizActive(false)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition-all cursor-pointer"
              >
                إنهاء وعرض تقرير النتيجة الكامل 📊
              </button>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. MAIN TAB 2: WEAKNESS ANALYSIS DASHBOARD (لوحة تحليل نقاط الضعف)
         ───────────────────────────────────────────────────────────── */}
      {activeSubTab === "WEAKNESS_DASHBOARD" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#090e1f] border border-amber-500/30 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
                <span>لوحة تحليل نقاط الضعف والتوصيات الذكية</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                تعتمد هذه اللوحة على الأخطاء التراكمية في إجاباتك السابقة لتحديد المواضيع المحاسبية التي تحتاج لتعزيز فهمك لها.
              </p>
            </div>

            <button
              onClick={() => handleStartQuiz("WEAKNESS_TARGETED")}
              className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs cursor-pointer flex items-center gap-2 shadow-lg shadow-amber-600/20 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>بدء جلسة تقوية وتدريب مكثف</span>
            </button>
          </div>

          {Object.keys(weakTopics).length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-base font-black text-white">لا توجد نقاط ضعف مسجلة حالياً! 🎉</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                أداء ممتاز، لم يتم العثور على أخطاء متكررة. قم بإجراء المزيد من الاختبارات للتقييم المستمر.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(weakTopics).map(([topic, errorCount]) => (
                  <div
                    key={topic}
                    className="p-5 rounded-2xl bg-[#0d1428] border border-amber-500/20 space-y-3 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-white text-sm flex items-center gap-2">
                        <Target className="w-4 h-4 text-amber-400" />
                        <span>{topic}</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-400/30">
                        {errorCount} أخطاء مسجلة
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      نوصي بمراجعة دروس القيد والتوجيه المحاسبي المتعلقة بـ ({topic}) والاطلاع على قاموس المحاسب الذكي لتثبيت المفاهيم.
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-bold">
                      <button
                        onClick={() => {
                          if (onSelectTab) onSelectTab("path");
                        }}
                        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                      >
                        <span>مراجعة الدروس بالمسار 📚</span>
                      </button>

                      <button
                        onClick={() => {
                          const updated = { ...weakTopics };
                          delete updated[topic];
                          saveWeakTopicsToStorage(updated);
                        }}
                        className="text-slate-400 hover:text-rose-400 cursor-pointer text-[11px]"
                      >
                        مسح من اللوحة ✖
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. MAIN TAB 3: QUIZ RESULTS HISTORY (سجل النتائج السابقة)
         ───────────────────────────────────────────────────────────── */}
      {activeSubTab === "HISTORY" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#090e1f] border border-emerald-500/30 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-400" />
                <span>سجل نتائج الاختبارات السابقة</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                تتبع تطور درجاتك ونسبة الدقة بالأنشطة والمراحل المختلفة
              </p>
            </div>
          </div>

          {quizHistory.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <Clock className="w-10 h-10 text-slate-500 mx-auto" />
              <h4 className="text-base font-black text-white">لم تقم بإجراء أي اختبار حتى الآن</h4>
              <p className="text-xs text-slate-400">
                اختر مرحلة تعليمية وابدأ اختبارك الأول لتسجيل النقاط والإنجازات.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {quizHistory.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-2xl bg-[#0c1226] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 block">{log.date}</span>
                    <h4 className="font-black text-white text-sm">{log.stageTitle}</h4>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300 font-bold">
                      <span>الدرجة: {log.score} / {log.totalQuestions}</span>
                      <span>•</span>
                      <span>الزمن: {Math.floor(log.timeSpentSeconds / 60)} دقيقة</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-center px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30">
                      <span className="text-[10px] text-slate-400 block">الدقة</span>
                      <span className="text-emerald-300 font-black text-sm">{log.percentage}%</span>
                    </div>
                    <div className="text-center px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/30">
                      <span className="text-[10px] text-slate-400 block">المكافأة</span>
                      <span className="text-amber-300 font-black text-sm">+{log.xpEarned} XP</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
