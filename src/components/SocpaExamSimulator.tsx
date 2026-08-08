import React, { useState, useEffect } from "react";
import {
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Flag,
  HelpCircle,
  Brain,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  BarChart3,
  FileCheck2,
  Sparkles,
  BookOpen
} from "lucide-react";
import { playSound } from "../utils/soundEffects";

export interface ExamQuestion {
  id: number;
  domain: "financial" | "ifrs" | "zakat_tax" | "audit";
  domainName: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 1,
    domain: "ifrs",
    domainName: "معايير التقارير المالية الدولية (IFRS 15)",
    question: "وفقاً لمعيار IFRS 15 (الإيراد من العقود مع العملاء)، ما هي الخطوة الثالثة في نموذج الخطوات الخمس للتعرف على الإيراد؟",
    options: [
      "تحديد العقد مع العميل",
      "تحديد التزامات الأداء في العقد",
      "تحديد سعر المعاملة (Transaction Price)",
      "تخصيص سعر المعاملة على التزامات الأداء"
    ],
    correctIndex: 2,
    explanation: "الخطوات الخمس لمعيار IFRS 15 هي: 1. تحديد العقد 2. تحديد التزامات الأداء 3. تحديد سعر المعاملة 4. تخصيص سعر المعاملة 5. الاعتراف بالإيراد عند الوفاء بالتزام الأداء."
  },
  {
    id: 2,
    domain: "ifrs",
    domainName: "معايير عقود الإيجار (IFRS 16)",
    question: "كيف يُعالج عقد الإيجار التشغيلي لدى المستأجر بموجب معيار IFRS 16؟",
    options: [
      "تتم معالجته كعقد إيجار تمويلي فقط وإظهاره خارج الميزانية",
      "إثبات حق استخدام أصل (Right-of-Use Asset) والتزام إيجار بالميزانية",
      "تحميل الأقساط كمنصرف مباشرة في قائمة الدخل بدون إثبات أصل بالميزانية",
      "خصم كامل قيمة الإيجار من المخزون السلعي"
    ],
    correctIndex: 1,
    explanation: "معيار IFRS 16 أعدم التفرقة السابقة لدى المستأجر، وألزم بإثبات أصل حق الاستخدام (ROU Asset) مقابل التزام الإيجار في الميزانية."
  },
  {
    id: 3,
    domain: "zakat_tax",
    domainName: "الزكاة والضريبة (SOCPA & ZATCA)",
    question: "ما هو سعر ضريبة القيمة المضافة (VAT) الأساسي المطبق حالياً في المملكة العربية السعودية للسلع والخدمات الخاضعة للضريبة؟",
    options: ["5%", "10%", "15%", "20%"],
    correctIndex: 2,
    explanation: "النسبة الأساسية لضريبة القيمة المضافة في المملكة العربية السعودية هي 15% وتطبق على معظم توريدات السلع والخدمات."
  },
  {
    id: 4,
    domain: "financial",
    domainName: "المحاسبة المالية الأساسية والقيود",
    question: "تم شراء آلة بمبلغ 100,000 ريال نقداً. ما هو الأثر الصحيح على المعادلة المحاسبية؟",
    options: [
      "زيادة الأصول وزيادة الخصوم بنفس المبلغ",
      "زيادة أصل (الآلات) ونقص أصل آخر (النية/النقدية) بنفس المبلغ دون تغير إجمالي الأصول",
      "زيادة الأصول وزيادة حقوق الملكية",
      "نقص الأصول ونقص الخصوم"
    ],
    correctIndex: 1,
    explanation: "شراء أصل نقداً يمثل تبادلاً داخل جانب الأصول (زيادة الآلات ومدين بها، ونقص النقدية ودائن بها)، فيبقى إجمالي الأصول ثابتاً."
  },
  {
    id: 5,
    domain: "audit",
    domainName: "المراجعة والتأكيد (SOCPA Audit)",
    question: "أي من أدلة المراجعة التالية يعتبر الأعلى درجة في الموثوقية والحيادية بالنسبة للمراجع الخارجي؟",
    options: [
      "الإقرارات الشفهية من الإدارة التنفيذية",
      "مصادقة خارجية مستلمة مباشرة من البنك (Bank Confirmation)",
      "فواتير المبيعات الداخلية للشركة",
      "جدول الإهلاك المكتوب من محاسب الشركة"
    ],
    correctIndex: 1,
    explanation: "المصادقات المستلمة مباشرة من طرف ثالث مستقل (مثل البنوك والعملاء) تعد الأكثر موثوقية بحسب معايير المراجعة الدولية والمحلية."
  },
  {
    id: 6,
    domain: "financial",
    domainName: "إهلاك الأصول الثابتة (IAS 16)",
    question: "آلة تكلفها 50,000 ريال وقيمتها التخريدية 5,000 ريال وعمرها الإنتاجي 5 سنوات. كم قسط الإهلاك السنوي بطريقة القسط الثابت؟",
    options: ["10,000 ريال", "9,000 ريال", "8,000 ريال", "11,000 ريال"],
    correctIndex: 1,
    explanation: "قسط الإهلاك = (التكلفة - القيمة التخريدية) / العمر الإنتاجي = (50,000 - 5,000) / 5 = 45,000 / 5 = 9,000 ريال سنوياً."
  },
  {
    id: 7,
    domain: "zakat_tax",
    domainName: "المحاسبة الزكوية",
    question: "ما هو وعاء الزكاة التقريبي للمكلف وفقاً للقواعد الزكوية في السعودية؟",
    options: [
      "إجمالي الإيرادات السنوية بدون خصم المصاريف",
      "صافي الأرباح المعدلة زكوياً + مصادر التمويل طويلة الأجل - الأصول الثابتة وما في حكمها",
      "قيمة المخزون السلعي فقط نهاية العام",
      "الأصول المتداولة فقط مقسومة على 2.5%"
    ],
    correctIndex: 1,
    explanation: "يتكون الوعاء الزكوي في السعودية أساساً من رأس المال والأرباح والتمويل طويل الأجل مطروحاً منه الأصول الثابتة وصافي الأصول الاستثمارية."
  },
  {
    id: 8,
    domain: "ifrs",
    domainName: "معايير المحاسبة (IAS 2 - المخزون)",
    question: "يُقاس المخزون السلعي في نهاية الفترة المالية وفق معيار IAS 2 بالتكلفة أو...",
    options: [
      "القيمة العادلة أيهما أعلى",
      "صافي القيمة القابلة للتحقق (NRV) أيهما أقل",
      "تكلفة الاستبدال في السوق فقط",
      "القيمة الاسمية المسجلة بالفاتورة"
    ],
    correctIndex: 1,
    explanation: "معيار IAS 2 يلزم بفياس المخزون بالتكلفة أو صافي القيمة القابلة للتحقق (Net Realizable Value) أيهما أقل تطبيقاً لمبدأ الحيطة والحذر."
  }
];

