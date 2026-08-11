import React, { useState, useEffect } from "react";
import { Language } from "../data/translations";
import { getToken } from "../utils/cloudSync";
import {
  Award,
  Download,
  Printer,
  CheckCircle2,
  X,
  ShieldCheck,
  QrCode,
  Sparkles,
  UserCheck,
  Share2,
  BookOpen
} from "lucide-react";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  totalXp?: number;
  completedLessonsCount?: number;
  appLanguage?: Language;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  userName,
  totalXp = 0,
  completedLessonsCount = 0,
  appLanguage = "ar"
}) => {
  const isEn = appLanguage === "en";
  const [studentName, setStudentName] = useState(userName || (isEn ? "John Doe" : "عبدالله محمد السعيد"));
  const [jobTitle, setJobTitle] = useState(isEn ? "Certified Financial Accountant / Auditor" : "محاسب مالي معتمد / مراجع حسابات");
  const [trackName, setTrackName] = useState(isEn ? "Financial Accounting & IFRS Diploma" : "دبلوم المحاسبة المالية والمعايير الدولية (IFRS)");
  const [issueDate, setIssueDate] = useState(new Date().toLocaleDateString(isEn ? "en-US" : "ar-SA"));
  const [certId, setCertId] = useState(`MIZAN-${Math.floor(10000 + Math.random() * 90000)}`);
  const [isCopied, setIsCopied] = useState(false);
  const [verifyState, setVerifyState] = useState<"pending" | "registered" | "local">("pending");

  const verifyUrl = `${window.location.origin}/verify/${certId}`;

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    (async () => {
      const token = getToken();
      try {
        const res = await fetch("/api/certificates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            studentName: studentName.trim() || "متداول ميزان",
            trackName: trackName,
            jobTitle: jobTitle,
          }),
        });
        const data = await res.json();
        if (!cancelled && res.ok && data.certificate?.id) {
          setCertId(data.certificate.id);
          setVerifyState("registered");
          return;
        }
      } catch {
        // offline / server unreachable → local certificate only
      }
      if (!cancelled) setVerifyState("local");
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(verifyUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      {/* Non-printable modal container */}
      <div className="bg-[#0b1329] border border-amber-500/30 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative print:border-none print:shadow-none print:bg-white print:max-w-none print:w-full">
        
        {/* Header Controls (Hidden during print) */}
        <div className="p-4 bg-[#0d1633] border-b border-amber-500/20 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">مولد الشهادات الرقمية المعتمدة</h3>
              <p className="text-xs text-slate-400">احصل على شهادة إتمام المسار المحاسبي بصيغة PDF جاهزة للطباعة والربط الوظيفي</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3.5 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{isCopied ? "تم نسخ رابط التحقق!" : "مشاركة الرابط"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة / حفظ PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Customization Bar (Hidden during print) */}
        <div className="p-4 bg-black/40 border-b border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs print:hidden">
          <div>
            <label className="block text-slate-400 font-bold mb-1">اسم المتدرب بالشهادة:</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-white font-bold focus:border-amber-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-bold mb-1">المسمى المهني / الوظيفي:</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-white font-bold focus:border-amber-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-bold mb-1">عنوان الدبلوم أو المسار:</label>
            <input
              type="text"
              value={trackName}
              onChange={(e) => setTrackName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-white font-bold focus:border-amber-400 outline-none"
            />
          </div>
        </div>

        {/* CERTIFICATE CANVAS FOR PRINT / DISPLAY */}
        <div className="p-6 sm:p-10 bg-[#0d1322] text-slate-100 flex items-center justify-center print:p-0 print:bg-white print:text-slate-900">
          <div className="w-full max-w-3xl border-8 border-double border-amber-500/60 p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#11182d] via-[#0e1526] to-[#0a0f1d] relative overflow-hidden shadow-2xl print:border-amber-600 print:bg-white print:text-black">
            
            {/* Watermark & Frame Ornaments */}
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Certificate Header */}
            <div className="text-center space-y-3 border-b border-amber-500/30 pb-6">
              <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-black text-xs tracking-wider uppercase print:bg-amber-100 print:text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>شهادة إتمام معتمدة • الميزان المحاسبي الذكي</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 tracking-tight font-serif print:text-amber-900">
                شهادة إتمام وتفوق محاسبي
              </h1>
              <p className="text-xs text-slate-400 font-sans print:text-slate-600">CERTIFICATE OF ACCOUNTING EXCELLENCE & MASTERY</p>
            </div>

            {/* Body Content */}
            <div className="py-8 text-center space-y-6">
              <p className="text-sm text-slate-300 font-bold print:text-slate-700">
                تشهد منصة الميزان للتعليم المحاسبي والمالي بأن المحاسب القدير:
              </p>

              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black text-white underline decoration-amber-500/60 underline-offset-8 print:text-black">
                  {studentName || "اسم المحاسب"}
                </h2>
                <p className="text-xs text-amber-400/90 font-semibold print:text-amber-800">{jobTitle}</p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto print:text-slate-800">
                قد أتم بنجاح واقتدار متطلبات الاختبارات العملية، والتطبيقات المحاسبية، والقاموس المالي في:
              </p>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 max-w-lg mx-auto print:bg-amber-50 print:border-amber-300">
                <h3 className="text-base sm:text-lg font-black text-amber-300 print:text-amber-900">
                  {trackName}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 print:text-slate-600">
                  بإجمالي خبرة مكتسبة <span className="text-amber-400 font-black">{totalXp} XP</span> وإتقان المعايير الدولية IFRS والقيود اليومية
                </p>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-2 max-w-md mx-auto text-center text-xs border-t border-b border-white/10 py-3 print:border-slate-300">
                <div>
                  <div className="text-slate-400 text-[10px] print:text-slate-600">الدروس المنجزة</div>
                  <div className="font-black text-amber-400 text-sm print:text-black">{completedLessonsCount} درساً</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] print:text-slate-600">نسبة التقييم</div>
                  <div className="font-black text-emerald-400 text-sm print:text-emerald-800">100% ممتاز</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] print:text-slate-600">حالة الاعتماد</div>
                  <div className="font-black text-indigo-300 text-sm flex items-center justify-center gap-1 print:text-indigo-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>موثق رقمياً</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Seals & Verification */}
            <div className="pt-4 border-t border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              {/* QR Verification */}
              <div className="flex items-center gap-3 bg-black/30 p-2.5 rounded-2xl border border-white/10 print:bg-slate-100 print:border-slate-300">
                <div className="p-2 bg-white rounded-xl text-slate-900">
                  <QrCode className="w-8 h-8" />
                </div>
