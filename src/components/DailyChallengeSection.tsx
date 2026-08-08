import React, { useState, useEffect } from "react";
import { Language } from "../data/translations";
import {
  Zap,
  Flame,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Sparkles,
  RefreshCw,
  Share2,
  BookOpen,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Check
} from "lucide-react";

export interface DailyQuestion {
  id: number;
  category: string;
  categoryEn?: string;
  difficulty: "سهل" | "متوسط" | "متقدم";
  difficultyEn?: string;
  question: string;
  questionEn?: string;
  options: string[];
  optionsEn?: string[];
  correctAnswer: number;
  explanation: string;
  explanationEn?: string;
  xpReward: number;
}

// Extensive bank of 30 accounting daily challenge questions (changes deterministically every day)
const DAILY_QUESTIONS_BANK: DailyQuestion[] = [
  {
    id: 1,
    category: "القيد المزدوج والافتراضات",
    difficulty: "سهل",
    question: "عند شراء جهاز كمبيوتر مكتبي بقيمة 12,000 ر.س نقداً للاستخدام الإداري، ما القيد المحاسبي الصحيح؟",
    options: [
      "من حـ/ الأصول الثابتة (أجهزة) 12,000 إلى حـ/ البنك (الصندوق) 12,000",
      "من حـ/ المصروفات العمومية 12,000 إلى حـ/ المبيعات 12,000",
      "من حـ/ البنك 12,000 إلى حـ/ أجهزة ومعدات 12,000",
      "من حـ/ المشتريات 12,000 إلى حـ/ الموردين 12,000"
    ],
    correctAnswer: 0,
    explanation: "شراء الأصل الثابت يزيد حـ/ الأصول الثابتة (مدين)، ونقصان النقدية بالبنك يجعله دائناً بنفس المبلغ تطبيقاً لقاعدة القيد المزدوج.",
    xpReward: 50
  },
  {
    id: 2,
    category: "المعايير الدولية IFRS 9",
    difficulty: "متقدم",
    question: "وفق معيار IFRS 9، كيف يتم التقرير عن التغيرات في القيمة العادلة للأسهم المصنفة بالقيمة العادلة من خلال أرباح وخسائر (FVTPL)؟",
    options: [
      "تُثبت الفروق مباشرة في قائمة الدخل فوراً كأرباح أو خسائر غير محققة",
      "تُسجل في قائمة الدخل الشامل الآخر (OCI) فقط",
      "تُخصم من حساب رأس المال الأساسي",
      "لا يتم إثبات أي تغير إلا عند البيع الفعلي فقط"
    ],
    correctAnswer: 0,
    explanation: "الأصول المالية المصنفة FVTPL تُعاد تقييمها نهاية الفترة بسعر السوق، وتدخل الفروق مباشرة بصلب قائمة الدخل (P&L).",
    xpReward: 70
  },
  {
    id: 3,
    category: "التسويات والقيود الجوفية",
    difficulty: "متوسط",
    question: "استلمت الشركة مبلغ 24,000 ر.س نقداً كإيجار مقدم عن سنة كاملة وتبدأ اليوم. ما هو قيد الإثبات الأولي؟",
    options: [
      "من حـ/ البنك 24,000 إلى حـ/ إيراد إيجار مقدم (التزام) 24,000",
      "من حـ/ إيراد الإيجار 24,000 إلى حـ/ البنك 24,000",
      "من حـ/ مصروف الإيجار 24,000 إلى حـ/ الدائنون 24,000",
      "من حـ/ البنك 24,000 إلى حـ/ أرباح وإيرادات مباشرة 24,000"
    ],
    correctAnswer: 0,
    explanation: "المبالغ المحصلة مقدماً قبل تقديم الخدمة تُعتبر التزاماً على الشركة (إيراد غير مكتسب) حتى انقضاء المدة الاستحقاقية.",
    xpReward: 60
  },
  {
    id: 4,
    category: "طرق الإهلاك للأصول الثابتة",
    difficulty: "متوسط",
    question: "أصل ثابت تكلفته 100,000 ر.س، وقيمته كخرادة متوقعة 10,000 ر.س، وعمره الإنتاجي 5 سنوات. ما القسط السنوي وفق القسط الثابت؟",
    options: [
      "18,000 ر.س سنوياً",
      "20,000 ر.س سنوياً",
      "15,000 ر.س سنوياً",
      "22,000 ر.س سنوياً"
    ],
    correctAnswer: 0,
    explanation: "القسط السنوي = (التكلفة - الخرادة) ÷ العمر = (100,000 - 10,000) ÷ 5 = 90,000 ÷ 5 = 18,000 ر.س.",
    xpReward: 60
  },
  {
    id: 5,
    category: "المخزون وتقييم البضاعة",
    difficulty: "سهل",
    question: "في ظل ظروف التضخم وارتفاع الأسعار المستمر، أي طريقة تقييم مخزون تحقق أعلى صافي ربح وأعلى تقييم لمخزون آخر الفترة؟",
    options: [
      "طريقة الوارد أولاً يصدر أولاً (FIFO)",
      "طريقة متوسط التكلفة المرجح (Weighted Average)",
      "طريقة الوارد أخيراً يصدر أولاً (LIFO)",
      "طريقة التكلفة الفعلية المباشرة"
    ],
    correctAnswer: 0,
    explanation: "طريقة FIFO تحمل تكلفة المبيعات بالأسعار القديمة المنخفضة، مما يرفع صافي الربح ويجعل مخزون آخر الفترة مسعراً بالأسعار الأحدث الأعلى.",
    xpReward: 50
  },
  {
    id: 6,
    category: "التحليل المالي والنسب",
    difficulty: "متوسط",
    question: "ما هي نسبة التداول السريع (Quick Ratio / Acid-Test)؟",
    options: [
      "(الأصول المتداولة - المخزون) ÷ الالتزامات المتداولة",
      "الأصول المتداولة ÷ الالتزامات المتداولة",
      "النقدية ÷ إجمالي الأصول",
      "إجمالي الديون ÷ حقوق الملكية"
    ],
    correctAnswer: 0,
    explanation: "نسبة التداول السريع تستبعد المخزون لأنه الأقل سيولة بين الأصول المتداولة، لقياس قدرة الشركة الفورية على سداد ديونها القريبة.",
    xpReward: 60
  },
  {
    id: 7,
    category: "القوائم المالية والميزانية",
    difficulty: "سهل",
    question: "أين تظهر الأرباح المبقاة (Retained Earnings) في القوائم المالية؟",
    options: [
      "في جانب حقوق الملكية بالميزانية العمومية",
      "في قائمة التدفقات النقدية فقط",
      "في جانب الالتزامات المتداولة",
      "في قائمة الدخل تحت بند المصروفات"
    ],
    correctAnswer: 0,
    explanation: "الأرباح المبقاة هي جزء من أرباح الأعوام السابقة المحتجزة بالشركة وتظهر بصلب حقوق الملكية بالميزانية العمومية.",
    xpReward: 50
  },
  {
    id: 8,
    category: "ضريبة القيمة المضافة VAT",
    difficulty: "سهل",
    question: "باعت الشركة بضاعة بمبلغ 10,000 ر.س خاضعة لضريبة القيمة المضافة (15%). ما إجمالي المبلغ المحصل من الزبون؟",
    options: [
      "11,500 ر.س (10,000 + 1,500 ضريبة مخرجات)",
      "10,000 ر.س بدون تغيير",
      "8,500 ر.س فقط",
      "12,000 ر.س"
    ],
    correctAnswer: 0,
    explanation: "ضريبة القيمة المضافة 15% تُضاف فوق سعر البيع = 10,000 × 1.15 = 11,500 ر.س، وتُسجل الـ 1,500 ر.س كالتزام ضريبي للمصلحة.",
    xpReward: 50
  },
  {
    id: 9,
    category: "محاسبة التكاليف ونقطة التعادل",
    difficulty: "متقدم",
    question: "سعر بيع الوحدة 100 ر.س، والتكلفة المتغيرة للوحدة 60 ر.س، والتكاليف الثابتة الإجمالية 80,000 ر.س. كم وحدة يجب بيعها لتحقيق التعادل؟",
    options: [
      "2,000 وحدة",
      "1,333 وحدة",
      "2,500 وحدة",
      "3,000 وحدة"
    ],
    correctAnswer: 0,
    explanation: "نقطة التعادل بالوحدات = التكاليف الثابتة ÷ هامش المساهمة (السعر - التكلفة المتغيرة) = 80,000 ÷ (100 - 60) = 80,000 ÷ 40 = 2,000 وحدة.",
    xpReward: 70
  },
  {
    id: 10,
    category: "التدفقات النقدية IAS 7",
    difficulty: "متقدم",
    question: "توزيعات الأرباح المدفوعة للمساهمين تُصنف في قائمة التدفقات النقدية وفق المعايير الدولية بشكل عام تحت أي أنشطة؟",
    options: [
      "أنشطة تمويلية (Financing Activities)",
      "أنشطة تشغيلية (Operating Activities)",
      "أنشطة استثمارية (Investing Activities)",
      "تسويات غير نقدية"
    ],
    correctAnswer: 0,
    explanation: "توزيعات الأرباح ترتبط بهيكل أراس المال والتمويل، ولذلك تُصنف كتدفقات نقدية خارجة ضمن الأنشطة التمويلية.",
    xpReward: 70
  }
];

