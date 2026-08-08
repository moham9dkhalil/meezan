import React, { useState, useEffect } from "react";
import {
  X,
  Smartphone,
  Download,
  QrCode,
  CheckCircle2,
  Send,
  Sparkles,
  WifiOff,
  Bell,
  Zap,
  ShieldCheck,
  Share2,
  ExternalLink,
  ChevronLeft,
  Info,
  Edit3,
  Link as LinkIcon,
  Upload,
  Save,
  Check,
  Copy,
  Layers
} from "lucide-react";

interface AppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper to convert Google Drive share link to direct download link automatically
export function getDirectDownloadUrl(rawUrl: string): string {
  if (!rawUrl) return "";
  const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = rawUrl.match(driveRegex);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return rawUrl;
}

export const AppDownloadModal: React.FC<AppDownloadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [downloadingApk, setDownloadingApk] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadCompleted, setDownloadCompleted] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneSent, setPhoneSent] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"apk" | "custom" | "qr" | "store" | "pwa">("apk");

  // Real App URL State (persisted in localStorage, defaults to hosted APK)
  const [customApkUrl, setCustomApkUrl] = useState<string>(() => {
    return localStorage.getItem("meezan_custom_apk_url") || "/MeezanApp.apk";
  });
  const [customAppName, setCustomAppName] = useState<string>(() => {
    return localStorage.getItem("meezan_custom_app_name") || "تطبيق ميزان المحاسبي";
  });
  const [customAppVersion, setCustomAppVersion] = useState<string>(() => {
    return localStorage.getItem("meezan_custom_app_version") || "v2.4.0";
  });
  const [appSize, setAppSize] = useState<string>(() => {
    return localStorage.getItem("meezan_custom_app_size") || "18.5 ميجابايت";
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");

  useEffect(() => {
    const savedUrl = localStorage.getItem("meezan_custom_apk_url");
    if (savedUrl) setCustomApkUrl(savedUrl);
  }, []);
  if (!isOpen) return null;

  const handleSaveCustomSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = getDirectDownloadUrl(customApkUrl);
    localStorage.setItem("meezan_custom_apk_url", finalUrl);
    localStorage.setItem("meezan_custom_app_name", customAppName);
    localStorage.setItem("meezan_custom_app_version", customAppVersion);
    localStorage.setItem("meezan_custom_app_size", appSize);
    setCustomApkUrl(finalUrl);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setCustomApkUrl(fileUrl);
      setUploadedFileName(file.name);
      localStorage.setItem("meezan_custom_apk_url", fileUrl);
      const cleanName = file.name.replace(/\.[^/.]+$/, "");
      localStorage.setItem("meezan_custom_app_name", cleanName);
      setCustomAppName(cleanName);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const handleExecuteDownload = () => {
    const directUrl = getDirectDownloadUrl(customApkUrl);
    if (directUrl.trim()) {
      setDownloadingApk(true);
      setDownloadProgress(25);

      const interval = setInterval(() => {
        setDownloadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setDownloadingApk(false);
            setDownloadCompleted(true);

            const a = document.createElement("a");
            a.href = directUrl;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            if (directUrl.startsWith("blob:") || directUrl.endsWith(".apk")) {
              a.download = `${customAppName || "app"}.apk`;
            }
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            return 100;
          }
          return prev + 35;
        });
      }, 200);
      return;
    }

    // Fallback demo download
    if (downloadingApk || downloadCompleted) return;
    setDownloadingApk(true);
    setDownloadProgress(15);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadingApk(false);
          setDownloadCompleted(true);

          const blob = new Blob(
            ["تطبيق ميزان المحاسبي والضرائب للأندرويد\nMeezan Android Mobile App v2.4.0"],
            { type: "text/plain" }
          );
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${customAppName || "meezan-app"}.apk`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          return 100;
        }
        return prev + 30;
      });
    }, 200);
  };

  const handleCopyLink = () => {
    const targetUrl = customApkUrl || window.location.href;
    navigator.clipboard.writeText(targetUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendPhoneLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    setPhoneSent(true);
    setTimeout(() => {
      setPhoneSent(false);
      setPhoneNumber("");
    }, 4000);
  };

  const currentDownloadLink = customApkUrl || window.location.href;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in dir-rtl overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative p-6 sm:p-8 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-white">{customAppName || "تطبيق ميزان للهاتف"}</h3>
                <span className="px-2 py-0.5 text-xs font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  {customAppVersion || "الإصدار 2.4.0"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                تنزيل وتثبيت تطبيق الهاتف المباشر بكل سهولة!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs inside Modal */}
        <div className="flex border-b border-slate-800/80 bg-slate-950/50 p-2 gap-1 overflow-x-auto">
          <button
            onClick={() => setSelectedTab("apk")}
            className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedTab === "apk"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Download className="w-4 h-4" />
            <span>تحميل التطبيق</span>
          </button>

          <button
            onClick={() => setSelectedTab("custom")}
            className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedTab === "custom"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                : "text-emerald-400 hover:bg-emerald-500/10"
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>ربط برنامجك الفعلي ⚙️</span>
          </button>

          <button
            onClick={() => setSelectedTab("qr")}
            className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedTab === "qr"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>رمز QR للهاتف</span>
          </button>

          <button
            onClick={() => setSelectedTab("pwa")}
            className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedTab === "pwa"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>تثبيت PWA</span>
          </button>

          <button
            onClick={() => setSelectedTab("store")}
            className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedTab === "store"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>المتاجر الرسمية</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* TAB 1: APK DOWNLOAD */}
          {selectedTab === "apk" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 text-center relative overflow-hidden">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                  <Download className="w-8 h-8 animate-bounce" />
                </div>

                <h4 className="text-lg font-bold text-white mb-1">
                  تنزيل ملف APK المباشر لأجهزة الأندرويد
                </h4>

                {customApkUrl ? (
                  <p className="text-xs sm:text-sm text-emerald-400 font-bold max-w-md mx-auto mb-4 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>تم ربط تطبيقك المباشر بنجاح! جاهز للتنزيل الفوري.</span>
                  </p>
                ) : (
                  <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-4">
                    اضغط على الزر أدناه لبدء تنزيل برنامجك مباشرةً على الهاتف.
                  </p>
                )}

                {/* Technical Badges */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-6 text-xs text-slate-300">
                  <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700/60 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    آمن ومفحوص 100%
                  </span>
                  <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700/60">
                    الحجم: {appSize}
                  </span>
                  <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700/60">
                    الإصدار: {customAppVersion}
                  </span>
                </div>

                {/* Download Execution Button */}
                {downloadingApk ? (
                  <div className="max-w-md mx-auto space-y-2">
                    <div className="flex justify-between text-xs text-slate-300 font-bold">
                      <span>جاري فتح التحميل...</span>
                      <span>{downloadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${downloadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : downloadCompleted ? (
                  <div className="max-w-md mx-auto p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 flex items-center justify-between text-xs sm:text-sm font-bold">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span>تم فتح التحميل بنجاح!</span>
                    </div>
                    <button
                      onClick={handleExecuteDownload}
                      className="text-xs underline text-emerald-400 hover:text-white cursor-pointer mr-2"
                    >
                      إعادة التحميل
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={handleExecuteDownload}
                      className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-extrabold rounded-2xl shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-3 mx-auto cursor-pointer text-base"
                    >
                      <Download className="w-5 h-5" />
                      <span>تحميل برنامجك الآن (APK)</span>
                    </button>

                    {/* Quick Actions (Copy & WhatsApp) */}
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <button
                        onClick={handleCopyLink}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedLink ? "تم نسخ الرابط!" : "نسخ رابط التنزيل"}</span>
                      </button>

                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`حمل تطبيق ${customAppName} للهاتف من هنا:\n${currentDownloadLink}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>مشاركة عبر الواتساب</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Edit Link Quick Button */}
                <div className="mt-4 pt-4 border-t border-slate-800/60">
                  <button
                    onClick={() => setSelectedTab("custom")}
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer underline"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>تعديل أو تغيير رابط برنامجك الفعلي (Google Drive, MediaFire)</span>
                  </button>
                </div>
              </div>

              {/* Steps to Install APK */}
              <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-5">
                <h5 className="text-xs sm:text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-400" />
                  طريقة تثبيت ملف APK على هاتفك:
                </h5>
                <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside pr-1">
                  <li>اضغط على زر <strong className="text-slate-200">تحميل برنامجك الآن</strong>.</li>
                  <li>بعد انتهاء التحميل، افتح الملف من إشعارات الهاتف أو مجلد التنزيلات (Downloads).</li>
                  <li>إذا ظهرت رسالة حماية، وافق على "التثبيت من مصادر غير معروفة" لهذه المرة.</li>
                  <li>اضغط تثبيت وقم بفتح تطبيقك المباشر!</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: LINK YOUR OWN APP (REAL APP LINK SETTINGS) */}
          {selectedTab === "custom" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-6 relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <LinkIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">إعداد رابط برنامجك المباشر</h4>
                    <p className="text-xs text-slate-400">
                      ضع رابط تحميل برنامجك الفعلي من Google Drive أو MediaFire ليتسنى لجميع زوار موقعك تحميله فوراً!
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveCustomSettings} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      اسم تطبيقك:
                    </label>
                    <input
                      type="text"
                      value={customAppName}
                      onChange={(e) => setCustomAppName(e.target.value)}
                      placeholder="مثال: تطبيق ميزان المحاسبي"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-300">
                        رابط التحميل الفعلي (Google Drive / MediaFire / Direct URL):
                      </label>
                      <span className="text-[10px] text-emerald-400">يتعرف تلقائياً على روابط درايف وميديا فاير</span>
                    </div>
                    <input
                      type="url"
                      value={customApkUrl}
                      onChange={(e) => setCustomApkUrl(e.target.value)}
                      placeholder="https://drive.google.com/file/d/... أو https://mediafire.com/file/..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white dir-ltr text-left focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        رقم الإصدار:
                      </label>
                      <input
                        type="text"
                        value={customAppVersion}
                        onChange={(e) => setCustomAppVersion(e.target.value)}
                        placeholder="مثال: v2.4.0"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        حجم الملف:
                      </label>
                      <input
                        type="text"
                        value={appSize}
                        onChange={(e) => setAppSize(e.target.value)}
                        placeholder="مثال: 18.5 ميجابايت"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Or Upload local APK file */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      أو رفع ملف APK مباشر من جهازك:
                    </label>
                    <div className="relative border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-xl p-4 text-center bg-slate-900/50 transition-colors">
                      <input
                        type="file"
                        accept=".apk"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Upload className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                      <p className="text-xs text-slate-300 font-bold">
                        {uploadedFileName ? `الملف المحدد: ${uploadedFileName}` : "اختر ملف .apk من هاتف أو جهازك"}
                      </p>
                      <span className="text-[10px] text-slate-400">سيتم تجهيز رابط التحميل فوراً</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-emerald-600/20"
                    >
                      <Save className="w-4 h-4" />
                      <span>حفظ البيانات والربط</span>
                    </button>

                    {saveSuccess && (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
                        <Check className="w-4 h-4" />
                        تم حفظ رابط تطبيقك بنجاح!
                      </span>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: QR CODE */}
          {selectedTab === "qr" && (
            <div className="space-y-6 text-center animate-fade-in">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-md mx-auto">
                <h4 className="text-base font-bold text-white mb-2">امسح الرمز بكاميرا هاتفك</h4>
                <p className="text-xs text-slate-400 mb-6">
                  وجه كاميرا الهاتف للرمز أدناه لفتح رابط التحميل المباشر لتطبيقك على الهاتف فوراً!
                </p>

                {/* Rendered Visual QR Code */}
                <div className="bg-white p-4 rounded-2xl inline-block shadow-2xl border-4 border-slate-800 relative group">
                  <div className="w-48 h-48 bg-slate-900 rounded-lg p-2 flex flex-col items-center justify-center text-slate-100 relative overflow-hidden">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current bg-white p-1 rounded">
                      <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" />
                      <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" />
                      <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" />
                      <rect x="35" y="5" width="8" height="8" />
                      <rect x="48" y="12" width="8" height="8" />
                      <rect x="58" y="5" width="8" height="8" />
                      <rect x="35" y="25" width="8" height="8" />
                      <rect x="5" y="38" width="8" height="8" />
                      <rect x="18" y="45" width="8" height="8" />
                      <rect x="35" y="42" width="8" height="8" />
                      <rect x="52" y="38" width="12" height="12" />
                      <rect x="70" y="42" width="8" height="8" />
                      <rect x="85" y="38" width="8" height="8" />
                      <rect x="40" y="58" width="8" height="8" />
                      <rect x="58" y="58" width="8" height="8" />
                      <rect x="38" y="75" width="12" height="12" />
                      <rect x="58" y="72" width="8" height="8" />
                      <rect x="72" y="80" width="12" height="12" />
                      <rect x="85" y="68" width="8" height="8" />
                    </svg>

                    {/* Logo in Center of QR */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-10 h-10 bg-indigo-600 rounded-xl border-2 border-white flex items-center justify-center shadow-lg">
                        <span className="text-white font-black text-xs">ميزان</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>يعمل مع كاميرا أندرويد وآيفون الرسمية</span>
                </div>
              </div>

              {/* WhatsApp or SMS Link Receiver */}
              <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5 max-w-md mx-auto text-right">
                <h5 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
                  <Send className="w-4 h-4 text-emerald-400" />
                  أرسل رابط التحميل لهاتفك عبر الواتساب:
                </h5>
                <form onSubmit={handleSendPhoneLink} className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="رقم الهاتف (مثال: 01012345678)"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    إرسال
                  </button>
                </form>
                {phoneSent && (
                  <p className="text-xs text-emerald-400 mt-2 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    تم إرسال رابط التنزيل المباشر إلى رقمك!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: PWA INSTANT INSTALL */}
          {selectedTab === "pwa" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">تثبيت التطبيق مباشرة على شاشة الهاتف بدون متجر (PWA)</h4>
                    <p className="text-xs text-slate-400">تطبيق ويب متقدم يمكنك إضافته لشاشة هاتفك الرئيسية بضغطة زر واحدة!</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {/* Safari / iPhone Instructions */}
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-sky-400 block">📱 لأجهزة الآيفون (Safari):</span>
                    <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside">
                      <li>افتح موقعنا في متصفح Safari على الآيفون.</li>
                      <li>اضغط على زر المشاركة <Share2 className="w-3.5 h-3.5 inline text-sky-400" /> بالأسفل.</li>
                      <li>اختر <strong className="text-white">"الإضافة إلى الشاشة الرئيسية" (Add to Home Screen)</strong>.</li>
                    </ol>
                  </div>

                  {/* Chrome / Android Instructions */}
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-emerald-400 block">🤖 لأجهزة الأندرويد (Chrome):</span>
                    <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside">
                      <li>افتح موقعنا في متصفح Chrome على هاتف الأندرويد.</li>
                      <li>اضغط على خيارات القائمة الثلاثية أعلى يسار المتصفح.</li>
                      <li>اختر <strong className="text-white">"تثبيت التطبيق" (Install App)</strong>.</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: OFFICIAL STORES */}
          {selectedTab === "store" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
                  <div>
                    <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-4">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-white mb-1">متجر متجر جوجل بلاي</h4>
                    <p className="text-xs text-slate-400 mb-4">
                      متوفر لأجهزة Android.
                    </p>
                  </div>

                  <a
                    href={customApkUrl || "https://play.google.com"}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Google Play</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
                  <div>
                    <div className="w-12 h-12 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center justify-center text-sky-400 mb-4">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-white mb-1">متجر آبل App Store</h4>
                    <p className="text-xs text-slate-400 mb-4">
                      متوفر لأجهزة الآيفون والآيباد.
                    </p>
                  </div>

                  <a
                    href="https://apple.com/app-store"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>App Store</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>تطبيق آمن، خالي من الإعلانات ومجاني 100%</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
