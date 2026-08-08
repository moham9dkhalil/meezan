import React, { useState, useMemo } from "react";
import {
  BookMarked,
  Search,
  X,
  Sparkles,
  Volume2,
  Star,
  BookOpen,
  Calculator,
  Bot,
  Filter,
  Check,
  Zap,
  Info,
  ChevronLeft,
  GraduationCap,
  Copy,
  Landmark,
  PieChart,
  Globe,
  Receipt,
  ShieldCheck,
  Tag
} from "lucide-react";
import { AccountingTerm, ActiveTab } from "../types";
import { ACCOUNTING_GLOSSARY } from "../data/glossary";

interface GlossarySectionProps {
  onSelectTab?: (tab: ActiveTab) => void;
  onAskAIForTerm?: (termName: string) => void;
}

const CATEGORIES = [
  "الكل",
  "محاسبة مالية",
  "محاسبة إدارية",
  "معايير دولية",
  "أساسيات المحاسبة",
  "قيود وتسويات",
  "تكاليف ومراجعة",
  "ضرائب وزكاة"
] as const;

const CATEGORY_META: Record<string, { icon: any; color: string; desc: string }> = {
  "الكل": { icon: BookMarked, color: "text-amber-400", desc: "جميع المفاهيم والمصطلحات المحاسبية" },
  "محاسبة مالية": { icon: Landmark, color: "text-emerald-400", desc: "القوائم المالية، الميزانيات، الأصول والالتزامات وحقوق الملكية" },
  "محاسبة إدارية": { icon: PieChart, color: "text-cyan-400", desc: "الموازنات التقديرية، نقاط التعادل، وهامش المساهمة لاتخاذ القرار" },
  "معايير دولية": { icon: Globe, color: "text-indigo-400", desc: "معايير التقرير المالي الدولي IFRS والمبادئ المقبولة GAAP" },
  "أساسيات المحاسبة": { icon: BookOpen, color: "text-amber-300", desc: "القيد المزدوج، المدين والدائن، دفتر الأستاذ وميزان المراجعة" },
  "قيود وتسويات": { icon: Calculator, color: "text-purple-400", desc: "التسويات الجردية، مجمع الإهلاك والمخصصات المحاسبية" },
  "تكاليف ومراجعة": { icon: ShieldCheck, color: "text-blue-400", desc: "تكلفة البضاعة المباعة وقواعد المراجعة والتدقيق المالي" },
  "ضرائب وزكاة": { icon: Receipt, color: "text-rose-400", desc: "أنظمة ضريبة القيمة المضافة VAT والزكاة الشرعية للمنشآت" }
};

const ARABIC_LETTERS = [
  "الكل",
  "أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "هـ", "و", "ي",
  "English"
];

