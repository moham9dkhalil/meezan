import React, { useState, useEffect, useRef } from "react";
import { Book } from "../types";
import {
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Search,
  Sparkles,
  Maximize2,
  Minimize2,
  Type,
  List,
  Lightbulb,
  FileText,
  MessageSquare
} from "lucide-react";

interface BookReaderModalProps {
  book: Book | null;
  onClose: () => void;
}

type PaperTheme = "cream" | "night" | "sepia" | "modern";

// Web Audio API Synthesized Paper Flip Sound Effect
const playPaperFlipSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const bufferSize = audioCtx.sampleRate * 0.18; // 180ms
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Exponential decaying white noise simulating crisp paper rustle
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.22));
    }
    
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1100;
    filter.Q.value = 1.2;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start();
  } catch (e) {
    // Silently ignore if browser restricts audio autoplay
  }
};

export function BookReaderModal({ book, onClose }: BookReaderModalProps) {
  if (!book) return null;

  // Reader States
  const [currentChapterIdx, setCurrentChapterIdx] = useState<number>(0);
  const [paperTheme, setPaperTheme] = useState<PaperTheme>("night");
  const [fontSize, setFontSize] = useState<number>(16);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isTocOpen, setIsTocOpen] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioSpeed, setAudioSpeed] = useState<string>("1x");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [highlightedSections, setHighlightedSections] = useState<string[]>([]);
  const [userNote, setUserNote] = useState<string>("");
  const [savedNotes, setSavedNotes] = useState<Record<number, string>>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // 3D Page Flipping Animation State
  const [flipDirection, setFlipDirection] = useState<"next" | "prev" | null>(null);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);

  // Current Chapter & Next/Prev chapters
  const chapter = book.chapters[currentChapterIdx] || book.chapters[0];
  const totalChapters = book.chapters.length;

  // Keyboard Navigation & Fullscreen
  useEffect(() => {
    try {
      if (isFullscreen) {
        if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } else {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    } catch (err) {
      console.warn("Fullscreen request not available in this frame context:", err);
    }

    const handleFullscreenChange = () => {
      try {
        if (!document.fullscreenElement && isFullscreen && document.fullscreenEnabled) {
          // Only sync if native fullscreen was active
        }
      } catch (err) {
        console.error(err);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToNextChapter();
      } else if (e.key === "ArrowRight") {
        goToPrevChapter();
      } else if (e.key === "Escape" && !isFullscreen) {
        onClose();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentChapterIdx, totalChapters, isFullscreen, isFlipping]);

  const goToNextChapter = () => {
    if (currentChapterIdx < totalChapters - 1 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection("next");
      playPaperFlipSound();

      setTimeout(() => {
        setCurrentChapterIdx((prev) => prev + 1);
      }, 300);

      setTimeout(() => {
        setIsFlipping(false);
        setFlipDirection(null);
      }, 600);
    }
  };

  const goToPrevChapter = () => {
    if (currentChapterIdx > 0 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection("prev");
      playPaperFlipSound();

      setTimeout(() => {
        setCurrentChapterIdx((prev) => prev - 1);
      }, 300);

      setTimeout(() => {
        setIsFlipping(false);
        setFlipDirection(null);
      }, 600);
    }
  };

  const toggleChapterComplete = (idx: number) => {
    setCompletedChapters((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const toggleHighlight = (id: string) => {
    setHighlightedSections((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSaveNote = () => {
    if (!userNote.trim()) return;
    setSavedNotes((prev) => ({
      ...prev,
      [currentChapterIdx]: userNote
    }));
  };

  // Theme Styling Objects
  const themeStyles = {
    night: {
      bg: "bg-[#0b1329]",
      pageBg: "bg-[#0f172a]",
      text: "text-slate-100",
      subtext: "text-slate-300",
      border: "border-indigo-800/40",
      accent: "text-cyan-400",
      gutter: "from-black/70 via-indigo-950/30 to-black/70",
      cardBg: "bg-[#1e293b]/80",
      highlight: "bg-cyan-500/20 text-cyan-200 border-cyan-400/40",
      leafBg: "#0f172a",
      leafText: "#f1f5f9"
    },
    cream: {
      bg: "bg-[#f4efe4]",
      pageBg: "bg-[#fbf7ee]",
      text: "text-[#2c2416]",
      subtext: "text-[#5a4e38]",
      border: "border-[#e2d7c3]",
      accent: "text-[#9a6700]",
      gutter: "from-amber-900/15 via-[#e0d6c3] to-amber-900/15",
      cardBg: "bg-[#f2ebdc]",
      highlight: "bg-amber-200/80 text-[#3b2a08] border-amber-400",
      leafBg: "#fbf7ee",
      leafText: "#2c2416"
    },
    sepia: {
      bg: "bg-[#e8decb]",
      pageBg: "bg-[#efe6d5]",
      text: "text-[#3d2b1f]",
      subtext: "text-[#6b503e]",
      border: "border-[#d8c8b0]",
      accent: "text-[#a0522d]",
      gutter: "from-amber-950/20 via-[#d8c8b0] to-amber-950/20",
      cardBg: "bg-[#e5d8c3]",
      highlight: "bg-amber-300/60 text-[#3d2b1f] border-amber-600/50",
      leafBg: "#efe6d5",
      leafText: "#3d2b1f"
    },
    modern: {
      bg: "bg-slate-100",
      pageBg: "bg-white",
      text: "text-slate-900",
      subtext: "text-slate-600",
      border: "border-slate-200",
      accent: "text-indigo-600",
      gutter: "from-slate-300/50 via-slate-100 to-slate-300/50",
      cardBg: "bg-slate-50",
      highlight: "bg-indigo-100 text-indigo-900 border-indigo-300",
      leafBg: "#ffffff",
      leafText: "#0f172a"
    }
  }[paperTheme];

  const filteredChapters = book.chapters.filter((chap) =>
    chap.t.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`fixed inset-0 z-[99999] transition-all duration-300 flex flex-col ${
        isFullscreen ? "p-0 bg-black w-screen h-screen m-0" : "p-2 sm:p-4 bg-black/85 backdrop-blur-md"
      }`}
    >
      <div
        className={`relative w-full h-full ${
          isFullscreen ? "max-w-full rounded-none border-0" : "max-w-7xl mx-auto rounded-3xl border"
        } flex flex-col overflow-hidden shadow-2xl ${themeStyles.border} ${themeStyles.bg}`}
      >
        {/* TOP TOOLBAR & CONTROLS */}
        <header className="px-4 py-3 bg-black/40 backdrop-blur-xl border-b border-white/10 flex items-center justify-between gap-3 text-white z-20 shrink-0">
          {/* Right: Book Title & Chapter Progress */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsTocOpen(!isTocOpen)}
              className={`p-2 rounded-xl border border-white/15 hover:bg-white/10 transition-colors flex items-center gap-2 text-xs font-extrabold cursor-pointer ${
                isTocOpen ? "bg-indigo-600 border-indigo-400 text-white" : "text-slate-200"
              }`}
              title="فهرس الفصول"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">الفهرس</span>
            </button>

            <div className="hidden md:block h-6 w-px bg-white/15" />

            <div className="flex items-center gap-2">
              <span className="text-xl">{book.icon}</span>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-white line-clamp-1">
                  {book.title}
                </h3>
                <span className="text-[10px] text-cyan-300 font-bold">
                  الفصل {currentChapterIdx + 1} من {totalChapters}: {chapter.t}
                </span>
              </div>
            </div>
          </div>

          {/* Center: Interactive Reading Customizer Tools */}
          <div className="flex items-center gap-2 sm:gap-3 bg-white/5 border border-white/10 px-3 py-1.5 rounded-2xl backdrop-blur-md">
            {/* Paper Theme Selectors */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPaperTheme("night")}
                title="الوضع الليلي"
                className={`w-6 h-6 rounded-full bg-[#0f172a] border transition-transform cursor-pointer ${
                  paperTheme === "night" ? "scale-125 border-cyan-400 shadow-md shadow-cyan-500/50" : "border-slate-600 opacity-70"
                }`}
              />
              <button
                onClick={() => setPaperTheme("cream")}
                title="ورق كلاسيكي دافئ"
                className={`w-6 h-6 rounded-full bg-[#fbf7ee] border transition-transform cursor-pointer ${
                  paperTheme === "cream" ? "scale-125 border-amber-500 shadow-md shadow-amber-500/50" : "border-amber-300 opacity-70"
                }`}
              />
              <button
                onClick={() => setPaperTheme("sepia")}
                title="نمط السيبيا"
                className={`w-6 h-6 rounded-full bg-[#efe6d5] border transition-transform cursor-pointer ${
                  paperTheme === "sepia" ? "scale-125 border-amber-700 shadow-md" : "border-amber-800/40 opacity-70"
                }`}
              />
              <button
                onClick={() => setPaperTheme("modern")}
                title="نمط حديث ناصع"
                className={`w-6 h-6 rounded-full bg-white border transition-transform cursor-pointer ${
                  paperTheme === "modern" ? "scale-125 border-indigo-600 shadow-md" : "border-slate-400 opacity-70"
                }`}
              />
            </div>

            <div className="h-4 w-px bg-white/20" />

            {/* Font Size Adjusters */}
            <div className="flex items-center gap-1 text-xs font-bold">
              <Type className="w-3.5 h-3.5 text-slate-400" />
              <button
                onClick={() => setFontSize((f) => Math.max(13, f - 1))}
                className="px-1.5 py-0.5 rounded hover:bg-white/15 cursor-pointer"
                title="تصغير الخط"
              >
                A-
              </button>
              <span className="text-[11px] text-cyan-300 w-5 text-center">{fontSize}</span>
              <button
                onClick={() => setFontSize((f) => Math.min(24, f + 1))}
                className="px-1.5 py-0.5 rounded hover:bg-white/15 cursor-pointer"
                title="تكبير الخط"
              >
                A+
              </button>
            </div>

            <div className="h-4 w-px bg-white/20 hidden sm:block" />

            {/* Audio Narrator Button */}
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isPlayingAudio
                  ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/30 animate-pulse"
                  : "bg-white/10 hover:bg-white/20 text-slate-200"
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">إيقاف</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">قارئ AI</span>
                </>
              )}
            </button>
          </div>

          {/* Left: Window Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isBookmarked
                  ? "bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/30"
                  : "border-white/15 hover:bg-white/10 text-slate-200"
              }`}
              title={isBookmarked ? "محفوظ في العلامات" : "حفظ المرجع"}
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl border border-white/15 hover:bg-white/10 text-slate-200 transition-colors cursor-pointer"
              title={isFullscreen ? "إنهاء ملء الشاشة" : "عرض ملء الشاشة"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 text-red-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* AUDIO PLAYER ACTIVE BAR */}
        {isPlayingAudio && (
          <div className="bg-gradient-to-r from-cyan-950 via-indigo-950 to-purple-950 border-b border-cyan-500/30 px-6 py-2.5 text-xs text-cyan-200 flex items-center justify-between gap-4 z-20 shrink-0">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-extrabold text-white">القارئ التفاعلي الذكي:</span>
              <span className="text-cyan-300 line-clamp-1">يتلو الفصول مع الإيضاح التطبيقي تلقائياً</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-slate-300">السرعة:</span>
              {["1x", "1.25x", "1.5x"].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setAudioSpeed(speed)}
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold cursor-pointer ${
                    audioSpeed === speed
                      ? "bg-cyan-400 text-black"
                      : "bg-black/40 text-slate-300 hover:bg-black/60"
                  }`}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MAIN OPEN BOOK CANVAS */}
        <div className="relative flex-1 flex overflow-hidden">
          {/* SIDE TABLE OF CONTENTS DRAWER */}
          {isTocOpen && (
            <div className="absolute top-0 right-0 bottom-0 w-80 z-30 bg-[#090d1a] border-l border-indigo-800/40 p-4 shadow-2xl flex flex-col space-y-4 animate-slideLeft">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-800/40">
                <div className="flex items-center gap-2 text-white font-extrabold text-sm">
                  <List className="w-4 h-4 text-cyan-400" />
                  <span>فهرس المرجع العلمي</span>
                </div>
                <button
                  onClick={() => setIsTocOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chapter Search Box */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالفهرس..."
                  className="w-full pr-8 pl-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Chapters List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-none">
                {filteredChapters.map((chap, idx) => {
                  const isActive = currentChapterIdx === idx;
                  const isDone = completedChapters.includes(idx);

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (idx !== currentChapterIdx && !isFlipping) {
                          setFlipDirection(idx > currentChapterIdx ? "next" : "prev");
                          setIsFlipping(true);
                          playPaperFlipSound();
                          setTimeout(() => setCurrentChapterIdx(idx), 300);
                          setTimeout(() => {
                            setIsFlipping(false);
                            setFlipDirection(null);
                          }, 600);
                        }
                        setIsTocOpen(false);
                      }}
                      className={`w-full p-3 rounded-xl border text-right transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white border-indigo-400 shadow-lg"
                          : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-extrabold ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-indigo-950 text-cyan-400 border border-indigo-800"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="text-xs font-extrabold line-clamp-1">{chap.t}</span>
                      </div>

                      {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* REALISTIC 2-PAGE OPEN HARDCOVER SPREAD WITH 3D FLIP */}
          <div
            className="flex-1 p-3 sm:p-6 lg:p-8 flex items-center justify-center overflow-y-auto relative"
            style={{ perspective: "1600px" }}
          >
            {/* BOOK CONTAINER */}
            <div
              className={`relative w-full max-w-5xl rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.8)] border ${themeStyles.border} ${themeStyles.pageBg} transition-all duration-300 grid grid-cols-1 lg:grid-cols-2 overflow-hidden select-none`}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* BOOK MIDDLE SPINE GUTTER SHADOW */}
              <div
                className={`hidden lg:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-16 bg-gradient-to-r ${themeStyles.gutter} pointer-events-none z-20 shadow-inner`}
              />

              {/* DYNAMIC 3D PAGE LEAF FLIP OVERLAY */}
              {isFlipping && flipDirection && (
                <div
                  className="hidden lg:block absolute inset-y-0 z-30 pointer-events-none transition-transform duration-500 ease-in-out"
                  style={{
                    left: flipDirection === "next" ? "0%" : "50%",
                    width: "50%",
                    transformOrigin: flipDirection === "next" ? "right center" : "left center",
                    transformStyle: "preserve-3d",
                    animation:
                      flipDirection === "next"
                        ? "flipPageNext 0.6s cubic-bezier(0.645, 0.045, 0.355, 1) forwards"
                        : "flipPagePrev 0.6s cubic-bezier(0.645, 0.045, 0.355, 1) forwards"
                  }}
                >
                  {/* Front Side of Flipping Leaf */}
                  <div
                    className={`absolute inset-0 p-8 ${themeStyles.pageBg} border-2 ${themeStyles.border} rounded-xl shadow-2xl flex flex-col justify-between overflow-hidden`}
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="space-y-4 opacity-80">
                      <div className="text-xs font-bold opacity-50">جاري التقليب...</div>
                      <h3 className={`text-lg font-black ${themeStyles.text}`}>{chapter.t}</h3>
                      <p className={`text-xs ${themeStyles.subtext}`}>{chapter.sections[0]}</p>
                    </div>
                    {/* Page Curl Curved Gradient Highlight */}
                    <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-black/30 via-white/10 to-transparent pointer-events-none" />
                  </div>

                  {/* Back Side of Flipping Leaf */}
                  <div
                    className={`absolute inset-0 p-8 ${themeStyles.pageBg} border-2 ${themeStyles.border} rounded-xl shadow-2xl flex flex-col justify-between overflow-hidden`}
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)"
                    }}
                  >
                    <div className="space-y-4 opacity-80">
                      <div className="text-xs font-bold opacity-50">الصفحة الجديدة</div>
                      <h3 className={`text-lg font-black ${themeStyles.text}`}>{book.title}</h3>
                    </div>
                    {/* Back Shadow */}
                    <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-black/30 via-white/10 to-transparent pointer-events-none" />
                  </div>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* RIGHT PAGE (الصفحة اليمنى: التأصيل العلمي والنظري) */}
              {/* ───────────────────────────────────────────────────────────── */}
              <div className={`p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-l ${themeStyles.border} flex flex-col justify-between space-y-6 relative group overflow-y-auto max-h-[75vh]`}>
                {/* Page Header */}
                <div className="flex items-center justify-between pb-3 border-b border-current opacity-25 text-xs font-bold shrink-0">
                  <span>المجلد التخصصي | {book.callNumber || "SOCPA"}</span>
                  <span>الصفحة {currentChapterIdx * 2 + 1}</span>
                </div>

                {/* Chapter Title & Theoretical Badges */}
                <div className="space-y-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider ${themeStyles.cardBg} ${themeStyles.accent}`}>
                      الفصل الدراسي {currentChapterIdx + 1}
                    </span>
                    <button
                      onClick={() => toggleChapterComplete(currentChapterIdx)}
                      className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-md flex items-center gap-1 cursor-pointer transition-colors ${
                        completedChapters.includes(currentChapterIdx)
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-white/10 hover:bg-white/20 opacity-70"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{completedChapters.includes(currentChapterIdx) ? "مكتمل" : "تحديد كمكتمل"}</span>
                    </button>
                  </div>

                  <h2
                    className={`font-black ${themeStyles.text} leading-snug`}
                    style={{ fontSize: `${fontSize + 6}px` }}
                  >
                    {chapter.t}
                  </h2>

                  <p className={`text-xs ${themeStyles.subtext} leading-relaxed`}>
                    هذا الفصل يقدم التأصيل العلمي والمعالجات الدقيقة المعتمدة لدى الهيئات المحاسبية الدولية والمحلية.
                  </p>
                </div>

                {/* Chapter Key Principles / Sections */}
                <div className="space-y-4 flex-1">
                  <h4 className={`text-xs font-extrabold ${themeStyles.accent} flex items-center gap-2 sticky top-0 py-1 z-10 ${themeStyles.pageBg}`}>
                    <Lightbulb className="w-4 h-4" />
                    <span>المبادئ والأحكام الرئيسية للفصل:</span>
                  </h4>

                  <div className="space-y-3">
                    {chapter.sections.slice(0, Math.max(1, Math.ceil(chapter.sections.length / 2))).map((sec, idx) => {
                      const secId = `${currentChapterIdx}-${idx}`;
                      const isHigh = highlightedSections.includes(secId);

                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-2xl border transition-all relative group/item ${
                            isHigh ? themeStyles.highlight : `${themeStyles.cardBg} ${themeStyles.border}`
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p
                              className={`leading-relaxed font-medium ${themeStyles.text} whitespace-pre-line`}
                              style={{ fontSize: `${fontSize}px` }}
                            >
                              {sec}
                            </p>

                            <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover/item:opacity-100">
                              <button
                                onClick={() => toggleHighlight(secId)}
                                className="p-1 rounded hover:bg-black/10 cursor-pointer"
                                title="تظليل النص"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleCopyText(sec, secId)}
                                className="p-1 rounded hover:bg-black/10 cursor-pointer"
                                title="نسخ"
                              >
                                {copiedSection === secId ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Left Page Footer Ribbon */}
                <div className="pt-3 border-t border-current opacity-20 flex items-center justify-between text-[11px] font-extrabold shrink-0">
                  <span>حقوق المرجع محفوظة لمنصة ميزان</span>
                  <span>القسم النظري المعياري</span>
                </div>
              </div>

              {/* ───────────────────────────────────────────────────────────── */}
              {/* LEFT PAGE (الصفحة اليسرى: التطبيقات العملية والأمثلة والقيود) */}
              {/* ───────────────────────────────────────────────────────────── */}
              <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 relative group overflow-y-auto max-h-[75vh]">
                {/* Page Header */}
                <div className="flex items-center justify-between pb-3 border-b border-current opacity-25 text-xs font-bold shrink-0">
                  <span>تطبيقات وحالات عملية | {book.title}</span>
                  <span>الصفحة {currentChapterIdx * 2 + 2}</span>
                </div>

                {/* Practical Example Box / Journal Entry Case */}
                <div className="space-y-4 flex-1">
                  <div className="flex items-center justify-between sticky top-0 py-1 z-10 ${themeStyles.pageBg}">
                    <h4 className={`text-xs font-extrabold ${themeStyles.accent} flex items-center gap-2`}>
                      <FileText className="w-4 h-4" />
                      <span>التطبيق والتوجيه المحاسبي العملي:</span>
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                      حالة معتمدة SOCPA
                    </span>
                  </div>

                  {chapter.sections.length > Math.max(1, Math.ceil(chapter.sections.length / 2)) ? (
                    <div className="space-y-3">
                      {chapter.sections.slice(Math.max(1, Math.ceil(chapter.sections.length / 2))).map((sec, idx) => {
                        const actualIdx = idx + Math.max(1, Math.ceil(chapter.sections.length / 2));
                        const secId = `${currentChapterIdx}-${actualIdx}`;
                        const isHigh = highlightedSections.includes(secId);

                        return (
                          <div
                            key={actualIdx}
                            className={`p-4 rounded-2xl border transition-all group/item ${
                              isHigh ? themeStyles.highlight : `${themeStyles.cardBg} ${themeStyles.border}`
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <p
                                className={`leading-relaxed font-medium ${themeStyles.text} whitespace-pre-line`}
                                style={{ fontSize: `${fontSize}px` }}
                              >
                                {sec}
                              </p>
                              <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover/item:opacity-100">
                                <button
                                  onClick={() => toggleHighlight(secId)}
                                  className="p-1 rounded hover:bg-black/10 cursor-pointer"
                                  title="تظليل النص"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleCopyText(sec, secId)}
                                  className="p-1 rounded hover:bg-black/10 cursor-pointer"
                                  title="نسخ"
                                >
                                  {copiedSection === secId ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Generic High-Level Practical Illustration Card if section count <= 1 */
                    <div className={`p-5 rounded-2xl border ${themeStyles.border} ${themeStyles.cardBg} space-y-3`}>
                      <div className="flex items-center justify-between text-xs font-black text-cyan-400">
                        <span>مثال تطبيقي ومعالجة دفترية:</span>
                        <span>قيد تسوية متكامل</span>
                      </div>
                      <p className={`text-xs ${themeStyles.subtext} leading-relaxed`}>
                        عند إعداد القوائم المالية وفقاً لهذا الفصل، يتم إجراء التسويات التالية بخصم المصروفات المقابلة وإثبات الالتزامات المستحقة لضمان عدالة العرض المالي.
                      </p>
                      <div className="p-3 rounded-xl bg-black/30 border border-white/10 font-mono text-[11px] space-y-1">
                        <div className="flex justify-between text-emerald-400 font-bold">
                          <span>من حـ/ المصروفات المعنية</span>
                          <span>XX,XXX ريال</span>
                        </div>
                        <div className="flex justify-between text-cyan-300 font-bold pr-4">
                          <span>إلى حـ/ الالتزامات والمستحقات</span>
                          <span>XX,XXX ريال</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Interactive Note Taking Box */}
                  <div className={`p-4 rounded-2xl border ${themeStyles.border} ${themeStyles.cardBg} space-y-2 shrink-0`}>
                    <div className="flex items-center justify-between text-xs font-extrabold">
                      <span className="flex items-center gap-1.5 text-cyan-400">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>ملاحظاتي الخاصة على هذا الفصل:</span>
                      </span>
                      {savedNotes[currentChapterIdx] && (
                        <span className="text-[10px] text-emerald-400">تم الحفظ</span>
                      )}
                    </div>
                    <textarea
                      rows={2}
                      value={userNote}
                      onChange={(e) => setUserNote(e.target.value)}
                      placeholder="أضف ملحوظة دراسية أو استفساراً خاصاً لهذا الفصل..."
                      className={`w-full p-2.5 rounded-xl bg-black/20 border ${themeStyles.border} text-xs ${themeStyles.text} focus:outline-none focus:border-cyan-400`}
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveNote}
                        className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        حفظ الملاحظة
                      </button>
                    </div>
                  </div>
                </div>

                {/* Left Page Footer Ribbon */}
                <div className="pt-3 border-t border-current opacity-20 flex items-center justify-between text-[11px] font-extrabold shrink-0">
                  <span>الجانب التطبيقي والعملي</span>
                  <span>صفحة {currentChapterIdx * 2 + 2}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM PAGINATION FOOTER */}
        <footer className="px-6 py-4 bg-black/40 backdrop-blur-xl border-t border-white/10 flex items-center justify-between gap-4 text-white z-20 shrink-0">
          {/* Previous Page Button */}
          <button
            onClick={goToPrevChapter}
            disabled={currentChapterIdx === 0 || isFlipping}
            className={`px-5 py-2.5 rounded-2xl border border-white/15 font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              currentChapterIdx === 0 || isFlipping
                ? "opacity-30 cursor-not-allowed bg-white/5 text-slate-500"
                : "bg-white/10 hover:bg-white/20 text-white hover:scale-105 active:scale-95"
            }`}
          >
            <ChevronRight className="w-4 h-4" />
            <span>الفصل السابق</span>
          </button>

          {/* Direct Chapter Slider / Page Indicator */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-300 hidden sm:inline">
              تنقل بين الفصول:
            </span>
            <input
              type="range"
              min={0}
              max={totalChapters - 1}
              value={currentChapterIdx}
              onChange={(e) => {
                const newIdx = Number(e.target.value);
                if (newIdx !== currentChapterIdx && !isFlipping) {
                  setFlipDirection(newIdx > currentChapterIdx ? "next" : "prev");
                  setIsFlipping(true);
                  playPaperFlipSound();
                  setTimeout(() => setCurrentChapterIdx(newIdx), 300);
                  setTimeout(() => {
                    setIsFlipping(false);
                    setFlipDirection(null);
                  }, 600);
                }
              }}
              className="w-32 sm:w-48 accent-cyan-400 cursor-pointer"
            />
            <span className="px-3 py-1 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-extrabold text-xs">
              {currentChapterIdx + 1} / {totalChapters}
            </span>
          </div>

          {/* Next Page Button */}
          <button
            onClick={goToNextChapter}
            disabled={currentChapterIdx === totalChapters - 1 || isFlipping}
            className={`px-5 py-2.5 rounded-2xl border font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              currentChapterIdx === totalChapters - 1 || isFlipping
                ? "opacity-30 cursor-not-allowed bg-white/5 border-white/10 text-slate-500"
                : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 border-indigo-400 text-white hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/30"
            }`}
          >
            <span>الفصل التالي 📖</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </footer>
      </div>

      {/* Embedded CSS Keyframes for Real 3D Page Flip Physics */}
      <style>{`
        @keyframes flipPageNext {
          0% {
            transform: rotateY(0deg);
            box-shadow: 0 0 0 rgba(0,0,0,0);
          }
          50% {
            box-shadow: -20px 0 30px rgba(0,0,0,0.5);
          }
          100% {
            transform: rotateY(-180deg);
            box-shadow: 0 0 0 rgba(0,0,0,0);
          }
        }
        @keyframes flipPagePrev {
          0% {
            transform: rotateY(0deg);
            box-shadow: 0 0 0 rgba(0,0,0,0);
          }
          50% {
            box-shadow: 20px 0 30px rgba(0,0,0,0.5);
          }
          100% {
            transform: rotateY(180deg);
            box-shadow: 0 0 0 rgba(0,0,0,0);
          }
        }
      `}</style>
    </div>
  );
}
