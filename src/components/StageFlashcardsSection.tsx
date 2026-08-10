import React, { useState, useEffect } from "react";
import { getStageQuestionCards, StageQuestionCard } from "../data/stageQuestions";
import { STAGES_DATA } from "../data/curriculum";
import {
  recordSRSReview,
  getSRSStatusText,
  isCardDue,
  DifficultyRating
} from "../utils/spacedRepetition";
import {
  Sparkles,
  CheckCircle2,
  RotateCcw,
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
  Volume2,
  Filter,
  Layers,
  GraduationCap,
  Brain,
  Clock,
  AlertCircle
} from "lucide-react";

interface StageFlashcardsSectionProps {
  initialStageId?: number;
}

export function StageFlashcardsSection({ initialStageId }: StageFlashcardsSectionProps) {
  const [selectedStageId, setSelectedStageId] = useState<number>(initialStageId || 1);
  const [selectedLessonIdx, setSelectedLessonIdx] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [cards, setCards] = useState<StageQuestionCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  // Load cards based on selected stage & lesson filter
  useEffect(() => {
    let list = getStageQuestionCards(selectedStageId);

    if (selectedLessonIdx !== "all") {
      list = list.filter((c) => c.lessonIdx === selectedLessonIdx);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.ar.toLowerCase().includes(q) ||
          c.answer.toLowerCase().includes(q) ||
          c.lessonTitle.toLowerCase().includes(q)
      );
    }

    setCards(list);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
  }, [selectedStageId, selectedLessonIdx, searchQuery]);

  // Load mastered from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mizan_stage_mastered_q");
      if (saved) setMasteredIds(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const currentCard = cards[currentIndex];
  const cardId = currentCard ? `${currentCard.stageId}_${currentCard.lessonIdx}_${currentCard.questionNum}` : "";
  const isMastered = masteredIds.includes(cardId);

  const toggleMastered = () => {
    if (!cardId) return;
    let next: string[];
    if (isMastered) {
      next = masteredIds.filter((id) => id !== cardId);
    } else {
      next = [...masteredIds, cardId];
    }
    setMasteredIds(next);
    try {
      localStorage.setItem("mizan_stage_mastered_q", JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSRSAnswer = (rating: DifficultyRating) => {
    if (!currentCard) return;
    const key = `stage_${currentCard.stageId}_${currentCard.lessonIdx}_${currentCard.questionNum}`;
    recordSRSReview(key, rating);

    if (rating === "easy" && !isMastered) {
      toggleMastered();
    }

    handleNext();
  };

  const handleNext = () => {
    if (cards.length === 0) return;
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    if (cards.length === 0) return;
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleCopy = () => {
    if (!currentCard) return;
    const text = `سؤال: ${currentCard.ar}\n\nالإجابة: ${currentCard.answer}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const speakText = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const currentStageInfo = STAGES_DATA.find((s) => s.id === selectedStageId) || STAGES_DATA[0];

  return (
    <div className="min-h-screen bg-[#070A17] text-white py-8 px-4 sm:px-6 lg:px-8 font-sans pb-24">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* TOP HEADER BANNER */}
        <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden bg-gradient-to-r from-indigo-900/80 via-purple-900/60 to-slate-900 border border-indigo-500/30 shadow-2xl">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-black">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>بطاقات الأسئلة والإجابات للمراحل</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                🃏 البطاقات التعليمية للمراحل (10 أسئلة لكل درس)
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
                استعرض أسئلة وإجابات الـ {STAGES_DATA.length} مرحلة تعليمية. اضغط على أي بطاقة لقلبها واكتشاف التوجيه المحاسبي، الأثر المالي، والدورة المستندية الشاملة!
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3 shrink-0 bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <div className="text-center px-3 border-l border-white/10">
                <div className="text-xs text-gray-400 font-bold">المراحل</div>
                <div className="text-lg font-black text-indigo-400">{STAGES_DATA.length}</div>
              </div>
              <div className="text-center px-3 border-l border-white/10">
                <div className="text-xs text-gray-400 font-bold">الأسئلة</div>
                <div className="text-lg font-black text-emerald-400">{cards.length}</div>
              </div>
              <div className="text-center px-3">
                <div className="text-xs text-gray-400 font-bold">المتقنة</div>
                <div className="text-lg font-black text-amber-400">{masteredIds.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTROLS & FILTERS */}
        <div className="bg-[#0f152a] rounded-2xl p-4 sm:p-5 border border-white/10 shadow-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* Stage Selector Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-indigo-300 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                <span>اختر المرحلة التعليمية:</span>
              </label>
              <select
                value={selectedStageId}
                onChange={(e) => {
                  setSelectedStageId(Number(e.target.value));
                  setSelectedLessonIdx("all");
                }}
                className="w-full bg-[#161f38] border border-indigo-500/30 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-bold focus:outline-none focus:border-indigo-400 cursor-pointer"
              >
                {STAGES_DATA.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    مرحلة {stage.id}: {stage.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Unit / Lesson Filter Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-indigo-300 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>اختر الدرس / الوحدة:</span>
              </label>
              <select
                value={selectedLessonIdx}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedLessonIdx(val === "all" ? "all" : Number(val));
                }}
                className="w-full bg-[#161f38] border border-indigo-500/30 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-bold focus:outline-none focus:border-indigo-400 cursor-pointer"
              >
                <option value="all">جميع دروس المرحلة ({currentStageInfo.lessons.length} دروس - 10 أسئلة لكل درس)</option>
                {currentStageInfo.lessons.map((lesson, idx) => (
                  <option key={idx} value={idx}>
                    الوحدة {idx + 1}: {lesson.title.replace(/^الوحدة \d+: /, "")}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-indigo-300 flex items-center gap-1">
                <Search className="w-3.5 h-3.5" />
                <span>البحث في الأسئلة والإجابات:</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث عن سؤال أو قيد..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#161f38] border border-white/10 rounded-xl pr-9 pl-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-400"
                />
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
              </div>
            </div>

          </div>

          {/* Quick Stage Badge Bar */}
          <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10 text-gray-300">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <span>📌 المرحلة الحالية:</span>
              <span className="text-white font-extrabold">{currentStageInfo.name}</span>
            </span>

            <span className="font-bold text-indigo-300">
              بطاقة {currentIndex + 1} من {cards.length}
            </span>
          </div>
        </div>

        {/* MAIN FLASHCARD DISPLAY AREA */}
        {cards.length === 0 ? (
          <div className="text-center py-16 bg-[#0f152a] rounded-3xl border border-white/10 p-8 space-y-3">
            <BookOpen className="w-12 h-12 text-gray-500 mx-auto" />
            <h3 className="text-lg font-bold text-gray-300">لا توجد أسئلة تطابق فلتر البحث الحكالي</h3>
            <p className="text-xs text-gray-400">جرب اختيار درس آخر أو تفريغ خانة البحث.</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Interactive 3D Card Container */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="group relative w-full min-h-[380px] sm:min-h-[420px] cursor-pointer transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.99] select-none"
              style={{ perspective: "1200px" }}
            >
              <div
                className="relative w-full h-full min-h-[380px] sm:min-h-[420px] transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                }}
              >
                {/* FRONT SIDE (السؤال) */}
                <div
                  className="absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-8 flex flex-col justify-between items-center text-center border border-indigo-500/40 shadow-2xl overflow-y-auto bg-gradient-to-br from-[#0a0e20] via-[#141242] to-[#0d1636] transition-all duration-300 group-hover:border-indigo-400/80 group-hover:shadow-[0_0_40px_rgba(99,102,241,0.4),0_25px_50px_rgba(0,0,0,0.8)]"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  {/* Top Bar */}
                  <div className="w-full flex items-center justify-between z-10 text-xs">
                    <div className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>+20 XP عند التعلم</span>
                    </div>

                    {/* SRS Card Status Badge */}
                    {cardId && (() => {
                      const srsStatus = getSRSStatusText(cardId);
                      return (
                        <div className={`px-3 py-1 rounded-full border text-[11px] font-extrabold flex items-center gap-1 ${srsStatus.badgeColor}`}>
                          <Brain className="w-3 h-3" />
                          <span>{srsStatus.label}</span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Question Content */}
                  <div className="my-auto space-y-4 z-10 w-full max-w-2xl py-4">
                    {isMastered && (
                      <div className="text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 py-1 px-3 rounded-full w-max mx-auto">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>سؤال مُتقن ✓</span>
                      </div>
                    )}

                    <div className="inline-block px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-black">
                      ❓ سؤال الدرس ({currentCard.questionNum} من 10)
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-white leading-relaxed">
                      {currentCard.ar}
                    </h3>

                    {/* Hint Toggle Section */}
                    {showHint && currentCard.hint && (
                      <div className="text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/30 p-3 rounded-2xl max-w-lg mx-auto leading-relaxed text-right animate-fadeIn">
                        <span className="font-bold block mb-1">💡 المبادئ المفتاحية:</span>
                        <span>{currentCard.hint}</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Bar */}
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

                {/* BACK SIDE (الإجابة) */}
                <div
                  className="absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-8 flex flex-col justify-between items-center text-center border border-indigo-500/40 shadow-2xl overflow-y-auto bg-gradient-to-br from-[#0a0e20] via-[#1a1c54] to-[#0d1838] transition-all duration-300 group-hover:border-indigo-400/80 group-hover:shadow-[0_0_40px_rgba(168,85,247,0.4),0_25px_50px_rgba(0,0,0,0.8)]"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)"
                  }}
                >
                  {/* Top Bar */}
                  <div className="w-full flex items-center justify-between z-10 text-xs">
                    <span className="font-black text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>الإجابة والتفسير الشامل</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(currentCard.answer);
                        }}
                        className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-indigo-300 transition-colors"
                        title="استمع للإجابة"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy();
                        }}
                        className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-indigo-200 font-bold flex items-center gap-1 text-xs"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? "تم النسخ" : "نسخ"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Answer Content */}
                  <div className="my-auto space-y-3 z-10 max-w-xl text-right w-full py-2">
                    <div className="p-4 rounded-2xl bg-black/60 border border-indigo-500/30 text-xs sm:text-sm text-slate-100 leading-relaxed font-medium whitespace-pre-line">
                      {currentCard.answer}
                    </div>

                    {currentCard.exText && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 font-medium text-right flex items-start gap-2">
                        <span>📌 مثال تطبيقي:</span>
                        <span>{currentCard.exText}</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Bar */}
                  <div className="z-10 pt-2">
                    <span className="text-xs font-extrabold text-indigo-300 flex items-center justify-center gap-1">
                      <span>👆 اضغط على البطاقة للعودة للسؤال</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CONTROLS & NAVIGATION */}
            {isFlipped ? (
              <div className="space-y-3 bg-[#0f152a] p-4 rounded-2xl border border-white/10 shadow-xl animate-fadeIn">
                <div className="text-center text-xs font-bold text-indigo-300 flex items-center justify-center gap-1.5">
                  <Brain className="w-4 h-4 text-amber-400" />
                  <span>قيم مستوى صعوبة السؤال لجدولة المراجعة التلقائية (Spaced Repetition):</span>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <button
                    onClick={() => handleSRSAnswer("hard")}
                    className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 hover:bg-rose-500/30 text-rose-200 text-xs font-black flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
                  >
                    <div className="flex items-center gap-1 text-rose-400">
                      <RotateCcw className="w-4 h-4" />
                      <span>صعب</span>
                    </div>
                    <span className="text-[10px] text-rose-300/80 font-normal">تكرار عاجل (صندوق 1)</span>
                  </button>

                  <button
                    onClick={() => handleSRSAnswer("good")}
                    className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 hover:bg-amber-500/30 text-amber-200 text-xs font-black flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
                  >
                    <div className="flex items-center gap-1 text-amber-400">
                      <Clock className="w-4 h-4" />
                      <span>متوسط</span>
                    </div>
                    <span className="text-[10px] text-amber-300/80 font-normal">مراجعة 3-7 أيام</span>
                  </button>

                  <button
                    onClick={() => handleSRSAnswer("easy")}
                    className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 hover:bg-emerald-500/30 text-emerald-200 text-xs font-black flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
                  >
                    <div className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>سهل ✓</span>
                    </div>
                    <span className="text-[10px] text-emerald-300/80 font-normal">ذاكرة مستقرة (+20 XP)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0f152a] p-4 rounded-2xl border border-white/10 shadow-xl">
                
                {/* Mastery Toggle Button */}
                <button
                  onClick={toggleMastered}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isMastered
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                      : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${isMastered ? "text-emerald-400" : "text-gray-500"}`} />
                  <span>{isMastered ? "سؤال متقن ✓" : "تحديد كسؤال متقن"}</span>
                </button>

                {/* Prev / Next Navigation */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
                  <button
                    onClick={handlePrev}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 font-extrabold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                    <span>السابق</span>
                  </button>

                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>التالي</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
