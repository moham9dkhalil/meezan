import { useMemo, useState } from "react";
import { ActiveTab } from "../types";
import { Language } from "../data/translations";
import { INTERVIEW_LEVELS, InterviewLevel } from "../data/interviewQuestions";
import {
  Search,
  ChevronDown,
  Lightbulb,
  Copy,
  Check,
  Sparkles,
  MessageCircleQuestion,
  Target,
  GraduationCap,
  UserRound,
  Briefcase,
  Building2,
  TrendingUp,
  Crown
} from "lucide-react";

interface InterviewQuestionsSectionProps {
  onSelectTab?: (tab: ActiveTab) => void;
  appLanguage?: Language;
}

const LEVEL_ICONS: Record<string, any> = {
  fresh_graduate: GraduationCap,
  junior: UserRound,
  senior: Briefcase,
  chief: Building2,
  finance_manager: TrendingUp,
  cfo: Crown
};

export function InterviewQuestionsSection({
  onSelectTab,
  appLanguage = "ar"
}: InterviewQuestionsSectionProps) {
  const isEn = appLanguage === "en";
  const [selectedLevelId, setSelectedLevelId] = useState<string>("fresh_graduate");
  const [searchQuery, setSearchQuery] = useState("");
  const [openQAs, setOpenQAs] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedLevel =
    INTERVIEW_LEVELS.find((l) => l.id === selectedLevelId) || INTERVIEW_LEVELS[0];

  const searching = searchQuery.trim().length > 0;

  const changeLevel = (id: string) => {
    setSelectedLevelId(id);
    setOpenQAs(new Set());
    setSearchQuery("");
  };

  const toggleQA = (key: string) => {
    setOpenQAs((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(key);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // ignore clipboard errors
    }
  };

  const filtered: InterviewLevel = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return selectedLevel;
    return {
      ...selectedLevel,
      categories: selectedLevel.categories
        .map((cat) => ({
          ...cat,
          items: cat.items.filter(
            (it) => it.q.toLowerCase().includes(q) || it.a.toLowerCase().includes(q)
          )
        }))
        .filter((cat) => cat.items.length > 0)
    } as InterviewLevel;
  }, [selectedLevel, searchQuery]);

  const totalQuestions = selectedLevel.categories.reduce((n, c) => n + c.items.length, 0);
  const visibleCount = filtered.categories.reduce((n, c) => n + c.items.length, 0);

  return (
    <section className="space-y-6 animate-fadeIn pb-12 relative">
      {/* HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1A102F] via-[#2A1647] to-[#120B20] border-2 border-indigo-500/30 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-indigo-500/20 border border-amber-400/40 text-amber-300 text-xs font-black shadow-md">
            <MessageCircleQuestion className="w-4 h-4 text-amber-300" />
            <span>{isEn ? "Accounting Job Interviews Q&A" : "بنك أسئلة المقابلات الوظيفية للمحاسب"}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            {isEn
              ? "From Fresh Graduate to CFO — Every Question Asked in Accounting Interviews"
              : "كل الأسئلة التي تُسأل لمحاسبين: من حديث التخرج حتى أعلى المناصب 🎯"}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-3xl">
            {isEn
              ? "Choose your career level and prepare with real interview questions, model answers, practical journal entries, and pro tips — from entry-level basics to executive CFO strategy, governance and integrity."
              : "اختر مستواك الوظيفي وتدرب على أسئلة المقابلات الحقيقية مع إجابات نموذجية وقيود عملية ونصائح احترافية — من أساسيات البداية وحتى استراتيجية المدير المالي التنفيذي والحوكمة والنزاهة المهنية."}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-bold text-slate-400">
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
              {isEn ? "6 Career Levels" : "6 مستويات وظيفية"}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
              {INTERVIEW_LEVELS.reduce((n, l) => n + l.categories.reduce((c, x) => c + x.items.length, 0), 0)}{" "}
              {isEn ? "Questions & Answers" : "سؤال وإجابة نموذجية"}
            </span>
          </div>
        </div>
      </div>

      {/* LEVEL SELECTOR */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-80 shrink-0 space-y-4">
          <div className="bg-[#120B21] border-2 border-purple-500/30 rounded-3xl p-4 sm:p-5 space-y-3">
            <h3 className="text-xs font-black text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-400" />
              <span>{isEn ? "Your Career Level" : "حدد مستواك الوظيفي"}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {INTERVIEW_LEVELS.map((lvl) => {
                const LevelIcon = LEVEL_ICONS[lvl.id];
                const isActive = lvl.id === selectedLevelId;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => changeLevel(lvl.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer text-right ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600/30 via-indigo-600/30 to-purple-600/30 border-indigo-400/60 shadow-lg shadow-indigo-500/20 scale-[1.02]"
                        : "bg-[#180F2A] border-white/10 hover:border-purple-500/40 hover:bg-[#1f1337]"
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-xl ${
                        isActive ? "bg-amber-400/20 text-amber-300 border border-amber-400/40" : "bg-white/5 text-slate-300 border border-white/10"
                      }`}
                    >
                      <LevelIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-black text-white leading-tight">
                        {isEn ? lvl.levelEn : lvl.level}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold mt-0.5">{lvl.years}</div>
                    </div>
                    <span className={`text-lg ${lvl.text}`}>{lvl.icon}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* LEVEL SUMMARY CARD */}
          <div className="bg-gradient-to-br from-[#1B1130] to-[#120B20] border border-amber-500/25 rounded-3xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedLevel.icon}</span>
              <div>
                <h4 className="text-sm font-black text-white">{isEn ? selectedLevel.levelEn : selectedLevel.level}</h4>
                <p className="text-[10px] text-slate-400 font-bold">{selectedLevel.role}</p>
              </div>
              <span className="mr-auto px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30 text-[10px] font-black">
                {selectedLevel.badge}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium leading-relaxed">{selectedLevel.intro}</p>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-bold text-slate-400">
              <span>{isEn ? "Questions in this level:" : "عدد أسئلة هذا المستوى:"}</span>
              <span className="px-2 py-0.5 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-400/30 font-mono">
                {totalQuestions} سؤال
              </span>
            </div>
          </div>
        </div>

        {/* QUESTIONS COLUMN */}
        <div className="flex-1 space-y-4 min-w-0">
          {/* SEARCH BAR */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isEn
                  ? "Search a question or keyword in this level..."
                  : "ابحث عن سؤال أو كلمة مفتاحية في هذا المستوى..."
              }
              className="w-full bg-[#0e081c] border border-white/15 rounded-2xl pr-10 pl-10 py-3 text-xs text-white placeholder-slate-400 outline-none focus:border-indigo-400 shadow-lg"
            />
            {searching && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* RESULTS COUNT */}
          <div className="text-[11px] text-slate-400 font-bold flex items-center gap-2">
            <span>{isEn ? `Showing` : `عرض`}</span>
            <span className="px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-400/30 font-mono">
              {visibleCount}
            </span>
            <span>{isEn ? `of ${totalQuestions} questions` : `من أصل ${totalQuestions} سؤال`}</span>
            {searching && <span className="text-purple-300">— {isEn ? "search results" : "نتائج البحث"}</span>}
          </div>

          {/* CATEGORIES & QUESTIONS */}
          {filtered.categories.length === 0 ? (
            <div className="bg-[#120B21] border border-white/10 rounded-3xl p-10 text-center space-y-3">
              <div className="text-4xl">🔍</div>
              <p className="text-sm font-black text-white">
                {isEn ? "No matching questions found" : "لا توجد أسئلة مطابقة للبحث"}
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black cursor-pointer transition-all"
              >
                {isEn ? "Clear search" : "مسح البحث"}
              </button>
            </div>
          ) : (
            filtered.categories.map((cat) => (
              <div key={cat.title} className="bg-[#120B21] border-2 border-purple-500/30 rounded-3xl p-5 sm:p-6 space-y-3 shadow-2xl">
                <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
                  <span className="text-lg">{cat.icon}</span>
                  <h3 className="text-sm sm:text-base font-black text-white">{cat.title}</h3>
                  <span className="mr-auto px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-400/30 text-[10px] font-black font-mono">
                    {cat.items.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {cat.items.map((item, idx) => {
                    const key = `${cat.title}-${idx}`;
                    const isOpen = openQAs.has(key) || searching;
                    return (
                      <div
                        key={key}
                        className={`rounded-2xl border transition-all overflow-hidden ${
                          isOpen
                            ? "border-amber-400/40 bg-[#1A1130]"
                            : "border-white/10 bg-[#180F2A] hover:border-purple-500/40"
                        }`}
                      >
                        <button
                          onClick={() => toggleQA(key)}
                          className="w-full flex items-center gap-3 p-4 text-right cursor-pointer group"
                        >
                          <span
                            className={`p-2 rounded-xl shrink-0 transition-all ${
                              isOpen ? "bg-amber-400/20 text-amber-300" : "bg-indigo-500/15 text-indigo-300"
                            }`}
                          >
                            <MessageCircleQuestion className="w-4 h-4" />
                          </span>
                          <span className="flex-1 text-xs sm:text-sm font-black text-white group-hover:text-amber-200 transition-colors leading-relaxed">
                            {item.q}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-180 text-amber-300" : ""}`}
                          />
                        </button>

                        {isOpen && (
                          <div className="px-4 pb-4 space-y-3 animate-fadeIn">
                            <div className="bg-[#0d0819] border border-purple-500/20 rounded-xl p-3.5 text-xs sm:text-[13px] text-slate-200 font-medium leading-relaxed space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-black text-emerald-400 flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" />
                                  {isEn ? "Model Answer:" : "الإجابة النموذجية:"}
                                </span>
                                <button
                                  onClick={() => handleCopy(key, `${item.q}\n\n${item.a}${item.tip ? `\n\n💡 ${item.tip}` : ""}`)}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 text-[10px] font-bold transition-all cursor-pointer"
                                >
                                  {copiedId === key ? (
                                    <Check className="w-3 h-3 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                  <span>{copiedId === key ? (isEn ? "Copied" : "تم النسخ") : (isEn ? "Copy" : "نسخ")}</span>
                                </button>
                              </div>
                              <p className="whitespace-pre-line">{item.a}</p>
                            </div>

                            {item.tip && (
                              <div className="bg-amber-950/25 border border-amber-500/30 rounded-xl p-3 text-[11px] sm:text-xs text-amber-200 font-medium leading-relaxed flex items-start gap-2">
                                <Lightbulb className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                                <span>
                                  <span className="font-black text-amber-300">{isEn ? "Pro tip: " : "نصيحة احترافية: "}</span>
                                  {item.tip}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}

          {/* FOOTER CTA */}
          {!searching && (
            <div className="bg-gradient-to-r from-[#1B1130] via-[#24133F] to-[#120B20] border-2 border-emerald-500/30 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div className="space-y-1.5">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>{isEn ? "Ready for more practice?" : "جاهز لمزيد من التدريب العملي؟"}</span>
                </h4>
                <p className="text-xs text-slate-400 font-medium">
                  {isEn
                    ? "Test yourself with smart quizzes and the SOCPA simulator to lock in your interview confidence."
                    : "اختبر نفسك بالاختبارات الذكية ومحاكي SOCPA لتثبيت ثقتك قبل مقابلة العمل."}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  onClick={() => onSelectTab?.("smartQuizzes")}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black cursor-pointer transition-all shadow-lg shadow-emerald-950"
                >
                  {isEn ? "Smart Quizzes" : "الاختبارات الذكية"}
                </button>
                <button
                  onClick={() => onSelectTab?.("socpaExam")}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-black cursor-pointer transition-all"
                >
                  {isEn ? "SOCPA Simulator" : "محاكي SOCPA"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
