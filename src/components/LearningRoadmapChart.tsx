import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { STAGES_DATA } from "../data/curriculum";
import { Stage } from "../types";
import {
  Sparkles,
  CheckCircle2,
  Lock,
  Zap,
  Flame,
  Award,
  TrendingUp,
  Map,
  BarChart3,
  PieChart as PieChartIcon,
  Compass,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  Play,
  RotateCcw,
  Check,
  Star,
  Target,
  Clock,
  BookOpen,
  Filter,
  CheckCheck,
  ShieldCheck,
  Layers
} from "lucide-react";

interface LearningRoadmapChartProps {
  onOpenStage: (stageId: number, lessonIndex?: number) => void;
  completedLessons?: string[];
}

const LEVEL_METADATA = [
  { id: 1, name: "المستوى المبتدئ", range: "المراحل 1 - 12", desc: "الأساسيات والقيد المزدوج والمعادلة المحاسبية", icon: "🌱", color: "#10b981", bg: "from-emerald-500/20 to-teal-500/10", border: "border-emerald-500/30" },
  { id: 2, name: "المستوى المتوسط", range: "المراحل 13 - 25", desc: "التسويات الجردية والقوائم والتقارير المالية", icon: "📊", color: "#3b82f6", bg: "from-blue-500/20 to-indigo-500/10", border: "border-blue-500/30" },
  { id: 3, name: "المستوى المتقدم", range: "المراحل 26 - 38", desc: "معايير التقارير الدولية IFRS ومحاسبة الشركات", icon: "🏆", color: "#eab308", bg: "from-amber-500/20 to-yellow-500/10", border: "border-amber-500/30" },
  { id: 4, name: "المستوى المحترف", range: "المراحل 39 - 50", desc: "التحليل المالي، التكاليف، وإعداد الزمالات المعتمدة", icon: "💎", color: "#a855f7", bg: "from-purple-500/20 to-fuchsia-500/10", border: "border-purple-500/30" }
];

const TOPIC_CATEGORIES = [
  { id: "DOUBLE_ENTRY", name: "القيد والمعادلة", start: 1, end: 10, color: "#10b981" },
  { id: "STATEMENTS", name: "القوائم والتقارير", start: 11, end: 20, color: "#06b6d4" },
  { id: "ADJUSTMENTS", name: "التسويات والإهلاك", start: 21, end: 30, color: "#3b82f6" },
  { id: "IFRS", name: "معايير IFRS الدولية", start: 31, end: 40, color: "#8b5cf6" },
  { id: "COSTING", name: "التكاليف والزمالات", start: 41, end: 50, color: "#ec4899" }
];

