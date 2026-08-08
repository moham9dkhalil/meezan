import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  Users,
  Calculator,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Briefcase,
  Building,
  Sparkles,
  RefreshCw,
  Info,
  CheckCircle2,
  FileText,
  PieChart,
  HelpCircle,
  HelpCircle as QuestionIcon,
  Percent,
  Plus,
  Trash2,
  ChevronLeft
} from "lucide-react";

export interface CustomAllowance {
  id: string;
  name: string;
  amount: number;
}

export interface CustomDeduction {
  id: string;
  name: string;
  amount: number;
}

export interface PresetPayrollSystem {
  id: string;
  name: string;
  currency: string;
  gosiEmployeeRate: number; // e.g. 0.0975 (9.75%)
  gosiEmployerRate: number; // e.g. 0.1175 (11.75%)
  maxContributoryCap: number; // e.g. 45000 SAR
  description: string;
}

export const PAYROLL_SYSTEMS: PresetPayrollSystem[] = [
  {
    id: "saudi_national",
    name: "المملكة العربية السعودية - موظف سعودي (تأمينات GOSI + ساند) 🇸🇦",
    currency: "ريال",
    gosiEmployeeRate: 0.0975, // 9% فرع المعاشات + 0.75% ساند = 9.75%
    gosiEmployerRate: 0.1175, // 9% فرع المعاشات + 2% أخطار + 0.75% ساند = 11.75%
    maxContributoryCap: 45000,
    description: "نسبة خصم التأمينات الاجتماعية 9.75% على (الراتب الأساسي + بدل السكن) بحد أقصى 45,000 ريال، وتحمل أصحاب الأعمال 11.75%."
  },
  {
    id: "saudi_expat",
    name: "المملكة العربية السعودية - موظف غير سعودي (أخطار مهنية) 🇸🇦",
    currency: "ريال",
    gosiEmployeeRate: 0.0, // لا يخصم من الموظف المقيم
    gosiEmployerRate: 0.02, // 2% أخطار مهنية يتحملها صاحب العمل
    maxContributoryCap: 45000,
    description: "لا يتحمل الموظف المقيم أي استقطاع للتأمينات، بينما يلتزم صاحب العمل بدفع 2% فرع الأخطار المهنية."
  },
  {
    id: "egypt_payroll",
    name: "جمهورية مصر العربية - التأمينات الاجتماعية (11% موظف / 18.75% صاحب عمل) 🇪🇬",
    currency: "جنيه",
    gosiEmployeeRate: 0.11,
    gosiEmployerRate: 0.1875,
    maxContributoryCap: 12600,
    description: "استقطاع تأميني بنسبة 11% من أجر الاشتراك للموظف و18.75% يتحملها صاحب العمل طبقاً لقانون التأمينات المصري."
  },
  {
    id: "uae_payroll",
    name: "الإمارات العربية المتحدة - التقاعد للمواطنين (5% موظف / 15% صاحب عمل) 🇦🇪",
    currency: "درهم",
    gosiEmployeeRate: 0.05,
    gosiEmployerRate: 0.15,
    maxContributoryCap: 50000,
    description: "خصم تقاعد 5% على أجر حساب الاشتراكات لمواطني دولة الإمارات، ومساهمة جهة العمل 15%."
  },
  {
    id: "jordan_payroll",
    name: "المملكة الأردنية الهاشمية - الضمان الاجتماعي (7.5% موظف / 14.25% صاحب عمل) 🇯🇴",
    currency: "دينار",
    gosiEmployeeRate: 0.075,
    gosiEmployerRate: 0.1425,
    maxContributoryCap: 3500,
    description: "استقطاع الضمان الاجتماعي بنسبة 7.5% للموظف و14.25% يتحملها المنشأة."
  }
];

