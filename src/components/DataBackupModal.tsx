import React, { useState } from "react";
import { Language } from "../data/translations";
import {
  Download,
  Upload,
  FileSpreadsheet,
  FileJson,
  X,
  CheckCircle2,
  AlertCircle,
  Database,
  RefreshCw,
  HardDrive
} from "lucide-react";
import {
  downloadBackupJSON,
  downloadBackupExcel,
  restoreBackupFromJSON
} from "../utils/dataBackup";
import { playSound } from "../utils/soundEffects";

interface DataBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestoreSuccess?: () => void;
  appLanguage?: Language;
}

export const DataBackupModal: React.FC<DataBackupModalProps> = ({
  isOpen,
  onClose,
  onRestoreSuccess,
  appLanguage = "ar"
}) => {
  const isEn = appLanguage === "en";
  const [restoreStatus, setRestoreStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleJSONExport = () => {
    downloadBackupJSON();
    playSound.success();
  };

  const handleExcelExport = () => {
    downloadBackupExcel();
    playSound.success();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setRestoreStatus(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setTimeout(() => {
        const result = restoreBackupFromJSON(content);
        setRestoreStatus(result);
        setIsProcessing(false);

        if (result.success) {
          playSound.levelUp();
          if (onRestoreSuccess) onRestoreSuccess();
        } else {
          playSound.error();
        }
      }, 500);
    };

    reader.onerror = () => {
      setIsProcessing(false);
      setRestoreStatus({ success: false, message: isEn ? "Failed to read file." : "تعذر قراءة الملف المرفق." });
      playSound.error();
    };

    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0b1329] border border-indigo-500/30 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative space-y-6 p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">{isEn ? "Data Backup & Export" : "تصدير واستيراد البيانات (Data Backup)"}</h3>
              <p className="text-xs text-slate-400">
                {isEn
                  ? "Save a backup of your notes, progress, and streak to restore anytime"
                  : "حفظ نسخة احتياطية من ملاحظاتك وسجل التكرار والتقدم واستعادتها بضغطة زر"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Options */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
            <Download className="w-4 h-4 text-emerald-400" />
            <span>{isEn ? "1. Export Data Backup:" : "1. تصدير نسخة احتياطية من بياناتك:"}</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Excel Download Button */}
            <button
              onClick={handleExcelExport}
              className="p-4 rounded-2xl bg-[#0f1b36] border border-emerald-500/30 hover:border-emerald-400 text-right rtl:text-right ltr:text-left space-y-2 group transition-all cursor-pointer hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between">
                <FileSpreadsheet className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-black">XLSX</span>
              </div>
              <div>
                <div className="text-xs font-black text-white">{isEn ? "Export to Excel" : "تصدير إلى ملف Excel"}</div>
                <div className="text-[11px] text-slate-400">{isEn ? "Spreadsheet containing notes & progress" : "تنزيل شيت يحتوي الملاحظات والتكرار المتباعد"}</div>
              </div>
            </button>

            {/* JSON Download Button */}
            <button
              onClick={handleJSONExport}
              className="p-4 rounded-2xl bg-[#0f1b36] border border-indigo-500/30 hover:border-indigo-400 text-right rtl:text-right ltr:text-left space-y-2 group transition-all cursor-pointer hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between">
                <FileJson className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-black">JSON</span>
              </div>
              <div>
                <div className="text-xs font-black text-white">{isEn ? "Export as JSON File" : "تصدير كملف نظام JSON"}</div>
                <div className="text-[11px] text-slate-400">{isEn ? "Full system backup for instant restore" : "نسخة برمجية شاملة للاستعادة الفورية"}</div>
              </div>
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="space-y-3 pt-3 border-t border-white/10">
          <h4 className="text-xs font-black text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
            <Upload className="w-4 h-4 text-amber-400" />
            <span>{isEn ? "2. Import & Restore Backup:" : "2. استيراد واستعادة نسخة سابقة:"}</span>
          </h4>

          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
              id="mizan-file-import"
            />
            <label
              htmlFor="mizan-file-import"
              className="w-full p-6 rounded-2xl border-2 border-dashed border-amber-500/30 hover:border-amber-400 bg-amber-500/5 hover:bg-amber-500/10 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-all"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold animate-pulse">
                  <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
                  <span>{isEn ? "Analyzing and restoring backup..." : "جاري تحليل واستعادة النسخة الاحتياطية..."}</span>
                </div>
              ) : (
                <>
                  <HardDrive className="w-8 h-8 text-amber-400" />
                  <span className="text-xs font-black text-white">{isEn ? "Click here to upload JSON backup file" : "اضغط هنا لرفع ملف النسخة الاحتياطية (JSON)"}</span>
                  <span className="text-[11px] text-slate-400">{isEn ? "Merges notes, test scores, and XP instantly" : "سيتم دمج الملاحظات ونتائج الاختبارات ومستوى الخبرة فوراً"}</span>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Status Message Alert */}
        {restoreStatus && (
          <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-bold animate-fadeIn ${
            restoreStatus.success
              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-200"
              : "bg-rose-500/15 border-rose-500/40 text-rose-200"
          }`}>
            {restoreStatus.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{restoreStatus.message}</span>
          </div>
        )}

      </div>
    </div>
  );
};
