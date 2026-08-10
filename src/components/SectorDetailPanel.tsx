import React, { useState } from "react";
import { ActiveTab } from "../types";
import { SectorRoadmap } from "./AccountingSectorsSection";
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Layers,
  HelpCircle,
  Briefcase,
  Play,
  Calculator,
  X,
  ChevronRight,
  AlertTriangle,
  FileCheck
} from "lucide-react";

interface SectorDetailPanelProps {
  sector: SectorRoadmap;
  isEn?: boolean;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenOdooWithEntry?: (entryData: any) => void;
}

  const getEnrichedStageData = (stg: any, sector: SectorRoadmap) => {
    return {
      number: stg.number,
      title: stg.title,
      description: stg.description,
      duration: stg.duration,
      keySkills: stg.keySkills || [],
      detailedExplanation: stg.detailedExplanation || `تعتبر هذه المرحلة (${stg.title}) ركيزة عملية محورية ضمن مسار التخصص في قطاع ${sector.name}.\n\nفي هذه المرحلة، يتولى المحاسب مسئولية إدارة وتدقيق العمليات والتوجيه المحاسبي المتعلق بـ "${stg.description}". يُطبّق في هذه المرحلة معايير المحاسبة المعتمدة (مثل المعيار الدولي للتقارير المالية IFRS أو المعايير المحلية) للتحقق من سلامة القيود واختيار الحسابات الصحيحة من شجرة الحسابات، مع ربط كل حركة بمركز التكلفة الخاص بها.\n\nيتيح لك إتقان هذه المرحلة قدرة فائقة على تقديم التقارير المالية الدقيقة للإدارة العليا والمراجعين، بالإضافة إلى حماية أصول وتدفقات الشركة المالية.`,
      practicalSteps: stg.practicalSteps || [
        `استلام وفحص الفواتير والمستندات المؤيدة للعملية الميدانية والتحقق من التوقيعات المعتمدة.`,
        `اختيار الحسابات المناسبة من شجرة حسابات ${sector.name} وربطها برقم مركز التكلفة.`,
        `تسجيل وتدقيق قيد اليومية المزدوج (مدين / دائن) مع توضيح شرح البيان بشكل دقيق.`,
        `تحديث السجلات المساعدة ومطابقة الحسابات الدورية (مثل مطابقة كشف الحساب والبنك والعملاء والموردين).`,
        `أرشفة المستندات ورفع القيد إلى نظام الـ ERP أو محاكي أودو Odoo وإصدار التقارير التشغيلية.`
      ],
      documentsNeeded: stg.documentsNeeded || [
        `فواتير ضريبية إلكترونية معتمدة / استمارة طلب صرف`,
        `إذن استلام أو إذن صرف مخزني / كشف حركة العمليات`,
        `محضر استلام معتمد / مستخلص جاري أو ختامي`,
        `إشعار خصم / إضافة بنكي أو شيك سداد معتمد`
      ],
      stageEntry: stg.stageEntry || {
        title: `القيد اليومي الخاص بالمرحلة ${stg.number} - ${stg.title}`,
        debitAcc: sector.featuredEntry.debitAcc,
        debitCode: sector.featuredEntry.debitCode,
        creditAcc: sector.featuredEntry.creditAcc,
        creditCode: sector.featuredEntry.creditCode,
        sampleAmount: sector.featuredEntry.sampleAmount,
        explanation: `إثبات العمليات المالية والتسويات الخاصة بـ (${stg.title}) لقطاع ${sector.name}`
      },
      commonMistakes: stg.commonMistakes || [
        `تأخير تسجيل الحركة المستندية مما يتسبب في تراكم التسويات وفقدان أثر المراجعة الدقيقة.`,
        `إغفال تحديد مركز التكلفة الفرعي أو خطأ التوجيه المحاسبي بين الحسابات الرأسمالية والتشغيلية.`,
        `عدم التأكد من النسب الضريبية المستحقة (مثل خصم ضريبة القيمة المضافة 14% أو ضريبة الأرباح التجارية 1%).`
      ],
      interviewTip: stg.interviewTip || `عند سؤالك في مقابلة العمل (Interview) عن موضوع (${stg.title})، ابدأ بدرح الدورة المستندية بوضوح، وذكر المعيار المحاسبي المطبق والقيد اليومي الأساسي بثقة!`
    };
  };