interface DailyChallengeSectionProps {
  onSolveChallenge?: (xpReward?: number) => void;
  appLanguage?: Language;
}

export function DailyChallengeSection({ onSolveChallenge, appLanguage = "ar" }: DailyChallengeSectionProps = {}) {
  const isEn = appLanguage === "en";
  // Get deterministic day index based on YYYY-MM-DD
  const getTodaySeed = () => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const seed = getTodaySeed();
  const todayQuestionIndex = seed % DAILY_QUESTIONS_BANK.length;

  // Active question index state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(todayQuestionIndex);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [streakCount, setStreakCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("meezan_daily_streak");
      return saved ? parseInt(saved, 10) : 5;
    } catch {
      return 5;
    }
  });

  const [solvedToday, setSolvedToday] = useState<boolean>(() => {
    try {
      const todayStr = new Date().toISOString().slice(0, 10);
      const saved = localStorage.getItem("meezan_daily_solved_date");
      return saved === todayStr;
    } catch {
      return false;
    }
  });

  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Countdown timer to midnight reset
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diffMs = tomorrow.getTime() - now.getTime();

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentQ = DAILY_QUESTIONS_BANK[currentQuestionIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    const correct = idx === currentQ.correctAnswer;
    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      if (onSolveChallenge) {
        onSolveChallenge(currentQ.xpReward || 50);
      }
      const todayStr = new Date().toISOString().slice(0, 10);
      if (!solvedToday) {
        const newStreak = streakCount + 1;
        setStreakCount(newStreak);
        setSolvedToday(true);
        try {
          localStorage.setItem("meezan_daily_streak", newStreak.toString());
          localStorage.setItem("meezan_daily_solved_date", todayStr);
        } catch {
          // ignore storage error
        }
      }
    }
  };

  const handleNextRandomQuestion = () => {
    const nextIdx = (currentQuestionIdx + 1) % DAILY_QUESTIONS_BANK.length;
    setCurrentQuestionIdx(nextIdx);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  const handleShareResult = () => {
    const text = `🏆 نجحت في حل التحدي المحاسبي اليومي في تطبيق ميزan! 🎉\nالسؤال: ${currentQ.question}\nالنتيجة: إجابة صحيحة +${currentQ.xpReward} XP 🔥\nتعلم المحاسبة مجاناً بأسلوب تفاعلي!`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <section id="daily-challenge-section" className="py-6 max-w-7xl mx-auto px-4 my-4">
      
      {/* MAIN CONTAINER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1329] via-[#091024] to-[#060a17] border border-amber-500/35 p-6 md:p-8 shadow-2xl backdrop-blur-2xl">
        
        {/* Glow Ambient Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* HEADER BAR */}
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 text-amber-300 text-xs font-black">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
              <span>{isEn ? "Daily Accounting Quest" : "التحدي اليومي السريع — Daily Accounting Quest"}</span>
            </div>

            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>{isEn ? `⚡ Today's Accounting Question (${new Date().toLocaleDateString("en-US")})` : `⚡ سؤال اليوم المحاسبي (${new Date().toLocaleDateString("ar-SA")})`}</span>
            </h2>
          </div>

          {/* TIMER & STREAK BADGES */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Streak Badge */}
            <div className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-orange-600/30 to-amber-600/30 border border-orange-500/40 text-orange-200 font-black text-xs flex items-center gap-2 shadow-lg">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
              <span>{isEn ? `Streak: ${streakCount} Days` : `سلسلة التحدي: ${streakCount} أيام متتالية`}</span>
            </div>

            {/* Countdown Badge */}
            <div className="px-3.5 py-2 rounded-2xl bg-black/50 border border-white/15 text-slate-300 font-mono text-xs font-black flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>{isEn ? "Resets in:" : "تجدد السؤال خلال:"}</span>
              <span className="text-cyan-300 font-bold">
                {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>

          </div>
        </div>

        {/* QUESTION CARD CONTENT */}
        <div className="relative z-10 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* QUESTION + OPTIONS (8 COLS) */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* Question Meta Badge */}
            <div className="flex items-center justify-between text-xs font-black">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-indigo-600/30 text-indigo-200 border border-indigo-500/40">
                  📂 {isEn && currentQ.categoryEn ? currentQ.categoryEn : currentQ.category}
                </span>
                <span className={`px-3 py-1 rounded-xl border ${
                  currentQ.difficulty === "سهل"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : currentQ.difficulty === "متوسط"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    : "bg-purple-500/20 text-purple-300 border-purple-500/30"
                }`}>
                  {isEn ? (currentQ.difficultyEn || currentQ.difficulty) : `مستوى ${currentQ.difficulty}`}
                </span>
              </div>

              <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                +{currentQ.xpReward} XP
              </span>
            </div>

            {/* Question Title Box */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 text-white space-y-2">
              <p className="text-base md:text-lg font-black leading-relaxed">
                {isEn && currentQ.questionEn ? currentQ.questionEn : currentQ.question}
              </p>
            </div>

            {/* OPTIONS LIST */}
            <div className="space-y-3">
              {(isEn && currentQ.optionsEn ? currentQ.optionsEn : currentQ.options).map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectOption = idx === currentQ.correctAnswer;

                let optStyle = "bg-[#080d1e] border-white/12 text-slate-200 hover:border-indigo-400 hover:bg-white/5";

                if (isAnswered) {
                  if (isCorrectOption) {
                    optStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-950/50";
                  } else if (isSelected && !isCorrect) {
                    optStyle = "bg-rose-950/80 border-rose-500 text-rose-100 ring-2 ring-rose-500/50";
                  } else {
                    optStyle = "bg-black/30 border-white/5 text-slate-500 opacity-60";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-2xl border text-right rtl:text-right ltr:text-left font-black text-xs md:text-sm transition-all cursor-pointer flex items-center justify-between gap-3 ${optStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-xl bg-white/10 font-mono text-xs font-black flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </div>

                    {isAnswered && (
                      <div className="shrink-0">
                        {isCorrectOption && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                        {isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-rose-400" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* EXPLANATION BOX AFTER ANSWERING */}
            {isAnswered && (
              <div className={`p-5 rounded-2xl border text-xs md:text-sm space-y-3 animate-fadeIn ${
                isCorrect ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200" : "bg-rose-950/40 border-rose-500/40 text-rose-200"
              }`}>
                <div className="flex items-center justify-between font-black text-sm">
                  <span className="flex items-center gap-2">
                    {isCorrect ? <Sparkles className="w-5 h-5 text-amber-300" /> : <HelpCircle className="w-5 h-5 text-rose-400" />}
                    <span>
                      {isCorrect
                        ? isEn ? "Great job! Correct Answer! 🎉 (+50 XP)" : "إجابة صحيحة رائعة! 🎉 (+50 XP)"
                        : isEn ? "Incorrect — Accounting Explanation:" : "للأسف الإجابة غير صحيحة — التوضيح المحاسبي:"}
                    </span>
                  </span>

                  {isCorrect && (
                    <button
                      onClick={handleShareResult}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/40 text-emerald-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{copiedShare ? (isEn ? "Copied! ✅" : "تم النسخ! ✅") : isEn ? "Share Result" : "مشاركة إنجازك"}</span>
                    </button>
                  )}
                </div>

                <p className="leading-relaxed text-slate-200 font-medium bg-black/40 p-3.5 rounded-xl border border-white/10">
                  <strong className="text-amber-300">{isEn ? "💡 Accounting Explanation: " : "💡 الشرح والـتأصيل المحاسبي: "}</strong>
                  {isEn && currentQ.explanationEn ? currentQ.explanationEn : currentQ.explanation}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400 text-xs font-bold">
                    {solvedToday
                      ? isEn ? "You completed today's quest! Come back tomorrow 🔥" : "أكملت سؤال التحدي لليوم! عد غداً لسؤال جديد 🔥"
                      : isEn ? "Practice with extra questions." : "يمكنك الاستمرار بالتدرب على أسئلة إضافية."}
                  </span>

                  <button
                    onClick={handleNextRandomQuestion}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black transition-all cursor-pointer flex items-center gap-2 shadow-lg"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{isEn ? "Next Question" : "تحدّي إضافي (سؤال آخر)"}</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* SIDEBAR: STREAK & TIPS (4 COLS) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Daily Streak Reward Box */}
            <div className="bg-black/40 border border-white/10 p-5 rounded-2xl space-y-3.5 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 mx-auto flex items-center justify-center text-white shadow-xl shadow-amber-600/30 border border-amber-300/40">
                <Flame className="w-8 h-8 fill-current" />
              </div>

              <div>
                <h4 className="font-black text-base text-white">{isEn ? "Daily 24H Quest" : "تحدي الـ 24 ساعة اليومي"}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {isEn
                    ? "Solving questions daily enhances your recall speed for journal entries and IFRS standards."
                    : "الحفاظ على عادة الحل اليومي يرفع من سرعتك في فهم القيود وحل المعايير المحاسبية بالامتحانات والعمل."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-black pt-1">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-amber-400 block text-lg">{streakCount}d</span>
                  <span className="text-[11px] text-slate-400 font-bold">{isEn ? "Streak" : "أيام متتالية"}</span>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-emerald-400 block text-lg">+50 XP</span>
                  <span className="text-[11px] text-slate-400 font-bold">{isEn ? "Daily Reward" : "مكافأة اليوم"}</span>
                </div>
              </div>
            </div>

            {/* Quick Tip Box */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 space-y-2">
              <div className="font-black flex items-center gap-1.5 text-indigo-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{isEn ? "Meezan Daily Tip" : "نصيحة ميزان اليومية"}</span>
              </div>
              <p className="leading-relaxed font-medium text-slate-300">
                {isEn
                  ? "Every journal entry must have equal debit and credit amounts. Debit-nature accounts (Assets & Expenses) increase with Debit and decrease with Credit."
                  : "كل قيد محاسبي يتضمن جانبين مدين ودائن متساويين. الحسابات ذات الطبيعة المدينة (مثل الأصول والمصروفات) تزيد في الجانب المدين وتنقص في الدائن."}
              </p>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
