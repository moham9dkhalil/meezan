import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, ActiveTab, LearningTrack } from "../types";
import { AvatarPicker } from "./AvatarPicker";
import { LearningRoadmapChart } from "./LearningRoadmapChart";
import { Language, getSavedLanguage, applyLanguageSettings, translations } from "../data/translations";
import {
  User,
  ShieldCheck,
  Award,
  Flame,
  Zap,
  Edit3,
  CheckCircle2,
  LogOut,
  Sparkles,
  BookOpen,
  Calculator,
  Briefcase,
  Mail,
  Calendar,
  Check,
  Lock,
  Bell,
  BellRing,
  Target,
  Share2,
  Download,
  BarChart3,
  TrendingUp,
  Clock,
  ArrowRight,
  Globe,
  Star,
  Settings,
  LogIn,
  UserPlus,
  Type,
  FileText,
  Copy,
  Trash2,
  Save,
  Sun,
  Moon,
  Palette,
  Languages
} from "lucide-react";

interface UserProfileSectionProps {
  currentUser: UserProfile | null;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onLogout: () => void;
  onOpenAuth: (mode?: "LOGIN" | "SIGNUP") => void;
  onSelectTab: (tab: ActiveTab) => void;
  appLanguage?: Language;
  onLanguageChange?: (lang: Language) => void;
  onOpenCertificateModal?: () => void;
  onOpenDataBackupModal?: () => void;
}

const AVATAR_OPTIONS = ["👨‍💼", "👩‍💼", "🎓", "📊", "💼", "⚡", "🏆", "👨‍🎓", "👩‍🎓", "👑"];

type FontSizeOption = "sm" | "md" | "lg" | "xl";