export const SocpaExamSimulator: React.FC = () => {
  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [selectedExamType, setSelectedExamType] = useState<"socpa" | "acca" | "full">("socpa");
  const [questions, setQuestions] = useState<ExamQuestion[]>(EXAM_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(15 * 60); // 15 mins
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);

  // Timer Countdown Effect
  useEffect(() => {
    if (!examStarted || examSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, examSubmitted]);

  const startExam = (type: "socpa" | "acca" | "full") => {
    setSelectedExamType(type);
    setUserAnswers({});
    setFlaggedQuestions({});
    setCurrentIndex(0);
    setExamSubmitted(false);
    setTimeLeftSeconds(type === "full" ? 20 * 60 : 12 * 60);
    setExamStarted(true);
    playSound.click();
  };

  const handleSelectOption = (optionIndex: number) => {
    if (examSubmitted) return;
    const currentQ = questions[currentIndex];
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: optionIndex }));
    playSound.click();
  };

  const toggleFlag = () => {
    const currentQ = questions[currentIndex];
    setFlaggedQuestions((prev) => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
  };

  const handleSubmitExam = () => {
    setExamSubmitted(true);
    playSound.levelUp();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Diagnostic Scores Calculation
  const totalQuestions = questions.length;
  let correctAnswersCount = 0;

  const domainStats: Record<string, { name: string; total: number; correct: number }> = {};

  questions.forEach((q) => {
    if (!domainStats[q.domain]) {
      domainStats[q.domain] = { name: q.domainName, total: 0, correct: 0 };
    }
    domainStats[q.domain].total += 1;

    if (userAnswers[q.id] === q.correctIndex) {
      correctAnswersCount += 1;
      domainStats[q.domain].correct += 1;
    }
  });

  const scorePercentage = Math.round((correctAnswersCount / totalQuestions) * 100);
  const isPassed = scorePercentage >= 70;

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* EXAM SIMULATOR HEADER */}
      <div className="bg-gradient-to-r from-[#0c1630] via-[#111c3d] to-[#0a1228] p-6 rounded-3xl border border-indigo-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>محاكي اختبارات الزمالة والمعايير المهنية</span>
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  SOCPA & ACCA
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                اختبارات محاكاة حقيقية مؤقتة تنازلياً مع تقرير تشخيصي شامل لنقاط القوة والضعف
              </p>
            </div>
          </div>

          {/* Countdown Clock Display */}
          {examStarted && !examSubmitted && (
            <div className="px-4 py-2 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-rose-300 font-mono font-black text-base shadow-lg animate-pulse">
              <Clock className="w-5 h-5 text-rose-400" />
              <span>{formatTime(timeLeftSeconds)}</span>
            </div>
          )}
        </div>
      </div>

      {/* BEFORE EXAM START SELECTOR */}
      {!examStarted && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* SOCPA Card */}
          <div className="bg-[#0e162d] border border-amber-500/30 hover:border-amber-400 rounded-3xl p-6 space-y-4 transition-all hover:scale-[1.02] shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 w-fit">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">اختبار الزمالة السعودية (SOCPA)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                يركز على الأنظمة المحاسبية السعودية، قواعد الزكاة وضريبة القيمة المضافة، ومعايير المراجعة المعتمدة.
              </p>
            </div>
            <button
              onClick={() => startExam("socpa")}
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
            >
              <span>بدء محاكي SOCPA (12 دقيقة)</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* ACCA / IFRS Card */}
          <div className="bg-[#0e162d] border border-indigo-500/30 hover:border-indigo-400 rounded-3xl p-6 space-y-4 transition-all hover:scale-[1.02] shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 w-fit">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">معايير IFRS والتأهيل الدولي (ACCA)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                اختبار مركز على المعايير الدولية للتقارير المالية مثل IFRS 15 و IFRS 16 و IAS 2 وإهلاك الأصول.
              </p>
            </div>
            <button
              onClick={() => startExam("acca")}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer transition-all"
            >
              <span>بدء محاكي IFRS (12 دقيقة)</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Full Mock Card */}
          <div className="bg-[#0e162d] border border-purple-500/30 hover:border-purple-400 rounded-3xl p-6 space-y-4 transition-all hover:scale-[1.02] shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 w-fit">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">الاختبار المحاكي الشامل (Full Exam)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                محاكاة شاملة تحاكي قاعة الاختبار الرسمية بتوقيت دقيق وتقرير تحليلي تراكمي لكافة المحاور.
              </p>
            </div>
            <button
              onClick={() => startExam("full")}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 cursor-pointer transition-all"
            >
              <span>بدء الاختبار الشامل (20 دقيقة)</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ACTIVE EXAM INTERFACE */}
      {examStarted && !examSubmitted && (
        <div className="space-y-6">
          
          {/* Question Palette Navigation Bar */}
          <div className="bg-[#0d1428] border border-white/10 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>خريطة الأسئلة ({questions.length} سؤال):</span>
              <span className="text-amber-400">الإجابات المكتملة: {Object.keys(userAnswers).length} / {questions.length}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {questions.map((q, idx) => {
                const isAnswered = userAnswers[q.id] !== undefined;
                const isFlagged = flaggedQuestions[q.id];
                const isCurrent = idx === currentIndex;

                let btnStyle = "bg-white/5 text-slate-400 border-white/10";
                if (isCurrent) btnStyle = "bg-amber-500 text-slate-950 border-amber-400 font-black scale-105 shadow-md";
                else if (isAnswered) btnStyle = "bg-indigo-600/40 text-indigo-200 border-indigo-500/40";

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-9 h-9 rounded-xl border text-xs font-black flex items-center justify-center transition-all cursor-pointer relative ${btnStyle}`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-black" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
                المجال: {currentQ.domainName}
              </span>

              <button
                onClick={toggleFlag}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  flaggedQuestions[currentQ.id]
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                    : "bg-white/5 text-slate-400 border-white/10 hover:text-white"
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{flaggedQuestions[currentQ.id] ? "تعليمة بالمراجعة" : "ميّز للمراجعة"}</span>
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-black text-white leading-relaxed">
                <span className="text-amber-400 font-bold ml-2">س{currentIndex + 1}:</span>
                {currentQ.question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = userAnswers[currentQ.id] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-4 rounded-2xl border text-right font-bold text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? "bg-indigo-600/30 border-indigo-400 text-white shadow-lg shadow-indigo-600/20"
                        : "bg-black/30 border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-black ${
                        isSelected ? "bg-indigo-500 text-white border-indigo-400" : "bg-white/5 text-slate-400 border-white/20"
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
                  </button>
                );
              })}
            </div>

            {/* Bottom Controls */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السؤال السابق</span>
              </button>

              <button
                onClick={handleSubmitExam}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>إنهاء وتسليم الاختبار</span>
              </button>

              <button
                disabled={currentIndex === questions.length - 1}
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>السؤال التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* EXAM DIAGNOSTIC REPORT */}
      {examSubmitted && (
        <div className="bg-[#0e162d] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl animate-fadeIn">
          
          {/* Header Score Badge */}
          <div className="text-center space-y-3 border-b border-white/10 pb-6">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-black ${
              isPassed ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : "bg-rose-500/20 text-rose-300 border-rose-500/40"
            }`}>
              {isPassed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
              <span>{isPassed ? "مبروك! تم اجتياز الاختبار المحاكي بنجاح 🎉" : "تنبيه: تحتاج لمزيد من المراجعة لاجتياز الاختبار ⚠️"}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white">
              النتيجة النهائية: <span className={isPassed ? "text-emerald-400" : "text-rose-400"}>{scorePercentage}%</span>
            </h2>
            <p className="text-xs text-slate-300">
              أجبت إجابة صحيحة على <span className="font-bold text-amber-400">{correctAnswersCount}</span> من أصل <span className="font-bold text-white">{totalQuestions}</span> سؤالاً
            </p>
          </div>

          {/* Domain Performance Breakdown */}
          <div className="space-y-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <span>تحليل الأداء حسب المجالات المحاسبية:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(domainStats).map(([key, stat]) => {
                const pct = Math.round((stat.correct / stat.total) * 100);
                const isGood = pct >= 70;
                return (
                  <div key={key} className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-200">{stat.name}</span>
                      <span className={isGood ? "text-emerald-400 font-black" : "text-rose-400 font-black"}>{pct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${isGood ? "bg-emerald-500" : "bg-rose-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {stat.correct} إجابة صحيحة من أصل {stat.total}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Review with Explanations */}
          <div className="space-y-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-amber-400" />
              <span>مراجعة الأسئلة والشروحات التفصيلية:</span>
            </h3>

            <div className="space-y-4">
              {questions.map((q, idx) => {
                const userAns = userAnswers[q.id];
                const isCorrect = userAns === q.correctIndex;

                return (
                  <div key={q.id} className={`p-5 rounded-2xl border space-y-3 ${
                    isCorrect ? "bg-emerald-500/5 border-emerald-500/30" : "bg-rose-500/5 border-rose-500/30"
                  }`}>
                    <div className="flex items-start justify-between gap-3 text-xs font-bold">
                      <div className="space-y-1">
                        <span className="text-slate-400">سؤال {idx + 1} ({q.domainName}):</span>
                        <p className="text-sm text-white font-black">{q.question}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black shrink-0 ${
                        isCorrect ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
                      }`}>
                        {isCorrect ? "إجابة صحيحة ✓" : "إجابة خاطئة ✗"}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 text-slate-300 bg-black/40 p-3 rounded-xl border border-white/10">
                      <div>إجابتك: <span className={isCorrect ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                        {userAns !== undefined ? q.options[userAns] : "لم يتم إجابة السؤال"}
                      </span></div>
                      {!isCorrect && (
                        <div>الإجابة الصحيحة: <span className="text-emerald-400 font-bold">{q.options[q.correctIndex]}</span></div>
                      )}
                      <div className="pt-2 border-t border-white/10 text-amber-200/90 leading-relaxed">
                        <span className="font-bold text-amber-400">الشرح الفقهي/المحاسبي: </span>
                        {q.explanation}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-white/10 flex justify-center gap-4">
            <button
              onClick={() => {
                setExamStarted(false);
                setExamSubmitted(false);
              }}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center gap-2 shadow-xl shadow-indigo-600/20 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة الاختبار أو اختيار قسم آخر</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