<div className="text-right">
                  <div className="text-[10px] text-slate-400 font-bold print:text-slate-600">كود التحقق الرقمي:</div>
                  <div className="font-mono text-amber-400 font-black text-xs print:text-slate-900">{certId}</div>
                  <div className="text-[9px] text-emerald-400 font-extrabold print:text-emerald-800">
                    {verifyState === "registered"
                      ? "موثقة ومسجلة في سجل منصة ميزان"
                      : verifyState === "pending"
                      ? "جاري توثيق الشهادة..."
                      : "نسخة محلية — وثّقها بالاتصال بالإنترنت"}
                  </div>
                </div>
              </div>

              {/* Official Seal & Date */}
              <div className="text-center sm:text-left space-y-1">
                <div className="text-[10px] text-slate-400 print:text-slate-600">تاريخ الإصدار: <span className="text-white font-bold print:text-black">{issueDate}</span></div>
                <div className="flex items-center justify-center sm:justify-end gap-1.5 text-amber-400 font-black text-xs print:text-amber-900">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>ختم الاعتماد الرقمي - الميزان</span>
                </div>
              </div>
            </div>

            {/* Verification footer */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[10px] text-slate-400 print:text-slate-600">
              <span>🔗 رابط التحقق الرسمي:</span>
              <a
                href={verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-indigo-300 underline decoration-indigo-400/50 underline-offset-4 hover:text-indigo-200"
              >
                {verifyUrl}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