export function UserProfileSection({
  currentUser,
  onUpdateUser,
  onLogout,
  onOpenAuth,
  onSelectTab,
  appLanguage,
  onLanguageChange,
  onOpenCertificateModal,
  onOpenDataBackupModal
}: UserProfileSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<"OVERVIEW" | "CERTS" | "NOTES" | "EDIT" | "SETTINGS">("OVERVIEW");

  // Language state
  const [currentLang, setCurrentLang] = useState<Language>(() => appLanguage || getSavedLanguage());

  const handleSelectLanguage = (lang: Language) => {
    setCurrentLang(lang);
    applyLanguageSettings(lang);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  // Edit form state
  const [editName, setEditName] = useState(currentUser?.name || "المحاسب المالي");
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || "👨‍💼");
  const [editRole, setEditRole] = useState(currentUser?.role || "طالب محاسبة");
  const [editTrack, setEditTrack] = useState<LearningTrack>(currentUser?.learningTrack || "corporate");
  const [editBio, setEditBio] = useState("طالب شغوف بتعلم القيود المحاسبية والمعايير الدولية IFRS وتطوير مهاراتي الماليّة.");
  const [successMsg, setSuccessMsg] = useState("");
  const [saving, setSaving] = useState(false);

  // Settings & Font size state
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(20);
  const [notifications, setNotifications] = useState({
    dailyStreak: true,
    challenges: true,
    certAlerts: true
  });

  // Daily Study Reminder State
  const [studyReminderEnabled, setStudyReminderEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("meezan_study_reminder_enabled");
      return saved !== null ? saved === "true" : true;
    } catch {
      return true;
    }
  });

  const [studyReminderTime, setStudyReminderTime] = useState<string>(() => {
    try {
      return localStorage.getItem("meezan_study_reminder_time") || "20:00";
    } catch {
      return "20:00";
    }
  });

  const [testReminderActive, setTestReminderActive] = useState(false);

  const handleToggleStudyReminder = (enabled: boolean) => {
    setStudyReminderEnabled(enabled);
    try {
      localStorage.setItem("meezan_study_reminder_enabled", String(enabled));
    } catch (e) {
      console.error(e);
    }
  };

  const handleChangeStudyReminderTime = (timeStr: string) => {
    setStudyReminderTime(timeStr);
    try {
      localStorage.setItem("meezan_study_reminder_time", timeStr);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTriggerTestReminder = () => {
    setTestReminderActive(true);
  };

  type AppThemeMode = "midnight" | "paper";

  const [appTheme, setAppTheme] = useState<AppThemeMode>(() => {
    try {
      return (localStorage.getItem("meezan_app_theme") as AppThemeMode) || "midnight";
    } catch {
      return "midnight";
    }
  });

  const handleSetAppTheme = (mode: AppThemeMode) => {
    setAppTheme(mode);
    try {
      localStorage.setItem("meezan_app_theme", mode);
      localStorage.setItem("meezan_reading_theme", mode === "paper" ? "light" : "dark");
      window.dispatchEvent(new CustomEvent("meezan_theme_changed", { detail: { theme: mode } }));
    } catch (e) {
      console.error(e);
    }
  };

  const [fontSize, setFontSize] = useState<FontSizeOption>(() => {
    try {
      return (localStorage.getItem("meezan_reading_font_size") as FontSizeOption) || "md";
    } catch {
      return "md";
    }
  });

  const handleSetFontSize = (size: FontSizeOption) => {
    setFontSize(size);
    try {
      localStorage.setItem("meezan_reading_font_size", size);
      window.dispatchEvent(new CustomEvent("meezan_font_size_changed", { detail: { fontSize: size } }));
    } catch {}
  };

  // User Notes state
  const [userNotes, setUserNotes] = useState<string>(() => {
    try {
      return localStorage.getItem("meezan_user_general_notes") || "";
    } catch {
      return "";
    }
  });
  const [notesSuccessMsg, setNotesSuccessMsg] = useState("");

  const handleSaveNotes = () => {
    try {
      localStorage.setItem("meezan_user_general_notes", userNotes);
      setNotesSuccessMsg("تم حفظ ملاحظاتك المحاسبية بنجاح! 💾");
      setTimeout(() => setNotesSuccessMsg(""), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportNotes = () => {
    if (!userNotes) return;
    try {
      const blob = new Blob([userNotes], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ملاحظات_محاسبية_ميزان_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setNotesSuccessMsg("تم تصدير وتحميل الملاحظات كملف نصي بنجاح! 📄");
      setTimeout(() => setNotesSuccessMsg(""), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      const updated: UserProfile = {
        ...currentUser,
        name: editName.trim() || currentUser.name,
        avatar: editAvatar,
        role: editRole,
        learningTrack: editTrack
      };
      try {
        localStorage.setItem("meezan_preferred_track", editTrack);
      } catch {
        // ignore
      }
      onUpdateUser(updated);
      setSuccessMsg("تم حفظ بيانات الملف الشخصي والمسار المفضل بنجاح! ✨");
      setTimeout(() => setSuccessMsg(""), 3000);
    }, 400);
  };

  // Default guest fallback user
  const user = currentUser || {
    id: "guest",
    name: "مستخدم تجريبي (زائر)",
    email: "guest@meezan.app",
    role: "متعلم جديد في منصة ميزان",
    avatar: "🎓",
    xp: 250,
    streak: 3,
    joinedDate: new Date().toLocaleDateString("ar-SA"),
    isLoggedIn: false
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* GUEST BANNER IF NOT LOGGED IN */}
      {!currentUser?.isLoggedIn && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-amber-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <h4 className="font-black text-sm text-white">تنويه: أنت تتصفح الملف بحساب تجريبي</h4>
              <p className="text-xs text-amber-200/80">
                سجل دخولك أو أنشئ حساباً جديداً لحفظ إنجازاتك ونقاط XP والشهادات بشكل دائم.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenAuth("LOGIN")}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all"
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => onOpenAuth("SIGNUP")}
              className="px-4 py-2 rounded-xl bg-amber-500 text-black font-black text-xs hover:bg-amber-400 transition-all shadow-md"
            >
              إنشاء حساب جديد
            </button>
          </div>
        </div>
      )}

      {/* TOP USER HERO CARD */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#0c132e] via-[#0a1024] to-[#121a38] border border-indigo-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-600/10 to-transparent rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-600/10 to-transparent rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          
          {/* Avatar & User Details */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-right">
            
            {/* Avatar Circle */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 border-2 border-indigo-400/50 flex items-center justify-center text-5xl sm:text-6xl shadow-2xl shadow-indigo-600/40">
                {user.avatar}
              </div>
              <button
                onClick={() => {
                  if (currentUser?.isLoggedIn) {
                    setActiveSubTab("EDIT");
                  } else {
                    onOpenAuth("LOGIN");
                  }
                }}
                className="absolute -bottom-2 -left-2 w-9 h-9 rounded-xl bg-indigo-600 border border-white/20 text-white flex items-center justify-center hover:bg-indigo-500 transition-all shadow-lg cursor-pointer"
                title="تعديل الرمز التعبيري"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            {/* Meta */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{user.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>عضو ميزان الموثق</span>
                </span>
              </div>

              <p className="text-sm font-bold text-indigo-300 flex items-center justify-center sm:justify-start gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <span>{user.role}</span>
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{user.email}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>عضو منذ: {user.joinedDate}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser?.isLoggedIn ? (
              <>
                <button
                  onClick={() => setActiveSubTab("EDIT")}
                  className="px-4 py-2.5 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 hover:bg-indigo-600/50 text-indigo-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>تعديل الملف</span>
                </button>

                <button
                  onClick={onLogout}
                  className="px-4 py-2.5 rounded-2xl bg-rose-600/20 border border-rose-500/40 hover:bg-rose-600/30 text-rose-300 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => onOpenAuth("LOGIN")}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-xs flex items-center gap-2 shadow-xl hover:shadow-indigo-600/40 transition-all cursor-pointer border border-white/20"
              >
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول / إنشاء حساب</span>
              </button>
            )}
          </div>

        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10 relative z-10">
          
          {/* XP Points */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
              <span>نقاط الخبرة (XP)</span>
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <div className="text-xl font-black text-amber-400">+{user.xp} XP</div>
            <div className="text-[10px] text-slate-500">الرتبة: محاسب مالي متدرب</div>
          </div>

          {/* Daily Streak */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
              <span>التتابع اليومي</span>
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            </div>
            <div className="text-xl font-black text-orange-400">{user.streak} أيام متواصلة</div>
            <div className="text-[10px] text-slate-500">حافظ على توهج الشغف يومياً 🔥</div>
          </div>

          {/* Completed Stages */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
              <span>المراحل المكتملة</span>
              <Target className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xl font-black text-indigo-300">12 / 32 مرحلة</div>
            <div className="text-[10px] text-slate-500">نسبة التقدم الكلي: 37.5%</div>
          </div>

          {/* Earned Badges */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
              <span>الأوسمة والشهادات</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-black text-emerald-400">3 أوسمة معتمدة</div>
            <div className="text-[10px] text-slate-500">SOCPA • IFRS • القيود</div>
          </div>

        </div>

        {/* QUICK POWER TOOLS BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/10 z-10 relative">
          <button
            onClick={() => onOpenCertificateModal && onOpenCertificateModal()}
            className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-indigo-950/60 border border-emerald-500/40 hover:border-emerald-400 text-right rtl:text-right ltr:text-left space-y-1 group transition-all cursor-pointer shadow-lg hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between text-emerald-400 font-black text-xs">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>{(appLanguage || currentLang) === "en" ? "E-Certificate Generator" : "شهادة التخرج الإلكترونية"}</span>
              </span>
              <Download className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-300 font-bold">
              {(appLanguage || currentLang) === "en"
                ? "Generate and print your official accounting completion certificate with mastery score in PDF format."
                : "توليد وطباعة شهادة إتمام المسار المحاسبي باسمك ومؤشرات إتقانك بصيغة PDF."}
            </p>
          </button>

          <button
            onClick={() => onSelectTab("socpaExam")}
            className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/40 hover:border-indigo-400 text-right rtl:text-right ltr:text-left space-y-1 group transition-all cursor-pointer shadow-lg hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between text-indigo-300 font-black text-xs">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{(appLanguage || currentLang) === "en" ? "SOCPA/ACCA Exam Simulator" : "محاكي اختبارات SOCPA/ACCA"}</span>
              </span>
              <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-300 font-bold">
              {(appLanguage || currentLang) === "en"
                ? "Timed professional exam environment simulating real SOCPA exams with weakness diagnostics."
                : "بيئة اختبار بوقت تنازلي تحاكي الاختبارات المهنية مع تقرير نقاط القوة والضعف."}
            </p>
          </button>

          <button
            onClick={() => onOpenDataBackupModal && onOpenDataBackupModal()}
            className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 to-cyan-950/60 border border-cyan-500/40 hover:border-cyan-400 text-right rtl:text-right ltr:text-left space-y-1 group transition-all cursor-pointer shadow-lg hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between text-cyan-300 font-black text-xs">
              <span className="flex items-center gap-1.5">
                <Save className="w-4 h-4 text-cyan-400" />
                <span>{(appLanguage || currentLang) === "en" ? "Data Export & Restore" : "تصدير واستيراد البيانات"}</span>
              </span>
              <FileText className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-300 font-bold">
              {(appLanguage || currentLang) === "en"
                ? "Export your notes and progress records to Excel or JSON for backup and instant recovery."
                : "تصدير ملاحظاتك وسجل تقدمك المالي إلى Excel أو JSON لاستعادتها بأي وقت."}
            </p>
          </button>
        </div>

      </div>

      {/* SUB TABS NAVIGATION */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0a1024] border border-white/10 overflow-x-auto scrollbar-none">
        {[
          { id: "OVERVIEW", label: "النشاط والتقدم المحاسبي", icon: BarChart3 },
          { id: "NOTES", label: "ملاحظاتي المحاسبية 📝", icon: BookOpen },
          { id: "CERTS", label: "الشهادات والأوسمة (3)", icon: Award },
          { id: "EDIT", label: "تعديل الملف والرمز", icon: Edit3 },
          { id: "SETTINGS", label: "إعدادات الخط والأهداف", icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`relative px-5 py-3 rounded-xl font-black text-xs transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
                isActive ? "text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeSubTabBg"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-600/30"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* SUB TAB CONTENT WITH ANIMATION */}
      <AnimatePresence mode="wait">
        {activeSubTab === "OVERVIEW" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Stage Progress Bar */}
              <div className="p-6 rounded-3xl bg-[#0d1428] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold">
                      🎯
                    </div>
                    <div>
                      <h3 className="font-black text-white text-base">تقدم مسار الـ 32 مرحلة</h3>
                      <p className="text-xs text-slate-400">إنجاز المستويات التعليمية والتطبيقية</p>
                    </div>
                  </div>

                  <span className="text-xs font-black text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-xl border border-indigo-500/30">
                    37.5% مكتمل
                  </span>
                </div>

                {/* Progress Bar with Motion */}
                <div className="w-full h-3 rounded-full bg-black/50 border border-white/10 overflow-hidden p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "37.5%" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-emerald-400 font-black block text-sm">12</span>
                    <span className="text-[10px] text-slate-400">مراحل منجزة</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-indigo-400 font-black block text-sm">20</span>
                    <span className="text-[10px] text-slate-400">مراحل متبقية</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-amber-400 font-black block text-sm">45</span>
                    <span className="text-[10px] text-slate-400">قيد محاسبي مجتاز</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-pink-400 font-black block text-sm">18 ساعة</span>
                    <span className="text-[10px] text-slate-400">وقت التعلم الكلي</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onSelectTab("path")}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center gap-2 cursor-pointer transition-all shadow-md"
                  >
                    <span>متابعة التعلم في المسار الرئيسي</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </motion.button>
                </div>
              </div>

              {/* Learning Roadmap Interactive Chart */}
              <LearningRoadmapChart onOpenStage={(stageId) => onSelectTab("path")} />

              {/* Domains Breakdown */}
              <div className="p-6 rounded-3xl bg-[#0d1428] border border-white/10 space-y-4">
                <h3 className="font-black text-white text-base flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                  <span>إتقان المهارات حسب الفرع المحاسبي</span>
                </h3>

                <div className="space-y-3">
                  {[
                    { domain: "المحاسبة المالية والقيود المزدوجة", pct: 80, color: "bg-indigo-500" },
                    { domain: "معايير الإفصاح والتقارير المالية IFRS", pct: 65, color: "bg-purple-500" },
                    { domain: "محاسبة التكاليف والمخزون", pct: 40, color: "bg-pink-500" },
                    { domain: "الضرائب والزكاة والضريبة المضافة", pct: 25, color: "bg-amber-500" }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                        <span>{item.domain}</span>
                        <span className="text-white">{item.pct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.pct}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.1 }}
                          className={`h-full rounded-full ${item.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            
            {/* Quick Navigation Cards */}
            <div className="p-6 rounded-3xl bg-[#0d1428] border border-white/10 space-y-4">
              <h3 className="font-black text-white text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>أدوات سريعة لك</span>
              </h3>

              <div className="space-y-2.5">
                <button
                  onClick={() => onSelectTab("lab")}
                  className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-right transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">معمل القيود المحاسبية</div>
                      <div className="text-[10px] text-slate-400">تطبيق عملي للقيد المزدوج</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 rotate-180" />
                </button>

                <button
                  onClick={() => onSelectTab("courses")}
                  className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-right transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">الدورات والشهادات المهنية</div>
                      <div className="text-[10px] text-slate-400">SOCPA • CMA • IFRS</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 rotate-180" />
                </button>
              </div>
            </div>

            {/* Streak Tracker Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/40 to-orange-950/40 border border-amber-500/30 space-y-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 mx-auto flex items-center justify-center text-2xl">
                🔥
              </div>

              <div>
                <h4 className="font-black text-white text-sm">التتابع اليومي: {user.streak} أيام</h4>
                <p className="text-xs text-amber-200/80 mt-1">
                  أكمل درساً أو تحدياً سريعاً اليوم حتى لا تكتسر سلسلة شغفك المالي!
                </p>
              </div>

              <div className="flex items-center justify-center gap-1.5 pt-2">
                {["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"].map((day, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-bold border ${
                      idx < user.streak
                        ? "bg-amber-500 border-amber-400 text-black font-black"
                        : "bg-black/40 border-white/10 text-slate-500"
                    }`}
                  >
                    {day[0]}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </motion.div>
      )}

        {/* SUB TAB: USER NOTES */}
        {activeSubTab === "NOTES" && (
          <motion.div
            key="notes"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <div className="p-6 rounded-3xl bg-[#0d1428] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-white text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <span>دفتر ملاحظاتي المحاسبية والأفكار الشخصية</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  احفظ ملخصاتك، قواعد القيود، وملاحظات المراجعة للرجوع إليها في أي وقت. يتم التخزين تلقائياً في ذاكرة المتصفح.
                </p>
              </div>

              {notesSuccessMsg && (
                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{notesSuccessMsg}</span>
                </div>
              )}
            </div>

            {/* Main Notes Editor Card */}
            <div className="p-6 rounded-3xl bg-[#0d1428] border border-white/10 space-y-4 shadow-2xl">
              
              {/* Quick Template Shortcuts */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>إضافة قوالب واختصارات سريعة:</span>
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    {
                      label: "+ قالب معادلة الميزانية",
                      text: "📌 معادلة الميزانية العمودية:\nالأصول المتداولة والغير متداولة = الالتزامات + حقوق الملكية."
                    },
                    {
                      label: "+ قالب قيد مبيعات آجلة",
                      text: "📌 قيد المبيعات الآجلة:\nمن حـ/ العملاء (مدين)\nإلى حـ/ المبيعات (دائن)\n---"
                    },
                    {
                      label: "+ قالب تسويات نهاية الفترة",
                      text: "📌 تسويات نهاية الفترة IFRS:\n1. المصروفات المستحقة: من حـ/ المصروف إلى حـ/ المصروف المستحق.\n2. الإيرادات المقدمة: من حـ/ الإيراد المقبوض مقدماً إلى حـ/ الإيراد."
                    }
                  ].map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setUserNotes((prev) => (prev ? prev + "\n\n" + tpl.text : tpl.text));
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-indigo-300 hover:text-white transition-all cursor-pointer"
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div className="relative">
                <textarea
                  rows={12}
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="اكتب ملاحظاتك المحاسبية، أفكارك، أو القواعد التي تود مراجعتها هنا..."
                  className="w-full bg-[#080d1e] border border-white/15 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 font-medium leading-relaxed outline-none focus:border-indigo-500 transition-all resize-y shadow-inner"
                />
              </div>

              {/* Footer Controls: Stats & Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10">
                <div className="flex items-center gap-4 text-xs text-slate-400 font-bold">
                  <span>عدد الحروف: {userNotes.length}</span>
                  <span>•</span>
                  <span>عدد الكلمات: {userNotes.trim() ? userNotes.trim().split(/\s+/).length : 0}</span>
                </div>

                <div className="flex items-center gap-2">
                  {userNotes.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("هل أنت تأكد من مسح جميع الملاحظات؟")) {
                          setUserNotes("");
                          localStorage.removeItem("meezan_user_general_notes");
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>مسح الكل</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (userNotes) {
                        navigator.clipboard.writeText(userNotes);
                        setNotesSuccessMsg("تم نسخ الملاحظات إلى الحافظة! 📋");
                        setTimeout(() => setNotesSuccessMsg(""), 3000);
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-indigo-400" />
                    <span>نسخ النص</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportNotes}
                    disabled={!userNotes}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    title="تصدير الملاحظات كملف نصي TXT"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>تصدير TXT</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ الملاحظات</span>
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}

      {/* SUB TAB 2: CERTIFICATES & BADGES */}
        {activeSubTab === "CERTS" && (
          <motion.div
            key="certs"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-3xl bg-[#0d1428] border border-white/10 flex items-center justify-between">
              <div>
                <h3 className="font-black text-white text-lg flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-400" />
                  <span>شهادات وميداليات التميز المكتسبة</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  شهادات إتمام مسارات ميزان المحاسبية الموثقة والمزودة برابط تحقق ديجيتال
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Cert 1 */}
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-6 rounded-3xl bg-gradient-to-b from-indigo-950/60 to-black/60 border border-indigo-500/40 space-y-4 relative overflow-hidden shadow-xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 text-indigo-300 border border-indigo-400/50 flex items-center justify-center text-2xl font-bold">
                  📜
                </div>
                <div>
                  <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/20 px-2.5 py-0.5 rounded-md border border-indigo-500/30">
                    شهادة مكتسبة 🏆
                  </span>
                  <h4 className="font-black text-white text-base mt-2">أساسيات قيد اليومية المزدوج</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    إتقان معادلة الميزانية وتحليل العمليات إلى أطراف مدينة ودائنة بنجاح.
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>معتمدة من منصة ميزان</span>
                  <span className="text-emerald-400 font-bold">كود: MEZ-8849</span>
                </div>
              </motion.div>

              {/* Cert 2 */}
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-6 rounded-3xl bg-gradient-to-b from-purple-950/60 to-black/60 border border-purple-500/40 space-y-4 relative overflow-hidden shadow-xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-600/30 text-purple-300 border border-purple-400/50 flex items-center justify-center text-2xl font-bold">
                  🌐
                </div>
                <div>
                  <span className="text-[10px] font-black text-purple-400 bg-purple-500/20 px-2.5 py-0.5 rounded-md border border-purple-500/30">
                    شهادة مكتسبة 🏆
                  </span>
                  <h4 className="font-black text-white text-base mt-2">معايير التقارير المالية الدولية IFRS</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    فهم شامل لتسويات نهاية الفترات والإفصاحات المالية حسب معايير الهيئة.
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>معتمدة من منصة ميزان</span>
                  <span className="text-emerald-400 font-bold">كود: IFRS-3321</span>
                </div>
              </motion.div>

              {/* Cert 3 */}
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-6 rounded-3xl bg-gradient-to-b from-amber-950/60 to-black/60 border border-amber-500/40 space-y-4 relative overflow-hidden shadow-xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-600/30 text-amber-300 border border-amber-400/50 flex items-center justify-center text-2xl font-bold">
                  ⚡
                </div>
                <div>
                  <span className="text-[10px] font-black text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-md border border-amber-500/30">
                    وسام التميز 🏅
                  </span>
                  <h4 className="font-black text-white text-base mt-2">بطل معمل القيود الميدانية</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    حل أكثر من 30 معضلة محاسبية حقيقية في معمل الميزان بدون خطأ.
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>وسام تفاعلي</span>
                  <span className="text-amber-400 font-bold">+500 XP bonus</span>
                </div>
              </motion.div>

            </div>
          </motion.div>
        )}

        {/* SUB TAB 3: EDIT PROFILE */}
        {activeSubTab === "EDIT" && (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#0d1428] border border-white/10 space-y-6"
          >
            <div>
              <h3 className="font-black text-white text-lg flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-400" />
                <span>تعديل بيانات الحساب والاسم المستعار</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                يتم حفظ جميع التحديثات فوراً في متصفحك المحلي (LocalStorage) لتظهر عبر كافة الأقسام.
              </p>
            </div>

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-5">
              
              {/* Avatar Selector */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-300 block">
                  اختر الرمز التعبيري والشارة المهنية لملفك
                </label>
                <AvatarPicker
                  selectedAvatar={editAvatar}
                  onSelectAvatar={setEditAvatar}
                />
              </div>

              {/* Display Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-300 block">
                  الاسم المستعار / الاسم الكامل الظاهر
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="اكتب اسمك الظاهر..."
                    className="w-full bg-black/40 border border-white/15 rounded-xl pr-10 pl-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-bold"
                  />
                </div>
              </div>

              {/* Role / Job Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-300 block">
                  التخصص المحاسبي / المسمى الوظيفي
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full bg-[#080d1e] border border-white/15 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-medium"
                >
                  <option value="طالب محاسبة">🎓 طالب محاسبة / خريج جديد</option>
                  <option value="محاسب عام">👨‍💼 محاسب عام (General Accountant)</option>
                  <option value="محاسب تكاليف وضرائب">📊 محاسب تكاليف وضرائب</option>
                  <option value="مراجع حسابات خارجي">🔍 مراجع حسابات خارجي / داخلي</option>
                  <option value="مدير مالي CFO">👑 مدير مالي (CFO)</option>
                  <option value="صاحب مشروع / مهتم">💼 صاحب عمل / مهتم بالمحاسبة</option>
                </select>
              </div>

              {/* Preferred Learning Track Selector */}
              <div className="space-y-2 p-4 rounded-2xl bg-gradient-to-br from-indigo-950/50 to-purple-950/40 border border-indigo-500/30">
                <label className="text-xs font-black text-indigo-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>مسار التعلم المفضل (التخصص الدراسي)</span>
                  </span>
                  <span className="text-[10px] text-indigo-300 font-normal">لتخصيص وترتيب المراحل والدروس</span>
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEditTrack("corporate")}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                      editTrack === "corporate"
                        ? "bg-indigo-600/40 border-indigo-400 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400"
                        : "bg-black/40 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">🏢</span>
                      {editTrack === "corporate" && <Check className="w-4 h-4 text-indigo-300" />}
                    </div>
                    <div className="font-black text-xs text-white">محاسبة شركات</div>
                    <div className="text-[10px] text-slate-400 leading-snug mt-1">القوائم المالية، المعايير الدولية IFRS وقيود الشركات</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditTrack("governmental")}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                      editTrack === "governmental"
                        ? "bg-amber-600/40 border-amber-400 text-white shadow-lg shadow-amber-600/30 ring-1 ring-amber-400"
                        : "bg-black/40 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">🏛️</span>
                      {editTrack === "governmental" && <Check className="w-4 h-4 text-amber-300" />}
                    </div>
                    <div className="font-black text-xs text-white">محاسبة حكومية</div>
                    <div className="text-[10px] text-slate-400 leading-snug mt-1">الميزانية العامة للدولة، دليل الحسابات الموحد والقطاع العام</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditTrack("auditing")}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                      editTrack === "auditing"
                        ? "bg-purple-600/40 border-purple-400 text-white shadow-lg shadow-purple-400/30 ring-1 ring-purple-400"
                        : "bg-black/40 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">🔍</span>
                      {editTrack === "auditing" && <Check className="w-4 h-4 text-purple-300" />}
                    </div>
                    <div className="font-black text-xs text-white">تدقيق ومراجعة</div>
                    <div className="text-[10px] text-slate-400 leading-snug mt-1">معايير التدقيق الدولية ISA وأنظمة الضبط والرقابة الداخلية</div>
                  </button>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-300 block">
                  نبذة شخصية
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  placeholder="اكتب نبذة قصيرة عن أهدافك المحاسبية..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-black text-xs shadow-xl shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-2"
                >
                  {saving ? (
                    <span>جاري الحفظ...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>حفظ التعديلات في LocalStorage</span>
                    </>
                  )}
                </motion.button>
              </div>

            </form>
          </motion.div>
        )}

        {/* SUB TAB 4: SETTINGS & GOALS */}
        {activeSubTab === "SETTINGS" && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#0d1428] border border-white/10 space-y-6"
          >
            <div>
              <h3 className="font-black text-white text-lg flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-400" />
                <span>إعدادات الأهداف اليومية والتنبيهات</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                تخصيص تجربة التعلم المحاسبي وأهداف الدراسة اليومية
              </p>
            </div>

            <div className="space-y-6">
              
              {/* Daily Study Reminders Control Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-black/40 to-purple-950/40 border border-indigo-500/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      <BellRing className="w-5 h-5 animate-bounce" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white flex items-center gap-2">
                        <span>تنبيهات المذاكرة اليومية</span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30">
                          {studyReminderEnabled ? "مُفعّل" : "مُعطّل"}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        إظهار إشعار تذكير بسيط داخل التطبيق في موعد دراستك المفضل لتنفيذ هدفك اليومي
                      </p>
                    </div>
                  </div>

                  {/* Main Switch */}
                  <button
                    type="button"
                    onClick={() => handleToggleStudyReminder(!studyReminderEnabled)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      studyReminderEnabled ? "bg-indigo-600" : "bg-slate-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        studyReminderEnabled ? "translate-x-0" : "-translate-x-5"
                      }`}
                    />
                  </button>
                </div>

                <AnimatePresence>
                  {studyReminderEnabled && (
                    <motion.div
                      key="study-reminder-options"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 pt-3 border-t border-white/10"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <label className="text-xs font-black text-slate-300 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-indigo-400" />
                          <span>اختر موعد التذكير اليومي المفضل:</span>
                        </label>

                        {/* Standard Time Presets */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {[
                            { time: "08:00", label: "08:00 ص" },
                            { time: "14:00", label: "02:00 م" },
                            { time: "18:00", label: "06:00 م" },
                            { time: "20:00", label: "08:00 م" },
                            { time: "22:00", label: "10:00 م" }
                          ].map((item) => (
                            <button
                              key={item.time}
                              type="button"
                              onClick={() => handleChangeStudyReminderTime(item.time)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                                studyReminderTime === item.time
                                  ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30"
                                  : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Time Selection & Test Button */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 bg-[#080d1e] p-3 rounded-xl border border-white/10">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-slate-400 font-bold">تحديد موعد مخصص:</span>
                          <input
                            type="time"
                            value={studyReminderTime}
                            onChange={(e) => handleChangeStudyReminderTime(e.target.value)}
                            className="bg-black/50 border border-white/20 rounded-lg px-2.5 py-1 text-white font-mono text-xs focus:border-indigo-500 outline-none"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleTriggerTestReminder}
                          className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>معاينة واختبار التنبيه الآن 🔔</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* In-App Study Reminder Notification Preview Banner */}
              <AnimatePresence>
                {testReminderActive && (
                  <motion.div
                    key="study-reminder-preview-banner"
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-indigo-600/30 to-purple-600/30 border-2 border-amber-400/50 shadow-2xl space-y-3 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/40 animate-pulse">
                          <BellRing className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-amber-300 flex items-center gap-2">
                            <span>🔔 تذكير المذاكرة اليومية (موعد الدراسة)</span>
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                              {studyReminderTime}
                            </span>
                          </h4>
                          <p className="text-xs text-slate-200 mt-1 font-medium leading-relaxed">
                            أهلاً بك! حان الوقت المعتاد لجلسة دراسة المحاسبة والقيود المالية اليومية. خصص {dailyGoalMinutes} دقيقة الآن للمحافظة على تتابع الإنجاز 🔥 وتحقيق أهدافك التعليمية.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setTestReminderActive(false)}
                        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 text-xs font-bold transition-all cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => setTestReminderActive(false)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                      >
                        إغلاق التنبيه
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTestReminderActive(false);
                          onSelectTab("courses");
                        }}
                        className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>الانتقال إلى الدروس والمناهج الآن 📚</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Language & Region Selection Card (Arabic vs English) */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-white flex items-center gap-2">
                    <Languages className="w-4 h-4 text-emerald-400" />
                    <span>اللغة والمنطقة (Language & Region Settings):</span>
                  </h4>
                  <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
                    {currentLang === "ar" ? "🇸🇦 العربية (RTL)" : "🇬🇧 English (LTR)"}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  اختر لغة واجهة المنصة والمحتوى التعليمي. يتم ضبط اتجاه العناصر والترجمات تلقائياً (تغيير فوري بدون إعادة تحميل الصفحة).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Arabic Option */}
                  <button
                    type="button"
                    onClick={() => handleSelectLanguage("ar")}
                    className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex items-start gap-3 relative overflow-hidden ${
                      currentLang === "ar"
                        ? "bg-gradient-to-br from-emerald-950/60 to-emerald-900/40 border-emerald-500 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-500"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xl shrink-0">
                      🇸🇦
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white">العربية (Arabic)</span>
                        {currentLang === "ar" && (
                          <span className="text-[10px] font-bold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">نشطة</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        الواجهة الأصلية لمنصة ميزان باتجاه من اليمين إلى اليسار (RTL) ومعايير المحاسبة العربية والدولية.
                      </p>
                    </div>
                  </button>

                  {/* English Option */}
                  <button
                    type="button"
                    onClick={() => handleSelectLanguage("en")}
                    className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex items-start gap-3 relative overflow-hidden ${
                      currentLang === "en"
                        ? "bg-gradient-to-br from-blue-950/60 to-indigo-900/40 border-blue-500 shadow-lg shadow-blue-500/20 ring-1 ring-blue-500"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xl shrink-0">
                      🇬🇧
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white">English (English)</span>
                        {currentLang === "en" && (
                          <span className="text-[10px] font-bold bg-blue-500 text-white px-2 py-0.5 rounded-full">Active</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Left-to-Right (LTR) interface with international financial terms and IFRS standard definitions.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* App Theme Picker Card (Midnight Dark vs Paper Light) */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-white flex items-center gap-2">
                    <Palette className="w-4 h-4 text-amber-400" />
                    <span>مظهر التطبيق والقراءة (Theme Mode):</span>
                  </h4>
                  <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                    {appTheme === "midnight" ? "منتصف الليل 🌙 (داكن)" : "نمط الورق 📄 (فاتح عالي التباين)"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Midnight Option */}
                  <button
                    type="button"
                    onClick={() => handleSetAppTheme("midnight")}
                    className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex items-start gap-3 relative overflow-hidden ${
                      appTheme === "midnight"
                        ? "bg-gradient-to-br from-[#0c1329] to-[#080d1e] border-indigo-500 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      <Moon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white">وضع منتصف الليل (Midnight)</span>
                        {appTheme === "midnight" && (
                          <span className="text-[10px] font-bold bg-indigo-500 text-white px-2 py-0.5 rounded-full">نشط</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        النمط الداكن الفاخر بحواف زرقاء وداكنة، مريح للعينين في الإضاءة المنخفضة والأوقات المسائية.
                      </p>
                    </div>
                  </button>

                  {/* Paper Option */}
                  <button
                    type="button"
                    onClick={() => handleSetAppTheme("paper")}
                    className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex items-start gap-3 relative overflow-hidden ${
                      appTheme === "paper"
                        ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-500 shadow-lg shadow-amber-500/20 ring-1 ring-amber-500"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 border border-amber-500/30">
                      <Sun className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-black ${appTheme === "paper" ? "text-slate-900" : "text-white"}`}>
                          وضع الورق (Paper Light)
                        </span>
                        {appTheme === "paper" && (
                          <span className="text-[10px] font-bold bg-amber-600 text-white px-2 py-0.5 rounded-full">نشط</span>
                        )}
                      </div>
                      <p className={`text-[11px] mt-1 leading-relaxed ${appTheme === "paper" ? "text-slate-700" : "text-slate-400"}`}>
                        نمط ورقي ناصع عالي التباين والأناقة مخصص للقراءة الواضحة وجلسات المذاكرة الطويلة.
                      </p>
                    </div>
                  </button>
                </div>

                {/* Live Preview Bar for Theme */}
                <div className={`p-3.5 rounded-xl border text-xs font-medium flex items-center justify-between gap-3 transition-colors ${
                  appTheme === "paper"
                    ? "bg-stone-100 text-stone-900 border-stone-300"
                    : "bg-[#080d1e] text-slate-200 border-white/10"
                }`}>
                  <span className="font-bold">معاينة مباشرة للنمط المختار:</span>
                  <span className="font-semibold">الميزانية العمومية • الأصول والالتزامات والمعايير المحاسبية</span>
                </div>
              </div>

              {/* Lesson Font Size Control */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-white flex items-center gap-2">
                    <Type className="w-4 h-4 text-purple-400" />
                    <span>حجم خط الدروس والقراءة والمقررات:</span>
                  </h4>
                  <span className="text-[11px] font-bold text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-lg border border-purple-500/30">
                    {fontSize === "sm" ? "صغير" : fontSize === "md" ? "افتراضي (متوسط)" : fontSize === "lg" ? "كبير" : "كبير جداً"}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "sm", label: "صغير (14px)", sizeClass: "text-xs" },
                    { id: "md", label: "متوسط (16px)", sizeClass: "text-sm" },
                    { id: "lg", label: "كبير (18px)", sizeClass: "text-base" },
                    { id: "xl", label: "كبير جداً (20px)", sizeClass: "text-lg" }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSetFontSize(opt.id as any)}
                      className={`py-2.5 px-3 rounded-xl font-black text-xs transition-all cursor-pointer border ${
                        fontSize === opt.id
                          ? "bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30"
                          : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Live Preview Card */}
                <div className="p-4 rounded-xl bg-[#080d1e] border border-purple-500/20 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 block">معاينة مباشرة لحجم خط القراءة:</span>
                  <p className={`font-medium text-slate-200 leading-relaxed transition-all ${
                    fontSize === "sm" ? "text-xs" : fontSize === "md" ? "text-sm" : fontSize === "lg" ? "text-base" : "text-lg"
                  }`}>
                    معادلة الميزانية: يتم إثبات الأصول والالتزامات طبقاً لقواعد القيد المزدوج والمعايير الدولية IFRS.
                  </p>
                </div>
              </div>

              {/* Daily Goal Slider */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-black text-white">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span>هدف دراسة المحاسبة اليومي:</span>
                  </span>
                  <span className="text-indigo-300 font-bold bg-indigo-500/20 px-3 py-1 rounded-xl">
                    {dailyGoalMinutes} دقيقة يومياً
                  </span>
                </div>

                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={dailyGoalMinutes}
                  onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />

                <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                  <span>5 دقائق (خفيف)</span>
                  <span>20 دقيقة (مثالي)</span>
                  <span>60 دقيقة (مكثف)</span>
                </div>
              </div>

              {/* Notification Toggles */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <h4 className="text-xs font-black text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span>تفضيلات التنبيهات والتذكير</span>
                </h4>

                <div className="space-y-2 text-xs">
                  {[
                    { key: "dailyStreak", label: "تذكير الحفاظ على التتابع اليومي 🔥" },
                    { key: "challenges", label: "التحديات اليومية والمسابقات المحاسبية ⚡" },
                    { key: "certAlerts", label: "تنبيهات إتمام المستويات واكتساب الشهادات 🏆" }
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 cursor-pointer">
                      <span className="text-slate-300 font-bold">{item.label}</span>
                      <input
                        type="checkbox"
                        checked={(notifications as any)[item.key]}
                        onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                        className="w-4 h-4 rounded text-indigo-600 accent-indigo-600"
                      />
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
