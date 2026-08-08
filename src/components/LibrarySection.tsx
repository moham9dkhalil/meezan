import React, { useState } from "react";
import { LIBRARY_BOOKS } from "../data/libraryData";
import { Book } from "../types";
import {
  Library,
  BookOpen,
  Search,
  Layers,
  Compass,
  Bookmark,
  ChevronLeft,
  CheckCircle2,
  Info
} from "lucide-react";

interface LibrarySectionProps {
  onOpenBook: (book: Book) => void;
}

export function LibrarySection({ onOpenBook }: LibrarySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Extract all categories
  const categories = [
    "الكل",
    "محاسبة مالية",
    "تكاليف وإدارة",
    "تدقيق وحوكمة",
    "معايير دولية",
    "مالية واستثمار",
    "تشريعات وزكاة"
  ];

  // Filter books
  const filteredBooks = LIBRARY_BOOKS.filter((book) => {
    const matchesCat =
      selectedCategory === "الكل" || book.category === selectedCategory;
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.sub.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.callNumber &&
        book.callNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-2 sm:px-4 space-y-8 select-none">
      {/* Grand Library Header */}
      <div className="relative rounded-3xl p-6 sm:p-10 border border-indigo-500/30 bg-gradient-to-b from-[#0e162e] via-[#0b1022] to-[#070b18] text-center space-y-4 overflow-hidden shadow-2xl">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-500/15 blur-3xl rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-extrabold shadow-inner">
          <Library className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>المكتبة المحاسبية والمالية ثلاثية الأبعاد (3D Grand Library)</span>
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-100 to-cyan-300 drop-shadow-sm">
          مكتبة ميزان الشاملة للمراجع والموسوعات
        </h2>

        <p className="max-w-3xl mx-auto text-indigo-100/80 text-xs sm:text-sm leading-relaxed font-medium">
          {LIBRARY_BOOKS.length} مجلداً علمياً ومهنياً متكاملاً بصياغة مجسّمة ثلاثية الأبعاد. يتضمن كل كتاب 105 فصول تفصيلية مغطية كامل المنهاج والتطبيقات الميدانية.
        </p>

        {/* Quick Stats Badges */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-indigo-200/90">
          <span className="px-3.5 py-1.5 rounded-xl bg-indigo-950/70 border border-indigo-500/30 flex items-center gap-1.5 backdrop-blur-md">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            {LIBRARY_BOOKS.length} موسوعة علمية كاملة
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-indigo-950/70 border border-indigo-500/30 flex items-center gap-1.5 backdrop-blur-md">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            أكثر من {(LIBRARY_BOOKS.length * 105).toLocaleString()} فصلاً تفصيلياً (105 فصول/كتاب)
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-indigo-950/70 border border-indigo-500/30 flex items-center gap-1.5 backdrop-blur-md">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            معتمدة وفق معايير IFRS & SOCPA
          </span>
        </div>
      </div>

      {/* Control Console (Search & Categories) */}
      <div className="bg-[#0b1022]/90 border border-indigo-900/50 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400/80" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم الكتاب، الفصل، أو الترميز..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-[#060a14] border border-indigo-800/40 text-indigo-100 placeholder-indigo-400/50 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="text-xs text-indigo-300/80 font-bold">
            عرض <span className="text-cyan-400">{filteredBooks.length}</span> مجسماً 3D
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-indigo-900/40">
          <Compass className="w-4 h-4 text-indigo-400 shrink-0 ml-1" />
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-900/50 border border-indigo-400/50"
                    : "bg-[#060a14] text-indigo-200/70 hover:text-white hover:bg-indigo-950/40 border border-indigo-900/40"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3D Hardcover Showcase Grid View */}
      {filteredBooks.length === 0 ? (
        <div className="py-16 text-center space-y-3 text-indigo-300/60 bg-[#0b1022]/60 rounded-3xl border border-indigo-900/40">
          <BookOpen className="w-12 h-12 mx-auto opacity-40 animate-bounce text-cyan-400" />
          <p className="text-sm font-bold">لا توجد مراجع تطابق البحث الحالية</p>
          <button
            onClick={() => {
              setSelectedCategory("الكل");
              setSearchQuery("");
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600/30 text-indigo-200 text-xs font-bold hover:bg-indigo-600/50 transition-colors cursor-pointer border border-indigo-500/40"
          >
            إعادة ضبط الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book, idx) => (
            <Book3DShowcaseCard
              key={idx}
              book={book}
              onOpenBook={onOpenBook}
            />
          ))}
        </div>
      )}

      {/* Footer Info Box */}
      <div className="rounded-2xl p-4 bg-[#0b1022]/80 border border-indigo-900/40 text-indigo-200/80 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            تُحفظ جميع الكتب والمراجع على المنصة تفاعلياً. يمكنك تصفح الفصول، الاختبارات، والأدلة التطبيقية مباشرةً.
          </span>
        </div>
        <div className="text-[11px] font-extrabold text-indigo-300/90 whitespace-nowrap">
          المكتبة الأكاديمية - الاصدار v3.0
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// 3D HARDCOVER SHOWCASE CARD
// ─────────────────────────────────────────────────────────────
interface Book3DShowcaseCardProps {
  key?: React.Key;
  book: Book;
  onOpenBook: (book: Book) => void;
}

function Book3DShowcaseCard({ book, onOpenBook }: Book3DShowcaseCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const spineBg =
    book.spineColor ||
    "linear-gradient(to bottom, #1e1b4b 0%, #312e81 50%, #0f172a 100%)";
  const accentColor = book.accentColor || "#38bdf8";

  return (
    <div
      onClick={() => onOpenBook(book)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-[#0b1022] border border-indigo-900/50 hover:border-indigo-500/70 rounded-3xl p-5 cursor-pointer transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-indigo-900/30 flex flex-col justify-between space-y-4"
    >
      {/* 3D Hardcover Book Graphic Frame */}
      <div
        className="relative h-56 w-full flex items-center justify-center"
        style={{ perspective: "800px" }}
      >
        {/* Ambient Floor Shadow */}
        <div
          className="absolute bottom-2 w-3/4 h-5 bg-black/80 blur-lg rounded-full transition-all duration-300"
          style={{
            transform: isHovered
              ? "scale(1.1) translateY(8px)"
              : "scale(0.9) translateY(0px)"
          }}
        />

        {/* 3D Hardcover Volume */}
        <div
          className="relative w-36 h-48 rounded-r-md rounded-l-xs shadow-2xl transition-all duration-500 p-4 flex flex-col justify-between border-r-2 border-indigo-400/50 overflow-hidden"
          style={{
            background: spineBg,
            transformStyle: "preserve-3d",
            transform: isHovered
              ? "rotateY(-30deg) rotateX(10deg) translateZ(20px)"
              : "rotateY(-15deg) rotateX(5deg) translateZ(0px)"
          }}
        >
          {/* Metallic Leaf Corner Borders */}
          <div className="absolute top-1.5 left-1.5 w-4 h-4 border-t-2 border-l-2 border-indigo-300/60" />
          <div className="absolute top-1.5 right-1.5 w-4 h-4 border-t-2 border-r-2 border-indigo-300/60" />
          <div className="absolute bottom-1.5 left-1.5 w-4 h-4 border-b-2 border-l-2 border-indigo-300/60" />
          <div className="absolute bottom-1.5 right-1.5 w-4 h-4 border-b-2 border-r-2 border-indigo-300/60" />

          {/* Cover Header */}
          <div className="flex items-center justify-between text-indigo-200">
            <span className="text-2xl">{book.icon}</span>
            <span
              className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/50 border border-indigo-400/40"
              style={{ color: accentColor }}
            >
              {book.callNumber || "3D"}
            </span>
          </div>

          {/* Cover Title */}
          <div className="space-y-1 text-center my-auto">
            <h4 className="font-extrabold text-xs text-white leading-snug drop-shadow">
              {book.title}
            </h4>
            <div
              className="h-0.5 w-12 mx-auto rounded-full"
              style={{ background: accentColor }}
            />
          </div>

          {/* Cover Footer */}
          <div className="text-[9px] font-extrabold text-indigo-200/90 text-center border-t border-indigo-400/30 pt-1.5">
            {book.chapters.length} فصول تخصصية
          </div>

          {/* 3D Page Edges (Right Side Thickness) */}
          <div
            className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-slate-200 via-indigo-100 to-slate-300 border-l border-indigo-900/60"
            style={{
              transformOrigin: "left center",
              transform: "rotateY(-90deg)"
            }}
          >
            <div className="h-full w-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_3px)]" />
          </div>
        </div>
      </div>

      {/* Book Metadata below graphic */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-extrabold">
            {book.category || "مرجع محاسبي"}
          </span>
          <span className="text-xs text-indigo-300/80 font-bold flex items-center gap-1">
            <Bookmark className="w-3 h-3 text-cyan-400" />
            {book.chapters.length} فصول
          </span>
        </div>

        <h3 className="font-black text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
          {book.title}
        </h3>
        <p className="text-xs text-indigo-200/70 line-clamp-2 leading-relaxed">
          {book.sub}
        </p>
      </div>

      {/* Button */}
      <div className="pt-3 border-t border-indigo-900/50 flex items-center justify-between text-xs font-bold">
        <span className="text-cyan-400 flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>قراءة تفاعلية</span>
        </span>

        <div className="px-3 py-1.5 rounded-xl bg-indigo-500/20 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 text-indigo-200 group-hover:text-white transition-all flex items-center gap-1 font-extrabold text-xs">
          <span>افتح</span>
          <ChevronLeft className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
