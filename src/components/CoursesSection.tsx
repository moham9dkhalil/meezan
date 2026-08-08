import React, { useState, useEffect, useRef } from "react";
import { COURSES_DATA } from "../data/courses";
import { Course, CourseModule, CourseTopic, QuizQuestion } from "../types";
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
  Volume2,
  VolumeX,
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
  Compass
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

  const handleNextTopic = (course: Course, currentTop: CourseTopic) => {
    markTopicDone(currentTop.id);

    const allCourseTopics = course.modules.flatMap((m) => m.topics);
    const idx = allCourseTopics.findIndex((t) => t.id === currentTop.id);
    if (idx !== -1 && idx < allCourseTopics.length - 1) {
      const nextTop = allCourseTopics[idx + 1];
      setSelectedTopic(nextTop);
      const parentMod = course.modules.find((m) => m.topics.some((t) => t.id === nextTop.id)) || null;
      setSelectedModule(parentMod);
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
        onSelectTopic={(mod, top) => {
          setSelectedModule(mod);
          setSelectedTopic(top);
        }}
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
        onSelectTopic={(mod, top) => {
          setSelectedModule(mod);
          setSelectedTopic(top);
        }}
        onBack={() => setSelectedCourse(null)}
      />
    );
  }

  return (
    <CatalogScreen
      completedTopics={completedTopics}
      onSelectCourse={(course) => setSelectedCourse(course)}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// 1. CATALOG SCREEN (قائمة الكورسات والشهادات المعتمدة)
// ─────────────────────────────────────────────────────────────
interface CatalogScreenProps {
  completedTopics: string[];
  onSelectCourse: (course: Course) => void;
}

function CatalogScreen({ completedTopics, onSelectCourse }: CatalogScreenProps) {
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [selectedStageLevel, setSelectedStageLevel] = useState<"all" | "level1" | "level2" | "level3" | "level4">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const courses = COURSES_DATA;
  const cats = ["all", "accounting", "audit", "finance", "ifrs", "cfi"];

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
  const theme = getCatTheme(course.cat);
  const stageLevel = getCourseStageLevel(course.id);
  const progress = totalTopics === 0 ? 0 : doneTopics / totalTopics;
  const progressPercent = Math.round(progress * 100);

  // Ring geometry
  const size = 52;
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
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

          {/* SVG Progress Ring */}
          <div className="relative w-13 h-13 shrink-0 flex items-center justify-center">
            <svg className="w-13 h-13 -rotate-90">
              <circle
                cx="26"
                cy="26"
                r={radius}
                stroke="currentColor"
                strokeWidth={stroke}
                className="text-white/10"
                fill="transparent"
              />
              <circle
                cx="26"
                cy="26"
                r={radius}
                stroke={theme.accent}
                strokeWidth={stroke}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-black text-white">{doneTopics}</span>
              <span className="text-[9px] text-slate-400 font-bold">/{totalTopics}</span>
            </div>
          </div>
        </div>

        {/* Course Description */}
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 font-normal">
          {course.desc}
        </p>

        {/* Linear Progress Bar for Visual Quick Read */}
        <div className="space-y-1 pt-1">
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-500"
              style={{ width: `${Math.max(progressPercent === 0 ? 0 : 3, progressPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Meta Details & CTA */}
      <div className="relative z-10 pt-4 mt-3 border-t border-white/10 flex items-center justify-between gap-2">
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

        <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600/80 to-purple-600/80 hover:from-indigo-600 hover:to-purple-600 border border-indigo-400/40 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-lg group-hover:scale-105">
          <span>{doneTopics > 0 ? "متابعة" : "استكشف الكورس"}</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
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
  const [detailTab, setDetailTab] = useState<"curriculum" | "benefit" | "strategy" | "guide">("curriculum");

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
            <div className="shrink-0 w-full lg:w-80 space-y-3 bg-black/50 border border-white/15 p-6 rounded-3xl backdrop-blur-xl shadow-2xl">
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
      </div>

      {/* TAB 1: CURRICULUM MODULES (FULL WIDTH) */}
      {detailTab === "curriculum" && (
        <div className="space-y-6">
          {/* Filter & Controls Header */}
          <div className="bg-[#0d1424] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={topicSearchQuery}
                onChange={(e) => setTopicSearchQuery(e.target.value)}
                placeholder="ابحث في عناوين وشروحات هذا الكورس..."
                className="w-full pr-11 pl-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
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

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xs text-slate-300 font-extrabold">
                إجمالي الوحدات: <span className="text-cyan-300">{course.modules.length}</span>
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
          </div>

          {/* Modules List */}
          <div className="space-y-4">
            {course.modules.map((mod, modIdx) => {
              const filteredTopics = mod.topics.filter(
                (t) =>
                  t.title.toLowerCase().includes(topicSearchQuery.toLowerCase()) ||
                  t.sub.toLowerCase().includes(topicSearchQuery.toLowerCase()) ||
                  t.content.toLowerCase().includes(topicSearchQuery.toLowerCase())
              );

              if (topicSearchQuery && filteredTopics.length === 0) {
                return null;
              }

              const modDone = mod.topics.filter((t) => completedTopics.includes(t.id)).length;
              const isExpanded = expandedModules.includes(mod.id) || Boolean(topicSearchQuery);

              return (
                <div
                  key={mod.id}
                  className="bg-[#0d1424] border border-white/10 rounded-2xl overflow-hidden shadow-xl transition-all"
                >
                  {/* Module Header Bar */}
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

                  {/* Module Topics List */}
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
  const [fontSize, setFontSize] = useState<number>(16);
  const [activeTab, setActiveTab] = useState<"reader" | "quiz" | "notes">("reader");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [noteText, setNoteText] = useState<string>(userNote);
  const [copiedFormula, setCopiedFormula] = useState<boolean>(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Sync userNote
  useEffect(() => {
    setNoteText(userNote);
  }, [userNote, topic.id]);

  const allCourseTopics = course.modules.flatMap((m) => m.topics);
  const currentTopicIdx = allCourseTopics.findIndex((t) => t.id === topic.id);

  const paragraphs = topic.content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Audio Speech Synthesis Narrator
  const toggleAudioNarrator = () => {
    if (isPlayingAudio) {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
    } else {
      if ("speechSynthesis" in window) {
        const textToRead = `${topic.title}. ${paragraphs.join(" ")}`;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = "ar-SA";
        utterance.rate = 0.95;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      } else {
        alert("خاصية القراءة الصوتية غير مدعومة في متصفحك بشكل مباشر.");
      }
    }
  };

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [topic.id]);

  // Theme Styling Objects
  const themeStyles = {
    night: {
      bg: "bg-[#0b1329]",
      cardBg: "bg-[#0f172a]",
      text: "text-slate-100",
      subtext: "text-slate-300",
      border: "border-indigo-800/40",
      accent: "text-cyan-400",
      paragraphBg: "bg-[#18223c]/60 border-indigo-900/40"
    },
    cream: {
      bg: "bg-[#f4efe4]",
      cardBg: "bg-[#fbf7ee]",
      text: "text-[#2c2416]",
      subtext: "text-[#5a4e38]",
      border: "border-[#e2d7c3]",
      accent: "text-[#9a6700]",
      paragraphBg: "bg-[#f2ebdc] border-[#e0d5be]"
    },
    sepia: {
      bg: "bg-[#e8decb]",
      cardBg: "bg-[#efe6d5]",
      text: "text-[#3d2b1f]",
      subtext: "text-[#6b503e]",
      border: "border-[#d8c8b0]",
      accent: "text-[#a0522d]",
      paragraphBg: "bg-[#e5d8c3] border-[#d4c3a9]"
    },
    modern: {
      bg: "bg-slate-100",
      cardBg: "bg-white",
      text: "text-slate-900",
      subtext: "text-slate-600",
      border: "border-slate-200",
      accent: "text-indigo-600",
      paragraphBg: "bg-slate-50 border-slate-200"
    }
  }[paperTheme];

  return (
    <section className={`min-h-screen py-4 sm:py-6 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto space-y-4 animate-fadeIn pb-28 ${themeStyles.bg}`}>
      {/* TOP HEADER TOOLBAR */}
      <header className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4 text-white flex items-center justify-between gap-3 sticky top-2 z-30 shadow-2xl">
        {/* Right: Back & Chapter outline trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors cursor-pointer"
            title="العودة للكورس"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all ${
              isSidebarOpen
                ? "bg-indigo-600 border-indigo-400 text-white"
                : "bg-white/10 border-white/15 text-slate-200 hover:bg-white/20"
            }`}
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">فهرس المنهج</span>
          </button>
        </div>

        {/* Center Title */}
        <div className="min-w-0 text-center flex-1 px-2">
          <h2 className="text-xs sm:text-sm font-black text-white truncate">{topic.title}</h2>
          <span className="text-[10px] text-cyan-300 font-bold truncate block">
            {module.title} ({currentTopicIdx + 1} من {allCourseTopics.length})
          </span>
        </div>

        {/* Left: Customizer & Actions */}
        <div className="flex items-center gap-2">
          {/* Audio Reader */}
          <button
            onClick={toggleAudioNarrator}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isPlayingAudio
                ? "bg-cyan-500 text-black border-cyan-300 animate-pulse"
                : "bg-white/10 border-white/15 text-slate-200 hover:bg-white/20"
            }`}
            title="القراءة الصوتية التفاعلية"
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Bookmark */}
          <button
            onClick={onToggleBookmark}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isBookmarked
                ? "bg-amber-500 text-black border-amber-400 shadow-md"
                : "bg-white/10 border-white/15 text-slate-200 hover:bg-white/20"
            }`}
            title={isBookmarked ? "محفوظ في العلامات" : "حفظ الدرس"}
          >
            <Bookmark className="w-4 h-4" />
          </button>

          {/* Paper Theme Buttons */}
          <div className="hidden md:flex items-center gap-1 bg-black/40 border border-white/15 p-1 rounded-xl">
            <button
              onClick={() => setPaperTheme("night")}
              className={`w-5 h-5 rounded-full bg-[#0f172a] border ${paperTheme === "night" ? "border-cyan-400 scale-110" : "border-slate-600 opacity-60"}`}
              title="ليلي"
            />
            <button
              onClick={() => setPaperTheme("cream")}
              className={`w-5 h-5 rounded-full bg-[#fbf7ee] border ${paperTheme === "cream" ? "border-amber-500 scale-110" : "border-amber-300 opacity-60"}`}
              title="ورقي"
            />
            <button
              onClick={() => setPaperTheme("sepia")}
              className={`w-5 h-5 rounded-full bg-[#efe6d5] border ${paperTheme === "sepia" ? "border-amber-700 scale-110" : "border-amber-800 opacity-60"}`}
              title="سيبيا"
            />
            <button
              onClick={() => setPaperTheme("modern")}
              className={`w-5 h-5 rounded-full bg-white border ${paperTheme === "modern" ? "border-indigo-600 scale-110" : "border-slate-400 opacity-60"}`}
              title="ناصع"
            />
          </div>

          {/* Font Controls */}
          <div className="hidden sm:flex items-center gap-1 bg-black/40 border border-white/15 px-2 py-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setFontSize((f) => Math.max(13, f - 1))}
              className="px-1 hover:text-cyan-300 cursor-pointer"
            >
              A-
            </button>
            <span className="text-[11px] text-cyan-300">{fontSize}</span>
            <button
              onClick={() => setFontSize((f) => Math.min(22, f + 1))}
              className="px-1 hover:text-cyan-300 cursor-pointer"
            >
              A+
            </button>
          </div>
        </div>
      </header>

      {/* LESSON PROGRESS STEPPER BAR */}
      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300"
          style={{ width: `${((currentTopicIdx + 1) / allCourseTopics.length) * 100}%` }}
        />
      </div>

      {/* MAIN CANVAS BODY WITH OPTIONAL SIDEBAR DRAWER */}
      <div className="relative flex gap-6 items-start">
        {/* SIDEBAR NAVIGATION DRAWER */}
        {isSidebarOpen && (
          <aside className="w-80 shrink-0 bg-[#0d1424] border border-indigo-800/40 rounded-3xl p-4 space-y-4 shadow-2xl z-20 animate-slideLeft">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-black text-white flex items-center gap-2">
                <List className="w-4 h-4 text-cyan-400" />
                <span>فهرس الدروس ({allCourseTopics.length})</span>
              </span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 scrollbar-none">
              {course.modules.map((m, mIdx) => (
                <div key={m.id} className="space-y-1.5">
                  <div className="text-[11px] font-black text-cyan-300 px-1">
                    الوحدة {mIdx + 1}: {m.title}
                  </div>

                  <div className="space-y-1">
                    {m.topics.map((t) => {
                      const isActive = t.id === topic.id;
                      const isTopicDone = completedTopics.includes(t.id);

                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            onSelectTopic(m, t);
                            setIsSidebarOpen(false);
                          }}
                          className={`w-full text-right p-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-between gap-2 cursor-pointer ${
                            isActive
                              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                              : "bg-white/5 hover:bg-white/10 text-slate-300"
                          }`}
                        >
                          <span className="truncate">{t.title}</span>
                          {isTopicDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* CONTENT READER PANEL */}
        <div className={`flex-1 rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all ${themeStyles.cardBg} ${themeStyles.border}`}>
          {/* Tabs Selector Header */}
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-current opacity-20">
            <button
              onClick={() => setActiveTab("reader")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "reader"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "hover:bg-black/10"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>الشرح العلمي</span>
            </button>

            {topic.quiz.length > 0 && (
              <button
                onClick={() => setActiveTab("quiz")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "quiz"
                    ? "bg-amber-500 text-black shadow-md"
                    : "hover:bg-black/10"
                }`}
              >
                <BrainCircuit className="w-4 h-4" />
                <span>اختبر فهمك ({topic.quiz.length})</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab("notes")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "notes"
                  ? "bg-cyan-600 text-white shadow-md"
                  : "hover:bg-black/10"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>ملاحظاتي الخاصة</span>
            </button>
          </div>

          {/* TAB 1: READING CONTENT */}
          {activeTab === "reader" && (
            <div className="space-y-6">
              {/* Topic Subtitle Badge */}
              <div className="space-y-2">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider ${themeStyles.paragraphBg} ${themeStyles.accent}`}>
                  {module.title}
                </span>

                <h1 className={`text-xl sm:text-2xl font-black ${themeStyles.text} leading-snug`}>
                  {topic.title}
                </h1>
                <p className={`text-xs ${themeStyles.subtext} font-medium`}>{topic.sub}</p>
              </div>

              {/* FORMULA CALLOUT CARD */}
              {topic.formula && (
                <div className={`p-5 rounded-2xl border ${themeStyles.border} bg-indigo-950/40 space-y-2 relative group`}>
                  <div className="flex items-center justify-between text-xs font-black text-indigo-300">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>المعادلة المحاسبية الأساسية للدرس:</span>
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(topic.formula || "");
                        setCopiedFormula(true);
                        setTimeout(() => setCopiedFormula(false), 2000);
                      }}
                      className="text-[11px] font-extrabold text-cyan-300 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedFormula ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedFormula ? "تم النسخ" : "نسخ المعادلة"}</span>
                    </button>
                  </div>

                  <div className="text-base sm:text-lg font-black text-cyan-200 dir-rtl pt-1">
                    {topic.formula}
                  </div>
                </div>
              )}

              {/* PARAGRAPHS TEXT */}
              <div className="space-y-4">
                {paragraphs.map((p, pIdx) => (
                  <div
                    key={pIdx}
                    className={`p-4 sm:p-5 rounded-2xl border ${themeStyles.paragraphBg} leading-relaxed transition-all`}
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    <p className={`font-normal ${themeStyles.text}`}>{p}</p>
                  </div>
                ))}
              </div>

              {/* KEY TAKEAWAYS BULLET LIST */}
              {topic.keyPoints.length > 0 && (
                <div className={`p-5 rounded-2xl border ${themeStyles.border} space-y-3 bg-black/10`}>
                  <h3 className={`text-xs font-black ${themeStyles.accent} flex items-center gap-2`}>
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span>النقاط الجوهرية للدرس:</span>
                  </h3>

                  <div className="space-y-2">
                    {topic.keyPoints.map((pt, ptIdx) => (
                      <div
                        key={ptIdx}
                        className={`p-3 rounded-xl border text-xs font-bold flex items-start gap-2.5 ${themeStyles.paragraphBg} ${themeStyles.text}`}
                      >
                        <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: QUIZ PRACTICE */}
          {activeTab === "quiz" && topic.quiz.length > 0 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className={`text-base font-black ${themeStyles.text} flex items-center gap-2`}>
                  <BrainCircuit className="w-5 h-5 text-amber-400" />
                  <span>اختبار التقييم السريع للفصل</span>
                </h3>
                <p className={`text-xs ${themeStyles.subtext}`}>
                  اختبر مدى استيعابك وتطبيقك للقيود والمفاهيم المشروحة بهذا الدرس.
                </p>
              </div>

              <div className="space-y-5">
                {topic.quiz.map((q, qIdx) => {
                  const chosen = quizAnswers[qIdx];
                  const answered = chosen !== undefined;

                  return (
                    <div
                      key={qIdx}
                      className={`p-5 rounded-2xl border space-y-4 ${themeStyles.paragraphBg} ${themeStyles.border}`}
                    >
                      <div className="text-[11px] font-black text-cyan-300">السؤال {qIdx + 1}</div>
                      <h4 className={`text-xs sm:text-sm font-bold ${themeStyles.text} leading-relaxed`}>{q.q}</h4>

                      <div className="space-y-2">
                        {q.opts.map((opt, optIdx) => {
                          const isCorrect = optIdx === q.ans;
                          const isChosen = optIdx === chosen;

                          let style = "bg-white/5 border-white/10 text-slate-200 hover:border-white/20";
                          if (answered) {
                            if (isCorrect) {
                              style = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-black";
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
                              className={`w-full text-right p-3 rounded-xl border text-xs leading-relaxed transition-all cursor-pointer flex items-center justify-between gap-2 ${style}`}
                            >
                              <span>{opt}</span>
                              {answered && isCorrect && <span className="text-emerald-400 font-bold">✓ صحيح</span>}
                              {answered && isChosen && !isCorrect && <span className="text-red-400 font-bold">✗ خطأ</span>}
                            </button>
                          );
                        })}
                      </div>

                      {answered && (
                        <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 space-y-1">
                          <span className="font-extrabold text-cyan-300">💡 الشرح التوضيحي:</span>
                          <p className="font-normal">{q.exp}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: USER NOTES */}
          {activeTab === "notes" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className={`text-base font-black ${themeStyles.text} flex items-center gap-2`}>
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                  <span>ملاحظاتك وسجلاتك الدراسية للدرس</span>
                </h3>
                <p className={`text-xs ${themeStyles.subtext}`}>
                  اكتب أي استفسارات أو تلخيصات خاصة بهذا الموضوع لحفظها والرجوع إليها لاحقاً.
                </p>
              </div>

              <textarea
                rows={6}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="أضف هنا أي ملحوظة أو قيد محاسبي تود تذكره..."
                className={`w-full p-4 rounded-2xl border ${themeStyles.border} bg-black/20 text-xs ${themeStyles.text} focus:outline-none focus:border-cyan-400 leading-relaxed`}
              />

              <div className="flex justify-end">
                <button
                  onClick={() => onSaveNote(noteText)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition-colors cursor-pointer shadow-lg"
                >
                  حفظ الملاحظات
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM STICKY ACTION NAV BAR */}
      <div className="fixed bottom-3 right-3 left-3 max-w-4xl mx-auto z-40">
        <div className="bg-black/80 backdrop-blur-xl border border-white/15 p-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3 text-white">
          <button
            onClick={onPrev}
            disabled={currentTopicIdx === 0}
            className={`px-4 py-2.5 rounded-xl border border-white/15 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentTopicIdx === 0
                ? "opacity-30 cursor-not-allowed bg-white/5 text-slate-500"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            <ChevronRight className="w-4 h-4" />
            <span className="hidden sm:inline">الدرس السابق</span>
          </button>

          <button
            onClick={() => {
              onDone();
              onNext();
            }}
            className="flex-1 max-w-md py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-indigo-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] text-white font-black text-xs sm:text-sm shadow-xl shadow-indigo-600/30 border border-emerald-400/30 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4 text-emerald-300" />
            <span>{isDone ? "الانتقال للدرس التالي ←" : "إكتمال الدرس والانتقال ←"}</span>
          </button>

          <button
            onClick={onNext}
            disabled={currentTopicIdx === allCourseTopics.length - 1}
            className={`px-4 py-2.5 rounded-xl border border-white/15 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentTopicIdx === allCourseTopics.length - 1
                ? "opacity-30 cursor-not-allowed bg-white/5 text-slate-500"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            <span className="hidden sm:inline">الدرس التالي</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