export function PayrollSimulator() {
  // Preset System Selection
  const [selectedSystemId, setSelectedSystemId] = useState<string>("saudi_national");
  const currentSystem = useMemo(
    () => PAYROLL_SYSTEMS.find((s) => s.id === selectedSystemId) || PAYROLL_SYSTEMS[0],
    [selectedSystemId]
  );

  // Core Payroll Inputs
  const [basicSalary, setBasicSalary] = useState<number>(10000);
  const [housingAllowance, setHousingAllowance] = useState<number>(2500);
  const [transportAllowance, setTransportAllowance] = useState<number>(1000);
  const [mobileAllowance, setMobileAllowance] = useState<number>(500);
  const [otherAllowances, setOtherAllowances] = useState<number>(1000);

  // Deductions Inputs
  const [medicalInsuranceDeduction, setMedicalInsuranceDeduction] = useState<number>(0);
  const [loanDeduction, setLoanDeduction] = useState<number>(500);
  const [latenessDeduction, setLatenessDeduction] = useState<number>(0);

  // Custom Items
  const [customAllowancesList, setCustomAllowancesList] = useState<CustomAllowance[]>([]);
  const [customDeductionsList, setCustomDeductionsList] = useState<CustomDeduction[]>([]);

  // New Custom Item Inputs
  const [newAllowName, setNewAllowName] = useState<string>("");
  const [newAllowVal, setNewAllowVal] = useState<number>(300);
  const [newDeductName, setNewDeductName] = useState<string>("");
  const [newDeductVal, setNewDeductVal] = useState<number>(200);

  // Reset
  const handleReset = () => {
    setBasicSalary(10000);
    setHousingAllowance(2500);
    setTransportAllowance(1000);
    setMobileAllowance(500);
    setOtherAllowances(1000);
    setMedicalInsuranceDeduction(0);
    setLoanDeduction(500);
    setLatenessDeduction(0);
    setCustomAllowancesList([]);
    setCustomDeductionsList([]);
  };

  // Add Custom Allowance
  const handleAddAllowance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllowName.trim() || newAllowVal <= 0) return;
    setCustomAllowancesList([
      ...customAllowancesList,
      { id: "al_" + Date.now(), name: newAllowName.trim(), amount: newAllowVal }
    ]);
    setNewAllowName("");
    setNewAllowVal(300);
  };

  // Add Custom Deduction
  const handleAddDeduction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeductName.trim() || newDeductVal <= 0) return;
    setCustomDeductionsList([
      ...customDeductionsList,
      { id: "de_" + Date.now(), name: newDeductName.trim(), amount: newDeductVal }
    ]);
    setNewDeductName("");
    setNewDeductVal(200);
  };

  // Calculations Engine
  const calculations = useMemo(() => {
    const safeBasic = Math.max(0, basicSalary);
    const safeHousing = Math.max(0, housingAllowance);
    const safeTransport = Math.max(0, transportAllowance);
    const safeMobile = Math.max(0, mobileAllowance);
    const safeOtherAll = Math.max(0, otherAllowances);

    const customAllowSum = customAllowancesList.reduce((s, a) => s + a.amount, 0);
    const totalAllowances = safeHousing + safeTransport + safeMobile + safeOtherAll + customAllowSum;
    const grossSalary = safeBasic + totalAllowances;

    // GOSI Contributory Wage (Basic + Housing Allowance) subject to system max cap
    const rawContributoryWage = safeBasic + safeHousing;
    const contributoryWage = Math.min(rawContributoryWage, currentSystem.maxContributoryCap);

    // GOSI Employee Deduction
    const gosiEmployeeAmount = contributoryWage * currentSystem.gosiEmployeeRate;

    // GOSI Employer Contribution (paid on top by company)
    const gosiEmployerAmount = contributoryWage * currentSystem.gosiEmployerRate;

    // Direct Employee Deductions
    const safeMedical = Math.max(0, medicalInsuranceDeduction);
    const safeLoan = Math.max(0, loanDeduction);
    const safeLate = Math.max(0, latenessDeduction);
    const customDeductSum = customDeductionsList.reduce((s, d) => s + d.amount, 0);

    const totalDeductions = Math.round(gosiEmployeeAmount + safeMedical + safeLoan + safeLate + customDeductSum);

    // Net Salary
    const netSalary = Math.max(0, Math.round(grossSalary - totalDeductions));

    // Percentages
    const gosiDeductionPct = grossSalary > 0 ? (gosiEmployeeAmount / grossSalary) * 100 : 0;
    const netSalaryPct = grossSalary > 0 ? (netSalary / grossSalary) * 100 : 0;
    const totalDeductionsPct = grossSalary > 0 ? (totalDeductions / grossSalary) * 100 : 0;

    // Total Cost to Company (CTC) = Gross Salary + Employer GOSI Contribution
    const totalCostToEmployer = Math.round(grossSalary + gosiEmployerAmount);

    return {
      safeBasic,
      safeHousing,
      safeTransport,
      safeMobile,
      safeOtherAll,
      customAllowSum,
      totalAllowances,
      grossSalary,
      rawContributoryWage,
      contributoryWage,
      gosiEmployeeAmount: Math.round(gosiEmployeeAmount),
      gosiEmployerAmount: Math.round(gosiEmployerAmount),
      safeMedical,
      safeLoan,
      safeLate,
      customDeductSum,
      totalDeductions,
      netSalary,
      gosiDeductionPct,
      netSalaryPct,
      totalDeductionsPct,
      totalCostToEmployer
    };
  }, [
    basicSalary,
    housingAllowance,
    transportAllowance,
    mobileAllowance,
    otherAllowances,
    medicalInsuranceDeduction,
    loanDeduction,
    latenessDeduction,
    customAllowancesList,
    customDeductionsList,
    currentSystem
  ]);

  return (
    <div className="space-y-8 font-sans">
      
      {/* HEADER SECTION */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0a1128] via-[#121a3a] to-[#0a1128] border border-indigo-500/30 shadow-2xl space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>أداة المحاسبة المالية وإدارة الموارد البشرية (Interactive Payroll Simulator)</span>
            </span>
            <h3 className="text-2xl font-black text-white">
              محاكي مسير كشوف الرواتب وصافي الأجر الشهري 💵🏢
            </h3>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              احسب صافي الراتب النهائي بعد الاستقطاعات وإجمالي الأجر الشامل (Gross Salary) وتكلفة التوظيف الكلية على المنشأة (Cost to Company - CTC) بناءً على قوانين التأمينات الاجتماعية والتكليف المالي.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border border-white/10"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>إعادة الضبط</span>
          </button>
        </div>

        {/* PAYROLL SYSTEM SELECTOR */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-300 block flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            <span>اختر نظام كشف الرواتب والشرائح التأمينية:</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PAYROLL_SYSTEMS.map((sys) => (
              <button
                key={sys.id}
                onClick={() => setSelectedSystemId(sys.id)}
                className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer group ${
                  selectedSystemId === sys.id
                    ? "bg-indigo-600/25 border-indigo-400 ring-2 ring-indigo-400/30 shadow-lg"
                    : "bg-black/40 border-white/10 hover:border-indigo-500/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-white group-hover:text-indigo-300">
                    {sys.name}
                  </span>
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                    {sys.currency}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">
                  {sys.description}
                </p>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* TOP METRIC SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        {/* Gross Salary */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 space-y-1">
          <span className="text-[10px] font-bold text-indigo-300 uppercase block">إجمالي الراتب الشامل (Gross)</span>
          <div className="text-2xl font-black text-white font-mono">
            {calculations.grossSalary.toLocaleString()} {currentSystem.currency}
          </div>
          <span className="text-[10px] text-slate-400 block">
            أساسي + {calculations.totalAllowances.toLocaleString()} بدلات
          </span>
        </div>

        {/* Total Deductions */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/60 to-slate-900 border border-rose-500/30 space-y-1">
          <span className="text-[10px] font-bold text-rose-300 uppercase block">إجمالي الاستقطاعات والمستقطعات</span>
          <div className="text-2xl font-black text-white font-mono">
            -{calculations.totalDeductions.toLocaleString()} {currentSystem.currency}
          </div>
          <span className="text-[10px] text-slate-400 block">
            نسبة الاستقطاع: <strong className="text-rose-400">{calculations.totalDeductionsPct.toFixed(1)}%</strong>
          </span>
        </div>

        {/* Net Salary */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 space-y-1">
          <span className="text-[10px] font-bold text-emerald-300 uppercase block">صافي الراتب للتحويل البنكي (Net)</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {calculations.netSalary.toLocaleString()} {currentSystem.currency}
          </div>
          <span className="text-[10px] text-slate-400 block">
            يمثل <strong className="text-emerald-300">{calculations.netSalaryPct.toFixed(1)}%</strong> من الراتب الشامل
          </span>
        </div>

        {/* Employer Total Cost (CTC) */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/30 space-y-1">
          <span className="text-[10px] font-bold text-purple-300 uppercase block">التكلفة الكلية على الشركة (CTC)</span>
          <div className="text-2xl font-black text-white font-mono">
            {calculations.totalCostToEmployer.toLocaleString()} {currentSystem.currency}
          </div>
          <span className="text-[10px] text-slate-400 block">
            يتضمن {calculations.gosiEmployerAmount.toLocaleString()} حصة التأمينات
          </span>
        </div>

      </div>

      {/* INPUT FORM & BREAKDOWN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: SALARY & ALLOWANCES INPUTS */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="p-6 rounded-3xl bg-[#0b1022] border-2 border-indigo-500/30 shadow-xl space-y-5">
            <div className="border-b border-white/10 pb-3 flex items-center justify-between">
              <h4 className="font-black text-indigo-300 text-sm sm:text-base flex items-center gap-2">
                <Calculator className="w-5 h-5 text-indigo-400" />
                <span>الراتب الأساسي والبدلات الشهرية</span>
              </h4>
              <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-xl">
                العملة: {currentSystem.currency}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Basic Salary */}
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block flex items-center justify-between">
                  <span>الراتب الأساسي (Basic Salary):</span>
                  <span className="text-indigo-400 font-mono font-black">{basicSalary.toLocaleString()} {currentSystem.currency}</span>
                </label>
                <input
                  type="number"
                  step={500}
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              {/* Housing Allowance */}
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block flex items-center justify-between">
                  <span>بدل السكن (Housing Allowance):</span>
                  <span className="text-indigo-400 font-mono font-black">{housingAllowance.toLocaleString()} {currentSystem.currency}</span>
                </label>
                <input
                  type="number"
                  step={250}
                  value={housingAllowance}
                  onChange={(e) => setHousingAllowance(Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-400"
                />
                <span className="text-[10px] text-amber-300 block">
                  * يدخل في وعاء اشتراك التأمينات الاجتماعية GOSI مع الراتب الأساسي.
                </span>
              </div>

              {/* Transport Allowance */}
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">
                  بدل النقل والمواصلات (Transportation Allowance):
                </label>
                <input
                  type="number"
                  step={100}
                  value={transportAllowance}
                  onChange={(e) => setTransportAllowance(Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              {/* Mobile Allowance */}
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">
                  بدل الهاتف والاتصالات:
                </label>
                <input
                  type="number"
                  step={100}
                  value={mobileAllowance}
                  onChange={(e) => setMobileAllowance(Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              {/* Other Fixed Allowances */}
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">
                  بدلات ثابتة أخرى (طبيعة عمل / حوافز):
                </label>
                <input
                  type="number"
                  step={100}
                  value={otherAllowances}
                  onChange={(e) => setOtherAllowances(Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              {/* ADD CUSTOM ALLOWANCE FORM */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <span className="font-bold text-emerald-300 block">إضافة بدل إضافي خاص:</span>
                <form onSubmit={handleAddAllowance} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="اسم البدل (مثال: بدل سفر)"
                    value={newAllowName}
                    onChange={(e) => setNewAllowName(e.target.value)}
                    className="flex-1 bg-black/50 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="المبلغ"
                    value={newAllowVal}
                    onChange={(e) => setNewAllowVal(Number(e.target.value))}
                    className="w-24 bg-black/50 border border-white/15 rounded-xl px-2 py-1.5 text-xs font-mono text-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة</span>
                  </button>
                </form>

                {/* Custom allowances list */}
                {customAllowancesList.length > 0 && (
                  <div className="space-y-1 pt-1">
                    {customAllowancesList.map((al) => (
                      <div key={al.id} className="p-2 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-bold">{al.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-emerald-400 font-bold">+{al.amount} {currentSystem.currency}</span>
                          <button
                            onClick={() => setCustomAllowancesList(customAllowancesList.filter((a) => a.id !== al.id))}
                            className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: DEDUCTIONS & SLIP DETAILS */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="p-6 rounded-3xl bg-[#0b1022] border-2 border-rose-500/30 shadow-xl space-y-5">
            <div className="border-b border-white/10 pb-3 flex items-center justify-between">
              <h4 className="font-black text-rose-300 text-sm sm:text-base flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-rose-400" />
                <span>الاستقطاعات والخصومات من الراتب</span>
              </h4>
              <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/20 px-2.5 py-1 rounded-xl">
                المجموع: -{calculations.totalDeductions.toLocaleString()} {currentSystem.currency}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Calculated GOSI Employee Deduction */}
              <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-black text-rose-300">
                    1. استقطاع التأمينات / الضمان الاجتماعي (GOSI):
                  </span>
                  <span className="text-sm font-black font-mono text-rose-400">
                    -{calculations.gosiEmployeeAmount.toLocaleString()} {currentSystem.currency}
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 leading-snug">
                  محسوب بنسبة <strong className="text-amber-300">{(currentSystem.gosiEmployeeRate * 100).toFixed(2)}%</strong> على وعاء الاشتراك ({calculations.contributoryWage.toLocaleString()} {currentSystem.currency}).
                </p>
              </div>

              {/* Loan / Advance Deduction */}
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">
                  2. أقساط السلف الشخصية والقروض من الشركة:
                </label>
                <input
                  type="number"
                  step={100}
                  value={loanDeduction}
                  onChange={(e) => setLoanDeduction(Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-rose-400"
                />
              </div>

              {/* Lateness / Absences */}
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">
                  3. خصم التأخيرات والغياب الجزئي:
                </label>
                <input
                  type="number"
                  step={50}
                  value={latenessDeduction}
                  onChange={(e) => setLatenessDeduction(Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-rose-400"
                />
              </div>

              {/* Medical Insurance Share */}
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">
                  4. مساهمة الموظف في التأمين الطبي (إن وجد):
                </label>
                <input
                  type="number"
                  step={50}
                  value={medicalInsuranceDeduction}
                  onChange={(e) => setMedicalInsuranceDeduction(Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-rose-400"
                />
              </div>

              {/* ADD CUSTOM DEDUCTION FORM */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <span className="font-bold text-rose-300 block">إضافة خصم خاص آخر:</span>
                <form onSubmit={handleAddDeduction} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="سبب الخصم (مثال: جزاءات)"
                    value={newDeductName}
                    onChange={(e) => setNewDeductName(e.target.value)}
                    className="flex-1 bg-black/50 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="المبلغ"
                    value={newDeductVal}
                    onChange={(e) => setNewDeductVal(Number(e.target.value))}
                    className="w-24 bg-black/50 border border-white/15 rounded-xl px-2 py-1.5 text-xs font-mono text-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة</span>
                  </button>
                </form>

                {/* Custom deductions list */}
                {customDeductionsList.length > 0 && (
                  <div className="space-y-1 pt-1">
                    {customDeductionsList.map((de) => (
                      <div key={de.id} className="p-2 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-bold">{de.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-rose-400 font-bold">-{de.amount} {currentSystem.currency}</span>
                          <button
                            onClick={() => setCustomDeductionsList(customDeductionsList.filter((d) => d.id !== de.id))}
                            className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* SAMPLE PAYSLIP PRINTABLE CARD */}
      <div className="p-6 rounded-3xl bg-[#090e1e] border border-white/10 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="space-y-1">
            <h4 className="font-black text-white text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span>نموذج قسيمة الراتب النموذجية الرسمية (Salary Payslip Preview)</span>
            </h4>
            <p className="text-xs text-slate-400">
              معاينة كشف الراتب النهائي الجاهز للتحويل البنكي أو الاعتماد من الموارد البشرية
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-xl border border-emerald-500/30">
            حالة الكشف: متوازن معتمد ✅
          </span>
        </div>

        {/* PAYSLIP TABLE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-2xl bg-black/50 border border-white/10 font-mono text-xs">
          
          {/* EARNINGS SIDE */}
          <div className="space-y-2">
            <span className="font-sans font-black text-emerald-400 block border-b border-white/10 pb-1">
              🟢 الاستحقاقات والأجور (Earnings):
            </span>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="font-sans text-slate-300">الراتب الأساسي:</span>
              <span className="text-white font-bold">{calculations.safeBasic.toLocaleString()} {currentSystem.currency}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="font-sans text-slate-300">بدل السكن:</span>
              <span className="text-white">{calculations.safeHousing.toLocaleString()} {currentSystem.currency}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="font-sans text-slate-300">بدل المواصلات والنقل:</span>
              <span className="text-white">{calculations.safeTransport.toLocaleString()} {currentSystem.currency}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="font-sans text-slate-300">بدل الاتصالات:</span>
              <span className="text-white">{calculations.safeMobile.toLocaleString()} {currentSystem.currency}</span>
            </div>
            {calculations.safeOtherAll > 0 && (
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="font-sans text-slate-300">بدلات أخرى:</span>
                <span className="text-white">{calculations.safeOtherAll.toLocaleString()} {currentSystem.currency}</span>
              </div>
            )}
            {calculations.customAllowSum > 0 && (
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="font-sans text-slate-300">بدلات إضافية مخصصة:</span>
                <span className="text-white">{calculations.customAllowSum.toLocaleString()} {currentSystem.currency}</span>
              </div>
            )}
            <div className="flex justify-between py-2 text-sm font-black border-t border-emerald-500/30 text-emerald-300 font-sans">
              <span>إجمالي الأجر الشامل (Gross):</span>
              <span>{calculations.grossSalary.toLocaleString()} {currentSystem.currency}</span>
            </div>
          </div>

          {/* DEDUCTIONS SIDE */}
          <div className="space-y-2">
            <span className="font-sans font-black text-rose-400 block border-b border-white/10 pb-1">
              🔴 الاستقطاعات والخصوم (Deductions):
            </span>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="font-sans text-slate-300">حصـة التأمينات الاجتماعية GOSI:</span>
              <span className="text-rose-400 font-bold">-{calculations.gosiEmployeeAmount.toLocaleString()} {currentSystem.currency}</span>
            </div>
            {calculations.safeLoan > 0 && (
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="font-sans text-slate-300">قسط السلفة / القروض:</span>
                <span className="text-rose-400">-{calculations.safeLoan.toLocaleString()} {currentSystem.currency}</span>
              </div>
            )}
            {calculations.safeLate > 0 && (
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="font-sans text-slate-300">خصم التأخيرات والغياب:</span>
                <span className="text-rose-400">-{calculations.safeLate.toLocaleString()} {currentSystem.currency}</span>
              </div>
            )}
            {calculations.customDeductSum > 0 && (
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="font-sans text-slate-300">خصومات أخرى مخصصة:</span>
                <span className="text-rose-400">-{calculations.customDeductSum.toLocaleString()} {currentSystem.currency}</span>
              </div>
            )}
            <div className="flex justify-between py-2 text-sm font-black border-t border-rose-500/30 text-rose-300 font-sans">
              <span>إجمالي الخصومات:</span>
              <span>-{calculations.totalDeductions.toLocaleString()} {currentSystem.currency}</span>
            </div>
          </div>

        </div>

        {/* FINAL NET BANNER */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-emerald-950/80 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-emerald-300 block">صافي المبلغ القابل للتحويل في نظام حماية الأجور (WPS):</span>
            <span className="text-2xl font-black font-mono text-emerald-400">
              {calculations.netSalary.toLocaleString()} {currentSystem.currency}
            </span>
          </div>

          <div className="text-[11px] text-slate-300 font-bold bg-black/40 px-3 py-2 rounded-xl border border-white/10">
            💡 حصـة صاحب العمل في التأمينات (تدفعها المنشأة للشركة): <strong className="text-amber-300">{calculations.gosiEmployerAmount.toLocaleString()} {currentSystem.currency}</strong>
          </div>
        </div>

      </div>

    </div>
  );
}
