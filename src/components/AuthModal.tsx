import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, LearningTrack } from "../types";
import { AvatarPicker } from "./AvatarPicker";
import {
  signUp,
  signIn,
  signOut,
  resetPassword,
  updateMyProfile,
  upsertProfileFromSession,
} from "../lib/auth";
import { SUPABASE_CONFIGURED } from "../lib/supabase";
import {
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  LogOut,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Briefcase,
  Award,
  Flame,
  Zap,
  Check,
  X,
  ArrowRight,
  Key,
  Globe,
  Settings,
  BookOpen,
  Edit3,
  AlertTriangle
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
  initialMode?: "LOGIN" | "SIGNUP";
}

export function AuthModal({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  initialMode = "LOGIN"
}: AuthModalProps) {
  const [mode, setMode] = useState<"LOGIN" | "SIGNUP" | "FORGOT">(initialMode);
  const [showPassword, setShowPassword] = useState(false);

  // Login inputs
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup inputs
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState("طالب محاسبة");
  const [signupAvatar, setSignupAvatar] = useState("👨‍💼");
  const [signupTrack, setSignupTrack] = useState<LearningTrack>("corporate");

  // Forgot password inputs
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // Profile edit inputs
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("👨‍💼");
  const [editRole, setEditRole] = useState("طالب محاسبة");
  const [editTrack, setEditTrack] = useState<LearningTrack>("corporate");

  // UI state
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setErrorMsg("");
    setSuccessMsg("");
    setIsEditingProfile(false);
    if (currentUser) {
      setEditName(currentUser.name || "");
      setEditAvatar(currentUser.avatar || "👨‍💼");
      setEditRole(currentUser.role || "طالب محاسبة");
      setEditTrack(currentUser.learningTrack || "corporate");
    }
  }, [initialMode, isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      setErrorMsg("يرجى إدخال الاسم المستعار.");
      return;
    }
    if (!currentUser) return;

    setErrorMsg("");
    setLoading(true);
    try {
      const updated = await updateMyProfile({
        name: editName.trim(),
        avatar: editAvatar,
        role: editRole,
        learningTrack: editTrack,
      });
      setLoading(false);
      onLoginSuccess(updated);
      setIsEditingProfile(false);
      setSuccessMsg("تم تحديث معلوماتك ومسارك المفضل بنجاح! ✨");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err?.message || "تعذر تحديث الملف الشخصي.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!loginEmail || !loginPassword) {
      setErrorMsg("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }

    setLoading(true);
    try {
      await signIn(loginEmail.trim(), loginPassword);
      const user = await upsertProfileFromSession();
      setLoading(false);
      if (!user) {
        setErrorMsg("تعذر جلب الملف الشخصي. حاول مجدداً.");
        return;
      }
      onLoginSuccess(user);
      setSuccessMsg("تم تسجيل الدخول بنجاح! مرحباً بك في ميزان ✨");
      setTimeout(() => onClose(), 1000);
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err?.message || "البريد أو كلمة المرور غير صحيحين.");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!signupName.trim()) {
      setErrorMsg("يرجى إدخال الاسم الكامل.");
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes("@")) {
      setErrorMsg("يرجى إدخال بريد إلكتروني صحيح.");
      return;
    }
    if (!signupPassword || signupPassword.length < 6) {
      setErrorMsg("كلمة المرور يجب أن تتكون من 6 أحرف/أرقام على الأقل.");
      return;
    }

    setLoading(true);
    try {
      const { session } = await signUp({
        name: signupName.trim(),
        email: signupEmail.trim(),
        password: signupPassword,
        role: signupRole,
        avatar: signupAvatar,
        learningTrack: signupTrack,
      });

      setLoading(false);

      if (!session) {
        // Email confirmation is required — wait for the user to verify.
        setSuccessMsg("تم إنشاء الحساب! تحقق من بريدك الإلكتروني لتأكيد التسجيل ثم سجّل الدخول ✉️");
        setMode("LOGIN");
        setLoginEmail(signupEmail.trim());
        return;
      }

      const user = await upsertProfileFromSession();
      if (!user) {
        setErrorMsg("تعذر جلب الملف الشخصي.");
        return;
      }
      onLoginSuccess(user);
      setSuccessMsg("تم إنشاء الحساب بنجاح! أهلاً بك في ميزان 🎉");
      setTimeout(() => onClose(), 1200);
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err?.message || "تعذر إنشاء الحساب. حاول مجدداً.");
    }
  };

  const handleLogout = () => {
    signOut()
      .then(() => {
        onLogout();
        onClose();
      })
      .catch(() => {
        onLogout();
        onClose();
      });
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes("@")) {
      setErrorMsg("يرجى كتابة البريد الإلكتروني المسجل لدينا.");
      return;
    }
    setErrorMsg("");
    setLoading(true);
    try {
      await resetPassword(forgotEmail.trim());
      setLoading(false);
      setResetSent(true);
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err?.message || "تعذر إرسال رابط التعيين.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="auth-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-[#0b1022] border border-indigo-500/30 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden relative"
          >
            {/* Glow Spheres */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-indigo-600/10 to-transparent rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-t from-pink-600/10 to-transparent rounded-full pointer-events-none" />

            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-xl shadow-lg border border-white/20">
                  ⚖️
                </div>
                <div>
                  <h3 className="font-black text-base text-white">
                    {currentUser?.isLoggedIn
                      ? "الملف الشخصي"
                      : mode === "LOGIN"
                      ? "تسجيل الدخول إلى ميزان"
                      : mode === "SIGNUP"
                      ? "إنشاء حساب لمحاسب جديد"
                      : "استعادة كلمة المرور"}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    منصة التعلم المحاسبي التفاعلي والشهادات المعتمدة
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center text-sm font-black transition-all cursor-pointer"
              >
                ✕
              </motion.button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 relative z-10 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600/40">

              {!SUPABASE_CONFIGURED && (
                <div className="p-3.5 rounded-2xl bg-amber-950/60 border border-amber-500/50 text-amber-200 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>إعدادات الخادم غير مكتملة: يرجى ضبط متغيرات Supabase (VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY) لتفعيل التسجيل الحقيقي.</span>
                </div>
              )}

              {/* IF ALREADY LOGGED IN: SHOW PROFILE CARD */}
              {currentUser && currentUser.isLoggedIn ? (
                <div className="space-y-5">
                  {errorMsg && (
                    <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                      <span>⚠️</span>
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {successMsg && (
                    <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                      <span>✅</span>
                      <span>{successMsg}</span>
                    </div>
                  )}

                  {isEditingProfile ? (
                    <form onSubmit={handleSaveProfile} className="space-y-4 animate-fadeIn">
                      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-white/10">
                          <span className="text-xs font-black text-indigo-300 flex items-center gap-1.5">
                            <Edit3 className="w-4 h-4" />
                            <span>تعديل الاسم المستعار والرمز التعبيري</span>
                          </span>
                          <span className="text-[10px] text-slate-400">يُحفظ على حسابك على Supabase</span>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-300 block">
                            اختر الصورة الرمزية والشارة المهنية
                          </label>
                          <AvatarPicker
                            compact
                            selectedAvatar={editAvatar}
                            onSelectAvatar={setEditAvatar}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-300 block">
                            الاسم المستعار / الاسم الظاهر
                          </label>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              placeholder="اكتب اسمك المستعار..."
                              className="w-full bg-black/50 border border-white/15 rounded-xl pr-10 pl-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-bold"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-300 block">
                            المسمى الوظيفي / التخصص المحاسبي
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

                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-300 flex items-center justify-between">
                            <span>مسار التعلم المفضل</span>
                            <span className="text-[10px] text-indigo-400 font-normal">لتوجيه ترتيب الدروس</span>
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              type="button"
                              onClick={() => setEditTrack("corporate")}
                              className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                                editTrack === "corporate"
                                  ? "bg-indigo-600/30 border-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                                  : "bg-black/30 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-lg">🏢</span>
                                {editTrack === "corporate" && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                              </div>
                              <div className="font-bold text-[11px]">محاسبة شركات</div>
                            </button>

                            <button
                              type="button"
                              onClick={() => setEditTrack("governmental")}
                              className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                                editTrack === "governmental"
                                  ? "bg-amber-600/30 border-amber-500 text-white shadow-lg shadow-amber-600/20"
                                  : "bg-black/30 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-lg">🏛️</span>
                                {editTrack === "governmental" && <Check className="w-3.5 h-3.5 text-amber-400" />}
                              </div>
                              <div className="font-bold text-[11px]">محاسبة حكومية</div>
                            </button>

                            <button
                              type="button"
                              onClick={() => setEditTrack("auditing")}
                              className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                                editTrack === "auditing"
                                  ? "bg-purple-600/30 border-purple-500 text-white shadow-lg shadow-purple-600/20"
                                  : "bg-black/30 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-lg">🔍</span>
                                {editTrack === "auditing" && <Check className="w-3.5 h-3.5 text-purple-400" />}
                              </div>
                              <div className="font-bold text-[11px]">تدقيق ومراجعة</div>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingProfile(false);
                            setErrorMsg("");
                          }}
                          className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs transition-all cursor-pointer"
                        >
                          إلغاء
                        </button>

                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <span>جاري الحفظ...</span>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              <span>حفظ التغييرات</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/40 text-center space-y-3 relative overflow-hidden">
                        <div className="text-5xl">{currentUser.avatar}</div>

                        <div>
                          <h4 className="text-lg font-black text-white">{currentUser.name}</h4>
                          <p className="text-xs text-indigo-300 font-bold">{currentUser.role}</p>
                          <p className="text-[11px] text-slate-400 mt-1">{currentUser.email}</p>
                          {currentUser.isAdmin && (
                            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-black">
                              🛡️ مشرف المنصة
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
                          <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10 text-center">
                            <span className="text-amber-400 font-black block text-sm">+{currentUser.xp} XP</span>
                            <span className="text-[10px] text-slate-400 font-bold">نقاط الخبرة</span>
                          </div>

                          <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10 text-center">
                            <span className="text-orange-400 font-black block text-sm">{currentUser.streak} أيام</span>
                            <span className="text-[10px] text-slate-400 font-bold">التتابع اليومي</span>
                          </div>

                          <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10 text-center">
                            <span className="text-emerald-400 font-black block text-sm">نشط 🔓</span>
                            <span className="text-[10px] text-slate-400 font-bold">الحالة</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-indigo-400" />
                            <span>تاريخ الانضمام للمنصة:</span>
                          </span>
                          <span className="font-mono text-white font-bold">{currentUser.joinedDate}</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>وصول الشاشات والمستويات:</span>
                          </span>
                          <span className="text-emerald-400 font-black">جميع الـ 32 مرحلة مفتوحة</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingProfile(true);
                            setEditName(currentUser.name || "");
                            setEditAvatar(currentUser.avatar || "👨‍💼");
                            setEditRole(currentUser.role || "طالب محاسبة");
                            setErrorMsg("");
                          }}
                          className="py-3 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 hover:bg-indigo-600/40 text-indigo-200 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                        >
                          <Edit3 className="w-4 h-4 text-indigo-300" />
                          <span>تعديل الاسم والرمز</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="py-3 rounded-2xl bg-rose-600/20 border border-rose-500/40 hover:bg-rose-600/30 text-rose-300 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>تسجيل الخروج</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  {mode !== "FORGOT" && (
                    <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-black/40 border border-white/10">
                      <button
                        type="button"
                        onClick={() => {
                          setMode("LOGIN");
                          setErrorMsg("");
                        }}
                        className={`py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          mode === "LOGIN"
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>تسجيل الدخول</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMode("SIGNUP");
                          setErrorMsg("");
                        }}
                        className={`py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          mode === "SIGNUP"
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>حساب جديد</span>
                      </button>
                    </div>
                  )}

                  {errorMsg && (
                    <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                      <span>⚠️</span>
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {successMsg && (
                    <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                      <span>✅</span>
                      <span>{successMsg}</span>
                    </div>
                  )}

                  {mode === "LOGIN" && (
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-300 block">
                          البريد الإلكتروني
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="example@meezan.app"
                            className="w-full bg-black/40 border border-white/15 rounded-xl pr-10 pl-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-black text-slate-300 block">
                            كلمة المرور
                          </label>
                          <button
                            type="button"
                            onClick={() => setMode("FORGOT")}
                            className="text-[11px] text-indigo-400 hover:underline cursor-pointer"
                          >
                            نسيت كلمة المرور؟
                          </button>
                        </div>

                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type={showPassword ? "text" : "password"}
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-black/40 border border-white/15 rounded-xl pr-10 pl-10 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-medium"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-black text-xs shadow-xl shadow-indigo-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <span>جاري التحقق...</span>
                        ) : (
                          <>
                            <LogIn className="w-4 h-4" />
                            <span>تسجيل الدخول للحساب</span>
                          </>
                        )}
                      </button>

                      <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                        يمكنك استخدام المنصة وتجربة الدروس بدون تسجيل. التسجيل يحفظ تقدّمك (النقاط والتتابع) على حسابك السحابي بشكل دائم.
                      </p>
                    </form>
                  )}

                  {mode === "SIGNUP" && (
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-300 block">
                          الاسم الكامل
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={signupName}
                            onChange={(e) => setSignupName(e.target.value)}
                            placeholder="مثال: عبد العزيز المحاسب"
                            className="w-full bg-black/40 border border-white/15 rounded-xl pr-10 pl-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-300 block">
                          البريد الإلكتروني
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            placeholder="yourname@domain.com"
                            className="w-full bg-black/40 border border-white/15 rounded-xl pr-10 pl-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-300 block">
                          التخصص / المسمى الحالي
                        </label>
                        <select
                          value={signupRole}
                          onChange={(e) => setSignupRole(e.target.value)}
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

                      <div className="space-y-2 p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
                        <label className="text-xs font-black text-indigo-200 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                            <span>اختر مسار التعلم المفضل (التخصص)</span>
                          </span>
                          <span className="text-[10px] text-indigo-300 font-normal">لتخصيص ترتيب الدروس</span>
                        </label>

                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setSignupTrack("corporate")}
                            className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                              signupTrack === "corporate"
                                ? "bg-indigo-600/40 border-indigo-400 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400"
                                : "bg-black/40 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xl">🏢</span>
                              {signupTrack === "corporate" && <Check className="w-4 h-4 text-indigo-300" />}
                            </div>
                            <div className="font-black text-xs text-white">محاسبة شركات</div>
                            <div className="text-[9px] text-slate-400 leading-tight mt-1">القوائم، المعايير IFRS والشركات</div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSignupTrack("governmental")}
                            className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                              signupTrack === "governmental"
                                ? "bg-amber-600/40 border-amber-400 text-white shadow-lg shadow-amber-600/30 ring-1 ring-amber-400"
                                : "bg-black/40 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xl">🏛️</span>
                              {signupTrack === "governmental" && <Check className="w-4 h-4 text-amber-300" />}
                            </div>
                            <div className="font-black text-xs text-white">محاسبة حكومية</div>
                            <div className="text-[9px] text-slate-400 leading-tight mt-1">الميزانية العامة والقطاع الحكومي</div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSignupTrack("auditing")}
                            className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                              signupTrack === "auditing"
                                ? "bg-purple-600/40 border-purple-400 text-white shadow-lg shadow-purple-400/30 ring-1 ring-purple-400"
                                : "bg-black/40 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xl">🔍</span>
                              {signupTrack === "auditing" && <Check className="w-4 h-4 text-purple-300" />}
                            </div>
                            <div className="font-black text-xs text-white">تدقيق ومراجعة</div>
                            <div className="text-[9px] text-slate-400 leading-tight mt-1">معايير ISA والضبط الداخلي</div>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-300 block">
                          اختر الرمز التعبيري والشارة المهنية لملفك
                        </label>
                        <AvatarPicker
                          compact
                          selectedAvatar={signupAvatar}
                          onSelectAvatar={setSignupAvatar}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-300 block">
                          كلمة المرور
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type={showPassword ? "text" : "password"}
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            placeholder="6 أحرف/أرقام على الأقل"
                            className="w-full bg-black/40 border border-white/15 rounded-xl pr-10 pl-10 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-medium"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-black text-xs shadow-xl shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <span>جاري إنشاء الحساب...</span>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            <span>إنشاء الحساب</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {mode === "FORGOT" && (
                    <div className="space-y-4">
                      {resetSent ? (
                        <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-center space-y-3">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center text-xl font-bold">
                            ✉️
                          </div>
                          <h4 className="font-black text-white text-sm">تم إرسال رابط التعيين!</h4>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            قم بفحص صندوق الوارد بريدك الإلكتروني ({forgotEmail}) للوصول لرابط إعادة ضبط كلمة المرور.
                          </p>
                          <button
                            onClick={() => {
                              setMode("LOGIN");
                              setResetSent(false);
                            }}
                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white"
                          >
                            العودة لتسجيل الدخول
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleForgotSubmit} className="space-y-4">
                          <p className="text-xs text-slate-300 leading-relaxed">
                            اكتب بريدك الإلكتروني وسيتم إرسال رابط آمن لإعادة تعيين كلمة المرور الخاصة بك.
                          </p>

                          <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-300 block">
                              البريد الإلكتروني
                            </label>
                            <div className="relative">
                              <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                              <input
                                type="email"
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                placeholder="yourname@domain.com"
                                className="w-full bg-black/40 border border-white/15 rounded-xl pr-10 pl-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-medium"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setMode("LOGIN")}
                              className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs"
                            >
                              إلغاء
                            </button>
                            <button
                              type="submit"
                              disabled={loading}
                              className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg"
                            >
                              {loading ? "جاري الإرسال..." : "إرسال رابط التعيين"}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
