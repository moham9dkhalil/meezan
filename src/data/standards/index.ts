import { StandardsFamily, AccountingStandard } from "./types";
import { FRAMEWORK_STANDARDS } from "./framework";
import { IFRS_STANDARDS } from "./ifrs";
import { IAS_STANDARDS } from "./ias";
import { INTERPRETATION_STANDARDS } from "./interpretations";
import { EAS_STANDARDS } from "./eas";
import { USGAAP_STANDARDS } from "./usgaap";

export * from "./types";
export { FRAMEWORK_STANDARDS, IFRS_STANDARDS, IAS_STANDARDS, INTERPRETATION_STANDARDS, EAS_STANDARDS, USGAAP_STANDARDS };

export const STANDARDS_FAMILIES: StandardsFamily[] = [
  {
    id: "ifrs",
    labelAr: "المعايير الدولية للتقارير المالية",
    labelEn: "IFRS Standards",
    icon: "🌍",
    color: "indigo",
    introAr:
      "المعايير الدولية لإعداد التقارير المالية (IFRS 1 - 18) الصادرة عن مجلس معايير المحاسبة الدولية IASB: وهي المعايير المعتمدة عالمياً في معظم الأسواق المالية.",
    introEn: "International Financial Reporting Standards issued by the IASB.",
    standards: IFRS_STANDARDS,
  },
  {
    id: "ias",
    labelAr: "المعايير المحاسبية الدولية",
    labelEn: "IAS Standards",
    icon: "📘",
    color: "purple",
    introAr:
      "المعايير المحاسبية الدولية (IAS 1 - 41) التي أصدرتها اللجنة الدولية السابقة وأقرّها IASB، وما زالت سارية بجانب IFRS.",
    introEn: "International Accounting Standards issued by IASC and endorsed by IASB.",
    standards: IAS_STANDARDS,
  },
  {
    id: "framework",
    labelAr: "الإطار المفاهيمي",
    labelEn: "Conceptual Framework",
    icon: "⚖️",
    color: "amber",
    introAr: "الإطار المفاهيمي لإعداد التقارير المالية: دستور القوائم المالية ومرجع اختيار السياسات عند غياب المعايير.",
    introEn: "The Conceptual Framework for Financial Reporting.",
    standards: FRAMEWORK_STANDARDS,
  },
  {
    id: "ifric",
    labelAr: "التفسيرات الدولية (IFRIC و SIC)",
    labelEn: "Interpretations (IFRIC & SIC)",
    icon: "🧩",
    color: "cyan",
    introAr:
      "التفسيرات الصادرة عن لجنة تفسيرات المعايير الدولية IFRIC والتفسيرات السابقة SIC: توضح تطبيق المعايير في حالات محددة.",
    introEn: "IFRIC and SIC interpretations clarifying standards in specific circumstances.",
    standards: INTERPRETATION_STANDARDS,
  },
  {
    id: "eas",
    labelAr: "المعايير المحاسبية المصرية",
    labelEn: "Egyptian Accounting Standards (EAS)",
    icon: "🇪🇬",
    color: "emerald",
    introAr:
      "المعايير المحاسبية المصرية المعتمدة من وزارة المالية والهيئة العامة للرقابة المالية، المتوافقة جوهرياً مع المعايير الدولية بعد تحديث 2015.",
    introEn: "Egyptian Accounting Standards aligned with IFRS after the 2015 revision.",
    standards: EAS_STANDARDS,
  },
  {
    id: "gaap",
    labelAr: "مبادئ GAAP الأمريكية",
    labelEn: "US GAAP",
    icon: "🇺🇸",
    color: "rose",
    introAr: "مبادئ المحاسبة المقبولة عموماً في الولايات المتحدة وفق تدوين FASB (ASC)، والاختلافات الجوهرية عن IFRS.",
    introEn: "Generally Accepted Accounting Principles in the US (FASB ASC).",
    standards: USGAAP_STANDARDS,
  },
];

export const ALL_STANDARDS: AccountingStandard[] = STANDARDS_FAMILIES.flatMap((f) => f.standards);

export const TOTAL_STANDARDS = ALL_STANDARDS.length;
