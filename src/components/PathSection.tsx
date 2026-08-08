import React, { useState, useMemo } from "react";
import { STAGES_DATA } from "../data/curriculum";
import { Stage } from "../types";
import { Language } from "../data/translations";
import { LearningRoadmapChart } from "./LearningRoadmapChart";
import {
  Zap,
  Flame,
  Award,
  CheckCircle2,
  Clock,
  HelpCircle,
  FileText,
  Lock,
  ChevronLeft,
  ChevronDown,
  Sparkles,
  Layers,
  Compass,
  Search,
  Map,
  Grid,
  Play,
  BookOpen,
  ArrowRight,
  Filter,
  Check,
  Star,
  BarChart3,
  TrendingUp
} from "lucide-react";

interface PathSectionProps {
  onOpenStage: (stageId: number, lessonIndex?: number) => void;
  onOpenFlashcards?: (stageId: number) => void;
  appLanguage?: Language;
}

export function PathSection({ onOpenStage, onOpenFlashcards, appLanguage = "ar" }: PathSectionProps) {
  const isEn = appLanguage === "en";

  const LEVEL_TABS = [
    { id: 1, label: isEn ? "Beginner Level" : "المستوى المبتدئ", sub: isEn ? "Fundamentals & Double Entry (1-12)" : "الأساسيات والقيد المزدوج (1-12)", icon: "🌱", accent: "#22C55E", bgGradient: "from-emerald-500/20 to-teal-500/10" },
    { id: 2, label: isEn ? "Intermediate Level" : "المستوى المتوسط", sub: isEn ? "Adjustments & Financial Statements (13-25)" : "التسويات والقوائم المالية (13-25)", icon: "📊", accent: "#3B82F6", bgGradient: "from-blue-500/20 to-indigo-500/10" },
    { id: 3, label: isEn ? "Advanced Level" : "المستوى المتقدم", sub: isEn ? "IFRS & Cost Accounting (26-38)" : "المعايير الدولية IFRS والتكاليف (26-38)", icon: "🏆", accent: "#EAB308", bgGradient: "from-amber-500/20 to-yellow-500/10" },
    { id: 4, label: isEn ? "Professional Level" : "المستوى المحترف", sub: isEn ? "Financial Analysis & Certifications (39-50)" : "التحليل والزمالات المعتمدة (39-50)", icon: "💎", accent: "#A855F7", bgGradient: "from-purple-500/20 to-fuchsia-500/10" }
  ];

  const TOPIC_FILTERS = [
    { id: "ALL", label: isEn ? "All Stages (50 Stages)" : "جميع المراحل (50 مرحلة)" },
    { id: "DOUBLE_ENTRY", label: isEn ? "⚖️ Journal Entries (1-10)" : "⚖️ القيد والمعادلة (1-10)" },
    { id: "STATEMENTS", label: isEn ? "📊 Financial Statements (11-20)" : "📊 القوائم والتقارير (11-20)" },
    { id: "ADJUSTMENTS", label: isEn ? "📉 Adjustments & Depreciation (21-30)" : "📉 التسويات والإهلاك (21-30)" },
    { id: "IFRS", label: isEn ? "💎 IFRS Standards (31-40)" : "💎 معايير IFRS (31-40)" },
    { id: "COSTING", label: isEn ? "🧾 Costing & Certifications (41-50)" : "🧾 التكاليف والزمالات (41-50)" }
  ];
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [viewMode, setViewMode] = useState<"PATH" | "CHART" | "GRID">("PATH");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTopicFilter, setActiveTopicFilter] = useState<string>("ALL");
  const [previewStageModal, setPreviewStageModal] = useState<Stage | null>(null);

  // Completed lessons state from localStorage
  const [completedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("meezan_completed_lessons");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const isStageCompleted = (stageId: number) => {
    const stage = STAGES_DATA.find((s) => s.id === stageId);
    if (!stage) return false;
    return stage.lessons.some((_, lIdx) => completedLessons.includes(`${stageId}-${lIdx}`));
  };

  // Filtered stages calculation
  const filteredStages = useMemo(() => {
    return STAGES_DATA.filter((stage) => {
      // Filter by Search Query
      const matchesSearch =
        searchQuery.trim() === "" ||
        stage.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stage.sub.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stage.lessons.some((l) => l.title.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // Filter by Topic Tag
      if (activeTopicFilter === "ALL") return true;
      if (activeTopicFilter === "DOUBLE_ENTRY") return stage.id <= 10;
      if (activeTopicFilter === "STATEMENTS") return stage.id >= 11 && stage.id <= 20;
      if (activeTopicFilter === "ADJUSTMENTS") return stage.id >= 21 && stage.id <= 30;
      if (activeTopicFilter === "IFRS") return stage.id >= 31 && stage.id <= 40;
      if (activeTopicFilter === "COSTING") return stage.id >= 41;

      return true;
    });
  }, [searchQuery, activeTopicFilter]);

  // Group stages by level for Level View
  const stagesByLevel = useMemo(() => {
    const level1 = filteredStages.filter((s) => s.level === 1 || (s.id >= 1 && s.id <= 12));
    const level2 = filteredStages.filter((s) => s.level === 2 || (s.id >= 13 && s.id <= 25));
    const level3 = filteredStages.filter((s) => s.level === 3 || (s.id >= 26 && s.id <= 38));
    const level4 = filteredStages.filter((s) => s.level === 4 || (s.id >= 39 && s.id <= 50));
    return { 1: level1, 2: level2, 3: level3, 4: level4 };
  }, [filteredStages]);

  const currentLevelStages = stagesByLevel[selectedLevel as 1 | 2 | 3 | 4] || [];
  const activeLevelMeta = LEVEL_TABS.find((t) => t.id === selectedLevel) || LEVEL_TABS[0];

  const totalDoneStages = STAGES_DATA.filter((s) => isStageCompleted(s.id)).length;
  const overallProgress = STAGES_DATA.length > 0 ? totalDoneStages / STAGES_DATA.length : 0;
  const totalXp = STAGES_DATA.filter((s) => isStageCompleted(s.id)).reduce((acc, s) => acc + s.xp, 0);

  return (
    <section className="py-6 max-w-7xl mx-auto px-3 sm:px-4 space-y-8 animate-fadeIn">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER DASHBOARD BANNER
         ───────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1327] via-[#091020] to-[#050914] border border-indigo-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 via-indigo-500/20 to-purple-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black shadow-lg">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>50 مرحلة تعليمية متكاملة — من الأساسيات حتى الزمالات المعتمدة 🔓</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                <span>🗺️ خريطة مسار التعلم المحاسبي</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 font-medium leading-relaxed">
                مسار تفاعلي منظم يُبحر بك من مبادئ القيد المزدوج الأساسية، مروراً بالتسويات الجوفية وقوائم التقارير المعتمدة، وحتى معايير IFRS والتحليل المالي المتقدم.
              </p>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 font-black text-xs flex items-center gap-2 shadow-md">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>جميع الـ {STAGES_DATA.length} مرحلة متوفرة مجاناً</span>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-300 font-black text-xs flex items-center gap-2 shadow-md">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>{totalXp} XP مكتسب</span>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-indigo-500/15 border border-indigo-400/40 text-indigo-300 font-black text-xs flex items-center gap-2 shadow-md">
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                <span>{totalDoneStages} من {STAGES_DATA.length} مرحلة مكتملة</span>
              </div>

              <button
                onClick={() => setViewMode("CHART")}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 hover:text-white hover:bg-emerald-500/30 font-black text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <BarChart3 className="w-4 h-4 text-emerald-300 animate-bounce" />
                <span>📊 فتح الرسم البياني للتعلم</span>
              </button>
            </div>
          </div>

          {/* Progress Circular Widget */}
          <div className="w-full lg:w-auto shrink-0 bg-[#080d1a]/80 p-5 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-5 justify-between lg:justify-start">
            <div className="relative w-22 h-22 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="44"
                  cy="44"
                  r="36"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="7"
                />
                <circle
                  cx="44"
                  cy="44"
                  r="36"
                  fill="none"
                  stroke={activeLevelMeta.accent}
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 36}
                  strokeDashoffset={2 * Math.PI * 36 * (1 - overallProgress)}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-base font-black text-white block">
                  {Math.round(overallProgress * 100)}%
                </span>
                <span className="text-[10px] font-extrabold text-slate-400">
                  {totalDoneStages}/{STAGES_DATA.length}
                </span>
              </div>
            </div>

            <div className="space-y-1 text-right">
              <div className="text-sm font-black text-white">نسبة الإنجاز العامة</div>
              <div className="text-xs text-slate-400">من إجمالي المنهج المحاسبي</div>
              <div className="pt-2">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 text-[11px] font-black">
                  مفتوح 100% 🔓
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. SEARCH & CONTROLS TOOLBAR
         ───────────────────────────────────────────────────────────── */}
      <div className="bg-[#0b1021] border border-white/10 p-4 rounded-2xl space-y-3.5 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* SEARCH INPUT */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن مرحلة أو موضوع (مثال: القيد المزدوج، التسويات، IFRS)..."
              className="w-full bg-black/40 border border-white/15 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* VIEW TOGGLE (PATH MAP vs CHART vs GRID) */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs font-bold text-slate-400 hidden sm:inline">نمط العرض:</span>
            <div className="p-1 rounded-xl bg-black/40 border border-white/10 flex flex-wrap items-center gap-1">
              <button
                onClick={() => setViewMode("PATH")}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "PATH"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>خريطة المسار 🗺️</span>
              </button>

              <button
                onClick={() => setViewMode("CHART")}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "CHART"
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-emerald-300" />
                <span>الرسم البياني للتطور 📊</span>
              </button>

              <button
                onClick={() => setViewMode("GRID")}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "GRID"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>شبكة البطاقات 🗂️</span>
              </button>
            </div>
          </div>
        </div>

        {/* TOPIC FILTER CHIPS */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
          {TOPIC_FILTERS.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setActiveTopicFilter(chip.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                activeTopicFilter === chip.id
                  ? "bg-indigo-600/40 text-indigo-200 border-indigo-400 font-black shadow-md shadow-indigo-900/20"
                  : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. LEVEL SELECTION TABS
         ───────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm md:text-base text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            <span>مستويات خريطة المنهج</span>
          </h3>
          <span className="text-xs text-slate-400">انقر على المستوى لاستعراض مراحله الـ 8</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {LEVEL_TABS.map((tab) => {
            const stagesForTab = stagesByLevel[tab.id as 1 | 2 | 3 | 4] || [];
            const doneInTab = stagesForTab.filter((s) => isStageCompleted(s.id)).length;
            const isSelected = selectedLevel === tab.id;

            return (
              <div
                key={tab.id}
                onClick={() => setSelectedLevel(tab.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? `bg-gradient-to-br ${tab.bgGradient} border-2 shadow-2xl scale-[1.01]`
                    : "bg-[#0b1021] border-white/10 hover:border-white/20 hover:bg-black/30"
                }`}
                style={{
                  borderColor: isSelected ? tab.accent : "rgba(255,255,255,0.1)"
                }}
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{tab.icon}</span>
                  <span
                    className="text-[10px] font-black px-2.5 py-1 rounded-full border"
                    style={{
                      backgroundColor: `${tab.accent}20`,
                      borderColor: `${tab.accent}40`,
                      color: tab.accent
                    }}
                  >
                    8 مراحل
                  </span>
                </div>

                <div className="mt-3 space-y-1">
                  <div className="font-black text-sm text-white" style={{ color: isSelected ? tab.accent : "#FFFFFF" }}>
                    {tab.label}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">{tab.sub}</div>
                </div>

                {/* Progress bar */}
                <div className="mt-3.5 space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>الإنجاز:</span>
                    <span>{doneInTab}/8 مرحلة</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(doneInTab / 8) * 100}%`,
                        backgroundColor: tab.accent
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. MAIN STAGES RENDER (PATH MAP vs CHART vs GRID VIEW)
         ───────────────────────────────────────────────────────────── */}

      {/* VIEW MODE B: INTERACTIVE LEARNING ROADMAP CHART */}
      {viewMode === "CHART" && (
        <LearningRoadmapChart onOpenStage={onOpenStage} completedLessons={completedLessons} />
      )}

      {/* VIEW MODE A: WINDING VISUAL PATH MAP (خريطة المسار المترابطة) */}
      {viewMode === "PATH" && (
        <div className="bg-[#0b1021] border border-white/10 rounded-3xl p-6 sm:p-10 space-y-10 shadow-2xl relative overflow-hidden">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{activeLevelMeta.icon}</span>
              <div>
                <h3 className="text-lg font-black text-white">{activeLevelMeta.label} — مسار التعلّم التدريجي</h3>
                <p className="text-xs text-slate-400">{activeLevelMeta.sub}</p>
              </div>
            </div>

            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black">
              🔓 جميع المراحل الموضحة أدناه مفتوحة ومتاحة
            </span>
          </div>

          {currentLevelStages.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm font-bold">
              لا توجد مراحل تطابق بحثك حالياً. جرب البحث باسم آخر أو تغيير تصفية الموضوعات.
            </div>
          ) : (
            <div className="relative max-w-3xl mx-auto py-4">
              
              {/* VERTICAL CONNECTING ROAD LINE */}
              <div className="absolute top-8 bottom-8 right-1/2 translate-x-1/2 w-1.5 bg-gradient-to-b from-emerald-500 via-indigo-500 to-purple-500/30 rounded-full opacity-40 pointer-events-none" />

              <div className="space-y-12 relative z-10">
                {currentLevelStages.map((st, index) => {
                  const completed = isStageCompleted(st.id);
                  const isEven = index % 2 === 0;

                  return (
                    <div
                      key={st.id}
                      className={`flex flex-col sm:flex-row items-center gap-6 ${
                        isEven ? "sm:flex-row-reverse" : ""
                      }`}
                    >
                      {/* STAGE NODE CARD */}
                      <div className="flex-1 w-full sm:w-auto bg-[#0d1424] border border-white/12 hover:border-indigo-400/50 p-5 rounded-3xl shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl space-y-3 relative group">
                        
                        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                          <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                            مرحلة #{st.id}
                          </span>

                          <span className="text-[11px] text-amber-300 font-mono font-bold">
                            +{st.xp} XP
                          </span>
                        </div>

                        <div className="flex items-start gap-3">
                          <span className="text-3xl shrink-0 p-2.5 rounded-2xl bg-white/5 border border-white/10">
                            {st.icon}
                          </span>

                          <div className="space-y-1">
                            <h4 className="font-black text-base text-white group-hover:text-cyan-300 transition-colors">
                              {st.name}
                            </h4>
                            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                              {st.sub}
                            </p>
                          </div>
                        </div>

                        {/* Quick Stats Chips */}
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold pt-1">
                          <span className="flex items-center gap-1">⏱️ {st.durationMinutes || 15}د</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">❓ {st.questions || 10} سؤالاً</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">📘 20 وحدة</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                          <button
                            onClick={() => onOpenStage(st.id, 0)}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>ابدأ المرحلة الآن</span>
                          </button>

                          <button
                            onClick={() => setPreviewStageModal(st)}
                            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10 text-xs font-bold transition-all cursor-pointer"
                            title="استعراض الوحدات الـ 20 بالكامل"
                          >
                            <BookOpen className="w-4 h-4 text-cyan-300" />
                          </button>

                          {onOpenFlashcards && (
                            <button
                              onClick={() => onOpenFlashcards(st.id)}
                              className="p-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/30 text-xs font-bold transition-all cursor-pointer"
                              title="بطاقات المراجعة السريعة"
                            >
                              🃏
                            </button>
                          )}
                        </div>

                      </div>

                      {/* CENTRAL NODE SPHERE WITH GLOW */}
                      <div className="shrink-0 relative z-10 my-2 sm:my-0">
                        <button
                          onClick={() => onOpenStage(st.id, 0)}
                          className={`w-14 h-14 rounded-full border-4 flex items-center justify-center font-black text-lg transition-all cursor-pointer shadow-2xl hover:scale-110 ${
                            completed
                              ? "bg-emerald-500 border-emerald-300 text-white shadow-emerald-500/50"
                              : "bg-indigo-600 border-indigo-300 text-white shadow-indigo-600/50 animate-pulse"
                          }`}
                        >
                          {completed ? "✓" : st.id}
                        </button>
                      </div>

                      {/* BALANCING SPACER FOR DESKTOP ALIGNMENT */}
                      <div className="flex-1 hidden sm:block" />

                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE B: GRID CARDS VIEW (شبكة البطاقات التفصيلية) */}
      {viewMode === "GRID" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>جميع مراحل {activeLevelMeta.label} ({currentLevelStages.length})</span>
            </h3>

            <span className="text-xs text-slate-400">
              اختر أي بطاقة لبدء الدرس فوراً
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentLevelStages.map((st) => {
              const completed = isStageCompleted(st.id);

              return (
                <div
                  key={st.id}
                  className={`bg-[#0b1021] border rounded-3xl p-5 shadow-xl transition-all space-y-4 relative overflow-hidden ${
                    completed
                      ? "border-emerald-500/50 bg-emerald-950/10"
                      : "border-indigo-500/30 hover:border-indigo-400 hover:-translate-y-1"
                  }`}
                >
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 font-black border border-indigo-500/40">
                      مرحلة {st.id} من 32
                    </span>

                    <span className="font-mono text-amber-300 font-black">
                      +{st.xp} XP
                    </span>
                  </div>

                  {/* Stage Header */}
                  <div className="flex items-start gap-3.5">
                    <span className="text-3xl p-3 rounded-2xl bg-white/5 border border-white/10 shrink-0">
                      {st.icon}
                    </span>

                    <div className="space-y-1">
                      <h4 className="font-black text-base text-white">
                        {st.name}
                      </h4>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {st.sub}
                      </p>
                    </div>
                  </div>

                  {/* Lesson Units Chips */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold text-slate-300">
                    <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                      ⏱️ {st.durationMinutes || 15}د
                    </div>
                    <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                      ❓ {st.questions || 10} سؤالاً
                    </div>
                    <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                      📘 20 وحدة
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onOpenStage(st.id, 0)}
                      className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{completed ? "مراجعة الدرس" : "ابدأ الدرس الآن"}</span>
                    </button>

                    <button
                      onClick={() => setPreviewStageModal(st)}
                      className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10 text-xs font-bold transition-all cursor-pointer"
                      title="عرض فهرس الوحدات الـ 20"
                    >
                      <BookOpen className="w-4 h-4 text-cyan-300" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. STAGE LESSONS PREVIEW MODAL (فهرس الوحدات الـ 20 للمرحلة)
         ───────────────────────────────────────────────────────────── */}
      {previewStageModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0b1021] border border-indigo-500/40 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 rounded-2xl bg-white/5 border border-white/10">
                  {previewStageModal.icon}
                </span>
                <div>
                  <h3 className="font-black text-base text-white">{previewStageModal.name}</h3>
                  <p className="text-xs text-slate-400">فهرس الوحدات التعليمية الـ 20 المتاحة بالمرحلة</p>
                </div>
              </div>

              <button
                onClick={() => setPreviewStageModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center text-sm font-black transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body - List of 20 Lessons */}
            <div className="p-5 overflow-y-auto space-y-2.5 flex-1 scrollbar-thin scrollbar-thumb-indigo-600/40">
              {previewStageModal.lessons.map((lesson, lIdx) => (
                <div
                  key={lIdx}
                  onClick={() => {
                    const stId = previewStageModal.id;
                    setPreviewStageModal(null);
                    onOpenStage(stId, lIdx);
                  }}
                  className="p-3.5 rounded-2xl bg-black/40 hover:bg-indigo-950/40 border border-white/10 hover:border-indigo-500/40 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-indigo-600/30 text-indigo-300 font-mono text-xs font-black flex items-center justify-center shrink-0 border border-indigo-500/30">
                      #{lIdx + 1}
                    </span>

                    <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                      {lesson.title}
                    </span>
                  </div>

                  <span className="text-xs font-black text-indigo-400 group-hover:translate-x-[-4px] transition-transform flex items-center gap-1 shrink-0">
                    <span>انتقل للوحدة</span>
                    <ChevronLeft className="w-4 h-4" />
                  </span>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">مكافأة المرحلة: +{previewStageModal.xp} XP</span>

              <button
                onClick={() => {
                  const stId = previewStageModal.id;
                  setPreviewStageModal(null);
                  onOpenStage(stId, 0);
                }}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>ابدأ المرحلة من البداية</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
