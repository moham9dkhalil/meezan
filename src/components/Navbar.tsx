import { useState } from "react";
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
  ChevronLeft,
  User,
  LogIn,
  UserPlus,
  ShieldCheck,
  Download,
  FileSpreadsheet,
  Building2,
  Brain,
  Users,
  Sun,
  Moon,
  Languages
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


  const isEn = appLanguage === "en";

  // Nav Items
  const navItems: { id: ActiveTab; label: string; icon: any; badge?: string }[] = [
    { id: "hero", label: isEn ? "Home" : "الرئيسية", icon: Scale },
    { id: "path", label: isEn ? "Stages (32)" : "المراحل (32)", icon: Layers, badge: "32" },
    { id: "smartQuizzes", label: isEn ? "Smart Quizzes" : "الاختبارات الذكية", icon: Brain, badge: isEn ? "Quiz" : "تقييم" },
    { id: "socpaExam", label: isEn ? "SOCPA Exam" : "اختبار الزمالة SOCPA", icon: ShieldCheck, badge: isEn ? "Simulator" : "محاكي" },
    { id: "community", label: isEn ? "Community" : "مجتمع المحاسبين", icon: Users, badge: isEn ? "New" : "جديد" },
    { id: "glossary", label: isEn ? "Dictionary" : "قاموس المحاسبة", icon: BookMarked, badge: isEn ? "Full" : "شامل" },
    { id: "flashcards", label: isEn ? "Terms E-Card" : "مصطلحات E", icon: BookOpen },
    { id: "courses", label: isEn ? "Courses" : "الكورسات", icon: Award },
    { id: "lab", label: isEn ? "Lab" : "المعمل", icon: Calculator },
    { id: "odooJournal", label: isEn ? "Odoo Journal" : "قيود أودو Odoo", icon: Building2, badge: "Odoo" },
    { id: "excel", label: isEn ? "Excel Templates" : "إكسيل المحاسب", icon: FileSpreadsheet, badge: isEn ? "New" : "جديد" },
    { id: "tools", label: isEn ? "Calculators" : "الأدوات", icon: Calculator },
    { id: "taxGuide", label: isEn ? "Tax Guide" : "دليل الضرائب", icon: Receipt },
    { id: "appDownload", label: isEn ? "Mobile App" : "تطبيق الهاتف", icon: Smartphone, badge: isEn ? "App" : "تطبيق" },
    { id: "library", label: isEn ? "Library" : "المكتبة", icon: Library },
    { id: "ai", label: isEn ? "AI Assistant" : "مساعد AI", icon: Bot },
    { id: "profile", label: isEn ? "My Account" : "حسابي", icon: User },
  ];

  // Mobile Bottom Bar Quick Items
  const mobileBottomItems: { id: ActiveTab; label: string; icon: any }[] = [
    { id: "hero", label: isEn ? "Home" : "الرئيسية", icon: Scale },
    { id: "path", label: isEn ? "Stages" : "المراحل", icon: Layers },
    { id: "lab", label: isEn ? "Lab" : "المعمل", icon: Calculator },
    { id: "courses", label: isEn ? "Courses" : "الكورسات", icon: Award },
    { id: "profile", label: isEn ? "Account" : "حسابي", icon: User },
  ];

  const handleTabClick = (tabId: ActiveTab) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Glass Navbar Header */}
      <header className="sticky top-0 z-50 w-full bg-[#080C1C]/90 backdrop-blur-xl border-b border-white/10 transition-all shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          
          {/* Brand Logo */}
          <div
            onClick={() => handleTabClick("hero")}
            className="flex items-center gap-2.5 cursor-pointer shrink-0 group py-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform border border-white/20">
              ⚖️
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-white via-indigo-200 to-pink-300 bg-clip-text text-transparent">
                  {isEn ? "Meezan" : "ميزان"}
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-black bg-indigo-500/20 border border-indigo-500/40 text-indigo-300">
                  v2.0
                </span>
              </div>
              <span className="text-[10px] font-semibold text-indigo-300/80 -mt-1 hidden sm:inline">
                {isEn ? "Smart Accounting Platform" : "منصة المحاسبة الذكية"}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Items (Hidden on small screens for clean look) */}
          <nav className="hidden md:flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                activeTab === item.id ||
                (item.id === "path" && activeTab === "lessonView") ||
                (item.id === "hero" && (activeTab === "features" || activeTab === "testimonials"));

              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs lg:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600/30 to-purple-600/30 text-indigo-200 border border-indigo-400/50 shadow-md shadow-indigo-500/10"
                      : "text-gray-300 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-indigo-400" : "text-gray-400"}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-pink-500/20 border border-pink-500/30 text-pink-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls / Mobile Menu Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* ACHIEVEMENTS & XP BUTTON */}
            {onOpenAchievements && (
              <button
                onClick={onOpenAchievements}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-indigo-500/20 border border-amber-400/40 text-amber-300 font-extrabold text-xs hover:bg-amber-500/30 transition-all cursor-pointer shadow-md"
                title="لوحة الإنجازات والتحديات اليومية"
              >
                <Award className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="font-mono font-black text-amber-300">+{xp} XP</span>
              </button>
            )}

            {/* POMODORO STUDY TIMER */}
            <PomodoroTimer />

            {/* DOWNLOAD APP BUTTON */}
            <button
              onClick={onOpenDownloadModal || (() => handleTabClick("appDownload"))}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600/30 via-teal-600/30 to-indigo-600/30 border border-emerald-400/40 text-emerald-300 font-extrabold text-xs hover:bg-emerald-600/40 transition-all cursor-pointer shadow-md"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>{isEn ? "Mobile App" : "تطبيق الهاتف"}</span>
              <span className="px-1 py-0.2 rounded text-[9px] font-black bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">APK</span>
            </button>

            {/* THEME TOGGLE BUTTON (DARK / LIGHT) */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-amber-300 hover:text-amber-200 transition-all cursor-pointer shadow-md flex items-center justify-center group"
                title={theme === "dark" ? (isEn ? "Switch to Light Mode" : "التبديل إلى الوضع الفاتح") : (isEn ? "Switch to Dark Mode" : "التبديل إلى الوضع الداكن")}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-300 group-hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-300 group-hover:-rotate-12 transition-transform" />
                )}
              </button>
            )}

            {/* LANGUAGE TOGGLE BUTTON (AR / EN) */}
            {onToggleLanguage && (
              <button
                onClick={onToggleLanguage}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-emerald-300 hover:text-emerald-200 transition-all cursor-pointer shadow-md flex items-center gap-1.5 text-xs font-bold"
                title={isEn ? "Switch language to Arabic" : "تغيير لغة الواجهة إلى الإنجليزية"}
              >
                <Languages className="w-4 h-4 text-emerald-400" />
                <span>{appLanguage === "ar" ? "EN" : "عربي"}</span>
              </button>
            )}

            {/* USER LOGIN / PROFILE BUTTON */}
            {currentUser && currentUser.isLoggedIn ? (
              <button
                onClick={() => handleTabClick("profile")}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0e162f] border border-indigo-500/40 text-white hover:border-indigo-400 transition-all cursor-pointer shadow-md"
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
                  onClick={() => onOpenAuth("LOGIN")}
                  className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 hover:bg-white/10 hover:border-indigo-400/50 text-white font-black text-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{isEn ? "Log In" : "تسجيل الدخول"}</span>
                </button>

                <button
                  onClick={() => onOpenAuth("SIGNUP")}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-black text-xs shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all cursor-pointer border border-white/20"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isEn ? "Sign Up" : "حساب جديد"}</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center"
              aria-label={isEn ? "Menu" : "القائمة"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-pink-400" /> : <Menu className="w-6 h-6 text-indigo-300" />}
            </button>
          </div>
        </div>

        {/* Mobile Expanded Sheet Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a1024]/95 backdrop-blur-2xl border-b border-white/10 p-4 space-y-3 animate-fadeIn">
            
            {/* Mobile Auth Banner */}
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-2">
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
                  <span className="font-black text-white block">{isEn ? "Welcome to Meezan! 👋" : "مرحباً بك في ميزان! 👋"}</span>
                  <span className="text-[10px] text-slate-400">{isEn ? "Log in to save your points" : "سجل دخولك لحفظ إنجازاتك ونقاطك"}</span>
                </div>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth(currentUser?.isLoggedIn ? "LOGIN" : "SIGNUP");
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-black text-xs shrink-0 cursor-pointer"
              >
                {currentUser?.isLoggedIn ? (isEn ? "My Account" : "حسابي") : (isEn ? "Log In" : "تسجيل الدخول")}
              </button>
            </div>

            <div className="text-xs font-black text-indigo-300 flex items-center justify-between pb-2 border-b border-white/10">
              <span>{isEn ? "All Sections & Tools" : "جميع الأقسام والأدوات"}</span>
              {onToggleTheme && (
                <button
                  onClick={onToggleTheme}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/15 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-300" />
                      <span>{isEn ? "Light" : "وضع فاتح"}</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-indigo-300" />
                      <span>{isEn ? "Dark" : "وضع داكن"}</span>
                    </>
                  )}
                </button>
              )}
            </div>


            <div className="grid grid-cols-2 gap-2 pt-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id || (item.id === "path" && activeTab === "lessonView");

                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`p-3 rounded-2xl text-right font-bold text-xs flex items-center justify-between gap-2 transition-all cursor-pointer border ${
                      isActive
                        ? "bg-indigo-600/30 text-indigo-200 border-indigo-500/50 shadow-lg"
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
                    <ChevronLeft className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleTabClick("path")}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl cursor-pointer"
              >
                <span>{isEn ? "Explore 32 Learning Stages" : "تصفح الـ 32 مرحلة التعليمية"}</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Floating Bottom Navigation Bar for Mobile App Feeling */}
      <nav className="md:hidden fixed bottom-3 left-3 right-3 z-50 bg-[#0d1428]/90 backdrop-blur-2xl border border-white/15 rounded-2xl p-1.5 shadow-2xl shadow-black/80 flex items-center justify-around">
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
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all cursor-pointer relative ${
                isActive
                  ? "text-indigo-300 font-black scale-105"
                  : "text-gray-400 font-bold hover:text-white"
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${
                isActive ? "bg-indigo-600/30 border border-indigo-400/40 text-indigo-300 shadow-md" : "bg-transparent"
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] mt-1 leading-none">{item.label}</span>
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
