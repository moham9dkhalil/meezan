import React, { useState, useEffect } from "react";
import { getDirectDownloadUrl } from "./AppDownloadModal";
import { Language } from "../data/translations";
import {
  Smartphone,
  Download,
  QrCode,
  ShieldCheck,
  Star,
  Zap,
  WifiOff,
  Bell,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Lock,
  Calculator,
  Bot,
  Edit3,
  Link,
  Check
} from "lucide-react";

interface AppDownloadSectionProps {
  onOpenDownloadModal: () => void;
  onSelectTab?: (tab: any) => void;
  appLanguage?: Language;
}

export const AppDownloadSection: React.FC<AppDownloadSectionProps> = ({
  onOpenDownloadModal,
  onSelectTab,
  appLanguage = "ar"
}) => {
  const isEn = appLanguage === "en";
  const [activeScreen, setActiveScreen] = useState<"home" | "tax" | "quiz">("home");
  const [customApkUrl, setCustomApkUrl] = useState<string>("");
  const [customAppName, setCustomAppName] = useState<string>(isEn ? "Meezan Mobile App" : "تطبيق ميزان المحاسبي");
  const [inlineLinkInput, setInlineLinkInput] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("meezan_custom_apk_url");
    const name = localStorage.getItem("meezan_custom_app_name");
    if (saved) setCustomApkUrl(saved);
    if (name) setCustomAppName(name);
  }, []);

  const handleSaveInlineLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineLinkInput.trim()) return;
    const finalUrl = getDirectDownloadUrl(inlineLinkInput.trim());
    localStorage.setItem("meezan_custom_apk_url", finalUrl);
    setCustomApkUrl(finalUrl);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowQuickAdd(false);
    }, 1500);
  };

  const handleDirectDownload = () => {
    const finalUrl = getDirectDownloadUrl(customApkUrl);
    if (finalUrl) {
      const a = document.createElement("a");
      a.href = finalUrl;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      if (finalUrl.startsWith("blob:") || finalUrl.endsWith(".apk")) {
        a.download = `${customAppName || "app"}.apk`;
      }
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      onOpenDownloadModal();
    }
  };

  return (
    <div className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-slate-100 dir-rtl overflow-hidden">
      {/* Background Decor Lights */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-xl">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black">
            <Sparkles className="w-4 h-4" />
            <span>تطبيق {customAppName} للهواتف الذكية (Android & iOS)</span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/40">
              جديد
            </span>
          </div>

          <button
            onClick={() => setShowQuickAdd(!showQuickAdd)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 text-xs font-bold cursor-pointer transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{customApkUrl ? "تعديل رابط تطبيقك الفعلي" : "+ ربط رابط تطبيقك الفعلي"}</span>
          </button>
        </div>

        {/* Quick Add Form Box */}
        {showQuickAdd && (
          <div className="mb-8 p-5 bg-slate-950/90 border border-emerald-500/40 rounded-2xl animate-fade-in">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Link className="w-4 h-4 text-emerald-400" />
              أدخل رابط برنامجك الفعلي (Google Drive, MediaFire, أو رابط مباشر):
            </h4>
            <form onSubmit={handleSaveInlineLink} className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                value={inlineLinkInput}
                onChange={(e) => setInlineLinkInput(e.target.value)}
                placeholder="https://drive.google.com/file/d/... أو https://mediafire.com/..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white text-left dir-ltr focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>حفظ الرابط</span>
              </button>
            </form>
            {savedSuccess && (
              <p className="text-xs text-emerald-400 font-bold mt-2 flex items-center gap-1">
                <Check className="w-4 h-4" />
                تم حفظ رابط برنامجك بنجاح! سيتم تنزيله مباشرة عند ضغط الزوار.
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text & CTA Column */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              حمل تطبيق <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">{customAppName}</span> على هاتفك الآن!
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              تطبيقك المحاسبي والتعليمي الذكي للهاتف المحمول. استمتع بحاسبة الضرائب، معمل القيود التفاعلي، دليل القوانين ومساعد AI في مكان واحد وبسهولة فائقة!
            </p>

            {/* Status if Linked */}
            {customApkUrl ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-2 text-xs text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>رابط تطبيقك الفعلي مرتبط بنجاح وصالح للتنزيل المباشر!</span>
              </div>
            ) : null}

            {/* Ratings & Quick Metrics */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 pb-2 border-y border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-white">4.9 / 5.0</span>
              </div>

              <div className="text-xs text-slate-400">
                <span className="font-extrabold text-emerald-400">+15,000</span> تحميل فعال
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>مجاني وبدون إعلانات</span>
              </div>
            </div>

            {/* Main Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={handleDirectDownload}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-extrabold rounded-2xl shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-3 cursor-pointer text-base group"
              >
                <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>تحميل البرنامج (APK مباشر)</span>
              </button>

              <button
                onClick={onOpenDownloadModal}
                className="px-6 py-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <QrCode className="w-5 h-5 text-indigo-400" />
                <span>مسح رمز QR أو تعديل الرابط</span>
              </button>
            </div>

            {/* Feature Bullets */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 pt-4">
              <div className="flex items-start gap-2.5 bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl">
                <WifiOff className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">عمل بدون إنترنت</h4>
                  <p className="text-[11px] text-slate-400">مراجعة المفاهيم والدليل أوفلاين</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl">
                <Bell className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">تحديات يومية إشعارية</h4>
                  <p className="text-[11px] text-slate-400">إشعارات تذكيرية ذكية</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl">
                <Zap className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">سرعة استجابة فائقة</h4>
                  <p className="text-[11px] text-slate-400">تصميم سلس ومخصص للشاشات</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl">
                <Lock className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">مزامنة سحابية آمنة</h4>
                  <p className="text-[11px] text-slate-400">حفظ تقدمك ونقاطك تلقائياً</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Mobile Phone Graphic Interactive Device Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[290px] sm:max-w-[320px]">
              
              {/* Outer Glowing Ring */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500 rounded-[48px] blur-lg opacity-40 animate-pulse" />

              {/* Smartphone Frame */}
              <div className="relative bg-slate-950 border-[6px] border-slate-800 rounded-[44px] shadow-2xl p-3 overflow-hidden text-slate-100">
                
                {/* Speaker Notch */}
                <div className="w-28 h-4 bg-slate-800 rounded-full mx-auto mb-3 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-900" />
                  <div className="w-10 h-1 rounded-full bg-slate-900" />
                </div>

                {/* Simulated App Header */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
                      م
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-white">{customAppName}</h4>
                      <p className="text-[9px] text-emerald-400">متصل والمزامنة نشطة</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                    أوفلاين جاهز
                  </span>
                </div>

                {/* Screen Toggle Tabs */}
                <div className="flex bg-slate-900/80 p-1 rounded-xl mb-3 text-[10px] font-bold">
                  <button
                    onClick={() => setActiveScreen("home")}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      activeScreen === "home" ? "bg-indigo-600 text-white" : "text-slate-400"
                    }`}
                  >
                    الرئيسية
                  </button>
                  <button
                    onClick={() => setActiveScreen("tax")}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      activeScreen === "tax" ? "bg-indigo-600 text-white" : "text-slate-400"
                    }`}
                  >
                    دليل الضرائب
                  </button>
                  <button
                    onClick={() => setActiveScreen("quiz")}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      activeScreen === "quiz" ? "bg-indigo-600 text-white" : "text-slate-400"
                    }`}
                  >
                    القيود
                  </button>
                </div>

                {/* Screen Content Box */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 min-h-[260px] space-y-3 text-right">
                  {activeScreen === "home" && (
                    <div className="space-y-2.5 animate-fade-in">
                      <div className="bg-indigo-950/40 border border-indigo-500/30 p-2.5 rounded-xl">
                        <div className="flex justify-between items-center text-[10px] text-indigo-300 font-bold mb-1">
                          <span>التحدي اليومي #14</span>
                          <span className="text-emerald-400">+50 XP</span>
                        </div>
                        <p className="text-xs font-bold text-white">ما هو القيد الصحيح لشراء أصول ثابتة بالأجل؟</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-950/60 border border-slate-800 p-2 rounded-xl text-center">
                          <Calculator className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                          <span className="text-[10px] font-bold text-slate-200 block">حاسبة الضرائب</span>
                        </div>
                        <div className="bg-slate-950/60 border border-slate-800 p-2 rounded-xl text-center">
                          <Bot className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
                          <span className="text-[10px] font-bold text-slate-200 block">مساعد AI</span>
                        </div>
                      </div>

                      <div className="bg-emerald-950/30 border border-emerald-500/20 p-2 rounded-xl text-[10px] text-emerald-300 flex items-center justify-between">
                        <span>قانون القيمة المضافة 2026</span>
                        <ArrowLeft className="w-3 h-3" />
                      </div>
                    </div>
                  )}

                  {activeScreen === "tax" && (
                    <div className="space-y-2 text-xs animate-fade-in">
                      <div className="p-2 bg-slate-950/60 border border-slate-800 rounded-xl">
                        <span className="text-[10px] font-bold text-amber-400 block mb-0.5">ضريبة القيمة المضافة</span>
                        <p className="text-[11px] text-slate-200">النسبة الأساسية: 14% على السلع والخدمات</p>
                      </div>
                      <div className="p-2 bg-slate-950/60 border border-slate-800 rounded-xl">
                        <span className="text-[10px] font-bold text-emerald-400 block mb-0.5">ضريبة كسب العمل</span>
                        <p className="text-[11px] text-slate-200">الإعفاء الشخصي السنوي: 20,000 ج.م</p>
                      </div>
                      <div className="p-2 bg-slate-950/60 border border-slate-800 rounded-xl">
                        <span className="text-[10px] font-bold text-sky-400 block mb-0.5">الفاتورة الإلكترونية</span>
                        <p className="text-[11px] text-slate-200">الربط مع منظومة الفاتورة بورتال</p>
                      </div>
                    </div>
                  )}

                  {activeScreen === "quiz" && (
                    <div className="space-y-2 text-xs animate-fade-in">
                      <span className="text-[10px] text-slate-400 font-bold block">معمل القيود المحاسبية</span>
                      <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">من حـ/ الأصول الثابتة</span>
                          <span className="text-emerald-400 font-mono">10,000</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">إلى حـ/ النقدية</span>
                          <span className="text-emerald-400 font-mono">10,000</span>
                        </div>
                      </div>
                      <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-[10px] text-emerald-300 text-center font-bold">
                        ✓ قيد متوازن وصحيح!
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Home Indicator */}
                <div className="w-20 h-1 bg-slate-700 rounded-full mx-auto mt-3" />
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