export function GlossarySection({ onSelectTab, onAskAIForTerm }: GlossarySectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
  const [selectedLetter, setSelectedLetter] = useState<string>("الكل");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [activeModalTerm, setActiveModalTerm] = useState<AccountingTerm | null>(null);
  const [copiedTerm, setCopiedTerm] = useState<string | null>(null);

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("meezan_glossary_favs");
      return saved ? JSON.parse(saved) : ["القيد المزدوج", "مبدأ الاستحقاق", "IFRS"];
    } catch {
      return ["القيد المزدوج", "مبدأ الاستحقاق", "IFRS"];
    }
  });

  // Calculate term counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { "الكل": ACCOUNTING_GLOSSARY.length };
    ACCOUNTING_GLOSSARY.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Quiz Mode State
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizTermIdx, setQuizTermIdx] = useState<number>(0);
  const [quizSelectedOpt, setQuizSelectedOpt] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });

  const toggleFavorite = (termName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isFav = favorites.includes(termName);
    const updated = isFav ? favorites.filter((f) => f !== termName) : [...favorites, termName];
    setFavorites(updated);
    try {
      localStorage.setItem("meezan_glossary_favs", JSON.stringify(updated));
    } catch {}
  };

  // Text-to-speech speak handler
  const handleSpeak = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!("speechSynthesis" in window)) {
      alert("عذراً، خاصية النطق الصوتي غير مدعومة في هذا المتصفح.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (text: string, termName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedTerm(termName);
    setTimeout(() => setCopiedTerm(null), 2000);
  };

  // Filter terms logic
  const filteredTerms = useMemo(() => {
    return ACCOUNTING_GLOSSARY.filter((item) => {
      // 1. Favorites Filter
      if (onlyFavorites && !favorites.includes(item.term)) {
        return false;
      }

      // 2. Category Filter
      if (selectedCategory !== "الكل" && item.category !== selectedCategory) {
        return false;
      }

      // 3. Letter Filter
      if (selectedLetter !== "الكل") {
        if (selectedLetter === "English") {
          const isEng = /^[A-Za-z]/.test(item.term) || item.aliases?.some((a) => /^[A-Za-z]/.test(a));
          if (!isEng) return false;
        } else {
          // Normalize Arabic first letter
          const cleanTerm = item.term.replace(/^(ال)/, ""); // Strip 'AL' for better search
          const firstChar = cleanTerm.charAt(0);
          const firstCharOrig = item.term.charAt(0);

          if (firstChar !== selectedLetter && firstCharOrig !== selectedLetter) {
            // Also check if any alias matches
            const aliasMatch = item.aliases?.some((a) => a.charAt(0) === selectedLetter || a.replace(/^(ال)/, "").charAt(0) === selectedLetter);
            if (!aliasMatch) return false;
          }
        }
      }

      // 4. Search Query Filter
      if (searchTerm.trim() !== "") {
        const q = searchTerm.toLowerCase().trim();
        const matchTerm = item.term.toLowerCase().includes(q);
        const matchAliases = item.aliases?.some((a) => a.toLowerCase().includes(q));
        const matchDef = item.definition.toLowerCase().includes(q);
        const matchEx = item.example?.toLowerCase().includes(q);

        if (!matchTerm && !matchAliases && !matchDef && !matchEx) {
          return false;
        }
      }

      return true;
    });
  }, [searchTerm, selectedCategory, selectedLetter, onlyFavorites, favorites]);

  // Quiz Options Generation
  const quizQuestions = useMemo(() => {
    return ACCOUNTING_GLOSSARY.map((target) => {
      // Get 3 random distractor terms
      const distractors = ACCOUNTING_GLOSSARY.filter((t) => t.term !== target.term)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((t) => t.term);

      const options = [...distractors, target.term].sort(() => 0.5 - Math.random());
      const correctIndex = options.indexOf(target.term);

      return {
        target,
        options,
        correctIndex
      };
    });
  }, []);

  const currentQuiz = quizQuestions[quizTermIdx % quizQuestions.length];

  const handleQuizAnswer = (idx: number) => {
    if (quizSelectedOpt !== null) return; // already answered
    setQuizSelectedOpt(idx);

    const isCorrect = idx === currentQuiz.correctIndex;
    setQuizScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const handleNextQuiz = () => {
    setQuizSelectedOpt(null);
    setQuizTermIdx((prev) => prev + 1);
  };

  const activeCategoryMeta = CATEGORY_META[selectedCategory] || CATEGORY_META["الكل"];
  const ActiveCatIcon = activeCategoryMeta.icon;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* HEADER HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0c1229] via-[#0f172a] to-[#080d1a] border border-amber-500/30 p-6 sm:p-10 shadow-2xl">
        {/* Glow Accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-black">
              <BookMarked className="w-3.5 h-3.5" />
              <span>قاموس المحاسبة المتقدم والشامل 📖</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              مرجعك الفوري لكافة <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-indigo-300">
                التصنيفات والمفاهيم المحاسبية
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              تصفّح المصطلحات بسهولة حسب التخصص المحاسبي (محاسبة مالية، إدارية، معايير دولية IFRS/GAAP، تكاليف، وغيرها) مع الشرح والمعادلات والأمثلة.
            </p>

            {/* Quick Stats Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-200">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>{ACCOUNTING_GLOSSARY.length} مصطلح محاسبي</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-200">
                <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>{favorites.length} مصطلح بـ المفضلة</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-200">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>تصفية حسب التخصص والفرع المحاسبي</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap sm:flex-col gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => setIsQuizMode(!isQuizMode)}
              className={`px-5 py-3 rounded-2xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                isQuizMode
                  ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
                  : "bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:opacity-90 text-slate-950"
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{isQuizMode ? "العودة لتصفح القاموس" : "اختبر حفظك للمصطلحات (تحدي)"}</span>
            </button>

            {onSelectTab && (
              <button
                onClick={() => onSelectTab("ai")}
                className="px-5 py-3 rounded-2xl bg-indigo-600/30 hover:bg-indigo-600/40 border border-indigo-400/40 text-indigo-200 font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Bot className="w-4 h-4 text-indigo-300" />
                <span>اسأل المساعد الذكي عن مصطلح</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* QUIZ INTERACTIVE MODE OVERLAY */}
      {isQuizMode ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0d152a] to-[#080e1c] border border-amber-500/40 space-y-6 shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">اختبار وتحدي المفاهيم المحاسبية 🧠</h2>
                <p className="text-xs text-slate-400">اقرأ التعريف المحاسبي واختر المصطلح الصحيح المناسب</p>
              </div>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-black/40 border border-white/10 text-xs font-black text-amber-300 flex items-center gap-2">
              <span>النتيجة:</span>
              <span className="text-white font-mono text-sm">{quizScore.correct} / {quizScore.total}</span>
            </div>
          </div>

          {/* Question Card */}
          <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-4">
            <span className="text-xs font-black text-amber-400 block">
              سؤال #{quizTermIdx + 1} - ما هو المصطلح المحاسبي المقصود بهذا الشرح؟
            </span>

            <p className="text-sm sm:text-base text-white font-medium leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10">
              "{currentQuiz.target.definition}"
            </p>

            {currentQuiz.target.example && (
              <p className="text-xs text-slate-400 italic">
                💡 مثال توضيحي: {currentQuiz.target.example}
              </p>
            )}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQuiz.options.map((opt, idx) => {
              const isSelected = quizSelectedOpt === idx;
              const isCorrectOpt = idx === currentQuiz.correctIndex;

              let btnStyle = "bg-white/5 border-white/10 text-slate-200 hover:bg-white/10";
              if (quizSelectedOpt !== null) {
                if (isCorrectOpt) {
                  btnStyle = "bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/50";
                } else if (isSelected) {
                  btnStyle = "bg-rose-500/20 border-rose-400 text-rose-300 ring-2 ring-rose-500/50";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(idx)}
                  className={`p-4 rounded-2xl border font-black text-xs sm:text-sm text-right transition-all cursor-pointer flex items-center justify-between gap-2 ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {quizSelectedOpt !== null && isCorrectOpt && <Check className="w-5 h-5 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          {quizSelectedOpt !== null && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuiz}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs hover:opacity-90 transition-all cursor-pointer flex items-center gap-2 shadow-lg"
              >
                <span>السؤال التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* GLOSSARY DICTIONARY BROWSER */
        <div className="space-y-6">
          {/* CATEGORY FILTER CARDS (HIGHLIGHTING ACCOUNTING BRANCHES) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-300 flex items-center gap-2">
                <Filter className="w-4 h-4 text-amber-400" />
                <span>تصفية التخصصات والفروع المحاسبية:</span>
              </h3>
              {selectedCategory !== "الكل" && (
                <span className="text-[11px] font-bold text-amber-300">
                  المجال المحدد: {selectedCategory}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                const meta = CATEGORY_META[cat] || CATEGORY_META["الكل"];
                const IconComp = meta.icon;
                const count = categoryCounts[cat] || 0;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer text-right flex flex-col justify-between space-y-2 relative overflow-hidden group ${
                      isSelected
                        ? "bg-gradient-to-b from-amber-500/20 to-amber-600/10 border-amber-400 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/50"
                        : "bg-[#0a1122] border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-1.5 rounded-xl ${isSelected ? "bg-amber-400 text-slate-950" : "bg-white/5 " + meta.color}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded-full ${isSelected ? "bg-amber-400/30 text-amber-200" : "bg-white/10 text-slate-400"}`}>
                        {count}
                      </span>
                    </div>

                    <div>
                      <span className={`text-xs font-black block leading-snug ${isSelected ? "text-amber-300" : "group-hover:text-white"}`}>
                        {cat}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE CATEGORY INFORMATIONAL BANNER */}
          {selectedCategory !== "الكل" && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0c1328] to-[#080d1e] border border-amber-400/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-300">
                  <ActiveCatIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white flex items-center gap-2">
                    <span>عرض مصطلحات: {selectedCategory}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300">
                      {categoryCounts[selectedCategory] || 0} مصطلح
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    {activeCategoryMeta.desc}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCategory("الكل")}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>إلغاء التصفية</span>
              </button>
            </div>
          )}

          {/* SEARCH & ALPHABET CONTROLS */}
          <div className="p-5 rounded-3xl bg-[#0a1122] border border-white/10 space-y-4 shadow-xl">
            {/* Search Box & Favorites Toggle */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث باسم المصطلح العربي، الإنجليزي (مثل IFRS, Debit, GAAP)، أو كلمة من الشرح..."
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-black/40 border border-white/15 text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-400/70 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Favorites Button Toggle */}
              <button
                onClick={() => setOnlyFavorites(!onlyFavorites)}
                className={`px-4 py-3 rounded-2xl font-black text-xs transition-all cursor-pointer flex items-center gap-2 shrink-0 border ${
                  onlyFavorites
                    ? "bg-amber-500/20 border-amber-400 text-amber-300"
                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                }`}
              >
                <Star className={`w-4 h-4 ${onlyFavorites ? "fill-amber-300 text-amber-300" : ""}`} />
                <span>المفضلة فقط ({favorites.length})</span>
              </button>
            </div>

            {/* Alphabet Index Filter */}
            <div className="pt-2 border-t border-white/10 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <span className="text-slate-400 font-bold shrink-0 ml-1">الحرف:</span>
              {ARABIC_LETTERS.map((letter) => (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(letter)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer shrink-0 ${
                    selectedLetter === letter
                      ? "bg-indigo-600 text-white font-black"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          {/* RESULTS COUNT & RESET BAR */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold px-1">
            <span>
              تم العثور على <strong className="text-amber-300 font-mono text-sm">{filteredTerms.length}</strong> مصطلح محاسبي
            </span>

            {(searchTerm || selectedCategory !== "الكل" || selectedLetter !== "الكل" || onlyFavorites) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("الكل");
                  setSelectedLetter("الكل");
                  setOnlyFavorites(false);
                }}
                className="text-amber-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>إعادة ضبط كافة الفلاتر</span>
              </button>
            )}
          </div>

          {/* TERMS CARDS GRID */}
          {filteredTerms.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-[#0a1122] border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto text-2xl">
                🔎
              </div>
              <h3 className="text-base font-black text-white">لم يتم العثور على نتائج متطابقة</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                جرب تغيير تخصص المحاسبة المحدد، أو إلغاء فلتر الحرف والبحث.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTerms.map((item, idx) => {
                const isFav = favorites.includes(item.term);

                return (
                  <div
                    key={idx}
                    onClick={() => setActiveModalTerm(item)}
                    className="p-5 rounded-2xl bg-gradient-to-b from-[#0c1328] to-[#080d1e] border border-white/10 hover:border-amber-400/50 hover:shadow-xl hover:shadow-amber-500/5 transition-all cursor-pointer group flex flex-col justify-between space-y-4 relative"
                  >
                    {/* Top Row */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors flex items-center gap-2">
                            <span>{item.term}</span>
                          </h3>
                          {item.aliases && item.aliases.length > 0 && (
                            <p className="text-[11px] font-mono text-indigo-300/80 mt-0.5">
                              {item.aliases.join(" · ")}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={(e) => toggleFavorite(item.term, e)}
                          className="p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer text-slate-400 hover:text-amber-300 shrink-0"
                          title={isFav ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                        >
                          <Star className={`w-4 h-4 ${isFav ? "fill-amber-300 text-amber-300" : ""}`} />
                        </button>
                      </div>

                      {/* Category Badge */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-[10px] font-extrabold">
                        <Tag className="w-3 h-3 text-indigo-400" />
                        <span>{item.category}</span>
                      </span>

                      {/* Definition Snippet */}
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 font-normal pt-1">
                        {item.definition}
                      </p>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleSpeak(`${item.term}. ${item.definition}`, e)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
                          title="استماع للشرح المباشر صوتياً"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-indigo-300" />
                        </button>

                        <button
                          onClick={(e) => copyToClipboard(item.definition, item.term, e)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
                          title="نسخ الشرح"
                        >
                          {copiedTerm === item.term ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </button>
                      </div>

                      <span className="text-[11px] font-black text-amber-400 group-hover:translate-x-[-2px] transition-transform flex items-center gap-1">
                        <span>عرض التفاصيل</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* DETAILED TERM MODAL POPUP */}
      {activeModalTerm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c1328] via-[#090e1f] to-[#060914] border border-amber-400/50 shadow-2xl text-white space-y-5 relative">
            {/* Close Button */}
            <button
              onClick={() => setActiveModalTerm(null)}
              className="absolute top-4 left-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-2 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black">
                  {activeModalTerm.category}
                </span>
                {activeModalTerm.aliases && activeModalTerm.aliases.length > 0 && (
                  <span className="text-xs font-mono text-indigo-300">
                    ({activeModalTerm.aliases.join(" · ")})
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <span>{activeModalTerm.term}</span>
              </h2>
            </div>

            {/* Full Definition */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                <Info className="w-4 h-4" />
                <span>الشرح والمفهوم المحاسبي الكامل:</span>
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed font-normal bg-black/40 p-4 rounded-2xl border border-white/10">
                {activeModalTerm.definition}
              </p>
            </div>

            {/* Journal Entry / Formula Box if present */}
            {(activeModalTerm.journalEntry || activeModalTerm.formula) && (
              <div className="space-y-2">
                <h4 className="text-xs font-black text-indigo-300 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4" />
                  <span>المعادلة أو القيد المحاسبي المرتبط:</span>
                </h4>
                <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-400/30 text-xs font-mono text-indigo-200 font-bold leading-relaxed">
                  {activeModalTerm.journalEntry || activeModalTerm.formula}
                </div>
              </div>
            )}

            {/* Practical Real-World Example */}
            {activeModalTerm.example && (
              <div className="space-y-2">
                <h4 className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>مثال تطبيقي عملي:</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-black/40 p-3.5 rounded-xl border border-white/10">
                  {activeModalTerm.example}
                </p>
              </div>
            )}

            {/* Related Terms */}
            {activeModalTerm.relatedTerms && activeModalTerm.relatedTerms.length > 0 && (
              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-bold text-slate-400">مصطلحات ذات صلة:</h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalTerm.relatedTerms.map((rt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const found = ACCOUNTING_GLOSSARY.find((g) => g.term === rt);
                        if (found) setActiveModalTerm(found);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-indigo-300 text-xs font-black transition-all cursor-pointer"
                    >
                      {rt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Bottom Controls */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSpeak(`${activeModalTerm.term}. ${activeModalTerm.definition}`)}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-indigo-400" />
                  <span>استماع صوتياً</span>
                </button>

                <button
                  onClick={() => toggleFavorite(activeModalTerm.term)}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    favorites.includes(activeModalTerm.term)
                      ? "bg-amber-500/20 border-amber-400 text-amber-300"
                      : "bg-white/5 border-white/10 text-slate-200"
                  }`}
                >
                  <Star className={`w-4 h-4 ${favorites.includes(activeModalTerm.term) ? "fill-amber-300" : ""}`} />
                  <span>{favorites.includes(activeModalTerm.term) ? "محفوظ بـ المفضلة" : "حفظ للمفضلة"}</span>
                </button>
              </div>

              {onSelectTab && (
                <button
                  onClick={() => {
                    setActiveModalTerm(null);
                    onSelectTab("ai");
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs transition-all cursor-pointer flex items-center gap-2 shadow-lg"
                >
                  <Bot className="w-4 h-4" />
                  <span>شرح أعمق بالذكاء الاصطناعي</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
