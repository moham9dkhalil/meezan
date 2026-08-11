import React, { useState, useEffect, useRef } from "react";
import { COURSES_DATA } from "../data/courses";
import { Course, CourseModule, CourseTopic, QuizQuestion } from "../types";
import { getToken } from "../utils/cloudSync";
import {
  ArrowRight,
  CheckCircle,
  HelpCircle,
  BookOpen,
  Award,
  Star,
  Users,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  CheckCircle2,
  List,
  Type,
  Bookmark,
  Copy,
  Check,
  Video,
  Maximize2,
  Minimize2,
  Highlighter,
  MessageSquare,
  FileText,
  Lightbulb,
  Clock,
  GraduationCap,
  LayoutGrid,
  LayoutList,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  Sidebar,
  Play,
  Pause,
  RotateCcw,
  Sparkle,
  Compass,
  Share2,
  Download,
  ExternalLink,
  FileCheck,
  ShieldCheck,
  Briefcase,
  DollarSign,
  Globe,
  Printer,
  Eye,
  X
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Palette — Category themes
// ─────────────────────────────────────────────────────────────
interface CatTheme {
  accent: string;
  label: string;
  emoji: string;
  badgeBg: string;
  badgeText: string;
}

const CAT_THEMES: Record<string, CatTheme> = {
  all: { accent: "#6366F1", label: "الكل", emoji: "🎓", badgeBg: "bg-indigo-500/10", badgeText: "text-indigo-300" },
  accounting: { accent: "#3B82F6", label: "محاسبة مالية", emoji: "📊", badgeBg: "bg-blue-500/10", badgeText: "text-blue-300" },
  audit: { accent: "#8B5CF6", label: "مراجعة وتدقيق", emoji: "🔍", badgeBg: "bg-purple-500/10", badgeText: "text-purple-300" },
  finance: { accent: "#10B981", label: "إدارة مالية", emoji: "📈", badgeBg: "bg-emerald-500/10", badgeText: "text-emerald-300" },
  ifrs: { accent: "#F59E0B", label: "معايير IFRS", emoji: "🌍", badgeBg: "bg-amber-500/10", badgeText: "text-amber-300" },
  cfi: { accent: "#EC4899", label: "شهادات CFI", emoji: "💻", badgeBg: "bg-pink-500/10", badgeText: "text-pink-300" }
};

function getCatTheme(cat: string): CatTheme {
  return CAT_THEMES[cat] || { accent: "#6366F1", label: cat, emoji: "📚", badgeBg: "bg-indigo-500/10", badgeText: "text-indigo-300" };
}

export function getCourseStageLevel(courseId: string): { level: number; label: string; badgeBg: string; textBg: string; emoji: string } {
  switch (courseId) {
    case 'fmaa':
    case 'certifr':
    case 'cbca':
      return { level: 1, label: "المرحلة 1: التأسيس والمدخل", badgeBg: "bg-emerald-500/15 border-emerald-500/30", textBg: "text-emerald-300", emoji: "🌱" };
    case 'cma':
    case 'cia':
    case 'dipifr':
      return { level: 2, label: "المرحلة 2: التطبيق والمراجعة", badgeBg: "bg-blue-500/15 border-blue-500/30", textBg: "text-blue-300", emoji: "📊" };
    case 'fmva':
    case 'bida':
    case 'fpda':
      return { level: 3, label: "المرحلة 3: التحليل والنمذجة", badgeBg: "bg-amber-500/15 border-amber-500/30", textBg: "text-amber-300", emoji: "🏆" };
    case 'cpa':
    case 'socpa':
    case 'acca':
    case 'cfa':
    default:
      return { level: 4, label: "المرحلة 4: الزمالة والقيادة", badgeBg: "bg-purple-500/15 border-purple-500/30", textBg: "text-purple-300", emoji: "💎" };
  }
}

export function CoursesSection() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<CourseTopic | null>(null);

  // Persistence for last active course & topic
  const [lastActiveCourseId, setLastActiveCourseId] = useState<string>(() => {
    try {
      return localStorage.getItem("meezan_last_active_course_id") || "";
    } catch {
      return "";
    }
  });

  const [lastActiveTopicId, setLastActiveTopicId] = useState<string>(() => {
    try {
      return localStorage.getItem("meezan_last_active_topic_id") || "";
    } catch {
      return "";
    }
  });

  // Persistence for completed topics
  const [completedTopics, setCompletedTopics] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("meezan_completed_course_topics");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persistence for bookmarked topics
  const [bookmarkedTopics, setBookmarkedTopics] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("meezan_bookmarked_course_topics");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persistence for user topic notes
  const [userNotes, setUserNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem("meezan_course_topic_notes");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("meezan_completed_course_topics", JSON.stringify(completedTopics));
    } catch {}
  }, [completedTopics]);

  useEffect(() => {
    try {
      localStorage.setItem("meezan_bookmarked_course_topics", JSON.stringify(bookmarkedTopics));
    } catch {}
  }, [bookmarkedTopics]);

  useEffect(() => {
    try {
      localStorage.setItem("meezan_course_topic_notes", JSON.stringify(userNotes));
    } catch {}
  }, [userNotes]);

  const markTopicDone = (topicId: string) => {
    if (!completedTopics.includes(topicId)) {
      setCompletedTopics((prev) => [...prev, topicId]);
    }
  };

  const toggleBookmark = (topicId: string) => {
    setBookmarkedTopics((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
  };

  const saveNote = (topicId: string, noteText: string) => {
    setUserNotes((prev) => ({ ...prev, [topicId]: noteText }));
  };

  const handleSelectCourse = (course: Course, mod?: CourseModule, top?: CourseTopic) => {
    setSelectedCourse(course);
    setLastActiveCourseId(course.id);
    try {
      localStorage.setItem("meezan_last_active_course_id", course.id);
    } catch {}

    if (mod && top) {
      setSelectedModule(mod);
      setSelectedTopic(top);
      setLastActiveTopicId(top.id);
      try {
        localStorage.setItem("meezan_last_active_topic_id", top.id);
      } catch {}
    } else {
      setSelectedModule(null);
      setSelectedTopic(null);
    }
  };

  const handleSelectTopicInCourse = (course: Course, mod: CourseModule, top: CourseTopic) => {
    setSelectedModule(mod);
    setSelectedTopic(top);
    setLastActiveCourseId(course.id);
    setLastActiveTopicId(top.id);
    try {
      localStorage.setItem("meezan_last_active_course_id", course.id);
      localStorage.setItem("meezan_last_active_topic_id", top.id);
    } catch {}
  };

  const handleNextTopic = (course: Course, currentTop: CourseTopic) => {
    markTopicDone(currentTop.id);

    const allCourseTopics = course.modules.flatMap((m) => m.topics);
    const idx = allCourseTopics.findIndex((t) => t.id === currentTop.id);
    if (idx !== -1 && idx < allCourseTopics.length - 1) {
      const nextTop = allCourseTopics[idx + 1];
      setSelectedTopic(nextTop);
      const parentMod = course.modules.find((m) => m.topics.some((t) => t.id === nextTop.id)) || null;
      setSelectedModule(parentMod);
      setLastActiveTopicId(nextTop.id);
      try {
        localStorage.setItem("meezan_last_active_topic_id", nextTop.id);
      } catch {}
    } else {
      // Finished all topics in course
      setSelectedTopic(null);
    }
  };

  const handlePrevTopic = (course: Course, currentTop: CourseTopic) => {
    const allCourseTopics = course.modules.flatMap((m) => m.topics);
    const idx = allCourseTopics.findIndex((t) => t.id === currentTop.id);
    if (idx > 0) {
      const prevTop = allCourseTopics[idx - 1];
      setSelectedTopic(prevTop);
      const parentMod = course.modules.find((m) => m.topics.some((t) => t.id === prevTop.id)) || null;
      setSelectedModule(parentMod);
      setLastActiveTopicId(prevTop.id);
      try {
        localStorage.setItem("meezan_last_active_topic_id", prevTop.id);
      } catch {}
    }
  };

  if (selectedCourse && selectedModule && selectedTopic) {
    return (
      <TopicScreen
        course={selectedCourse}
        module={selectedModule}
        topic={selectedTopic}
        isDone={completedTopics.includes(selectedTopic.id)}
        isBookmarked={bookmarkedTopics.includes(selectedTopic.id)}
        userNote={userNotes[selectedTopic.id] || ""}
        completedTopics={completedTopics}
        onDone={() => markTopicDone(selectedTopic.id)}
        onToggleBookmark={() => toggleBookmark(selectedTopic.id)}
        onSaveNote={(note) => saveNote(selectedTopic.id, note)}
        onNext={() => handleNextTopic(selectedCourse, selectedTopic)}
        onPrev={() => handlePrevTopic(selectedCourse, selectedTopic)}
        onSelectTopic={(mod, top) => handleSelectTopicInCourse(selectedCourse, mod, top)}
        onBack={() => setSelectedTopic(null)}
      />
    );
  }

  if (selectedCourse) {
    return (
      <CourseDetailScreen
        course={selectedCourse}
        completedTopics={completedTopics}
        bookmarkedTopics={bookmarkedTopics}
        onSelectTopic={(mod, top) => handleSelectTopicInCourse(selectedCourse, mod, top)}
        onBack={() => setSelectedCourse(null)}
      />
    );
  }

  return (
    <CatalogScreen
      completedTopics={completedTopics}
      lastActiveCourseId={lastActiveCourseId}
      lastActiveTopicId={lastActiveTopicId}
      onSelectCourse={handleSelectCourse}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// 1. CATALOG SCREEN (قائمة الكورسات والشهادات المعتمدة)
// ─────────────────────────────────────────────────────────────
interface CatalogScreenProps {
  completedTopics: string[];
  lastActiveCourseId?: string;
  lastActiveTopicId?: string;
  onSelectCourse: (course: Course, module?: CourseModule, topic?: CourseTopic) => void;
}

function CatalogScreen({ completedTopics, lastActiveCourseId, lastActiveTopicId, onSelectCourse }: CatalogScreenProps) {
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [selectedStageLevel, setSelectedStageLevel] = useState<"all" | "level1" | "level2" | "level3" | "level4">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const courses = COURSES_DATA;
  const cats = ["all", "accounting", "audit", "finance", "ifrs", "cfi"];

  // Find last active or most recent course
  const continueCourse =
    courses.find((c) => c.id === lastActiveCourseId) ||
    courses.find((c) => c.modules.some((m) => m.topics.some((t) => completedTopics.includes(t.id)))) ||
    courses[0];

  const continueAllTopics = continueCourse ? continueCourse.modules.flatMap((m) => m.topics) : [];

  // Find last active topic or next uncompleted topic
  const continueTopic =
    continueAllTopics.find((t) => t.id === lastActiveTopicId) ||
    continueAllTopics.find((t) => !completedTopics.includes(t.id)) ||
    continueAllTopics[0];

  const continueModule = continueCourse
    ? continueCourse.modules.find((m) => m.topics.some((t) => t.id === continueTopic?.id)) || continueCourse.modules[0]
    : undefined;

  const doneInContinueCourse = continueAllTopics.filter((t) => completedTopics.includes(t.id)).length;
  const continueCourseProgress = continueAllTopics.length === 0
    ? 0
    : Math.round((doneInContinueCourse / continueAllTopics.length) * 100);

  const filtered = courses.filter((c) => {
    const matchesCat = selectedCat === "all" || c.cat === selectedCat;
    
    let matchesLevel = true;
    if (selectedStageLevel === "level1") {
      matchesLevel = ["fmaa", "certifr", "cbca"].includes(c.id);
    } else if (selectedStageLevel === "level2") {
      matchesLevel = ["cma", "cia", "dipifr"].includes(c.id);
    } else if (selectedStageLevel === "level3") {
      matchesLevel = ["fmva", "bida", "fpda"].includes(c.id);
    } else if (selectedStageLevel === "level4") {
      matchesLevel = ["cpa", "socpa", "acca", "cfa"].includes(c.id);
    }

    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.org.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.desc.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesLevel && matchesSearch;
  });

  const totalAllTopics = courses.reduce(
    (acc, c) => acc + c.modules.reduce((mAcc, m) => mAcc + m.topics.length, 0),
    0
  );
  const doneAllCount = completedTopics.length;
  const overallProgress = totalAllTopics === 0 ? 0 : Math.round((doneAllCount / totalAllTopics) * 100);

  return (
    <section className="py-6 max-w-7xl mx-auto px-4 space-y-6 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-br from-[#0b1329] via-[#0d1838] to-[#121c42] border border-indigo-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-black shadow-inner">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>كورسات واختبارات دولية معتمدة</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            الكورسات والشهادات المحاسبية الاحترافية
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            محتوى تعليمي تطبيقي تفاعلي مُعد وفقاً لمناهج أعرق المؤسسات العالمية مثل Wharton و IMA و SOCPA و ACCA و IFRS مع اختبارات تقييمية ومتابعة دقيقة لإنجازك.
          </p>

          {/* Quick Features Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-extrabold text-cyan-300">
            <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>شروحات تطبيقية مبسطة</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
              <span>اختبارات تقييم فورية</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>تعلم بنفس سرعتك</span>
            </span>
          </div>
        </div>

        {/* Global Progress Card */}
        <div className="z-10 w-full lg:w-auto shrink-0 bg-black/40 border border-white/10 p-5 rounded-2xl backdrop-blur-xl space-y-3 min-w-[260px]">
          <div className="flex items-center justify-between gap-3 text-xs font-extrabold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>معدل إنجازك العام</span>
            </span>
            <span className="text-cyan-300 font-black">{overallProgress}%</span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 transition-all duration-700 shadow-md"
              style={{ width: `${Math.max(4, overallProgress)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
            <span>المواضيع المكتملة:</span>
            <span className="text-white font-black">{doneAllCount} من {totalAllTopics}</span>
          </div>
        </div>
      </div>

      {/* Continue Learning Section (الاستمرار في التعلم) */}
      {continueCourse && continueTopic && continueModule && (
        <div className="bg-gradient-to-r from-[#0d1738] via-[#101d47] to-[#132354] border border-cyan-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden group transition-all hover:border-cyan-400/60">
          {/* Ambient Decorative Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* Right Info: Badge, Course Icon & Title */}
            <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-black/60 border border-cyan-500/30 flex items-center justify-center text-3xl sm:text-5xl shrink-0 shadow-2xl group-hover:scale-105 transition-transform">
                {continueCourse.icon}
              </div>

              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3.5 py-1 rounded-full text-[11px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 shadow-sm">
                    <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400 animate-pulse" />
                    <span>الاستمرار في التعلم</span>
                  </span>
                  <span className="text-xs text-slate-400 font-bold">{continueCourse.org}</span>
                </div>

                <h3 className="text-lg sm:text-2xl font-black text-white truncate leading-tight">
                  {continueCourse.name}
                </h3>

                <div className="text-xs sm:text-sm text-amber-300 font-bold flex items-center gap-2 truncate">
                  <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-slate-300 font-semibold">الدرس الحالي:</span>
                  <span className="truncate text-cyan-200 font-black">{continueModule.title} • {continueTopic.title}</span>
                </div>
              </div>
            </div>

            {/* Middle: Course Progress Indicator */}
            <div className="w-full lg:w-72 shrink-0 bg-black/40 border border-white/10 p-4 rounded-2xl space-y-2.5 backdrop-blur-md">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>نسبة الإنجاز بالكورس:</span>
                </span>
                <span className="text-cyan-300 font-mono text-sm">{continueCourseProgress}%</span>
              </div>

              <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 transition-all duration-700 shadow-md shadow-cyan-400/30"
                  style={{ width: `${Math.max(5, continueCourseProgress)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                <span>الدروس المكتملة:</span>
                <span className="text-white font-mono">{doneInContinueCourse} من {continueAllTopics.length}</span>
              </div>
            </div>

            {/* Left CTA: Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full lg:w-auto shrink-0">
              <button
                onClick={() => onSelectCourse(continueCourse)}
                className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 font-black text-xs transition-all cursor-pointer text-center"
                title="عرض تفاصيل المنهج الكامل"
              >
                تفاصيل المنهج
              </button>

              <button
                onClick={() => onSelectCourse(continueCourse, continueModule, continueTopic)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-cyan-500/25 border border-cyan-300/30 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>متابعة</span>
                <ChevronLeft className="w-4 h-4 text-cyan-200" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Global Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#0d1424] border border-indigo-500/20 rounded-2xl p-4 text-center space-y-1 shadow-lg">
          <div className="text-xl sm:text-2xl font-black text-indigo-400">{courses.length}</div>
          <div className="text-[11px] font-bold text-slate-400">مسارات ودورات معتمدة</div>
        </div>

        <div className="bg-[#0d1424] border border-blue-500/20 rounded-2xl p-4 text-center space-y-1 shadow-lg">
          <div className="text-xl sm:text-2xl font-black text-blue-400">
            {courses.reduce((acc, c) => acc + c.modules.length, 0)}
          </div>
          <div className="text-[11px] font-bold text-slate-400">وحدات تعليمية دقيقة</div>
        </div>

        <div className="bg-[#0d1424] border border-emerald-500/20 rounded-2xl p-4 text-center space-y-1 shadow-lg">
          <div className="text-xl sm:text-2xl font-black text-emerald-400">{totalAllTopics}</div>
          <div className="text-[11px] font-bold text-slate-400">شرحاً وحالة تطبيقية</div>
        </div>

        <div className="bg-[#0d1424] border border-amber-500/20 rounded-2xl p-4 text-center space-y-1 shadow-lg">
          <div className="text-xl sm:text-2xl font-black text-amber-400">
            {courses.reduce((acc, c) => acc + c.modules.flatMap(m => m.topics).reduce((tAcc, t) => tAcc + t.quiz.length, 0), 0)}
          </div>
          <div className="text-[11px] font-bold text-slate-400">سؤال تقييمي مع الشرح</div>
        </div>
      </div>

      {/* Interactive Educational Stages Roadmap Section */}
      <div className="bg-[#0d1424] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">مسار وتدرج المراحل التعليمية للشهادات</h3>
              <p className="text-[11px] text-slate-400 font-medium">اختر المرحلة التعليمية لاستعراض الشهادات والكورسات الخاصة بها</p>
            </div>
          </div>

          {selectedStageLevel !== "all" && (
            <button
              onClick={() => setSelectedStageLevel("all")}
              className="text-xs text-cyan-400 font-bold hover:underline self-start sm:self-auto cursor-pointer"
            >
              عرض كافة المراحل
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Stage 1 */}
          <button
            onClick={() => setSelectedStageLevel(selectedStageLevel === "level1" ? "all" : "level1")}
            className={`p-4 rounded-2xl border text-right transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden group ${
              selectedStageLevel === "level1"
                ? "bg-emerald-500/20 border-emerald-400 text-white shadow-xl shadow-emerald-500/20 scale-[1.02] ring-2 ring-emerald-400/50"
                : "bg-white/5 border-white/10 text-slate-300 hover:border-emerald-500/40 hover:bg-white/[0.08]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                المرحلة 1
              </span>
              <span className="text-2xl group-hover:scale-125 transition-transform">🌱</span>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-emerald-300 transition-colors">التأسيس والمدخل المحاسبي</h4>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">شهادات FMAA, CertIFR, CBCA</p>
            </div>
            <div className="text-[10px] text-emerald-400 font-extrabold flex items-center justify-between pt-2 border-t border-white/10">
              <span>تأهيل الكوادر المبتدئة</span>
              <span className="bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">3 كورسات</span>
            </div>
          </button>

          {/* Stage 2 */}
          <button
            onClick={() => setSelectedStageLevel(selectedStageLevel === "level2" ? "all" : "level2")}
            className={`p-4 rounded-2xl border text-right transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden group ${
              selectedStageLevel === "level2"
                ? "bg-blue-500/20 border-blue-400 text-white shadow-xl shadow-blue-500/20 scale-[1.02] ring-2 ring-blue-400/50"
                : "bg-white/5 border-white/10 text-slate-300 hover:border-blue-500/40 hover:bg-white/[0.08]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30">
                المرحلة 2
              </span>
              <span className="text-2xl group-hover:scale-125 transition-transform">📊</span>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-blue-300 transition-colors">التطبيق الميداني والمراجعة</h4>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">شهادات CMA, CIA, DipIFR</p>
            </div>
            <div className="text-[10px] text-blue-400 font-extrabold flex items-center justify-between pt-2 border-t border-white/10">
              <span>المستوى المتوسط الاحترافي</span>
              <span className="bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-500/30">3 كورسات</span>
            </div>
          </button>

          {/* Stage 3 */}
          <button
            onClick={() => setSelectedStageLevel(selectedStageLevel === "level3" ? "all" : "level3")}
            className={`p-4 rounded-2xl border text-right transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden group ${
              selectedStageLevel === "level3"
                ? "bg-amber-500/20 border-amber-400 text-white shadow-xl shadow-amber-500/20 scale-[1.02] ring-2 ring-amber-400/50"
                : "bg-white/5 border-white/10 text-slate-300 hover:border-amber-500/40 hover:bg-white/[0.08]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                المرحلة 3
              </span>
              <span className="text-2xl group-hover:scale-125 transition-transform">🏆</span>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors">التحليل المالي والنمذجة</h4>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">شهادات FMVA, BIDA, FPDA</p>
            </div>
            <div className="text-[10px] text-amber-400 font-extrabold flex items-center justify-between pt-2 border-t border-white/10">
              <span>المستوى المتقدم والرقمي</span>
              <span className="bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">3 كورسات</span>
            </div>
          </button>

          {/* Stage 4 */}
          <button
            onClick={() => setSelectedStageLevel(selectedStageLevel === "level4" ? "all" : "level4")}
            className={`p-4 rounded-2xl border text-right transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden group ${
              selectedStageLevel === "level4"
                ? "bg-purple-500/20 border-purple-400 text-white shadow-xl shadow-purple-500/20 scale-[1.02] ring-2 ring-purple-400/50"
                : "bg-white/5 border-white/10 text-slate-300 hover:border-purple-500/40 hover:bg-white/[0.08]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                المرحلة 4
              </span>
              <span className="text-2xl group-hover:scale-125 transition-transform">💎</span>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-purple-300 transition-colors">الزمالات المعتمدة والقيادة</h4>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">شهادات CPA, SOCPA, ACCA, CFA</p>
            </div>
            <div className="text-[10px] text-purple-400 font-extrabold flex items-center justify-between pt-2 border-t border-white/10">
              <span>أعلى الزمالات العالمية</span>
              <span className="bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">4 كورسات</span>
            </div>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-[#0d1424] border border-white/10 rounded-2xl p-4 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم الكورس، المؤسسة، أو الموضوع..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
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

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-xs text-slate-400 font-bold hidden sm:inline">طريقة العرض:</span>
            <div className="p-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === "grid" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
                title="عرض شبكي"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === "list" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
                title="عرض القائمة"
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {cats.map((cat) => {
            const theme = getCatTheme(cat);
            const isActive = selectedCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 border whitespace-nowrap ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30 scale-105 font-black"
                    : "bg-white/5 text-slate-300 border-white/10 hover:border-white/20 hover:text-white"
                }`}
              >
                <span>{theme.emoji}</span>
                <span>{theme.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-400 font-extrabold">
        <span>الكورسات المتاحة ({filtered.length})</span>
        {searchQuery && (
          <span className="text-cyan-300">نتائج البحث عن: "{searchQuery}"</span>
        )}
      </div>

      {/* Courses Display Grid / List */}
      {filtered.length === 0 ? (
        <div className="bg-[#0d1424] border border-white/10 rounded-3xl p-12 text-center space-y-3">
          <div className="text-4xl">🔍</div>
          <h3 className="text-base font-black text-white">لم يتم العثور على كورسات تطابق بحثك</h3>
          <p className="text-xs text-slate-400">جرب البحث بكلمات أخرى أو اختر تخصصاً مختلفاً من الفئات</p>
          <button
            onClick={() => {
              setSelectedCat("all");
              setSearchQuery("");
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-colors cursor-pointer mt-2"
          >
            إعادة ضبط الفلاتر
          </button>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 gap-5"
              : "space-y-4"
          }
        >
          {filtered.map((course) => {
            const allCourseTopics = course.modules.flatMap((m) => m.topics);
            const doneInCourse = allCourseTopics.filter((t) => completedTopics.includes(t.id)).length;
            const totalInCourse = allCourseTopics.length;

            return (
              <CourseCard
                key={course.id}
                course={course}
                doneTopics={doneInCourse}
                totalTopics={totalInCourse}
                viewMode={viewMode}
                onClick={() => onSelectCourse(course)}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// COURSE CARD COMPONENT
// ─────────────────────────────────────────────────────────────
interface CourseCardProps {
  key?: React.Key;
  course: Course;
  doneTopics: number;
  totalTopics: number;
  viewMode: "grid" | "list";
  onClick: () => void;
}

function CourseCard({ course, doneTopics, totalTopics, viewMode, onClick }: CourseCardProps) {
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const theme = getCatTheme(course.cat);
  const stageLevel = getCourseStageLevel(course.id);
  const progress = totalTopics === 0 ? 0 : doneTopics / totalTopics;
  const progressPercent = Math.round(progress * 100);

  const firstModule = course.modules[0];
  const firstTopic = firstModule?.topics[0];

  // Ring geometry
  const size = 58;
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <>
      <div
        onClick={onClick}
        className={`bg-[#0d1424] border border-white/10 hover:border-indigo-500/50 rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer relative overflow-hidden group flex flex-col justify-between ${
          viewMode === "grid" ? "p-6" : "p-5 sm:p-6"
        }`}
      >
        {/* Background Accent Glow */}
        <div
          className="absolute top-0 right-0 left-0 h-28 pointer-events-none opacity-15 transition-opacity group-hover:opacity-30"
          style={{ background: course.grad }}
        />

        <div className="relative z-10 space-y-4">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-black/40 border border-white/15 flex items-center justify-center text-3xl shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                {course.icon}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${theme.badgeBg} ${theme.badgeText}`}>
                    {theme.label}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${stageLevel.badgeBg} ${stageLevel.textBg}`}>
                    {stageLevel.label}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Coursera Specialization
                  </span>
                  {progressPercent === 100 && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      مكتمل ✓
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-black text-white truncate group-hover:text-cyan-300 transition-colors">
                  {course.name}
                </h3>
                <p className="text-xs text-slate-400 font-bold truncate">{course.org}</p>
              </div>
            </div>

            {/* SVG Circular Progress Ring */}
            <div className="relative w-15 h-15 shrink-0 flex items-center justify-center group/ring" title={`نسبة الإنجاز: ${progressPercent}% (${doneTopics} من ${totalTopics} درس)`}>
              <svg className="w-15 h-15 -rotate-90 transform drop-shadow-md">
                <circle
                  cx="29"
                  cy="29"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth={stroke}
                  className="text-white/10"
                  fill="transparent"
                />
                <circle
                  cx="29"
                  cy="29"
                  r={radius}
                  stroke={progressPercent === 100 ? "#10b981" : (theme.accent || "#06b6d4")}
                  strokeWidth={stroke}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-none">
                <span className={`text-[11px] font-black ${progressPercent === 100 ? "text-emerald-400" : "text-cyan-300"}`}>
                  {progressPercent}%
                </span>
                <span className="text-[8px] text-slate-400 font-bold mt-0.5">
                  {doneTopics}/{totalTopics}
                </span>
              </div>
            </div>
          </div>

          {/* Course Description */}
          <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 font-normal">
            {course.desc}
          </p>

          {/* Progress Summary Section */}
          <div className="space-y-1.5 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>مؤشر تقدم إنجاز الدروس</span>
              </span>
              <span className={`font-black ${progressPercent === 100 ? "text-emerald-400" : "text-cyan-300"}`}>
                {progressPercent}% ({doneTopics} من {totalTopics} درس)
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  progressPercent === 100
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                    : "bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500"
                }`}
                style={{ width: `${Math.max(progressPercent === 0 ? 0 : 3, progressPercent)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Footer Meta Details & CTA */}
        <div className="relative z-10 pt-4 mt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-[11px] font-extrabold text-slate-300 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-indigo-300 flex items-center gap-1">
              <Layers className="w-3 h-3 text-indigo-400" />
              <span>{course.modules.length} وحدات</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-amber-300 flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{course.rating}</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 hidden sm:inline-block">
              {course.diff}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPreviewModal(true);
              }}
              className="px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105"
              title="معاينة تشويقية للدرس الأول"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>معاينة الدرس الأول</span>
            </button>

            <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600/80 to-purple-600/80 hover:from-indigo-600 hover:to-purple-600 border border-indigo-400/40 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-lg group-hover:scale-105">
              <span>{doneTopics > 0 ? "متابعة" : "استكشف الكورس"}</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* PREVIEW FIRST LESSON MODAL POPUP */}
      {showPreviewModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            e.stopPropagation();
            setShowPreviewModal(false);
          }}
        >
          <div
            className="bg-[#0d1424] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative text-right space-y-6 animate-fadeIn my-8 max-h-[90vh] overflow-y-auto scrollbar-thin"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-2xl shrink-0">
                  {course.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      معاينة تشويقية للدرس الأول
                    </span>
                    <span className="text-xs text-slate-400 font-bold">{course.org}</span>
                  </div>
                  <h3 className="text-lg font-black text-white">{course.name}</h3>
                </div>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lesson Details Teaser */}
            {firstTopic ? (
              <div className="space-y-5">
                {/* First Lesson Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4 text-cyan-400" />
                      <span>الوحدة الأولى: {firstModule?.title}</span>
                    </span>
                    <span className="bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full text-[10px] font-black">
                      درس مجاني للمعاينة
                    </span>
                  </div>
                  <h4 className="text-base font-black text-white">{firstTopic.title}</h4>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">{firstTopic.sub}</p>
                </div>

                {/* Learning Objectives / Key Goals */}
                <div className="space-y-3">
                  <h5 className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>الأهداف التعليمية والمهارات المكتسبة من الكورس:</span>
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {firstTopic.keyPoints.map((point, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2 text-xs text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="font-bold">{point}</span>
                      </div>
                    ))}
                    {course.practicalBenefit?.practicalSkills.slice(0, 2).map((skill, idx) => (
                      <div key={`skill-${idx}`} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2 text-xs text-slate-200">
                        <Award className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="font-bold">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content Excerpt / Teaser */}
                <div className="space-y-2 p-4 rounded-2xl bg-black/40 border border-white/10">
                  <h5 className="text-xs font-black text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span>نبذة تشويقية من محتوى المحاضرة الأولى:</span>
                  </h5>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal line-clamp-4">
                    {firstTopic.content}
                  </p>
                </div>

                {/* Formula or Practical Rule if available */}
                {firstTopic.formula && (
                  <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 flex items-center gap-2 font-mono">
                    <span className="font-bold text-cyan-400 shrink-0">📌 القاعدة المعيارية:</span>
                    <span className="truncate">{firstTopic.formula}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400">لا يتوفر محتوى معاينة لهذا الكورس حالياً.</p>
            )}

            {/* CTA Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                إغلاق المعاينة
              </button>
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  onClick();
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <span>ابدأ الكورس الكامل الآن</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. COURSE DETAIL SCREEN (تفاصيل الكورس - العرض الشامل الكامل)
// ─────────────────────────────────────────────────────────────
interface CourseDetailScreenProps {
  course: Course;
  completedTopics: string[];
  bookmarkedTopics: string[];
  onSelectTopic: (mod: CourseModule, top: CourseTopic) => void;
  onBack: () => void;
}

function CourseDetailScreen({
  course,
  completedTopics,
  bookmarkedTopics,
  onSelectTopic,
  onBack
}: CourseDetailScreenProps) {
  const theme = getCatTheme(course.cat);
  const allTopics = course.modules.flatMap((m) => m.topics);
  const doneCount = allTopics.filter((t) => completedTopics.includes(t.id)).length;
  const progressPercent = allTopics.length === 0 ? 0 : Math.round((doneCount / allTopics.length) * 100);

  // Search query inside topics in course
  const [topicSearchQuery, setTopicSearchQuery] = useState<string>("");

  // Find first uncompleted topic to suggest "Resume"
  const nextUncompletedTopic = allTopics.find((t) => !completedTopics.includes(t.id)) || allTopics[0];
  const nextModule = course.modules.find((m) => m.topics.some((t) => t.id === nextUncompletedTopic.id)) || course.modules[0];

  // Expanded modules state (default: all expanded)
  const [expandedModules, setExpandedModules] = useState<string[]>(
    course.modules.map((m) => m.id)
  );
  const [detailTab, setDetailTab] = useState<"curriculum" | "benefit" | "strategy" | "guide" | "capstone" | "instructors">("curriculum");
  const [showFinancialAidModal, setShowFinancialAidModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Presentation View Mode State (طريقة عرض الكورس للمستخدم)
  const [courseDisplayMode, setCourseDisplayMode] = useState<"path" | "list" | "grid" | "studio">("path");
  const [studioTopicId, setStudioTopicId] = useState<string | null>(null);

  const studioActiveTopic = allTopics.find((t) => t.id === studioTopicId) || nextUncompletedTopic || allTopics[0];
  const studioActiveModule = course.modules.find((m) => m.topics.some((t) => t.id === studioActiveTopic?.id)) || course.modules[0];

  const toggleModuleExpand = (modId: string) => {
    setExpandedModules((prev) =>
      prev.includes(modId) ? prev.filter((id) => id !== modId) : [...prev, modId]
    );
  };

  // SVG progress ring calculations
  const radius = 24;
  const stroke = 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <section className="py-6 sm:py-8 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Top Breadcrumb Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 flex-wrap">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-cyan-300 transition-all cursor-pointer font-extrabold"
          >
            <ArrowRight className="w-4 h-4 text-cyan-400" />
            <span>العودة لكافة الكورسات والشهادات</span>
          </button>
          <span>/</span>
          <span className="text-cyan-300 font-extrabold">{theme.label}</span>
          <span>/</span>
          <span className="text-white font-black truncate max-w-sm">{course.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-black flex items-center gap-1.5 shadow-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>منهج دولي معتمد</span>
          </span>
        </div>
      </div>

      {/* FULL WIDTH HERO BANNER HEADER */}
      <div className="bg-gradient-to-br from-[#0b1329] via-[#0e1d47] to-[#13245a] border border-indigo-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden space-y-8">
        {/* Ambient Glows */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Right Info Details */}
          <div className="flex items-start gap-5 min-w-0 flex-1">
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl bg-black/60 border border-white/20 flex items-center justify-center text-4xl sm:text-6xl shrink-0 shadow-2xl group hover:scale-105 transition-transform">
              {course.icon}
            </div>

            <div className="space-y-3 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className={`px-3 py-1 rounded-xl text-xs font-black ${theme.badgeBg} ${theme.badgeText} border border-indigo-500/30`}>
                  {theme.emoji} {theme.label}
                </span>
                <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-white/10 border border-white/10 text-slate-200">
                  المستوى: {course.diff}
                </span>
                {progressPercent === 100 && (
                  <span className="px-3 py-1 rounded-xl text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    أنجزت الكورس بالكامل ✓
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                {course.name}
              </h1>

              <p className="text-xs sm:text-base text-cyan-300 font-extrabold flex items-center gap-2">
                <span>{course.org}</span>
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-bold pt-1">
                <span className="flex items-center gap-1.5 text-amber-400 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>تقييم {course.rating}</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-200 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>{course.students} متدرب</span>
                </span>
                <span className="text-indigo-300 flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>{course.modules.length} وحدات تعليمية • {allTopics.length} درساً</span>
                </span>
              </div>
            </div>
          </div>

          {/* Left Main Action Card */}
          {nextUncompletedTopic && (
            <div className="shrink-0 w-full lg:w-80 space-y-4 bg-black/50 border border-white/15 p-6 rounded-3xl backdrop-blur-xl shadow-2xl">
              {/* Circular Progress Gauge */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3.5">
                <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                  <svg className="w-14 h-14 -rotate-90">
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-white/10"
                      fill="transparent"
                    />
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      stroke={progressPercent === 100 ? "#10b981" : "#06b6d4"}
                      strokeWidth="4"
                      strokeDasharray={2 * Math.PI * 22}
                      strokeDashoffset={2 * Math.PI * 22 * (1 - (doneCount / Math.max(1, allTopics.length)))}
                      strokeLinecap="round"
                      className="transition-all duration-700"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[11px] font-black text-cyan-300">{progressPercent}%</span>
                  </div>
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="text-xs font-black text-white">إنجازك للكورس</div>
                  <div className="text-[11px] text-slate-300 font-bold truncate">
                    {doneCount} من {allTopics.length} درس مكتمل
                  </div>
                  {progressPercent === 100 && (
                    <div className="text-[10px] text-emerald-400 font-black">مكتمل بالكامل 100% ✓</div>
                  )}
                </div>
              </div>

              <div className="text-xs text-slate-300 font-bold space-y-1">
                <span className="text-slate-400 block text-[11px]">الدرس الموصى به الآن:</span>
                <span className="text-cyan-300 font-black text-sm block truncate">{nextUncompletedTopic.title}</span>
              </div>

              <button
                onClick={() => onSelectTopic(nextModule, nextUncompletedTopic)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-sm shadow-2xl shadow-indigo-600/40 transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-cyan-300/40 hover:scale-[1.02]"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>{doneCount > 0 ? "متابعة التعلم من حيث وقفت" : "ابدأ تعلم الكورس الآن"}</span>
              </button>

              <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-center text-[11px] font-black">
                <button
                  onClick={() => setShowFinancialAidModal(true)}
                  className="p-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 flex flex-col items-center gap-1 cursor-pointer transition-colors"
                >
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <span>Financial Aid متوفر</span>
                </button>

                <button
                  onClick={() => setShowCertificateModal(true)}
                  className="p-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 flex flex-col items-center gap-1 cursor-pointer transition-colors"
                >
                  <Award className="w-4 h-4 text-cyan-400" />
                  <span>معاينة الشهادة</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FULL WIDTH COURSE STATS & PROGRESS METER */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 bg-black/50 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-extrabold block">نسبة الإنجاز الكلية:</span>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-cyan-300">{progressPercent}%</span>
              <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 transition-all duration-700"
                  style={{ width: `${Math.max(3, progressPercent)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1 border-r border-white/10 pr-4">
            <span className="text-[11px] text-slate-400 font-extrabold block">الدروس المكتملة:</span>
            <div className="text-xl font-black text-emerald-400">
              {doneCount} <span className="text-xs text-slate-400 font-normal">من أصل {allTopics.length} درس</span>
            </div>
          </div>

          <div className="space-y-1 border-r border-white/10 pr-4">
            <span className="text-[11px] text-slate-400 font-extrabold block">الوحدات التعليمية:</span>
            <div className="text-xl font-black text-indigo-300">
              {course.modules.length} <span className="text-xs text-slate-400 font-normal">وحدات رئيسية</span>
            </div>
          </div>

          <div className="space-y-1 border-r border-white/10 pr-4">
            <span className="text-[11px] text-slate-400 font-extrabold block">الدروس المحفوظة:</span>
            <div className="text-xl font-black text-amber-400">
              {bookmarkedTopics.length} <span className="text-xs text-slate-400 font-normal">درس بالمفضلة</span>
            </div>
          </div>
        </div>
      </div>

      {/* FULL WIDTH NAVIGATION TABS */}
      <div className="bg-[#0d1424] border border-white/10 p-2 rounded-2xl flex items-center gap-2 overflow-x-auto scrollbar-none shadow-xl">
        <button
          onClick={() => setDetailTab("curriculum")}
          className={`flex-1 min-w-[160px] py-3.5 px-5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2.5 whitespace-nowrap ${
            detailTab === "curriculum"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg border border-indigo-400/40"
              : "text-slate-300 hover:text-white hover:bg-white/5"
          }`}
        >
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>منهج الدروس والوحدات ({course.modules.length})</span>
        </button>

        <button
          onClick={() => setDetailTab("benefit")}
          className={`flex-1 min-w-[160px] py-3.5 px-5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2.5 whitespace-nowrap ${
            detailTab === "benefit"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg border border-indigo-400/40"
              : "text-slate-300 hover:text-white hover:bg-white/5"
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>الأثر المهني والرواتب</span>
        </button>

        <button
          onClick={() => setDetailTab("strategy")}
          className={`flex-1 min-w-[160px] py-3.5 px-5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2.5 whitespace-nowrap ${
            detailTab === "strategy"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg border border-indigo-400/40"
              : "text-slate-300 hover:text-white hover:bg-white/5"
          }`}
        >
          <BrainCircuit className="w-4 h-4 text-emerald-400" />
          <span>استراتيجية نجاح الامتحان</span>
        </button>

        <button
          onClick={() => setDetailTab("guide")}
          className={`flex-1 min-w-[160px] py-3.5 px-5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2.5 whitespace-nowrap ${
            detailTab === "guide"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg border border-indigo-400/40"
              : "text-slate-300 hover:text-white hover:bg-white/5"
          }`}
        >
          <GraduationCap className="w-4 h-4 text-purple-400" />
          <span>دليل الاعتماد الرسمي</span>
        </button>

        <button
          onClick={() => setDetailTab("capstone")}
          className={`flex-1 min-w-[160px] py-3.5 px-5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2.5 whitespace-nowrap ${
            detailTab === "capstone"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg border border-indigo-400/40"
              : "text-slate-300 hover:text-white hover:bg-white/5"
          }`}
        >
          <Briefcase className="w-4 h-4 text-amber-400" />
          <span>مشروع التخرج الميداني</span>
        </button>

        <button
          onClick={() => setDetailTab("instructors")}
          className={`flex-1 min-w-[160px] py-3.5 px-5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2.5 whitespace-nowrap ${
            detailTab === "instructors"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg border border-indigo-400/40"
              : "text-slate-300 hover:text-white hover:bg-white/5"
          }`}
        >
          <Users className="w-4 h-4 text-cyan-400" />
          <span>المحاضرون والأساتذة</span>
        </button>
      </div>

      {/* TAB 1: CURRICULUM MODULES WITH 4 PRESENTATION MODES */}
      {detailTab === "curriculum" && (
        <div className="space-y-6 animate-fadeIn">
          {/* DISPLAY MODE SELECTOR BAR (خيارات أنماط عرض الكورس) */}
          <div className="bg-[#0d1424] border border-indigo-500/30 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>طريقة عرض الكورس والمناهج للمستخدم (Course Display Modes)</span>
                </span>
                <h3 className="text-sm font-black text-white">اختر نمط التصفح والتعلم الأنسب لك:</h3>
              </div>

              {/* View Switcher Buttons */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/50 border border-white/10 overflow-x-auto w-full sm:w-auto">
                <button
                  onClick={() => setCourseDisplayMode("path")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    courseDisplayMode === "path"
                      ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                  title="عرض خريطة المسار التعليمي التسلسلي"
                >
                  <Compass className="w-4 h-4 text-cyan-300" />
                  <span>🗺️ خريطة المسار</span>
                </button>

                <button
                  onClick={() => setCourseDisplayMode("list")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    courseDisplayMode === "list"
                      ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                  title="عرض المنهج على شكل قائمة منسدلة تفصيلية"
                >
                  <LayoutList className="w-4 h-4 text-amber-300" />
                  <span>📋 قائمة الوحدات</span>
                </button>

                <button
                  onClick={() => setCourseDisplayMode("grid")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    courseDisplayMode === "grid"
                      ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                  title="عرض الوحدات كبطاقات تفاعلية شبكية"
                >
                  <LayoutGrid className="w-4 h-4 text-purple-300" />
                  <span>🧱 شبكة البطاقات</span>
                </button>

                <button
                  onClick={() => setCourseDisplayMode("studio")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    courseDisplayMode === "studio"
                      ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                  title="استوديو القراءة التفاعلي المباشر"
                >
                  <BrainCircuit className="w-4 h-4 text-emerald-300" />
                  <span>📺 استوديو القراءة</span>
                </button>
              </div>
            </div>

            {/* Sub-filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <div className="relative w-full sm:w-80">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={topicSearchQuery}
                  onChange={(e) => setTopicSearchQuery(e.target.value)}
                  placeholder="ابحث في شروحات وعناوين الكورس..."
                  className="w-full pr-10 pl-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                {topicSearchQuery && (
                  <button
                    onClick={() => setTopicSearchQuery("")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-300 font-bold w-full sm:w-auto justify-between sm:justify-end">
                <span>
                  إجمالي الوحدات: <span className="text-cyan-300 font-black">{course.modules.length}</span>
                </span>
                <span>•</span>
                <span>
                  إجمالي الدروس: <span className="text-indigo-300 font-black">{allTopics.length}</span>
                </span>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* MODE 1: INTERACTIVE LEARNING PATH ROADMAP (خريطة المسار التعليمي) */}
          {/* ============================================================ */}
          {courseDisplayMode === "path" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span>
                    <strong>المسار التعليمي التسلسلي (Learning Path):</strong> يتميز بتحديد محطات التعلم التراكمي خطوة بخطوة من البداية وحتى الشهادة المعتمدة.
                  </span>
                </div>
                <span className="bg-cyan-500/20 px-3 py-1 rounded-full font-black text-cyan-300 shrink-0">
                  {doneCount} / {allTopics.length} درس منجز
                </span>
              </div>

              {/* Timeline Flow */}
              <div className="relative pr-4 sm:pr-8 space-y-8 border-r-2 border-indigo-500/30 mr-2 sm:mr-4">
                {course.modules.map((mod, modIdx) => {
                  const modDone = mod.topics.filter((t) => completedTopics.includes(t.id)).length;
                  const isModComplete = modDone === mod.topics.length && mod.topics.length > 0;

                  return (
                    <div key={mod.id} className="relative space-y-4">
                      {/* Timeline Node Icon */}
                      <div className={`absolute -right-[27px] sm:-right-[43px] top-0 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-xl font-black shadow-2xl transition-transform hover:scale-110 z-10 ${
                        isModComplete
                          ? "bg-emerald-500 text-black shadow-emerald-500/40"
                          : modDone > 0
                          ? "bg-cyan-500 text-black shadow-cyan-500/40"
                          : "bg-[#0d1424] text-slate-300 border-2 border-indigo-500/50"
                      }`}>
                        {isModComplete ? "✓" : modIdx + 1}
                      </div>

                      {/* Module Milestone Header Card */}
                      <div className="bg-[#0d1424] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 hover:border-cyan-500/40 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                المحطة {modIdx + 1} من {course.modules.length}
                              </span>
                              <span className="text-xs text-slate-400 font-bold">
                                {mod.topics.length} دروس تعليمية
                              </span>
                            </div>
                            <h3 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
                              <span>{mod.icon}</span>
                              <span>{mod.title}</span>
                            </h3>
                            <p className="text-xs text-slate-300 font-medium mt-1">{mod.sub}</p>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-left sm:text-right">
                              <div className="text-xs font-black text-cyan-300">
                                {modDone} / {mod.topics.length} درس مكتمل
                              </div>
                              <div className="w-28 h-1.5 rounded-full bg-white/10 overflow-hidden mt-1">
                                <div
                                  className="h-full bg-cyan-400 transition-all"
                                  style={{ width: `${(modDone / Math.max(1, mod.topics.length)) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Step Topics List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {mod.topics.map((top, topIdx) => {
                            const isDone = completedTopics.includes(top.id);
                            return (
                              <div
                                key={top.id}
                                onClick={() => onSelectTopic(mod, top)}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                                  isDone
                                    ? "bg-emerald-950/20 border-emerald-500/30 hover:bg-emerald-950/30"
                                    : "bg-white/5 border-white/5 hover:border-indigo-500/50 hover:bg-white/10"
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                                    isDone ? "bg-emerald-500 text-black" : "bg-white/10 text-slate-300"
                                  }`}>
                                    {isDone ? "✓" : topIdx + 1}
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="text-xs font-black text-white truncate group-hover:text-cyan-300 transition-colors">
                                      {top.title}
                                    </h4>
                                    <p className="text-[11px] text-slate-400 truncate font-medium">{top.sub}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  {top.formula && (
                                    <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                                      معادلة
                                    </span>
                                  )}
                                  <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-white" />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Final Capstone Milestone Node */}
                <div className="relative pt-4">
                  <div className="absolute -right-[27px] sm:-right-[43px] top-4 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500 text-black flex items-center justify-center text-2xl font-black shadow-2xl z-10">
                    🏆
                  </div>
                  <div className="bg-gradient-to-r from-amber-950/40 via-[#0d1424] to-indigo-950/40 border border-amber-500/40 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center sm:text-right">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        المحطة الختامية للمسار
                      </span>
                      <h4 className="text-lg font-black text-white">مشروع التخرج والاعتماد الميداني وشبكة الخريجين</h4>
                      <p className="text-xs text-slate-300">عند إتمام كافّة الوحدات تحصل على الشهادة الرسمية الدولية للبحث العلمي والتطبيق المحاسبي.</p>
                    </div>
                    <button
                      onClick={() => setDetailTab("capstone")}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black shadow-lg cursor-pointer whitespace-nowrap shrink-0"
                    >
                      استكشف مشروع التخرج
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* MODE 2: DETAILED ACCORDION LIST (القائمة القابلة للتوسيع) */}
          {/* ============================================================ */}
          {courseDisplayMode === "list" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between bg-[#0d1424] p-4 rounded-2xl border border-white/10">
                <span className="text-xs text-slate-300 font-extrabold">
                  وضع عرض القائمة التفصيلية الحرة
                </span>
                <button
                  onClick={() => {
                    if (expandedModules.length === course.modules.length) {
                      setExpandedModules([]);
                    } else {
                      setExpandedModules(course.modules.map((m) => m.id));
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-indigo-300 hover:text-white font-extrabold cursor-pointer transition-colors"
                >
                  {expandedModules.length === course.modules.length ? "طي كل الوحدات" : "توسيع كل الوحدات"}
                </button>
              </div>

              {course.modules.map((mod, modIdx) => {
                const filteredTopics = mod.topics.filter(
                  (t) =>
                    t.title.toLowerCase().includes(topicSearchQuery.toLowerCase()) ||
                    t.sub.toLowerCase().includes(topicSearchQuery.toLowerCase()) ||
                    t.content.toLowerCase().includes(topicSearchQuery.toLowerCase())
                );

                if (topicSearchQuery && filteredTopics.length === 0) return null;

                const modDone = mod.topics.filter((t) => completedTopics.includes(t.id)).length;
                const isExpanded = expandedModules.includes(mod.id) || Boolean(topicSearchQuery);

                return (
                  <div
                    key={mod.id}
                    className="bg-[#0d1424] border border-white/10 rounded-2xl overflow-hidden shadow-xl transition-all"
                  >
                    <div
                      onClick={() => toggleModuleExpand(mod.id)}
                      className="p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors select-none"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 flex items-center justify-center text-2xl shrink-0 font-bold shadow-inner">
                          {mod.icon}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base sm:text-lg font-black text-white">
                            الوحدة {modIdx + 1}: {mod.title}
                          </h3>
                          <p className="text-xs text-slate-400 font-bold truncate">{mod.sub}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <span className={`text-xs font-black px-3.5 py-1.5 rounded-full border ${
                          modDone === mod.topics.length
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : "bg-white/5 text-slate-300 border-white/10"
                        }`}>
                          {modDone} / {mod.topics.length} مكتمل
                        </span>

                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-5 pt-0 border-t border-white/10 space-y-2.5 bg-black/20">
                        {filteredTopics.map((top, topIdx) => {
                          const isDone = completedTopics.includes(top.id);
                          const isBookmarked = bookmarkedTopics.includes(top.id);

                          return (
                            <div
                              key={top.id}
                              onClick={() => onSelectTopic(mod, top)}
                              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 group ${
                                isDone
                                  ? "bg-emerald-950/20 border-emerald-500/30 hover:bg-emerald-950/30"
                                  : "bg-white/5 border-white/5 hover:border-indigo-500/50 hover:bg-white/10"
                              }`}
                            >
                              <div className="flex items-center gap-4 min-w-0">
                                <div
                                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0 transition-transform group-hover:scale-110 ${
                                    isDone
                                      ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/30"
                                      : "bg-white/10 text-slate-300 border border-white/10"
                                  }`}
                                >
                                  {isDone ? "✓" : topIdx + 1}
                                </div>

                                <div className="min-w-0 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-black text-white truncate group-hover:text-cyan-300 transition-colors">
                                      {top.title}
                                    </h4>
                                    {isBookmarked && (
                                      <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-400 truncate font-medium">{top.sub}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                {top.formula && (
                                  <span className="hidden md:inline-flex px-3 py-1 rounded-lg text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                    معادلة رياضية
                                  </span>
                                )}
                                {top.quiz.length > 0 && (
                                  <span className="hidden sm:inline-flex px-3 py-1 rounded-lg text-xs font-black bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                    اختبار {top.quiz.length} أسئلة
                                  </span>
                                )}
                                <span className="px-3.5 py-1.5 rounded-xl bg-white/5 group-hover:bg-indigo-600 group-hover:text-white text-slate-300 text-xs font-bold transition-all flex items-center gap-1">
                                  <span>عرض الشرح</span>
                                  <ChevronLeft className="w-4 h-4" />
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ============================================================ */}
          {/* MODE 3: INTERACTIVE GRID MODULE CARDS (شبكة البطاقات التفاعلية) */}
          {/* ============================================================ */}
          {courseDisplayMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              {course.modules.map((mod, modIdx) => {
                const modDone = mod.topics.filter((t) => completedTopics.includes(t.id)).length;
                const modProgress = Math.round((modDone / Math.max(1, mod.topics.length)) * 100);

                return (
                  <div
                    key={mod.id}
                    className="bg-[#0d1424] border border-white/10 hover:border-cyan-500/40 rounded-3xl p-6 shadow-xl space-y-5 flex flex-col justify-between transition-all hover:-translate-y-1 group"
                  >
                    <div className="space-y-4">
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-3xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                          {mod.icon}
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                          الوحدة {modIdx + 1}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-1">
                        <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                          {mod.title}
                        </h3>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-medium">
                          {mod.sub}
                        </p>
                      </div>

                      {/* Topics Chips List */}
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <span className="text-[11px] text-slate-400 font-extrabold block">دروس هذه الوحدة:</span>
                        <div className="space-y-1.5">
                          {mod.topics.slice(0, 3).map((top, topIdx) => {
                            const isDone = completedTopics.includes(top.id);
                            return (
                              <div
                                key={top.id}
                                onClick={() => onSelectTopic(mod, top)}
                                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-200 font-bold flex items-center justify-between cursor-pointer border border-white/5"
                              >
                                <span className="truncate flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${isDone ? "bg-emerald-400" : "bg-slate-500"}`} />
                                  <span>{topIdx + 1}. {top.title}</span>
                                </span>
                                <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              </div>
                            );
                          })}
                          {mod.topics.length > 3 && (
                            <div className="text-[11px] text-cyan-400 font-black text-center pt-1">
                              +{mod.topics.length - 3} دروس إضافية
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar & Launch CTA */}
                    <div className="space-y-3 pt-3 border-t border-white/10">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                        <span>نسبة الإنجاز</span>
                        <span className="text-cyan-300 font-black">{modProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-cyan-400 transition-all" style={{ width: `${modProgress}%` }} />
                      </div>

                      <button
                        onClick={() => onSelectTopic(mod, mod.topics[0])}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <span>تصفح دروس الوحدة</span>
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ============================================================ */}
          {/* MODE 4: STUDIO READER SPLIT VIEW (استوديو القراءة المباشر) */}
          {/* ============================================================ */}
          {courseDisplayMode === "studio" && studioActiveTopic && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
              {/* LEFT PANE: LIVE LESSON PREVIEW & INTERACTIVE CONTENT */}
              <div className="lg:col-span-8 bg-[#0d1424] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-right">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      الوحدة: {studioActiveModule?.title}
                    </span>
                    <h3 className="text-xl font-black text-white mt-1.5">{studioActiveTopic.title}</h3>
                    <p className="text-xs text-slate-300 font-medium">{studioActiveTopic.sub}</p>
                  </div>

                  <button
                    onClick={() => onSelectTopic(studioActiveModule, studioActiveTopic)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-black text-xs font-black shadow-lg hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>فتح الشاشة الكاملة للقارئ</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>

                {/* Main Excerpt Content */}
                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <h4 className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>محتوى الدرس والشرح المباشر:</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal whitespace-pre-line">
                    {studioActiveTopic.content}
                  </p>
                </div>

                {/* Key Points */}
                {studioActiveTopic.keyPoints.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-cyan-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>النقاط الجوهرية والمهارات المكتسبة:</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {studioActiveTopic.keyPoints.map((kp, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 font-bold flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{kp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Formula Callout */}
                {studioActiveTopic.formula && (
                  <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 text-xs text-indigo-200 space-y-1">
                    <span className="font-extrabold text-cyan-300 block">📌 المعادلة الرياضية والقاعدة المحاسبية:</span>
                    <span className="font-mono text-sm text-white block">{studioActiveTopic.formula}</span>
                  </div>
                )}
              </div>

              {/* RIGHT PANE: TOPIC PICKER SIDEBAR */}
              <div className="lg:col-span-4 bg-[#0d1424] border border-white/10 rounded-3xl p-5 shadow-xl space-y-4 text-right">
                <div className="border-b border-white/10 pb-3">
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <List className="w-4 h-4 text-cyan-400" />
                    <span>قائمة دروس الكورس للتصفح السريع</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">انقر على أي درس لمعاينته فورياً بالاستوديو</p>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
                  {course.modules.map((mod) => (
                    <div key={mod.id} className="space-y-2">
                      <div className="text-xs font-black text-cyan-300 flex items-center gap-1.5 bg-white/5 p-2 rounded-xl">
                        <span>{mod.icon}</span>
                        <span className="truncate">{mod.title}</span>
                      </div>

                      <div className="space-y-1.5 pr-2 border-r-2 border-white/10">
                        {mod.topics.map((top) => {
                          const isSelected = studioActiveTopic.id === top.id;
                          const isDone = completedTopics.includes(top.id);

                          return (
                            <div
                              key={top.id}
                              onClick={() => setStudioTopicId(top.id)}
                              className={`p-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-between gap-2 ${
                                isSelected
                                  ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/30 font-black"
                                  : isDone
                                  ? "bg-emerald-950/30 text-emerald-300 border border-emerald-500/30"
                                  : "bg-white/5 text-slate-300 hover:bg-white/10"
                              }`}
                            >
                              <span className="truncate">{top.title}</span>
                              <span className="text-[10px] shrink-0 font-extrabold">
                                {isDone ? "✓ مكتمل" : isSelected ? "معاينة 👁️" : ""}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRACTICAL BENEFIT (FULL WIDTH) */}
      {detailTab === "benefit" && (
        <div className="space-y-6 animate-fadeIn">
          {course.practicalBenefit ? (
            <>
              <div className="bg-[#0d1424] border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                <div className="flex items-center gap-2.5 text-amber-400 text-base font-black">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                  <h3>الأثر المهني والوظيفي بالكورس (Career Impact)</h3>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  {course.practicalBenefit.careerImpact}
                </p>

                {course.practicalBenefit.salaryImpact && (
                  <div className="mt-4 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-black flex items-center gap-4">
                    <span className="text-2xl">💰</span>
                    <div>
                      <div className="text-white font-extrabold">الأثر المتوقع على الراتب والدخل:</div>
                      <div className="text-emerald-300 font-bold mt-0.5">{course.practicalBenefit.salaryImpact}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-[#0d1424] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                <h3 className="text-base font-black text-cyan-300 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                  <span>المهارات التطبيقية المباشرة التي ستكتسبها بالحياة العملية</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.practicalBenefit.practicalSkills.map((sk, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm font-bold text-slate-200 flex items-start gap-3">
                      <span className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-black shrink-0 text-xs">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed mt-1">{sk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0d1424] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                <h3 className="text-base font-black text-purple-300 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span>المسميات الوظيفية والقطاعات المستهدفة</span>
                </h3>

                <div className="flex flex-wrap gap-3">
                  {course.practicalBenefit.targetRoles.map((role, idx) => (
                    <span key={idx} className="px-5 py-3 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-200 text-xs font-black shadow-inner">
                      👔 {role}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center bg-[#0d1424] border border-white/10 rounded-3xl text-slate-400 text-xs font-bold">
              سيتم إضافة التفاصيل العملية المتقدمة قريباً.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: EXAM STRATEGY (FULL WIDTH) */}
      {detailTab === "strategy" && (
        <div className="space-y-6 animate-fadeIn">
          {course.examStrategy ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-[#0d1424] border border-indigo-500/30 rounded-3xl p-6 space-y-2 shadow-xl">
                  <div className="text-xs font-extrabold text-indigo-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>ساعات المذاكرة الموصى بها</span>
                  </div>
                  <div className="text-3xl font-black text-white">{course.examStrategy.studyHours}</div>
                </div>

                <div className="bg-[#0d1424] border border-emerald-500/30 rounded-3xl p-6 space-y-2 shadow-xl">
                  <div className="text-xs font-extrabold text-emerald-300 flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>نسبة النجاح العالمية (Global Pass Rate)</span>
                  </div>
                  <div className="text-3xl font-black text-white">{course.examStrategy.passRate}</div>
                </div>
              </div>

              <div className="bg-[#0d1424] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xl">
                <h3 className="text-base font-black text-cyan-300 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <span>طبيعة وهيكل نظام أسئلة الامتحان</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium bg-white/5 p-5 rounded-2xl border border-white/10">
                  {course.examStrategy.examFormat}
                </p>
              </div>

              <div className="bg-[#0d1424] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                <h3 className="text-base font-black text-amber-300 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  <span>استراتيجية الدراسة وخطوات النجاح المضمونة</span>
                </h3>

                <div className="space-y-3">
                  {course.examStrategy.passStrategySteps.map((step, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm font-bold text-slate-200 flex items-start gap-3">
                      <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-black shrink-0 text-xs">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed mt-1">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center bg-[#0d1424] border border-white/10 rounded-3xl text-slate-400 text-xs font-bold">
              سيتم إضافة خطط المذاكرة قريباً.
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CERTIFICATION GUIDE (FULL WIDTH) */}
      {detailTab === "guide" && (
        <div className="space-y-6 animate-fadeIn">
          {course.certificationGuide ? (
            <>
              <div className="bg-[#0d1424] border border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                <div className="space-y-1">
                  <span className="text-xs font-black text-purple-300 uppercase tracking-wider">الجهة المانحة والاعتماد الدولي</span>
                  <h3 className="text-xl font-black text-white">{course.certificationGuide.grantingBody}</h3>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm space-y-1">
                  <span className="text-cyan-300 font-extrabold flex items-center gap-1.5">
                    📍 أين يؤدى الاختبار؟ (مراكز الاختبار والوكلاء المعتمدين):
                  </span>
                  <p className="text-slate-200 font-medium leading-relaxed">{course.certificationGuide.examCenters}</p>
                </div>
              </div>

              <div className="bg-[#0d1424] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xl">
                <h3 className="text-base font-black text-cyan-300 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                  <span>الشروط والمؤهلات المطلوبة للتسجيل</span>
                </h3>

                <div className="space-y-2">
                  {course.certificationGuide.requirements.map((req, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white/5 text-xs sm:text-sm text-slate-200 font-bold flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-cyan-400 shrink-0" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0d1424] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                <h3 className="text-base font-black text-emerald-300 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-400" />
                  <span>خطوات التسجيل والتقديم للحصول على الشهادة الرسمية</span>
                </h3>

                <div className="space-y-3">
                  {course.certificationGuide.registrationSteps.map((step, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm font-bold text-slate-200 flex items-start gap-3">
                      <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-black shrink-0 text-xs">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed mt-1">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center bg-[#0d1424] border border-white/10 rounded-3xl text-slate-400 text-xs font-bold">
              سيتم إضافة أدلة التسجيل والاعتماد قريباً.
            </div>
          )}
        </div>
      )}

      {/* TAB 5: CAPSTONE PROJECT */}
      {detailTab === "capstone" && (
        <div className="space-y-6 animate-fadeIn">
          <CapstoneProjectCard courseName={course.name} />
        </div>
      )}

      {/* TAB 6: INSTRUCTORS & FACULTY */}
      {detailTab === "instructors" && (
        <div className="space-y-6 animate-fadeIn">
          <InstructorsCard />
        </div>
      )}

      {/* MODAL 1: FINANCIAL AID */}
      {showFinancialAidModal && (
        <FinancialAidModal
          course={course}
          onClose={() => setShowFinancialAidModal(false)}
          onGrantAid={() => {
            setShowFinancialAidModal(false);
            alert("تم تفعيل منحة التخصص 100% بنجاح! يمكنك الآن متابعة التعلم مجاناً بالكامل.");
          }}
        />
      )}

      {/* MODAL 2: VERIFIED CERTIFICATE */}
      {showCertificateModal && (
        <CourseraCertificateModal
          course={course}
          studentName="المحاسب المالي المتميز"
          onClose={() => setShowCertificateModal(false)}
        />
      )}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. TOPIC / LESSON READER SCREEN (شاشة الدرس التفاعلية القارئ)
// ─────────────────────────────────────────────────────────────
type PaperTheme = "night" | "cream" | "sepia" | "modern";

interface TopicScreenProps {
  course: Course;
  module: CourseModule;
  topic: CourseTopic;
  isDone: boolean;
  isBookmarked: boolean;
  userNote: string;
  completedTopics: string[];
  onDone: () => void;
  onToggleBookmark: () => void;
  onSaveNote: (note: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onSelectTopic: (mod: CourseModule, top: CourseTopic) => void;
  onBack: () => void;
}

function TopicScreen({
  course,
  module,
  topic,
  isDone,
  isBookmarked,
  userNote,
  completedTopics,
  onDone,
  onToggleBookmark,
  onSaveNote,
  onNext,
  onPrev,
  onSelectTopic,
  onBack
}: TopicScreenProps) {
  // Reader state
  const [paperTheme, setPaperTheme] = useState<PaperTheme>("night");
  const [fontSize, setFontSize] = useState<number>(18);
  const [activeTab, setActiveTab] = useState<"reader" | "quiz" | "caseStudy" | "standards" | "notes" | "calc">("reader");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [noteText, setNoteText] = useState<string>(userNote);
  const [noteSavedToast, setNoteSavedToast] = useState<boolean>(false);
  const [copiedFormula, setCopiedFormula] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [sidebarSearch, setSidebarSearch] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Calculator State
  const [calcAmount, setCalcAmount] = useState<number>(100000);
  const [calcRate, setCalcRate] = useState<number>(10);
  const [calcYears, setCalcYears] = useState<number>(5);
  const [calcSalvage, setCalcSalvage] = useState<number>(10000);

  // Sync userNote
  useEffect(() => {
    setNoteText(userNote);
  }, [userNote, topic.id]);

  // Cancel speech on unmount or topic change
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [topic.id]);

  const allCourseTopics = course.modules.flatMap((m) => m.topics);
  const currentTopicIdx = allCourseTopics.findIndex((t) => t.id === topic.id);
  const progressPercent = Math.round(((currentTopicIdx + 1) / Math.max(1, allCourseTopics.length)) * 100);

  const paragraphs = topic.content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Text-To-Speech Handler
  const toggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("خاصية القراءة الصوتية غير مدعومة في متصفحك حالياً.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const fullText = `${topic.title}. ${topic.sub}. ${topic.content}`;
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.lang = "ar-SA";
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Theme Styling Objects with mathematical contrast
  const themeStyles = {
    night: {
      bg: "bg-[#090e1a]",
      headerBg: "bg-[#0d1527]/90 border-indigo-500/20",
      cardBg: "bg-[#0f182e]",
      text: "text-slate-100",
      subtext: "text-slate-300",
      border: "border-indigo-500/20",
      accent: "text-cyan-400",
      paragraphBg: "bg-[#141f38]/80 border-indigo-500/20 hover:border-cyan-500/30",
      badgeBg: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
    },
    cream: {
      bg: "bg-[#f5f0e6]",
      headerBg: "bg-[#ebdcc8]/90 border-[#dfccb0]",
      cardBg: "bg-[#fcf8f2]",
      text: "text-[#2b2218]",
      subtext: "text-[#5e4f3c]",
      border: "border-[#e3d3bd]",
      accent: "text-[#9e6300]",
      paragraphBg: "bg-[#f2e9dc] border-[#ded0b8] hover:border-amber-600/40",
      badgeBg: "bg-amber-600/15 text-amber-900 border-amber-600/30"
    },
    sepia: {
      bg: "bg-[#e2d5c3]",
      headerBg: "bg-[#d3c2ab]/90 border-[#c5b298]",
      cardBg: "bg-[#ede3d4]",
      text: "text-[#36261a]",
      subtext: "text-[#634c3a]",
      border: "border-[#cbb8a0]",
      accent: "text-[#8b4513]",
      paragraphBg: "bg-[#dfd0be] border-[#cbb8a0] hover:border-amber-800/40",
      badgeBg: "bg-amber-800/15 text-amber-950 border-amber-800/30"
    },
    modern: {
      bg: "bg-slate-100",
      headerBg: "bg-white/95 border-slate-200",
      cardBg: "bg-white",
      text: "text-slate-900",
      subtext: "text-slate-600",
      border: "border-slate-200",
      accent: "text-indigo-600",
      paragraphBg: "bg-slate-50 border-slate-200 hover:border-indigo-400/40",
      badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200"
    }
  }[paperTheme];

  // Quiz Score calculation
  const quizTotal = topic.quiz.length;
  const quizAnsweredCount = Object.keys(quizAnswers).length;
  const quizCorrectCount = topic.quiz.filter((q, idx) => quizAnswers[idx] === q.ans).length;

  return (
    <section className={`min-h-screen py-3 sm:py-6 px-3 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto space-y-5 animate-fadeIn pb-32 transition-colors duration-300 ${themeStyles.bg}`}>
      
      {/* 1. TOP HEADER TOOLBAR & ACTION CENTER */}
      <header className={`backdrop-blur-2xl border rounded-3xl p-3 sm:p-4 text-white flex flex-col md:flex-row items-center justify-between gap-3 sticky top-3 z-50 shadow-2xl transition-all ${themeStyles.headerBg}`}>
        
        {/* RIGHT: BACK BUTTON & SYLLABUS DRAWER TRIGGER */}
        <div className="flex items-center justify-between w-full md:w-auto gap-2.5">
          <button
            onClick={onBack}
            className="px-3 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-100 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 border border-white/10 shrink-0"
            title="الرجوع إلى تفاصيل الكورس"
          >
            <ArrowRight className="w-4 h-4 text-cyan-300" />
            <span className="hidden sm:inline">الرجوع للكورس</span>
          </button>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`px-3.5 py-2 rounded-2xl border text-xs font-black flex items-center gap-2 cursor-pointer transition-all shrink-0 ${
              isSidebarOpen
                ? "bg-gradient-to-r from-cyan-500 to-indigo-600 border-cyan-400 text-white shadow-lg shadow-indigo-600/30"
                : "bg-white/10 border-white/15 text-slate-200 hover:bg-white/20"
            }`}
          >
            <List className="w-4 h-4 text-amber-300" />
            <span>فهرس الدروس</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-black/40 text-cyan-300 border border-white/10">
              {currentTopicIdx + 1}/{allCourseTopics.length}
            </span>
          </button>

          {/* Mobile Theme Toggle Button */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={onToggleBookmark}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isBookmarked ? "bg-amber-500 text-black border-amber-400" : "bg-white/10 border-white/10 text-slate-200"
              }`}
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CENTER: TOPIC TITLE & BREADCRUMB */}
        <div className="min-w-0 text-center flex-1 px-2 w-full md:w-auto">
          <div className="flex items-center justify-center gap-2 text-[11px] font-extrabold text-cyan-300 truncate">
            <span className="truncate">{course.name}</span>
            <span>•</span>
            <span className="text-amber-300 truncate">{module.title}</span>
          </div>
          <h2 className="text-xs sm:text-sm md:text-base font-black text-white truncate mt-0.5">{topic.title}</h2>
        </div>

        {/* LEFT: CUSTOMIZER TOOLBAR & ACTIONS */}
        <div className="flex items-center justify-center md:justify-end gap-2 w-full md:w-auto flex-wrap sm:flex-nowrap pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
          
          {/* TTS Audio Reader Button */}
          <button
            onClick={toggleSpeech}
            className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              isSpeaking
                ? "bg-emerald-500 text-black border-emerald-400 animate-pulse font-black"
                : "bg-white/10 border-white/15 text-slate-200 hover:bg-white/20"
            }`}
            title="استماع للشرح المباشر بالصوت"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isSpeaking ? "text-black" : "text-emerald-400"}`} />
            <span>{isSpeaking ? "إيقاف القراءة 🔊" : "قراءة صوتية 🎧"}</span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={onToggleBookmark}
            className={`hidden md:flex p-2 rounded-xl border transition-all cursor-pointer ${
              isBookmarked
                ? "bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20"
                : "bg-white/10 border-white/15 text-slate-200 hover:bg-white/20"
            }`}
            title={isBookmarked ? "محفوظ في المفضلة" : "حفظ الدرس بالمفضلة"}
          >
            <Bookmark className="w-4 h-4" />
          </button>

          {/* Theme Switcher Dots */}
          <div className="hidden sm:flex items-center gap-1 bg-black/50 border border-white/15 p-1 rounded-xl">
            <button
              onClick={() => setPaperTheme("night")}
              className={`w-5 h-5 rounded-full bg-[#0f172a] border transition-transform ${paperTheme === "night" ? "border-cyan-400 scale-125 ring-2 ring-cyan-400/30" : "border-slate-600 opacity-60"}`}
              title="الوضع الليلي (Night)"
            />
            <button
              onClick={() => setPaperTheme("cream")}
              className={`w-5 h-5 rounded-full bg-[#fbf7ee] border transition-transform ${paperTheme === "cream" ? "border-amber-600 scale-125 ring-2 ring-amber-500/30" : "border-amber-300 opacity-60"}`}
              title="الوضع الورقي (Cream)"
            />
            <button
              onClick={() => setPaperTheme("sepia")}
              className={`w-5 h-5 rounded-full bg-[#efe6d5] border transition-transform ${paperTheme === "sepia" ? "border-amber-800 scale-125 ring-2 ring-amber-800/30" : "border-amber-800 opacity-60"}`}
              title="وضع سيبيا (Sepia)"
            />
            <button
              onClick={() => setPaperTheme("modern")}
              className={`w-5 h-5 rounded-full bg-white border transition-transform ${paperTheme === "modern" ? "border-indigo-600 scale-125 ring-2 ring-indigo-500/30" : "border-slate-400 opacity-60"}`}
              title="الوضع الناصع (Modern)"
            />
          </div>

          {/* Font Controls */}
          <div className="flex items-center gap-1 bg-black/50 border border-white/15 px-2 py-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setFontSize((f) => Math.max(14, f - 1))}
              className="px-1.5 py-0.5 hover:text-cyan-300 transition-colors cursor-pointer text-slate-300 font-extrabold"
              title="تصغير الخط"
            >
              A-
            </button>
            <span className="text-[11px] text-cyan-300 font-mono font-black">{fontSize}</span>
            <button
              onClick={() => setFontSize((f) => Math.min(24, f + 1))}
              className="px-1.5 py-0.5 hover:text-cyan-300 transition-colors cursor-pointer text-slate-300 font-extrabold"
              title="تكبير الخط"
            >
              A+
            </button>
          </div>
        </div>
      </header>

      {/* 2. PROGRESS STEPPER BAR WITH METRICS */}
      <div className="bg-black/30 border border-white/10 rounded-2xl p-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-black text-slate-300 shrink-0">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>تقدم الكورس:</span>
          <span className="text-cyan-300 font-mono">{progressPercent}%</span>
        </div>

        <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden relative">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 transition-all duration-500 shadow-lg shadow-cyan-400/30"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <span className="text-[11px] font-black text-indigo-300 shrink-0">
          الدرس {currentTopicIdx + 1} من {allCourseTopics.length}
        </span>
      </div>

      {/* 3. MAIN CANVAS BODY WITH SIDEBAR DRAWER */}
      <div className="relative flex gap-6 items-start">
        
        {/* SIDEBAR NAVIGATION DRAWER */}
        {isSidebarOpen && (
          <aside className="w-80 shrink-0 bg-[#0c1427] border border-cyan-500/30 rounded-3xl p-5 space-y-4 shadow-2xl z-40 animate-slideLeft">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-black text-white flex items-center gap-2">
                <List className="w-4 h-4 text-cyan-400" />
                <span>فهرس الدروس والوحدات ({allCourseTopics.length})</span>
              </span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center text-xs font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Sidebar Search Bar */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                placeholder="تصفية الدروس..."
                className="w-full pr-9 pl-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Topic Navigation Accordion */}
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin">
              {course.modules.map((m, mIdx) => {
                const filtered = m.topics.filter(
                  (t) =>
                    t.title.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
                    t.sub.toLowerCase().includes(sidebarSearch.toLowerCase())
                );

                if (sidebarSearch && filtered.length === 0) return null;

                return (
                  <div key={m.id} className="space-y-2">
                    <div className="text-[11px] font-black text-cyan-300 px-2 py-1 bg-white/5 rounded-lg flex items-center gap-1.5">
                      <span>{m.icon}</span>
                      <span className="truncate">الوحدة {mIdx + 1}: {m.title}</span>
                    </div>

                    <div className="space-y-1.5 pr-2 border-r-2 border-white/10">
                      {filtered.map((t) => {
                        const isActive = t.id === topic.id;
                        const isTopicDone = completedTopics.includes(t.id);

                        return (
                          <button
                            key={t.id}
                            onClick={() => {
                              onSelectTopic(m, t);
                              setIsSidebarOpen(false);
                            }}
                            className={`w-full text-right p-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-between gap-2 cursor-pointer ${
                              isActive
                                ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md font-black"
                                : isTopicDone
                                ? "bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-300 border border-emerald-500/20"
                                : "bg-white/5 hover:bg-white/10 text-slate-300"
                            }`}
                          >
                            <span className="truncate">{t.title}</span>
                            {isTopicDone ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : isActive ? (
                              <Eye className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        {/* READER MAIN CONTENT CONTAINER */}
        <div className={`flex-1 rounded-3xl p-5 sm:p-8 border shadow-2xl transition-all ${themeStyles.cardBg} ${themeStyles.border}`}>
          
          {/* SUB-TABS SELECTOR HEADER */}
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-current opacity-25 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab("reader")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === "reader"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "hover:bg-black/10 text-current"
              }`}
            >
              <FileText className="w-4 h-4 text-cyan-300" />
              <span>الشرح العلمي المعمق</span>
            </button>

            <button
              onClick={() => setActiveTab("caseStudy")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === "caseStudy"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "hover:bg-black/10 text-current"
              }`}
            >
              <Briefcase className="w-4 h-4 text-purple-300" />
              <span>قيود اليومية والتطبيق الميداني</span>
            </button>

            <button
              onClick={() => setActiveTab("standards")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === "standards"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "hover:bg-black/10 text-current"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>معايير IFRS / US GAAP</span>
            </button>

            {topic.quiz.length > 0 && (
              <button
                onClick={() => setActiveTab("quiz")}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  activeTab === "quiz"
                    ? "bg-amber-500 text-black shadow-lg font-black"
                    : "hover:bg-black/10 text-current"
                }`}
              >
                <BrainCircuit className="w-4 h-4 text-amber-950" />
                <span>اختبر فهمك ({topic.quiz.length})</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab("notes")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === "notes"
                  ? "bg-cyan-600 text-white shadow-lg"
                  : "hover:bg-black/10 text-current"
              }`}
            >
              <MessageSquare className="w-4 h-4 text-cyan-200" />
              <span>ملاحظاتي الخاصة</span>
            </button>

            <button
              onClick={() => setActiveTab("calc")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === "calc"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "hover:bg-black/10 text-current"
              }`}
            >
              <BrainCircuit className="w-4 h-4 text-amber-300" />
              <span>المختبر والحاسبة المالية</span>
            </button>
          </div>

          {/* ============================================================ */}
          {/* TAB 1: CORE SCIENTIFIC READING (الشرح العلمي المعمق) */}
          {/* ============================================================ */}
          {activeTab === "reader" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* TOPIC BANNER HEADER */}
              <div className="space-y-3 border-b border-white/10 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${themeStyles.badgeBg}`}>
                    {module.icon} {module.title}
                  </span>

                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1 text-cyan-300">
                      <Clock className="w-3.5 h-3.5" />
                      <span>زمن القراءة المتوقع: 5 دقائق</span>
                    </span>
                    <span>•</span>
                    <span className="text-amber-400 font-black">مستوى احترافي الموديل</span>
                  </div>
                </div>

                <h1 className={`text-2xl sm:text-3xl font-black ${themeStyles.text} leading-tight`}>
                  {topic.title}
                </h1>
                <p className={`text-sm ${themeStyles.subtext} font-medium leading-relaxed`}>{topic.sub}</p>
              </div>

              {/* FORMULA CALLOUT CARD */}
              {topic.formula && (
                <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-[#0d162a] to-cyan-950/70 border border-cyan-500/40 shadow-2xl space-y-3 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between text-xs font-black text-cyan-300">
                    <span className="flex items-center gap-2 text-sm">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <span>المعادلة المحاسبية والقاعدة المعيارية للدرس:</span>
                    </span>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(topic.formula || "");
                        setCopiedFormula(true);
                        setTimeout(() => setCopiedFormula(false), 2000);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-200 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
                    >
                      {copiedFormula ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-300" />}
                      <span>{copiedFormula ? "تم النسخ بنجاح" : "نسخ المعادلة"}</span>
                    </button>
                  </div>

                  <div className="text-lg sm:text-2xl font-black text-amber-200 dir-rtl pt-2 font-mono leading-relaxed bg-black/40 p-4 rounded-2xl border border-white/10">
                    {topic.formula}
                  </div>
                </div>
              )}

              {/* PARAGRAPHS WITH CUSTOM STYLING */}
              <div className="space-y-4">
                {paragraphs.map((p, pIdx) => {
                  const isHeading = p.startsWith("أولاً:") || p.startsWith("ثانياً:") || p.startsWith("ثالثاً:") || p.startsWith("رابعاً:") || p.startsWith("خامساً:");

                  return (
                    <div
                      key={pIdx}
                      className={`p-5 sm:p-6 rounded-2xl border transition-all ${themeStyles.paragraphBg}`}
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      {isHeading ? (
                        <h3 className="font-black text-cyan-300 text-base sm:text-lg mb-2 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-amber-400" />
                          <span>{p}</span>
                        </h3>
                      ) : (
                        <p className={`font-normal ${themeStyles.text} leading-relaxed`}>{p}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* KEY TAKEAWAYS BULLET LIST */}
              {topic.keyPoints.length > 0 && (
                <div className="p-6 rounded-3xl bg-black/30 border border-white/10 space-y-4 shadow-xl">
                  <h3 className={`text-sm font-black ${themeStyles.accent} flex items-center gap-2`}>
                    <Lightbulb className="w-5 h-5 text-amber-400" />
                    <span>النقاط الجوهرية والمهارات العملية المكتسبة:</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {topic.keyPoints.map((pt, ptIdx) => (
                      <div
                        key={ptIdx}
                        className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold flex items-start gap-3 ${themeStyles.paragraphBg} ${themeStyles.text}`}
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: PRACTICAL JOURNAL ENTRIES & CASE STUDY */}
          {/* ============================================================ */}
          {activeTab === "caseStudy" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <h3 className={`text-lg font-black ${themeStyles.text} flex items-center gap-2`}>
                  <Briefcase className="w-5 h-5 text-purple-400" />
                  <span>ورشة العمل الميدانية وجدول قيود اليومية المعيارية</span>
                </h3>
                <p className={`text-xs ${themeStyles.subtext}`}>
                  نموذج تطبيقي عملي لإدراج المعاملة المباشرة في الدفاتر وسجلات اليومية العامة وفق النظام المالي الحديث.
                </p>
              </div>

              {/* JOURNAL ENTRY DOUBLE TABLE */}
              <div className="p-5 rounded-3xl border border-purple-500/30 bg-purple-950/20 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between text-xs font-black text-purple-300 border-b border-purple-500/20 pb-3">
                  <span className="flex items-center gap-2 text-sm">
                    <FileCheck className="w-5 h-5 text-purple-400" />
                    <span>جدول القيد المحاسبي المزدوج (Double-Entry Ledger)</span>
                  </span>
                  <span className="text-xs text-cyan-300 font-mono bg-black/40 px-3 py-1 rounded-lg border border-white/10">
                    Ref: {topic.id.toUpperCase()}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 font-extrabold bg-black/40">
                        <th className="py-3 px-4">التاريخ / الفترة</th>
                        <th className="py-3 px-4">بيان الحساب والوصف المعياري</th>
                        <th className="py-3 px-4 text-emerald-400">طرف مدين (Debit)</th>
                        <th className="py-3 px-4 text-cyan-400">طرف دائن (Credit)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium">
                      <tr>
                        <td className="py-3.5 px-4 text-slate-400 font-mono">2026/01/01</td>
                        <td className="py-3.5 px-4 font-black text-white">
                          حـ/ {topic.title}
                          <span className="block text-[11px] text-slate-400 font-normal">إثبات الأصول / الأنشطة التشغيلية وفق المبدأ المالي</span>
                        </td>
                        <td className="py-3.5 px-4 font-black text-emerald-400 font-mono text-sm">100,000 ريال</td>
                        <td className="py-3.5 px-4 text-slate-500 font-mono">-</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 text-slate-400 font-mono">2026/01/01</td>
                        <td className="py-3.5 px-4 font-black text-slate-300 pr-8">
                          إلى حـ/ النقدية / البنك / الالتزامات المستحقة
                          <span className="block text-[11px] text-slate-400 font-normal">سداد التكاليف أو تسجيل التزام مالي دائن</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 font-mono">-</td>
                        <td className="py-3.5 px-4 font-black text-cyan-400 font-mono text-sm">100,000 ريال</td>
                      </tr>
                      <tr className="bg-black/60 font-black">
                        <td colSpan={2} className="py-3 px-4 text-amber-300 text-left">الإجمالي المتوازن:</td>
                        <td className="py-3 px-4 text-emerald-300 font-mono text-sm">100,000 ريال</td>
                        <td className="py-3 px-4 text-cyan-300 font-mono text-sm">100,000 ريال</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PRACTICAL FIELD CHECKLIST */}
              <div className={`p-6 rounded-3xl border ${themeStyles.border} space-y-4 bg-black/20`}>
                <h4 className="text-sm font-black text-cyan-300 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>خطوات الامتثال والتدقيق الميداني للوحدة:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="font-black text-amber-300 text-sm">1. التحقق من المستندات المؤيدة:</span>
                    <p className="text-slate-300 leading-relaxed">التأكد من أصل الفواتير والعقود المعتمدة ورقم التسجيل الضريبي قبل إدراج القيد.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="font-black text-emerald-300 text-sm">2. فصل الصلاحيات والرقابة:</span>
                    <p className="text-slate-300 leading-relaxed">مراجعة اعتماد مدير الحسابات والمدقق الداخلي المستقل للمعاملة.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="font-black text-cyan-300 text-sm">3. التسويات الدورية المباشرة:</span>
                    <p className="text-slate-300 leading-relaxed">مطابقة الأرصدة مع ميزان المراجعة التحليلي وإجراء التسويات الشهرية.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="font-black text-purple-300 text-sm">4. الإفصاح المالي الشفاف:</span>
                    <p className="text-slate-300 leading-relaxed">إدراج الإيضاحات المتممة للقوائم المالية وفق متطلبات المعيار الدولي.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: INTERNATIONAL STANDARDS (IFRS / US GAAP MATRIX) */}
          {/* ============================================================ */}
          {activeTab === "standards" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <h3 className={`text-lg font-black ${themeStyles.text} flex items-center gap-2`}>
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>مصفوفة التوافق مع المعايير الدولية IFRS والتقرير المالي US GAAP</span>
                </h3>
                <p className={`text-xs ${themeStyles.subtext}`}>
                  تحليل مقارن دقيق للمعايير المحاسبية المطبقة وقواعد التقييم والإفصاح في الهيئات الدولية والخليجية.
                </p>
              </div>

              <div className="p-6 rounded-3xl border border-emerald-500/30 bg-emerald-950/20 space-y-5 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* IFRS BOX */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-emerald-500/40 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-sm font-black text-emerald-300">المعايير الدولية IFRS / IAS</span>
                      <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-200 text-[11px] font-bold">IASB Compliant</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                      تعتمد المعايير الدولية على منهج القواعد المبنية على المبادئ (Principle-Based)، وتتطلب تقييم الجوهر الاقتصادي للمعاملة وإدراج القيمة العادلة عبر أرباح وخسائر الفترة أو OCI.
                    </p>
                  </div>

                  {/* US GAAP BOX */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-blue-500/40 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-sm font-black text-blue-300">المعايير الأمريكية US GAAP</span>
                      <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-200 text-[11px] font-bold">FASB Codification</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                      تلتزم بتعليمات وقواعد صريحة (Rules-Based)، مع متطلبات إفصاح دقيقة واختبارات هبوط القيمة والشهرة ونماذج الخسائر الائتمانية المتوقعة CECL.
                    </p>
                  </div>
                </div>

                {/* EXAM TRAPS CALLOUT */}
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm space-y-2">
                  <span className="font-black text-amber-300 flex items-center gap-2 text-sm">
                    <Lightbulb className="w-5 h-5 text-amber-400" />
                    <span>تنبيه هائل للاختبارات المهنية (CPA, CMA, SOCPA):</span>
                  </span>
                  <p className="text-slate-200 leading-relaxed font-medium">
                    انتبه في أسئلة الاختبارات: عدم الخلط بين تكاليف الإصلاح الدورية (تعتبر مصاريف فورية في قائمة الدخل) وبين تكاليف التوسعات الرأسمالية (تُضاف لتكلفة الأصل وتُرأسمال في الميزانية العمومية).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: QUIZ PRACTICE */}
          {/* ============================================================ */}
          {activeTab === "quiz" && topic.quiz.length > 0 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <h3 className={`text-lg font-black ${themeStyles.text} flex items-center gap-2`}>
                    <BrainCircuit className="w-5 h-5 text-amber-400" />
                    <span>اختبار التقييم السريع للفصل</span>
                  </h3>
                  <p className={`text-xs ${themeStyles.subtext}`}>
                    اختبر مدى استيعابك وتطبيقك للقيود والمفاهيم المشروحة بهذا الدرس.
                  </p>
                </div>

                {quizAnsweredCount > 0 && (
                  <div className="px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300 font-black text-xs shrink-0">
                    النتيجة: {quizCorrectCount} من {quizTotal} ({Math.round((quizCorrectCount / quizTotal) * 100)}%)
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {topic.quiz.map((q, qIdx) => {
                  const chosen = quizAnswers[qIdx];
                  const answered = chosen !== undefined;

                  return (
                    <div
                      key={qIdx}
                      className={`p-6 rounded-3xl border space-y-4 shadow-xl ${themeStyles.paragraphBg}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                          السؤال {qIdx + 1} من {topic.quiz.length}
                        </span>
                      </div>

                      <h4 className={`text-sm sm:text-base font-black ${themeStyles.text} leading-relaxed`}>{q.q}</h4>

                      <div className="space-y-2.5">
                        {q.opts.map((opt, optIdx) => {
                          const isCorrect = optIdx === q.ans;
                          const isChosen = optIdx === chosen;

                          let style = "bg-white/5 border-white/10 text-slate-200 hover:border-white/20";
                          if (answered) {
                            if (isCorrect) {
                              style = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-black shadow-lg shadow-emerald-500/10";
                            } else if (isChosen) {
                              style = "bg-red-500/20 border-red-500/50 text-red-300 font-bold";
                            } else {
                              style = "bg-white/5 border-white/5 text-slate-500 opacity-40";
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={answered}
                              onClick={() => setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))}
                              className={`w-full text-right p-3.5 rounded-2xl border text-xs sm:text-sm leading-relaxed transition-all cursor-pointer flex items-center justify-between gap-3 ${style}`}
                            >
                              <span>{opt}</span>
                              {answered && isCorrect && <span className="text-emerald-400 font-black shrink-0">✓ صحيح</span>}
                              {answered && isChosen && !isCorrect && <span className="text-red-400 font-black shrink-0">✗ إجابة خاطئة</span>}
                            </button>
                          );
                        })}
                      </div>

                      {answered && (
                        <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 text-xs sm:text-sm text-indigo-200 space-y-1">
                          <span className="font-black text-cyan-300 block">💡 الشرح التوضيحي للإجابة:</span>
                          <p className="font-normal leading-relaxed">{q.exp}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 5: USER PERSONAL NOTES */}
          {/* ============================================================ */}
          {activeTab === "notes" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <h3 className={`text-lg font-black ${themeStyles.text} flex items-center gap-2`}>
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                  <span>ملاحظاتك وسجلاتك الدراسية الخاصة بالدرس</span>
                </h3>
                <p className={`text-xs ${themeStyles.subtext}`}>
                  اكتب أي استفسارات أو تلخيصات خاصة بهذا الموضوع لحفظها والرجوع إليها لاحقاً.
                </p>
              </div>

              <textarea
                rows={8}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="أضف هنا أي ملحوظة أو قيد محاسبي تود تذكره عند المراجعة..."
                className={`w-full p-5 rounded-3xl border ${themeStyles.border} bg-black/30 text-sm ${themeStyles.text} focus:outline-none focus:border-cyan-400 leading-relaxed shadow-inner`}
              />

              <div className="flex items-center justify-between">
                {noteSavedToast ? (
                  <span className="text-xs text-emerald-400 font-black flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تم حفظ الملاحظات بنجاح!</span>
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">يتم حفظ الملاحظات بحسابك مباشرة</span>
                )}

                <button
                  onClick={() => {
                    onSaveNote(noteText);
                    setNoteSavedToast(true);
                    setTimeout(() => setNoteSavedToast(false), 2500);
                  }}
                  className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition-all cursor-pointer shadow-lg shadow-indigo-600/30"
                >
                  حفظ الملاحظات
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 6: FINANCIAL CALCULATOR & SIMULATION LAB */}
          {/* ============================================================ */}
          {activeTab === "calc" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <h3 className={`text-lg font-black ${themeStyles.text} flex items-center gap-2`}>
                  <BrainCircuit className="w-5 h-5 text-cyan-400" />
                  <span>المختبر والحاسبة المالية المباشرة للدرس</span>
                </h3>
                <p className={`text-xs ${themeStyles.subtext}`}>
                  قم بإدخال القيم والبيانات الماليّة لتطبيق المعالجات الحسابية والتسويات المباشرة لهذا الدرس.
                </p>
              </div>

              <div className="p-6 rounded-3xl border border-cyan-500/30 bg-cyan-950/20 space-y-6 shadow-2xl">
                <div className="text-xs font-black text-cyan-300 border-b border-cyan-500/20 pb-3 flex items-center justify-between">
                  <span>📊 مدخلات المعاملة والتسوية الرقمية ({topic.title})</span>
                  <span className="text-amber-400 font-mono">Real-Time Engine</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">تكلفة الأصل / قيمة المعاملة (ريال):</label>
                    <input
                      type="number"
                      value={calcAmount}
                      onChange={(e) => setCalcAmount(Number(e.target.value) || 0)}
                      className="w-full p-3 rounded-2xl bg-black/50 border border-white/10 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">معدل الفائدة / الخصم الضمني (%):</label>
                    <input
                      type="number"
                      value={calcRate}
                      onChange={(e) => setCalcRate(Number(e.target.value) || 0)}
                      className="w-full p-3 rounded-2xl bg-black/50 border border-white/10 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">المدة / سنوات العمر الإنتاجي:</label>
                    <input
                      type="number"
                      value={calcYears}
                      onChange={(e) => setCalcYears(Number(e.target.value) || 1)}
                      className="w-full p-3 rounded-2xl bg-black/50 border border-white/10 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">قيمة الخردة / المخصص المقتطع (ريال):</label>
                    <input
                      type="number"
                      value={calcSalvage}
                      onChange={(e) => setCalcSalvage(Number(e.target.value) || 0)}
                      className="w-full p-3 rounded-2xl bg-black/50 border border-white/10 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* COMPUTED OUTCOMES */}
                <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-4">
                  <div className="text-xs font-black text-amber-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>النتائج الحسابية التلقائية والأثر القيدي:</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <span className="text-slate-400 text-xs">مصروف القسط السنوي (الإهلاك / التسوية):</span>
                      <div className="text-base font-black text-emerald-400 font-mono">
                        {((Math.max(0, calcAmount - calcSalvage)) / Math.max(1, calcYears)).toLocaleString("ar-SA", { maximumFractionDigits: 2 })} ريال/سنوياً
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <span className="text-slate-400 text-xs">إجمالي التكلفة التمويلية / الفائدة الضمنية:</span>
                      <div className="text-base font-black text-cyan-300 font-mono">
                        {((calcAmount * (calcRate / 100)) * calcYears).toLocaleString("ar-SA", { maximumFractionDigits: 2 })} ريال
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <span className="text-slate-400 text-xs">القيمة الالتزامية / التجميعية الإجمالية:</span>
                      <div className="text-base font-black text-purple-300 font-mono">
                        {(calcAmount + (calcAmount * (calcRate / 100)) * calcYears).toLocaleString("ar-SA", { maximumFractionDigits: 2 })} ريال
                      </div>
                    </div>
                  </div>

                  {topic.formula && (
                    <div className="p-3.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-xs text-indigo-200">
                      <span className="font-black text-cyan-300">📌 معادلة الدرس المعيارية:</span> {topic.formula}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. BOTTOM FLOATING ACTION BAR */}
      <div className="fixed bottom-4 right-4 left-4 max-w-4xl mx-auto z-50">
        <div className="bg-[#0c1325]/90 backdrop-blur-2xl border border-indigo-500/30 p-3 sm:p-4 rounded-3xl shadow-2xl flex items-center justify-between gap-3 text-white">
          
          <button
            onClick={onPrev}
            disabled={currentTopicIdx === 0}
            className={`px-4 py-3 rounded-2xl border text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
              currentTopicIdx === 0
                ? "opacity-25 cursor-not-allowed bg-white/5 border-white/5 text-slate-500"
                : "bg-white/10 hover:bg-white/20 border-white/15 text-white"
            }`}
          >
            <ChevronRight className="w-4 h-4 text-cyan-300" />
            <span className="hidden sm:inline">الدرس السابق</span>
          </button>

          <button
            onClick={() => {
              onDone();
              onNext();
            }}
            className="flex-1 max-w-md py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-indigo-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] text-white font-black text-xs sm:text-sm shadow-xl shadow-indigo-600/40 border border-emerald-400/40 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5 text-emerald-300" />
            <span>{isDone ? "الانتقال للدرس التالي ←" : "إكمال الدرس والانتقال ←"}</span>
          </button>

          <button
            onClick={onNext}
            disabled={currentTopicIdx === allCourseTopics.length - 1}
            className={`px-4 py-3 rounded-2xl border text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
              currentTopicIdx === allCourseTopics.length - 1
                ? "opacity-25 cursor-not-allowed bg-white/5 border-white/5 text-slate-500"
                : "bg-white/10 hover:bg-white/20 border-white/15 text-white"
            }`}
          >
            <span className="hidden sm:inline">الدرس التالي</span>
            <ChevronLeft className="w-4 h-4 text-cyan-300" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// COURSERA HELPER COMPONENTS: FINANCIAL AID & CERTIFICATES & VIDEO
// ─────────────────────────────────────────────────────────────

interface FinancialAidModalProps {
  course: Course;
  onClose: () => void;
  onGrantAid: () => void;
}

export function FinancialAidModal({ course, onClose, onGrantAid }: FinancialAidModalProps) {
  const [reason, setReason] = useState("طالب جامعي يبحث عن تطوير المهارات");
  const [statement, setStatement] = useState("أرغب في الحصول على الشهادة المعتمدة لتطوير مساري المهني والتقدم لوظائف محاسبية دون عوائق مالية.");
  const [applied, setApplied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied(true);
    setTimeout(() => {
      onGrantAid();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0b1329] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-white p-2 rounded-xl bg-white/5 cursor-pointer"
        >
          ✕
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <DollarSign className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="text-xs font-black text-cyan-400">Coursera Financial Aid / الدعم المالي</div>
            <h3 className="text-lg font-black text-white">منحة التعليم الكامل والتسجيل المجاني 100%</h3>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          نؤمن بحق الجميع في التعلم والحصول على شهادات دولية معتمدة. يمكنك تقديم طلب الدعم للحصول على الوصول الكامل للكورس <span className="text-cyan-300 font-bold">({course.name})</span> وإصدار الشهادة بدون أي رسوم.
        </p>

        {applied ? (
          <div className="p-6 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-3 animate-fadeIn">
            <div className="text-4xl">🎉</div>
            <h4 className="text-base font-black text-emerald-300">تم قبول طلب الدعم المالي فورياً!</h4>
            <p className="text-xs text-slate-200">
              تم تفعيل منحة التخصص الكاملة لك بتمويل 100%. يمكنك الآن إصدار الشهادات وخوض كافة الاختبارات.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">سبب طلب الدعم المالي:</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="طالب جامعي يبحث عن تطوير المهارات" className="bg-[#0b1329]">طالب جامعي / حديث التخرج</option>
                <option value="باحث عن عمل وترقية وظيفية" className="bg-[#0b1329]">باحث عن عمل ويبحث عن فرص وظيفية</option>
                <option value="تطوير مهارات التخصص ورغبة في التحول الرقمي" className="bg-[#0b1329]">محاسب يرغب في التخصص والمعايير الدولية</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">خطتك للاستفادة من الكورس:</label>
              <textarea
                rows={3}
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>تقديم الطلب والموافقة الفورية (100% Scholarship)</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

interface CourseraCertificateModalProps {
  course: Course;
  studentName: string;
  onClose: () => void;
}

export function CourseraCertificateModal({ course, studentName, onClose }: CourseraCertificateModalProps) {
  const [certId, setCertId] = useState(
    `MIZAN-${course.id.toUpperCase().replace(/[^A-Z0-9-]/g, "")}-${Math.floor(100000 + Math.random() * 900000)}`
  );
  const verifyUrl = `${window.location.origin}/verify/${certId}`;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = getToken();
        const res = await fetch("/api/certificates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            studentName: studentName.trim() || "متداول ميزان",
            trackName: course.name,
            jobTitle: course.org,
          }),
        });
        const data = await res.json();
        if (!cancelled && res.ok && data.certificate?.id) setCertId(data.certificate.id);
      } catch {
        // keep the local id when offline
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [course.name, studentName]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-[#0b1329] border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-3xl w-full space-y-6 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-white p-2 rounded-xl bg-white/5 cursor-pointer"
        >
          ✕
        </button>

        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Award className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="text-xs font-black text-amber-400">شهادة توثيق رسمية من منصة ميزان</div>
              <h3 className="text-base font-black text-white">الشهادة المعتمدة القابلة للمشاركة ورابط التوثيق</h3>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>طباعة PDF</span>
            </button>
          </div>
        </div>

        {/* VISUAL CERTIFICATE CARD */}
        <div className="bg-gradient-to-b from-[#fffef8] to-[#f7f2e4] text-[#1e1b18] p-8 sm:p-12 rounded-2xl border-8 border-[#d4af37] shadow-2xl relative overflow-hidden space-y-6 text-center select-none font-serif">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-3 right-3 text-2xl text-[#d4af37]">⚜️</div>
          <div className="absolute top-3 left-3 text-2xl text-[#d4af37]">⚜️</div>
          <div className="absolute bottom-3 right-3 text-2xl text-[#d4af37]">⚜️</div>
          <div className="absolute bottom-3 left-3 text-2xl text-[#d4af37]">⚜️</div>

          <div className="space-y-1">
            <div className="text-xs tracking-widest text-[#8c6d1f] font-bold uppercase">MEEZAN ACADEMY - CERTIFIED COURSE COMPLETION</div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2b2413]">شهادة إتمام وتخصص محاسبي معتمد</h2>
            <div className="text-xs text-[#6e5d33] font-sans font-bold">تُمنح هذه الشهادة الرسمية توثيقاً لاستيفاء كافة المتطلبات والمشاريع العملية</div>
          </div>

          <div className="py-2 space-y-1">
            <div className="text-xs text-[#736340] italic font-sans">تشهد المنصة والمؤسسة الأكاديمية بأن المتدرب:</div>
            <div className="text-2xl sm:text-4xl font-black text-[#1a150b] underline decoration-[#d4af37] decoration-2 underline-offset-8 font-sans">
              {studentName || "المحاسب المالي المتميز"}
            </div>
          </div>

          <div className="space-y-1 max-w-xl mx-auto">
            <div className="text-xs text-[#736340] font-sans">قد أتم بنجاح واقتدار كافة متطلبات الدورة والتطبيق الميداني في:</div>
            <div className="text-base sm:text-xl font-black text-[#3d2f10] font-sans">
              {course.name}
            </div>
            <div className="text-xs text-[#8a7238] font-bold font-sans">
              صادرة عن: {course.org}
            </div>
          </div>

          {/* Seal & Signatures Footer */}
          <div className="pt-6 border-t border-[#d4af37]/40 flex flex-col sm:flex-row items-center justify-between gap-6 font-sans">
            <div className="text-right space-y-1 text-xs">
              <div className="font-black text-[#2b220f]">د. أحمد فاروق الشريف</div>
              <div className="text-[10px] text-[#78663c]">رئيس لجنة الاعتماد والتعليم المستمر</div>
              <div className="text-[10px] text-[#8c7849] font-mono">Date: {new Date().toLocaleDateString("ar-SA")}</div>
            </div>

            {/* Gold Seal Badge */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#b8860b] via-[#ffd700] to-[#b8860b] border-4 border-[#fffef8] flex flex-col items-center justify-center text-center shadow-lg text-[#2b1f00] p-1 shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#2b1f00]" />
              <span className="text-[8px] font-black uppercase tracking-tighter mt-0.5">VERIFIED</span>
            </div>

            <div className="text-left space-y-1 text-xs">
              <div className="font-black text-[#2b220f]">Prof. Robert Kaplan</div>
              <div className="text-[10px] text-[#78663c]">Director of Academic Accreditation</div>
              <div className="text-[10px] text-[#8c7849] font-mono">ID: {certId}</div>
            </div>
          </div>
        </div>

        {/* Share & Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-300 font-bold flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>رابط التوثيق العام: <code className="text-amber-300 font-mono text-[11px]">{certId}</code></span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                navigator.clipboard.writeText(verifyUrl);
                alert("تم نسخ رابط التحقق الرسمي من منصة ميزان بنجاح!");
              }}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة رابط التحقق</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InstructorsCard() {
  return (
    <div className="bg-[#0d1424] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          <Users className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <div className="text-xs font-black text-indigo-300 uppercase">Coursera Certified Instructors</div>
          <h3 className="text-lg font-black text-white">المحاضرون والأساتذة الأكاديميون للمسار</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3 flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-2xl flex items-center justify-center font-black text-white shrink-0 shadow-lg">
            👨‍🏫
          </div>
          <div className="space-y-1 min-w-0">
            <h4 className="text-sm font-black text-white">د. خالد عبد الفتاح الشريف</h4>
            <p className="text-xs text-cyan-300 font-bold">شريك تدقيق سابق في Big 4 وأستاذ المحاسبة المالية</p>
            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              أكثر من 18 سنة خبرة في تطبيق معايير IFRS والتحليل المالي وتدريب المحاسبين المعتمدين بجمعيات SOCPA و AICPA.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3 flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-600 text-2xl flex items-center justify-center font-black text-white shrink-0 shadow-lg">
            👩‍💼
          </div>
          <div className="space-y-1 min-w-0">
            <h4 className="text-sm font-black text-white">أ. سارة الجابري (CPA, CMA)</h4>
            <p className="text-xs text-emerald-300 font-bold">خبير التخطيط المالي والميزانيات التقديرية</p>
            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              مدير مالي تنفيذي ومستشار بالنمذجة المالية وتصميم أنظمة الرقابة الداخلية للشركات المساهمة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CapstoneProjectCard({ courseName }: { courseName: string }) {
  const [ledgerVal, setLedgerVal] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="bg-[#0d1424] border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
          <Briefcase className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <div className="text-xs font-black text-amber-400 uppercase">Coursera Guided Capstone Assignment</div>
          <h3 className="text-base font-black text-white">مشروع التخرج التطبيقي الميداني - {courseName}</h3>
        </div>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        يتطلب الحصول على الشهادة النهائية حلاً عملياً لحالة دراسية حقيقية تشمل إعداد ميزان المراجعة وتعديل التسويات وتجميع القوائم المالية وفق المعايير الدولية.
      </p>

      {submitted ? (
        <div className="p-6 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold space-y-2 animate-fadeIn">
          <div className="text-2xl">✅ Grade: 100% Passed</div>
          <p className="text-white font-black text-sm">تم تقييم مشروعك التطبيقي واستيفاء شرط مشروع التخرج بنجاح!</p>
          <p className="text-slate-300">تمت إضافة نقاط التقييم للشهادة وتوثيق إنجازك.</p>
        </div>
      ) : (
        <div className="space-y-4 bg-black/40 p-5 rounded-2xl border border-white/10">
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-cyan-300 block">
              الحالة العملية: أدخل صافي قيمة أصل حق الاستخدام بعد خصم المجمع التراكمي (بالريال/الدولار):
            </label>
            <input
              type="text"
              value={ledgerVal}
              onChange={(e) => setLedgerVal(e.target.value)}
              placeholder="مثال: 450,000"
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <button
            onClick={() => setSubmitted(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 text-white font-black text-xs transition-all cursor-pointer shadow-lg"
          >
            تسليم المشروع والتكليف الميداني التقييمي
          </button>
        </div>
      )}
    </div>
  );
}
