import React, { useState } from "react";
import {
  Trophy,
  Award,
  Zap,
  Flame,
  CheckCircle2,
  Lock,
  X,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  BookOpen,
  Calculator,
  Compass
} from "lucide-react";
import { Badge } from "../types";
import { BADGES_LIST, getUserRank } from "../data/achievements";

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  xp: number;
  streak: number;
  unlockedBadgeIds: string[];
  completedLessonsCount: number;
  solvedLabEntriesCount: number;
  dailyChallengesSolvedCount: number;
  onNavigateToTab?: (tab: "path" | "lab" | "hero") => void;
}

export function AchievementsModal({
  isOpen,
  onClose,
  xp,
  streak,
  unlockedBadgeIds,
  completedLessonsCount,
  solvedLabEntriesCount,
  dailyChallengesSolvedCount,
  onNavigateToTab
}: AchievementsModalProps) {
  const [activeBadgeTab, setActiveBadgeTab] = useState<"all" | "unlocked" | "locked">("all");

  if (!isOpen) return null;

  const { rank, progressPercent, currentLevelXp, neededXpForNext } = getUserRank(xp);

  const filteredBadges = BADGES_LIST.filter((badge) => {
    const isUnlocked = unlockedBadgeIds.includes(badge.id);
    if (activeBadgeTab === "unlocked") return isUnlocked;
    if (activeBadgeTab === "locked") return !isUnlocked;
    return true;
  });

  const totalBadges = BADGES_LIST.length;
  const unlockedCount = unlockedBadgeIds.length;

  // Daily Tasks Checklist Status
  const dailyTasks = [
    {
      id: "t_lesson",
      title: "قراءة وإكمال درس تعليمي",
      sub: "أدرس أياً من الدروس المتاحة برحلة المناهج",
      xp: 30,
      icon: BookOpen,
      isDone: completedLessonsCount > 0,
      tab: "path" as const
    },
    {
      id: "t_lab",
      title: "حل قيد أو سيناريو في المعمل",
      sub: "سجل قيداً متوازناً وصحيحاً بـ LabSection",
      xp: 50,
      icon: Calculator,
      isDone: solvedLabEntriesCount > 0,
      tab: "lab" as const
    },
    {
      id: "t_challenge",
      title: "إجابة سؤال التحدي اليومي",
      sub: "أجب السؤال اليومي السريع واكسب المكافأة",
      xp: 50,
      icon: Sparkles,
      isDone: dailyChallengesSolvedCount > 0,
      tab: "hero" as const
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-[#0c1329] via-[#0a1024] to-[#060a17] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white">
        
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* MODAL HEADER */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-400/40 text-amber-300">
              <Trophy className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <span>نظام الإنجازات والتحديات اليومية</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  شارة {unlockedCount}/{totalBadges}
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                تابع تقدمك، اكسب نقاط الخبرة XP، وافتح أوسمة الزمالة المحاسبية
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="p-6 space-y-6 overflow-y-auto relative z-10 flex-1">
          
          {/* USER LEVEL & XP OVERVIEW CARD */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-indigo-950/40 to-slate-900/60 border border-amber-400/30 relative overflow-hidden space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-3xl shadow-xl border border-amber-300/50 shrink-0">
                  {rank.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black">
                      المستوى {rank.level}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">{rank.subTitle}</span>
                  </div>
                  <h3 className="text-xl font-black text-white mt-1">{rank.title}</h3>
                </div>
              </div>

              {/* STATS BADGES */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-center min-w-[90px]">
                  <div className="text-[10px] text-slate-400 font-bold flex items-center justify-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>إجمالي XP</span>
                  </div>
                  <div className="text-lg font-black text-amber-300">{xp}</div>
                </div>

                <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-center min-w-[90px]">
                  <div className="text-[10px] text-slate-400 font-bold flex items-center justify-center gap-1">
                    <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />
                    <span>سلسلة الأيام</span>
                  </div>
                  <div className="text-lg font-black text-orange-400">{streak}d</div>
                </div>
              </div>
            </div>

            {/* LEVEL PROGRESS BAR */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>التقدم للمستوى التالي ({neededXpForNext > 0 ? `متبقي ${neededXpForNext} XP` : "أعلى مستوى!"})</span>
                <span className="text-amber-300 font-black">{progressPercent}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-black/60 border border-white/10 p-0.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-500 transition-all duration-500 shadow-md"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* DAILY CHALLENGES & TASKS CHECKLIST */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>المهام والتحديات اليومية المطلوبة</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">تتجدد يومياً لكسب إضافي لـ XP</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {dailyTasks.map((task) => {
                const TaskIcon = task.icon;
                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-2xl border transition-all duration-300 space-y-3 ${
                      task.isDone
                        ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                        : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/[0.08]"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="p-2 rounded-xl bg-white/10 text-white">
                        <TaskIcon className="w-4 h-4" />
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${
                          task.isDone
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        }`}
                      >
                        +{task.xp} XP
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                        {task.isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : null}
                        <span>{task.title}</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">{task.sub}</p>
                    </div>

                    {!task.isDone && onNavigateToTab && (
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToTab(task.tab);
                        }}
                        className="w-full py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/40 text-indigo-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <span>الانتقال والتطبيق</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* BADGES & ACHIEVEMENTS GALLERY */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>معرض الأوسمة والبدجات المحاسبية ({unlockedCount}/{totalBadges})</span>
              </h3>

              {/* TABS FILTER */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-bold">
                <button
                  onClick={() => setActiveBadgeTab("all")}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    activeBadgeTab === "all" ? "bg-amber-500 text-slate-950 font-black" : "text-slate-400 hover:text-white"
                  }`}
                >
                  الكل ({totalBadges})
                </button>
                <button
                  onClick={() => setActiveBadgeTab("unlocked")}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    activeBadgeTab === "unlocked" ? "bg-emerald-500 text-slate-950 font-black" : "text-slate-400 hover:text-white"
                  }`}
                >
                  المفتوحة ({unlockedCount})
                </button>
                <button
                  onClick={() => setActiveBadgeTab("locked")}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    activeBadgeTab === "locked" ? "bg-indigo-600 text-white font-black" : "text-slate-400 hover:text-white"
                  }`}
                >
                  المغلقة ({totalBadges - unlockedCount})
                </button>
              </div>
            </div>

            {/* BADGES GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredBadges.map((badge) => {
                const isUnlocked = unlockedBadgeIds.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-2xl border transition-all duration-300 flex items-start gap-3 relative overflow-hidden ${
                      isUnlocked
                        ? "bg-gradient-to-br from-amber-950/30 to-indigo-950/30 border-amber-400/40 text-white shadow-lg"
                        : "bg-white/5 border-white/10 text-slate-400 opacity-70"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border shrink-0 shadow-md ${
                        isUnlocked
                          ? "bg-amber-500/20 border-amber-400/50 text-amber-300"
                          : "bg-black/40 border-white/10 text-slate-600"
                      }`}
                    >
                      {isUnlocked ? badge.icon : <Lock className="w-5 h-5 text-slate-500" />}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-black text-white truncate">{badge.title}</h4>
                        <span className="text-[10px] font-mono text-amber-300 font-bold shrink-0">
                          +{badge.xpReward} XP
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                        {badge.description}
                      </p>

                      <div className="text-[10px] text-slate-400 font-bold pt-1 flex items-center justify-between">
                        <span>الشرط: {badge.condition}</span>
                        {isUnlocked && <span className="text-emerald-400 font-black">مفتوحة ✓</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs font-bold text-slate-400 relative z-10">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>نظام مكافآت ميزان المحاسبي المحفز</span>
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black cursor-pointer transition-all"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
}