export function LearningRoadmapChart({ onOpenStage, completedLessons: propCompletedLessons }: LearningRoadmapChartProps) {
  // Read completed lessons from props or localStorage
  const [completedState, setCompletedState] = useState<string[]>(() => {
    if (propCompletedLessons && propCompletedLessons.length > 0) {
      return propCompletedLessons;
    }
    try {
      const saved = localStorage.getItem("meezan_completed_lessons");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState<"curve" | "levels" | "topics" | "graph">("curve");
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<number | "ALL">("ALL");
  const [hoveredStage, setHoveredStage] = useState<Stage | null>(null);

  // Helper to check if stage is completed
  const isStageCompleted = (stageId: number) => {
    const stage = STAGES_DATA.find((s) => s.id === stageId);
    if (!stage) return false;
    return stage.lessons.some((_, lIdx) => completedState.includes(`${stageId}-${lIdx}`));
  };

  // Helper to get lesson completion count for a stage
  const getStageCompletedLessonsCount = (stageId: number) => {
    const stage = STAGES_DATA.find((s) => s.id === stageId);
    if (!stage) return 0;
    return stage.lessons.filter((_, lIdx) => completedState.includes(`${stageId}-${lIdx}`)).length;
  };

  // Overall statistics
  const totalStages = STAGES_DATA.length;
  const completedStagesCount = useMemo(() => {
    return STAGES_DATA.filter((s) => isStageCompleted(s.id)).length;
  }, [completedState]);

  const progressPercentage = Math.round((completedStagesCount / totalStages) * 100);

  const totalXpEarned = useMemo(() => {
    return STAGES_DATA.filter((s) => isStageCompleted(s.id)).reduce((sum, s) => sum + s.xp, 0);
  }, [completedState]);

  const maxTotalXp = useMemo(() => {
    return STAGES_DATA.reduce((sum, s) => sum + s.xp, 0);
  }, []);

  const totalEstimatedHours = useMemo(() => {
    const remainingMins = STAGES_DATA.filter((s) => !isStageCompleted(s.id)).reduce((sum, s) => sum + (s.durationMinutes || 15), 0);
    return Math.round(remainingMins / 60);
  }, [completedState]);

  // Data for Cumulative XP & Progress Curve Chart (Stages 1 to 50)
  const cumulativeChartData = useMemo(() => {
    let runningCompletedXp = 0;
    let runningTargetXp = 0;

    return STAGES_DATA.map((stage) => {
      const isDone = isStageCompleted(stage.id);
      runningTargetXp += stage.xp;
      if (isDone) {
        runningCompletedXp += stage.xp;
      }

      return {
        stageId: stage.id,
        stageName: `مـ${stage.id}: ${stage.name}`,
        shortName: `مـ${stage.id}`,
        level: stage.level,
        xp: stage.xp,
        earnedXp: isDone ? stage.xp : 0,
        cumulativeEarnedXp: runningCompletedXp,
        cumulativeTargetXp: runningTargetXp,
        isCompleted: isDone,
        statusLabel: isDone ? "مكتملة ✅" : "قيد التعلم 🔒",
        completedFill: isDone ? "#10b981" : "#1e293b"
      };
    });
  }, [completedState]);

  // Data for Levels Comparison Bar Chart (4 Levels)
  const levelComparisonData = useMemo(() => {
    return LEVEL_METADATA.map((lvl) => {
      const levelStages = STAGES_DATA.filter((s) => {
        if (lvl.id === 1) return s.id <= 12;
        if (lvl.id === 2) return s.id >= 13 && s.id <= 25;
        if (lvl.id === 3) return s.id >= 26 && s.id <= 38;
        return s.id >= 39;
      });

      const completedCount = levelStages.filter((s) => isStageCompleted(s.id)).length;
      const remainingCount = levelStages.length - completedCount;
      const levelProgressPct = levelStages.length > 0 ? Math.round((completedCount / levelStages.length) * 100) : 0;

      return {
        id: lvl.id,
        levelName: lvl.name,
        icon: lvl.icon,
        total: levelStages.length,
        completed: completedCount,
        remaining: remainingCount,
        progressPct: levelProgressPct,
        color: lvl.color
      };
    });
  }, [completedState]);

  // Data for Category Topics Pie & Bar Chart
  const categoryTopicsData = useMemo(() => {
    return TOPIC_CATEGORIES.map((cat) => {
      const catStages = STAGES_DATA.filter((s) => s.id >= cat.start && s.id <= cat.end);
      const doneCount = catStages.filter((s) => isStageCompleted(s.id)).length;
      const totalCatStages = catStages.length;
      const pct = totalCatStages > 0 ? Math.round((doneCount / totalCatStages) * 100) : 0;

      return {
        name: cat.name,
        range: `${cat.start}-${cat.end}`,
        completed: doneCount,
        remaining: totalCatStages - doneCount,
        total: totalCatStages,
        percentage: pct,
        color: cat.color
      };
    });
  }, [completedState]);

  // Current Active Stage (First uncompleted stage)
  const currentNextStage = useMemo(() => {
    return STAGES_DATA.find((s) => !isStageCompleted(s.id)) || STAGES_DATA[STAGES_DATA.length - 1];
  }, [completedState]);

  return (
    <div className="space-y-6 animate-fadeIn text-right dir-rtl">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER ROADMAP CARD WITH PROGRESS METRICS
         ───────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1329] via-[#0a1024] to-[#060a17] border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black shadow-lg">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>رسم بياني تفاعلي حي لمراحل التعلم والاحتراف المحاسبي</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                <span>📊 خريطة طريق التعلم للوصول إلى الاحتراف</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-2xl">
                تتبع مسارك المحاسبي خطوة بخطوة من مرحلة القيد المزدوج حتى الزمالات المعتمدة، واكتشف ما تم إنجازه وما تبقى للوصول إلى القمة.
              </p>
            </div>

            {/* Overall Mastery Percentage Radial Circle */}
            <div className="w-full lg:w-auto shrink-0 bg-[#080d1e]/90 p-5 rounded-2xl border border-white/10 shadow-xl flex items-center gap-5 justify-between lg:justify-start">
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 32}
                    strokeDashoffset={2 * Math.PI * 32 * (1 - progressPercentage / 100)}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-base font-black text-white block">{progressPercentage}%</span>
                  <span className="text-[9px] font-bold text-emerald-400">مكتمل</span>
                </div>
              </div>

              <div className="space-y-1 text-right">
                <div className="text-xs font-black text-slate-300">مستوى التقدم الشامل</div>
                <div className="text-sm font-black text-emerald-400">{completedStagesCount} من {totalStages} مرحلة</div>
                <p className="text-[11px] text-slate-400">متبقى حوالي {totalEstimatedHours} ساعة دراسية للختام</p>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>المراحل المنجزة</span>
              </span>
              <div className="text-lg font-black text-emerald-400">{completedStagesCount} <span className="text-xs text-slate-400 font-normal">/ {totalStages}</span></div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>نقاط الخبرة XP</span>
              </span>
              <div className="text-lg font-black text-amber-300">{totalXpEarned.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ {maxTotalXp.toLocaleString()}</span></div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>المراحل المتبقية</span>
              </span>
              <div className="text-lg font-black text-cyan-300">{totalStages - completedStagesCount} <span className="text-xs text-slate-400 font-normal">مرحلة</span></div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-purple-400" />
                <span>المرحلة الحالية القادمة</span>
              </span>
              <div className="text-xs font-black text-purple-300 truncate">
                مـ{currentNextStage.id}: {currentNextStage.name}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. CHART VIEW TABS & CONTROLS
         ───────────────────────────────────────────────────────────── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#090e1f] border border-indigo-500/30 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab("curve")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
                activeTab === "curve"
                  ? "bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30"
                  : "bg-white/5 text-slate-300 border-white/5 hover:text-white"
              }`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>منحنى تقدم الخبرة (50 مرحلة)</span>
            </button>

            <button
              onClick={() => setActiveTab("levels")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
                activeTab === "levels"
                  ? "bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30"
                  : "bg-white/5 text-slate-300 border-white/5 hover:text-white"
              }`}
            >
              <BarChart3 className="w-4 h-4 text-amber-300" />
              <span>إنجاز المستويات الأربعة</span>
            </button>

            <button
              onClick={() => setActiveTab("topics")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
                activeTab === "topics"
                  ? "bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30"
                  : "bg-white/5 text-slate-300 border-white/5 hover:text-white"
              }`}
            >
              <PieChartIcon className="w-4 h-4 text-purple-400" />
              <span>توزيع المحاور والمهارات</span>
            </button>

            <button
              onClick={() => setActiveTab("graph")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
                activeTab === "graph"
                  ? "bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30"
                  : "bg-white/5 text-slate-300 border-white/5 hover:text-white"
              }`}
            >
              <Map className="w-4 h-4 text-cyan-400" />
              <span>خريطة العُقد الموصلة 🗺️</span>
            </button>
          </div>

          {/* Optional Level Filter dropdown */}
          <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-bold shrink-0">
            <span className="text-slate-400 px-2">تصفية:</span>
            <button
              onClick={() => setSelectedLevelFilter("ALL")}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${selectedLevelFilter === "ALL" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
            >
              الكل
            </button>
            {[1, 2, 3, 4].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevelFilter(lvl)}
                className={`px-2.5 py-1 rounded-lg cursor-pointer ${selectedLevelFilter === lvl ? "bg-indigo-600 text-white" : "text-slate-400"}`}
              >
                مـ{lvl}
              </button>
            ))}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            CHART RENDER AREA
           ───────────────────────────────────────────────────────────── */}
        <div className="w-full h-80 sm:h-96 min-h-[320px] pt-2">
          {/* CHART VIEW 1: CUMULATIVE PROGRESS & XP CURVE */}
          {activeTab === "curve" && (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={cumulativeChartData.filter((d) => selectedLevelFilter === "ALL" || d.level === selectedLevelFilter)}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="earnedXpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
                <XAxis dataKey="shortName" stroke="#94a3b8" tick={{ fontSize: 10, fontWeight: "bold" }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} tickFormatter={(val) => `${val} XP`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0b1226", borderColor: "#10b981", borderRadius: "16px", color: "#fff", fontSize: "12px", textAlign: "right" }}
                  formatter={(value: any, name: any) => [
                    `${Number(value).toLocaleString()} XP`,
                    name === "cumulativeEarnedXp" ? "نقاط XP المنجزة" : "الهدف التراكمي للإتقان"
                  ]}
                  labelFormatter={(label, items) => {
                    const item = items && items[0] ? items[0].payload : null;
                    return item ? `${item.stageName} (${item.statusLabel})` : label;
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: "15px", fontSize: "12px", fontWeight: "bold" }} />
                <Area
                  type="monotone"
                  dataKey="cumulativeEarnedXp"
                  name="نقاط XP المنجزة بالفعل (المسار المكتمل)"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#earnedXpGrad)"
                />
                <Line
                  type="monotone"
                  dataKey="cumulativeTargetXp"
                  name="خط الهدف الكلي للوصول للاحتراف"
                  stroke="#6366f1"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
                <Bar dataKey="earnedXp" name="نقاط المرحلة الحالية" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          )}

          {/* CHART VIEW 2: STAGES STATUS BY LEVEL (BAR CHART) */}
          {activeTab === "levels" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={levelComparisonData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
                <XAxis dataKey="levelName" stroke="#94a3b8" tick={{ fontSize: 11, fontWeight: "bold" }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0b1226", borderColor: "#6366f1", borderRadius: "16px", color: "#fff", fontSize: "12px", textAlign: "right" }}
                  formatter={(val: any, name: any) => [
                    `${val} مرحلة`,
                    name === "completed" ? "المراحل المكتملة" : "المراحل المتبقية"
                  ]}
                />
                <Legend wrapperStyle={{ paddingTop: "15px", fontSize: "12px", fontWeight: "bold" }} />
                <Bar dataKey="completed" name="المراحل المنجزة (المسار المكتمل)" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                <Bar dataKey="remaining" name="المراحل المتبقية للإتقان" stackId="a" fill="#334155" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {/* CHART VIEW 3: TOPICS AND SKILLS BREAKDOWN */}
          {activeTab === "topics" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full items-center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categoryTopicsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="completed"
                    nameKey="name"
                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                  >
                    {categoryTopicsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0b1226", borderColor: "#a855f7", borderRadius: "16px", color: "#fff", fontSize: "12px", textAlign: "right" }}
                    formatter={(val: any) => [`${val} مرحلة مكتملة`, "الإنجاز"]}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Topic Cards List */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black text-slate-300 border-b border-white/10 pb-2 flex items-center justify-between">
                  <span>نسبة الإنجاز حسب المحور المحاسبي</span>
                  <span>المستهدف (10 مراحل/محور)</span>
                </h4>
                {categoryTopicsData.map((cat, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between font-bold">
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                        <span className="text-white">{cat.name} (المراحل {cat.range})</span>
                      </div>
                      <span className="text-emerald-400 font-black">{cat.completed} / {cat.total} ({cat.percentage}%)</span>
                    </div>

                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500 rounded-full"
                        style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CHART VIEW 4: VISUAL INTERACTIVE NODE ROADMAP GRAPH */}
          {activeTab === "graph" && (
            <div className="overflow-x-auto py-4">
              <div className="min-w-[700px] space-y-6">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold px-2">
                  <span>البداية: القيد المزدوج (مـ1)</span>
                  <span className="text-emerald-400 font-black flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block live-dot-glow" />
                    المسار الأخضر المتصل = مراحل تم إنجازها
                  </span>
                  <span>الهدف: الاحتراف الشامل (مـ50)</span>
                </div>

                {/* 50 Nodes Connected Layout */}
                <div className="grid grid-cols-10 gap-2 p-4 bg-black/40 rounded-2xl border border-white/10 relative">
                  {STAGES_DATA.map((stg, index) => {
                    const isDone = isStageCompleted(stg.id);
                    const isNext = stg.id === currentNextStage.id;

                    return (
                      <button
                        key={stg.id}
                        onClick={() => onOpenStage(stg.id)}
                        onMouseEnter={() => setHoveredStage(stg)}
                        onMouseLeave={() => setHoveredStage(null)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer relative ${
                          isDone
                            ? "bg-emerald-100/80 border-emerald-500/60 text-emerald-700 shadow-md shadow-emerald-500/10 hover:scale-105"
                            : isNext
                            ? "bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300 text-white node-glow-gold hover:scale-105"
                            : "bg-slate-100 border-slate-300 text-slate-400 opacity-70 hover:opacity-100 hover:border-slate-400"
                        }`}
                      >
                        <span className="text-xs">{stg.icon || "📚"}</span>
                        <span className="text-[10px] font-black">{stg.id}</span>
                        {isDone ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : isNext ? (
                          <Play className="w-3 h-3 text-white fill-white" />
                        ) : (
                          <Lock className="w-3 h-3 text-slate-400" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Hovered Stage Tooltip Banner */}
                {hoveredStage && (
                  <div className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-400/50 text-xs text-white flex items-center justify-between animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{hoveredStage.icon}</span>
                      <div>
                        <span className="font-black text-indigo-300">مرحلة {hoveredStage.id}: {hoveredStage.name}</span>
                        <p className="text-[11px] text-slate-300">{hoveredStage.sub}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenStage(hoveredStage.id)}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] cursor-pointer"
                    >
                      بدء الدراسة 🚀
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. LEVEL MILESTONES ROADMAP TIMELINE
         ───────────────────────────────────────────────────────────── */}
      <div className="p-6 rounded-3xl bg-[#0a0f22] border border-white/10 space-y-4 shadow-xl">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <Compass className="w-5 h-5 text-amber-400" />
          <span>المحطات الأربعة لمسار التعلم المحاسبي:</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {levelComparisonData.map((lvl) => {
            const meta = LEVEL_METADATA.find((m) => m.id === lvl.id)!;
            const isCompleted = lvl.progressPct === 100;
            const isCurrent = lvl.completed > 0 && lvl.completed < lvl.total;

            return (
              <div
                key={lvl.id}
                className={`p-5 rounded-2xl border transition-all space-y-3 relative overflow-hidden flex flex-col justify-between ${
                  isCompleted
                    ? "bg-emerald-950/20 border-emerald-500/40"
                    : isCurrent
                    ? "bg-indigo-950/30 border-indigo-500/50 ring-1 ring-indigo-500/30"
                    : "bg-black/30 border-white/10 opacity-75 hover:opacity-100"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{meta.icon}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                      isCompleted
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : isCurrent
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        : "bg-slate-800 text-slate-400"
                    }`}>
                      {isCompleted ? "مكتمل 100% ✅" : isCurrent ? "جاري التعلم ⚡" : "مستقبلي 🔒"}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-black text-sm text-white">{meta.name}</h4>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">{meta.desc}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs font-extrabold">
                    <span className="text-slate-300">نسبة الإنجاز</span>
                    <span className="text-emerald-400">{lvl.completed} / {lvl.total} ({lvl.progressPct}%)</span>
                  </div>

                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-700 rounded-full"
                      style={{ width: `${lvl.progressPct}%`, backgroundColor: meta.color }}
                    />
                  </div>

                  <button
                    onClick={() => {
                      const firstStageInLevel = STAGES_DATA.find((s) => {
                        if (lvl.id === 1) return s.id === 1;
                        if (lvl.id === 2) return s.id === 13;
                        if (lvl.id === 3) return s.id === 26;
                        return s.id === 39;
                      });
                      if (firstStageInLevel) {
                        onOpenStage(firstStageInLevel.id);
                      }
                    }}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-extrabold text-slate-200 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>عرض مراحل المستوى</span>
                    <ArrowLeft className="w-3.5 h-3.5 text-indigo-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
