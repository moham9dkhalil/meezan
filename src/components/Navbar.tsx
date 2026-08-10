import { useState, useRef, useEffect } from "react";
import { ActiveTab, UserProfile } from "../types";
import { PomodoroTimer } from "./PomodoroTimer";
import {
  Scale,
  BookOpen,
  BookMarked,
  Layers,
  Award,
  Calculator,
  Library,
  Bot,
  Receipt,
  Smartphone,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  User,
  LogIn,
  UserPlus,
  ShieldCheck,
  FileSpreadsheet,
  Building2,
  Brain,
  Users,
  Sun,
  Moon,
  Languages,
  Search,
  Grid,
  Zap,
  Briefcase,
  MessageCircleQuestion,
  Timer
} from "lucide-react";
import { Language } from "../data/translations";

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  currentUser: UserProfile | null;
  onOpenAuth: (mode?: "LOGIN" | "SIGNUP") => void;
  onOpenDownloadModal?: () => void;
  xp?: number;
  streak?: number;
  onOpenAchievements?: () => void;
  theme?: "dark" | "light";
  onToggleTheme?: () => void;
  appLanguage?: Language;
  onToggleLanguage?: () => void;
}

export function Navbar({
  activeTab,
  onSelectTab,
  currentUser,
  onOpenAuth,
  onOpenDownloadModal,
  xp = 0,
  streak = 1,
  onOpenAchievements,
  theme = "dark",
  onToggleTheme,
  appLanguage = "ar",
  onToggleLanguage
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isEn = appLanguage === "en";

  // Close dropdown on outside click
  useEffect(() => {

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Primary Nav Items shown directly on the top bar
  const primaryNavItems: { id: ActiveTab; label: string; icon: any; badge?: string }[] = [
    { id: "hero", label: isEn ? "Home" : "الرئيسية", icon: Scale },
    { id: "sectors", label: isEn ? "Sectors" : "التخصصات", icon: Briefcase },
    { id: "path", label: isEn ? "Stages (32)" : "المراحل", icon: Layers, badge: "32" },
    { id: "lab", label: isEn ? "Lab" : "المعمل", icon: Calculator },
    { id: "taxGuide", label: isEn ? "Tax" : "الضرائب", icon: Receipt, badge: isEn ? "2026" : "2026" },
    { id: "interviewQuestions", label: isEn ? "Interviews" : "المقابلات", icon: MessageCircleQuestion, badge: "جديد" },
  ];

  // Categorized items for the "All Tools & Sections" Dropdown
  const categorizedNavItems = [
    {
      categoryAr: "🌱 المسار التعليمي والتقييمات",
      categoryEn: "🌱 Learning Path & Exams",
      items: [
        { id: "sectors" as ActiveTab, label: isEn ? "Accounting Sectors & Fields" : "تخصصات وقطاعات المحاسبة (المقاولات، المصانع، العقارات...)", icon: Briefcase, desc: "خريطة التعلم والقيود وشجرة الحسابات لكل مجال قطاعي" },
        { id: "interviewQuestions" as ActiveTab, label: isEn ? "Accounting Job Interviews Q&A" : "أسئلة مقابلات المحاسبة (من حديث التخرج لـ CFO)", icon: MessageCircleQuestion, badge: "جديد", desc: "كل الأسئلة والإجابات النموذجية لجميع المستويات الوظيفية" },
        { id: "accountingStandards" as ActiveTab, label: isEn ? "All Accounting Standards (IFRS/IAS/EAS/GAAP)" : "كل معايير المحاسبة (دولي، مصري، أمريكي)", icon: BookMarked, badge: "مرجع", desc: "شرح تفصيلي عميق لكل معيار: النطاق، الاعتراف، القياس، الإفصاح، أمثلة، وقيود" },
        { id: "path" as ActiveTab, label: isEn ? "32 Learning Stages" : "المراحل التعليمية (32 مرحلة)", icon: Layers, desc: "دروس تفاعلية مع أسئلة وحالات عمل" },
        { id: "smartQuizzes" as ActiveTab, label: isEn ? "Smart Quizzes" : "الاختبارات والتطبيقات الذكية", icon: Brain, desc: "اختبر مستواك المحاسبي مع التغذية الراجعة" },
        { id: "socpaExam" as ActiveTab, label: isEn ? "SOCPA Exam Simulator" : "محاكي اختبار زمالة SOCPA", icon: ShieldCheck, desc: "أسئلة وتمارين الزمالة السعودية للمحاسبين" },
        { id: "courses" as ActiveTab, label: isEn ? "Accredited Courses" : "الكورسات والشهادات المعتمدة", icon: Award, desc: "مسارات متخصصة شهادة الممارس والمدير" },
      ]
    },
    {
      categoryAr: "⚡ المعمل والتطبيقات العملية",
      categoryEn: "⚡ Practical Lab & Tools",
      items: [
        { id: "lab" as ActiveTab, label: isEn ? "Accounting Lab" : "المعمل المحاسبي الشامل", icon: Calculator, desc: "تسجيل القيود والشجرة وإعادة التوجيه" },
        { id: "odooJournal" as ActiveTab, label: isEn ? "Odoo ERP Journal" : "شاشات قيود أنظمة Odoo ERP", icon: Building2, desc: "توجيه واختيار الحسابات كما في النظام الحقيقي" },
        { id: "excel" as ActiveTab, label: isEn ? "Excel Templates" : "قوالب وإكسيل المحاسب المالي", icon: FileSpreadsheet, desc: "نماذج جاهزة للمعادلات والقوائم" },
        { id: "tools" as ActiveTab, label: isEn ? "Financial Calculators" : "حاسبات الأصول والإهلاك والرواتب", icon: Calculator, desc: "حساب الإهلاك والضريبة والرواتب والميزانية" },
        { id: "taxGuide" as ActiveTab, label: isEn ? "Comprehensive Tax Guide" : "دليل الضرائب العربي والأنظمة 2026", icon: Receipt, desc: "اللوائح والإقرارات الضريبية والفوترة" },
      ]
    },
    {
      categoryAr: "📚 القاموس والمكتبة والمجتمع",
      categoryEn: "📚 Dictionary & Community",
      items: [
        { id: "glossary" as ActiveTab, label: isEn ? "Accounting Dictionary" : "قاموس ومعجم مصطلحات المحاسبة", icon: BookMarked, desc: "شرح مبسط لكافة الحسابات والمعايير" },
        { id: "flashcards" as ActiveTab, label: isEn ? "English Accounting Terms" : "بطاقات المصطلحات الإنجليزية", icon: BookOpen, desc: "تعلم المصطلحات بالصوت والنطق الإنجليزي" },
        { id: "library" as ActiveTab, label: isEn ? "Digital Library" : "المكتبة الرقمية والكتب PDF", icon: Library, desc: "ملخصات ومعايير وملازم للتحميل" },
        { id: "community" as ActiveTab, label: isEn ? "Accountants Community" : "مجتمع المحاسبين والخبراء", icon: Users, desc: "نقاشات واستشارات ومشاركات الممارسين" },
        { id: "appDownload" as ActiveTab, label: isEn ? "Download Mobile App" : "تحميل تطبيق الهاتف (Android)", icon: Smartphone, badge: "APK", desc: "تثبيت تطبيق ميزان على جوالك" },
        { id: "ai" as ActiveTab, label: isEn ? "AI Assistant" : "المساعد الذكي للمحاسب", icon: Bot, badge: "AI", desc: "إجابات فورية على استفساراتك المحاسبية" },
      ]
    },
    {
      categoryAr: "👤 حسابك والتركيز في المذاكرة",
      categoryEn: "👤 Your Account & Study Focus",
      items: [
        { id: "profile" as ActiveTab, label: isEn ? "My Profile & Account" : "ملفي الشخصي وإعدادات حسابي", icon: User, desc: "بياناتك، إنجازاتك، شهاداتك، وتفضيلاتك" },
        { id: "studyTimer" as ActiveTab, label: isEn ? "Study Focus Timer" : "مؤقت المذاكرة والتركيز (بومودورو)", icon: Timer, desc: "جلسات تركيز 25 دقيقة مع راحة ذكية وعدّاد جلسات" },
      ]
    }
  ];

  // Flattened nav items for search
  const allFlatNavItems = [
    { id: "hero" as ActiveTab, label: isEn ? "Home" : "الرئيسية", icon: Scale, desc: isEn ? "Main overview & dashboard" : "الصفحة الرئيسية والنظرة العامة", keywords: "home رئيسية" },
    ...categorizedNavItems.flatMap(c => c.items.map(i => ({ ...i, keywords: `${i.label} ${i.desc}` })))
  ];

  const filteredSearchResults = searchQuery.trim() === ""
    ? []
    : allFlatNavItems.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.keywords.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // All Items for Mobile Grid
  const mobileAllItems = [
    { id: "hero" as ActiveTab, label: isEn ? "Home" : "الرئيسية", icon: Scale },
    { id: "path" as ActiveTab, label: isEn ? "Stages (32)" : "المراحل (32)", icon: Layers, badge: "32" },
    { id: "interviewQuestions" as ActiveTab, label: isEn ? "Interview Q&A" : "مقابلات العمل", icon: MessageCircleQuestion },
    { id: "accountingStandards" as ActiveTab, label: isEn ? "Accounting Standards" : "معايير المحاسبة", icon: BookMarked },
    { id: "smartQuizzes" as ActiveTab, label: isEn ? "Smart Quizzes" : "الاختبارات الذكية", icon: Brain },
    { id: "socpaExam" as ActiveTab, label: isEn ? "SOCPA Exam" : "اختبار SOCPA", icon: ShieldCheck },
    { id: "lab" as ActiveTab, label: isEn ? "Accounting Lab" : "المعمل المحاسبي", icon: Calculator },
    { id: "odooJournal" as ActiveTab, label: isEn ? "Odoo ERP" : "قيود أودو", icon: Building2 },
    { id: "taxGuide" as ActiveTab, label: isEn ? "Tax Guide" : "دليل الضرائب", icon: Receipt, badge: "2026" },
    { id: "excel" as ActiveTab, label: isEn ? "Excel Templates" : "إكسيل المحاسب", icon: FileSpreadsheet },
    { id: "tools" as ActiveTab, label: isEn ? "Calculators" : "الأدوات المالية", icon: Calculator },
    { id: "courses" as ActiveTab, label: isEn ? "Courses" : "الكورسات والشهادات", icon: Award },
    { id: "community" as ActiveTab, label: isEn ? "Community" : "مجتمع المحاسبين", icon: Users },
    { id: "glossary" as ActiveTab, label: isEn ? "Dictionary" : "قاموس المحاسبة", icon: BookMarked },
    { id: "flashcards" as ActiveTab, label: isEn ? "English Terms" : "مصطلحات إنجليزية", icon: BookOpen },
    { id: "library" as ActiveTab, label: isEn ? "Library" : "المكتبة الرقمية", icon: Library },
    { id: "ai" as ActiveTab, label: isEn ? "AI Assistant" : "المساعد الذكي", icon: Bot, badge: "AI" },
    { id: "appDownload" as ActiveTab, label: isEn ? "Mobile App" : "تطبيق الجوال", icon: Smartphone },
    { id: "studyTimer" as ActiveTab, label: isEn ? "Focus Timer" : "مؤقت المذاكرة", icon: Timer },
    { id: "profile" as ActiveTab, label: isEn ? "My Account" : "حسابي الشخصي", icon: User },
  ];

  // Mobile Bottom Bar Items
  const mobileBottomItems: { id: ActiveTab; label: string; icon: any }[] = [
    { id: "hero", label: isEn ? "Home" : "الرئيسية", icon: Scale },
    { id: "path", label: isEn ? "Stages" : "المراحل", icon: Layers },
    { id: "lab", label: isEn ? "Lab" : "المعمل", icon: Calculator },
    { id: "taxGuide", label: isEn ? "Tax" : "الضرائب", icon: Receipt },
    { id: "studyTimer", label: isEn ? "Focus" : "مؤقت", icon: Timer },
    { id: "profile", label: isEn ? "Account" : "حسابي", icon: User },
  ];

  const handleTabClick = (tabId: ActiveTab) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
    setQuickSearchOpen(false);
  };

  return (
    <>
      {/* Floating Modern Header */}
      <header className="sticky top-0 z-50 w-full px-2 sm:px-4 py-2 transition-all">
        <div className="max-w-7xl mx-auto bg-[#070b1a]/90 backdrop-blur-2xl border border-white/12 rounded-2xl shadow-2xl shadow-indigo-950/40 px-3 sm:px-4 min-h-16 py-1.5 sm:py-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 sm:gap-3 transition-all relative">
          
            {/* BRAND LOGO */}
            <div
              onClick={() => handleTabClick("hero")}
              className="flex items-center gap-2 cursor-pointer shrink-0 group py-1"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-lg sm:text-xl shadow-lg shadow-indigo-500/25 group-hover:scale-105 group-hover:rotate-3 transition-all border border-white/25">
                ⚖️
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-white via-indigo-200 to-pink-300 bg-clip-text text-transparent">
                    {isEn ? "Meezan" : "ميزان"}
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-full text-[9px] font-black bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 shadow-inner">
                    2026
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-indigo-300/80 -mt-1 hidden sm:inline">
                  {isEn ? "Smart Accounting Platform" : "منصة المحاسبة المالية الذكية"}
                </span>
              </div>
            </div>

          {/* DESKTOP NAVIGATION BAR */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                activeTab === item.id ||
                (item.id === "path" && activeTab === "lessonView") ||
                (item.id === "hero" && (activeTab === "features" || activeTab === "testimonials")) ||
                (item.id === "sectors" && activeTab === "sectorDetail");

              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl font-black text-xs xl:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer border ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600/40 via-purple-600/30 to-indigo-600/40 text-indigo-100 border-indigo-400/60 shadow-lg shadow-indigo-500/20 font-black scale-105"
                      : "text-slate-300 hover:text-white hover:bg-white/8 border-transparent"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400 animate-pulse" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-pink-500/25 border border-pink-400/40 text-pink-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* "ALL SECTIONS" DROPDOWN BUTTON */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs xl:text-sm whitespace-nowrap transition-all cursor-pointer border ${
                  moreMenuOpen
                    ? "bg-purple-600/30 text-purple-200 border-purple-400/60 shadow-lg shadow-purple-500/20"
                    : "bg-white/5 hover:bg-white/10 text-slate-200 border-white/10"
                }`}
              >
                <Grid className="w-3.5 h-3.5 text-purple-400" />
                <span>{isEn ? "All Tools & Sections" : "كل الأقسام والأدوات"}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreMenuOpen ? "rotate-180 text-purple-300" : "text-slate-400"}`} />
              </button>

              {/* MEGA DROPDOWN MENU */}
              {moreMenuOpen && (
                <div className="fixed top-[76px] lg:top-[122px] 2xl:top-[76px] left-1/2 -translate-x-1/2 mt-2 w-[min(760px,calc(100vw-1.5rem))] max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain bg-[#090e24] border border-white/15 rounded-3xl p-5 shadow-2xl shadow-black/90 backdrop-blur-3xl z-[70] animate-fadeIn space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <h4 className="text-sm font-black text-white">
                        {isEn ? "Meezan Suite Navigation" : "دليل وأدوات منصة ميزان الشاملة"}
                      </h4>
                    </div>
                    <button
                      onClick={() => setQuickSearchOpen(true)}
                      className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-cyan-300 font-bold border border-white/10 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Search className="w-3 h-3" />
                      <span>{isEn ? "Quick Search" : "بحث سريع (Cmd+K)"}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {categorizedNavItems.map((cat, idx) => (
                      <div key={idx} className="space-y-2">
                        <h5 className="text-[11px] font-black text-cyan-300 border-b border-white/10 pb-1.5">
                          {isEn ? cat.categoryEn : cat.categoryAr}
                        </h5>
                        <div className="space-y-1">
                          {cat.items.map((item) => {
                            const ItemIcon = item.icon;
                            const isActive = activeTab === item.id;

                            return (
                              <button
                                key={item.id}
                                onClick={() => handleTabClick(item.id)}
                                className={`w-full text-right p-2 rounded-xl transition-all flex items-start gap-2 group cursor-pointer border ${
                                  isActive
                                    ? "bg-indigo-600/30 text-indigo-200 border-indigo-500/40 font-bold"
                                    : "hover:bg-white/5 border-transparent text-slate-300 hover:text-white"
                                }`}
                              >
                                <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-indigo-500/20 text-indigo-400 shrink-0 mt-0.5 border border-white/5">
                                  <ItemIcon className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-black truncate group-hover:text-cyan-200 flex items-center gap-1">
                                    <span>{item.label}</span>
                                    {item.badge && (
                                      <span className="px-1 py-0.2 text-[8px] font-black bg-pink-500/20 text-pink-300 rounded border border-pink-500/30">
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-400 line-clamp-1 font-normal">
                                    {item.desc}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* BOTTOM BANNER IN DROPDOWN */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-purple-950/80 to-indigo-950/80 border border-indigo-500/30 flex items-center justify-between text-xs font-bold text-slate-300">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
                      <span>{isEn ? "32 Practical Stages & Interactive SOCPA Simulator" : "32 مرحلة عمل تطبيقية + محاكي اختبار الزمالة SOCPA"}</span>
                    </div>
                    <button
                      onClick={() => handleTabClick("path")}
                      className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs cursor-pointer border border-white/20 shadow-md"
                    >
                      {isEn ? "Start Learning" : "ابدأ الآن 🚀"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* RIGHT CONTROLS / UTILITIES */}
          <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
            
            {/* QUICK SEARCH BUTTON */}
            <button
              onClick={() => setQuickSearchOpen(true)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              title={isEn ? "Quick Search Sections" : "البحث السريع في الأقسام"}
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden xl:inline">{isEn ? "Search" : "بحث..."}</span>
            </button>

            {/* ACHIEVEMENTS & XP BADGE */}
            {onOpenAchievements && (
              <button
                onClick={onOpenAchievements}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-indigo-500/20 border border-amber-400/40 text-amber-300 font-extrabold text-xs hover:bg-amber-500/30 transition-all cursor-pointer shadow-md"
                title="لوحة الإنجازات والتحديات اليومية"
              >
                <Award className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="font-mono font-black text-amber-300 hidden xl:inline">+{xp} XP</span>
                <span className="font-mono font-black text-amber-300 xl:hidden">+{xp}</span>
              </button>
            )}

            {/* POMODORO TIMER */}
            <div>
              <PomodoroTimer />
            </div>

            {/* THEME TOGGLE */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/12 text-amber-300 transition-all cursor-pointer shadow-sm flex items-center justify-center group"
                title={theme === "dark" ? (isEn ? "Switch to Light Mode" : "التبديل إلى الوضع الفاتح") : (isEn ? "Switch to Dark Mode" : "التبديل إلى الوضع الداكن")}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-300 group-hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-300 group-hover:-rotate-12 transition-transform" />
                )}
              </button>
            )}

            {/* LANGUAGE TOGGLE */}
            {onToggleLanguage && (
              <button
                onClick={onToggleLanguage}
                className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/12 text-emerald-300 hover:text-emerald-200 transition-all cursor-pointer shadow-sm flex items-center gap-1 text-xs font-bold"
                title={isEn ? "Switch to Arabic" : "تغيير للإنجليزية"}
              >
                <Languages className="w-3.5 h-3.5 text-emerald-400" />
                <span>{appLanguage === "ar" ? "EN" : "عربي"}</span>
              </button>
            )}

            {/* USER LOGIN / PROFILE CHIP */}
            {currentUser && currentUser.isLoggedIn ? (
              <button
                onClick={() => handleTabClick("profile")}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#0e162f] border border-indigo-500/40 text-white hover:border-indigo-400 transition-all cursor-pointer shadow-md"
              >
                <span className="text-lg">{currentUser.avatar}</span>
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-black text-white leading-tight">{currentUser.name}</span>
                  <span className="text-[10px] text-amber-300 font-bold leading-tight">+{currentUser.xp} XP</span>
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleTabClick("profile")}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-400/40 text-indigo-200 hover:bg-indigo-500/20 transition-all cursor-pointer"
                  title={isEn ? "My Account" : "حسابي الشخصي"}
                >
                  <User className="w-3.5 h-3.5 text-indigo-300" />
                  <span className="hidden lg:inline">{isEn ? "Account" : "حسابي"}</span>
                </button>

                <button
                  onClick={() => onOpenAuth("LOGIN")}
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 hover:bg-white/10 hover:border-indigo-400/50 text-white font-black text-xs transition-all cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden lg:inline">{isEn ? "Log In" : "دخول"}</span>
                </button>

                <button
                  onClick={() => onOpenAuth("SIGNUP")}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-black text-xs shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all cursor-pointer border border-white/20"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isEn ? "Sign Up" : "حساب جديد"}</span>
                </button>
              </div>
            )}

            {/* MOBILE HAMBURGER BUTTON */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center"
              aria-label={isEn ? "Menu" : "القائمة"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-pink-400" /> : <Menu className="w-5 h-5 text-indigo-300" />}
            </button>
          </div>
        </div>

        {/* MOBILE EXPANDED MENU DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 bg-[#080d22]/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-4 space-y-4 animate-fadeIn shadow-2xl">
            
            {/* MOBILE AUTH & XP BANNER */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-2">
              {currentUser && currentUser.isLoggedIn ? (
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{currentUser.avatar}</span>
                  <div>
                    <div className="font-black text-xs text-white">{currentUser.name}</div>
                    <div className="text-[10px] text-amber-300 font-bold">+{currentUser.xp} XP • {currentUser.role}</div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-300">
                  <span className="font-black text-white block">{isEn ? "Welcome to Meezan! 👋" : "مرحباً بك في منصة ميزان! 👋"}</span>
                  <span className="text-[10px] text-slate-400">{isEn ? "Log in to save your progress" : "سجل دخولك لحفظ إنجازاتك"}</span>
                </div>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth(currentUser?.isLoggedIn ? "LOGIN" : "SIGNUP");
                }}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-black text-xs shrink-0 cursor-pointer shadow-md"
              >
                {currentUser?.isLoggedIn ? (isEn ? "My Account" : "حسابي") : (isEn ? "Log In" : "تسجيل الدخول")}
              </button>
            </div>

            {/* MOBILE QUICK GRID */}
            <div className="space-y-2">
              <div className="text-xs font-black text-cyan-300 flex items-center justify-between px-1">
                <span>{isEn ? "All Sections & Tools" : "تصفح جميع الأقسام والأدوات"}</span>
                <span className="text-[10px] text-slate-400 font-bold">{mobileAllItems.length} قسم</span>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto p-1 scrollbar-thin">
                {mobileAllItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id || (item.id === "path" && activeTab === "lessonView");

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`p-3 rounded-2xl text-right font-bold text-xs flex items-center justify-between gap-2 transition-all cursor-pointer border ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-600/40 to-purple-600/40 text-indigo-200 border-indigo-500/60 shadow-lg font-black"
                          : "bg-white/5 text-gray-200 border-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive ? "bg-indigo-500 text-white" : "bg-white/10 text-gray-300"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.2 rounded text-[8px] font-black bg-pink-500/20 text-pink-300 border border-pink-500/30">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MOBILE CALL TO ACTION */}
            <button
              onClick={() => handleTabClick("path")}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xl cursor-pointer border border-white/20"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{isEn ? "Explore 32 Learning Stages" : "الانتقال إلى الـ 32 مرحلة التعليمية"}</span>
            </button>
          </div>
        )}
      </header>

      {/* QUICK SEARCH MODAL OVERLAY */}
      {quickSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-fadeIn">
          <div className="bg-[#0a0f26] border border-white/20 rounded-3xl w-full max-w-xl p-5 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setQuickSearchOpen(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white p-1 rounded-xl bg-white/5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Search className="w-5 h-5 text-cyan-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? "Search sections (e.g., Tax, Lab, Odoo, Stages)..." : "ابحث في منصة ميزان (مثال: الضرائب، القيود، أودو، إكسيل)..."}
                className="w-full bg-transparent text-sm font-bold text-white focus:outline-none placeholder:text-slate-500"
              />
            </div>

            {/* RESULTS LIST */}
            <div className="max-h-80 overflow-y-auto space-y-1 scrollbar-none">
              {searchQuery.trim() === "" ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  <span>{isEn ? "Type keywords to search across all app sections" : "اكتب كلمة بحث للانتقال السريع لأي قسم في التطبيق"}</span>
                </div>
              ) : filteredSearchResults.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  <span>{isEn ? "No matching section found" : "لم يتم العثور على قسم بهذا الاسم"}</span>
                </div>
              ) : (
                filteredSearchResults.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className="w-full text-right p-3 rounded-2xl hover:bg-white/10 border border-transparent hover:border-cyan-500/30 transition-all flex items-center justify-between gap-3 group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 group-hover:scale-110 transition-transform">
                          <ItemIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-white group-hover:text-cyan-300">
                            {item.label}
                          </div>
                          {item.desc && (
                            <div className="text-[10px] text-slate-400">
                              {item.desc}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-lg border border-cyan-500/20">
                        انتقال ↵
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation Bar for Mobile App Feeling */}
      <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-50 bg-[#070c20]/90 backdrop-blur-2xl border border-white/20 rounded-2xl p-1.5 shadow-2xl shadow-black/90 flex items-center justify-around">
        {mobileBottomItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.id === "path" && activeTab === "lessonView") ||
            (item.id === "hero" && (activeTab === "features" || activeTab === "testimonials"));

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer relative ${
                isActive
                  ? "text-indigo-300 font-black scale-105"
                  : "text-slate-400 font-bold hover:text-white"
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${
                isActive ? "bg-indigo-600/30 border border-indigo-400/50 text-indigo-300 shadow-md" : "bg-transparent"
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] mt-0.5 leading-none">{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-pink-400 absolute -bottom-0.5" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}