export function SectorDetailPanel({
  sector,
  isEn = false,
  onSelectTab,
  onOpenOdooWithEntry
}: SectorDetailPanelProps) {
  const [activeStageModal, setActiveStageModal] = useState<{ stage: any; sector: SectorRoadmap } | null>(null);

  const handleApplyEntryToOdoo = () => {
    if (onOpenOdooWithEntry) {
      onOpenOdooWithEntry({
        explanation: sector.featuredEntry.title + " - " + sector.featuredEntry.explanation,
        items: [
          {
            accountCode: sector.featuredEntry.debitCode,
            debit: sector.featuredEntry.sampleAmount,
            credit: 0,
            label: sector.featuredEntry.debitAcc
          },
          {
            accountCode: sector.featuredEntry.creditCode,
            debit: 0,
            credit: sector.featuredEntry.sampleAmount,
            label: sector.featuredEntry.creditAcc
          }
        ]
      });
    } else {
      onSelectTab("odooJournal");
    }
  };

  return (
    <>
<div className="bg-[#120B21] border-2 border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 animate-fadeIn">
  
  {/* Detailed Header Bar */}
  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
    <div className="flex items-center gap-4">
      <div className="p-4 rounded-3xl bg-gradient-to-br from-[#714B67] via-[#00A09D] to-indigo-600 text-white shadow-xl shadow-purple-900/50">
        {React.createElement(sector.icon, { className: "w-8 h-8" })}
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="text-xl sm:text-3xl font-black text-white">{sector.name}</h3>
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-black">
            {sector.badge}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl">
          {sector.fullOverview}
        </p>
      </div>
    </div>

    <div className="bg-[#1C122E] border border-white/10 rounded-2xl p-4 text-xs space-y-1.5 min-w-[240px]">
      <div className="text-slate-400 font-bold">متوسط راتب التخصص:</div>
      <div className="text-base font-black text-emerald-300 font-mono">{sector.averageSalaryRange}</div>
      <div className="text-[10px] text-slate-400">حسب حجم الشركة والخبرة العملية</div>
    </div>
  </div>

  {/* Key Job Roles & Responsibilities Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-[#1A112C] border border-purple-500/20 rounded-2xl p-5 space-y-3">
      <h4 className="text-sm font-black text-purple-200 flex items-center gap-2">
        <Briefcase className="w-4 h-4 text-purple-400" />
        <span>المسميات الوظيفية المتاحة في هذا القطاع:</span>
      </h4>
      <div className="flex flex-wrap gap-2">
        {sector.targetRoles.map((role, idx) => (
          <span
            key={idx}
            className="px-3 py-1.5 rounded-xl bg-purple-500/15 text-purple-200 border border-purple-400/25 text-xs font-bold"
          >
            💼 {role}
          </span>
        ))}
      </div>
    </div>

    <div className="bg-[#1A112C] border border-purple-500/20 rounded-2xl p-5 space-y-3">
      <h4 className="text-sm font-black text-emerald-200 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span>أهم المسئوليات اليومية للمحاسب:</span>
      </h4>
      <ul className="space-y-2 text-xs text-slate-300 font-medium">
        {sector.keyResponsibilities.map((resp, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-emerald-400 font-bold">•</span>
            <span>{resp}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>

  {/* STEP-BY-STEP ROADMAP STAGES */}
  <div className="space-y-4">
    <div className="flex items-center justify-between border-b border-white/10 pb-3">
      <h4 className="text-lg font-black text-white flex items-center gap-2">
        <Layers className="w-5 h-5 text-amber-400" />
        <span>خريطة المراحل والخطوات العملية للاحتراف (Step-by-Step Roadmap):</span>
      </h4>
      <span className="text-xs text-amber-300 font-bold">
        إجمالي المراحل: {sector.stages.length} مراحل تفاعلية
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sector.stages.map((stg) => (
        <div
          key={stg.number}
          onClick={() => setActiveStageModal({ stage: stg, sector: sector })}
          className="bg-[#180F2A] border border-white/10 hover:border-amber-400/60 rounded-2xl p-5 space-y-3 transition-all hover:bg-[#1f1337] cursor-pointer group shadow-lg hover:shadow-amber-500/10 hover:scale-[1.01]"
        >
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black">
              المرحلة {stg.number}
            </span>
            <span className="text-xs text-slate-400 font-bold">⏱️ المدة: {stg.duration}</span>
          </div>

          <h5 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
            <span>{stg.title}</span>
            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              شرح شامل 📖
            </span>
          </h5>
          <p className="text-xs text-slate-300 leading-relaxed font-medium line-clamp-2">{stg.description}</p>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {stg.keySkills.slice(0, 3).map((sk, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-lg bg-white/5 text-slate-300 border border-white/10 text-[10px] font-bold"
                >
                  ⚡ {sk}
                </span>
              ))}
            </div>

            <span className="text-xs font-black text-amber-300 group-hover:text-amber-200 flex items-center gap-1 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-400/30 shrink-0">
              <span>عرض الشرح</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* FEATURED SECTOR JOURNAL ENTRY WITH ODOO SIMULATION BUTTON */}
  <div className="bg-gradient-to-r from-[#1B1130] via-[#24133F] to-[#120B20] border-2 border-emerald-500/40 rounded-3xl p-6 space-y-5 shadow-2xl">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-black">
          <Calculator className="w-3.5 h-3.5" />
          <span>القيد اليومي المحوري الخاص بقطاع {sector.name}</span>
        </div>
        <h4 className="text-lg font-black text-white">{sector.featuredEntry.title}</h4>
      </div>

      <button
        onClick={handleApplyEntryToOdoo}
        className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:opacity-90 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-emerald-950 transition-all cursor-pointer hover:scale-105 border border-white/20"
      >
        <Play className="w-4 h-4 text-emerald-200 fill-current" />
        <span>تحميل وتطبيق القيد فوراً في محاكي أودو Odoo 🚀</span>
      </button>
    </div>

    <p className="text-xs text-slate-300 font-medium leading-relaxed">
      {sector.featuredEntry.description}
    </p>

    {/* Interactive Entry Box Showcase */}
    <div className="bg-[#0C0617] border border-white/10 rounded-2xl p-4 font-mono text-xs space-y-2">
      <div className="flex justify-between border-b border-white/10 pb-2 text-slate-400 font-bold font-sans">
        <span>الطرف / الحساب المحاسبي</span>
        <span>النوع / المبلغ</span>
      </div>

      <div className="flex items-center justify-between text-red-300 font-bold">
        <span className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px]">Dr مدين</span>
          <span>{sector.featuredEntry.debitAcc}</span>
        </span>
        <span>{sector.featuredEntry.sampleAmount.toLocaleString("ar-EG")} ج.م</span>
      </div>

      <div className="flex items-center justify-between text-emerald-300 font-bold pr-6">
        <span className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">Cr دائن</span>
          <span>{sector.featuredEntry.creditAcc}</span>
        </span>
        <span>{sector.featuredEntry.sampleAmount.toLocaleString("ar-EG")} ج.م</span>
      </div>

      <div className="pt-2 border-t border-white/10 text-[11px] text-slate-400 font-sans italic">
        البيان: {sector.featuredEntry.explanation}
      </div>
    </div>
  </div>

  {/* CHART OF ACCOUNTS HIGHLIGHTS FOR THIS SECTOR */}
  <div className="space-y-4">
    <h4 className="text-base font-black text-white flex items-center gap-2">
      <BookOpen className="w-5 h-5 text-indigo-400" />
      <span>أبرز حسابات شجرة الحسابات (Chart of Accounts) لقطاع {sector.name}:</span>
    </h4>

    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0c0717]">
      <table className="w-full text-right text-xs">
        <thead className="bg-[#1C122E] text-purple-200 font-black">
          <tr>
            <th className="p-3">رمز الحساب (Code)</th>
            <th className="p-3">اسم الحساب (Account Name)</th>
            <th className="p-3">الفئة المحاسبية</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-slate-200 font-bold">
          {sector.coaHighlights.map((acc, idx) => (
            <tr key={idx} className="hover:bg-purple-500/10 transition-colors">
              <td className="p-3 font-mono text-purple-300">{acc.code}</td>
              <td className="p-3 text-white">{acc.name}</td>
              <td className="p-3 text-slate-400">{acc.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* INTERVIEW QUESTIONS & ANSWERS FOR THIS SECTOR */}
  <div className="space-y-4">
    <h4 className="text-base font-black text-white flex items-center gap-2">
      <HelpCircle className="w-5 h-5 text-amber-400" />
      <span>أسئلة المقابلات الشخصية (Accounting Job Interview Q&A) الخاصة بالقطاع:</span>
    </h4>

    <div className="space-y-3">
      {sector.interviewQuestions.map((qa, idx) => (
        <div
          key={idx}
          className="bg-[#180E2A] border border-purple-500/20 rounded-2xl p-4 space-y-2 text-xs"
        >
          <div className="font-black text-amber-300 flex items-start gap-2">
            <span>❓</span>
            <span>{qa.question}</span>
          </div>
          <div className="text-slate-200 font-medium leading-relaxed pr-6 bg-purple-950/30 p-3 rounded-xl border border-purple-500/10">
            <span className="font-bold text-emerald-400">الإجابة النموذجية: </span>
            {qa.answer}
          </div>
        </div>
      ))}
    </div>
  </div>

</div>

{/* DETAILED STAGE MODAL */}
{activeStageModal && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
    {(() => {
      const stgData = getEnrichedStageData(
        activeStageModal.stage,
        activeStageModal.sector
      );
      const totalStages = activeStageModal.sector.stages.length;
      const currentStageNum = stgData.number;

      const handlePrevStage = () => {
        const prev = activeStageModal.sector.stages.find(
          (s) => s.number === currentStageNum - 1
        );
        if (prev) {
          setActiveStageModal({
            stage: prev,
            sector: activeStageModal.sector
          });
        }
      };

      const handleNextStage = () => {
        const next = activeStageModal.sector.stages.find(
          (s) => s.number === currentStageNum + 1
        );
        if (next) {
          setActiveStageModal({
            stage: next,
            sector: activeStageModal.sector
          });
        }
      };

      const handleApplyStageEntryToOdoo = () => {
        if (onOpenOdooWithEntry) {
          onOpenOdooWithEntry({
            explanation: `${stgData.stageEntry.title} - ${stgData.stageEntry.explanation}`,
            items: [
              {
                accountCode: stgData.stageEntry.debitCode,
                debit: stgData.stageEntry.sampleAmount,
                credit: 0,
                label: stgData.stageEntry.debitAcc
              },
              {
                accountCode: stgData.stageEntry.creditCode,
                debit: 0,
                credit: stgData.stageEntry.sampleAmount,
                label: stgData.stageEntry.creditAcc
              }
            ]
          });
        } else {
          onSelectTab("odooJournal");
        }
        setActiveStageModal(null);
      };

      return (
        <div className="bg-[#130B22] border-2 border-amber-400/50 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 space-y-6 shadow-2xl relative text-right text-white">
          {/* Modal Close Button */}
          <button
            onClick={() => setActiveStageModal(null)}
            className="absolute top-5 left-5 p-2 rounded-full bg-white/10 hover:bg-red-500/30 text-slate-300 hover:text-white transition-all cursor-pointer z-10 border border-white/10"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="space-y-3 border-b border-white/10 pb-5 pl-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-black">
                المرحلة {stgData.number} من {totalStages}
              </span>
              <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-bold">
                قطاع: {activeStageModal.sector.name}
              </span>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold mr-auto">
                ⏱️ المدة المقترحة: {stgData.duration}
              </span>
            </div>

            <h3 className="text-xl sm:text-3xl font-black text-amber-300 flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-amber-400 shrink-0" />
              <span>{stgData.title}</span>
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed bg-purple-950/40 p-3.5 rounded-2xl border border-purple-500/20">
              {stgData.description}
            </p>
          </div>

          {/* 1. الشرح التفصيلي والتطبيقي الكامل للمرحلة */}
          <div className="bg-[#190F2E] border border-amber-500/20 rounded-2xl p-5 space-y-3">
            <h4 className="text-sm font-black text-amber-300 flex items-center gap-2 border-b border-white/10 pb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>1. الشرح التخصصي والدورة العملية للمرحلة:</span>
            </h4>
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium whitespace-pre-line">
              {stgData.detailedExplanation}
            </div>
          </div>

          {/* 2. الخطوات العملية والدورة المستندية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Practical Execution Steps */}
            <div className="bg-[#180E2B] border border-purple-500/20 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-black text-purple-200 flex items-center gap-2 border-b border-white/10 pb-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>2. خطوات التنفيذ الميداني (Step-by-Step):</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300 font-medium">
                {stgData.practicalSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold font-mono">
                      0{idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Documents */}
            <div className="bg-[#180E2B] border border-purple-500/20 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-black text-emerald-200 flex items-center gap-2 border-b border-white/10 pb-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>3. الدورة المستندية والمستندات المطلوبة:</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300 font-medium">
                {stgData.documentsNeeded.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. نموذج القيد اليومي للمرحلة */}
          <div className="bg-gradient-to-r from-[#1B1130] via-[#24133F] to-[#120B20] border-2 border-emerald-500/40 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span>4. نموذج قيد اليومية الميداني الخاص بهذه المرحلة:</span>
              </h4>
              <button
                onClick={handleApplyStageEntryToOdoo}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-white font-black text-xs flex items-center gap-1.5 shadow-lg cursor-pointer transition-all hover:scale-105"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>تطبيق القيد في أودو Odoo 🚀</span>
              </button>
            </div>

            <div className="bg-[#0C0617] border border-white/10 rounded-xl p-4 font-mono text-xs space-y-2">
              <div className="flex justify-between border-b border-white/10 pb-2 text-slate-400 font-sans font-bold">
                <span>الحساب المحاسبي</span>
                <span>المبلغ المستحق</span>
              </div>

              <div className="flex items-center justify-between text-red-300 font-bold">
                <span className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px]">Dr مدين</span>
                  <span>{stgData.stageEntry.debitAcc}</span>
                </span>
                <span>{stgData.stageEntry.sampleAmount.toLocaleString("ar-EG")} ج.م</span>
              </div>

              <div className="flex items-center justify-between text-emerald-300 font-bold pr-6">
                <span className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">Cr دائن</span>
                  <span>{stgData.stageEntry.creditAcc}</span>
                </span>
                <span>{stgData.stageEntry.sampleAmount.toLocaleString("ar-EG")} ج.م</span>
              </div>

              <div className="pt-2 border-t border-white/10 text-[11px] text-slate-400 font-sans italic">
                البيان: {stgData.stageEntry.explanation}
              </div>
            </div>
          </div>

          {/* 4. أخطاء شائعة وسؤال انترفيو */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Common Mistakes */}
            <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-black text-red-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>أخطاء محاسبية وملاحظات مراجعة تجنبها:</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 font-medium">
                {stgData.commonMistakes.map((mst, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-red-400 font-bold">⚠</span>
                    <span>{mst}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interview Practice Tip */}
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>نصيحة مقابلة العمل (Interview Question):</span>
              </h4>
              <p className="text-xs text-slate-200 font-medium leading-relaxed">
                {stgData.interviewTip}
              </p>
            </div>
          </div>

          {/* Modal Footer Navigation */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            <button
              disabled={currentStageNum === 1}
              onClick={handlePrevStage}
              className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 border ${
                currentStageNum === 1
                  ? "bg-white/5 border-white/5 text-slate-600 cursor-not-allowed"
                  : "bg-white/10 hover:bg-white/20 border-white/20 text-white cursor-pointer"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
              <span>المرحلة السابقة</span>
            </button>

            <button
              onClick={() => setActiveStageModal(null)}
              className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs cursor-pointer shadow-lg"
            >
              إغلاق الشرح ✕
            </button>

            <button
              disabled={currentStageNum === totalStages}
              onClick={handleNextStage}
              className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 border ${
                currentStageNum === totalStages
                  ? "bg-white/5 border-white/5 text-slate-600 cursor-not-allowed"
                  : "bg-amber-500 hover:bg-amber-400 border-amber-400 text-black cursor-pointer shadow-md"
              }`}
            >
              <span>المرحلة التالية</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    })()}
  </div>
)}
    </>
  );
}
