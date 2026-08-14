import { useState, useEffect, useMemo, useCallback, memo, Dispatch, SetStateAction } from "react";
import { STAGES_DATA } from "../data/curriculum";
import { Stage, StageLesson } from "../types";
import { AnnotatedText, LessonTermsWidget } from "./TermHelpTooltip";
import { CelebrationParticles, fireCelebrationParticles } from "./CelebrationParticles";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Zap,
  Sparkles,
  FileText,
  HelpCircle,
  Edit3,
  Bot,
  List,
  RotateCcw,
  Check,
  Send,
  Loader2,
  Award,
  GraduationCap,
  RotateCw,
  Shuffle,
  Sun,
  Moon,
  Coffee,
  Type,
  Palette,
  Maximize2,
  Minimize2,
  Eye,
  Play,
  Pause,
  Timer,
  Volume2,
  VolumeX,
  Copy,
  Trash2,
  Download,
  Search,
  Save,
  Bookmark,
  Tag,
  ExternalLink,
  CheckCheck
} from "lucide-react";

// Memoized Skeleton Loader for lesson content preloading and fast transition
export const LessonSkeletonLoader = memo(({ theme = "dark" }: { theme?: string }) => {
  return (
    <div className="space-y-6 animate-pulse text-right dir-rtl" id="lesson-skeleton-loader">
      {/* Skeleton Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0e162b] to-[#090e1f] border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="h-4 w-32 bg-indigo-500/20 rounded-lg" />
          <div className="h-6 w-24 bg-emerald-500/20 rounded-full" />
        </div>
        <div className="h-8 w-3/4 bg-white/15 rounded-xl" />
        <div className="h-4 w-1/2 bg-white/10 rounded-lg" />
      </div>

      {/* Skeleton Body Reading Content */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0b1020] border border-white/10 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="h-5 w-48 bg-indigo-400/20 rounded-lg" />
          <div className="h-7 w-28 bg-white/10 rounded-xl" />
        </div>

        <div className="space-y-3 pt-2">
          <div className="h-4 w-full bg-white/10 rounded-lg" />
          <div className="h-4 w-[95%] bg-white/10 rounded-lg" />
          <div className="h-4 w-[88%] bg-white/10 rounded-lg" />
          <div className="h-4 w-[92%] bg-white/10 rounded-lg" />
          <div className="h-4 w-[75%] bg-white/10 rounded-lg" />
        </div>

        {/* Skeleton Golden Rules */}
        <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 space-y-3">
          <div className="h-4 w-40 bg-purple-400/20 rounded-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="h-12 bg-white/5 rounded-xl border border-white/5" />
            <div className="h-12 bg-white/5 rounded-xl border border-white/5" />
          </div>
        </div>

        {/* Skeleton Example Ledger Box */}
        <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-3">
          <div className="h-4 w-32 bg-amber-400/20 rounded-lg" />
          <div className="h-20 bg-black/40 rounded-xl border border-white/5" />
        </div>
      </div>
    </div>
  );
});

// Memoized Mobile Sidebar Drawer
interface LessonSidebarDrawerProps {
  show: boolean;
  onClose: () => void;
  stage: Stage;
  currentLessonIdx: number;
  completedLessons: string[];
  onSelectStageLesson: (stageId: number, lessonIndex: number) => void;
}

export const LessonSidebarDrawer = memo(({
  show,
  onClose,
  stage,
  currentLessonIdx,
  completedLessons,
  onSelectStageLesson,
}: LessonSidebarDrawerProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-start lg:hidden animate-fadeIn">
      <div className="w-80 max-w-[85vw] h-full bg-[#0a0f20] border-l border-white/10 p-5 overflow-y-auto space-y-5 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <List className="w-5 h-5 text-amber-400" />
              <h3 className="font-black text-sm text-white">دروس المرحلة {stage.id}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-gray-400 font-medium">{stage.name}</p>

          <div className="space-y-2 pt-1">
            {stage.lessons.map((les, idx) => {
              const lKey = `${stage.id}-${idx}`;
              const isDone = completedLessons.includes(lKey);
              const isCurrent = idx === currentLessonIdx;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectStageLesson(stage.id, idx);
                    onClose();
                  }}
                  className={`w-full p-3 rounded-xl text-right text-xs transition-all flex items-center justify-between gap-2 border cursor-pointer ${
                    isCurrent
                      ? "bg-indigo-600/30 border-indigo-500 text-white font-extrabold shadow-md"
                      : isDone
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-semibold"
                      : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-2 line-clamp-1">
                    <span className="w-5 h-5 rounded-full bg-white/10 text-[10px] font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="line-clamp-1">{les.title}</span>
                  </div>

                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shrink-0" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <p className="text-[11px] text-gray-400 text-center font-medium">
            اختر أياً من الدروس للانتقال المباشر إليها
          </p>
        </div>
      </div>
    </div>
  );
});

// Memoized Flashcards View
interface LessonFlashcardViewProps {
  lessonFlashcards: any[];
  currentCardIdx: number;
  setCurrentCardIdx: Dispatch<SetStateAction<number>>;
  isFlipped: boolean;
  setIsFlipped: (flipped: boolean) => void;
  isCardMastered: boolean;
  toggleMasterCard: () => void;
  lessonTitle: string;
  onNavigateQuiz: () => void;
}

export const LessonFlashcardView = memo(({
  lessonFlashcards,
  currentCardIdx,
  setCurrentCardIdx,
  isFlipped,
  setIsFlipped,
  isCardMastered,
  toggleMasterCard,
  lessonTitle,
  onNavigateQuiz
}: LessonFlashcardViewProps) => {
  const currentCard = lessonFlashcards[currentCardIdx] || lessonFlashcards[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#101a30] p-4 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-pink-400" />
          <div>
            <h3 className="font-black text-sm text-white">
              البطاقات التعليمية للدرس ({lessonFlashcards.length} بطاقات)
            </h3>
            <p className="text-[11px] text-gray-400">
              انقر على البطاقة لقلبها وقراءة القاعدة أو التوضيح المحاسبي
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-pink-300 bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
            البطاقة {currentCardIdx + 1} من {lessonFlashcards.length}
          </span>
          {isCardMastered && (
            <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>متقنة ✅</span>
            </span>
          )}
        </div>
      </div>

      {/* 3D Flippable Flashcard Card */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full min-h-[260px] sm:min-h-[300px] cursor-pointer rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative transition-all duration-500 shadow-2xl border select-none group"
        style={{
          perspective: "1000px",
          background: isFlipped
            ? "linear-gradient(135deg, #131c38 0%, #1a103c 100%)"
            : "linear-gradient(135deg, #0d1428 0%, #111a33 100%)",
          borderColor: isFlipped ? "rgba(168, 85, 247, 0.5)" : "rgba(99, 102, 241, 0.4)"
        }}
      >
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-xs font-black border ${currentCard.badgeColor}`}>
            {currentCard.tag}
          </span>

          <span className="text-xs font-extrabold text-gray-400 flex items-center gap-1 group-hover:text-white transition-colors">
            <RotateCw className={`w-3.5 h-3.5 transition-transform duration-500 ${isFlipped ? "rotate-180 text-purple-400" : "text-indigo-400"}`} />
            <span>{isFlipped ? "قلب للسؤال 🔄" : "قلب للإجابة 🔄"}</span>
          </span>
        </div>

        <div className="py-6 text-center space-y-3">
          <span className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider block">
            {isFlipped ? "💡 الشرح والقاعدة المحاسبية:" : "❓ السؤال / المفهوم:"}
          </span>

          <p className={`text-base sm:text-xl font-black leading-relaxed ${isFlipped ? "text-emerald-200" : "text-white"}`}>
            {isFlipped ? currentCard.answer : currentCard.question}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-gray-400 font-semibold">
          <span className="flex items-center gap-1 text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{lessonTitle}</span>
          </span>

          <span className="text-[11px] text-gray-400">
            انقر في أي مكان لقلب البطاقة 👆
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsFlipped(false);
              setCurrentCardIdx((prev) => (prev - 1 + lessonFlashcards.length) % lessonFlashcards.length);
            }}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer border border-white/10 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
            <span>البطاقة السابقة</span>
          </button>

          <button
            onClick={() => {
              setIsFlipped(false);
              setCurrentCardIdx((prev) => (prev + 1) % lessonFlashcards.length);
            }}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/30 transition-all"
          >
            <span>البطاقة التالية</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMasterCard}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer border transition-all ${
              isCardMastered
                ? "bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30"
                : "bg-white/5 hover:bg-white/10 text-gray-300 border-white/10"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCardMastered ? "تم الإتقان ✅" : "تعليم كـ متقن"}</span>
          </button>

          <button
            onClick={() => {
              setIsFlipped(false);
              const rand = Math.floor(Math.random() * lessonFlashcards.length);
              setCurrentCardIdx(rand);
            }}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 cursor-pointer"
            title="ترتيب عشوائي"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-blue-900/30 border border-purple-500/30 p-4 rounded-2xl flex items-center justify-between gap-3">
        <div className="text-xs text-gray-300 font-semibold flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400 shrink-0" />
          <span>راجعت بطاقات هذا الدرس؟ يمكنك الآن أداء اختبار الفهم السريع!</span>
        </div>

        <button
          onClick={onNavigateQuiz}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs shrink-0 cursor-pointer shadow-md shadow-amber-500/20"
        >
          اختبار الفهم 🎯
        </button>
      </div>
    </div>
  );
});

// Memoized Quiz View
interface LessonQuizViewProps {
  quizQuestions: any[];
  quizSelectedOption: number | null;
  setQuizSelectedOption: (idx: number | null) => void;
  quizAnswered: boolean;
  setQuizAnswered: (ans: boolean) => void;
  isCompleted: boolean;
  toggleComplete: () => void;
  handleNextLesson: () => void;
}

