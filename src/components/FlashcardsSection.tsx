import React, { useState, useEffect, useRef } from "react";
import { GlossaryData } from "../data/flashcards";
import { STAGES_DATA } from "../data/curriculum";
import { FlashCard } from "../types";
import { playSound } from "../utils/soundEffects";
import { speakText, stopSpeaking } from "../utils/textToSpeech";
import {
  recordSRSReview,
  getSRSStatusText,
  getOverallSRSStats,
  isCardDue,
  DifficultyRating
} from "../utils/spacedRepetition";
import {
  Volume2,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Search,
  BookOpen,
  Award,
  HelpCircle,
  Copy,
  Check,
  Zap,
  Flame,
  Target,
  Trophy,
  Filter,
  BarChart3,
  Layers,
  ArrowRight,
  BookmarkCheck,
  RefreshCw,
  Calendar,
  Clock,
  Brain,
  AlertCircle
} from "lucide-react";
import { MasteryPieChart } from "./MasteryPieChart";

type SectionTab = "cards" | "quiz" | "glossary" | "stats";

interface FlashcardsSectionProps {
  initialStageId?: number;
}

export function FlashcardsSection() {
  const [activeTab, setActiveTab] = useState<SectionTab>("cards");
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
  const [deck, setDeck] = useState<FlashCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("accounting_mastered_cards");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [totalXp, setTotalXp] = useState<number>(() => {
    try {
      return Number(localStorage.getItem("accounting_cards_xp")) || 0;
    } catch {
      return 0;
    }
  });

  // Drag state for touch swipe simulation
  const [dragX, setDragX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const startXRef = useRef<number>(0);

  // Search & Glossary state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Quiz Game state
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizStreak, setQuizStreak] = useState<number>(0);
  const [quizQuestions, setQuizQuestions] = useState<{
    card: FlashCard;
    options: string[];
    correctIndex: number;
  }[]>([]);
  const [quizStep, setQuizStep] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // Spaced Repetition System (SRS) state
  const [srsFilter, setSrsFilter] = useState<"all" | "due" | "hard">("all");
  const [srsToast, setSrsToast] = useState<{ message: string; badge: string; color: string } | null>(null);
  const [srsStatsRefresh, setSrsStatsRefresh] = useState<number>(0);

  // Save mastered cards & XP to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("accounting_mastered_cards", JSON.stringify(Array.from(masteredIds)));
    } catch (err) {
      console.error(err);
    }
  }, [masteredIds]);

  useEffect(() => {
    try {
      localStorage.setItem("accounting_cards_xp", totalXp.toString());
    } catch (err) {
      console.error(err);
    }
  }, [totalXp]);

  // Load deck when category or SRS filter changes
  useEffect(() => {
    loadDeck(selectedCategory, srsFilter);
  }, [selectedCategory, srsFilter, srsStatsRefresh]);

  const shuffleArray = <T,>(arr: T[]): T[] => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  const loadDeck = (catName: string, filterMode = srsFilter) => {
    let cards = GlossaryData.cardsByCategory(catName);

    if (filterMode === "due") {
      cards = cards.filter((c) => isCardDue(`${c.cat}::${c.ar}`));
    } else if (filterMode === "hard") {
      cards = cards.filter((c) => {
        const info = getSRSStatusText(`${c.cat}::${c.ar}`);
        return info.box === 1 || info.againCount > 0;
      });
    }

    setDeck(shuffleArray(cards));
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setIsFinished(false);
  };

  // SRS Rating Submission Handler
  const handleSRSAnswer = (rating: DifficultyRating) => {
    if (!currentCard) return;
    const key = `${currentCard.cat}::${currentCard.ar}`;

    const { updatedItem, isRequeue } = recordSRSReview(key, rating);
    setSrsStatsRefresh((prev) => prev + 1);

    const newMastered = new Set(masteredIds);

    if (rating === "hard") {
      playSound.error();
      newMastered.delete(key);
      setTotalXp((prev) => prev + 5);
      setSrsToast({
        message: "تم تعيين البطاقة كـ (صعبة) وإعادتها لنهاية الجلسة للتكرار المكثف 🧠",
        badge: "صندوق 1 (تكرار عاجل)",
        color: "border-rose-500/40 bg-rose-500/20 text-rose-300",
      });
    } else if (rating === "good") {
      playSound.success();
      setTotalXp((prev) => prev + 15);
      setSrsToast({
        message: `تم جدولة المراجعة بعد ${updatedItem.intervalDays} أيام 📅`,
        badge: `صندوق ${updatedItem.box} (ثبات متوسط)`,
        color: "border-amber-500/40 bg-amber-500/20 text-amber-300",
      });
    } else if (rating === "easy") {
      playSound.levelUp();
      newMastered.add(key);
      setTotalXp((prev) => prev + 25);
      setSrsToast({
        message: "أحسنت! أتقنت المصطلح وانتقل إلى الذاكرة الدائمة (+25 XP) 🎉",
        badge: `صندوق ${updatedItem.box} (ذاكرة مستقرة)`,
        color: "border-emerald-500/40 bg-emerald-500/20 text-emerald-300",
      });
    }
    setMasteredIds(newMastered);

    let newDeck = [...deck];
    if (isRequeue) {
      // Re-insert the card at the end of the current deck
      const [removedCard] = newDeck.splice(currentIndex, 1);
      newDeck.push(removedCard);
    }

    const nextIdx = currentIndex + 1;
    const finished = nextIdx >= newDeck.length && !isRequeue;

    setDeck(newDeck);
    setIsFlipped(false);
    setShowHint(false);

    if (finished) {
      playSound.levelUp();
      setIsFinished(true);
    } else {
      setCurrentIndex(Math.min(nextIdx, newDeck.length - 1));
    }

    setTimeout(() => {
      setSrsToast(null);
    }, 3200);
  };

  const currentCard = deck[currentIndex] || null;
  const progress = deck.length === 0 ? 0 : (currentIndex + 1) / deck.length;
  const progressLabel = deck.length === 0 ? "البطاقة 0" : `البطاقة ${currentIndex + 1} من ${deck.length}`;
  const masteredCount = masteredIds.size;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex >= deck.length - 1;

  // Category Mastery Stats for D3 Pie Chart
  const categoryCards = GlossaryData.cardsByCategory(selectedCategory);
  const totalInCat = categoryCards.length;
  const masteredInCat = categoryCards.filter((c) =>
    masteredIds.has(`${c.cat}::${c.ar}`)
  ).length;
  const remainingInCat = Math.max(0, totalInCat - masteredInCat);

  const isMastered = (card: FlashCard | null) => {
    if (!card) return false;
    return masteredIds.has(`${card.cat}::${card.ar}`);
  };

  const toggleMasteredGlobal = (card: FlashCard) => {
    const key = `${card.cat}::${card.ar}`;
    const newMastered = new Set(masteredIds);
    if (newMastered.has(key)) {
      newMastered.delete(key);
    } else {
      newMastered.add(key);
      setTotalXp((prev) => prev + 15);
    }
    setMasteredIds(newMastered);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
  };

  // Text-To-Speech function using imported utility
  const speakWord = (text: string, lang: "ar" | "en" = "en") => {
    speakText(text, lang);
  };

  const handleFlip = () => {
    playSound.flip();
    setIsFlipped((prev) => {
      const nextState = !prev;
      if (nextState && currentCard?.en) {
        speakText(currentCard.en);
      }
      return nextState;
    });
  };

  const handleNext = (mastered: boolean | null) => {
    if (!currentCard) return;
    const key = `${currentCard.cat}::${currentCard.ar}`;

    const newMastered = new Set(masteredIds);
    if (mastered === true) {
      playSound.success();
      if (!newMastered.has(key)) {
        newMastered.add(key);
        setTotalXp((prev) => prev + 20);
      }
    } else if (mastered === false) {
      playSound.click();
      newMastered.delete(key);
    } else {
      playSound.click();
    }
    setMasteredIds(newMastered);

    let newDeck = [...deck];
    if (mastered === false) {
      // Re-insert the unmastered card at the end of the deck for review
      const [removedCard] = newDeck.splice(currentIndex, 1);
      newDeck.push(removedCard);
    }

    const nextIdx = currentIndex + 1;
    const finished = nextIdx >= newDeck.length && mastered !== false;

    setDeck(newDeck);
    setIsFlipped(false);
    setShowHint(false);

    if (finished) {
      playSound.levelUp();
      setIsFinished(true);
    } else {
      setCurrentIndex(Math.min(nextIdx, newDeck.length - 1));
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
      setShowHint(false);
    }
  };

  const handleGoToCard = (idx: number) => {
    if (idx >= 0 && idx < deck.length) {
      setCurrentIndex(idx);
      setIsFlipped(false);
      setShowHint(false);
    }
  };

  const handleRestart = () => {
    loadDeck(selectedCategory);
  };

  // Keyboard Navigation Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== "cards" || isFinished) return;
      if (e.key === " " || e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        handleFlip();
      } else if (e.key === "ArrowLeft") {
        handleNext(null);
      } else if (e.key === "ArrowRight") {
        handlePrev();
      } else if (e.key === "m" || e.key === "M") {
        handleNext(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, isFinished, currentIndex, isFlipped]);

  // Swipe Gesture Handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    startXRef.current = clientX;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    setDragX(clientX - startXRef.current);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragX < -70) {
      handleNext(null);
    } else if (dragX > 70) {
      handlePrev();
    }
    setDragX(0);
  };

  // Copy helper
  const handleCopy = (card: FlashCard) => {
    const text = `${card.ar} (${card.en})\nالتصنيف: ${card.cat}\nالتلميح/التوضيح: ${card.hint}`;
    navigator.clipboard.writeText(text);
    const key = `${card.cat}::${card.ar}`;
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // ─────────────────────────────────────────────────────────────
  // QUIZ GAME GENERATION LOGIC
  // ─────────────────────────────────────────────────────────────
  const startQuizGame = () => {
    const cards = GlossaryData.cardsByCategory(selectedCategory);
    if (cards.length < 4) return;

    const shuffledCards = shuffleArray(cards).slice(0, 8);
    const allEnNames = cards.map((c) => c.en);

    const questions = shuffledCards.map((card: FlashCard) => {
      const correctEn = card.en;
      // Get 3 random wrong options
      const wrongOptions = shuffleArray(
        allEnNames.filter((en) => en !== correctEn)
      ).slice(0, 3);

      const options = shuffleArray([correctEn, ...wrongOptions]);
      const correctIndex = options.indexOf(correctEn);

      return {
        card,
        options,
        correctIndex
      };
    });

    setQuizQuestions(questions);
    setQuizStep(0);
    setQuizScore(0);
    setQuizStreak(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizFinished(false);
    setActiveTab("quiz");
  };

  const handleAnswerQuiz = (optIndex: number) => {
    if (isAnswered) return;
    setSelectedOption(optIndex);
    setIsAnswered(true);

    const currentQ = quizQuestions[quizStep];
    const isCorrect = optIndex === currentQ.correctIndex;

    if (isCorrect) {
      playSound.success();
      const addedXp = 20 + quizStreak * 5;
      setQuizScore((prev) => prev + addedXp);
      setQuizStreak((prev) => prev + 1);
      setTotalXp((prev) => prev + addedXp);

      // Auto mark card as mastered
      const key = `${currentQ.card.cat}::${currentQ.card.ar}`;
      setMasteredIds((prev) => new Set(prev).add(key));
      speakText(currentQ.card.en);
    } else {
      playSound.error();
      setQuizStreak(0);
    }
  };

  const handleNextQuiz = () => {
    if (quizStep + 1 >= quizQuestions.length) {
      playSound.levelUp();
      setQuizFinished(true);
    } else {
      playSound.click();
      setQuizStep((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  // Filtered glossary cards
  const allGlossaryCards = GlossaryData.cardsByCategory(selectedCategory);
  const filteredGlossary = allGlossaryCards.filter((card) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      card.ar.toLowerCase().includes(q) ||
      card.en.toLowerCase().includes(q) ||
      card.hint.toLowerCase().includes(q)
    );
  });

  return (
    <section className="py-8 max-w-5xl mx-auto px-4 space-y-8 animate-fadeIn">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-br from-[#0c102a] via-[#141240] to-[#0a1128] border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-black shadow-inner">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>المعجم والمصطلحات المحاسبية والمالية الشاملة</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            بطاقات المصطلحات والتحدي التفاعلي
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            أتقن أكثر من 70 مصطلحاً محاسبياً ومالياً بمعايير IFRS مع النطق الصوتي بالإنجليزية، البطاقات الثلاثية الأبعاد، وتحديات الاختبار اليومي السريع.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-extrabold text-indigo-300">
            <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>نطق صوتي تفاعلي</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-emerald-400" />
              <span>تحدي المطابقة اليومي</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>بحث في المعجم المحاسبي</span>
            </span>
          </div>
        </div>

        {/* User XP & Score Box */}
        <div className="z-10 w-full md:w-auto shrink-0 bg-black/40 border border-white/10 p-5 rounded-2xl backdrop-blur-xl space-y-3 min-w-[240px]">
          <div className="flex items-center justify-between text-xs font-black text-slate-300">
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>نقاط الخبرة والتقدّم</span>
            </span>
            <span className="text-amber-400 font-extrabold">{totalXp} XP</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold">
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl">
              <span className="text-emerald-400 block text-base font-black">{masteredCount}</span>
              <span className="text-[10px] text-slate-400">مصطلح مُتقن</span>
            </div>

            <div className="bg-indigo-500/10 border border-indigo-500/30 p-2.5 rounded-xl">
              <span className="text-indigo-300 block text-base font-black">
                {GlossaryData.allCards().length}
              </span>
              <span className="text-[10px] text-slate-400">إجمالي المعجم</span>
            </div>
          </div>

          <button
            onClick={startQuizGame}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all hover:scale-102"
          >
            <Flame className="w-4 h-4 text-slate-950" />
            <span>ابدأ تحدي الاختبار الآن</span>
          </button>
        </div>
      </div>

      {/* TABS SWITCHER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("cards")}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "cards"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-[#0d1424] text-slate-400 border border-white/10 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>البطاقات الذكية</span>
          </button>

          <button
            onClick={startQuizGame}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "quiz"
                ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30"
                : "bg-[#0d1424] text-slate-400 border border-white/10 hover:text-white"
            }`}
          >
            <Target className="w-4 h-4 text-emerald-400" />
            <span>تحدي الاختبار</span>
          </button>

          <button
            onClick={() => setActiveTab("glossary")}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "glossary"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30"
                : "bg-[#0d1424] text-slate-400 border border-white/10 hover:text-white"
            }`}
          >
            <Search className="w-4 h-4 text-cyan-400" />
            <span>المعجم والبحث</span>
          </button>

          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "stats"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                : "bg-[#0d1424] text-slate-400 border border-white/10 hover:text-white"
            }`}
          >
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <span>مؤشر الإتقان D3</span>
          </button>
        </div>

        {/* Selected Category Dropdown / Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full">
          {GlossaryData.categoryNames.map((cat) => {
            const isSelected = cat === selectedCategory;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-indigo-500/20 text-indigo-300 border-indigo-400 font-black"
                    : "bg-white/5 text-slate-400 border-white/10 hover:border-white/20 hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: SMART FLASHCARDS DECK
         ───────────────────────────────────────────────────────────── */}
      {activeTab === "cards" && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* SPACED REPETITION (SRS) OVERVIEW BANNER */}
          {(() => {
            const srsOverall = getOverallSRSStats(GlossaryData.allCards().map((c) => `${c.cat}::${c.ar}`));
            return (
              <div className="bg-[#0f172a] border border-indigo-500/30 rounded-2xl p-4 space-y-3 shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-amber-400" />
                    <div>
                      <h4 className="text-sm font-black text-white flex items-center gap-2">
                        <span>نظام التكرار المتباعد (Spaced Repetition)</span>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                          صناديق لايتنر 1-5
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        جدولة تلقائية ذكية للبطاقات بناءً على مستوى صعوبتها لضمان ترسيخها في الذاكرة الدائمة
                      </p>
                    </div>
                  </div>

                  {/* Quick SRS Mode Selector */}
                  <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 shrink-0">
                    <button
                      onClick={() => setSrsFilter("all")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        srsFilter === "all"
                          ? "bg-indigo-600 text-white font-black shadow"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      الكل ({deck.length})
                    </button>

                    <button
                      onClick={() => setSrsFilter("due")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        srsFilter === "due"
                          ? "bg-amber-600 text-white font-black shadow"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Clock className="w-3 h-3 text-amber-300" />
                      <span>المستحقة اليوم ({srsOverall.dueCount})</span>
                    </button>

                    <button
                      onClick={() => setSrsFilter("hard")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        srsFilter === "hard"
                          ? "bg-rose-600 text-white font-black shadow"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <AlertCircle className="w-3 h-3 text-rose-300" />
                      <span>الصعبة ({srsOverall.hardCardsCount})</span>
                    </button>
                  </div>
                </div>

                {/* Leitner Box Distribution Stats */}
                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
                  {[1, 2, 3, 4, 5].map((boxNum) => {
                    const count = srsOverall.boxDistribution[boxNum] || 0;
                    const boxLabels = [
                      "1: تكرار عاجل",
                      "2: بعد 3 أيام",
                      "3: بعد 7 أيام",
                      "4: بعد 14 يوم",
                      "5: ذاكرة دائمة"
                    ];
                    const boxColors = [
                      "border-rose-500/30 bg-rose-500/10 text-rose-300",
                      "border-amber-500/30 bg-amber-500/10 text-amber-300",
                      "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
                      "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
                      "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    ];
                    return (
                      <div key={boxNum} className={`p-1.5 rounded-xl border ${boxColors[boxNum - 1]}`}>
                        <div className="font-black text-xs text-white">{count}</div>
                        <div className="truncate font-semibold">{boxLabels[boxNum - 1]}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* SRS Toast Notification */}
          {srsToast && (
            <div className={`p-3.5 rounded-2xl border ${srsToast.color} flex items-center justify-between text-xs font-bold animate-fadeIn shadow-xl`}>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-amber-400" />
                <span>{srsToast.message}</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-black/40 text-[10px] font-black border border-white/10">
                {srsToast.badge}
              </span>
            </div>
          )}

          {/* Category Mastery D3 Widget */}
          <MasteryPieChart
            mastered={masteredInCat}
            remaining={remainingInCat}
            total={totalInCat}
            categoryName={selectedCategory}
          />

          {/* Progress bar */}
          <div className="space-y-1.5 px-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400">{progressLabel}</span>
              <span className="text-indigo-400 font-black">{Math.round(progress * 100)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 transition-all duration-300"
                style={{ width: `${Math.max(5, progress * 100)}%` }}
              />
            </div>
          </div>

          {/* MAIN CARD / FINISHED VIEW */}
          {isFinished ? (
            /* Finished View */
            <div className="bg-[#0d1424] border border-indigo-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl animate-fadeIn">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-bounce">
                <Trophy className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-white">أحسنت! أنهيت جلسة البطاقات والتكرار المتباعد 🎉</h3>
                <p className="text-sm text-slate-300 font-bold">
                  أتقنت <span className="text-emerald-400 font-black">{masteredCount}</span> من{" "}
                  <span className="text-indigo-300 font-black">{deck.length}</span> بطاقة في هذا التصنيف
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleRestart}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة الدورة التدريبية</span>
                </button>

                <button
                  onClick={startQuizGame}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer transition-all"
                >
                  <Flame className="w-4 h-4" />
                  <span>اختبر نفسك في هذا التصنيف</span>
                </button>
              </div>
            </div>
          ) : (
            /* Active Card View */
            <div className="space-y-6">
              <div
                onClick={(e) => {
                  if (Math.abs(dragX) < 10) {
                    handleFlip();
                  }
                }}
                onMouseDown={handleTouchStart}
                onMouseMove={handleTouchMove}
                onMouseUp={handleTouchEnd}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                  transform: `translateX(${dragX}px)`,
                  perspective: "1200px"
                }}
                className="group relative w-full min-h-[340px] sm:min-h-[380px] cursor-pointer transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.985] select-none"
              >
                {/* Flip Container with 3D spring transition */}
                <div
                  className="relative w-full h-full min-h-[340px] sm:min-h-[380px] transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                  }}
                >
                  {/* FRONT SIDE (السؤال - QUESTION) */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-8 flex flex-col justify-between items-center text-center border border-indigo-500/40 shadow-2xl overflow-y-auto bg-gradient-to-br from-[#0a0e20] via-[#141242] to-[#0d1636] transition-all duration-300 group-hover:border-indigo-400/80 group-hover:shadow-[0_0_40px_rgba(99,102,241,0.4),0_25px_50px_rgba(0,0,0,0.8)]"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    {/* Specular Light Reflection & Glow */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none transition-all duration-500 group-hover:scale-125 group-hover:bg-indigo-500/25" />

                    {/* Top Badges */}
                    <div className="w-full flex items-center justify-between z-10 gap-2">
                      <div className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-xs font-black text-indigo-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>+20 XP عند الإجابة والتعلم</span>
                      </div>

                      {/* SRS Card Status Badge */}
                      {currentCard && (() => {
                        const srsStatus = getSRSStatusText(`${currentCard.cat}::${currentCard.ar}`);
                        return (
                          <div className={`px-3 py-1 rounded-full border text-[11px] font-extrabold flex items-center gap-1 ${srsStatus.badgeColor}`}>
                            <Brain className="w-3 h-3" />
                            <span>{srsStatus.label}</span>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Center Content (The Question) */}
                    <div className="my-auto space-y-4 z-10 w-full max-w-xl py-4">
                      {isMastered(currentCard) && (
                        <div className="text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 py-1 px-3 rounded-full w-max mx-auto">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>سؤال مُتقن ✓</span>
                        </div>
                      )}

                      <div className="flex items-center justify-center gap-2">
                        <div className="inline-block px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-black">
                          ❓ السؤال التعليمي
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (currentCard?.ar) speakText(currentCard.ar, "ar");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-indigo-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                          title="استماع للسؤال بالعربية"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>نطق الصوت</span>
                        </button>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-white leading-relaxed">
                        {currentCard?.ar}
                      </h3>

                      {showHint && currentCard?.hint && (
                        <div className="text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/30 p-3 rounded-2xl max-w-md mx-auto leading-relaxed animate-fadeIn text-right">
                          <span className="font-bold block mb-1">💡 المبادئ المفتاحية:</span>
                          <span>{currentCard.hint}</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="w-full flex items-center justify-between z-10 text-xs pt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowHint(!showHint);
                        }}
                        className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>{showHint ? "إخفاء المفاتيح" : "إظهار المفاتيح"}</span>
                      </button>

                      <span className="px-3.5 py-1.5 rounded-full bg-emerald-600/30 border border-emerald-500/40 text-emerald-200 font-black flex items-center gap-1.5 animate-pulse">
                        <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                        <span>اضغط على البطاقة لإظهار الإجابة 🔄</span>
                      </span>
                    </div>
                  </div>

                  {/* BACK SIDE (الإجابة - ANSWER) */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-8 flex flex-col justify-between items-center text-center border border-indigo-500/40 shadow-2xl overflow-y-auto bg-gradient-to-br from-[#0a0e20] via-[#1a1c54] to-[#0d1838] transition-all duration-300 group-hover:border-indigo-400/80 group-hover:shadow-[0_0_40px_rgba(168,85,247,0.4),0_25px_50px_rgba(0,0,0,0.8)]"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)"
                    }}
                  >
                    {/* Specular Light Reflection & Glow */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/15 rounded-full blur-2xl pointer-events-none transition-all duration-500 group-hover:scale-125 group-hover:bg-purple-500/25" />

                    {/* Top Label */}
                    <div className="w-full flex items-center justify-between z-10 text-xs">
                      <span className="font-black text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>الإجابة والتفسير الشامل</span>
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (currentCard) handleCopy(currentCard);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === `${currentCard?.cat}::${currentCard?.ar}` ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>نسخ الإجابة</span>
                      </button>
                    </div>

                    {/* Center Content (The Answer) */}
                    <div className="my-auto space-y-3 z-10 max-w-xl text-right w-full py-2">
                      <div className="text-center">
                        <h4 className="text-base sm:text-lg font-black text-indigo-200">
                          {currentCard?.en}
                        </h4>
                      </div>

                      {/* Display answer if present (for stages Q&A) or hint (for terms) */}
                      {currentCard?.answer ? (
                        <div className="p-4 rounded-2xl bg-black/50 border border-indigo-500/30 text-xs sm:text-sm text-slate-100 leading-relaxed font-medium space-y-3">
                          <p>{currentCard.answer}</p>

                          {currentCard.exText && (
                            <div className="pt-2 border-t border-white/10 text-xs text-amber-300 font-bold flex items-start gap-2 bg-amber-500/10 p-2.5 rounded-xl">
                              <span>📌 مثال تطبيقي:</span>
                              <span className="font-normal text-amber-100">{currentCard.exText}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed font-medium text-center">
                          {currentCard?.hint}
                        </div>
                      )}

                      {/* Speak Button for term/title */}
                      {currentCard?.en && (
                        <div className="text-center pt-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (currentCard) speakText(currentCard.en);
                            }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/40 text-indigo-100 text-xs font-bold transition-all cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                            <span>🔊 نطق المصطلح الرئيسي</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Bottom Flip Hint */}
                    <div className="z-10 pt-2">
                      <span className="text-xs font-extrabold text-indigo-300 flex items-center justify-center gap-1">
                        <span>👆 اضغط على البطاقة للعودة للسؤال</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION CONTROLS & SPACED REPETITION FEEDBACK */}
              {isFlipped ? (
                /* Flipped Spaced Repetition Rating Controls */
                <div className="space-y-3 bg-[#0d1424] p-4 rounded-2xl border border-white/10 shadow-xl">
                  <div className="text-center text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5">
                    <Brain className="w-4 h-4 text-amber-400" />
                    <span>قيم مدى سهولة تذكر هذا المصطلح لجدولة المراجعة المتباعدة:</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {/* HARD / AGAIN */}
                    <button
                      onClick={() => handleSRSAnswer("hard")}
                      className="p-3 sm:p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 hover:bg-rose-500/30 text-rose-200 text-xs font-black flex flex-col items-center justify-center gap-1 transition-all cursor-pointer shadow-lg active:scale-95 group"
                    >
                      <div className="flex items-center gap-1.5 text-rose-400 group-hover:scale-110 transition-transform">
                        <RotateCcw className="w-4 h-4" />
                        <span className="font-extrabold text-xs sm:text-sm">صعب</span>
                      </div>
                      <span className="text-[10px] font-medium text-rose-300/80">تكرار عاجل اليوم</span>
                    </button>

                    {/* GOOD / MEDIUM */}
                    <button
                      onClick={() => handleSRSAnswer("good")}
                      className="p-3 sm:p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 hover:bg-amber-500/30 text-amber-200 text-xs font-black flex flex-col items-center justify-center gap-1 transition-all cursor-pointer shadow-lg active:scale-95 group"
                    >
                      <div className="flex items-center gap-1.5 text-amber-400 group-hover:scale-110 transition-transform">
                        <Clock className="w-4 h-4" />
                        <span className="font-extrabold text-xs sm:text-sm">متوسط</span>
                      </div>
                      <span className="text-[10px] font-medium text-amber-300/80">مراجعة بعد 3-7 أيام</span>
                    </button>

                    {/* EASY / MASTERED */}
                    <button
                      onClick={() => handleSRSAnswer("easy")}
                      className="p-3 sm:p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 hover:bg-emerald-500/30 text-emerald-200 text-xs font-black flex flex-col items-center justify-center gap-1 transition-all cursor-pointer shadow-lg active:scale-95 group"
                    >
                      <div className="flex items-center gap-1.5 text-emerald-400 group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="font-extrabold text-xs sm:text-sm">سهل ✓</span>
                      </div>
                      <span className="text-[10px] font-medium text-emerald-300/80">ذاكرة دائمة (+25 XP)</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Unflipped Navigation Bar */
                <div className="flex items-center justify-between">
                  <button
                    disabled={isFirst}
                    onClick={handlePrev}
                    className="p-3 rounded-2xl bg-[#0d1424] border border-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Dots Pagination */}
                  <div className="flex items-center gap-1.5">
                    {(() => {
                      const maxDots = 7;
                      const total = deck.length;
                      let start = Math.max(0, currentIndex - Math.floor(maxDots / 2));
                      let end = Math.min(total - 1, start + maxDots - 1);
                      if (end - start + 1 < maxDots) {
                        start = Math.max(0, end - maxDots + 1);
                      }

                      const dots = [];
                      for (let i = start; i <= end; i++) {
                        const isActive = i === currentIndex;
                        dots.push(
                          <button
                            key={i}
                            onClick={() => handleGoToCard(i)}
                            className={`h-2 rounded-full transition-all cursor-pointer ${
                              isActive
                                ? "w-6 bg-indigo-500 shadow-md shadow-indigo-500/50"
                                : "w-2 bg-white/20 hover:bg-white/40"
                            }`}
                          />
                        );
                      }
                      return dots;
                    })()}
                  </div>

                  <button
                    disabled={isLast}
                    onClick={() => handleNext(null)}
                    className="p-3 rounded-2xl bg-[#0d1424] border border-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: INTERACTIVE QUIZ MATCH GAME
         ───────────────────────────────────────────────────────────── */}
      {activeTab === "quiz" && (
        <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
          {quizFinished ? (
            /* Quiz Completed Score Card */
            <div className="bg-[#0d1424] border border-amber-500/30 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
              <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Trophy className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white">اكتمال التحدي بنجاح! 🎉</h3>
                <p className="text-sm text-slate-300 font-bold">
                  حصلت على <span className="text-amber-400 font-black">{quizScore} XP</span> في هذا التحدي
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={startQuizGame}
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة التحدي</span>
                </button>

                <button
                  onClick={() => setActiveTab("cards")}
                  className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-black text-xs flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>العودة للبطاقات</span>
                </button>
              </div>
            </div>
          ) : quizQuestions.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-bold">
              لا توجد بطاقات كافية في هذا التصنيف لبدء التحدي. اختر تصنيفاً آخر.
            </div>
          ) : (
            /* Active Question Card */
            <div className="bg-[#0d1424] border border-indigo-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              {/* Quiz Header Score */}
              <div className="flex items-center justify-between text-xs font-black border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">السؤال {quizStep + 1} من {quizQuestions.length}</span>
                  {quizStreak > 1 && (
                    <span className="px-2.5 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-[10px] flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-400" />
                      <span>متتالي x{quizStreak}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-amber-400">
                  <Award className="w-4 h-4" />
                  <span>النتيجة: {quizScore} XP</span>
                </div>
              </div>

              {/* Question Box */}
              <div className="bg-gradient-to-br from-[#0a0e20] to-[#121636] border border-indigo-500/30 p-6 rounded-2xl text-center space-y-3">
                <span className="text-[11px] font-bold text-indigo-300 block">
                  ما الترجمة الإنجليزية الصحيحة لهذا المصطلح المحاسبي؟
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {quizQuestions[quizStep].card.ar}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  💡 {quizQuestions[quizStep].card.hint}
                </p>
              </div>

              {/* Multiple Choice Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quizQuestions[quizStep].options.map((opt, idx) => {
                  let buttonStyle = "bg-[#10172a] border-white/10 text-slate-200 hover:border-indigo-400";

                  if (isAnswered) {
                    if (idx === quizQuestions[quizStep].correctIndex) {
                      buttonStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-black";
                    } else if (idx === selectedOption) {
                      buttonStyle = "bg-red-500/20 border-red-500 text-red-300 font-black";
                    } else {
                      buttonStyle = "bg-[#10172a]/50 border-white/5 text-slate-500";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleAnswerQuiz(idx)}
                      className={`p-4 rounded-2xl border text-xs font-bold text-right transition-all cursor-pointer flex items-center justify-between ${buttonStyle}`}
                    >
                      <span className="dir-ltr font-sans">{opt}</span>
                      {isAnswered && idx === quizQuestions[quizStep].correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Next Question Button */}
              {isAnswered && (
                <button
                  onClick={handleNextQuiz}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer animate-fadeIn"
                >
                  <span>السؤال التالي</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 3: SEARCHABLE GLOSSARY
         ───────────────────────────────────────────────────────────── */}
      {activeTab === "glossary" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute top-3.5 right-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم العربي، الإنجليزي، أو كلمة في التلميح..."
              className="w-full bg-[#0d1424] border border-indigo-500/30 rounded-2xl pr-12 pl-4 py-3 text-xs text-white placeholder-slate-400 font-bold outline-none focus:border-indigo-400 shadow-xl"
            />
          </div>

          {/* Cards Table List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGlossary.map((card, idx) => {
              const mastered = isMastered(card);
              const cardKey = `${card.cat}::${card.ar}`;
              return (
                <div
                  key={idx}
                  className={`bg-[#0d1424] border p-5 rounded-2xl space-y-3 transition-all hover:border-indigo-500/50 ${
                    mastered ? "border-emerald-500/40 bg-emerald-950/10" : "border-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold text-indigo-400 block">{card.cat}</span>
                      <h4 className="text-base font-black text-white">{card.ar}</h4>
                      <h5 className="text-xs font-black text-indigo-300 font-sans dir-ltr">{card.en}</h5>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => speakText(card.en)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                        title="استمع للنطق"
                      >
                        <Volume2 className="w-4 h-4 text-amber-400" />
                      </button>

                      <button
                        onClick={() => toggleMasteredGlobal(card)}
                        className={`p-2 rounded-xl border cursor-pointer transition-colors ${
                          mastered
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            : "bg-white/5 text-slate-400 border-white/10 hover:text-white"
                        }`}
                        title="تبديل حالة الإتقان"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleCopy(card)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
                        title="نسخ المصطلح"
                      >
                        {copiedKey === cardKey ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-medium bg-black/30 p-3 rounded-xl border border-white/5">
                    💡 {card.hint}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 4: STATS & D3 MASTERY OVERVIEW
         ───────────────────────────────────────────────────────────── */}
      {activeTab === "stats" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MasteryPieChart
              mastered={masteredInCat}
              remaining={remainingInCat}
              total={totalInCat}
              categoryName={selectedCategory}
            />

            <div className="bg-[#0d1424] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>إحصائيات الإتقان الشاملة</span>
              </h3>

              <div className="space-y-3 text-xs font-bold">
                <div className="flex justify-between items-center bg-black/30 p-3 rounded-xl">
                  <span className="text-slate-300">إجمالي المصطلحات المتقنة:</span>
                  <span className="text-emerald-400 font-black text-sm">{masteredCount} / {GlossaryData.allCards().length}</span>
                </div>

                <div className="flex justify-between items-center bg-black/30 p-3 rounded-xl">
                  <span className="text-slate-300">مجموع نقاط XP المكتسبة:</span>
                  <span className="text-amber-400 font-black text-sm">{totalXp} XP</span>
                </div>

                <div className="flex justify-between items-center bg-black/30 p-3 rounded-xl">
                  <span className="text-slate-300">نسبة الإتقان العامة:</span>
                  <span className="text-cyan-400 font-black text-sm">
                    {Math.round((masteredCount / GlossaryData.allCards().length) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