export const LessonQuizView = memo(({
  quizQuestions,
  quizSelectedOption,
  setQuizSelectedOption,
  quizAnswered,
  setQuizAnswered,
  isCompleted,
  toggleComplete,
  handleNextLesson
}: LessonQuizViewProps) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-[#101a30] p-6 rounded-2xl border border-amber-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            تحدي استيعاب الدرس
          </span>
          <span className="text-xs text-gray-400">+10 XP</span>
        </div>

        <h3 className="text-sm sm:text-base font-black text-white">
          {quizQuestions[0].q}
        </h3>

        <div className="space-y-2.5 pt-2">
          {quizQuestions[0].options.map((opt: string, oIdx: number) => {
            const isSelected = quizSelectedOption === oIdx;
            const isCorrect = oIdx === quizQuestions[0].correctIdx;

            let btnStyle = "bg-[#080c1c] border-white/10 text-gray-200 hover:border-amber-400/50";
            if (quizAnswered) {
              if (isCorrect) {
                btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold";
              } else if (isSelected) {
                btnStyle = "bg-red-500/20 border-red-500 text-red-200 font-bold";
              }
            }

            return (
              <button
                key={oIdx}
                disabled={quizAnswered}
                onClick={() => {
                  setQuizSelectedOption(oIdx);
                  setQuizAnswered(true);
                  if (!isCompleted) {
                    toggleComplete();
                  }
                }}
                className={`w-full p-4 rounded-xl text-right text-xs sm:text-sm transition-all border cursor-pointer flex items-center justify-between ${btnStyle}`}
              >
                <span>{opt}</span>
                {quizAnswered && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {quizAnswered && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between text-xs text-emerald-300 font-bold">
              <span>🎉 {quizQuestions[0].explanation}</span>
              <button
                onClick={() => {
                  setQuizAnswered(false);
                  setQuizSelectedOption(null);
                }}
                className="flex items-center gap-1 text-amber-300 hover:underline cursor-pointer text-[11px]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة التحدي</span>
              </button>
            </div>

            <div className="pt-2 border-t border-emerald-500/20 flex justify-end">
              <button
                onClick={handleNextLesson}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>المتابعة إلى الدرس التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// Memoized AI View
interface LessonAiViewProps {
  lessonTitle: string;
  aiQuery: string;
  setAiQuery: (q: string) => void;
  aiReply: string | null;
  aiLoading: boolean;
  handleAiAsk: () => void;
}

export const LessonAiView = memo(({
  lessonTitle,
  aiQuery,
  setAiQuery,
  aiReply,
  aiLoading,
  handleAiAsk
}: LessonAiViewProps) => {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-[#101a30] p-5 rounded-2xl border border-purple-500/30 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
          <Bot className="w-4 h-4 text-purple-400" />
          <span>اسأل الذكاء الاصطناعي حول موضوع: "{lessonTitle}"</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAiAsk()}
            placeholder="مثال: وضح لي مثالاً عملياً إضافياً بشركة تجارية..."
            className="flex-1 bg-[#080c1c] border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-medium outline-none focus:border-purple-400"
          />

          <button
            onClick={handleAiAsk}
            disabled={aiLoading || !aiQuery.trim()}
            className="px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-md shadow-purple-600/30"
          >
            {aiLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4 rotate-180" />
            )}
            <span>سؤال</span>
          </button>
        </div>

        {aiReply && (
          <div className="p-4 bg-[#080c1c] border border-purple-500/30 rounded-xl text-xs sm:text-sm text-gray-200 leading-relaxed font-normal whitespace-pre-wrap animate-fadeIn">
            {aiReply}
          </div>
        )}
      </div>
    </div>
  );
});

interface LessonDetailSectionProps {
  stageId: number;
  initialLessonIndex?: number;
  initialTab?: "read" | "flashcards" | "quiz" | "notes" | "ai";
  onBackToPath: () => void;
  onSelectStageLesson: (stageId: number, lessonIndex: number) => void;
  onCompleteLesson?: (stageId: number, lessonIdx: number, xpReward?: number) => void;
  onFocusModeChange?: (isFocus: boolean) => void;
}

export function LessonDetailSection({
  stageId,
  initialLessonIndex = 0,
  initialTab = "read",
  onBackToPath,
  onSelectStageLesson,
  onCompleteLesson,
  onFocusModeChange
}: LessonDetailSectionProps) {
  const [currentLessonIdx, setCurrentLessonIdx] = useState(initialLessonIndex);
  const [activeTab, setActiveTab] = useState<"read" | "flashcards" | "quiz" | "notes" | "ai">(initialTab);

  // Track completed lessons in localStorage
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("meezan_completed_lessons");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Track personal notes for lessons in localStorage
  const [lessonNotes, setLessonNotes] = useState<{ [key: string]: string }>(() => {
    try {
      const saved = localStorage.getItem("meezan_lesson_notes");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Lesson Flashcards State
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("meezan_mastered_lesson_cards");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Quiz state
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);

  // Lesson AI State
  const [aiQuery, setAiQuery] = useState("");
  const [aiReply, setAiReply] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Sidebar mobile drawer state
  const [showStageSidebar, setShowStageSidebar] = useState(false);

  // Reading Customization State
  type ReadingTheme = "dark" | "warm" | "light" | "royal";
  type FontSizeOption = "sm" | "md" | "lg" | "xl";

  const [readingTheme, setReadingTheme] = useState<ReadingTheme>(() => {
    try {
      const saved = localStorage.getItem("meezan_reading_theme");
      return (saved as ReadingTheme) || "light";
    } catch {
      return "light";
    }
  });

  const [fontSize, setFontSize] = useState<FontSizeOption>(() => {
    try {
      const saved = localStorage.getItem("meezan_reading_font_size");
      return (saved as FontSizeOption) || "md";
    } catch {
      return "md";
    }
  });

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "meezan_reading_font_size" && e.newValue) {
        setFontSize(e.newValue as FontSizeOption);
      }
    };
    const handleCustomEvent = (e: CustomEvent) => {
      if (e.detail?.fontSize) {
        setFontSize(e.detail.fontSize as FontSizeOption);
      }
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("meezan_font_size_changed" as any, handleCustomEvent);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("meezan_font_size_changed" as any, handleCustomEvent);
    };
  }, []);

  // Focus Mode State (إخفاء العناصر غير الضرورية والقوائم الجانبية)
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Pomodoro Timer State (مؤقت بومودورو لوضع التركيز)
  const [pomoWorkMinutes, setPomoWorkMinutes] = useState(25);
  const [pomoBreakMinutes, setPomoBreakMinutes] = useState(5);
  const [pomoMode, setPomoMode] = useState<"work" | "break">("work");
  const [pomoSecondsLeft, setPomoSecondsLeft] = useState(25 * 60);
  const [pomoIsActive, setPomoIsActive] = useState(false);
  const [pomoCompletedSessions, setPomoCompletedSessions] = useState(0);
  const [pomoSoundEnabled, setPomoSoundEnabled] = useState(true);
  const [pomoAlertMsg, setPomoAlertMsg] = useState("");

  // Helper sound effect using Web Audio API (soft gentle chime)
  const playChimeSound = () => {
    if (!pomoSoundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.0);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.0);
    } catch (e) {
      console.error(e);
    }
  };

  // Ticking effect for Pomodoro Timer
  useEffect(() => {
    let interval: any = null;
    if (pomoIsActive && pomoSecondsLeft > 0) {
      interval = setInterval(() => {
        setPomoSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (pomoIsActive && pomoSecondsLeft === 0) {
      playChimeSound();
      if (pomoMode === "work") {
        setPomoCompletedSessions((prev) => prev + 1);
        setPomoMode("break");
        setPomoSecondsLeft(pomoBreakMinutes * 60);
        setPomoAlertMsg(`🎉 أحسنت! اكتملت جلسة التركيز. حان وقت استراحة الـ ${pomoBreakMinutes} دقائق ☕`);
        fireCelebrationParticles();
      } else {
        setPomoMode("work");
        setPomoSecondsLeft(pomoWorkMinutes * 60);
        setPomoAlertMsg(`💪 انتهت الاستراحة! لنعد لمواصلة المذاكرة والتركيز الآن 📖`);
      }
      setPomoIsActive(false);
    }
    return () => clearInterval(interval);
  }, [pomoIsActive, pomoSecondsLeft, pomoMode, pomoWorkMinutes, pomoBreakMinutes, pomoSoundEnabled]);

  const handleStartPomo = () => setPomoIsActive(true);
  const handlePausePomo = () => setPomoIsActive(false);
  const handleResetPomo = () => {
    setPomoIsActive(false);
    setPomoSecondsLeft(pomoMode === "work" ? pomoWorkMinutes * 60 : pomoBreakMinutes * 60);
  };

  const handleSelectPomoPreset = (workMins: number, breakMins: number) => {
    setPomoWorkMinutes(workMins);
    setPomoBreakMinutes(breakMins);
    setPomoMode("work");
    setPomoSecondsLeft(workMins * 60);
    setPomoIsActive(false);
  };

  const formatPomoTime = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const currentTotalSecs = (pomoMode === "work" ? pomoWorkMinutes : pomoBreakMinutes) * 60;
  const pomoProgressPercent = Math.min(100, Math.max(0, ((currentTotalSecs - pomoSecondsLeft) / currentTotalSecs) * 100));

  // HTML5 Native Browser Fullscreen integration, Body Scroll Lock & Sync Listener
  useEffect(() => {
    // Notify parent app if callback provided
    if (onFocusModeChange) {
      onFocusModeChange(isFocusMode);
    }

    try {
      if (isFocusMode) {
        document.body.style.overflow = "hidden";
        if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } else {
        document.body.style.overflow = "";
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    } catch (err) {
      console.warn("Fullscreen/scroll lock request in frame context:", err);
    }

    const handleFullscreenChange = () => {
      try {
        if (!document.fullscreenElement && isFocusMode && document.fullscreenEnabled) {
          // Only exit if native fullscreen was active
        }
      } catch (err) {
        console.error(err);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFocusMode) {
        setIsFocusMode(false);
        try {
          if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFocusMode, onFocusModeChange]);

  const handleSetTheme = (newTheme: ReadingTheme) => {
    setReadingTheme(newTheme);
    try {
      localStorage.setItem("meezan_reading_theme", newTheme);
    } catch {}
  };

  const handleSetFontSize = (newSize: FontSizeOption) => {
    setFontSize(newSize);
    try {
      localStorage.setItem("meezan_reading_font_size", newSize);
    } catch {}
  };

  const THEME_STYLES: Record<ReadingTheme, { bg: string; text: string; border: string; headerText: string; cardBg: string }> = {
    dark: {
      bg: "bg-[#101a30]",
      text: "text-gray-100",
      border: "border-white/10",
      headerText: "text-indigo-300",
      cardBg: "bg-black/30 border-indigo-500/20 text-gray-200"
    },
    warm: {
      bg: "bg-[#272016]",
      text: "text-[#fef3c7]",
      border: "border-amber-700/50",
      headerText: "text-amber-300",
      cardBg: "bg-black/40 border-amber-600/30 text-amber-100"
    },
    light: {
      bg: "bg-slate-50",
      text: "text-slate-900",
      border: "border-slate-300 shadow-md",
      headerText: "text-indigo-700 font-black",
      cardBg: "bg-white border-slate-300 text-slate-800 shadow-sm"
    },
    royal: {
      bg: "bg-[#0b1b3d]",
      text: "text-indigo-100",
      border: "border-indigo-400/40",
      headerText: "text-indigo-200 font-black",
      cardBg: "bg-indigo-950/40 border-indigo-400/30 text-indigo-100"
    }
  };

  const FONT_CLASSES: Record<FontSizeOption, string> = {
    sm: "text-xs sm:text-sm leading-relaxed",
    md: "text-sm sm:text-base leading-relaxed",
    lg: "text-base sm:text-lg leading-loose",
    xl: "text-lg sm:text-xl leading-loose font-medium"
  };

  const stage = STAGES_DATA.find((s) => s.id === stageId) || STAGES_DATA[0];
  const lesson: StageLesson = stage.lessons[currentLessonIdx] || stage.lessons[0];
  const lessonKey = `${stage.id}-${currentLessonIdx}`;
  const isCompleted = completedLessons.includes(lessonKey);

  // Dynamic flashcards generated specifically for this lesson
  const lessonFlashcards = [
    {
      id: 1,
      tag: "المفهوم الأساسي للدرس",
      question: `ما الفكرة الجوهرية والمفهوم الرئيسي في درس "${lesson.title}"؟`,
      answer: lesson.keys && lesson.keys[0] ? lesson.keys[0] : lesson.body,
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
    },
    ...(lesson.keys && lesson.keys.length > 1
      ? lesson.keys.slice(1).map((keyPoint, idx) => ({
          id: idx + 2,
          tag: `القاعدة الذهبية ${idx + 1}`,
          question: `ما المبدأ أو القيد المحاسبي المتبع في "${lesson.title}"؟`,
          answer: keyPoint,
          badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40"
        }))
      : []),
    ...(lesson.exLabel && lesson.exText
      ? [
          {
            id: 88,
            tag: lesson.exLabel,
            question: `كيف تتم الصياغة أو القيد العملي في هذا الدرس؟`,
            answer: lesson.exText,
            badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40"
          }
        ]
      : []),
    {
      id: 99,
      tag: "الأثر والربط المالي",
      question: `ما أهمية الفهم الدقيق لدرس "${lesson.title}" على توازن القوائم والتقارير؟`,
      answer:
        "يضمن الالتزام التام بقاعدة القيد المزدوج، دقة العرض والإفصاح في القوائم المالية، والامتثال لمعايير IFRS الدولية.",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
    }
  ];

  const currentCard = lessonFlashcards[currentCardIdx] || lessonFlashcards[0];
  const cardKey = `${stage.id}-${currentLessonIdx}-${currentCard.id}`;
  const isCardMastered = masteredCards.includes(cardKey);

  // Typewriter live typing state for all lesson sections
  const [typedBody, setTypedBody] = useState("");
  const [typedKeys, setTypedKeys] = useState<string[]>([]);
  const [typedExText, setTypedExText] = useState("");
  const [activeTypingSection, setActiveTypingSection] = useState<"body" | "keys" | "exText" | "none">("body");
  const [activeKeyIdx, setActiveKeyIdx] = useState<number>(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setCurrentLessonIdx(initialLessonIndex);
    setActiveTab(initialTab);
    setCurrentCardIdx(0);
    setIsFlipped(false);
    setQuizSelectedOption(null);
    setQuizAnswered(false);
    setAiReply(null);
  }, [stageId, initialLessonIndex, initialTab]);

  // Live typewriter effect whenever stage or lesson changes
  useEffect(() => {
    setIsTyping(true);
    setTypedBody("");
    const keysArr = lesson?.keys || [];
    setTypedKeys(keysArr.map(() => ""));
    setTypedExText("");
    setActiveTypingSection("body");
    setActiveKeyIdx(0);

    const bodyText = lesson?.body || "";
    const exText = lesson?.exText || "";

    let currentSection: "body" | "keys" | "exText" = "body";
    let bodyPos = 0;
    let keyIdx = 0;
    let keyCharPos = 0;
    let exPos = 0;

    let localBody = "";
    let localKeys = keysArr.map(() => "");
    let localEx = "";

    const CHAR_STEP = 6;
    const interval = setInterval(() => {
      if (currentSection === "body") {
        if (bodyPos < bodyText.length) {
          bodyPos = Math.min(bodyText.length, bodyPos + CHAR_STEP);
          localBody = bodyText.slice(0, bodyPos);
          setTypedBody(localBody);
        } else {
          if (keysArr.length > 0) {
            currentSection = "keys";
            setActiveTypingSection("keys");
            setActiveKeyIdx(0);
          } else if (exText) {
            currentSection = "exText";
            setActiveTypingSection("exText");
          } else {
            setIsTyping(false);
            setActiveTypingSection("none");
            clearInterval(interval);
          }
        }
      } else if (currentSection === "keys") {
        if (keyIdx < keysArr.length) {
          const currentKeyStr = keysArr[keyIdx];
          if (keyCharPos < currentKeyStr.length) {
            keyCharPos = Math.min(currentKeyStr.length, keyCharPos + CHAR_STEP);
            localKeys = [...localKeys];
            localKeys[keyIdx] = currentKeyStr.slice(0, keyCharPos);
            setTypedKeys(localKeys);
          } else {
            keyIdx += 1;
            keyCharPos = 0;
            setActiveKeyIdx(keyIdx);
          }
        } else {
          if (exText) {
            currentSection = "exText";
            setActiveTypingSection("exText");
          } else {
            setIsTyping(false);
            setActiveTypingSection("none");
            clearInterval(interval);
          }
        }
      } else if (currentSection === "exText") {
        if (exPos < exText.length) {
          exPos = Math.min(exText.length, exPos + CHAR_STEP);
          localEx = exText.slice(0, exPos);
          setTypedExText(localEx);
        } else {
          setIsTyping(false);
          setActiveTypingSection("none");
          clearInterval(interval);
        }
      }
    }, 10); // Fast & responsive live typing pace (600 chars/sec)

    return () => clearInterval(interval);
  }, [stageId, currentLessonIdx, lesson?.body, lesson?.keys, lesson?.exText]);

  const skipTyping = () => {
    setTypedBody(lesson?.body || "");
    setTypedKeys(lesson?.keys ? [...lesson.keys] : []);
    setTypedExText(lesson?.exText || "");
    setIsTyping(false);
    setActiveTypingSection("none");
  };

  const replayTyping = () => {
    setIsTyping(true);
    setTypedBody("");
    const keysArr = lesson?.keys || [];
    setTypedKeys(keysArr.map(() => ""));
    setTypedExText("");
    setActiveTypingSection("body");
    setActiveKeyIdx(0);

    const bodyText = lesson?.body || "";
    const exText = lesson?.exText || "";

    let currentSection: "body" | "keys" | "exText" = "body";
    let bodyPos = 0;
    let keyIdx = 0;
    let keyCharPos = 0;
    let exPos = 0;

    let localBody = "";
    let localKeys = keysArr.map(() => "");
    let localEx = "";

    const CHAR_STEP = 6;
    const interval = setInterval(() => {
      if (currentSection === "body") {
        if (bodyPos < bodyText.length) {
          bodyPos = Math.min(bodyText.length, bodyPos + CHAR_STEP);
          localBody = bodyText.slice(0, bodyPos);
          setTypedBody(localBody);
        } else {
          if (keysArr.length > 0) {
            currentSection = "keys";
            setActiveTypingSection("keys");
            setActiveKeyIdx(0);
          } else if (exText) {
            currentSection = "exText";
            setActiveTypingSection("exText");
          } else {
            setIsTyping(false);
            setActiveTypingSection("none");
            clearInterval(interval);
          }
        }
      } else if (currentSection === "keys") {
        if (keyIdx < keysArr.length) {
          const currentKeyStr = keysArr[keyIdx];
          if (keyCharPos < currentKeyStr.length) {
            keyCharPos = Math.min(currentKeyStr.length, keyCharPos + CHAR_STEP);
            localKeys = [...localKeys];
            localKeys[keyIdx] = currentKeyStr.slice(0, keyCharPos);
            setTypedKeys(localKeys);
          } else {
            keyIdx += 1;
            keyCharPos = 0;
            setActiveKeyIdx(keyIdx);
          }
        } else {
          if (exText) {
            currentSection = "exText";
            setActiveTypingSection("exText");
          } else {
            setIsTyping(false);
            setActiveTypingSection("none");
            clearInterval(interval);
          }
        }
      } else if (currentSection === "exText") {
        if (exPos < exText.length) {
          exPos = Math.min(exText.length, exPos + CHAR_STEP);
          localEx = exText.slice(0, exPos);
          setTypedExText(localEx);
        } else {
          setIsTyping(false);
          setActiveTypingSection("none");
          clearInterval(interval);
        }
      }
    }, 10);
  };

  const toggleMasterCard = () => {
    let updated: string[];
    if (isCardMastered) {
      updated = masteredCards.filter((k) => k !== cardKey);
    } else {
      updated = [...masteredCards, cardKey];
    }
    setMasteredCards(updated);
    try {
      localStorage.setItem("meezan_mastered_lesson_cards", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Particles Celebration State
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMsg, setCelebrationMsg] = useState("");

  const toggleComplete = () => {
    let updated: string[];
    const willComplete = !isCompleted;
    if (isCompleted) {
      updated = completedLessons.filter((k) => k !== lessonKey);
    } else {
      updated = [...completedLessons, lessonKey];
    }
    setCompletedLessons(updated);
    try {
      localStorage.setItem("meezan_completed_lessons", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    if (willComplete) {
      fireCelebrationParticles();
      setCelebrationMsg(`مبارك! أكملت درس "${lesson.title}" بنجاح 🎉`);
      setShowCelebration(true);
      if (onCompleteLesson) {
        onCompleteLesson(stageId, currentLessonIdx, 30);
      }
    }
  };

  // Accountant's Notes helper state & handlers
  const [noteToast, setNoteToast] = useState<string | null>(null);
  const [noteSearchQuery, setNoteSearchQuery] = useState("");
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saving" | "saved">("saved");
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  const triggerNoteToast = (msg: string) => {
    setNoteToast(msg);
    setTimeout(() => setNoteToast(null), 3000);
  };

  const handleSaveNote = (text: string) => {
    setAutoSaveStatus("saving");
    const updated = { ...lessonNotes, [lessonKey]: text };
    setLessonNotes(updated);
    try {
      localStorage.setItem("meezan_lesson_notes", JSON.stringify(updated));
      const timeStr = new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setLastSavedTime(timeStr);
    } catch (e) {
      console.error(e);
    }
    setTimeout(() => {
      setAutoSaveStatus("saved");
    }, 400);
  };

  const handleInsertNoteTag = (tag: string) => {
    const currentNote = lessonNotes[lessonKey] || "";
    const updated = currentNote ? `${currentNote}\n${tag}` : tag;
    handleSaveNote(updated);
    triggerNoteToast("تم إدراج الكبسولة المحاسبية 💡");
  };

  const handleCopyCurrentNote = () => {
    const currentNote = lessonNotes[lessonKey] || "";
    if (!currentNote.trim()) {
      triggerNoteToast("الملاحظة فارغة حالياً!");
      return;
    }
    navigator.clipboard.writeText(currentNote);
    triggerNoteToast("تم نسخ ملاحظة المحاسب إلى الحافظة 📋");
  };

  const handleClearCurrentNote = () => {
    if (window.confirm("هل أنت تأكد من مسح ملاحظتك لهذا الدرس؟")) {
      handleSaveNote("");
      triggerNoteToast("تم مسح الملاحظة بنجاح 🗑️");
    }
  };

  const handleExportSingleNoteTxt = () => {
    const currentNote = lessonNotes[lessonKey] || "";
    if (!currentNote.trim()) {
      triggerNoteToast("لا توجد ملاحظات مدونة لتصديرها!");
      return;
    }
    const content = `=======================================\nملاحظات المحاسب - ${lesson.title}\nالمرحلة: ${stage.name}\nتاريخ التصدير: ${new Date().toLocaleDateString('ar-SA')}\n=======================================\n\n${currentNote}\n\n---\nتم التصدير من برنامج ميزان المحاسبي التعليمي`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ملاحظات_محاسبية_${lesson.title.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    triggerNoteToast("تم تصدير ملف الملاحظة بنجاح 📥");
  };

  const handleExportAllNotesTxt = () => {
    const savedKeys = Object.keys(lessonNotes).filter((k) => lessonNotes[k] && lessonNotes[k].trim() !== "");
    if (savedKeys.length === 0) {
      alert("لا توجد ملاحظات محفوظة حتى الآن لتصديرها!");
      return;
    }
    let fullDoc = `=======================================\n كشكول ملاحظات المحاسب الشامل (جميع الدروس)\n تاريخ التنسيق: ${new Date().toLocaleDateString('ar-SA')}\n إجمالي الدروس المحفوظة: ${savedKeys.length}\n=======================================\n\n`;

    savedKeys.forEach((key, index) => {
      const [sIdStr, lIdxStr] = key.split("-");
      const sId = parseInt(sIdStr, 10);
      const lIdx = parseInt(lIdxStr, 10);
      const stg = STAGES_DATA.find((s) => s.id === sId);
      const les = stg?.lessons[lIdx];
      fullDoc += `---------------------------------------\n[${index + 1}] المرحلة ${stg?.id || sId}: ${stg?.name || "غير محددة"} - درس: ${les?.title || key}\n---------------------------------------\n${lessonNotes[key]}\n\n`;
    });

    fullDoc += `\n=======================================\nتم إنشاء هذا الكشكول بواسطة تطبيق ميزان المحاسبي التعليمي`;
    const blob = new Blob([fullDoc], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `كشكول_ملاحظات_المحاسب_الكامل.txt`;
    a.click();
    URL.revokeObjectURL(url);
    triggerNoteToast("تم تصدير الكشكول الشامل لجميع الملاحظات 📚");
  };

  // Generate dynamic quiz options based on lesson keys
  const quizQuestions = [
    {
      q: `ما القيمة أو الفكرة الجوهرية في درس "${lesson.title}"؟`,
      options: [
        lesson.keys[0] || "التوازن بين الطرف المدين والطرف الدائن في جميع العمليات",
        "تسجيل المبيعات فقط بدون التأثير على الأصول",
        "تجاهل التكاليف والإهلاك في الميزانية العمومية",
        "إلغاء دفتر اليومية والاعتماد على السجلات الشفهية"
      ],
      correctIdx: 0,
      explanation: "الصحة والدقة المحاسبية تعتمد دائماً على المبدأ الأساسي والتوازن الدائم بين طرفي القيد المزدوج."
    }
  ];

  const handleAiAsk = async () => {
    if (!aiQuery.trim() || aiLoading) return;
    setAiLoading(true);
    setAiReply(null);

    try {
      const prompt = `أنا أدرس درس "${lesson.title}" في مرحلة "${stage.name}". سؤالي هو: ${aiQuery}. أشرح لي بأسلوب محاسبي مبسط وعملي باللغة العربية.`;
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, history: [] })
      });
      const data = await res.json();
      if (res.ok && data.reply) {
        setAiReply(data.reply);
      } else {
        setAiReply("تعذر الحصول على إجابة حالياً. حاول مرة أخرى.");
      }
    } catch {
      setAiReply("حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.");
    } finally {
      setAiLoading(false);
    }
  };

  // Navigation handlers
  const handlePrevLesson = () => {
    if (currentLessonIdx > 0) {
      onSelectStageLesson(stage.id, currentLessonIdx - 1);
    } else if (stage.id > 1) {
      const prevStage = STAGES_DATA.find((s) => s.id === stage.id - 1);
      if (prevStage) {
        onSelectStageLesson(prevStage.id, prevStage.lessons.length - 1);
      }
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIdx < stage.lessons.length - 1) {
      onSelectStageLesson(stage.id, currentLessonIdx + 1);
    } else {
      if (activeTab !== "quiz") {
        setActiveTab("quiz");
        window.scrollTo({ top: 300, behavior: "smooth" });
      } else if (stage.id < STAGES_DATA.length) {
        onSelectStageLesson(stage.id + 1, 0);
      }
    }
  };

  return (
    <section className="py-6 max-w-7xl mx-auto px-4 min-h-[85vh] animate-fadeIn">
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 border border-indigo-500/40 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-xl shadow-indigo-600/20">
        <button
          onClick={onBackToPath}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 border border-white/40 text-white font-extrabold text-xs cursor-pointer transition-all hover:-translate-x-1"
        >
          <ArrowRight className="w-4 h-4 text-white" />
          <span>العودة إلى خريطة المراحل</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/25 border border-white/40 flex items-center justify-center text-xl shadow-md">
            {stage.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-indigo-100">
              <span>مرحلة {stage.id} من {STAGES_DATA.length}</span>
              <span>·</span>
              <span className="text-white/90">{stage.levelBadge}</span>
            </div>
            <h1 className="text-base sm:text-lg font-black text-white">
              {stage.name}
            </h1>
          </div>
        </div>

        {/* Sidebar Toggle for Mobile */}
        <button
          onClick={() => setShowStageSidebar(!showStageSidebar)}
          className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 border border-indigo-400 text-white font-bold text-xs cursor-pointer shadow-md shadow-indigo-600/25"
        >
          <List className="w-4 h-4 text-white" />
          <span>فهرس الوحدات ({stage.lessons.length} وحدة)</span>
        </button>
      </div>

      {/* Main Grid: Sidebar + Lesson Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sidebar Index Panel (Desktop & Mobile Drawer) */}
        <div
          className={`lg:col-span-4 bg-[#0d1424] border border-white/10 rounded-3xl p-5 shadow-xl space-y-4 ${
            showStageSidebar ? "block" : "hidden lg:block"
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-black text-sm text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span>وحدات المرحلة ({stage.lessons.length} وحدة)</span>
            </h3>

            <span className="text-[11px] font-bold text-amber-700 bg-amber-500/15 px-2.5 py-1 rounded-full border border-amber-400/40">
              +{stage.xp} XP
            </span>
          </div>

          {/* Lessons List Buttons */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto no-scrollbar pr-1">
            {stage.lessons.map((les, idx) => {
              const lKey = `${stage.id}-${idx}`;
              const done = completedLessons.includes(lKey);
              const isCurrent = idx === currentLessonIdx;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectStageLesson(stage.id, idx);
                    setShowStageSidebar(false);
                  }}
                  className={`w-full p-3.5 rounded-2xl text-right transition-all flex items-center justify-between cursor-pointer border ${
                    isCurrent
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/25 font-black"
                      : "bg-[#101a30] hover:bg-[#14213d] border-white/5 text-gray-300 font-bold"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                        done
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : isCurrent
                          ? "bg-indigo-500 text-white"
                          : "bg-white/5 text-gray-400"
                      }`}
                    >
                      {done ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </span>

                    <span className="text-xs sm:text-sm line-clamp-1">
                      {les.title}
                    </span>
                  </div>

                  <ChevronLeft className={`w-4 h-4 ${isCurrent ? "text-indigo-300" : "text-gray-500"}`} />
                </button>
              );
            })}
          </div>

          {/* All Stages Quick Switcher Dropdown */}
          <div className="pt-3 border-t border-white/10">
            <label className="block text-[11px] font-bold text-gray-400 mb-1">
              الانتقال لمرحلة أخرى:
            </label>
            <select
              value={stage.id}
              onChange={(e) => onSelectStageLesson(Number(e.target.value), 0)}
              className="w-full bg-[#080c1c] border border-white/10 rounded-xl p-2.5 text-xs text-white font-bold outline-none focus:border-indigo-400"
            >
              {STAGES_DATA.map((s) => (
                <option key={s.id} value={s.id}>
                  مرحلة {s.id}: {s.name} ({s.lessons.length} وحدة)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Lesson Content Canvas */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Lesson Card Container */}
          <div className="bg-[#0d1424] border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Lesson Title Banner */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-indigo-300">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                    الوحدة {currentLessonIdx + 1} من {stage.lessons.length}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <Zap className="w-3.5 h-3.5 fill-amber-400" />
                    +{stage.xp} XP
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  {lesson.title}
                </h2>
              </div>

              {/* Header Actions: Focus Mode + Complete Toggle */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsFocusMode(true)}
                  className="px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-white border border-amber-300 shadow-lg shadow-amber-500/25"
                  title="تفعيل وضع التركيز الخالي من المشتتات بالقراءة"
                >
                  <Maximize2 className="w-4 h-4 text-white" />
                  <span>وضع التركيز 🎯</span>
                </button>

                <button
                  onClick={toggleComplete}
                  className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer border shadow-md ${
                    isCompleted
                      ? "bg-emerald-500 text-white border-emerald-300 shadow-emerald-500/30"
                      : "bg-white/80 hover:bg-white text-indigo-700 border-indigo-400/40"
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${isCompleted ? "text-white" : "text-emerald-500"}`} />
                  <span>{isCompleted ? "مكتمل ✅" : "تعليم كمكتمل"}</span>
                </button>
              </div>
            </div>

            {/* Interactive Section Tabs */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab("read")}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all border whitespace-nowrap ${
                  activeTab === "read"
                    ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30"
                    : "bg-white/5 text-gray-400 border-white/5 hover:text-white"
                }`}
              >
                <FileText className="w-4 h-4 text-indigo-300" />
                <span>الشرح والقواعد</span>
              </button>

              <button
                onClick={() => setActiveTab("flashcards")}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all border whitespace-nowrap ${
                  activeTab === "flashcards"
                    ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30"
                    : "bg-white/5 text-gray-400 border-white/5 hover:text-white"
                }`}
              >
                <GraduationCap className="w-4 h-4 text-pink-400" />
                <span>بطاقات الدرس 🎴</span>
              </button>

              <button
                onClick={() => setActiveTab("quiz")}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all border whitespace-nowrap ${
                  activeTab === "quiz"
                    ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30"
                    : "bg-white/5 text-gray-400 border-white/5 hover:text-white"
                }`}
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>اختبار الفهم السريع</span>
              </button>

              <button
                onClick={() => setActiveTab("notes")}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all border whitespace-nowrap ${
                  activeTab === "notes"
                    ? "bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30"
                    : "bg-white/5 text-gray-400 border-white/5 hover:text-white"
                }`}
              >
                <Edit3 className="w-4 h-4 text-emerald-400" />
                <span>ملاحظات المحاسب 📝</span>
                {lessonNotes[lessonKey]?.trim() ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="يوجد ملاحظة حية للدرس" />
                ) : null}
              </button>

              <button
                onClick={() => setActiveTab("ai")}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all border whitespace-nowrap ${
                  activeTab === "ai"
                    ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30"
                    : "bg-white/5 text-gray-400 border-white/5 hover:text-white"
                }`}
              >
                <Bot className="w-4 h-4 text-purple-400" />
                <span>اسأل الذكاء الاصطناعي</span>
              </button>
            </div>

            {/* Tab 1: Lesson Body & Visual Rules */}
            {activeTab === "read" && (
              <div className="space-y-6 animate-fadeIn">
                {/* Reading Customization Toolbar (أحجام الخطوط وأنظمة الألوان 🎨) */}
                <div className="p-3.5 rounded-2xl bg-[#0c1326] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
                  {/* Theme Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-extrabold flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-indigo-400" />
                      <span>نمط شاشة القراءة:</span>
                    </span>
                    <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                      <button
                        onClick={() => handleSetTheme("dark")}
                        className={`px-2.5 py-1 rounded-lg font-black transition-all cursor-pointer flex items-center gap-1 ${
                          readingTheme === "dark"
                            ? "bg-indigo-600 text-white shadow-md"
                            : "text-slate-400 hover:text-white"
                        }`}
                        title="الوضع الداكن (الافتراضي)"
                      >
                        <Moon className="w-3 h-3 text-indigo-300" />
                        <span>داكن</span>
                      </button>

                      <button
                        onClick={() => handleSetTheme("warm")}
                        className={`px-2.5 py-1 rounded-lg font-black transition-all cursor-pointer flex items-center gap-1 ${
                          readingTheme === "warm"
                            ? "bg-amber-600 text-white shadow-md"
                            : "text-slate-400 hover:text-white"
                        }`}
                        title="الوضع الدافئ المريح للعين (Sepia)"
                      >
                        <Coffee className="w-3 h-3 text-amber-300" />
                        <span>دافئ</span>
                      </button>

                      <button
                        onClick={() => handleSetTheme("royal")}
                        className={`px-2.5 py-1 rounded-lg font-black transition-all cursor-pointer flex items-center gap-1 ${
                          readingTheme === "royal"
                            ? "bg-blue-600 text-white shadow-md"
                            : "text-slate-400 hover:text-white"
                        }`}
                        title="الوضع الأزرق الملكي"
                      >
                        <Sparkles className="w-3 h-3 text-indigo-200" />
                        <span>ملكي</span>
                      </button>

                      <button
                        onClick={() => handleSetTheme("light")}
                        className={`px-2.5 py-1 rounded-lg font-black transition-all cursor-pointer flex items-center gap-1 ${
                          readingTheme === "light"
                            ? "bg-slate-200 text-slate-900 shadow-md"
                            : "text-slate-400 hover:text-white"
                        }`}
                        title="الوضع الفاتح الناصع"
                      >
                        <Sun className="w-3 h-3 text-amber-500" />
                        <span>فاتح</span>
                      </button>
                    </div>
                  </div>

                  {/* Font Size Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-extrabold flex items-center gap-1.5">
                      <Type className="w-4 h-4 text-purple-400" />
                      <span>حجم الخط:</span>
                    </span>
                    <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 font-mono">
                      {(["sm", "md", "lg", "xl"] as const).map((sz) => (
                        <button
                          key={sz}
                          onClick={() => handleSetFontSize(sz)}
                          className={`px-2.5 py-1 rounded-lg font-black transition-all cursor-pointer text-xs ${
                            fontSize === sz
                              ? "bg-purple-600 text-white shadow-md"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {sz === "sm" ? "صغير" : sz === "md" ? "عادي" : sz === "lg" ? "كبير" : "ضخم"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Focus Mode Button */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsFocusMode(!isFocusMode)}
                      className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 border ${
                        isFocusMode
                          ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white border-amber-300 shadow-md shadow-amber-500/30"
                          : "bg-white/70 hover:bg-white text-amber-700 border-amber-400/40"
                      }`}
                      title="تفعيل وضع التركيز لإخفاء جميع القوائم والمشتتات"
                    >
                      <Maximize2 className={`w-3.5 h-3.5 ${isFocusMode ? "text-white" : "text-amber-500"}`} />
                      <span>{isFocusMode ? "خروج من وضع التركيز" : "وضع التركيز 🎯"}</span>
                    </button>
                  </div>
                </div>

                {/* Explanation Paragraph with Typewriter Live Writing Animation */}
                <div className={`${THEME_STYLES[readingTheme].bg} p-5 sm:p-6 rounded-2xl border ${THEME_STYLES[readingTheme].border} ${FONT_CLASSES[fontSize]} ${THEME_STYLES[readingTheme].text} relative group transition-colors duration-300`}>
                  <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                    <span className={`text-xs font-black ${THEME_STYLES[readingTheme].headerText} flex items-center gap-2`}>
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span className="unit-title">الشرح والمفهوم المحاسبي (كتابة تفاعلية حية ✍️):</span>
                    </span>

                    <div className="flex items-center gap-2">
                      {isTyping ? (
                        <button
                          onClick={skipTyping}
                          className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-500/30 text-[11px] font-bold cursor-pointer transition-all"
                        >
                          تخطي وتفريغ النص كاملاً ⚡
                        </button>
                      ) : (
                        <button
                          onClick={replayTyping}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1"
                        >
                          <RotateCw className="w-3 h-3 text-indigo-400" />
                          <span>إعادة الكتابة ✍️</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="whitespace-pre-wrap leading-relaxed text-gray-100">
                    <AnnotatedText text={typedBody} />
                    {activeTypingSection === "body" && (
                        <span className="typing-caret" />
                    )}
                  </div>
                </div>

                {/* Interactive Terms Widget for the Lesson */}
                <LessonTermsWidget textContent={lesson.body + " " + (lesson.keys?.join(" ") || "")} />

                {/* Golden Key Rules */}
                {lesson.keys && lesson.keys.length > 0 && (typedKeys.some((k) => k.length > 0) || !isTyping) && (
                  <div className="golden-rules rounded-2xl p-5 space-y-4 shadow-lg animate-fadeIn relative overflow-hidden animate-pulse-aura">
                    <div className="gr-glow absolute -top-12 -left-12 w-40 h-40 rounded-full blur-3xl pointer-events-none" />
                    <h3 className="gr-head font-black text-sm flex items-center gap-2 relative">
                      <span className="gr-icon w-8 h-8 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </span>
                      <span>النقاط المحاسبية والقواعد الذهبية:</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 relative">
                      {lesson.keys.map((_, idx) => {
                        const textVal = typedKeys[idx] || "";
                        if (!textVal && isTyping && activeTypingSection === "body") return null;
                        return (
                          <div
                            key={idx}
                            className="gr-item group p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2.5 animate-fadeIn transition-all hover:-translate-y-0.5"
                          >
                            <span className="gr-num shrink-0 w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="flex-1">
                              <AnnotatedText text={textVal} />
                              {activeTypingSection === "keys" && activeKeyIdx === idx && (
                                <span className="typing-caret" />
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Practical Example Box formatted as Accounting Ledger */}
                {lesson.exLabel && lesson.exText && (typedExText.length > 0 || !isTyping) && (
                  <div className="bg-[#101a30] border border-amber-500/30 p-5 rounded-2xl space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-xs text-amber-300 flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>{lesson.exLabel}</span>
                      </h3>
                      <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                        معمل القيد المحاسبي
                      </span>
                    </div>

                    <pre className="text-xs sm:text-sm text-amber-100 font-mono leading-relaxed whitespace-pre-wrap bg-[#080c1c] p-4 rounded-xl border border-amber-500/20 shadow-inner">
                      {typedExText}
                      {activeTypingSection === "exText" && (
                        <span className="typing-caret" />
                      )}
                    </pre>
                  </div>
                )}

                {/* Accountant Note Callout Card in Reading Mode */}
                {lessonNotes[lessonKey]?.trim() && (
                  <div className="bg-emerald-950/30 border border-emerald-500/30 p-4 sm:p-5 rounded-2xl space-y-2 shadow-lg">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-black text-emerald-300 flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-emerald-400" />
                        <span>ملاحظة المحاسب المدونة لهذا الدرس:</span>
                      </h4>
                      <button
                        onClick={() => setActiveTab("notes")}
                        className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 transition-all"
                      >
                        <span>تعديل الملاحظة</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-emerald-100 font-medium bg-black/40 p-3.5 rounded-xl border border-emerald-500/10 whitespace-pre-wrap leading-relaxed">
                      {lessonNotes[lessonKey]}
                    </p>
                  </div>
                )}

                {/* Direct to Quiz Banner on final lesson */}
                {currentLessonIdx === stage.lessons.length - 1 && (
                  <div className="bg-gradient-to-r from-amber-500/20 via-indigo-600/20 to-purple-600/20 border border-amber-500/40 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-white flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>أكملت جميع دروس هذه المرحلة!</span>
                      </h4>
                      <p className="text-xs text-gray-300">
                        الانتقال الآن لإجراء اختبار المرحلة وتقييم مدى استيعابك للمفاهيم المحاسبية.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab("quiz");
                        window.scrollTo({ top: 300, behavior: "smooth" });
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs cursor-pointer shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-transform hover:scale-105"
                    >
                      <span>بدء اختبار المرحلة 🎯</span>
                      <ArrowRight className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Lesson Flashcards */}
            {activeTab === "flashcards" && (
              <div className="space-y-6 animate-fadeIn">
                {/* Header Stats Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-[#101a30] p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-pink-400" />
                    <div>
                      <h3 className="font-black text-sm text-white">
                        البطاقات التعليمية للدرس ({lessonFlashcards.length} بطاقات)
                      </h3>
                      <p className="text-[11px] text-gray-400">
                        انقر على البطاقة لقلبها وقراءة القاعدة أو التوضيح المحاسبي
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-pink-300 bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
                      البطاقة {currentCardIdx + 1} من {lessonFlashcards.length}
                    </span>
                    {isCardMastered && (
                      <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>متقنة ✅</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* 3D Flippable Flashcard Card */}
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="w-full min-h-[260px] sm:min-h-[300px] cursor-pointer rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative transition-all duration-500 shadow-2xl border select-none group"
                  style={{
                    perspective: "1000px",
                    background: isFlipped
                      ? "linear-gradient(135deg, #131c38 0%, #1a103c 100%)"
                      : "linear-gradient(135deg, #0d1428 0%, #111a33 100%)",
                    borderColor: isFlipped ? "rgba(168, 85, 247, 0.5)" : "rgba(99, 102, 241, 0.4)"
                  }}
                >
                  {/* Card Top Row */}
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-black border ${currentCard.badgeColor}`}>
                      {currentCard.tag}
                    </span>

                    <span className="text-xs font-extrabold text-gray-400 flex items-center gap-1 group-hover:text-white transition-colors">
                      <RotateCw className={`w-3.5 h-3.5 transition-transform duration-500 ${isFlipped ? "rotate-180 text-purple-400" : "text-indigo-400"}`} />
                      <span>{isFlipped ? "قلب للسؤال 🔄" : "قلب للإجابة 🔄"}</span>
                    </span>
                  </div>

                  {/* Card Body Content */}
                  <div className="py-6 text-center space-y-3">
                    <span className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider block">
                      {isFlipped ? "💡 الشرح والقاعدة المحاسبية:" : "❓ السؤال / المفهوم:"}
                    </span>

                    <p className={`text-base sm:text-xl font-black leading-relaxed ${isFlipped ? "text-emerald-200" : "text-white"}`}>
                      {isFlipped ? currentCard.answer : currentCard.question}
                    </p>
                  </div>

                  {/* Card Bottom Prompt */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-gray-400 font-semibold">
                    <span className="flex items-center gap-1 text-indigo-300">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{lesson.title}</span>
                    </span>

                    <span className="text-[11px] text-gray-400">
                      انقر في أي مكان لقلب البطاقة 👆
                    </span>
                  </div>
                </div>

                {/* Flashcard Navigation Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setIsFlipped(false);
                        setCurrentCardIdx((prev) => (prev - 1 + lessonFlashcards.length) % lessonFlashcards.length);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer border border-white/10 transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                      <span>البطاقة السابقة</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsFlipped(false);
                        setCurrentCardIdx((prev) => (prev + 1) % lessonFlashcards.length);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/30 transition-all"
                    >
                      <span>البطاقة التالية</span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMasterCard}
                      className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer border transition-all ${
                        isCardMastered
                          ? "bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30"
                          : "bg-white/5 hover:bg-white/10 text-gray-300 border-white/10"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isCardMastered ? "تم الإتقان ✅" : "تعليم كـ متقن"}</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsFlipped(false);
                        const rand = Math.floor(Math.random() * lessonFlashcards.length);
                        setCurrentCardIdx(rand);
                      }}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 cursor-pointer"
                      title="ترتيب عشوائي"
                    >
                      <Shuffle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bottom Call to Action */}
                <div className="bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-blue-900/30 border border-purple-500/30 p-4 rounded-2xl flex items-center justify-between gap-3">
                  <div className="text-xs text-gray-300 font-semibold flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>راجعت بطاقات هذا الدرس؟ يمكنك الآن أداء اختبار الفهم السريع!</span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab("quiz");
                      window.scrollTo({ top: 300, behavior: "smooth" });
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs shrink-0 cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    اختبار الفهم 🎯
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Quick Quiz */}
            {activeTab === "quiz" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-[#101a30] p-6 rounded-2xl border border-amber-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                      تحدي استيعاب الدرس
                    </span>
                    <span className="text-xs text-gray-400">+10 XP</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-white">
                    {quizQuestions[0].q}
                  </h3>

                  <div className="space-y-2.5 pt-2">
                    {quizQuestions[0].options.map((opt, oIdx) => {
                      const isSelected = quizSelectedOption === oIdx;
                      const isCorrect = oIdx === quizQuestions[0].correctIdx;

                      let btnStyle = "bg-[#080c1c] border-white/10 text-gray-200 hover:border-amber-400/50";
                      if (quizAnswered) {
                        if (isCorrect) {
                          btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold";
                        } else if (isSelected) {
                          btnStyle = "bg-red-500/20 border-red-500 text-red-200 font-bold";
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={quizAnswered}
                          onClick={() => {
                            setQuizSelectedOption(oIdx);
                            setQuizAnswered(true);
                            if (!isCompleted) {
                              toggleComplete();
                            }
                          }}
                          className={`w-full p-4 rounded-xl text-right text-xs sm:text-sm transition-all border cursor-pointer flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizAnswered && isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizAnswered && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-3 animate-fadeIn">
                      <div className="flex items-center justify-between text-xs text-emerald-300 font-bold">
                        <span>🎉 {quizQuestions[0].explanation}</span>
                        <button
                          onClick={() => {
                            setQuizAnswered(false);
                            setQuizSelectedOption(null);
                          }}
                          className="flex items-center gap-1 text-amber-300 hover:underline cursor-pointer text-[11px]"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>إعادة التحدي</span>
                        </button>
                      </div>

                      <div className="pt-2 border-t border-emerald-500/20 flex justify-end">
                        <button
                          onClick={handleNextLesson}
                          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-lg"
                        >
                          <span>المتابعة إلى الدرس التالي</span>
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Accountant's Notes (ملاحظات المحاسب) */}
            {activeTab === "notes" && (
              <div className="space-y-6 animate-fadeIn">
                {/* Toast Notification */}
                {noteToast && (
                  <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-2xl border border-emerald-400 flex items-center gap-2 animate-bounce">
                    <CheckCheck className="w-4 h-4 text-emerald-200" />
                    <span>{noteToast}</span>
                  </div>
                )}

                {/* Section Header Card */}
                <div className="p-5 rounded-2xl bg-[#0c1326] border border-emerald-500/30 space-y-3 shadow-lg">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <Edit3 className="w-5 h-5" />
                        </span>
                        <div>
                          <h3 className="font-black text-base sm:text-lg text-white flex items-center gap-2">
                            <span>ملاحظات المحاسب الخاصة بدرس:</span>
                            <span className="text-emerald-400 font-extrabold">{lesson.title}</span>
                          </h3>
                          <p className="text-xs text-slate-400 font-semibold">
                            المرحلة {stage.id}: {stage.name} · كشكولك الخاص المدون والمحفوظ محلياً
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {autoSaveStatus === "saving" ? (
                        <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-extrabold flex items-center gap-1.5 animate-pulse">
                          <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                          <span>جاري الحفظ التلقائي...</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-extrabold flex items-center gap-1.5 shadow-sm">
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>محفوظ تلقائياً في LocalStorage {lastSavedTime ? `(${lastSavedTime})` : ""}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quick Tag Pills Bar (كبسولات المحاسب السريعة) */}
                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <span className="text-slate-400 font-bold text-xs flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-indigo-400" />
                      <span>إدراج كبسولات الملاحظات المحاسبية السريعة:</span>
                    </span>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {[
                        { label: "💡 قاعدة محاسبية:", style: "bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20" },
                        { label: "⚠️ تنبيه قيود:", style: "bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20" },
                        { label: "📌 معادلة ميزانية:", style: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20" },
                        { label: "💰 معالجة ضريبية:", style: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20" },
                        { label: "📝 تلخيص مراجعة:", style: "bg-purple-500/10 text-purple-300 border-purple-500/30 hover:bg-purple-500/20" },
                        { label: "🔍 سؤال للبحث والتأكيد:", style: "bg-sky-500/10 text-sky-300 border-sky-500/30 hover:bg-sky-500/20" }
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleInsertNoteTag(item.label)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${item.style}`}
                        >
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main Note Textarea Container */}
                <div className="space-y-2">
                  <div className="relative">
                    <textarea
                      rows={7}
                      value={lessonNotes[lessonKey] || ""}
                      onChange={(e) => handleSaveNote(e.target.value)}
                      placeholder="اكتب هنا ملاحظاتك المحاسبية وقواعد القيد والمعالجات التي ترغب بالرجوع إليها مستقبلاً أثناء الدراسة والمراجعة..."
                      className="w-full bg-[#080c1c] border border-emerald-500/30 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-white font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 resize-none shadow-inner leading-relaxed transition-all"
                    />

                    <div className="absolute bottom-3 left-4 flex items-center gap-3 text-[11px] text-gray-400 font-mono bg-black/60 px-3 py-1 rounded-xl border border-white/10 backdrop-blur-md">
                      <span>{(lessonNotes[lessonKey] || "").trim() ? (lessonNotes[lessonKey] || "").trim().split(/\s+/).length : 0} كلمة</span>
                      <span>·</span>
                      <span>{(lessonNotes[lessonKey] || "").length} حرف</span>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => {
                          handleSaveNote(lessonNotes[lessonKey] || "");
                          triggerNoteToast("تم حفظ الملاحظة بنجاح ✅");
                        }}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs cursor-pointer transition-all shadow-md shadow-emerald-600/30 flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>حفظ الملاحظة ✅</span>
                      </button>

                      <button
                        onClick={handleCopyCurrentNote}
                        disabled={!(lessonNotes[lessonKey] || "").trim()}
                        className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:pointer-events-none text-slate-200 border border-white/10 font-bold text-xs cursor-pointer transition-all flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4 text-indigo-400" />
                        <span>نسخ الملاحظة</span>
                      </button>

                      <button
                        onClick={handleExportSingleNoteTxt}
                        disabled={!(lessonNotes[lessonKey] || "").trim()}
                        className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:pointer-events-none text-slate-200 border border-white/10 font-bold text-xs cursor-pointer transition-all flex items-center gap-2"
                      >
                        <Download className="w-4 h-4 text-amber-400" />
                        <span>تصدير (.txt)</span>
                      </button>
                    </div>

                    {(lessonNotes[lessonKey] || "").trim() && (
                      <button
                        onClick={handleClearCurrentNote}
                        className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs cursor-pointer transition-all flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4 text-rose-400" />
                        <span>مسح</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Consolidated Accountant's Saved Notes Notebook (كشكول ملاحظات المحاسب لجميع الدروس) */}
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0e172e] to-[#0a0f20] border border-white/10 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="space-y-1">
                        <h4 className="font-black text-sm text-white flex items-center gap-2">
                          <Bookmark className="w-4 h-4 text-amber-400" />
                          <span>سجل جميع ملاحظات المحاسب المحفوظة لكافة الدروس</span>
                        </h4>
                        <p className="text-xs text-gray-400">
                          لديك {Object.keys(lessonNotes).filter((k) => lessonNotes[k] && lessonNotes[k].trim() !== "").length} ملاحظة محتواة في كشكولك
                        </p>
                      </div>

                      {Object.keys(lessonNotes).filter((k) => lessonNotes[k] && lessonNotes[k].trim() !== "").length > 0 && (
                        <button
                          onClick={handleExportAllNotesTxt}
                          className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs cursor-pointer transition-all flex items-center gap-2"
                        >
                          <Download className="w-4 h-4 text-amber-400" />
                          <span>تصدير كل الملاحظات (كتاب دراسي .txt) 📚</span>
                        </button>
                      )}
                    </div>

                    {/* Search bar inside notes */}
                    {Object.keys(lessonNotes).filter((k) => lessonNotes[k] && lessonNotes[k].trim() !== "").length > 0 && (
                      <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-3" />
                        <input
                          type="text"
                          value={noteSearchQuery}
                          onChange={(e) => setNoteSearchQuery(e.target.value)}
                          placeholder="ابحث في الكشكول عن كلمة مفتاحية، قيد، أو قاعدة..."
                          className="w-full bg-black/40 border border-white/10 rounded-xl pr-10 pl-4 py-2 text-xs text-white outline-none focus:border-amber-400"
                        />
                      </div>
                    )}

                    {/* Saved Notes Cards Grid */}
                    {(() => {
                      const allSavedKeys = Object.keys(lessonNotes).filter((k) => lessonNotes[k] && lessonNotes[k].trim() !== "");
                      const filteredKeys = allSavedKeys.filter((k) => {
                        if (!noteSearchQuery.trim()) return true;
                        const [sIdStr, lIdxStr] = k.split("-");
                        const sId = parseInt(sIdStr, 10);
                        const lIdx = parseInt(lIdxStr, 10);
                        const stg = STAGES_DATA.find((s) => s.id === sId);
                        const les = stg?.lessons[lIdx];
                        const text = (lessonNotes[k] + " " + (les?.title || "") + " " + (stg?.name || "")).toLowerCase();
                        return text.includes(noteSearchQuery.toLowerCase());
                      });

                      if (allSavedKeys.length === 0) {
                        return (
                          <div className="p-8 text-center bg-black/20 rounded-xl border border-white/5 space-y-2">
                            <Edit3 className="w-8 h-8 text-slate-500 mx-auto" />
                            <p className="text-xs text-slate-400 font-medium">لم تقم بتدوين أي ملاحظة بعد. اكتب ملاحظتك الأولى أعلاه وسوف تحفظ هنا تلقائياً!</p>
                          </div>
                        );
                      }

                      if (filteredKeys.length === 0) {
                        return (
                          <div className="p-6 text-center text-xs text-gray-400">
                            لا توجد نتائج تطابق بحثك عن "{noteSearchQuery}"
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                          {filteredKeys.map((key) => {
                            const [sIdStr, lIdxStr] = key.split("-");
                            const sId = parseInt(sIdStr, 10);
                            const lIdx = parseInt(lIdxStr, 10);
                            const stg = STAGES_DATA.find((s) => s.id === sId);
                            const les = stg?.lessons[lIdx];
                            const isCurrent = key === lessonKey;

                            return (
                              <div
                                key={key}
                                className={`p-4 rounded-xl border transition-all space-y-2 flex flex-col justify-between ${
                                  isCurrent
                                    ? "bg-emerald-950/30 border-emerald-500/50 ring-1 ring-emerald-500/30"
                                    : "bg-black/40 border-white/10 hover:border-white/20"
                                }`}
                              >
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] font-extrabold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                                      المرحلة {stg?.id || sId}: {stg?.name}
                                    </span>
                                    {isCurrent && (
                                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md">
                                        الدرس الحالي 📍
                                      </span>
                                    )}
                                  </div>

                                  <h5 className="font-bold text-xs text-white leading-snug">
                                    {les?.title || `درس ${lIdx + 1}`}
                                  </h5>

                                  <p className="text-xs text-slate-300 font-medium line-clamp-3 bg-black/40 p-2.5 rounded-lg border border-white/5 whitespace-pre-wrap">
                                    {lessonNotes[key]}
                                  </p>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                                  {!isCurrent ? (
                                    <button
                                      onClick={() => onSelectStageLesson(sId, lIdx)}
                                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                                    >
                                      <span>الانتقال للدرس</span>
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </button>
                                  ) : (
                                    <span className="text-[11px] text-emerald-400 font-bold">أنت تطالع هذا الدرس الآن</span>
                                  )}

                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(lessonNotes[key]);
                                      triggerNoteToast("تم النسخ 📋");
                                    }}
                                    className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
                                  >
                                    <Copy className="w-3 h-3" />
                                    <span>نسخ</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: AI Lesson Assistant */}
            {activeTab === "ai" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-[#101a30] p-5 rounded-2xl border border-purple-500/30 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                    <Bot className="w-4 h-4 text-purple-400" />
                    <span>اسأل الذكاء الاصطناعي حول موضوع: "{lesson.title}"</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAiAsk()}
                      placeholder="مثال: وضح لي مثالاً عملياً إضافياً بشركة تجارية..."
                      className="flex-1 bg-[#080c1c] border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-medium outline-none focus:border-purple-400"
                    />

                    <button
                      onClick={handleAiAsk}
                      disabled={aiLoading || !aiQuery.trim()}
                      className="px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-md shadow-purple-600/30"
                    >
                      {aiLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 rotate-180" />
                      )}
                      <span>سؤال</span>
                    </button>
                  </div>

                  {aiReply && (
                    <div className="p-4 bg-[#080c1c] border border-purple-500/30 rounded-xl text-xs sm:text-sm text-gray-200 leading-relaxed font-normal whitespace-pre-wrap animate-fadeIn">
                      {aiReply}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Footer */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
              <button
                onClick={handlePrevLesson}
                disabled={currentLessonIdx === 0 && stage.id === 1}
                className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-extrabold flex items-center gap-2 cursor-pointer border border-white/10 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
                <span>الدرس السابق</span>
              </button>

              <span className="text-xs font-bold text-gray-400">
                {currentLessonIdx + 1} من {stage.lessons.length}
              </span>

              <button
                onClick={handleNextLesson}
                disabled={currentLessonIdx === stage.lessons.length - 1 && activeTab === "quiz" && stage.id === STAGES_DATA.length}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30 transition-all"
              >
                <span>
                  {currentLessonIdx < stage.lessons.length - 1
                    ? "الدرس التالي"
                    : activeTab !== "quiz"
                    ? "بدء اختبار المرحلة 🎯"
                    : "المرحلة التالية"}
                </span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* FULLSCREEN FOCUS MODE OVERLAY (إخفاء كافة العناصر القوائم والتنقل بالشاشة الكاملة) */}
      {isFocusMode && (
        <div className="fixed inset-0 z-[99999] bg-[#070b19] w-screen h-screen min-h-screen overflow-y-auto m-0 p-3 sm:p-6 text-white flex flex-col items-center animate-fadeIn selection:bg-amber-500/30">
          
          {/* STICKY TOP FOCUS CONTROL HEADER BAR */}
          <div className="sticky top-0 z-50 w-full max-w-5xl bg-[#0d1428]/95 backdrop-blur-md border border-amber-500/40 rounded-2xl p-3 sm:p-4 mb-8 shadow-2xl flex flex-wrap items-center justify-between gap-4">
            {/* Left Info: Badge & Lesson Title */}
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>وضع التركيز 🎯</span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block font-bold">
                  مرحلة {stage.id}: {stage.name} · وحدة {currentLessonIdx + 1} من {stage.lessons.length}
                </span>
                <h2 className="text-sm sm:text-base font-black text-white line-clamp-1">
                  {lesson.title}
                </h2>
              </div>
            </div>

            {/* Middle Controls: Theme & Font quick toggles & Mini Pomodoro */}
            <div className="flex items-center gap-3">
              {/* Mini Pomodoro Indicator in Sticky Header */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-black/50 border border-amber-500/30 text-xs font-mono">
                <Timer className={`w-3.5 h-3.5 text-amber-400 ${pomoIsActive ? "animate-spin" : ""}`} />
                <span className="font-bold text-amber-300">{formatPomoTime(pomoSecondsLeft)}</span>
                <button
                  type="button"
                  onClick={pomoIsActive ? handlePausePomo : handleStartPomo}
                  className="p-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 cursor-pointer transition-all"
                  title={pomoIsActive ? "إيقاف مؤقت" : "تشغيل المؤقت"}
                >
                  {pomoIsActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-amber-300" />}
                </button>
              </div>

              {/* Quick Theme Switcher */}
              <div className="hidden md:flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
                {(["dark", "warm", "royal", "light"] as const).map((th) => (
                  <button
                    key={th}
                    onClick={() => handleSetTheme(th)}
                    className={`px-2 py-1 rounded-lg font-black text-[11px] transition-all cursor-pointer ${
                      readingTheme === th ? "bg-amber-500 text-slate-950 font-extrabold" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {th === "dark" ? "داكن" : th === "warm" ? "دافئ" : th === "royal" ? "ملكي" : "فاتح"}
                  </button>
                ))}
              </div>

              {/* Quick Font Size */}
              <div className="hidden lg:flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-mono">
                {(["sm", "md", "lg", "xl"] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => handleSetFontSize(sz)}
                    className={`px-2 py-0.5 rounded-lg font-black text-[11px] transition-all cursor-pointer ${
                      fontSize === sz ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {sz.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Action: Exit Focus Mode */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleComplete}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border cursor-pointer transition-all ${
                  isCompleted
                    ? "bg-emerald-600 text-white border-emerald-400"
                    : "bg-white/10 text-slate-300 border-white/10 hover:bg-white/20"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isCompleted ? "مكتمل ✅" : "إكمال"}</span>
              </button>

              <button
                onClick={() => setIsFocusMode(false)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                title="اضغط ESC أو انقر للعودة للواجهة الاعتيادية"
              >
                <Minimize2 className="w-4 h-4" />
                <span>خروج من وضع التركيز (ESC)</span>
              </button>
            </div>
          </div>

          {/* MAIN DISTRACTION-FREE CONTENT CONTAINER */}
          <div className="w-full max-w-4xl space-y-6 pb-16">
            
            {/* POMODORO TIMER CARD IN FOCUS MODE */}
            <div className="bg-[#0d1428] border border-amber-500/40 rounded-3xl p-5 shadow-2xl space-y-4 relative overflow-hidden">
              {/* Alert Banner when Pomodoro Session Completes */}
              {pomoAlertMsg && (
                <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-400/50 text-amber-200 text-xs font-black flex items-center justify-between gap-3 animate-bounce">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{pomoAlertMsg}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPomoAlertMsg("")}
                    className="text-amber-400 hover:text-white text-xs font-bold px-2.5 py-1 rounded-lg bg-black/40 border border-amber-400/30 cursor-pointer"
                  >
                    حسناً
                  </button>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Title & Mode */}
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 shadow-lg shadow-amber-500/10">
                    <Timer className={`w-6 h-6 ${pomoIsActive ? "animate-spin" : ""}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-white text-base">
                        مؤقت التركيز والبومودورو (Pomodoro)
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                        pomoMode === "work"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      }`}>
                        {pomoMode === "work" ? "جلسة مذاكرة وتركيز 🍅" : "استراحة راحة ☕"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      مؤقت زمني لتقسيم الجلسات والمحافظة على تركيزك العالي أثناء استيعاب المفاهيم المحاسبية.
                    </p>
                  </div>
                </div>

                {/* Stats Counter & Audio toggle */}
                <div className="flex items-center gap-3 text-xs font-bold">
                  <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-amber-300 flex items-center gap-1.5">
                    <span>🏆 الجلسات المكتملة:</span>
                    <span className="font-mono text-sm text-white font-black">{pomoCompletedSessions}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPomoSoundEnabled(!pomoSoundEnabled)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      pomoSoundEnabled
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        : "bg-white/5 text-slate-500 border-white/10"
                    }`}
                    title={pomoSoundEnabled ? "التنبيه الصوتي مفعّل" : "التنبيه الصوتي كتم"}
                  >
                    {pomoSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Timer Main Digital Display & Controls */}
              <div className="p-4 rounded-2xl bg-[#080d1e] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Time Display */}
                <div className="flex items-center gap-4">
                  <span className="font-mono font-black text-4xl sm:text-5xl text-amber-400 tracking-wider drop-shadow-md">
                    {formatPomoTime(pomoSecondsLeft)}
                  </span>

                  {/* Start / Pause / Reset */}
                  <div className="flex items-center gap-2">
                    {pomoIsActive ? (
                      <button
                        type="button"
                        onClick={handlePausePomo}
                        className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-amber-500/20"
                      >
                        <Pause className="w-4 h-4 fill-slate-950" />
                        <span>إيقاف مؤقت</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleStartPomo}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
                      >
                        <Play className="w-4 h-4 fill-slate-950" />
                        <span>بدء الجلسة 🎯</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleResetPomo}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs transition-all cursor-pointer"
                      title="إعادة ضبط المؤقت"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Preset interval selectors */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-400 font-bold block ml-1">أنظمة بومودورو:</span>
                  {[
                    { label: "25/5 د (قياسي 🍅)", work: 25, break: 5 },
                    { label: "15/3 د (سريع ⚡)", work: 15, break: 3 },
                    { label: "50/10 د (عميق 🧠)", work: 50, break: 10 }
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPomoPreset(item.work, item.break)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                        pomoWorkMinutes === item.work
                          ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm"
                          : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden border border-white/5">
                <div
                  className={`h-full transition-all duration-1000 ${
                    pomoMode === "work" ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-gradient-to-r from-emerald-500 to-teal-400"
                  }`}
                  style={{ width: `${pomoProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Lesson Reading Body Box */}
            <div className={`${THEME_STYLES[readingTheme].bg} p-6 sm:p-10 rounded-3xl border ${THEME_STYLES[readingTheme].border} ${FONT_CLASSES[fontSize]} ${THEME_STYLES[readingTheme].text} space-y-6 shadow-2xl relative transition-colors duration-300`}>
              
              {/* Title inside reading box */}
              <div className="border-b border-white/10 pb-4 flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-1">
                  <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>محتوى الدرس بوضع التركيز المباشر</span>
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    {lesson.title}
                  </h1>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {isTyping ? (
                    <button
                      onClick={skipTyping}
                      className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-500/30 text-xs font-bold cursor-pointer"
                    >
                      إظهار النص كاملاً ⚡
                    </button>
                  ) : (
                    <button
                      onClick={replayTyping}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-bold cursor-pointer flex items-center gap-1"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
                      <span>إعادة القراءة التفاعلية ✍️</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Text Body */}
              <div className="whitespace-pre-wrap leading-relaxed">
                <AnnotatedText text={typedBody} />
                {activeTypingSection === "body" && (
                  <span className="typing-caret" />
                )}
              </div>

              {/* Lesson Terms Widget */}
              <LessonTermsWidget textContent={lesson.body + " " + (lesson.keys?.join(" ") || "")} />

              {/* Key Points */}
              {lesson.keys && lesson.keys.length > 0 && (typedKeys.some((k) => k.length > 0) || !isTyping) && (
                <div className="golden-rules rounded-2xl p-5 space-y-4 shadow-lg relative overflow-hidden animate-pulse-aura">
                  <div className="gr-glow absolute -top-12 -left-12 w-40 h-40 rounded-full blur-3xl pointer-events-none" />
                  <h3 className="gr-head font-black text-sm flex items-center gap-2 relative">
                    <span className="gr-icon w-8 h-8 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </span>
                    <span>النقاط والقواعد الذهبية:</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 relative">
                    {lesson.keys.map((_, idx) => {
                      const textVal = typedKeys[idx] || "";
                      if (!textVal && isTyping && activeTypingSection === "body") return null;
                      return (
                        <div
                          key={idx}
                          className="gr-item group p-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-start gap-2.5 transition-all hover:-translate-y-0.5"
                        >
                          <span className="gr-num shrink-0 w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="flex-1">
                            <AnnotatedText text={textVal} />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Practical Example Box */}
              {lesson.exLabel && lesson.exText && (typedExText.length > 0 || !isTyping) && (
                <div className="bg-[#101a30] border border-amber-500/30 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-xs text-amber-300 flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>{lesson.exLabel}</span>
                    </h3>
                  </div>

                  <pre className="text-xs sm:text-sm text-amber-100 font-mono leading-relaxed whitespace-pre-wrap bg-[#080c1c] p-4 rounded-xl border border-amber-500/20">
                    {typedExText}
                  </pre>
                </div>
              )}

              {/* Personal Notes inside Focus Mode */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <h4 className="text-xs font-black text-emerald-400 flex items-center gap-2">
                  <Edit3 className="w-4 h-4" />
                  <span>ملاحظات سريعة أثناء التركيز:</span>
                </h4>
                <textarea
                  rows={3}
                  value={lessonNotes[lessonKey] || ""}
                  onChange={(e) => handleSaveNote(e.target.value)}
                  placeholder="اكتب ملاحظاتك وتلخيصك للدرس هنا..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-3.5 text-xs text-white font-medium outline-none focus:border-emerald-400 resize-none"
                />
              </div>
            </div>

            {/* Focus Mode Navigation Footer */}
            <div className="flex items-center justify-between gap-4 bg-[#0d1428] border border-white/10 p-4 rounded-2xl">
              <button
                onClick={handlePrevLesson}
                disabled={currentLessonIdx === 0 && stage.id === 1}
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-black flex items-center gap-2 cursor-pointer border border-white/10 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
                <span>الدرس السابق</span>
              </button>

              <span className="text-xs font-bold text-slate-300">
                الوحدة {currentLessonIdx + 1} من {stage.lessons.length}
              </span>

              <button
                onClick={handleNextLesson}
                disabled={currentLessonIdx === stage.lessons.length - 1 && stage.id === STAGES_DATA.length}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 transition-all"
              >
                <span>الدرس التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Celebration Particles Overlay */}
      <CelebrationParticles
        trigger={showCelebration}
        message={celebrationMsg}
        xpPoints={30}
        onComplete={() => setShowCelebration(false)}
      />
    </section>
  );
}
